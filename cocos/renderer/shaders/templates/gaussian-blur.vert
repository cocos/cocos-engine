// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec2 a_position;
attribute vec2 a_uv0;

varying vec2 uv;

void main() {
  uv = a_uv0;
  gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
}