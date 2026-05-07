"use client";
import { motion } from "framer-motion";
import { ERAS } from "@/lib/eras";

interface Props {
  guess: number;
  actual: number;
}

function labelStyle(pct: number): React.CSSProperties {
  // Edge-aware horizontal anchoring so labels never overflow the parent.
  if (pct < 8) return { left: 0 };
  if (pct > 92) return { right: 0, left: "auto" };
  return { left: `${pct}%`, transform: "translateX(-50%)" };
}

export function Timeline({ guess, actual }: Props) {
  const guessPct = Math.max(0, Math.min(100, (guess / 2000) * 100));
  const actualPct = Math.max(0, Math.min(100, (actual / 2000) * 100));
  const min = Math.min(guessPct, actualPct);
  const width = Math.abs(guessPct - actualPct);

  return (
    <div className="space-y-1.5">
      {/* Top label row (guess) — outside the body so labels can never overflow */}
      <div className="relative h-6">
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 22 }}
          className="absolute top-0 px-2 py-0.5 rounded-full text-[11px] font-medium border hairline whitespace-nowrap"
          style={{ ...labelStyle(guessPct), background: "var(--bg-elev)", color: "var(--fg-soft)" }}
        >
          Du · {guess}
        </motion.div>
      </div>

      {/* Timeline body */}
      <div className="relative h-20 sm:h-24 w-full rounded-2xl border hairline bg-soft overflow-hidden">
        {/* era backgrounds */}
        <div className="absolute inset-0 flex">
          {ERAS.map((era, i) => (
            <div
              key={era.label}
              className="relative h-full border-r hairline last:border-r-0"
              style={{
                width: `${((era.to - era.from) / 2000) * 100}%`,
                background: i % 2 === 0
                  ? "color-mix(in oklab, var(--bg-elev) 35%, transparent)"
                  : "transparent",
              }}
            >
              <span
                className="absolute bottom-1 left-1.5 text-[9px] uppercase tracking-wider"
                style={{
                  color: "color-mix(in oklab, var(--fg-mute) 80%, transparent)",
                  maxWidth: "calc(100% - 8px)",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                {era.short}
              </span>
            </div>
          ))}
        </div>

        {/* century ticks */}
        <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
          {Array.from({ length: 21 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0"
              style={{
                left: `${(i / 20) * 100}%`,
                width: 1,
                background:
                  i % 5 === 0
                    ? "color-mix(in oklab, var(--fg-mute) 35%, transparent)"
                    : "color-mix(in oklab, var(--fg-mute) 12%, transparent)",
              }}
            />
          ))}
        </div>

        {/* connection line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            transformOrigin: guessPct < actualPct ? "left" : "right",
            left: `${min}%`,
            width: `${width}%`,
            background: "color-mix(in oklab, var(--accent) 70%, transparent)",
          }}
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full"
        />

        {/* dots */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 240, damping: 16 }}
          className="absolute top-1/2 w-3 h-3 rounded-full"
          style={{
            left: `${guessPct}%`,
            transform: "translate(-50%, -50%)",
            background: "var(--fg-soft)",
            border: "2px solid var(--bg-elev)",
            boxShadow: "0 0 0 1px color-mix(in oklab, var(--fg-soft) 30%, transparent)",
          }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 240, damping: 14 }}
          className="absolute top-1/2 w-3.5 h-3.5 rounded-full"
          style={{
            left: `${actualPct}%`,
            transform: "translate(-50%, -50%)",
            background: "var(--accent)",
            border: "2px solid var(--bg-elev)",
            boxShadow: "0 0 0 1px color-mix(in oklab, var(--accent) 50%, transparent)",
          }}
        />
      </div>

      {/* Bottom label row (actual) */}
      <div className="relative h-6">
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 240, damping: 22 }}
          className="absolute top-0 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
          style={{ ...labelStyle(actualPct), background: "var(--accent)", color: "#fff" }}
        >
          Fasit · {actual}
        </motion.div>
      </div>

      {/* axis */}
      <div className="flex justify-between text-[10px] text-mute px-1 number-display pt-0.5">
        <span>0</span>
        <span>500</span>
        <span>1000</span>
        <span>1500</span>
        <span>2000</span>
      </div>
    </div>
  );
}
