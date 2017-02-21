import { Vector3 } from 'three';
import debug from 'debug';

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

export function playerMoveWithKeyPress(direction, speed, position) {
  debug('Player')('playerMoveWithKeyPress called');
  const { x, y, z } = position;
  // TODO: translate keys pressed into direction with a helper method
  // N = 87
  // E = 68
  // S = 83
  // W = 65

  switch (direction) {
    case 'N':
      return { type: PLAYER_MODIFY_POSITION, position: new Vector3(x + speed, y, z) };
    case 'NE':
    case 'E':
    case 'ES':
    case 'S':
    case 'WS':
    case 'W':
    case 'NW':
    default:
      return;
  }
};