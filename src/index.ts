import { ReduxAction, PatchStateOptions, BatchedReducerOptions } from "./interfaces";
import { get, isString, isPlainObject, isUndefined, set, isNull } from "@kubric/litedash";

export const composeReducers = (reducers: Array<Function> = [], defaultState: any): Function =>
  (state: any = defaultState, action: ReduxAction = {}) => reducers.reduce((state: any, reducer: Function) => reducer(state, action), state);

export const batchedActionReducer = (reducer: Function, {
  type = "BATCHED_ACTION",
  payload: payloadPath = "payload"
}: BatchedReducerOptions = {}): Function =>
  (state: any, action: ReduxAction = {}) => {
    if(action.type === type) {
      let payload = get(action, payloadPath, []);
      if(!Array.isArray(payload)) {
        payload = [payload];
      }
      return payload.reduce(reducer, state);
    } else {
      return reducer(state, action);
    }
  };

const patchByType = (src: string | Array<any> | object, dest?: string | Array<any> | object, at?: number | undefined) => {
  const error = new Error(`source and destination types do not match`);
  const isDestUndefined = isUndefined(dest);
  const isAtUndefined = isUndefined(at);
  !isDestUndefined && (dest = JSON.parse(JSON.stringify(dest)));
  // @ts-ignore
  let parsedAt: number = isAtUndefined ? -1 : isNaN(+at) ? -1 : +at;
  if(isString(src)) {
    isDestUndefined && (dest = '');
    isAtUndefined && (parsedAt = (src as string).length);
  } else if(Array.isArray(src)) {
    if(isDestUndefined) {
      dest = []
    } else if(!Array.isArray(dest)) {
      dest = [dest];
    }
    if(parsedAt > src.length) {
      dest = [
        ...(new Array(parsedAt - src.length)),
        ...(dest as Array<any>)
      ];
    }
    isAtUndefined && (parsedAt = src.length);
  } else if(isPlainObject(src)) {
    isDestUndefined && (dest = {});
    parsedAt = -1;
  } else {
    throw error;
  }
  if(isString(src) && isString(dest)) {
    return `${(src as string).slice(0, parsedAt)}${dest}${(src as string).slice(parsedAt)}`;
  } else if(Array.isArray(src) && Array.isArray(dest)) {
    return [
      ...src.slice(0, parsedAt),
      ...dest,
      ...src.slice(parsedAt)
    ];
  } else if(isPlainObject(src) && isPlainObject(dest)) {
    return {
      ...(src as object),
      ...(dest as object),
    }
  } else {
    throw error;
  }
};

export const patchState = (state: any, options: PatchStateOptions | string = {}, patch: any) => {
  if(isString(options)) {
    options = {
      path: options
    } as PatchStateOptions;
  }
  const { path = '', at: insertAt } = options as PatchStateOptions;
  if(isUndefined(patch)) {
    return state;
  } else if(isNull(path) || path.length === 0) {
    return patchByType(state, patch, insertAt);
  } else {
    const pathBeforeLast = path.split('.');
    const lastPath = pathBeforeLast.pop();
    let newState = patchByType(state);
    let statePointer: any = newState;
    let currentPath = pathBeforeLast.shift();
    while(!isUndefined(currentPath)) {
      const nextPath = pathBeforeLast.length > 0 ? pathBeforeLast[0] : lastPath;
      // @ts-ignore
      const isArray = !isNaN(+nextPath);
      set(statePointer, currentPath, patchByType(statePointer[currentPath as string] || (isArray ? [] : {})), {
        create: true
      });
      statePointer = statePointer[currentPath as string];
      currentPath = pathBeforeLast.shift();
    }
    const currentData = get(state, path, {});
    set(newState, path, patchByType(currentData, patch, insertAt));
    return newState;
  }
};