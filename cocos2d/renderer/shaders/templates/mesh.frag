// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
#ifdef useTexture
  uniform sampler2D texture;
  varying vec2 uv0;
#endif

#ifdef useAttributeColor
  varying vec4 v_color;
#endif

uniform vec4 color;

void main () {
  vec4 o = color;
  
  #ifdef useAttributeColor
    o *= v_color;
  #endif

  #ifdef useTexture
    o *= texture2D(texture, uv0);
  #endif

  gl_FragColor = o;
}