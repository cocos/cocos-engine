// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

uniform DIFFUSE {
  lowp vec4 diffuseColor;
};

#if USE_DIFFUSE_TEXTURE
  uniform sampler2D diffuseTexture;
#endif

void MULTIPLY_DIFFUSE_TEXTRUE_COLOR (inout vec4 color, in vec2 uv) {
  #if USE_DIFFUSE_TEXTURE && CC_USE_ATTRIBUTE_UV0
    vec4 diffuseTextureColor = texture2D(diffuseTexture, uv);
    #if CC_USE_ALPHA_ATLAS_DIFFUSETEXTURE
      diffuseTextureColor.a *= texture2D(diffuseTexture, uv + vec2(0, 0.5)).r;
    #endif
    color *= TEXEL_TO_LINEAR(diffuseTextureColor);
  #endif
}

void CALC_DIFFUSE (inout vec4 color, in vec2 uv) {
  color *= diffuseColor;
  MULTIPLY_DIFFUSE_TEXTRUE_COLOR(color, uv);
}

void CALC_DIFFUSE (inout vec4 color) {
  color *= diffuseColor;
}
