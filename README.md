# Aneeq Website Scraper

A small Python website scraper that crawls pages from a starting URL and stores a complete crawl dataset in SQLite.

## What it saves

Each crawl creates a new `crawl_runs` row and stores:

- `pages`: fetched URL, final URL after redirects, depth, status code, content type, title, description, canonical URL, raw HTML, extracted text, and any fetch error.
- `links`: every discovered page link, anchor text, `rel` value, and whether it is on the same host.
- `assets`: images, scripts, stylesheets, iframes, video/audio/source references, and alt text where available.
- `meta_tags`: all discovered meta tags keyed by `name`, `property`, or `http-equiv`.

## Requirements

- Python 3.10+
- No third-party runtime dependencies

## Run

```bash
python -m website_scraper https://example.com --database scraper.db --max-pages 50 --max-depth 2
```

Or install the CLI locally:

```bash
python -m pip install -e .
website-scraper https://example.com --database scraper.db
```

Useful options:

```text
--max-pages 100       Maximum pages to fetch
--max-depth 2         Maximum crawl depth
--allow-external      Follow links to other domains
--timeout 10          HTTP timeout in seconds
--delay 1             Delay between requests in seconds
--user-agent "..."    Custom User-Agent header
```

## Query the database

```bash
sqlite3 scraper.db "SELECT url, title, status_code FROM pages ORDER BY fetched_at DESC;"
sqlite3 scraper.db "SELECT url, text FROM links LIMIT 20;"
sqlite3 scraper.db "SELECT url, asset_type FROM assets LIMIT 20;"
```

## Run tests

```bash
python -m unittest discover -s tests
```
