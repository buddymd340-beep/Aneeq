const assert = require("node:assert/strict");
const { test } = require("node:test");

const {
  QUESTIONS,
  answerActiveQuestion,
  createDefaultState,
  createStudySession,
  filterQuestions,
  finishSession,
  isDueForReview,
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
