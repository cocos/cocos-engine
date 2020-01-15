// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
#define CC_MAX_SHADOW_LIGHTS 2

#define CC_DEFINE_SHADOW_MAP(index) \
  #if CC_NUM_SHADOW_LIGHTS > index \
    #pragma builtin(global) \
    uniform sampler2D cc_shadow_map_##index; \
  #endif

#if CC_USE_SHADOW_MAP && CC_NUM_SHADOW_LIGHTS > 0

  #pragma builtin(global)
  uniform CC_SHADOW {
    mat4 cc_shadow_lightViewProjMatrix[CC_MAX_SHADOW_LIGHTS];
    vec4 cc_shadow_info[CC_MAX_SHADOW_LIGHTS];        // [minDepth, maxDepth, depthScale, darkness]
  };

  CC_DEFINE_SHADOW_MAP(0)
  CC_DEFINE_SHADOW_MAP(1)

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

#define CC_CALC_SHADOW(index, light) \
  #if CC_USE_SHADOW_MAP && CC_NUM_SHADOW_LIGHTS > index \
    float shadow_##index = computeShadowESM(cc_shadow_map_##index, v_posLightSpace[index], v_depth[index], cc_shadow_info[index].z, cc_shadow_info[index].w, 0.0); \
    light.diffuse *= shadow_##index; \
    light.specular *= shadow_##index; \
  #endif  