import { getAsyncInjectors } from './utils/asyncInjectors';

export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          cb(null, require('./containers/StartScreen').default)

          // for saga, reducer loading]
          // let Comments = require('./pages/Comments').default;
          // let commentsReducer = require('./reducers/comments').default;
          //
          // injectAsyncReducer(store, 'comments', commentsReducer);
          // callback(null, Comments);
        });
      },
    },
    {
      path: '/game',
      name: 'game',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          const playerReducer = require('./containers/Player/reducer').default;
          injectReducer(store, 'player', playerReducer);

          cb(null, require('./containers/Game').default)
        });
      },
    },
    {
      path: '/temp',
      name: 'temp',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          cb(null, require('./containers/GameTemp').default)
        });
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          cb(null, require('./containers/NotFound').default)
        });
      },
    },
  ];
}