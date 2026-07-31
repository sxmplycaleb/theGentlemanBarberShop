"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

type Theme = "dark" | "light";

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("gentleman-theme-change", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("gentleman-theme-change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getCurrentTheme,
    (): Theme => "light",
  );

  const toggleTheme = () => {
    const nextTheme: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("gentleman-theme", nextTheme);
    window.dispatchEvent(new Event("gentleman-theme-change"));
  };

  const isDark = theme === "dark";

  return (
    <Button
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={toggleTheme}
      size="icon-sm"
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      type="button"
      variant="ghost"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}

export { ThemeToggle };
