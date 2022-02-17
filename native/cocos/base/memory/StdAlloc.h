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

    #include "base/Macros.h"
    #include <limits>
    #include <stdlib.h>

namespace cc {

/**	A "standard" allocation policy for use with AllocatedObject and 
	STLAllocator. This is the class that actually does the allocation
	and deallocation of physical memory, and is what you will want to 
	provide a custom version of if you wish to change how memory is allocated.
	@par
	This class just delegates to the global malloc/free.
*/
class CC_DLL StdAllocPolicy {
public:
    static inline CC_DECL_MALLOC void *AllocateBytesAligned(size_t alignment, size_t count,
                                                               const char * = NULL, int = 0, const char * = NULL
    ) {
    #ifdef _MSC_VER
        void *ptr = _aligned_malloc(count, alignment);
    #elif defined(__ANDROID__)
        //void* ptr = memalign(alignment, count);
        unsigned char *p = (unsigned char *)malloc(count + alignment);
        size_t offset = alignment - (size_t(p) & (alignment - 1));
        unsigned char *ptr = p + offset;
        ptr[-1] = (unsigned char)offset;
    #else
        CCASSERT(alignment % sizeof(void*) == 0, "alignment is not multiple of sizeof(void*)");
        void *ptr = NULL;
        posix_memalign(&ptr, alignment, count);
    #endif
        return ptr;
    }

    static inline void DeallocateBytesAligned(void *ptr) {

    #ifdef _MSC_VER
        _aligned_free(ptr);
    #elif defined(__ANDROID__)
        if (ptr) {
            unsigned char *mem = (unsigned char *)ptr;
            mem = mem - mem[-1];
            free(mem);
        }
    #else
        free(ptr);
    #endif
    }

private:
    // No instantiation
    StdAllocPolicy() {}
};

} // namespace cc
