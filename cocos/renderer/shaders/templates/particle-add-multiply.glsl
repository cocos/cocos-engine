// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

### VERT ###

#include <particle-vs-legacy>

void main () {
  lpvs_main();
}

### FRAG ###

uniform sampler2D mainTexture;
uniform vec4 tintColor;

varying vec2 uv;
varying vec4 color;

void main () {
  // TODO: soft particle
  vec4 col;
  vec4 texColor = texture2D(mainTexture, uv);
  col.rgb = tintColor.rgb * texColor.rgb * color.rgb * vec3(2.0);
  col.a = (1.0 - texColor.a) * (tintColor.a * color.a * 2.0);
  gl_FragColor = col;
}
