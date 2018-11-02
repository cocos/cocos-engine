// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 model;
uniform mat4 viewProj;
uniform mat3 normalMatrix;

varying vec3 normal_w;
varying vec3 pos_w;
varying vec3 pos_l;

void main () {
  vec4 pos = vec4(a_position, 1);

  pos_l = a_position;
  pos_w = (model * pos).xyz;
  normal_w = normalMatrix * a_normal;

  gl_Position = viewProj * model * pos;
}
