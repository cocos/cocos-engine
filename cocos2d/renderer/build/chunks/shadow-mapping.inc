// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if _NUM_SHADOW_LIGHTS > 0
  #pragma for id in range(0, _NUM_SHADOW_LIGHTS)
    uniform sampler2D _shadowMap_{id};
    uniform float _darkness_{id};
    uniform float _depthScale_{id};
    uniform float _frustumEdgeFalloff_{id};
    uniform float _bias_{id};
    uniform vec2 _texelSize_{id};
    varying vec4 pos_lightspace_{id};
    varying float vDepth_{id};
  #pragma endFor
#endif

float computeShadow(sampler2D shadowMap, vec4 pos_lightspace, float bias) {
  vec3 projCoords = pos_lightspace.xyz / pos_lightspace.w;
  projCoords = projCoords * 0.5 + 0.5;
  float closestDepth = unpackRGBAToDepth(texture2D(shadowMap, projCoords.xy));
  float currentDepth = projCoords.z;
  float shadow = (currentDepth - bias > closestDepth) ? 0.0 : 1.0;
  return shadow;
}

float computeFallOff(float esm, vec2 coords, float frustumEdgeFalloff) {
  float mask = smoothstep(1.0 - frustumEdgeFalloff, 1.0, clamp(dot(coords, coords), 0.0, 1.0));
  return mix(esm, 1.0, mask);
}

// unused for float precision issue.
// float computeShadowESM_Unused() {
//   vec2 projCoords = pos_lightspace.xy / pos_lightspace.w;
//   vec2 shadowUV = projCoords * 0.5 + vec2(0.5);
//   if (shadowUV.x < 0.0 || shadowUV.x > 1.0 || shadowUV.y < 0.0 || shadowUV.y > 1.0) {
//     return 1.0;
//   }
//   float currentDepth = clamp(vDepth, 0.0, 1.0);
//   float closestDepth = unpackRGBAToDepth(texture2D(shadowMap, shadowUV));
//   float esm = 1.0 - clamp(exp(min(87.0, depthScale * currentDepth)) * closestDepth, 0.0, darkness);
//   return computeFallOff(esm, projCoords, frustumEdgeFalloff);
// }

float computeShadowESM(sampler2D shadowMap, vec4 pos_lightspace, float vDepth, float depthScale, float darkness, float frustumEdgeFalloff) {
  vec2 projCoords = pos_lightspace.xy / pos_lightspace.w;
  vec2 shadowUV = projCoords * 0.5 + vec2(0.5);
  if (shadowUV.x < 0.0 || shadowUV.x > 1.0 || shadowUV.y < 0.0 || shadowUV.y > 1.0) {
    return 1.0;
  }
  float currentDepth = clamp(vDepth, 0.0, 1.0);
  float closestDepth = unpackRGBAToDepth(texture2D(shadowMap, shadowUV));
  //float esm = clamp(exp(min(87.0, -depthScale * (currentDepth - closestDepth))), 1.0 - darkness, 1.0);
  float esm = clamp(exp(-depthScale * (currentDepth - closestDepth)), 1.0 - darkness, 1.0);
  return computeFallOff(esm, projCoords, frustumEdgeFalloff);
}

float computeShadowPCF(sampler2D shadowMap, vec4 pos_lightspace, float vDepth, float darkness, vec2 texelSize, float frustumEdgeFalloff) {
  vec2 projCoords = pos_lightspace.xy / pos_lightspace.w;
  vec2 shadowUV = projCoords * 0.5 + vec2(0.5);
  if (shadowUV.x < 0.0 || shadowUV.x > 1.0 || shadowUV.y < 0.0 || shadowUV.y > 1.0) {
    return 1.0;
  }
  float currentDepth = clamp(vDepth, 0.0, 1.0);
  float visibility = 1.0;
  vec2 poissonDisk[4];
  poissonDisk[0] = vec2(-0.94201624, -0.39906216);
  poissonDisk[1] = vec2(0.94558609, -0.76890725);
  poissonDisk[2] = vec2(-0.094184101, -0.92938870);
  poissonDisk[3] = vec2(0.34495938, 0.29387760);
  if (unpackRGBAToDepth(texture2D(shadowMap, shadowUV + poissonDisk[0] * texelSize)) < currentDepth) visibility -= 0.25;
  if (unpackRGBAToDepth(texture2D(shadowMap, shadowUV + poissonDisk[1] * texelSize)) < currentDepth) visibility -= 0.25;
  if (unpackRGBAToDepth(texture2D(shadowMap, shadowUV + poissonDisk[2] * texelSize)) < currentDepth) visibility -= 0.25;
  if (unpackRGBAToDepth(texture2D(shadowMap, shadowUV + poissonDisk[3] * texelSize)) < currentDepth) visibility -= 0.25;

  return computeFallOff(min(1.0, visibility + 1.0 - darkness), projCoords, frustumEdgeFalloff);
}