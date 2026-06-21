const assert = require("node:assert/strict");
const { test } = require("node:test");

const {
  QUESTIONS,
  answerActiveQuestion,
  createAccount,
  createDefaultState,
  createStudySession,
  cycleTranslationLanguage,
  filterQuestions,
  finishSession,
  getAllBooks,
  getAllQBanks,
  getCurrentUser,
  importAdminContent,
  isAdmin,
  isDueForReview,
  loginAccount,
  logoutAccount,
  scoreSession,
  searchContent,
  translateText,
} = require("../app.js");

test("creates a filtered tutor session from downloaded questions", () => {
  const state = createDefaultState();
  const session = createStudySession(state, {
    count: "10",
    mode: "tutor",
    subject: "Cardiology",
    difficulty: "All",
    status: "all",
  });

  assert.equal(state.route, "reader");
  assert.equal(session.mode, "tutor");
  assert.deepEqual(session.qids, [101]);
});

test("scores answered questions and stores attempt history", () => {
  const state = createDefaultState();
  createStudySession(state, {
    count: "custom",
    customQuestionIds: "101,102",
    mode: "timed",
  });

  answerActiveQuestion(state, 2, 60);
  state.activeQuestionIndex = 1;
  answerActiveQuestion(state, 0, 90);
  const score = finishSession(state);

  assert.equal(score.total, 2);
  assert.equal(score.correct, 1);
  assert.equal(score.percent, 50);
  assert.equal(state.attempts.length, 1);
  assert.equal(state.route, "score");
});

test("filters incorrect questions after a wrong answer", () => {
  const state = createDefaultState();
  createStudySession(state, {
    count: "custom",
    customQuestionIds: "102",
    mode: "tutor",
  });
  answerActiveQuestion(state, 0, 30);

  const incorrect = filterQuestions(state, { status: "incorrect" });

  assert.deepEqual(
    incorrect.map((question) => question.id),
    [102],
  );
});

test("searches downloaded questions and book content", () => {
  const state = createDefaultState();
  const hits = searchContent(state, "tricuspid");

  assert.ok(hits.some((hit) => hit.type === "question" && hit.id === 101));
  assert.ok(hits.some((hit) => hit.type === "book"));
});

test("translation uses glossary replacements and caches by source hash", () => {
  const state = createDefaultState();
  const first = translateText(state, "Fever with heart valve infection", "ur");
  const syncCount = state.syncQueue.length;
  const second = translateText(state, "Fever with heart valve infection", "ur");

  assert.match(first, /bukhar \(Fever\)/i);
  assert.match(first, /dil \(heart\)/i);
  assert.equal(second, first);
  assert.equal(state.syncQueue.length, syncCount);
});

test("wrong answers are scheduled as due before correct answers", () => {
  const state = createDefaultState();
  createStudySession(state, {
    count: "custom",
    customQuestionIds: "101,102",
    mode: "tutor",
  });
  answerActiveQuestion(state, 0, 40);
  state.activeQuestionIndex = 1;
  answerActiveQuestion(state, QUESTIONS.find((question) => question.id === 102).correctIndex, 40);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);

  assert.equal(isDueForReview(QUESTIONS.find((question) => question.id === 101), state, tomorrow), true);
  assert.equal(isDueForReview(QUESTIONS.find((question) => question.id === 102), state, tomorrow), false);
});

test("scoreSession handles unanswered questions", () => {
  const state = createDefaultState();
  const session = createStudySession(state, {
    count: "custom",
    customQuestionIds: "101,102",
    mode: "reading",
  });
  const score = scoreSession(session);

  assert.equal(score.answered, 0);
  assert.equal(score.correct, 0);
  assert.equal(score.total, 2);
});

test("admin upload adds qbanks, questions, and books to study flows", () => {
  const state = createDefaultState();
  importAdminContent(state, {
    qbanks: [
      {
        id: "admin-neuro",
        title: "Admin Neuro",
        questions: 1,
        subjects: ["Neurology"],
      },
    ],
    questions: [
      {
        id: 9101,
        qbankId: "admin-neuro",
        subject: "Neurology",
        difficulty: 2,
        stem: "A patient has a resting tremor and bradykinesia. Which neurotransmitter is decreased?",
        choices: ["Dopamine", "Serotonin", "Histamine"],
        correctIndex: 0,
        explanation: "Parkinson disease involves decreased dopamine in the substantia nigra.",
        tags: ["parkinson", "dopamine"],
      },
    ],
    books: [
      {
        id: "admin-book",
        title: "Admin Neurology Notes",
        chapters: [
          {
            id: "front",
            title: "Movement disorders",
            nodes: [
              {
                type: "paragraph",
                text: "Parkinson disease causes bradykinesia and resting tremor.",
              },
            ],
          },
        ],
      },
    ],
  });

  assert.ok(getAllQBanks(state).some((bank) => bank.id === "admin-neuro"));
  assert.ok(getAllBooks(state).some((book) => book.id === "admin-book"));
  assert.deepEqual(
    filterQuestions(state, { subject: "Neurology" }).map((question) => question.id),
    [9101],
  );
  assert.ok(searchContent(state, "bradykinesia").some((hit) => hit.id === 9101));
});

test("local accounts support admin and user roles", () => {
  const state = createDefaultState();
  const admin = createAccount(state, {
    name: "Admin",
    email: "admin@example.com",
    password: "pass123",
    role: "admin",
  });

  assert.equal(getCurrentUser(state).id, admin.id);
  assert.equal(isAdmin(state), true);

  logoutAccount(state);
  assert.equal(getCurrentUser(state), undefined);

  loginAccount(state, {
    email: "admin@example.com",
    password: "pass123",
  });
  assert.equal(isAdmin(state), true);

  logoutAccount(state);
  createAccount(state, {
    name: "Student",
    email: "student@example.com",
    password: "pass123",
    role: "user",
  });
  assert.equal(isAdmin(state), false);
});

test("translation icon cycles question language", () => {
  const state = createDefaultState();

  assert.equal(state.selectedLanguage, "en");
  assert.equal(cycleTranslationLanguage(state), "ur");
  assert.equal(cycleTranslationLanguage(state), "ar");
});
