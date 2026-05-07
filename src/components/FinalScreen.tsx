"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, RotateCcw, Home, Trophy } from "lucide-react";
import type { AttemptResult, GameMode } from "@/types/game";
import { ratingForPoints } from "@/lib/scoring";
import { categoryMeta } from "./categoryMeta";
import { QUESTIONS } from "@/data/questions";

interface Props {
  attempts: AttemptResult[];
  totalPoints: number;
  mode: GameMode;
  onRestart: () => void;
  highScore: number;
}

export function FinalScreen({ attempts, totalPoints, mode, onRestart, highScore }: Props) {
  const avgDiff = attempts.length
    ? attempts.reduce((s, a) => s + a.diff, 0) / attempts.length
    : 0;
  const perfect = attempts.filter((a) => a.diff === 0).length;
  const avgPoints = attempts.length ? totalPoints / attempts.length : 0;
  const rating = ratingForPoints(avgPoints);
  const isNewHigh = totalPoints > 0 && totalPoints >= highScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="card p-8 text-center">
        <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--accent)" }} />
        <p className="text-mute text-xs uppercase tracking-widest">Du fikk</p>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 14 }}
          className="number-display text-6xl sm:text-7xl font-bold my-2"
          style={{ color: "var(--accent)" }}
        >
          {totalPoints.toLocaleString("nb-NO")}
        </motion.div>
        <p className="display text-xl font-semibold">{rating.label}</p>
        {isNewHigh && (
          <div className="mt-4 inline-flex items-center gap-2 chip" style={{ color: "var(--accent)" }}>
            <Trophy className="w-3.5 h-3.5" /> Ny rekord i {mode}!
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Spørsmål" value={attempts.length.toString()} />
        <Stat label="Snitt bom" value={`${Math.round(avgDiff)} år`} />
        <Stat label="Blink" value={perfect.toString()} />
      </div>

      <div className="card p-5">
        <h3 className="display text-lg font-semibold mb-3">Oppsummering</h3>
        <ul className="divide-y hairline">
          {attempts.map((a, i) => {
            const q = QUESTIONS.find((x) => x.id === a.questionId);
            if (!q) return null;
            const meta = categoryMeta[q.category];
            const Icon = meta.icon;
            return (
              <li key={i} className="py-3 flex items-start gap-3">
                <Icon className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: meta.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug truncate">{q.event}</p>
                  <p className="text-xs text-mute mt-0.5">
                    Du: <span className="number-display">{a.guess}</span> · Fasit:{" "}
                    <span className="number-display" style={{ color: "var(--accent)" }}>{a.actual}</span> · {a.diff} år bom
                  </p>
                </div>
                <div className="number-display text-sm font-semibold flex-shrink-0">+{a.points}</div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={onRestart} className="btn-primary">
          <RotateCcw className="w-4 h-4" /> Spill igjen
        </button>
        <Link href="/" className="btn">
          <Home className="w-4 h-4" /> Tilbake til start
        </Link>
        <Link href="/stats" className="btn-ghost">
          Se all statistikk
        </Link>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-xs text-mute uppercase tracking-wider">{label}</p>
      <p className="number-display text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
