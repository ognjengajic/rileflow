"use client";

type ExcelImportProps = {
  onFileSelect: (file: File) => void;
};

export default function ExcelImport({ onFileSelect }: ExcelImportProps) {
  return (
    <div className="rounded-xl border border-[#e7ece8] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-[#1b2b22]">
            Uvoz artikala iz Excela
          </h2>

          <p className="mt-1 text-sm text-[#89968e]">
            Izaberite Excel fajl sa spiskom artikala.
          </p>
        </div>

        <label className="cursor-pointer rounded-lg border border-[#174c35] px-5 py-3 text-sm font-semibold text-[#174c35] transition hover:bg-[#edf4ef]">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onFileSelect(file);
                event.target.value = "";
              }
            }}
          />
          Izaberi Excel fajl
        </label>
      </div>
    </div>
  );
}
