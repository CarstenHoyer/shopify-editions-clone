uniform float uHoverProgress;
uniform float uTime;
uniform vec3 uGlowColor;
uniform vec3 uBaseColor;
uniform float uGlowIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Calculate fresnel/rim lighting effect for glow
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - max(dot(viewDirection, vNormal), 0.0);
  fresnel = pow(fresnel, 2.0);

  // Animated glow pulsing
  float pulse = sin(uTime * 4.0) * 0.15 + 0.85;

  // Combine base color with glow
  vec3 glowEffect = uGlowColor * fresnel * uGlowIntensity * pulse;

  // Interpolate based on hover progress for smooth transition
  vec3 finalColor = mix(uBaseColor, uBaseColor + glowEffect, uHoverProgress);

  // Add subtle edge glow when hovered
  float edgeGlow = fresnel * uHoverProgress * 0.5;
  finalColor += uGlowColor * edgeGlow;

  gl_FragColor = vec4(finalColor, 1.0);
}
