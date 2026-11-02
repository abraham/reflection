import assert from 'node:assert/strict';
import { test } from 'node:test';

// Runs in its own process, so this stands in for a native or earlier polyfilled Symbol.metadata.
const existing = Symbol('Symbol.metadata');
Object.defineProperty(Symbol, 'metadata', {
  value: existing,
  writable: true,
  enumerable: true,
  configurable: true,
});
Object.defineProperty(Function.prototype, existing, {
  value: null,
  writable: true,
  configurable: true,
});
await import('./standard.ts');

test('keeps an existing Symbol.metadata', () => {
  assert.equal(Symbol.metadata, existing);
  assert.equal(
    Object.getOwnPropertyDescriptor(Symbol, 'metadata')?.writable,
    true,
  );
});

test('keeps an existing Function.prototype[Symbol.metadata]', () => {
  assert.equal(
    Object.getOwnPropertyDescriptor(Function.prototype, existing)?.writable,
    true,
  );
});
