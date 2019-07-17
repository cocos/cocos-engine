// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <encodings>
#include <alpha-test>
#include <diffuse>

#define CC_USE_TEXTURE CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE

#if CC_USE_ATTRIBUTE_COLOR
  in lowp vec4 v_color;
#endif

#if CC_USE_TEXTURE
  in mediump vec2 v_uv0;
#endif

void main () {
  vec4 color = vec4(1, 1, 1, 1);

  #if CC_USE_TEXTURE
    CALC_DIFFUSE(color, v_uv0);
  #else 
    CALC_DIFFUSE(color);
  #endif

  #if CC_USE_ATTRIBUTE_COLOR
    color *= v_color;
  #endif

  ALPHA_TEST(color);

  gl_FragColor = LINEAR_TO_OUTPUT_TEXEL( color );
}
