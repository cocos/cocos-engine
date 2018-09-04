// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;
attribute vec3 a_normal;
uniform   mat4 model;
uniform   mat4 viewProj;
uniform   mat3 normalMatrix;
varying   vec2 matcapUV;

#if USE_MAIN_TEX
  attribute vec2 a_uv0;
  varying   vec2 uv0;
#endif

#if USE_SKINNING
  #include <skinning.vert>
#endif

void main(void){
  #if USE_MAIN_TEX
    uv0 = a_uv0;
  #endif

  vec4 pos = vec4(a_position, 1);
  #if USE_SKINNING
    mat4 skinMat = skinMatrix();
    pos = skinMat * pos;
  #endif
  pos = viewProj * model * pos;
  gl_Position = pos;

  vec4 normal = vec4(a_normal, 0);
  #if USE_SKINNING
    normal = skinMat * normal;
  #endif
  normal = vec4(normalize(normalMatrix * normal.xyz), 0);
  matcapUV = normal.xy;
  matcapUV = matcapUV * 0.5 + 0.5;
}