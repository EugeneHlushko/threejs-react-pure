// This is needed due to webpack's import resolving, needs all possible values to be resolved upfront
// Cant pass level's name with constructed string yet .e.g. require(`../${somecoolname}`) wont work.
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