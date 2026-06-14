#!/usr/bin/env python3
"""Configurable scraper for authorized question-bank websites.

The scraper uses a browser session so it can work with sites that reveal
correctness and explanation text only after an option is selected.
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import json
import os
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urljoin


DEFAULT_OUTPUT_JSON = "output/questions.json"
DEFAULT_OUTPUT_CSV = "output/questions.csv"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scrape an authorized question bank through the website UI."
    )
    parser.add_argument(
        "--config",
        default="configs/question_bank_scraper.example.json",
        help="Path to the JSON selector/configuration file.",
    )
    parser.add_argument(
        "--output-json",
        default=DEFAULT_OUTPUT_JSON,
        help="Where to write structured JSON output.",
    )
    parser.add_argument(
        "--output-csv",
        default=DEFAULT_OUTPUT_CSV,
        help="Where to write flattened CSV output.",
    )
    parser.add_argument(
        "--headful",
        action="store_true",
        help="Run with a visible browser window for debugging selectors.",
    )
    parser.add_argument(
        "--slow-mo-ms",
        type=int,
        default=0,
        help="Delay Playwright operations by this many milliseconds.",
    )
    parser.add_argument(
        "--max-questions",
        type=int,
        default=None,
        help="Override the configured question limit for a safe test run.",
    )
    return parser.parse_args()


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def load_dotenv(path: Path) -> None:
    """Load a simple .env file without adding another dependency."""
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def require_config(config: dict[str, Any], path: str) -> Any:
    current: Any = config
    for part in path.split("."):
        if not isinstance(current, dict) or part not in current:
            raise ValueError(f"Missing required config value: {path}")
        current = current[part]
    if current in (None, ""):
        raise ValueError(f"Empty required config value: {path}")
    return current


def normalize_text(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def classify_correctness(feedback_text: str) -> bool | None:
    feedback = feedback_text.lower()
    incorrect_patterns = [
        r"\bincorrect\b",
        r"\bwrong\b",
        r"\bnot\s+correct\b",
        r"\btry\s+again\b",
    ]
    correct_patterns = [
        r"\bcorrect\b",
        r"\bright\b",
        r"\bwell\s+done\b",
    ]

    if any(re.search(pattern, feedback) for pattern in incorrect_patterns):
        return False
    if any(re.search(pattern, feedback) for pattern in correct_patterns):
        return True
    return None


async def safe_inner_text(page: Any, selector: str | None) -> str:
    if not selector:
        return ""
    locator = page.locator(selector).first
    if callable(locator):
        locator = locator()
    if await locator.count() == 0:
        return ""
    try:
        return normalize_text(await locator.inner_text(timeout=1500))
    except Exception:
        return ""


async def safe_locator_text(locator: Any, child_selector: str | None = None) -> str:
    target = locator.locator(child_selector).first if child_selector else locator
    if callable(target):
        target = target()
    try:
        return normalize_text(await target.inner_text(timeout=1500))
    except Exception:
        return ""


async def wait_for_optional(page: Any, selector: str | None, timeout_ms: int) -> None:
    if not selector:
        return
    try:
        await page.wait_for_selector(selector, timeout=timeout_ms)
    except Exception:
        pass


async def login(page: Any, config: dict[str, Any]) -> None:
    login_config = config.get("login", {})
    username_env = login_config.get("username_env", "QUESTION_BANK_USERNAME")
    password_env = login_config.get("password_env", "QUESTION_BANK_PASSWORD")
    username = os.environ.get(username_env)
    password = os.environ.get(password_env)

    if not username or not password:
        raise RuntimeError(
            f"Set {username_env} and {password_env} in your environment or .env file."
        )

    await page.goto(require_config(config, "login.url"), wait_until="domcontentloaded")
    await page.fill(require_config(config, "login.username_selector"), username)
    await page.fill(require_config(config, "login.password_selector"), password)
    await page.click(require_config(config, "login.submit_selector"))
    await wait_for_optional(
        page,
        login_config.get("post_login_selector"),
        login_config.get("post_login_timeout_ms", 15000),
    )


async def collect_question_links(page: Any, config: dict[str, Any]) -> list[dict[str, str]]:
    questions_config = config.get("questions", {})
    configured_urls = questions_config.get("urls", [])
    if configured_urls:
        return [
            {"url": urljoin(config.get("base_url", ""), url), "title": ""}
            for url in configured_urls
        ]

    start_url = require_config(config, "questions.start_url")
    link_selector = questions_config.get("question_link_selector")
    if not link_selector:
        return [{"url": urljoin(config.get("base_url", ""), start_url), "title": ""}]

    max_pages = int(questions_config.get("max_pages", 1))
    next_page_selector = questions_config.get("next_page_selector")
    links: list[dict[str, str]] = []

    await page.goto(start_url, wait_until="domcontentloaded")
    for page_index in range(max_pages):
        await page.wait_for_selector(link_selector, timeout=15000)
        locators = page.locator(link_selector)
        count = await locators.count()

        for index in range(count):
            link = locators.nth(index)
            href = await link.get_attribute("href")
            if not href:
                continue
            absolute_url = urljoin(page.url, href)
            if any(item["url"] == absolute_url for item in links):
                continue
            links.append(
                {
                    "url": absolute_url,
                    "title": normalize_text(await link.inner_text(timeout=1500)),
                }
            )

        if not next_page_selector or page_index == max_pages - 1:
            break

        next_page = page.locator(next_page_selector).first
        if callable(next_page):
            next_page = next_page()
        if await next_page.count() == 0:
            break
        await next_page.click()
        await page.wait_for_load_state("domcontentloaded")

    return links


async def scrape_sections(page: Any, config: dict[str, Any]) -> dict[str, str]:
    section_selectors = config.get("question_page", {}).get("explanation_sections", {})
    sections: dict[str, str] = {}
    for name, selector in section_selectors.items():
        sections[name] = await safe_inner_text(page, selector)
    return sections


async def click_option_and_collect(
    page: Any,
    option_index: int,
    config: dict[str, Any],
) -> dict[str, Any]:
    question_config = config.get("question_page", {})
    option_selector = require_config(config, "question_page.option_selector")
    option_text_selector = question_config.get("option_text_selector")
    option_click_selector = question_config.get("option_click_selector")
    submit_selector = question_config.get("submit_after_option_selector")
    wait_after_click_ms = int(question_config.get("wait_after_click_ms", 800))
    feedback_selector = question_config.get("feedback_selector")

    options = page.locator(option_selector)
    option = options.nth(option_index)
    option_text = await safe_locator_text(option, option_text_selector)
    click_target = option.locator(option_click_selector).first if option_click_selector else option
    if callable(click_target):
        click_target = click_target()

    await click_target.click()
    if submit_selector:
        await page.click(submit_selector)
    await page.wait_for_timeout(wait_after_click_ms)

    feedback_text = await safe_inner_text(page, feedback_selector)
    return {
        "index": option_index + 1,
        "text": option_text,
        "feedback": feedback_text,
        "is_correct": classify_correctness(feedback_text),
        "explanation_sections": await scrape_sections(page, config),
    }


async def scrape_question(
    page: Any,
    question_link: dict[str, str],
    question_index: int,
    config: dict[str, Any],
) -> dict[str, Any]:
    question_config = config.get("question_page", {})
    question_selector = require_config(config, "question_page.question_selector")
    option_selector = require_config(config, "question_page.option_selector")
    reload_between_options = bool(question_config.get("reload_between_options", True))

    await page.goto(question_link["url"], wait_until="domcontentloaded")
    await page.wait_for_selector(question_selector, timeout=15000)
    question_text = await safe_inner_text(page, question_selector)
    option_count = await page.locator(option_selector).count()
    options: list[dict[str, Any]] = []

    for option_index in range(option_count):
        if option_index > 0 and reload_between_options:
            await page.goto(question_link["url"], wait_until="domcontentloaded")
            await page.wait_for_selector(option_selector, timeout=15000)
        options.append(await click_option_and_collect(page, option_index, config))

    return {
        "index": question_index,
        "url": question_link["url"],
        "title": question_link.get("title", ""),
        "question": question_text,
        "options": options,
        "explanation_sections": await scrape_sections(page, config),
    }


def write_json(path: Path, questions: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps({"questions": questions}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def write_csv(path: Path, questions: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    section_names = sorted(
        {
            section
            for question in questions
            for option in question.get("options", [])
            for section in option.get("explanation_sections", {})
        }
    )
    fieldnames = [
        "question_index",
        "question_url",
        "question",
        "option_index",
        "option",
        "is_correct",
        "feedback",
        *[f"section_{name}" for name in section_names],
    ]

    with path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for question in questions:
            for option in question.get("options", []):
                row = {
                    "question_index": question.get("index"),
                    "question_url": question.get("url"),
                    "question": question.get("question"),
                    "option_index": option.get("index"),
                    "option": option.get("text"),
                    "is_correct": option.get("is_correct"),
                    "feedback": option.get("feedback"),
                }
                for name in section_names:
                    row[f"section_{name}"] = option.get("explanation_sections", {}).get(
                        name, ""
                    )
                writer.writerow(row)


async def run() -> int:
    args = parse_args()
    config_path = Path(args.config)
    load_dotenv(Path(".env"))
    config = load_json(config_path)

    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print(
            "Missing dependency: install with `python -m pip install -r requirements.txt` "
            "and then run `python -m playwright install chromium`.",
            file=sys.stderr,
        )
        return 2

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=not args.headful,
            slow_mo=args.slow_mo_ms,
        )
        page = await browser.new_page()
        await login(page, config)
        question_links = await collect_question_links(page, config)

        configured_max = config.get("questions", {}).get("max_questions")
        max_questions = args.max_questions if args.max_questions is not None else configured_max
        if max_questions:
            question_links = question_links[: int(max_questions)]

        questions: list[dict[str, Any]] = []
        for index, question_link in enumerate(question_links, start=1):
            print(f"Scraping {index}/{len(question_links)}: {question_link['url']}")
            questions.append(await scrape_question(page, question_link, index, config))

        await browser.close()

    write_json(Path(args.output_json), questions)
    write_csv(Path(args.output_csv), questions)
    print(f"Wrote {len(questions)} questions to {args.output_json} and {args.output_csv}")
    return 0


def main() -> int:
    return asyncio.run(run())


if __name__ == "__main__":
    raise SystemExit(main())
