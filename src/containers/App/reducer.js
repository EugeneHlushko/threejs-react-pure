import {
  SET_GAME_PAUSE,
} from './constants';

// The initial state of the App
const initialState = {
  gamePaused: false,
  loading: false,
  error: false,
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GAME_PAUSE:
      return {
        ...state,
        gamePaused: action.payload,
      };
    default:
      return state;
  }
}

export default appReducer;