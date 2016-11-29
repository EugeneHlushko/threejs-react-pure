import {
  SET_GAME_PAUSE,
} from './constants';

// The initial state of the App
const initialState = {
  paused: false,
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GAME_PAUSE:
      return {
        ...state,
        paused: action.payload,
      };
    default:
      return state;
  }
}

export default appReducer;