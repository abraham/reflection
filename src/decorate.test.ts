import { MemberDecorator, Reflection as Reflect } from './index';

test('with invalid decorators and target', () => {
  const decorators: any = undefined;
  const target = (): undefined => {
    return;
  };
  expect(() => Reflect.decorate(decorators, target)).toThrow(TypeError);
});

test('with no decorators', () => {
  const decorators: MemberDecorator[] = [];
  const target = (): undefined => {
    return;
  };
  expect(() => Reflect.decorate(decorators, target)).toThrow(TypeError);
});

test('with property and invalid decorators', () => {
  const decorators: any = undefined;
  const target = {};
  const property = 'name';
  expect(() => Reflect.decorate(decorators, target, property)).toThrow(
    TypeError,
  );
});

test('with property and invalid decorators and invalid target', () => {
  const decorators: PropertyDecorator[] = [];
  const target: any = 1;
  const property = 'name';
  expect(() => Reflect.decorate(decorators, target, property)).toThrow(
    TypeError,
  );
});

test('with property and descriptor and invalid decorators', () => {
  const decorators: any = undefined;
  const target = {};
  const property = 'name';
  const descriptor = {};
  expect(() =>
    Reflect.decorate(decorators, target, property, descriptor),
  ).toThrow(TypeError);
});

test('with decorators, property, and descriptor and invalid target', () => {
  const decorators: PropertyDecorator[] = [];
  const target: any = 1;
  const property = 'name';
  const descriptor = {};
  expect(() =>
    Reflect.decorate(decorators, target, property, descriptor),
  ).toThrow(TypeError);
});

test('with decorators, undefined property, and descriptor and invalid target', () => {
  const sent: Function[] = [];
  const decorators: any = [
    (target: Function): void => {
      sent.push(target);
    },
  ];
  const target: any = 1;
  const property = undefined;
  const descriptor = {};
  const result = Reflect.decorate(decorators, target, property, descriptor);
  expect(result).toBeUndefined();
});

test('executes decorators in reverse order for function', () => {
  const order: number[] = [];
  const decorators = [
    (): void => {
      order.push(0);
    },
    (): void => {
      order.push(1);
    },
  ];
  const target = (): undefined => {
    return;
  };
  Reflect.decorate(decorators, target);
  expect(order[0]).toEqual(1);
  expect(order[1]).toEqual(0);
});

test('executes decorators in reverse order for property', () => {
  const order: number[] = [];
  const decorators = [
    (): void => {
      order.push(0);
    },
    (): void => {
      order.push(1);
    },
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
    (): void => {
      order.push(0);
    },
    (): void => {
      order.push(1);
    },
  ];
  const target = {};
  const property = 'name';
  const descriptor = {};
  Reflect.decorate(decorators, target, property, descriptor);
  expect(order[0]).toEqual(1);
  expect(order[1]).toEqual(0);
});

test('applies decorators to function', () => {
  const a = (): undefined => {
    return;
  };
  const b = (): undefined => {
    return;
  };
  const decorators: any = [
    (): undefined => {
      return;
    },
    (): (() => undefined) => a,
    (): (() => undefined) => b,
  ];
  const target = (): undefined => {
    return;
  };
  const result = Reflect.decorate(decorators, target);
  expect(result).toStrictEqual(a);
});

test('applies decorators to target property', () => {
  const a = (): undefined => {
    return;
  };
  const b = (): undefined => {
    return;
  };
  const decorators: any = [
    (): undefined => {
      return;
    },
    (): (() => undefined) => a,
    (): (() => undefined) => b,
  ];
  const target = {};
  const property = 'name';
  const result = Reflect.decorate(decorators, target, property);
  expect(result).toStrictEqual(a);
});

test('applies decorators to target property with descriptor', () => {
  const a = (): undefined => {
    return;
  };
  const b = (): undefined => {
    return;
  };
  const decorators: any = [
    (): undefined => {
      return;
    },
    (): (() => undefined) => a,
    (): (() => undefined) => b,
  ];
  const target = {};
  const property = 'name';
  const descriptor = {};
  const result = Reflect.decorate(decorators, target, property, descriptor);
  expect(result).toStrictEqual(a);
});

test('decorate correct target for function', () => {
  const sent: Function[] = [];
  const a = (): undefined => {
    return;
  };
  const b = (): undefined => {
    return;
  };
  const decorators = [
    (target: Function): void => {
      sent.push(target);
    },
    (target: Function): void => {
      sent.push(target);
    },
    (target: Function): (() => undefined) => {
      sent.push(target);
      return a;
    },
    (target: Function): (() => undefined) => {
      sent.push(target);
      return b;
    },
  ];
  const target = (): undefined => {
    return;
  };
  Reflect.decorate(decorators, target);
  expect(sent[0]).toStrictEqual(target);
  expect(sent[1]).toStrictEqual(b);
  expect(sent[2]).toStrictEqual(a);
  expect(sent[3]).toStrictEqual(a);
});

