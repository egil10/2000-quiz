"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Library, BarChart3, X } from "lucide-react";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";
import { categoryMeta } from "@/components/categoryMeta";
import { ERAS, eraForYear } from "@/lib/eras";
import type { Category, Difficulty, QuizQuestion } from "@/types/game";
import { cn } from "@/lib/utils";

const CATS = Object.keys(categoryMeta) as Category[];
const DIFFS: Difficulty[] = ["lett", "middels", "vanskelig"];

export default function HistorikkPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | null>(null);
  const [eraIdx, setEraIdx] = useState<number | null>(null);
  const [diff, setDiff] = useState<Difficulty | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QUESTIONS.filter((x) => {
      if (cat && x.category !== cat) return false;
      if (diff && x.difficulty !== diff) return false;
      if (eraIdx != null) {
        const e = ERAS[eraIdx];
        if (x.year < e.from || x.year >= e.to) return false;
      }
      if (q) {
        const hay = `${x.event} ${x.year}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => a.year - b.year);
  }, [query, cat, eraIdx, diff]);

  const byCategory = useMemo(() => {
    const counts = Object.fromEntries(CATS.map((c) => [c, 0])) as Record<Category, number>;
    QUESTIONS.forEach((q) => (counts[q.category] += 1));
    return counts;
  }, []);

  const byCentury = useMemo(() => {
    const buckets = new Array(21).fill(0); // 21 buckets: 0-99, 100-199, ..., 1900-1999, 2000
    QUESTIONS.forEach((q) => {
      const idx = Math.min(20, Math.floor(q.year / 100));
      buckets[idx] += 1;
    });
    return buckets;
  }, []);

  const byDifficulty = useMemo(() => {
    const counts: Record<Difficulty, number> = { lett: 0, middels: 0, vanskelig: 0 };
    QUESTIONS.forEach((q) => (counts[q.difficulty] += 1));
    return counts;
  }, []);

  const hasFilter = !!query || !!cat || eraIdx != null || !!diff;

  return (
    <div className="container-wide py-10 sm:py-14 space-y-10">
      <header>
        <p className="chip mb-3">
          <Library className="w-3 h-3" /> Historikk
        </p>
        <h1 className="display text-4xl sm:text-5xl font-semibold">
          Bla gjennom alle spørsmål
        </h1>
        <p className="text-soft mt-2 max-w-2xl">
          Hele datasettet — {TOTAL_QUESTIONS.toLocaleString("nb-NO")} hendelser fra år
          0 til 2000. Filtrér etter epoke, kategori og vanskelighetsgrad, eller søk
          fritt for å lese deg opp før neste spillrunde.
        </p>
      </header>

      {/* Distributions */}
      <section className="grid lg:grid-cols-3 gap-4">
        <DistributionCard
          title="Fordelt på århundre"
          icon={BarChart3}
        >
          <CenturyChart data={byCentury} />
        </DistributionCard>

        <DistributionCard title="Fordelt på kategori">
          <CategoryChart data={byCategory} />
        </DistributionCard>

        <DistributionCard title="Vanskelighetsgrad">
          <DifficultyChart data={byDifficulty} />
        </DistributionCard>
      </section>

      {/* Filters */}
      <section className="card p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Søk etter hendelse, navn eller årstall..."
            className="w-full bg-soft border hairline rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[color:var(--accent)] transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-elev"
              aria-label="Tøm søk"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill active={cat == null} onClick={() => setCat(null)}>Alle kategorier</FilterPill>
          {CATS.map((c) => {
            const m = categoryMeta[c];
            const Icon = m.icon;
            return (
              <FilterPill
                key={c}
                active={cat === c}
                onClick={() => setCat(cat === c ? null : c)}
                color={m.color}
              >
                <Icon className="w-3 h-3" /> {m.label}
              </FilterPill>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill active={eraIdx == null} onClick={() => setEraIdx(null)}>Alle epoker</FilterPill>
          {ERAS.map((e, i) => (
            <FilterPill
              key={e.label}
              active={eraIdx === i}
              onClick={() => setEraIdx(eraIdx === i ? null : i)}
              color={e.color}
            >
              {e.label}
            </FilterPill>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill active={diff == null} onClick={() => setDiff(null)}>Alle nivåer</FilterPill>
          {DIFFS.map((d) => (
            <FilterPill
              key={d}
              active={diff === d}
              onClick={() => setDiff(diff === d ? null : d)}
            >
              {d}
            </FilterPill>
          ))}
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="flex items-baseline justify-between mb-3 px-1">
          <h3 className="display text-xl font-semibold">
            {filtered.length.toLocaleString("nb-NO")} treff
          </h3>
          {hasFilter && (
            <button
              className="btn-ghost text-xs"
              onClick={() => {
                setQuery("");
                setCat(null);
                setEraIdx(null);
                setDiff(null);
              }}
            >
              <X className="w-3 h-3" /> Nullstill filter
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center text-soft">
            Ingen hendelser passer filteret. Prøv å justere det.
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filtered.map((q, i) => (
              <QuestionRow key={q.id} q={q} index={i} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function QuestionRow({ q, index }: { q: QuizQuestion; index: number }) {
  const meta = categoryMeta[q.category];
  const era = eraForYear(q.year);
  const Icon = meta.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index, 12) * 0.015 }}
      className="rounded-xl border hairline bg-elev p-4 flex items-start gap-3"
    >
      <div
        className="number-display font-semibold text-base shrink-0 px-2.5 py-1 rounded-md min-w-[58px] text-center"
        style={{
          background: "color-mix(in oklab, var(--accent) 12%, transparent)",
          color: "var(--accent)",
        }}
      >
        {q.year}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">{q.event}</p>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span
            className="chip text-[10px]"
            style={{ color: meta.color, borderColor: meta.color + "55" }}
          >
            <Icon className="w-3 h-3" /> {meta.label}
          </span>
          <span
            className="chip text-[10px]"
            style={{ color: era.color, borderColor: era.color + "55" }}
          >
            {era.short}
          </span>
          <span className="chip text-[10px] uppercase">{q.difficulty}</span>
        </div>
      </div>
    </motion.li>
  );
}

function DistributionCard({
  title, icon: Icon, children,
}: { title: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="text-xs uppercase tracking-widest text-mute mb-3 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />} {title}
      </h3>
      {children}
    </div>
  );
}

function CenturyChart({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  return (
    <div>
      <div className="flex items-end gap-[3px] h-28">
        {data.map((n, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(n / max) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.02 }}
            className="flex-1 rounded-t-sm relative group"
            style={{ background: "color-mix(in oklab, var(--accent) 70%, transparent)" }}
            title={`${i * 100}–${i * 100 + 99}: ${n}`}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-mute opacity-0 group-hover:opacity-100 transition-opacity number-display whitespace-nowrap">
              {n}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-mute mt-1.5 number-display">
        <span>0</span><span>500</span><span>1000</span><span>1500</span><span>2000</span>
      </div>
    </div>
  );
}

function CategoryChart({ data }: { data: Record<Category, number> }) {
  const entries = (Object.entries(data) as [Category, number][])
    .sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map((e) => e[1]));
  return (
    <ul className="space-y-1.5">
      {entries.map(([c, n]) => {
        const meta = categoryMeta[c];
        const Icon = meta.icon;
        return (
          <li key={c} className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 w-24 flex-shrink-0">
              <Icon className="w-3 h-3" style={{ color: meta.color }} />
              <span>{meta.label}</span>
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-soft overflow-hidden border hairline">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(n / max) * 100}%` }}
                transition={{ duration: 0.6 }}
                className="h-full"
                style={{ background: meta.color }}
              />
            </div>
            <span className="number-display text-mute w-8 text-right">{n}</span>
          </li>
        );
      })}
    </ul>
  );
}

