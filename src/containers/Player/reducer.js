import {
  PLAYER_SET_MOTION,
  PLAYER_MODIFY_HEALTH,
  PLAYER_MODIFY_SPEED,
  PLAYER_RESET_HEALTH,
  PLAYER_RESET_SPEED,
} from './constants';
import debug from 'debug';

// The initial state of the App
const initialState = {
  motion: IS_STANDING,
  // Should we store position and rotation here or in level? In level looks much more performant
  health: 500,
  speed: 25,
};

function appReducer(state = initialState, action) {
  debug.enable('PlayerRdcr');

  switch (action.type) {
    case PLAYER_SET_MOTION:
      debug('PlayerRdcr')(`Setting motion of the player to: ${action.motion}`);
      return {
        ...state,
        motion: action.motion,
      };
    case PLAYER_MODIFY_HEALTH:
      debug('PlayerRdcr')(`Affecting health PLAYER_MODIFY_HEALTH to ${action.payload}`);
      return {
        ...state,
        health: state.health + action.payload,
      };
    case PLAYER_MODIFY_SPEED:
      debug('PlayerRdcr')(`Affecting speed PLAYER_MODIFY_SPEED to ${action.payload}`);
      return {
        ...state,
        speed: state.speed + action.payload,
      };
    case PLAYER_RESET_HEALTH:
      debug('PlayerRdcr')(`PLAYER_RESET_HEALTH called, setting to default ${initialState.health}`);
      return {
        ...state,
        health: initialState.health
      };
    case PLAYER_RESET_SPEED:
      debug('PlayerRdcr')(`PLAYER_RESET_SPEED called, setting to default ${initialState.speed}`);
      return {
        ...state,
        speed: initialState.speed
      };
    default:
      return state;
  }
}

export default appReducer;