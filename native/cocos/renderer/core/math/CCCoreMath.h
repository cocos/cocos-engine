#ifndef CC_CORE_MATH_CC_MATH_H_
#define CC_CORE_MATH_CC_MATH_H_

#define CC_MATH_NAMESPACE_BEGIN  namespace cc { namespace gfx { namespace math {
#define CC_MATH_NAMESPACE_END    }}}

CC_MATH_NAMESPACE_BEGIN

extern CC_CORE_API const float PI;
extern CC_CORE_API const float PI_2;
extern CC_CORE_API const float PI_DIV2;
extern CC_CORE_API const float PI_DIV3;
extern CC_CORE_API const float PI_DIV4;
extern CC_CORE_API const float PI_DIV5;
extern CC_CORE_API const float PI_DIV6;
extern CC_CORE_API const float PI_DIV8;
extern CC_CORE_API const float PI_SQR;
extern CC_CORE_API const float PI_INV;
extern CC_CORE_API const float EPSILON;
extern CC_CORE_API const float LOW_EPSILON;
extern CC_CORE_API const float POS_INFINITY;
extern CC_CORE_API const float NEG_INFINITY;
extern CC_CORE_API const float LN2;
extern CC_CORE_API const float LN10;
extern CC_CORE_API const float LN2_INV;
extern CC_CORE_API const float LN10_INV;
extern CC_CORE_API const float DEG_TO_RAD;
extern CC_CORE_API const float RAD_TO_DEG;
extern CC_CORE_API const float MIN_FLOAT;
extern CC_CORE_API const float MAX_FLOAT;

uint16_t CRC16(const char* str);
uint32_t CRC32(const char* str);
uint32_t CRC32NoCase(const char* str);

template <typename T>
inline T Abs(T x) {
  return x > 0 ? x : -x;
}

template <typename T>
inline T Sgn(T x) {
  return (x < T(0) ? T(-1) : (x > T(0) ? T(1) : T(0)));
}

template <typename T>
inline T Sqr(T x) {
  return x * x;
}

template <typename T>
inline bool IsPowerOfTwo(T n) {
  return (n & (n-1)) == 0;
}

CC_INLINE bool IsEqualF(float lhs, float rhs, float precision = 0.000001f) {
  return (Abs<float>(lhs - rhs) < precision);
}

CC_INLINE bool IsNotEqualF(float lhs, float rhs, float precision = 0.000001f) {
  return (Abs<float>(lhs - rhs) > precision);
}

CC_MATH_NAMESPACE_END

#endif
