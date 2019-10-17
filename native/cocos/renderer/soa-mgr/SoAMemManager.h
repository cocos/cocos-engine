#ifndef __SOAMEMMANAGER_H__
#define __SOAMEMMANAGER_H__

#include "Transform.h"

CC_NAMESPACE_BEGIN

typedef std::vector<ptrdiff_t> PtrdiffVec;
enum MemMgrType
{
	MMT_TRANSFORM,
	MMT_OBJDATA,
	MMT_COUNT,
};
enum TransformMemType
{
	SMT_STATIC,
	SMT_DYNAMIC,
	SMT_COUNT
};
/*
When mUsedMemory >= mMaxMemory (that is, we've exhausted all our preallocated memory)
ArrayMemoryManager will proceed to reallocate all memory. The resulting base pointer
address may have changed and hence each ArrayVector3, ArrayMatrix4, etc needs to be
rebased (alter it's mChunkBase pointer).

It consists in two steps: First build a list of relative differences before deallocation
and then apply the new base offseting based on that list. The list is needed because
as per C++ standard, once the memory freed, using the pointers is undefined behavior
(even freedPtr > someValid pointer is now UB). Most systems using a flat memory model
in which case the list wouldn't be needed (since 99% of the times, the ptr is just an
integer). However we can't guarantee in which architectures this code will run on.
*/

class RebaseListener
{
public:
	/** Called when the manager needs to grow it's memory pool to honor more node requests.
	See the class description on why we need to do this (to avoid C++ undefined behavior)
	@remarks
		Needs to builds a list that will contain the difference in bytes between each
		ArrayVector3/ArrayMatrix4/etc and the base pointers _in_the_order_ in which the
		derived class holds those pointers (i.e. in the order the SceneNodes are arranged
		in memory)
	@param managerType
		The derived type of this manager, so listener knows whether this is an Node or
		ObjectData manager
	@param level
		The hierarchy depth level
	@param basePtrs
		The base pointers from each pool so we can calculate the differences
	@param utDiffsList
		The list we'll generate. "outDiffsList" already has enough reserved space
	*/
	virtual void buildDiffList(MemMgrType type, ui16 level, const MemPoolVec &basePtrs, PtrdiffVec &outDiffsList) = 0;

	/** Called when the manager already grew it's memory pool to honour more node requests.
	@remarks
		Will use the new base ptr and the list we built in @see buildDiffList() to know
		what mChunkPtr & mIndex needs to be set for each ArrayVector3/etc we have.
	@param managerType
		The derived type of this manager, so listener knows whether this is an Node or
		ObjectData manager
	@param level
		The hierarchy depth level
	@param newBasePtrs
		The new base ptr.
	@param diffsList
		The list built in buildDiffList
	*/
	virtual void applyRebase(MemMgrType type, ui16 level, const MemPoolVec &newBasePtrs, const PtrdiffVec &diffsList) = 0;

	/** Called when too many nodes were destroyed in a non-LIFO fashion. Without cleaning up,
		the scene manager will waste CPU & bandwidth on processing vectors & matrices that
		are not in use. The more fragmented/unordered those removals were, the worst it is.
		Try to create everything static first, then dynamic content.
	@remarks
		The manager behaves similarly to a Garbage Collector, as it is triggered after
		certain amount of nodes have been freed (unless they respected LIFO order)

		In a way, it's very similar to vector::remove(), as removing an element from
		the middle means we need to shift everything past that point one place (or more).
	@param managerType
		The derived type of this manager, so listener knows whether this is an Node or
		ObjectData manager
	@param level
		The hierarchy depth level
	@param basePtrs
		The base ptrs.
	@param startInstance
		The instance to which past that we need to shift
	@param diffInstances
		How many places we need to shift backwards.
	*/
	virtual void performCleanup(MemMgrType type, ui16 level, const MemPoolVec &basePtrs, 
								size_t const *elementsMemSizes, size_t startInstance, size_t diffInstances) = 0;
};

//////////////////////////////////////////////////////////////////////////

typedef void (*CleanupRoutines)(Byte *dstPtr, size_t indexDst, Byte *pSrc, size_t indexSrc, size_t numSlots, size_t numFreeSlots, size_t elmMemSize);

class SoAMemManager
{
public:
	SoAMemManager(	MemMgrType type, size_t const *elmMemSizes, 
					CleanupRoutines const *cleanupRoutines, size_t elmMemSizeCount, 
					ui16 depthLevel, size_t maxNodeCount, 
					size_t cleanupThreshold, size_t maxHardLimit, 
					RebaseListener *pListener);
	virtual ~SoAMemManager();

	static const size_t				MAX_MEMORY_SLOTS;

	typedef std::vector<size_t>	SlotList;

public:
	virtual void		initialize();
	virtual void		destroy();

	virtual size_t		getFreeMemory() const;
	virtual size_t		getUsedMemory() const;
	virtual size_t		getWastedMemory() const;
	virtual size_t		getTotalMemory() const;

protected:
	virtual size_t		createNewSlot();
	virtual void		destroySlot(const Byte *pFirstElm, ui8 index);
	virtual void		WER1(size_t prevSlotCount);
	void 				slotsRecreated(size_t prevNumSlots);

protected:
	RebaseListener			*m_pListener;
	MemMgrType				m_type;
	ui16					m_depthLevel;
	size_t					m_memSlotUsed;
	size_t					m_maxMemSlot;
	size_t					m_maxHardLimit;
	size_t					m_cleanupThreshold;
	size_t					m_totalMemSize;
	MemPoolVec				m_memPools;
	size_t const			*m_elmMemSizes;
	SlotList				m_availableSlots;
	CleanupRoutines const	*m_cleanupRoutines;
};

//////////////////////////////////////////////////////////////////////////



class TransformSoAManager: public SoAMemManager
{
public:
	static const size_t				ElEMENT_MEMORY_SIZES[TMT_COUNT];
	static const CleanupRoutines	NodeCleanupRoutines[TMT_COUNT];

	TransformSoAManager(TransformMemType type,Transform* pDummyTransform, ui16 depthLevel, 
					size_t maxNodeCount = 100, size_t cleanupThreshold = 100, 
					RebaseListener *pListener = NULL);
	virtual ~TransformSoAManager();

public:
	virtual void		createNode(Transform &outTransform);
	virtual void		destroyNode(Transform &inOutTransform);
	virtual size_t		getFirstNode(Transform &outTransform);

protected:
	virtual void		slotsRecreated(size_t prevSlotCount);

protected:
	Transform			*m_pDummyTransform;
};

CC_NAMESPACE_END

#endif
