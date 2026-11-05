"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/types/article";
import { useQuotations } from "../../contexts/QuotationsContext";

type ArticlesTableProps = {
  articles: Article[];
  search: string;
  onSearchChange: (value: string) => void;
  onEdit: (article: Article) => void;
  onDelete: (id: number) => void;
};

export default function ArticlesTable({
  articles,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}: ArticlesTableProps) {
  const {
    currentItems,
    addArticleToQuotation,
    decreaseArticleQuantity,
    setArticleQuantity,
  } = useQuotations();

  const [visibleCount, setVisibleCount] = useState(20);

  const visibleArticles = useMemo(
    () => articles.slice(0, visibleCount),
    [articles, visibleCount],
  );

  const quantitiesByArticleId = useMemo(
    () => new Map(currentItems.map((item) => [item.articleId, item.quantity])),
    [currentItems],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[#e7ece8] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7ece8] p-5">
        <h2 className="font-semibold text-[#1b2b22]">Lista artikala</h2>

        <input
          type="search"
          value={search}
          onChange={(event) => {
            setVisibleCount(20);
            onSearchChange(event.target.value);
          }}
          placeholder="Pretraži artikle..."
          className="w-full rounded-lg border border-[#e7ece8] px-4 py-2.5 text-sm outline-none focus:border-[#174c35] sm:w-72"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8faf8] text-xs text-[#89968e]">
            <tr>
              <th className="px-5 py-4">Naziv artikla</th>
              <th className="px-5 py-4">Šifra</th>
              <th className="px-5 py-4">Serijski broj</th>
              <th className="px-5 py-4">Cijena</th>
              <th className="px-5 py-4">PDV</th>
              <th className="px-5 py-4">Jedinica</th>
              <th className="px-5 py-4">Količina</th>
              <th className="px-5 py-4 text-right">Akcije</th>
            </tr>
          </thead>

          <tbody>
            {visibleArticles.map((article) => {
              const quantity = quantitiesByArticleId.get(article.id) ?? 0;

              return (
                <tr
                  key={article.id}
                  className="border-t border-[#e7ece8] hover:bg-[#fafcfa]"
                >
                  <td className="px-5 py-4 font-semibold text-[#1b2b22]">
                    {article.name}
                  </td>

                  <td className="px-5 py-4 text-[#66756b]">{article.code}</td>

                  <td className="px-5 py-4 text-[#66756b]">
                    {article.serialNumber}
                  </td>

                  <td className="px-5 py-4 font-medium text-[#1b2b22]">
                    {article.price.toFixed(2)} KM
                  </td>

                  <td className="px-5 py-4 text-[#66756b]">{article.vat}%</td>

                  <td className="px-5 py-4 text-[#66756b]">{article.unit}</td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseArticleQuantity(article.id)}
                        disabled={quantity === 0}
                        className="grid h-8 w-8 place-items-center rounded-md border border-[#e7ece8] text-lg font-semibold text-[#174c35] hover:bg-[#edf4ef] disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Smanji količinu za ${article.name}`}
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={quantity}
                        onChange={(event) => {
                          const value = event.target.value;

                          if (value === "") return;

                          const newQuantity = Number(value);

                          if (
                            Number.isInteger(newQuantity) &&
                            newQuantity >= 0
                          ) {
                            setArticleQuantity(article, newQuantity);
                          }
                        }}
                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none h-8 w-14 rounded-md border border-[#e7ece8] text-center text-sm font-semibold text-[#1b2b22] outline-none focus:border-[#174c35]"
                        aria-label={`Količina za ${article.name}`}
                      />

                      <button
                        type="button"
                        onClick={() => addArticleToQuotation(article)}
                        className="grid h-8 w-8 place-items-center rounded-md bg-[#174c35] text-lg font-semibold text-white hover:bg-[#236445]"
                        aria-label={`Povećaj količinu za ${article.name}`}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(article)}
                        className="rounded-md px-3 py-2 text-xs font-semibold text-[#174c35] hover:bg-[#edf4ef]"
                      >
                        Izmijeni
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(article.id)}
                        className="rounded-md px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Obriši
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {articles.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-sm text-[#89968e]"
                >
                  Nema pronađenih artikala.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {visibleCount < articles.length && (
        <div className="flex justify-center border-t border-[#e7ece8] p-4">
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + 100)}
            className="rounded-lg border border-[#174c35] px-5 py-2.5 text-sm font-semibold text-[#174c35] transition-colors hover:bg-[#edf4ef]"
          >
            Prikaži još {Math.min(100, articles.length - visibleCount)} artikala
          </button>
        </div>
      )}
    </div>
  );
}
