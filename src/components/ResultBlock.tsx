"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Target, AlertTriangle, ArrowRight } from "lucide-react";
import { Timeline } from "./Timeline";
import type { AttemptResult } from "@/types/game";
import { distanceLabel } from "@/lib/scoring";

interface Props {
  attempt: AttemptResult;
  isLast: boolean;
  onNext: () => void;
  eventText: string;
}

export function ResultBlock({ attempt, isLast, onNext, eventText }: Props) {
  const { diff, points, guess, actual } = attempt;
  const tone =
    diff === 0 ? "good"
    : diff <= 5 ? "good"
    : diff <= 25 ? "warn"
    : "bad";

  const Icon = tone === "good" ? CheckCircle2 : tone === "warn" ? Target : AlertTriangle;
  const color = tone === "good" ? "var(--good)" : tone === "warn" ? "var(--warn)" : "var(--bad)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-7 sm:p-10 space-y-7"
    >
      <div className="flex items-start gap-4">
        <Icon className="w-8 h-8 flex-shrink-0 mt-0.5" style={{ color }} />
        <div className="flex-1">
          <h3 className="display text-2xl sm:text-3xl font-semibold">
            {distanceLabel(diff)}
          </h3>
          <p className="text-soft mt-1">
            Du gjettet <strong>{guess}</strong>. Riktig år var{" "}
            <strong style={{ color: "var(--accent)" }}>{actual}</strong>.
          </p>
          <p className="text-sm text-mute mt-2">«{eventText}»</p>
        </div>
        <div className="text-right">
          <div className="number-display text-4xl sm:text-5xl font-bold" style={{ color }}>
            +{points}
          </div>
          <div className="text-xs text-mute uppercase tracking-wider">
            {diff} år bom
          </div>
        </div>
      </div>

      <Timeline guess={guess} actual={actual} />

      <div className="flex justify-end pt-1">
        <button onClick={onNext} className="btn-primary">
          {isLast ? "Se resultatet" : "Neste"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
