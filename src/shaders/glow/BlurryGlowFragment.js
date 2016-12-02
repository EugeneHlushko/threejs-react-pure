export default `
precision highp float;
precision highp int;

uniform vec2 resolution;
uniform float radius;
uniform vec3 color;
uniform float glow;
varying vec2 vUv;

void main() {
    vec2 uv = ( vUv - 0.5 ) * resolution;
    float strength = dot( uv, uv );
    vec2 weight = vec2(radius * radius + radius * glow, radius * radius - radius * glow);
    float clamped = 1.0 - clamp(
        ( strength - weight.y ) / ( weight.x - weight.y ), 0.0, 1.0
    );
    gl_FragColor = vec4( color * clamped, 1.0 );
}`;