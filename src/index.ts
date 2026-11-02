export type Decorator = ClassDecorator | MemberDecorator;
export type MemberDecorator = <T>(
  target: Target,
  propertyKey: PropertyKey,
  descriptor?: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void;
export type MetadataKey = string | symbol;
export type PropertyKey = string | symbol;
export type Target = object | Function;

const Metadata = new WeakMap<
  Target,
  Map<PropertyKey | undefined, Map<MetadataKey, unknown>>
>();

function decorateProperty(
  decorators: MemberDecorator[],
  target: Target,
  propertyKey: PropertyKey,
  descriptor?: PropertyDescriptor,
): PropertyDescriptor | undefined {
  [...decorators].reverse().forEach((decorator: MemberDecorator) => {
    descriptor = decorator(target, propertyKey, descriptor) || descriptor;
  });
  return descriptor;
}

function decorateConstructor(
  decorators: ClassDecorator[],
  target: Function,
): Function {
  [...decorators].reverse().forEach((decorator: ClassDecorator) => {
    const decorated = decorator(target);
    if (decorated) {
      target = decorated;
    }
  });
  return target;
}

export function decorate(
  decorators: ClassDecorator[],
  target: Function,
): Function;
export function decorate(
  decorators: MemberDecorator[],
  target: object,
  propertyKey?: PropertyKey,
  attributes?: PropertyDescriptor,
): PropertyDescriptor | undefined;
export function decorate(
  decorators: Decorator[],
  target: Target,
  propertyKey?: PropertyKey,
  attributes?: PropertyDescriptor,
): Function | PropertyDescriptor | undefined {
  if (!Array.isArray(decorators) || decorators.length === 0) {
    throw new TypeError();
  }

  if (propertyKey !== undefined) {
    return decorateProperty(
      decorators as MemberDecorator[],
      target,
      propertyKey,
      attributes,
    );
  }

  if (typeof target === 'function') {
    return decorateConstructor(decorators as ClassDecorator[], target);
  }

  return;
}

function getMetadataMap(
  target: Target,
  propertyKey?: PropertyKey,
): Map<MetadataKey, unknown> | undefined {
  return Metadata.get(target)?.get(propertyKey);
}

function ordinaryGetOwnMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): MetadataValue | undefined {
  if (target === undefined) {
    throw new TypeError();
  }
  return getMetadataMap(target, propertyKey)?.get(metadataKey) as
    MetadataValue | undefined;
}

function createMetadataMap(
  target: Target,
  propertyKey?: PropertyKey,
): Map<MetadataKey, unknown> {
  const targetMetadata =
    Metadata.get(target) ||
    new Map<PropertyKey | undefined, Map<MetadataKey, unknown>>();
  Metadata.set(target, targetMetadata);
  const metadataMap =
    targetMetadata.get(propertyKey) || new Map<MetadataKey, unknown>();
  targetMetadata.set(propertyKey, metadataMap);
  return metadataMap;
}

function ordinaryDefineOwnMetadata(
  metadataKey: MetadataKey,
  metadataValue: unknown,
  target: Target,
  propertyKey?: PropertyKey,
): void {
  if (propertyKey && !['string', 'symbol'].includes(typeof propertyKey)) {
    throw new TypeError();
  }

  (
    getMetadataMap(target, propertyKey) ||
    createMetadataMap(target, propertyKey)
  ).set(metadataKey, metadataValue);
}

function ordinaryHasOwnMetadata(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): boolean {
  if (target === undefined) {
    throw new TypeError();
  }
  const metadataMap = getMetadataMap(target, propertyKey);
  return !!metadataMap && metadataMap.has(metadataKey);
}

function ordinaryHasMetadata(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): boolean {
  if (ordinaryHasOwnMetadata(metadataKey, target, propertyKey)) {
    return true;
  }
  const parent = Object.getPrototypeOf(target);
  return (
    parent !== null && ordinaryHasMetadata(metadataKey, parent, propertyKey)
  );
}

function ordinaryGetMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): MetadataValue | undefined {
  if (ordinaryHasOwnMetadata(metadataKey, target, propertyKey)) {
    return ordinaryGetOwnMetadata<MetadataValue>(
      metadataKey,
      target,
      propertyKey,
    );
  }
  const parent = Object.getPrototypeOf(target);
  return parent !== null
    ? ordinaryGetMetadata(metadataKey, parent, propertyKey)
    : undefined;
}

export function metadata<MetadataValue>(
  metadataKey: MetadataKey,
  metadataValue: MetadataValue,
) {
  return function decorator(target: Target, propertyKey?: PropertyKey): void {
    ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
  };
}

export function getMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): MetadataValue | undefined {
  return ordinaryGetMetadata<MetadataValue>(metadataKey, target, propertyKey);
}

export function getOwnMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): MetadataValue | undefined {
  return ordinaryGetOwnMetadata<MetadataValue>(
    metadataKey,
    target,
    propertyKey,
  );
}

export function hasOwnMetadata(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): boolean {
  return ordinaryHasOwnMetadata(metadataKey, target, propertyKey);
}

export function hasMetadata(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): boolean {
  return ordinaryHasMetadata(metadataKey, target, propertyKey);
}

export function defineMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  metadataValue: MetadataValue,
  target: Target,
  propertyKey?: PropertyKey,
): void {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
}

export const Reflection = {
  decorate,
  defineMetadata,
  getMetadata,
  getOwnMetadata,
  hasMetadata,
  hasOwnMetadata,
  metadata,
};

declare global {
  // Functions, not variables, so these merge with reflect-metadata's declarations.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Reflect {
    function decorate(decorators: ClassDecorator[], target: Function): Function;
    function decorate(
      decorators: MemberDecorator[],
      target: object,
      propertyKey?: PropertyKey,
      attributes?: PropertyDescriptor,
    ): PropertyDescriptor | undefined;
    function defineMetadata<MetadataValue>(
      metadataKey: MetadataKey,
      metadataValue: MetadataValue,
      target: Target,
      propertyKey?: PropertyKey,
    ): void;
    function getMetadata<MetadataValue>(
      metadataKey: MetadataKey,
      target: Target,
      propertyKey?: PropertyKey,
    ): MetadataValue | undefined;
    function getOwnMetadata<MetadataValue>(
      metadataKey: MetadataKey,
      target: Target,
      propertyKey?: PropertyKey,
    ): MetadataValue | undefined;
    function hasOwnMetadata(
      metadataKey: MetadataKey,
      target: Target,
      propertyKey?: PropertyKey,
    ): boolean;
    function hasMetadata(
      metadataKey: MetadataKey,
      target: Target,
      propertyKey?: PropertyKey,
    ): boolean;
    function metadata<MetadataValue>(
      metadataKey: MetadataKey,
      metadataValue: MetadataValue,
    ): (target: Target, propertyKey?: PropertyKey) => void;
  }
}

Object.assign(Reflect, Reflection);
