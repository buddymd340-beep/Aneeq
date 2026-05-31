import sqlite3
import tempfile
import unittest
from pathlib import Path

from website_scraper.database import ScraperDatabase
from website_scraper.models import (
    ExtractedAsset,
    ExtractedLink,
    ExtractedMeta,
    HtmlExtract,
    PageResult,
)


class DatabaseTests(unittest.TestCase):
    def test_saves_complete_page_records(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            db_path = Path(directory) / "scraper.db"
            with ScraperDatabase(db_path) as database:
                database.initialize()
                run_id = database.create_run(
                    start_url="https://example.com",
                    normalized_start_url="https://example.com/",
                    max_pages=10,
                    max_depth=1,
                    same_domain=True,
                    user_agent="test-agent",
                )
                page = PageResult(
                    url="https://example.com/",
                    final_url="https://example.com/",
                    depth=0,
                    status_code=200,
                    content_type="text/html",
                    html="<html></html>",
                    extract=HtmlExtract(
                        title="Home",
                        description="Description",
                        canonical_url="https://example.com/",
                        text="Home page",
                        links=[ExtractedLink("https://example.com/about", "About", "next")],
                        assets=[ExtractedAsset("https://example.com/logo.png", "image", "Logo")],
                        metadata=[ExtractedMeta("description", "Description", "name")],
                    ),
                )
                database.save_page(run_id, page, lambda _url: True)
                database.finish_run(run_id, status="completed")

            connection = sqlite3.connect(db_path)
            connection.row_factory = sqlite3.Row
            page_row = connection.execute("SELECT * FROM pages").fetchone()
            link_row = connection.execute("SELECT * FROM links").fetchone()
            asset_row = connection.execute("SELECT * FROM assets").fetchone()
            meta_row = connection.execute("SELECT * FROM meta_tags").fetchone()
            run_row = connection.execute("SELECT * FROM crawl_runs").fetchone()
            connection.close()

            self.assertEqual(page_row["title"], "Home")
            self.assertEqual(page_row["text"], "Home page")
            self.assertEqual(link_row["url"], "https://example.com/about")
            self.assertEqual(asset_row["asset_type"], "image")
            self.assertEqual(meta_row["key"], "description")
            self.assertEqual(run_row["pages_seen"], 1)


if __name__ == "__main__":
    unittest.main()
