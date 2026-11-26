"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import ReactConfetti from "react-confetti";

const STOP_AFTER_MS = 10000;
const MAX_PIECES = 400;
const MIN_PIECES = 140;
// Uma peça a cada ~4000px²: telas pequenas ganham menos partículas (e menos CPU).
const PIXELS_PER_PIECE = 4000;

function subscribeToResize(onChange: () => void) {
  let frame = 0;

  // `resize` dispara dezenas de vezes por segundo: agrupa em um frame.
  const handler = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(onChange);
  };

  window.addEventListener("resize", handler, { passive: true });

  return () => {
    window.removeEventListener("resize", handler);
    cancelAnimationFrame(frame);
  };
}

function useViewportSize() {
  // useSyncExternalStore lê o tamanho sem setState em efeito e sem re-render
  // quando o valor não mudou (o snapshot é comparado por valor).
  const snapshot = useSyncExternalStore(
    subscribeToResize,
    () => `${window.innerWidth}x${window.innerHeight}`,
    () => "0x0",
  );

  return useMemo(() => {
    const [width, height] = snapshot.split("x").map(Number);
    return { width, height };
  }, [snapshot]);
}

export default function Confetti() {
  const { width, height } = useViewportSize();
  const [run, setRun] = useState(true);

  useEffect(() => {
    const stopTimer = setTimeout(() => setRun(false), STOP_AFTER_MS);
    return () => clearTimeout(stopTimer);
  }, []);

  if (!run || width === 0) return null;

  const numberOfPieces = Math.round((width * height) / PIXELS_PER_PIECE);

  return (
    <ReactConfetti
      width={width}
      height={height}
      run={run}
      recycle={false}
      numberOfPieces={Math.min(MAX_PIECES, Math.max(MIN_PIECES, numberOfPieces))}
      style={{ position: "fixed", inset: 0 }}
    />
  );
}
