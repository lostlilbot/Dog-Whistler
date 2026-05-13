"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const MIN_FREQ = 400;
const MAX_FREQ = 25000;
const DEFAULT_FREQ = 12000;
const DEFAULT_VOLUME = 0.5;

type Pattern = "none" | "pulse" | "sweep" | "double-pulse";

type AudioContextType = AudioContext | null;
type OscillatorType = OscillatorNode | null;
type GainNodeType = GainNode | null;

export default function Home() {
  const [frequency, setFrequency] = useState<number>(DEFAULT_FREQ);
  const [volume, setVolume] = useState<number>(DEFAULT_VOLUME);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [pattern, setPattern] = useState<Pattern>("none");
  const [preset, setPreset] = useState<string>("custom");

  const audioCtxRef = useRef<AudioContextType>(null);
  const oscNodeRef = useRef<OscillatorType>(null);
  const gainNodeRef = useRef<GainNodeType>(null);
  const sweepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAllIntervals = useCallback((): void => {
    if (sweepIntervalRef.current) {
      clearInterval(sweepIntervalRef.current);
      sweepIntervalRef.current = null;
    }
    if (pulseIntervalRef.current) {
      clearInterval(pulseIntervalRef.current);
      pulseIntervalRef.current = null;
    }
  }, []);

  const stopAudio = useCallback((): void => {
    stopAllIntervals();

    if (oscNodeRef.current) {
      try {
        oscNodeRef.current.stop();
      } catch {
        // Oscillator may already be stopped
      }
      oscNodeRef.current.disconnect();
      oscNodeRef.current = null;
    }

    if (gainNodeRef.current && audioCtxRef.current) {
      const param = gainNodeRef.current.gain;
      param.cancelScheduledValues(audioCtxRef.current.currentTime);
      param.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.01);
    }

    setIsPlaying(false);
  }, [stopAllIntervals]);

  const ensureAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctor();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const startAudio = useCallback((): void => {
    const ctx = ensureAudioContext();

    // Stop any existing oscillator first
    if (oscNodeRef.current) {
      try {
        oscNodeRef.current.stop();
        oscNodeRef.current.disconnect();
      } catch {
        // ignore
      }
    }

    const osc: OscillatorNode = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    const gainNode: GainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();

    oscNodeRef.current = osc;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
  }, [frequency, volume, ensureAudioContext]);

  const startPattern = useCallback((): void => {
    stopAllIntervals();

    if (!gainNodeRef.current || !oscNodeRef.current || !audioCtxRef.current) {
      return;
    }

    const gain = gainNodeRef.current.gain;
    const ctx = audioCtxRef.current;

    if (pattern === "pulse") {
      const id = setInterval((): void => {
        gain.cancelScheduledValues(ctx.currentTime);
        gain.setValueAtTime(volume, ctx.currentTime);
        gain.setTargetAtTime(0.001, ctx.currentTime, 0.03);

        setTimeout((): void => {
          if (gainNodeRef.current && isPlaying) {
            gainNodeRef.current.gain.setValueAtTime(
              volume,
              audioCtxRef.current!.currentTime
            );
          }
        }, 300);
      }, 700);

      pulseIntervalRef.current = id;
    } else if (pattern === "sweep") {
      let currentFreq = MIN_FREQ;
      const direction = { value: 1 };

      const id = setInterval((): void => {
        if (!oscNodeRef.current || !audioCtxRef.current) return;

        currentFreq += direction.value * 200;

        if (currentFreq >= MAX_FREQ) {
          currentFreq = MAX_FREQ;
          direction.value = -1;
        } else if (currentFreq <= MIN_FREQ) {
          currentFreq = MIN_FREQ;
          direction.value = 1;
        }

        oscNodeRef.current.frequency.setTargetAtTime(
          currentFreq,
          audioCtxRef.current.currentTime,
          0.05
        );
      }, 50);

      sweepIntervalRef.current = id;
    } else if (pattern === "double-pulse") {
      let clickCount = 0;

      const id = setInterval((): void => {
        if (!gainNodeRef.current || !audioCtxRef.current) return;

        const g = gainNodeRef.current.gain;
        const cctx = audioCtxRef.current;

        g.cancelScheduledValues(cctx.currentTime);
        g.setValueAtTime(volume, cctx.currentTime);

        const releaseTime = clickCount % 2 === 0 ? 0.02 : 0.03;
        const resumeDelay = clickCount % 2 === 0 ? 120 : 300;

        g.setTargetAtTime(0.001, cctx.currentTime, releaseTime);

        setTimeout((): void => {
          if (gainNodeRef.current && isPlaying && audioCtxRef.current) {
            gainNodeRef.current.gain.setValueAtTime(
              volume,
              audioCtxRef.current.currentTime
            );
          }
        }, resumeDelay);

        clickCount++;
      }, 800);

      pulseIntervalRef.current = id;
    }
  }, [pattern, volume, stopAllIntervals, isPlaying]);

  useEffect((): (() => void) => {
    if (isPlaying && pattern !== "none") {
      startPattern();
    }
    return (): void => stopAllIntervals();
  }, [isPlaying, pattern, startPattern, stopAllIntervals]);

  const handlePlay = (): void => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const handlePresetChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const val = e.target.value;
    setPreset(val);

    if (val === "custom") return;

    const freqMap: Record<string, number> = {
      low: 8000,
      mid: 12000,
      high: 18000,
      "very-high": 22000,
      "training-basic": 5000,
      "training-advanced": 15000,
    };

    const f: number | undefined = freqMap[val];
    if (f !== undefined) {
      setFrequency(f);
      // Update oscillator frequency if currently playing
      if (oscNodeRef.current && audioCtxRef.current) {
        oscNodeRef.current.frequency.setTargetAtTime(
          f,
          audioCtxRef.current.currentTime,
          0.02
        );
      }
    }
  };

  const freqPercentage: number =
    ((frequency - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100;

  const handleFreqChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newFreq = Number(e.target.value);
    setFrequency(newFreq);
    setPreset("custom");
    if (oscNodeRef.current && audioCtxRef.current) {
      oscNodeRef.current.frequency.setTargetAtTime(
        newFreq,
        audioCtxRef.current.currentTime,
        0.02
      );
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        newVol,
        audioCtxRef.current.currentTime,
        0.02
      );
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            🐕 Dog Whistle
          </h1>
          <p className="text-sm text-neutral-400">
            Ultrasonic dog whistle with adjustable frequency, patterns, and
            volume
          </p>
        </header>

        {/* Frequency Display */}
        <div className="text-center mb-8">
          <div className="text-5xl font-mono font-bold text-emerald-400 mb-1">
            {frequency.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-500 uppercase tracking-widest">
            Hz
          </div>
        </div>

        {/* Frequency Slider */}
        <div className="mb-8">
          <label
            htmlFor="freq-slider"
            className="block text-sm font-medium text-neutral-300 mb-3"
          >
            Frequency
          </label>
          <div className="relative">
            <input
              id="freq-slider"
              type="range"
              role="slider"
              aria-label="Frequency in Hertz"
              aria-valuemin={MIN_FREQ}
              aria-valuemax={MAX_FREQ}
              aria-valuenow={frequency}
              min={MIN_FREQ}
              max={MAX_FREQ}
              value={frequency}
              onChange={handleFreqChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-700 range-thumb:appearance-none range-thumb:w-6 range-thumb:h-6 range-thumb:rounded-full range-thumb:bg-emerald-400 range-thumb:cursor-pointer range-thumb:shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              style={{
                background: `linear-gradient(to right, #22c55e ${freqPercentage}%, #27272a ${freqPercentage}%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>{MIN_FREQ} Hz</span>
            <span>{MAX_FREQ.toLocaleString()} Hz</span>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="mb-8">
          <label
            htmlFor="vol-slider"
            className="block text-sm font-medium text-neutral-300 mb-3"
          >
            Volume
          </label>
          <div className="relative">
            <input
              id="vol-slider"
              type="range"
              role="slider"
              aria-label="Volume level"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(volume * 100)}
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-700 range-thumb:appearance-none range-thumb:w-6 range-thumb:h-6 range-thumb:rounded-full range-thumb:bg-sky-400 range-thumb:cursor-pointer range-thumb:shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              style={{
                background: `linear-gradient(to right, #38bdf8 ${volume * 100}%, #27272a ${volume * 100}%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>0%</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-8">
          <label
            htmlFor="preset-select"
            className="block text-sm font-medium text-neutral-300 mb-3"
          >
            Preset Frequency
          </label>
          <select
            id="preset-select"
            value={preset}
            onChange={handlePresetChange}
            className="w-full px-4 py-2.5 bg-neutral-800 text-neutral-100 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
          >
            <option value="custom">Custom ({frequency} Hz)</option>
            <option value="low">Low — 8,000 Hz</option>
            <option value="mid">Mid — 12,000 Hz</option>
            <option value="high">High — 18,000 Hz</option>
            <option value="very-high">Very High — 22,000 Hz</option>
            <option value="training-basic">Training Basic — 5,000 Hz</option>
            <option value="training-advanced">Training Advanced — 15,000 Hz</option>
          </select>
        </div>

        {/* Pattern */}
        <div className="mb-10">
          <p className="block text-sm font-medium text-neutral-300 mb-3">
            Pattern
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "none" as Pattern, label: "Continuous" },
              { key: "pulse" as Pattern, label: "Pulse" },
              { key: "sweep" as Pattern, label: "Sweep" },
              { key: "double-pulse" as Pattern, label: "Double Pulse" },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPattern(p.key)}
                disabled={!isPlaying && p.key !== "none"}
                className={`py-2.5 px-4 rounded-lg text-sm font-medium border transition-all ${
                  pattern === p.key
                    ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
                    : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Action Button */}
        <button
          type="button"
          onClick={handlePlay}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
              : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
          }`}
        >
          {isPlaying ? "⏹ Stop Whistle" : "🎵 Start Whistle"}
        </button>

        {/* Info */}
        <p className="text-xs text-neutral-500 text-center mt-6">
          Uses Web Audio API — no sound files needed. Works best in Chrome,
          Edge, or Firefox.
        </p>
      </div>
    </main>
  );
}