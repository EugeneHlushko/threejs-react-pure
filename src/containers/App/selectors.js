/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = () => (state) => state.global;

const selectError = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.error
);

const selectGamePaused = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.gamePaused
);

const selectGameLoading = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.gameLoading
);

export {
  selectGlobal,
  selectError,
  selectGamePaused,
  selectGameLoading,
};