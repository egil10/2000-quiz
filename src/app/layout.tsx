import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeBoot } from "@/components/ThemeBoot";
import { Header } from "@/components/Header";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Årstallquiz — gjett året på historiske hendelser",
  description:
    "Et vakkert årstall-quiz fra år 0 til 2000. Gjett når det skjedde — få poeng etter presisjon, lås opp game-moduser og lær historie underveis.",
  applicationName: "Årstallquiz",
  openGraph: {
    title: "Årstallquiz",
    description: "Gjett året på historiske hendelser fra år 0 til 2000.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem('arstallquiz.v1.settings')||'{}');var t=s.theme||'morke';document.documentElement.classList.add('theme-'+t);if(t==='morke')document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('theme-morke','dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeBoot />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t hairline py-6 text-center text-xs text-mute">
            <div className="container-wide flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span>Årstallquiz © {new Date().getFullYear()}</span>
              <span className="opacity-50">·</span>
              <span>Lagd for å lære historie på den fine måten.</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
