"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Target, AlertTriangle, ArrowRight, Quote, Calendar } from "lucide-react";
import { Timeline } from "./Timeline";
import { categoryMeta } from "./categoryMeta";
import type { AttemptResult } from "@/types/game";
import { distanceLabel } from "@/lib/scoring";
import { eraForYear, decadeLabel, centuryLabel, relatedEvents } from "@/lib/eras";

interface Props {
  attempt: AttemptResult;
  isLast: boolean;
  onNext: () => void;
  eventText: string;
}

export function ResultBlock({ attempt, isLast, onNext, eventText }: Props) {
  const { diff, points, guess, actual, questionId } = attempt;
  const tone =
    diff === 0 ? "good"
    : diff <= 5 ? "good"
    : diff <= 25 ? "warn"
    : "bad";

  const Icon = tone === "good" ? CheckCircle2 : tone === "warn" ? Target : AlertTriangle;
  const color = tone === "good" ? "var(--good)" : tone === "warn" ? "var(--warn)" : "var(--bad)";
  const era = eraForYear(actual);
  const decade = decadeLabel(actual);
  const century = centuryLabel(actual);
  const related = relatedEvents(actual, questionId, 12, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-6 sm:p-10 space-y-8"
    >
      {/* hero header */}
      <div className="grid sm:grid-cols-[1fr,auto] gap-6 items-start">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 mb-3">
            <Icon className="w-7 h-7 flex-shrink-0" style={{ color }} />
            <h3 className="display text-3xl sm:text-4xl font-semibold leading-tight">
              {distanceLabel(diff)}
            </h3>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <Quote
              className="w-3.5 h-3.5 mt-1.5 flex-shrink-0"
              style={{ color: "var(--fg-mute)" }}
            />
            <p className="text-soft text-base sm:text-lg leading-relaxed italic">
              {eventText}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 16 }}
          className="rounded-2xl border hairline px-6 py-4 text-center min-w-[140px] flex-shrink-0 self-start"
          style={{
            background: `color-mix(in oklab, ${color} 12%, var(--bg-elev))`,
            borderColor: `color-mix(in oklab, ${color} 35%, var(--line))`,
          }}
        >
          <div className="number-display text-4xl sm:text-5xl font-bold leading-none" style={{ color }}>
            +{points}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-mute mt-2">poeng</div>
        </motion.div>
      </div>

      {/* fact strip */}
      <div className="grid grid-cols-3 gap-3">
        <FactCard label="Du gjettet" value={guess.toString()} />
        <FactCard label="Riktig år" value={actual.toString()} accent />
        <FactCard label="Bom" value={`${diff} år`} tone={tone} />
      </div>

      {/* era / decade / century chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-mute mr-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Plassert i:
        </span>
        <span
          className="chip"
          style={{ color: era.color, borderColor: era.color + "55", background: era.color + "12" }}
        >
          {era.label}
        </span>
        <span className="chip">{century}</span>
        <span className="chip">{decade}</span>
      </div>

      {/* timeline */}
      <Timeline guess={guess} actual={actual} />

      {/* related events */}
      {related.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-widest text-mute mb-3">
            Fra omtrent samme tid
          </h4>
          <ul className="grid sm:grid-cols-2 gap-2">
            {related.map((r) => {
              const meta = categoryMeta[r.category];
              const MetaIcon = meta.icon;
              return (
                <li
                  key={r.id}
                  className="rounded-xl border hairline bg-elev p-3 flex items-start gap-3"
                >
                  <span
                    className="number-display font-semibold text-sm shrink-0 px-2 py-0.5 rounded-md"
                    style={{
                      background: "color-mix(in oklab, var(--accent) 12%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    {r.year}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-mute uppercase tracking-wider mb-0.5">
                      <MetaIcon className="w-3 h-3" style={{ color: meta.color }} />
                      {meta.label}
                    </div>
                    <p className="text-sm leading-snug">{r.event}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button onClick={onNext} className="btn-primary text-base px-6 py-3">
          {isLast ? "Se resultatet" : "Neste"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function FactCard({
  label, value, accent, tone,
}: { label: string; value: string; accent?: boolean; tone?: "good" | "warn" | "bad" }) {
  const color =
    tone === "good" ? "var(--good)"
    : tone === "warn" ? "var(--warn)"
    : tone === "bad" ? "var(--bad)"
    : accent ? "var(--accent)"
    : undefined;
  return (
    <div className="rounded-xl border hairline bg-elev px-4 py-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-mute">{label}</div>
      <div
        className="number-display text-2xl sm:text-3xl font-semibold mt-1"
        style={color ? { color } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
