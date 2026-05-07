// Fetches "Begivenheter" sections from Norwegian Wikipedia year pages 0–2000,
// cleans the wikitext, heuristically categorizes events, dedupes, and writes
// the result to src/data/events.json. Run with: node scripts/fetch-events.mjs
//
// Designed to be re-runnable and cache-friendly: a sidecar wikitext cache is
// kept in scripts/.cache/ so re-running only re-fetches missing years.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE_DIR = path.join(__dirname, ".cache", "wikitext");
const OUT_FILE = path.join(ROOT, "src", "data", "events.json");

fs.mkdirSync(CACHE_DIR, { recursive: true });

const FROM = parseInt(process.env.FROM ?? "0", 10);
const TO = parseInt(process.env.TO ?? "2000", 10);
const CONCURRENCY = parseInt(process.env.CONC ?? "8", 10);
const PER_YEAR_CAP = parseInt(process.env.CAP ?? "10", 10);
const UA =
  "arstallquiz/0.1 (https://github.com/egil10/2000-quiz; mailto:egilfure@gmail.com) Node/24";

async function fetchYearWikitext(year) {
  const cached = path.join(CACHE_DIR, `${year}.txt`);
  // Use cache only if non-empty (empty file = previous failure → retry).
  if (fs.existsSync(cached)) {
    const existing = fs.readFileSync(cached, "utf8");
    if (existing && existing.length > 0) return existing;
  }
  const url =
    `https://no.wikipedia.org/w/api.php?action=parse&page=${year}` +
    `&format=json&prop=wikitext&formatversion=2&redirects=1`;
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.status === 429 || r.status >= 500) {
        // Rate limit / server error: backoff and retry
        const wait = 600 * attempt + Math.floor(Math.random() * 400);
        await new Promise((res) => setTimeout(res, wait));
        continue;
      }
      if (!r.ok) {
        // 404 etc.: nothing to cache; try once more then bail
        if (attempt === maxAttempts) return "";
        await new Promise((res) => setTimeout(res, 300));
        continue;
      }
      const data = await r.json();
      const wt = data?.parse?.wikitext ?? "";
      if (wt) fs.writeFileSync(cached, wt);
      return wt;
    } catch (err) {
      if (attempt === maxAttempts) {
        process.stderr.write(`  fetch ${year} failed: ${err.message}\n`);
        return "";
      }
      await new Promise((res) => setTimeout(res, 500 * attempt));
    }
  }
  return "";
}

function stripComments(s) {
  return s.replace(/<!--[\s\S]*?-->/g, "");
}

