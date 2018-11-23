// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

uniform sampler2D mainTexture;
varying vec2 uv0;
varying vec4 color;

vec4 frag () {
  vec4 o = vec4(1, 1, 1, 1);

  o *= texture2D(mainTexture, uv0);
  o *= color;

  return o;
}
