"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground opacity-50"
        disabled
      >
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300 shadow-sm border border-border"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
            isDark ? "rotate-[-90deg] scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
            isDark ? "rotate-0 scale-100 opacity-100" : "rotate-[90deg] scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
}
