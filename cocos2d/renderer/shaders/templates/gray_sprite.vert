// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
uniform mat4 viewProj;
attribute vec3 a_position;
attribute mediump vec2 a_uv0;
varying mediump vec2 uv0;

void main () {
  vec4 pos = viewProj * vec4(a_position, 1);
  gl_Position = pos;
  uv0 = a_uv0;
}