import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Send,
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { MathText } from './MathText';
import { ProblemStimulusSVG } from './PhysicsStimulusSVG';
import { NarratorBar } from './NarratorBar';
import { SolutionExplorer } from './SolutionExplorer';
import { parseIndonesianNumber, SubmissionRecord } from '../logic/physicsSolver';

interface PracticeViewProps {
  activeProblemId: number;
  onChangeProblem: (id: number) => void;
  submissions: Record<number, SubmissionRecord>;
  onSubmitAnswer: (problemId: number, rawInput: string) => { isCorrect: boolean; valid: boolean };
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  activeProblemId,
  onChangeProblem,
  submissions,
  onSubmitAnswer,
}) => {
  const problem = PROBLEMS.find((p) => p.id === activeProblemId) ?? PROBLEMS[0];
  const existingSub = submissions[problem.id];

  const [inputValue, setInputValue] = useState<string>(existingSub?.rawInput ?? '');
  const [validationMsg, setValidationMsg] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Sync input and collapse solution by default whenever problem changes
  useEffect(() => {
    const sub = submissions[problem.id];
    setInputValue(sub?.rawInput ?? '');
    setValidationMsg('');
    setShowSolution(false);
  }, [problem.id]);

  const attemptedCount = Object.keys(submissions).length;
  const progressPct = Math.round((attemptedCount / PROBLEMS.length) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseIndonesianNumber(inputValue);
    if (!parsed.valid) {
      setValidationMsg('Masukkan angka numerik yang valid (gunakan koma atau titik, contoh: 12,5 atau -3,4).');
      return;
    }
    setValidationMsg('');
    onSubmitAnswer(problem.id, inputValue);
  };

  return (
    <div className="space-y-6">
      {/* Top Progress Bar & 15-Number Navigator */}
      <section className="rounded-2xl border border-blue-100 bg-white p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#0B193C]">
            Progres Latihan: {attemptedCount} / {PROBLEMS.length} Soal Dikerjakan
          </span>
          <span className="font-mono-tabular font-semibold text-[#2563EB]">{progressPct}%</span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] transition-transform duration-300 origin-left"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5" role="navigation" aria-label="Navigasi nomor soal 1 sampai 15">
          {PROBLEMS.map((p) => {
            const sub = submissions[p.id];
            const isActive = p.id === problem.id;
            let statusClass = 'border-slate-200 bg-white text-slate-700 hover:bg-blue-50';
            if (sub?.isCorrect) {
              statusClass = 'border-emerald-300 bg-emerald-50 text-emerald-800';
            } else if (sub && !sub.isCorrect) {
              statusClass = 'border-red-300 bg-red-50 text-red-800';
            }
            if (isActive) {
              statusClass = 'border-[#2563EB] bg-[#2563EB] text-white font-bold';
            }

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChangeProblem(p.id)}
                aria-label={`Pilih Soal ${p.id}${sub ? (sub.isCorrect ? ' (Benar)' : ' (Salah)') : ' (Belum dikerjakan)'}`}
                className={`h-9 w-9 rounded-lg border font-mono-tabular text-xs font-semibold transition-colors cursor-pointer ${statusClass}`}
              >
                {p.id}
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Problem Workspace */}
      <article className="rounded-2xl border border-blue-100 bg-white p-6 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-[#2563EB]">Soal {problem.id} dari 15</span>
              <span aria-hidden="true">·</span>
              <span>Level {problem.tier}: {problem.tierLabel}</span>
              <span aria-hidden="true">·</span>
              <span>Isian Singkat Numerik</span>
            </div>
            <h1 className="mt-1 text-xl font-bold text-[#0B193C] sm:text-2xl">
              {problem.title}
            </h1>
          </div>
        </div>

        {/* Question & Stimulus Split */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-blue-100 bg-[#F8FAFC] p-5 text-[15px] leading-relaxed text-[#0B193C]">
              <MathText text={problem.questionText} />
            </div>

            <NarratorBar
              title={`Pembacaan Soal & Stimulus ${problem.id}`}
              script={problem.narrator.soalDanStimulus}
              compact
            />

            {/* Numeric Answer Submission Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-blue-200 bg-[#EFF6FF]/60 p-5 space-y-3"
            >
              <label
                htmlFor={`answer-input-${problem.id}`}
                className="block text-sm font-bold text-[#0B193C]"
              >
                Masukkan Jawaban Numerik (1 angka desimal, satuan: {problem.unitLabel})
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  id={`answer-input-${problem.id}`}
                  type="text"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Contoh: 12,5"
                  className="w-48 rounded-lg border border-blue-300 bg-white px-4 py-2.5 font-mono-tabular text-base font-semibold text-[#0B193C] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <span className="text-sm font-semibold text-slate-600">{problem.unitLabel}</span>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {existingSub ? 'Perbaiki Jawaban' : 'Kirim Jawaban'}
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Sistem menerima tanda koma (,) maupun titik (.) dan membandingkan pembulatan tepat satu angka di belakang koma.
              </p>

              {validationMsg && (
                <p role="alert" className="text-xs font-semibold text-[#DC2626]">
                  {validationMsg}
                </p>
              )}

              {existingSub && !validationMsg && (
                <div
                  role="status"
                  className={`mt-2 flex items-start gap-2.5 rounded-lg border p-3.5 text-sm ${
                    existingSub.isCorrect
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-red-300 bg-red-50 text-red-900'
                  }`}
                >
                  {existingSub.isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#DC2626]" aria-hidden="true" />
                  )}
                  <div>
                    {existingSub.isCorrect ? (
                      <>
                        <p className="font-bold">Jawaban Benar! ({problem.answerFormatted} {problem.unitLabel})</p>
                        <p className="mt-0.5 text-xs">
                          Pembulatan satu angka desimal Anda sesuai dengan perhitungan fisika eksak. Silakan buka pembahasan untuk melihat animasi pembuktian.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold">Jawaban Masih Kurang Tepat (Percobaan ke-{existingSub.attempts})</p>
                        <p className="mt-0.5 text-xs">
                          Jawaban Anda ({existingSub.rawInput}) belum sesuai. Periksa kembali arah proyeksi gaya fiktif, tanda kesetimbangan, dan pembulatan satu desimal, lalu coba kirim lagi atau buka pembahasan di bawah.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-6">
            <ProblemStimulusSVG config={problem.stimulus} problemId={problem.id} />
          </div>
        </div>

        {/* Collapsible Solution Toggle [LIHAT PEMBAHASAN] */}
        <div className="border-t border-slate-100 pt-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              aria-expanded={showSolution}
              onClick={() => setShowSolution((s) => !s)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2563EB] bg-[#EFF6FF] px-5 py-3 text-sm font-bold text-[#1D4ED8] transition-colors hover:bg-blue-100 cursor-pointer whitespace-nowrap shrink-0"
            >
              {showSolution ? (
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={problem.id <= 1}
                onClick={() => onChangeProblem(problem.id - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B193C] hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Soal Sebelumnya
              </button>
              <button
                type="button"
                disabled={problem.id >= PROBLEMS.length}
                onClick={() => onChangeProblem(problem.id + 1)}
                className="inline-flex items-center gap-1 rounded-lg bg-[#0B193C] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1E293B] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                Soal Berikutnya
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {showSolution && (
            <div className="rounded-2xl border border-blue-200 bg-[#F8FAFC] p-5">
              <SolutionExplorer problem={problem} />
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
