// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-local>
#include <cc-global>

varying vec3 v_worldNormal;
varying vec3 v_worldPos;

#include <common-attribute>
#include <skinning>
#include <shadowmap-declare-vert>

void main () {
  vec4 position = vec4(a_position, 1);
  vec4 normal = vec4(1, 1, 1, 0);

  MUL_ATTR_NORMAL(normal);
  SKIN_VERTEX(position, normal);

  v_worldPos = (cc_matWorld * position).xyz;
  v_worldNormal = cc_matWorldIT * normal.xyz;

  CLAC_SHADOW();
  ATTRIBUTE_TO_VARYING();
  
  gl_Position = cc_matViewProj * cc_matWorld * position;
}
