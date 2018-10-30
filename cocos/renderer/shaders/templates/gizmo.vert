// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 model;
uniform mat4 viewProj;
uniform mat3 normalMatrix;

varying vec3 normal_w;

void main () {
  vec4 pos = vec4(a_position, 1);

  pos = viewProj * model * pos;

  vec4 normal = vec4(a_normal, 0);
  normal_w = normalMatrix * normal.xyz;

  gl_Position = pos;
}
