// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

uniform mat4 _viewProj;
uniform mat4 _model;

attribute vec3 a_position;

#if _USE_ATTRIBUTE_COLOR
  attribute lowp vec4 a_color;
  varying lowp vec4 v_color;
#endif

#if _USE_ATTRIBUTE_UV0
  attribute vec2 a_uv0;
  varying vec2 v_uv0;
#endif

#if _USE_SKINNING
  #include <skinning>
#endif

vec4 vert () {
  mat4 mvp = _viewProj * _model;

  #if _USE_SKINNING
    mvp = mvp * skinMatrix();
  #endif

  vec4 pos = mvp * vec4(a_position, 1);

  #if _USE_ATTRIBUTE_UV0
    v_uv0 = a_uv0;
  #endif

  #if _USE_ATTRIBUTE_COLOR
    v_color = a_color;
  #endif

  return pos;
}