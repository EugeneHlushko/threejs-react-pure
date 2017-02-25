import {
  PLAYER_SET_MOTION,
  PLAYER_MODIFY_HEALTH,
  PLAYER_MODIFY_SPEED,
  PLAYER_RESET_HEALTH,
  PLAYER_RESET_SPEED,
  PLAYER_MODIFY_POSITION,
} from './constants';

export function playerSetMotion(motion) {
  return {
    type: PLAYER_SET_MOTION,
    motion,
  };
}

export function playerModifyHealth(payload) {
  return {
    type: PLAYER_MODIFY_HEALTH,
    payload,
  };
}

export function playerModifySpeed(payload) {
  return {
    type: PLAYER_MODIFY_SPEED,
    payload,
  };
}

export function playerResetHealth() {
  return { type: PLAYER_RESET_HEALTH };
}

export function playerResetSpeed() {
  return { type: PLAYER_RESET_SPEED };
}

export function playerSetPosition(position) {
  return { type: PLAYER_MODIFY_POSITION, position };
};