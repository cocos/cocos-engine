// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

### VERT ###

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
  #include <skinning>
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

### FRAG ###

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
