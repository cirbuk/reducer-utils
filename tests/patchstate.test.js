import { patchState } from "../src/index";

describe("Object tests", () => {
  it("Value test 1", () => {
    const state = {
      one: 1
    };
    const patch = {
      three: {
        four: 4
      }
    };
    const newState = patchState(state, undefined, patch);
    expect(newState).toEqual({
      ...state,
      ...patch
    });
  });

  it("Value test 2", () => {
    const state = {
      one: 1
    };
    const patch = {
      three: {
        four: 4
      }
    };
    const newState = patchState(state, { at: 1 }, patch);
    expect(newState).toEqual({
      ...state,
      ...patch
    });
  });

  it("Identity test", () => {
    const state = {
      one: 1
    };
    const patch = {
      three: {
        four: 4
      }
    };
    const newState = patchState(state, undefined, patch);
    expect(newState !== state).toEqual(true);
  });
});

describe("Array append tests", () => {
  it("Value test", () => {
    const state = [{
      one: 1
    }, {
      two: 2
    }];
    const patch = [{
      three: 3
    }];
    const newState = patchState(state, undefined, patch);
    expect(newState).toEqual([
      ...state,
      ...patch
    ]);
  });

  it("Identity test 1", () => {
    const state = [{
      one: 1
    }, {
      two: 2
    }];
    const patch = [{
      three: 3
    }];
    const newState = patchState(state, undefined, patch);
    expect(
      newState !== state &&
      newState[0] === state[0] &&
      newState[1] === state[1] &&
      newState[2] !== patch[0]
    ).toEqual(true);
  });

  it("Identity test 2", () => {
    const state = [{
      one: 1
    }, {
      two: 2
    }];
    const newState = patchState(state, undefined, []);
    expect(
      newState !== state
      && newState[0] === state[0]
      && newState[1] === state[1]
    ).toEqual(true);
  });

});

describe("Array prepend tests", () => {
  it("Value test", () => {
    const state = [{
      one: 1
    }, {
      two: 2
    }];
    const patch = {
      three: 3
    };
    const newState = patchState(state, { at: 0 }, patch);
    expect(newState).toEqual([
      patch,
      ...state
    ]);
  });

  it("Identity test 1", () => {
    const state = [{
      one: 1
    }, {
      two: 2
    }];
    const patch = {
      three: 3
    };
    const newState = patchState(state, { at: 0 }, patch);
    expect(
      newState !== state &&
      newState[0] !== patch &&
      newState[1] === state[0] &&
      newState[2] === state[1]
    ).toEqual(true);
  });

  it("Identity test 2", () => {
    const state = [{
      one: 1
    }, {
      two: 2
    }];
    const newState = patchState(state, { at: 0 }, []);
    expect(
      newState !== state
      && newState[0] === state[0]
      && newState[1] === state[1]
    ).toEqual(true);
  });

});

describe("Array insert tests", () => {
  it("Value test", () => {
    const state = [{
      one: 1
    }, {
      two: 2
    }];
    const patch = {
      three: 3
    };
    const newState = patchState(state, { at: 1 }, patch);
    expect(newState).toEqual([{
      one: 1
    }, {
      three: 3
    }, {
      two: 2
    }]);
  });

  it("Identity test 1", () => {
    const state = [{
      one: 1
    }, {
      two: 2
    }];
    const patch = {
      three: 3
    };
    const newState = patchState(state, { at: 1 }, patch);
    expect(
      newState !== state &&
      newState[0] === state[0] &&
      newState[1] !== patch &&
      newState[2] === state[1]
    ).toEqual(true);
  });

  it("Identity test 2", () => {
    const state = [{
      one: 1
    }, {
      two: 2
    }];
    const newState = patchState(state, { at: 1 }, []);
    expect(
      newState !== state
      && newState[0] === state[0]
      && newState[1] === state[1]
    ).toEqual(true);
  });

});

describe("Array insert path tests", () => {
  it("Value test", () => {
    const state = {
      path1: {
        path2: [{
          one: 1
        }, {
          two: 2
        }]
      }
    };
    const patch = {
      three: 3
    };
    const newState = patchState(state, { path: "path1.path2", at: 1 }, patch);
    expect(newState).toEqual({
      path1: {
        path2: [{
          one: 1
        }, {
          three: 3
        }, {
          two: 2
        }]
      }
    });
  });

  it("Value test 2", () => {
    const state = {
      path1: {
        path2: [{
          one: 1
        }, {
          two: 2
        }]
      }
    };
    const patch = {
      three: 3
    };
    const newState = patchState(state, { path: "path1.path2", at: 5 }, patch);
    expect(newState).toEqual({
      path1: {
        path2: [{
          one: 1
        }, {
          two: 2
        }, undefined, undefined, undefined, {
          three: 3
        }]
      }
    });
  });

  it("Identity test 1", () => {
    const state = {
      path1: {
        path2: [{
          one: 1
        }, {
          two: 2
        }]
      }
    };
    const patch = {
      three: 3
    };
    const newState = patchState(state, { path: "path1.path2", at: 1 }, patch);
    expect(
      newState !== state &&
      newState.path1 !== state.path1 &&
      newState.path1.path2 !== state.path1.path2 &&
      newState.path1.path2[0] === state.path1.path2[0] &&
      newState.path1.path2[1] !== patch &&
      newState.path1.path2[2] === state.path1.path2[1]
    ).toEqual(true);
  });

  it("Identity test 2", () => {
    const state = {
      path1: {
        path2: [{
          one: 1
        }, {
          two: 2
        }]
      }
    };
    const newState = patchState(state, { path: "path1.path2", at: 1 });
    expect(
      newState === state &&
      newState.path1 === state.path1 &&
      newState.path1.path2 === state.path1.path2 &&
      newState.path1.path2[0] === state.path1.path2[0] &&
      newState.path1.path2[1] === state.path1.path2[1]
    ).toEqual(true);
  });

});

describe("Path creation tests", () => {
  it("Should create object path and patch", () => {
    const state = {
      one: 1
    };
    const patch = {
      four: {
        five: 4
      }
    };
    const newState = patchState(state, 'two.three', patch);
    expect(newState).toEqual({
      one: 1,
      two: {
        three: {
          four: {
            five: 4
          }
        }
      }
    });
  });

  it("Should create object/array path and patch", () => {
    const state = {
      one: 1
    };
    const patch = {
      four: {
        five: 4
      }
    };
    const newState = patchState(state, 'two.0.three.1', patch);
    expect(newState).toEqual({
      one: 1,
      two: [
        {
          three: [
            undefined,
            {
              four: {
                five: 4
              }
            }
          ]
        }
      ]
    });
  });
});