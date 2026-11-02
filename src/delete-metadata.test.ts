import assert from 'node:assert/strict';
import { test } from 'node:test';
import './index.ts';

test('with invalid target', () => {
  const target: any = undefined;
  assert.throws(() => Reflect.deleteMetadata('key', target), TypeError);
});

test('when not defined', () => {
  assert.equal(Reflect.deleteMetadata('key', {}), false);
});

test('when another key is defined', () => {
  const target = {};
  Reflect.defineMetadata('other', 'value', target);
  assert.equal(Reflect.deleteMetadata('key', target), false);
  assert.equal(Reflect.hasOwnMetadata('other', target), true);
});

test('when defined', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target);
  assert.equal(Reflect.deleteMetadata('key', target), true);
  assert.equal(Reflect.hasOwnMetadata('key', target), false);
});

test('when defined on prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype);
  assert.equal(Reflect.deleteMetadata('key', target), false);
  assert.equal(Reflect.hasMetadata('key', target), true);
});

test('with property key', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target);
  Reflect.defineMetadata('key', 'value', target, 'name');
  assert.equal(Reflect.deleteMetadata('key', target, 'name'), true);
  assert.equal(Reflect.hasOwnMetadata('key', target, 'name'), false);
  assert.equal(Reflect.hasOwnMetadata('key', target), true);
});
