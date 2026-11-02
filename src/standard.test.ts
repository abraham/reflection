import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  getMetadata,
  getMetadataKeys,
  getOwnMetadata,
  getOwnMetadataKeys,
  hasMetadata,
  hasOwnMetadata,
  metadata,
} from './standard.ts';

type Decoration = [
  (value: unknown, context: DecoratorContext) => void,
  {
    kind: DecoratorContext['kind'];
    name?: string | symbol;
    static?: boolean;
    private?: boolean;
  },
];

// Applies decorators the way the spec, TypeScript, and Babel do for standard decorators.
function decorate<T extends Function>(target: T, decorations: Decoration[]): T {
  const parent: Function = Object.getPrototypeOf(target);
  const metadataObject = Object.create(parent[Symbol.metadata]);
  for (const [decorator, context] of decorations) {
    decorator(undefined, {
      private: false,
      static: false,
      ...context,
      metadata: metadataObject,
    } as unknown as DecoratorContext);
  }
  Object.defineProperty(target, Symbol.metadata, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: metadataObject,
  });
  return target;
}

test('defines Symbol.metadata', () => {
  assert.equal(typeof Symbol.metadata, 'symbol');
  assert.equal(Symbol.keyFor(Symbol.metadata), undefined);
  assert.deepEqual(Object.getOwnPropertyDescriptor(Symbol, 'metadata'), {
    value: Symbol.metadata,
    writable: false,
    enumerable: false,
    configurable: false,
  });
});

test('defines Function.prototype[Symbol.metadata]', () => {
  assert.deepEqual(
    Object.getOwnPropertyDescriptor(Function.prototype, Symbol.metadata),
    { value: null, writable: false, enumerable: false, configurable: false },
  );
  class C {}
  assert.equal(C[Symbol.metadata], null);
});

test('the same key twice on one member', () => {
  // Decorators on an element apply bottom-up, so the topmost one is applied last.
  const C = decorate(class {}, [
    [metadata('key', 'bottom'), { kind: 'method', name: 'method' }],
    [metadata('key', 'top'), { kind: 'method', name: 'method' }],
  ]);
  assert.equal(getMetadata('key', C.prototype, 'method'), 'top');
});

test('private member metadata', () => {
  const C = decorate(class {}, [
    [
      metadata('key', 'value'),
      { kind: 'field', name: '#field', private: true },
    ],
  ]);
  assert.equal(getMetadata('key', C.prototype, '#field'), 'value');
});

test('reading inherited metadata during decoration', () => {
  const append = (value: string) => (_: unknown, context: DecoratorContext) => {
    const list = (context.metadata.list as string[] | undefined) ?? [];
    context.metadata.list = [...list, value];
  };
  const C = decorate(class {}, [[append('x'), { kind: 'class' }]]);
  const D = decorate(class extends C {}, [[append('z'), { kind: 'class' }]]);
  assert.deepEqual(C[Symbol.metadata]!.list, ['x']);
  assert.deepEqual(D[Symbol.metadata]!.list, ['x', 'z']);
});

test('class metadata', () => {
  const C = decorate(class {}, [[metadata('key', 'value'), { kind: 'class' }]]);
  assert.equal(getMetadata('key', C), 'value');
  assert.equal(getOwnMetadata('key', C), 'value');
  assert.equal(hasMetadata('key', C), true);
  assert.equal(hasOwnMetadata('key', C), true);
  assert.equal(getMetadata('key', C.prototype), undefined);
});

test('instance member metadata', () => {
  const C = decorate(class {}, [
    [metadata('key', 'value'), { kind: 'method', name: 'method' }],
  ]);
  assert.equal(getMetadata('key', C.prototype, 'method'), 'value');
  assert.equal(getOwnMetadata('key', C.prototype, 'method'), 'value');
  assert.equal(getMetadata('key', new C(), 'method'), 'value');
  assert.equal(getOwnMetadata('key', new C(), 'method'), undefined);
  assert.equal(getMetadata('key', C, 'method'), undefined);
  assert.equal(getMetadata('key', C), undefined);
});

test('static member metadata', () => {
  const C = decorate(class {}, [
    [metadata('key', 'value'), { kind: 'field', name: 'field', static: true }],
  ]);
  assert.equal(getMetadata('key', C, 'field'), 'value');
  assert.equal(getOwnMetadata('key', C, 'field'), 'value');
  assert.equal(getMetadata('key', C.prototype, 'field'), undefined);
});

