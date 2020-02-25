// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#define CC_SHADOW_TYPE_HARD 1
#define CC_SHADOW_TYPE_SOFT_PCF3X3 2
#define CC_SHADOW_TYPE_SOFT_PCF5X5 3
#define CC_SHADOW_TYPE_SOFT_VSM 4
#define CC_SHADOW_TYPE_SOFT_ESM 5

#define VSM_EXPONENT 80.0

in float v_depth;

#include <packing>

void main () {
  float depth = 2.0 * v_depth - 1.0;
  #if CC_SHADOW_TYPE == CC_SHADOW_TYPE_SOFT_VSM || CC_SHADOW_TYPE == CC_SHADOW_TYPE_SOFT_ESM
    float exponent = VSM_EXPONENT;
    depth = exp(exponent * depth);
  #endif

  #if CC_SUPPORT_FLOAT_TEXTURE
    gl_FragColor = vec4(depth, depth*depth, 1.0, 1.0);
  #else
    gl_FragColor = packDepthToRGBA(depth);
  #endif
}
