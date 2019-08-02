// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if USE_EMISSIVE
  uniform EMISSIVE {
    lowp vec4 emissiveColor;
  };

  #if USE_EMISSIVE_TEXTURE
    uniform sampler2D emissiveTexture;
  #endif

#endif

void MULTIPLY_EMISSIVE_TEXTRUE_COLOR (inout vec3 color, in vec2 uv) {
  #if USE_EMISSIVE_TEXTURE && CC_USE_ATTRIBUTE_UV0
    vec4 emissiveTextureColor = texture2D(emissiveTexture, uv);
    #if CC_USE_ALPHA_ATLAS_EMISSIVETEXTURE
      emissiveTextureColor.a *= texture2D(emissiveTexture, uv + vec2(0, 0.5)).r;
    #endif
    emissiveTextureColor = TEXEL_TO_LINEAR(emissiveTextureColor);
    color *= emissiveTextureColor.rgb;
  #endif
}

void CALC_EMISSIVE (inout vec3 emissive, in vec2 uv) {
  #if USE_EMISSIVE
    emissive = emissiveColor.xyz;
    MULTIPLY_EMISSIVE_TEXTRUE_COLOR(emissive, uv);
  #endif
}

void CALC_EMISSIVE (inout vec3 emissive) {
  #if USE_EMISSIVE
    emissive = emissiveColor.xyz;
  #endif
}
