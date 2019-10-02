import { batchedActionReducer } from "../src/index";

const actions = {
  ONE: 'ONE',
  TWO: 'TWO',
  THREE: 'THREE'
};

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case actions.ONE:
      return {
        ...state,
        one: 1
      };
    case actions.TWO:
      return {
        ...state,
        two: 2
      };
    case actions.THREE:
      return {
        ...state,
        three: 3
      };
    default:
      return state;
  }
};

describe("batchedActionReducer tests", () => {
  let batchedReducer = batchedActionReducer(reducer);

  it("Should return default value", () => expect(batchedReducer()).toEqual({}));

  it("Should return combined values without options", () => expect(batchedReducer({ four: 4 }, {
    type: "BATCHED_ACTION",
    payload: [{
      type: actions.ONE
    }, {
      type: actions.TWO
    }]
  })).toEqual({
    four: 4,
    one: 1,
    two: 2
  }));

  it("Should return default value", () => expect(batchedActionReducer(reducer, {
    payload: "data",
    type: "BATCHED"
  })({ four: 4 }, {
    type: "BATCHED",
    data: [{
      type: actions.ONE
    }, {
      type: actions.TWO
    }, {
      type: actions.THREE
    }]
  })).toEqual({
    one: 1,
    two: 2,
    three: 3,
    four: 4
  }));
});