// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.


// TODO: lights uniform should move back to cc-global

#define CC_MAX_LIGHTS 2

#if CC_NUM_DIR_LIGHTS > 0 || CC_NUM_POINT_LIGHTS > 0 || CC_NUM_SPOT_LIGHTS > 0 || CC_NUM_AMBIENT_LIGHTS > 0

// directional lights
#pragma builtin(global)
uniform CCLIGHTS {
  vec4 cc_dirLightDirection[CC_MAX_LIGHTS];            // xyz
  vec4 cc_dirLightColor[CC_MAX_LIGHTS];                // xyz

  vec4 cc_pointLightPositionAndRange[CC_MAX_LIGHTS];   // xyz range
  vec4 cc_pointLightColor[CC_MAX_LIGHTS];              // xyz

  vec4 cc_spotLightPositionAndRange[CC_MAX_LIGHTS];    // xyz range
  vec4 cc_spotLightDirection[CC_MAX_LIGHTS];           // xyz spotAngle
  vec4 cc_spotLightColor[CC_MAX_LIGHTS];               // xyz spotExp

  vec4 cc_ambientColor[CC_MAX_LIGHTS];                 // xyz
};

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
