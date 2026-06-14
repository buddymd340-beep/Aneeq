# Aneeq

## Authorized question-bank scraper

This repository includes a configurable browser-based scraper for question-bank
websites that you own or are explicitly authorized to export from. It logs in
through the normal website UI, opens question pages, selects each option, records
whether the site reports the option as correct or wrong, and exports explanation
sections such as:

- explanation
- question management
- other option explanation
- summary
- reference

Do not paste website credentials into chat or commit them to git. Keep them in a
local `.env` file or shell environment variables.

### Setup

```bash
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install -r requirements.txt
python3 -m playwright install chromium
cp .env.example .env
```

Edit `.env` locally:

```bash
QUESTION_BANK_USERNAME=your-login-id
QUESTION_BANK_PASSWORD=your-password
```

### Configure selectors

Copy the example config and edit it for your site:

```bash
cp configs/question_bank_scraper.example.json configs/question_bank_scraper.json
```

Update these values first:

- `login.url`
- `login.username_selector`
- `login.password_selector`
- `login.submit_selector`
- `questions.start_url`
- `questions.question_link_selector`
- `question_page.question_selector`
- `question_page.option_selector`
- `question_page.feedback_selector`
- `question_page.explanation_sections`

Use browser developer tools to inspect the HTML and replace the example CSS
selectors with selectors from your website.

### Run a safe test export

Start with one or two questions to confirm the selectors and to avoid changing a
large amount of attempt history on the site:

```bash
python3 scripts/question_bank_scraper.py \
  --config configs/question_bank_scraper.json \
  --max-questions 2 \
  --headful \
  --slow-mo-ms 250
```

When the test output looks correct, run without `--headful`:

```bash
python3 scripts/question_bank_scraper.py \
  --config configs/question_bank_scraper.json \
  --output-json output/questions.json \
  --output-csv output/questions.csv
```

The JSON output keeps the nested question/option/explanation structure. The CSV
output creates one row per option, which is convenient for spreadsheets.
