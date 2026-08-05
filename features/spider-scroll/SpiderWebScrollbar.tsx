'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLenis } from '@/hooks/useLenis';
import './spider-scroll.css';

/* ================================================================
   SpiderWebScrollbar
   ================================================================
   A fixed sidebar on the right edge of the viewport that acts as a
   custom scrollbar. Spider-Man at top, Gwen at bottom, with a
   procedurally-generated organic spider silk strand between them.

   The web mimics realistic spider silk: multiple thin threads that
   twist and braid around each other, with knotted cluster sections
   at irregular intervals and thinner stretched sections between.
   ================================================================ */

// ---- Constants ----
const IMAGE_SIZE = 110;
const SPIDER_RADIUS = 5;
const LERP_FACTOR = 0.08;

// Web strand parameters
const NUM_STRANDS = 5;            // number of individual silk threads
const KNOT_SPACING_MIN = 60;      // minimum px between knot clusters
const KNOT_SPACING_MAX = 140;     // maximum px between knot clusters
const KNOT_HEIGHT = 30;           // vertical extent of a knot cluster
const STRAND_SPREAD_KNOT = 14;    // max horizontal spread at knots (px from center)
const STRAND_SPREAD_THIN = 3;     // max horizontal spread in thin sections
const SEGMENT_STEP = 3;           // px step for drawing strand curves

// ---- Helpers ----
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Seeded pseudo-random for consistent geometry across frames */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Attempt smooth noise-like values for organic curves */
function smoothNoise(y: number, seed: number, freq: number): number {
  return (
    Math.sin(y * freq + seed) * 0.5 +
    Math.sin(y * freq * 2.13 + seed * 1.7) * 0.25 +
    Math.sin(y * freq * 0.53 + seed * 3.1) * 0.25
  );
}

/* ================================================================
   Knot Geometry — precomputed once per resize
   ================================================================ */
interface Knot {
  y: number;      // center Y of knot cluster
  height: number; // vertical size of knot
  intensity: number; // 0-1 how tangled this knot is
}

function generateKnots(canvasHeight: number, rand: () => number): Knot[] {
  const knots: Knot[] = [];
  let y = KNOT_SPACING_MIN * 0.5;
  while (y < canvasHeight - KNOT_SPACING_MIN * 0.3) {
    const intensity = 0.4 + rand() * 0.6;
    const height = KNOT_HEIGHT * (0.6 + intensity * 0.6);
    knots.push({ y, height, intensity });
    y += KNOT_SPACING_MIN + rand() * (KNOT_SPACING_MAX - KNOT_SPACING_MIN);
  }
  return knots;
}

/** Returns the "spread factor" at a given Y — wide at knots, narrow between */
function spreadAtY(y: number, knots: Knot[]): number {
  let maxInfluence = 0;
  for (const knot of knots) {
    const dist = Math.abs(y - knot.y);
    const halfH = knot.height * 0.7;
    if (dist < halfH) {
      const influence = knot.intensity * (1 - dist / halfH);
      if (influence > maxInfluence) maxInfluence = influence;
    }
  }
  return maxInfluence; // 0 = thin section, ~1 = full knot
}

/* ================================================================
   Component
   ================================================================ */
