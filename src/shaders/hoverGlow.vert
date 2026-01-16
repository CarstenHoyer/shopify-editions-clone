uniform float uHoverProgress;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;

  // Subtle vertex displacement on hover for a "breathing" effect
  vec3 pos = position;
  float displacement = sin(uTime * 3.0 + position.y * 2.0) * 0.02 * uHoverProgress;
  pos += normal * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
