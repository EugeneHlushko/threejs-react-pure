import {
  RepeatWrapping,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  DoubleSide,
} from 'three';
import debug from 'debug';

class Ground {
  constructor(texture) {
    debug.enable('ComponentGround');
    debug('ComponentGround')('initing ground');
    this.groundGeo = new PlaneBufferGeometry(12000, 12000);
    this.texture = texture;
    this.setTexture(this.texture);
    debug('dev')('ComponentGround has been inited');
  }

  setTexture = (texture) => {
    const currentTexture = texture;
    currentTexture.wrapS = RepeatWrapping;
    currentTexture.wrapT = RepeatWrapping;
    currentTexture.repeat.set(40, 40);
    const floorMaterial = new MeshBasicMaterial({ map: currentTexture, side: DoubleSide });
    //groundMat.color.setHSL(0.095, 1, 0.75);
    this.ground = new Mesh(this.groundGeo, floorMaterial);
    this.ground.fog = true;
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -30;
    this.ground.receiveShadow = true;
    debug('ComponentGround')(this.ground);
  }
}
export default Ground;
