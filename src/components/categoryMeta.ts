import {
  Flag, Globe2, FlaskConical, Palette, Swords, Church,
  Lightbulb, Trophy, Landmark, Music2,
} from "lucide-react";
import type { Category } from "@/types/game";

export const categoryMeta: Record<
  Category,
  { label: string; icon: React.ElementType; color: string }
> = {
  norge:        { label: "Norge",       icon: Flag,         color: "#dc2626" },
  verden:       { label: "Verden",      icon: Globe2,       color: "#2563eb" },
  vitenskap:    { label: "Vitenskap",   icon: FlaskConical, color: "#0891b2" },
  kunst:        { label: "Kunst",       icon: Palette,      color: "#db2777" },
  krig:         { label: "Krig",        icon: Swords,       color: "#92400e" },
  religion:     { label: "Religion",    icon: Church,       color: "#7c3aed" },
  oppfinnelse:  { label: "Oppfinnelse", icon: Lightbulb,    color: "#ca8a04" },
  idrett:       { label: "Idrett",      icon: Trophy,       color: "#16a34a" },
  politikk:     { label: "Politikk",    icon: Landmark,     color: "#475569" },
  kultur:       { label: "Kultur",      icon: Music2,       color: "#be185d" },
};
