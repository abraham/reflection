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

// Test Reflect standard API

test('apply', () => {
  expect(Reflect.apply).toBeDefined();
  expect(typeof Reflect.apply).toBe('function');
});

test('construct', () => {
  expect(Reflect.construct).toBeDefined();
  expect(typeof Reflect.construct).toBe('function');
});

test('defineProperty', () => {
  expect(Reflect.defineProperty).toBeDefined();
  expect(typeof Reflect.defineProperty).toBe('function');
});

test('deleteProperty', () => {
  expect(Reflect.deleteProperty).toBeDefined();
  expect(typeof Reflect.deleteProperty).toBe('function');
});

test('get', () => {
  expect(Reflect.get).toBeDefined();
  expect(typeof Reflect.get).toBe('function');
});

test('getOwnPropertyDescriptor', () => {
  expect(Reflect.getOwnPropertyDescriptor).toBeDefined();
  expect(typeof Reflect.getOwnPropertyDescriptor).toBe('function');
});

test('getPrototypeOf', () => {
  expect(Reflect.getPrototypeOf).toBeDefined();
  expect(typeof Reflect.getPrototypeOf).toBe('function');
});

test('has', () => {
  expect(Reflect.has).toBeDefined();
  expect(typeof Reflect.has).toBe('function');
});

test('isExtensible', () => {
  expect(Reflect.isExtensible).toBeDefined();
  expect(typeof Reflect.isExtensible).toBe('function');
});

test('ownKeys', () => {
  expect(Reflect.ownKeys).toBeDefined();
  expect(typeof Reflect.ownKeys).toBe('function');
});

test('preventExtensions', () => {
  expect(Reflect.preventExtensions).toBeDefined();
  expect(typeof Reflect.preventExtensions).toBe('function');
});

test('set', () => {
  expect(Reflect.set).toBeDefined();
  expect(typeof Reflect.set).toBe('function');
});

test('setPrototypeOf', () => {
  expect(Reflect.setPrototypeOf).toBeDefined();
  expect(typeof Reflect.setPrototypeOf).toBe('function');
});
