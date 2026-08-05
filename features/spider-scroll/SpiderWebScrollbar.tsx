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

   Everything — images AND web strands — automatically detects the
   background behind it at runtime and adapts colors for contrast.
   Works on any bg, any theme, any section.
   ================================================================ */

// ---- Constants ----
const IMAGE_SIZE = 110;
const SPIDER_RADIUS = 5;
const LERP_FACTOR = 0.08;
const BG_SAMPLE_INTERVAL_MS = 50;
const BG_SAMPLE_POINTS = 20;        // number of points sampled along the canvas height
const DARK_BG_THRESHOLD = 0.45;     // luminance below this = dark background

// Web strand parameters
const NUM_STRANDS = 5;
const KNOT_SPACING_MIN = 60;
const KNOT_SPACING_MAX = 140;
const KNOT_HEIGHT = 30;
const STRAND_SPREAD_KNOT = 14;
const STRAND_SPREAD_THIN = 3;
const SEGMENT_STEP = 3;

// Strand colors for light and dark backgrounds
const STRAND_DARK_ON_LIGHT = 'rgba(0, 0, 0, 0.55)';
const STRAND_DARK_ON_LIGHT_THIN = 'rgba(0, 0, 0, 0.2)';
const STRAND_LIGHT_ON_DARK = 'rgba(255, 255, 255, 0.55)';
const STRAND_LIGHT_ON_DARK_THIN = 'rgba(255, 255, 255, 0.2)';
const GLOW_ON_LIGHT = 'rgba(180, 0, 0, 0.6)';
const GLOW_ON_DARK = 'rgba(255, 80, 80, 0.6)';

// ---- Helpers ----
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function smoothNoise(y: number, seed: number, freq: number): number {
  return (
    Math.sin(y * freq + seed) * 0.5 +
    Math.sin(y * freq * 2.13 + seed * 1.7) * 0.25 +
    Math.sin(y * freq * 0.53 + seed * 3.1) * 0.25
  );
}

/* ================================================================
   Background luminance sampling
   ================================================================ */

/**
 * Universal CSS color → RGB parser using a 1×1 offscreen canvas.
 * Works with ANY color format: rgb, rgba, oklch, hsl, hex, named, etc.
 * The canvas engine normalizes everything to RGBA pixel data internally.
 */
let _colorCanvas: HTMLCanvasElement | null = null;
let _colorCtx: CanvasRenderingContext2D | null = null;

