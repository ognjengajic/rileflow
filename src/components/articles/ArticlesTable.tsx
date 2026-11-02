import type { Article } from "@/types/article";

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
  return (
    <div className="overflow-hidden rounded-xl border border-[#e7ece8] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7ece8] p-5">
        <h2 className="font-semibold text-[#1b2b22]">Lista artikala</h2>

        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
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
              <th className="px-5 py-4 text-right">Akcije</th>
            </tr>
          </thead>

          <tbody>
            {articles.map((article) => (
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
                  {article.price.toFixed(2)}
                </td>

                <td className="px-5 py-4 text-[#66756b]">{article.vat}%</td>

                <td className="px-5 py-4 text-[#66756b]">{article.unit}</td>

                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(article)}
                      className="rounded-md px-3 py-2 text-xs font-semibold text-[#174c35] hover:bg-[#edf4ef]"
                    >
                      Izmijeni
                    </button>

                    <button
                      onClick={() => onDelete(article.id)}
                      className="rounded-md px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Obriši
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {articles.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-[#89968e]"
                >
                  Nema pronađenih artikala.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
