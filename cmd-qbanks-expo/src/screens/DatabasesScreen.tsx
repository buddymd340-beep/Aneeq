import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { CMDButton, Field, Pill } from "../components/Controls";
import { BodyText, Card, Screen, SectionTitle } from "../components/Layout";
import { sampleQBanks } from "../data/sampleData";
import { RootStackParamList } from "../navigation/types";
import { getTheme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList>;

const categories = [
  "USMLE",
  "MCCQE",
  "Access Medicine",
  "AMBOSS-style study plans",
  "Custom Qbanks",
];

export function DatabasesScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());

  return (
    <Screen title="Databases">
      <Card>
        <Field label="Search databases" placeholder="Search by exam, subject, year, or database name" />
      </Card>

      <Card>
        <SectionTitle>Recent</SectionTitle>
        <View style={styles.recentRow}>
          {sampleQBanks.map((qbank) => (
            <View key={qbank.id} style={[styles.recentCard, { backgroundColor: theme.background }]}>
              <Pill tone="blue">{qbank.exam}</Pill>
              <Text style={[styles.title, { color: theme.text }]}>{qbank.name}</Text>
              <BodyText muted>{qbank.description}</BodyText>
              <CMDButton onPress={() => navigation.navigate("CreateTest", { qbankId: qbank.id, title: qbank.name })}>
                Create Test
              </CMDButton>
            </View>
          ))}
        </View>
      </Card>

      {categories.map((category) => (
        <Card key={category}>
          <SectionTitle>{category}</SectionTitle>
          <View style={styles.list}>
            {sampleQBanks.map((qbank) => (
              <View key={`${category}-${qbank.id}`} style={[styles.row, { borderColor: theme.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { color: theme.text }]}>{qbank.name}</Text>
                  <BodyText muted>{qbank.year} - {qbank.version} - {qbank.total_questions} questions</BodyText>
                </View>
                <Pill tone="green">Offline</Pill>
              </View>
            ))}
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  recentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  recentCard: {
    minWidth: 260,
    flex: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  list: {
    gap: 10,
  },
  row: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
  },
});
