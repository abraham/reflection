[![Version Status](https://img.shields.io/npm/v/@abraham/reflection.svg?style=flat&label=version&colorB=4bc524)](https://npmjs.com/package/@abraham/reflection)
[![Build Status](https://img.shields.io/travis/abraham/reflection.svg?style=flat)](https://travis-ci.org/abraham/reflection)
[![Dependency Status](https://david-dm.org/abraham/reflection.svg?style=flat)](https://david-dm.org/abraham/reflection)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@abraham/reflection.svg?style=flat&colorB=4bc524)](https://bundlephobia.com/result?p=@abraham/reflection)


Reflection
====

Lightweight ES Module implementation of [reflect-metadata](https://github.com/rbuckton/reflect-metadata/) to work with TypeScript's [experimental decorator support](https://www.typescriptlang.org/docs/handbook/decorators.html).

Why?
----

The main reason for this library is to provide a much smaller implementation that can be included as a module.

- ES module
  - `reflection` can be loaded with `<script type="module" src="..."></script>`
- Size (uncompressed)
  - [`reflect-metadata`](https://github.com/rbuckton/reflect-metadata) is ~50K
  - [`core-js/es7/reflect`](https://github.com/zloirock/core-js) is ~80K
  - `@abraham/reflection` is ~3K

Read about how to [drop 20K from your production Angular app](https://bendyworks.com/blog/drop-20k-from-your-production-angular-app) by switching to this.

Install
----

```sh
npm install @abraham/reflection
```

Usage
-----

```ts
import '@abraham/reflection';
Reflect.defineMetadata(metadataKey, metadataValue, target);
```

You can also import `Reflection`:

```ts
import { Reflection as Reflect } from '@abraham/reflection';
Reflect.defineMetadata(metadataKey, metadataValue, target);
```

API
----

Reflection does not currently cover the complete API surface of reflect-metadata. The following methods are available:

```ts
Reflect.decorate(...);
Reflect.defineMetadata(...);
Reflect.getMetadata(...);
Reflect.hasMetadata(...);
Reflect.getOwnMetadata(...);
Reflect.hasOwnMetadata(...);
Reflect.metadata(...);
```
