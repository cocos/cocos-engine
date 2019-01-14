
#if USE_EMISSIVE

  uniform vec3 emissiveColor;

  #if USE_EMISSIVE_TEXTURE
    uniform sampler2D emissiveTexture;
  #endif

#endif

void MULTIPLY_EMISSIVE_TEXTRUE_COLOR (inout vec3 color, in vec2 uv) {
  #if USE_EMISSIVE_TEXTURE && _USE_ATTRIBUTE_UV0
    vec4 emissiveTextureColor = texture2D(emissiveTexture, uv);
    emissiveTextureColor = TEXEL_TO_LINEAR(emissiveTextureColor);
    color *= emissiveTextureColor.rgb;
  #endif
}

void MULTIPLY_EMISSIVE_TEXTRUE_COLOR (inout vec3 color) {
  #if USE_EMISSIVE_TEXTURE && _USE_ATTRIBUTE_UV0
    
    #ifdef _IS_VERT_SHADER
      vec2 uv = a_uv0;
    #else
      vec2 uv = v_uv0;
    #endif

    MULTIPLY_EMISSIVE_TEXTRUE_COLOR(color, uv);
  #endif
}

void CALC_EMISSIVE (inout vec3 emissive, in vec2 uv) {
  #if USE_EMISSIVE
    emissive = emissiveColor;
    MULTIPLY_EMISSIVE_TEXTRUE_COLOR(emissive, uv);
  #endif
}

void CALC_EMISSIVE (inout vec3 emissive) {
  #if USE_EMISSIVE
    emissive = emissiveColor;
    MULTIPLY_EMISSIVE_TEXTRUE_COLOR(emissive);
  #endif
}
