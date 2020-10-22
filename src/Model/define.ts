import { computed, ComputedRef, reactive, toRefs, UnwrapRef } from '@vue/reactivity';


type Getter<T = any> = (this: T, ctx?: any) => any;

type Setter<T = any> = (this: T, v: any) => void;

type Options<T = any> = {
  get: Getter<T>;
  set?: Setter<T>;
};

type ModelProps = {
  [key in string]: any;
};

type ModelContext = {
  model: UnwrapRef<ModelProps>;
};

type TypeFlag<T> = {
  __type__: string;
} & Options<T>;


type DefineProps<T> = Partial<{
  [K in keyof T]: any;
}>;

type CombinedModelInstance<T> = UnwrapRef<T> & {
  reopen: () => void;
};


interface ModelConstructor<T> {
  new(props: DefineProps<T>): CombinedModelInstance<T>;
}


export function defineModel<T extends ModelProps>(defineProps: DefineProps<T>): ModelConstructor<T> {

  function instance<T>(props: DefineProps<T>): UnwrapRef<T> {
    const context = {} as ModelContext;
    const modelObj = {} as ModelProps;
    const methods = {} as ModelProps;
    const binds = {} as ModelProps;
    Object.entries(defineProps).forEach(([k, v]) => {
      v = props[k] !== undefined ? props[k] : v;
      if (typeof v === 'function') {
        methods[k] = v;
      } else if (v && v.__type__ === 'computed') {
        binds[k] = v;
      } else {
        modelObj[k] = v;
      }
    });
    context.model = reactive(modelObj);
    const extraProps = Object.keys(binds).reduce<ModelProps>((r, k) => {
      r[k] = createComputedProp(context, binds[k]);
      return r;
    }, {});
    const extraMethods = Object.keys(methods).reduce<ModelProps>((r, k) => {
      r[k] = () => methods[k].apply(context.model);
      return r;
    }, {});
    context.model = reactive({
      ...toRefs(context.model),
      ...extraProps,
    });
    return Object.assign(context.model, extraMethods) as UnwrapRef<T>;
  }

  return class {
    constructor(props: T) {
      return instance(props);
    }
  } as ModelConstructor<T>;
}

export function bind<T = any>(options: Options<T>): TypeFlag<T>;
export function bind<T = any>(options: Getter<T>): TypeFlag<T>;
export function bind<T>(options: any): TypeFlag<T> {
  let get: Getter<T>;
  let set: Setter<T> | undefined;
  if (options.get) {
    get = options.get;
    set = options.set;
  } else {
    get = options as unknown as Getter<T>;
  }
  return {
    __type__: 'computed',
    get,
    set,
  };
}


function createComputedProp<T>(context: ModelContext, v: Options<T>): ComputedRef<T> {
  const get: Getter<any> = v.get;
  const set: Setter<any> | undefined = v.set;
  return computed({
    get: () => get.apply(context.model),
    set: set ? (...args: any) => set!.apply(context.model, args) : undefined,
  } as any );
}

// todo
// function listen() {}
