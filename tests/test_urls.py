import unittest

from website_scraper.urls import normalize_url, same_host


class UrlTests(unittest.TestCase):
    def test_normalize_url_resolves_relative_url_and_removes_fragment(self) -> None:
        self.assertEqual(
            normalize_url("../about#team", "HTTPS://Example.COM/products/item"),
            "https://example.com/about",
        )

    def test_normalize_url_adds_scheme_for_bare_host(self) -> None:
        self.assertEqual(normalize_url("example.com/docs"), "https://example.com/docs")

    def test_same_host_compares_hostname_case_insensitively(self) -> None:
        self.assertTrue(same_host("https://EXAMPLE.com/a", "https://example.com/b"))
        self.assertFalse(same_host("https://example.com", "https://other.example.com"))


if __name__ == "__main__":
    unittest.main()
