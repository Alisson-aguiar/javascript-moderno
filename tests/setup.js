import { vi } from 'vitest';

// jsdom não implementa scrollTo/scrollIntoView — mock global
window.scrollTo = vi.fn();
window.scrollIntoView = vi.fn();

// Mock do IntersectionObserver
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock do matchMedia
window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {}
  }));
