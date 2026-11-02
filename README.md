[![Version Status](https://img.shields.io/npm/v/@abraham/reflection.svg?style=flat&label=version&colorB=4bc524)](https://npmjs.com/package/@abraham/reflection)
[![Build Status](https://github.com/abraham/reflection/workflows/Index/badge.svg)](https://github.com/abraham/reflection/actions)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@abraham/reflection.svg?style=flat&colorB=4bc524)](https://bundlephobia.com/result?p=@abraham/reflection)

# Reflection

Lightweight ES Module implementation of [reflect-metadata](https://github.com/rbuckton/reflect-metadata/) to work with TypeScript's [experimental decorator support](https://www.typescriptlang.org/docs/handbook/decorators.html), plus a matching API for [standard decorators](https://github.com/tc39/proposal-decorators) and [decorator metadata](https://github.com/tc39/proposal-decorator-metadata).

## Why?

The main reason for this library is to provide a much smaller implementation that can be included as a module.

- ES module
  - `reflection` can be loaded with `<script type="module" src="..."></script>`
- Size (uncompressed)
  - [`reflect-metadata`](https://github.com/rbuckton/reflect-metadata) is ~50K
  - [`core-js/es7/reflect`](https://github.com/zloirock/core-js) is ~80K
  - `@abraham/reflection` is ~3K

Read about how to [drop 20K from your production Angular app](https://bendyworks.com/blog/drop-20k-from-your-production-angular-app) by switching to this.

## Install

```sh
npm install @abraham/reflection
```

## Which import?

Use the one that matches how your project compiles decorators. A project uses one or the other, not both.

|                      | `@abraham/reflection/legacy` (default)                                               | `@abraham/reflection/standard`                                                                          |
| -------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Decorators           | Legacy: `experimentalDecorators: true`                                               | Standard: TypeScript 5.2+ without `experimentalDecorators`, or Babel                                    |
| Type metadata        | `design:type`, `design:paramtypes`, `design:returntype` with `emitDecoratorMetadata` | Not available                                                                                           |
| Parameter decorators | Yes                                                                                  | No                                                                                                      |
| Globals              | Adds methods to `Reflect`                                                            | Defines `Symbol.metadata` and `Function.prototype[Symbol.metadata]` (`null`) if missing, as in the spec |
| Module formats       | ES module and UMD/CommonJS                                                           | ES module                                                                                               |

Use `@abraham/reflection/legacy` for code written for `reflect-metadata`, including frameworks that rely on `emitDecoratorMetadata` for dependency injection. The bare `@abraham/reflection` import is the same module, so existing imports keep working and both can be mixed.

Use `@abraham/reflection/standard` for new code on standard decorators. They don't pass the class to member decorators, so `Reflect.defineMetadata` can't be used; metadata goes through the decorator's `context.metadata` instead.

## Usage

### Experimental decorators

`tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "experimentalDecorators": true,
    // Only needed for design:type, design:paramtypes, and design:returntype
    "emitDecoratorMetadata": true,
    // Needed for the ./legacy subpath; the bare import resolves with any setting
    "moduleResolution": "bundler", // or "nodenext"
  },
}
```

```ts
import '@abraham/reflection/legacy'; // or '@abraham/reflection'
Reflect.defineMetadata(metadataKey, metadataValue, target);
```

You can also import `Reflection`:

```ts
import { Reflection as Reflect } from '@abraham/reflection/legacy';
Reflect.defineMetadata(metadataKey, metadataValue, target);
```

### Standard decorators

Requires TypeScript 5.2 or later. `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    // Leave experimentalDecorators and emitDecoratorMetadata unset or false
    // Any target except ESNext, which leaves @decorator syntax untransformed
    "target": "ES2022",
    // Needed to resolve the ./standard subpath export
    "moduleResolution": "bundler", // or "nodenext"
    // Only needed to type Symbol.metadata in your own code; add to your existing lib
    "lib": ["ES2022", "ESNext.Decorators"],
  },
}
```

Import it before any decorated class is defined, so `Symbol.metadata` exists when the class is created.

```ts
import { metadata, getMetadata } from '@abraham/reflection/standard';

@metadata('role', 'admin')
class User {
  @metadata('column', 'email')
  email = '';

  @metadata('route', '/users')
  static list() {}
}

getMetadata('role', User); // 'admin'
getMetadata('column', User.prototype, 'email'); // 'email'
getMetadata('column', new User(), 'email'); // 'email'
getMetadata('route', User, 'list'); // '/users'
```

Targets follow `reflect-metadata`: the class for class and static member metadata, and the prototype or an instance for instance member metadata. Subclasses inherit metadata and can override it. Values are stored privately, so the class's shared `Symbol.metadata` object is left for other libraries.

## API

### `@abraham/reflection/legacy`

The following methods are available:

```ts
Reflect.decorate(...);
Reflect.defineMetadata(...);
Reflect.deleteMetadata(...);
Reflect.getMetadata(...);
Reflect.getMetadataKeys(...);
Reflect.getOwnMetadata(...);
Reflect.getOwnMetadataKeys(...);
Reflect.hasMetadata(...);
Reflect.hasOwnMetadata(...);
Reflect.metadata(...);
```

### `@abraham/reflection/standard`

```ts
metadata(metadataKey, metadataValue); // decorator for classes, methods, getters, setters, fields, and accessors
getMetadata(metadataKey, target, memberKey?);
getMetadataKeys(target, memberKey?);
getOwnMetadata(metadataKey, target, memberKey?);
getOwnMetadataKeys(target, memberKey?);
hasMetadata(metadataKey, target, memberKey?);
hasOwnMetadata(metadataKey, target, memberKey?);
```
