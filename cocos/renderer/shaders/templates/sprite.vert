// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;
uniform mat4 model;
uniform mat4 viewProj;

attribute vec2 a_uv0;
attribute vec4 a_color;
varying vec2 uv0;
varying vec4 color;

void main () {
  vec4 pos = vec4(a_position, 1);

  pos = viewProj * model * pos;

  uv0 = a_uv0;

  color = a_color;

  gl_Position = pos;
}