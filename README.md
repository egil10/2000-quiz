# Årstallquiz

Et nydelig årstall-quiz fra år 0 til 2000. Få en historisk hendelse, gjett året
mellom 0 og 2000, og få poeng etter presisjon.

## Funksjoner

- **4 spillmoduser** — Klassisk, Lynraskt, Hardcore, Sudden death.
- **3 temaer** — Lys, mørk og pergament (gammelt papir).
- **Smart poenggivning** — Eksponentielt fall: blink gir 1000, 250+ år bom gir 0.
- **Visuell tidslinje** — Hver gjetning vises på en epoke-merket tidslinje.
- **Statistikk** — Poeng per kategori, snitt-bom, lengste rekke. Lokal lagring.
- **Animasjoner** — Framer Motion. Lett, raskt, lite JS.
- **Responsivt** — Spill på mobil og desktop.

## Stack

- Next.js 14 (App Router)
- TypeScript, Tailwind CSS
- Framer Motion + Lucide icons
- LocalStorage for stats

## Kjøring lokalt

```bash
npm install
npm run dev
```

Åpne <http://localhost:3000>.

## Bygg for produksjon

```bash
npm run build
npm start
```

## Deploy

Klar for Vercel — push til GitHub og koble til Vercel-prosjektet.
Ingen miljøvariabler kreves.

## Spørsmålssettet

Spørsmålene ligger i `src/data/questions.ts`. Hver post er en `{ year, event, category, difficulty }`. Oppstartsdatasettet er kuratert (~300 hendelser); strukturen er bygget for å skalere til 10 000+ ved å legge til flere oppføringer.
