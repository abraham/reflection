import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inspect } from 'node:util';
import './index.ts';

test('with invalid target', () => {
  const target: any = undefined;
  assert.throws(() => Reflect.hasMetadata('key', target), TypeError);
});

test('when not defined', () => {
  const target = {};
  assert.equal(Reflect.hasMetadata('key', target), false);
});

test('when defined', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target);
  assert.equal(Reflect.hasMetadata('key', target), true);
});

test('when defined on prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype);
  assert.equal(Reflect.hasMetadata('key', target), true);
});

test('with key and not defined', () => {
  const target = {};
  assert.equal(Reflect.hasMetadata('key', target, 'name'), false);
});

test('with key and defined', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target, 'name');
  assert.equal(Reflect.hasMetadata('key', target, 'name'), true);
});

test('when defined on prototype with a property key', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype, 'name');
  assert.equal(Reflect.hasMetadata('key', target, 'name'), true);
});

for (const value of [0, false, '', null, NaN, undefined]) {
  test(`when value is ${inspect(value)}`, () => {
    const target = {};
    Reflect.defineMetadata('key', value, target, 'name');
    assert.equal(Reflect.hasMetadata('key', target, 'name'), true);
    assert.equal(Reflect.hasOwnMetadata('key', target, 'name'), true);
  });
}

test('when value is undefined on prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', undefined, prototype);
  assert.equal(Reflect.hasMetadata('key', target), true);
  assert.equal(Reflect.hasOwnMetadata('key', target), false);
});

test('hasOwnMetadata with invalid target', () => {
  const target: any = undefined;
  assert.throws(() => Reflect.hasOwnMetadata('key', target), TypeError);
});
