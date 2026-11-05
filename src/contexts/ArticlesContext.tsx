"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

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

  function addArticle(article: Omit<Article, "id">) {
    setArticles((current) => [...current, { ...article, id: Date.now() }]);
  }

  function updateArticle(id: number, updatedArticle: Omit<Article, "id">) {
    setArticles((current) =>
      current.map((article) =>
        article.id === id ? { ...updatedArticle, id } : article,
      ),
    );
  }

  function deleteArticle(id: number) {
    setArticles((current) => current.filter((article) => article.id !== id));
  }

  function importArticles(names: string[]) {
    let importedCount = 0;

    setArticles((current) => {
      const existingNames = new Set(
        current.map((article) => article.name.trim().toLowerCase()),
      );

      const newArticles = names
        .map((name) => name.trim())
        .filter(
          (name) => name !== "" && !existingNames.has(name.toLowerCase()),
        );

      importedCount = newArticles.length;

      return [
        ...current,
        ...newArticles.map((name, index) => ({
          id: Date.now() + index,
          name,
          code: "",
          serialNumber: "",
          price: 0,
          vat: 17,
          unit: "kom",
        })),
      ];
    });

    return importedCount;
  }

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        importArticles,
      }}
    >
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
