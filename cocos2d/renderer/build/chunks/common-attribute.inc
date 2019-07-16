// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#define _USE_TEXTURE USE_DIFFUSE_TEXTURE || USE_EMISSIVE_TEXTURE || USE_SPECULAR_TEXTURE || USE_NORMAL_TEXTURE


#if USE_TILING_OFFSET && CC_USE_ATTRIBUTE_UV0
  uniform MAIN_TILING {
    vec2 mainTiling;
    vec2 mainOffset;
  }
#endif

#if CC_IS_VERT_SHADER
  attribute vec3 a_position;
#endif

// attribute uv0 
#if _USE_TEXTURE

  #if CC_USE_ATTRIBUTE_UV0
    #if CC_IS_VERT_SHADER
      attribute mediump vec2 a_uv0;
    #endif

    varying mediump vec2 v_uv0;
  #endif

#endif

// attribute color
#if CC_USE_ATTRIBUTE_COLOR

  #if CC_IS_VERT_SHADER
    attribute lowp vec4 a_color;
  #endif

  varying lowp vec4 v_color;
#endif

// attribute normal
#if CC_USE_ATTRIBUTE_NORMAL
  #if CC_IS_VERT_SHADER
    attribute vec3 a_normal;
  #endif
#endif

// helper defines
#if CC_IS_VERT_SHADER

  void ATTRIBUTE_TO_VARYING () {

    #if CC_USE_ATTRIBUTE_COLOR
        v_color = a_color;
    #endif

    #if _USE_TEXTURE
      #if CC_USE_ATTRIBUTE_UV0
        v_uv0 = a_uv0;

        #if USE_TILING_OFFSET
          v_uv0 = v_uv0 * mainTiling + mainOffset;
        #endif
      #endif
    #endif

  }

#endif


void MUL_ATTR_COLOR (inout vec4 color) {
  #if CC_USE_ATTRIBUTE_COLOR
    #if CC_IS_VERT_SHADER
      color *= a_color;
    #else
      color *= v_color;
    #endif
  #endif
}

void MUL_ATTR_NORMAL (inout vec3 normal) {
  #if CC_USE_ATTRIBUTE_NORMAL
    #if CC_IS_VERT_SHADER
      normal *= a_normal;
    #endif
  #endif
}
void MUL_ATTR_NORMAL (inout vec4 normal) {
  #if CC_USE_ATTRIBUTE_NORMAL
    #if CC_IS_VERT_SHADER
      normal.xyz *= a_normal;
    #endif
  #endif
}
