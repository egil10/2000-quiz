"use client";
import { motion, AnimatePresence } from "framer-motion";
import { categoryMeta } from "@/components/categoryMeta";
import type { QuizQuestion } from "@/types/game";

interface Props {
  question: QuizQuestion;
  index: number;
  total: number | null;
  timeLeft?: number | null;
}

export function QuizCard({ question, index, total, timeLeft }: Props) {
  const meta = categoryMeta[question.category];
  const Icon = meta.icon;
  const totalLabel = total == null ? "∞" : total;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="card p-7 sm:p-10"
      >
        <div className="flex items-center justify-between text-xs text-mute mb-5">
          <div className="flex items-center gap-2">
            <span className="chip" style={{ color: meta.color, borderColor: meta.color + "55" }}>
              <Icon className="w-3.5 h-3.5" /> {meta.label}
            </span>
            <span className="chip uppercase tracking-wider">{question.difficulty}</span>
          </div>
          <div className="flex items-center gap-3">
            {typeof timeLeft === "number" && (
              <span className="chip" style={{ color: timeLeft <= 5 ? "var(--bad)" : "var(--fg-soft)" }}>
                {timeLeft}s
              </span>
            )}
            <span className="font-medium">
              Spørsmål {index + 1} <span className="text-mute">/ {totalLabel}</span>
            </span>
          </div>
        </div>

        <p className="text-mute text-sm uppercase tracking-[0.2em] mb-3">Hva år skjedde dette?</p>
        <h2 className="display text-2xl sm:text-3xl md:text-4xl leading-tight font-semibold">
          {question.event}
        </h2>
        {question.hint && (
          <p className="mt-3 text-sm text-soft">{question.hint}</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
