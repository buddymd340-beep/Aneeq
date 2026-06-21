import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { BodyText, Card, Grid, Screen, SectionTitle } from "../components/Layout";
import { getTheme } from "../theme/theme";

const subjects = [
  { name: "Cardiology", progress: 62, correct: 78 },
  { name: "Infectious Disease", progress: 44, correct: 68 },
  { name: "Emergency Medicine", progress: 38, correct: 59 },
  { name: "Pulmonary", progress: 31, correct: 71 },
];

export function ProgressScreen() {
  const theme = getTheme(useColorScheme());
  return (
    <Screen title="Progress">
      <Grid>
        <Card>
          <SectionTitle>Overall Progress</SectionTitle>
          <View style={[styles.donut, { borderColor: theme.primary }]}>
            <Text style={[styles.donutText, { color: theme.text }]}>38%</Text>
            <BodyText muted>Used</BodyText>
          </View>
          <BodyText>Total questions 2400 - Used 912 - Correct 657 - Incorrect 255</BodyText>
        </Card>

        <Card>
          <SectionTitle>Donut Chart</SectionTitle>
          <View style={styles.legend}>
            <Legend color={theme.primary} label="Correct 657" />
            <Legend color={theme.destructive} label="Incorrect 255" />
            <Legend color={theme.border} label="Unused 1488" />
          </View>
        </Card>
      </Grid>

      <Card>
        <SectionTitle>Subject progress bar chart</SectionTitle>
        {subjects.map((subject) => (
          <View key={subject.name} style={styles.subjectRow}>
            <Text style={[styles.subject, { color: theme.text }]}>{subject.name}</Text>
            <View style={[styles.track, { backgroundColor: theme.background }]}>
              <View style={[styles.fill, { width: `${subject.progress}%`, backgroundColor: theme.primary }]} />
            </View>
            <Text style={[styles.percent, { color: theme.muted }]}>{subject.progress}%</Text>
          </View>
        ))}
      </Card>

      <Grid>
        <Card>
          <SectionTitle>Weak subjects</SectionTitle>
          <BodyText>Emergency Medicine, Infectious Disease</BodyText>
        </Card>
        <Card>
          <SectionTitle>Weak topics</SectionTitle>
          <BodyText>Aortic dissection, Endocarditis, Pulmonary embolism</BodyText>
        </Card>
        <Card>
          <SectionTitle>Performance by system</SectionTitle>
          <BodyText muted>Cardiovascular 78%, Pulmonary 71%, Renal 64%</BodyText>
        </Card>
      </Grid>
    </Screen>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  donut: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 18,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  donutText: {
    fontSize: 34,
    fontWeight: "900",
  },
  legend: {
    gap: 14,
  },
  legendItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  legendDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  subject: {
    width: 170,
    fontWeight: "800",
  },
  track: {
    flex: 1,
    height: 12,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
  percent: {
    width: 44,
    textAlign: "right",
    fontWeight: "800",
  },
});
