import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSound from "use-sound";

/**
 * useSoulBinding
 * - Single source of truth for demo pacing: timer, curse punishment, scripted breach messages, and CRT glitch intensity.
 * - Designed to be stable under React StrictMode: single interval, single visibility listener, and fully managed timeouts.
 */

export type LinkStatus = "STABLE" | "UNSTABLE" | "BREACH" | "CURSED" | "CHANNEL_OPEN";

export type HauntEvent = {
  triggerAt: number;        // seconds left when the event triggers
  message: string;          // ghost message
  intensity: number;        // 0..1 visual intensity baseline
  sound?: "glitch" | "scream" | "none";
};

export type SoulBindingOptions = {
  startTime?: number;       // default 333
  hasStarted?: boolean;     // false => STABLE until user starts
  audioEnabled?: boolean;   // gate for mobile autoplay policies
  breachDurationMs?: [number, number]; // default [2000, 4000]
  jitter?: {
    enabled?: boolean;      // default true
    amplitude?: number;     // default 0.03
    intervalMs?: number;    // default 120
  };
  sounds?: {
    glitch?: string;
    scream?: string;
  };
  script?: HauntEvent[];
};

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const clamp01 = (n: number) => clamp(n, 0, 1);

const DEFAULT_SOUNDS = {
  glitch: "/sounds/static_noise.mp3",
  scream: "/sounds/woman_scream.mp3",
};

const DEFAULT_SCRIPT: HauntEvent[] = [
  { triggerAt: 330, message: "連線建立...別切換視窗。", intensity: 0.12, sound: "glitch" },
  { triggerAt: 250, message: "有人在看你嗎？", intensity: 0.22, sound: "glitch" },
  { triggerAt: 150, message: "杏林醫院 4 樓...門開了。", intensity: 0.50, sound: "glitch" },
  { triggerAt: 60,  message: "別 回 頭", intensity: 0.78, sound: "glitch" },
  { triggerAt: 10,  message: "來不及了", intensity: 0.95, sound: "glitch" },
  { triggerAt: 0,   message: "通道已開啟。", intensity: 0.18, sound: "none" }, // CHANNEL_OPEN moment
];

const DEFAULT_GLITCH = 0.1;

