import {
  CylinderGeometry,
  MeshPhongMaterial,
  FaceColors,
  FlatShading,
  Mesh,
  Group,
} from 'three';

export default class Tree {
  constructor() {
    this.geoHeight = 10;
    this.geometry = new CylinderGeometry(
      4, // radius top
      4, // radius bottom
      this.geoHeight, // height
      8 // radius segments
    );
    this.material = new MeshPhongMaterial({
      color: 0x483000,
      specular: 0x483000,
      shininess: 20,
      morphTargets: true,
      vertexColors: FaceColors,
      shading: FlatShading });
    this.cylinder = new Mesh(this.geometry, this.material);

    this.greenHeight = 60;
    this.greenGeometry = new CylinderGeometry(
      0, // radius top
      30, // radius bottom
      this.greenHeight, // height
      32 // radius segments
    );
    this.greenMaterial = new MeshPhongMaterial({
      color: 0x3BA200,
      specular: 0x3BA200,
      shininess: 20,
      morphTargets: true,
      vertexColors: FaceColors,
      shading: FlatShading });
    this.green = new Mesh(this.greenGeometry, this.greenMaterial);
  }

  createSpawn(position) {
    const temporaryTree = new Group();
    const cylinder = this.cylinder.clone();
    // ground is positioned on Y axis -30, based on that we put item on the floor with formula
    cylinder.position.y = this.geoHeight / 2;
    temporaryTree.add(cylinder);

    const green = this.green.clone();
    green.position.y = this.greenHeight / 2 + this.geoHeight;
    temporaryTree.add(green);

    // TODO: why three is not casting shadow?
    temporaryTree.castShadow = temporaryTree.receiveShadow = true;

    temporaryTree.position.copy(position);

    return temporaryTree;
  }
}
