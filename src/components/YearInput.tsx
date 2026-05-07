"use client";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
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
  const [text, setText] = useState<string>(String(value));
  const [focused, setFocused] = useState(false);

  // Keep the visible text in sync with the parent value when the parent drives
  // changes (slider, +/- buttons, new question). Only override while NOT focused
  // so the user's in-progress typing isn't clobbered.
  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  // When a new question loads (disabled toggling false), focus & select.
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty and partial input (e.g., "1", "19", or even "") while typing.
    if (raw === "") {
      setText("");
      return;
    }
    // Strip any stray non-digits but allow up to 4 digits 0..2000.
    const cleaned = raw.replace(/[^\d]/g, "").slice(0, 4);
    setText(cleaned);
    const parsed = parseInt(cleaned, 10);
    if (!Number.isNaN(parsed)) {
      // Only push valid in-range values out so the slider/timeline track typing.
      onChange(clampYear(parsed));
    }
  };

  const commit = () => {
    if (text === "") {
      // Empty on blur → snap to current parent value (last valid)
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

        <div
          className={`relative transition-all ${focused ? "scale-[1.02]" : ""}`}
        >
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
              // Select all so typing instantly replaces the value.
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
            className="number-display w-44 sm:w-52 text-center text-5xl sm:text-6xl font-semibold bg-transparent outline-none caret-[color:var(--accent)] transition-colors"
            style={{ caretColor: "var(--accent)" }}
            aria-label="Skriv inn årstall (0–2000)"
          />
          <div
            className={`absolute left-0 right-0 -bottom-1 h-[2px] rounded-full transition-all ${
              focused ? "opacity-100" : "opacity-60"
            }`}
            style={{
              background: focused
                ? "var(--accent)"
                : "color-mix(in oklab, var(--line) 100%, transparent)",
            }}
          />
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

      <div className="flex justify-center -mt-2">
        <span
          className="chip"
          style={{
            color: eraForYear(value).color,
            borderColor: eraForYear(value).color + "44",
            background: eraForYear(value).color + "10",
          }}
        >
          Du gjetter i {eraForYear(value).label}
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
