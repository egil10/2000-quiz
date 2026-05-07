"use client";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { clampYear } from "@/lib/utils";
import { eraForYear } from "@/lib/eras";

interface Props {
  value: number;
  onChange: (n: number) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function YearInput({ value, onChange, onSubmit, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimer = useRef<number | null>(null);
  const [text, setText] = useState<string>(String(value));
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  useEffect(() => {
    return () => {
      if (errorTimer.current) window.clearTimeout(errorTimer.current);
    };
  }, []);

  const flashError = (message: string) => {
    setError(message);
    if (errorTimer.current) window.clearTimeout(errorTimer.current);
    errorTimer.current = window.setTimeout(() => setError(null), 1800);
  };

  const era = eraForYear(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      setText("");
      setError(null);
      return;
    }
    const cleaned = raw.replace(/[^\d]/g, "").slice(0, 4);
    const parsed = parseInt(cleaned, 10);

    if (!Number.isNaN(parsed) && parsed > 2000) {
      // Clamp visibly to 2000 and flash a warning.
      setText("2000");
      onChange(2000);
      flashError("Maks 2000");
      return;
    }
    setText(cleaned);
    if (!Number.isNaN(parsed)) {
      onChange(clampYear(parsed));
      setError(null);
    }
  };

  const commit = () => {
    if (text === "") {
      setText(String(value));
      return;
    }
    const parsed = parseInt(text, 10);
    const safe = Number.isNaN(parsed) ? value : clampYear(parsed);
    setText(String(safe));
    onChange(safe);
  };

  const bump = (delta: number) => {
    const next = clampYear(value + delta);
    if (value + delta > 2000 && delta > 0) flashError("Maks 2000");
    if (value + delta < 0 && delta < 0) flashError("Min 0");
    onChange(next);
    setText(String(next));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          className="btn"
          onClick={() => bump(-1)}
          disabled={disabled}
          aria-label="Minus 1 år"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className={`relative transition-transform ${focused ? "scale-[1.02]" : ""}`}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            spellCheck={false}
            value={text}
            disabled={disabled}
            onFocus={(e) => {
              setFocused(true);
              requestAnimationFrame(() => e.target.select());
            }}
            onBlur={() => {
              setFocused(false);
              commit();
            }}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commit();
                onSubmit();
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                bump(e.shiftKey ? 10 : 1);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                bump(e.shiftKey ? -10 : -1);
              }
            }}
            placeholder="—"
            className="number-display w-44 sm:w-52 text-center text-5xl sm:text-6xl font-semibold bg-transparent outline-none transition-colors"
            style={{ caretColor: "var(--accent)" }}
            aria-label="Skriv inn årstall (0–2000)"
            aria-invalid={!!error}
          />
          <div
            className={`absolute left-0 right-0 -bottom-1 h-[2px] rounded-full transition-all ${
              focused ? "opacity-100" : "opacity-60"
            }`}
            style={{
              background: error
                ? "var(--bad)"
                : focused
                ? "var(--accent)"
                : "var(--line)",
            }}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                key={error}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="absolute left-1/2 -translate-x-1/2 -bottom-7 flex items-center gap-1 text-xs whitespace-nowrap"
                style={{ color: "var(--bad)" }}
                role="alert"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() => bump(1)}
          disabled={disabled}
          aria-label="Pluss 1 år"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center pt-3">
        <span
          className="chip"
          style={{
            color: era.color,
            borderColor: era.color + "44",
            background: era.color + "10",
          }}
        >
          Du gjetter i {era.label}
        </span>
      </div>

      <div className="px-1">
        <input
          type="range"
          className="year-slider"
          min={0}
          max={2000}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const n = clampYear(parseInt(e.target.value, 10));
            onChange(n);
            setText(String(n));
            setError(null);
          }}
          aria-label="Velg år med slider"
        />
        <div className="flex justify-between text-[11px] text-mute mt-1 px-1 number-display">
          <span>0</span>
          <span>500</span>
          <span>1000</span>
          <span>1500</span>
          <span>2000</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {[-100, -10, -1, +1, +10, +100].map((step) => (
          <button
            key={step}
            type="button"
            className="btn-ghost text-xs"
            disabled={disabled}
            onClick={() => bump(step)}
          >
            {step > 0 ? `+${step}` : step}
          </button>
        ))}
      </div>
    </div>
  );
}
