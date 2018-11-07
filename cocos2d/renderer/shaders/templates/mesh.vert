// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
uniform mat4 viewProj;

attribute vec3 a_position;

#ifdef useAttributeColor
  attribute vec4 a_color;
  varying vec4 v_color;
#endif

#ifdef useTexture
  attribute vec2 a_uv0;
  varying vec2 uv0;
#endif

#ifdef useModel
  uniform mat4 model;
#endif


#ifdef useSkinning
  #include <skinning.vert>
#endif

void main () {
  mat4 mvp;
  #ifdef useModel
    mvp = viewProj * model;
  #else
    mvp = viewProj;
  #endif

  #ifdef useSkinning
    mvp = mvp * skinMatrix();
  #endif

  vec4 pos = mvp * vec4(a_position, 1);

  #ifdef useTexture
    uv0 = a_uv0;
  #endif

  #ifdef useAttributeColor
    v_color = a_color;
  #endif

  gl_Position = pos;
}