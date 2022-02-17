/****************************************************************************
This source file is part of OGRE
(Object-oriented Graphics Rendering Engine)
For the latest info, see http://www.ogre3d.org/

Copyright (c) 2000-2014 Torus Knot Software Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include "StdAlloc.h"

    // aligned allocation
    /// Allocate a block of raw memory aligned to user defined boundaries.
    #define _CC_MALLOC_ALIGN(bytes, align)         ::cc::StdAllocPolicy::AllocateBytesAligned(align, bytes)
    /// Free the memory allocated with either _CC_MALLOC_ALIGN or _CC_ALLOC_T_ALIGN.
    #define _CC_FREE_ALIGN(ptr)                    ::cc::StdAllocPolicy::DeallocateBytesAligned((void *)ptr)

    /// Allocate space for one primitive type, external type or non-virtual type aligned to user defined boundaries
    #define _CC_NEW_ALIGN(T, align)              new (::cc::StdAllocPolicy::AllocateBytesAligned(align, sizeof(T))) T
    #define _CC_NEW_ALIGN_ARGS(T, align, ...)    new (::cc::StdAllocPolicy::AllocateBytesAligned(align, sizeof(T))) T(__VA_ARGS__)

    /// Free the memory allocated with _CC_NEW_ALIGN.
    #define _CC_DELETE_ALIGN(ptr, T, align)                                  \
        if (ptr) {                                                             \
            (ptr)->~T();                                                       \
            ::cc::StdAllocPolicy::DeallocateBytesAligned((void *)ptr); \
        }
    /// Free the memory allocated with _CC_NEW_ARRAY_ALIGN.
    #define _CC_DELETE_ARRAY_ALIGN(ptr, T, count, align)                     \
        if (ptr) {                                                             \
            for (size_t _b = 0; _b < (size_t)count; ++_b) {                    \
                (ptr)[_b].~T();                                                \
            }                                                                  \
            ::cc::StdAllocPolicy::DeallocateBytesAligned((void *)ptr); \
        }
