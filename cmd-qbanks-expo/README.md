# CMD Qbanks

React Native + Expo + TypeScript medical QBank app scaffold.

This project is built from the requested specification and is ready for exact
visual matching once screenshots/video are uploaded.

## Tech stack

- React Native + Expo
- TypeScript
- SQLite via `expo-sqlite`
- Supabase Auth helper via `@supabase/supabase-js`
- Local file storage via `expo-file-system`
- Document import picker via `expo-document-picker`
- Bottom tabs + stack navigation via React Navigation
- Light/dark mode via system color scheme

## Main tabs

1. Titles
2. Databases
3. Favorites
4. Contents
5. Account

## Implemented screens

- Login/Register
- Titles
- Databases styled as the uploaded grouped section list
- Create Test
- Question/Test Reader styled as the uploaded QBank reader
- Previous Tests styled with green score circles
- Progress styled with progress card, donut chart, and subject chart
- Favorites
- Contents
- Account/Settings styled as the uploaded settings list

## Uploaded screenshot behavior implemented

- Account screen: gold VIP status bar, expiry row, green subscription action,
  grouped settings rows, switches, server rows, and green/blue/red utility
  actions.
- Databases screen: centered title, Edit button, rounded search field, recent
  section, grouped database sections, icons, and thin dividers.
- Previous Tests: plain list rows with Q count/mode/date, Copy QIDs/Delete
  actions, and green score circles.
- Progress: overall progress percent, total/used/correct/incorrect values,
  donut-style chart, legend, and subject progress bar chart.
- Question reader: fixed top title, large readable stem, radio choices with
  percentages, correct/incorrect box, explanation text, circular bottom toolbar,
  and tappable blue medical term.
- Blue term/image behavior: tapping the blue term or gallery icon opens a
  full-screen black image viewer with a portal venous system diagram placeholder.

## Included modules

- `src/storage/schema.ts`: SQLite migrations for all requested tables.
- `src/storage/database.ts`: SQLite init and sample seed.
- `src/types/schema.ts`: TypeScript interfaces matching the database schema.
- `src/services/appStateFiles.ts`: BoardVitals/UWorld-style state files:
  `backupstate.dat`, `uwfilters.dat`, `info.vbe`, `crypto_v2.txt`,
  `crypto_v3.txt`, and `boardvitals-126-2025.db`.
- `src/services/importer.ts`: QBank DB + media folder import helper.
- `src/services/ai.ts`: AI explanation helper using current question context only.
- `src/services/translation.ts`: Translation helper preserving HTML tags and medical terms.
- `src/services/backup.ts`: Local backup/restore helper with backup codes.
- `src/services/auth.ts`: Supabase login/register/logout helper.

## Run locally

```sh
cd cmd-qbanks-expo
npm install
npm run typecheck
npm start
```

Then choose:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go
- Press `w` for web preview

## BoardVitals/UWorld-style file integration

The app now creates and uses the same file names described in your guide.

On app launch, `App.tsx` runs:

1. SQLite initialization
2. `runLaunchFlow()`
3. Crypto placeholder creation
4. License check from `info.vbe`
5. Backup state read from `backupstate.dat`
6. Filter restore from `uwfilters.dat`
7. QBank folder/database path preparation

### Files created in app document storage

```text
backupstate.dat
uwfilters.dat
info.vbe
crypto_v2.txt
crypto_v3.txt
storage/qbanks/qbank_1/boardvitals-126-2025.db
storage/qbanks/qbank_1/boardvitals-126-2025.db-journal
storage/qbanks/qbank_1/media/questions/
storage/qbanks/qbank_1/media/explanations/
storage/qbanks/qbank_1/media/tables/
storage/qbanks/qbank_1/media/references/
storage/qbanks/qbank_1/media/labs/
storage/qbanks/qbank_1/media/audio/
storage/qbanks/qbank_1/media/video/
storage/qbanks/qbank_1/media/pdf/
```

### Account screen controls

Open **Account** and scroll to:

```text
BoardVitals/UWorld File State
```

There you can:

- See if `info.vbe` is activated
- See `backupstate.dat` date and dirty flag
- See whether sync is needed
- See `uwfilters.dat`
- See the current QBank DB path
- Activate a demo encrypted license
- Mark sync needed
- Mark sync complete
- Reset filters

### `backupstate.dat`

The Expo implementation writes a Java-serialized string-compatible payload:

```text
YYYY-MM-DD|0
YYYY-MM-DD|1
```

Meaning:

- `0` = clean
- `1` = dirty, needs sync

### `uwfilters.dat`

Stored under the same file name, but as editable JSON for React Native:

```json
{
  "status": [1],
  "subjects": [],
  "systems": [],
  "topics": [],
  "mode": []
}
```

Filter meaning:

- `status: [1]` = unused
- `status: [3]` = incorrect
- `subjects: [5, 8]` = subject IDs
- `mode: [101]` = tutor mode

The helper `buildQuestionQuery()` converts this into a SQLite query.

### `info.vbe`

`info.vbe` is AES-CBC encrypted license JSON. The key reference is stored in:

```text
crypto_v3.txt
```

`crypto_v2.txt` is initialized for legacy migration support. The Account screen
has an **Activate Demo License** button that creates a valid encrypted
`info.vbe` for testing.

### SQLite journal

`boardvitals-126-2025.db-journal` is treated as SQLite-managed. The app does
not read/write it directly.

## Supabase setup

Create a `.env` file or set environment variables:

```sh
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Then wire `src/services/auth.ts` into `LoginScreen.tsx` for real server auth.

## SQLite schema

The migration includes these tables:

- `qbanks`
- `subjects`
- `systems`
- `topics`
- `questions`
- `answers`
- `question_media`
- `references`
- `tests`
- `user_logs`
- `bookmarks`
- `highlights`
- `notes`
- `ai_explanations`
- `translations`
- `backups`

## Media folder structure

```text
/storage/qbanks/
  /qbank_1/
    boardvitals-126-2025.db
    /media/
      /questions/
      /explanations/
      /tables/
      /references/
      /labs/
      /audio/
      /video/
      /pdf/
```

## Import flow

Use `src/services/importer.ts` to:

1. Pick an external SQLite database.
2. Create an isolated `/storage/qbanks/qbank_X/` folder.
3. Copy `qbank.db`.
4. Copy media into qbank media folders.
5. Return missing media information.
6. Map old tables into the new schema without overwriting original content.

## AI flow

Use `src/services/ai.ts` to generate:

- Correct-answer explanation
- Wrong-option explanations
- Step 2-style high-yield summary
- Differential table
- Memory hook
- Flashcards JSON
- Weak-topic study plan

Production API calls must send only the current question context.

## Translation flow

Use `src/services/translation.ts` to translate:

- Stem
- Options
- Explanation
- Educational objective

Supported language placeholders:

- Urdu
- Arabic
- French
- Spanish
- Hindi

Modes:

- Original
- Translated
- Both

The helper preserves HTML tags and keeps medical terms in English brackets.

## What I still need for further exact design matching

The current implementation is based on the screenshots shared in chat. For more
precision, upload:

1. Login/register screenshot
2. Titles/home screenshot
3. Databases screenshot
4. Create Test screenshot
5. Question page screenshot
6. Previous Tests screenshot
7. Progress screenshot
8. Account/settings screenshot
9. Any screen recording showing navigation and animations
10. Logo, exact colors, and font preference

Once uploaded, the placeholder styling can be adjusted to match the references
screen-by-screen.
