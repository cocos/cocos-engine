// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// precision highp float;

attribute vec2 a_uv0;
attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 model;
uniform mat4 viewProj;

varying vec2 uv0;
varying vec4 pos_w;

#if USE_WORLD_POS
  uniform mat3 normalMatrix;
  varying vec3 normal_w;
#endif

void main () {
  uv0 = a_uv0;
  pos_w = model * vec4(a_position, 1);

  #if USE_WORLD_POS
    normal_w = normalMatrix * a_normal;
  #endif

  gl_Position = viewProj * pos_w;
}