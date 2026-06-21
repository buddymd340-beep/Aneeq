import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { CMDButton, Field, Pill } from "../components/Controls";
import { BodyText, Card, Grid, Screen, SectionTitle } from "../components/Layout";
import { samplePreviousTests, sampleSubjects, sampleSystems, sampleTopics } from "../data/sampleData";
import { RootStackParamList } from "../navigation/types";
import { getTheme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "CreateTest">;

const counts = ["10", "20", "40", "custom"];
const modes = ["Reading", "Tutor", "Timed", "Exam"];
const filters = ["unused", "used", "incorrect", "marked", "all"];

export function CreateTestScreen({ route, navigation }: Props) {
  const theme = getTheme(useColorScheme());
  const questionsFound = 128;

  return (
    <Screen title={route.params.title}>
      <Grid>
        <Card>
          <SectionTitle>Browse Questions</SectionTitle>
          <BodyText muted>Open all questions, favorite questions, or create a filtered test.</BodyText>
          <View style={styles.actions}>
            <CMDButton variant="secondary">Browse Questions</CMDButton>
            <CMDButton variant="ghost">Favorite Questions</CMDButton>
          </View>
        </Card>

        <Card>
          <SectionTitle>Create a Test</SectionTitle>
          <View style={styles.group}>
            <Text style={[styles.label, { color: theme.muted }]}>Number of questions</Text>
            <View style={styles.wrap}>{counts.map((item) => <Pill key={item} tone="green">{item}</Pill>)}</View>
          </View>
          <View style={styles.group}>
            <Text style={[styles.label, { color: theme.muted }]}>Test Mode</Text>
            <View style={styles.wrap}>{modes.map((item) => <Pill key={item} tone="blue">{item}</Pill>)}</View>
          </View>
          <Grid>
            <Field label="Subject filter" value={sampleSubjects[0].name} />
            <Field label="System filter" value={sampleSystems[0].name} />
            <Field label="Topic filter" value={sampleTopics[0].name} />
            <Field label="Difficulty filter" value="Medium" />
            <Field label="Filter" value={filters.join(" / ")} />
            <Field label="Sort by" value="QID / random" />
          </Grid>
          <Field label="Comma-separated QID input" placeholder="1001, 1002, 1003" />
          <Text style={[styles.found, { color: theme.primary }]}>{questionsFound} Questions Found</Text>
          <CMDButton onPress={() => navigation.navigate("QuestionTest", { qbankId: route.params.qbankId })}>
            Let's Go
          </CMDButton>
        </Card>
      </Grid>

      <Grid>
        <Card>
          <SectionTitle>Previous Tests</SectionTitle>
          {samplePreviousTests.map((test) => (
            <View key={test.id} style={[styles.testRow, { borderColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.testTitle, { color: theme.text }]}>{test.title}</Text>
                <BodyText muted>{test.mode} - {test.question_count} questions - {test.created_at.slice(0, 10)}</BodyText>
              </View>
              <CMDButton variant="ghost" onPress={() => navigation.navigate("PreviousTests", { qbankId: route.params.qbankId })}>
                Open
              </CMDButton>
            </View>
          ))}
        </Card>

        <Card>
          <SectionTitle>Your Progress</SectionTitle>
          <BodyText muted>Used 38%, Correct 72%, Incorrect 28%.</BodyText>
          <View style={styles.actions}>
            <CMDButton variant="secondary" onPress={() => navigation.navigate("Progress", { qbankId: route.params.qbankId })}>
              Progress
            </CMDButton>
            <CMDButton variant="ghost">Backup Data</CMDButton>
            <CMDButton variant="ghost">Restore With Code</CMDButton>
            <CMDButton variant="destructive">Reset History</CMDButton>
            <CMDButton variant="destructive">Delete Favorites & Highlights</CMDButton>
          </View>
        </Card>
      </Grid>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  group: {
    gap: 8,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  found: {
    fontWeight: "900",
    fontSize: 18,
    marginVertical: 14,
  },
  testRow: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  testTitle: {
    fontWeight: "800",
    fontSize: 16,
  },
});
