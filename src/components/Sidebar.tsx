"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Artikli", href: "/", icon: "▦" },
  {
    label: "Novi predračun",
    href: "/novi-predracun",
    icon: "＋",
  },
  {
    label: "Istorija predračuna",
    href: "/istorija-predracuna",
    icon: "▤",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-[250px] shrink-0 flex-col bg-[#173d2c] px-[18px] py-7 text-white max-md:w-[72px] max-md:px-2.5">
      <Link
        href="/"
        className="flex items-center gap-[11px] px-2.5 text-[21px] font-bold tracking-tight max-md:justify-center max-md:px-0"
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-white text-xl text-[#173d2c]">
          R
        </div>
        <span className="max-md:hidden">RileFlow</span>
      </Link>

      <nav className="mt-[55px] max-md:mt-10">
        <p className="mb-3.5 px-3 text-[10px] font-bold tracking-[1.5px] text-[#a8c1b2] max-md:hidden">
          MENI
        </p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`mb-1 flex items-center gap-[13px] rounded-lg px-3 py-3 text-sm transition-colors max-md:justify-center max-md:px-1 ${
                isActive
                  ? "bg-[#28563f] text-white"
                  : "text-[#d1ded6] hover:bg-[#28563f] hover:text-white"
              }`}
            >
              <span className="w-5 shrink-0 text-center text-lg">
                {item.icon}
              </span>
              <span className="max-md:hidden">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-[11px] border-t border-[#315743] px-2 pt-[18px] max-md:justify-center max-md:px-0">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#dce9df] font-bold text-[#173d2c]">
          R
        </div>

        <div className="max-md:hidden">
          <p className="text-[13px] font-semibold">Administrator</p>
          <p className="mt-1 text-[11px] text-[#b4c9bb]">Upravitelj sistema</p>
        </div>
      </div>
    </aside>
  );
}
