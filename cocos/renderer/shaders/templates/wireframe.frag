// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// precision highp float;
uniform vec3 eye;
uniform vec3 color;

varying vec3 position_w;
varying vec3 normal_w;

void main () {
  gl_FragColor = vec4(color, 1.0);

  vec3 V = normalize(eye - position_w);
  if (dot (normal_w, V) <= 0.0) {
    gl_FragColor.rgb *= 0.6;
  }
}