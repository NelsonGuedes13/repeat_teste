"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import StageScene from "./StageScene";

export default function StageCanvas() {
  // the canvas only draws on the client, so reading the viewport here can't cause a hydration mismatch
  const [lowPower] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, lowPower ? 1.25 : 1.75]}
        camera={{ fov: 40, position: [0, 1.5, 10] }}
        gl={{ antialias: !lowPower, powerPreference: "high-performance" }}
        fallback={<div className="h-full bg-[radial-gradient(ellipse_at_top,#2a0a1c,#050507_60%)]" />}
      >
        <StageScene lowPower={lowPower} />
      </Canvas>
    </div>
  );
}
