/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = () => (state) => state.global;

const selectLoading = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.loading
);

const selectError = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.error
);

const selectGamePaused = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.gamePaused
);

export {
  selectGlobal,
  selectLoading,
  selectError,
  selectGamePaused,
};