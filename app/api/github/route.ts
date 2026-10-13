import { connection, NextResponse } from "next/server";
import type {
  GitHubActivity,
  GitHubContributionCalendar,
  GitHubContributionDay,
  GitHubRecentCommit,
  GitHubRecentEvent,
  GitHubRepository,
  GitHubRepositoryLanguage,
} from "@/lib/github";

const username = "ShahbajKhan05";
const githubApi = "https://api.github.com";
const githubGraphql = "https://api.github.com/graphql";
const responseCache =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=600";
const noStore = { "Cache-Control": "no-store" };

type GitHubApiRepository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  visibility: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
};

type GitHubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
};

type UpstreamError = {
  message: string;
  rateLimited: boolean;
  retryAt: string | null;
};

type GraphQLDetails = {
  contributions: GitHubContributionCalendar;
  repositoryLanguages: Map<string, GitHubRepositoryLanguage[]>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isProfile(value: unknown): value is GitHubProfile {
  return (
    isRecord(value) &&
    typeof value.login === "string" &&
    isNullableString(value.name) &&
    isNullableString(value.bio) &&
    typeof value.avatar_url === "string" &&
    typeof value.html_url === "string" &&
    typeof value.public_repos === "number" &&
    typeof value.followers === "number" &&
    typeof value.following === "number"
  );
}

function isRepository(value: unknown): value is GitHubApiRepository {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.full_name === "string" &&
    isNullableString(value.description) &&
    typeof value.html_url === "string" &&
    isNullableString(value.homepage) &&
    isNullableString(value.language) &&
    typeof value.stargazers_count === "number" &&
    typeof value.forks_count === "number" &&
    typeof value.created_at === "string" &&
    typeof value.updated_at === "string" &&
    Array.isArray(value.topics) &&
    value.topics.every((topic) => typeof topic === "string") &&
    typeof value.visibility === "string" &&
    typeof value.fork === "boolean" &&
    typeof value.archived === "boolean" &&
    typeof value.private === "boolean"
  );
}

function getRetryAt(response: Response): string | null {
  const reset = response.headers.get("x-ratelimit-reset");
  if (reset && /^\d+$/.test(reset)) {
    return new Date(Number(reset) * 1000).toISOString();
  }

  const retryAfter = response.headers.get("retry-after");
  if (!retryAfter) return null;

  if (/^\d+$/.test(retryAfter)) {
    return new Date(Date.now() + Number(retryAfter) * 1000).toISOString();
  }

  const retryDate = new Date(retryAfter);
  return Number.isNaN(retryDate.getTime()) ? null : retryDate.toISOString();
}

async function getUpstreamError(response: Response): Promise<UpstreamError> {
  let upstreamMessage = "";

  try {
    const body: unknown = await response.clone().json();
    const message = isRecord(body) ? body.message : null;
    if (typeof message === "string") upstreamMessage = message;
  } catch {
    upstreamMessage = "";
  }

  const rateLimited =
    response.status === 429 ||
    (response.status === 403 &&
      (response.headers.get("x-ratelimit-remaining") === "0" ||
        /rate limit|secondary rate/i.test(upstreamMessage)));
  const retryAt = rateLimited ? getRetryAt(response) : null;

  if (rateLimited) {
    return {
      message: retryAt
        ? `GitHub API rate limit reached. Try again after ${retryAt}.`
        : "GitHub API rate limit reached. Please try again later.",
      rateLimited: true,
      retryAt,
    };
  }

  return {
    message: `GitHub public data request failed (HTTP ${response.status}).`,
    rateLimited: false,
    retryAt: null,
  };
}

function getHeaders(token?: string): Headers {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

async function fetchPublicApi(url: string, token?: string): Promise<Response> {
  const response = await fetch(url, {
    headers: getHeaders(token),
    cache: "no-store",
  });
  if (!token || (response.status !== 401 && response.status !== 403)) {
    return response;
  }

  const error = await getUpstreamError(response);
  if (error.rateLimited) return response;

  return fetch(url, {
    headers: getHeaders(),
    cache: "no-store",
  });
}

async function fetchPublicRepositories(
  token?: string
): Promise<{
  repositories: GitHubApiRepository[];
  error: Response | null;
  malformed: boolean;
}> {
  const repositories: GitHubApiRepository[] = [];
  let page = 1;

  while (true) {
    const response = await fetchPublicApi(
      `${githubApi}/users/${username}/repos?type=public&per_page=100&sort=updated&page=${page}`,
      token
    );
    if (!response.ok) {
      return { repositories, error: response, malformed: false };
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload) || !payload.every(isRepository)) {
      return { repositories, error: null, malformed: true };
    }

    const publicRepositories = payload.filter(
      (repository) => !repository.private && repository.visibility === "public"
    );
    repositories.push(...publicRepositories);
    if (payload.length < 100) {
      return { repositories, error: null, malformed: false };
    }
    page += 1;
  }
}

