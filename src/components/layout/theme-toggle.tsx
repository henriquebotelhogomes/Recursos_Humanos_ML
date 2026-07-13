"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:text-fg"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
