import {
  SET_GAME_PAUSE,
  SET_GAME_LOADING,
} from './constants';

export function setGamePause(value) {
  return {
    type: SET_GAME_PAUSE,
    payload: value,
  };
}

export function setGameLoading(value) {
  return {
    type: SET_GAME_LOADING,
    payload: value,
  };
}
