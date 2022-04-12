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

#include "base/CoreStd.h"
#include "NedPooling.h"
#include "MemTracker.h"

#if (CC_MEMORY_ALLOCATOR == CC_MEMORY_ALLOCATOR_NEDPOOLING)

    // include Ned implementation
    #if (CC_COMPILER == CC_COMPILER_MSVC)
        #pragma warning(disable : 4005 4189 4267 4565 4702 4706)
    #endif

    #define USE_LOCKS 1
    #define INSECURE  1
    #include <nedmalloc.c>

namespace cc {

namespace nedPoolingIntern {

const size_t ned_poolCount = 14; // Needs to be greater than 4
    #if (CC_CPU_ARCH == CC_CPU_ARCH_32)
void *ned_poolFootprint = reinterpret_cast<void *>(0xBB1AA45A);
    #else
void *ned_poolFootprint = reinterpret_cast<void *>((ui64)0xBB1AA45A);
    #endif
nedalloc::nedpool *ned_pools[ned_poolCount + 1] = {0};
nedalloc::nedpool *ned_poolsAligned[ned_poolCount + 1] = {0};

size_t PoolIDFromSize(size_t a_reqSize) {
    // Requests size 16 or smaller are allocated at a 4 byte granularity.
    // Requests size 17 or larger are allocated at a 16 byte granularity.
    // With a ned_poolCount of 14, requests size 177 or larger go in the default pool.

    // spreadsheet style =IF(B35<=16; FLOOR((B35-1)/4;1); MIN(FLOOR((B35-1)/16; 1) + 3; 14))

    size_t poolID = 0;

    if (a_reqSize > 0) {
        if (a_reqSize <= 16) {
            poolID = (a_reqSize - 1) >> 2;
        } else {
            poolID = std::min<size_t>(((a_reqSize - 1) >> 4) + 3, ned_poolCount);
        }
    }

    return poolID;
}

CC_DECL_MALLOC void *InternalAlloc(size_t a_reqSize) {
    size_t poolID = PoolIDFromSize(a_reqSize);
    nedalloc::nedpool *pool(0); // A pool pointer of 0 means the default pool.

    if (poolID < ned_poolCount) {
        if (ned_pools[poolID] == 0) {
            // Init pool if first use

            ned_pools[poolID] = nedalloc::nedcreatepool(0, 8);
            nedalloc::nedpsetvalue(ned_pools[poolID], ned_poolFootprint); // All pools are stamped with a footprint
        }

        pool = ned_pools[poolID];
    }

    return nedalloc::nedpmalloc(pool, a_reqSize);
}

CC_DECL_MALLOC void *InternalRealloc(void *ptr, size_t a_reqSize) {
    size_t poolID = PoolIDFromSize(a_reqSize);
    nedalloc::nedpool *pool(0); // A pool pointer of 0 means the default pool.

    if (poolID < ned_poolCount) {
        if (ned_pools[poolID] == 0) {
            // Init pool if first use

            ned_pools[poolID] = nedalloc::nedcreatepool(0, 8);
            nedalloc::nedpsetvalue(ned_pools[poolID], ned_poolFootprint); // All pools are stamped with a footprint
        }

        pool = ned_pools[poolID];
    }

    return nedalloc::nedprealloc(pool, ptr, a_reqSize);
}

CC_DECL_MALLOC void *InternalAllocAligned(size_t a_align, size_t a_reqSize) {
    size_t poolID = PoolIDFromSize(a_reqSize);
    nedalloc::nedpool *pool(0); // A pool pointer of 0 means the default pool.

    if (poolID < ned_poolCount) {
        if (ned_poolsAligned[poolID] == 0) {
            // Init pool if first use

            ned_poolsAligned[poolID] = nedalloc::nedcreatepool(0, 8);
            nedalloc::nedpsetvalue(ned_poolsAligned[poolID], ned_poolFootprint); // All pools are stamped with a footprint
        }

        pool = ned_poolsAligned[poolID];
    }

    return nedalloc::nedpmemalign(pool, a_align, a_reqSize);
}

void InternalFree(void *a_mem) {
    if (a_mem) {
        nedalloc::nedpool *pool(0);

        // nedalloc lets us get the pool pointer from the memory pointer
        void *footprint = nedalloc::nedgetvalue(&pool, a_mem);

        // Check footprint
        if (footprint == ned_poolFootprint) {
            // If we allocated the pool, deallocate from this pool...
            nedalloc::nedpfree(pool, a_mem);
        } else {
            // ...otherwise let nedalloc handle it.
            nedalloc::nedfree(a_mem);
        }
    }
}

} // namespace nedPoolingIntern

//////////////////////////////////////////////////////////////////////////

CC_DECL_MALLOC void *NedPoolingImpl::AllocBytes(size_t count, const char *file, int line, const char *func) {
    void *ptr = nedPoolingIntern::InternalAlloc(count);
    #ifdef CC_MEMORY_TRACKER
    MemTracker::Instance()->RecordAlloc(ptr, count, file, line, func);
    #else
    // avoid unused params warning
    (void)file;
    (void)line;
    (void)func;
    #endif
    return ptr;
}

CC_DECL_MALLOC void *NedPoolingImpl::ReallocBytes(void *ptr, size_t count, const char *file, int line, const char *func) {
    #ifdef CC_MEMORY_TRACKER
    if (ptr) {
        if (count == 0) {
            MemTracker::Instance()->RecordFree(ptr);
            nedPoolingIntern::InternalFree(ptr);
            return nullptr;
        } else {
            int oldsz = MemTracker::Instance()->GetAllocSize(ptr);
            if (oldsz < 0) {
                CCASSERT(false, "ned realloc: get old size of ptr fail!");
                return realloc(ptr, count);
            } else {
                if (oldsz > (int)count) oldsz = (int)count;
            }

            void *nptr = nedPoolingIntern::InternalAlloc(count);
            memcpy(nptr, ptr, oldsz);
            MemTracker::Instance()->RecordAlloc(nptr, count, file, line, func);
            MemTracker::Instance()->RecordFree(ptr);
            nedPoolingIntern::InternalFree(ptr);
            return nptr;
        }
    } else {
        if (count) {
            ptr = nedPoolingIntern::InternalAlloc(count);
            MemTracker::Instance()->RecordAlloc(ptr, count, file, line, func);
            return ptr;
        } else {
            return nullptr;
        }
    }
    #else
    return nedPoolingIntern::InternalRealloc(ptr, count);
    #endif
}

CC_DECL_MALLOC void *NedPoolingImpl::AllocBytesAligned(size_t align, size_t count, const char *file, int line, const char *func) {
    // default to platform SIMD alignment if none specified
    void *ptr = nedPoolingIntern::InternalAllocAligned(align, count);
    #ifdef CC_MEMORY_TRACKER
    MemTracker::Instance()->RecordAlloc(ptr, count, file, line, func);
    #else
    // avoid unused params warning
    (void)file;
    (void)line;
    (void)func;
    #endif
    return ptr;
}

void NedPoolingImpl::DeallocBytes(void *ptr) {
    // deal with null
    if (!ptr) {
        return;
    }
    #ifdef CC_MEMORY_TRACKER
    MemTracker::Instance()->RecordFree(ptr);
    #endif
    nedPoolingIntern::InternalFree(ptr);
}

} // namespace cc

#endif // end - #ifdef CC_MEMORY_ALLOCATOR_NEDPOOLING