function parseAnyColor(color: string): [number, number, number, number] | null {
  if (!_colorCanvas) {
    _colorCanvas = document.createElement('canvas');
    _colorCanvas.width = 1;
    _colorCanvas.height = 1;
    _colorCtx = _colorCanvas.getContext('2d', { willReadFrequently: true });
  }
  if (!_colorCtx) return null;

  _colorCtx.clearRect(0, 0, 1, 1);
  _colorCtx.fillStyle = '#000'; // reset to known state
  _colorCtx.fillStyle = color;  // set the actual color (browser normalizes)
  _colorCtx.fillRect(0, 0, 1, 1);

  const data = _colorCtx.getImageData(0, 0, 1, 1).data;
  return [data[0], data[1], data[2], data[3]];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function sampleBgLuminanceAt(x: number, y: number, skipElements: Set<Element>): number {
  const stack = document.elementsFromPoint(x, y);
  for (const el of stack) {
    if (skipElements.has(el) || el.closest('.spider-scroll-sidebar')) continue;
    const bg = getComputedStyle(el).backgroundColor;
    if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') continue;

    const rgba = parseAnyColor(bg);
    if (rgba && rgba[3] > 10) { // ignore near-transparent
      return relativeLuminance(rgba[0], rgba[1], rgba[2]);
    }
  }
  return 1; // default to light
}

/** Interpolate luminance at any canvas Y from the sampled array */
function getLuminanceAtY(y: number, samples: Float32Array, canvasHeight: number): number {
  if (samples.length === 0 || canvasHeight === 0) return 1;
  const t = (y / canvasHeight) * (samples.length - 1);
  const i = Math.floor(t);
  const frac = t - i;
  const a = samples[Math.min(i, samples.length - 1)];
  const b = samples[Math.min(i + 1, samples.length - 1)];
  return a + (b - a) * frac;
}

/* ================================================================
   Knot Geometry
   ================================================================ */
interface Knot {
  y: number;
  height: number;
  intensity: number;
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
  return maxInfluence;
}

/* ================================================================
   Component
   ================================================================ */
export function SpiderWebScrollbar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const spideyRef = useRef<HTMLDivElement>(null);
  const gwenRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const scrollProgressRef = useRef<number>(0);
  const displayProgressRef = useRef<number>(0);
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const knotsRef = useRef<Knot[]>([]);
  const startTimeRef = useRef<number>(0);
  const lastBgSampleRef = useRef<number>(0);
  // Luminance samples along the canvas height
  const canvasLuminanceRef = useRef<Float32Array>(new Float32Array(BG_SAMPLE_POINTS));

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

  // ---- Background sampling — updates images AND canvas luminance map ----
  const sampleBackgrounds = useCallback(() => {
    const sidebar = containerRef.current;
    const canvas = canvasRef.current;
    if (!sidebar || !canvas) return;

    // Build skip set
    const skipSet = new Set<Element>();
    sidebar.querySelectorAll('*').forEach(el => skipSet.add(el));
    skipSet.add(sidebar);

    // ---- Sample behind character images ----
    if (spideyRef.current) {
      const rect = spideyRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const lum = sampleBgLuminanceAt(cx, cy, skipSet);
      spideyRef.current.setAttribute('data-on-dark', String(lum < DARK_BG_THRESHOLD));
    }

    if (gwenRef.current) {
      const rect = gwenRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const lum = sampleBgLuminanceAt(cx, cy, skipSet);
      gwenRef.current.setAttribute('data-on-dark', String(lum < DARK_BG_THRESHOLD));
    }

    // ---- Sample along the canvas height for web strand colors ----
    const canvasRect = canvas.getBoundingClientRect();
    const sampleX = canvasRect.left + canvasRect.width / 2;
    const samples = canvasLuminanceRef.current;

    for (let i = 0; i < BG_SAMPLE_POINTS; i++) {
      const t = i / (BG_SAMPLE_POINTS - 1);
      const sampleY = canvasRect.top + t * canvasRect.height;
      samples[i] = sampleBgLuminanceAt(sampleX, sampleY, skipSet);
    }
  }, []);

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

    const rand = seededRandom(42);
    knotsRef.current = generateKnots(h, rand);
  }, []);

  // ---- Draw the organic silk web (with per-segment adaptive colors) ----
  const drawWeb = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number,
    spiderY: number,
  ) => {
    const cx = w / 2;
    const knots = knotsRef.current;
    const lumSamples = canvasLuminanceRef.current;

    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // ---- Helper: get colors at a given canvas Y ----
    const getColorsAtY = (y: number): { main: string; light: string; glow: string } => {
      const lum = getLuminanceAtY(y, lumSamples, h);
      const isDark = lum < DARK_BG_THRESHOLD;
      return {
        main: isDark ? STRAND_LIGHT_ON_DARK : STRAND_DARK_ON_LIGHT,
        light: isDark ? STRAND_LIGHT_ON_DARK_THIN : STRAND_DARK_ON_LIGHT_THIN,
        glow: isDark ? GLOW_ON_DARK : GLOW_ON_LIGHT,
      };
    };

    // ---- Individual silk strands (drawn per-segment for color adaptation) ----
    for (let s = 0; s < NUM_STRANDS; s++) {
      const strandSeed = 100 + s * 73.7;
      const phaseOffset = (s / NUM_STRANDS) * Math.PI * 2;
      const isMainStrand = s < 2;

      let prevX = 0;
      let prevY = 0;

      for (let y = 0; y <= h; y += SEGMENT_STEP) {
        const spread = spreadAtY(y, knots);

        const thinOffset = smoothNoise(y, strandSeed, 0.015) * STRAND_SPREAD_THIN;
        const knotOffset = smoothNoise(y, strandSeed + 50, 0.06) * STRAND_SPREAD_KNOT;
        const baseX = lerp(thinOffset, knotOffset, spread);

        const sway = Math.sin(time * 0.8 + y * 0.008 + phaseOffset) * (1 + spread * 3) * 0.6;

        let tangleX = 0;
        if (spread > 0.3) {
          tangleX = Math.sin(y * 0.18 + strandSeed) * spread * 6 *
            Math.sin(time * 0.5 + strandSeed);
        }

        const distToSpider = Math.abs(y - spiderY);
        const tensionPull = distToSpider < 40
          ? (1 - distToSpider / 40) * 3 * Math.sin(phaseOffset)
          : 0;

        const x = cx + baseX + sway + tangleX + tensionPull;

        if (y > 0) {
          // Pick color based on background at this Y
          const colors = getColorsAtY(y);
          ctx.beginPath();
          ctx.strokeStyle = isMainStrand ? colors.main : colors.light;
          ctx.lineWidth = isMainStrand ? 1.2 : 0.7;
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        prevX = x;
        prevY = y;
      }
    }

    // ---- Cross-weave strands at knot clusters ----
    for (const knot of knots) {
      const numCrossings = Math.floor(2 + knot.intensity * 4);
      for (let c = 0; c < numCrossings; c++) {
        const crossSeed = knot.y * 17 + c * 31;
        const crossY = knot.y - knot.height * 0.4 + (c / numCrossings) * knot.height * 0.8;

        const startX = cx + smoothNoise(crossY, crossSeed, 0.1) * STRAND_SPREAD_KNOT * 0.8;
        const endX = cx + smoothNoise(crossY + 15, crossSeed + 20, 0.1) * STRAND_SPREAD_KNOT * 0.8;
        const midX = cx + smoothNoise(crossY + 7, crossSeed + 40, 0.15) * STRAND_SPREAD_KNOT * 1.2;
        const crossSway = Math.sin(time * 0.6 + crossSeed) * 1.5;

        const colors = getColorsAtY(crossY);
        ctx.beginPath();
        ctx.strokeStyle = colors.light;
        ctx.lineWidth = 0.5;
        ctx.moveTo(startX + crossSway, crossY);
        ctx.quadraticCurveTo(midX + crossSway, crossY + 8, endX + crossSway, crossY + 16);
        ctx.stroke();
      }
    }

    // ---- Fraying wisps at knots ----
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

        const colors = getColorsAtY(wispY);
        ctx.beginPath();
        ctx.strokeStyle = colors.light;
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
    const spiderColors = getColorsAtY(spiderY);
    drawSpider(ctx, cx, spiderY, time, spiderColors.glow, spiderColors.main);
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

    ctx.beginPath();
    ctx.fillStyle = strandColor;
    ctx.ellipse(x, y, r * 0.6, r * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(x, y - r * 1.0, r * 0.38, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.strokeStyle = strandColor;
    ctx.lineWidth = 0.8;
    const legAngles = [0.3, 0.75, 1.2, 1.7];
    for (const angle of legAngles) {
      const wiggle = Math.sin(time * 2.5 + angle * 3) * 0.12;
      const a = angle + wiggle;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x - Math.cos(a) * r * 1.1,
        y + Math.sin(a) * r * 0.7,
        x - Math.cos(a - 0.3) * r * 2.2,
        y + Math.sin(a - 0.3) * r * 1.6,
      );
      ctx.stroke();

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

      // Throttled background sampling (every 200ms)
      if (now - lastBgSampleRef.current > BG_SAMPLE_INTERVAL_MS) {
        lastBgSampleRef.current = now;
        sampleBackgrounds();
      }

      drawWeb(ctx, w, h, elapsed, spiderY);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [handleResize, drawWeb, sampleBackgrounds]);

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
      <div ref={spideyRef} className="spidey-img">
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
      <div ref={gwenRef} className="gwen-img">
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
