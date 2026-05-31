"""SQLite persistence for crawled websites."""

from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Any

from .models import PageResult


class ScraperDatabase:
    """Store crawl runs, pages, links, assets, and metadata in SQLite."""

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        if self.path.parent and str(self.path.parent) != ".":
            self.path.parent.mkdir(parents=True, exist_ok=True)
        self.connection = sqlite3.connect(self.path)
        self.connection.row_factory = sqlite3.Row
        self.connection.execute("PRAGMA foreign_keys = ON")

    def close(self) -> None:
        self.connection.close()

    def __enter__(self) -> "ScraperDatabase":
        return self

    def __exit__(self, *_: object) -> None:
        self.close()

    def initialize(self) -> None:
        """Create all tables and indexes if they do not exist."""

        self.connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS crawl_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                start_url TEXT NOT NULL,
                normalized_start_url TEXT NOT NULL,
                started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                finished_at TEXT,
                status TEXT NOT NULL DEFAULT 'running',
                error TEXT NOT NULL DEFAULT '',
                max_pages INTEGER NOT NULL,
                max_depth INTEGER NOT NULL,
                same_domain INTEGER NOT NULL,
                user_agent TEXT NOT NULL,
                pages_seen INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                run_id INTEGER NOT NULL,
                url TEXT NOT NULL,
                final_url TEXT NOT NULL,
                depth INTEGER NOT NULL,
                status_code INTEGER,
                content_type TEXT NOT NULL DEFAULT '',
                title TEXT NOT NULL DEFAULT '',
                description TEXT NOT NULL DEFAULT '',
                canonical_url TEXT NOT NULL DEFAULT '',
                html TEXT NOT NULL DEFAULT '',
                text TEXT NOT NULL DEFAULT '',
                fetched_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                error TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (run_id) REFERENCES crawl_runs(id) ON DELETE CASCADE,
                UNIQUE (run_id, url)
            );

            CREATE TABLE IF NOT EXISTS links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id INTEGER NOT NULL,
                url TEXT NOT NULL,
                text TEXT NOT NULL DEFAULT '',
                rel TEXT NOT NULL DEFAULT '',
                is_internal INTEGER NOT NULL,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
                UNIQUE (page_id, url, text, rel)
            );

            CREATE TABLE IF NOT EXISTS assets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id INTEGER NOT NULL,
                url TEXT NOT NULL,
                asset_type TEXT NOT NULL,
                alt_text TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
                UNIQUE (page_id, url, asset_type)
            );

            CREATE TABLE IF NOT EXISTS meta_tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id INTEGER NOT NULL,
                attribute TEXT NOT NULL,
                key TEXT NOT NULL,
                value TEXT NOT NULL,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
                UNIQUE (page_id, attribute, key, value)
            );

            CREATE INDEX IF NOT EXISTS idx_pages_run_id ON pages(run_id);
            CREATE INDEX IF NOT EXISTS idx_pages_url ON pages(url);
            CREATE INDEX IF NOT EXISTS idx_links_page_id ON links(page_id);
            CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);
            CREATE INDEX IF NOT EXISTS idx_assets_page_id ON assets(page_id);
            CREATE INDEX IF NOT EXISTS idx_meta_tags_page_id ON meta_tags(page_id);
            """
        )
        self.connection.commit()

    def create_run(
        self,
        *,
        start_url: str,
        normalized_start_url: str,
        max_pages: int,
        max_depth: int,
        same_domain: bool,
        user_agent: str,
    ) -> int:
        cursor = self.connection.execute(
            """
            INSERT INTO crawl_runs (
                start_url, normalized_start_url, max_pages, max_depth,
                same_domain, user_agent
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                start_url,
                normalized_start_url,
                max_pages,
                max_depth,
                int(same_domain),
                user_agent,
            ),
        )
        self.connection.commit()
        return int(cursor.lastrowid)

    def finish_run(self, run_id: int, *, status: str, error: str = "") -> None:
        self.connection.execute(
            """
            UPDATE crawl_runs
            SET status = ?, error = ?, finished_at = CURRENT_TIMESTAMP,
                pages_seen = (SELECT COUNT(*) FROM pages WHERE run_id = ?)
            WHERE id = ?
            """,
            (status, error, run_id, run_id),
        )
        self.connection.commit()

    def save_page(self, run_id: int, page: PageResult, is_internal_url: Any) -> int:
        """Persist one page and its extracted child records."""

        with self.connection:
            cursor = self.connection.execute(
                """
                INSERT INTO pages (
                    run_id, url, final_url, depth, status_code, content_type,
                    title, description, canonical_url, html, text, error
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(run_id, url) DO UPDATE SET
                    final_url = excluded.final_url,
                    depth = excluded.depth,
                    status_code = excluded.status_code,
                    content_type = excluded.content_type,
                    title = excluded.title,
                    description = excluded.description,
                    canonical_url = excluded.canonical_url,
                    html = excluded.html,
                    text = excluded.text,
                    fetched_at = CURRENT_TIMESTAMP,
                    error = excluded.error
                """,
                (
                    run_id,
                    page.url,
                    page.final_url,
                    page.depth,
                    page.status_code,
                    page.content_type,
                    page.extract.title,
                    page.extract.description,
                    page.extract.canonical_url,
                    page.html,
                    page.extract.text,
                    page.error,
                ),
            )
            page_id = self._page_id(run_id, page.url, cursor.lastrowid)

            self.connection.execute("DELETE FROM links WHERE page_id = ?", (page_id,))
            self.connection.execute("DELETE FROM assets WHERE page_id = ?", (page_id,))
            self.connection.execute("DELETE FROM meta_tags WHERE page_id = ?", (page_id,))

            self.connection.executemany(
                """
                INSERT OR IGNORE INTO links (page_id, url, text, rel, is_internal)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    (page_id, link.url, link.text, link.rel, int(is_internal_url(link.url)))
                    for link in page.extract.links
                ),
            )
            self.connection.executemany(
                """
                INSERT OR IGNORE INTO assets (page_id, url, asset_type, alt_text)
                VALUES (?, ?, ?, ?)
                """,
                (
                    (page_id, asset.url, asset.asset_type, asset.alt_text)
                    for asset in page.extract.assets
                ),
            )
            self.connection.executemany(
                """
                INSERT OR IGNORE INTO meta_tags (page_id, attribute, key, value)
                VALUES (?, ?, ?, ?)
                """,
                (
                    (page_id, meta.attribute, meta.key, meta.value)
                    for meta in page.extract.metadata
                ),
            )

        return page_id

    def summary(self, run_id: int) -> dict[str, int]:
        row = self.connection.execute(
            """
            SELECT
                (SELECT COUNT(*) FROM pages WHERE run_id = ?) AS pages,
                (SELECT COUNT(*) FROM links
                 WHERE page_id IN (SELECT id FROM pages WHERE run_id = ?)) AS links,
                (SELECT COUNT(*) FROM assets
                 WHERE page_id IN (SELECT id FROM pages WHERE run_id = ?)) AS assets,
                (SELECT COUNT(*) FROM meta_tags
                 WHERE page_id IN (SELECT id FROM pages WHERE run_id = ?)) AS meta_tags
            """,
            (run_id, run_id, run_id, run_id),
        ).fetchone()
        return {key: int(row[key]) for key in row.keys()}

    def _page_id(self, run_id: int, url: str, lastrowid: int | None) -> int:
        if lastrowid:
            row = self.connection.execute(
                "SELECT id FROM pages WHERE run_id = ? AND url = ?",
                (run_id, url),
            ).fetchone()
        else:
            row = None
        if row is None:
            row = self.connection.execute(
                "SELECT id FROM pages WHERE run_id = ? AND url = ?",
                (run_id, url),
            ).fetchone()
        return int(row["id"])
