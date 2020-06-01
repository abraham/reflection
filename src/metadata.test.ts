import './index';

const metadataKey = 'key';
const metadataValue = 'value';
const decorator = Reflect.metadata(metadataKey, metadataValue);
const propertyKey = 'name';

test('returns function', () => {
  expect(typeof Reflect.metadata(metadataKey, metadataValue)).toEqual(
    'function',
  );
});

test('with invalid target', () => {
  const target: any = undefined;
  expect(() => decorator(target, propertyKey)).toThrow(TypeError);
});

test('with invalid property key', () => {
  const target = {};
  const invalidPropertyKey: any = {};
  expect(() => decorator(target, invalidPropertyKey)).toThrow(TypeError);
});

test('with target and without property key', () => {
  const target = (): undefined => {
    return;
  };
  decorator(target);
  expect(Reflect.hasOwnMetadata(metadataKey, target)).toBeTruthy();
});

test('with target and propery key', () => {
  const target = {};
  decorator(target, propertyKey);
  expect(Reflect.hasOwnMetadata(metadataKey, target, propertyKey)).toBeTruthy();
});

test('with target and multiple properties', () => {
  const target = {};
  decorator(target, 'name1');
  decorator(target, 'name2');
  expect(Reflect.hasOwnMetadata(metadataKey, target, 'name1')).toBeTruthy();
  expect(Reflect.hasOwnMetadata(metadataKey, target, 'name2')).toBeTruthy();
});
