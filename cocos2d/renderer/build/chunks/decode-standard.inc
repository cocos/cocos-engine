// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
#include <decode-base>

in vec3 a_position;
in vec2 a_uv0;

#if CC_USE_ATTRIBUTE_NORMAL
in vec3 a_normal;
#endif

#if CC_USE_ATTRIBUTE_TANGENT
in vec4 a_tangent;
#endif

void CCDecode (out StandardAttributes attr) {
  attr.uv = a_uv0;
  attr.position = vec4(a_position, 1.0);
  
  #if CC_USE_ATTRIBUTE_NORMAL
    attr.normal = a_normal;
  #endif

  #if CC_USE_ATTRIBUTE_TANGENT
    attr.tangent = a_tangent;
  #endif
}
