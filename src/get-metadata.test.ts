import './index';

test('with invalid target', () => {
  const target: any = undefined;
  expect(() => Reflect.getMetadata('key', target)).toThrow(TypeError);
});

test('when not defined', () => {
  const target = {};
  expect(Reflect.getMetadata('key', target)).toEqual(undefined);
});

test('when defined', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target);
  expect(Reflect.getMetadata('key', target)).toEqual('value');
});

test('when defined on prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype);
  expect(Reflect.getMetadata('key', target)).toEqual('value');
});

test('with key and not defined', () => {
  const target = {};
  expect(Reflect.getMetadata('key', target, 'name')).toEqual(undefined);
});

test('with key and defined', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target, 'name');
  expect(Reflect.getMetadata('key', target, 'name')).toEqual('value');
});

test('when defined on prototype with a property key', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype, 'name');
  expect(Reflect.getMetadata('key', target, 'name')).toEqual('value');
});

test.each([0, false, '', null, NaN, undefined])('when value is %p', (value) => {
  const target = {};
  Reflect.defineMetadata('key', value, target, 'name');
  expect(Reflect.getMetadata('key', target, 'name')).toBe(value);
});

test('when own value is undefined it shadows the prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype);
  Reflect.defineMetadata('key', undefined, target);
  expect(Reflect.getMetadata('key', target)).toBeUndefined();
});
