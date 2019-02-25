// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if USE_SPECULAR
  #property #color3
  uniform lowp vec3 specularColor;

  #if USE_SPECULAR_TEXTURE
    #property
    uniform sampler2D specularTexture;
  #endif

#endif

void MULTIPLY_SPECULAR_TEXTRUE_COLOR (inout vec3 color, in vec2 uv) {
  #if USE_SPECULAR_TEXTURE && _USE_ATTRIBUTE_UV0
    vec4 specularTextureColor = texture2D(specularTexture, uv);
    specularTextureColor = TEXEL_TO_LINEAR(specularTextureColor);
    color *= specularTextureColor.rgb;
  #endif
}

void MULTIPLY_SPECULAR_TEXTRUE_COLOR (inout vec3 color) {
  #if USE_SPECULAR_TEXTURE && _USE_ATTRIBUTE_UV0
    
    #ifdef _IS_VERT_SHADER
      vec2 uv = a_uv0;
    #else
      vec2 uv = v_uv0;
    #endif

    MULTIPLY_SPECULAR_TEXTRUE_COLOR(color, uv);
  #endif
}

void CALC_SPECULAR (inout vec3 specular, in vec2 uv) {
  #if USE_SPECULAR
    specular = specularColor;
    MULTIPLY_SPECULAR_TEXTRUE_COLOR(specular, uv);
  #endif
}

void CALC_SPECULAR (inout vec3 specular) {
  #if USE_SPECULAR
    specular = specularColor;
    MULTIPLY_SPECULAR_TEXTRUE_COLOR(specular);
  #endif
}
