// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.


// TODO: lights uniform should move back to cc-global

#include <shadow>

#define CC_MAX_LIGHTS 4

#if CC_NUM_LIGHTS > 0

// directional lights
#pragma builtin(global)
uniform CCLIGHTS {
  vec4 cc_lightPositionAndRange[CC_MAX_LIGHTS];    // xyz range
  vec4 cc_lightDirection[CC_MAX_LIGHTS];           // xyz spotAngle
  vec4 cc_lightColor[CC_MAX_LIGHTS];               // xyz spotExp
};

#endif

struct LightInfo {
  vec3 lightDir;
  vec3 radiance;
  vec4 lightColor;
};

// directional light
LightInfo computeDirectionalLighting(
  vec4 lightDirection,
  vec4 lightColor
) {
  LightInfo ret;
  ret.lightDir = -normalize(lightDirection.xyz);
  ret.radiance = lightColor.rgb;
  ret.lightColor = lightColor;
  return ret;
}

// point light
LightInfo computePointLighting(
  vec3 worldPosition,
  vec4 lightPositionAndRange,
  vec4 lightColor
) {
  LightInfo ret;
  vec3 lightDir = lightPositionAndRange.xyz - worldPosition;
  float attenuation = max(0., 1.0 - length(lightDir) / lightPositionAndRange.w);
  
  ret.lightDir = normalize(lightDir);
  ret.radiance = lightColor.rgb * attenuation;
  ret.lightColor = lightColor;
  return ret;
}

// spot light
LightInfo computeSpotLighting(
  vec3 worldPosition,
  vec4 lightPositionAndRange,
  vec4 lightDirection,
  vec4 lightColor
) {
  LightInfo ret;
  vec3 lightDir = lightPositionAndRange.xyz - worldPosition;
  float attenuation = max(0., 1.0 - length(lightDir) / lightPositionAndRange.w);
  lightDir = normalize(lightDir);
  float cosConeAngle = max(0., dot(lightDirection.xyz, -lightDir));
  cosConeAngle = cosConeAngle < lightDirection.w ? 0. : cosConeAngle;
  cosConeAngle = pow(cosConeAngle, lightColor.w);
  
  ret.lightDir = lightDir;
  ret.radiance = lightColor.rgb * attenuation * cosConeAngle;
  ret.lightColor = lightColor;
  return ret;
}

struct Lighting {
  vec3 diffuse;
  vec3 specular;
};

#define CC_CALC_LIGHT(index, surface, result, lightFunc, ambientFunc) \
  #if CC_NUM_LIGHTS > index \
    #if CC_LIGHT_##index##_TYPE == 3 \
      result.diffuse += ambientFunc(s, cc_lightColor[index]); \
    #else \
      LightInfo info##index; \
      #if CC_LIGHT_##index##_TYPE == 0 \
        info##index = computeDirectionalLighting(cc_lightDirection[index], cc_lightColor[index]); \
      #elif CC_LIGHT_##index##_TYPE == 1 \
        info##index = computePointLighting(s.position, cc_lightPositionAndRange[index], cc_lightColor[index]); \
      #elif CC_LIGHT_##index##_TYPE == 2 \
        info##index = computeSpotLighting(s.position, cc_lightPositionAndRange[index], cc_lightDirection[index], cc_lightColor[index]); \
      #endif \
      \
      Lighting result##index = lightFunc(surface, info##index); \
      CC_CALC_SHADOW(index, result##index) \
      result.diffuse += result##index.diffuse; \
      result.specular += result##index.specular; \
    #endif \
  #endif

#define CC_CALC_LIGHTS(surface, result, lightFunc, ambientFunc) \
  result.diffuse = vec3(0, 0, 0); \
  result.specular = vec3(0, 0, 0); \
  \
  CC_CALC_LIGHT(0, surface, result, lightFunc, ambientFunc) \
  CC_CALC_LIGHT(1, surface, result, lightFunc, ambientFunc) \
  CC_CALC_LIGHT(2, surface, result, lightFunc, ambientFunc) \
  CC_CALC_LIGHT(3, surface, result, lightFunc, ambientFunc)