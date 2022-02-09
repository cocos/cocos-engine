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

#include "../Macros.h"
#include <cstddef>

// Anything that has done a #define new <blah> will screw operator new definitions up
// so undefine
#ifdef new
    #undef new
#endif
#ifdef delete
    #undef delete
#endif

namespace cc {

/** Superclass for all objects that wish to use custom memory allocators
 when their new / delete operators are called.
 Requires a template parameter identifying the memory allocator policy
 to use (e.g. see StdAllocPolicy).
 */
template <class Alloc>
class CC_DLL AllocatedObject {
public:
    explicit AllocatedObject() = default;
    virtual ~AllocatedObject() = default;

    // operator new, with debug line info
    void *operator new(size_t sz, const char *file, int line, const char *func) {
        return Alloc::AllocateBytes(sz, file, line, func);
    }

    /// array operator new, with debug line info
    void *operator new[](size_t sz, const char *file, int line, const char *func) {
        return Alloc::AllocateBytes(sz, file, line, func);
    }

    /// placement operator new
    void *operator new(size_t sz, void *ptr) {
        (void)sz;
        return ptr;
    }

#if 1
    void *operator new(size_t sz) {
        return Alloc::AllocateBytes(sz);
    }

    void *operator new[](size_t sz) {
        return Alloc::AllocateBytes(sz);
    }
#endif

    void operator delete(void *ptr) {
        Alloc::DeallocateBytes(ptr);
    }

    // Corresponding operator for placement delete (second param same as the first)
    void operator delete(void *ptr, void * /*unused*/) {
        Alloc::DeallocateBytes(ptr);
    }

    // only called if there is an exception in corresponding 'new'
    void operator delete(void *ptr, const char * /*unused*/, int /*unused*/, const char * /*unused*/) {
        Alloc::DeallocateBytes(ptr);
    }

    void operator delete[](void *ptr) {
        Alloc::DeallocateBytes(ptr);
    }

    void operator delete[](void *ptr, const char * /*unused*/, int /*unused*/, const char * /*unused*/) {
        Alloc::DeallocateBytes(ptr);
    }
};

} // namespace cc
