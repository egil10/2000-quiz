"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, Flame, Target, Crosshair, TrendingDown } from "lucide-react";
import type { AttemptResult } from "@/types/game";

interface Props {
  attempts: AttemptResult[];
  totalPoints: number;
  index: number;
  total: number | null;
  lives?: number;
}

function computeStreak(attempts: AttemptResult[]): number {
  let s = 0;
  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].diff <= 5) s += 1;
    else break;
  }
  return s;
}

export function ScoreBar({ attempts, totalPoints, index, total, lives }: Props) {
  const pct = total == null ? 0 : Math.min(100, (index / total) * 100);
  const totalBom = attempts.reduce((s, a) => s + a.diff, 0);
  const avgBom = attempts.length ? totalBom / attempts.length : 0;
  const streak = computeStreak(attempts);
  const best = attempts.length
    ? attempts.reduce((m, a) => (a.diff < m.diff ? a : m))
    : null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
        <Stat
          label="Poeng"
          value={totalPoints.toLocaleString("nb-NO")}
          icon={Star}
          accent
          animateValue={totalPoints}
        />
        <Stat
          label="Total bom"
          value={`${totalBom.toLocaleString("nb-NO")} år`}
          icon={Crosshair}
          animateValue={totalBom}
        />
        <Stat
          label="Snitt bom"
          value={attempts.length ? `${Math.round(avgBom)} år` : "–"}
          icon={TrendingDown}
          animateValue={Math.round(avgBom)}
        />
        <Stat
          label="Beste"
          value={best ? `${best.diff} år` : "–"}
          icon={Target}
          animateValue={best?.diff ?? 0}
        />
        <StreakStat streak={streak} className="col-span-2 sm:col-span-1" />
      </div>

      {total != null && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-mute">
            <span>{index} / {total} fullført</span>
            {lives != null && Number.isFinite(lives) && (
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" style={{ color: "var(--bad)" }} fill="currentColor" />
                {lives} liv
              </span>
            )}
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-soft border hairline">
            <motion.div
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full"
              style={{
                background:
                  "linear-gradient(to right, var(--accent), color-mix(in oklab, var(--accent) 60%, white))",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label, value, icon: Icon, accent, animateValue,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: boolean;
  animateValue: number;
}) {
  return (
    <div className="rounded-xl border hairline bg-elev px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-mute">
        <Icon className="w-3 h-3" style={{ color: accent ? "var(--accent)" : "var(--fg-mute)" }} />
        {label}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={animateValue}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 6, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="number-display text-lg font-semibold leading-tight"
          style={accent ? { color: "var(--accent)" } : undefined}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StreakStat({ streak, className }: { streak: number; className?: string }) {
  const active = streak >= 2;
  return (
    <div
      className={`rounded-xl border hairline px-3 py-2.5 transition-colors ${className ?? ""}`}
      style={{
        background: active ? "color-mix(in oklab, var(--accent) 14%, var(--bg-elev))" : "var(--bg-elev)",
        borderColor: active ? "color-mix(in oklab, var(--accent) 40%, var(--line))" : undefined,
      }}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-mute">
        <motion.span
          animate={active ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, repeat: active ? Infinity : 0, repeatDelay: 1 }}
          className="inline-flex"
        >
          <Flame
            className="w-3 h-3"
            style={{ color: active ? "var(--accent)" : "var(--fg-mute)" }}
          />
        </motion.span>
        Rekke
      </div>
      <div
        className="number-display text-lg font-semibold leading-tight"
        style={{ color: active ? "var(--accent)" : undefined }}
      >
        {streak > 0 ? `${streak} på rad` : "–"}
      </div>
    </div>
  );
}
