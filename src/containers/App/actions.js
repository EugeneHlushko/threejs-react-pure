import {
  SET_GAME_PAUSE,
} from './constants';

export function setGamePause(value) {
  return {
    type: SET_GAME_PAUSE,
    payload: value,
  };
}
