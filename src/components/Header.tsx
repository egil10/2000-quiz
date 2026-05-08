"use client";
import Link from "next/link";
import { Hourglass, BarChart3, Sparkles, Library, Telescope } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const links = [
    { href: "/play", label: "Spill", icon: Sparkles },
    { href: "/tidslinje", label: "Tidslinje", icon: Telescope },
    { href: "/historikk", label: "Historikk", icon: Library },
    { href: "/stats", label: "Statistikk", icon: BarChart3 },
  ];
  return (
    <header className="sticky top-0 z-30 border-b hairline backdrop-blur-md bg-[color:var(--bg)]/80">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-9 h-9 rounded-xl border hairline bg-elev shadow-sm">
            <Hourglass className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="display text-lg font-semibold">Årstallquiz</span>
            <span className="text-[11px] text-mute -mt-0.5">år 0 → 2000</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
                  active ? "bg-soft text-[color:var(--fg)]" : "text-soft hover:bg-soft",
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
