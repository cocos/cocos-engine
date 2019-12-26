// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#include <skinning>

struct StandardVertInput {
  vec2 uv;
  vec4 position;
  vec3 normal;
  vec4 tangent;
  vec4 color;
};

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

void CCAttribute (out StandardVertInput In) {
  In.position = vec4(a_position, 1.0);

  #if CC_USE_ATTRIBUTE_UV0
    In.uv = a_uv0;
  #else
    In.uv = vec2(0.0);
  #endif
  
  #if CC_USE_ATTRIBUTE_COLOR
    In.color = a_color;
  #else
    In.color = vec4(1.0);
  #endif
  
  #if CC_USE_ATTRIBUTE_NORMAL
    In.normal = a_normal;
  #else
    In.normal = vec3(0.0, 1.0, 0.0);
  #endif

  #if CC_USE_ATTRIBUTE_TANGENT
    In.tangent = a_tangent;
  #else
    In.tangent = vec4(1.0, 0.0, 0.0, 0.0);
  #endif
}


void CCVertInput(out StandardVertInput In) {
  CCAttribute(In);

  #if CC_USE_SKINNING
    mat4 m = skinMatrix();

    In.position = m * In.position;

    #if CC_USE_ATTRIBUTE_NORMAL
      In.normal = (m * vec4(In.normal, 0)).xyz;
    #endif

    #if CC_USE_ATTRIBUTE_TANGENT
      In.tangent = m * In.tangent;
    #endif
  #endif
}
