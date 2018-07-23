[![Version Status](https://img.shields.io/npm/v/@abraham/reflection.svg?style=flat&label=version&colorB=4bc524)](https://npmjs.com/package/@abraham/reflection)
[![Build Status](https://img.shields.io/travis/abraham/reflection.svg?style=flat)](https://travis-ci.org/abraham/reflection)
[![Dependency Status](https://david-dm.org/abraham/reflection.svg?style=flat)](https://david-dm.org/abraham/reflection)

Reflection
====

Lightweight ES Module implementation of [reflect-metadata](https://github.com/rbuckton/reflect-metadata/) to work with TypeScript's [experimental decorator support](https://www.typescriptlang.org/docs/handbook/decorators.html).

Why?
----

The main reason for this library is to provide a much smaller implementation that can be included as a module.

- `reflect-metadata` is 52 K without compression while `reflection` is about 3 K
- `reflection` can be loaded with `<script type="module" src="..."></script>`

Install
----

```sh
npm install @abraham/reflection
```

Usage
-----

```ts
import { Reflection as Reflect } from '@abraham/reflection';
Reflect.defineMetadata(metadataKey, metadataValue, target);
```

If a globally available version you can use the following.

```ts
import '@abraham/reflection/dist/reflect';
Reflect.defineMetadata(metadataKey, metadataValue, target);
```


API
----

Reflection does not cover the complete API surface of reflect-metadata. Currently the following are available.

```ts
Reflect.decorate(...);
Reflect.defineMetadata(...);
Reflect.getMetadata(...);
Reflect.hasOwnMetadata(...);
Reflect.metadata(...);
```
