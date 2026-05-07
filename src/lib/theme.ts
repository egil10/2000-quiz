"use client";
import type { Theme } from "@/types/game";

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("theme-lys", "theme-morke", "theme-pergament", "dark");
  switch (theme) {
    case "morke":
      root.classList.add("theme-morke", "dark");
      break;
    case "pergament":
      root.classList.add("theme-pergament");
      break;
    default:
      root.classList.add("theme-lys");
  }
  root.dataset.theme = theme;
}