function unavailableContributions(
  year: number,
  message: string,
  rateLimited = false,
  retryAt: string | null = null
): GitHubContributionCalendar {
  return {
    year,
    available: false,
    totalContributions: null,
    weeks: [],
    error: message,
    rateLimited,
    retryAt,
  };
}

function readRepositoryLanguages(
  value: unknown
): Map<string, GitHubRepositoryLanguage[]> {
  const result = new Map<string, GitHubRepositoryLanguage[]>();
  const nodes = isRecord(value) && Array.isArray(value.nodes) ? value.nodes : [];

  for (const node of nodes) {
    if (!isRecord(node) || typeof node.nameWithOwner !== "string") continue;
    const languageConnection = isRecord(node.languages) ? node.languages : null;
    const edges =
      languageConnection && Array.isArray(languageConnection.edges)
        ? languageConnection.edges
        : [];
    const languages: GitHubRepositoryLanguage[] = [];

    for (const edge of edges) {
      if (!isRecord(edge) || typeof edge.size !== "number") continue;
      const language = isRecord(edge.node) ? edge.node.name : null;
      if (typeof language === "string" && Number.isFinite(edge.size)) {
        languages.push({ name: language, bytes: edge.size });
      }
    }

    result.set(node.nameWithOwner.toLowerCase(), languages);
  }

  return result;
}

function readContributionCalendar(
  user: Record<string, unknown>,
  year: number
): GitHubContributionCalendar | null {
  const collection = isRecord(user.contributionsCollection)
    ? user.contributionsCollection
    : null;
  const calendar =
    collection && isRecord(collection.contributionCalendar)
      ? collection.contributionCalendar
      : null;
  if (
    !calendar ||
    typeof calendar.totalContributions !== "number" ||
    !Array.isArray(calendar.weeks)
  ) {
    return null;
  }

  const weeks: { contributionDays: GitHubContributionDay[] }[] = [];
  for (const week of calendar.weeks) {
    if (!isRecord(week) || !Array.isArray(week.contributionDays)) return null;
    const contributionDays: GitHubContributionDay[] = [];

    for (const day of week.contributionDays) {
      if (
        !isRecord(day) ||
        typeof day.date !== "string" ||
        typeof day.contributionCount !== "number" ||
        typeof day.weekday !== "number" ||
        typeof day.color !== "string"
      ) {
        return null;
      }
      contributionDays.push({
        date: day.date,
        count: day.contributionCount,
        weekday: day.weekday,
        color: day.color,
      });
    }
    weeks.push({ contributionDays });
  }

  return {
    year,
    available: true,
    totalContributions: calendar.totalContributions,
    weeks,
    error: null,
    rateLimited: false,
    retryAt: null,
  };
}

