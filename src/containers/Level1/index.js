import React, { Component, PropTypes } from 'react';
import {
  Clock,
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Fog,
  ReinhardToneMapping,
  HemisphereLight,
  // for Orbitcontrols
  MOUSE,
  EventDispatcher,
  Vector2,
  Vector3,
  Quaternion,
  // TODO: Cleanup
  Mesh,
  CubeGeometry,
  MeshPhongMaterial,
} from 'three';
import debug from 'debug';
import { loadTexture } from '../../utils/loaders';
import Stats from 'stats.js';
import OrbitControls from 'three-orbit-controls';

// helpers
import {
  hemisphereLightPowers,
} from '../../helpers/units';

// Meshes/spawners
import Tree from '../../components/Tree';
import StreetLight from '../../components/StreetLight';
import Ground from '../../components/Ground';

// Textures
import TextureDesert from '../../assets/images/desert.png';
import TextureDesert_Bump from '../../assets/images/desert_bump.png';
import TextureDesert_Roughness from '../../assets/images/desert_roughness.png';

class Game extends Component {
  constructor() {
    super();
    this.textures = {
      floor: {},
    };
    debug.enable('Level1');
  };

  componentWillMount() {
    this.props.onSetLoading(true);
  }

  componentDidMount() {
    // canvas mounted, lets setup the three.js stuff
    Promise.all([
      loadTexture(TextureDesert).then(texture => this.setTexture('floor', 'map', texture)),
      loadTexture(TextureDesert_Bump).then(texture => this.setTexture('floor', 'bumpMap', texture)),
      loadTexture(TextureDesert_Roughness).then(texture => this.setTexture('floor', 'roughnessMap', texture)),
    ]).then(this.setup);

    debug('Level1')(`Component mounted, received props:`);
    debug('Level1')(this.props);
  }

  componentWillUnmount() {
    // standard procedure, trying to avoid any memory leaks
    cancelAnimationFrame(this.animationFrame);
    this.scene = null;
    this.renderer = null;
    this.stats.domElement.outerHTML = '';
  }

  setTexture = (textureName, key, texture) => {
    debug('Level1')(`Loaded texture, setting: ${textureName}, ${key}`);
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

    this.clock.start();

    // stop loading screen
    this.props.onSetLoading(false);

    // start the animation
    this.animate();
  };

  initCamera = () => {
    this.camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(160.589269816623, 78.04453061683152, 31.993717352721255);
    this.camera.rotation.set(2.32315, -0.2972, -2.83836);
    this.scene = new Scene();
    this.scene.fog = new Fog(0xa2d6ca, 1, 1000);
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
    this.props.canvasHolder.appendChild(this.renderer.domElement);
  };

  initLights = () => {
    this.hemiLight = new HemisphereLight(
      0x001d2c, // sky color
      0x251e0e, // ground color
      hemisphereLightPowers['CityTwilight'] // intensity
    );
    this.scene.add(this.hemiLight);
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
    this.treeSpawner = new Tree();
    this.tree = this.treeSpawner.createSpawn(new Vector3(0, -2, 0));
    this.scene.add(this.tree);

    this.lightSpawner = new StreetLight(this.camera.position);
    this.streetLights = [];
    const lightsPositions = [
      // {
      //   x: -490,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: -392,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: -294,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: -196,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: -98,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: 0,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: 100,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: 197,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: 295,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: 392,
      //   y: -20,
      //   z: -490,
      // },
      // {
      //   x: 490,
      //   y: -20,
      //   z: -490,
      // },
      // the central one
      {
        x: 100,
        y: -20,
        z: 0,
      },
    ];

    lightsPositions.forEach(pos => {
      let currentLight = this.lightSpawner.createSpawn(new Vector3(pos.x, pos.y, pos.z), this.camera.position);
      this.scene.add(currentLight);
      this.streetLights.push(currentLight);
    });

    const geometry = new CubeGeometry(50, 50, 50, 5);
    const material = new MeshPhongMaterial({
      color: 0x0b0902,
      specular: 0x0b0902,
      shininess: 10,
      morphTargets: true
    });
    const cube = new Mesh(geometry, material);
    cube.mask = 0xffffffff;
    cube.position.z = 100;
    cube.position.y = 20;
    cube.castShadow = cube.receiveShadow = true;
    this.scene.add(cube);
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

  update = () => {
    // update glow
    this.streetLights.map(streetLight => streetLight.onUpdateCB(this.camera.position));
  };

  render() {
    // TODO: see how to render this.renderer.domElement without dom insertion. right now i am just appending and
    // removing the canvas from the dom to a container passed on via props.
    return null;
  };
}

Game.PropTypes = {
  canvasHolder: PropTypes.element.isRequired,
  onSetLoading: PropTypes.func.isRequired,
};

export default Game;