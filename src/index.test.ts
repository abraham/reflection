import { Reflection as Reflect } from './index';

test('defineMetadata', () => {
  expect(Reflect.defineMetadata).toBeDefined();
});

test('getMetadata', () => {
  expect(Reflect.getMetadata).toBeDefined();
});

test('decorate', () => {
  expect(Reflect.decorate).toBeDefined();
});

test('metadata', () => {
  expect(Reflect.metadata).toBeDefined();
});

test('hasOwnMetadata', () => {
  expect(Reflect.hasOwnMetadata).toBeDefined();
});

test('getOwnMetadata', () => {
  expect(Reflect.getOwnMetadata).toBeDefined();
});
