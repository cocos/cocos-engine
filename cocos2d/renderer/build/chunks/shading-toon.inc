// Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.
#include <cc-global>
#include <cc-lights>

struct ToonSurface {
  vec4 baseColor;
  // specular
  vec3 specular;
  float specularThreshold;
  // these two need to be in the same coordinate system
  vec3 position;
  vec3 normal;
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

vec3 combined (ToonSurface s, vec3 attenuation, vec3 lightColor, float NL, float NH, float specularWeight) {
  vec3 c = vec3(0.0);

  // diffuse
  vec3 shadowColor = mix(s.highlightColor * lightColor, s.shadowColor, s.shadowIntensity);
  vec3 diffuse = TreshHoldLighting(s.lightThreshold, s.lightSmoothness, NL) * attenuation;
  diffuse = mix(shadowColor, s.highlightColor * lightColor, diffuse);

  c += diffuse * s.baseColor.rgb;

  // specular
  float specularMask = step(specularWeight, NH);
  vec3 specular = s.specular.rgb * specularMask;

  c += specular * attenuation;

  return c;
}

// Inspired by UTS2, (C)UTJ/UCL
vec4 CCToonShading (ToonSurface s) {
  vec3 V = normalize(cc_cameraPos.xyz - s.position);
  vec3 N = s.normal;

  vec3 finalColor = vec3(0.0);
  float specularWeight = 1.0 - pow(s.specularThreshold, 5.0);

  #if CC_NUM_DIR_LIGHTS > 0
    for (int i = 0; i < CC_NUM_DIR_LIGHTS; i++) {
        LightInfo info = computeDirectionalLighting(cc_dirLightDirection[i], cc_dirLightColor[i]);

        vec3 L = info.lightDir;
        float NL = 0.5 * dot(N, L) + 0.5;
        float NH = 0.5 * dot(normalize(V + L), N) + 0.5;

        finalColor += combined(s, cc_dirLightColor[i].rgb, info.radiance, NL, NH, specularWeight);
    }
  #endif

  // sphere lights
  #if CC_NUM_POINT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_POINT_LIGHTS; i++) {
      LightInfo info = computePointLighting(s.position, cc_pointLightPositionAndRange[i], cc_pointLightColor[i]);

      vec3 PL = info.lightDir;
      vec3 PH = normalize(PL + V);
      float NL = 0.5 * dot(N, PL) + 0.5;
      float NH = 0.5 * dot(N, PH) + 0.5;

      finalColor += combined(s, cc_pointLightColor[i].rgb, info.radiance, NL, NH, specularWeight);
    }
  #endif

  #if CC_NUM_SPOT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_SPOT_LIGHTS; i++) {
      LightInfo info = computeSpotLighting(s.position, cc_spotLightPositionAndRange[i], cc_spotLightDirection[i], cc_spotLightColor[i]);

      vec3 SL = info.lightDir;
      vec3 SH = normalize(SL + V);
      float NL = 0.5 * dot(N, SL) + 0.5;
      float NH = 0.5 * dot(N, SH) + 0.5;

      finalColor += combined(s, cc_spotLightColor[i].rgb, info.radiance, NL, NH, specularWeight);
    }
  #endif

  #if CC_NUM_AMBIENT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_AMBIENT_LIGHTS; i++) {
      finalColor += s.baseColor.rgb * cc_ambientColor[i].rgb;
    }
  #endif

  finalColor += s.emissive;
  return vec4(finalColor, s.baseColor.a);
}
