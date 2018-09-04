// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision mediump float;

uniform sampler2D matcapTex;
uniform float colorFactor;
uniform vec4 color;
varying vec2 matcapUV;

#if USE_MAIN_TEX
  varying vec2 uv0;
  uniform sampler2D mainTex;
#endif

void main(void){
  vec4 col = vec4(1, 1, 1, 1);
  col *= color;
  #if USE_MAIN_TEX
    col *= texture2D(mainTex, uv0);
  #endif
  vec4 matcapColor = texture2D(matcapTex, matcapUV);
  gl_FragColor = col * colorFactor + matcapColor * (1.0 - colorFactor);
}