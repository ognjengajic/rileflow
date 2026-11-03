"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useQuotations } from "../../contexts/QuotationsContext";
import type { Quotation } from "../../types/quotation";

export default function QuotationHistoryPage() {
  const { quotations, deleteQuotation } = useQuotations();

  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null,
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("sr-Latn-RS");

  const formatMoney = (amount: number) =>
    amount.toLocaleString("sr-Latn-RS", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalValue = quotations.reduce(
    (sum, quotation) => sum + quotation.totalWithVat,
    0,
  );

  return (
    <main className="flex min-h-screen bg-[#f6f8f6]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mb-8">
          <p className="text-sm text-[#89968e]">
            Predračuni / Istorija predračuna
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#1b2b22]">
            Istorija predračuna
          </h1>

          <p className="mt-2 text-sm text-[#89968e]">
            Pregled svih kreiranih i sačuvanih predračuna.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#e7ece8] bg-white p-5">
            <p className="text-sm text-[#89968e]">Ukupan broj predračuna</p>
            <p className="mt-2 text-3xl font-bold text-[#174c35]">
              {quotations.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#e7ece8] bg-white p-5">
            <p className="text-sm text-[#89968e]">
              Ukupna vrijednost predračuna
            </p>
            <p className="mt-2 text-3xl font-bold text-[#174c35]">
              {formatMoney(totalValue)} KM
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e7ece8] bg-white">
          <div className="border-b border-[#e7ece8] p-5">
            <h2 className="font-semibold text-[#1b2b22]">
              Sačuvani predračuni
            </h2>
          </div>

          {quotations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold text-[#1b2b22]">
                Još nema sačuvanih predračuna.
              </p>
              <p className="mt-2 text-sm text-[#89968e]">
                Kada kreirate i sačuvate predračun, pojaviće se ovdje.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f8faf8] text-[#89968e]">
                  <tr>
                    <th className="px-5 py-4">Broj predračuna</th>
                    <th className="px-5 py-4">Datum</th>
                    <th className="px-5 py-4">Kupac</th>
                    <th className="px-5 py-4">Broj stavki</th>
                    <th className="px-5 py-4 text-right">Ukupan iznos</th>
                    <th className="px-5 py-4 text-right">Akcije</th>
                  </tr>
                </thead>

                <tbody>
                  {quotations.map((quotation) => (
                    <tr
                      key={quotation.id}
                      className="border-t border-[#e7ece8] hover:bg-[#fafcfa]"
                    >
                      <td className="px-5 py-4 font-semibold text-[#174c35]">
                        {quotation.number}
                      </td>

                      <td className="px-5 py-4 text-[#66756b]">
                        {formatDate(quotation.date)}
                      </td>

                      <td className="px-5 py-4 font-medium text-[#1b2b22]">
                        {quotation.customer.name}
                      </td>

                      <td className="px-5 py-4 text-[#66756b]">
                        {quotation.items.length}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-[#1b2b22]">
                        {formatMoney(quotation.totalWithVat)} KM
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedQuotation(quotation)}
                            className="rounded-lg bg-[#174c35] px-4 py-2 text-xs font-semibold text-white hover:bg-[#236445]"
                          >
                            Detalji
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const confirmed = window.confirm(
                                `Da li sigurno želiš obrisati predračun ${quotation.number}?`,
                              );

                              if (confirmed) {
                                deleteQuotation(quotation.id);

                                if (selectedQuotation?.id === quotation.id) {
                                  setSelectedQuotation(null);
                                }
                              }
                            }}
                            className="rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Obriši
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-4xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e7ece8] p-6">
              <div>
                <p className="text-sm text-[#89968e]">Detalji predračuna</p>
                <h2 className="mt-1 text-xl font-bold text-[#174c35]">
                  {selectedQuotation.number}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuotation(null)}
                className="text-2xl text-[#89968e] hover:text-[#1b2b22]"
                aria-label="Zatvori detalje"
              >
                ×
              </button>
            </div>

            <div className="max-h-[75vh] space-y-7 overflow-y-auto p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-semibold text-[#1b2b22]">
                    Podaci o predračunu
                  </h3>

                  <p className="text-sm text-[#66756b]">
                    Broj: {selectedQuotation.number}
                  </p>
                  <p className="mt-2 text-sm text-[#66756b]">
                    Datum: {formatDate(selectedQuotation.date)}
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-[#1b2b22]">
                    Podaci o kupcu
                  </h3>

                  <p className="text-sm font-medium text-[#1b2b22]">
                    {selectedQuotation.customer.name}
                  </p>

                  {selectedQuotation.customer.address && (
                    <p className="mt-2 text-sm text-[#66756b]">
                      Adresa: {selectedQuotation.customer.address}
                    </p>
                  )}

                  {selectedQuotation.customer.taxNumber && (
                    <p className="mt-2 text-sm text-[#66756b]">
                      JIB / PDV broj: {selectedQuotation.customer.taxNumber}
                    </p>
                  )}

                  {selectedQuotation.customer.phone && (
                    <p className="mt-2 text-sm text-[#66756b]">
                      Telefon: {selectedQuotation.customer.phone}
                    </p>
                  )}

                  {selectedQuotation.customer.email && (
                    <p className="mt-2 text-sm text-[#66756b]">
                      Email: {selectedQuotation.customer.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-[#1b2b22]">
                  Stavke predračuna
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f8faf8] text-xs text-[#89968e]">
                      <tr>
                        <th className="px-3 py-3">Artikal</th>
                        <th className="px-3 py-3">Šifra</th>
                        <th className="px-3 py-3">Serijski broj</th>
                        <th className="px-3 py-3">Cijena</th>
                        <th className="px-3 py-3">Količina</th>
                        <th className="px-3 py-3">PDV</th>
                        <th className="px-3 py-3 text-right">Ukupno</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedQuotation.items.map((item) => (
                        <tr
                          key={item.articleId}
                          className="border-t border-[#e7ece8]"
                        >
                          <td className="px-3 py-3 font-medium text-[#1b2b22]">
                            {item.name}
                          </td>
                          <td className="px-3 py-3 text-[#66756b]">
                            {item.code || "—"}
                          </td>
                          <td className="px-3 py-3 text-[#66756b]">
                            {item.serialNumber || "—"}
                          </td>
                          <td className="px-3 py-3 text-[#66756b]">
                            {formatMoney(item.price)} KM
                          </td>
                          <td className="px-3 py-3 text-[#66756b]">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="px-3 py-3 text-[#66756b]">
                            {item.vat}%
                          </td>
                          <td className="px-3 py-3 text-right font-semibold text-[#1b2b22]">
                            {formatMoney(item.price * item.quantity)} KM
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="ml-auto max-w-sm rounded-xl bg-[#f8faf8] p-5">
                <div className="flex justify-between py-2 text-sm text-[#66756b]">
                  <span>Ukupno bez PDV-a</span>
                  <span>
                    {formatMoney(selectedQuotation.totalWithoutVat)} KM
                  </span>
                </div>

                <div className="flex justify-between py-2 text-sm text-[#66756b]">
                  <span>PDV</span>
                  <span>{formatMoney(selectedQuotation.totalVat)} KM</span>
                </div>

                <div className="mt-3 flex justify-between border-t border-[#e7ece8] pt-4 text-lg font-bold text-[#174c35]">
                  <span>Ukupno sa PDV-om</span>
                  <span>{formatMoney(selectedQuotation.totalWithVat)} KM</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-[#e7ece8] p-5">
              <button
                type="button"
                onClick={() => setSelectedQuotation(null)}
                className="rounded-lg border border-[#e7ece8] px-5 py-3 text-sm font-semibold text-[#66756b] hover:bg-[#f8faf8]"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
