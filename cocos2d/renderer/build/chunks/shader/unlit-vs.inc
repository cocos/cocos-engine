// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-local>
#include <cc-global>
#include <skinning>

#define CC_USE_TEXTURE CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE

uniform MAIN_TILING {
  vec2 mainTiling;
  vec2 mainOffset;
}

in vec3 a_position;

#if CC_USE_TEXTURE
  in mediump vec2 a_uv0;
  out mediump vec2 v_uv0;
#endif

#if CC_USE_ATTRIBUTE_COLOR
  in lowp vec4 a_color;
  out lowp vec4 v_color;
#endif


void main () {
  vec4 position = vec4(a_position, 1);

  SKIN_VERTEX(position);
  
  #if CC_USE_ATTRIBUTE_COLOR
      v_color = a_color;
  #endif

  #if CC_USE_TEXTURE
      v_uv0 = a_uv0 * mainTiling + mainOffset;
  #endif

  gl_Position = cc_matViewProj * cc_matWorld * position;
}
