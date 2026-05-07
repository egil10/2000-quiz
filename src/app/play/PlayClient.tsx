"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGameState } from "@/hooks/useGameState";
import { QuizCard } from "@/components/QuizCard";
import { YearInput } from "@/components/YearInput";
import { ResultBlock } from "@/components/ResultBlock";
import { ScoreBar } from "@/components/ScoreBar";
import { FinalScreen } from "@/components/FinalScreen";
import { loadStats, recordSession, saveStats } from "@/lib/storage";
import type { GameMode, GameSession, PlayerStats } from "@/types/game";
import { modeConfig } from "@/lib/scoring";

const VALID: GameMode[] = ["klassisk", "lyn", "hardcore", "sudden"];

export default function PlayClient() {
  const params = useSearchParams();
  const modeParam = (params.get("mode") || "klassisk") as GameMode;
  const initialMode: GameMode = VALID.includes(modeParam) ? modeParam : "klassisk";

  const { state, submit, next, restart, totalPoints, lastAttempt } =
    useGameState(initialMode);

  const cfg = modeConfig(state.mode);
  const [guess, setGuess] = useState<number>(1500);
  const [timeLeft, setTimeLeft] = useState<number | null>(cfg.timePerQuestion);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [persisted, setPersisted] = useState(false);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  // Reset slider/timer at the start of each question
  useEffect(() => {
    if (state.phase === "guessing") {
      setGuess(1500);
      setTimeLeft(cfg.timePerQuestion);
    }
  }, [state.phase, state.index, cfg.timePerQuestion]);

  // Time-attack countdown
  useEffect(() => {
    if (state.phase !== "guessing" || cfg.timePerQuestion == null) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t == null) return null;
        if (t <= 1) {
          clearInterval(id);
          submit(guess);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.phase, state.index, cfg.timePerQuestion, guess, submit]);

  // Persist stats once when game ends
  useEffect(() => {
    if (state.phase !== "ended" || persisted) return;
    const session: GameSession = {
      mode: state.mode,
      attempts: state.attempts,
      totalPoints,
      startedAt: state.startedAt,
      endedAt: Date.now(),
    };
    setStats((prev) => {
      const base = prev ?? loadStats();
      const updated = recordSession(base, session);
      saveStats(updated);
      return updated;
    });
    setPersisted(true);
  }, [state.phase, state.attempts, state.mode, state.startedAt, totalPoints, persisted]);

  const restartFresh = (mode: GameMode = state.mode) => {
    setPersisted(false);
    restart(mode);
  };

  const lastEvent = useMemo(() => {
    if (!lastAttempt) return "";
    return state.queue.find((q) => q.id === lastAttempt.questionId)?.event ?? "";
  }, [lastAttempt, state.queue]);

  if (state.phase === "ended") {
    return (
      <div className="container-narrow py-10 sm:py-14">
        <FinalScreen
          attempts={state.attempts}
          totalPoints={totalPoints}
          mode={state.mode}
          highScore={stats?.highScores[state.mode] ?? 0}
          onRestart={() => restartFresh(state.mode)}
        />
      </div>
    );
  }

  if (!state.current) {
    return <div className="container-narrow py-20 text-center text-mute">Forbereder spill...</div>;
  }

  return (
    <div className="container-narrow py-8 sm:py-12 space-y-6">
      <ScoreBar
        totalPoints={totalPoints}
        index={state.index}
        total={cfg.questionCount}
        lives={cfg.livesEnabled ? state.lives : undefined}
      />

      {state.phase === "guessing" && (
        <>
          <QuizCard
            question={state.current}
            index={state.index}
            total={cfg.questionCount}
            timeLeft={timeLeft}
          />
          <div className="card p-6 sm:p-8">
            <YearInput
              value={guess}
              onChange={setGuess}
              onSubmit={() => submit(guess)}
            />
            <div className="mt-6 flex justify-end">
              <button onClick={() => submit(guess)} className="btn-primary text-base px-6 py-3">
                Send inn gjetning
              </button>
            </div>
          </div>
        </>
      )}

      {state.phase === "revealing" && lastAttempt && (
        <ResultBlock
          attempt={lastAttempt}
          isLast={
            cfg.questionCount != null && state.index + 1 >= cfg.questionCount
              ? true
              : cfg.livesEnabled && state.lives <= 0
          }
          onNext={next}
          eventText={lastEvent}
        />
      )}
    </div>
  );
}
