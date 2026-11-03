"use client";

import { useReducer, useState, type FormEvent } from "react";

import Sidebar from "@/components/Sidebar";
import ArticlesHeader from "@/components/articles/ArticlesHeader";
import ArticlesTable from "@/components/articles/ArticlesTable";
import ArticleForm from "@/components/articles/ArticleForm";
import DeleteArticleDialog from "@/components/articles/DeleteArticleDialog";
import ExcelImport from "@/components/articles/ExcelImport";

import { useArticles } from "@/contexts/ArticlesContext";

import type { Article } from "@/types/article";

import {
  emptyArticleForm,
  searchArticles,
  hasDuplicateArticle,
} from "@/lib/articles";

import { articleFormReducer } from "@/lib/articleFormReducer";

export default function Home() {
  const { articles, addArticle, updateArticle, deleteArticle, importArticles } =
    useArticles();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, dispatchForm] = useReducer(articleFormReducer, {
    ...emptyArticleForm,
  });

  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);

  const filteredArticles = searchArticles(articles, search);

  function openNewForm() {
    setEditingId(null);

    dispatchForm({
      type: "RESET_FORM",
      payload: { ...emptyArticleForm },
    });

    setShowForm(true);
  }

  function openEditForm(article: Article) {
    setEditingId(article.id);

    dispatchForm({
      type: "SET_FORM",
      payload: {
        name: article.name,
        code: article.code,
        serialNumber: article.serialNumber,
        price: String(article.price),
        vat: String(article.vat),
        unit: article.unit,
      },
    });

    setShowForm(true);
  }

  function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasDuplicateArticle(articles, form, editingId)) {
      alert("Šifra ili serijski broj već postoje.");
      return;
    }

    const articleData = {
      name: form.name.trim(),
      code: form.code.trim(),
      serialNumber: form.serialNumber.trim(),
      price: Number(form.price),
      vat: Number(form.vat),
      unit: form.unit,
    };

    if (editingId !== null) {
      updateArticle(editingId, articleData);
    } else {
      addArticle(articleData);
    }

    setShowForm(false);
    setEditingId(null);

    dispatchForm({
      type: "RESET_FORM",
      payload: { ...emptyArticleForm },
    });
  }

  function confirmDeleteArticle() {
    if (!deletingArticle) return;

    deleteArticle(deletingArticle.id);
    setDeletingArticle(null);
  }

  function handleImportArticles(names: string[]) {
    const importedCount = importArticles(names);

    if (importedCount === 0) {
      alert("Svi izabrani artikli već postoje u katalogu.");
      return;
    }

    alert(`Uspješno dodano ${importedCount} artikala.`);
  }

  return (
    <main className="min-h-screen bg-[#f6f8f6] pl-[250px] max-md:pl-[72px]">
      <Sidebar />

      <section className="min-w-0 p-6 md:p-10">
        <ArticlesHeader onAddArticle={openNewForm} />

        <div className="mb-6">
          <ExcelImport onImport={handleImportArticles} />
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
          onFieldChange={(field, value) =>
            dispatchForm({
              type: "UPDATE_FIELD",
              field,
              value,
            })
          }
          editing={editingId !== null}
          onSubmit={saveArticle}
          onClose={() => setShowForm(false)}
        />
      )}

      {deletingArticle && (
        <DeleteArticleDialog
          articleName={deletingArticle.name}
          onConfirm={confirmDeleteArticle}
          onCancel={() => setDeletingArticle(null)}
        />
      )}
    </main>
  );
}
