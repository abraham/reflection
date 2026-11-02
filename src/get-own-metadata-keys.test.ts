import assert from 'node:assert/strict';
import { test } from 'node:test';
import './index.ts';

test('with invalid target', () => {
  const target: any = undefined;
  assert.throws(() => Reflect.getOwnMetadataKeys(target), TypeError);
});

test('when not defined', () => {
  assert.deepEqual(Reflect.getOwnMetadataKeys({}), []);
});

test('when defined', () => {
  const target = {};
  const symbol = Symbol('key');
  Reflect.defineMetadata('key', 'value', target);
  Reflect.defineMetadata(symbol, 'value', target);
  assert.deepEqual(Reflect.getOwnMetadataKeys(target), ['key', symbol]);
});

test('when defined on prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype);
  assert.deepEqual(Reflect.getOwnMetadataKeys(target), []);
});

test('with property key', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target, 'name');
  Reflect.defineMetadata('other', 'value', target);
  assert.deepEqual(Reflect.getOwnMetadataKeys(target, 'name'), ['key']);
});
