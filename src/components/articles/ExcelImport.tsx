"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

type ExcelImportProps = {
  onImport: (names: string[]) => void;
};

type ExcelColumn = {
  index: number;
  letter: string;
  samples: string[];
};

export default function ExcelImport({ onImport }: ExcelImportProps) {
  const [columns, setColumns] = useState<ExcelColumn[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setColumns([]);
    setRows([]);
    setFileName("");

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      if (!firstSheet) {
        throw new Error("Excel fajl nema radni list.");
      }

      const data = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, {
        header: 1,
        defval: "",
        raw: false,
      });

      if (data.length === 0) {
        throw new Error("Excel fajl je prazan.");
      }

      const maxColumns = Math.max(...data.map((row) => row.length));

      if (maxColumns === 0) {
        throw new Error("Nema podataka u Excel fajlu.");
      }

      const excelColumns: ExcelColumn[] = Array.from(
        { length: maxColumns },
        (_, index) => {
          const samples = data
            .map((row) => String(row[index] ?? "").trim())
            .filter(Boolean)
            .slice(0, 3);

          return {
            index,
            letter: XLSX.utils.encode_col(index),
            samples,
          };
        },
      );

      setColumns(excelColumns);

      setRows(data.map((row) => row.map((cell) => String(cell ?? "").trim())));

      setSelectedColumn(0);
      setFileName(file.name);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška prilikom čitanja Excel fajla.",
      );
    }

    event.target.value = "";
  }

  function confirmImport() {
    const names = rows
      .map((row) => row[selectedColumn]?.trim() ?? "")
      .filter((name, index) => name && index > 0);

    const uniqueNames = [...new Set(names)];

    if (uniqueNames.length === 0) {
      setError("Izabrana kolona ne sadrži nazive artikala.");
      return;
    }

    onImport(uniqueNames);

    setColumns([]);
    setRows([]);
    setFileName("");
    setError("");
  }

  return (
    <div className="rounded-xl border border-[#e7ece8] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-[#1b2b22]">
            Uvoz artikala iz Excela
          </h2>

          <p className="mt-1 text-sm text-[#89968e]">
            Izaberite Excel fajl i kolonu sa nazivima artikala.
          </p>
        </div>

        <label className="cursor-pointer rounded-lg border border-[#174c35] px-5 py-3 text-sm font-semibold text-[#174c35] hover:bg-[#edf4ef]">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileSelect}
          />
          Izaberi Excel fajl
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {columns.length > 0 && (
        <div className="mt-6 border-t border-[#e7ece8] pt-5">
          <p className="text-sm font-semibold text-[#1b2b22]">
            Fajl: {fileName}
          </p>

          <label className="mb-2 mt-5 block text-sm font-medium text-[#1b2b22]">
            Izaberite kolonu sa nazivima artikala
          </label>

          <select
            value={selectedColumn}
            onChange={(event) => setSelectedColumn(Number(event.target.value))}
            className="w-full rounded-lg border border-[#e7ece8] bg-white px-4 py-3 text-sm outline-none focus:border-[#174c35]"
          >
            {columns.map((column) => (
              <option key={column.index} value={column.index}>
                Kolona {column.letter}
                {column.samples.length > 0
                  ? ` — ${column.samples.join(", ")}`
                  : " — prazna"}
              </option>
            ))}
          </select>

          <div className="mt-4 rounded-lg bg-[#f8faf8] p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#89968e]">
              Primjer podataka iz izabrane kolone
            </p>

            {rows
              .map((row) => row[selectedColumn] ?? "")
              .filter(Boolean)
              .slice(0, 5)
              .map((name, index) => (
                <p
                  key={index}
                  className="border-b border-[#e7ece8] py-2 text-sm text-[#1b2b22] last:border-0"
                >
                  {name}
                </p>
              ))}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={confirmImport}
              className="rounded-lg bg-[#174c35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#236445]"
            >
              Potvrdi izbor kolone
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
