import ExtendableLevel from 'containers/ExtendableLevel';

import {
  Clock,
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Fog,
  ReinhardToneMapping,
  HemisphereLight,
  Vector3,
  // TODO: Cleanup
  Mesh,
  CubeGeometry,
  MeshPhongMaterial,
} from 'three';
import debug from 'debug';
import { loadTexture } from 'utils/loaders';

// helpers
import {
  hemisphereLightPowers,
} from 'helpers/units';

// Meshes/spawners
import Tree from 'components/Tree';
import StreetLight from 'components/StreetLight';
import Ground from 'components/Ground';

// Textures
import TextureDesert from 'assets/images/desert.png';
import TextureDesert_Bump from 'assets/images/desert_bump.png';
import TextureDesert_Roughness from 'assets/images/desert_roughness.png';

class Level1 extends ExtendableLevel {
  constructor() {
    super();
    this.textures = {
      floor: {},
    };
    debug.enable('Level1');
  };

  componentDidMount() {
    // canvas mounted, lets setup the three.js stuff
    Promise.all([
      loadTexture(TextureDesert).then(texture => this.setTexture('floor', 'map', texture)),
      loadTexture(TextureDesert_Bump).then(texture => this.setTexture('floor', 'bumpMap', texture)),
      loadTexture(TextureDesert_Roughness).then(texture => this.setTexture('floor', 'roughnessMap', texture)),
    ]).then(this.setup);

    debug('CurrentLevel')(`Component mounted, received props for Level1:`);
    debug('CurrentLevel')(this.props);
  }

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
    this.renderer = new WebGLRenderer({ antialias: true, canvas: this.refs.canvas });
    this.renderer.physicallyCorrectLights = true;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = ReinhardToneMapping;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  initLights = () => {
    this.hemiLight = new HemisphereLight(
      0x001d2c, // sky color
      0x251e0e, // ground color
      hemisphereLightPowers['CityTwilight'] // intensity
    );
    this.scene.add(this.hemiLight);
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

  // being called with animate in extended class
  update = () => {
    // update glow
    this.streetLights.map(streetLight => streetLight.onUpdateCB(this.camera.position));
  };
}

export default Level1;
