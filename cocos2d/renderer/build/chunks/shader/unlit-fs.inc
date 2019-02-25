// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <common-attribute>
#include <encodings>
#include <diffuse>
#include <alpha-test>

void main () {
  vec4 diffuse;
  CALC_DIFFUSE(diffuse);
  ALPHA_TEST(diffuse);
  gl_FragColor = LINEAR_TO_OUTPUT_TEXEL( diffuse );
}
