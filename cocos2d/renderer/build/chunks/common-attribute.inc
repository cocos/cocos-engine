// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#ifndef USE_DIFFUSE_TEXTURE
  #ifndef USE_EMISSIVE_TEXTURE
    #ifndef USE_SPECULAR_TEXTURE
      #ifndef USE_NORMAL_TEXTURE
        #define _NOT_USE_TEXTURE 1
      #endif
    #endif
  #endif
#endif

#if USE_TILING_OFFSET && _USE_ATTRIBUTE_UV0
  #property
  uniform vec2 mainTiling;
  #property
  uniform vec2 mainOffset;
#endif

#ifdef _IS_VERT_SHADER
  attribute vec3 a_position;
#endif

// attribute uv0 
#ifndef _NOT_USE_TEXTURE

  #if _USE_ATTRIBUTE_UV0
    #ifdef _IS_VERT_SHADER
      attribute mediump vec2 a_uv0;
    #endif

    varying mediump vec2 v_uv0;
  #endif

#endif

// attribute color
#if _USE_ATTRIBUTE_COLOR

  #ifdef _IS_VERT_SHADER
    attribute lowp vec4 a_color;
  #endif

  varying lowp vec4 v_color;
#endif

// attribute normal
#if _USE_ATTRIBUTE_NORMAL
  #ifdef _IS_VERT_SHADER
    attribute vec3 a_normal;
  #endif
#endif

// helper defines
#ifdef _IS_VERT_SHADER

  void ATTRIBUTE_TO_VARYING () {

    #if _USE_ATTRIBUTE_COLOR
        v_color = a_color;
    #endif

    #ifndef _NOT_USE_TEXTURE
      #if _USE_ATTRIBUTE_UV0
        v_uv0 = a_uv0;

        #if USE_TILING_OFFSET
          v_uv0 = v_uv0 * mainTiling + mainOffset;
        #endif
      #endif
    #endif

  }

#endif


void MUL_ATTR_COLOR (inout vec4 color) {
  #if _USE_ATTRIBUTE_COLOR
    #ifdef _IS_VERT_SHADER
      color *= a_color;
    #else
      color *= v_color;
    #endif
  #endif
}

void MUL_ATTR_NORMAL (inout vec3 normal) {
  #if _USE_ATTRIBUTE_NORMAL
    #ifdef _IS_VERT_SHADER
      normal *= a_normal;
    #endif
  #endif
}
void MUL_ATTR_NORMAL (inout vec4 normal) {
  #if _USE_ATTRIBUTE_NORMAL
    #ifdef _IS_VERT_SHADER
      normal.xyz *= a_normal;
    #endif
  #endif
}
