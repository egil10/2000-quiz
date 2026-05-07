"use client";
import { motion } from "framer-motion";
import { Zap, Skull, Swords, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { GameMode } from "@/types/game";
import { GAME_MODES } from "@/lib/scoring";

const icons: Record<GameMode, React.ElementType> = {
  klassisk: Trophy,
  lyn: Zap,
  hardcore: Swords,
  sudden: Skull,
};

export function GameModeGrid({ highScores }: { highScores?: Record<GameMode, number> }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {GAME_MODES.map((m, i) => {
        const Icon = icons[m.id];
        const high = highScores?.[m.id] ?? 0;
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <Link
              href={`/play?mode=${m.id}`}
              className="card p-5 group block hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="grid place-items-center w-9 h-9 rounded-xl bg-soft border hairline">
                    <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  </span>
                  <h3 className="display text-xl font-semibold">{m.name}</h3>
                </div>
                <ArrowRight className="w-4 h-4 text-mute group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-sm text-soft min-h-[3em]">{m.description}</p>
              {high > 0 && (
                <div className="mt-3 pt-3 border-t hairline text-xs text-mute flex items-center justify-between">
                  <span>Beste poengsum</span>
                  <span className="number-display font-semibold" style={{ color: "var(--accent)" }}>
                    {high.toLocaleString("nb-NO")}
                  </span>
                </div>
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
