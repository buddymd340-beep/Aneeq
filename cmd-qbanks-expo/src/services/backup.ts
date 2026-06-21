import * as FileSystem from "expo-file-system/legacy";

export interface BackupPayload {
  user_id: string;
  qbank_id: number;
  tests: unknown[];
  user_logs: unknown[];
  bookmarks: unknown[];
  highlights: unknown[];
  notes: unknown[];
  translations: unknown[];
  ai_explanations: unknown[];
}

export async function createBackup(payload: BackupPayload) {
  const backupCode = `CMD-${Date.now().toString(36).toUpperCase()}`;
  const backupDir = `${FileSystem.documentDirectory ?? ""}backups`;
  await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
  const backupFilePath = `${backupDir}/${backupCode}.json`;
  await FileSystem.writeAsStringAsync(backupFilePath, JSON.stringify(payload, null, 2));

  return {
    backup_code: backupCode,
    backup_file_path: backupFilePath,
    created_at: new Date().toISOString(),
  };
}

export async function restoreWithCode(backupFilePath: string): Promise<BackupPayload> {
  const raw = await FileSystem.readAsStringAsync(backupFilePath);
  return JSON.parse(raw) as BackupPayload;
}

export function describeCloudBackupStrategy() {
  return [
    "Encrypt backup JSON locally.",
    "Upload to Supabase Storage or Firebase Storage.",
    "Store backup_code, user_id, qbank_id, and path in backups table.",
    "Admin can restore by entering backup_code on a new device.",
  ];
}
