"""Command-line interface for the website scraper."""

from __future__ import annotations

import argparse
import sys

from .scraper import CrawlOptions, WebsiteScraper


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="website-scraper",
        description="Crawl a website and save pages, links, assets, and metadata to SQLite.",
    )
    parser.add_argument("url", help="HTTP or HTTPS URL to start crawling from.")
    parser.add_argument(
        "-d",
        "--database",
        default="scraper.db",
        help="SQLite database path. Defaults to scraper.db.",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=100,
        help="Maximum number of pages to fetch. Defaults to 100.",
    )
    parser.add_argument(
        "--max-depth",
        type=int,
        default=2,
        help="Maximum link depth from the start URL. Defaults to 2.",
    )
    parser.add_argument(
        "--allow-external",
        action="store_true",
        help="Allow crawling links on other domains.",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=10.0,
        help="HTTP timeout in seconds. Defaults to 10.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.0,
        help="Delay between requests in seconds. Defaults to 0.",
    )
    parser.add_argument(
        "--user-agent",
        default=None,
        help="Custom User-Agent header.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    defaults = CrawlOptions()
    options = CrawlOptions(
        max_pages=args.max_pages,
        max_depth=args.max_depth,
        same_domain=not args.allow_external,
        timeout=args.timeout,
        delay=args.delay,
        user_agent=args.user_agent or defaults.user_agent,
    )

    scraper = WebsiteScraper(args.database, options)
    try:
        result = scraper.crawl(args.url)
    except Exception as exc:
        print(f"Scrape failed: {exc}", file=sys.stderr)
        return 1

    print(f"Crawl run #{result.run_id} saved to {args.database}")
    print(f"Pages: {result.pages}")
    print(f"Links: {result.links}")
    print(f"Assets: {result.assets}")
    print(f"Meta tags: {result.meta_tags}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
