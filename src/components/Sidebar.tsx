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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[250px] shrink-0 flex-col overflow-y-auto bg-[#173d2c] px-[18px] py-7 text-white shadow-lg animate-in fade-in slide-in-from-left-2 duration-300 max-md:w-[72px] max-md:px-2.5">
      <Link
        href="/"
        className="flex items-center gap-[11px] px-2.5 text-[21px] font-bold tracking-tight transition-all duration-300 hover:translate-x-1 max-md:justify-center max-md:px-0"
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-white text-xl text-[#173d2c] transition-transform duration-300 hover:scale-110">
          R
        </div>
        <span className="max-md:hidden">RileFlow</span>
      </Link>

      <nav className="mt-[55px] max-md:mt-10">
        <p className="mb-3.5 px-3 text-[10px] font-bold tracking-[1.5px] text-[#a8c1b2] max-md:hidden">
          MENI
        </p>

        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              style={{ animationDelay: `${index * 70}ms` }}
              className={`mb-1 flex animate-in fade-in slide-in-from-left-2 items-center gap-[13px] rounded-lg px-3 py-3 text-sm transition-all duration-200 hover:translate-x-1 max-md:justify-center max-md:px-1 ${
                isActive
                  ? "bg-[#28563f] text-white shadow-sm"
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
    </aside>
  );
}
