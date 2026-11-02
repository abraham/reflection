import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Reflection } from './index.ts';

test('defineMetadata', () => {
  assert.equal(Reflect.defineMetadata, Reflection.defineMetadata);
});

test('getMetadata', () => {
  assert.equal(Reflect.getMetadata, Reflection.getMetadata);
});

test('decorate', () => {
  assert.equal(Reflect.decorate, Reflection.decorate);
});

test('metadata', () => {
  assert.equal(Reflect.metadata, Reflection.metadata);
});

test('hasOwnMetadata', () => {
  assert.equal(Reflect.hasOwnMetadata, Reflection.hasOwnMetadata);
});

test('hasMetadata', () => {
  assert.equal(Reflect.hasMetadata, Reflection.hasMetadata);
});

test('getOwnMetadata', () => {
  assert.equal(Reflect.getOwnMetadata, Reflection.getOwnMetadata);
});

// Test Reflect standard API

test('apply', () => {
  assert.equal(typeof Reflect.apply, 'function');
});

test('construct', () => {
  assert.equal(typeof Reflect.construct, 'function');
});

test('defineProperty', () => {
  assert.equal(typeof Reflect.defineProperty, 'function');
});

test('deleteProperty', () => {
  assert.equal(typeof Reflect.deleteProperty, 'function');
});

test('get', () => {
  assert.equal(typeof Reflect.get, 'function');
});

test('getOwnPropertyDescriptor', () => {
  assert.equal(typeof Reflect.getOwnPropertyDescriptor, 'function');
});

test('getPrototypeOf', () => {
  assert.equal(typeof Reflect.getPrototypeOf, 'function');
});

test('has', () => {
  assert.equal(typeof Reflect.has, 'function');
});

test('isExtensible', () => {
  assert.equal(typeof Reflect.isExtensible, 'function');
});

test('ownKeys', () => {
  assert.equal(typeof Reflect.ownKeys, 'function');
});

test('preventExtensions', () => {
  assert.equal(typeof Reflect.preventExtensions, 'function');
});

test('set', () => {
  assert.equal(typeof Reflect.set, 'function');
});

test('setPrototypeOf', () => {
  assert.equal(typeof Reflect.setPrototypeOf, 'function');
});
