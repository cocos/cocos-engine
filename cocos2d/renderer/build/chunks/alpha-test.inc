// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if USE_ALPHA_TEST
  
  uniform ALPHA_TEST {
    float alphaThreshold;
  }
#endif

void ALPHA_TEST (in vec4 color) {
  #if USE_ALPHA_TEST
      if (color.a < alphaThreshold) discard;
  #endif
}

void ALPHA_TEST (in float alpha) {
  #if USE_ALPHA_TEST
      if (alpha < alphaThreshold) discard;
  #endif
}
