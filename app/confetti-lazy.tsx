"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// O react-confetti (canvas + loop de animação) só é baixado depois que a
// página fica ociosa: não pesa no bundle inicial nem disputa CPU com a
// hidratação e com o LCP.
const Confetti = dynamic(() => import("./confetti"), { ssr: false });

const IDLE_TIMEOUT_MS = 2000;

export default function ConfettiLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (typeof window.requestIdleCallback !== "function") {
      setReady(true);
      return;
    }

    const idleId = window.requestIdleCallback(() => setReady(true), {
      timeout: IDLE_TIMEOUT_MS,
    });

    return () => window.cancelIdleCallback(idleId);
  }, []);

  if (!ready) return null;

  return <Confetti />;
}
