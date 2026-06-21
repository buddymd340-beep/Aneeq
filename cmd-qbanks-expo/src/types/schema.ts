export type TestMode = "Reading" | "Tutor" | "Timed" | "Exam";
export type TranslationLanguage = "Urdu" | "Arabic" | "French" | "Spanish" | "Hindi";
export type TranslationViewMode = "Original" | "Translated" | "Both";

export interface QBank {
  id: number;
  name: string;
  exam: string;
  year: string;
  version: string;
  description: string;
  total_questions: number;
  media_base_path: string;
  db_file_path: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: number;
  qbank_id: number;
  name: string;
  question_count: number;
}

export interface System {
  id: number;
  qbank_id: number;
  name: string;
  question_count: number;
}

export interface Topic {
  id: number;
  qbank_id: number;
  subject_id: number;
  system_id: number;
  name: string;
  question_count: number;
}

export interface Question {
  id: number;
  qbank_id: number;
  qid: number;
  stem_html: string;
  explanation_html: string;
  educational_objective: string;
  correct_answer_id: number;
  subject_id: number;
  system_id: number;
  topic_id: number;
  difficulty: string;
  question_type: number;
  question_format_type: number;
  parent_qid: number | null;
  people_taken: number;
  correct_taken: number;
  correct_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Answer {
  id: number;
  qbank_id: number;
  question_id: number;
  qid: number;
  answer_label: string;
  answer_text_html: string;
  is_correct: number;
  correct_percentage: number;
  explanation_html: string;
}

export interface QuestionMedia {
  id: number;
  qbank_id: number;
  question_id: number;
  qid: number;
  media_type: string;
  file_name: string;
  file_path: string;
  local_path: string;
  remote_url: string;
  caption: string;
  display_order: number;
  used_in: string;
  created_at: string;
}

export interface Reference {
  id: number;
  qbank_id: number;
  question_id: number;
  qid: number;
  ref_title: string;
  ref_link: string;
  ref_type: number;
}

export interface Test {
  id: number;
  qbank_id: number;
  title: string;
  qids: string;
  mode: TestMode;
  question_count: number;
  current_index: number;
  done: number;
  right_count: number;
  wrong_count: number;
  score: string;
  subject_filter: string;
  system_filter: string;
  topic_filter: string;
  difficulty_filter: string;
  created_at: string;
  completed_at: string | null;
}

export interface UserLog {
  id: number;
  qbank_id: number;
  test_id: number;
  question_id: number;
  qid: number;
  selected_answer_id: number;
  correct_answer_id: number;
  is_correct: number;
  time_spent: number;
  answer_date: string;
}

export interface Bookmark {
  id: number;
  qbank_id: number;
  question_id: number;
  qid: number;
  created_at: string;
}

export interface Highlight {
  id: number;
  qbank_id: number;
  question_id: number;
  qid: number;
  selected_text: string;
  color: string;
  note: string;
  created_at: string;
}

export interface Note {
  id: number;
  qbank_id: number;
  question_id: number;
  qid: number;
  note_text: string;
  created_at: string;
  updated_at: string;
}

export interface AIExplanation {
  id: number;
  qbank_id: number;
  question_id: number;
  qid: number;
  ai_summary: string;
  wrong_options_explanation: string;
  memory_hook: string;
  differential_table: string;
  flashcards_json: string;
  created_at: string;
}

export interface Translation {
  id: number;
  qbank_id: number;
  question_id: number;
  qid: number;
  language: TranslationLanguage;
  translated_stem_html: string;
  translated_explanation_html: string;
  translated_objective: string;
  translated_answers_json: string;
  created_at: string;
  updated_at: string;
}

export interface Backup {
  id: number;
  user_id: string;
  qbank_id: number;
  backup_code: string;
  backup_file_path: string;
  created_at: string;
  restored_at: string | null;
}

export interface StudyPlanFilters {
  count: "10" | "20" | "40" | "custom";
  mode: TestMode;
  subject: string;
  system: string;
  topic: string;
  difficulty: string;
  status: "unused" | "used" | "incorrect" | "marked" | "all";
  sort: "QID" | "Random";
  qids: string;
}
