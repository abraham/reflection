import assert from 'node:assert/strict';
import { test } from 'node:test';
import './index.ts';

test('with invalid target', () => {
  const target: any = undefined;
  assert.throws(() => Reflect.getMetadataKeys(target), TypeError);
});

test('when not defined', () => {
  assert.deepEqual(Reflect.getMetadataKeys({}), []);
});

test('when defined', () => {
  const target = {};
  const symbol = Symbol('key');
  Reflect.defineMetadata('key', 'value', target);
  Reflect.defineMetadata(symbol, 'value', target);
  assert.deepEqual(Reflect.getMetadataKeys(target), ['key', symbol]);
});

test('when defined on prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype);
  assert.deepEqual(Reflect.getMetadataKeys(target), ['key']);
});

test('own keys come before prototype keys without duplicates', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('parent', 'value', prototype);
  Reflect.defineMetadata('shared', 'value', prototype);
  Reflect.defineMetadata('own', 'value', target);
  Reflect.defineMetadata('shared', 'value', target);
  assert.deepEqual(Reflect.getMetadataKeys(target), [
    'own',
    'shared',
    'parent',
  ]);
});

test('with property key', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('parent', 'value', prototype, 'name');
  Reflect.defineMetadata('own', 'value', target, 'name');
  Reflect.defineMetadata('other', 'value', target);
  assert.deepEqual(Reflect.getMetadataKeys(target, 'name'), ['own', 'parent']);
});
