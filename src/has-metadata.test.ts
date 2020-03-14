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
