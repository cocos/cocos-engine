// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
#define CC_MAX_SHADOW_LIGHTS 2

#define CC_SHADOW_TYPE_HARD 2
#define CC_SHADOW_TYPE_SOFT_PCF3X3 3
#define CC_SHADOW_TYPE_SOFT_PCF5X5 4

#define CC_DEFINE_SHADOW_MAP(index) \
  #if CC_NUM_SHADOW_LIGHTS > index \
    #pragma builtin(global) \
    uniform sampler2D cc_shadow_map_##index; \
  #endif

#if CC_USE_SHADOW_MAP && CC_NUM_SHADOW_LIGHTS > 0

  #pragma builtin(global)
  uniform CC_SHADOW {
    mat4 cc_shadow_lightViewProjMatrix[CC_MAX_SHADOW_LIGHTS];
    vec4 cc_shadow_info[CC_MAX_SHADOW_LIGHTS];        // [minDepth, maxDepth, shadow resolution, darkness]
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

float getDepth(sampler2D shadowMap, vec2 shadowUV) {
    return unpackRGBAToDepth(texture(shadowMap, shadowUV));
}

float computeFallOff(float shadow, vec2 coords, float frustumEdgeFalloff) {
  // float mask = smoothstep(1.0 - frustumEdgeFalloff, 1.0, clamp(dot(coords, coords), 0.0, 1.0));
  // return mix(esm, 1.0, mask);
  return shadow;
}

// standard hard shadow
float shadowSimple(sampler2D shadowMap, vec2 shadowUV, float currentDepth, float darkness) {
  float closestDepth = getDepth(shadowMap, shadowUV);
  return currentDepth > closestDepth  ? 1.0 - darkness : 1.0;
}

// PCF
float shadowPCF3X3(sampler2D shadowMap, vec2 shadowUV, float currentDepth, float darkness, float shadowSize) {
  float shadow = 0.0;
  for (int x = -1; x <= 1; ++x) {
    for (int y = -1; y <= 1; ++y) {
      float closestDepth = getDepth(shadowMap, shadowUV + vec2(x, y) * 1.0/shadowSize);
      shadow += currentDepth > closestDepth  ? 1.0 - darkness : 1.0;
    }
  }
  shadow /= 9.0;
  return shadow;
}
float shadowPCF5X5(sampler2D shadowMap, vec2 shadowUV, float currentDepth, float darkness, float shadowSize) {
  float shadow = 0.0;
  for (int x = -2; x <= 2; ++x) {
    for (int y = -2; y <= 2; ++y) {
      float closestDepth = getDepth(shadowMap, shadowUV + vec2(x, y) * 1.0/shadowSize);
      shadow += currentDepth > closestDepth  ? 1.0 - darkness : 1.0;
    }
  }
  shadow /= 25.0;
  return shadow;
}

#define CC_CALC_SHADOW(index, light) \
  #if CC_USE_SHADOW_MAP && CC_NUM_SHADOW_LIGHTS > index \
    float shadow_##index = 1.0; \
    vec2 projCoords##index = v_posLightSpace[index].xy / v_posLightSpace[index].w; \
    vec2 shadowUV##index = projCoords##index * 0.5 + vec2(0.5); /*(-1, 1) => (0, 1)*/ \
    if (shadowUV##index.x >= 0.0 && shadowUV##index.x <= 1.0 && shadowUV##index.y >= 0.0 && shadowUV##index.y <= 1.0) { \
      float currentDepth##index = clamp(v_depth[index], 0.0, 1.0); \
      #if CC_SHADOW_##index##_TYPE == CC_SHADOW_TYPE_SOFT_PCF3X3 \
        shadow_##index = shadowPCF3X3(cc_shadow_map_##index, shadowUV##index, currentDepth##index, cc_shadow_info[index].w, cc_shadow_info[index].z); \
      #elif CC_SHADOW_##index##_TYPE == CC_SHADOW_TYPE_SOFT_PCF5X5 \
        shadow_##index = shadowPCF5X5(cc_shadow_map_##index, shadowUV##index, currentDepth##index, cc_shadow_info[index].w, cc_shadow_info[index].z); \
      #else \
        shadow_##index = shadowSimple(cc_shadow_map_##index, shadowUV##index, currentDepth##index, cc_shadow_info[index].w); \
      #endif \
      shadow_##index = computeFallOff(shadow_##index, projCoords##index, 0.0); \
    } \
    \
    light.diffuse *= shadow_##index; \
    light.specular *= shadow_##index; \
  #endif  