export function SpiderWebScrollbar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const scrollProgressRef = useRef<number>(0);
  const displayProgressRef = useRef<number>(0);
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const knotsRef = useRef<Knot[]>([]);
  const startTimeRef = useRef<number>(0);

  const lenis = useLenis();

  // ---- Scroll listener ----
  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => {
      const limit = lenis.limit;
      const current = lenis.scroll;
      scrollProgressRef.current = limit > 0 ? current / limit : 0;
    };

    lenis.on('scroll', onScroll);
    onScroll();

    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis]);

  // ---- Canvas resize handler ----
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvasSizeRef.current = { w, h };

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Regenerate knot positions for new height
    const rand = seededRandom(42);
    knotsRef.current = generateKnots(h, rand);
  }, []);

  // ---- Draw the organic silk web ----
  const drawWeb = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number,
    spiderY: number,
  ) => {
    const cx = w / 2;
    const knots = knotsRef.current;

    // Resolve theme-aware colors
    const sidebar = containerRef.current;
    const styles = sidebar ? getComputedStyle(sidebar) : null;
    const strandColor = styles?.getPropertyValue('--web-strand-color').trim() || 'rgba(0,0,0,0.55)';
    const strandColorLight = styles?.getPropertyValue('--web-strand-color-light').trim() || 'rgba(0,0,0,0.2)';
    const glowColor = styles?.getPropertyValue('--spider-glow').trim() || 'rgba(180,0,0,0.6)';

    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // ---- Draw each individual silk strand ----
    for (let s = 0; s < NUM_STRANDS; s++) {
      const strandSeed = 100 + s * 73.7;
      const phaseOffset = (s / NUM_STRANDS) * Math.PI * 2;

      // Alternate strand opacity for depth
      const isMainStrand = s < 2;
      ctx.strokeStyle = isMainStrand ? strandColor : strandColorLight;
      ctx.lineWidth = isMainStrand ? 1.2 : 0.7;

      ctx.beginPath();

      for (let y = 0; y <= h; y += SEGMENT_STEP) {
        const spread = spreadAtY(y, knots);

        // Base horizontal offset: sinusoidal twist around center
        const thinOffset = smoothNoise(y, strandSeed, 0.015) * STRAND_SPREAD_THIN;
        const knotOffset = smoothNoise(y, strandSeed + 50, 0.06) * STRAND_SPREAD_KNOT;

        // Blend between thin and knot offset based on spread factor
        const baseX = lerp(thinOffset, knotOffset, spread);

        // Ambient animation: gentle sway
        const sway = Math.sin(time * 0.8 + y * 0.008 + phaseOffset) * (1 + spread * 3) * 0.6;

        // Extra tangles at knots: sharp crossings
        let tangleX = 0;
        if (spread > 0.3) {
          tangleX = Math.sin(y * 0.18 + strandSeed) * spread * 6 *
            Math.sin(time * 0.5 + strandSeed);
        }

        // Tension pull toward spider position
        const distToSpider = Math.abs(y - spiderY);
        const tensionPull = distToSpider < 40
          ? (1 - distToSpider / 40) * 3 * Math.sin(phaseOffset)
          : 0;

        const x = cx + baseX + sway + tangleX + tensionPull;

        if (y === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    // ---- Extra cross-weave strands at knot clusters ----
    for (const knot of knots) {
      const numCrossings = Math.floor(2 + knot.intensity * 4);
      for (let c = 0; c < numCrossings; c++) {
        const crossSeed = knot.y * 17 + c * 31;
        const crossY = knot.y - knot.height * 0.4 + (c / numCrossings) * knot.height * 0.8;

        // Short diagonal crossing strand
        const startX = cx + smoothNoise(crossY, crossSeed, 0.1) * STRAND_SPREAD_KNOT * 0.8;
        const endX = cx + smoothNoise(crossY + 15, crossSeed + 20, 0.1) * STRAND_SPREAD_KNOT * 0.8;
        const midX = cx + smoothNoise(crossY + 7, crossSeed + 40, 0.15) * STRAND_SPREAD_KNOT * 1.2;

        const crossSway = Math.sin(time * 0.6 + crossSeed) * 1.5;

        ctx.beginPath();
        ctx.strokeStyle = strandColorLight;
        ctx.lineWidth = 0.5;
        ctx.moveTo(startX + crossSway, crossY);
        ctx.quadraticCurveTo(midX + crossSway, crossY + 8, endX + crossSway, crossY + 16);
        ctx.stroke();
      }
    }

    // ---- Fraying wisps at knots (loose thread ends) ----
    for (const knot of knots) {
      const numWisps = Math.floor(1 + knot.intensity * 3);
      for (let f = 0; f < numWisps; f++) {
        const wispSeed = knot.y * 13 + f * 47;
        const wispY = knot.y + smoothNoise(f, wispSeed, 1) * knot.height * 0.3;
        const wispStartX = cx + smoothNoise(wispY, wispSeed, 0.08) * 4;
        const wispDir = ((f % 2) * 2 - 1);
        const wispEndX = wispStartX + wispDir * (6 + knot.intensity * 10);
        const wispEndY = wispY + 5 + knot.intensity * 8;

        const wispSway = Math.sin(time * 1.2 + wispSeed) * 2;

        ctx.beginPath();
        ctx.strokeStyle = strandColorLight;
        ctx.lineWidth = 0.4;
        ctx.moveTo(wispStartX, wispY);
        ctx.quadraticCurveTo(
          wispStartX + wispDir * 4 + wispSway,
          wispY + 4,
          wispEndX + wispSway,
          wispEndY,
        );
        ctx.stroke();
      }
    }

    // ---- Scroll indicator spider ----
    drawSpider(ctx, cx, spiderY, time, glowColor, strandColor);
  }, []);

  // ---- Draw the spider indicator ----
  const drawSpider = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    time: number,
    glowColor: string,
    strandColor: string,
  ) => {
    const r = SPIDER_RADIUS;

    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 10;

    // Body
    ctx.beginPath();
    ctx.fillStyle = strandColor;
    ctx.ellipse(x, y, r * 0.6, r * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.ellipse(x, y - r * 1.0, r * 0.38, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Legs (4 pairs)
    ctx.strokeStyle = strandColor;
    ctx.lineWidth = 0.8;
    const legAngles = [0.3, 0.75, 1.2, 1.7];
    for (const angle of legAngles) {
      const wiggle = Math.sin(time * 2.5 + angle * 3) * 0.12;
      const a = angle + wiggle;

      // Left
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x - Math.cos(a) * r * 1.1,
        y + Math.sin(a) * r * 0.7,
        x - Math.cos(a - 0.3) * r * 2.2,
        y + Math.sin(a - 0.3) * r * 1.6,
      );
      ctx.stroke();

      // Right
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + Math.cos(a) * r * 1.1,
        y + Math.sin(a) * r * 0.7,
        x + Math.cos(a - 0.3) * r * 2.2,
        y + Math.sin(a - 0.3) * r * 1.6,
      );
      ctx.stroke();
    }

    // Red hourglass marking
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.moveTo(x, y - r * 0.25);
    ctx.lineTo(x - 1.2, y);
    ctx.lineTo(x, y + r * 0.25);
    ctx.lineTo(x + 1.2, y);
    ctx.closePath();
    ctx.fill();
  }, []);

  // ---- Animation loop ----
  useEffect(() => {
    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { w, h } = canvasSizeRef.current;
      if (w === 0 || h === 0) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = (now - startTimeRef.current) / 1000;

      displayProgressRef.current = lerp(
        displayProgressRef.current,
        scrollProgressRef.current,
        LERP_FACTOR,
      );

      const margin = SPIDER_RADIUS + 2;
      const spiderY = margin + displayProgressRef.current * (h - margin * 2);

      drawWeb(ctx, w, h, elapsed, spiderY);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [handleResize, drawWeb]);

  // ---- Click-to-scroll ----
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!lenis) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const progress = clickY / rect.height;
    const target = progress * lenis.limit;

    lenis.scrollTo(target, { duration: 1.2 });
  }, [lenis]);

  return (
    <div
      ref={containerRef}
      className="spider-scroll-sidebar"
      aria-hidden="true"
    >
      {/* Spider-Man at top */}
      <div className="spidey-img">
        <Image
          src="/images/spiderman.png"
          alt="Spider-Man"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE + 10}
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Animated spider silk web canvas */}
      <canvas
        ref={canvasRef}
        className="web-canvas"
        onClick={handleTrackClick}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      />

      {/* Gwen at bottom */}
      <div className="gwen-img">
        <Image
          src="/images/gwen.png"
          alt="Spider-Gwen"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE + 10}
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}

export default SpiderWebScrollbar;
