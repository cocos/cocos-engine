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

#ifndef CC_CORE_MEM_TRACKER_H_
#define CC_CORE_MEM_TRACKER_H_

#ifdef CC_MEMORY_TRACKER

namespace cc {

/** This class tracks the allocations and deallocations made, and
is able to report memory statistics and leaks.
@note
This class is only available in debug builds.
*/
class CC_CORE_API MemTracker {
public:
    ~MemTracker();

private:
    // protected ctor
    MemTracker();

public:
    // Get the total amount of memory allocated currently.
    inline size_t total_memory_allocated() const { return total_memory_allocated_; }

    void DumpMemoryAllocation();

    /** Record an allocation that has been made. Only to be called by
	the memory management subsystem.
	@param ptr The pointer to the memory
	@param sz The size of the memory in bytes
	@param pool The memory pool this allocation is occurring from
	@param file The file in which the allocation is being made
	@param ln The line on which the allocation is being made
	@param func The function in which the allocation is being made
    */
    void RecordAlloc(void *ptr, size_t sz,
                     const char *file = nullptr, size_t ln = 0, const char *func = nullptr);
    // Record the deallocation of memory.
    void RecordFree(void *ptr);
    void RecordReAlloc(void *oldptr, void *ptr, size_t sz,
                       const char *file = nullptr, size_t ln = 0, const char *func = nullptr);

    int GetAllocSize(void *ptr);

    // Static utility method to get the memory tracker instance
    inline static MemTracker *Instance() {
        static MemTracker tracker;
        return &tracker;
    }

private:
    void ReportLeaks();

private:
    std::mutex mutex_;
    size_t total_memory_allocated_;
    //tommy_hashdyn  m_allocations;
    void *allocations_;
};

} // namespace cc

#endif

#endif // CC_CORE_MEM_TRACKER_H_
