"""HTML extraction for pages fetched by the scraper."""

from __future__ import annotations

from html import unescape
from html.parser import HTMLParser

from .models import ExtractedAsset, ExtractedLink, ExtractedMeta, HtmlExtract
from .urls import is_http_url, normalize_url


class PageHTMLParser(HTMLParser):
    """Extract links, assets, metadata, title, and visible text from HTML."""

    TEXT_BLOCKLIST = {"script", "style", "svg", "canvas"}

    def __init__(self, base_url: str) -> None:
        super().__init__(convert_charrefs=True)
        self.base_url = base_url
        self.extract = HtmlExtract()
        self._title_parts: list[str] = []
        self._text_parts: list[str] = []
        self._tag_stack: list[str] = []
        self._anchor_stack: list[dict[str, object]] = []
        self._skip_text_depth = 0
        self._seen_links: set[tuple[str, str, str]] = set()
        self._seen_assets: set[tuple[str, str]] = set()
        self._seen_meta: set[tuple[str, str, str]] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        attr_map = {name.lower(): value or "" for name, value in attrs}
        self._tag_stack.append(tag)

        if tag in self.TEXT_BLOCKLIST:
            self._skip_text_depth += 1

        if tag == "a" and attr_map.get("href"):
            url = self._absolute_http_url(attr_map["href"])
            if url:
                self._anchor_stack.append(
                    {
                        "url": url,
                        "rel": attr_map.get("rel", ""),
                        "start_index": len(self._text_parts),
                    }
                )
        elif tag == "link":
            self._handle_link_tag(attr_map)
        elif tag == "meta":
            self._handle_meta_tag(attr_map)
        elif tag in {"img", "script", "iframe", "source", "video", "audio"}:
            self._handle_asset_tag(tag, attr_map)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()

        if tag == "a" and self._anchor_stack:
            anchor = self._anchor_stack.pop()
            start_index = int(anchor["start_index"])
            text = _clean_text(" ".join(self._text_parts[start_index:]))
            self._add_link(
                url=str(anchor["url"]),
                text=text,
                rel=str(anchor["rel"]),
            )

        if tag in self.TEXT_BLOCKLIST and self._skip_text_depth > 0:
            self._skip_text_depth -= 1

        for index in range(len(self._tag_stack) - 1, -1, -1):
            if self._tag_stack[index] == tag:
                del self._tag_stack[index:]
                break

    def handle_data(self, data: str) -> None:
        cleaned = _clean_text(data)
        if not cleaned:
            return

        if self._tag_stack and self._tag_stack[-1] == "title":
            self._title_parts.append(cleaned)

        if self._skip_text_depth == 0:
            self._text_parts.append(cleaned)

    def close(self) -> None:
        super().close()
        self.extract.title = _clean_text(" ".join(self._title_parts))
        self.extract.text = _clean_text(" ".join(self._text_parts))

    def _handle_link_tag(self, attrs: dict[str, str]) -> None:
        href = attrs.get("href", "")
        rel = attrs.get("rel", "").lower()
        url = self._absolute_http_url(href)
        if not url:
            return

        if "canonical" in rel:
            self.extract.canonical_url = url
            return

        if "stylesheet" in rel:
            self._add_asset(url=url, asset_type="stylesheet")
        else:
            self._add_link(url=url, text="", rel=rel)

    def _handle_meta_tag(self, attrs: dict[str, str]) -> None:
        content = _clean_text(attrs.get("content", ""))
        if not content:
            return

        for attribute in ("name", "property", "http-equiv"):
            key = _clean_text(attrs.get(attribute, "")).lower()
            if not key:
                continue
            self._add_meta(attribute=attribute, key=key, value=content)
            if key in {"description", "og:description", "twitter:description"} and not self.extract.description:
                self.extract.description = content
            break

    def _handle_asset_tag(self, tag: str, attrs: dict[str, str]) -> None:
        source_attribute = "src"
        if tag == "source" and not attrs.get("src"):
            source_attribute = "srcset"
        url = self._absolute_http_url(attrs.get(source_attribute, ""))
        if not url:
            return

        asset_type = {
            "img": "image",
            "script": "script",
            "iframe": "iframe",
            "source": "source",
            "video": "video",
            "audio": "audio",
        }[tag]
        self._add_asset(url=url, asset_type=asset_type, alt_text=attrs.get("alt", ""))

    def _add_link(self, *, url: str, text: str, rel: str) -> None:
        key = (url, text, rel)
        if key not in self._seen_links:
            self.extract.links.append(ExtractedLink(url=url, text=text, rel=rel))
            self._seen_links.add(key)

    def _add_asset(self, *, url: str, asset_type: str, alt_text: str = "") -> None:
        key = (url, asset_type)
        if key not in self._seen_assets:
            self.extract.assets.append(
                ExtractedAsset(url=url, asset_type=asset_type, alt_text=_clean_text(alt_text))
            )
            self._seen_assets.add(key)

    def _add_meta(self, *, attribute: str, key: str, value: str) -> None:
        identity = (attribute, key, value)
        if identity not in self._seen_meta:
            self.extract.metadata.append(ExtractedMeta(attribute=attribute, key=key, value=value))
            self._seen_meta.add(identity)

    def _absolute_http_url(self, value: str) -> str:
        if not value:
            return ""
        url = normalize_url(value, self.base_url)
        return url if url and is_http_url(url) else ""


def extract_html(html: str, base_url: str) -> HtmlExtract:
    parser = PageHTMLParser(base_url)
    parser.feed(html)
    parser.close()
    return parser.extract


def _clean_text(value: str) -> str:
    return " ".join(unescape(value).split())
