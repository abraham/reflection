import { Reflection as Reflect } from './index';

const metadataKey = 'key';
const metadataValue = 'value';
const target = {};

test('with invalid target', () => {
  const target = undefined;
  expect(() => Reflect.defineMetadata(metadataKey, metadataValue, target!)).toThrow(TypeError);
});

test('with target but no property key', () => {
  expect(() => Reflect.defineMetadata(metadataKey, metadataValue, target)).not.toThrow();
});

test('with target and property key', () => {
  const propertyKey = 'name';
  expect(() => Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey)).not.toThrow();
});

test('metadata map is reused', () => {
  const metadataKey2 = 'key2';
  const metadataValue2 = 'value2';
  Reflect.defineMetadata(metadataKey, metadataValue, target);
  Reflect.defineMetadata(metadataKey2, metadataValue2, target);
  expect(Reflect.getOwnMetadata(metadataKey, target)).toEqual(metadataValue);
  expect(Reflect.getOwnMetadata(metadataKey2, target)).toEqual(metadataValue2);
});
