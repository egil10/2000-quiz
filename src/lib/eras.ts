import { QUESTIONS } from "@/data/questions";
import type { QuizQuestion } from "@/types/game";

export interface Era {
  from: number;
  to: number;
  label: string;
  short: string;
  color: string;
}

export const ERAS: Era[] = [
  { from: 0,    to: 500,  label: "Antikken",            short: "Antikken",      color: "#a16207" },
  { from: 500,  to: 1000, label: "Tidlig middelalder",  short: "Tidlig mid.",   color: "#7c3aed" },
  { from: 1000, to: 1300, label: "Høymiddelalder",      short: "Høymid.",       color: "#9333ea" },
  { from: 1300, to: 1500, label: "Senmiddelalder",      short: "Senmid.",       color: "#a855f7" },
  { from: 1500, to: 1800, label: "Tidlig moderne tid",  short: "Tidlig mod.",   color: "#0891b2" },
  { from: 1800, to: 1900, label: "1800-tallet",         short: "1800-t.",       color: "#0284c7" },
  { from: 1900, to: 2000, label: "1900-tallet",         short: "1900-t.",       color: "#dc2626" },
  { from: 2000, to: 2001, label: "Millenniumsskiftet",  short: "År 2000",       color: "#f97316" },
];

export function eraForYear(year: number): Era {
  return ERAS.find((e) => year >= e.from && year < e.to) ?? ERAS[ERAS.length - 1];
}

export function decadeLabel(year: number): string {
  const d = Math.floor(year / 10) * 10;
  if (d < 10) return "0-årene";
  return `${d}-årene`;
}

export function centuryLabel(year: number): string {
  // Strict ordinal: year 50 → 1. århundre, 1895 → 19. århundre, 2000 → 20. århundre
  if (year <= 0) return "1. århundre";
  const ordinal = Math.ceil(year / 100);
  return `${ordinal}. århundre`;
}

export function relatedEvents(
  actualYear: number,
  excludeId: number,
  windowYears: number = 12,
  max: number = 4,
): QuizQuestion[] {
  return QUESTIONS
    .filter((q) => q.id !== excludeId && Math.abs(q.year - actualYear) <= windowYears)
    .sort((a, b) => Math.abs(a.year - actualYear) - Math.abs(b.year - actualYear))
    .slice(0, max);
}

export function eventsByYear(year: number, excludeId?: number): QuizQuestion[] {
  return QUESTIONS.filter((q) => q.year === year && q.id !== excludeId);
}
