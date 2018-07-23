import { decorate, defineMetadata, getMetadata, hasOwnMetadata, metadata } from './methods';

export const Reflection = Object.assign(Reflect, {
  decorate,
  defineMetadata,
  getMetadata,
  hasOwnMetadata,
  metadata,
});
