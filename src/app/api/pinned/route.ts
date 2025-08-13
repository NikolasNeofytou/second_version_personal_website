// no imports required

type Repo = {
  name: string;
  description?: string | null;
  stars?: number;
  forks?: number;
  language?: { name: string; color?: string | null } | null;
  topics?: string[];
  url: string;
};

const USER = process.env.GITHUB_USERNAME || "NikolasNeofytou";
const TOKEN = process.env.GITHUB_TOKEN;

export const runtime = "edge"; // fast, cached

export async function GET() {
  try {
    const projects: Repo[] = TOKEN
      ? await fetchPinnedGraphQL(USER, TOKEN)
      : await fetchPinnedPublic(USER);

    return new Response(JSON.stringify({ projects }), {
      headers: {
        "content-type": "application/json",
        // cache for 6 hours at the edge; revalidate on request
        "cache-control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

async function fetchPinnedGraphQL(user: string, token: string): Promise<Repo[]> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              stargazerCount
              forkCount
              url
              primaryLanguage { name color }
              repositoryTopics(first: 8) { nodes { topic { name } } }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: user } }),
  });

  if (!res.ok) throw new Error(`GitHub GraphQL error: ${res.status}`);
  const data: unknown = await res.json();
  const nodes = (data as { data?: { user?: { pinnedItems?: { nodes?: unknown[] } } } })?.data?.user?.pinnedItems?.nodes || [];
  return (nodes as Array<{
    name: string;
    description?: string | null;
    stargazerCount?: number;
    forkCount?: number;
    url: string;
    primaryLanguage?: { name: string; color?: string | null } | null;
    repositoryTopics?: { nodes?: Array<{ topic?: { name?: string } | null } | null> } | null;
  }>).map((n) => ({
    name: n.name,
    description: n.description ?? null,
    stars: n.stargazerCount,
    forks: n.forkCount,
    url: n.url,
    language: n.primaryLanguage ?? null,
    topics: (n.repositoryTopics?.nodes || [])
      .map((x) => x?.topic?.name)
      .filter((t): t is string => Boolean(t)),
  }));
}

async function fetchPinnedPublic(user: string): Promise<Repo[]> {
  // Scrape public profile for pinned repo names as a lightweight fallback
  const profileUrl = `https://github.com/${user}`;
  const htmlRes = await fetch(profileUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!htmlRes.ok) throw new Error(`Failed to load profile: ${htmlRes.status}`);
  const html = await htmlRes.text();

  // Try to find pinned repo anchors under the pinned list
  const repoSlugs = new Set<string>();
  const anchorRegex = new RegExp(`/(${user})/([A-Za-z0-9_.-]+)`, "g");
  let m: RegExpExecArray | null;
  while ((m = anchorRegex.exec(html))) {
    repoSlugs.add(`${m[1]}/${m[2]}`);
  }
  const slugs = Array.from(repoSlugs).slice(0, 6);

  // Build minimal repo objects; we won't call extra APIs to avoid rate limits.
  const repos: Repo[] = slugs.map((slug) => ({
    name: slug.split("/")[1],
    url: `https://github.com/${slug}`,
    description: null,
    topics: [],
  }));

  return repos;
}
