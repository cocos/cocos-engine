// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

struct LightInfo {
  vec3 lightDir;
  vec3 radiance;
};

#if NUM_DIR_LIGHTS > 0
  #pragma for id in range(0, NUM_DIR_LIGHTS)
    uniform vec3 dir_light{id}_direction;
    uniform vec3 dir_light{id}_color;
  #pragma endFor
#endif

#if NUM_POINT_LIGHTS > 0
  #pragma for id in range(0, NUM_POINT_LIGHTS)
    uniform vec3 point_light{id}_position;
    uniform vec3 point_light{id}_color;
    uniform float point_light{id}_range;
  #pragma endFor
#endif

#if NUM_SPOT_LIGHTS > 0
  #pragma for id in range(0, NUM_SPOT_LIGHTS)
    uniform vec3 spot_light{id}_position;
    uniform vec3 spot_light{id}_direction;
    uniform vec3 spot_light{id}_color;
    uniform vec2 spot_light{id}_spot;
    uniform float spot_light{id}_range;
  #pragma endFor
#endif

// directional light
LightInfo computeDirectionalLighting(
  vec3 lightDirection,
  vec3 lightColor
) {
  LightInfo ret;
  ret.lightDir = -normalize(lightDirection);
  ret.radiance = lightColor;

  return ret;
}

// point light
LightInfo computePointLighting(
  vec3 lightPosition,
  vec3 positionW,
  vec3 lightColor,
  float lightRange
) {
  LightInfo ret;
  vec3 lightDir = lightPosition - positionW;
  float attenuation = max(0.0, 1.0 - length(lightDir) / lightRange);
  ret.lightDir = normalize(lightDir);
  ret.radiance = lightColor * attenuation;

  return ret;
}

// spot light
LightInfo computeSpotLighting(
  vec3 lightPosition,
  vec3 positionW,
  vec3 lightDirection,
  vec3 lightColor,
  vec2 lightSpot,
  float lightRange
) {
  LightInfo ret;
  vec3 lightDir = lightPosition - positionW;
  float attenuation = max(0., 1.0 - length(lightDir) / lightRange);
  float cosConeAngle = max(0., dot(lightDirection, -lightDir));
  cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;
  cosConeAngle = pow(cosConeAngle,lightSpot.y);
  ret.lightDir = normalize(lightDir);
  ret.radiance = lightColor * attenuation * cosConeAngle;

  return ret;
}