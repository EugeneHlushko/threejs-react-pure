import {
  RepeatWrapping,
  Mesh,
  // MeshStandardMaterial,
  // PlaneBufferGeometry,
  ParametricGeometry,
  DoubleSide,
  FlatShading,
  Vector3,
  MeshStandardMaterial,
} from 'three';
import debug from 'debug';
import Perlin from '../../helpers/noise';

const textureMapTypes = [
  'map',
  'bumpMap',
  'roughnessMap',
];

class Ground {
  constructor(texture) {
    this.textureSize = {
      w: 4,
      h: 4,
    };
    this.anisotropyLevel = 4;

    // debug.enable('CpGround');
    debug('CpGround')('initing ground, texture received: ');
    debug('CpGround')(texture);
    // this.groundGeo = new PlaneBufferGeometry(1000, 1000, 66, 66);
    this.texture = texture;
    this.floorMat = new MeshStandardMaterial({
      side : DoubleSide,
      color : 0xFFFFFF,
      shininess : 40,
      shading : FlatShading
    });

    const noiseScale = 3.5;
    const size = 1000;
    const height = 0.025;

    const floor = new Mesh(
      new ParametricGeometry(function(u, v) {
        var x = u - 0.5;
        var y = v - 0.5;
        return new Vector3(x, y, Perlin.simplex2(x * noiseScale, y * noiseScale) * height);
      }, 128, 128),
      this.floorMat
    );

    floor.position.set(0, 0.0, 0);
    floor.scale.set(size, size, size);
    floor.rotation.set(- Math.PI * 0.5, 0, 0);
    floor.castShadow = floor.receiveShadow = true;
    this.ground = floor;

    textureMapTypes.map(this.setTexture);

    // this.wireframe = new GridHelper( 200, 40, 0x0000ff, 0x808080 );
    debug('dev')('CpGround has been inited');
  }

  setTexture = (mapName) => {
    const currentTexture = this.texture[mapName];
    currentTexture.wrapS = RepeatWrapping;
    currentTexture.wrapT = RepeatWrapping;
    currentTexture.anisotropy = this.anisotropyLevel;
    currentTexture.repeat.set(
      this.textureSize.w,
      this.textureSize.h
    );

    this.floorMat[mapName] = currentTexture;
    this.floorMat.needsUpdate = true;
  }
}
export default Ground;
