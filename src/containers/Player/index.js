import { PureComponent } from 'react';
import debug from 'debug';

import {
  CylinderGeometry,
  MeshPhongMaterial,
  FaceColors,
  FlatShading,
  Mesh,
} from 'three';

// Maybe player can be required from Game container and "stalled" when not needed to not reload his necessary assets
// and do binding all the time? need to consider this.
class Player {
  constructor(position) {
    this.state = {
      keysDown: [],
      keysListensFor: [87, 68, 83, 65],
      position,
    };

    debug.enable('Player');
    this.constructSceneObject();

    return this;
  }

  manualMount = () => {
    this.setKeyboardBindings(true);
  };

  manualUnMount = () => {
    this.setKeyboardBindings(false);
  };

  setKeyboardBindings = (add = false) => {
    if (add) {
      document.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('keyup', this.onKeyUp);
    } else {
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('keyup', this.onKeyUp);
    }
  };

  onKeyDown = (evt) => {
    const { keyCode } = evt;
    const { keysDown, keysListensFor } = this.state;
    // if key is not in array of pressed keys and being listened for, then add to pressed ones.
    if (keysListensFor.includes(keyCode) && (keysDown && !keysDown.includes(keyCode))) {
      this.state.keysDown = [...keysDown, keyCode];
    }
  };

  onKeyUp = (evt) => {
    const { keyCode } = evt;
    const { keysDown } = this.state;
    // if key is in keysDowns array, then remove it.
    if (keysDown.includes(keyCode)) {
      this.state.keysDown = keysDown.filter(item => item !== keyCode);
    }
  };

  update = () => {
    const { keysDown } = this.state;
    // only move in one direction
    if (keysDown.length > 0 && keysDown.length < 3) {
      debug('Player')('Yes pressed keys are', keysDown);
      // TODO: have a dispatcher
      // TODO: have speed as a prop, always up to date with player reducer.
      if (keysDown.includes(87)) this.body.position.x -= 0.3;
      if (keysDown.includes(83)) this.body.position.x += 0.3;
      if (keysDown.includes(68)) this.body.position.z -= 0.3;
      if (keysDown.includes(65)) this.body.position.z += 0.3;
    }
  };

  // constructs the model itself, assigns to body of Player object;
  constructSceneObject = () => {
    this.bodyGeometry = new CylinderGeometry(
      4, // radius top
      4, // radius bottom
      40,
      8 // radius segments
    );
    this.material = new MeshPhongMaterial({
      color: 0xFF5300,
      specular: 0x3BA200,
      shininess: 20,
      morphTargets: true,
      vertexColors: FaceColors,
      shading: FlatShading
    });
    this.body = new Mesh(this.bodyGeometry, this.material);
    this.body.castShadow = this.body.receiveShadow = true;

    this.body.position.copy(this.state.position);
  };
}

export default Player;