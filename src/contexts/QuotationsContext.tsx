"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { Article } from "@/types/article";
import type { Quotation, QuotationItem } from "@/types/quotation";

import { createQuotationItem } from "@/types/quotation";

type QuotationsContextType = {
  currentItems: QuotationItem[];
  quotations: Quotation[];
  addArticleToQuotation: (article: Article) => void;
  decreaseArticleQuantity: (articleId: number) => void;
  clearCurrentQuotation: () => void;
  saveQuotation: (
    quotationData: Omit<Quotation, "id" | "items">,
  ) => Quotation | null;
};

const QuotationsContext = createContext<QuotationsContextType | undefined>(
  undefined,
);

export function QuotationsProvider({ children }: { children: ReactNode }) {
  const [currentItems, setCurrentItems] = useState<QuotationItem[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  function addArticleToQuotation(article: Article) {
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
  }

  function decreaseArticleQuantity(articleId: number) {
    setCurrentItems((current) =>
      current
        .map((item) =>
          item.articleId === articleId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function clearCurrentQuotation() {
    setCurrentItems([]);
  }

  function saveQuotation(quotationData: Omit<Quotation, "id" | "items">) {
    if (currentItems.length === 0) {
      return null;
    }

    const savedQuotation: Quotation = {
      ...quotationData,
      id: Date.now(),
      items: currentItems.map((item) => ({ ...item })),
    };

    setQuotations((current) => [savedQuotation, ...current]);

    setCurrentItems([]);

    return savedQuotation;
  }

  return (
    <QuotationsContext.Provider
      value={{
        currentItems,
        quotations,
        addArticleToQuotation,
        decreaseArticleQuantity,
        clearCurrentQuotation,
        saveQuotation,
      }}
    >
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
