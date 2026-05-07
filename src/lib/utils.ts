import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffle<T>(input: T[], seed?: number): T[] {
  const arr = [...input];
  let m = arr.length;
  let s = seed ?? Math.floor(Math.random() * 2 ** 31);
  while (m) {
    s = (s * 9301 + 49297) % 233280;
    const i = Math.floor((s / 233280) * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}

export function formatYear(year: number): string {
  if (year <= 0) return `${Math.abs(year)} f.Kr.`;
  return `${year}`;
}

export function clampYear(n: number): number {
  if (Number.isNaN(n)) return 1000;
  return Math.max(0, Math.min(2000, Math.round(n)));
}
