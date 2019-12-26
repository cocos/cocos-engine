
#include <gamma>

#define CCTexture2D(texture, uv, color)                             \
  vec4 texture##_tmp = texture2D(texture, uv);                      \
  #if CC_USE_ALPHA_ATLAS_##texture                                  \
      texture##_tmp.a *= texture2D(texture, uv + vec2(0, 0.5)).r;   \
  #endif                                                            \
  #if INPUT_IS_GAMMA                                                \
    color.rgb *= SRGBToLinear(texture##_tmp.rgb);                   \
    color.a *= texture##_tmp.a;                                     \
  #else                                                             \
    color *= texture##_tmp;                                         \
  #endif                                                            \
  #pragma // empty pragma trick to get rid of trailing semicolons at effect compile time

#define CCTexture2DRGB(texture, uv, color)                             \
  vec4 texture##_tmp = texture2D(texture, uv);                      \
  #if CC_USE_ALPHA_ATLAS_##texture                                  \
      texture##_tmp.a *= texture2D(texture, uv + vec2(0, 0.5)).r;   \
  #endif                                                            \
  #if INPUT_IS_GAMMA                                                \
    color.rgb *= SRGBToLinear(texture##_tmp.rgb);                   \
  #else                                                             \
    color.rgb *= texture##_tmp.rgb;                                         \
  #endif                                                            \
  #pragma // empty pragma trick to get rid of trailing semicolons at effect compile time
