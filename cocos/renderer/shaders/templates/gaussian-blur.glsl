// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

### VERT ###

attribute vec2 a_position;
attribute vec2 a_uv0;

varying vec2 uv;

void main() {
  uv = a_uv0;
  gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
}

### FRAG ###

// log-space gaussian blur for shadow map pre-filter.
// TODO: also need a linear-space one for normally use ?

varying vec2 uv;

uniform sampler2D texture;
uniform vec2 pixelSize;

#include <packing>

float kGaussianBlur[10];

float log_conv(float x0, float X, float y0, float Y) {
  return ( X + log( x0 + (y0 * exp(Y - X) ) ) );
}

void main() {
  kGaussianBlur[0] = 0.0882357;
  kGaussianBlur[1] = 0.0957407;
  kGaussianBlur[2] = 0.101786;
  kGaussianBlur[3] = 0.106026;
  kGaussianBlur[4] = 0.108212;
  kGaussianBlur[5] = 0.108212;
  kGaussianBlur[6] = 0.106026;
  kGaussianBlur[7] = 0.101786;
  kGaussianBlur[8] = 0.0957407;
  kGaussianBlur[9] = 0.0882357;

  float sample[10];
  for (int i = 0; i < 10; ++i) {
    float offset = float(i) - 4.5;
    vec2 texCoord = vec2( uv.x + offset * pixelSize.x, uv.y + offset * pixelSize.y);
    sample[i] = unpackRGBAToDepth(texture2D(texture, texCoord));
  }
  float sum = log_conv(kGaussianBlur[0], sample[0], kGaussianBlur[1], sample[1]);
  for (int i = 2; i < 10; ++i) {
    sum = log_conv(1.0, sum, kGaussianBlur[i], sample[i]);
  }

  gl_FragColor = packDepthToRGBA(sum);
}
