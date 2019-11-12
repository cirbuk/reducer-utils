export interface ReduxAction {
  type?: string,
  [index: string]: any
}

export interface PatchStateOptions {
  path?: string,
  at?: number
}

export interface BatchedReducerOptions {
  payload?: string,
  type?: string
}

/**
 * An *action* is a plain object that represents an intention to change the
 * state. Actions are the only way to get data into the store. Any data,
 * whether from UI events, network callbacks, or other sources such as
 * WebSockets needs to eventually be dispatched as actions.
 *
 * Actions must have a `type` field that indicates the type of action being
 * performed. Types can be defined as constants and imported from another
 * module. It's better to use strings for `type` than Symbols because strings
 * are serializable.
 *
 * Other than `type`, the structure of an action object is really up to you.
 * If you're interested, check out Flux Standard Action for recommendations on
 * how actions should be constructed.
 */
export interface Action {
  type: any;
}

/**
 * An Action type which accepts any other properties.
 * This is mainly for the use of the `Reducer` type.
 * This is not part of `Action` itself to prevent users who are extending `Action.
 * @private
 */
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

export type Reducer<S> = (state: S, action: AnyAction, ...extraArgs: any[]) => S;

export interface ReducersMapObject {
  [key: string]: Reducer<any>;
}

export interface CombineOptions {
  ignoreNonReducerKeys?: boolean
}

export type NonReducerKeysCache = {
  [index: string]: boolean
}
