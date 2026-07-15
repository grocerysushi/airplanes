"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Plane, ArrowUp, ArrowDown, Building2, MapPin, Share2, Copy, Star, Heart, Crosshair, Compass, History } from "lucide-react";
import type { Aircraft, AircraftDetailResponse } from "@/lib/types";
import {
  formatAltitude,
  formatBearing,
  formatSpeed,
  formatVerticalRate,
  formatRelativeTime,
} from "@/lib/geo";

export interface AircraftDetailPanelProps {
  hex: string;
  aircraftMap: Map<string, Aircraft>;
  initial: AircraftDetailResponse | null;
  loading: boolean;
  onClose: () => void;
  onFollow: (hex: string | null) => void;
  following: boolean;
  isFavorite: boolean;
  onToggleFavorite: (hex: string) => void;
  onLocateAirport?: (icao: string) => void;
}

export default function AircraftDetailPanel(props: AircraftDetailPanelProps) {
  const [detail, setDetail] = useState<AircraftDetailResponse | null>(props.initial);
  const [loading, setLoading] = useState(props.loading);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setDetail(props.initial);
    setLoading(props.loading);
  }, [props.hex, props.initial, props.loading]);

  const live = props.aircraftMap.get(`${props.hex}`) ??
    Array.from(props.aircraftMap.values()).find((a) => a.hex === props.hex);

  const ac: Aircraft | null = detail?.aircraft ?? live ?? null;

  const handleShare = useCallback(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("aircraft", props.hex);
    const shareUrl = url.toString();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {
      // ignore
    }
  }, [props.hex]);

  const handleCopyHex = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(props.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, [props.hex]);

  if (!ac && !loading) {
    return (
      <aside className="surface-card w-[420px] max-w-full p-5 h-full overflow-auto animate-slidein">
        <div className="text-sm text-text-secondary">
          Aircraft not currently in the live feed. It may have landed, or be outside the
          visible map area.
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="surface-card w-[420px] max-w-full h-full overflow-auto p-5 animate-slidein"
      role="dialog"
      aria-label={`Aircraft ${props.hex.toUpperCase()}`}
    >
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/80">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-secondary">
            {ac?.source ?? "—"}
          </div>
          <h2 className="text-2xl font-extrabold leading-tight text-text-primary">
            {ac?.callsign ?? ac?.registration ?? props.hex.toUpperCase()}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="chip bg-pastel-yellow/25 text-[#7a5b14] border border-pastel-yellow/60">
              {props.hex.toUpperCase()}
            </span>
            {ac?.registration && (
              <span className="chip bg-pastel-blue/15 text-[#3a6075] border border-pastel-blue/40">
                {ac.registration}
              </span>
            )}
          </div>
        </div>
        <button
          aria-label="Close detail"
          onClick={props.onClose}
          className="w-9 h-9 grid place-items-center rounded-full hover:bg-pastel-coral/15 text-text-secondary hover:text-danger"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {loading && !detail && <div className="py-6 text-sm text-text-secondary">Loading details…</div>}

      <section className="grid grid-cols-3 gap-3 py-4">
        <Stat label="Altitude" value={formatAltitude(ac?.altitude)} icon={<ArrowUp className="w-3 h-3" />} />
        <Stat label="Ground Speed" value={formatSpeed(ac?.groundSpeed)} />
        <Stat label="Heading" value={formatBearing(ac?.heading)} icon={<Compass className="w-3 h-3" />} />
        <Stat
          label="Vertical Rate"
          value={formatVerticalRate(ac?.verticalRate)}
          icon={ac && ac.verticalRate && ac.verticalRate < 0 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
        />
        <Stat label="Squawk" value={ac?.squawk ?? "—"} />
        <Stat label="Updated" value={formatRelativeTime(ac?.lastUpdated)} icon={<History className="w-3 h-3" />} />
      </section>

      <DetailBlock title="Aircraft">
        <KV k="Type" v={ac?.aircraftType ?? ac?.model ?? "Not available"} />
        <KV k="Manufacturer" v={ac?.manufacturer ?? "Not available"} />
        <KV k="Model" v={ac?.model ?? "Not available"} />
        <KV k="Category" v={ac?.category ?? "—"} />
        <KV k="On Ground" v={ac?.onGround === undefined ? "—" : ac.onGround ? "Yes" : "No"} />
        <KV k="Emergency" v={ac?.emergency ? "Yes" : "No"} />
      </DetailBlock>

      <DetailBlock title="Flight">
        <KV k="Callsign" v={ac?.callsign ?? "Not available"} />
        <KV k="Airline" v={ac?.airline ?? "Not available"} />
        <KV k="Origin" v={ac?.origin ?? "Not available"} />
        <KV k="Destination" v={ac?.destination ?? "Not available"} />
      </DetailBlock>

      <DetailBlock title="Position">
        <KV k="Latitude" v={ac ? ac.latitude.toFixed(4) : "—"} />
        <KV k="Longitude" v={ac ? ac.longitude.toFixed(4) : "—"} />
      </DetailBlock>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => props.onFollow(props.following ? null : props.hex)}
          className="flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 bg-pastel-yellow/25 hover:bg-pastel-yellow/40 border border-pastel-yellow/70 text-text-primary text-sm font-semibold"
          aria-pressed={props.following}
        >
          <Crosshair className="w-4 h-4" /> {props.following ? "Following" : "Follow"}
        </button>
        <button
          onClick={() => props.onToggleFavorite(props.hex)}
          className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 text-sm font-semibold border ${
            props.isFavorite
              ? "bg-pastel-coral/25 border-pastel-coral/70"
              : "bg-pastel-blue/15 border-pastel-blue/40 hover:bg-pastel-blue/25"
          }`}
          aria-pressed={props.isFavorite}
        >
          <Heart className={`w-4 h-4 ${props.isFavorite ? "fill-danger stroke-danger" : ""}`} />
          {props.isFavorite ? "Favorited" : "Favorite"}
        </button>
        <button
          onClick={handleCopyHex}
          className="flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 bg-pastel-green/20 border border-pastel-green/50 text-sm font-semibold"
        >
          <Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy ID"}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 bg-pastel-lavender/25 border border-pastel-lavender/60 text-sm font-semibold"
        >
          <Share2 className="w-4 h-4" /> {shared ? "Link copied" : "Share"}
        </button>
      </div>
    </aside>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-pastel-yellow/10 border border-pastel-yellow/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-text-secondary flex items-center gap-1">
        {icon} {label}
      </div>
      <div className="text-xl font-extrabold leading-tight text-text-primary mt-0.5 truncate">
        {value}
      </div>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="text-xs uppercase tracking-wider text-text-secondary pb-1.5">{title}</h3>
      <div className="rounded-2xl border border-border bg-pastel-yellow/[0.04] divide-y divide-border/60">
        {children}
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-3 py-2 text-sm">
      <div className="text-text-secondary">{k}</div>
      <div className="text-text-primary font-semibold text-right truncate">{v}</div>
    </div>
  );
}
