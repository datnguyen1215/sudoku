import { beforeEach, expect } from 'vitest';
import '@testing-library/jest-dom';

// Clean up between tests
beforeEach(() => {
	document.body.innerHTML = '';
});

// Disable console warnings during tests
beforeEach(() => {
	const originalWarn = console.warn;
	console.warn = (...args: any[]) => {
		if (args[0]?.includes?.('Using `data-testid` as a prop')) return;
		originalWarn(...args);
	};
});

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// Mock touch events
Object.defineProperty(window, 'ontouchstart', {
	value: true,
	writable: true
});

// Mock viewport dimensions for mobile testing
Object.defineProperty(window, 'innerWidth', {
	writable: true,
	configurable: true,
	value: 375
});

Object.defineProperty(window, 'innerHeight', {
	writable: true,
	configurable: true,
	value: 812
});
