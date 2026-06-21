import { Answer, Question, TranslationLanguage, TranslationViewMode } from "../types/schema";

const medicalTerms = ["angina", "aortic dissection", "labetalol", "endocarditis", "dopamine"];

const languagePrefixes: Record<TranslationLanguage, string> = {
  Urdu: "Urdu translation",
  Arabic: "Arabic translation",
  French: "French translation",
  Spanish: "Spanish translation",
  Hindi: "Hindi translation",
};

export interface TranslationRequest {
  question: Question;
  answers: Answer[];
  language: TranslationLanguage;
  mode: TranslationViewMode;
}

export function translateQuestionContext(request: TranslationRequest) {
  return {
    translated_stem_html: translateHtmlPreservingMarkup(request.question.stem_html, request.language),
    translated_explanation_html: translateHtmlPreservingMarkup(
      request.question.explanation_html,
      request.language,
    ),
    translated_objective: preserveMedicalTerms(
      `${languagePrefixes[request.language]}: ${request.question.educational_objective}`,
    ),
    translated_answers_json: JSON.stringify(
      request.answers.map((answer) => ({
        id: answer.id,
        label: answer.answer_label,
        text: translateHtmlPreservingMarkup(answer.answer_text_html, request.language),
      })),
    ),
  };
}

export function translateHtmlPreservingMarkup(html: string, language: TranslationLanguage) {
  const parts = html.split(/(<[^>]+>)/g);
  return parts
    .map((part) => {
      if (part.startsWith("<")) {
        return part;
      }
      if (!part.trim()) {
        return part;
      }
      return preserveMedicalTerms(`${languagePrefixes[language]}: ${part}`);
    })
    .join("");
}

function preserveMedicalTerms(text: string) {
  let output = text;
  for (const term of medicalTerms) {
    const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, "gi");
    output = output.replace(pattern, (match) => `${match} [${match}]`);
  }
  return output;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
