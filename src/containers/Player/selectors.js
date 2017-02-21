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

const selectPlayerPosition = () => createSelector(
  selectPlayer(),
  (playerState) => playerState.position
);

const selectPlayerAtScene = () => createSelector(
  selectPlayer(),
  (playerState) => playerState.atScene
);

export {
  selectPlayer,
  selectMotion,
  selectPlayerHealth,
  selectPlayerSpeed,
  selectPlayerPosition,
  selectPlayerAtScene,
};