async function fetchGraphQLDetails(
  token: string | undefined,
  year: number
): Promise<GraphQLDetails> {
  if (!token) {
    return {
      contributions: unavailableContributions(
        year,
        "Contribution totals and detailed repository languages require a server-side GITHUB_TOKEN."
      ),
      repositoryLanguages: new Map(),
    };
  }

  const currentYear = new Date().getUTCFullYear();
  const from = `${year}-01-01T00:00:00Z`;
  const to =
    year === currentYear
      ? new Date().toISOString()
      : `${year}-12-31T23:59:59Z`;
  const query = `
    query PortfolioGitHub($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(
          from: $from
          to: $to
          includePrivateContributions: false
        ) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                weekday
                color
              }
            }
          }
        }
        repositories(
          first: 100
          ownerAffiliations: [OWNER]
          privacy: PUBLIC
          orderBy: { field: UPDATED_AT, direction: DESC }
        ) {
          nodes {
            nameWithOwner
            languages(first: 100, orderBy: { field: SIZE, direction: DESC }) {
              edges {
                size
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(githubGraphql, {
      method: "POST",
      headers: {
        ...Object.fromEntries(getHeaders(token).entries()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { login: username, from, to },
      }),
      cache: "no-store",
    });

    const body: unknown = await response.json();
    const bodyRecord = isRecord(body) ? body : null;
    const errors = bodyRecord && Array.isArray(bodyRecord.errors)
      ? bodyRecord.errors
      : [];
    const firstError =
      errors.length > 0 && isRecord(errors[0]) ? errors[0].message : null;
    const upstreamMessage =
      typeof firstError === "string" ? firstError : "";
    const rateLimited =
      response.status === 429 ||
      response.headers.get("x-ratelimit-remaining") === "0" ||
      /rate limit/i.test(upstreamMessage);
    const retryAt = rateLimited ? getRetryAt(response) : null;

    if (!response.ok || errors.length > 0 || !bodyRecord) {
      const message = rateLimited
        ? "GitHub GraphQL rate limit reached. Contribution totals and detailed language data are temporarily unavailable."
        : response.status === 401 || response.status === 403
          ? "GitHub GraphQL authorization failed. Check the server-side GITHUB_TOKEN permissions."
          : `GitHub GraphQL could not load contributions and detailed languages (HTTP ${response.status || 502}).`;

      return {
        contributions: unavailableContributions(
          year,
          message,
          rateLimited,
          retryAt
        ),
        repositoryLanguages: new Map(),
      };
    }

    const data = isRecord(bodyRecord.data) ? bodyRecord.data : null;
    const user = data && isRecord(data.user) ? data.user : null;
    if (!user) {
      return {
        contributions: unavailableContributions(
          year,
          "GitHub did not return contribution data for this public profile."
        ),
        repositoryLanguages: new Map(),
      };
    }

    const contributions = readContributionCalendar(user, year);
    return {
      contributions:
        contributions ??
        unavailableContributions(
          year,
          "GitHub returned an unexpected contribution calendar response."
        ),
      repositoryLanguages: readRepositoryLanguages(user.repositories),
    };
  } catch {
    return {
      contributions: unavailableContributions(
        year,
        "Could not connect to GitHub GraphQL for contribution and language details."
      ),
      repositoryLanguages: new Map(),
    };
  }
}

function parseRecentActivity(value: unknown): GitHubActivity | null {
  if (!Array.isArray(value)) return null;

  const commits: GitHubRecentCommit[] = [];
  const events: GitHubRecentEvent[] = [];

  for (const event of value) {
    if (!isRecord(event)) continue;
    const eventId = typeof event.id === "string" ? event.id : null;
    const eventType = typeof event.type === "string" ? event.type : null;
    const createdAt =
      typeof event.created_at === "string" ? event.created_at : null;
    const repo = isRecord(event.repo) ? event.repo : null;
    const repoName = repo && typeof repo.name === "string" ? repo.name : null;
    const payload = isRecord(event.payload) ? event.payload : null;
    if (!eventId || !eventType || !createdAt || !repoName || !payload) continue;

    const repositoryUrl = `https://github.com/${repoName}`;
    if (eventType === "PushEvent") {
      const eventCommits = Array.isArray(payload.commits)
        ? payload.commits
        : [];
      for (const item of [...eventCommits].reverse()) {
        if (!isRecord(item)) continue;
        const sha = typeof item.sha === "string" ? item.sha : null;
        const message = typeof item.message === "string" ? item.message : null;
        if (!sha || !message) continue;
        commits.push({
          sha,
          message,
          repository: repoName,
          repositoryUrl,
          pushedAt: createdAt,
          url: `${repositoryUrl}/commit/${encodeURIComponent(sha)}`,
        });
        if (commits.length >= 12) break;
      }
      continue;
    }

    const eventKinds: Record<string, string> = {
      IssuesEvent: "Issue",
      IssueCommentEvent: "Issue comment",
      PullRequestEvent: "Pull request",
      PullRequestReviewEvent: "Pull request review",
      ReleaseEvent: "Release",
    };
    const label = eventKinds[eventType];
    if (!label) continue;

    const entity =
      isRecord(payload.issue)
        ? payload.issue
        : isRecord(payload.pull_request)
          ? payload.pull_request
          : null;
    const title = entity && typeof entity.title === "string" ? entity.title : null;
    const url =
      entity && typeof entity.html_url === "string"
        ? entity.html_url
        : repositoryUrl;

    events.push({
      id: eventId,
      type: label,
      action: typeof payload.action === "string" ? payload.action : null,
      title,
      repository: repoName,
      repositoryUrl,
      occurredAt: createdAt,
      url,
    });
  }

  return {
    commits: commits.slice(0, 12),
    events: events.slice(0, 12),
    error: null,
    rateLimited: false,
    retryAt: null,
  };
}

