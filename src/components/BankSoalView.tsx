import React, { useState } from 'react';
import { CheckCircle2, XCircle, Circle, ArrowRight } from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { DifficultyTier, SubmissionRecord } from '../logic/physicsSolver';

interface BankSoalViewProps {
  submissions: Record<number, SubmissionRecord>;
  onSelectProblem: (problemId: number, targetTab: 'latihan' | 'pembahasan') => void;
}

const TIER_FILTERS: Array<{ value: 'all' | DifficultyTier; label: string }> = [
  { value: 'all', label: 'Semua (15)' },
  { value: 1, label: 'Fondasi (1–3)' },
  { value: 2, label: 'Bertahap (4–6)' },
  { value: 3, label: 'Analisis (7–9)' },
  { value: 4, label: 'Menengah-Tinggi (10–12)' },
  { value: 5, label: 'Tantangan OSK (13–15)' },
];

export const BankSoalView: React.FC<BankSoalViewProps> = ({
  submissions,
  onSelectProblem,
}) => {
  const [filter, setFilter] = useState<'all' | DifficultyTier>('all');

  const visibleProblems =
    filter === 'all' ? PROBLEMS : PROBLEMS.filter((p) => p.tier === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB]">Kurikulum Latihan Berjenjang</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0B193C] sm:text-3xl">
            Bank 15 Soal Pengembangan Soal Nomor 5
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Seluruh soal berbentuk isian singkat numerik satu angka di belakang koma (tanda koma desimal).
          </p>
        </div>
      </div>

      {/* Tier Filter Bar (Interactive Buttons) */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-blue-100 bg-white p-1.5">
        {TIER_FILTERS.map((t) => {
          const active = filter === t.value;
          return (
            <button
              key={String(t.value)}
              type="button"
              onClick={() => setFilter(t.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-600 hover:bg-[#EFF6FF] hover:text-[#0B193C]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 15-Problem List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleProblems.map((problem) => {
          const sub = submissions[problem.id];
          return (
            <div
              key={problem.id}
              className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-white p-5 transition-colors hover:border-blue-300"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#1D4ED8]">
                    Soal {problem.id} · {problem.tierLabel}
                  </span>
                  {sub ? (
                    sub.isCorrect ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#059669]">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Benar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#DC2626]">
                        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Perlu Perbaikan
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Circle className="h-3.5 w-3.5" aria-hidden="true" />
                      Belum Dikerjakan
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-[#0B193C] leading-snug">
                  {problem.title}
                </h2>
                <p className="text-xs text-slate-600">{problem.subtopic}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => onSelectProblem(problem.id, 'latihan')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer whitespace-nowrap shrink-0"
                >
                  Kerjakan Soal {problem.id}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectProblem(problem.id, 'pembahasan')}
                  className="text-xs font-semibold text-[#0B193C] hover:text-[#2563EB] cursor-pointer whitespace-nowrap shrink-0"
                >
                  Pembahasan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
