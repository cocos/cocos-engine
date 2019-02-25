// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-global>
#include <common-attribute>
#include <encodings>

#include <common>

varying vec3 v_worldNormal;
varying vec3 v_worldPos;

#include <normal>
#include <diffuse>
#include <specular>
#include <emissive>
#include <lights-phong>
#include <alpha-test>

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
  CALC_PHONG_LIGHTING(phongColor, material, normal, v_worldPos, viewDirection);

  gl_FragColor = LINEAR_TO_OUTPUT_TEXEL( phongColor );
}
