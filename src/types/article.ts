export type Article = {
  id: number;
  name: string;
  code: string;
  serialNumber: string;
  price: number;
  vat: number;
  unit: string;
};

export type ArticleFormData = {
  name: string;
  code: string;
  serialNumber: string;
  price: string;
  vat: string;
  unit: string;
};
