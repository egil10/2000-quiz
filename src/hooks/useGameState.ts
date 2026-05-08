"use client";
import { useCallback, useMemo, useReducer } from "react";
import { QUESTIONS } from "@/data/questions";
import { shuffle } from "@/lib/utils";
import { modeConfig, pointsForGuess } from "@/lib/scoring";
import { buildAttempt } from "@/lib/storage";
import type { AttemptResult, GameMode, QuizQuestion } from "@/types/game";

// Bucket the dataset by century once at module load. Used by the balanced
// sampler so a 10-question round doesn't end up 70% 1900s just because
// Wikipedia covers recent history more thoroughly.
const BUCKETS: QuizQuestion[][] = (() => {
  const out: QuizQuestion[][] = [];
  for (const q of QUESTIONS) {
    const c = Math.min(20, Math.floor(q.year / 100));
    if (!out[c]) out[c] = [];
    out[c].push(q);
  }
  return out;
})();
const NON_EMPTY_BUCKETS = BUCKETS.filter((b) => b && b.length > 0);

function pickBalanced(count: number): QuizQuestion[] {
  if (NON_EMPTY_BUCKETS.length === 0) return [];
  const used = new Set<number>();
  const result: QuizQuestion[] = [];
  let safety = count * 50;
  while (result.length < count && safety-- > 0) {
    const bucket = NON_EMPTY_BUCKETS[Math.floor(Math.random() * NON_EMPTY_BUCKETS.length)];
    const candidate = bucket[Math.floor(Math.random() * bucket.length)];
    if (used.has(candidate.id)) continue;
    used.add(candidate.id);
    result.push(candidate);
  }
  return result;
}

type Phase = "guessing" | "revealing" | "ended";

interface State {
  mode: GameMode;
  queue: QuizQuestion[];
  index: number;
  current: QuizQuestion | null;
  attempts: AttemptResult[];
  phase: Phase;
  lives: number;
  startedAt: number;
  hintUsed: boolean;
  hintsUsed: number;
}

type Action =
  | { type: "submit"; guess: number; points: number; attempt: AttemptResult }
  | { type: "next" }
  | { type: "hint" }
  | { type: "end" }
  | { type: "restart"; mode: GameMode };

function buildQueue(mode: GameMode): QuizQuestion[] {
  const cfg = modeConfig(mode);
  // Endless modes still need a queue (we'll regenerate before exhausting); 200
  // is plenty for one sitting and keeps memory cheap.
  const target = cfg.questionCount ?? 200;
  return shuffle(pickBalanced(target));
}

function init(mode: GameMode): State {
  const queue = buildQueue(mode);
  return {
    mode,
    queue,
    index: 0,
    current: queue[0] ?? null,
    attempts: [],
    phase: "guessing",
    lives: modeConfig(mode).livesEnabled ? 1 : Infinity,
    startedAt: Date.now(),
    hintUsed: false,
    hintsUsed: 0,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "submit": {
      const cfg = modeConfig(state.mode);
      let lives = state.lives;
      if (cfg.livesEnabled && action.attempt.diff > cfg.perfectThreshold) {
        lives = 0;
      }
      return {
        ...state,
        attempts: [...state.attempts, action.attempt],
        phase: "revealing",
        lives,
      };
    }
    case "hint": {
      if (state.hintUsed) return state;
      return {
        ...state,
        hintUsed: true,
        hintsUsed: state.hintsUsed + 1,
      };
    }
    case "next": {
      const cfg = modeConfig(state.mode);
      if (state.lives <= 0) {
        return { ...state, phase: "ended" };
      }
      const nextIndex = state.index + 1;
      const limit = cfg.questionCount ?? state.queue.length;
      if (nextIndex >= limit || nextIndex >= state.queue.length) {
        return { ...state, phase: "ended" };
      }
      return {
        ...state,
        index: nextIndex,
        current: state.queue[nextIndex],
        phase: "guessing",
        hintUsed: false,
      };
    }
    case "end":
      return { ...state, phase: "ended" };
    case "restart":
      return init(action.mode);
    default:
      return state;
  }
}

export function useGameState(initialMode: GameMode = "klassisk") {
  const [state, dispatch] = useReducer(reducer, initialMode, init);

  const current = state.current;
  const mode = state.mode;
  const submit = useCallback(
    (guess: number) => {
      if (!current) return;
      const points = pointsForGuess(guess, current.year, mode);
      const attempt = buildAttempt(
        current.id,
        guess,
        current.year,
        points,
        mode,
        current.category,
      );
      dispatch({ type: "submit", guess, points, attempt });
    },
    [current, mode],
  );

  const next = useCallback(() => dispatch({ type: "next" }), []);
  const useHint = useCallback(() => dispatch({ type: "hint" }), []);
  const restart = useCallback((mode: GameMode) => dispatch({ type: "restart", mode }), []);
  const end = useCallback(() => dispatch({ type: "end" }), []);

  const totalPoints = useMemo(
    () => state.attempts.reduce((s, a) => s + a.points, 0),
    [state.attempts],
  );

  const lastAttempt = state.attempts[state.attempts.length - 1] ?? null;

  return { state, submit, next, useHint, restart, end, totalPoints, lastAttempt };
}
