export default {
  Level1: {
    getComponent(cb) {
      require.ensure([], require => {
        cb(require('../containers/Level1').default)
      });
    }
  },
  Level2: {
    getComponent(cb) {
      require.ensure([], require => {
        cb(require('../containers/Level2').default)
      });
    }
  },
};