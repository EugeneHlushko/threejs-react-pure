import ExtendableLevel from 'containers/ExtendableLevel';
import debug from 'debug';

import {
  Clock,
  PerspectiveCamera,
  Scene,
  Fog,
  Vector3,
  // TODO: Cleanup
  Mesh,
  CubeGeometry,
  MeshPhongMaterial,
} from 'three';
import { loadTexture } from 'utils/loaders';

// Meshes/spawners
import Tree from 'components/Tree';
import Ground from 'components/Ground';

// Textures
import TextureDesert from 'assets/images/desert.png';
import TextureDesert_Bump from 'assets/images/desert_bump.png';
import TextureDesert_Roughness from 'assets/images/desert_roughness.png';

class Level2 extends ExtendableLevel {
  constructor() {
    super();
    this.textures = {
      floor: {},
    };
  };

  componentDidMount() {
    // canvas mounted, lets setup the three.js stuff
    Promise.all([
      loadTexture(TextureDesert).then(texture => this.setTexture('floor', 'map', texture)),
      loadTexture(TextureDesert_Bump).then(texture => this.setTexture('floor', 'bumpMap', texture)),
      loadTexture(TextureDesert_Roughness).then(texture => this.setTexture('floor', 'roughnessMap', texture)),
    ]).then(this.setup);

    debug('Current Level')(`Component mounted, received props for Level2:`);
    debug('Current Level')(this.props);
  }

  setup = () => {
    // save clock to context
    this.clock = new Clock();

    // init camera and renderer
    this.initCamera();
    this.initRenderer();
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
}

export default Level2;
