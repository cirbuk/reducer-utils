import combineReducers from "../src/combinereducers";

const reducer1 = (state = {}, action = {}, otherState) => {
  if (otherState) {
    return otherState.test2;
  } else {
    return 0;
  }
};

const reducer2 = (state = {}, action = {}, otherState) => {
  if (otherState) {
    return otherState.test1;
  } else {
    return 0;
  }
};

const combinedReducer = combineReducers({
  reducer1,
  reducer2
});

describe("combineReducer tests", () => {

  it("should return default state", () => expect(combinedReducer({}, {})).toEqual({
    reducer1: 0,
    reducer2: 0
  }));

  it("should return state 1", () => expect(combinedReducer({}, {}, {
    test1: 1,
    test2: 2
  })).toEqual({
    reducer1: 2,
    reducer2: 1
  }));

});