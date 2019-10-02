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