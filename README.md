[![Version Status](https://img.shields.io/npm/v/@abraham/reflection.svg?style=flat&label=version&colorB=4bc524)](https://npmjs.com/package/@abraham/reflection)
[![Build Status](https://github.com/abraham/reflection/workflows/Index/badge.svg)](https://github.com/abraham/reflection/actions)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@abraham/reflection.svg?style=flat&colorB=4bc524)](https://bundlephobia.com/result?p=@abraham/reflection)

# Reflection

Lightweight ES Module implementation of [reflect-metadata](https://github.com/rbuckton/reflect-metadata/) to work with TypeScript's [experimental decorator support](https://www.typescriptlang.org/docs/handbook/decorators.html).

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

## Usage

```ts
import '@abraham/reflection';
Reflect.defineMetadata(metadataKey, metadataValue, target);
```

You can also import `Reflection`:

```ts
import { Reflection as Reflect } from '@abraham/reflection';
Reflect.defineMetadata(metadataKey, metadataValue, target);
```

## API

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
