"use client";

import type { FormEvent } from "react";
import type { ArticleFormData } from "@/types/article";

type ArticleFormProps = {
  form: ArticleFormData;
  setForm: (form: ArticleFormData) => void;
  editing: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function ArticleForm({
  form,
  setForm,
  editing,
  onSubmit,
  onClose,
}: ArticleFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1b2b22]">
            {editing ? "Izmjena artikla" : "Novi artikal"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[#89968e] hover:text-[#1b2b22]"
            aria-label="Zatvori"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1b2b22]">
              Naziv artikla *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-[#e7ece8] px-4 py-3 text-sm outline-none focus:border-[#174c35]"
              placeholder="Unesite naziv artikla"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1b2b22]">
                Šifra artikla *
              </label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full rounded-lg border border-[#e7ece8] px-4 py-3 text-sm outline-none focus:border-[#174c35]"
                placeholder="ART-001"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1b2b22]">
                Serijski broj *
              </label>
              <input
                required
                value={form.serialNumber}
                onChange={(e) =>
                  setForm({ ...form, serialNumber: e.target.value })
                }
                className="w-full rounded-lg border border-[#e7ece8] px-4 py-3 text-sm outline-none focus:border-[#174c35]"
                placeholder="Serijski broj"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1b2b22]">
                Cijena *
              </label>
              <input
                required
                min="0"
                step="0.01"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-lg border border-[#e7ece8] px-4 py-3 text-sm outline-none focus:border-[#174c35]"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1b2b22]">
                PDV (%)
              </label>
              <input
                required
                min="0"
                max="100"
                step="0.01"
                type="number"
                value={form.vat}
                onChange={(e) => setForm({ ...form, vat: e.target.value })}
                className="w-full rounded-lg border border-[#e7ece8] px-4 py-3 text-sm outline-none focus:border-[#174c35]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1b2b22]">
              Jedinica mjere
            </label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full rounded-lg border border-[#e7ece8] bg-white px-4 py-3 text-sm outline-none focus:border-[#174c35]"
            >
              <option value="kom">Komad (kom)</option>
              <option value="m">Metar (m)</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="l">Litar (l)</option>
              <option value="set">Set</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e7ece8] px-5 py-3 text-sm font-semibold text-[#66756b] hover:bg-[#f8faf8]"
            >
              Otkaži
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#174c35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#236445]"
            >
              {editing ? "Sačuvaj izmjene" : "Dodaj artikal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
