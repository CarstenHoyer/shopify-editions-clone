uniform float uTime;
uniform float uScrollProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntensity;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Create animated gradient based on time and UV coordinates
  float wave = sin(vUv.x * 6.28318 + uTime * 2.0) * 0.5 + 0.5;
  float gradient = mix(wave, vUv.y, 0.5);

  // Add scroll-based influence
  float scrollInfluence = uScrollProgress * 0.3;
  gradient = gradient + scrollInfluence;

  // Mix between colors based on gradient
  vec3 color = mix(uColorA, uColorB, gradient);

  // Add subtle pulsing based on time
  float pulse = sin(uTime * 3.0) * 0.1 + 0.9;
  color *= pulse * uIntensity;

  gl_FragColor = vec4(color, 1.0);
}
