// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
#include <decode-standard>
#if CC_USE_SKINNING
  #include <skinning>
#endif

struct StandardVertInput {
  vec2 uv;
  vec4 position;
  vec3 normal;
  vec4 tangent;
};

void CCAttrToInput (in StandardAttributes attr, out StandardVertInput In) {
  In.position = attr.position;
  In.normal = attr.normal;
  In.tangent = attr.tangent;
  In.uv = attr.uv;
}

void CCVertInput (out StandardVertInput In) {
  StandardAttributes attr;
  CCDecode(attr);
  #if CC_USE_SKINNING
    CCSkin(attr);
  #endif
  CCAttrToInput(attr, In);
}
