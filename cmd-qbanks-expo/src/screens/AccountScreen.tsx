import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Switch, StyleSheet, Text, useColorScheme, View } from "react-native";

import { CMDButton, Field, SettingRow } from "../components/Controls";
import { BodyText, Card, Grid, Screen, SectionTitle } from "../components/Layout";
import { RootStackParamList } from "../navigation/types";
import { describeCloudBackupStrategy } from "../services/backup";
import { getTheme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList>;

export function AccountScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());

  return (
    <Screen title="Account">
      <Grid>
        <Card>
          <SectionTitle>Subscription</SectionTitle>
          <BodyText>Status: Active</BodyText>
          <BodyText muted>Expiry date: 2027-06-21</BodyText>
          <View style={styles.actions}>
            <CMDButton>Extend subscription</CMDButton>
            <CMDButton variant="ghost" onPress={() => navigation.replace("Login")}>Logout</CMDButton>
          </View>
        </Card>

        <Card>
          <SectionTitle>Your databases</SectionTitle>
          <BodyText>USMLE Step 2 CK - CMD Demo</BodyText>
          <BodyText muted>MCCQE Internal Medicine</BodyText>
        </Card>
      </Grid>

      <Card>
        <SectionTitle>Settings</SectionTitle>
        <Field label="Select landing page" value="Titles" />
        <Field label="Font selection" value="System / Large medical reader" />
        <Field label="Document theme" value="Light / Dark / System" />
        <Field label="Main server selector" value="USA" />
        <Field label="Download server selector" value="Germany" />
        <SettingRow title="Fullscreen landscape" detail="Tablet/iPad-first reading mode" right={<Switch value />} />
        <SettingRow title="Use iOS dictionary" right={<Switch value />} />
        <SettingRow title="Show less toolbar items" right={<Switch />} />
        <SettingRow title="Hide bars option" right={<Switch />} />
        <SettingRow title="Collapsed sections" right={<Switch value />} />
        <SettingRow title="Automatic QBank backups" right={<Switch value />} />
      </Card>

      <Grid>
        <Card>
          <SectionTitle>Utilities</SectionTitle>
          <View style={styles.actions}>
            <CMDButton variant="secondary">File manager</CMDButton>
            <CMDButton variant="secondary">Start Web Server</CMDButton>
            <CMDButton variant="secondary">Start Content Web Server</CMDButton>
            <CMDButton variant="ghost">Height line reset</CMDButton>
            <CMDButton variant="ghost">Document color reset</CMDButton>
            <CMDButton variant="destructive">Delete Temp Files</CMDButton>
          </View>
        </Card>

        <Card>
          <SectionTitle>Backup / Restore</SectionTitle>
          {describeCloudBackupStrategy().map((item) => (
            <Text key={item} style={[styles.strategy, { color: theme.muted }]}>
              {item}
            </Text>
          ))}
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
  strategy: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 6,
  },
});
