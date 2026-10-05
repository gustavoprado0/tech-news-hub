"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { NewsArticle, NewsFeedResponse } from "@tech-news-hub/shared";
import {
  ActionButton,
  Eyebrow,
  Pill
} from "@tech-news-hub/ui";
import styled from "styled-components";

type NewsFilter = "all" | "rss" | "hacker-news";

const Section = styled.section`
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 36px rgba(15, 23, 42, 0.045);
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  border-bottom: 1px solid #eef2f7;

  @media (max-width: 680px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const ToolbarTitle = styled.h2`
  margin: 4px 0 0;
  font-size: 1.22rem;
  letter-spacing: -0.035em;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  width: min(240px, 32vw);
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #dbe4f0;
  border-radius: 10px;
  outline: none;
  color: #0f172a;
  background: #fff;
  font-size: 0.86rem;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px #dbeafe;
  }

  @media (max-width: 520px) {
    width: min(190px, 42vw);
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 15px 24px 0;
  overflow-x: auto;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  border: 0;
  border-radius: 999px;
  padding: 8px 13px;
  color: ${({ $active }) => ($active ? "#1d4ed8" : "#64748b")};
  background: ${({ $active }) => ($active ? "#eff6ff" : "transparent")};
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: #1d4ed8;
    background: #eff6ff;
  }

  &:focus-visible {
    outline: 3px solid #93c5fd;
    outline-offset: 2px;
  }
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 24px 4px;
  color: #64748b;
  font-size: 0.77rem;
`;

const ArticleList = styled.div`
  padding: 8px 24px 10px;
`;

const Article = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  padding: 19px 0;
  border-bottom: 1px solid #eef2f7;

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const ArticleLink = styled.a`
  display: inline-block;
  margin: 9px 0 6px;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.45;

  &:hover {
    color: #1d4ed8;
  }

  &:focus-visible {
    border-radius: 3px;
    outline: 3px solid #93c5fd;
    outline-offset: 3px;
  }
`;

const ArticleDescription = styled.p`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #64748b;
  font-size: 0.86rem;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  color: #94a3b8;
  font-size: 0.74rem;
`;

const ArticleSide = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  @media (min-width: 601px) {
    align-items: center;
  }
`;

const DiscussionLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 10px;
  border-radius: 9px;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 650;

  &:hover {
    color: #1d4ed8;
    background: #eff6ff;
  }
`;

const StatePanel = styled.div`
  padding: 52px 20px;
  color: #64748b;
  text-align: center;

  strong {
    display: block;
    margin-bottom: 7px;
    color: #0f172a;
    font-size: 1rem;
  }

  p {
    margin: 0 auto 16px;
    max-width: 440px;
    line-height: 1.6;
  }
`;

const ErrorBanner = styled.div`
  margin: 14px 24px 0;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 11px 13px;
  color: #854d0e;
  background: #fffbeb;
  font-size: 0.81rem;
  line-height: 1.5;
`;

const LoadingRow = styled.div`
  height: 78px;
  margin: 14px 0;
  border-radius: 10px;
  background: linear-gradient(90deg, #f1f5f9, #f8fafc, #f1f5f9);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;

  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
`;

const filters: { label: string; value: NewsFilter }[] = [
  { label: "Tudo", value: "all" },
  { label: "RSS", value: "rss" },
  { label: "Hacker News", value: "hacker-news" }
];

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function NewsDashboard() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [filter, setFilter] = useState<NewsFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get<NewsFeedResponse>("/api/news", { timeout: 30_000 });
      setArticles(data.articles);
      setErrors(data.errors);
      setLastUpdated(new Date().toISOString());
    } catch (cause) {
      setError(
        axios.isAxiosError(cause)
          ? "Não foi possível carregar as notícias agora. Tente novamente em instantes."
          : "Ocorreu um erro inesperado ao carregar as notícias."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNews();
  }, [loadNews]);

  const visibleArticles = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return articles.filter((article) => {
      const matchesFilter = filter === "all" || article.kind === filter;
      const matchesSearch =
        !query ||
        `${article.title} ${article.description} ${article.source}`
          .toLocaleLowerCase("pt-BR")
          .includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [articles, filter, search]);

  return (
    <Section aria-labelledby="news-heading">
      <Toolbar>
        <div>
          <Eyebrow>Atualizado ao vivo</Eyebrow>
          <ToolbarTitle id="news-heading">Em destaque</ToolbarTitle>
        </div>
        <Controls>
          <SearchInput
            aria-label="Buscar notícias"
            placeholder="Buscar notícias..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <ActionButton $quiet onClick={() => void loadNews()} disabled={loading}>
            <span aria-hidden="true">{loading ? "…" : "↻"}</span>
            <span className="refresh-label">Atualizar</span>
          </ActionButton>
        </Controls>
      </Toolbar>
      <FilterBar aria-label="Filtrar notícias">
        {filters.map((item) => (
          <FilterButton
            key={item.value}
            type="button"
            $active={filter === item.value}
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </FilterButton>
        ))}
      </FilterBar>
      {errors.length > 0 && (
        <ErrorBanner role="status">
          Parte das fontes está indisponível no momento: {errors.join("; ")}.
        </ErrorBanner>
      )}
      <ResultMeta>
        <span>{loading ? "Buscando notícias..." : `${visibleArticles.length} notícias`}</span>
        {lastUpdated && <span>Atualizado às {formatDate(lastUpdated)}</span>}
      </ResultMeta>
      <ArticleList aria-live="polite">
        {loading && articles.length === 0 ? (
          <>
            <LoadingRow />
            <LoadingRow />
            <LoadingRow />
          </>
        ) : error ? (
          <StatePanel>
            <strong>Não conseguimos buscar as notícias.</strong>
            <p>{error}</p>
            <ActionButton onClick={() => void loadNews()}>Tentar novamente</ActionButton>
          </StatePanel>
        ) : visibleArticles.length === 0 ? (
          <StatePanel>
            <strong>{articles.length === 0 ? "Nenhuma notícia disponível." : "Nenhum resultado."}</strong>
            <p>
              {articles.length === 0
                ? "As fontes podem estar temporariamente indisponíveis. Tente novamente em alguns instantes."
                : "Experimente mudar o filtro ou buscar por outro termo."}
            </p>
          </StatePanel>
        ) : (
          visibleArticles.map((article) => (
            <Article key={article.id}>
              <div>
                <Pill $tone={article.kind === "hacker-news" ? "blue" : "neutral"}>
                  {article.source}
                </Pill>
                <ArticleLink href={article.url} target="_blank" rel="noreferrer">
                  {article.title}
                </ArticleLink>
                {article.description && <ArticleDescription>{article.description}</ArticleDescription>}
                <ArticleMeta>
                  <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                  {article.score !== undefined && <span>· {article.score} pontos</span>}
                </ArticleMeta>
              </div>
              {article.commentsUrl && (
                <ArticleSide>
                  <DiscussionLink
                    href={article.commentsUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir discussão no Hacker News: ${article.title}`}
                  >
                    Discussão <span aria-hidden="true">↗</span>
                  </DiscussionLink>
                </ArticleSide>
              )}
            </Article>
          ))
        )}
      </ArticleList>
    </Section>
  );
}
