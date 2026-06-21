import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";

export interface ImportResult {
  qbankId: number;
  dbPath: string;
  mediaRoot: string;
  missingMedia: string[];
  importedAt: string;
}

export interface ExternalTableMap {
  oldQuestionsTable: string;
  oldAnswersTable: string;
  oldMediaTable?: string;
  qidColumn: string;
  stemColumn: string;
  explanationColumn: string;
}

const QBANK_ROOT = `${FileSystem.documentDirectory ?? ""}storage/qbanks`;

export async function pickQBankDatabase() {
  return DocumentPicker.getDocumentAsync({
    type: ["application/x-sqlite3", "application/octet-stream", "*/*"],
    copyToCacheDirectory: true,
  });
}

export async function createIsolatedQBankFolder(qbankId: number) {
  const base = `${QBANK_ROOT}/qbank_${qbankId}`;
  const folders = [
    base,
    `${base}/media`,
    `${base}/media/questions`,
    `${base}/media/explanations`,
    `${base}/media/tables`,
    `${base}/media/references`,
    `${base}/media/labs`,
    `${base}/media/audio`,
    `${base}/media/video`,
    `${base}/media/pdf`,
  ];

  for (const folder of folders) {
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
  }

  return base;
}

export async function importExternalQBank(params: {
  qbankId: number;
  sourceDbUri: string;
  mediaFileUris: string[];
  tableMap: ExternalTableMap;
}): Promise<ImportResult> {
  const base = await createIsolatedQBankFolder(params.qbankId);
  const dbPath = `${base}/qbank.db`;
  await FileSystem.copyAsync({ from: params.sourceDbUri, to: dbPath });

  const missingMedia: string[] = [];
  for (const uri of params.mediaFileUris) {
    const fileName = uri.split("/").pop();
    if (!fileName) {
      missingMedia.push(uri);
      continue;
    }
    await FileSystem.copyAsync({
      from: uri,
      to: `${base}/media/questions/${fileName}`,
    });
  }

  return {
    qbankId: params.qbankId,
    dbPath,
    mediaRoot: `${base}/media`,
    missingMedia,
    importedAt: new Date().toISOString(),
  };
}

export function buildMediaFolderStructure() {
  return [
    "/storage/qbanks/qbank_1/qbank.db",
    "/storage/qbanks/qbank_1/media/questions",
    "/storage/qbanks/qbank_1/media/explanations",
    "/storage/qbanks/qbank_1/media/tables",
    "/storage/qbanks/qbank_1/media/references",
    "/storage/qbanks/qbank_1/media/labs",
    "/storage/qbanks/qbank_1/media/audio",
    "/storage/qbanks/qbank_1/media/video",
    "/storage/qbanks/qbank_1/media/pdf",
  ];
}
