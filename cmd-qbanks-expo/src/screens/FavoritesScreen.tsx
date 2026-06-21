import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { CMDButton, Pill } from "../components/Controls";
import { BodyText, Card, Screen, SectionTitle } from "../components/Layout";
import { sampleQuestions } from "../data/sampleData";
import { getTheme } from "../theme/theme";

export function FavoritesScreen() {
  const theme = getTheme(useColorScheme());
  return (
    <Screen title="Favorites">
      <Card>
        <SectionTitle>Favorite Questions</SectionTitle>
        {sampleQuestions.map((question) => (
          <View key={question.id} style={[styles.row, { borderColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <View style={styles.pills}>
                <Pill tone="green">QID {question.qid}</Pill>
                <Pill>{question.difficulty}</Pill>
              </View>
              <Text style={[styles.title, { color: theme.text }]}>{stripHtml(question.stem_html)}</Text>
              <BodyText muted>{question.educational_objective}</BodyText>
            </View>
            <CMDButton variant="destructive">Remove</CMDButton>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
  },
  pills: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
});
