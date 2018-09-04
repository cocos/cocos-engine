// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// precision highp float;

#if USE_TEXTURE
  uniform sampler2D texture;
  varying vec2 uv0;
#endif

#if USE_COLOR
  uniform vec4 color;
#endif

void main () {
  vec4 o = vec4(1, 1, 1, 1);

  #if USE_TEXTURE
    o *= texture2D(texture, uv0);
  #endif

  #if USE_COLOR
    o *= color;
  #endif

  if (!gl_FrontFacing) {
    o.rgb *= 0.5;
  }

  gl_FragColor = o;
}