// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-local>
#include <cc-global>
#include <skinning>
#include <input-standard>

#define CC_USE_TEXTURE CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE

uniform MAIN_TILING {
  vec2 mainTiling;
  vec2 mainOffset;
};

#if CC_USE_TEXTURE
  out mediump vec2 v_uv0;
#endif

#if CC_USE_ATTRIBUTE_COLOR
  out lowp vec4 v_color;
#endif

void main () {
  StandardVertInput In;
  CCVertInput(In);

  #if CC_USE_ATTRIBUTE_COLOR
    v_color = In.color;
  #endif

  #if CC_USE_TEXTURE
    v_uv0 = In.uv * mainTiling + mainOffset;
  #endif

  gl_Position = cc_matViewProj * cc_matWorld * In.position;
}
