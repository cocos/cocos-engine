// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-local>
#include <cc-global>

#include <common-attribute>
#include <skinning>

void main () {
  vec4 position = vec4(a_position, 1);

  SKIN_VERTEX(position);
  ATTRIBUTE_TO_VARYING();

  gl_Position = cc_matViewProj * cc_matWorld * position;
}
