'use client';

import { useSyncExternalStore } from 'react';

export interface ScrollState {
  y: number;
  progress: number;
  velocity: number;
}

type Listener = () => void;

let listeners: Listener[] = [];
let rafId: number | null = null;
let currentState: ScrollState = { y: 0, progress: 0, velocity: 0 };
let prevY = 0;
let smoothedVelocity = 0;

const SERVER_SNAPSHOT: ScrollState = { y: 0, progress: 0, velocity: 0 };

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getLenisY(): number {
  if (!isBrowser()) return 0;
  const w = window as Window & { lenis?: { scroll: number } };
  return w.lenis?.scroll ?? window.scrollY;
}

function tick(): void {
  const y = getLenisY();
  const docHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  const maxScroll = docHeight - viewportHeight;
  const progress = maxScroll > 0 ? clamp(y / maxScroll, 0, 1) : 0;

  const rawVelocity = y - prevY;
  smoothedVelocity = smoothedVelocity + (rawVelocity - smoothedVelocity) * 0.15;

  const next: ScrollState = {
    y,
    progress,
    velocity: smoothedVelocity,
  };

  if (
    next.y !== currentState.y ||
    next.progress !== currentState.progress ||
    next.velocity !== currentState.velocity
  ) {
    currentState = next;
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  }

  prevY = y;
  rafId = requestAnimationFrame(tick);
}

function startLoop(): void {
  if (rafId !== null || !isBrowser()) return;
  prevY = getLenisY();
  currentState = { y: prevY, progress: 0, velocity: 0 };
  rafId = requestAnimationFrame(tick);
}

function stopLoop(): void {
  if (rafId === null) return;
  cancelAnimationFrame(rafId);
  rafId = null;
}

function subscribe(cb: Listener): () => void {
  listeners = [...listeners, cb];
  if (listeners.length === 1) startLoop();
  return () => {
    listeners = listeners.filter((l) => l !== cb);
    if (listeners.length === 0) stopLoop();
  };
}

function getSnapshot(): ScrollState {
  return currentState;
}

function getServerSnapshot(): ScrollState {
  return SERVER_SNAPSHOT;
}

export function useLenisScroll(): ScrollState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
