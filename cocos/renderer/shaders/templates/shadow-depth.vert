// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;

uniform mat4 model;
uniform mat4 lightViewProjMatrix;
uniform float minDepth;
uniform float maxDepth;
uniform float bias;
varying float vDepth;

#if USE_SKINNING
  #include <skinning.vert>
#endif

void main() {
  vec4 pos = vec4(a_position, 1);

  #if USE_SKINNING
    mat4 skinMat = skinMatrix();
    pos = skinMat * pos;
  #endif

  gl_Position = lightViewProjMatrix * model * pos;
  // compute vDepth according to active camera's minDepth and maxDepth.
  vDepth = ((gl_Position.z + minDepth) / (minDepth + maxDepth)) + bias;
}