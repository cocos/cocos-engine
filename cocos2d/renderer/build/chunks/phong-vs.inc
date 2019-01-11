// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 _model;
uniform mat4 _viewProj;
uniform mat3 _normalMatrix;

varying vec3 normal_w;
varying vec3 pos_w;

#if USE_DIFFUSE_TEXTURE || USE_NORMAL_TEXTURE || USE_EMISSIVE_TEXTURE
  attribute vec2 a_uv0;
  uniform vec2 mainTiling;
  uniform vec2 mainOffset;
  varying vec2 uv0;
#endif

#if _USE_SKINNING
  #include <skinning>
#endif

#if _USE_SHADOW_MAP
  #include <shadow-prepare>
#endif

vec4 vert () {
  vec4 pos = vec4(a_position, 1);
  vec4 normal = vec4(a_normal, 0);

  #if _USE_SKINNING
    skinVertex(pos, normal);
  #endif

  pos_w = (_model * pos).xyz;
  pos = _viewProj * _model * pos;

  normal_w = _normalMatrix * normal.xyz;

  #if _USE_SHADOW_MAP
    prepareShadowData(pos_w);
  #endif

  #if USE_DIFFUSE_TEXTURE || USE_NORMAL_TEXTURE || USE_EMISSIVE_TEXTURE
    uv0 = a_uv0 * mainTiling + mainOffset;
  #endif
  
  return pos;
}