test('decorate with property name correct target for function', () => {
  const sent: object[] = [];
  const decorators = [
    (target: object): void => {
      sent.push(target);
    },
    (target: object): void => {
      sent.push(target);
    },
    (target: object): void => {
      sent.push(target);
    },
    (target: object): void => {
      sent.push(target);
    },
  ];
  const target = {};
  const property = 'name';
  Reflect.decorate(decorators, target, property);
  expect(sent).toStrictEqual([target, target, target, target]);
});

test('decorate with property name correct target for functions with name', () => {
  const sent: PropertyKey[] = [];
  const decorators = [
    (_target: object, name: PropertyKey): void => {
      sent.push(name);
    },
    (_target: object, name: PropertyKey): void => {
      sent.push(name);
    },
    (_target: object, name: PropertyKey): void => {
      sent.push(name);
    },
    (_target: object, name: PropertyKey): void => {
      sent.push(name);
    },
  ];
  const target = {};
  const property = 'name';
  Reflect.decorate(decorators, target, property);
  expect(sent).toStrictEqual([property, property, property, property]);
});

test('decorate with property name and descriptor correct target for functions', () => {
  const sent: object[] = [];
  const a = {};
  const b = {};
  const decorators = [
    (target: object): void => {
      sent.push(target);
    },
    (target: object): void => {
      sent.push(target);
    },
    (target: object): object => {
      sent.push(target);
      return a;
    },
    (target: object): object => {
      sent.push(target);
      return b;
    },
  ];
  const target = {};
  const property = 'name';
  const descriptor = {};
  Reflect.decorate(decorators, target, property, descriptor);
  expect(sent).toStrictEqual([target, target, target, target]);
});

test('decorate with property name and descriptor correct target for functions with name', () => {
  const sent: PropertyKey[] = [];
  const a = {};
  const b = {};
  const decorators = [
    (_target: object, name: PropertyKey): void => {
      sent.push(name);
    },
    (_target: object, name: PropertyKey): void => {
      sent.push(name);
    },
    (_target: object, name: PropertyKey): object => {
      sent.push(name);
      return a;
    },
    (_target: object, name: PropertyKey): object => {
      sent.push(name);
      return b;
    },
  ];
  const target = {};
  const property = 'name';
  const descriptor = {};
  Reflect.decorate(decorators, target, property, descriptor);
  expect(sent).toStrictEqual([property, property, property, property]);
});

test('decorate with property name and descriptor correct target for functions with name and descriptor', () => {
  const sent: Array<PropertyDescriptor | undefined> = [];
  const a = {};
  const b = {};
  const decorators = [
    (
      _target: object,
      _name: PropertyKey,
      descriptor?: PropertyDescriptor,
    ): void => {
      sent.push(descriptor);
    },
    (
      _target: object,
      _name: PropertyKey,
      descriptor?: PropertyDescriptor,
    ): void => {
      sent.push(descriptor);
    },
    (
      _target: object,
      _name: PropertyKey,
      descriptor?: PropertyDescriptor,
    ): object => {
      sent.push(descriptor);
      return a;
    },
    (
      _target: object,
      _name: PropertyKey,
      descriptor?: PropertyDescriptor,
    ): object => {
      sent.push(descriptor);
      return b;
    },
  ];
  const target = {};
  const property = 'name';
  const descriptor = {};
  Reflect.decorate(decorators, target, property, descriptor);
  expect(sent).toStrictEqual([descriptor, b, a, a]);
});

test('decorate static property', () => {
  class StaticTest {
    getProp() {
      return;
    }

    static getStatic() {
      return;
    }
  }

  const descriptors: PropertyDescriptor[] = [];
  const decorators: any = [
    (_: object, _1: string | symbol, descriptor: PropertyDescriptor): void => {
      descriptors.push(descriptor);
    },
  ];

  Reflect.decorate(
    decorators,
    StaticTest,
    'getStatic',
    Object.getOwnPropertyDescriptor(StaticTest, 'getStatic'),
  );
  Reflect.decorate(
    decorators,
    StaticTest.prototype,
    'getProp',
    Object.getOwnPropertyDescriptor(StaticTest.prototype, 'getProp'),
  );

  expect(descriptors).not.toContain(undefined);
});
