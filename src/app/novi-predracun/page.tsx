"use client";

import { useCallback, useMemo } from "react";

import Sidebar from "@/components/Sidebar";
import { useQuotations } from "../../contexts/QuotationsContext";
import type { QuotationCustomer } from "@/types/quotation";

export default function NewQuotationPage() {
  const {
    currentItems,
    currentCustomer,
    setCurrentCustomer,
    quotationNumber,
    decreaseArticleQuantity,
    saveQuotation,
  } = useQuotations();

  const customer = currentCustomer;

  const { totalWithoutVat, totalVat, totalWithVat } = useMemo(() => {
    const totals = currentItems.reduce(
      (sum, item) => {
        const itemTotal = item.price * item.quantity;
        const itemVat = (itemTotal * item.vat) / 100;

        return {
          totalWithoutVat: sum.totalWithoutVat + itemTotal,
          totalVat: sum.totalVat + itemVat,
        };
      },
      {
        totalWithoutVat: 0,
        totalVat: 0,
      },
    );

    return {
      ...totals,
      totalWithVat: totals.totalWithoutVat + totals.totalVat,
    };
  }, [currentItems]);

  const updateCustomer = useCallback(
    (field: keyof QuotationCustomer, value: string) => {
      setCurrentCustomer({
        ...customer,
        [field]: value,
      });
    },
    [customer, setCurrentCustomer],
  );

  const handleSave = useCallback(async () => {
    if (!customer.name.trim()) {
      alert("Unesite naziv kupca.");
      return;
    }

    if (currentItems.length === 0) {
      alert("Dodajte barem jedan artikal u predračun.");
      return;
    }

    try {
      const saved = await saveQuotation({
        number: quotationNumber,
        date: new Date().toISOString(),
        customer,
        totalWithoutVat,
        totalVat,
        totalWithVat,
      });

      if (saved) {
        alert("Predračun je uspješno sačuvan.");
      }
    } catch (error) {
      console.error("Greška pri čuvanju predračuna:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Predračun nije sačuvan. Pokušajte ponovo.",
      );
    }
  }, [
    customer,
    currentItems.length,
    saveQuotation,
    quotationNumber,
    totalWithoutVat,
    totalVat,
    totalWithVat,
  ]);
  return (
    <main className="min-h-screen bg-[#f6f8f6] pl-[250px] max-md:pl-[72px]">
      <Sidebar />

      <section className="min-w-0 p-6 md:p-10">
        <div className="mb-8">
          <p className="text-sm text-[#89968e]">Predračuni / Novi predračun</p>

          <h1 className="mt-2 text-3xl font-bold text-[#1b2b22]">
            Novi predračun
          </h1>

          <p className="mt-2 text-sm text-[#89968e]">
            Kreirajte predračun i pregledajte izabrane artikle.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-[#e7ece8] bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-[#1b2b22]">
            Podaci o kupcu
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ["name", "Naziv kupca *"],
                ["address", "Adresa"],
                ["taxNumber", "JIB / PDV broj"],
                ["phone", "Telefon"],
                ["email", "Email"],
              ] as [keyof QuotationCustomer, string][]
            ).map(([field, label]) => (
              <div key={field}>
                <label className="mb-1.5 block text-sm font-medium text-[#1b2b22]">
                  {label}
                </label>

                <input
                  value={customer[field]}
                  onChange={(event) =>
                    updateCustomer(field, event.target.value)
                  }
                  type={field === "email" ? "email" : "text"}
                  className="w-full rounded-lg border border-[#e7ece8] px-4 py-3 text-sm outline-none focus:border-[#174c35]"
                  placeholder={label.replace(" *", "")}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[#e7ece8] bg-white p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#1b2b22]">
              Stavke predračuna
            </h2>

            <span className="text-sm text-[#89968e]">
              Ukupno artikala: {currentItems.length}
            </span>
          </div>

          {currentItems.length === 0 ? (
            <div className="rounded-lg bg-[#f8faf8] p-8 text-center">
              <p className="font-medium text-[#1b2b22]">
                Predračun još nema artikala.
              </p>
              <p className="mt-2 text-sm text-[#89968e]">
                Izaberite artikle na stranici Artikli.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e7ece8] text-[#89968e]">
                    <th className="py-3 pr-4">Artikal</th>
                    <th className="px-3 py-3">Cijena</th>
                    <th className="px-3 py-3">Količina</th>
                    <th className="px-3 py-3">PDV</th>
                    <th className="py-3 pl-3 text-right">Ukupno</th>
                    <th className="py-3 pl-3"></th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((item) => (
                    <tr
                      key={item.articleId}
                      className="border-b border-[#e7ece8]"
                    >
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-[#1b2b22]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-[#89968e]">
                          {item.code || "Bez šifre"}
                        </p>
                      </td>

                      <td className="px-3 py-4">{item.price.toFixed(2)} KM</td>

                      <td className="px-3 py-4">
                        {item.quantity} {item.unit}
                      </td>

                      <td className="px-3 py-4">{item.vat}%</td>

                      <td className="py-4 pl-3 text-right font-semibold">
                        {(item.price * item.quantity).toFixed(2)} KM
                      </td>

                      <td className="py-4 pl-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseArticleQuantity(item.articleId)
                          }
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Ukloni
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mb-6 ml-auto max-w-sm rounded-xl border border-[#e7ece8] bg-white p-6">
          <h2 className="mb-4 font-semibold text-[#1b2b22]">Ukupan obračun</h2>

          <div className="flex justify-between py-2 text-sm text-[#66756b]">
            <span>Bez PDV-a</span>
            <span>{totalWithoutVat.toFixed(2)} KM</span>
          </div>

          <div className="flex justify-between py-2 text-sm text-[#66756b]">
            <span>PDV</span>
            <span>{totalVat.toFixed(2)} KM</span>
          </div>

          <div className="mt-3 flex justify-between border-t border-[#e7ece8] pt-4 text-lg font-bold text-[#174c35]">
            <span>Ukupno</span>
            <span>{totalWithVat.toFixed(2)} KM</span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={currentItems.length === 0}
            className="rounded-lg bg-[#174c35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#236445] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sačuvaj predračun
          </button>
        </div>
      </section>
    </main>
  );
}
