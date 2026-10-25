'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    __appReady?: boolean;
  }
}

export const READY_EVENT = 'app:ready';

export function markAppReady() {
  window.__appReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

/** True once the loader has finished and the page is revealed. */
export function useAppReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.__appReady) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener(READY_EVENT, on);
    return () => window.removeEventListener(READY_EVENT, on);
  }, []);
  return ready;
}

export function useMediaQuery(query: string, initial = false) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Reads a CSS custom property once mounted (e.g. the hashed next/font family names for canvas text). */
export function useCssVar(name: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
  }, [name]);
  return value;
}

/** Touch devices, small screens and modest hardware get lighter WebGL settings. */
export function useLowPower() {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const small = window.innerWidth < 768;
    const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    setLow(coarse || small || weak);
  }, []);
  return low;
}
