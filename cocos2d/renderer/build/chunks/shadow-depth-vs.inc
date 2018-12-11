// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;

uniform mat4 _model;
uniform mat4 _lightViewProjMatrix;
uniform float _minDepth;
uniform float _maxDepth;
uniform float _bias;
varying float vDepth;

#if _USE_SKINNING
  #include <skinning>
#endif

vec4 vert() {
  vec4 pos = vec4(a_position, 1);

  #if _USE_SKINNING
    mat4 skinMat = skinMatrix();
    pos = skinMat * pos;
  #endif

  // compute vDepth according to active camera's minDepth and maxDepth.
  vDepth = ((gl_Position.z + _minDepth) / (_minDepth + _maxDepth)) + _bias;
  return _lightViewProjMatrix * _model * pos;
}
