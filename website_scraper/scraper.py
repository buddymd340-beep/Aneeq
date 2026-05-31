"""Crawler orchestration for website scraping."""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from time import sleep
from typing import Deque
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .database import ScraperDatabase
from .models import HtmlExtract, PageResult
from .parser import extract_html
from .urls import is_http_url, normalize_url, same_host


DEFAULT_USER_AGENT = "AneeqWebsiteScraper/0.1 (+https://github.com/)"


@dataclass(frozen=True)
class CrawlOptions:
    """Crawler limits and HTTP options."""

    max_pages: int = 100
    max_depth: int = 2
    same_domain: bool = True
    timeout: float = 10.0
    delay: float = 0.0
    user_agent: str = DEFAULT_USER_AGENT


@dataclass(frozen=True)
class CrawlResult:
    """Summary of a completed crawl run."""

    run_id: int
    pages: int
    links: int
    assets: int
    meta_tags: int


class WebsiteScraper:
    """Crawl a site and persist the result to SQLite."""

    def __init__(self, database_path: str, options: CrawlOptions | None = None) -> None:
        self.database_path = database_path
        self.options = options or CrawlOptions()

    def crawl(self, start_url: str) -> CrawlResult:
        normalized_start_url = normalize_url(start_url)
        if not normalized_start_url or not is_http_url(normalized_start_url):
            raise ValueError(f"Start URL must be an HTTP or HTTPS URL: {start_url}")
        self._validate_options()

        with ScraperDatabase(self.database_path) as database:
            database.initialize()
            run_id = database.create_run(
                start_url=start_url,
                normalized_start_url=normalized_start_url,
                max_pages=self.options.max_pages,
                max_depth=self.options.max_depth,
                same_domain=self.options.same_domain,
                user_agent=self.options.user_agent,
            )

            status = "completed"
            error = ""
            try:
                self._crawl_run(database, run_id, normalized_start_url)
            except Exception as exc:
                status = "failed"
                error = str(exc)
                raise
            finally:
                database.finish_run(run_id, status=status, error=error)

            summary = database.summary(run_id)
            return CrawlResult(run_id=run_id, **summary)

    def _crawl_run(self, database: ScraperDatabase, run_id: int, start_url: str) -> None:
        queue: Deque[tuple[str, int]] = deque([(start_url, 0)])
        scheduled = {start_url}
        visited: set[str] = set()

        while queue and len(visited) < self.options.max_pages:
            url, depth = queue.popleft()
            if url in visited:
                continue

            page = self._fetch(url, depth)
            visited.add(url)
            database.save_page(run_id, page, lambda link_url: same_host(link_url, start_url))

            if page.error or depth >= self.options.max_depth:
                self._sleep_between_requests(queue)
                continue

            for link in page.extract.links:
                next_url = normalize_url(link.url)
                if not self._should_visit(next_url, start_url, scheduled):
                    continue
                scheduled.add(next_url)
                queue.append((next_url, depth + 1))

            self._sleep_between_requests(queue)

    def _fetch(self, url: str, depth: int) -> PageResult:
        request = Request(url, headers={"User-Agent": self.options.user_agent})
        try:
            with urlopen(request, timeout=self.options.timeout) as response:
                status_code = getattr(response, "status", None)
                final_url = normalize_url(response.geturl())
                content_type = response.headers.get("Content-Type", "")
                charset = response.headers.get_content_charset() or "utf-8"
                body = response.read()
                html = body.decode(charset, errors="replace")
        except HTTPError as exc:
            content_type = exc.headers.get("Content-Type", "") if exc.headers else ""
            charset = exc.headers.get_content_charset() if exc.headers else None
            body = exc.read()
            html = body.decode(charset or "utf-8", errors="replace")
            extract = extract_html(html, url) if _is_html(content_type, html) else HtmlExtract()
            return PageResult(
                url=url,
                final_url=normalize_url(exc.geturl()) or url,
                depth=depth,
                status_code=exc.code,
                content_type=content_type,
                html=html,
                extract=extract,
                error=f"HTTP {exc.code}: {exc.reason}",
            )
        except URLError as exc:
            return PageResult(
                url=url,
                final_url=url,
                depth=depth,
                status_code=None,
                content_type="",
                html="",
                extract=HtmlExtract(),
                error=str(exc.reason),
            )

        extract = extract_html(html, final_url or url) if _is_html(content_type, html) else HtmlExtract()
        return PageResult(
            url=url,
            final_url=final_url or url,
            depth=depth,
            status_code=status_code,
            content_type=content_type,
            html=html,
            extract=extract,
        )

    def _should_visit(self, url: str, start_url: str, scheduled: set[str]) -> bool:
        if not url or url in scheduled or not is_http_url(url):
            return False
        if self.options.same_domain and not same_host(url, start_url):
            return False
        return True

    def _sleep_between_requests(self, queue: Deque[tuple[str, int]]) -> None:
        if queue and self.options.delay > 0:
            sleep(self.options.delay)

    def _validate_options(self) -> None:
        if self.options.max_pages < 1:
            raise ValueError("max_pages must be at least 1")
        if self.options.max_depth < 0:
            raise ValueError("max_depth must be at least 0")
        if self.options.timeout <= 0:
            raise ValueError("timeout must be greater than 0")
        if self.options.delay < 0:
            raise ValueError("delay must be 0 or greater")


def _is_html(content_type: str, body: str) -> bool:
    return "html" in content_type.lower() or "<html" in body[:500].lower()
