import type { GameMode, GameModeConfig } from "@/types/game";

// Exponential decay: 1000 points at 0 off, ~0 by ~250 years off.
// Curve was tuned so 0=1000, 5=905, 10=819, 25=606, 50=368, 100=135, 200=18.
export function pointsForGuess(guess: number, actual: number, mode: GameMode = "klassisk"): number {
  const diff = Math.abs(guess - actual);
  if (mode === "hardcore") {
    if (diff <= 3) return 1000;
    if (diff <= 5) return 500;
    return 0;
  }
  if (mode === "lyn") {
    // Time-attack rewards precision a bit harder
    return Math.round(1000 * Math.exp(-diff / 35));
  }
  return Math.round(1000 * Math.exp(-diff / 50));
}

export function distanceLabel(diff: number): string {
  if (diff === 0) return "Helt blink!";
  if (diff <= 2) return "Utrolig nært";
  if (diff <= 5) return "Veldig nært";
  if (diff <= 15) return "Nært";
  if (diff <= 40) return "Greit";
  if (diff <= 100) return "Langt unna";
  return "Veeeldig langt unna";
}

export function ratingForPoints(points: number): { label: string; tier: number } {
  if (points >= 950) return { label: "Historiker", tier: 5 };
  if (points >= 750) return { label: "Lærd", tier: 4 };
  if (points >= 500) return { label: "Belest", tier: 3 };
  if (points >= 250) return { label: "På sporet", tier: 2 };
  if (points >= 50) return { label: "Bom skiv", tier: 1 };
  return { label: "Utenfor tidslinjen", tier: 0 };
}

export const GAME_MODES: GameModeConfig[] = [
  {
    id: "klassisk",
    name: "Klassisk",
    description: "10 spørsmål. Poeng per gjetning, jo nærmere desto bedre.",
    questionCount: 10,
    perfectThreshold: 0,
    timePerQuestion: null,
    livesEnabled: false,
  },
  {
    id: "lyn",
    name: "Lynraskt",
    description: "20 sekunder per spørsmål. Tøffere poengkurve. 10 spørsmål.",
    questionCount: 10,
    perfectThreshold: 0,
    timePerQuestion: 20,
    livesEnabled: false,
  },
  {
    id: "hardcore",
    name: "Hardcore",
    description: "Bare ±3 år gir full pott. ±5 år halv pott. Ellers null. 10 spørsmål.",
    questionCount: 10,
    perfectThreshold: 3,
    timePerQuestion: null,
    livesEnabled: false,
  },
  {
    id: "sudden",
    name: "Sudden death",
    description: "Bom mer enn 25 år og du er ute. Hvor langt kommer du?",
    questionCount: null,
    perfectThreshold: 25,
    timePerQuestion: null,
    livesEnabled: true,
  },
];

export function modeConfig(mode: GameMode): GameModeConfig {
  return GAME_MODES.find((m) => m.id === mode) ?? GAME_MODES[0];
}