function DifficultyChart({ data }: { data: Record<Difficulty, number> }) {
  const total = data.lett + data.middels + data.vanskelig;
  const colors: Record<Difficulty, string> = {
    lett: "#16a34a",
    middels: "#f59e0b",
    vanskelig: "#dc2626",
  };
  return (
    <div className="space-y-3">
      <div className="flex h-2.5 rounded-full overflow-hidden border hairline bg-soft">
        {(["lett", "middels", "vanskelig"] as Difficulty[]).map((d) => {
          const pct = total ? (data[d] / total) * 100 : 0;
          return (
            <motion.div
              key={d}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
              className="h-full"
              style={{ background: colors[d] }}
            />
          );
        })}
      </div>
      <ul className="space-y-1 text-xs">
        {(["lett", "middels", "vanskelig"] as Difficulty[]).map((d) => (
          <li key={d} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: colors[d] }} />
              <span className="capitalize">{d}</span>
            </span>
            <span className="number-display text-mute">
              {data[d]} ·{" "}
              {total ? Math.round((data[d] / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterPill({
  active, onClick, children, color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors",
        active ? "" : "hover:bg-soft",
      )}
      style={
        active
          ? {
              background: color ? color + "20" : "var(--accent)",
              color: color ? color : "#fff",
              borderColor: color ? color + "55" : "transparent",
            }
          : { borderColor: "var(--line)", color: "var(--fg-soft)", background: "var(--bg-elev)" }
      }
    >
      {children}
    </button>
  );
}
