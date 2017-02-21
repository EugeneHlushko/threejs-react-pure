import React, { Component, PropTypes } from 'react';
import debug from 'debug';
import { setGamePause, setGameLoading } from '../App/actions';
import { selectPlayerHealth, selectPlayerAtScene } from '../Player/selectors';
import { selectGamePaused, selectGameLoading } from '../App/selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import staticLevelMap from 'helpers/staticLevelMap';

// additional components
import InGameMenu from 'components/InGameMenu';
import Dialog from 'components/Dialog';

// locals
import './style.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      CurrentLevel: null,
    };
    debug.enable('CtGame');
  };

  componentDidMount() {
    // TODO: get the current level by props and start initializing it
    // Pretend to render Level1 for now. We will see how to get webpack dynamic import later
    this.getLevel(this.props.atScene);

    // Start listening to esc key or other hotkeys that are available throughout all of the game.
    // TODO: Need to take care of the case when scene is still loading and we are pressing esc, ESC should not
    // be available during the loading (see any AAA game).
    this.setKeyboardBindings(true);
    debug('CtGame')(this.props);
  }

  componentWillUnmount() {
    // Cleanup any global keyboard listeners e.g.
    this.setKeyboardBindings(false);
  }

  setKeyboardBindings = (add = false) => {
    if (add) {
      document.addEventListener('keyup', this.keyPressed);
    } else {
      document.removeEventListener('keyup', this.keyPressed);
    }
  };

  keyPressed = (evt) => {
    debug('CtGame')(`Pressed a key Sir: ${evt.keyCode}`);
    if (evt.keyCode === 27) {
      debug('CtGame')(`Pressed game pause, trying to pause the game:`);
      this.props.onSetGamePause(!this.props.gamePaused);
    }

    if (evt.keyCode === 85) {
      debug('CtGame')(`Trying to load level1:`);
      this.getLevel('Level1');
    }

    if (evt.keyCode === 80) {
      debug('CtGame')(`Trying to load level2:`);
      this.getLevel('Level2');
    }
  };

  getLevel = (level) => {
    // remove current level first
    this.setState({ CurrentLevel: null });
    // trigger loading state
    this.props.onSetLoading(true);
    debug('CtGame')(`Get level called with props: ${level}`);
    // get component from the map
    staticLevelMap[level].getComponent(this.levelLoadedCb);
  };

  levelLoadedCb = (loadedLevel) => {
    debug('CtGame')(`Require ensure CB called`);
    this.setState({ CurrentLevel: loadedLevel });
  };

  answerHandler = (answer) => {
    debug('CtGame')(`Answer received`);
    debug('CtGame')(answer);
  };

  render() {
    const { gamePaused, onSetLoading } = this.props;
    const { CurrentLevel } = this.state;
    // TODO: dialog needs to be called only on some actions
    const dialog = true;
    return (
      <div>
        { gamePaused ? <InGameMenu /> : '' }
        <div className='game'>
          {
            CurrentLevel ?
              <CurrentLevel
                onSetLoading={ onSetLoading } /> : null
          }
          {
            dialog ?
              <Dialog
                text={ 'WASD to move. U to load level1, O to load level 2' }
                options={ [ { id: 'fsa', text: 'Got it!'}, { id: 'fsass', text: 'Dont show again'} ] }
                answerCallBack={ this.answerHandler } /> : ''
          }
        </div>
      </div>
    );
  };
}

Game.PropTypes = {
  gamePaused: PropTypes.bool,
  gameLoading: PropTypes.bool,
  onSetGamePause: PropTypes.func.isRequired,
  atScene: PropTypes.string.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSetGamePause: (value) => dispatch(setGamePause(value)),
    onSetLoading: (value) => dispatch(setGameLoading(value)),
  };
}

const mapStateToProps = createStructuredSelector({
  gamePaused: selectGamePaused(),
  gameLoading: selectGameLoading(), // TODO: do i really need this here, look at this when scene switching is done
  playerHealth: selectPlayerHealth(),
  atScene: selectPlayerAtScene()
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
