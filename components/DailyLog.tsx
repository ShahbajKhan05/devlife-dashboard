"use client";

import Link from "next/link";
import { ArrowRight, Clock3, NotebookPen } from "lucide-react";
import { useSyncExternalStore, useState } from "react";
import {
  getDailyLogsSnapshot,
  getServerDailyLogsSnapshot,
  parseDailyLogs,
  saveDailyLogs,
  subscribeToDailyLogs,
  type DailyLogEntry,
} from "@/lib/daily-log";

function subscribeToNothing(): () => void {
  return () => {};
}

function getHydratedSnapshot(): boolean {
  return true;
}

function getServerHydratedSnapshot(): boolean {
  return false;
}

function getTodaySnapshot(): string {
  return new Date().toLocaleDateString("en-CA");
}

function getServerTodaySnapshot(): string {
  return "";
}

function useDailyLogs() {
  const snapshot = useSyncExternalStore(
    subscribeToDailyLogs,
    getDailyLogsSnapshot,
    getServerDailyLogsSnapshot
  );
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getServerHydratedSnapshot
  );

  return { ...parseDailyLogs(snapshot), hydrated };
}

export function DailyLogPreview() {
  const { entries, error, hydrated } = useDailyLogs();
  const totalMinutes = entries.reduce((total, entry) => total + entry.minutes, 0);
  const recentEntry = entries[0];

  return (
    <section aria-label="Daily coding log summary">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#80631F]">
            Daily progress
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
            Coding log
          </h2>
        </div>
        <Link
          href="/daily-log"
          className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-bold text-[#785C19] hover:bg-[#F8F0C9]"
        >
          Open full log
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <div className="grid gap-3 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#F8F0C9] text-[#80631F]">
            <NotebookPen aria-hidden="true" size={19} />
          </span>
          <div className="min-w-0">
            <p className="font-bold">
              {recentEntry ? recentEntry.title : "No coding entries yet"}
            </p>
            <p className="mt-1 text-sm leading-5 text-[#625D4C]">
              {error
                ? error
                : !hydrated
                  ? "Loading your saved entries…"
                  : recentEntry
                    ? `${recentEntry.date} · ${recentEntry.minutes} minutes`
                    : "Add a short note about what you worked on today."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#625D4C] sm:justify-end">
          <span>{entries.length} entries</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 aria-hidden="true" size={15} />
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </span>
        </div>
      </div>
    </section>
  );
}

export default function DailyLog() {
  const { entries, error: readError, hydrated } = useDailyLogs();
  const today = useSyncExternalStore(
    subscribeToNothing,
    getTodaySnapshot,
    getServerTodaySnapshot
  );
  const [dateOverride, setDateOverride] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [minutes, setMinutes] = useState("60");
  const [formError, setFormError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const date = dateOverride ?? today;
  const totalMinutes = entries.reduce((total, entry) => total + entry.minutes, 0);

  function addLog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setStorageError(null);

    const duration = Number(minutes);
    if (
      !title.trim() ||
      !date ||
      !Number.isInteger(duration) ||
      duration < 0 ||
      duration > 1440
    ) {
      setFormError("Enter a date, a title, and a whole number of minutes from 0 to 1440.");
      return;
    }

    const entry: DailyLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date,
      title: title.trim(),
      notes: notes.trim(),
      minutes: duration,
    };

    try {
      saveDailyLogs(
        [...entries, entry].sort((first, second) =>
          second.date.localeCompare(first.date)
        )
      );
      setTitle("");
      setNotes("");
      setMinutes("60");
    } catch {
      setStorageError("Your entry could not be saved. Check browser storage settings.");
    }
  }

  function deleteLog(id: string) {
    setStorageError(null);

    try {
      saveDailyLogs(entries.filter((entry) => entry.id !== id));
    } catch {
      setStorageError("This entry could not be deleted. Check browser storage settings.");
    }
  }

  return (
    <section aria-label="Coding entries">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <article className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-3 sm:p-4">
          <p className="text-sm text-[#625D4C]">Total entries</p>
          <p className="mt-1 text-2xl font-black tabular-nums">{entries.length}</p>
        </article>
        <article className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-3 sm:p-4">
          <p className="text-sm text-[#625D4C]">Total coding time</p>
          <p className="mt-1 text-xl font-black tabular-nums sm:text-2xl">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </p>
        </article>
      </div>

      <form
        onSubmit={addLog}
        className="space-y-4 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDateOverride(event.target.value)}
              required
              className="mt-1.5 min-h-11 w-full min-w-0 rounded-lg border border-[#DCCB91] bg-white px-3 text-base outline-none focus:border-[#B08D35] focus:ring-2 focus:ring-[#B08D35]/20"
            />
          </label>

          <label className="block text-sm font-semibold">
            Minutes spent
            <input
              type="number"
              min="0"
              max="1440"
              step="1"
              value={minutes}
              onChange={(event) => setMinutes(event.target.value)}
              required
              className="mt-1.5 min-h-11 w-full min-w-0 rounded-lg border border-[#DCCB91] bg-white px-3 text-base outline-none focus:border-[#B08D35] focus:ring-2 focus:ring-[#B08D35]/20"
            />
          </label>
        </div>

        <label className="block text-sm font-semibold">
          What did you work on?
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Built a responsive dashboard"
            maxLength={120}
            required
            className="mt-1.5 min-h-11 w-full min-w-0 rounded-lg border border-[#DCCB91] bg-white px-3 text-base outline-none focus:border-[#B08D35] focus:ring-2 focus:ring-[#B08D35]/20"
          />
        </label>

        <label className="block text-sm font-semibold">
          Notes and learnings
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="What did you learn or finish today?"
            rows={3}
            maxLength={1000}
            className="mt-1.5 w-full min-w-0 resize-y rounded-lg border border-[#DCCB91] bg-white px-3 py-2.5 text-base outline-none focus:border-[#B08D35] focus:ring-2 focus:ring-[#B08D35]/20"
          />
        </label>

        {(formError || storageError || readError) && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {formError || storageError || readError}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#191919] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#423A28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35] sm:w-auto"
        >
          Add coding entry
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#80631F]">
                {entry.date}
              </p>
              <h2 className="mt-1 break-words font-bold">{entry.title}</h2>
              {entry.notes && (
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-[#625D4C]">
                  {entry.notes}
                </p>
              )}
              <p className="mt-2 text-sm text-[#625D4C]">
                {entry.minutes} minutes
              </p>
            </div>
            <button
              type="button"
              onClick={() => deleteLog(entry.id)}
              aria-label={`Delete ${entry.title}`}
              className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
            >
              Delete
            </button>
          </article>
        ))}

        {hydrated && !readError && entries.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#DCCB91] bg-[#FFFDF0]/70 p-5 text-center">
            <p className="font-bold">No entries yet</p>
            <p className="mt-1 text-sm text-[#625D4C]">
              Add your first coding entry using the form above.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
