// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

### VERT ###

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

void main () {
  vec4 pos = vec4(a_position, 1);

  #if USE_SKINNING
    pos = skinMatrix() * pos;
  #endif

  pos = viewProj * model * pos;

  #if USE_TEXTURE
    uv0 = a_uv0 * mainTiling + mainOffset;
  #endif

  gl_Position = pos;
}

### FRAG ###

#if USE_TEXTURE
  uniform sampler2D mainTexture;
  varying vec2 uv0;
#endif

#if USE_COLOR
  uniform vec4 color;
#endif

void main () {
  vec4 o = vec4(1, 1, 1, 1);

  #if USE_TEXTURE
    o *= texture2D(mainTexture, uv0);
  #endif

  #if USE_COLOR
    o *= color;
  #endif

  gl_FragColor = o;
}
