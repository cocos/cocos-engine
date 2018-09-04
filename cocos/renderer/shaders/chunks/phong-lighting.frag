// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

struct LightInfo {
  vec3 diffuse;
  vec3 specular;
};

LightInfo computeDirectionalLighting(
  vec3 lightDirection,
  vec3 lightColor,
  vec3 normal,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = -normalize(lightDirection);
  ndl = max(0.0, dot(normal, lightDir));
  lightingResult.diffuse = lightColor * ndl;

  vec3 dirH = normalize(viewDirection + lightDir);
  ndh = max(0.0, dot(normal, dirH));
  ndh = (ndl == 0.0) ? 0.0: ndh;
  ndh = pow(ndh, max(1.0, glossiness * 128.0));
  lightingResult.specular = lightColor * ndh;

  return lightingResult;
}

LightInfo computePointLighting(
  vec3 lightPosition,
  vec3 lightColor,
  float lightRange,
  vec3 normal,
  vec3 positionW,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = vec3(0, 0, 0);
  float attenuation = 1.0;
  lightDir = lightPosition - positionW;
  attenuation = max(0., 1.0 - length(lightDir) / lightRange);
  lightDir = normalize(lightDir);
  ndl = max(0.0, dot(normal, lightDir));
  lightingResult.diffuse = lightColor * ndl * attenuation;

  vec3 dirH = normalize(viewDirection + lightDir);
  ndh = max(0.0, dot(normal, dirH));
  ndh = (ndl == 0.0) ? 0.0: ndh;
  ndh = pow(ndh, max(1.0, glossiness * 128.0));
  lightingResult.specular = lightColor * ndh * attenuation;

  return lightingResult;
}

LightInfo computeSpotLighting(
  vec3 lightPosition,
  vec3 lightDirection,
  vec3 lightColor,
  float lightRange,
  vec2 lightSpot,
  vec3 normal,
  vec3 positionW,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = vec3(0, 0, 0);
  float attenuation = 1.0;
  float cosConeAngle = 1.0;

  lightDir = lightPosition - positionW;
  attenuation = max(0., 1.0 - length(lightDir) / lightRange);
  lightDir = normalize(lightDir);
  cosConeAngle = max(0., dot(lightDirection, -lightDir));
  cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;
  cosConeAngle = pow(cosConeAngle,lightSpot.y);
  ndl = max(0.0, dot(normal, lightDir));
  lightingResult.diffuse = lightColor * ndl * attenuation * cosConeAngle;

  vec3 dirH = normalize(viewDirection + lightDir);
  ndh = max(0.0, dot(normal, dirH));
  ndh = (ndl == 0.0) ? 0.0: ndh;
  ndh = pow(ndh, max(1.0, glossiness * 128.0));
  lightingResult.specular = lightColor * ndh * attenuation * cosConeAngle;

  return lightingResult;
}

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
    uniform float spot_light{id}_range;
    uniform vec2 spot_light{id}_spot;
  #pragma endFor
#endif

LightInfo getPhongLighting(
  vec3 normal,
  vec3 positionW,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo result;
  result.diffuse = vec3(0, 0, 0);
  result.specular = vec3(0, 0, 0);
  LightInfo dirLighting;
  #if NUM_DIR_LIGHTS > 0
    #pragma for id in range(0, NUM_DIR_LIGHTS)
      dirLighting = computeDirectionalLighting(dir_light{id}_direction,dir_light{id}_color,normal, viewDirection, glossiness);
      result.diffuse += dirLighting.diffuse;
      result.specular += dirLighting.specular;
    #pragma endFor
  #endif

  LightInfo pointLighting;
  #if NUM_POINT_LIGHTS > 0
    #pragma for id in range(0, NUM_POINT_LIGHTS)
      pointLighting = computePointLighting(point_light{id}_position, point_light{id}_color, point_light{id}_range,
                                          normal, positionW, viewDirection, glossiness);
      result.diffuse += pointLighting.diffuse;
      result.specular += pointLighting.specular;
    #pragma endFor
  #endif

  LightInfo spotLighting;
  #if NUM_SPOT_LIGHTS > 0
    #pragma for id in range(0, NUM_SPOT_LIGHTS)
      spotLighting = computeSpotLighting(spot_light{id}_position, spot_light{id}_direction, spot_light{id}_color,
                      spot_light{id}_range, spot_light{id}_spot,normal, positionW, viewDirection, glossiness);
      result.diffuse += spotLighting.diffuse;
      result.specular += spotLighting.specular;
    #pragma endFor
  #endif
  return result;
}
