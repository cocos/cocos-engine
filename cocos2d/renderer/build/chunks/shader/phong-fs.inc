// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-global>
#include <texture>
#include <output>
#include <alpha-test>

uniform UNLIT {
  lowp vec4 diffuseColor;
  lowp vec4 specularColor;
  lowp vec4 emissiveColor;
};

#if USE_DIFFUSE_TEXTURE
  uniform sampler2D diffuseTexture;
#endif

#if USE_SPECULAR_TEXTURE
  uniform sampler2D specularTexture;
#endif

#if USE_EMISSIVE_TEXTURE
  uniform sampler2D emissiveTexture;
#endif

#if USE_NORMAL_TEXTURE
  in vec3 v_tangent;
  in vec3 v_bitangent;
  uniform sampler2D normalTexture;
#endif

#define CC_USE_TEXTURE CC_USE_ATTRIBUTE_UV0 && (USE_DIFFUSE_TEXTURE || USE_EMISSIVE_TEXTURE || USE_SPECULAR_TEXTURE || USE_NORMAL_TEXTURE)

in vec3 v_worldNormal;
in vec3 v_worldPos;

#if CC_USE_TEXTURE
  in mediump vec2 v_uv0;
#endif

#if CC_USE_ATTRIBUTE_COLOR
  in lowp vec4 v_color;
#endif

#include <shading-phong>

void main () {
  vec4 diffuse = vec4(1, 1, 1, 1);
  
  #if CC_USE_ATTRIBUTE_COLOR
    diffuse *= v_color;
  #endif

  diffuse *= diffuseColor;
  #if USE_DIFFUSE_TEXTURE
    CCTexture2D(diffuseTexture, v_uv0, diffuse);
  #endif

  ALPHA_TEST(diffuse);

  PhongMaterial material;
  material.diffuse = diffuse.rgb;
  material.opacity = diffuse.a;

  material.emissive = emissiveColor.rgb;
  #if USE_EMISSIVE_TEXTURE
    CCTexture2DRGB(emissiveTexture, v_uv0, material.emissive);
  #endif

  material.specular = specularColor.rgb;
  #if USE_SPECULAR_TEXTURE
    CCTexture2DRGB(specularTexture, v_uv0, material.specular);
  #endif

  vec3 viewDirection = normalize(cc_cameraPos.xyz - v_worldPos);
  vec4 phongColor;

  vec3 normal = v_worldNormal;
  #if USE_NORMAL_TEXTURE
    vec3 nmmp = texture2D(normalTexture, v_uv0).xyz - vec3(0.5);
    normal =
      nmmp.x * normalize(v_tangent) +
      nmmp.y * normalize(v_bitangent) +
      nmmp.z * normalize(normal);
  #endif

  CALC_PHONG_LIGHTING(phongColor, material, normal, v_worldPos, viewDirection);

  gl_FragColor = CCFragOutput(phongColor);
}
