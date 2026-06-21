# Aneeq Medical Study

Offline-first medical QBank, reference reader, translation cache, and AI tutor
MVP based on the uploaded iMD Medical App build guide.

This repository now contains a working static PWA prototype. It runs in the
browser with no backend required and demonstrates the main product flows before
you invest in the full Flutter/Firebase mobile build.

## What is built

- Dashboard with downloaded banks, accuracy, answered count, due review count,
  and weak-subject trends.
- QBank browser with downloadable/offline content packages.
- Custom test creator with count, mode, subject, difficulty, and status filters.
- Question reader with answer reveal, explanation, favorites, flags,
  highlights, notes, translation banner, and AI tutor prompt.
- Post-test score review with percent score, average time, incorrect review,
  and copyable QIDs.
- Full-text search across downloaded questions and reference books.
- Favorites list.
- Reference book reader with table of contents and clinical boxes.
- Settings panel matching the guide toggles.
- Local translation cache with glossary overrides and side-by-side English.
- Service worker and manifest so the app can be installed and cached offline.

## Run the app locally

1. Open a terminal in the project folder.
2. Start the static server:

   ```sh
   npm start
   ```

3. Open:

   ```text
   http://localhost:8000
   ```

4. Optional: install it as a PWA from the browser install button or browser menu.

## Test

```sh
npm test
```

## How to use the MVP

1. Open **Dashboard** to see progress and weak subject trends.
2. Open **QBank** or **Downloads** and mark banks downloaded for offline use.
3. Open **Create Test**.
4. Select count, mode, subject, difficulty, and filter.
5. Click **Start test**.
6. In the **Question Reader**:
   - Pick an answer to reveal correctness and explanation.
   - Favorite or flag a question.
   - Add highlights and notes.
   - Change the language selector at the top to show a translation banner while
     keeping original English visible.
   - Use the AI tutor button for the local tutor prompt mock.
7. Click **Finish test** to open the score review.
8. Use **Search**, **Favorites**, and **Books** for review.
9. Use **Settings** for the guide's behavior toggles and download region.

## Production build steps

Use this MVP to validate screens and behavior. For a real iOS/Android/Web app,
build the production version like this:

### 1. Create the Flutter project

```sh
flutter create aneeq_medical
cd aneeq_medical
flutter pub add flutter_riverpod drift sqlite3_flutter_libs path_provider path
flutter pub add firebase_core firebase_auth cloud_firestore firebase_storage
flutter pub add flutter_secure_storage connectivity_plus dio intl
flutter pub add google_sign_in sign_in_with_apple
flutter pub add --dev drift_dev build_runner
```

### 2. Configure Firebase

```sh
dart pub global activate flutterfire_cli
flutterfire configure
```

Enable these Firebase products:

- Firebase Auth: email/password, Google, and Apple Sign-In.
- Firestore: user profile, purchases, sync metadata.
- Firebase Storage: QBank SQLite `.db` files and reference-book packages.

### 3. Build the local SQLite schema

Create Drift tables for:

- `questions`
- `answer_choices`
- `highlights`
- `favorites`
- `test_sessions`
- `test_results`
- `translations`
- `sync_queue`

Also create an FTS5 table for question stem, explanation, and book content.

### 4. Add offline-first data flow

1. Read questions/books/highlights/favorites from SQLite first.
2. Write every user action locally immediately.
3. Add every write to `sync_queue`.
4. When online, flush `sync_queue` to Firestore.
5. Use last-write-wins per field for simple conflict resolution.

### 5. Implement downloads

1. Store licensed QBank `.db` files in Firebase Storage.
2. Download to the app documents directory, not cache.
3. Support resume and progress bars.
4. Validate each local DB against the user's stored license receipt.

### 6. Implement translation

1. Add Google Translate, DeepL, or Claude translation service.
2. Hash `source_text + target_language`.
3. Check local `translations` cache before every API call.
4. Always display original English next to translated text.
5. Apply a vetted medical glossary after API translation.
6. Offer pre-translation during QBank downloads.

### 7. Implement AI tutor

1. Add a chat bubble to the question screen.
2. Preload the prompt with question stem, choices, correct answer, and
   explanation.
3. Send the prompt to Claude.
4. Cache each AI response per QID.
5. Allow follow-up messages in the user's selected language.

### 8. Add analytics and spaced repetition

1. Compute local score trend per subject.
2. Track time per question.
3. Identify weakest and strongest topics.
4. Add a streak calendar.
5. Schedule wrong answers with SM-2 or FSRS review intervals.

### 9. Prepare app store builds

```sh
flutter test
flutter build apk --release
flutter build appbundle --release
flutter build ios --release
flutter build web --release
```

Then configure signing, privacy policy, subscription/licensing, and store
metadata for App Store Connect and Google Play Console.
