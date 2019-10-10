// Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.
#include <cc-global>
#include <cc-lights>

struct ToonSurface {
  vec4 baseColor;
  vec4 specular;
  // these two need to be in the same coordinate system
  vec3 position;
  vec3 normal;
  // shading params
  vec3 shade1;
  vec3 shade2;
  vec3 emissive;
  float baseStep;
  float baseFeather;
  float shadeStep;
  float shadeFeather;
};

// Inspired by UTS2, (C)UTJ/UCL
vec4 CCToonShading (ToonSurface s) {
  vec3 V = normalize(cc_cameraPos.xyz - s.position);
  vec3 N = s.normal;

  vec3 finalColor = vec3(0.0);
  float specularWeight = 1.0 - pow(s.specular.a, 5.0);

  #if CC_NUM_DIR_LIGHTS > 0
    for (int i = 0; i < CC_NUM_DIR_LIGHTS; i++) {
        LightInfo info = computeDirectionalLighting(cc_dirLightDirection[i], cc_dirLightColor[i]);
        vec3 lightColor = info.radiance * s.baseStep;

        vec3 L = info.lightDir;
        float NL = 0.5 * dot(N, L) + 0.5;
        float NH = 0.5 * dot(normalize(V + L), N) + 0.5;

        vec3 diffuse = mix(s.shade1, s.shade2,
          clamp(1.0 + (s.shadeStep - s.shadeFeather - NL) / s.shadeFeather, 0.0, 1.0));
        diffuse = mix(s.baseColor.rgb, diffuse,
          clamp(1.0 + (s.baseStep - s.baseFeather - NL) / s.baseFeather, 0.0, 1.0));

        float specularMask = step(specularWeight, NH);
        vec3 specular = s.specular.rgb * specularMask;

        finalColor += lightColor * (diffuse + specular);
    }
  #endif

  // sphere lights
  #if CC_NUM_POINT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_POINT_LIGHTS; i++) {
      LightInfo info = computePointLighting(s.position, cc_pointLightPositionAndRange[i], cc_pointLightColor[i]);
      vec3 lightColor = info.radiance * s.baseStep;

      vec3 PL = info.lightDir;
      vec3 PH = normalize(PL + V);
      float PNL = 0.5 * dot(N, PL) + 0.5;
      float PNH = 0.5 * dot(N, PH) + 0.5;


      vec3 diffuse = mix(s.shade1, s.shade2,
        clamp(1.0 + (s.shadeStep - s.shadeFeather - PNL) / s.shadeFeather, 0.0, 1.0));
      diffuse = mix(s.baseColor.rgb, diffuse,
        clamp(1.0 + (s.baseStep - s.baseFeather - PNL) / s.baseFeather, 0.0, 1.0));

      float specularMask = step(specularWeight, PNH);
      vec3 specular = s.specular.rgb * specularMask;

      finalColor += lightColor * (diffuse + specular);
    }
  #endif

  #if CC_NUM_SPOT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_SPOT_LIGHTS; i++) {
      LightInfo info = computeSpotLighting(s.position, cc_spotLightPositionAndRange[i], cc_spotLightDirection[i], cc_spotLightColor[i]);
      vec3 lightColor = info.radiance * s.baseStep;

      vec3 SL = info.lightDir;
      vec3 SH = normalize(SL + V);
      float SNL = 0.5 * dot(N, SL) + 0.5;
      float SNH = 0.5 * dot(N, SH) + 0.5;

      vec3 diffuse = mix(s.shade1, s.shade2,
        clamp(1.0 + (s.shadeStep - s.shadeFeather - SNL) / s.shadeFeather, 0.0, 1.0));
      diffuse = mix(s.baseColor.rgb, diffuse,
        clamp(1.0 + (s.baseStep - s.baseFeather - SNL) / s.baseFeather, 0.0, 1.0));

      float specularMask = step(specularWeight, SNH);
      vec3 specular = s.specular.rgb * specularMask;

      finalColor += lightColor * (diffuse + specular);
    }
  #endif

  #if CC_NUM_AMBIENT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_AMBIENT_LIGHTS; i++) {
      finalColor += cc_ambientColor[i].rgb;
    }
  #endif

  finalColor += s.emissive;
  return vec4(finalColor, s.baseColor.a);
}
