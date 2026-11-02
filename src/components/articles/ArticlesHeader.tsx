type ArticlesHeaderProps = {
  onAddArticle: () => void;
};

export default function ArticlesHeader({ onAddArticle }: ArticlesHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold tracking-[1.5px] text-[#89968e]">
          KATALOG PROIZVODA
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#1b2b22]">Artikli</h1>

        <p className="mt-2 text-sm text-[#89968e]">
          Upravljajte artiklima, cijenama i serijskim brojevima.
        </p>
      </div>

      <button
        onClick={onAddArticle}
        className="rounded-lg bg-[#174c35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#236445]"
      >
        + Dodaj artikal
      </button>
    </header>
  );
}
