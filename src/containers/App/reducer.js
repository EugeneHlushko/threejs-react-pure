import {
  SET_GAME_PAUSE,
  SET_GAME_LOADING,
} from './constants';
import debug from 'debug';

// The initial state of the App
const initialState = {
  gamePaused: false,
  gameLoading: false,
  loading: false,
  error: false,
};

function appReducer(state = initialState, action) {
  debug.enable('CtAppRdcr');

  switch (action.type) {
    case SET_GAME_PAUSE:
      return {
        ...state,
        gamePaused: action.payload,
      };
    case SET_GAME_LOADING:
      debug('CtAppRdcr')(`Setting SET_GAME_LOADING to ${action.payload}`);
      return {
        ...state,
        gameLoading: action.payload,
      };
    default:
      return state;
  }
}

export default appReducer;