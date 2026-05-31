import unittest

from website_scraper.parser import extract_html


class ParserTests(unittest.TestCase):
    def test_extracts_page_data_links_assets_and_meta(self) -> None:
        html = """
        <html>
          <head>
            <title>Example page</title>
            <meta name="description" content="A useful example">
            <meta property="og:type" content="website">
            <link rel="canonical" href="/canonical">
            <link rel="stylesheet" href="/site.css">
          </head>
          <body>
            <a href="/about" rel="next"> About us </a>
            <a href="mailto:test@example.com">Email</a>
            <img src="/logo.png" alt="Company logo">
            <script>window.secret = "not visible";</script>
            Visible text
          </body>
        </html>
        """

        extract = extract_html(html, "https://example.com/")

        self.assertEqual(extract.title, "Example page")
        self.assertEqual(extract.description, "A useful example")
        self.assertEqual(extract.canonical_url, "https://example.com/canonical")
        self.assertIn("Visible text", extract.text)
        self.assertNotIn("not visible", extract.text)
        self.assertEqual(extract.links[0].url, "https://example.com/about")
        self.assertEqual(extract.links[0].text, "About us")
        self.assertEqual(extract.assets[0].url, "https://example.com/site.css")
        self.assertEqual(extract.assets[0].asset_type, "stylesheet")
        self.assertEqual(extract.assets[1].url, "https://example.com/logo.png")
        self.assertEqual(extract.assets[1].alt_text, "Company logo")
        self.assertEqual(extract.metadata[0].key, "description")


if __name__ == "__main__":
    unittest.main()
