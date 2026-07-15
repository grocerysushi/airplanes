"use client";

import { useEffect, useState } from "react";

const KEY = "pastelRadar.settings.v1";

export interface PersistedSettings {
  coloring: string;
  refreshIntervalMs: number;
  filters: any | null;
}

export function usePersistedSettings(): {
  settings: PersistedSettings;
  setSettings: (s: Partial<PersistedSettings>) => void;
  ready: boolean;
} {
  const [settings, setSettingsState] = useState<PersistedSettings>({
    coloring: "default",
    refreshIntervalMs: 8000,
    filters: null,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettingsState((s) => ({ ...s, ...parsed }));
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const setSettings = (s: Partial<PersistedSettings>) => {
    setSettingsState((cur) => {
      const next = { ...cur, ...s };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return { settings, setSettings, ready };
}
