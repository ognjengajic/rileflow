type DeleteArticleDialogProps = {
  articleName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteArticleDialog({
  articleName,
  onConfirm,
  onCancel,
}: DeleteArticleDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-[#1b2b22]">Brisanje artikla</h2>

        <p className="mt-3 text-sm leading-6 text-[#66756b]">
          Da li ste sigurni da želite obrisati artikal{" "}
          <strong className="text-[#1b2b22]">{articleName}</strong>? Ova akcija
          se ne može poništiti.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#e7ece8] px-5 py-3 text-sm font-semibold text-[#66756b] hover:bg-[#f8faf8]"
          >
            Otkaži
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            Obriši artikal
          </button>
        </div>
      </div>
    </div>
  );
}
