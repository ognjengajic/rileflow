"use client";

import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import { useQuotations } from "../../contexts/QuotationsContext";
import type { Quotation } from "../../types/quotation";

export default function QuotationHistoryPage() {
  const { quotations, deleteQuotation } = useQuotations();

  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null,
  );

  const [printingQuotation, setPrintingQuotation] = useState<Quotation | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    if (!printingQuotation) return;

    const handleAfterPrint = () => {
      setPrintingQuotation(null);
    };

    window.addEventListener("afterprint", handleAfterPrint);
    window.print();

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [printingQuotation]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("sr-Latn-RS");

  const formatMoney = (amount: number) =>
    amount.toLocaleString("sr-Latn-RS", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase("sr-Latn");

  const filteredQuotations = quotations.filter((quotation) => {
    const searchableValues = [
      quotation.number,
      quotation.customer.name,
      quotation.customer.taxNumber,
      quotation.customer.phone,
      quotation.customer.email,
    ];

    return searchableValues.some((value) =>
      (value || "").toLocaleLowerCase("sr-Latn").includes(normalizedSearch),
    );
  });

  const visibleQuotations = filteredQuotations.slice(0, visibleCount);

  return (
    <>
      <main className="min-h-screen bg-[#f6f8f6] pl-[250px] max-md:pl-[72px] print:hidden">
        <Sidebar />

        <section className="min-w-0 p-6 md:p-10">
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

          <p className="mb-6 text-sm text-[#89968e]">
            Ukupan broj predračuna:{" "}
            <span className="font-semibold text-[#174c35]">
              {quotations.length}
            </span>
          </p>

          <div className="overflow-hidden rounded-xl border border-[#e7ece8] bg-white">
            <div className="space-y-4 border-b border-[#e7ece8] p-5">
              <h2 className="font-semibold text-[#1b2b22]">
                Sačuvani predračuni
              </h2>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setVisibleCount(20);
                  }}
                  placeholder="Pretraži po broju, kupcu, JIB-u, telefonu ili emailu..."
                  className="w-full rounded-lg border border-[#e7ece8] px-4 py-3 pl-10 text-sm outline-none transition-colors focus:border-[#174c35]"
                />

                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#89968e]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
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
            ) : filteredQuotations.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-semibold text-[#1b2b22]">
                  Nema rezultata pretrage.
                </p>
                <p className="mt-2 text-sm text-[#89968e]">
                  Pokušajte sa drugim pojmom za pretragu.
                </p>
              </div>
            ) : (
              <>
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
                      {visibleQuotations.map((quotation) => (
                        <tr
                          key={quotation.id}
                          className="border-t border-[#e7ece8] hover:bg-[#fafcfa]"
                        >
                          <td className="px-5 py-4 text-xs font-medium text-[#174c35]">
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
                                onClick={() => setPrintingQuotation(quotation)}
                                className="rounded-lg border border-[#174c35] px-4 py-2 text-xs font-semibold text-[#174c35] hover:bg-[#edf4ef]"
                              >
                                Izvezi PDF
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    `Da li sigurno želiš obrisati predračun ${quotation.number}?`,
                                  );

                                  if (confirmed) {
                                    deleteQuotation(quotation.id);

                                    if (
                                      selectedQuotation?.id === quotation.id
                                    ) {
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

                {visibleCount < filteredQuotations.length && (
                  <div className="border-t border-[#e7ece8] p-4 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((current) => current + 100)
                      }
                      className="rounded-lg border border-[#174c35] px-5 py-2.5 text-sm font-semibold text-[#174c35] transition-colors hover:bg-[#edf4ef]"
                    >
                      Prikaži još{" "}
                      {Math.min(100, filteredQuotations.length - visibleCount)}{" "}
                      predračuna
                    </button>
                  </div>
                )}
              </>
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
                    <span>
                      {formatMoney(selectedQuotation.totalWithVat)} KM
                    </span>
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

      {printingQuotation && (
        <div className="hidden bg-white p-10 text-black print:block">
          <header className="mb-8 border-b-2 border-[#174c35] pb-5">
            <h1 className="text-3xl font-bold text-[#174c35]">Lada Centar</h1>

            <h2 className="mt-6 text-2xl font-bold">PREDRAČUN</h2>

            <div className="mt-4 flex justify-end text-sm">
              <span>Datum: {formatDate(printingQuotation.date)}</span>
            </div>
          </header>

          <section className="mb-8">
            <h3 className="mb-3 font-bold">Podaci o kupcu</h3>
            <p>{printingQuotation.customer.name}</p>

            {printingQuotation.customer.address && (
              <p>Adresa: {printingQuotation.customer.address}</p>
            )}
            {printingQuotation.customer.taxNumber && (
              <p>JIB / PDV broj: {printingQuotation.customer.taxNumber}</p>
            )}
            {printingQuotation.customer.phone && (
              <p>Telefon: {printingQuotation.customer.phone}</p>
            )}
            {printingQuotation.customer.email && (
              <p>Email: {printingQuotation.customer.email}</p>
            )}
          </section>

          <section>
            <h3 className="mb-3 font-bold">Stavke predračuna</h3>

            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-gray-400">
                  <th className="px-2 py-3">Artikal</th>
                  <th className="px-2 py-3">Šifra</th>
                  <th className="px-2 py-3">Serijski broj</th>
                  <th className="px-2 py-3">Cijena</th>
                  <th className="px-2 py-3">Količina</th>
                  <th className="px-2 py-3">PDV</th>
                  <th className="px-2 py-3 text-right">Ukupno</th>
                </tr>
              </thead>

              <tbody>
                {printingQuotation.items.map((item) => (
                  <tr key={item.articleId} className="border-b border-gray-300">
                    <td className="px-2 py-3">{item.name}</td>
                    <td className="px-2 py-3">{item.code || "—"}</td>
                    <td className="px-2 py-3">{item.serialNumber || "—"}</td>
                    <td className="px-2 py-3">{formatMoney(item.price)} KM</td>
                    <td className="px-2 py-3">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-2 py-3">{item.vat}%</td>
                    <td className="px-2 py-3 text-right">
                      {formatMoney(item.price * item.quantity)} KM
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="ml-auto mt-8 max-w-sm">
            <div className="flex justify-between py-2 text-sm">
              <span>Ukupno bez PDV-a</span>
              <span>{formatMoney(printingQuotation.totalWithoutVat)} KM</span>
            </div>

            <div className="flex justify-between py-2 text-sm">
              <span>PDV</span>
              <span>{formatMoney(printingQuotation.totalVat)} KM</span>
            </div>

            <div className="mt-3 flex justify-between border-t-2 border-gray-400 pt-4 text-lg font-bold">
              <span>Ukupno sa PDV-om</span>
              <span>{formatMoney(printingQuotation.totalWithVat)} KM</span>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
