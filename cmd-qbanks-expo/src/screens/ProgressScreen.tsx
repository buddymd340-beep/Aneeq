import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";

import { getTheme } from "../theme/theme";

const subjects = [
  { name: "Obstetrics & Gynecology", progress: 95, color: "#7FB795" },
  { name: "Surgery", progress: 87, color: "#4DB42C" },
  { name: "Pediatrics", progress: 81, color: "#BD6BCF" },
  { name: "Medicine", progress: 78, color: "#609BD0" },
  { name: "Psychiatry", progress: 4, color: "#12B52E" },
];

export function ProgressScreen() {
  const theme = getTheme(useColorScheme());
  return (
    <View style={[styles.root, { backgroundColor: "#FFFFFF" }]}>
      <View style={[styles.nav, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Pressable style={styles.circle}>
          <Text style={styles.circleText}>‹</Text>
        </Pressable>
        <Text style={styles.navTitle}>Your Progress</Text>
        <Pressable style={styles.circle}>
          <Text style={styles.home}>⌂</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Overall Progress: 76%</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.stats}>
            <Stat label="Total" value="4089" />
            <Stat label="Used" value="3121" />
            <Stat label="Corr" value="1935" />
            <Stat label="Incorr" value="1186" />
          </View>
          <View style={styles.donutWrap}>
            <Svg width={240} height={240} viewBox="0 0 240 240">
              <Circle cx={120} cy={120} r={76} stroke="#858585" strokeWidth={54} fill="none" />
              <Circle
                cx={120}
                cy={120}
                r={76}
                stroke="#008000"
                strokeWidth={54}
                fill="none"
                strokeDasharray="224 477"
                rotation="-90"
                origin="120,120"
              />
              <Circle
                cx={120}
                cy={120}
                r={76}
                stroke="#FF1010"
                strokeWidth={54}
                fill="none"
                strokeDasharray="138 477"
                strokeDashoffset="-224"
                rotation="-90"
                origin="120,120"
              />
              <Circle cx={120} cy={120} r={50} fill="#F8FAFC" />
              <SvgText x={50} y={78} fill="#FFFFFF" fontSize="13">Unused</SvgText>
              <SvgText x={158} y={124} fill="#FFFFFF" fontSize="13">Correct</SvgText>
              <SvgText x={40} y={178} fill="#FFFFFF" fontSize="13">Incorrect</SvgText>
            </Svg>
          </View>
          <View style={styles.legend}>
            <Legend color="#008000" label="Correct (47%)" />
            <Legend color="#FF1010" label="Incorrect (29%)" />
            <Legend color="#858585" label="Unused (23%)" />
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Subjects Progress</Text>
          <Svg width="100%" height={310} viewBox="0 0 560 310">
            {[0, 1, 2, 3, 4].map((line) => (
              <Rect key={line} x={45} y={40 + line * 50} width={470} height={1} fill="#B9BEC7" />
            ))}
            {subjects.map((subject, index) => {
              const x = 58 + index * 94;
              const height = subject.progress * 2.1;
              return (
                <Rect
                  key={subject.name}
                  x={x}
                  y={250 - height}
                  width={72}
                  height={height}
                  fill={subject.color}
                />
              );
            })}
            {subjects.map((subject, index) => (
              <SvgText
                key={`${subject.name}-label`}
                x={58 + index * 94}
                y={270}
                fill="#111827"
                fontSize="9"
              >
                {subject.name.split(" ")[0]} ({subject.progress}%)
              </SvgText>
            ))}
          </Svg>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Subjects Correct Percentage</Text>
          <Text style={styles.muted}>Weak subjects and weak topics are listed here in production.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  nav: {
    height: 74,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontSize: 34,
    lineHeight: 34,
  },
  home: {
    fontSize: 25,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  content: {
    backgroundColor: "#F4F5F8",
    padding: 18,
    paddingBottom: 108,
    gap: 18,
  },
  chartCard: {
    backgroundColor: "#F0F2F7",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  progressTrack: {
    height: 26,
    backgroundColor: "#D8DCE5",
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    width: "76%",
    height: "100%",
    backgroundColor: "#0A84FF",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  stat: {
    alignItems: "center",
  },
  statLabel: {
    fontWeight: "800",
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    marginTop: 3,
  },
  donutWrap: {
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
  },
  legendText: {
    fontSize: 11,
  },
  chartTitle: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 8,
  },
  muted: {
    color: "#8A8D96",
    textAlign: "center",
  },
});
