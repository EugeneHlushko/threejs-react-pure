import React, { PureComponent, PropTypes } from 'react';
import debug from 'debug';

import {
  PerspectiveCamera,
  WebGLRenderer,
  ReinhardToneMapping,
  Raycaster,
  // TODO:Controls Orbit Controls refactoring subject
  MOUSE,
  EventDispatcher,
  Vector2,
  Vector3,
  Quaternion,
} from 'three';

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
    this.raycaster = new Raycaster();

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

  initRenderer = () => {
    // RENDERER
    this.renderer = new WebGLRenderer({ antialias: true, canvas: this.refs.canvas });
    this.renderer.physicallyCorrectLights = true;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = ReinhardToneMapping;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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
    if (this.props.gamePaused) return;

    this.renderer.render(this.scene, this.camera);
    this.update();
  };

  // Implemented in the Level, might need level specific shader, geometry or other things update.
  update() {}

  // return gound Y value
  rayCastToGround = (origin, direction) => {
    this.raycaster.set(origin, direction);

    const intersects = this.raycaster.intersectObject(this.ground);
    return intersects.length > 0 ? intersects[0].point.y : 0;
  };

  revealPlayerPrivates = (playerBody, playerUpdate) => {
    this.setState({ playerBody, playerUpdate });
  };

  render() {
    return (<canvas ref='canvas'>
      <Player
        rayCastToGround={ this.rayCastToGround }
        revealPlayerPrivates={ this.revealPlayerPrivates } />
    </canvas>);
  };
}
ExtendableLevel.PropTypes = {
  onSetLoading: PropTypes.func.isRequired,
};

export default ExtendableLevel;
