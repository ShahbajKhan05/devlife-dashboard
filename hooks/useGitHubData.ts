"use client";

import { useCallback, useEffect, useState } from "react";
import { isGitHubData, type GitHubData } from "@/lib/github";

type GitHubState = {
  data: GitHubData | null;
  error: string | null;
  loading: boolean;
};

export function useGitHubData(): GitHubState & { reload: () => void } {
  const [state, setState] = useState<GitHubState>({
    data: null,
    error: null,
    loading: true,
  });
  const [requestId, setRequestId] = useState(0);

  const reload = useCallback(() => {
    setState((current) => ({
      ...current,
      error: null,
      loading: true,
    }));
    setRequestId((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGitHubData() {
      try {
        const response = await fetch("/api/github", {
          signal: controller.signal,
        });
        const result: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "GitHub data could not be loaded.";

          throw new Error(message);
        }

        if (!isGitHubData(result)) {
          throw new Error("GitHub returned data in an unexpected format.");
        }

        setState({ data: result, error: null, loading: false });
      } catch (error) {
        if (controller.signal.aborted) return;

        setState({
          data: null,
          error:
            error instanceof Error
              ? error.message
              : "GitHub data could not be loaded.",
          loading: false,
        });
      }
    }

    void loadGitHubData();

    return () => controller.abort();
  }, [reload, requestId]);

  return { ...state, reload };
}
