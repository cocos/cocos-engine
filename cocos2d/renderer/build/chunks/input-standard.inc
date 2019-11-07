// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
#include <attr-standard>

#if CC_USE_SKINNING
  #include <skinning>

  void CCSkin(inout StandardAttributes attr) {
    mat4 m = skinMatrix();
    attr.position = m * attr.position;
    attr.normal = (m * vec4(attr.normal, 0)).xyz;
    attr.tangent = m * attr.tangent;
  }
#endif

struct StandardVertInput {
  vec2 uv;
  vec4 position;
  vec3 normal;
  vec4 tangent;
  vec4 color;
};

void CCAttrToInput (in StandardAttributes attr, out StandardVertInput In) {
  In.position = attr.position;
  In.normal = attr.normal;
  In.tangent = attr.tangent;
  In.uv = attr.uv;
  In.color = attr.color;
}

void CCVertInput (out StandardVertInput In) {
  StandardAttributes attr;
  CCAttribute(attr);
  #if CC_USE_SKINNING
    CCSkin(attr);
  #endif
  CCAttrToInput(attr, In);
}
