import { Reflection as Reflect } from './index';

test('with invalid target', () => {
  const metadataKey = 'key';
  const metadataValue = 'value';
  expect(() => Reflect.defineMetadata(metadataKey, metadataValue)).toThrow(TypeError);
});

test('with target but no property key', () => {
  const metadataKey = 'key';
  const metadataValue = 'value';
  const target = {};
  expect(() => Reflect.defineMetadata(metadataKey, metadataValue, target)).not.toThrow();
});

test('with target and property key', () => {
  const metadataKey = 'key';
  const metadataValue = 'value';
  const target = {};
  const propertyKey = 'name';
  expect(() => Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey)).not.toThrow();
});
