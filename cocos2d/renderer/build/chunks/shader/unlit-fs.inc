// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <alpha-test>
#include <texture>
#include <output>

uniform UNLIT {
  lowp vec4 diffuseColor;
};

#if USE_DIFFUSE_TEXTURE
  uniform sampler2D diffuseTexture;
#endif

#define CC_USE_TEXTURE CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE

#if CC_USE_ATTRIBUTE_COLOR
  in lowp vec4 v_color;
#endif

#if CC_USE_TEXTURE
  in mediump vec2 v_uv0;
#endif

void main () {
  vec4 color = diffuseColor;

  #if CC_USE_TEXTURE
    CCTexture(diffuseTexture, v_uv0, color);
  #endif

  #if CC_USE_ATTRIBUTE_COLOR
    color *= v_color;
  #endif

  ALPHA_TEST(color);

  gl_FragColor = CCFragOutput(color);
}
