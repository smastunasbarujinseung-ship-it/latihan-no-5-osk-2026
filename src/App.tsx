import { useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PROBLEMS } from './data/problems';
import {
  computeEvaluationStats,
  isAnswerCorrect,
  parseIndonesianNumber,
  SubmissionRecord,
} from './logic/physicsSolver';
import { HomeView, NavTab } from './components/HomeView';
import { ConceptMapView } from './components/ConceptMapView';
import { TheoryView } from './components/TheoryView';
import { BankSoalView } from './components/BankSoalView';
import { PracticeView } from './components/PracticeView';
import { DiscussionView } from './components/DiscussionView';
import { EvaluationView } from './components/EvaluationView';

const STORAGE_KEY = 'disco_blue_osk_soal5_v1';

const NAV_ITEMS: Array<{ id: NavTab; label: string }> = [
  { id: 'beranda', label: 'BERANDA' },
  { id: 'peta-konsep', label: 'PETA KONSEP' },
  { id: 'teori', label: 'BELAJAR TEORI' },
  { id: 'bank-soal', label: 'BANK 15 SOAL' },
  { id: 'latihan', label: 'MODE LATIHAN' },
  { id: 'pembahasan', label: 'PEMBAHASAN' },
  { id: 'evaluasi', label: 'EVALUASI' },
];

function getInitialTab(): NavTab {
  if (typeof window === 'undefined') return 'beranda';
  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1') {
    return 'latihan';
  }
  const tabParam = params.get('tab') as NavTab | null;
  if (tabParam && NAV_ITEMS.some((item) => item.id === tabParam)) {
    return tabParam;
  }
  return 'beranda';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>(getInitialTab);
  const [activeProblemId, setActiveProblemId] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [submissions, setSubmissions] = useState<Record<number, SubmissionRecord>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as Record<number, SubmissionRecord>;
      }
    } catch {
      // Ignore storage read failure
    }
    return {};
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // Ignore storage write failure
    }
  }, [submissions]);

  const summary = useMemo(
    () =>
      computeEvaluationStats(
        PROBLEMS.map((p) => ({ id: p.id, tier: p.tier })),
        submissions
      ),
    [submissions]
  );

  const handleNavigate = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProblem = (problemId: number, targetTab: 'latihan' | 'pembahasan') => {
    setActiveProblemId(problemId);
    handleNavigate(targetTab);
  };

  const handleSubmitAnswer = (problemId: number, rawInput: string) => {
    const parsed = parseIndonesianNumber(rawInput);
    if (!parsed.valid) {
      return { valid: false, isCorrect: false };
    }
    const problem = PROBLEMS.find((p) => p.id === problemId);
    if (!problem) {
      return { valid: false, isCorrect: false };
    }
    const correct = isAnswerCorrect(rawInput, problem.answerExact);
    setSubmissions((prev) => {
      const prevAttempts = prev[problemId]?.attempts ?? 0;
      return {
        ...prev,
        [problemId]: {
          rawInput: rawInput.trim(),
          isCorrect: correct,
          attempts: prevAttempts + 1,
        },
      };
    });
    return { valid: true, isCorrect: correct };
  };

  const handleResetProgress = () => {
    setSubmissions({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] disco-grid-bg text-[#0B193C]">
      {/* Single-Row Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-blue-200/80 glass-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigate('beranda')}
            className="text-left text-base font-extrabold tracking-tight text-[#0B193C] whitespace-nowrap shrink-0 cursor-pointer"
          >
            DISCO BLUE <span className="text-[#2563EB]">PHYSICS</span>
          </button>

          {/* Zone 2: Desktop Navigation Links (all 7 required menus) */}
          <nav
            aria-label="Navigasi utama"
            className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#2563EB]'
                      : 'text-slate-600 hover:text-[#0B193C]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#2563EB]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleNavigate('latihan')}
              className="hidden sm:inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Mulai Latihan
            </button>

            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-white text-[#0B193C] hover:bg-blue-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Tablet/Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Navigasi mobile"
            className="xl:hidden border-t border-blue-100 bg-white px-4 py-3 space-y-1"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-slate-50 text-[#0B193C] hover:bg-blue-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 lg:py-9">
        {activeTab === 'beranda' && (
          <HomeView onNavigate={handleNavigate} summary={summary} />
        )}
        {activeTab === 'peta-konsep' && (
          <ConceptMapView onNavigate={handleNavigate} />
        )}
        {activeTab === 'teori' && (
          <TheoryView onNavigate={handleNavigate} />
        )}
        {activeTab === 'bank-soal' && (
          <BankSoalView
            submissions={submissions}
            onSelectProblem={handleSelectProblem}
          />
        )}
        {activeTab === 'latihan' && (
          <PracticeView
            activeProblemId={activeProblemId}
            onChangeProblem={setActiveProblemId}
            submissions={submissions}
            onSubmitAnswer={handleSubmitAnswer}
          />
        )}
        {activeTab === 'pembahasan' && (
          <DiscussionView
            activeProblemId={activeProblemId}
            onChangeProblem={setActiveProblemId}
          />
        )}
        {activeTab === 'evaluasi' && (
          <EvaluationView
            summary={summary}
            submissions={submissions}
            onSelectProblem={handleSelectProblem}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-blue-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-slate-600 sm:px-6">
          <p className="font-semibold text-[#0B193C]">
            DISCO BLUE PHYSICS OLYMPIAD · Pembinaan OSK Fisika SMA oleh Mister Jo
          </p>
          <p>
            Fokus Pengembangan Soal Nomor 5 OSK 2026 · 15 Soal Numerik · Simulasi &amp; Narator Interaktif
          </p>
        </div>
      </footer>
    </div>
  );
}
