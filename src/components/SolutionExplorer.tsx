import React from 'react';
import { MathText } from './MathText';
import { FreeBodyDiagramSVG } from './PhysicsStimulusSVG';
import { PhysicsProofCanvas } from './PhysicsProofCanvas';
import { NarratorBar } from './NarratorBar';
import { PhysicsProblem } from '../data/problems';

interface SolutionExplorerProps {
  problem: PhysicsProblem;
}

export const SolutionExplorer: React.FC<SolutionExplorerProps> = ({ problem }) => {
  const { solution, fbd, animation, narrator } = problem;

  return (
    <div className="space-y-6" data-testid={`solution-content-${problem.id}`}>
      {/* Narator Pembahasan */}
      <NarratorBar
        title={`Penjelasan Pembahasan Soal ${problem.id}`}
        script={`${narrator.fbdDanKonsep} ${narrator.langkahPembahasan} ${narrator.animasiDanInterpretasi}`}
      />

      {/* Tahap 1 */}
      <section className="rounded-xl border border-blue-100 bg-white p-5 space-y-2">
        <h4 className="text-base font-bold text-[#0B193C]">Tahap 1. Memahami Fenomena</h4>
        <p className="text-sm leading-relaxed text-slate-700">
          <MathText text={solution.tahap1Fenomena} />
        </p>
      </section>

      {/* Tahap 2 */}
      <section className="rounded-xl border border-blue-100 bg-white p-5 space-y-3">
        <h4 className="text-base font-bold text-[#0B193C]">Tahap 2. Mengidentifikasi Informasi</h4>
        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div className="space-y-1.5">
            <p className="font-semibold text-[#1D4ED8]">Diketahui:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              {solution.tahap2Informasi.diketahui.map((item, idx) => (
                <li key={idx}>
                  <MathText text={item} />
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 text-slate-700">
            <div>
              <p className="font-semibold text-[#1D4ED8]">Ditanyakan:</p>
              <p><MathText text={solution.tahap2Informasi.ditanyakan} /></p>
            </div>
            <div>
              <p className="font-semibold text-[#1D4ED8]">Besaran yang harus dicari:</p>
              <p><MathText text={solution.tahap2Informasi.besaranDicari} /></p>
            </div>
            <div>
              <p className="font-semibold text-[#1D4ED8]">Informasi tambahan yang relevan:</p>
              <p><MathText text={solution.tahap2Informasi.informasiTambahan} /></p>
            </div>
          </div>
        </div>
      </section>

      {/* Tahap 3 */}
      <section className="rounded-xl border border-blue-100 bg-white p-5 space-y-2">
        <h4 className="text-base font-bold text-[#0B193C]">Tahap 3. Membuat Model Fisika</h4>
        <p className="text-sm leading-relaxed text-slate-700">
          <MathText text={solution.tahap3Model} />
        </p>
      </section>

      {/* Tahap 4: Diagram dan Visualisasi + FBD */}
      <section className="rounded-xl border border-blue-100 bg-white p-5 space-y-4">
        <div>
          <h4 className="text-base font-bold text-[#0B193C]">Tahap 4. Diagram dan Visualisasi (Free Body Diagram)</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
            <MathText text={solution.tahap4VisualFbd} />
          </p>
        </div>
        <FreeBodyDiagramSVG config={fbd} />
        <NarratorBar
          title={`Narasi Free Body Diagram Soal ${problem.id}`}
          script={narrator.fbdDanKonsep}
          compact
        />
      </section>

      {/* Animasi Pembuktian Fenomena Fisika */}
      <section className="space-y-3">
        <PhysicsProofCanvas problemId={problem.id} params={animation} />
        <NarratorBar
          title={`Narasi Proses Animasi & Interpretasi Soal ${problem.id}`}
          script={narrator.animasiDanInterpretasi}
          compact
        />
      </section>

      {/* Tahap 5 */}
      <section className="rounded-xl border border-blue-100 bg-white p-5 space-y-2">
        <h4 className="text-base font-bold text-[#0B193C]">Tahap 5. Menentukan Prinsip Fisika</h4>
        <p className="text-sm leading-relaxed text-slate-700">
          <MathText text={solution.tahap5Prinsip} />
        </p>
      </section>

      {/* Tahap 6 */}
      <section className="rounded-xl border border-blue-100 bg-white p-5 space-y-4">
        <h4 className="text-base font-bold text-[#0B193C]">Tahap 6. Menurunkan Persamaan</h4>
        <div className="space-y-2 text-sm leading-relaxed text-slate-700">
          {solution.tahap6Penurunan.langkah.map((step, idx) => (
            <p key={idx}>
              <MathText text={step} />
            </p>
          ))}
        </div>

        {/* Highlighted Formula Card */}
        <div className="rounded-xl border border-blue-300 bg-gradient-to-br from-[#0B193C] to-[#1E3A8A] p-5 text-white">
          <p className="text-xs font-semibold tracking-wider text-sky-300">
            {solution.tahap6Penurunan.rumusUtama.judul}
          </p>
          <div className="my-3 rounded-lg bg-white/10 px-4 py-3 text-white">
            <MathText text={solution.tahap6Penurunan.rumusUtama.latex} block />
          </div>
          <div className="mt-3 space-y-2 text-xs text-blue-100">
            <p className="font-semibold text-white">Keterangan Variabel &amp; Kondisi Penerapan:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {solution.tahap6Penurunan.rumusUtama.keterangan.map((k, idx) => (
                <div key={idx} className="rounded-lg bg-white/10 px-3 py-2">
                  <div className="font-semibold text-white">
                    <MathText text={`$${k.simbol}$`} /> · <span className="font-mono-tabular text-sky-200">[{k.satuan}]</span>
                  </div>
                  <p className="mt-0.5 text-blue-100">{k.arti}</p>
                  <p className="mt-0.5 text-[11px] text-sky-200">Kondisi: {k.kondisi}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tahap 7 */}
      <section className="rounded-xl border border-blue-100 bg-white p-5 space-y-2">
        <h4 className="text-base font-bold text-[#0B193C]">Tahap 7. Substitusi dan Perhitungan</h4>
        <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed text-slate-700">
          {solution.tahap7Substitusi.map((step, idx) => (
            <li key={idx}>
              <MathText text={step} />
            </li>
          ))}
        </ol>
      </section>

      {/* Tahap 8 */}
      <section className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-5 space-y-2">
        <h4 className="text-base font-bold text-[#0B193C]">Tahap 8. Hasil Akhir</h4>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-mono-tabular text-3xl font-bold text-[#2563EB]">
            {solution.tahap8HasilAkhir.nilaiFormatKoma}
          </span>
          <span className="text-sm font-semibold text-[#0B193C]">
            {solution.tahap8HasilAkhir.satuan}
          </span>
        </div>
        <p className="text-xs text-slate-600">{solution.tahap8HasilAkhir.catatanPembulatan}</p>
      </section>

      {/* Tahap 9 & Tahap 10 */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-blue-100 bg-white p-5 space-y-2">
          <h4 className="text-base font-bold text-[#0B193C]">Tahap 9. Interpretasi Fisis</h4>
          <p className="text-sm leading-relaxed text-slate-700">
            <MathText text={solution.tahap9Interpretasi} />
          </p>
        </section>

        <section className="rounded-xl border border-blue-100 bg-white p-5 space-y-2">
          <h4 className="text-base font-bold text-[#0B193C]">Tahap 10. Kesimpulan</h4>
          <p className="text-sm leading-relaxed text-slate-700">
            <MathText text={solution.tahap10Kesimpulan} />
          </p>
        </section>
      </div>
    </div>
  );
};
