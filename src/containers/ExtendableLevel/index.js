import React, { PureComponent, PropTypes } from 'react';
import debug from 'debug';

import {
  PerspectiveCamera,
  // TODO:Controls Orbit Controls refactoring subject
  MOUSE,
  EventDispatcher,
  Vector2,
  Vector3,
  Quaternion,
} from 'three';

import Stats from 'stats.js';
import OrbitControls from 'three-orbit-controls';

// Player
import Player from 'containers/Player';

class ExtendableLevel extends PureComponent {
  constructor() {
    super();
    this.state = {
      playerBody: false,
      playerUpdate: null,
    };

    debug.enable('CurrentLevel');
  };

  componentWillMount() {
    this.props.onSetLoading(true);
    this.bindEvents(true);
  }

  componentWillUnmount() {
    // standard procedure, trying to avoid any memory leaks
    cancelAnimationFrame(this.animationFrame);
    this.bindEvents(false);
    this.scene = null;
    this.renderer = null;

    if (this.stats) {
      this.stats.domElement.outerHTML = '';
    }
  }

  bindEvents = (doBind = false) => {
    if (doBind) {
      window.addEventListener('resize', this.onWindowResize);
    } else {
      window.removeEventListener('resize', this.onWindowResize);
    }
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  setTexture = (textureName, key, texture) => {
    debug('CurrentLevel')(`Loaded texture, setting: ${textureName}, ${key}`);
    this.textures[textureName][key] = texture;
  };

  // TODO:Eject Should only be inited in development mode. Need to receive environmental param
  initStats = () => {
    this.stats = new Stats(0);
    document.body.appendChild(this.stats.dom);
  };

  // TODO:Controls Orbit controls will be removed most likely
  initControls = () => {
    const initializedOC = OrbitControls({
      MOUSE,
      EventDispatcher,
      Vector2,
      Vector3,
      Quaternion,
      PerspectiveCamera,
    });
    this.orbitControls = new initializedOC(this.camera);
  };

  animate = () => {
    this.animationFrame = window.requestAnimationFrame(this.animate);
    // take care of pause
    const { gamePaused } = this.props;
    if (gamePaused) return;

    this.renderer.render(this.scene, this.camera);
    this.stats.begin();
    this.update();
    this.stats.end();
  };

  // Implemented in the Level, might need level specific shader, geometry or other things update.
  update() {}

  revealPlayerPrivates = (playerBody, playerUpdate) => {
    this.setState({ playerBody, playerUpdate });
  };

  render() {
    return (<canvas ref='canvas'><Player revealPlayerPrivates={ this.revealPlayerPrivates } /></canvas>);
  };
}
ExtendableLevel.PropTypes = {
  onSetLoading: PropTypes.func.isRequired,
};

export default ExtendableLevel;
