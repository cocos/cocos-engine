// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
#include <attr-base>

in vec3 a_position;

#if CC_USE_ATTRIBUTE_UV0
in vec2 a_uv0;
#endif

#if CC_USE_ATTRIBUTE_COLOR
in vec4 a_color;
#endif

#if CC_USE_ATTRIBUTE_NORMAL
in vec3 a_normal;
#endif

#if CC_USE_ATTRIBUTE_TANGENT
in vec4 a_tangent;
#endif

void CCAttribute (out StandardAttributes attr) {
  attr.position = vec4(a_position, 1.0);

  #if CC_USE_ATTRIBUTE_UV0
    attr.uv = a_uv0;
  #else
    attr.uv = vec2(0.0);
  #endif
  
  #if CC_USE_ATTRIBUTE_COLOR
    attr.color = a_color;
  #else
    attr.color = vec4(1.0);
  #endif
  
  #if CC_USE_ATTRIBUTE_NORMAL
    attr.normal = a_normal;
  #else
    attr.normal = vec3(0.0, 1.0, 0.0);
  #endif

  #if CC_USE_ATTRIBUTE_TANGENT
    attr.tangent = a_tangent;
  #else
    attr.tangent = vec4(1.0, 0.0, 0.0, 0.0);
  #endif
}
