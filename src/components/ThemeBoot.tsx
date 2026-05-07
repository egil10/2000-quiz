"use client";
import { useEffect } from "react";
import { applyTheme } from "@/lib/theme";
import { loadSettings } from "@/lib/storage";

// The actual theme is applied by an inline <script> in the layout <head>
// before paint. This component is a no-op safety net that re-syncs
// classes after hydration in case localStorage changed in another tab.
export function ThemeBoot() {
  useEffect(() => {
    applyTheme(loadSettings().theme);
  }, []);
  return null;
}
