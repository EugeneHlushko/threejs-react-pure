import {
  SphereGeometry,
  CylinderGeometry,
  MeshPhongMaterial,
  MeshStandardMaterial,
  FlatShading,
  Mesh,
  Group,
  PointLight,
  ShaderMaterial,
  // shading
  FrontSide,
  AdditiveBlending,
  Color,
  Vector3,
} from 'three';
import debug from 'debug';
import { bulbLightPowers } from '../../helpers/units';
import glowFragmentShader from '../../shaders/glow/GlowFragment';
import glowVertexShader from '../../shaders/glow/GlowVertex';

export default class StreetLight {
  // Need cameraPosition for glow effect shader
  constructor(cameraPosition) {
    // debug.enable('CpStreetLight');

    this.geoHeight = 70;
    this.sphereSize = 3;
    this.sphereSegs = 32;
    this.glowScale = 1.2;
    this.lightColor = 0xe5ffff;
    this.shaderLight = 0x2ab6ff;

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
      shading: FlatShading,
    });
    this.pole = new Mesh(this.geometry, this.material);
    this.pole.castShadow = this.pole.receiveShadow = false;

    // TODO: Why bulb is not glowing? Emissive shouldnt solve this problem ?
    // SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    this.sphereGeometry = new SphereGeometry(this.sphereSize, this.sphereSegs, this.sphereSegs);
    this.glowGeometry = new SphereGeometry(this.sphereSize * this.glowScale, this.sphereSegs, this.sphereSegs);
    const sphereMaterial = new MeshStandardMaterial({
      emissive: 0x046ca2,
      emissiveIntensity: 1,
      color: 0x046ca2,
      transparent: true,
      blending: AdditiveBlending,
      side: FrontSide,
    });

    this.light = new PointLight(this.lightColor, bulbLightPowers['25W'], 500);
    this.light.castShadow = true;
    this.lampBulb = new Mesh(this.sphereGeometry, sphereMaterial);
    this.light.add(this.lampBulb);

    // generate shader metarial
    this.glowMaterial = new ShaderMaterial(
      {
        uniforms: {
          'c': {
            type: 'f',
            value: 1.3
          },
          'p': {
            type: 'f',
            value: 1.4
          },
          glowColor: {
            type: 'c',
            value: new Color(this.shaderLight)
          },
          viewVector: {
            type: 'v3',
            value: cameraPosition
          }
        },
        vertexShader: glowVertexShader,
        fragmentShader: glowFragmentShader,
        side: FrontSide,
        blending: AdditiveBlending,
        transparent: true
      }
    );

    this.glow = new Mesh(this.glowGeometry, this.glowMaterial);
  }

  createSpawn(position) {
    const currentLight = new Group();
    const pole = this.pole.clone();
    pole.position.y = this.geoHeight / 2;
    currentLight.add(pole);

    const light = this.light.clone();
    light.position.y = (this.sphereSize / 2 + this.geoHeight) + 2;
    currentLight.add(light);

    currentLight.theGlow = this.glow.clone();
    currentLight.theGlow.position.y = light.position.y;
    // currentLight.theGlow.position.z = light.position.z + 20;
    // currentLight.theGlow.position.x = light.position.x + 30;
    currentLight.add(currentLight.theGlow);

    currentLight.onUpdateCB = function(cameraPosition) {
      if (!this.debug) {
        debug('CpStreetLight')('getting update');
        debug('CpStreetLight')(this);
        this.debug = 'done';
      }
      this.theGlow.material.uniforms.viewVector.value = new Vector3().subVectors(cameraPosition, this.theGlow.position);
    };

    currentLight.position.copy(position);
    return currentLight;
  }
}
