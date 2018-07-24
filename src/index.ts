export const Reflection = Object.assign(Reflect, {
  decorate,
  defineMetadata,
  getMetadata,
  getOwnMetadata,
  hasOwnMetadata,
  metadata,
});

export type Decorator = ClassDecorator | MemberDecorator;
export type MemberDecorator = <T>(target: Target, propertyKey: PropertyKey, descriptor?: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
export type MetadataKey = string;
export type MetadataValue = Function;
export type PropertyKey = string | symbol;
export type Target = object | Function;

const Metadata = new WeakMap();

export function defineMetadata(metadataKey: MetadataKey, metadataValue: MetadataValue, target: Target, propertyKey?: PropertyKey) {
  return ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
}

export function decorate(decorators: ClassDecorator[], target: Function): Function
export function decorate(decorators: MemberDecorator[], target: object, propertyKey?: PropertyKey, attributes?: PropertyDescriptor): PropertyDescriptor | undefined
export function decorate(decorators: Decorator[], target: Target, propertyKey?: PropertyKey, attributes?: PropertyDescriptor): Function | PropertyDescriptor | undefined {
  if (decorators.length === 0) throw new TypeError();

  if (typeof target === 'function') {
    return decorateConstructor(decorators as ClassDecorator[], target);
  } else if (propertyKey !== undefined) {
    return decorateProperty(decorators as MemberDecorator[], target, propertyKey, attributes);
  }
  return;
}

export function metadata(metadataKey: MetadataKey, metadataValue: MetadataValue) {
  return function decorator(target: Function, propertyKey?: PropertyKey) {
    ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
  };
}

export function getMetadata(metadataKey: MetadataKey, target: Target, propertyKey?: PropertyKey) {
  return ordinaryGetMetadata(metadataKey, target, propertyKey);
}

export function getOwnMetadata(metadataKey: MetadataKey, target: Target, propertyKey?: PropertyKey) {
  return ordinaryGetOwnMetadata(metadataKey, target, propertyKey);
}

export function hasOwnMetadata(metadataKey: MetadataKey, target: Target, propertyKey?: PropertyKey): boolean {
  return !!ordinaryGetOwnMetadata(metadataKey, target, propertyKey);
}

function decorateConstructor(decorators: ClassDecorator[], target: Function): Function {
  decorators.reverse().forEach((decorator: ClassDecorator) => {
    const decorated = decorator(target);
    if (decorated) {
      target = decorated;
    }
  });
  return target;
}

function decorateProperty(decorators: MemberDecorator[], target: Target, propertyKey: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor | undefined {
  decorators.reverse().forEach((decorator: MemberDecorator) => {
    descriptor = decorator(target, propertyKey, descriptor) || descriptor;
  });
  return descriptor;
}

function ordinaryDefineOwnMetadata(metadataKey: MetadataKey, metadataValue: MetadataValue, target: Target, propertyKey?: PropertyKey): void {
  if (propertyKey && !['string', 'symbol'].includes(typeof propertyKey)) throw new TypeError();

  (getMetadataMap(target, propertyKey) || createMetadataMap(target, propertyKey))
    .set(metadataKey, metadataValue);
}

function ordinaryGetMetadata(metadataKey: MetadataKey, target: Target, propertyKey?: PropertyKey): Function | undefined {
  return !!ordinaryGetOwnMetadata(metadataKey, target, propertyKey)
    ? ordinaryGetOwnMetadata(metadataKey, target, propertyKey)
    : Object.getPrototypeOf(target)
    ? ordinaryGetMetadata(metadataKey, Object.getPrototypeOf(target), propertyKey)
    : undefined;
}

function ordinaryGetOwnMetadata(metadataKey: MetadataKey, target: Target, propertyKey?: PropertyKey): Function | undefined {
  if (target === undefined) throw new TypeError();
  const metadataMap = getMetadataMap(target, propertyKey);
  return metadataMap && metadataMap.get(metadataKey);
}

function getMetadataMap(target: Target, propertyKey?: PropertyKey): Map<MetadataKey, MetadataValue> | undefined {
  return Metadata.get(target) && Metadata.get(target).get(propertyKey);
}

export function createMetadataMap(target: Target, propertyKey?: PropertyKey): Map<MetadataKey, MetadataValue> {
  const targetMetadata = new Map<PropertyKey | undefined, Map<MetadataKey, MetadataValue>>();
  Metadata.set(target, targetMetadata);
  const metadataMap = new Map<MetadataKey, MetadataValue>();
  targetMetadata.set(propertyKey, metadataMap);
  return metadataMap;
}
