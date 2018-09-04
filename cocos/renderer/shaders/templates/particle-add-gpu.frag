// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

uniform sampler2D mainTexture;
uniform vec4 tintColor;

varying vec2 uv;
varying vec4 color;

void main () {
  // TODO: soft particle
  gl_FragColor = 2.0 * color * tintColor * texture2D(mainTexture, uv);
}