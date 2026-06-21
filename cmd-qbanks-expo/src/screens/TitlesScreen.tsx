import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { CMDButton, Pill } from "../components/Controls";
import { BodyText, Card, Grid, Screen, SectionTitle } from "../components/Layout";
import { RootStackParamList } from "../navigation/types";
import { sampleQBanks } from "../data/sampleData";
import { getTheme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList>;

export function TitlesScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());
  return (
    <Screen title="Titles">
      <Grid>
        <Card>
          <SectionTitle>Recent documents</SectionTitle>
          <BodyText muted>Continue your last database, book, or test session.</BodyText>
          <View style={styles.list}>
            {sampleQBanks.map((qbank) => (
              <View key={qbank.id} style={[styles.row, { borderColor: theme.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: theme.text }]}>{qbank.name}</Text>
                  <BodyText muted>{qbank.exam} - {qbank.total_questions} questions</BodyText>
                </View>
                <CMDButton
                  variant="secondary"
                  onPress={() => navigation.navigate("CreateTest", { qbankId: qbank.id, title: qbank.name })}
                >
                  Open
                </CMDButton>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <SectionTitle>Study plans</SectionTitle>
          <View style={styles.planGrid}>
            {["AMBOSS-style study plans", "Weak topics", "Incorrect queue", "Custom Qbanks"].map((item) => (
              <View key={item} style={[styles.plan, { backgroundColor: theme.background }]}>
                <Pill tone="green">Ready</Pill>
                <Text style={[styles.planTitle, { color: theme.text }]}>{item}</Text>
              </View>
            ))}
          </View>
        </Card>
      </Grid>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  planGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  plan: {
    minWidth: 210,
    flex: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
});
