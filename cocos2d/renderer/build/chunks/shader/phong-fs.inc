// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-global>
#include <texture>
#include <output>
#include <alpha-test>

uniform PhongFrag {
  lowp vec4 diffuseColor;
  lowp vec4 specularColor;
  lowp vec4 emissiveColor;
  float glossiness;
};

#if USE_DIFFUSE_TEXTURE
  uniform sampler2D diffuseTexture;
#endif

#if USE_SPECULAR && USE_SPECULAR_TEXTURE
  uniform sampler2D specularTexture;
#endif

#if USE_EMISSIVE && USE_EMISSIVE_TEXTURE
  uniform sampler2D emissiveTexture;
#endif

#if USE_NORMAL_TEXTURE
  in vec3 v_tangent;
  in vec3 v_bitangent;
  uniform sampler2D normalTexture;
#endif

#define CC_USE_TEXTURE CC_USE_ATTRIBUTE_UV0 && (USE_DIFFUSE_TEXTURE || (USE_EMISSIVE && USE_EMISSIVE_TEXTURE) || (USE_SPECULAR && USE_SPECULAR_TEXTURE) || USE_NORMAL_TEXTURE)

in vec3 v_worldNormal;
in vec3 v_worldPos;
in vec3 v_viewDirection;

#if CC_USE_TEXTURE
  in mediump vec2 v_uv0;
#endif

#if CC_USE_ATTRIBUTE_COLOR
  in lowp vec4 v_color;
#endif

#include <shading-phong>

void surf (out PhongSurface s) {
  vec4 diffuse = vec4(1, 1, 1, 1);
  
  #if CC_USE_ATTRIBUTE_COLOR
    diffuse *= v_color;
  #endif

  diffuse *= diffuseColor;
  #if USE_DIFFUSE_TEXTURE
    CCTexture(diffuseTexture, v_uv0, diffuse);
  #endif

  ALPHA_TEST(diffuse);

  s.diffuse = diffuse.rgb;
  s.opacity = diffuse.a;

  #if USE_EMISSIVE
    s.emissive = emissiveColor.rgb;
    #if USE_EMISSIVE_TEXTURE
      CCTextureRGB(emissiveTexture, v_uv0, s.emissive);
    #endif
  #endif

  #if USE_SPECULAR
    s.specular = specularColor.rgb;
    #if USE_SPECULAR_TEXTURE
      CCTextureRGB(specularTexture, v_uv0, s.specular);
    #endif
  #endif

  s.normal = v_worldNormal;
  #if USE_NORMAL_TEXTURE
    vec3 nmmp = texture(normalTexture, v_uv0).xyz - vec3(0.5);
    s.normal =
      nmmp.x * normalize(v_tangent) +
      nmmp.y * normalize(v_bitangent) +
      nmmp.z * normalize(s.normal);
    s.normal = normalize(s.normal);
  #endif

  s.position = v_worldPos;
  s.viewDirection = v_viewDirection;
  s.glossiness = glossiness;
}

void main () {
  PhongSurface s;
  surf(s);
  vec4 color = CCPhongShading(s);
  gl_FragColor = CCFragOutput(color);
}
