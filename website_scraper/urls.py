"""URL helpers used by the crawler and parser."""

from __future__ import annotations

from urllib.parse import ParseResult, urldefrag, urljoin, urlparse, urlunparse


def normalize_url(url: str, base_url: str | None = None) -> str:
    """Resolve, defragment, and lightly canonicalize an HTTP URL."""

    resolved = urljoin(base_url, url.strip()) if base_url else url.strip()
    defragmented, _fragment = urldefrag(resolved)
    parsed = urlparse(defragmented)
    if not parsed.scheme:
        parsed = urlparse(f"https://{defragmented}")

    scheme = parsed.scheme.lower()
    hostname = (parsed.hostname or "").lower()
    if not hostname:
        return ""

    netloc = hostname
    if parsed.port and not _is_default_port(scheme, parsed.port):
        netloc = f"{hostname}:{parsed.port}"

    path = parsed.path or "/"
    return urlunparse(
        ParseResult(
            scheme=scheme,
            netloc=netloc,
            path=path,
            params="",
            query=parsed.query,
            fragment="",
        )
    )


def is_http_url(url: str) -> bool:
    return urlparse(url).scheme in {"http", "https"}


def same_host(left: str, right: str) -> bool:
    return (urlparse(left).hostname or "").lower() == (urlparse(right).hostname or "").lower()


def _is_default_port(scheme: str, port: int) -> bool:
    return (scheme == "http" and port == 80) or (scheme == "https" and port == 443)
