// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

### VERT ###

#include <particle-vs-legacy>

void main () {
  lpvs_main();
}

### FRAG ###

uniform sampler2D mainTexture;

varying vec2 uv;
varying vec4 color;

void main () {
  // TODO: soft particle
  vec4 col = color * texture2D(mainTexture, uv);
  col.rgb *= col.a;
  gl_FragColor = col;
}
