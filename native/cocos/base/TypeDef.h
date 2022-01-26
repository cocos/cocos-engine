/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <cstdint>
#include <unordered_map>
#include "base/Macros.h"

using uint   = std::uint32_t;
using ushort = std::uint16_t;

#if (CC_PLATFORM != CC_PLATFORM_LINUX && CC_PLATFORM != CC_PLATFORM_QNX) // linux has typedef ulong
using ulong = std::uint32_t;
#endif
using FlagBits = std::uint32_t;

using index_t = int32_t;
#define CC_INVALID_INDEX (-1)

#define Record std::unordered_map // NOLINT(readability-identifier-naming)

#define CC_ENUM_CONVERSION_OPERATOR(T) \
    inline std::underlying_type<T>::type toNumber(const T v) { return static_cast<std::underlying_type<T>::type>(v); }

#define CC_ENUM_BITWISE_OPERATORS(T)                                                                                                                                              \
    inline bool operator!(const T v) { return !static_cast<std::underlying_type<T>::type>(v); }                                                                                   \
    inline T    operator~(const T v) { return static_cast<T>(~static_cast<std::underlying_type<T>::type>(v)); }                                                                   \
    inline bool operator||(const T lhs, const T rhs) { return (static_cast<std::underlying_type<T>::type>(lhs) || static_cast<std::underlying_type<T>::type>(rhs)); }             \
    inline bool operator&&(const T lhs, const T rhs) { return (static_cast<std::underlying_type<T>::type>(lhs) && static_cast<std::underlying_type<T>::type>(rhs)); }             \
    inline T    operator|(const T lhs, const T rhs) { return static_cast<T>(static_cast<std::underlying_type<T>::type>(lhs) | static_cast<std::underlying_type<T>::type>(rhs)); } \
    inline T    operator&(const T lhs, const T rhs) { return static_cast<T>(static_cast<std::underlying_type<T>::type>(lhs) & static_cast<std::underlying_type<T>::type>(rhs)); } \
    inline T    operator^(const T lhs, const T rhs) { return static_cast<T>(static_cast<std::underlying_type<T>::type>(lhs) ^ static_cast<std::underlying_type<T>::type>(rhs)); } \
    inline T    operator+(const T lhs, const T rhs) { return static_cast<T>(static_cast<std::underlying_type<T>::type>(lhs) + static_cast<std::underlying_type<T>::type>(rhs)); } \
    inline T    operator+(const T lhs, bool rhs) { return static_cast<T>(static_cast<std::underlying_type<T>::type>(lhs) + rhs); }                                                \
    inline void operator|=(T &lhs, const T rhs) { lhs = static_cast<T>(static_cast<std::underlying_type<T>::type>(lhs) | static_cast<std::underlying_type<T>::type>(rhs)); }      \
    inline void operator&=(T &lhs, const T rhs) { lhs = static_cast<T>(static_cast<std::underlying_type<T>::type>(lhs) & static_cast<std::underlying_type<T>::type>(rhs)); }      \
    inline void operator^=(T &lhs, const T rhs) { lhs = static_cast<T>(static_cast<std::underlying_type<T>::type>(lhs) ^ static_cast<std::underlying_type<T>::type>(rhs)); }      \
    inline bool hasFlag(const T flags, const T flagToTest) {                                                                                                                      \
        using ValueType = std::underlying_type<T>::type;                                                                                                                          \
        CCASSERT((static_cast<ValueType>(flagToTest) & (static_cast<ValueType>(flagToTest) - 1)) == 0, "More than one flag specified");                                           \
        return (static_cast<ValueType>(flags) & static_cast<ValueType>(flagToTest)) != 0;                                                                                         \
    }                                                                                                                                                                             \
    inline bool hasAnyFlags(const T flags, const T flagsToTest) {                                                                                                                 \
        using ValueType = std::underlying_type<T>::type;                                                                                                                          \
        return (static_cast<ValueType>(flags) & static_cast<ValueType>(flagsToTest)) != 0;                                                                                        \
    }                                                                                                                                                                             \
    inline bool hasAllFlags(const T flags, const T flagsToTest) {                                                                                                                 \
        using ValueType = std::underlying_type<T>::type;                                                                                                                          \
        return (static_cast<ValueType>(flags) & static_cast<ValueType>(flagsToTest)) == static_cast<ValueType>(flagsToTest);                                                      \
    }                                                                                                                                                                             \
    inline T addFlags(T &flags, const T flagsToAdd) {                                                                                                                             \
        flags |= flagsToAdd;                                                                                                                                                      \
        return flags;                                                                                                                                                             \
    }                                                                                                                                                                             \
    inline T removeFlags(T &flags, const T flagsToRemove) {                                                                                                                       \
        flags &= ~flagsToRemove;                                                                                                                                                  \
        return flags;                                                                                                                                                             \
    }                                                                                                                                                                             \
    CC_ENUM_CONVERSION_OPERATOR(T)
