import {
  SphereGeometry,
  CylinderGeometry,
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
} from 'three';

import { bulbLightPowers } from 'helpers/units';
import glowFragmentShader from 'shaders/glow/GlowFragment';
import glowVertexShader from 'shaders/glow/GlowVertex';

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

    // Geometry and material to be reused on poles
    this.geometry = new CylinderGeometry(
      4, // radius top
      4, // radius bottom
      this.geoHeight, // height
      4 // radius segments
    );
    this.material = new MeshStandardMaterial({
      color: 0x0b0902,
      shading: FlatShading,
    });

    // TODO: Why bulb is not glowing? Emissive shouldnt solve this problem ?
    // SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    this.sphereGeometry = new SphereGeometry(this.sphereSize, this.sphereSegs, this.sphereSegs);
    this.glowGeometry = new SphereGeometry(this.sphereSize * this.glowScale, this.sphereSegs, this.sphereSegs);
    this.sphereMaterial = new MeshStandardMaterial({
      emissive: 0x046ca2,
      emissiveIntensity: 1,
      color: 0x046ca2,
      transparent: true,
      blending: AdditiveBlending,
      side: FrontSide,
    });

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
  }

  createSpawn(position) {
    const currentLight = new Group();
    // Pole
    const pole = new Mesh(this.geometry, this.material);
    pole.position.y = this.geoHeight / 2;
    // pole.castShadow = true;
    currentLight.add(pole);

    // Light Bulb and Point Light source
    const light = new PointLight(this.lightColor, bulbLightPowers['25W'], 250);
    // light.castShadow = true;
    const lampBulb = new Mesh(this.sphereGeometry, this.sphereMaterial);
    light.add(lampBulb);
    light.position.y = (this.sphereSize / 2 + this.geoHeight) + 2;
    currentLight.add(light);

    // opaque shader based bulb
    const glow = new Mesh(this.glowGeometry, this.glowMaterial);
    glow.position.y = currentLight.children[1].position.y;
    currentLight.add(glow);

    currentLight.onUpdateCB = function(cameraPosition) {
      // currentLight.children[2].material.uniforms.viewVector.value = new Vector3().subVectors(cameraPosition, currentLight.children[2].position);
    }.bind(currentLight);

    currentLight.position.copy(position);
    return currentLight;
  }
}
