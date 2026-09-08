import { expect, it, vi } from "vitest";
import { playAlarmChime } from "./alarm-sound";

it("handles playing alarm chime safely without throwing", () => {
  const mockOsc = {
    type: "sine",
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const mockGain = {
    gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
  };
  class MockAudioContext {
    currentTime = 0;
    state = "running";
    createOscillator = () => mockOsc;
    createGain = () => mockGain;
    destination = {};
    resume = vi.fn();
  }

  // @ts-expect-error Mocking window AudioContext
  window.AudioContext = MockAudioContext;

  expect(() => playAlarmChime()).not.toThrow();
  expect(mockOsc.start).toHaveBeenCalled();
});
