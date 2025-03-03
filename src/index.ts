export type Decorator = ClassDecorator | MemberDecorator;
export type MemberDecorator = <T>(
  target: Target,
  propertyKey: PropertyKey,
  descriptor?: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void;
export type MetadataKey = string | symbol;
export type PropertyKey = string | symbol;
export type Target = object | Function;

const Metadata = new WeakMap();

function decorateProperty(
  decorators: MemberDecorator[],
  target: Target,
  propertyKey: PropertyKey,
  descriptor?: PropertyDescriptor,
): PropertyDescriptor | undefined {
  decorators.reverse().forEach((decorator: MemberDecorator) => {
    descriptor = decorator(target, propertyKey, descriptor) || descriptor;
  });
  return descriptor;
}

function decorateConstructor(
  decorators: ClassDecorator[],
  target: Function,
): Function {
  decorators.reverse().forEach((decorator: ClassDecorator) => {
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

function getMetadataMap<MetadataValue>(
  target: Target,
  propertyKey?: PropertyKey,
): Map<MetadataKey, MetadataValue> | undefined {
  return Metadata.get(target) && Metadata.get(target).get(propertyKey);
}

function ordinaryGetOwnMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): MetadataValue | undefined {
  if (target === undefined) {
    throw new TypeError();
  }
  const metadataMap = getMetadataMap<MetadataValue>(target, propertyKey);
  return metadataMap && metadataMap.get(metadataKey);
}

function createMetadataMap<MetadataValue>(
  target: Target,
  propertyKey?: PropertyKey,
): Map<MetadataKey, MetadataValue> {
  const targetMetadata =
    Metadata.get(target) ||
    new Map<PropertyKey | undefined, Map<MetadataKey, MetadataValue>>();
  Metadata.set(target, targetMetadata);
  const metadataMap =
    targetMetadata.get(propertyKey) || new Map<MetadataKey, MetadataValue>();
  targetMetadata.set(propertyKey, metadataMap);
  return metadataMap;
}

function ordinaryDefineOwnMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  metadataValue: MetadataValue,
  target: Target,
  propertyKey?: PropertyKey,
): void {
  if (propertyKey && !['string', 'symbol'].includes(typeof propertyKey)) {
    throw new TypeError();
  }

  (
    getMetadataMap<MetadataValue>(target, propertyKey) ||
    createMetadataMap<MetadataValue>(target, propertyKey)
  ).set(metadataKey, metadataValue);
}

function ordinaryGetMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): MetadataValue | undefined {
  return ordinaryGetOwnMetadata<MetadataValue>(metadataKey, target, propertyKey)
    ? ordinaryGetOwnMetadata<MetadataValue>(metadataKey, target, propertyKey)
    : Object.getPrototypeOf(target)
      ? ordinaryGetMetadata(
          metadataKey,
          Object.getPrototypeOf(target),
          propertyKey,
        )
      : undefined;
}

export function metadata<MetadataValue>(
  metadataKey: MetadataKey,
  metadataValue: MetadataValue,
) {
  return function decorator(target: Target, propertyKey?: PropertyKey): void {
    ordinaryDefineOwnMetadata<MetadataValue>(
      metadataKey,
      metadataValue,
      target,
      propertyKey,
    );
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
  return !!ordinaryGetOwnMetadata(metadataKey, target, propertyKey);
}

export function hasMetadata(
  metadataKey: MetadataKey,
  target: Target,
  propertyKey?: PropertyKey,
): boolean {
  return !!ordinaryGetMetadata(metadataKey, target, propertyKey);
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
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Reflect {
    let decorate: typeof Reflection.decorate;
    let defineMetadata: typeof Reflection.defineMetadata;
    let getMetadata: typeof Reflection.getMetadata;
    let getOwnMetadata: typeof Reflection.getOwnMetadata;
    let hasOwnMetadata: typeof Reflection.hasOwnMetadata;
    let hasMetadata: typeof Reflection.hasMetadata;
    let metadata: typeof Reflection.metadata;
  }
}

Object.assign(Reflect, Reflection);
