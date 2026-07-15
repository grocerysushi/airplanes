"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import type { AircraftDetailResponse } from "@/lib/types";

export default function AircraftPageClient({ hex }: { hex: string }) {
  const router = useRouter();
  const [data, setData] = useState<AircraftDetailResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setErr(null);
    (async () => {
      try {
        const r = await fetch(`/api/aircraft-details?id=${encodeURIComponent(hex)}`);
        if (cancelled) return;
        if (!r.ok) {
          setErr(r.status === 404 ? "Aircraft not currently tracked." : `Error ${r.status}`);
          return;
        }
        setData(await r.json());
      } catch (e: any) {
        if (!cancelled) setErr("Could not reach the server.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hex]);

  return (
    <main className="min-h-screen w-screen bg-background text-text-primary px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Back to the live map
        </Link>

        {err && (
          <div className="mt-6 surface-card border-danger/40 p-4 text-danger">
            {err}
          </div>
        )}

        {!err && !data && (
          <div className="mt-10 flex items-center gap-2 text-text-secondary">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading aircraft…
          </div>
        )}

        {data && (
          <div className="mt-6 space-y-4">
            <header className="surface-card p-5">
              <div className="text-xs uppercase tracking-wider text-text-secondary">{data.aircraft.source}</div>
              <h1 className="text-3xl font-extrabold mt-1">{data.aircraft.callsign ?? data.aircraft.registration ?? data.aircraft.hex.toUpperCase()}</h1>
              <div className="text-text-secondary mt-1 text-sm">{data.metadata?.manufacturer ?? ""} {data.metadata?.model ?? ""}</div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="chip bg-pastel-yellow/25 border border-pastel-yellow/60">{data.aircraft.hex.toUpperCase()}</span>
                {data.aircraft.registration && (
                  <span className="chip bg-pastel-blue/15 border border-pastel-blue/40">{data.aircraft.registration}</span>
                )}
                {data.aircraft.aircraftType && (
                  <span className="chip bg-pastel-green/20 border border-pastel-green/50">{data.aircraft.aircraftType}</span>
                )}
              </div>
            </header>
            <section className="surface-card p-5 grid grid-cols-2 gap-3 text-sm">
              <KV k="Altitude" v={data.aircraft.altitude !== undefined ? `${Math.round(data.aircraft.altitude)} ft` : "—"} />
              <KV k="Ground Speed" v={data.aircraft.groundSpeed !== undefined ? `${Math.round(data.aircraft.groundSpeed)} kt` : "—"} />
              <KV k="Heading" v={data.aircraft.heading !== undefined ? `${Math.round(data.aircraft.heading)}°` : "—"} />
              <KV k="Vertical Rate" v={data.aircraft.verticalRate !== undefined ? `${Math.round(data.aircraft.verticalRate)} ft/min` : "—"} />
              <KV k="Squawk" v={data.aircraft.squawk ?? "—"} />
              <KV k="On Ground" v={data.aircraft.onGround === undefined ? "—" : data.aircraft.onGround ? "Yes" : "No"} />
              <KV k="Origin" v={data.aircraft.origin ?? "—"} />
              <KV k="Destination" v={data.aircraft.destination ?? "—"} />
            </section>
            <button
              onClick={() => router.push(`/?aircraft=${hex}`)}
              className="surface-card px-4 py-2 text-sm font-semibold inline-flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" /> View on map
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-pastel-yellow/10 border border-pastel-yellow/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-text-secondary">{k}</div>
      <div className="font-bold mt-0.5">{v}</div>
    </div>
  );
}