export const useSoulBinding = (opts: SoulBindingOptions = {}) => {
  const startTime = opts.startTime ?? 333;
  const hasStarted = opts.hasStarted ?? true;
  const audioEnabled = opts.audioEnabled ?? false;

  const breachRange = opts.breachDurationMs ?? [2000, 4000];
  const jitterEnabled = opts.jitter?.enabled ?? true;
  const jitterAmplitude = opts.jitter?.amplitude ?? 0.03;
  const jitterIntervalMs = opts.jitter?.intervalMs ?? 120;

  const sounds = { ...DEFAULT_SOUNDS, ...(opts.sounds ?? {}) };
  const script = opts.script ?? DEFAULT_SCRIPT;

  const [timeLeft, setTimeLeft] = useState<number>(startTime);
  const [isCursed, setIsCursed] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [glitchIntensity, setGlitchIntensity] = useState<number>(DEFAULT_GLITCH);

  // refs for latest state (so listeners don't need re-binding)
  const timeRef = useRef(timeLeft);
  const cursedRef = useRef(isCursed);
  const startedRef = useRef(hasStarted);

  useEffect(() => { timeRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { cursedRef.current = isCursed; }, [isCursed]);
  useEffect(() => { startedRef.current = hasStarted; }, [hasStarted]);

  // managed timers
  const msgTimeoutRef = useRef<number | null>(null);
  const curseTimeoutRef = useRef<number | null>(null);
  const jitterTimerRef = useRef<number | null>(null);
  const glitchBaseRef = useRef<number>(DEFAULT_GLITCH);

  const clearMsgTimeout = () => {
    if (msgTimeoutRef.current) window.clearTimeout(msgTimeoutRef.current);
    msgTimeoutRef.current = null;
  };

  const clearCurseTimeout = () => {
    if (curseTimeoutRef.current) window.clearTimeout(curseTimeoutRef.current);
    curseTimeoutRef.current = null;
  };

  const stopJitter = () => {
    if (jitterTimerRef.current) window.clearInterval(jitterTimerRef.current);
    jitterTimerRef.current = null;
  };

  // sound hooks (gated)
  const [playGlitch] = useSound(sounds.glitch, { volume: 0.38, soundEnabled: audioEnabled, interrupt: true });
  const [playScream] = useSound(sounds.scream, { volume: 0.75, soundEnabled: audioEnabled, interrupt: true });

  // scriptMap for O(1) lookup
  const scriptMap = useMemo(() => {
    const m = new Map<number, HauntEvent>();
    for (const e of script) m.set(e.triggerAt, e);
    return m;
  }, [script]);

  // link status derived (no extra state needed)
  const linkStatus: LinkStatus =
    timeLeft === 0 ? "CHANNEL_OPEN" :
    isCursed ? "CURSED" :
    currentMessage ? "BREACH" :
    startedRef.current ? "UNSTABLE" : "STABLE";

  // single interval timer (stable)
  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeLeft(prev => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => {
      window.clearInterval(id);
      clearMsgTimeout();
      clearCurseTimeout();
      stopJitter();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Curse trigger (tab switch)
  const triggerCurse = useCallback(() => {
    if (!startedRef.current) return;
    if (cursedRef.current) return;
    if (timeRef.current <= 0) return;

    clearMsgTimeout();
    stopJitter();
    clearCurseTimeout();

    setIsCursed(true);
    setTimeLeft(startTime);
    setCurrentMessage(null);
    setGlitchIntensity(1.0);
    glitchBaseRef.current = 1.0;

    playScream();

    // 3s curse window
    curseTimeoutRef.current = window.setTimeout(() => {
      curseTimeoutRef.current = null;
      setIsCursed(false);

      // return to calm baseline
      setGlitchIntensity(DEFAULT_GLITCH);
      glitchBaseRef.current = DEFAULT_GLITCH;
    }, 3000);
  }, [playScream, startTime]);

  // visibility listener (bind once)
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) triggerCurse();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [triggerCurse]);

  // Script events
  useEffect(() => {
    if (!startedRef.current) return;

    const event = scriptMap.get(timeLeft);
    if (!event) return;

    // CHANNEL_OPEN at 0: we still allow message, but status is channel open
    clearMsgTimeout();
    stopJitter();

    setCurrentMessage(event.message);
    const base = clamp01(event.intensity);
    setGlitchIntensity(base);
    glitchBaseRef.current = base;

    if (event.sound === "glitch") playGlitch();

    // BREACH duration: 2–4s random (configurable)
    const [minMs, maxMs] = breachRange;
    const duration = clamp(minMs + Math.floor(Math.random() * (maxMs - minMs + 1)), 500, 10000);

    msgTimeoutRef.current = window.setTimeout(() => {
      msgTimeoutRef.current = null;

      // if we're cursed, curse owns the screen
      if (cursedRef.current) return;

      setCurrentMessage(null);

      // if channel open, keep mild signal; otherwise return to baseline
      if (timeRef.current === 0) {
        const mild = 0.15;
        setGlitchIntensity(mild);
        glitchBaseRef.current = mild;
      } else {
        setGlitchIntensity(DEFAULT_GLITCH);
        glitchBaseRef.current = DEFAULT_GLITCH;
      }
    }, duration);
  }, [timeLeft, scriptMap, breachRange, playGlitch]);

  // Jitter during BREACH (subtle micro-instability)
  useEffect(() => {
    stopJitter();

    if (!jitterEnabled) return;
    if (!currentMessage) return;
    if (isCursed) return; // curse overrides intensity
    if (timeLeft === 0) return; // keep channel open stable-ish

    jitterTimerRef.current = window.setInterval(() => {
      const jitter = (Math.random() * 2 - 1) * jitterAmplitude; // [-amp, +amp]
      setGlitchIntensity(clamp01(glitchBaseRef.current + jitter));
    }, jitterIntervalMs);

    return () => stopJitter();
  }, [currentMessage, isCursed, timeLeft, jitterEnabled, jitterAmplitude, jitterIntervalMs]);

  // public helpers (optional)
  const reset = useCallback(() => {
    clearMsgTimeout();
    clearCurseTimeout();
    stopJitter();

    setIsCursed(false);
    setCurrentMessage(null);
    setGlitchIntensity(DEFAULT_GLITCH);
    glitchBaseRef.current = DEFAULT_GLITCH;
    setTimeLeft(startTime);
  }, [startTime]);

  return {
    timeLeft,
    isCursed,
    currentMessage,
    glitchIntensity,
    linkStatus,
    isContractReady: timeLeft === 0,
    reset,
  };
};