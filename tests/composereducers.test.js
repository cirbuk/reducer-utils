import { composeReducers } from "../src/index";

const actions = {
  ADD: 'ADD',
  SUBTRACT: 'SUBTRACT',
};

const reducer1 = (state = {}, action) => {
  switch (action.type) {
    case actions.ADD:
      return {
        ...state,
        one: 1
      };
    default:
      return state;
  }
};

const reducer2 = (state = {}, action) => {
  switch (action.type) {
    case actions.ADD:
      return {
        ...state,
        two: 2
      };
    default:
      return state;
  }
};

const reducer3 = (state = {}, action) => {
  switch (action.type) {
    case actions.ADD:
      return {
        ...state,
        three: 3
      };
    default:
      return state;
  }
};

describe("composedReducer tests", () => {
  let composedReducer = composeReducers([
    reducer1,
    reducer2,
    reducer3
  ], {
    four: 4
  });

  it("Should return default value", () => expect(composedReducer()).toEqual({ four: 4 }));

  it("Should return final state from composed reducer", () => expect(composedReducer({ four: 4 }, {
    type: actions.ADD,
  })).toEqual({
    four: 4,
    one: 1,
    two: 2,
    three: 3
  }));

  it("Should return unchanged state from composed reducer", () => {
    const initialState = {
      four: 4
    };
    const finalState = composedReducer({
      four: 4
    }, {
      type: actions.SUBTRACT,
    });
    expect(finalState).toEqual(initialState);
  });

  it("Should return exact state object from composed reducer(identity test)", () => {
    const initialState = {
      four: 4
    };
    const finalState = composedReducer(initialState, {
      type: actions.SUBTRACT,
    });
    expect(finalState === initialState).toEqual(true);
  });
});