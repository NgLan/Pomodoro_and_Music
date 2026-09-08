/**
 * Synthesizes a pleasant melodic chime using Web Audio API.
 * Does not depend on external audio files to ensure 100% offline and network reliability.
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtxClass) return null;
  if (!audioCtx) audioCtx = new AudioCtxClass();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function playChimeNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration = 0.45,
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.25, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playAlarmChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Harmonious chime sequence: D5 -> A5 -> D6
    playChimeNote(ctx, 587.33, now);
    playChimeNote(ctx, 880.0, now + 0.15);
    playChimeNote(ctx, 1174.66, now + 0.3);
  } catch {
    // Autoplay or audio unavailable
  }
}
