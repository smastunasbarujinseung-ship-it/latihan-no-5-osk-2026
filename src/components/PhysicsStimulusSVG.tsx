import React from 'react';
import { FbdConfig, StimulusConfig } from '../data/problems';
import { TheorySection } from '../data/theory';

function rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export const ProblemStimulusSVG: React.FC<{
  config: StimulusConfig;
  problemId: number;
  bare?: boolean;
}> = ({ config, problemId, bare = false }) => {
  const alphaR = rad(config.alphaDeg);
  const betaR = rad(config.betaDeg ?? 53.13);

  const floorY = 250;
  const baseY = 222;
  const px = 265;
  const py = 122;

  const leftSlopeLen = 132;
  const ax = px - leftSlopeLen * Math.cos(alphaR);
  const ay = py - leftSlopeLen * Math.sin(alphaR);

  const rightDrop = baseY - py;
  const bx = px + rightDrop / Math.tan(betaR);
  const by = baseY;

  const cartLeftX = Math.min(ax - 12, 105);
  const cartRightX = Math.max(bx + 24, 385);

  // m1 center on left slope (at 52% up from pulley)
  const s1 = 68;
  const m1BaseX = px - s1 * Math.cos(alphaR);
  const m1BaseY = py - s1 * Math.sin(alphaR);
  const m1CenterX = m1BaseX + 14 * Math.sin(alphaR);
  const m1CenterY = m1BaseY - 14 * Math.cos(alphaR);

  // m2 center on right slope (at 52% down from pulley)
  const rightLen = Math.hypot(bx - px, by - py);
  const s2 = rightLen * 0.5;
  const m2BaseX = px + s2 * Math.cos(betaR);
  const m2BaseY = py + s2 * Math.sin(betaR);
  const m2CenterX = m2BaseX + 14 * Math.sin(betaR);
  const m2CenterY = m2BaseY - 14 * Math.cos(betaR);

  const hasRightSlope = config.variant !== 'single_left';
  const showLeftRough = config.variant === 'rough_left' || config.variant === 'rough_both';
  const showRightRough = config.variant === 'rough_both';

  const showM1OuterLabel = config.m1Label !== 'm₁';
  const showM2OuterLabel = Boolean(config.m2Label && config.m2Label !== 'm₂');

  return (
    <div className={bare ? '' : 'rounded-xl border border-blue-200/80 bg-white p-4'}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <span className="font-semibold text-[#0B193C]">Diagram Stimulus Soal {problemId}</span>
        <span>{config.frictionNote}</span>
      </div>

      <svg
        viewBox="0 0 540 285"
        className="w-full h-auto rounded-lg bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF]/60 border border-slate-100"
        role="img"
        aria-label={`Diagram stimulus fisika soal ${problemId}`}
      >
        <defs>
          <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,1 L8,4 L0,7 Z" fill="#2563EB" />
          </marker>
          <marker id="arrowDark" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,1 L8,4 L0,7 Z" fill="#0B193C" />
          </marker>
          <pattern id="roughHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.45" />
          </pattern>
        </defs>

        {/* Floor */}
        <line x1="25" y1={floorY} x2="515" y2={floorY} stroke="#334155" strokeWidth="2.2" />
        {Array.from({ length: 23 }).map((_, idx) => {
          const x = 35 + idx * 21;
          return (
            <line key={idx} x1={x} y1={floorY} x2={x - 7} y2={floorY + 9} stroke="#94A3B8" strokeWidth="1.2" />
          );
        })}

        {/* Cart Wedge Body */}
        {hasRightSlope ? (
          <polygon
            points={`${cartLeftX},${baseY} ${cartLeftX},${ay} ${ax},${ay} ${px},${py} ${bx},${by} ${cartRightX},${by}`}
            fill="#DBEAFE"
            stroke="#1E3A8A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ) : (
          <polygon
            points={`${cartLeftX},${baseY} ${cartLeftX},${ay} ${ax},${ay} ${px},${py} ${px},${baseY} ${cartRightX},${baseY}`}
            fill="#DBEAFE"
            stroke="#1E3A8A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {/* Rough surface highlight strips if applicable */}
        {showLeftRough && (
          <line
            x1={ax}
            y1={ay}
            x2={px}
            y2={py}
            stroke="#7C3AED"
            strokeWidth="5"
            strokeDasharray="5 3"
            opacity="0.7"
          />
        )}
        {showRightRough && hasRightSlope && (
          <line
            x1={px}
            y1={py}
            x2={bx}
            y2={by}
            stroke="#7C3AED"
            strokeWidth="5"
            strokeDasharray="5 3"
            opacity="0.7"
          />
        )}

        {/* Wheels */}
        {[cartLeftX + 34, (cartLeftX + cartRightX) / 2, cartRightX - 38].map((wx, idx) => (
          <g key={idx}>
            <circle cx={wx} cy={floorY - 14} r="13.5" fill="#FFFFFF" stroke="#1E3A8A" strokeWidth="2.2" />
            <circle cx={wx} cy={floorY - 14} r="3.5" fill="#2563EB" />
          </g>
        ))}

        {/* Cart mass label if specified */}
        {config.cartLabel && (
          <text x={(cartLeftX + px) / 2} y={baseY - 18} textAnchor="middle" className="fill-[#0B193C] text-[12px] font-semibold">
            {config.cartLabel}
          </text>
        )}

        {/* Angle alpha horizontal reference & arc at pulley P */}
        <line x1={px - 62} y1={py} x2={px} y2={py} stroke="#64748B" strokeWidth="1.2" strokeDasharray="4 3" />
        <path
          d={`M ${px - 42} ${py} A 42 42 0 0 1 ${px - 42 * Math.cos(alphaR)} ${py - 42 * Math.sin(alphaR)}`}
          fill="none"
          stroke="#0284C7"
          strokeWidth="1.8"
        />
        <text x={px - 56} y={py - 12} textAnchor="end" className="fill-[#0369A1] text-[11.5px] font-semibold">
          {config.alphaLabel}
        </text>

        {/* Angle beta arc at bottom-right B */}
        {hasRightSlope && config.betaLabel && (
          <g>
            <path
              d={`M ${bx - 36} ${by} A 36 36 0 0 1 ${bx - 36 * Math.cos(betaR)} ${by - 36 * Math.sin(betaR)}`}
              fill="none"
              stroke="#0284C7"
              strokeWidth="1.8"
            />
            <text x={bx - 42} y={by - 10} textAnchor="end" className="fill-[#0369A1] text-[11.5px] font-semibold">
              {config.betaLabel}
            </text>
          </g>
        )}

        {/* String + Pulley */}
        {config.hasPulley && hasRightSlope && (
          <g>
            {/* Pulley mount */}
            <line x1={px} y1={py} x2={px + 7} y2={py - 11} stroke="#1E3A8A" strokeWidth="2.5" />
            <circle cx={px + 8} cy={py - 12} r="9" fill="#FDE68A" stroke="#B45309" strokeWidth="1.8" />
            <circle cx={px + 8} cy={py - 12} r="2.2" fill="#92400E" />
            {/* String segments */}
            <line
              x1={m1CenterX}
              y1={m1CenterY}
              x2={px + 5}
              y2={py - 20}
              stroke="#B45309"
              strokeWidth="2"
            />
            <line
              x1={px + 15}
              y1={py - 16}
              x2={m2CenterX}
              y2={m2CenterY}
              stroke="#B45309"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Block m1 */}
        <g transform={`translate(${m1CenterX}, ${m1CenterY}) rotate(${config.alphaDeg})`}>
          <rect x="-20" y="-13" width="40" height="26" rx="3" fill="#FFFFFF" stroke="#0B193C" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" className="fill-[#0B193C] text-[11px] font-bold">
            {config.m1Label.split('=')[0].trim()}
          </text>
        </g>
        {showM1OuterLabel && (
          <text x={m1CenterX + 18} y={m1CenterY - 26} textAnchor="start" className="fill-[#0B193C] text-[11px] font-semibold">
            {config.m1Label}
          </text>
        )}

        {/* Block m2 */}
        {hasRightSlope && config.m2Label && (
          <g>
            <g transform={`translate(${m2CenterX}, ${m2CenterY}) rotate(${config.betaDeg ?? 53.13})`}>
              <rect x="-20" y="-13" width="40" height="26" rx="3" fill="#FFFFFF" stroke="#0B193C" strokeWidth="2" />
              <text x="0" y="4" textAnchor="middle" className="fill-[#0B193C] text-[11px] font-bold">
                {config.m2Label.split('=')[0].split('(')[0].trim()}
              </text>
            </g>
            {showM2OuterLabel && (
              <text x={m2CenterX + 24} y={m2CenterY - 24} textAnchor="start" className="fill-[#0B193C] text-[11px] font-semibold">
                {config.m2Label}
              </text>
            )}
          </g>
        )}

        {/* Gravity vector reference */}
        <line x1="485" y1="36" x2="485" y2="78" stroke="#0B193C" strokeWidth="2" markerEnd="url(#arrowDark)" />
        <text x="494" y="60" className="fill-[#0B193C] text-[12px] font-semibold">
          g
        </text>

        {/* Acceleration / Push Force Arrow */}
        {config.accelDirection === 'right' && (
          <g>
            <line
              x1={cartRightX + 16}
              y1={194}
              x2={cartRightX + 82}
              y2={194}
              stroke="#2563EB"
              strokeWidth="2.8"
              markerEnd="url(#arrowBlue)"
            />
            <text x={cartRightX + 49} y={182} textAnchor="middle" className="fill-[#1D4ED8] text-[12px] font-bold">
              {config.accelLabel}
            </text>
          </g>
        )}

        {config.accelDirection === 'left' && (
          <g>
            <line
              x1={cartLeftX - 10}
              y1={170}
              x2={cartLeftX - 76}
              y2={170}
              stroke="#2563EB"
              strokeWidth="2.8"
              markerEnd="url(#arrowBlue)"
            />
            <text x={cartLeftX - 44} y={158} textAnchor="middle" className="fill-[#1D4ED8] text-[12px] font-bold">
              {config.accelLabel}
            </text>
          </g>
        )}

        {config.accelDirection === 'free' && (
          <text x={cartRightX + 12} y={174} className="fill-[#1D4ED8] text-[11.5px] font-semibold">
            {config.accelLabel}
          </text>
        )}

        {config.forceLabel && (
          <g>
            <line
              x1={cartLeftX - 66}
              y1={178}
              x2={cartLeftX - 6}
              y2={178}
              stroke="#0284C7"
              strokeWidth="2.8"
              markerEnd="url(#arrowBlue)"
            />
            <text x={cartLeftX - 38} y={166} textAnchor="middle" className="fill-[#0369A1] text-[12px] font-bold">
              {config.forceLabel}
            </text>
          </g>
        )}

        {config.showVelocityFrame && (
          <g>
            <line x1="42" y1="36" x2="96" y2="36" stroke="#64748B" strokeWidth="1.5" markerEnd="url(#arrowDark)" />
            <line x1="42" y1="36" x2="42" y2="10" stroke="#64748B" strokeWidth="1.5" markerEnd="url(#arrowDark)" />
            <text x="100" y="40" className="fill-slate-600 text-[10.5px]">+x (tanah)</text>
            <text x="48" y="16" className="fill-slate-600 text-[10.5px]">+y</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export const FreeBodyDiagramSVG: React.FC<{ config: FbdConfig; bare?: boolean }> = ({ config, bare = false }) => {
  const renderBodyPanel = (
    title: string,
    slopeAngleDeg: number,
    isLeftSlope: boolean,
    forces: FbdConfig['forcesM1']
  ) => {
    const cx = 145;
    const cy = 125;
    const r = 68;
    const slopeRad = rad(slopeAngleDeg);
    const dx = Math.cos(slopeRad) * 92;
    const dy = Math.sin(slopeRad) * 92;

    return (
      <div className="rounded-lg border border-blue-100 bg-white p-3">
        <p className="mb-2 text-xs font-semibold text-[#0B193C]">{title}</p>
        <svg viewBox="0 0 290 240" className="w-full h-auto bg-[#F8FAFC] rounded-md border border-slate-100">
          <defs>
            {forces.map((f, i) => (
              <marker
                key={i}
                id={`fbdArrow-${isLeftSlope ? 'L' : 'R'}-${i}`}
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,1 L7,3.5 L0,6 Z" fill={f.color} />
              </marker>
            ))}
          </defs>

          {/* Coordinate reference axes (dashed) */}
          <line x1="25" y1={cy} x2="265" y2={cy} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={cx} y1="18" x2={cx} y2="225" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

          {/* Slope tangent line */}
          {isLeftSlope ? (
            <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} stroke="#94A3B8" strokeWidth="2" />
          ) : (
            <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} stroke="#94A3B8" strokeWidth="2" />
          )}

          {/* Mass particle center */}
          <circle cx={cx} cy={cy} r="7.5" fill="#0B193C" />

          {/* Force vectors */}
          {forces.map((f, i) => {
            const len = Math.max(36, Math.min(82, f.magnitudeScale * 56));
            const th = rad(f.angleDeg);
            const ex = cx + len * Math.cos(th);
            const ey = cy - len * Math.sin(th);
            const isHorizontal = f.angleDeg === 180 || f.angleDeg === 0;
            const lx = isHorizontal ? cx + (len * 0.65) * Math.cos(th) : cx + (len + 16) * Math.cos(th);
            const ly = isHorizontal ? cy - 13 : cy - (len + 16) * Math.sin(th);
            return (
              <g key={i}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={ex}
                  y2={ey}
                  stroke={f.color}
                  strokeWidth="2.4"
                  markerEnd={`url(#fbdArrow-${isLeftSlope ? 'L' : 'R'}-${i})`}
                />
                <text
                  x={Math.max(34, Math.min(256, lx))}
                  y={Math.max(16, Math.min(228, ly))}
                  textAnchor="middle"
                  fill={f.color}
                  className="text-[10.5px] font-bold"
                >
                  {f.symbol}
                </text>
              </g>
            );
          })}
          <text x={cx + r - 18} y={20} className="fill-slate-400 text-[9.5px]">
            Sumbu acuan
          </text>
        </svg>

        <ul className="mt-2 space-y-1 text-xs text-slate-600">
          {forces.map((f, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: f.color }}
                aria-hidden="true"
              />
              <span>
                <strong className="text-[#0B193C]">{f.symbol}:</strong> {f.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={bare ? 'space-y-3' : 'rounded-xl border border-blue-200 bg-[#EFF6FF]/60 p-4 space-y-3'}>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-[#1D4ED8]">{config.frameDescription}</p>
        <p className="text-xs text-slate-600">{config.axesDescription}</p>
      </div>

      <div className={`grid gap-4 ${config.forcesM2 ? 'md:grid-cols-2' : 'grid-cols-1 max-w-md'}`}>
        {renderBodyPanel('FBD Objek 1 / Titik Tinjau Utama', config.alphaDeg, true, config.forcesM1)}
        {config.forcesM2 &&
          renderBodyPanel('FBD Benda m₂ (Lereng Kanan)', config.betaDeg ?? 53.13, false, config.forcesM2)}
      </div>

      <p className="text-xs text-slate-700 bg-white/80 rounded-lg border border-blue-100 px-3 py-2">
        {config.extraNote}
      </p>
    </div>
  );
};

export const TheoryVisualDiagram: React.FC<{
  visualType: TheorySection['visualType'];
  caption: string;
}> = ({ visualType, caption }) => {
  return (
    <figure className="rounded-xl border border-blue-200/80 bg-white p-4">
      {visualType === 'source_system' && (
        <ProblemStimulusSVG
          bare
          problemId={5}
          config={{
            variant: 'double_wedge',
            alphaLabel: 'α (sin α = 3/5)',
            betaLabel: 'β',
            alphaDeg: 36.87,
            betaDeg: 58.58,
            m1Label: 'm₁',
            m2Label: 'm₂ (m₁/m₂ = 1)',
            accelDirection: 'right',
            accelLabel: 'a = 1,1g',
            hasPulley: true,
            frictionNote: 'Sistem Soal Nomor 5 OSK Fisika 2026 (Tanpa Gesekan)',
          }}
        />
      )}

      {visualType === 'frame_comparison' && (
        <svg viewBox="0 0 560 200" className="w-full h-auto rounded-lg bg-[#F8FAFC] border border-slate-100">
          <defs>
            <marker id="tvArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,1 L7,3.5 L0,6 Z" fill="#2563EB" />
            </marker>
            <marker id="tvRed" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,1 L7,3.5 L0,6 Z" fill="#DC2626" />
            </marker>
          </defs>
          <rect x="16" y="16" width="252" height="168" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="142" y="38" textAnchor="middle" className="fill-[#0B193C] text-[12px] font-bold">
            Pengamat di Tanah (Inersia)
          </text>
          <line x1="36" y1="150" x2="246" y2="150" stroke="#64748B" strokeWidth="1.8" />
          <rect x="82" y="102" width="60" height="44" rx="4" fill="#DBEAFE" stroke="#1E3A8A" strokeWidth="1.8" />
          <line x1="146" y1="124" x2="210" y2="124" stroke="#2563EB" strokeWidth="2.5" markerEnd="url(#tvArrow)" />
          <text x="178" y="114" textAnchor="middle" className="fill-[#2563EB] text-[11px] font-bold">a_benda = a</text>
          <text x="142" y="170" textAnchor="middle" className="fill-slate-600 text-[10.5px]">
            Hanya gaya nyata: ΣF_nyata = m · a
          </text>

          <rect x="292" y="16" width="252" height="168" rx="8" fill="#FFFFFF" stroke="#93C5FD" />
          <text x="418" y="38" textAnchor="middle" className="fill-[#1D4ED8] text-[12px] font-bold">
            Pengamat di Kereta (Non-Inersia)
          </text>
          <line x1="312" y1="150" x2="522" y2="150" stroke="#64748B" strokeWidth="1.8" />
          <rect x="388" y="102" width="60" height="44" rx="4" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
          <line x1="384" y1="124" x2="328" y2="124" stroke="#DC2626" strokeWidth="2.5" markerEnd="url(#tvRed)" />
          <text x="355" y="114" textAnchor="middle" className="fill-[#DC2626] text-[11px] font-bold">F_fiktif = −ma</text>
          <text x="418" y="170" textAnchor="middle" className="fill-slate-600 text-[10.5px]">
            Diam relatif: ΣF_nyata − ma = 0
          </text>
        </svg>
      )}

      {(visualType === 'pseudo_force_vector' || visualType === 'fbd_m1_m2') && (
        <FreeBodyDiagramSVG
          bare
          config={{
            frameDescription: 'Diagram Gaya Lengkap Sistem Soal Nomor 5 (a = 1,1g ke kanan)',
            axesDescription: 'Proyeksi vektor gaya berat, normal, tegangan tali, dan gaya fiktif',
            alphaDeg: 36.87,
            betaDeg: 58.58,
            forcesM1: [
              { symbol: 'm₁g', label: 'Berat m₁ ke bawah', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
              { symbol: 'N₁', label: 'Normal N₁ = m₁(g cos α + a sin α)', angleDeg: 53.13, color: '#059669', magnitudeScale: 1.4 },
              { symbol: '1,1 m₁g', label: 'Gaya fiktif ke kiri', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.0 },
              { symbol: 'T', label: 'Tegangan tali (0,28 mg)', angleDeg: 323.13, color: '#D97706', magnitudeScale: 0.45 },
            ],
            forcesM2: [
              { symbol: 'm₂g', label: 'Berat m₂ ke bawah', angleDeg: 270, color: '#DC2626', magnitudeScale: 0.9 },
              { symbol: 'N₂', label: 'Normal N₂ = m₂(g cos β + a sin β)', angleDeg: 31.42, color: '#059669', magnitudeScale: 1.4 },
              { symbol: '1,1 m₂g', label: 'Gaya fiktif ke kiri', angleDeg: 180, color: '#2563EB', magnitudeScale: 1.0 },
              { symbol: 'T', label: 'Tegangan tali (0,28 mg)', angleDeg: 121.42, color: '#D97706', magnitudeScale: 0.45 },
            ],
            extraNote: 'Kedua diagram memperlihatkan kesetimbangan gaya di sumbu sejajar dan tegak lurus bidang.',
          }}
        />
      )}

      {visualType === 'pulley_constraint' && (
        <svg viewBox="0 0 560 190" className="w-full h-auto rounded-lg bg-[#F8FAFC] border border-slate-100">
          <defs>
            <marker id="pArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,1 L7,3.5 L0,6 Z" fill="#D97706" />
            </marker>
          </defs>
          <polyline points="80,150 270,65 440,165" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
          <circle cx="270" cy="56" r="14" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
          <line x1="150" y1="108" x2="262" y2="44" stroke="#D97706" strokeWidth="2.2" />
          <line x1="281" y1="47" x2="380" y2="120" stroke="#D97706" strokeWidth="2.2" />
          <line x1="190" y1="85" x2="235" y2="60" stroke="#D97706" strokeWidth="2.5" markerEnd="url(#pArrow)" />
          <line x1="345" y1="95" x2="305" y2="65" stroke="#D97706" strokeWidth="2.5" markerEnd="url(#pArrow)" />
          <text x="196" y="66" className="fill-[#B45309] text-[11px] font-bold">T₁ = T</text>
          <text x="330" y="68" className="fill-[#B45309] text-[11px] font-bold">T₂ = T</text>
          <text x="270" y="172" textAnchor="middle" className="fill-[#0B193C] text-[11.5px] font-semibold">
            Kendala Tali Tak Mulur: s₁ + s₂ = L  ⇒  Δs₁ = −Δs₂  dan  T₁ = T₂ = T
          </text>
        </svg>
      )}

      {(visualType === 'tension_vs_accel' || visualType === 'normal_graph') && (
        <svg viewBox="0 0 560 210" className="w-full h-auto rounded-lg bg-[#F8FAFC] border border-slate-100">
          {/* Quantitative plot for α=36.87°, β=53.13°, m1=m2=m */}
          <line x1="65" y1="170" x2="515" y2="170" stroke="#334155" strokeWidth="1.8" />
          <line x1="65" y1="20" x2="65" y2="170" stroke="#334155" strokeWidth="1.8" />
          {/* Grid */}
          {[0.5, 1.0, 1.5].map((yVal) => {
            const y = 170 - yVal * 85;
            return (
              <g key={yVal}>
                <line x1="65" y1={y} x2="515" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                <text x="56" y={y + 4} textAnchor="end" className="fill-slate-500 text-[10px] font-mono-tabular">
                  {yVal.toFixed(1).replace('.', ',')}
                </text>
              </g>
            );
          })}
          {[0.5, 1.0, 1.5].map((xVal) => {
            const x = 65 + (xVal / 1.6) * 430;
            return (
              <g key={xVal}>
                <line x1={x} y1="20" x2={x} y2="170" stroke="#E2E8F0" strokeDasharray="3 3" />
                <text x={x} y="185" textAnchor="middle" className="fill-slate-500 text-[10px] font-mono-tabular">
                  {xVal.toFixed(1).replace('.', ',')}g
                </text>
              </g>
            );
          })}
          {/* N1/mg = 0.8 + 0.6*(a/g) */}
          <line
            x1={65}
            y1={170 - 0.8 * 85}
            x2={65 + (1.5 / 1.6) * 430}
            y2={170 - 1.7 * 85}
            stroke="#059669"
            strokeWidth="2.4"
          />
          {/* T1/mg = 0.8*(a/g) - 0.6 */}
          <line
            x1={65 + (0.75 / 1.6) * 430}
            y1={170}
            x2={65 + (1.5 / 1.6) * 430}
            y2={170 - 0.6 * 85}
            stroke="#2563EB"
            strokeWidth="2.4"
          />
          {/* T2/mg = 0.8 - 0.6*(a/g) */}
          <line
            x1={65}
            y1={170 - 0.8 * 85}
            x2={65 + (4 / 3 / 1.6) * 430}
            y2={170}
            stroke="#D97706"
            strokeWidth="2.4"
          />
          {/* Equilibrium intersection at a=1.0g, T/mg=0.2 */}
          <circle cx={65 + (1.0 / 1.6) * 430} cy={170 - 0.2 * 85} r="4.5" fill="#0B193C" />
          <text x={65 + (1.0 / 1.6) * 430 + 8} y={170 - 0.2 * 85 - 6} className="fill-[#0B193C] text-[10.5px] font-bold">
            Setimbang (1,0g; 0,2mg)
          </text>
          <text x="150" y="38" className="fill-[#059669] text-[10.5px] font-bold">N₁ / mg = 0,8 + 0,6(a/g)</text>
          <text x="360" y="106" className="fill-[#2563EB] text-[10.5px] font-bold">T₁/mg (naik)</text>
          <text x="105" y="138" className="fill-[#D97706] text-[10.5px] font-bold">T₂/mg (turun)</text>
          <text x="290" y="200" textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">
            Percepatan Kereta a / g
          </text>
        </svg>
      )}

      {visualType === 'stability_bounds' && (
        <svg viewBox="0 0 560 170" className="w-full h-auto rounded-lg bg-[#F8FAFC] border border-slate-100">
          <line x1="40" y1="95" x2="520" y2="95" stroke="#0B193C" strokeWidth="2" />
          {/* Zones */}
          <rect x="40" y="65" width="110" height="22" fill="#FEE2E2" rx="3" />
          <text x="95" y="80" textAnchor="middle" className="fill-[#991B1B] text-[10px] font-bold">Lepas Kontak (N=0)</text>

          <rect x="154" y="65" width="140" height="22" fill="#FEF3C7" rx="3" />
          <text x="224" y="80" textAnchor="middle" className="fill-[#92400E] text-[10px] font-bold">Tali Kendor / Selip</text>

          <rect x="298" y="65" width="120" height="22" fill="#DBEAFE" rx="3" />
          <text x="358" y="80" textAnchor="middle" className="fill-[#1E40AF] text-[10px] font-bold">Zona Tegang (T ≥ 0)</text>

          <rect x="422" y="65" width="98" height="22" fill="#E0F2FE" rx="3" />
          <text x="471" y="80" textAnchor="middle" className="fill-[#0369A1] text-[10px] font-bold">Selip Naik (a_rel&gt;0)</text>

          {/* Ticks */}
          <circle cx="152" cy="95" r="4" fill="#DC2626" />
          <text x="152" y="114" textAnchor="middle" className="fill-[#991B1B] text-[10px] font-mono-tabular">−g cot β</text>

          <circle cx="250" cy="95" r="4" fill="#0B193C" />
          <text x="250" y="114" textAnchor="middle" className="fill-[#0B193C] text-[10px] font-mono-tabular">0</text>

          <circle cx="298" cy="95" r="4" fill="#2563EB" />
          <text x="298" y="114" textAnchor="middle" className="fill-[#1D4ED8] text-[10px] font-mono-tabular">g tan α</text>

          <circle cx="358" cy="95" r="5" fill="#059669" />
          <text x="358" y="130" textAnchor="middle" className="fill-[#059669] text-[10.5px] font-bold">a_eq (Soal 5)</text>

          <circle cx="418" cy="95" r="4" fill="#2563EB" />
          <text x="418" y="114" textAnchor="middle" className="fill-[#1D4ED8] text-[10px] font-mono-tabular">g tan β</text>
        </svg>
      )}

      {visualType === 'recoil_momentum' && (
        <svg viewBox="0 0 560 185" className="w-full h-auto rounded-lg bg-[#F8FAFC] border border-slate-100">
          <defs>
            <marker id="recBlue" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,1 L7,3.5 L0,6 Z" fill="#2563EB" />
            </marker>
            <marker id="recAmber" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,1 L7,3.5 L0,6 Z" fill="#D97706" />
            </marker>
          </defs>
          <line x1="30" y1="155" x2="530" y2="155" stroke="#334155" strokeWidth="2" />
          <line x1="280" y1="20" x2="280" y2="165" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="286" y="32" className="fill-slate-600 text-[10.5px] font-semibold">X_CM = konstan</text>

          <polygon points="150,136 150,70 250,70 350,136" fill="#DBEAFE" stroke="#1E3A8A" strokeWidth="2" />
          <circle cx="180" cy="145" r="9" fill="#FFF" stroke="#1E3A8A" strokeWidth="2" />
          <circle cx="320" cy="145" r="9" fill="#FFF" stroke="#1E3A8A" strokeWidth="2" />

          <line x1="145" y1="108" x2="85" y2="108" stroke="#2563EB" strokeWidth="2.5" markerEnd="url(#recBlue)" />
          <text x="115" y="98" textAnchor="middle" className="fill-[#2563EB] text-[11px] font-bold">a_M (kiri)</text>

          <line x1="295" y1="90" x2="345" y2="122" stroke="#D97706" strokeWidth="2.5" markerEnd="url(#recAmber)" />
          <text x="360" y="102" className="fill-[#B45309] text-[11px] font-bold">a_rel (kanan-bawah)</text>
        </svg>
      )}

      {visualType === 'energy_work' && (
        <svg viewBox="0 0 560 185" className="w-full h-auto rounded-lg bg-[#F8FAFC] border border-slate-100">
          <defs>
            <marker id="ewRed" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,1 L7,3.5 L0,6 Z" fill="#DC2626" />
            </marker>
            <marker id="ewBlue" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,1 L7,3.5 L0,6 Z" fill="#2563EB" />
            </marker>
            <marker id="ewNavy" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,1 L7,3.5 L0,6 Z" fill="#0B193C" />
            </marker>
          </defs>
          <circle cx="240" cy="45" r="7" fill="#0B193C" />
          <line x1="240" y1="45" x2="240" y2="135" stroke="#DC2626" strokeWidth="2.2" markerEnd="url(#ewRed)" />
          <line x1="240" y1="45" x2="140" y2="45" stroke="#2563EB" strokeWidth="2.2" markerEnd="url(#ewBlue)" />
          <line x1="240" y1="45" x2="140" y2="135" stroke="#0B193C" strokeWidth="2.8" markerEnd="url(#ewNavy)" />
          <line x1="140" y1="45" x2="140" y2="135" stroke="#CBD5E1" strokeDasharray="3 3" />
          <line x1="240" y1="135" x2="140" y2="135" stroke="#CBD5E1" strokeDasharray="3 3" />
          <text x="250" y="96" className="fill-[#DC2626] text-[11px] font-bold">g (ke bawah)</text>
          <text x="190" y="36" textAnchor="middle" className="fill-[#2563EB] text-[11px] font-bold">−a (fiktif)</text>
          <text x="155" y="156" className="fill-[#0B193C] text-[11.5px] font-bold">
            g_eff = √(g² + a²) → Medan Konservatif
          </text>
        </svg>
      )}

      <figcaption className="mt-2.5 text-xs leading-relaxed text-slate-600">{caption}</figcaption>
    </figure>
  );
};
