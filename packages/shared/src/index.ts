export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  kind: "rss" | "hacker-news";
  publishedAt: string;
  score?: number;
  commentsUrl?: string;
};

export type NewsFeedResponse = {
  articles: NewsArticle[];
  errors: string[];
};
