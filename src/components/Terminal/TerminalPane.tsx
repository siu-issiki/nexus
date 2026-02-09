import { useTerminal } from "@/hooks/useTerminal";

interface TerminalPaneProps {
  tabId: string;
  isVisible: boolean;
}

export function TerminalPane({ tabId, isVisible }: TerminalPaneProps) {
  const { containerRef } = useTerminal(tabId, isVisible);

  return <div ref={containerRef} className="h-full w-full" />;
}
