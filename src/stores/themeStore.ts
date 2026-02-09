import { create } from "zustand";
import { settingsStore } from "@/stores/workspaceStore";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initTheme: () => Promise<void>;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: "dark",

  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
    settingsStore.set("theme", theme);
  },

  initTheme: async () => {
    const saved = await settingsStore.get<Theme>("theme");
    const theme = saved ?? "dark";
    set({ theme });
    applyTheme(theme);

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (get().theme === "system") {
          applyTheme("system");
        }
      });
  },
}));
