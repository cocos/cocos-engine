// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-global>
#include <encodings>

varying vec3 v_worldNormal;
varying vec3 v_worldPos;

#include <common-attribute>
#include <common>
#include <normal>
#include <diffuse>
#include <specular>
#include <emissive>
#include <alpha-test>
#include <shadow>
#include <lights>

uniform PHONG {
  float glossiness;
}

struct PhongMaterial {
  vec3 diffuse;
  vec3 emissive;
  vec3 specular;
  float opacity;
};

struct Lighting {
  vec3 diffuse;
  vec3 specular;
};

void brdf (inout Lighting result, LightInfo info, vec3 normal, vec3 viewDirection, float glossiness) {
  float ndh = 0.0;
  // Get the half direction in world space
  vec3 halfDir = normalize(viewDirection + info.lightDir);
  float NdotH = max(0.0, dot(normal, halfDir));
  NdotH = pow(NdotH, max(1.0, glossiness * 128.0));

  vec3 diffuse = info.radiance * max(0.0, dot(normal, info.lightDir));
  vec3 specular = info.radiance * NdotH;

  result.diffuse += diffuse;
  result.specular += specular;
}

Lighting getPhongLighting (vec3 normal, vec3 worldPos, vec3 viewDirection, float glossiness) {
  Lighting result;
  result.diffuse = vec3(0, 0, 0);
  result.specular = vec3(0, 0, 0);

  #if _NUM_DIR_LIGHTS > 0
  for (int i = 0; i < _NUM_DIR_LIGHTS; i++) {
    LightInfo info = computeDirectionalLighting(cc_dirLightDirection[i], cc_dirLightColor[i]);
    brdf(result, info, normal, viewDirection, glossiness);
  }
  #endif

  // #if _NUM_POINT_LIGHTS > 0
  // for (int i = 0; i < _NUM_POINT_LIGHTS; i++) {
  //   LightInfo info = computePointLighting(worldPos, cc_pointLightPositionAndRange[i], cc_pointLightColor[i]);
  //   brdf(result, info, normal, viewDirection, glossiness);
  // }
  // #endif

  // #if _NUM_SPOT_LIGHTS > 0
  // for (int i = 0; i < _NUM_SPOT_LIGHTS; i++) {
  //   LightInfo info = computeSpotLighting(worldPos, cc_spotLightPositionAndRange[i], cc_spotLightDirection[i], cc_spotLightColor[i]);
  //   brdf(result, info, normal, viewDirection, glossiness);
  // }
  // #endif

  // #if _NUM_AMBIENT_LIGHTS > 0
  // for (int i = 0; i < _NUM_AMBIENT_LIGHTS; i++) {
  //   result.diffuse += cc_ambientColor[i].rgb;
  // }
  // #endif

  return result;
}

vec4 composePhongShading (Lighting lighting, PhongMaterial mtl) {
  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);

  //diffuse is always calculated
  o.rgb = lighting.diffuse * mtl.diffuse;
  
  #if USE_EMISSIVE
    o.rgb += mtl.emissive;
  #endif

  #if USE_SPECULAR
    o.rgb += lighting.specular * mtl.specular;
  #endif
  
  #if CC_USE_SHADOW_MAP
    o.rgb *= computeShadow();
  #endif

  o.a = mtl.opacity;

  return o;
}

void calcPhongLighting (inout vec4 outColor, in PhongMaterial material, in vec3 normal, in vec3 worldPosition, in vec3 viewDirection) {
  Lighting phongLighting = getPhongLighting(normal, worldPosition, viewDirection, glossiness);
  outColor = composePhongShading(phongLighting, material);
}

void main () {
  vec4 diffuse;
  CALC_DIFFUSE(diffuse);
  ALPHA_TEST(diffuse);

  PhongMaterial material;
  material.diffuse = diffuse.rgb;
  material.opacity = diffuse.a;

  CALC_EMISSIVE(material.emissive);
  CALC_SPECULAR(material.specular);

  vec3 viewDirection = normalize(cc_cameraPos.xyz - v_worldPos);
  vec3 normal;
  vec4 phongColor;

  CALC_NORMAL(normal, v_worldPos, v_worldNormal);

  calcPhongLighting(phongColor, material, normal, v_worldPos, viewDirection);

  gl_FragColor = LINEAR_TO_OUTPUT_TEXEL( phongColor );
}
