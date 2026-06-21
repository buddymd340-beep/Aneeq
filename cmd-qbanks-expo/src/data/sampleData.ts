import { Answer, QBank, Question, Subject, System, Test, Topic } from "../types/schema";

const now = new Date().toISOString();

export const sampleQBanks: QBank[] = [
  {
    id: 1,
    name: "USMLE Step 2 CK - CMD Demo",
    exam: "USMLE",
    year: "2026",
    version: "1.0",
    description: "Demo clinical reasoning QBank with offline media-ready schema.",
    total_questions: 2400,
    media_base_path: "/storage/qbanks/qbank_1/media",
    db_file_path: "/storage/qbanks/qbank_1/qbank.db",
    is_active: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    name: "MCCQE Internal Medicine",
    exam: "MCCQE",
    year: "2026",
    version: "1.0",
    description: "Tablet-first Canadian clinical QBank placeholder.",
    total_questions: 800,
    media_base_path: "/storage/qbanks/qbank_2/media",
    db_file_path: "/storage/qbanks/qbank_2/qbank.db",
    is_active: 1,
    created_at: now,
    updated_at: now,
  },
];

export const sampleSubjects: Subject[] = [
  { id: 1, qbank_id: 1, name: "Cardiology", question_count: 420 },
  { id: 2, qbank_id: 1, name: "Infectious Disease", question_count: 310 },
  { id: 3, qbank_id: 1, name: "Emergency Medicine", question_count: 260 },
];

export const sampleSystems: System[] = [
  { id: 1, qbank_id: 1, name: "Cardiovascular", question_count: 520 },
  { id: 2, qbank_id: 1, name: "Pulmonary", question_count: 330 },
  { id: 3, qbank_id: 1, name: "Renal", question_count: 280 },
];

export const sampleTopics: Topic[] = [
  { id: 1, qbank_id: 1, subject_id: 1, system_id: 1, name: "Aortic dissection", question_count: 32 },
  { id: 2, qbank_id: 1, subject_id: 2, system_id: 1, name: "Endocarditis", question_count: 28 },
  { id: 3, qbank_id: 1, subject_id: 3, system_id: 2, name: "Pulmonary embolism", question_count: 44 },
];

export const sampleQuestions: Question[] = [
  {
    id: 1,
    qbank_id: 1,
    qid: 1001,
    stem_html:
      "<p>A 64-year-old woman presents with sudden tearing chest pain radiating to the back. Blood pressure is 190/110 mm Hg. Which medication should be given first?</p>",
    explanation_html:
      "<p>Suspected aortic dissection requires immediate beta blockade to reduce aortic shear stress before vasodilators are used.</p><table><tr><th>Drug</th><th>Role</th></tr><tr><td>Labetalol</td><td>First-line heart-rate and BP control</td></tr></table>",
    educational_objective:
      "Treat suspected aortic dissection first with beta blockade, then add vasodilators if needed.",
    correct_answer_id: 2,
    subject_id: 1,
    system_id: 1,
    topic_id: 1,
    difficulty: "Medium",
    question_type: 1,
    question_format_type: 1,
    parent_qid: null,
    people_taken: 1200,
    correct_taken: 780,
    correct_percentage: 65,
    created_at: now,
    updated_at: now,
  },
];

export const sampleAnswers: Answer[] = [
  {
    id: 1,
    qbank_id: 1,
    question_id: 1,
    qid: 1001,
    answer_label: "A",
    answer_text_html: "Nitroprusside",
    is_correct: 0,
    correct_percentage: 18,
    explanation_html: "Vasodilators before beta blockade can worsen reflex tachycardia.",
  },
  {
    id: 2,
    qbank_id: 1,
    question_id: 1,
    qid: 1001,
    answer_label: "B",
    answer_text_html: "Labetalol",
    is_correct: 1,
    correct_percentage: 65,
    explanation_html: "Correct. Beta blockade is first-line.",
  },
  {
    id: 3,
    qbank_id: 1,
    question_id: 1,
    qid: 1001,
    answer_label: "C",
    answer_text_html: "Heparin",
    is_correct: 0,
    correct_percentage: 7,
    explanation_html: "Anticoagulation can be harmful in dissection.",
  },
  {
    id: 4,
    qbank_id: 1,
    question_id: 1,
    qid: 1001,
    answer_label: "D",
    answer_text_html: "Alteplase",
    is_correct: 0,
    correct_percentage: 4,
    explanation_html: "Thrombolysis is contraindicated when dissection is suspected.",
  },
  {
    id: 5,
    qbank_id: 1,
    question_id: 1,
    qid: 1001,
    answer_label: "E",
    answer_text_html: "Aspirin",
    is_correct: 0,
    correct_percentage: 6,
    explanation_html: "Aspirin treats ACS but does not control dissection shear stress.",
  },
];

export const samplePreviousTests: Test[] = [
  {
    id: 1,
    qbank_id: 1,
    title: "Test 1",
    qids: "1001,1002,1003,1004,1005,1006,1007,1008,1009,1010",
    mode: "Tutor",
    question_count: 10,
    current_index: 4,
    done: 0,
    right_count: 3,
    wrong_count: 1,
    score: "75%",
    subject_filter: "Cardiology",
    system_filter: "Cardiovascular",
    topic_filter: "All",
    difficulty_filter: "Medium",
    created_at: now,
    completed_at: null,
  },
];
