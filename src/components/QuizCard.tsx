"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { categoryMeta } from "@/components/categoryMeta";
import { relatedEvents } from "@/lib/eras";
import type { QuizQuestion } from "@/types/game";

interface Props {
  question: QuizQuestion;
  index: number;
  total: number | null;
  timeLeft?: number | null;
  hintUsed: boolean;
  onUseHint: () => void;
}

export function QuizCard({ question, index, total, timeLeft, hintUsed, onUseHint }: Props) {
  const meta = categoryMeta[question.category];
  const Icon = meta.icon;
  const totalLabel = total == null ? "∞" : total;
  const hints = hintUsed ? relatedEvents(question.year, question.id, 12, 4) : [];

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

        <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={onUseHint}
            disabled={hintUsed}
            className="btn-ghost text-xs disabled:opacity-60 disabled:cursor-default"
            aria-label="Vis hendelser fra samme tid uten årstall"
          >
            <Lightbulb
              className="w-3.5 h-3.5"
              style={{ color: hintUsed ? "var(--accent)" : undefined }}
            />
            {hintUsed ? "Hint brukt" : "Vis hint"}
          </button>
          {hintUsed && (
            <span className="text-[11px] text-mute">
              Fra omtrent samme tid · årstall vises etter gjetning
            </span>
          )}
        </div>

        {hintUsed && hints.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid sm:grid-cols-2 gap-2"
          >
            {hints.map((h) => {
              const hMeta = categoryMeta[h.category];
              const HIcon = hMeta.icon;
              return (
                <li
                  key={h.id}
                  className="rounded-xl border hairline bg-elev p-3 flex items-start gap-3"
                >
                  <span
                    className="number-display font-semibold text-sm shrink-0 px-2 py-0.5 rounded-md"
                    style={{
                      background: "color-mix(in oklab, var(--accent) 12%, transparent)",
                      color: "var(--accent)",
                    }}
                    aria-hidden
                  >
                    ?
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-mute uppercase tracking-wider mb-0.5">
                      <HIcon className="w-3 h-3" style={{ color: hMeta.color }} />
                      {hMeta.label}
                    </div>
                    <p className="text-sm leading-snug">{h.event}</p>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
