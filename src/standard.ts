export type MetadataKey = string | symbol;
export type MemberKey = string | symbol;

type Placement = 'class' | 'static' | 'instance';
type MetadataMap = Map<MetadataKey, unknown>;

// TypeScript and Babel only create context.metadata when Symbol.metadata exists.
if (typeof Symbol.metadata !== 'symbol') {
  Object.defineProperty(Symbol, 'metadata', {
    value: Symbol('Symbol.metadata'),
  });
}
if (!Object.hasOwn(Function.prototype, Symbol.metadata)) {
  Object.defineProperty(Function.prototype, Symbol.metadata, { value: null });
}

// Keyed by the class's metadata object, so nothing is written to the shared public object.
const Metadata = new WeakMap<
  object,
  Map<Placement, Map<MemberKey | undefined, MetadataMap>>
>();

function isObject(value: unknown): value is object {
  return (
    (typeof value === 'object' && value !== null) || typeof value === 'function'
  );
}

function getMetadataMap(
  metadataObject: object,
  placement: Placement,
  memberKey: MemberKey | undefined,
  create: boolean,
): MetadataMap | undefined {
  let placements = Metadata.get(metadataObject);
  if (!placements) {
    if (!create) {
      return undefined;
    }
    placements = new Map();
    Metadata.set(metadataObject, placements);
  }
  let members = placements.get(placement);
  if (!members) {
    if (!create) {
      return undefined;
    }
    members = new Map();
    placements.set(placement, members);
  }
  let metadataMap = members.get(memberKey);
  if (!metadataMap && create) {
    metadataMap = new Map();
    members.set(memberKey, metadataMap);
  }
  return metadataMap;
}

// Mirrors reflect-metadata targets: the class for class and static members, the prototype or an instance for instance members.
function locate(
  target: unknown,
  memberKey: MemberKey | undefined,
  own: boolean,
): [object | undefined, Placement] {
  if (!isObject(target)) {
    throw new TypeError();
  }
  if (typeof target === 'function') {
    return [
      metadataObjectOf(target, own),
      memberKey === undefined ? 'class' : 'static',
    ];
  }
  if (
    memberKey === undefined ||
    (own && !Object.hasOwn(target, 'constructor'))
  ) {
    return [undefined, 'instance'];
  }
  const constructor: unknown = (target as { constructor?: unknown })
    .constructor;
  return [
    typeof constructor === 'function'
      ? metadataObjectOf(constructor, own)
      : undefined,
    'instance',
  ];
}

function metadataObjectOf(target: Function, own: boolean): object | undefined {
  if (own && !Object.hasOwn(target, Symbol.metadata)) {
    return undefined;
  }
  const metadataObject: unknown = target[Symbol.metadata];
  return isObject(metadataObject) ? metadataObject : undefined;
}

function* metadataMaps(
  target: unknown,
  memberKey: MemberKey | undefined,
): Generator<MetadataMap> {
  const [start, placement] = locate(target, memberKey, false);
  for (
    let metadataObject = start;
    metadataObject;
    metadataObject = Object.getPrototypeOf(metadataObject) ?? undefined
  ) {
    const metadataMap = getMetadataMap(
      metadataObject,
      placement,
      memberKey,
      false,
    );
    if (metadataMap) {
      yield metadataMap;
    }
  }
}

function ownMetadataMap(
  target: unknown,
  memberKey: MemberKey | undefined,
): MetadataMap | undefined {
  const [metadataObject, placement] = locate(target, memberKey, true);
  return metadataObject
    ? getMetadataMap(metadataObject, placement, memberKey, false)
    : undefined;
}

export function metadata(metadataKey: MetadataKey, metadataValue: unknown) {
  return function decorator(_value: unknown, context: DecoratorContext): void {
    if (!isObject(context) || !('kind' in context)) {
      throw new TypeError(
        '@abraham/reflection/standard requires standard decorators; use @abraham/reflection with experimentalDecorators',
      );
    }
    if (!isObject(context.metadata)) {
      throw new TypeError(
        'context.metadata is missing; import @abraham/reflection/standard before defining decorated classes',
      );
    }
    const placement: Placement =
      context.kind === 'class'
        ? 'class'
        : context.static
          ? 'static'
          : 'instance';
    const memberKey = context.kind === 'class' ? undefined : context.name;
    getMetadataMap(context.metadata, placement, memberKey, true)!.set(
      metadataKey,
      metadataValue,
    );
  };
}

export function getOwnMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  target: object,
  memberKey?: MemberKey,
): MetadataValue | undefined {
  return ownMetadataMap(target, memberKey)?.get(metadataKey) as
    MetadataValue | undefined;
}

export function hasOwnMetadata(
  metadataKey: MetadataKey,
  target: object,
  memberKey?: MemberKey,
): boolean {
  return ownMetadataMap(target, memberKey)?.has(metadataKey) ?? false;
}

export function getOwnMetadataKeys(
  target: object,
  memberKey?: MemberKey,
): MetadataKey[] {
  return [...(ownMetadataMap(target, memberKey)?.keys() ?? [])];
}

export function getMetadata<MetadataValue>(
  metadataKey: MetadataKey,
  target: object,
  memberKey?: MemberKey,
): MetadataValue | undefined {
  for (const metadataMap of metadataMaps(target, memberKey)) {
    if (metadataMap.has(metadataKey)) {
      return metadataMap.get(metadataKey) as MetadataValue;
    }
  }
  return undefined;
}

export function hasMetadata(
  metadataKey: MetadataKey,
  target: object,
  memberKey?: MemberKey,
): boolean {
  for (const metadataMap of metadataMaps(target, memberKey)) {
    if (metadataMap.has(metadataKey)) {
      return true;
    }
  }
  return false;
}

export function getMetadataKeys(
  target: object,
  memberKey?: MemberKey,
): MetadataKey[] {
  const keys = new Set<MetadataKey>();
  for (const metadataMap of metadataMaps(target, memberKey)) {
    for (const key of metadataMap.keys()) {
      keys.add(key);
    }
  }
  return [...keys];
}
