"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import type { Article } from "@/types/article";

type ArticlesContextType = {
  articles: Article[];
  addArticle: (article: Omit<Article, "id">) => Promise<void>;
  updateArticle: (id: number, article: Omit<Article, "id">) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;
  importArticles: (names: string[]) => Promise<number>;
};

const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined,
);

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/login") {
      return;
    }

    async function loadArticles() {
      try {
        const response = await fetch("/api/articles");

        if (!response.ok) {
          throw new Error("Nije moguće učitati artikle.");
        }

        const data: Article[] = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Greška pri učitavanju artikala:", error);
        alert("Greška pri učitavanju artikala iz baze.");
      }
    }

    loadArticles();
  }, [pathname]);

  const addArticle = useCallback(async (article: Omit<Article, "id">) => {
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        throw new Error("Dodavanje artikla nije uspjelo.");
      }

      const [newArticle]: Article[] = await response.json();

      setArticles((current) => [...current, newArticle]);
    } catch (error) {
      console.error("Greška pri dodavanju artikla:", error);
      alert("Artikal nije sačuvan. Pokušajte ponovo.");
    }
  }, []);

  const updateArticle = useCallback(
    async (id: number, updatedArticle: Omit<Article, "id">) => {
      try {
        const response = await fetch("/api/articles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...updatedArticle, id }),
        });

        if (!response.ok) {
          throw new Error("Izmjena artikla nije uspjela.");
        }

        const savedArticle: Article = await response.json();

        setArticles((current) =>
          current.map((article) =>
            article.id === id ? savedArticle : article,
          ),
        );
      } catch (error) {
        console.error("Greška pri izmjeni artikla:", error);
        alert("Izmjene nisu sačuvane. Pokušajte ponovo.");
      }
    },
    [],
  );

  const deleteArticle = useCallback(async (id: number) => {
    try {
      const response = await fetch("/api/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Brisanje artikla nije uspjelo.");
      }

      setArticles((current) => current.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Greška pri brisanju artikla:", error);
      alert("Artikal nije obrisan. Pokušajte ponovo.");
    }
  }, []);

  const importArticles = useCallback(async (names: string[]) => {
    const newArticles = names
      .map((name) => name.trim())
      .filter((name) => name !== "");

    if (newArticles.length === 0) {
      return 0;
    }

    const rows = newArticles.map((name) => ({
      name,
      code: "",
      serialNumber: "",
      price: 0,
      vat: 17,
      unit: "kom",
    }));

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });

      if (!response.ok) {
        throw new Error("Uvoz artikala nije uspio.");
      }

      const savedArticles: Article[] = await response.json();

      setArticles((current) => [...current, ...savedArticles]);

      return savedArticles.length;
    } catch (error) {
      console.error("Greška pri uvozu artikala:", error);
      alert("Uvoz nije uspio. Pokušajte ponovo.");
      return 0;
    }
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
