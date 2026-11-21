import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { MathText } from './MathText';
import { ProblemStimulusSVG } from './PhysicsStimulusSVG';
import { SolutionExplorer } from './SolutionExplorer';

interface DiscussionViewProps {
  activeProblemId: number;
  onChangeProblem: (id: number) => void;
}

export const DiscussionView: React.FC<DiscussionViewProps> = ({
  activeProblemId,
  onChangeProblem,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(activeProblemId);
  const selected = PROBLEMS.find((p) => p.id === activeProblemId) ?? PROBLEMS[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[#2563EB]">Pembahasan Ilmiah &amp; Animasi Pembuktian</p>
        <h1 className="mt-1 text-2xl font-bold text-[#0B193C] sm:text-3xl">
          Pembahasan Lengkap 15 Soal Pengembangan Soal Nomor 5
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Pilih soal di bawah ini untuk membuka pembahasan 10 tahap, Free Body Diagram, rumus utama, simulasi animasi Fisika, dan narator suara.
        </p>
      </div>

      {/* Quick Problem Selector */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-blue-100 bg-white p-4">
        {PROBLEMS.map((p) => {
          const isCurrent = p.id === selected.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onChangeProblem(p.id);
                setExpandedId(p.id);
              }}
              className={`rounded-lg px-3 py-1.5 font-mono-tabular text-xs font-semibold transition-colors cursor-pointer ${
                isCurrent
                  ? 'bg-[#2563EB] text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-[#EFF6FF]'
              }`}
            >
              Soal {p.id}
            </button>
          );
        })}
      </div>

      {/* Collapsible Card for Selected Problem */}
      <div className="rounded-2xl border border-blue-200 bg-white p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#2563EB]">
              Soal {selected.id} · Level {selected.tier} ({selected.tierLabel})
            </span>
            <h2 className="text-xl font-bold text-[#0B193C]">{selected.title}</h2>
          </div>

          <button
            type="button"
            aria-expanded={expandedId === selected.id}
            onClick={() => setExpandedId(expandedId === selected.id ? null : selected.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#2563EB] bg-[#EFF6FF] px-4 py-2 text-xs font-bold text-[#1D4ED8] hover:bg-blue-100 cursor-pointer whitespace-nowrap shrink-0"
          >
            {expandedId === selected.id ? (
              <>
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
                TUTUP PEMBAHASAN
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                LIHAT PEMBAHASAN
              </>
            )}
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-12 items-start">
          <div className="lg:col-span-6 rounded-xl border border-blue-100 bg-[#F8FAFC] p-4 text-sm leading-relaxed text-[#0B193C]">
            <MathText text={selected.questionText} />
          </div>
          <div className="lg:col-span-6">
            <ProblemStimulusSVG config={selected.stimulus} problemId={selected.id} />
          </div>
        </div>

        {expandedId === selected.id && (
          <div className="border-t border-slate-100 pt-5">
            <SolutionExplorer problem={selected} />
          </div>
        )}
      </div>
    </div>
  );
};
