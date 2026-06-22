import * as SQLite from "expo-sqlite";

import {
  sampleAnswers,
  samplePreviousTests,
  sampleQBanks,
  sampleQuestions,
  sampleSubjects,
  sampleSystems,
  sampleTopics,
} from "../data/sampleData";
import { migrations } from "./schema";

const db = SQLite.openDatabaseSync("cmd_qbanks.db");

export async function initializeDatabase() {
  await ensureMigrationTable();

  for (const migration of migrations) {
    const applied = await db.getFirstAsync<{ version: number }>(
      "SELECT version FROM schema_migrations WHERE version = ?",
      [migration.version],
    );

    if (applied) {
      continue;
    }

    await db.withTransactionAsync(async () => {
      for (const statement of migration.statements) {
        await db.execAsync(statement);
      }
      await db.runAsync("INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)", [
        migration.version,
        new Date().toISOString(),
      ]);
    });
  }

  await seedSampleData();
}

async function ensureMigrationTable() {
  await db.execAsync(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
  );`);
}

async function seedSampleData() {
  const existing = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM qbanks");
  if ((existing?.count ?? 0) > 0) {
    return;
  }

  await db.withTransactionAsync(async () => {
    for (const qbank of sampleQBanks) {
      await db.runAsync(
        `INSERT INTO qbanks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          qbank.id,
          qbank.name,
          qbank.exam,
          qbank.year,
          qbank.version,
          qbank.description,
          qbank.total_questions,
          qbank.media_base_path,
          qbank.db_file_path,
          qbank.is_active,
          qbank.created_at,
          qbank.updated_at,
        ],
      );
    }

    for (const subject of sampleSubjects) {
      await db.runAsync("INSERT INTO subjects VALUES (?, ?, ?, ?)", [
        subject.id,
        subject.qbank_id,
        subject.name,
        subject.question_count,
      ]);
    }

    for (const system of sampleSystems) {
      await db.runAsync("INSERT INTO systems VALUES (?, ?, ?, ?)", [
        system.id,
        system.qbank_id,
        system.name,
        system.question_count,
      ]);
    }

    for (const topic of sampleTopics) {
      await db.runAsync("INSERT INTO topics VALUES (?, ?, ?, ?, ?, ?)", [
        topic.id,
        topic.qbank_id,
        topic.subject_id,
        topic.system_id,
        topic.name,
        topic.question_count,
      ]);
    }

    for (const question of sampleQuestions) {
      await db.runAsync(
        `INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          question.id,
          question.qbank_id,
          question.qid,
          question.stem_html,
          question.explanation_html,
          question.educational_objective,
          question.correct_answer_id,
          question.subject_id,
          question.system_id,
          question.topic_id,
          question.difficulty,
          question.question_type,
          question.question_format_type,
          question.parent_qid,
          question.people_taken,
          question.correct_taken,
          question.correct_percentage,
          question.created_at,
          question.updated_at,
        ],
      );
    }

    for (const answer of sampleAnswers) {
      await db.runAsync("INSERT INTO answers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        answer.id,
        answer.qbank_id,
        answer.question_id,
        answer.qid,
        answer.answer_label,
        answer.answer_text_html,
        answer.is_correct,
        answer.correct_percentage,
        answer.explanation_html,
      ]);
    }

    for (const test of samplePreviousTests) {
      await db.runAsync(
        `INSERT INTO tests VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          test.id,
          test.qbank_id,
          test.title,
          test.qids,
          test.mode,
          test.question_count,
          test.current_index,
          test.done,
          test.right_count,
          test.wrong_count,
          test.score,
          test.subject_filter,
          test.system_filter,
          test.topic_filter,
          test.difficulty_filter,
          test.created_at,
          test.completed_at,
        ],
      );
    }
  });
}

export function getDatabase() {
  return db;
}
