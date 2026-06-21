import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

import { CMDButton, Pill } from "../components/Controls";
import { BodyText, Card, SectionTitle } from "../components/Layout";
import { sampleAnswers, sampleQuestions } from "../data/sampleData";
import { RootStackParamList } from "../navigation/types";
import { explainWithAI } from "../services/ai";
import { translateQuestionContext } from "../services/translation";
import { getTheme } from "../theme/theme";
import { TranslationLanguage, TranslationViewMode } from "../types/schema";

type Props = NativeStackScreenProps<RootStackParamList, "QuestionTest">;

const toolbarItems = ["Z-", "Z+", "Prev", "Next", "Stop", "Search", "PDF", "Image", "Fav", "Labs", "Night", "Menu"];
const languages: TranslationLanguage[] = ["Urdu", "Arabic", "French", "Spanish", "Hindi"];

export function QuestionTestScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());
  const question = sampleQuestions[0];
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [language, setLanguage] = useState<TranslationLanguage>("Urdu");
  const [viewMode, setViewMode] = useState<TranslationViewMode>("Original");
  const [fontScale, setFontScale] = useState(1);

  const translation = translateQuestionContext({
    question,
    answers: sampleAnswers,
    language,
    mode: viewMode,
  });
  const ai = explainWithAI({ question, answers: sampleAnswers });
  const selected = sampleAnswers.find((answer) => answer.id === selectedAnswerId);
  const correct = sampleAnswers.find((answer) => answer.is_correct === 1);

  const stem =
    viewMode === "Translated"
      ? translation.translated_stem_html
      : viewMode === "Both"
        ? `${question.stem_html}\n\n${translation.translated_stem_html}`
        : question.stem_html;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Question 1 of 40</Text>
        <View style={styles.headerActions}>
          <CMDButton variant="secondary" onPress={() => setViewMode(viewMode === "Original" ? "Both" : "Original")}>
            Translation
          </CMDButton>
          <CMDButton onPress={() => setShowAI((value) => !value)}>Explain with AI</CMDButton>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.meta}>
            <Pill tone="green">Tutor Mode</Pill>
            <Pill tone="blue">{language}</Pill>
            <Pill>{viewMode}</Pill>
          </View>
          <Text style={[styles.stem, { color: theme.text, fontSize: 20 * fontScale }]}>
            {stripHtml(stem)}
          </Text>
        </Card>

        <Card>
          <SectionTitle>Answer Choices</SectionTitle>
          <View style={styles.options}>
            {sampleAnswers.map((answer) => {
              const chosen = selectedAnswerId === answer.id;
              const isCorrect = selectedAnswerId !== null && answer.is_correct === 1;
              const isWrongChosen = chosen && answer.is_correct !== 1;
              return (
                <Pressable
                  key={answer.id}
                  onPress={() => setSelectedAnswerId(answer.id)}
                  style={[
                    styles.option,
                    {
                      borderColor: isCorrect
                        ? theme.primary
                        : isWrongChosen
                          ? theme.destructive
                          : chosen
                            ? theme.secondary
                            : theme.border,
                      backgroundColor: theme.card,
                    },
                  ]}
                >
                  <Text style={[styles.radio, { color: theme.secondary }]}>
                    {chosen ? "(o)" : "( )"}
                  </Text>
                  <Text style={[styles.optionText, { color: theme.text }]}>
                    {answer.answer_label}. {stripHtml(answer.answer_text_html)}
                  </Text>
                  <Text style={[styles.percent, { color: theme.muted }]}>
                    {answer.correct_percentage}%
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {selected ? (
          <Card>
            <SectionTitle>{selected.is_correct ? "Correct" : "Incorrect"}</SectionTitle>
            <BodyText>
              You selected {selected.answer_label}. Correct answer: {correct?.answer_label}.
            </BodyText>
          </Card>
        ) : null}

        <Card>
          <SectionTitle>Explanation</SectionTitle>
          <BodyText>{stripHtml(question.explanation_html)}</BodyText>
          <View style={styles.table}>
            <Text style={[styles.tableCell, { color: theme.text }]}>Educational objective</Text>
            <Text style={[styles.tableCell, { color: theme.text }]}>{question.educational_objective}</Text>
          </View>
          <BodyText muted>References: CMD demo reference, management algorithms, lab values.</BodyText>
        </Card>

        {showAI ? (
          <Card>
            <SectionTitle>AI Output</SectionTitle>
            <BodyText>{ai.ai_summary}</BodyText>
            <BodyText muted>{ai.wrong_options_explanation}</BodyText>
            <BodyText>{ai.memory_hook}</BodyText>
          </Card>
        ) : null}

        <Card>
          <SectionTitle>Notes and Highlights</SectionTitle>
          <BodyText muted>Tap/hold text in production to highlight, attach notes, and save locally.</BodyText>
          <View style={styles.headerActions}>
            {languages.map((item) => (
              <CMDButton key={item} variant={item === language ? "primary" : "ghost"} onPress={() => setLanguage(item)}>
                {item}
              </CMDButton>
            ))}
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.toolbar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        {toolbarItems.map((item) => (
          <Pressable
            key={item}
            onPress={() => {
              if (item === "Z+") setFontScale((value) => Math.min(value + 0.1, 1.5));
              if (item === "Z-") setFontScale((value) => Math.max(value - 0.1, 0.8));
              if (item === "Stop") navigation.goBack();
            }}
            style={[styles.toolbarButton, { borderColor: theme.border }]}
          >
            <Text style={[styles.toolbarText, { color: theme.text }]}>{item}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  headerActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 110,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  stem: {
    lineHeight: 32,
    fontWeight: "600",
  },
  options: {
    gap: 10,
  },
  option: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radio: {
    fontWeight: "900",
    fontSize: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
  },
  percent: {
    fontWeight: "900",
  },
  table: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    marginVertical: 12,
    overflow: "hidden",
  },
  tableCell: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CBD5E1",
    fontSize: 15,
  },
  toolbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    padding: 8,
  },
  toolbarButton: {
    borderWidth: 1,
    borderRadius: 12,
    minWidth: 52,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarText: {
    fontSize: 12,
    fontWeight: "900",
  },
});
