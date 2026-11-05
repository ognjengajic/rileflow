"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

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

type QuotationsContextType = {
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
  ) => Quotation | null;
  deleteQuotation: (id: number) => void;
};

const QuotationsContext = createContext<QuotationsContextType | undefined>(
  undefined,
);

function createTestQuotations(): Quotation[] {
  const customers = [
    "Marković Trade",
    "Tech Solutions",
    "Milošević Company",
    "Elektro Sistem",
    "Nova Gradnja",
    "Digital Pro",
    "Auto Servis Marko",
    "Balkan Commerce",
    "Univerzal Promet",
    "Matić Elektronik",
  ];

  const cities = [
    "Zvornik",
    "Bijeljina",
    "Tuzla",
    "Brčko",
    "Banja Luka",
    "Sarajevo",
    "Doboj",
    "Lukavac",
    "Šabac",
    "Loznica",
  ];

  return Array.from({ length: 50 }, (_, index) => {
    const customerIndex = index % customers.length;

    const items: QuotationItem[] = Array.from(
      { length: (index % 3) + 1 },
      (_, itemIndex) => {
        const price = 25 + ((index * 37 + itemIndex * 53) % 475);
        const quantity = ((index + itemIndex) % 5) + 1;

        return {
          articleId: 800000 + index * 10 + itemIndex,
          name: [
            "Laptop računar",
            "Monitor LED",
            "Tastatura",
            "Miš bežični",
            "Štampač",
            "Mrežni ruter",
          ][(index + itemIndex) % 6],
          code: `TEST-${index + 1}-${itemIndex + 1}`,
          serialNumber: `SN-${800000 + index * 10 + itemIndex}`,
          price,
          quantity,
          unit: "kom",
          vat: 17,
        };
      },
    );

    const totalWithoutVat = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const totalVat = items.reduce(
      (sum, item) => sum + (item.price * item.quantity * item.vat) / 100,
      0,
    );

    return {
      id: 900001 + index,
      number: `P-2026-TEST-${String(index + 1).padStart(3, "0")}`,
      date: new Date(Date.UTC(2026, 0, 1 + index * 5)).toISOString(),
      customer: {
        name: `${customers[customerIndex]} ${String(index + 1).padStart(2, "0")}`,
        address: `Ulica ${index + 1}, ${cities[customerIndex]}`,
        taxNumber: `${450000000 + index}`,
        phone: `+387 65 123 ${String(index + 1).padStart(3, "0")}`,
        email: `kupac${index + 1}@example.com`,
      },
      items,
      totalWithoutVat,
      totalVat,
      totalWithVat: totalWithoutVat + totalVat,
    };
  });
}

export function QuotationsProvider({ children }: { children: ReactNode }) {
  const { articles } = useArticles();

  const [currentItems, setCurrentItems] = useState<QuotationItem[]>([]);
  const [quotations, setQuotations] =
    useState<Quotation[]>(createTestQuotations);

  const [currentCustomer, setCurrentCustomer] =
    useState<QuotationCustomer>(emptyCustomer);

  const [quotationNumber, setQuotationNumber] = useState(
    `P-${new Date().getFullYear()}-001`,
  );

  const syncedCurrentItems = currentItems
    .map((item) => {
      const latestArticle = articles.find(
        (article) => article.id === item.articleId,
      );

      if (!latestArticle) {
        return null;
      }

      return {
        ...createQuotationItem(latestArticle),
        quantity: item.quantity,
      };
    })
    .filter((item) => item !== null);

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

  function setArticleQuantity(article: Article, quantity: number) {
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
  }

  function clearCurrentQuotation() {
    setCurrentItems([]);
    setCurrentCustomer(emptyCustomer);
  }

  function deleteQuotation(id: number) {
    setQuotations((current) =>
      current.filter((quotation) => quotation.id !== id),
    );
  }

  function saveQuotation(quotationData: Omit<Quotation, "id" | "items">) {
    if (syncedCurrentItems.length === 0) {
      return null;
    }

    const savedQuotation: Quotation = {
      ...quotationData,
      id: Date.now(),
      items: syncedCurrentItems.map((item) => ({ ...item })),
    };

    setQuotations((current) => [savedQuotation, ...current]);

    setCurrentItems([]);
    setCurrentCustomer(emptyCustomer);

    return savedQuotation;
  }

  return (
    <QuotationsContext.Provider
      value={{
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
