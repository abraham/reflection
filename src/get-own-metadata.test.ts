import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inspect } from 'node:util';
import './index.ts';

const prototype = {};
const metadataKey = 'key';
const metadataValue = 'value';
const target = {};
const propertyKey = 'name';

test('invalid target', () => {
  const target: any = undefined;
  assert.throws(() => Reflect.getOwnMetadata(metadataKey, target), TypeError);
});

test('not defined with target', () => {
  assert.equal(Reflect.getOwnMetadata(metadataKey, target), undefined);
});

test('defined', () => {
  Reflect.defineMetadata(metadataKey, metadataValue, target);
  assert.equal(Reflect.getOwnMetadata(metadataKey, target), metadataValue);
});

test('defined on prototype', () => {
  const target = Object.create(prototype);
  Reflect.defineMetadata(metadataKey, metadataValue, prototype);
  assert.equal(Reflect.getOwnMetadata(metadataKey, target), undefined);
});

test('not defined with property key', () => {
  assert.equal(
    Reflect.getOwnMetadata(metadataKey, target, propertyKey),
    undefined,
  );
});

test('defined with property key', () => {
  Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  assert.equal(
    Reflect.getOwnMetadata(metadataKey, target, propertyKey),
    metadataValue,
  );
});

test('defined on prototype with property key', () => {
  const target = Object.create(prototype);
  Reflect.defineMetadata(metadataKey, metadataValue, prototype, propertyKey);
  assert.equal(
    Reflect.getOwnMetadata(metadataKey, target, propertyKey),
    undefined,
  );
});

for (const value of [0, false, '', null, NaN]) {
  test(`defined as ${inspect(value)}`, () => {
    const target = {};
    Reflect.defineMetadata(metadataKey, value, target);
    assert.equal(Reflect.getOwnMetadata(metadataKey, target), value);
  });
}
