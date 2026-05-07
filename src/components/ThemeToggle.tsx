"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, ScrollText } from "lucide-react";
import { applyTheme } from "@/lib/theme";
import { loadSettings, saveSettings } from "@/lib/storage";
import type { Theme } from "@/types/game";
import { cn } from "@/lib/utils";

const order: Theme[] = ["lys", "morke", "pergament"];
const meta: Record<Theme, { icon: React.ElementType; label: string }> = {
  lys: { icon: Sun, label: "Lys" },
  morke: { icon: Moon, label: "Mørk" },
  pergament: { icon: ScrollText, label: "Pergament" },
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("morke");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const s = loadSettings();
    setTheme(s.theme);
  }, []);

  const change = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
    saveSettings({ ...loadSettings(), theme: t });
    setOpen(false);
  };

  const Active = meta[theme].icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-soft hover:bg-soft transition-colors"
        aria-label="Bytt tema"
      >
        <Active className="w-4 h-4" />
        <span className="hidden sm:inline">{meta[theme].label}</span>
      </button>
      {open && (
        <>
          <button
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 mt-2 w-44 rounded-xl border hairline bg-elev p-1 shadow-xl z-50 animate-fade-in">
            {order.map((t) => {
              const Icon = meta[t].icon;
              return (
                <button
                  key={t}
                  onClick={() => change(t)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    theme === t ? "bg-soft" : "hover:bg-soft",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{meta[t].label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
