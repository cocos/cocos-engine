// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if USE_SPECULAR
  uniform SPECULAR {
    lowp vec4 specularColor;
  };

  #if USE_SPECULAR_TEXTURE
    uniform sampler2D specularTexture;
  #endif

#endif

void MULTIPLY_SPECULAR_TEXTRUE_COLOR (inout vec3 color, in vec2 uv) {
  #if USE_SPECULAR_TEXTURE && CC_USE_ATTRIBUTE_UV0
    vec4 specularTextureColor = texture2D(specularTexture, uv);
    specularTextureColor = TEXEL_TO_LINEAR(specularTextureColor);
    color *= specularTextureColor.rgb;
  #endif
}

void CALC_SPECULAR (inout vec3 specular, in vec2 uv) {
  #if USE_SPECULAR
    specular = specularColor.xyz;
    MULTIPLY_SPECULAR_TEXTRUE_COLOR(specular, uv);
  #endif
}

void CALC_SPECULAR (inout vec3 specular) {
  #if USE_SPECULAR
    specular = specularColor.xyz;
  #endif
}
