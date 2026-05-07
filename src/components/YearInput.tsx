"use client";
import { useEffect, useRef } from "react";
import { Minus, Plus } from "lucide-react";
import { clampYear } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (n: number) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function YearInput({ value, onChange, onSubmit, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          className="btn"
          onClick={() => onChange(clampYear(value - 1))}
          disabled={disabled}
          aria-label="Minus 1 år"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          ref={inputRef}
          type="number"
          min={0}
          max={2000}
          inputMode="numeric"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(clampYear(parseInt(e.target.value || "0", 10)))}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          className="number-display w-44 text-center text-5xl sm:text-6xl font-semibold bg-transparent outline-none border-b-2 hairline focus:border-[color:var(--accent)] transition-colors"
          aria-label="Skriv inn årstall"
        />
        <button
          type="button"
          className="btn"
          onClick={() => onChange(clampYear(value + 1))}
          disabled={disabled}
          aria-label="Pluss 1 år"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="px-1">
        <input
          type="range"
          className="year-slider"
          min={0}
          max={2000}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(clampYear(parseInt(e.target.value, 10)))}
          aria-label="Velg år med slider"
        />
        <div className="flex justify-between text-[11px] text-mute mt-1 px-1">
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
            onClick={() => onChange(clampYear(value + step))}
          >
            {step > 0 ? `+${step}` : step}
          </button>
        ))}
      </div>
    </div>
  );
}
