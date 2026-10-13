export type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
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
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isRepository(value: unknown): value is GitHubRepository {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    isNullableString(value.description) &&
    typeof value.url === "string" &&
    isNullableString(value.homepage) &&
    isNullableString(value.language) &&
    typeof value.stars === "number" &&
    typeof value.forks === "number"
  );
}

export function isGitHubData(value: unknown): value is GitHubData {
  return (
    isRecord(value) &&
    typeof value.username === "string" &&
    isNullableString(value.name) &&
    isNullableString(value.bio) &&
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
    value.repositories.every(isRepository)
  );
}
