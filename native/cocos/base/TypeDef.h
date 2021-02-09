/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#ifndef CC_CORE_TYPE_DEF_H_
#define CC_CORE_TYPE_DEF_H_

typedef unsigned int uint;
typedef unsigned short ushort;
typedef unsigned long ulong;

typedef unsigned int FlagBits;

#define CC_ENUM_OPERATORS(type_)                                                                                                                                                             \
    CC_INLINE type_ operator|(type_ lhs, type_ rhs) { return (type_)(static_cast<std::underlying_type<type_>::type /**/>(lhs) | static_cast<std::underlying_type<type_>::type /**/>(rhs)); } \
    CC_INLINE void operator|=(type_ &lhs, type_ rhs) { lhs = (type_)(static_cast<std::underlying_type<type_>::type /**/>(lhs) | static_cast<std::underlying_type<type_>::type /**/>(rhs)); } \
    CC_INLINE int operator&(type_ lhs, type_ rhs) { return (int)(static_cast<std::underlying_type<type_>::type /**/>(lhs) & static_cast<std::underlying_type<type_>::type /**/>(rhs)); }     \
    CC_INLINE void operator&=(type_ &lhs, type_ rhs) { lhs = (type_)(static_cast<std::underlying_type<type_>::type /**/>(lhs) & static_cast<std::underlying_type<type_>::type /**/>(rhs)); } \
    CC_INLINE bool operator||(type_ lhs, type_ rhs) { return (static_cast<std::underlying_type<type_>::type /**/>(lhs) || static_cast<std::underlying_type<type_>::type /**/>(rhs)); }       \
    CC_INLINE bool operator&&(type_ lhs, type_ rhs) { return (static_cast<std::underlying_type<type_>::type /**/>(lhs) && static_cast<std::underlying_type<type_>::type /**/>(rhs)); }

#endif // CC_CORE_TYPE_DEF_H_
