/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#ifndef __CCMATHBASE_H__
#define __CCMATHBASE_H__

#include <memory>
#include "base/Macros.h"

#if CC_PLATFORM != CC_PLATFORM_EMSCRIPTEN
    #include "base/std/hash/hash.h"
#endif
/**
 * @addtogroup base
 * @{
 */

/**Util macro for conversion from degrees to radians.*/
#define MATH_DEG_TO_RAD(x) ((x)*0.0174532925f)
/**Util macro for conversion from radians to degrees.*/
#define MATH_RAD_TO_DEG(x) ((x)*57.29577951f)
/**
@{ Util macro for const float such as epsilon, small float and float precision tolerance.
*/
#define MATH_FLOAT_SMALL 1.0e-37f
#define MATH_TOLERANCE   2e-37f
#define MATH_PIOVER2     1.57079632679489661923f
#define MATH_EPSILON     0.000001f
/**@}*/

//#define MATH_PIOVER4                0.785398163397448309616f
//#define MATH_PIX2                   6.28318530717958647693f
//#define MATH_E                      2.71828182845904523536f
//#define MATH_LOG10E                 0.4342944819032518f
//#define MATH_LOG2E                  1.442695040888963387f
//#define MATH_PI                     3.14159265358979323846f
//#define MATH_RANDOM_MINUS1_1()      ((2.0f*((float)rand()/RAND_MAX))-1.0f)      // Returns a random float between -1 and 1.
//#define MATH_RANDOM_0_1()           ((float)rand()/RAND_MAX)                    // Returns a random float between 0 and 1.
//#define MATH_CLAMP(x, lo, hi)       ((x < lo) ? lo : ((x > hi) ? hi : x))
//#ifndef M_1_PI
//#define M_1_PI                      0.31830988618379067154

#ifdef __cplusplus
    #define NS_CC_MATH_BEGIN namespace cc {
    #define NS_CC_MATH_END   }
    #define USING_NS_CC_MATH using namespace cc
#else
    #define NS_CC_MATH_BEGIN
    #define NS_CC_MATH_END
    #define USING_NS_CC_MATH
#endif

NS_CC_MATH_BEGIN

#if CC_PLATFORM != CC_PLATFORM_EMSCRIPTEN

template <typename T, typename Enable = std::enable_if_t<std::is_class<T>::value>>
struct Hasher final {
    // NOTE: ccstd::hash_t is a typedef of uint32_t now, sizeof(ccstd::hash_t) == sizeof(size_t) on 32 bits architecture device,
    // sizeof(ccstd::hash_t) < sizeof(size_t) on 64 bits architecture device.
    // STL containers like ccstd::unordered_map<K, V, Hasher> expects the custom Hasher function to return size_t.
    // So it's safe to return ccstd::hash_t for operator() function now.
    // If we need to define ccstd::hash_t to uint64_t someday, we must take care of the return value of operator(),
    // it should be size_t and we need to convert hash value from uint64_t to uint32_t for 32 bit architecture device.
    ccstd::hash_t operator()(const T &info) const;
};

// make this ccstd::hash compatible
template <typename T, typename Enable = std::enable_if_t<std::is_class<T>::value>>
ccstd::hash_t hash_value(const T &info) { return Hasher<T>()(info); } // NOLINT(readability-identifier-naming)

#endif // CC_PLATFORM != CC_PLATFORM_EMSCRIPTEN

NS_CC_MATH_END

/**
 * end of base group
 * @}
 */

#endif // __CCMATHBASE_H__
