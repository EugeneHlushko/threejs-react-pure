import {
  PLAYER_IS_STANDING,
  PLAYER_SET_MOTION,
  PLAYER_MODIFY_HEALTH,
  PLAYER_MODIFY_SPEED,
  PLAYER_RESET_HEALTH,
  PLAYER_RESET_SPEED,
  PLAYER_MODIFY_POSITION,
} from './constants';
import { Vector3 } from 'three';
import debug from 'debug';

// The initial state of the Player object. Will be saved/loaded from DB for saved profile and have different values,
// inventory and other things in it.
const initialState = {
  // System related
  atScene: 'Level1',
  // Motion related, for playing animations and world coordinates
  motion: PLAYER_IS_STANDING,
  position: new Vector3(100, 0, 30),
  // Attribute related
  health: 500,
  speed: 1.2 * 3,
};

function playerReducer(state = initialState, action) {
  switch (action.type) {
    case PLAYER_SET_MOTION:
      debug('Player')(`Setting motion of the player to: ${action.motion}`);
      return {
        ...state,
        motion: action.motion,
      };
    case PLAYER_MODIFY_HEALTH:
      debug('Player')(`Affecting health PLAYER_MODIFY_HEALTH to ${action.payload}`);
      return {
        ...state,
        health: state.health + action.payload,
      };
    case PLAYER_MODIFY_SPEED:
      debug('Player')(`Affecting speed PLAYER_MODIFY_SPEED to ${action.payload}`);
      return {
        ...state,
        speed: state.speed + action.payload,
      };
    case PLAYER_RESET_HEALTH:
      debug('Player')(`PLAYER_RESET_HEALTH called, setting to default ${initialState.health}`);
      return {
        ...state,
        health: initialState.health
      };
    case PLAYER_RESET_SPEED:
      debug('Player')(`PLAYER_RESET_SPEED called, setting to default ${initialState.speed}`);
      return {
        ...state,
        speed: initialState.speed
      };
    case PLAYER_MODIFY_POSITION:
      debug('Player')(`PLAYER_MODIFY_POSITION called, setting to new value ${action.position}`);
      return {
        ...state,
        position: action.position
      };
    default:
      return state;
  }
}

export default playerReducer;