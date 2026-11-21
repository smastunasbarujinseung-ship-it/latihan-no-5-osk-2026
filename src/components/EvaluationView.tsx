import React from 'react';
import { Award, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { EvaluationSummary, SubmissionRecord } from '../logic/physicsSolver';
import { PROBLEMS } from '../data/problems';

interface EvaluationViewProps {
  summary: EvaluationSummary;
  submissions: Record<number, SubmissionRecord>;
  onSelectProblem: (id: number, tab: 'latihan' | 'pembahasan') => void;
  onResetProgress: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  summary,
  submissions,
  onSelectProblem,
  onResetProgress,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB]">Laporan Evaluasi &amp; Analisis Kompetensi</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0B193C] sm:text-3xl">
            Evaluasi Penguasaan Materi Soal Nomor 5
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Ringkasan hasil latihan 15 soal numerik serta rekomendasi belajar dari Mister Jo.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetProgress}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset Progres Latihan
        </button>
      </div>

      {/* Main Scoreboard Metrics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-[#0B193C] to-[#1D4ED8] p-5 text-white">
          <p className="text-xs font-medium text-sky-200">Skor Akhir &amp; Penguasaan</p>
          <p className="mt-1 font-mono-tabular text-3xl font-extrabold">{summary.scorePercent}%</p>
          <p className="mt-1 text-xs text-sky-100">{summary.competencyLevel}</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Jawaban Benar</p>
          <p className="mt-1 font-mono-tabular text-3xl font-bold text-[#059669]">
            {summary.correctCount}
          </p>
          <p className="mt-1 text-xs text-slate-600">dari 15 soal latihan</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Jawaban Salah</p>
          <p className="mt-1 font-mono-tabular text-3xl font-bold text-[#DC2626]">
            {summary.wrongCount}
          </p>
          <p className="mt-1 text-xs text-slate-600">dapat diperbaiki di Mode Latihan</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Belum Dikerjakan</p>
          <p className="mt-1 font-mono-tabular text-3xl font-bold text-[#0B193C]">
            {summary.unansweredCount}
          </p>
          <p className="mt-1 text-xs text-slate-600">soal menanti diselesaikan</p>
        </div>
      </section>

      {/* Tier-by-Tier Competency Analysis */}
      <section className="rounded-2xl border border-blue-100 bg-white p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#0B193C]">Analisis Kompetensi per Tingkat Kesulitan</h2>
        <div className="space-y-4">
          {summary.tierStats.map((stat) => (
            <div key={stat.tier} className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#0B193C]">{stat.label}</span>
                <span className="font-mono-tabular text-slate-600">
                  Benar {stat.correct}/{stat.total} ({stat.accuracyPercent}%)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
                  style={{ width: `${stat.accuracyPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="rounded-2xl border border-blue-200 bg-[#EFF6FF] p-6 space-y-3">
        <div className="flex items-center gap-2 text-[#1D4ED8]">
          <Award className="h-5 w-5" aria-hidden="true" />
          <h2 className="text-lg font-bold text-[#0B193C]">Rekomendasi Materi Pembinaan Mister Jo</h2>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-slate-700">
          {summary.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </section>

      {/* Per-Problem Diagnostic Table */}
      <section className="rounded-2xl border border-blue-100 bg-white p-6 space-y-4 overflow-x-auto">
        <h2 className="text-lg font-bold text-[#0B193C]">Rincian Status 15 Soal</h2>
        <table className="w-full min-w-[600px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2.5 pr-4 font-semibold">No</th>
              <th className="py-2.5 pr-4 font-semibold">Judul &amp; Subtopik</th>
              <th className="py-2.5 pr-4 font-semibold">Jawaban Anda</th>
              <th className="py-2.5 pr-4 font-semibold">Status</th>
              <th className="py-2.5 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PROBLEMS.map((p) => {
              const sub = submissions[p.id];
              return (
                <tr key={p.id}>
                  <td className="py-3 pr-4 font-mono-tabular font-bold text-[#0B193C]">{p.id}</td>
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-[#0B193C]">{p.title}</p>
                    <p className="text-slate-500">{p.tierLabel}</p>
                  </td>
                  <td className="py-3 pr-4 font-mono-tabular text-slate-700">
                    {sub ? `${sub.rawInput} ${p.unitLabel}` : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    {sub ? (
                      sub.isCorrect ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#059669]">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Benar
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#DC2626]">
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          Salah
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400">Belum dikerjakan</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectProblem(p.id, sub ? 'pembahasan' : 'latihan')}
                      className="inline-flex items-center gap-1 font-semibold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      {sub ? 'Tinjau' : 'Kerjakan'}
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};
