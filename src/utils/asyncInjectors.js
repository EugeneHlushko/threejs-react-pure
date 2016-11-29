import { conformsTo, isEmpty, isFunction, isObject, isString } from 'lodash';
import createReducer from '../reducers';

export function checkStore(store) {
  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    runSaga: isFunction,
    asyncReducers: isObject,
  };
  if (conformsTo(store, shape)) {
    throw new Error('(app/utils...) asyncInjectors: Expected a valid redux store');
  }
}

// Inject an asynchronously loaded reducer
export function injectAsyncReducer(store, isValid) {
  return function injectReducer(name, asyncReducer) {
    if (!isValid) checkStore(store);

    if (!(isString(name) && !isEmpty(name) && isFunction(asyncReducer))) {
      throw new Error('(app/utils...) injectAsyncReducer: Expected `asyncReducer` to be a reducer function');
    }

    if (Reflect.has(store.asyncReducers, name)) return;

    store.asyncReducers[name] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };
}

// Inject an asynchronously loaded saga
// not used yet.
export function injectAsyncSagas(store, isValid) {
  return function injectSagas(sagas) {
    if (!isValid) checkStore(store);

    if (!Array.isArray(sagas)) {
      throw new Error('(app/utils...) injectAsyncSagas: Expected `sagas` to be an array of generator functions');
    }

    if (isEmpty(sagas)) {
      throw new Error('(app/utils...) injectAsyncSagas: Received an empty `sagas` array');
    }

    sagas.map(store.runSaga);
  };
}

export function getAsyncInjectors(store) {
  checkStore(store);

  return {
    injectReducer: injectAsyncReducer(store, true),
    injectSagas: injectAsyncSagas(store, true),
  };
}