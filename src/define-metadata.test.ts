import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import './index.ts';

[
  ['key', 'key2'],
  [Symbol('key'), Symbol('key2')],
].forEach(([metadataKey, metadataKey2]) => {
  describe(`with ${typeof metadataKey} metadata key`, () => {
    const metadataValue = 'value';
    const target = {};

    test('with invalid target', () => {
      const target: any = undefined;
      assert.throws(
        () => Reflect.defineMetadata(metadataKey, metadataValue, target),
        TypeError,
      );
    });

    test('with target but no property key', () => {
      assert.doesNotThrow(() =>
        Reflect.defineMetadata(metadataKey, metadataValue, target),
      );
    });

    test('with target and property key', () => {
      const propertyKey = 'name';
      assert.doesNotThrow(() =>
        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey),
      );
    });

    test('metadata map is reused', () => {
      const metadataValue2 = 'value2';
      Reflect.defineMetadata(metadataKey, metadataValue, target);
      Reflect.defineMetadata(metadataKey2, metadataValue2, target);
      assert.equal(Reflect.getOwnMetadata(metadataKey, target), metadataValue);
      assert.equal(
        Reflect.getOwnMetadata(metadataKey2, target),
        metadataValue2,
      );
    });
  });
});
