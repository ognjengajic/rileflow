import type { Article } from "@/types/article";

export type QuotationItem = {
  articleId: number;
  name: string;
  code: string;
  serialNumber: string;
  price: number;
  vat: number;
  unit: string;
  quantity: number;
};

export type QuotationCustomer = {
  name: string;
  address: string;
  taxNumber: string;
  phone: string;
  email: string;
};

export type Quotation = {
  id: number;
  number: string;
  date: string;
  customer: QuotationCustomer;
  items: QuotationItem[];
  totalWithoutVat: number;
  totalVat: number;
  totalWithVat: number;
};

export function createQuotationItem(article: Article): QuotationItem {
  return {
    articleId: article.id,
    name: article.name,
    code: article.code,
    serialNumber: article.serialNumber,
    price: article.price,
    vat: article.vat,
    unit: article.unit,
    quantity: 1,
  };
}
