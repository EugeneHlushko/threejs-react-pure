import React, { Component, PropTypes } from 'react';
import {
  Clock,
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Fog,
  // for Orbitcontrols
  MOUSE,
  EventDispatcher,
  Vector2,
  Vector3,
  Quaternion,
} from 'three';
import debug from 'debug';
import { loadTexture } from '../../utils/loaders';
import Stats from 'stats.js';
import OrbitControls from 'three-orbit-controls';

// Meshes
import Tree from '../../components/Tree';
import Ground from '../../components/Ground';

// Textures
import TextureDesert from '../../assets/images/Desert_01.png';

// locals
import './Game.css';

class Game extends Component {
  static PropTypes = {
    gameReadyCallback: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    window.TESTME = this;
    debug.enable('CtGame');
  };

  componentDidMount() {
    // canvas mounted, lets setup the three.js stuff
    loadTexture(TextureDesert).then((texture) => {
      this.texture = texture;
      this.setup();
    });
  }

  setup = () => {
    // save clock to context
    this.clock = new Clock();

    // init camera and renderer
    this.initCamera();
    this.initRenderer();
    this.initStats();
    this.initControls();
    this.initGround(this.texture);

    // start the animation
    this.animate();
  };

  initCamera = () => {
    this.camera = new PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    this.camera.position.set(-258, 347, 311);
    this.camera.rotation.set(2.32315, -0.2972, -2.83836);
    this.scene = new Scene();
    this.scene.fog = new Fog(0xffffff, 1, 5000);
    this.scene.fog.color.setHSL(0.6, 0, 1);

    this.tree = new Tree().createSpawn(0, 0);
    this.scene.add(this.tree);
  };

  initRenderer = () => {
    // RENDERER
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.refs.canvasHolder.appendChild(this.renderer.domElement);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.renderReverseSided = false;
  };

  // Should only be inited in development mode.
  initStats = () => {
    this.stats = new Stats(0);
    document.body.appendChild(this.stats.dom);
  };

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

  // GROUND
  initGround = () => {
    this.groundHolder = new Ground(this.texture);
    this.ground = this.groundHolder.ground;
    this.scene.add(this.ground);

    this.camera.lookAt(this.ground.position);
  };

  updateRotation = (rotation) => {
    this.setState({ rotation });
  };

  animate = () => {
    this.stats.begin();
    this.update();
    this.stats.end();
    this.animationFrame = window.requestAnimationFrame(this.animate);
  };

  update = () => {
    const delta = this.clock.getDelta();
    this.tick += delta;
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div ref='canvasHolder' className='game' />
    );
  };
}

export default Game;
