import assert from 'node:assert/strict';
import { test } from 'node:test';
import './index.ts';

const metadataKey = 'key';
const metadataValue = 'value';
const decorator = Reflect.metadata(metadataKey, metadataValue);
const propertyKey = 'name';

test('returns function', () => {
  assert.equal(typeof Reflect.metadata(metadataKey, metadataValue), 'function');
});

test('with invalid target', () => {
  const target: any = undefined;
  assert.throws(() => decorator(target, propertyKey), TypeError);
});

test('with invalid property key', () => {
  const target = {};
  const invalidPropertyKey: any = {};
  assert.throws(() => decorator(target, invalidPropertyKey), TypeError);
});

test('with falsy non-property key', () => {
  const target = {};
  const invalidPropertyKey: any = 0;
  assert.throws(() => decorator(target, invalidPropertyKey), TypeError);
});

test('with target and without property key', () => {
  const target = (): undefined => {
    return;
  };
  decorator(target);
  assert.equal(Reflect.hasOwnMetadata(metadataKey, target), true);
});

test('with target and propery key', () => {
  const target = {};
  decorator(target, propertyKey);
  assert.equal(Reflect.hasOwnMetadata(metadataKey, target, propertyKey), true);
});

test('with target and multiple properties', () => {
  const target = {};
  decorator(target, 'name1');
  decorator(target, 'name2');
  assert.equal(Reflect.hasOwnMetadata(metadataKey, target, 'name1'), true);
  assert.equal(Reflect.hasOwnMetadata(metadataKey, target, 'name2'), true);
});
