"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Hourglass, BookOpen, Zap } from "lucide-react";
import { GameModeGrid } from "@/components/GameModeCard";
import { useEffect, useState } from "react";
import { loadStats } from "@/lib/storage";
import { TOTAL_QUESTIONS } from "@/data/totals";
import type { PlayerStats } from "@/types/game";

export default function HomePage() {
  const [stats, setStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  return (
    <div className="container-wide py-12 sm:py-20 space-y-20">
      {/* Hero */}
      <section className="grid lg:grid-cols-[1.1fr,0.9fr] items-center gap-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="chip mb-5">
              <Hourglass className="w-3.5 h-3.5" /> År 0 → 2000
            </div>
            <h1 className="display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Når{" "}
              <span style={{ color: "var(--accent)" }}>
                skjedde
              </span>
              <br />
              det egentlig?
            </h1>
            <p className="mt-5 text-lg text-soft max-w-xl">
              Et hyggelig — og litt drøyt — historie-quiz. Vi gir deg en
              hendelse, du gjetter året mellom 0 og 2000. Jo nærmere, desto
              flere poeng. Lett å spille, vanskelig å mestre.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/play" className="btn-primary text-base px-6 py-3">
                Spill nå <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/play?mode=lyn" className="btn">
                <Zap className="w-4 h-4" /> Lynraskt
              </Link>
              <Link href="/stats" className="btn-ghost">
                Statistikk
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-mute">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {TOTAL_QUESTIONS}+ kuraterte hendelser
              </span>
              <span>·</span>
              <span>4 spillmoduser</span>
              <span>·</span>
              <span>3 temaer</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <ExampleCard />
        </motion.div>
      </section>

      {/* Modes */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="chip mb-3">
              <Sparkles className="w-3 h-3" /> Velg modus
            </p>
            <h2 className="display text-3xl sm:text-4xl font-semibold">Hvordan vil du spille?</h2>
          </div>
        </div>
        <GameModeGrid highScores={stats?.highScores} />
      </section>

      {/* Highlights / how it works */}
      <section className="grid md:grid-cols-3 gap-5">
        <Feature
          title="Smart poenggivning"
          body="Eksponentielt poeng-fall: blink gir 1000, men du får poeng helt opp til 250 år bom — det belønner kunnskap, ikke flaks."
        />
        <Feature
          title="Visuell tidslinje"
          body="Hver gjetning vises på en epoke-merket tidslinje slik at du ser hvor langt unna du var, og lærer en ny epoke gjennom spillet."
        />
        <Feature
          title="Kategorier og dybde"
          body="Norge, krig, kunst, vitenskap, religion og mer — egne profiler i statistikken viser hva du er sterk og svak på."
        />
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-6">
      <h3 className="display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-soft mt-2 leading-relaxed">{body}</p>
    </div>
  );
}

function ExampleCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-2 rounded-[2rem] opacity-40 blur-2xl"
           style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }} />
      <div className="relative card p-6 sm:p-8">
        <div className="flex items-center justify-between text-xs text-mute mb-4">
          <span className="chip">Eksempel</span>
          <span>Spørsmål 3 / 10</span>
        </div>
        <p className="text-mute text-xs uppercase tracking-[0.2em] mb-2">Hva år skjedde dette?</p>
        <h3 className="display text-2xl sm:text-3xl font-semibold leading-tight">
          Norges grunnlov vedtas på Eidsvoll 17. mai
        </h3>
        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-mute">Din gjetning</span>
            <span className="number-display text-3xl font-semibold">1814</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-soft border hairline overflow-hidden">
            <div className="h-full" style={{ width: "90.7%", background: "linear-gradient(to right, var(--accent), color-mix(in oklab, var(--accent) 60%, white))" }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-mute"><span>0</span><span>2000</span></div>
        </div>
        <div className="mt-5 flex justify-between items-center">
          <span className="chip" style={{ color: "var(--good)" }}>Helt blink!</span>
          <span className="number-display font-bold text-2xl" style={{ color: "var(--good)" }}>+1000</span>
        </div>
      </div>
    </div>
  );
}
