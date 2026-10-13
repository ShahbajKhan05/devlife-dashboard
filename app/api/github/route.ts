
import { connection, NextResponse } from "next/server";

const username = "ShahbajKhan05";

export async function GET() {
  await connection();

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const options = {
      headers,
      cache: "no-store" as const,
    };

    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, options),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        options
      ),
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      const userStatus = userResponse.status;
      const repositoriesStatus = reposResponse.status;
      const rateLimited = userStatus === 403 || repositoriesStatus === 403;

      console.error("GitHub API upstream request failed:", {
        userStatus,
        repositoriesStatus,
      });

      return NextResponse.json(
        {
          error: rateLimited
            ? "GitHub returned HTTP 403. The request may be rate-limited or the server-side token may not be accepted."
            : `GitHub data could not be loaded (profile ${userStatus}, repositories ${repositoriesStatus}).`,
        },
        { status: userResponse.status === 404 ? 404 : 502 }
      );
    }

    const user = await userResponse.json();
    const repos = await reposResponse.json();

    if (!Array.isArray(repos)) {
      return NextResponse.json(
        { error: "Unexpected response from GitHub." },
        { status: 502 }
      );
    }

    const publicRepos = repos.filter(
      (repo) => !repo.private && !repo.fork
    );

    const languages: Record<string, number> = {};

    for (const repo of publicRepos) {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] ?? 0) + 1;
      }
    }

    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const repositories = [...publicRepos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      }));

    return NextResponse.json({
      username: user.login,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar_url,
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars: publicRepos.reduce(
        (total, repo) => total + repo.stargazers_count,
        0
      ),
      totalForks: publicRepos.reduce(
        (total, repo) => total + repo.forks_count,
        0
      ),
      topLanguages,
      repositories,
    });
  } catch (error) {
    console.error("GitHub API route failed:", error);

    return NextResponse.json(
      { error: "Could not connect to GitHub. Please try again." },
      { status: 502 }
    );
  }
}