function cleanLine(s) {
  let t = s;
  // Remove templates {{...}} including nested-ish (greedy single pass; good enough)
  t = t.replace(/\{\{[^{}]*\}\}/g, "");
  t = t.replace(/\{\{[^{}]*\}\}/g, "");
  // [[Page|Display]] -> Display
  t = t.replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, "$2");
  // External links [http://... text] -> text
  t = t.replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, "$1");
  // Bare external [http://...]
  t = t.replace(/\[https?:\/\/\S+\]/g, "");
  // HTML
  t = t.replace(/<[^>]+>/g, "");
  // Bold/italic markers
  t = t.replace(/'''/g, "").replace(/''/g, "");
  // Footnote refs already removed via tags; collapse multiple spaces
  t = t.replace(/\s+/g, " ").trim();
  // Strip leading dashes/colons from "1. januar – ..." style
  // We KEEP the date prefix because it's nice context.
  // Trim trailing punctuation noise
  t = t.replace(/^[*–\-:\s]+/, "").trim();
  return t;
}

function parseEvents(year, rawWikitext) {
  if (!rawWikitext) return [];
  const wikitext = stripComments(rawWikitext);

  // Find a section called Begivenheter or Hendelser. Capture everything until
  // the next top-level section heading.
  const m = wikitext.match(
    /==\s*(?:Begivenheter|Hendelser)\s*==\s*\n([\s\S]*?)(?=\n==[^=]|\n*$)/,
  );
  if (!m) return [];

  const section = m[1];
  const events = [];
  for (const rawLine of section.split("\n")) {
    const line = rawLine.trim();
    if (!line.startsWith("*")) continue;
    // Skip nested bullets (subitems are usually too granular)
    if (line.startsWith("**")) continue;
    const cleaned = cleanLine(line);
    if (!cleaned) continue;
    if (cleaned.length < 12) continue;
    // Skip year-only references
    if (/^\d+\s*$/.test(cleaned)) continue;
    // Discard items that are just dates with no body
    if (/^\d+\.\s+\w+\s*$/.test(cleaned)) continue;

    events.push({ year, event: cleaned });
  }
  return events;
}

const NORGE_KEYS = [
  "norge", "norsk", "norske", "oslo", "kristiania", "christiania", "bergen",
  "trondheim", "stavanger", "haakon", "håkon", "olav", "harald", "magnus",
  "sverre", "eirik", "erling", "birkebein", "stiklestad", "eidsvoll",
  "svalbard", "lofoten", "kalmar", "danmark-norge", "stortinget",
  "akershus", "fimreite", "hafrsfjord", "ibsen", "munch", "amundsen",
  "nansen", "nidaros", "viken", "trøndelag",
];
const KRIG_KEYS = [
  "krig", "slaget", "slag", "kapitul", "invasjon", "erobr", "okkup",
  "beleir", "felttog", "armé", "armada", "kupp", "blokade", "front",
];
const RELIG_KEYS = [
  "biskop", "pave", "kloster", "kirke", "konsil", "korstog", "korsfar",
  "religion", "moské", "synago", "kalif", "muslim", "kristen", "luther",
  "reformasjon", "protestant", "katolsk", "messen",
];
const VITEN_KEYS = [
  "oppdaget", "oppdager", "publiserer", "vitenskap", "fysik", "kjemi",
  "astronom", "matemat", "biologi", "evolusjon", "atom", "elektron",
  "molekyl", "darwin", "einstein", "newton", "galileo", "kopernikus",
  "tellur", "magneti", "relativitet", "kvant", "dna", "gen ",
  "vaksine", "antibiotika",
];
const OPPF_KEYS = [
  "oppfinner", "oppfinn", "patent", "lanserer", "introduserer",
  "introdusert", "demonstrer", "fungerende", "konstruer", "trykkpress",
  "dampmask", "telegraf", "telefon", "lyspær", "transistor",
  "datamask", "internett", "personlig datamaskin", "mobiltelefon",
  "automobil", "bil ", "fly ", "flyvning",
];
const KUNST_KEYS = [
  "maler", "maleri", "skulptur", "fresk", "kunstner", "leonardo",
  "michelangelo", "rembrandt", "vermeer", "van gogh", "picasso",
  "matisse", "monet", "renoir", "degas", "rodin", "munch", "edvard munch",
];
const KULTUR_KEYS = [
  "litteratur", "roman", "drama", "skuespill", "novelle", "dikt", "lyrikk",
  "film", "premiere", "musikk", "konsert", "symfoni", "opera",
  "shakespeare", "ibsen", "hamsun", "undset", "tolstoj", "dostojev",
  "beatles", "nobelpris i litteratur", "world wide web",
  "verdensutstilling",
];
const IDRETT_KEYS = [
  "olympis", "ol ", " ol.", "ol-", "vm ", " vm.", "vm-", "em ",
  "fotball", "ski", "skøyte", "boksing", "baseball", "basketball",
  "rekord", "stafett",
];
const POLIT_KEYS = [
  "president", "statsminister", "regjering", "valg", "lov ", "grunnlov",
  "demokrati", "revolusjon", "republikk", "monark", "kroning", "abdiserer",
  "uavhengighet", "frigjørin", "traktat", "avtale", "fred ", "fredsavtal",
  "fn ", "nato", "eu ", "sovjet", "kommunist", "fascist", "nazi",
];

function classify(text) {
  const t = (" " + text.toLowerCase() + " ").replace(/[.,;:!?()«»"']/g, " ");
  const has = (keys) => keys.some((k) => t.includes(k.toLowerCase()));
  // Order matters: more specific first
  if (has(NORGE_KEYS)) return "norge";
  if (has(KRIG_KEYS)) return "krig";
  if (has(VITEN_KEYS)) return "vitenskap";
  if (has(OPPF_KEYS)) return "oppfinnelse";
  if (has(RELIG_KEYS)) return "religion";
  if (has(KUNST_KEYS)) return "kunst";
  if (has(KULTUR_KEYS)) return "kultur";
  if (has(IDRETT_KEYS)) return "idrett";
  if (has(POLIT_KEYS)) return "politikk";
  return "verden";
}

function difficultyFor(year, text) {
  // Naive: famous years/themes -> middels, very early or very specific -> vanskelig.
  // We'll mostly mark as middels; round-numbered or modern as lett.
  const len = text.length;
  if (year >= 1900 && (len < 80 || /verden|krig|atom|måne|berlin|nato|titanic/i.test(text))) {
    return "lett";
  }
  if (year < 1000) return "vanskelig";
  if (len > 160) return "vanskelig";
  return "middels";
}

function rankEvents(events) {
  // Prefer: dated events first, shorter & more focused, with named entities.
  return events
    .map((e) => {
      const text = e.event;
      let score = 0;
      if (/^\d+\.\s+\w+\s*[–-]/.test(text)) score += 3; // has date prefix
      if (text.length > 40 && text.length < 200) score += 2;
      if (/[A-ZÆØÅ][a-zæøå]+ ([A-ZÆØÅ][a-zæøå]+|\d)/.test(text)) score += 1; // proper noun
      if (text.length > 260) score -= 2; // too long
      return { ...e, _score: score };
    })
    .sort((a, b) => b._score - a._score);
}

async function pool(items, worker, conc) {
  const results = [];
  let i = 0;
  const runners = Array.from({ length: conc }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      try {
        results[idx] = await worker(items[idx], idx);
      } catch (err) {
        console.error(`error on item ${items[idx]}:`, err.message);
        results[idx] = null;
      }
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  const years = [];
  for (let y = FROM; y <= TO; y++) years.push(y);

  let done = 0;
  const all = [];

  await pool(
    years,
    async (year) => {
      const wt = await fetchYearWikitext(year);
      let events = parseEvents(year, wt);
      events = rankEvents(events).slice(0, PER_YEAR_CAP);
      done++;
      if (done % 50 === 0) {
        process.stderr.write(`  ${done}/${years.length} years processed\n`);
      }
      all.push(...events);
    },
    CONCURRENCY,
  );

  // Dedup on (year + lower-cased event prefix)
  const seen = new Set();
  const dedup = [];
  for (const e of all) {
    const key = `${e.year}|${e.event.slice(0, 80).toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(e);
  }

  // Annotate with category and difficulty
  const annotated = dedup.map((e, i) => ({
    id: 10000 + i, // ids in the 10k+ range so they don't collide with curated 1..N
    year: e.year,
    event: e.event,
    category: classify(e.event),
    difficulty: difficultyFor(e.year, e.event),
  }));

  // Sort by year, then by event
  annotated.sort((a, b) => a.year - b.year || a.event.localeCompare(b.event));

  fs.writeFileSync(OUT_FILE, JSON.stringify(annotated));

  // Also update src/data/totals.ts with an approximate count, so the home
  // page can show it without importing the full dataset.
  const totalsFile = path.join(ROOT, "src", "data", "totals.ts");
  const approx = Math.round(annotated.length / 100) * 100;
  const totalsContent = `// Lightweight stats about the dataset for places (like the home page) that
// only need the count and shouldn't import the full 1.3 MB events.json.
// Updated by scripts/fetch-events.mjs during the dataset rebuild.

export const TOTAL_QUESTIONS = ${approx};
`;
  fs.writeFileSync(totalsFile, totalsContent);

  // Report distribution
  const byCent = new Array(21).fill(0);
  const byCat = {};
  annotated.forEach((e) => {
    byCent[Math.min(20, Math.floor(e.year / 100))]++;
    byCat[e.category] = (byCat[e.category] ?? 0) + 1;
  });
  console.log(`\nWrote ${annotated.length} events to ${path.relative(ROOT, OUT_FILE)}`);
  console.log("\nDistribution by century:");
  byCent.forEach((n, i) =>
    console.log(`  ${String(i * 100).padStart(4, " ")}–${String(i * 100 + 99).padStart(4, " ")}: ${n}`),
  );
  console.log("\nDistribution by category:");
  Object.entries(byCat)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`  ${k.padEnd(14, " ")}: ${v}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
