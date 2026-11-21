import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, RefreshCw } from 'lucide-react';
import { AnimationParams } from '../data/problems';

interface PhysicsProofCanvasProps {
  problemId: number;
  params: AnimationParams;
}

type ReferenceFrame = 'cart' | 'ground';

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  label?: string,
  lineWidth = 2.2
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 2) return;
  const angle = Math.atan2(dy, dx);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const headLen = 8;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  if (label) {
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    const lx = x2 + 9 * Math.cos(angle);
    const ly = y2 + 9 * Math.sin(angle);
    ctx.textAlign = dx >= 0 ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, lx, ly);
  }
  ctx.restore();
}

export const PhysicsProofCanvas: React.FC<PhysicsProofCanvasProps> = ({ problemId, params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [frame, setFrame] = useState<ReferenceFrame>('cart');
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [simTime, setSimTime] = useState<number>(0);

  const timeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const speedRef = useRef<number>(1.0);
  const frameRef = useRef<ReferenceFrame>('cart');
  const showVectorsRef = useRef<boolean>(true);

  const MAX_SIM_TIME = 1.8; // seconds of physical time

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  useEffect(() => {
    showVectorsRef.current = showVectors;
  }, [showVectors]);

  // Reset when problem changes
  useEffect(() => {
    timeRef.current = 0;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setSimTime(0);
    setFrame(params.mode === 'lab_velocity' ? 'ground' : 'cart');
  }, [problemId, params.mode]);

  const drawScene = (t: number) => {
    const canvas = canvasRef.current;
    const gCanvas = graphCanvasRef.current;
    if (!canvas || !gCanvas) return;

    const ctx = canvas.getContext('2d');
    const gCtx = gCanvas.getContext('2d');
    if (!ctx || !gCtx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background sky & subtle blueprint grid
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#F8FAFC');
    bgGrad.addColorStop(1, '#EFF6FF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const alphaR = (params.alphaDeg * Math.PI) / 180;
    const betaR = (params.betaDeg * Math.PI) / 180;

    // Physical kinematics at time t
    const xCartPhys = 0.5 * params.aCart * t * t; // meters
    const vCartPhys = params.aCart * t; // m/s
    const sRelPhys = 0.5 * params.aRel * t * t; // meters (positive = m1 moves up-left, m2 moves up-left toward pulley)
    const vRelPhys = params.aRel * t;

    const pxToMeter = 12; // visual scale: 12 px per meter of cart travel
    const pxSlope = 22; // visual scale on wedge slope

    const floorY = H - 36;
    const baseY = floorY - 26;

    // Ground scroll or cart displacement depending on reference frame
    let cartOffsetX = 0;
    let groundMarkerOffset = 0;

    if (frameRef.current === 'ground') {
      // Cart visibly moves across canvas (clamped smoothly with wrap or camera pan)
      const rawPx = xCartPhys * pxToMeter;
      cartOffsetX = Math.max(-135, Math.min(135, rawPx));
      groundMarkerOffset = -(rawPx - cartOffsetX);
    } else {
      // Cart frame: cart stays centered, ground markers rush backwards
      cartOffsetX = 0;
      groundMarkerOffset = -(xCartPhys * pxToMeter);
    }

    // Draw floor & moving tick marks
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(W, floorY);
    ctx.stroke();

    const spacing = 48;
    const shift = ((groundMarkerOffset % spacing) + spacing) % spacing;
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.4;
    for (let x = shift - spacing; x < W + spacing; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x - 10, floorY + 11);
      ctx.stroke();
    }

    // Center-of-mass line for recoil_cart mode
    if (params.mode === 'recoil_cart' && frameRef.current === 'ground') {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(W * 0.5, 22);
      ctx.lineTo(W * 0.5, floorY);
      ctx.stroke();
      ctx.fillStyle = '#059669';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('X_PM = konstan', W * 0.5 + 6, 34);
      ctx.restore();
    }

    // Cart geometry anchored at pulley (px, py)
    const px = W * 0.56 + cartOffsetX;
    const py = 122;
    const leftLen = 120;
    const ax = px - leftLen * Math.cos(alphaR);
    const ay = py - leftLen * Math.sin(alphaR);
    const hasRight = params.m2 > 0;
    const bx = px + (baseY - py) / Math.tan(betaR);
    const by = baseY;
    const cartLeftX = ax - 18;
    const cartRightX = hasRight ? bx + 26 : px + 46;

    // Draw Cart Wedge
    ctx.save();
    ctx.fillStyle = '#DBEAFE';
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cartLeftX, baseY);
    ctx.lineTo(cartLeftX, ay);
    ctx.lineTo(ax, ay);
    ctx.lineTo(px, py);
    if (hasRight) {
      ctx.lineTo(bx, by);
    } else {
      ctx.lineTo(px, baseY);
    }
    ctx.lineTo(cartRightX, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wheels (rotating proportional to xCartPhys)
    const wheelR = 13;
    const wheelRot = (xCartPhys * pxToMeter) / wheelR;
    const wheelXs = [cartLeftX + 34, (cartLeftX + cartRightX) / 2, cartRightX - 34];
    for (const wx of wheelXs) {
      const wy = floorY - wheelR;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(wx, wy, wheelR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Spoke to show rotation
      ctx.beginPath();
      ctx.moveTo(wx - wheelR * 0.7 * Math.cos(wheelRot), wy - wheelR * 0.7 * Math.sin(wheelRot));
      ctx.lineTo(wx + wheelR * 0.7 * Math.cos(wheelRot), wy + wheelR * 0.7 * Math.sin(wheelRot));
      ctx.stroke();
    }
    ctx.restore();

    // Block positions along slopes (clamped visually so blocks stay on slope during preview)
    const s1Visual = Math.max(24, Math.min(leftLen - 22, 56 + sRelPhys * pxSlope));
    const m1BaseX = px - s1Visual * Math.cos(alphaR);
    const m1BaseY = py - s1Visual * Math.sin(alphaR);
    const m1CenterX = m1BaseX + 13 * Math.sin(alphaR);
    const m1CenterY = m1BaseY - 13 * Math.cos(alphaR);

    const rightLen = Math.hypot(bx - px, by - py);
    const s2Visual = Math.max(26, Math.min(rightLen - 22, rightLen * 0.5 - sRelPhys * pxSlope));
    const m2BaseX = px + s2Visual * Math.cos(betaR);
    const m2BaseY = py + s2Visual * Math.sin(betaR);
    // Liftoff offset if liftoff_left mode reaches critical end
    const liftOffset = params.mode === 'liftoff_left' && t > 1.3 ? (t - 1.3) * 14 : 0;
    const m2CenterX = m2BaseX + (13 + liftOffset) * Math.sin(betaR);
    const m2CenterY = m2BaseY - (13 + liftOffset) * Math.cos(betaR);

    // Pulley & String
    if (hasRight) {
      const pulleyX = px + 7;
      const pulleyY = py - 11;

      // String segments
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(m1CenterX, m1CenterY);
      ctx.lineTo(pulleyX - 2, pulleyY - 8);
      ctx.moveTo(pulleyX + 6, pulleyY - 5);
      ctx.lineTo(m2CenterX, m2CenterY);
      ctx.stroke();

      // Pulley disc
      const pRot = (sRelPhys * pxSlope) / 9;
      ctx.fillStyle = '#FDE68A';
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pulleyX, pulleyY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pulleyX - 6 * Math.cos(pRot), pulleyY - 6 * Math.sin(pRot));
      ctx.lineTo(pulleyX + 6 * Math.cos(pRot), pulleyY + 6 * Math.sin(pRot));
      ctx.stroke();
    }

    // Draw Block m1
    ctx.save();
    ctx.translate(m1CenterX, m1CenterY);
    ctx.rotate(alphaR);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#0B193C';
    ctx.lineWidth = 2;
    ctx.fillRect(-18, -11, 36, 22);
    ctx.strokeRect(-18, -11, 36, 22);
    ctx.fillStyle = '#0B193C';
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('m₁', 0, 0);
    ctx.restore();

    // Draw Block m2
    if (hasRight) {
      ctx.save();
      ctx.translate(m2CenterX, m2CenterY);
      ctx.rotate(betaR);
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#0B193C';
      ctx.lineWidth = 2;
      ctx.fillRect(-18, -11, 36, 22);
      ctx.strokeRect(-18, -11, 36, 22);
      ctx.fillStyle = '#0B193C';
      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('m₂', 0, 0);
      ctx.restore();
    }

    // Dynamic Force & Velocity Vectors
    if (showVectorsRef.current) {
      // Cart acceleration arrow
      if (Math.abs(params.aCart) > 0.05) {
        const dir = params.aCart > 0 ? 1 : -1;
        const startX = dir > 0 ? cartRightX + 12 : cartLeftX - 12;
        drawArrow(ctx, startX, baseY - 35, startX + dir * 56, baseY - 35, '#2563EB', `a=${Math.abs(params.aCart).toFixed(1).replace('.', ',')}`);
      }

      // Forces on m1
      drawArrow(ctx, m1CenterX, m1CenterY, m1CenterX, m1CenterY + 34, '#DC2626', 'W₁');
      if (params.normal1N > 0) {
        drawArrow(
          ctx,
          m1CenterX,
          m1CenterY,
          m1CenterX + 38 * Math.sin(alphaR),
          m1CenterY - 38 * Math.cos(alphaR),
          '#059669',
          'N₁'
        );
      }
      if (frameRef.current === 'cart' && Math.abs(params.aCart) > 0.05) {
        const fiktDir = params.aCart > 0 ? -1 : 1;
        drawArrow(ctx, m1CenterX, m1CenterY, m1CenterX + fiktDir * 38, m1CenterY, '#2563EB', 'F_fik');
      }
      if (params.tensionN > 0 && hasRight) {
        drawArrow(
          ctx,
          m1CenterX,
          m1CenterY,
          m1CenterX + 28 * Math.cos(alphaR),
          m1CenterY + 28 * Math.sin(alphaR),
          '#D97706',
          'T'
        );
      }

      // Forces on m2
      if (hasRight) {
        drawArrow(ctx, m2CenterX, m2CenterY, m2CenterX, m2CenterY + 34, '#DC2626', 'W₂');
        if (params.normal2N > 0.1) {
          drawArrow(
            ctx,
            m2CenterX,
            m2CenterY,
            m2CenterX + 36 * Math.sin(betaR),
            m2CenterY - 36 * Math.cos(betaR),
            '#059669',
            'N₂'
          );
        }
        if (frameRef.current === 'cart' && Math.abs(params.aCart) > 0.05) {
          const fiktDir = params.aCart > 0 ? -1 : 1;
          drawArrow(ctx, m2CenterX, m2CenterY, m2CenterX + fiktDir * 36, m2CenterY, '#2563EB', 'F_fik');
        }
        if (params.tensionN > 0) {
          drawArrow(
            ctx,
            m2CenterX,
            m2CenterY,
            m2CenterX - 28 * Math.cos(betaR),
            m2CenterY - 28 * Math.sin(betaR),
            '#D97706',
            'T'
          );
        }
      }

      // Pulley resultant vector for Problem 12
      if (params.mode === 'pulley_resultant' && hasRight) {
        const fx = Math.cos(betaR) - Math.cos(alphaR);
        const fy = Math.sin(betaR) - Math.sin(alphaR);
        const mag = Math.hypot(fx, fy) || 1;
        drawArrow(
          ctx,
          px + 7,
          py - 11,
          px + 7 + (fx / mag) * 44,
          py - 11 + (fy / mag) * 44,
          '#0284C7',
          'F_katrol',
          2.6
        );
      }

      // Lab velocity vector on m1 in ground frame
      if (frameRef.current === 'ground' && t > 0.05) {
        const vx = vCartPhys - vRelPhys * Math.cos(alphaR);
        const vy = vRelPhys * Math.sin(alphaR);
        const scale = 3.2;
        drawArrow(
          ctx,
          m1CenterX,
          m1CenterY,
          m1CenterX + vx * scale,
          m1CenterY - vy * scale,
          '#0284C7',
          `v₁=${Math.hypot(vx, vy).toFixed(1).replace('.', ',')}`
        );
      }
    }

    // HUD readout inside canvas top-left
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#BFDBFE';
    ctx.lineWidth = 1;
    ctx.fillRect(10, 10, 215, 58);
    ctx.strokeRect(10, 10, 215, 58);

    ctx.fillStyle = '#0B193C';
    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.fillText(`t = ${t.toFixed(2).replace('.', ',')} s   v_kereta = ${vCartPhys.toFixed(1).replace('.', ',')} m/s`, 18, 28);
    ctx.fillStyle = '#1D4ED8';
    ctx.fillText(`v_rel = ${Math.abs(vRelPhys).toFixed(1).replace('.', ',')} m/s   T = ${params.tensionN.toFixed(1).replace('.', ',')} N`, 18, 46);
    ctx.fillStyle = '#059669';
    ctx.fillText(`N₁ = ${params.normal1N.toFixed(1).replace('.', ',')} N   N₂ = ${params.normal2N.toFixed(1).replace('.', ',')} N`, 18, 61);

    // =========================================================================
    // LIVE GRAPH CANVAS: Velocity & Kinetic Energy vs Time
    // =========================================================================
    const GW = gCanvas.width;
    const GH = gCanvas.height;
    gCtx.clearRect(0, 0, GW, GH);
    gCtx.fillStyle = '#FFFFFF';
    gCtx.fillRect(0, 0, GW, GH);

    const padL = 42;
    const padR = 14;
    const padT = 24;
    const padB = 26;
    const plotW = GW - padL - padR;
    const plotH = GH - padT - padB;

    // Axes
    gCtx.strokeStyle = '#CBD5E1';
    gCtx.lineWidth = 1;
    for (let i = 0; i <= 3; i += 1) {
      const gy = padT + (i / 3) * plotH;
      gCtx.beginPath();
      gCtx.moveTo(padL, gy);
      gCtx.lineTo(GW - padR, gy);
      gCtx.stroke();
    }
    gCtx.strokeStyle = '#334155';
    gCtx.lineWidth = 1.5;
    gCtx.beginPath();
    gCtx.moveTo(padL, padT);
    gCtx.lineTo(padL, GH - padB);
    gCtx.lineTo(GW - padR, GH - padB);
    gCtx.stroke();

    const maxV = Math.max(12, Math.abs(params.aCart) * MAX_SIM_TIME, Math.abs(params.aRel) * MAX_SIM_TIME);

    // Plot v_cart(t) up to current t
    gCtx.strokeStyle = '#2563EB';
    gCtx.lineWidth = 2.4;
    gCtx.beginPath();
    const steps = 40;
    for (let i = 0; i <= steps; i += 1) {
      const ti = (i / steps) * t;
      const vi = Math.abs(params.aCart) * ti;
      const gx = padL + (ti / MAX_SIM_TIME) * plotW;
      const gy = GH - padB - (vi / maxV) * plotH;
      if (i === 0) gCtx.moveTo(gx, gy);
      else gCtx.lineTo(gx, gy);
    }
    gCtx.stroke();

    // Plot v_rel(t) up to current t
    gCtx.strokeStyle = '#D97706';
    gCtx.lineWidth = 2.4;
    gCtx.beginPath();
    for (let i = 0; i <= steps; i += 1) {
      const ti = (i / steps) * t;
      const vi = Math.abs(params.aRel) * ti;
      const gx = padL + (ti / MAX_SIM_TIME) * plotW;
      const gy = GH - padB - (vi / maxV) * plotH;
      if (i === 0) gCtx.moveTo(gx, gy);
      else gCtx.lineTo(gx, gy);
    }
    gCtx.stroke();

    // Current dot markers
    const curX = padL + (t / MAX_SIM_TIME) * plotW;
    const curYCart = GH - padB - (Math.abs(vCartPhys) / maxV) * plotH;
    const curYRel = GH - padB - (Math.abs(vRelPhys) / maxV) * plotH;

    gCtx.fillStyle = '#2563EB';
    gCtx.beginPath();
    gCtx.arc(curX, curYCart, 4, 0, Math.PI * 2);
    gCtx.fill();

    gCtx.fillStyle = '#D97706';
    gCtx.beginPath();
    gCtx.arc(curX, curYRel, 4, 0, Math.PI * 2);
    gCtx.fill();

    // Graph labels
    gCtx.fillStyle = '#0B193C';
    gCtx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
    gCtx.fillText('Grafik Laju |v(t)|', padL, 14);
    gCtx.fillStyle = '#2563EB';
    gCtx.fillText('— |v_kereta|', GW - 135, 14);
    gCtx.fillStyle = '#D97706';
    gCtx.fillText('— |v_rel|', GW - 60, 14);
    gCtx.fillStyle = '#64748B';
    gCtx.font = '500 10px "IBM Plex Mono", monospace';
    gCtx.fillText('0', 26, GH - padB + 4);
    gCtx.fillText(`${maxV.toFixed(0)}`, 14, padT + 6);
    gCtx.fillText(`t (0..${MAX_SIM_TIME.toFixed(1).replace('.', ',')} s)`, padL + plotW * 0.35, GH - 7);
  };

  useEffect(() => {
    drawScene(timeRef.current);
  }, [problemId, frame, showVectors]);

  useEffect(() => {
    let rafId: number | null = null;
    let lastTs: number | null = null;

    const tick = (ts: number) => {
      if (!isPlayingRef.current) return;
      if (lastTs === null) {
        lastTs = ts;
      }
      const dt = ((ts - lastTs) / 1000) * speedRef.current;
      lastTs = ts;

      const nextT = Math.min(MAX_SIM_TIME, timeRef.current + dt);
      timeRef.current = nextT;
      setSimTime(nextT);
      drawScene(nextT);

      if (nextT >= MAX_SIM_TIME) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        return;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    if (isPlaying) {
      isPlayingRef.current = true;
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isPlaying, problemId]);

  const handlePlay = () => {
    if (timeRef.current >= MAX_SIM_TIME) {
      timeRef.current = 0;
      setSimTime(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const handleReplay = () => {
    timeRef.current = 0;
    setSimTime(0);
    drawScene(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    timeRef.current = 0;
    setSimTime(0);
    drawScene(0);
  };

  const activeStageIndex = simTime < 0.55 ? 0 : simTime < 1.2 ? 1 : 2;

  return (
    <div
      className="rounded-xl border border-blue-200 bg-white p-4 space-y-4"
      data-testid={`physics-animation-${problemId}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-sm font-bold text-[#0B193C]">
            Simulasi Pembuktian Fenomena Fisika — Soal {problemId}
          </h4>
          <p className="text-xs text-slate-600">
            Visualisasi hukum Newton real-time dengan vektor gaya dinamis dan grafik laju
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-blue-200 bg-[#EFF6FF] p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFrame('cart')}
              className={`rounded-md px-2.5 py-1 font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                frame === 'cart' ? 'bg-[#2563EB] text-white' : 'text-[#0B193C] hover:bg-white/70'
              }`}
            >
              Kerangka Kereta
            </button>
            <button
              type="button"
              onClick={() => setFrame('ground')}
              className={`rounded-md px-2.5 py-1 font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                frame === 'ground' ? 'bg-[#2563EB] text-white' : 'text-[#0B193C] hover:bg-white/70'
              }`}
            >
              Kerangka Tanah
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowVectors((v) => !v)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0B193C] hover:bg-slate-50 whitespace-nowrap cursor-pointer"
          >
            {showVectors ? 'Sembunyikan Vektor' : 'Tampilkan Vektor'}
          </button>
        </div>
      </div>

      {/* Main Canvas + Live Graph */}
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <canvas
            ref={canvasRef}
            width={620}
            height={285}
            className="w-full h-auto rounded-lg border border-blue-100 bg-[#F8FAFC]"
          />
        </div>
        <div className="lg:col-span-4 flex flex-col justify-between gap-3">
          <canvas
            ref={graphCanvasRef}
            width={320}
            height={175}
            className="w-full h-auto rounded-lg border border-slate-200 bg-white"
          />

          <div className="rounded-lg border border-blue-100 bg-[#EFF6FF]/70 p-3 text-xs space-y-1.5">
            <p className="font-semibold text-[#1D4ED8]">
              Keterangan Tahap ({activeStageIndex + 1}/3)
            </p>
            <p className="text-slate-700 leading-relaxed">
              {params.stageNotes[activeStageIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePlay}
            disabled={isPlaying}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            PLAY
          </button>
          <button
            type="button"
            onClick={handlePause}
            disabled={!isPlaying}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B193C] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B] disabled:opacity-45 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            PAUSE
          </button>
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B193C] hover:bg-blue-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            REPLAY
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            RESET
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label className="inline-flex items-center gap-1.5 font-medium text-slate-700">
            <span>Kecepatan Animasi</span>
            <select
              aria-label="Kecepatan animasi fisika"
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
              className="rounded-md border border-blue-200 bg-white px-2 py-1 font-mono-tabular font-semibold text-[#2563EB] cursor-pointer"
            >
              <option value={0.5}>0,5x</option>
              <option value={1.0}>1,0x</option>
              <option value={2.0}>2,0x</option>
            </select>
          </label>
          <span className="font-mono-tabular text-slate-500">
            {simTime.toFixed(2).replace('.', ',')} / {MAX_SIM_TIME.toFixed(1).replace('.', ',')} s
          </span>
        </div>
      </div>
    </div>
  );
};
