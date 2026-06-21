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
- Databases
- Create Test
- Question/Test Reader
- Previous Tests
- Progress
- Favorites
- Contents
- Account/Settings

## Included modules

- `src/storage/schema.ts`: SQLite migrations for all requested tables.
- `src/storage/database.ts`: SQLite init and sample seed.
- `src/types/schema.ts`: TypeScript interfaces matching the database schema.
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
    qbank.db
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

## What I still need for exact design matching

No screenshots/video files are currently available in the upload folder. Please
upload:

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
