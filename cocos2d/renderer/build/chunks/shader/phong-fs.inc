// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-global>
#include <encodings>

#include <common>
#include <normal>
#include <diffuse>
#include <specular>
#include <emissive>
#include <alpha-test>
#include <shadow>
#include <lights>

#define CC_USE_TEXTURE CC_USE_ATTRIBUTE_UV0 && (USE_DIFFUSE_TEXTURE || USE_EMISSIVE_TEXTURE || USE_SPECULAR_TEXTURE || USE_NORMAL_TEXTURE)

in vec3 v_worldNormal;
in vec3 v_worldPos;

#if CC_USE_TEXTURE
  in mediump vec2 v_uv0;
#endif

#if CC_USE_ATTRIBUTE_COLOR
  in lowp vec4 v_color;
#endif

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

  #if CC_NUM_DIR_LIGHTS > 0
    for (int i = 0; i < CC_NUM_DIR_LIGHTS; i++) {
      LightInfo info = computeDirectionalLighting(cc_dirLightDirection[i], cc_dirLightColor[i]);
      brdf(result, info, normal, viewDirection, glossiness);
    }
  #endif

  #if CC_NUM_POINT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_POINT_LIGHTS; i++) {
      LightInfo info = computePointLighting(worldPos, cc_pointLightPositionAndRange[i], cc_pointLightColor[i]);
      brdf(result, info, normal, viewDirection, glossiness);
    }
  #endif

  #if CC_NUM_SPOT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_SPOT_LIGHTS; i++) {
      LightInfo info = computeSpotLighting(worldPos, cc_spotLightPositionAndRange[i], cc_spotLightDirection[i], cc_spotLightColor[i]);
      brdf(result, info, normal, viewDirection, glossiness);
    }
  #endif

  #if CC_NUM_AMBIENT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_AMBIENT_LIGHTS; i++) {
      result.diffuse += cc_ambientColor[i].rgb;
    }
  #endif

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
  vec4 diffuse = vec4(1, 1, 1, 1);
  
  #if CC_USE_ATTRIBUTE_COLOR
    diffuse *= v_color;
  #endif

  #if USE_DIFFUSE_TEXTURE
    CALC_DIFFUSE(diffuse, v_uv0);
  #else
    CALC_DIFFUSE(diffuse);
  #endif

  ALPHA_TEST(diffuse);

  PhongMaterial material;
  material.diffuse = diffuse.rgb;
  material.opacity = diffuse.a;

  #if USE_EMISSIVE_TEXTURE
    CALC_EMISSIVE(material.emissive, v_uv0);
  #else
    CALC_EMISSIVE(material.emissive);
  #endif

  #if USE_SPECULAR_TEXTURE
    CALC_SPECULAR(material.specular, v_uv0);
  #else
    CALC_SPECULAR(material.specular);
  #endif

  vec3 viewDirection = normalize(cc_cameraPos.xyz - v_worldPos);
  vec4 phongColor;

  vec3 normal = normalize(v_worldNormal);
  #if USE_NORMAL_TEXTURE
    CALC_NORMAL(normal, v_worldPos, v_uv0);
  #endif

  calcPhongLighting(phongColor, material, normal, v_worldPos, viewDirection);

  gl_FragColor = LINEAR_TO_OUTPUT_TEXEL( phongColor );
}
