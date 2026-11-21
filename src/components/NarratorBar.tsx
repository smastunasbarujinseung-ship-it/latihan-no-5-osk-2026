import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, Play, Pause, RotateCcw, Square } from 'lucide-react';

interface NarratorBarProps {
  title: string;
  script: string;
  compact?: boolean;
}

type NarratorStatus = 'idle' | 'playing' | 'paused';

function splitIntoSentences(text: string): string[] {
  const raw = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return raw.length > 0 ? raw : [text];
}

export const NarratorBar: React.FC<NarratorBarProps> = ({ title, script, compact = false }) => {
  const sentences = useMemo(() => splitIntoSentences(script), [script]);
  const [status, setStatus] = useState<NarratorStatus>('idle');
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number>(-1);
  const [rate, setRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(!compact);

  const timerRef = useRef<number | null>(null);
  const idxRef = useRef<number>(0);
  const statusRef = useRef<NarratorStatus>('idle');
  const rateRef = useRef<number>(1.0);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopSpeech = () => {
    clearTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore TTS cancel errors in restricted environments
      }
    }
    statusRef.current = 'idle';
    idxRef.current = 0;
    setStatus('idle');
    setActiveSentenceIdx(-1);
  };

  // Stop narration when script changes (e.g. switching problem or theory chapter)
  useEffect(() => {
    stopSpeech();
    return () => {
      clearTimer();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // Ignore
        }
      }
    };
  }, [script]);

  const speakSentenceAt = (index: number) => {
    if (index >= sentences.length) {
      stopSpeech();
      return;
    }

    idxRef.current = index;
    setActiveSentenceIdx(index);
    const sentence = sentences[index];

    const hasSpeechApi =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined';

    const estimatedMs = Math.max(
      1800,
      Math.round(((sentence.split(/\s+/).length / 2.4) * 1000) / rateRef.current)
    );

    const scheduleFallbackAdvance = () => {
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        if (statusRef.current === 'playing') {
          speakSentenceAt(index + 1);
        }
      }, estimatedMs);
    };

    const voices =
      hasSpeechApi && typeof window.speechSynthesis.getVoices === 'function'
        ? window.speechSynthesis.getVoices()
        : [];

    if (hasSpeechApi && voices.length > 0) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'id-ID';
        utterance.rate = rateRef.current;
        utterance.pitch = 1.0;

        const idVoice = voices.find((v) => v.lang.toLowerCase().startsWith('id'));
        if (idVoice) {
          utterance.voice = idVoice;
        }

        let settled = false;
        const advanceOnce = () => {
          if (settled || statusRef.current !== 'playing') return;
          settled = true;
          clearTimer();
          speakSentenceAt(index + 1);
        };

        utterance.onend = advanceOnce;
        utterance.onerror = () => {
          if (settled || statusRef.current !== 'playing') return;
          settled = true;
          scheduleFallbackAdvance();
        };

        clearTimer();
        timerRef.current = window.setTimeout(advanceOnce, estimatedMs + 2000);
        window.speechSynthesis.speak(utterance);
        return;
      } catch {
        // Fall through to timer-driven guided highlight
      }
    }

    scheduleFallbackAdvance();
  };

  const handlePlay = () => {
    statusRef.current = 'playing';
    setStatus('playing');
    setShowTranscript(true);
    speakSentenceAt(0);
  };

  const handlePause = () => {
    clearTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    statusRef.current = 'paused';
    setStatus('paused');
  };

  const handleResume = () => {
    if (statusRef.current !== 'paused') return;
    statusRef.current = 'playing';
    setStatus('playing');
    speakSentenceAt(idxRef.current);
  };

  const handleReplay = () => {
    stopSpeech();
    window.setTimeout(() => {
      statusRef.current = 'playing';
      setStatus('playing');
      setShowTranscript(true);
      speakSentenceAt(0);
    }, 30);
  };

  return (
    <div
      className="rounded-xl border border-blue-200/80 bg-gradient-to-r from-[#EFF6FF] via-white to-[#F0F9FF] p-4 shadow-xs"
      aria-label={`Narator suara: ${title}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white">
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#1D4ED8]">Narator Pembina — Mister Jo</p>
            <p className="truncate text-sm font-semibold text-[#0B193C]">{title}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status === 'idle' && (
            <button
              type="button"
              onClick={handlePlay}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              PUTAR NARASI
            </button>
          )}

          {status === 'playing' && (
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B193C] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B193C] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              PAUSE
            </button>
          )}

          {status === 'paused' && (
            <button
              type="button"
              onClick={handleResume}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              LANJUTKAN
            </button>
          )}

          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-[#0B193C] transition-colors hover:bg-blue-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            ULANGI
          </button>

          <button
            type="button"
            onClick={stopSpeech}
            disabled={status === 'idle'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Square className="h-3 w-3" aria-hidden="true" />
            HENTIKAN
          </button>

          <label className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[#0B193C]">
            <span>Kecepatan</span>
            <select
              aria-label="Kecepatan suara narator"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="bg-transparent font-mono-tabular font-semibold text-[#2563EB] focus:outline-none cursor-pointer"
            >
              <option value={0.8}>0,8x</option>
              <option value={1.0}>1,0x</option>
              <option value={1.25}>1,25x</option>
            </select>
          </label>

          {compact && (
            <button
              type="button"
              onClick={() => setShowTranscript((v) => !v)}
              className="text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap shrink-0 cursor-pointer px-1"
            >
              {showTranscript ? 'Sembunyikan Teks' : 'Lihat Teks Narasi'}
            </button>
          )}
        </div>
      </div>

      {showTranscript && (
        <div className="mt-3 rounded-lg border border-blue-100 bg-white/90 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700">
          {sentences.map((sentence, idx) => {
            const isActive = idx === activeSentenceIdx;
            return (
              <span
                key={idx}
                className={`transition-colors duration-150 ${
                  isActive
                    ? 'rounded bg-blue-100 px-1 py-0.5 font-medium text-[#0B193C]'
                    : 'text-slate-700'
                }`}
              >
                {sentence}{' '}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
