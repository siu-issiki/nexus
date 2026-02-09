import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/themeStore";

const cycle = { light: "dark", dark: "system", system: "light" } as const;
const icons = { light: Sun, dark: Moon, system: Monitor } as const;

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const Icon = icons[theme];

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={() => setTheme(cycle[theme])}
      aria-label={`Theme: ${theme}`}
    >
      <Icon />
    </Button>
  );
}
