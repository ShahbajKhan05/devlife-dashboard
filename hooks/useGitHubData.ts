"use client";

import { useCallback, useEffect, useState } from "react";
import { isGitHubData, type GitHubData } from "@/lib/github";

type GitHubState = {
  data: GitHubData | null;
  error: string | null;
  loading: boolean;
  rateLimited: boolean;
  retryAt: string | null;
  requestKey: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function useGitHubData(year?: number): GitHubState & {
  reload: () => void;
} {
  const [state, setState] = useState<GitHubState>({
    data: null,
    error: null,
    loading: true,
    rateLimited: false,
    retryAt: null,
    requestKey: "",
  });
  const [requestId, setRequestId] = useState(0);
  const requestKey = `${year ?? "current"}:${requestId}`;

  const reload = useCallback(() => {
    setRequestId((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const url =
      year === undefined ? "/api/github" : `/api/github?year=${year}`;

    async function loadGitHubData() {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });
        const result: unknown = await response.json();

        if (!response.ok) {
          const payload = isRecord(result) ? result : null;
          const message =
            payload && typeof payload.error === "string"
              ? payload.error
              : "GitHub data could not be loaded.";

          setState({
            data: null,
            error: message,
            loading: false,
            rateLimited: payload?.rateLimited === true,
            retryAt:
              payload && typeof payload.retryAt === "string"
                ? payload.retryAt
                : null,
            requestKey,
          });
          return;
        }

        if (!isGitHubData(result)) {
          throw new Error("GitHub returned data in an unexpected format.");
        }

        setState({
          data: result,
          error: null,
          loading: false,
          rateLimited: false,
          retryAt: null,
          requestKey,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setState({
          data: null,
          error:
            error instanceof Error
              ? error.message
              : "GitHub data could not be loaded.",
          loading: false,
          rateLimited: false,
          retryAt: null,
          requestKey,
        });
      }
    }

    void loadGitHubData();

    return () => controller.abort();
  }, [requestKey, year]);

  if (state.requestKey !== requestKey) {
    return {
      data: null,
      error: null,
      loading: true,
      rateLimited: false,
      retryAt: null,
      requestKey,
      reload,
    };
  }

  return { ...state, reload };
}
