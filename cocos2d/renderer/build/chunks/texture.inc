
#include <gamma>

#define CCTexture(_texture_, _uv_, _color_)                             \
  vec4 _texture_##_tmp = texture(_texture_, _uv_);                      \
  #if CC_USE_ALPHA_ATLAS_##_texture_                                  \
      _texture_##_tmp.a *= texture(_texture_, _uv_ + vec2(0, 0.5)).r;   \
  #endif                                                            \
  #if INPUT_IS_GAMMA                                                \
    _color_.rgb *= SRGBToLinear(_texture_##_tmp.rgb);                   \
    _color_.a *= _texture_##_tmp.a;                                     \
  #else                                                             \
    _color_ *= _texture_##_tmp;                                         \
  #endif                                                            \
  #pragma // empty pragma trick to get rid of trailing semicolons at effect compile time

#define CCTextureRGB(_texture_, _uv_, _color_)                             \
  vec4 _texture_##_tmp = texture(_texture_, _uv_);                      \
  #if CC_USE_ALPHA_ATLAS_##_texture_                                  \
      _texture_##_tmp.a *= texture(_texture_, _uv_ + vec2(0, 0.5)).r;   \
  #endif                                                            \
  #if INPUT_IS_GAMMA                                                \
    _color_.rgb *= SRGBToLinear(_texture_##_tmp.rgb);                   \
  #else                                                             \
    _color_.rgb *= _texture_##_tmp.rgb;                                         \
  #endif                                                            \
  #pragma // empty pragma trick to get rid of trailing semicolons at effect compile time

#define CCTextureWithIndex(_texture_, _uv_, _color_, __index__)                             \
  vec4 _texture_##_tmp##__index__ = texture(_texture_, _uv_);                      \
  #if CC_USE_ALPHA_ATLAS_##_texture_                                  \
      _texture_##_tmp##__index__.a *= texture(_texture_, _uv_ + vec2(0, 0.5)).r;   \
  #endif                                                            \
  #if INPUT_IS_GAMMA                                                \
    _color_.rgb *= SRGBToLinear(_texture_##_tmp##__index__.rgb);                   \
    _color_.a *= _texture_##_tmp##__index__.a;                                     \
  #else                                                             \
    _color_ *= _texture_##_tmp##__index__;                                         \
  #endif                                                            \
  #pragma // empty pragma trick to get rid of trailing semicolons at effect compile time
