export type GitHubRepositoryLanguage = {
  name: string;
  bytes: number;
};

export type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  visibility: string;
  isFork: boolean;
  isArchived: boolean;
  languages: GitHubRepositoryLanguage[] | null;
};

export type GitHubContributionDay = {
  date: string;
  count: number;
  weekday: number;
  color: string;
};

export type GitHubContributionCalendar = {
  year: number;
  available: boolean;
  totalContributions: number | null;
  weeks: { contributionDays: GitHubContributionDay[] }[];
  error: string | null;
  rateLimited: boolean;
  retryAt: string | null;
};

export type GitHubRecentCommit = {
  sha: string;
  message: string;
  repository: string;
  repositoryUrl: string;
  pushedAt: string;
  url: string;
};

export type GitHubRecentEvent = {
  id: string;
  type: string;
  action: string | null;
  title: string | null;
  repository: string;
  repositoryUrl: string;
  occurredAt: string;
  url: string;
};

export type GitHubActivity = {
  commits: GitHubRecentCommit[];
  events: GitHubRecentEvent[];
  error: string | null;
  rateLimited: boolean;
  retryAt: string | null;
};

export type GitHubData = {
  username: string;
  name: string | null;
  bio: string | null;
  avatar: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  topLanguages: { name: string; count: number }[];
  repositories: GitHubRepository[];
  contributions: GitHubContributionCalendar;
  activity: GitHubActivity;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringOrNull(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isRepositoryLanguage(
  value: unknown
): value is GitHubRepositoryLanguage {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.bytes === "number" &&
    Number.isFinite(value.bytes) &&
    value.bytes >= 0
  );
}

function isRepository(value: unknown): value is GitHubRepository {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    isStringOrNull(value.description) &&
    typeof value.url === "string" &&
    isStringOrNull(value.homepage) &&
    isStringOrNull(value.language) &&
    typeof value.stars === "number" &&
    typeof value.forks === "number" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    Array.isArray(value.topics) &&
    value.topics.every((topic) => typeof topic === "string") &&
    typeof value.visibility === "string" &&
    typeof value.isFork === "boolean" &&
    typeof value.isArchived === "boolean" &&
    (value.languages === null ||
      (Array.isArray(value.languages) &&
        value.languages.every(isRepositoryLanguage)))
  );
}

function isContributionDay(value: unknown): value is GitHubContributionDay {
  return (
    isRecord(value) &&
    typeof value.date === "string" &&
    typeof value.count === "number" &&
    Number.isFinite(value.count) &&
    typeof value.weekday === "number" &&
    typeof value.color === "string"
  );
}

function isContributionCalendar(
  value: unknown
): value is GitHubContributionCalendar {
  return (
    isRecord(value) &&
    typeof value.year === "number" &&
    typeof value.available === "boolean" &&
    (value.totalContributions === null ||
      (typeof value.totalContributions === "number" &&
        Number.isFinite(value.totalContributions))) &&
    Array.isArray(value.weeks) &&
    value.weeks.every(
      (week) =>
        isRecord(week) &&
        Array.isArray(week.contributionDays) &&
        week.contributionDays.every(isContributionDay)
    ) &&
    isStringOrNull(value.error) &&
    typeof value.rateLimited === "boolean" &&
    isStringOrNull(value.retryAt)
  );
}

function isRecentCommit(value: unknown): value is GitHubRecentCommit {
  return (
    isRecord(value) &&
    typeof value.sha === "string" &&
    typeof value.message === "string" &&
    typeof value.repository === "string" &&
    typeof value.repositoryUrl === "string" &&
    typeof value.pushedAt === "string" &&
    typeof value.url === "string"
  );
}

function isRecentEvent(value: unknown): value is GitHubRecentEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    isStringOrNull(value.action) &&
    isStringOrNull(value.title) &&
    typeof value.repository === "string" &&
    typeof value.repositoryUrl === "string" &&
    typeof value.occurredAt === "string" &&
    typeof value.url === "string"
  );
}

function isActivity(value: unknown): value is GitHubActivity {
  return (
    isRecord(value) &&
    Array.isArray(value.commits) &&
    value.commits.every(isRecentCommit) &&
    Array.isArray(value.events) &&
    value.events.every(isRecentEvent) &&
    isStringOrNull(value.error) &&
    typeof value.rateLimited === "boolean" &&
    isStringOrNull(value.retryAt)
  );
}

export function isGitHubData(value: unknown): value is GitHubData {
  return (
    isRecord(value) &&
    typeof value.username === "string" &&
    isStringOrNull(value.name) &&
    isStringOrNull(value.bio) &&
    typeof value.avatar === "string" &&
    typeof value.profileUrl === "string" &&
    typeof value.publicRepos === "number" &&
    typeof value.followers === "number" &&
    typeof value.following === "number" &&
    typeof value.totalStars === "number" &&
    typeof value.totalForks === "number" &&
    Array.isArray(value.topLanguages) &&
    value.topLanguages.every(
      (language) =>
        isRecord(language) &&
        typeof language.name === "string" &&
        typeof language.count === "number"
    ) &&
    Array.isArray(value.repositories) &&
    value.repositories.every(isRepository) &&
    isContributionCalendar(value.contributions) &&
    isActivity(value.activity)
  );
}
