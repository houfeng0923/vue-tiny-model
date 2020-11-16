
import { computed, reactive, UnwrapRef } from '@vue/reactivity';

type ModelProps = {
  [key in string]: any;
};

type ModelContext = {
  model: UnwrapRef<ModelProps>;
};

type DefineProps<T> = {
  [K in keyof T]: any;
};

type InstanceProps<T> = Partial<DefineProps<T>>;

const computedMap = new WeakMap<any, Set<string>>();

/**
 * a decorate for collect get accessor in a class definition.
 * if not use it , getter is no reactive field, in other word,  filed can't be cached.
 */
export function getter(target, propertyKey: string) {
  target = target.constructor;
  let cache = computedMap.get(target);
  if (!cache) { computedMap.set(target, (cache = new Set())); }
  if (!cache.has(propertyKey)) {
    cache.add(propertyKey)
  }
}

/**
 * turn a normal class to reactive class.
 * all defined fields without accessor (getter/setter)  will be auto tracking.
 * for getter , you can use `@getter` for it;
 * @param constructor
 */
export function model<T extends { new(...args: any[]): unknown }>(constructor: T) {
  const Base = function (props) {
    const proxy = instance(constructor, props);
    return proxy;
  } as unknown as T;
  Base.prototype.constructor = constructor;
  return Base;
}

function validateProps<S, T>(definedProps: DefineProps<T>, instanceProps: InstanceProps<S>) {
  if (!instanceProps) {return;}
  const whiteList = Object.keys(definedProps);
  Object.keys(instanceProps).forEach((k) => {
    if (whiteList.indexOf(k) === -1) { throw new Error(`${k} is not declared prop`); }
  });
}


function instance<T>(constructor, props) {
  const base = new constructor(props);
  validateProps(base, props);
  const context = {
    model: reactive(base),
  } as ModelContext;
  const proto = Object.getPrototypeOf(base);
  const getterKeys = computedMap.get(constructor) || new Set();
  Array.from(getterKeys)?.forEach((k: string) => {
    const descriptor = Object.getOwnPropertyDescriptor(proto, k);
    const get = descriptor?.get && (() => descriptor?.get?.apply(context.model));
    const set = descriptor?.set && ((v: any) => descriptor?.set?.call(context.model, v));
    if (get) {
      const value = set ? computed({ get, set }) : computed(get);
      Object.defineProperty(context.model, k, {
        value,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    }
  });

  return context.model as UnwrapRef<T>;
}

