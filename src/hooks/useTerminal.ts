import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import "@xterm/xterm/css/xterm.css";

export function useTerminal(tabId: string, isVisible: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      theme: {
        background: "#1a1a1a",
        foreground: "#d4d4d4",
        cursor: "#d4d4d4",
      },
    });
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;

    requestAnimationFrame(() => fitAddon.fit());

    const encoder = new TextEncoder();

    const unlistenData = listen<string>(`pty:${tabId}:data`, (event) => {
      const decoded = atob(event.payload);
      const bytes = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i);
      }
      terminal.write(bytes);
    });

    const unlistenExit = listen(`pty:${tabId}:exit`, () => {
      terminal.write("\r\n\x1b[90m[Process exited]\x1b[0m\r\n");
    });

    const onDataDisposable = terminal.onData((str) => {
      const data = Array.from(encoder.encode(str));
      invoke("write_pty", { id: tabId, data }).catch(console.error);
    });

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
      invoke("resize_pty", {
        id: tabId,
        cols: terminal.cols,
        rows: terminal.rows,
      }).catch(console.error);
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      onDataDisposable.dispose();
      unlistenData.then((fn) => fn());
      unlistenExit.then((fn) => fn());
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, [tabId]);

  useEffect(() => {
    if (isVisible && fitAddonRef.current) {
      requestAnimationFrame(() => fitAddonRef.current?.fit());
    }
  }, [isVisible]);

  return { containerRef };
}
