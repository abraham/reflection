import { decorate, defineMetadata, getMetadata, hasOwnMetadata, metadata } from './methods';

// TODO: Is there a better way to do this?
declare global {
  interface Window {
    Reflect: any;
  }
}

window.Reflect.decorate = decorate;
window.Reflect.defineMetadata = defineMetadata;
window.Reflect.getMetadata = getMetadata;
window.Reflect.hasOwnMetadata = hasOwnMetadata;
window.Reflect.metadata = metadata;
