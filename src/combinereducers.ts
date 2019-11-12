import { isFunction, isPlainObject, isUndefined } from '@kubric/litedash'
import { AnyAction, CombineOptions, ReducersMapObject, NonReducerKeysCache } from "./interfaces";

export const ActionTypes = {
  INIT: '@@redux/INIT'
};

const getUndefinedStateErrorMessage = (key: string, action: AnyAction) => {
  const actionType = action && action.type;
  const actionName = (actionType && `"${actionType.toString()}"`) || 'an action';

  return (
    `Given action ${actionName}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state. ` +
    `If you want this reducer to hold no value, you can return null instead of undefined.`
  )
};

const getUnexpectedStateShapeWarningMessage = (inputState: any, reducers: ReducersMapObject, action: AnyAction, nonReducerKeysCache: NonReducerKeysCache) => {
  const reducerKeys = Object.keys(reducers);
  const argumentName = action && action.type === ActionTypes.INIT ?
    'preloadedState argument passed to createStore' :
    'previous state received by the reducer';

  if(reducerKeys.length === 0) {
    return (
      'Store does not have a valid reducer. Make sure the argument passed ' +
      'to combineReducers is an object whose values are reducers.'
    )
  }

  if(!isPlainObject(inputState)) {
    return (
      `The ${argumentName} has unexpected type of "` +
      // @ts-ignore
      ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
      `". Expected argument to be an object with the following ` +
      `keys: "${reducerKeys.join('", "')}"`
    )
  }

  const nonReducerKeys = Object.keys(inputState).filter(key =>
    !reducers.hasOwnProperty(key) &&
    !nonReducerKeysCache[key]
  );

  nonReducerKeys.forEach(key => {
    nonReducerKeysCache[key] = true
  });

  if(nonReducerKeys.length > 0) {
    return (
      `Unexpected ${nonReducerKeys.length > 1 ? 'keys' : 'key'} ` +
      `"${nonReducerKeys.join('", "')}" found in ${argumentName}. ` +
      `Expected to find one of the known reducer keys instead: ` +
      `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    )
  }
};

const assertReducerShape = (reducers: ReducersMapObject) => {
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key];
    const initialState = reducer(undefined, { type: ActionTypes.INIT });

    if(isUndefined(initialState)) {
      throw new Error(
        `Reducer "${key}" returned undefined during initialization. ` +
        `If the state passed to the reducer is undefined, you must ` +
        `explicitly return the initial state. The initial state may ` +
        `not be undefined. If you don't want to set a value for this reducer, ` +
        `you can use null instead of undefined.`
      )
    }

    const type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if(isUndefined(reducer(undefined, { type }))) {
      throw new Error(
        `Reducer "${key}" returned undefined when probed with a random type. ` +
        `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
        `namespace. They are considered private. Instead, you must return the ` +
        `current state for any unknown actions, unless it is undefined, ` +
        `in which case you must return the initial state, regardless of the ` +
        `action type. The initial state may not be undefined, but can be null.`
      )
    }
  })
};

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
export default (reducers: ReducersMapObject, {
  ignoreNonReducerKeys
}: CombineOptions = { ignoreNonReducerKeys: false }) => {
  const reducerKeys = Object.keys(reducers);
  const finalReducers: ReducersMapObject = {};
  for(let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];

    if(process.env.NODE_ENV !== 'production') {
      if(isUndefined(reducers[key])) {
        console.error(`No reducer provided for key "${key}"`)
      }
    }

    if(isFunction(reducers[key])) {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);

  let nonReducerKeysCache: NonReducerKeysCache;
  if(process.env.NODE_ENV !== 'production') {
    nonReducerKeysCache = {}
  }

  let shapeAssertionError: Error;
  try {
    assertReducerShape(finalReducers)
  } catch(e) {
    shapeAssertionError = e
  }

  return (state: any = {}, action: AnyAction, ...extraArgs: any[]) => {
    if(shapeAssertionError) {
      throw shapeAssertionError
    }

    if(process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, nonReducerKeysCache);
      if(ignoreNonReducerKeys && warningMessage) {
        console.error(warningMessage)
      }
    }

    let hasChanged = false;
    const nextState: any = {};
    for(let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action, ...extraArgs);
      if(isUndefined(nextStateForKey)) {
        const errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    if(hasChanged) {
      const nonReducerKeys = Object.keys(nonReducerKeysCache);
      if(!ignoreNonReducerKeys && nonReducerKeys.length > 0) {
        nonReducerKeys.reduce((acc, key) => {
          acc[key] = state[key];
          return acc;
        }, nextState);
      }
      return nextState;
    } else {
      return state;
    }
  }
}
