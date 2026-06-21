import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Switch, Text, useColorScheme, View } from "react-native";

import { CMDButton } from "../components/Controls";
import { RootStackParamList } from "../navigation/types";
import { getTheme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList>;

export function AccountScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.nav, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.windowDots}>
          <View style={[styles.dot, { backgroundColor: "#FF605C" }]} />
          <View style={[styles.dot, { backgroundColor: "#FFBD44" }]} />
          <View style={[styles.dot, { backgroundColor: "#00CA4E" }]} />
        </View>
        <Text style={[styles.navTitle, { color: theme.text }]}>Account</Text>
        <Pressable style={[styles.roundButton, { backgroundColor: theme.background }]}>
          <Text style={[styles.roundText, { color: theme.text }]}>↻</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.goldBar}>International VIP Account - Active Till</Text>
        <Text style={[styles.dateRow, { color: theme.text, backgroundColor: theme.card }]}>
          2027-05-16 - 329 Days Remaining
        </Text>
        <Pressable style={styles.greenBar}>
          <Text style={styles.barText}>Extend Subscription</Text>
        </Pressable>

        <SectionHeader title="Your Databases" />
        <Text style={[styles.centerRow, { color: theme.muted, backgroundColor: theme.card }]}>
          You Are Subscribed To All Databases
        </Text>

        <SectionHeader title="Settings - App Version : CMD Qbanks - 3.0" />
        <View style={[styles.list, { backgroundColor: theme.card }]}>
          <SettingsRow label="Select Landing Page" value="Databases" />
          <SettingsRow label="FullScreen on Landscape" toggle enabled />
          <SettingsRow label="Use iOS Dictionary" toggle enabled />
          <SettingsRow label="Show Less Toolbar Items" toggle />
          <SettingsRow label="Hide Bars" value="NO" />
          <SettingsRow label="Font" value="Charis" />
          <SettingsRow label="Goto Image on Gallery Close" toggle enabled />
          <SettingsRow label="Show Recent Section" toggle enabled />
          <SettingsRow label="Document Theme" value="Light" />
          <SettingsRow label="Main Server" value="Germany" />
          <SettingsRow label="Download Server" value="Germany" />
          <SettingsRow label="Collapsed Sections" toggle />
          <SettingsRow label="Automatic QBank Backups" toggle enabled />
          <SettingsRow label="Height Line" value="Default   Reset" />
          <SettingsRow label="Document Color" value="Default   Reset" />
          <SettingsRow icon="■" label="File Manager" value="›" />
        </View>

        <Pressable style={styles.greenBar}>
          <Text style={styles.barText}>Start Web Server</Text>
        </Pressable>
        <Pressable style={styles.blueBar}>
          <Text style={styles.barText}>Start Content Web Server</Text>
        </Pressable>
        <Pressable style={styles.redBar}>
          <Text style={styles.barText}>Delete Temp Files</Text>
        </Pressable>

        <View style={styles.logout}>
          <CMDButton variant="ghost" onPress={() => navigation.replace("Login")}>
            Logout
          </CMDButton>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionText}>{title}</Text>
    </View>
  );
}

function SettingsRow({
  label,
  value,
  toggle,
  enabled = false,
  icon = "⚙",
}: {
  label: string;
  value?: string;
  toggle?: boolean;
  enabled?: boolean;
  icon?: string;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.gear}>{icon}</Text>
      <Text style={styles.settingLabel}>{label}</Text>
      {toggle ? <Switch value={enabled} /> : <Text style={styles.settingValue}>{value}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  nav: {
    height: 74,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  windowDots: {
    flexDirection: "row",
    gap: 5,
    width: 64,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  roundText: {
    fontSize: 24,
    fontWeight: "800",
  },
  content: {
    paddingBottom: 108,
  },
  goldBar: {
    backgroundColor: "#CBB100",
    color: "#FFFFFF",
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 16,
  },
  dateRow: {
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 16,
  },
  greenBar: {
    backgroundColor: "#087A2A",
    paddingVertical: 12,
  },
  blueBar: {
    backgroundColor: "#1298F6",
    paddingVertical: 12,
  },
  redBar: {
    backgroundColor: "#FF383E",
    paddingVertical: 12,
  },
  barText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
  },
  sectionHeader: {
    backgroundColor: "#ECEEF3",
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  sectionText: {
    color: "#8A8D96",
    fontWeight: "800",
    fontSize: 15,
  },
  centerRow: {
    textAlign: "center",
    paddingVertical: 13,
    fontSize: 15,
  },
  list: {},
  settingRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D8D8D8",
    paddingHorizontal: 14,
  },
  gear: {
    width: 32,
    fontSize: 22,
    color: "#858585",
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: "#202124",
  },
  settingValue: {
    color: "#8A8D96",
    fontSize: 15,
  },
  logout: {
    padding: 16,
  },
});
