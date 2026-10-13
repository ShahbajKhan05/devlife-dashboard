export type DailyLogEntry = {
  id: string;
  date: string;
  title: string;
  notes: string;
  minutes: number;
};

const STORAGE_KEY = "devlife-daily-logs";
const CHANGE_EVENT = "devlife:daily-logs-change";
export const STORAGE_READ_ERROR = "\u0000devlife-storage-read-error";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getDailyLogsSnapshot(): string {
  if (typeof window === "undefined") return "[]";

  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return STORAGE_READ_ERROR;
  }
}

export function getServerDailyLogsSnapshot(): string {
  return "[]";
}

export function subscribeToDailyLogs(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function saveDailyLogs(entries: DailyLogEntry[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function isDailyLogEntry(value: unknown): value is DailyLogEntry {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.date === "string" &&
    typeof value.title === "string" &&
    typeof value.notes === "string" &&
    typeof value.minutes === "number" &&
    Number.isFinite(value.minutes)
  );
}

export function parseDailyLogs(snapshot: string): {
  entries: DailyLogEntry[];
  error: string | null;
} {
  if (snapshot === STORAGE_READ_ERROR) {
    return {
      entries: [],
      error: "Browser storage is unavailable. Your saved entries cannot be read.",
    };
  }

  try {
    const parsed: unknown = JSON.parse(snapshot);

    if (!Array.isArray(parsed) || !parsed.every(isDailyLogEntry)) {
      return {
        entries: [],
        error: "Saved coding entries could not be read because their format is invalid.",
      };
    }

    return { entries: parsed, error: null };
  } catch {
    return {
      entries: [],
      error: "Saved coding entries could not be read because their data is invalid.",
    };
  }
}
