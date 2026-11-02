import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[#f6f8f6]">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[1.5px] text-[#89968e]">
              PREGLED POSLOVANJA
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#1b2b22]">
              Dashboard
            </h1>
          </div>

          <button className="rounded-lg bg-[#174c35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#236445]">
            + Novi predračun
          </button>
        </header>

        <div className="rounded-xl border border-[#e7ece8] bg-white p-10">
          <p className="text-xs font-bold tracking-widest text-[#174c35]">
            RILEFLOW
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-[#1b2b22]">
            Dobrodošao u RileFlow
          </h2>

          <p className="mt-2 text-sm text-[#89968e]">
            Upravljaj predračunima, proizvodima i kupcima na jednom mjestu.
          </p>
        </div>
      </section>
    </main>
  );
}