export async function GET(request: Request) {
  await connection();

  const currentYear = new Date().getUTCFullYear();
  const requestedYear = new URL(request.url).searchParams.get("year");
  const year =
    requestedYear === null
      ? currentYear
      : /^\d{4}$/.test(requestedYear)
        ? Number(requestedYear)
        : NaN;

  if (!Number.isInteger(year) || year < 2008 || year > currentYear) {
    return NextResponse.json(
      {
        error: `Choose a contribution year from 2008 through ${currentYear}.`,
        rateLimited: false,
        retryAt: null,
      },
      { status: 400, headers: noStore }
    );
  }

  const token = process.env.GITHUB_TOKEN;

  try {
    const [profileResponse, repositoryResult, activityResponse, graphDetails] =
      await Promise.all([
        fetchPublicApi(`${githubApi}/users/${username}`, token),
        fetchPublicRepositories(token),
        fetchPublicApi(
          `${githubApi}/users/${username}/events/public?per_page=30`,
          token
        ),
        fetchGraphQLDetails(token, year),
      ]);

    if (!profileResponse.ok || repositoryResult.error) {
      const failedResponse =
        !profileResponse.ok ? profileResponse : repositoryResult.error;
      if (!failedResponse) {
        return NextResponse.json(
          {
            error: "GitHub public profile data could not be loaded.",
            rateLimited: false,
            retryAt: null,
          },
          { status: 502, headers: noStore }
        );
      }

      const details = await getUpstreamError(failedResponse);
      const notFound = failedResponse.status === 404;
      console.error("GitHub public profile request failed:", {
        status: failedResponse.status,
        rateLimited: details.rateLimited,
      });

      return NextResponse.json(
        {
          error: notFound
            ? "The requested GitHub profile could not be found."
            : details.message,
          rateLimited: details.rateLimited,
          retryAt: details.retryAt,
        },
        {
          status: notFound ? 404 : details.rateLimited ? 429 : 502,
          headers: noStore,
        }
      );
    }

    if (repositoryResult.malformed) {
      return NextResponse.json(
        {
          error: "GitHub returned repository data in an unexpected format.",
          rateLimited: false,
          retryAt: null,
        },
        { status: 502, headers: noStore }
      );
    }

    const profilePayload: unknown = await profileResponse.json();
    if (!isProfile(profilePayload)) {
      return NextResponse.json(
        {
          error: "GitHub returned profile data in an unexpected format.",
          rateLimited: false,
          retryAt: null,
        },
        { status: 502, headers: noStore }
      );
    }

    const repositories: GitHubRepository[] = repositoryResult.repositories
      .sort((first, second) => second.stargazers_count - first.stargazers_count)
      .map((repository) => ({
        id: repository.id,
        name: repository.name,
        description: repository.description,
        url: repository.html_url,
        homepage: repository.homepage,
        language: repository.language,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        createdAt: repository.created_at,
        updatedAt: repository.updated_at,
        topics: repository.topics,
        visibility: repository.visibility,
        isFork: repository.fork,
        isArchived: repository.archived,
        languages:
          graphDetails.repositoryLanguages.get(repository.full_name.toLowerCase()) ??
          null,
      }));

    const languageCounts: Record<string, number> = {};
    for (const repository of repositories) {
      if (repository.language) {
        languageCounts[repository.language] =
          (languageCounts[repository.language] ?? 0) + 1;
      }
    }

    let activity: GitHubActivity;
    if (!activityResponse.ok) {
      const details = await getUpstreamError(activityResponse);
      activity = {
        commits: [],
        events: [],
        error: details.message,
        rateLimited: details.rateLimited,
        retryAt: details.retryAt,
      };
    } else {
      const activityPayload: unknown = await activityResponse.json();
      activity =
        parseRecentActivity(activityPayload) ?? {
          commits: [],
          events: [],
          error: "GitHub returned recent activity in an unexpected format.",
          rateLimited: false,
          retryAt: null,
        };
    }

    return NextResponse.json(
      {
        username: profilePayload.login,
        name: profilePayload.name,
        bio: profilePayload.bio,
        avatar: profilePayload.avatar_url,
        profileUrl: profilePayload.html_url,
        publicRepos: profilePayload.public_repos,
        followers: profilePayload.followers,
        following: profilePayload.following,
        totalStars: repositories.reduce(
          (total, repository) => total + repository.stars,
          0
        ),
        totalForks: repositories.reduce(
          (total, repository) => total + repository.forks,
          0
        ),
        topLanguages: Object.entries(languageCounts)
          .sort((first, second) => second[1] - first[1])
          .map(([name, count]) => ({ name, count })),
        repositories,
        contributions: graphDetails.contributions,
        activity,
      },
      {
        headers: { "Cache-Control": responseCache },
      }
    );
  } catch {
    console.error("GitHub data request failed before a response could be assembled.");
    return NextResponse.json(
      {
        error: "Could not connect to GitHub. Please try again.",
        rateLimited: false,
        retryAt: null,
      },
      { status: 502, headers: noStore }
    );
  }
}
