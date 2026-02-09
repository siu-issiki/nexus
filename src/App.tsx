import { useEffect } from "react";
import { Toaster } from "sonner";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useThemeStore } from "@/stores/themeStore";

function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);

  return (
    <>
      <Toaster theme={theme === "system" ? "system" : theme} />
      <MainLayout />
    </>
  );
}

export default App;
