// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;

uniform mat4 model;
uniform mat4 viewProj;

#if USE_TEXTURE
  attribute vec2 a_uv0;
  uniform vec2 mainTiling;
  uniform vec2 mainOffset;
  varying vec2 uv0;
#endif

#if USE_SKINNING
  #include <skinning>
#endif

vec4 vert () {
  vec4 pos = vec4(a_position, 1);

  #if USE_SKINNING
    pos = skinMatrix() * pos;
  #endif

  pos = viewProj * model * pos;

  #if USE_TEXTURE
    uv0 = a_uv0 * mainTiling + mainOffset;
  #endif

  return pos;
}
