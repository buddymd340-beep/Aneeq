import sqlite3
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from website_scraper.scraper import CrawlOptions, WebsiteScraper


class TestHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        if self.path == "/":
            self._send_html(
                """
                <html>
                  <head>
                    <title>Home</title>
                    <meta name="description" content="Home description">
                  </head>
                  <body>
                    <a href="/about">About</a>
                    <a href="https://external.example/page">External</a>
                    <img src="/logo.png" alt="Logo">
                  </body>
                </html>
                """
            )
        elif self.path == "/about":
            self._send_html("<html><head><title>About</title></head><body>About page</body></html>")
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, _format: str, *_args: object) -> None:
        return

    def _send_html(self, html: str) -> None:
        body = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


class ScraperTests(unittest.TestCase):
    def test_crawls_same_domain_pages_and_persists_database(self) -> None:
        server = ThreadingHTTPServer(("127.0.0.1", 0), TestHandler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(server.shutdown)
        self.addCleanup(thread.join)

        start_url = f"http://127.0.0.1:{server.server_port}/"
        with tempfile.TemporaryDirectory() as directory:
            db_path = Path(directory) / "scraper.db"
            scraper = WebsiteScraper(
                str(db_path),
                CrawlOptions(max_pages=10, max_depth=1, timeout=2),
            )

            result = scraper.crawl(start_url)

            self.assertEqual(result.pages, 2)
            self.assertEqual(result.assets, 1)
            self.assertGreaterEqual(result.links, 2)

            connection = sqlite3.connect(db_path)
            connection.row_factory = sqlite3.Row
            titles = {
                row["title"]
                for row in connection.execute("SELECT title FROM pages ORDER BY title")
            }
            link_urls = {
                row["url"]
                for row in connection.execute("SELECT url FROM links ORDER BY url")
            }
            connection.close()

            self.assertEqual(titles, {"About", "Home"})
            self.assertIn(f"http://127.0.0.1:{server.server_port}/about", link_urls)
            self.assertIn("https://external.example/page", link_urls)


if __name__ == "__main__":
    unittest.main()
