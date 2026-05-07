"use client";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";

interface Props {
  totalPoints: number;
  index: number;
  total: number | null;
  lives?: number;
}

export function ScoreBar({ totalPoints, index, total, lives }: Props) {
  const pct = total == null ? 0 : Math.min(100, (index / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-mute">
        <span className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
          <motion.span
            key={totalPoints}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="number-display font-semibold text-base"
            style={{ color: "var(--fg)" }}
          >
            {totalPoints.toLocaleString("nb-NO")}
          </motion.span>
          <span>poeng</span>
        </span>
        {lives != null && Number.isFinite(lives) && (
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" style={{ color: "var(--bad)" }} fill="currentColor" />
            <span>{lives} liv</span>
          </span>
        )}
        {total != null && (
          <span>{index} / {total} fullført</span>
        )}
      </div>
      {total != null && (
        <div className="h-1.5 rounded-full overflow-hidden bg-soft border hairline">
          <motion.div
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full"
            style={{
              background: "linear-gradient(to right, var(--accent), color-mix(in oklab, var(--accent) 60%, white))",
            }}
          />
        </div>
      )}
    </div>
  );
}
