import React from 'react';
import { ArrowRight, BookOpen, Compass, Layers, CheckCircle2 } from 'lucide-react';
import { MathText } from './MathText';
import { SOURCE_PROBLEM_5 } from '../data/theory';
import { ProblemStimulusSVG } from './PhysicsStimulusSVG';
import { EvaluationSummary } from '../logic/physicsSolver';

export type NavTab =
  | 'beranda'
  | 'peta-konsep'
  | 'teori'
  | 'bank-soal'
  | 'latihan'
  | 'pembahasan'
  | 'evaluasi';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  summary: EvaluationSummary;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, summary }) => {
  return (
    <div className="space-y-10">
      {/* Hero Split Section */}
      <section className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-[#0B193C] via-[#132C6C] to-[#1D4ED8] p-6 sm:p-10 text-white shadow-sm">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs font-medium tracking-wide text-sky-200">
              <span>Pembinaan Olimpiade Sains Nasional Tingkat Kota</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Guru Pembimbing: Mister Jo</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
              DISCO BLUE PHYSICS OLYMPIAD
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-blue-100">
              Platform pembinaan intensif yang dirancang khusus untuk membedah, memperdalam, dan
              menguasai seluruh variasi konsep <strong className="text-white">Soal Nomor 5 OSK Fisika SMA 2026</strong> —
              dinamika sistem dua massa terkopel pada kerangka kereta yang dipercepat horizontal.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('teori')}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0B193C] transition-colors hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer whitespace-nowrap shrink-0"
              >
                <BookOpen className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                Mulai Belajar Teori
              </button>

              <button
                type="button"
                onClick={() => onNavigate('latihan')}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-300/60 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 cursor-pointer whitespace-nowrap shrink-0"
              >
                Langsung Kerjakan 15 Soal
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-white/20 bg-white/95 p-4 text-[#0B193C]">
              <p className="mb-2 text-xs font-semibold text-[#1D4ED8]">
                Acuan Utama · Soal Nomor 5 OSK 2026
              </p>
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
                  frictionNote: 'Sistem tanpa gesekan; katrol & tali tak bermassa',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Strip */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-100 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Total Soal Pengembangan</p>
          <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#0B193C]">15 Soal</p>
          <p className="mt-1 text-xs text-slate-600">5 tingkat kesulitan bertahap</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Progres Dikerjakan</p>
          <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#2563EB]">
            {summary.attemptedCount} / 15
          </p>
          <p className="mt-1 text-xs text-slate-600">Input isian singkat numerik</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Persentase Penguasaan</p>
          <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#059669]">
            {summary.masteryPercent}%
          </p>
          <p className="mt-1 text-xs text-slate-600">{summary.competencyLevel}</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Fitur Pembuktian</p>
          <p className="mt-1 text-lg font-bold text-[#0B193C]">Animasi &amp; Narator</p>
          <p className="mt-1 text-xs text-slate-600">Simulasi Canvas + Suara ID</p>
        </div>
      </section>

      {/* Deep Source Analysis of Question 5 */}
      <section className="rounded-2xl border border-blue-100 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-semibold text-[#2563EB]">Analisis Dokumen Sumber</p>
            <h2 className="mt-1 text-2xl font-bold text-[#0B193C]">{SOURCE_PROBLEM_5.title}</h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {SOURCE_PROBLEM_5.topic}
          </span>
        </div>

        <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-5 text-sm leading-relaxed text-[#0B193C]">
          <MathText text={SOURCE_PROBLEM_5.statement} />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#0B193C]">Konsep &amp; Hukum Utama</h3>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {SOURCE_PROBLEM_5.analysisChecklist.konsepHukum.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
                  <span><MathText text={item} /></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#0B193C]">Pengetahuan Prasyarat</h3>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {SOURCE_PROBLEM_5.analysisChecklist.prasyarat.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[#0284C7]" aria-hidden="true" />
                  <span><MathText text={item} /></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#0B193C]">Pola Penalaran Olimpiade</h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-700">
              {SOURCE_PROBLEM_5.analysisChecklist.polaPenalaran.map((item, i) => (
                <li key={i}>
                  <MathText text={item} />
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onNavigate('peta-konsep')}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-[#0B193C] hover:bg-blue-50 cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
            Lihat Peta Konsep Lengkap
          </button>
          <button
            type="button"
            onClick={() => onNavigate('bank-soal')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
          >
            Jelajahi Bank 15 Soal
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};
