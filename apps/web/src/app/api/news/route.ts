import axios from "axios";
import { decodeHTML } from "entities";
import Parser from "rss-parser";
import type { NewsArticle, NewsFeedResponse } from "@tech-news-hub/shared";
import { HACKER_NEWS_API, RSS_SOURCES } from "@/lib/news-sources";

export const revalidate = 900;

const parser = new Parser();
const REQUEST_TIMEOUT_MS = 8_000;
const ARTICLE_LIMIT = 20;
const USER_AGENT = "TechNewsHub/1.0 (+https://github.com)";

type HackerNewsItem = {
  id: number;
  title?: string;
  url?: string;
  time?: number;
  score?: number;
  descendants?: number;
  type?: string;
  deleted?: boolean;
  dead?: boolean;
};

function readableError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response
      ? `HTTP ${error.response.status}`
      : error.code === "ECONNABORTED"
        ? "tempo limite excedido"
        : "falha na conexão";
  }

  return error instanceof Error ? error.message : "erro desconhecido";
}

function decodeRssText(value: string): string {
  return decodeHTML(decodeHTML(value));
}

async function fetchRssFeed(
  source: (typeof RSS_SOURCES)[number]
): Promise<NewsArticle[]> {
  const response = await axios.get<string>(source.url, {
    timeout: REQUEST_TIMEOUT_MS,
    headers: { "User-Agent": USER_AGENT }
  });
  const feed = await parser.parseString(response.data);

  return (feed.items ?? [])
    .filter((item) => item.title && item.link)
    .slice(0, ARTICLE_LIMIT)
    .map((item, index) => {
      const publishedAt = item.isoDate ?? item.pubDate;
      const date = publishedAt ? new Date(publishedAt) : new Date();
      const description = decodeRssText(item.contentSnippet ?? item.summary ?? "");

      return {
        id: `${source.name}-${item.guid ?? item.link ?? index}`,
        title: decodeRssText(item.title ?? "Notícia sem título"),
        description: description.replace(/\s+/g, " ").trim().slice(0, 320),
        url: item.link ?? source.url,
        source: source.name,
        kind: "rss",
        publishedAt: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
      };
    });
}

async function fetchHackerNews(): Promise<NewsArticle[]> {
  const { data: ids } = await axios.get<number[]>(`${HACKER_NEWS_API}/topstories.json`, {
    timeout: REQUEST_TIMEOUT_MS
  });
  const items = await Promise.all(
    ids.slice(0, ARTICLE_LIMIT).map(async (id) => {
      const { data } = await axios.get<HackerNewsItem>(
        `${HACKER_NEWS_API}/item/${id}.json`,
        { timeout: REQUEST_TIMEOUT_MS }
      );
      return data;
    })
  );

  return items
    .filter(
      (item): item is HackerNewsItem & { title: string } =>
        item.type === "story" && !item.deleted && !item.dead && Boolean(item.title)
    )
    .map((item) => ({
      id: `hacker-news-${item.id}`,
      title: item.title,
      description: "",
      url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
      source: "Hacker News",
      kind: "hacker-news",
      publishedAt: new Date((item.time ?? 0) * 1000).toISOString(),
      score: item.score ?? 0,
      commentsUrl: `https://news.ycombinator.com/item?id=${item.id}`
    }));
}

export async function GET(): Promise<Response> {
  const tasks = [
    ...RSS_SOURCES.map((source) => ({
      label: source.name,
      run: () => fetchRssFeed(source)
    })),
    { label: "Hacker News", run: fetchHackerNews }
  ];
  const results = await Promise.allSettled(tasks.map((task) => task.run()));
  const articles: NewsArticle[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      errors.push(`${tasks[index].label}: ${readableError(result.reason)}`);
    }
  });

  if (articles.length === 0) {
    const response: NewsFeedResponse = { articles, errors };
    return Response.json(response, { status: 502 });
  }

  articles.sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime()
  );

  return Response.json(
    { articles: articles.slice(0, 60), errors } satisfies NewsFeedResponse,
    { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } }
  );
}
