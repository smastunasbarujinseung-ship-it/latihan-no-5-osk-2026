import React, { useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { CONCEPT_NODES, ConceptNode } from '../data/theory';
import { MathText } from './MathText';
import { NavTab } from './HomeView';

interface ConceptMapViewProps {
  onNavigate: (tab: NavTab) => void;
}

const CATEGORY_LABEL: Record<ConceptNode['category'], string> = {
  prasyarat: '1. Pengetahuan Prasyarat',
  inti: '2. Konsep Inti Soal Nomor 5',
  pengembangan: '3. Konsep Pengembangan & Pengayaan OSK',
};

export const ConceptMapView: React.FC<ConceptMapViewProps> = ({ onNavigate }) => {
  const [selectedId, setSelectedId] = useState<string>('kesetimbangan-relatif');
  const selectedNode = CONCEPT_NODES.find((n) => n.id === selectedId) ?? CONCEPT_NODES[0];

  const grouped: Record<ConceptNode['category'], ConceptNode[]> = {
    prasyarat: CONCEPT_NODES.filter((n) => n.category === 'prasyarat'),
    inti: CONCEPT_NODES.filter((n) => n.category === 'inti'),
    pengembangan: CONCEPT_NODES.filter((n) => n.category === 'pengembangan'),
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB]">Peta Hubungan Materi</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0B193C] sm:text-3xl">
            Peta Konsep Dinamika Kerangka Non-Inersia (Soal Nomor 5)
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Klik setiap simpul konsep untuk menelaah keterkaitannya dari prasyarat hingga tantangan OSK.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('teori')}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer whitespace-nowrap shrink-0"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          Buka Bab Teori
        </button>
      </div>

      {/* Selected Node Detail Spotlight */}
      <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-[#EFF6FF] to-white p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#1D4ED8]">
            {CATEGORY_LABEL[selectedNode.category]}
          </span>
          <span className="text-xs text-slate-500">
            Terhubung ke {selectedNode.connectsTo.length} konsep lanjutan
          </span>
        </div>

        <h2 className="text-xl font-bold text-[#0B193C]">{selectedNode.title}</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          <MathText text={selectedNode.summary} />
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {selectedNode.equations.map((eq, idx) => (
            <div key={idx} className="rounded-xl border border-blue-200 bg-white px-4 py-2.5">
              <MathText text={eq} block />
            </div>
          ))}
        </div>

        {selectedNode.connectsTo.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-semibold text-slate-600">Mengarah ke:</span>
            {selectedNode.connectsTo.map((targetId) => {
              const target = CONCEPT_NODES.find((c) => c.id === targetId);
              if (!target) return null;
              return (
                <button
                  key={targetId}
                  type="button"
                  onClick={() => setSelectedId(targetId)}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1 font-semibold text-[#2563EB] hover:bg-blue-50 cursor-pointer"
                >
                  {target.title}
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 3-Tier Interactive Hierarchy Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {(['prasyarat', 'inti', 'pengembangan'] as ConceptNode['category'][]).map((cat) => (
          <div key={cat} className="rounded-2xl border border-blue-100 bg-white p-5 space-y-3">
            <h3 className="border-b border-slate-100 pb-2 text-sm font-bold text-[#0B193C]">
              {CATEGORY_LABEL[cat]}
            </h3>
            <div className="space-y-2.5">
              {grouped[cat].map((node) => {
                const isSelected = node.id === selectedId;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedId(node.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#0B193C]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-sm font-bold text-[#0B193C]">{node.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      <MathText text={node.summary} />
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
