"use client";

import { useEffect, useRef } from "react";

export interface ErrorToastProps {
  messages: { id: number; text: string; tone: "warning" | "error" | "info" }[];
  onDismiss: (id: number) => void;
}

export default function ErrorToast({ messages, onDismiss }: ErrorToastProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-none">
      {messages.map((m) => (
        <Toast key={m.id} text={m.text} tone={m.tone} onDismiss={() => onDismiss(m.id)} />
      ))}
    </div>
  );
}

function Toast({ text, tone, onDismiss }: { text: string; tone: "warning" | "error" | "info"; onDismiss: () => void }) {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    t.current = setTimeout(onDismiss, 5200);
    return () => {
      if (t.current) clearTimeout(t.current);
    };
  }, [onDismiss]);
  const colors =
    tone === "error"
      ? "bg-danger/15 border-danger/40 text-danger"
      : tone === "warning"
      ? "bg-pastel-orange/20 border-pastel-orange/60 text-[#7a4e1f]"
      : "bg-pastel-blue/15 border-pastel-blue/40 text-[#3a6075]";
  return (
    <div
      role="status"
      className={`surface-card border ${colors} px-4 py-2 text-sm pointer-events-auto animate-pop max-w-[80vw]`}
    >
      {text}
    </div>
  );
}
