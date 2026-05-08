"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Telescope, X } from "lucide-react";
import { QUESTIONS } from "@/data/questions";
import { categoryMeta } from "@/components/categoryMeta";
import { ERAS } from "@/lib/eras";
import { cn } from "@/lib/utils";
import type { Category, QuizQuestion } from "@/types/game";

const PX_PER_YEAR = 7;
const TIMELINE_HEIGHT = 2001 * PX_PER_YEAR;
const TIMELINE_WIDTH = 880;
const LEFT_PADDING = 70;
const RIGHT_PADDING = 16;
const SLOT_WIDTH = 11;
const ROW_HEIGHT = 6;
const DOT_RADIUS = 3;

interface Placed {
  q: QuizQuestion;
  x: number;
  y: number;
}

function placeEvents(events: QuizQuestion[]): Placed[] {
  const cols = Math.max(
    1,
    Math.floor((TIMELINE_WIDTH - LEFT_PADDING - RIGHT_PADDING) / SLOT_WIDTH),
  );
  const byYear = new Map<number, QuizQuestion[]>();
  for (const q of events) {
    const list = byYear.get(q.year) ?? [];
    list.push(q);
    byYear.set(q.year, list);
  }
  const placed: Placed[] = [];
  for (const [year, list] of byYear) {
    list.forEach((q, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      placed.push({
        q,
        x: LEFT_PADDING + col * SLOT_WIDTH + SLOT_WIDTH / 2,
        y: year * PX_PER_YEAR + row * ROW_HEIGHT,
      });
    });
  }
  return placed;
}

const CATS = Object.keys(categoryMeta) as Category[];

