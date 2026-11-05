"use client";

import {
  useCallback,
  useMemo,
  useReducer,
  useState,
  type FormEvent,
} from "react";

import Sidebar from "@/components/Sidebar";
import ArticlesHeader from "@/components/articles/ArticlesHeader";
import ArticlesTable from "@/components/articles/ArticlesTable";
import ArticleForm from "@/components/articles/ArticleForm";
import DeleteArticleDialog from "@/components/articles/DeleteArticleDialog";
import ExcelImport from "@/components/articles/ExcelImport";

import { useArticles } from "@/contexts/ArticlesContext";

import type { Article, ArticleFormData } from "@/types/article";

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

  const filteredArticles = useMemo(
    () => searchArticles(articles, search),
    [articles, search],
  );

  const openNewForm = useCallback(() => {
    setEditingId(null);

    dispatchForm({
      type: "RESET_FORM",
      payload: { ...emptyArticleForm },
    });

    setShowForm(true);
  }, []);

  const openEditForm = useCallback((article: Article) => {
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
  }, []);

  const saveArticle = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
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
    },
    [articles, form, editingId, addArticle, updateArticle],
  );

  const confirmDeleteArticle = useCallback(() => {
    if (!deletingArticle) return;

    deleteArticle(deletingArticle.id);
    setDeletingArticle(null);
  }, [deletingArticle, deleteArticle]);

  const handleImportArticles = useCallback(
    (names: string[]) => {
      const importedCount = importArticles(names);

      if (importedCount === 0) {
        alert("Svi izabrani artikli već postoje u katalogu.");
        return;
      }

      alert(`Uspješno dodano ${importedCount} artikala.`);
    },
    [importArticles],
  );

  const handleDeleteRequest = useCallback(
    (id: number) => {
      const article = articles.find((item) => item.id === id);

      if (article) {
        setDeletingArticle(article);
      }
    },
    [articles],
  );

  const handleFieldChange = useCallback(
    (field: keyof ArticleFormData, value: string) => {
      dispatchForm({
        type: "UPDATE_FIELD",
        field,
        value,
      });
    },
    [],
  );

  const closeForm = useCallback(() => {
    setShowForm(false);
  }, []);

  const cancelDelete = useCallback(() => {
    setDeletingArticle(null);
  }, []);

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
          onDelete={handleDeleteRequest}
        />
      </section>

      {showForm && (
        <ArticleForm
          form={form}
          onFieldChange={handleFieldChange}
          editing={editingId !== null}
          onSubmit={saveArticle}
          onClose={closeForm}
        />
      )}

      {deletingArticle && (
        <DeleteArticleDialog
          articleName={deletingArticle.name}
          onConfirm={confirmDeleteArticle}
          onCancel={cancelDelete}
        />
      )}
    </main>
  );
}
