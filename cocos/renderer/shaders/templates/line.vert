// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// precision highp float;

attribute vec3 a_position;
attribute vec3 a_color;

uniform mat4 model;
uniform mat4 viewProj;

varying vec3 color;

void main () {
  vec4 pos = viewProj * model * vec4(a_position, 1);

  // // halp-pixel offset solution 1
  // vec4 pos = viewProj * model * vec4(
  //   floor(a_position.x) + 0.5,
  //   floor(a_position.y) + 0.5,
  //   a_position.z,
  //   1
  // );

  // halp-pixel offset solution 2
  // vec2 hpc = vec2(screen.x * 0.5, screen.y * 0.5);
  // vec4 pos = viewProj * model * vec4(a_position, 1);
  // pos = vec4(
  //   2.0 * ((floor((pos.x + 1.0) * 0.5 * screen.x) + 0.5) / screen.x - 0.5),
  //   2.0 * ((floor((pos.y + 1.0) * 0.5 * screen.y) - 0.5) / screen.y - 0.5),
  //   pos.z,
  //   pos.w
  // );

  color = a_color;

  gl_Position = pos;
}