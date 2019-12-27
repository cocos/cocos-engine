// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
#define CC_MAX_SHADOW_LIGHTS 2

#if CC_USE_SHADOW_MAP && CC_NUM_SHADOW_LIGHTS > 0

  #pragma builtin(global)
  uniform CC_SHADOW {
    mat4 cc_shadow_lightViewProjMatrix[CC_MAX_SHADOW_LIGHTS];
    vec4 cc_shadow_info[CC_MAX_SHADOW_LIGHTS];        // [minDepth, maxDepth, depthScale, darkness]
  };

  #pragma builtin(global)
  uniform sampler2D cc_shadow_map_0;
  
  #if CC_NUM_SHADOW_LIGHTS > 1
    #pragma builtin(global)
    uniform sampler2D cc_shadow_map_1;
  #endif

  varying vec4 v_posLightSpace[CC_MAX_SHADOW_LIGHTS];
  varying float v_depth[CC_MAX_SHADOW_LIGHTS];
#endif

void CCShadowInput (vec3 worldPos) {
  #if CC_USE_SHADOW_MAP && CC_NUM_SHADOW_LIGHTS > 0
  for (int i = 0; i < CC_NUM_SHADOW_LIGHTS; i++) {
    v_posLightSpace[i] = cc_shadow_lightViewProjMatrix[i] * vec4(worldPos, 1.0);
    v_depth[i] = (v_posLightSpace[i].z + cc_shadow_info[i].x) / (cc_shadow_info[i].x + cc_shadow_info[i].y);
  }
  #endif
}

#include <packing>

float computeFallOff(float esm, vec2 coords, float frustumEdgeFalloff) {
  float mask = smoothstep(1.0 - frustumEdgeFalloff, 1.0, clamp(dot(coords, coords), 0.0, 1.0));
  return mix(esm, 1.0, mask);
}

float computeShadowESM(sampler2D shadowMap, vec4 posLightspace, float vDepth, float depthScale, float darkness, float frustumEdgeFalloff) {
  vec2 projCoords = posLightspace.xy / posLightspace.w;
  vec2 shadowUV = projCoords * 0.5 + vec2(0.5); // (-1, 1) => (0, 1)
  if (shadowUV.x < 0.0 || shadowUV.x > 1.0 || shadowUV.y < 0.0 || shadowUV.y > 1.0) {
    return 1.0;
  }
  float currentDepth = clamp(vDepth, 0.0, 1.0);
  float closestDepth = unpackRGBAToDepth(texture2D(shadowMap, shadowUV));
  //float esm = clamp(exp(min(87.0, -depthScale * (currentDepth - closestDepth))), 1.0 - darkness, 1.0);
  float esm = clamp(exp(-depthScale * (currentDepth - closestDepth)), 1.0 - darkness, 1.0);
  return computeFallOff(esm, projCoords, frustumEdgeFalloff);

  // return currentDepth > closestDepth  ? 1.0 - darkness : 1.0;
}

float CCCalcShadow() {
  float shadow = 1.0;
  float frustumEdgeFalloff = 0.0;
  #if CC_USE_SHADOW_MAP
    #if CC_NUM_SHADOW_LIGHTS > 0
      shadow *= computeShadowESM(cc_shadow_map_0, v_posLightSpace[0], v_depth[0], cc_shadow_info[0].z, cc_shadow_info[0].w, frustumEdgeFalloff);
    #endif
    #if CC_NUM_SHADOW_LIGHTS > 1
      shadow *= computeShadowESM(cc_shadow_map_1, v_posLightSpace[1], v_depth[1], cc_shadow_info[1].z, cc_shadow_info[1].w, frustumEdgeFalloff);
    #endif
  #endif
  return shadow;
}
