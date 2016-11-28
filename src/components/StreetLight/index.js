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
    this.glowScale = 1.05;

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
      shading: FlatShading,
    });
    this.pole = new Mesh(this.geometry, this.material);

    // TODO: Why bulb is not glowing?
    // SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    this.sphereGeometry = new SphereGeometry(this.sphereSize, 32, 32);
    const sphereMaterial = new MeshStandardMaterial({
      emissive: 0xffd305,
      emissiveIntensity: 1,
      color: 0x000000
    });

    this.light = new PointLight(0xffd305, bulbLightPowers['40W'], 500);
    this.light.castShadow = true;
    this.lampBulb = new Mesh(this.sphereGeometry, sphereMaterial);
    this.lampBulb.castShadow = this.lampBulb.receiveShadow = false;
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
            value: new Color(0xffd305)
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

    this.glow = new Mesh(this.sphereGeometry.clone(), this.glowMaterial.clone());
  }

  createSpawn(position) {
    const currentLight = new Group();
    const pole = this.pole.clone();
    pole.position.y = this.geoHeight / 2;
    currentLight.add(pole);

    const light = this.light.clone();
    light.position.y = this.sphereSize / 2 + this.geoHeight;
    currentLight.add(light);

    currentLight.theGlow = this.glow.clone();
    currentLight.theGlow.position.y = light.position.y;
    currentLight.theGlow.scale.multiplyScalar(this.glowScale);
    currentLight.add(currentLight.theGlow);

    currentLight.onUpdateCB = function(cameraPosition) {
      if(!this.debug) {
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
