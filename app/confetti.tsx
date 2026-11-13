"use client";

import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

const STOP_AFTER_MS = 10000;

export default function Confetti() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [run, setRun] = useState(false);

  useEffect(() => {
    const updateSize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    updateSize();
    setRun(true);

    const stopTimer = setTimeout(() => setRun(false), STOP_AFTER_MS);
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(stopTimer);
    };
  }, []);

  if (!run) return null;

  return (
    <ReactConfetti
      width={size.width}
      height={size.height}
      run={run}
      recycle={false}
      numberOfPieces={400}
      style={{ position: "fixed" }}
    />
  );
}
