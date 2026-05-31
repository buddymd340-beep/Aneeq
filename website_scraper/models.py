"""Shared data models for crawler, parser, and database code."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class ExtractedLink:
    """A hyperlink discovered in a page."""

    url: str
    text: str = ""
    rel: str = ""


@dataclass(frozen=True)
class ExtractedAsset:
    """A non-page resource referenced by a page."""

    url: str
    asset_type: str
    alt_text: str = ""


@dataclass(frozen=True)
class ExtractedMeta:
    """A meta tag discovered in a page."""

    key: str
    value: str
    attribute: str


@dataclass
class HtmlExtract:
    """Structured information parsed from HTML."""

    title: str = ""
    description: str = ""
    canonical_url: str = ""
    text: str = ""
    links: list[ExtractedLink] = field(default_factory=list)
    assets: list[ExtractedAsset] = field(default_factory=list)
    metadata: list[ExtractedMeta] = field(default_factory=list)


@dataclass(frozen=True)
class PageResult:
    """The fetched and parsed result for a URL."""

    url: str
    final_url: str
    depth: int
    status_code: int | None
    content_type: str
    html: str
    extract: HtmlExtract
    error: str = ""
