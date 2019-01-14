
uniform vec4 diffuseColor;

#if USE_DIFFUSE_TEXTURE
  uniform sampler2D diffuseTexture;
#endif

void MULTIPLY_DIFFUSE_TEXTRUE_COLOR (inout vec4 color, in vec2 uv) {
  #if USE_DIFFUSE_TEXTURE && _USE_ATTRIBUTE_UV0
    vec4 diffuseTextureColor = texture2D(diffuseTexture, uv);
    color *= TEXEL_TO_LINEAR(diffuseTextureColor);
  #endif
}

void MULTIPLY_DIFFUSE_TEXTRUE_COLOR (inout vec4 color) {
  #if USE_DIFFUSE_TEXTURE && _USE_ATTRIBUTE_UV0
    
    #ifdef _IS_VERT_SHADER
      vec2 uv = a_uv0;
    #else
      vec2 uv = v_uv0;
    #endif

    MULTIPLY_DIFFUSE_TEXTRUE_COLOR(color, uv);
  #endif
}

void CALC_DIFFUSE (inout vec4 diffuse, in vec2 uv) {
  diffuse = diffuseColor;

  MUL_ATTR_COLOR(diffuse);
  MULTIPLY_DIFFUSE_TEXTRUE_COLOR(diffuse, uv);
}

void CALC_DIFFUSE (inout vec4 diffuse) {
  diffuse = diffuseColor;

  MUL_ATTR_COLOR(diffuse);
  MULTIPLY_DIFFUSE_TEXTRUE_COLOR(diffuse);
}
