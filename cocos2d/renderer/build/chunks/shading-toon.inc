// Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.
#include <cc-global>
#include <cc-lights>

struct ToonSurface {
  vec4 baseColor;
  // specular
  vec3 specular;
  float specularThreshold;
  // these need to be in the same coordinate system
  vec3 position;
  vec3 normal;
  vec3 viewDirection;
  // emissive
  vec3 emissive;
  // shadow
  vec3 shadowColor;
  float shadowIntensity;
  vec3 highlightColor;
  // light
  float lightThreshold;
  float lightSmoothness;
};

const float T_H = 0.25;
float TreshHoldLighting(float lThreshold, float smoothness, float v) {
  return smoothstep(lThreshold-smoothness*T_H, lThreshold+smoothness*T_H, v);
}

Lighting toon (ToonSurface s, LightInfo info) {
  Lighting result;

  vec3 N = s.normal;
  vec3 L = info.lightDir;
  vec3 V = s.viewDirection;
  vec3 H = normalize(L + V);
  float NL = 0.5 * dot(N, L) + 0.5;
  float NH = 0.5 * dot(H, N) + 0.5;

  vec3 c = vec3(0.0);

  vec3 attenuation = info.radiance;
  vec3 lightColor = info.lightColor.rgb;

  // diffuse
  vec3 shadowColor = mix(s.highlightColor * lightColor, s.shadowColor, s.shadowIntensity);
  vec3 diffuse = TreshHoldLighting(s.lightThreshold, s.lightSmoothness, NL) * attenuation;
  diffuse = mix(shadowColor, s.highlightColor * lightColor, diffuse);

  result.diffuse = diffuse * s.baseColor.rgb;

  // specular
  float specularWeight = 1.0 - pow(s.specularThreshold, 5.0);
  float specularMask = step(specularWeight, NH);
  vec3 specular = s.specular.rgb * specularMask;

  result.specular = specular * attenuation;

  return result;
}

vec3 ambient(ToonSurface s, vec4 ambientColor) {
  return s.baseColor.rgb * ambientColor.rgb;
}

vec4 CCToonShading (ToonSurface s) {
  Lighting result;
  CC_CALC_LIGHTS(s, result, toon, ambient)

  vec3 finalColor = result.diffuse + result.specular + s.emissive;
  return vec4(finalColor, s.baseColor.a);
}
