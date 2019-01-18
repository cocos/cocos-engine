// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#include <shadowmap-declare-frag>

// TODO: lights uniform should move back to cc-global

// directional lights
#if _NUM_DIR_LIGHTS > 0
  uniform vec4 cc_dirLightDirection[_NUM_DIR_LIGHTS];            // xyz
  uniform vec4 cc_dirLightColor[_NUM_DIR_LIGHTS];                // xyz
#endif

// point lights
#if _NUM_POINT_LIGHTS > 0
  uniform vec4 cc_pointLightPositionAndRange[_NUM_POINT_LIGHTS];   // xyz range
  uniform vec4 cc_pointLightColor[_NUM_POINT_LIGHTS];              // xyz
#endif

// spot lights
#if _NUM_SPOT_LIGHTS > 0
  uniform vec4 cc_spotLightPositionAndRange[_NUM_SPOT_LIGHTS];    // xyz range
  uniform vec4 cc_spotLightDirection[_NUM_SPOT_LIGHTS];           // xyz spotAngle
  uniform vec4 cc_spotLightColor[_NUM_SPOT_LIGHTS];               // xyz spotExp
#endif


struct LightInfo {
  vec3 lightDir;
  vec3 radiance;
};

// directional light
LightInfo computeDirectionalLighting(
  vec4 lightDirection,
  vec4 lightColor
) {
  LightInfo ret;
  ret.lightDir = -normalize(lightDirection.xyz);
  ret.radiance = lightColor.rgb;
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
  return ret;
}
