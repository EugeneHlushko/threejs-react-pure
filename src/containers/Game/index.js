import React, { Component, PropTypes } from 'react';
import {
  Clock,
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Fog,
  ReinhardToneMapping,
  HemisphereLight,
  PointLight,
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

// helpers
import {
  hemisphereLightPowers,
  bulbLightPowers,
} from '../../helpers/units';

// Meshes
import Tree from '../../components/Tree';
import Ground from '../../components/Ground';

// Textures
import TextureDesert from '../../assets/images/hardwood2_diffuse.jpg';
import TextureDesert_Bump from '../../assets/images/hardwood2_bump.jpg';
import TextureDesert_Roughness from '../../assets/images/hardwood2_roughness.jpg';

// locals
import './style.css';

class Game extends Component {
  static PropTypes = {
    gameReadyCallback: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    window.TESTME = this;
    this.textures = {
      floor: {},
    };
    debug.enable('CtGame');
  };

  componentDidMount() {
    // canvas mounted, lets setup the three.js stuff
    Promise.all([
      loadTexture(TextureDesert).then(texture => this.setTexture('floor', 'map', texture)),
      loadTexture(TextureDesert_Bump).then(texture => this.setTexture('floor', 'bumpMap', texture)),
      loadTexture(TextureDesert_Roughness).then(texture => this.setTexture('floor', 'roughnessMap', texture))
    ]).then(this.setup);
  }

  setTexture = (textureName, key, texture) => {
    debug('CtGame')(`Loaded texture, setting: ${textureName}, ${key}`);
    this.textures[textureName][key] = texture;
  };

  setup = () => {
    // save clock to context
    this.clock = new Clock();

    // init camera and renderer
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initStats();
    this.initControls();
    this.initGround();
    this.initObjects();

    // start the animation
    this.animate();
  };

  initCamera = () => {
    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1500
    );
    this.camera.position.set(-258, 347, 311);
    this.camera.rotation.set(2.32315, -0.2972, -2.83836);
    this.scene = new Scene();
    this.scene.fog = new Fog(0x000000, 1, 2000);
  };

  initRenderer = () => {
    // RENDERER
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.physicallyCorrectLights = true;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = ReinhardToneMapping;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.refs.canvasHolder.appendChild(this.renderer.domElement);
  };

  initLights = () => {
    this.hemiLight = new HemisphereLight(
      0x1c2025, // sky color
      0x251e0e, // ground color
      hemisphereLightPowers['FullMoon'] // intensity
    );
    this.scene.add(this.hemiLight);

    // light test
    this.light = new PointLight( 0xffd305, bulbLightPowers['25W'], 500 );
    this.light.position.set(10, 150, 50);
    this.scene.add(this.light);
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
    this.groundHolder = new Ground(this.textures.floor);
    this.ground = this.groundHolder.ground;
    this.scene.add(this.ground);

    this.camera.lookAt(this.ground.position);
  };

  initObjects = () => {
    this.tree = new Tree().createSpawn(0, 0);
    this.scene.add(this.tree);
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
