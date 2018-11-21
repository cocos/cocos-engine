// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

### VERT ###

attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 model, viewProj;
uniform mat3 normalMatrix;

varying vec3 position_w;
varying vec3 normal_w;

void main () {
  vec4 pos = vec4(a_position, 1);

  position_w = (model * pos).xyz;
  pos = viewProj * model * pos;
  normal_w = normalMatrix * a_normal.xyz;

  gl_Position = pos;
}

### FRAG ###

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
