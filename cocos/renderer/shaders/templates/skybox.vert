// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;

uniform mat4 view;
uniform mat4 proj;

varying vec3 viewDir;

void main() {
  mat4 rotView = mat4(mat3(view));
  vec4 clipPos = proj * rotView * vec4(a_position, 1.0);

  gl_Position = clipPos.xyww;
  viewDir = a_position;
}
