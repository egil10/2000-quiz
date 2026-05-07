import type { AttemptResult, Category, GameMode, GameSession, PlayerStats } from "@/types/game";

const KEY = "arstallquiz.v1.stats";
const SETTINGS_KEY = "arstallquiz.v1.settings";

const ALL_CATEGORIES: Category[] = [
  "norge", "verden", "vitenskap", "kunst", "krig",
  "religion", "oppfinnelse", "idrett", "politikk", "kultur",
];

function emptyByCategory(): PlayerStats["byCategory"] {
  const result = {} as PlayerStats["byCategory"];
  for (const c of ALL_CATEGORIES) {
    result[c] = { count: 0, points: 0, avgDiff: 0 };
  }
  return result;
}

function emptyHighScores(): Record<GameMode, number> {
  return { klassisk: 0, lyn: 0, hardcore: 0, sudden: 0 };
}

export function emptyStats(): PlayerStats {
  return {
    totalQuestions: 0,
    totalPoints: 0,
    bestStreak: 0,
    perfectGuesses: 0,
    avgDiff: 0,
    byCategory: emptyByCategory(),
    recentSessions: [],
    highScores: emptyHighScores(),
  };
}

export function loadStats(): PlayerStats {
  if (typeof window === "undefined") return emptyStats();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw) as PlayerStats;
    // Defensive: ensure shape
    return {
      ...emptyStats(),
      ...parsed,
      byCategory: { ...emptyByCategory(), ...(parsed.byCategory ?? {}) },
      highScores: { ...emptyHighScores(), ...(parsed.highScores ?? {}) },
    };
  } catch {
    return emptyStats();
  }
}

export function saveStats(stats: PlayerStats) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(stats));
}

export function resetStats() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

import { QUESTIONS } from "@/data/questions";

export function recordSession(prev: PlayerStats, session: GameSession): PlayerStats {
  const next: PlayerStats = JSON.parse(JSON.stringify(prev));
  let streak = 0;
  let bestStreak = next.bestStreak;
  let totalDiffSum = next.avgDiff * next.totalQuestions;

  for (const a of session.attempts) {
    next.totalQuestions += 1;
    next.totalPoints += a.points;
    totalDiffSum += a.diff;
    if (a.diff === 0) next.perfectGuesses += 1;
    if (a.diff <= 5) {
      streak += 1;
      if (streak > bestStreak) bestStreak = streak;
    } else {
      streak = 0;
    }
    const q = QUESTIONS.find((x) => x.id === a.questionId);
    if (q) {
      const c = next.byCategory[q.category];
      const newCount = c.count + 1;
      c.avgDiff = (c.avgDiff * c.count + a.diff) / newCount;
      c.count = newCount;
      c.points += a.points;
    }
  }
  next.bestStreak = bestStreak;
  next.avgDiff = next.totalQuestions
    ? totalDiffSum / next.totalQuestions
    : 0;
  if (session.totalPoints > (next.highScores[session.mode] ?? 0)) {
    next.highScores[session.mode] = session.totalPoints;
  }
  next.recentSessions = [session, ...next.recentSessions].slice(0, 12);
  return next;
}

export type Settings = {
  theme: "lys" | "morke" | "pergament";
};

export function loadSettings(): Settings {
  if (typeof window === "undefined") return { theme: "morke" };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { theme: "morke" };
    return { theme: "morke", ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return { theme: "morke" };
  }
}

export function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function buildAttempt(
  questionId: number,
  guess: number,
  actual: number,
  points: number,
  mode: GameMode,
): AttemptResult {
  return {
    questionId,
    guess,
    actual,
    diff: Math.abs(guess - actual),
    points,
    timestamp: Date.now(),
    mode,
  };
}
