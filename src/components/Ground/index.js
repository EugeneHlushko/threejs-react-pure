import {
  RepeatWrapping,
  Mesh,
  MeshStandardMaterial,
  PlaneBufferGeometry,
} from 'three';
import debug from 'debug';

const textureMapTypes = [
  'map',
  'bumpMap',
  'roughnessMap',
];

class Ground {
  constructor(texture) {
    this.textureSize = {
      w: 100,
      h: 240,
    };
    this.anisotropyLevel = 4;

    // debug.enable('CpGround');
    debug('CpGround')('initing ground, texture received: ');
    debug('CpGround')(texture);
    this.groundGeo = new PlaneBufferGeometry(1000, 1000, 66, 66);
    this.texture = texture;
    this.floorMat = new MeshStandardMaterial( {
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 0.0005,
    });

    textureMapTypes.map(this.setTexture);

    this.ground = new Mesh(this.groundGeo, this.floorMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;

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
