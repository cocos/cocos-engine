/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <assert.h> // NOLINT
#include <sstream>
#include <utility>

#if CC_DEBUG && !NDEBUG

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        #define CC_ASSERT_FORMAT(cond, fmt, ...)                                                                                 \
            do {                                                                                                                 \
                if (!(cond)) {                                                                                                   \
                    char message[256] = {0};                                                                                     \
                    wchar_t messageTmp[256] = {0};                                                                               \
                    snprintf(message, sizeof(message), "CC_ASSERT(%s) failed. " fmt "\n%s", #cond, ##__VA_ARGS__, __FUNCTION__); \
                    std::copy(message, message + strlen(message), messageTmp);                                                   \
                    _wassert(messageTmp, _CRT_WIDE(__FILE__), (unsigned)__LINE__);                                               \
                }                                                                                                                \
            } while (false)

        #define CC_ABORTF(fmt, ...)                                            \
            do {                                                               \
                char message[256] = {0};                                       \
                wchar_t messageTmp[256] = {0};                                 \
                snprintf(message, sizeof(message), fmt, ##__VA_ARGS__);        \
                std::copy(message, message + strlen(message), messageTmp);     \
                _wassert(messageTmp, _CRT_WIDE(__FILE__), (unsigned)__LINE__); \
            } while (false)

    #elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
        #define CC_ASSERT_FORMAT(cond, fmt, ...)                                                            \
            do {                                                                                            \
                if (__builtin_expect(!(cond), 0)) {                                                         \
                    char message[256] = {0};                                                                \
                    snprintf(message, sizeof(message), "CC_ASSERT(%s) failed. " fmt, #cond, ##__VA_ARGS__); \
                    __assert2(__FILE__, __LINE__, __PRETTY_FUNCTION__, message);                            \
                }                                                                                           \
            } while (false)
        #define CC_ABORTF(fmt, ...)                                          \
            do {                                                             \
                char message[256] = {0};                                     \
                snprintf(message, sizeof(message), fmt, ##__VA_ARGS__);      \
                __assert2(__FILE__, __LINE__, __PRETTY_FUNCTION__, message); \
            } while (false)
    #elif CC_PLATFORM == CC_PLATFORM_IOS || CC_PLATFORM == CC_PLATFORM_MACOS
        #define CC_ASSERT_FORMAT(cond, fmt, ...)                                                            \
            do {                                                                                            \
                if (__builtin_expect(!(cond), 0)) {                                                         \
                    char message[256] = {0};                                                                \
                    snprintf(message, sizeof(message), "CC_ASSERT(%s) failed. " fmt, #cond, ##__VA_ARGS__); \
                    __assert(message, __FILE__, __LINE__);                                                  \
                }                                                                                           \
            } while (false)
        #define CC_ABORTF(fmt, ...)                                     \
            do {                                                        \
                char message[256] = {0};                                \
                snprintf(message, sizeof(message), fmt, ##__VA_ARGS__); \
                __assert(message, __FILE__, __LINE__);                  \
            } while (false)
    #else
        #define CC_ASSERT_FORMAT(cond, ...) assert(cond)
        #define CC_ABORTF(fmt, ...)         abort()
    #endif

    // NOLINTNEXTLINE
    #define _CC_ASSERT_(cond) assert(cond)

    // NOLINTNEXTLINE
    #define _CC_ASSERTF_CMP(expr1, op, expr2, fmt, ...)             \
        do {                                                        \
            CC_ASSERT_FORMAT((expr1)op(expr2), fmt, ##__VA_ARGS__); \
        } while (false)

    // NOLINTNEXTLINE
    #define _CC_ASSERT_CMP(expr1, op, expr2) \
        do {                                 \
            _CC_ASSERT_((expr1)op(expr2));   \
        } while (false)

    // CC_ASSERTF variants
    #define CC_ASSERTF_EQ(expr1, expr2, fmt, ...) _CC_ASSERTF_CMP(expr1, ==, expr2, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_NE(expr1, expr2, fmt, ...) _CC_ASSERTF_CMP(expr1, !=, expr2, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_LE(expr1, expr2, fmt, ...) _CC_ASSERTF_CMP(expr1, <=, expr2, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_GE(expr1, expr2, fmt, ...) _CC_ASSERTF_CMP(expr1, >=, expr2, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_LT(expr1, expr2, fmt, ...) _CC_ASSERTF_CMP(expr1, <, expr2, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_GT(expr1, expr2, fmt, ...) _CC_ASSERTF_CMP(expr1, >, expr2, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_TRUE(expr1, fmt, ...)      _CC_ASSERTF_CMP(expr1, ==, true, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_FALSE(expr1, fmt, ...)     _CC_ASSERTF_CMP(expr1, ==, false, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_NULL(expr1, fmt, ...)      _CC_ASSERTF_CMP(expr1, ==, nullptr, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_NOT_NULL(expr1, fmt, ...)  _CC_ASSERTF_CMP(expr1, !=, nullptr, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_ZERO(expr1, fmt, ...)      _CC_ASSERTF_CMP(expr1, ==, 0, fmt, ##__VA_ARGS__)
    #define CC_ASSERTF_NONZERO(expr1, fmt, ...)   _CC_ASSERTF_CMP(expr1, !=, 0, fmt, ##__VA_ARGS__)
    // CC_ASSERT variants
    #define CC_ASSERT_EQ(expr1, expr2) _CC_ASSERT_CMP(expr1, ==, expr2)
    #define CC_ASSERT_NE(expr1, expr2) _CC_ASSERT_CMP(expr1, !=, expr2)
    #define CC_ASSERT_LE(expr1, expr2) _CC_ASSERT_CMP(expr1, <=, expr2)
    #define CC_ASSERT_GE(expr1, expr2) _CC_ASSERT_CMP(expr1, >=, expr2)
    #define CC_ASSERT_LT(expr1, expr2) _CC_ASSERT_CMP(expr1, <, expr2)
    #define CC_ASSERT_GT(expr1, expr2) _CC_ASSERT_CMP(expr1, >, expr2)
    #define CC_ASSERT_TRUE(expr1)      _CC_ASSERT_CMP(expr1, ==, true)
    #define CC_ASSERT_FALSE(expr1)     _CC_ASSERT_CMP(expr1, ==, false)
    #define CC_ASSERT_NULL(expr1)      _CC_ASSERT_CMP(expr1, ==, nullptr)
    #define CC_ASSERT_NOT_NULL(expr1)  _CC_ASSERT_CMP(expr1, !=, nullptr)
    #define CC_ASSERT_ZERO(expr1)      _CC_ASSERT_CMP(expr1, ==, 0)
    #define CC_ASSERT_NONZERO(expr1)   _CC_ASSERT_CMP(expr1, !=, 0)
    /**
     * @brief printf like assert
     *
     *  CC_ASSERTF(1==2, "value %d should not be equal to %d", 1, 2);
     *  CC_ASSERTF_EQ(1, 3/3, "n equals to n");
     *  CC_ASSERTF_NE(1, s, "not initial value");
     *
     */
    #define CC_ASSERTF(cond, fmt, ...) CC_ASSERT_FORMAT(cond, fmt, ##__VA_ARGS__)

    /**
     *  CC_ABORT call abort() in debug mode.
     *
     *  printf like abort: CC_ABORTF
     *      
     *  CC_ABORTF("Dead Code") 
     *  CC_ABORTF("Invalidate state code %d", statusCode);
     *  CC_ABORTF("Should crash in debug mode")
     */
    #define CC_ABORT()      abort()
    #define CC_ASSERT(cond) _CC_ASSERT_(cond)

#else
    #define CC_ASSERTF(...)                  ((void)0)
    #define CC_ASSERTF_EQ(expr1, expr2, ...) ((void)0)
    #define CC_ASSERTF_NE(expr1, expr2, ...) ((void)0)
    #define CC_ASSERTF_LE(expr1, expr2, ...) ((void)0)
    #define CC_ASSERTF_GE(expr1, expr2, ...) ((void)0)
    #define CC_ASSERTF_LT(expr1, expr2, ...) ((void)0)
    #define CC_ASSERTF_GT(expr1, expr2, ...) ((void)0)
    #define CC_ASSERTF_TRUE(expr1, ...)      ((void)0)
    #define CC_ASSERTF_FALSE(expr1, ...)     ((void)0)
    #define CC_ASSERTF_NULL(expr1, ...)      ((void)0)
    #define CC_ASSERTF_NOT_NULL(expr1, ...)  ((void)0)
    #define CC_ASSERTF_ZERO(expr1, ...)      ((void)0)
    #define CC_ASSERTF_NONZERO(expr1, ...)   ((void)0)
    #define CC_ASSERT(...)                   ((void)0)
    #define CC_ASSERT_EQ(expr1, expr2, ...)  ((void)0)
    #define CC_ASSERT_NE(expr1, expr2, ...)  ((void)0)
    #define CC_ASSERT_LE(expr1, expr2, ...)  ((void)0)
    #define CC_ASSERT_GE(expr1, expr2, ...)  ((void)0)
    #define CC_ASSERT_LT(expr1, expr2, ...)  ((void)0)
    #define CC_ASSERT_GT(expr1, expr2, ...)  ((void)0)
    #define CC_ASSERT_TRUE(expr1, ...)       ((void)0)
    #define CC_ASSERT_FALSE(expr1, ...)      ((void)0)
    #define CC_ASSERT_NULL(expr1, ...)       ((void)0)
    #define CC_ASSERT_NOT_NULL(expr1, ...)   ((void)0)
    #define CC_ASSERT_ZERO(expr1, ...)       ((void)0)
    #define CC_ASSERT_NONZERO(expr1, ...)    ((void)0)
    #define CC_ABORTF(...)                   ((void)0) // ignored in release builds
    #define CC_ABORT()                       ((void)0) // ignored in release builds
#endif
