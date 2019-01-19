import { Reflection as Reflect } from './index';

test('with invalid decorators and target', () => {
  const decorators = undefined;
  const target = () => { return; };
  expect(() => Reflect.decorate(decorators, target)).toThrow(TypeError);
});

test('with no decorators', () => {
  const decorators = [];
  const target = () => { return; };
  expect(() => Reflect.decorate(decorators, target)).toThrow(TypeError);
});

test('with property and invalid decorators', () => {
  const decorators = undefined;
  const target = {};
  const property = 'name';
  expect(() => Reflect.decorate(decorators, target, property)).toThrow(TypeError);
});

test('with property and invalid decorators', () => {
  const decorators = [];
  const target = 1;
  const property = 'name';
  expect(() => Reflect.decorate(decorators, target, property)).toThrow(TypeError);
});

test('with property and descriptor and invalid decorators', () => {
  const decorators = undefined;
  const target = {};
  const property = 'name';
  const descriptor = {};
  expect(() => Reflect.decorate(decorators, target, property, descriptor)).toThrow(TypeError);
});

test('with decorators, property, and descriptor and invalid target ', () => {
  const decorators = [];
  const target = 1;
  const property = 'name';
  const descriptor = {};
  expect(() => Reflect.decorate(decorators, target, property, descriptor)).toThrow(TypeError);
});

test('executes decorators in reverse order for function', () => {
  const order: number[] = [];
  const decorators = [
    () => { order.push(0); },
    () => { order.push(1); },
  ];
  const target = () => { return; };
  Reflect.decorate(decorators, target);
  expect(order[0]).toEqual(1);
  expect(order[1]).toEqual(0);
});

test('executes decorators in reverse order for property', () => {
  const order: number[] = [];
  const decorators = [
    () => { order.push(0); },
    () => { order.push(1); },
  ];
  const target = {};
  const property = 'name';
  Reflect.decorate(decorators, target, property);
  expect(order[0]).toEqual(1);
  expect(order[1]).toEqual(0);
});

test('executes decorators in reverse order for property with descriptor', () => {
  const order: number[] = [];
  const decorators = [
    () => { order.push(0); },
    () => { order.push(1); },
  ];
  const target = {};
  const property = 'name';
  const descriptor = {};
  Reflect.decorate(decorators, target, property, descriptor);
  expect(order[0]).toEqual(1);
  expect(order[1]).toEqual(0);
});

test('something function', () => {
  const a = () => { return; };
  const b = () => { return; };
  const decorators = [
    () => { return; },
    () => a,
    () => b,
  ];
  const target = () => { return; };
  const result = Reflect.decorate(decorators, target);
  expect(result).toStrictEqual(a);
});

test('something property', () => {
  const a = () => { return; };
  const b = () => { return; };
  const decorators = [
    () => { return; },
    () => a,
    () => b,
  ];
  const target = {};
  const property = 'name';
  const result = Reflect.decorate(decorators, target, property);
  expect(result).toStrictEqual(a);
});

test('something property with descriptor', () => {
  const a = () => { return; };
  const b = () => { return; };
  const decorators = [
    () => { return; },
    () => a,
    () => b,
  ];
  const target = {};
  const property = 'name';
  const descriptor = function c() { return; };
  const result = Reflect.decorate(decorators, target, property, descriptor);
  expect(result).toStrictEqual(a);
});

test('decorate correct target for function', () => {
  const sent: Function[] = [];
  const a = () => { return; };
  const b = () => { return; };
  const decorators = [
    (target: Function) => { sent.push(target); },
    (target: Function) => { sent.push(target); },
    (target: Function) => { sent.push(target); return a; },
    (target: Function) => { sent.push(target); return b; },
  ];
  const target = () => { return; };
  Reflect.decorate(decorators, target);
  expect(sent[0]).toStrictEqual(target);
  expect(sent[1]).toStrictEqual(b);
  expect(sent[2]).toStrictEqual(a);
  expect(sent[3]).toStrictEqual(a);
});

test('decorate correct target for function', () => {
  const sent: object[] = [];
  const decorators = [
    (target: object) => { sent.push(target); },
    (target: object) => { sent.push(target); },
    (target: object) => { sent.push(target); },
    (target: object) => { sent.push(target); },
  ];
  const target = {};
  const property = 'name';
  Reflect.decorate(decorators, target, property);
  expect(sent).toStrictEqual([target, target, target, target]);
});

// DecoratorCorrectNameInPipelineForPropertyOverload
test('decorate correct target for function', () => {
  const sent: string[] = [];
  const decorators = [
    (target: object, name: string) => { sent.push(name); },
    (target: object, name: string) => { sent.push(name); },
    (target: object, name: string) => { sent.push(name); },
    (target: object, name: string) => { sent.push(name); },
  ];
  const target = {};
  const property = 'name';
  Reflect.decorate(decorators, target, property);
  expect(sent).toStrictEqual([property, property, property, property]);
});

test('decorate correct target for function', () => {
  const sent: object[] = [];
  const a = {};
  const b = {};
  const decorators = [
    (target: object) => { sent.push(target); },
    (target: object) => { sent.push(target); },
    (target: object) => { sent.push(target); return a; },
    (target: object) => { sent.push(target); return b; },
  ];
  const target = {};
  const property = 'name';
  const descriptor = {};
  Reflect.decorate(decorators, target, property, descriptor);
  expect(sent).toStrictEqual([target, target, target, target]);
});

test('decorate correct target for function', () => {
  const sent: string[] = [];
  const a = {};
  const b = {};
  const decorators = [
    (target: object, name: string) => { sent.push(name); },
    (target: object, name: string) => { sent.push(name); },
    (target: object, name: string) => { sent.push(name); return a; },
    (target: object, name: string) => { sent.push(name); return b; },
  ];
  const target = {};
  const property = 'name';
  const descriptor = {};
  Reflect.decorate(decorators, target, property, descriptor);
  expect(sent).toStrictEqual([property, property, property, property]);
});

test('decorate correct target for function', () => {
  const sent: PropertyDescriptor[] = [];
  const a = {};
  const b = {};
  const decorators = [
    (target: object, name: string, descriptor: PropertyDescriptor) => { sent.push(descriptor); },
    (target: object, name: string, descriptor: PropertyDescriptor) => { sent.push(descriptor); },
    (target: object, name: string, descriptor: PropertyDescriptor) => { sent.push(descriptor); return a; },
    (target: object, name: string, descriptor: PropertyDescriptor) => { sent.push(descriptor); return b; },
  ];
  const target = {};
  const property = 'name';
  const descriptor = {};
  Reflect.decorate(decorators, target, property, descriptor);
  expect(sent).toStrictEqual([descriptor, b, a, a]);
});
