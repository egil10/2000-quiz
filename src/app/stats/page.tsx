"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Trash2, Trophy, Target, Star, Sparkles } from "lucide-react";
import { loadStats, resetStats, emptyStats } from "@/lib/storage";
import { categoryMeta } from "@/components/categoryMeta";
import { GAME_MODES } from "@/lib/scoring";
import type { Category, PlayerStats } from "@/types/game";

export default function StatsPage() {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  if (!stats) return <div className="container-narrow py-20 text-center text-mute">Laster...</div>;

  const empty = stats.totalQuestions === 0;
  const cats = (Object.keys(stats.byCategory) as Category[])
    .map((c) => ({ id: c, ...stats.byCategory[c] }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="container-wide py-10 sm:py-14 space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="chip mb-3"><BarChart3 className="w-3 h-3" /> Din profil</p>
          <h1 className="display text-4xl sm:text-5xl font-semibold">Statistikk</h1>
          <p className="text-soft mt-2">All data ligger lokalt i nettleseren din.</p>
        </div>
        {!empty && (
          <div className="flex gap-2">
            {confirmReset ? (
              <>
                <button
                  className="btn"
                  onClick={() => setConfirmReset(false)}
                >
                  Avbryt
                </button>
                <button
                  className="btn"
                  style={{ color: "var(--bad)", borderColor: "var(--bad)" }}
                  onClick={() => {
                    resetStats();
                    setStats(emptyStats());
                    setConfirmReset(false);
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Bekreft sletting
                </button>
              </>
            ) : (
              <button className="btn-ghost" onClick={() => setConfirmReset(true)}>
                <Trash2 className="w-4 h-4" /> Nullstill
              </button>
            )}
          </div>
        )}
      </header>

      {empty ? (
        <div className="card p-10 text-center space-y-4">
          <Sparkles className="w-8 h-8 mx-auto text-mute" />
          <h2 className="display text-2xl font-semibold">Ingen statistikk ennå</h2>
          <p className="text-soft">Kom i gang så fyller vi opp grafene her.</p>
          <Link href="/play" className="btn-primary inline-flex">Spill nå</Link>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BigStat
              label="Totale spørsmål"
              value={stats.totalQuestions.toLocaleString("nb-NO")}
              icon={Target}
            />
            <BigStat
              label="Total poengsum"
              value={stats.totalPoints.toLocaleString("nb-NO")}
              icon={Star}
              accent
            />
            <BigStat
              label="Snitt bom"
              value={`${Math.round(stats.avgDiff)} år`}
              icon={BarChart3}
            />
            <BigStat
              label="Lengste rekke"
              value={stats.bestStreak.toLocaleString("nb-NO")}
              icon={Trophy}
            />
          </div>

          {/* Mode high scores */}
          <section className="card p-6">
            <h3 className="display text-xl font-semibold mb-4">Beste poengsum per modus</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {GAME_MODES.map((m) => (
                <div key={m.id} className="rounded-xl bg-soft border hairline p-4">
                  <p className="text-xs text-mute uppercase tracking-wider">{m.name}</p>
                  <p className="number-display text-2xl font-semibold mt-1">
                    {(stats.highScores[m.id] ?? 0).toLocaleString("nb-NO")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section className="card p-6">
            <h3 className="display text-xl font-semibold mb-4">Kategorier</h3>
            <div className="space-y-2">
              {cats.map((c, i) => {
                const meta = categoryMeta[c.id];
                const Icon = meta.icon;
                const max = Math.max(1, ...cats.map((x) => x.count));
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center gap-2 w-32 flex-shrink-0">
                      <Icon className="w-4 h-4" style={{ color: meta.color }} />
                      <span className="text-sm">{meta.label}</span>
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-soft overflow-hidden border hairline">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.count / max) * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.1 + i * 0.03 }}
                        className="h-full"
                        style={{ background: meta.color }}
                      />
                    </div>
                    <div className="w-44 flex-shrink-0 text-right text-xs text-mute">
                      {c.count > 0 ? (
                        <>
                          <span className="number-display">{c.count}</span> spørsmål · snitt{" "}
                          <span className="number-display">{Math.round(c.avgDiff)}</span> år bom
                        </>
                      ) : (
                        <span className="text-mute">ingen ennå</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Recent sessions */}
          <section className="card p-6">
            <h3 className="display text-xl font-semibold mb-4">Siste spill</h3>
            <ul className="divide-y hairline">
              {stats.recentSessions.map((s, i) => {
                const date = new Date(s.endedAt ?? s.startedAt).toLocaleString("nb-NO", {
                  day: "2-digit", month: "2-digit", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                });
                return (
                  <li key={i} className="py-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="chip uppercase tracking-wider">{s.mode}</span>
                      <span className="text-mute">{date}</span>
                    </div>
                    <div className="number-display font-semibold">
                      {s.totalPoints.toLocaleString("nb-NO")} poeng
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

function BigStat({
  label, value, icon: Icon, accent,
}: { label: string; value: string; icon: React.ElementType; accent?: boolean }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-mute uppercase tracking-wider">{label}</p>
        <Icon className="w-4 h-4" style={{ color: accent ? "var(--accent)" : "var(--fg-mute)" }} />
      </div>
      <p
        className="number-display text-3xl font-semibold mt-2"
        style={accent ? { color: "var(--accent)" } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
