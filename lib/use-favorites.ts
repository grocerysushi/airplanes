"use client";

import { useEffect, useState, useCallback } from "react";

const KEY = "pastelRadar.favorites.v1";

export function useFavorites(): {
  favorites: string[];
  toggle: (hex: string) => void;
  isFavorite: (hex: string) => boolean;
  ready: boolean;
} {
  const [favs, setFavs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavs(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const toggle = useCallback(
    (hex: string) => {
      const h = hex.toLowerCase();
      setFavs((cur) => {
        const next = cur.includes(h) ? cur.filter((x) => x !== h) : [...cur, h];
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  const isFavorite = useCallback((hex: string) => favs.includes(hex.toLowerCase()), [favs]);

  return { favorites: favs, toggle, isFavorite, ready };
}
