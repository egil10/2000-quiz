"use client";
import { useCallback, useMemo, useReducer } from "react";
import { QUESTIONS } from "@/data/questions";
import { shuffle } from "@/lib/utils";
import { modeConfig, pointsForGuess } from "@/lib/scoring";
import { buildAttempt } from "@/lib/storage";
import type { AttemptResult, GameMode, QuizQuestion } from "@/types/game";

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
}

type Action =
  | { type: "submit"; guess: number; points: number; attempt: AttemptResult }
  | { type: "next" }
  | { type: "end" }
  | { type: "restart"; mode: GameMode };

function buildQueue(mode: GameMode): QuizQuestion[] {
  const cfg = modeConfig(mode);
  const all = shuffle(QUESTIONS);
  if (cfg.questionCount == null) return all;
  return all.slice(0, cfg.questionCount);
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
      const attempt = buildAttempt(current.id, guess, current.year, points, mode);
      dispatch({ type: "submit", guess, points, attempt });
    },
    [current, mode],
  );

  const next = useCallback(() => dispatch({ type: "next" }), []);
  const restart = useCallback((mode: GameMode) => dispatch({ type: "restart", mode }), []);
  const end = useCallback(() => dispatch({ type: "end" }), []);

  const totalPoints = useMemo(
    () => state.attempts.reduce((s, a) => s + a.points, 0),
    [state.attempts],
  );

  const lastAttempt = state.attempts[state.attempts.length - 1] ?? null;

  return { state, submit, next, restart, end, totalPoints, lastAttempt };
}
