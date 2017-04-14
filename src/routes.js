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