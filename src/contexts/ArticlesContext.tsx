"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Article } from "@/types/article";
import { initialArticles } from "@/lib/articles";

type ArticlesContextType = {
  articles: Article[];
  addArticle: (article: Omit<Article, "id">) => void;
  updateArticle: (id: number, article: Omit<Article, "id">) => void;
  deleteArticle: (id: number) => void;
  importArticles: (names: string[]) => number;
};

const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined,
);

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const addArticle = useCallback((article: Omit<Article, "id">) => {
    setArticles((current) => [
      ...current,
      {
        ...article,
        id: Math.max(Date.now(), ...current.map((item) => item.id + 1)),
      },
    ]);
  }, []);

  const updateArticle = useCallback(
    (id: number, updatedArticle: Omit<Article, "id">) => {
      setArticles((current) =>
        current.map((article) =>
          article.id === id ? { ...updatedArticle, id } : article,
        ),
      );
    },
    [],
  );

  const deleteArticle = useCallback((id: number) => {
    setArticles((current) => current.filter((article) => article.id !== id));
  }, []);

  const importArticles = useCallback((names: string[]) => {
    const newArticles = names
      .map((name) => name.trim())
      .filter((name) => name !== "");

    if (newArticles.length === 0) {
      return 0;
    }

    const firstId = Date.now();

    setArticles((current) => [
      ...current,
      ...newArticles.map((name, index) => ({
        id: firstId + index,
        name,
        code: "",
        serialNumber: "",
        price: 0,
        vat: 17,
        unit: "kom",
      })),
    ]);

    return newArticles.length;
  }, []);

  const value = useMemo(
    () => ({
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      importArticles,
    }),
    [articles, addArticle, updateArticle, deleteArticle, importArticles],
  );

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticlesContext);

  if (!context) {
    throw new Error("useArticles mora biti korišćen unutar ArticlesProvider.");
  }

  return context;
}
