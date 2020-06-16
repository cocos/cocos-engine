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
	CC_INLINE size_t total_memory_allocated() const { return total_memory_allocated_; }

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
	void RecordAlloc(void* ptr, size_t sz,
		const char* file = nullptr, size_t ln = 0, const char* func = nullptr);
	// Record the deallocation of memory.
	void RecordFree(void* ptr);
	void RecordReAlloc(void* oldptr, void* ptr, size_t sz,
		const char *file = nullptr, size_t ln = 0, const char *func = nullptr);

	int GetAllocSize(void *ptr);

	// Static utility method to get the memory tracker instance
	CC_INLINE static MemTracker* Instance() {
		static MemTracker tracker;
		return &tracker;
	}
  
 private:
  void          ReportLeaks();
  
 private:
  std::mutex    mutex_;
  size_t        total_memory_allocated_;
  //tommy_hashdyn  m_allocations;
  void*         allocations_;
};

}

#endif

#endif // CC_CORE_MEM_TRACKER_H_
