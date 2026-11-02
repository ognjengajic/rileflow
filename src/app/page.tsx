"use client";

import { useState, type FormEvent } from "react";

import Sidebar from "@/components/Sidebar";
import ArticlesHeader from "@/components/articles/ArticlesHeader";
import ArticlesTable from "@/components/articles/ArticlesTable";
import ArticleForm from "@/components/articles/ArticleForm";
import DeleteArticleDialog from "@/components/articles/DeleteArticleDialog";
import ExcelImport from "@/components/articles/ExcelImport";

import type { Article, ArticleFormData } from "@/types/article";

import {
  initialArticles,
  emptyArticleForm,
  searchArticles,
  hasDuplicateArticle,
} from "@/lib/articles";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ArticleFormData>(emptyArticleForm);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);

  const filteredArticles = searchArticles(articles, search);

  function openNewForm() {
    setEditingId(null);
    setForm({ ...emptyArticleForm });
    setShowForm(true);
  }

  function openEditForm(article: Article) {
    setEditingId(article.id);

    setForm({
      name: article.name,
      code: article.code,
      serialNumber: article.serialNumber,
      price: String(article.price),
      vat: String(article.vat),
      unit: article.unit,
    });

    setShowForm(true);
  }

  function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasDuplicateArticle(articles, form, editingId)) {
      alert("Šifra ili serijski broj već postoje.");
      return;
    }

    if (editingId !== null) {
      setArticles((current) =>
        current.map((article) =>
          article.id === editingId
            ? {
                ...article,
                name: form.name.trim(),
                code: form.code.trim(),
                serialNumber: form.serialNumber.trim(),
                price: Number(form.price),
                vat: Number(form.vat),
                unit: form.unit,
              }
            : article,
        ),
      );
    } else {
      setArticles((current) => [
        ...current,
        {
          id: Date.now(),
          name: form.name.trim(),
          code: form.code.trim(),
          serialNumber: form.serialNumber.trim(),
          price: Number(form.price),
          vat: Number(form.vat),
          unit: form.unit,
        },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyArticleForm });
  }

  function deleteArticle() {
    if (!deletingArticle) return;

    setArticles((current) =>
      current.filter((article) => article.id !== deletingArticle.id),
    );

    setDeletingArticle(null);
  }

  function importArticles(names: string[]) {
    setArticles((current) => {
      const existingNames = new Set(
        current.map((article) => article.name.trim().toLowerCase()),
      );

      const newArticles = names
        .filter((name) => !existingNames.has(name.trim().toLowerCase()))
        .map((name, index) => ({
          id: Date.now() + index,
          name: name.trim(),
          code: "",
          serialNumber: "",
          price: 0,
          vat: 17,
          unit: "kom",
        }));

      if (newArticles.length === 0) {
        alert("Svi izabrani artikli već postoje u katalogu.");
        return current;
      }

      alert(`Uspješno dodano ${newArticles.length} artikala.`);

      return [...current, ...newArticles];
    });
  }

  return (
    <main className="flex min-h-screen bg-[#f6f8f6]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-6 md:p-10">
        <ArticlesHeader onAddArticle={openNewForm} />

        <div className="mb-6">
          <ExcelImport onImport={importArticles} />
        </div>

        <ArticlesTable
          articles={filteredArticles}
          search={search}
          onSearchChange={setSearch}
          onEdit={openEditForm}
          onDelete={(id) => {
            const article = articles.find((item) => item.id === id);
            if (article) setDeletingArticle(article);
          }}
        />
      </section>

      {showForm && (
        <ArticleForm
          form={form}
          setForm={setForm}
          editing={editingId !== null}
          onSubmit={saveArticle}
          onClose={() => setShowForm(false)}
        />
      )}

      {deletingArticle && (
        <DeleteArticleDialog
          articleName={deletingArticle.name}
          onConfirm={deleteArticle}
          onCancel={() => setDeletingArticle(null)}
        />
      )}
    </main>
  );
}
