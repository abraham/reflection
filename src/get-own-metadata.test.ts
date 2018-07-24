import { Reflection as Reflect } from './index';

const prototype = {};
const metadataKey = 'key';
const metadataValue = 'value';
const target = {};
const propertyKey = 'name';

test('invalid target', () => {
  expect(() => Reflect.getOwnMetadata(metadataKey)).toThrow(TypeError);
});

test('not defined with target', () => {
  expect(Reflect.getOwnMetadata(metadataKey, target)).toBeUndefined();
});

test('defined', () => {
  Reflect.defineMetadata(metadataKey, metadataValue, target);
  expect(Reflect.getOwnMetadata(metadataKey, target)).toEqual(metadataValue);
});

test('defined on prototype', () => {
  const target = Object.create(prototype);
  Reflect.defineMetadata(metadataKey, metadataValue, prototype);
  expect(Reflect.getOwnMetadata(metadataKey, target)).toBeUndefined();
});

test('not defined with property key', () => {
  expect(Reflect.getOwnMetadata(metadataKey, target, propertyKey)).toBeUndefined();
});

test('defined with property key', () => {
  Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  expect(Reflect.getOwnMetadata(metadataKey, target, propertyKey)).toEqual(metadataValue);
});

test('defined on prototype with property key', () => {
  const target = Object.create(prototype);
  Reflect.defineMetadata(metadataKey, metadataValue, prototype, propertyKey);
  expect(Reflect.getOwnMetadata(metadataKey, target, propertyKey)).toBeUndefined();
});
