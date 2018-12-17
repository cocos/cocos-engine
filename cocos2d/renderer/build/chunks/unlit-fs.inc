// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if USE_TEXTURE
  uniform sampler2D texture;
#endif

#if _USE_ATTRIBUTE_UV0
  varying vec2 v_uv0;
#endif

#if _USE_ATTRIBUTE_COLOR
  varying vec4 v_color;
#endif

uniform vec4 color;

vec4 frag () {
  vec4 o = color;
  
  #if _USE_ATTRIBUTE_COLOR
    o *= v_color;
  #endif

  #if USE_TEXTURE && _USE_ATTRIBUTE_UV0
    o *= texture2D(texture, v_uv0);
  #endif

  return o;
}