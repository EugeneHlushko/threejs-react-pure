import { PropTypes } from 'react';
import ExtendableLevel from 'containers/ExtendableLevel';
import debug from 'debug';

import { selectPlayerPosition } from 'containers/Player/selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  Clock,
  PerspectiveCamera,
  Scene,
  Fog,
  HemisphereLight,
  Vector3,
  // TODO: Cleanup
  Mesh,
  CubeGeometry,
  MeshPhongMaterial,
  // TODO: cleanup after model moved to player
  SkinnedMesh,
} from 'three';
import { loadTexture } from 'utils/loaders';
import ColladaLoader from 'utils/collada';
import Animation from 'utils/collada/Animation';
import AnimationHandler from 'utils/collada/AnimationHandler';

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

import PlayerModelFile from 'assets/models/Max_Walk_0006.dae';

class Level1 extends ExtendableLevel {
  constructor() {
    super();
    this.textures = {
      floor: {},
    };

    this.dae = false;

    window.TESTME = this;
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
    this.initPlayer();
    this.initLights();
    this.initControls();
    this.initGround();
    this.initObjects();
    this.initPlayerModel();

    this.clock.start();

    // stop loading screen
    this.props.onSetLoading(false);

    // start the animation
    this.animate();
  };

  initCamera = () => {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    // camera position
    this.camera.position.set(0, 150, 100);
    this.camera.rotation.set(-1, 0, 0);
    this.scene = new Scene();
    this.scene.fog = new Fog(0xa2d6ca, 1, 1000);
  };

  initPlayer = () => {
    this.scene.add(this.state.playerBody);
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

  initPlayerModel = () => {
    const loader = new ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load(PlayerModelFile, (collada) => { this.playerModelLoaded(collada) });
  };

  playerModelLoaded = (collada) => {
    this.dae = collada.scene;

    this.dae.traverse(function (child) {

      if (child instanceof SkinnedMesh) {
        const animation = new Animation(child, child.geometry.animation);
        animation.play();
      }
    });

    this.dae.scale.x = this.dae.scale.y = this.dae.scale.z = 20;
    this.dae.updateMatrix();

    this.scene.add(this.dae);
  };

  initObjects = () => {
    this.treeSpawner = new Tree();
    this.tree = this.treeSpawner.createSpawn(new Vector3(0, -2, 0));
    this.scene.add(this.tree);

    this.lightSpawner = new StreetLight(this.camera.position);
    this.streetLights = [];
    const lightsPositions = [
      {
        x: -490,
        y: -20,
        z: -490,
      },
      {
        x: -392,
        y: -20,
        z: -490,
      },
      {
        x: -294,
        y: -20,
        z: -490,
      },
      {
        x: -196,
        y: -20,
        z: -490,
      },
      {
        x: -98,
        y: -20,
        z: -490,
      },
      {
        x: 0,
        y: -20,
        z: -490,
      },
      {
        x: 100,
        y: -20,
        z: -490,
      },
      {
        x: 197,
        y: -20,
        z: -490,
      },
      {
        x: 295,
        y: -20,
        z: -490,
      },
      {
        x: 392,
        y: -20,
        z: -490,
      },
      {
        x: 490,
        y: -20,
        z: -490,
      },
      // the central one
      {
        x: 100,
        y: -20,
        z: 0,
        castShadowLight: true,
      },
    ];

    lightsPositions.forEach(lightSettings => {
      let currentLight = this.lightSpawner.createSpawn(
        new Vector3(lightSettings.x, lightSettings.y, lightSettings.z),
        {
          castShadowPole: lightSettings.castShadowPole || false,
          castShadowLight: lightSettings.castShadowLight || false
        }
      );
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
    const { position } = this.props;
    // update player
    this.state.playerUpdate();

    // TODO: remove when disable orbit controls, or just disable rotation on player controls;
    this.camera.position.x = position.x;
    this.camera.position.z = position.z + 100;
    this.camera.rotation.set(-1,0,0);

    // update glow
    this.streetLights.map(streetLight => streetLight.onUpdateCB(this.camera.position));

    AnimationHandler.update( this.clock.getDelta() );
  };
}

Level1.PropTypes = {
  ...Level1.PropTypes,
  position: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  position: selectPlayerPosition(),
});

export default connect(mapStateToProps)(Level1);