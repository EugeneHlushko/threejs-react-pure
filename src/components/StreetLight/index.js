import {
  SphereGeometry,
  CylinderGeometry,
  MeshPhongMaterial,
  MeshStandardMaterial,
  FaceColors,
  FlatShading,
  Mesh,
  Group,
  PointLight,
} from 'three';
import { bulbLightPowers } from '../../helpers/units';

export default class StreetLight {
  constructor() {
    this.geoHeight = 70;
    this.sphereSize = 5;
    this.geometry = new CylinderGeometry(
      4, // radius top
      4, // radius bottom
      this.geoHeight, // height
      4 // radius segments
    );
    this.material = new MeshPhongMaterial({
      color: 0x0b0902,
      specular: 0x0b0902,
      shininess: 10,
      morphTargets: true,
      vertexColors: FaceColors,
      shading: FlatShading });
    this.pole = new Mesh(this.geometry, this.material);

    // TODO: Why bulb is not glowing?
    // SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    const geometry = new SphereGeometry(this.sphereSize, 32, 32);
    const material = new MeshStandardMaterial({
      emissive: 0xffd305,
      emissiveIntensity: 1,
      color: 0x000000
    });

    // PointLight( color, intensity, distance, decay )
    this.light = new PointLight(0xffd305, bulbLightPowers['25W'], 500);
    // this.light = new PointLight(0xffee88, 500, 500, 112);
    this.light.castShadow = true;
    this.light.add(new Mesh(geometry, material));
  }

  createSpawn(position) {
    const currentLight = new Group();
    const pole = this.pole.clone();
    // ground is positioned on Y axis -30, based on that we put item on the floor with formula
    pole.position.y = this.geoHeight / 2;
    currentLight.add(pole);

    const light = this.light.clone();
    light.position.y = this.sphereSize / 2 + this.geoHeight;
    currentLight.add(light);

    currentLight.position.copy(position);

    currentLight.castShadow = true;

    return currentLight;
  }
}
