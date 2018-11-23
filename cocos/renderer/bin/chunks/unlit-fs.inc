// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if USE_TEXTURE
  uniform sampler2D mainTexture;
  varying vec2 uv0;
#endif

#if USE_COLOR
  uniform vec4 color;
#endif

vec4 frag () {
  vec4 o = vec4(1, 1, 1, 1);

  #if USE_TEXTURE
    o *= texture2D(mainTexture, uv0);
  #endif

  #if USE_COLOR
    o *= color;
  #endif

  return o;
}
