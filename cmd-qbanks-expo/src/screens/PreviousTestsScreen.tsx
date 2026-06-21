import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { CMDButton, Pill } from "../components/Controls";
import { BodyText, Card, Screen, SectionTitle } from "../components/Layout";
import { samplePreviousTests } from "../data/sampleData";
import { RootStackParamList } from "../navigation/types";
import { getTheme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "PreviousTests">;

export function PreviousTestsScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());

  return (
    <Screen title="Previous Tests">
      {samplePreviousTests.map((test) => (
        <Card key={test.id}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <SectionTitle>{test.title}</SectionTitle>
              <BodyText muted>
                {test.question_count} questions - {test.mode} - {test.created_at.slice(0, 10)}
              </BodyText>
              <BodyText muted>
                Subjects: {test.subject_filter}; Systems: {test.system_filter}
              </BodyText>
              <View style={styles.pills}>
                <Pill tone="green">Score {test.score}</Pill>
                <Pill>Current Q {test.current_index + 1}</Pill>
              </View>
            </View>
            <View style={[styles.scoreCircle, { borderColor: theme.primary }]}>
              <Text style={[styles.score, { color: theme.primary }]}>{test.score}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <CMDButton variant="ghost">Copy QIDs</CMDButton>
            <CMDButton variant="destructive">Delete</CMDButton>
            <CMDButton onPress={() => navigation.navigate("QuestionTest", { qbankId: test.qbank_id, testId: test.id })}>
              Resume
            </CMDButton>
            <CMDButton variant="secondary">Review</CMDButton>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  scoreCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontWeight: "900",
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
});
