/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Port to modular ES6 by Eugene Hlushko
 */

import CopyShader from '../shaders/system/CopyShaderUnified';
import {
  LinearFilter,
  RGBAFormat,
  WebGLRenderTarget,
} from 'three';

class EffectComposer {
  constructor(renderer, renderTarget) {
    this.CopyShader = CopyShader;

    this.renderer = renderer;

    if (renderTarget === undefined) {
      const parameters = {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
        stencilBuffer: false
      };
      const size = renderer.getSize();
      renderTarget = new WebGLRenderTarget(size.width, size.height, parameters);
    }

    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    this.passes = [];

    if (CopyShader === undefined )
      throw new Error( "THREE.EffectComposer relies on THREE.CopyShader" );

    this.copyPass = new ShaderPass( THREE.CopyShader );
  }
}

export default EffectComposer;