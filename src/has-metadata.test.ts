import './index';

test('with invalid target', () => {
  const target: any = undefined;
  expect(() => Reflect.hasMetadata('key', target)).toThrow(TypeError);
});

test('when not defined', () => {
  const target = {};
  expect(Reflect.hasMetadata('key', target)).toBeFalsy();
});

test('when defined', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target);
  expect(Reflect.hasMetadata('key', target)).toBeTruthy();
});

test('when defined on prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype);
  expect(Reflect.hasMetadata('key', target)).toBeTruthy();
});

test('with key and not defined', () => {
  const target = {};
  expect(Reflect.hasMetadata('key', target, 'name')).toBeFalsy();
});

test('with key and defined', () => {
  const target = {};
  Reflect.defineMetadata('key', 'value', target, 'name');
  expect(Reflect.hasMetadata('key', target, 'name')).toBeTruthy();
});

test('when defined on prototype with a property key', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', 'value', prototype, 'name');
  expect(Reflect.hasMetadata('key', target, 'name')).toBeTruthy();
});

test.each([0, false, '', null, NaN, undefined])('when value is %p', (value) => {
  const target = {};
  Reflect.defineMetadata('key', value, target, 'name');
  expect(Reflect.hasMetadata('key', target, 'name')).toBe(true);
  expect(Reflect.hasOwnMetadata('key', target, 'name')).toBe(true);
});

test('when value is undefined on prototype', () => {
  const prototype = {};
  const target = Object.create(prototype);
  Reflect.defineMetadata('key', undefined, prototype);
  expect(Reflect.hasMetadata('key', target)).toBe(true);
  expect(Reflect.hasOwnMetadata('key', target)).toBe(false);
});

test('hasOwnMetadata with invalid target', () => {
  const target: any = undefined;
  expect(() => Reflect.hasOwnMetadata('key', target)).toThrow(TypeError);
});
