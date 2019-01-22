import { Reflection } from './index';

test('defineMetadata', () => {
  expect(Reflect.defineMetadata).toBeDefined();
  expect(Reflect.defineMetadata).toEqual(Reflection.defineMetadata);
});

test('getMetadata', () => {
  expect(Reflect.getMetadata).toBeDefined();
  expect(Reflect.getMetadata).toEqual(Reflection.getMetadata);
});

test('decorate', () => {
  expect(Reflect.decorate).toBeDefined();
  expect(Reflect.decorate).toEqual(Reflection.decorate);
});

test('metadata', () => {
  expect(Reflect.metadata).toBeDefined();
  expect(Reflect.metadata).toEqual(Reflection.metadata);
});

test('hasOwnMetadata', () => {
  expect(Reflect.hasOwnMetadata).toBeDefined();
  expect(Reflect.hasOwnMetadata).toEqual(Reflection.hasOwnMetadata);
});

test('getOwnMetadata', () => {
  expect(Reflect.getOwnMetadata).toBeDefined();
  expect(Reflect.getOwnMetadata).toEqual(Reflection.getOwnMetadata);
});
