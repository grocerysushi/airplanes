"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function useGeolocation(): {
  loading: boolean;
  coords: { latitude: number; longitude: number } | null;
  error: string | null;
  request: () => void;
} {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation not supported on this device.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      (err) => {
        setLoading(false);
        setError(err.message ?? "Permission denied.");
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 60_000 },
    );
  };

  return { loading, coords, error, request };
}
