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

#define CC_USE_TEXTURE CC_USE_ATTRIBUTE_UV0 && (USE_DIFFUSE_TEXTURE || USE_EMISSIVE_TEXTURE || USE_SPECULAR_TEXTURE || USE_NORMAL_TEXTURE)

in vec3 v_worldNormal;
in vec3 v_worldPos;

#if CC_USE_TEXTURE
  in mediump vec2 v_uv0;
#endif

#if CC_USE_ATTRIBUTE_COLOR
  in lowp vec4 v_color;
#endif

#include <phong>

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

  CALC_PHONG_LIGHTING(phongColor, material, normal, v_worldPos, viewDirection);

  gl_FragColor = LINEAR_TO_OUTPUT_TEXEL( phongColor );
}
