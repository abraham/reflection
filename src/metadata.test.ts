import { Reflection as Reflect } from './index';

const metadataKey = 'key';
const metadataValue = 'value';
const decorator = Reflect.metadata(metadataKey, metadataValue);
const propertyKey = 'name';

test('returns function', () => {
  expect(typeof Reflect.metadata(metadataKey, metadataValue)).toEqual('function');
});

test('with invalid target', () => {
  const decorator = Reflect.metadata(metadataKey, metadataValue);
  const target = undefined;
  expect(() => decorator(target, propertyKey)).toThrow(TypeError);
})

test('with invalid property key', () => {
  const target = {};
  const propertyKey = {};
  expect(() => decorator(target, propertyKey)).toThrow(TypeError);
})

test('with target and without property key', () => {
  const target = () => {};
  decorator(target)
  expect(Reflect.hasOwnMetadata(metadataKey, target)).toBeTruthy();
})

test('with target and propery key', () => {
  const target = {};
  decorator(target, propertyKey);
  expect(Reflect.hasOwnMetadata(metadataKey, target, propertyKey)).toBeTruthy();
});

test('with target and multiple properties', () => {
  const target = {};
  decorator(target, 'name1');
  decorator(target, 'name2');
  expect(Reflect.hasOwnMetadata(metadataKey, target, 'name1')).toBeTruthy();
  expect(Reflect.hasOwnMetadata(metadataKey, target, 'name2')).toBeTruthy();
});
