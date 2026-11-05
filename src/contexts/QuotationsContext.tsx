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

import type { Article } from "@/types/article";
import type {
  Quotation,
  QuotationItem,
  QuotationCustomer,
} from "@/types/quotation";

import { createQuotationItem } from "@/types/quotation";
import { useArticles } from "@/contexts/ArticlesContext";

const emptyCustomer: QuotationCustomer = {
  name: "",
  address: "",
  taxNumber: "",
  phone: "",
  email: "",
};

type QuotationContextType = {
  currentItems: QuotationItem[];
  quotations: Quotation[];
  currentCustomer: QuotationCustomer;
  quotationNumber: string;
  setCurrentCustomer: (customer: QuotationCustomer) => void;
  setQuotationNumber: (number: string) => void;
  addArticleToQuotation: (article: Article) => void;
  decreaseArticleQuantity: (articleId: number) => void;
  setArticleQuantity: (article: Article, quantity: number) => void;
  clearCurrentQuotation: () => void;
  saveQuotation: (
    quotationData: Omit<Quotation, "id" | "items">,
  ) => Promise<Quotation | null>;
  deleteQuotation: (id: number) => Promise<void>;
};

const QuotationsContext = createContext<QuotationContextType | undefined>(
  undefined,
);

export function QuotationsProvider({ children }: { children: ReactNode }) {
  const { articles } = useArticles();

  const [currentItems, setCurrentItems] = useState<QuotationItem[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [currentCustomer, setCurrentCustomer] =
    useState<QuotationCustomer>(emptyCustomer);

  const [quotationNumber, setQuotationNumber] = useState(
    `P-${new Date().getFullYear()}-001`,
  );

  useEffect(() => {
    async function loadQuotations() {
      try {
        const response = await fetch("/api/quotations");

        if (!response.ok) {
          throw new Error("Učitavanje predračuna nije uspjelo.");
        }

        const data: Quotation[] = await response.json();
        setQuotations(data);
      } catch (error) {
        console.error("Greška pri učitavanju predračuna:", error);
        alert("Greška pri učitavanju predračuna iz baze.");
      }
    }

    loadQuotations();
  }, []);

  const articlesById = useMemo(
    () => new Map(articles.map((article) => [article.id, article])),
    [articles],
  );

  const syncedCurrentItems = useMemo(
    () =>
      currentItems
        .map((item) => {
          const latestArticle = articlesById.get(item.articleId);

          if (!latestArticle) {
            return null;
          }

          return {
            ...createQuotationItem(latestArticle),
            quantity: item.quantity,
          };
        })
        .filter((item): item is QuotationItem => item !== null),
    [currentItems, articlesById],
  );

  const addArticleToQuotation = useCallback((article: Article) => {
    setCurrentItems((current) => {
      const existing = current.find((item) => item.articleId === article.id);

      if (existing) {
        return current.map((item) =>
          item.articleId === article.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, createQuotationItem(article)];
    });
  }, []);

  const decreaseArticleQuantity = useCallback((articleId: number) => {
    setCurrentItems((current) =>
      current
        .map((item) =>
          item.articleId === articleId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const setArticleQuantity = useCallback(
    (article: Article, quantity: number) => {
      const safeQuantity = Math.max(0, Math.floor(quantity));

      setCurrentItems((current) => {
        if (safeQuantity === 0) {
          return current.filter((item) => item.articleId !== article.id);
        }

        const existing = current.find((item) => item.articleId === article.id);

        if (existing) {
          return current.map((item) =>
            item.articleId === article.id
              ? { ...item, quantity: safeQuantity }
              : item,
          );
        }

        return [
          ...current,
          {
            ...createQuotationItem(article),
            quantity: safeQuantity,
          },
        ];
      });
    },
    [],
  );

  const clearCurrentQuotation = useCallback(() => {
    setCurrentItems([]);
    setCurrentCustomer(emptyCustomer);
  }, []);

  const deleteQuotation = useCallback(async (id: number) => {
    const response = await fetch("/api/quotations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Brisanje predračuna nije uspjelo.");
    }

    setQuotations((current) =>
      current.filter((quotation) => quotation.id !== id),
    );
  }, []);

  const saveQuotation = useCallback(
    async (
      quotationData: Omit<Quotation, "id" | "items">,
    ): Promise<Quotation | null> => {
      if (syncedCurrentItems.length === 0) {
        return null;
      }

      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quotationData,
          items: syncedCurrentItems,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Čuvanje predračuna nije uspjelo.");
      }

      const savedQuotation: Quotation = await response.json();

      setQuotations((current) => [savedQuotation, ...current]);
      setCurrentItems([]);
      setCurrentCustomer(emptyCustomer);

      return savedQuotation;
    },
    [syncedCurrentItems],
  );

  const value = useMemo(
    () => ({
      currentItems: syncedCurrentItems,
      quotations,
      currentCustomer,
      quotationNumber,
      setCurrentCustomer,
      setQuotationNumber,
      addArticleToQuotation,
      decreaseArticleQuantity,
      setArticleQuantity,
      clearCurrentQuotation,
      saveQuotation,
      deleteQuotation,
    }),
    [
      syncedCurrentItems,
      quotations,
      currentCustomer,
      quotationNumber,
      addArticleToQuotation,
      decreaseArticleQuantity,
      setArticleQuantity,
      clearCurrentQuotation,
      saveQuotation,
      deleteQuotation,
    ],
  );

  return (
    <QuotationsContext.Provider value={value}>
      {children}
    </QuotationsContext.Provider>
  );
}

export function useQuotations() {
  const context = useContext(QuotationsContext);

  if (!context) {
    throw new Error(
      "useQuotations mora biti korišćen unutar QuotationsProvider.",
    );
  }

  return context;
}
