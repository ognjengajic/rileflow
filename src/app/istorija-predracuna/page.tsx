"use client";

import Sidebar from "../../components/Sidebar";
import { useQuotations } from "../../contexts/QuotationsContext";

export default function QuotationHistoryPage() {
  const { quotations } = useQuotations();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("sr-Latn-RS");

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
              {quotations
                .reduce((sum, quotation) => sum + quotation.totalWithVat, 0)
                .toLocaleString("sr-Latn-RS", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
              KM
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
                        {quotation.totalWithVat.toLocaleString("sr-Latn-RS", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        KM
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
