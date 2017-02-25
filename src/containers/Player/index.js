import { PureComponent, PropTypes } from 'react';
import debug from 'debug';

import { selectPlayerPosition, selectPlayerSpeed } from './selectors';
import { playerSetPosition } from './actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  CylinderGeometry,
  MeshPhongMaterial,
  FaceColors,
  FlatShading,
  Mesh,
  Vector3,
} from 'three';

// Maybe player can be required from Game container and "stalled" when not needed to not reload his necessary assets
// and do binding all the time? need to consider this.

// require player as an empty react component. where render function would be empty and component would never be re-rendered
// shouldComponentUpdate() => false;
class Player extends PureComponent {
  constructor() {
    super();

    this.state = {
      keysDown: [],
      keysListensFor: [87, 68, 83, 65],
      targetY: 0
    };

    this.height = 40;
    this.halfHeight = this.height / 2;
    // debug.enable('Player');
  }

  componentDidMount() {
    this.constructSceneObject();
    // when body is ready, give back body and update method to parent
    this.props.revealPlayerPrivates(this.body, this.update);

    this.setKeyboardBindings(true);
  };

  componentWillUnmount() {
    this.setKeyboardBindings(false);
  };

  shouldComponentUpdate() {
    return false;
  }

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

  // constructs the model itself, assigns to body of Player object;
  constructSceneObject = () => {
    this.bodyGeometry = new CylinderGeometry(
      4, // radius top
      4, // radius bottom
      this.height,
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
    this.body.castShadow = true;

    this.body.position.copy(this.props.position);
  };

  update = () => {
    const { keysDown } = this.state;
    // only move in one direction
    if (keysDown.length > 0 && keysDown.length < 3) {
      const { speed, onPlayerSetPosition, rayCastToGround } = this.props;
      const { position } = this.body;
      debug('Player')('Yes pressed keys are', keysDown);

      if (keysDown.includes(87)) position.z -= speed;
      if (keysDown.includes(83)) position.z += speed;
      if (keysDown.includes(68)) position.x += speed;
      if (keysDown.includes(65)) position.x -= speed;

      const intersectionY = rayCastToGround(
        position,
        new Vector3(position.x, -250, position.z).normalize()
      );

      debug('CurrentLevel')('Distance was');
      debug('CurrentLevel')(intersectionY);

      // TODO: this works for all cases?
      const diff = Math.abs(position.y - intersectionY);
      if (diff > this.halfHeight) {
        position.y -= diff - this.halfHeight;
      } else if (diff < this.halfHeight) {
        position.y += this.halfHeight - diff;
      }

      onPlayerSetPosition(this.body.position);
    }
  };

  render() {
    return null;
  };
}

Player.PropTypes = {
  position: PropTypes.object.isRequired,
  rayCastToGround: PropTypes.func.isRequired,
  speed: PropTypes.number.isRequired,
  revealPlayerPrivates: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onPlayerSetPosition: (position) => dispatch(playerSetPosition(position)),
  };
}

const mapStateToProps = createStructuredSelector({
  position: selectPlayerPosition(),
  speed: selectPlayerSpeed(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);