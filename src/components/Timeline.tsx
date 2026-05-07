"use client";
import { motion } from "framer-motion";
import { ERAS } from "@/lib/eras";

interface Props {
  guess: number;
  actual: number;
}

export function Timeline({ guess, actual }: Props) {
  const guessPct = (guess / 2000) * 100;
  const actualPct = (actual / 2000) * 100;
  const min = Math.min(guessPct, actualPct);
  const width = Math.abs(guessPct - actualPct);

  return (
    <div className="space-y-1">
      <div className="relative h-32 sm:h-36 w-full rounded-2xl border hairline bg-soft overflow-hidden">
        {/* era backgrounds */}
        <div className="absolute inset-0 flex">
          {ERAS.map((era, i) => (
            <div
              key={era.label}
              className="relative h-full border-r hairline last:border-r-0"
              style={{
                width: `${((era.to - era.from) / 2000) * 100}%`,
                background: i % 2 === 0 ? "color-mix(in oklab, var(--bg-elev) 35%, transparent)" : "transparent",
              }}
            >
              <span
                className="absolute bottom-1 left-1.5 text-[9px] uppercase tracking-wider"
                style={{ color: "color-mix(in oklab, var(--fg-mute) 80%, transparent)" }}
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

        {/* guess marker */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 220, damping: 22 }}
          className="absolute top-3 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${guessPct}%` }}
        >
          <div
            className="px-2 py-0.5 rounded-full text-[10px] font-medium border hairline whitespace-nowrap"
            style={{ background: "var(--bg-elev)", color: "var(--fg-soft)" }}
          >
            Du · {guess}
          </div>
          <div className="w-2 h-2 rounded-full mt-1" style={{ background: "var(--fg-soft)" }} />
        </motion.div>

        {/* actual marker */}
        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 18 }}
          className="absolute bottom-5 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${actualPct}%` }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />
          <div
            className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap"
            style={{
              color: "#fff",
              background: "var(--accent)",
              borderColor: "transparent",
            }}
          >
            Fasit · {actual}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between text-[10px] text-mute px-1 number-display">
        <span>0</span>
        <span>500</span>
        <span>1000</span>
        <span>1500</span>
        <span>2000</span>
      </div>
    </div>
  );
}
