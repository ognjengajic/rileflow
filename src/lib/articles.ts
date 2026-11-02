import type { Article, ArticleFormData } from "@/types/article";

export const initialArticles: Article[] = [
  {
    id: 1,
    name: "Industrijski ventil",
    code: "ART-001",
    serialNumber: "SN-2026-001",
    price: 250,
    vat: 17,
    unit: "kom",
  },
  {
    id: 2,
    name: "Čelična cijev",
    code: "ART-002",
    serialNumber: "SN-2026-002",
    price: 85,
    vat: 17,
    unit: "kom",
  },
  {
    id: 3,
    name: "Električni motor",
    code: "ART-003",
    serialNumber: "SN-2026-003",
    price: 640,
    vat: 17,
    unit: "kom",
  },
];

export const emptyArticleForm: ArticleFormData = {
  name: "",
  code: "",
  serialNumber: "",
  price: "",
  vat: "17",
  unit: "kom",
};

export function searchArticles(articles: Article[], search: string) {
  const query = search.trim().toLowerCase();

  if (!query) return articles;

  return articles.filter((article) =>
    `${article.name} ${article.code} ${article.serialNumber}`
      .toLowerCase()
      .includes(query),
  );
}

export function hasDuplicateArticle(
  articles: Article[],
  form: ArticleFormData,
  editingId: number | null,
) {
  return articles.some(
    (article) =>
      article.id !== editingId &&
      (article.code.toLowerCase() === form.code.trim().toLowerCase() ||
        article.serialNumber.toLowerCase() ===
          form.serialNumber.trim().toLowerCase()),
  );
}
