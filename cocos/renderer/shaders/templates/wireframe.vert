// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// precision highp float;

attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 model, viewProj;
uniform mat3 normalMatrix;

varying vec3 position_w;
varying vec3 normal_w;

void main () {
  vec4 pos = vec4(a_position, 1);

  position_w = (model * pos).xyz;
  pos = viewProj * model * pos;
  normal_w = normalMatrix * a_normal.xyz;

  gl_Position = pos;
}