import { Answer, Question } from "../types/schema";

export interface AIQuestionContext {
  question: Question;
  answers: Answer[];
}

export interface AIOutput {
  ai_summary: string;
  wrong_options_explanation: string;
  memory_hook: string;
  differential_table: string;
  flashcards_json: string;
}

export function explainWithAI(context: AIQuestionContext): AIOutput {
  const correct = context.answers.find((answer) => answer.is_correct === 1);
  const wrong = context.answers.filter((answer) => answer.is_correct !== 1);

  // Production: send only this question context to Claude/OpenAI and save response in SQLite.
  return {
    ai_summary: `Correct answer is ${correct?.answer_label ?? "unknown"}. Use the stem clues and educational objective to identify the tested diagnosis or management step.`,
    wrong_options_explanation: wrong
      .map((answer) => `${answer.answer_label}: ${stripHtml(answer.explanation_html)}`)
      .join("\n"),
    memory_hook: "Anchor the key clue, then link it to the first management step.",
    differential_table:
      "| Diagnosis | Clue | First step |\n|---|---|---|\n| Aortic dissection | Tearing chest pain to back | Beta blockade |\n| ACS | Pressure-like chest pain | Aspirin/ECG/troponin |",
    flashcards_json: JSON.stringify([
      {
        front: "What is first-line acute treatment for suspected aortic dissection?",
        back: "IV beta blockade such as labetalol.",
      },
    ]),
  };
}

export function buildWeakTopicStudyPlan(weakTopics: string[]) {
  return weakTopics.map((topic, index) => ({
    day: index + 1,
    topic,
    task: `Review notes, do 20 targeted questions, and create 5 flashcards for ${topic}.`,
  }));
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
