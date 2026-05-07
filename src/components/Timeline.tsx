"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  guess: number;
  actual: number;
}

const ERAS: { from: number; to: number; label: string }[] = [
  { from: 0, to: 500, label: "Antikken" },
  { from: 500, to: 1000, label: "Tidlig middelalder" },
  { from: 1000, to: 1500, label: "Senmiddelalder" },
  { from: 1500, to: 1800, label: "Tidlig moderne" },
  { from: 1800, to: 1900, label: "1800-tallet" },
  { from: 1900, to: 2000, label: "1900-tallet" },
];

export function Timeline({ guess, actual }: Props) {
  const guessPct = (guess / 2000) * 100;
  const actualPct = (actual / 2000) * 100;
  const min = Math.min(guessPct, actualPct);
  const width = Math.abs(guessPct - actualPct);

  return (
    <div className="space-y-2">
      <div className="relative h-20 w-full rounded-2xl border hairline bg-soft overflow-hidden">
        {/* era backgrounds */}
        <div className="absolute inset-0 flex">
          {ERAS.map((era, i) => (
            <div
              key={era.label}
              className={cn(
                "h-full border-r hairline last:border-r-0",
                i % 2 === 0 ? "bg-[color:var(--bg-elev)]/30" : "",
              )}
              style={{ width: `${((era.to - era.from) / 2000) * 100}%` }}
            >
              <span className="absolute mt-1 ml-2 text-[10px] text-mute uppercase tracking-wider">
                {era.label}
              </span>
            </div>
          ))}
        </div>

        {/* connection line between guess and actual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full"
          style={{
            left: `${min}%`,
            width: `${width}%`,
            background: "color-mix(in oklab, var(--accent) 70%, transparent)",
          }}
        />

        {/* century ticks */}
        <div className="absolute inset-0 flex pointer-events-none">
          {Array.from({ length: 21 }).map((_, i) => (
            <div
              key={i}
              className="h-full border-l hairline opacity-30"
              style={{ marginLeft: i === 0 ? 0 : "auto", width: 1 }}
            />
          ))}
        </div>

        {/* guess marker */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 22 }}
          className="absolute top-2 -translate-x-1/2"
          style={{ left: `${guessPct}%` }}
        >
          <div className="text-[11px] font-medium text-soft mb-0.5 whitespace-nowrap">
            Du: {guess}
          </div>
          <div className="w-3 h-3 rounded-full mx-auto" style={{ background: "var(--fg-soft)" }} />
        </motion.div>

        {/* actual marker */}
        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 18 }}
          className="absolute bottom-2 -translate-x-1/2"
          style={{ left: `${actualPct}%` }}
        >
          <div className="w-3 h-3 rounded-full mx-auto" style={{ background: "var(--accent)" }} />
          <div className="text-[11px] font-semibold mt-0.5 whitespace-nowrap" style={{ color: "var(--accent)" }}>
            Fasit: {actual}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