test('static and instance members with the same name are separate', () => {
  const C = decorate(class {}, [
    [metadata('key', 'instance'), { kind: 'accessor', name: 'x' }],
    [metadata('key', 'static'), { kind: 'getter', name: 'x', static: true }],
  ]);
  assert.equal(getMetadata('key', C.prototype, 'x'), 'instance');
  assert.equal(getMetadata('key', C, 'x'), 'static');
});

test('symbol member and metadata keys', () => {
  const member = Symbol('member');
  const key = Symbol('key');
  const C = decorate(class {}, [
    [metadata(key, 'value'), { kind: 'setter', name: member }],
  ]);
  assert.equal(getMetadata(key, C.prototype, member), 'value');
  assert.deepEqual(getOwnMetadataKeys(C.prototype, member), [key]);
});

test('inheritance and shadowing', () => {
  const C = decorate(class {}, [
    [metadata('a', 'parent'), { kind: 'class' }],
    [metadata('b', 'parent'), { kind: 'class' }],
    [metadata('m', 'parent'), { kind: 'method', name: 'method' }],
  ]);
  const D = decorate(class extends C {}, [
    [metadata('b', 'child'), { kind: 'class' }],
    [metadata('c', 'child'), { kind: 'class' }],
  ]);
  assert.equal(getMetadata('a', D), 'parent');
  assert.equal(getMetadata('b', D), 'child');
  assert.equal(getMetadata('b', C), 'parent');
  assert.equal(getOwnMetadata('a', D), undefined);
  assert.equal(hasMetadata('a', D), true);
  assert.equal(hasOwnMetadata('a', D), false);
  assert.equal(getMetadata('m', D.prototype, 'method'), 'parent');
  assert.equal(getOwnMetadata('m', D.prototype, 'method'), undefined);
  assert.deepEqual(getMetadataKeys(D), ['b', 'c', 'a']);
  assert.deepEqual(getOwnMetadataKeys(D), ['b', 'c']);
});

test('undecorated subclass inherits', () => {
  const C = decorate(class {}, [[metadata('key', 'value'), { kind: 'class' }]]);
  class D extends C {}
  assert.equal(getMetadata('key', D), 'value');
  assert.equal(getOwnMetadata('key', D), undefined);
  assert.deepEqual(getOwnMetadataKeys(D), []);
});

test('undecorated class', () => {
  class C {}
  assert.equal(getMetadata('key', C), undefined);
  assert.equal(hasMetadata('key', C.prototype, 'method'), false);
  assert.equal(hasOwnMetadata('key', C), false);
  assert.deepEqual(getMetadataKeys(C), []);
  assert.deepEqual(getMetadataKeys({}), []);
  assert.deepEqual(getMetadataKeys(Object.create(null), 'method'), []);
});

test('class decorated only by another library', () => {
  const C = decorate(class {}, [
    [
      (_value, context) => {
        context.metadata.other = true;
      },
      { kind: 'class' },
    ],
  ]);
  assert.equal(getMetadata('other', C), undefined);
  assert.deepEqual(getOwnMetadataKeys(C), []);
});

test('keeps the public metadata object empty', () => {
  const C = decorate(class {}, [[metadata('key', 'value'), { kind: 'class' }]]);
  assert.deepEqual(Reflect.ownKeys(C[Symbol.metadata]!), []);
});

for (const target of [undefined, null, 1, 'string'] as any[]) {
  test(`with ${String(target)} target`, () => {
    assert.throws(() => getMetadata('key', target), TypeError);
    assert.throws(() => getOwnMetadata('key', target), TypeError);
    assert.throws(() => hasMetadata('key', target), TypeError);
    assert.throws(() => hasOwnMetadata('key', target), TypeError);
    assert.throws(() => getMetadataKeys(target), TypeError);
    assert.throws(() => getOwnMetadataKeys(target), TypeError);
  });
}

test('with a legacy decorator call', () => {
  const decorator: any = metadata('key', 'value');
  assert.throws(() => decorator({}, 'name'), TypeError);
});

test('without context.metadata', () => {
  const context: any = { kind: 'class', name: 'C', metadata: undefined };
  assert.throws(() => metadata('key', 'value')(class {}, context), TypeError);
});
