/**
 * The player state selectors
 */

import { createSelector } from 'reselect';

const selectPlayer = () => (state) => state.player;

const selectMotion = () => createSelector(
  selectPlayer(),
  (playerState) => playerState.motion
);

const selectPlayerHealth = () => createSelector(
  selectPlayer(),
  (playerState) => playerState.health
);

const selectPlayerSpeed = () => createSelector(
  selectPlayer(),
  (playerState) => playerState.speed
);

export {
  selectPlayer,
  selectMotion,
  selectPlayerHealth,
  selectPlayerSpeed,
};