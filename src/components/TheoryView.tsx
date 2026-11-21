import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { THEORY_SECTIONS } from '../data/theory';
import { MathText } from './MathText';
import { NarratorBar } from './NarratorBar';
import { TheoryVisualDiagram } from './PhysicsStimulusSVG';
import { NavTab } from './HomeView';

interface TheoryViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const TheoryView: React.FC<TheoryViewProps> = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const current = THEORY_SECTIONS[activeIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB]">Belajar Teori · Buku Teks Olimpiade Fisika</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0B193C] sm:text-3xl">
            Dinamika Kerangka Non-Inersia &amp; Sistem Terkopel Soal Nomor 5
          </h1>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('latihan')}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer whitespace-nowrap shrink-0"
        >
          Mulai Latihan 15 Soal
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Chapter Index Sidebar */}
        <aside className="lg:col-span-4 rounded-2xl border border-blue-100 bg-white p-4 h-fit">
          <p className="mb-3 px-2 text-xs font-bold text-[#0B193C]">
            Daftar 15 Subbab Materi
          </p>
          <nav aria-label="Daftar subbab teori" className="space-y-1">
            {THEORY_SECTIONS.map((sec, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] font-semibold text-white'
                      : 'text-slate-700 hover:bg-[#EFF6FF] hover:text-[#0B193C]'
                  }`}
                >
                  {sec.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active Textbook Chapter Content */}
        <article className="lg:col-span-8 space-y-5">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <p className="text-xs font-semibold text-[#2563EB]">
                Subbab {current.number} dari {THEORY_SECTIONS.length}
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#0B193C] sm:text-2xl">
                {current.title}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{current.subtitle}</p>
            </div>

            <NarratorBar
              title={current.title}
              script={current.narratorScript}
            />

            <div className="space-y-3 text-[15px] leading-relaxed text-slate-700">
              {current.content.map((para, idx) => (
                <p key={idx}>
                  <MathText text={para} />
                </p>
              ))}
            </div>

            {current.formulaCard && (
              <div className="rounded-xl border border-blue-300 bg-gradient-to-br from-[#0B193C] to-[#1E3A8A] p-5 text-white">
                <p className="text-xs font-semibold tracking-wider text-sky-300">
                  {current.formulaCard.label}
                </p>
                <div className="my-3 rounded-lg bg-white/10 px-4 py-3 text-white">
                  <MathText text={current.formulaCard.latex} block />
                </div>
                <div className="grid gap-2 sm:grid-cols-2 text-xs">
                  {current.formulaCard.variables.map((v, idx) => (
                    <div key={idx} className="rounded-lg bg-white/10 px-3 py-2">
                      <span className="font-semibold text-white">
                        <MathText text={`$${v.symbol}$`} />
                      </span>{' '}
                      <span className="font-mono-tabular text-sky-200">[{v.unit}]</span>
                      <p className="mt-0.5 text-blue-100">{v.meaning}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-sky-200">
                  Syarat keberlakuan: {current.formulaCard.condition}
                </p>
              </div>
            )}

            <TheoryVisualDiagram
              visualType={current.visualType}
              caption={current.visualCaption}
            />

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-[#0B193C] hover:bg-blue-50 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Subbab Sebelumnya
              </button>

              <button
                type="button"
                disabled={activeIndex === THEORY_SECTIONS.length - 1}
                onClick={() => setActiveIndex((i) => Math.min(THEORY_SECTIONS.length - 1, i + 1))}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                Subbab Berikutnya
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
