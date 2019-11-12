import combineReducers from "../src/combinereducers";

const actions = {
  ADD: 'ADD',
  SUBTRACT: 'SUBTRACT',
};

const reducer1 = (state = {}, action, extraData = { one: "one" }) => {
  switch (action.type) {
    case actions.ADD:
      return {
        ...state,
        one: extraData.one
      };
    default:
      return state;
  }
};

const reducer2 = (state = {}, action, extraData = { two: "two" }, moreData = "three") => {
  switch (action.type) {
    case actions.ADD:
      return {
        ...state,
        two: extraData.two,
        three: moreData
      };
    default:
      return state;
  }
};

let combinedReducer = combineReducers({
  reducer1,
  reducer2,
});

describe("combineReducer tests", () => {

  it("should return default state", () => expect(combinedReducer({
    four: "four",
    reducer1: 0,
    reducer2: 0
  }, {
    type: actions.ADD
  })).toEqual({
    four: "four",
    reducer1: {
      one: "one"
    },
    reducer2: {
      two: "two",
      three: "three"
    }
  }));

  it("should return combined state", () => expect(combinedReducer({
    four: 4
  }, {
    type: actions.ADD
  }, {
    one: 1,
    two: 2
  }, 3)).toEqual({
    four: 4,
    reducer1: {
      one: 1
    },
    reducer2: {
      two: 2,
      three: 3
    }
  }));

  it("should return the same state object passed to it", () => {
    const initialState = {
      four: 4,
      reducer1: {
        one: "one"
      },
      reducer2: {
        two: "two",
        three: "three"
      }
    };
    const finalState = combinedReducer(initialState, {
      type: actions.SUBTRACT
    }, {
      one: 1,
      two: 2
    }, 3);
    expect(finalState === initialState).toEqual(true);
  });

});