export default function TidslinjePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<Placed | null>(null);
  const [pinned, setPinned] = useState<Placed | null>(null);
  const [filterCat, setFilterCat] = useState<Category | null>(null);

  const placed = useMemo(
    () =>
      placeEvents(filterCat ? QUESTIONS.filter((q) => q.category === filterCat) : QUESTIONS),
    [filterCat],
  );

  const counts = useMemo(() => {
    const out: Record<Category, number> = Object.fromEntries(
      CATS.map((c) => [c, 0]),
    ) as Record<Category, number>;
    for (const q of QUESTIONS) out[q.category] += 1;
    return out;
  }, []);

  // Spatial bucketing for fast hit-testing on hover.
  const grid = useMemo(() => {
    const cell = 40;
    const map = new Map<string, Placed[]>();
    for (const p of placed) {
      const key = `${Math.floor(p.x / cell)}|${Math.floor(p.y / cell)}`;
      const list = map.get(key) ?? [];
      list.push(p);
      map.set(key, list);
    }
    return { map, cell };
  }, [placed]);

  // Repaint canvas whenever the visible set changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = TIMELINE_WIDTH * dpr;
    canvas.height = TIMELINE_HEIGHT * dpr;
    canvas.style.width = `${TIMELINE_WIDTH}px`;
    canvas.style.height = `${TIMELINE_HEIGHT}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, TIMELINE_WIDTH, TIMELINE_HEIGHT);

    // Era stripes
    for (const era of ERAS) {
      ctx.fillStyle = era.color + "10";
      ctx.fillRect(
        0,
        era.from * PX_PER_YEAR,
        TIMELINE_WIDTH,
        (era.to - era.from) * PX_PER_YEAR,
      );
    }

    // Century gridlines + labels
    ctx.strokeStyle = "rgba(127,127,127,0.18)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(127,127,127,0.85)";
    ctx.font = "11px ui-sans-serif, -apple-system, system-ui";
    for (let y = 0; y <= 2000; y += 100) {
      const py = y * PX_PER_YEAR + 0.5;
      ctx.beginPath();
      ctx.moveTo(LEFT_PADDING, py);
      ctx.lineTo(TIMELINE_WIDTH - RIGHT_PADDING, py);
      ctx.stroke();
      ctx.fillText(y.toString(), 12, py + 4);
    }

    // Dots
    for (const p of placed) {
      ctx.fillStyle = categoryMeta[p.q.category].color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [placed]);

  function findAt(x: number, y: number): Placed | null {
    const { map, cell } = grid;
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    let best: Placed | null = null;
    let bestDist = DOT_RADIUS + 4;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const list = map.get(`${cx + dx}|${cy + dy}`);
        if (!list) continue;
        for (const p of list) {
          const d = Math.hypot(p.x - x, p.y - y);
          if (d < bestDist) {
            best = p;
            bestDist = d;
          }
        }
      }
    }
    return best;
  }

  function handleMove(e: React.MouseEvent) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover(findAt(e.clientX - rect.left, e.clientY - rect.top));
  }

  function handleClick(e: React.MouseEvent) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const hit = findAt(e.clientX - rect.left, e.clientY - rect.top);
    setPinned(hit);
  }

  function jumpTo(year: number) {
    const target = year * PX_PER_YEAR;
    window.scrollTo({ top: target - 120, behavior: "smooth" });
  }

  const tip = pinned ?? hover;

  return (
    <div className="container-wide py-10 sm:py-14 space-y-6">
      <header>
        <div className="chip mb-3">
          <Telescope className="w-3 h-3" /> Stor tidslinje
        </div>
        <h1 className="display text-4xl sm:text-5xl font-semibold">
          Hele datasettet på én tidslinje
        </h1>
        <p className="text-soft mt-2 max-w-2xl">
          {QUESTIONS.length.toLocaleString("nb-NO")} hendelser plottet fra år 0 til 2000.
          Hold over en prikk for detaljer, eller klikk for å feste den. Bruk
          dekade-knappene til høyre for å hoppe i tid.
        </p>
      </header>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={filterCat == null}
          onClick={() => setFilterCat(null)}
        >
          Alle · {QUESTIONS.length.toLocaleString("nb-NO")}
        </FilterChip>
        {CATS.map((c) => {
          const m = categoryMeta[c];
          const Icon = m.icon;
          return (
            <FilterChip
              key={c}
              active={filterCat === c}
              color={m.color}
              onClick={() => setFilterCat(filterCat === c ? null : c)}
            >
              <Icon className="w-3 h-3" /> {m.label} · {counts[c]}
            </FilterChip>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-start">
        <div className="card overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
            onClick={handleClick}
            className="block max-w-full"
            style={{ cursor: hover ? "pointer" : "default" }}
          />
        </div>

        {/* Century jump rail */}
        <aside className="hidden lg:flex sticky top-24 flex-col gap-1 text-xs">
          <p className="text-mute uppercase tracking-widest text-[10px] mb-1">Hopp til</p>
          {Array.from({ length: 21 }).map((_, i) => {
            const year = i * 100;
            return (
              <button
                key={year}
                onClick={() => jumpTo(year)}
                className="number-display text-left px-2 py-0.5 rounded hover:bg-soft text-soft hover:text-[color:var(--fg)]"
              >
                {year === 2000 ? "2000" : `${year}–${year + 99}`}
              </button>
            );
          })}
        </aside>
      </div>

      {/* Floating tooltip / pinned panel */}
      {tip && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 card p-4 sm:p-5 z-30 max-w-lg w-[92vw] shadow-lg flex items-start gap-3"
          style={{
            borderColor: categoryMeta[tip.q.category].color + "55",
          }}
        >
          <span
            className="number-display font-semibold text-base shrink-0 px-2.5 py-1 rounded-md min-w-[58px] text-center"
            style={{
              background: "color-mix(in oklab, var(--accent) 12%, transparent)",
              color: "var(--accent)",
            }}
          >
            {tip.q.year}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] text-mute uppercase tracking-wider mb-1">
              {(() => {
                const m = categoryMeta[tip.q.category];
                const I = m.icon;
                return (
                  <>
                    <I className="w-3 h-3" style={{ color: m.color }} /> {m.label}
                    <span>·</span>
                    <span>{tip.q.difficulty}</span>
                  </>
                );
              })()}
            </div>
            <p className="text-sm leading-snug">{tip.q.event}</p>
          </div>
          {pinned && (
            <button
              onClick={() => setPinned(null)}
              className="btn-ghost p-1.5"
              aria-label="Lukk"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="text-center text-xs text-mute pt-2">
        <Link href="/historikk" className="underline-offset-2 hover:underline">
          Eller bla i en sortert liste i historikken →
        </Link>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
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
