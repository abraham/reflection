import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inspect } from 'node:util';
import './index.ts';

test('with invalid target', () => {
  const target: any = undefined;
  assert.throws(() => Reflect.getMetadata('key', target), TypeError);
});

test('when not defined', () => {
  const target = {};
  assert.equal(Reflect.getMetadata('key', target), undefined);
});

test('when defined', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target);
  assert.equal(Reflect.getMetadata('key', target), 'value');
});

test('when defined on prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype);
  assert.equal(Reflect.getMetadata('key', target), 'value');
});

test('with key and not defined', () => {
  const target = {};
  assert.equal(Reflect.getMetadata('key', target, 'name'), undefined);
});

test('with key and defined', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target, 'name');
  assert.equal(Reflect.getMetadata('key', target, 'name'), 'value');
});

test('when defined on prototype with a property key', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype, 'name');
  assert.equal(Reflect.getMetadata('key', target, 'name'), 'value');
});

for (const value of [0, false, '', null, NaN, undefined]) {
  test(`when value is ${inspect(value)}`, () => {
    const target = {};
    Reflect.defineMetadata('key', value, target, 'name');
    assert.equal(Reflect.getMetadata('key', target, 'name'), value);
  });
}

test('when own value is undefined it shadows the prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype);
  Reflect.defineMetadata('key', undefined, target);
  assert.equal(Reflect.getMetadata('key', target), undefined);
});
