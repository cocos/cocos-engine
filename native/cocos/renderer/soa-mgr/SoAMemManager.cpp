#include "Core/CoreStd.h"
#include "SoAMemManager.h"

CC_NAMESPACE_BEGIN

void cleanerFlat(Byte *pDst, size_t indexDst, Byte *pSrc, size_t indexSrc, size_t slotCount, size_t freeSlotCount, size_t elmMemSize)
{
	memmove(pDst, pSrc, slotCount * elmMemSize);

	//We need to default-initialize the garbage left after.
	memset(pDst + slotCount * elmMemSize, 0, freeSlotCount * elmMemSize);
}

void cleanerSoAVec3(Byte *pDst, size_t indexDst, Byte *pSrc, size_t indexSrc, size_t slotCount, size_t freeSlotCount, size_t elmMemSize)
{
	SoAVec3 *dst = reinterpret_cast<SoAVec3*>( pDst - indexDst * elmMemSize );
	SoAVec3 *src = reinterpret_cast<SoAVec3*>( pSrc - indexSrc * elmMemSize );

	for( size_t i=0; i<slotCount; ++i )
	{
		dst->fromVec3(src->getVec3(indexSrc), indexDst);

		++indexDst;
		++indexSrc;

		if(indexDst >= ARRAY_PACKED_FLOATS)
		{
			++dst;
			indexDst = 0;
		}

		if(indexSrc >= ARRAY_PACKED_FLOATS)
		{
			++src;
			indexSrc = 0;
		}
	}

	//We need to default-initialize the garbage left after.
	size_t scalarRemainder = Math::Min(ARRAY_PACKED_FLOATS - indexDst, freeSlotCount);
	for(size_t i = 0; i < scalarRemainder; ++i)
	{
		dst->fromVec3(VEC3_ZERO, indexDst);
		++indexDst;
	}

	++dst;

	//Keep default initializing, but now on bulk (faster)
	size_t remainder = freeSlotCount - scalarRemainder;
	for(size_t i = 0; i < remainder; i += ARRAY_PACKED_FLOATS)
	{
		*dst++ = SOAVEC3_ZERO;
	}
}

void cleanerSoAQuat(Byte *pDst, size_t indexDst, Byte *pSrc, size_t indexSrc, size_t slotCount, size_t freeSlotCount, size_t elmMemSize)
{
	SoAQuat *dst = reinterpret_cast<SoAQuat*>(pDst - indexDst * elmMemSize);
	SoAQuat *src = reinterpret_cast<SoAQuat*>(pSrc - indexSrc * elmMemSize);

	for(size_t i = 0; i < slotCount; ++i)
	{
		dst->fromQuat(src->getQuat(indexSrc), indexDst);

		++indexDst;
		++indexSrc;

		if(indexDst >= ARRAY_PACKED_FLOATS)
		{
			++dst;
			indexDst = 0;
		}

		if(indexSrc >= ARRAY_PACKED_FLOATS)
		{
			++src;
			indexSrc = 0;
		}
	}

	//We need to default-initialize the garbage left after.
	size_t scalarRemainder = Math::Min(ARRAY_PACKED_FLOATS - indexDst, freeSlotCount);
	for(size_t i = 0; i < scalarRemainder; ++i)
	{
		dst->fromQuat(QUAT_IDENTITY, indexDst);
		++indexDst;
	}

	++dst;

	//Keep default initializing, but now on bulk (faster)
	size_t remainder = freeSlotCount - scalarRemainder;
	for(size_t i = 0; i < remainder; i += ARRAY_PACKED_FLOATS)
	{
		*dst++ = SOAQUAT_IDENTITY;
	}
}

void cleanerSoAMat4(Byte *pDst, size_t indexDst, Byte *pSrc, size_t indexSrc, size_t slotCount, size_t freeSlotCount, size_t elmMemSize)
{
	SoAMat4 *dst = reinterpret_cast<SoAMat4*>(pDst - indexDst * elmMemSize);
	SoAMat4 *src = reinterpret_cast<SoAMat4*>(pSrc - indexSrc * elmMemSize);

	for (size_t i = 0; i < slotCount; ++i)
	{
		dst->fromMat4(src->getMat4(indexSrc), indexDst);

		++indexDst;
		++indexSrc;

		if (indexDst >= ARRAY_PACKED_FLOATS)
		{
			++dst;
			indexDst = 0;
		}

		if (indexSrc >= ARRAY_PACKED_FLOATS)
		{
			++src;
			indexSrc = 0;
		}
	}

	//We need to default-initialize the garbage left after.
	size_t scalarRemainder = Math::Min(ARRAY_PACKED_FLOATS - indexDst, freeSlotCount);
	for (size_t i = 0; i < scalarRemainder; ++i)
	{
		dst->fromMat4(MAT4_IDENTITY, indexDst);
		++indexDst;
	}

	++dst;

	//Keep default initializing, but now on bulk (faster)
	size_t remainder = freeSlotCount - scalarRemainder;
	for (size_t i = 0; i < remainder; i += ARRAY_PACKED_FLOATS)
	{
		*dst++ = MAT4_IDENTITY;
	}
}


//////////////////////////////////////////////////////////////////////////

const size_t SoAMemManager::MAX_MEMORY_SLOTS = (size_t)(-ARRAY_PACKED_FLOATS) - 1 - CC_PREFETCH_SLOT_DISTANCE;

SoAMemManager::SoAMemManager(	MemMgrType type, size_t const *elmMemSizes, 
								CleanupRoutines const *cleanupRoutines, size_t elmMemSizeCount, 
								ui16 depthLevel, size_t maxNodeCount, 
								size_t cleanupThreshold, size_t maxHardLimit, 
								RebaseListener *pListener):
m_pListener(pListener),
m_type(type),
m_depthLevel(depthLevel),
m_memSlotUsed(0),
m_maxMemSlot(maxNodeCount),
m_maxHardLimit(maxHardLimit),
m_cleanupThreshold(cleanupThreshold),
m_totalMemSize(0),
m_elmMemSizes(elmMemSizes),
m_cleanupRoutines(cleanupRoutines)
{
	//If the assert triggers, their values will overflow to 0 when
	//trying to round to nearest multiple of ARRAY_PACKED_FLOATS
	//CC_ASSERT(m_maxHardLimit < (size_t)(-ARRAY_PACKED_FLOATS) && m_maxMemSlot < (size_t)(-ARRAY_PACKED_FLOATS) && m_maxMemSlot <= m_maxHardLimit);
	
	m_memPools.resize(elmMemSizeCount, 0);
	for(size_t i = 0; i < elmMemSizeCount; ++i)
	{
		m_totalMemSize += m_elmMemSizes[i];
	}

	//If m_maxMemSize == 1, it cannot grow because 1/2 truncates to 0
	m_maxMemSlot = Math::Max(2U, (uint)m_maxMemSlot) + CC_PREFETCH_SLOT_DISTANCE;
	m_maxHardLimit += CC_PREFETCH_SLOT_DISTANCE;

	// Round up max memory & hard limit to the next multiple of ARRAY_PACKED_REALS
	m_maxMemSlot = ((m_maxMemSlot + ARRAY_PACKED_FLOATS - 1) / ARRAY_PACKED_FLOATS ) * ARRAY_PACKED_FLOATS;
	m_maxHardLimit = ((m_maxHardLimit + ARRAY_PACKED_FLOATS - 1) / ARRAY_PACKED_FLOATS ) * ARRAY_PACKED_FLOATS;
}

SoAMemManager::~SoAMemManager()
{
}

void SoAMemManager::initialize()
{
	//CC_ASSERTS(m_memSlotUsed == 0, "Calling initialize twice with used slots will cause dangling ptrs" );
	destroy();

	size_t i = 0;

	MemPoolVec::iterator itor = m_memPools.begin();
	MemPoolVec::iterator end  = m_memPools.end();
	while(itor != end)
	{
		//          *itor = reinterpret_cast<char*>(_aligned_malloc(mMaxMemory * ElementsMemSize[i], 16));
		*itor = (Byte*)malloc(m_maxMemSlot * m_elmMemSizes[i]);
		memset(*itor, 0, m_maxMemSlot * m_elmMemSizes[i]);
		++i;
		++itor;
	}

	slotsRecreated( 0 );
}

void SoAMemManager::destroy()
{
	for(size_t i = 0; i < m_memPools.size(); ++i)
	{
		free(m_memPools[i]);
	}
}

size_t SoAMemManager::getFreeMemory() const
{
	return (m_maxMemSlot - CC_PREFETCH_SLOT_DISTANCE - m_memSlotUsed + m_availableSlots.size()) * m_totalMemSize;
}

size_t SoAMemManager::getUsedMemory() const
{
	 return (m_memSlotUsed - m_availableSlots.size()) * m_totalMemSize;
}

size_t SoAMemManager::getWastedMemory() const
{
	return m_availableSlots.size() * m_totalMemSize;
}

size_t SoAMemManager::getTotalMemory() const
{
	return m_maxMemSlot * m_totalMemSize;
}

size_t SoAMemManager::createNewSlot()
{
	size_t nextSlot = m_memSlotUsed;
	++m_memSlotUsed;

	//See if we can reuse a slot that was previously acquired and released
	if(!m_availableSlots.empty())
	{
		nextSlot = m_availableSlots.back();
		m_availableSlots.pop_back();
		--m_memSlotUsed;
	}

	if(m_memSlotUsed > m_maxMemSlot - CC_PREFETCH_SLOT_DISTANCE)
	{
		//CC_ASSERTS(m_maxMemSlot < m_maxHardLimit, "Trying to allocate more memory than the limit allowed by user");

		printf("SoAMemManager::createNewSlot  m_memSlotUsed:%lu  m_maxMemSlot:%lu \n",m_memSlotUsed,m_maxMemSlot);
		//Build the diff list for rebase later.
		PtrdiffVec diffsList;
		diffsList.reserve(m_memSlotUsed);
		m_pListener->buildDiffList(m_type, m_depthLevel, m_memPools, diffsList);
		
		//Reallocate, grow by 50% increments, rounding up to next multiple of ARRAY_PACKED_FLOATS
		size_t newMemory = Math::Min(m_maxMemSlot + (m_maxMemSlot >> 1), m_maxHardLimit);
		newMemory += (ARRAY_PACKED_FLOATS - newMemory % ARRAY_PACKED_FLOATS) % ARRAY_PACKED_FLOATS;
		newMemory = Math::Min( newMemory, m_maxHardLimit);

printf("SoAMemManager::createNewSlot  newMemory:%lu   \n",newMemory);

		size_t i = 0;
		MemPoolVec::iterator itor = m_memPools.begin();
		MemPoolVec::iterator end  = m_memPools.end();
		while( itor != end )
		{
			//Reallocate
			Byte *tmp = (Byte*)malloc(newMemory * m_elmMemSizes[i]);
			memcpy(tmp, *itor, m_maxMemSlot * m_elmMemSizes[i]);
			memset(tmp + m_maxMemSlot * m_elmMemSizes[i], 0, (newMemory - m_maxMemSlot) * m_elmMemSizes[i] );
			free(*itor);
			*itor = tmp;
			++i;
			++itor;
		}

		const size_t prevSlotCount = m_maxMemSlot;
		m_maxMemSlot = newMemory;

		//Rebase all ptrs
		m_pListener->applyRebase(m_type, m_depthLevel, m_memPools, diffsList);

		slotsRecreated(prevSlotCount);
	}

	return nextSlot;
}

void SoAMemManager::destroySlot(const Byte *pFirstElm, ui8 index)
{
	const Byte *basePtr = pFirstElm;

	const size_t slot = (basePtr - m_memPools[0]) / m_elmMemSizes[0] + index;
	//CC_ASSERTS(slot < m_maxMemSlot, "This slot does not belong to this SoAMemManager");

	if(slot + 1 == m_memSlotUsed)
	{
		//Lucky us, LIFO. We're done.
		--m_memSlotUsed;
	}
	else
	{
		//Not so lucky, add to "reuse" pool
		m_availableSlots.push_back(slot);

		//The pool is getting to big? Do some cleanup (depending
		//on fragmentation, may take a performance hit)
		if(m_availableSlots.size() > m_cleanupThreshold)
		{
			printf("SoAMemManager::destroySlot  m_memSlotUsed:%lu  \n",m_memSlotUsed);
			printf("SoAMemManager::destroySlot  m_availableSlots:%lu  m_cleanupThreshold:%lu \n",m_availableSlots.size(),m_cleanupThreshold);
			//Sort, last values first. This may improve performance in some
			//scenarios by reducing the amount of data to be shifted
			KSTD::sort(m_availableSlots.begin(), m_availableSlots.end(), KSTD::greater<size_t>());
			SlotList::const_iterator itor = m_availableSlots.begin();
			SlotList::const_iterator end  = m_availableSlots.end();

			while( itor != end )
			{
				//First see if we have a continuous range of unused slots
				size_t lastRange = 1;
				SlotList::const_iterator it = itor + 1;
				while( it != end && (*itor - lastRange) == *it )
				{
					++lastRange;
					++it;
				}

				size_t i=0;
				const size_t newEnd = *itor + 1;
				MemPoolVec::iterator itPools = m_memPools.begin();
				MemPoolVec::iterator enPools = m_memPools.end();

				//Shift everything N slots (N = lastRange)
				while(itPools != enPools)
				{
					Byte *pDst = *itPools + ( newEnd - lastRange ) * m_elmMemSizes[i];
					size_t indexDst = ( newEnd - lastRange ) % ARRAY_PACKED_FLOATS;
					Byte *pSrc = *itPools + newEnd * m_elmMemSizes[i];
					size_t indexSrc = newEnd % ARRAY_PACKED_FLOATS;
					size_t slotCount = ( m_memSlotUsed - newEnd );
					size_t freeSlotCount = lastRange;
					m_cleanupRoutines[i](pDst, indexDst, pSrc, indexSrc, slotCount, freeSlotCount, m_elmMemSizes[i]);
					++i;
					++itPools;
				}

				m_memSlotUsed -= lastRange;
				slotsRecreated(m_memSlotUsed);

				m_pListener->performCleanup(m_type, m_depthLevel, m_memPools, m_elmMemSizes, (newEnd - lastRange), lastRange);

				itor += lastRange;
			}
			printf("SoAMemManager::destroySlot aftercleanup m_memSlotUsed:%lu  \n",m_memSlotUsed);

			m_availableSlots.clear();
		}
	} // if
}

void SoAMemManager::slotsRecreated(size_t prevNumSlots)
{
}

//////////////////////////////////////////////////////////////////////////

const size_t TransformSoAManager::ElEMENT_MEMORY_SIZES[TMT_COUNT] =
{
	sizeof(Transform**),	// parent
	sizeof(Transform**),	// owner
	3 * sizeof(float),		// position
	4 * sizeof(float),		// rotation
	3 * sizeof(float),		// scale
	3 * sizeof(float),		// world position
	4 * sizeof(float),		// world rotation
	3 * sizeof(float),		// world scale
	16 * sizeof(float),		// world matrix
	//sizeof(bool),			// inherit rotation
	//sizeof(bool),			// inherit scale
};

const CleanupRoutines TransformSoAManager::NodeCleanupRoutines[TMT_COUNT] =
{
	cleanerFlat,		// parent
	cleanerFlat,		// owner
	cleanerSoAVec3,		// position
	cleanerSoAQuat,		// rotation
	cleanerSoAVec3,		// scale
	cleanerSoAVec3,		// world position
	cleanerSoAQuat,		// world rotation
	cleanerSoAVec3,		// world scale
	cleanerSoAMat4,		// world matrix
	//cleanerFlat,		// inherit rotation
	//cleanerFlat,		// inherit scale
};

TransformSoAManager::TransformSoAManager(TransformMemType type, Transform *pDummyTransform, ui16 depthLevel, size_t maxNodeCount, size_t cleanupThreshold, RebaseListener *pListener):
SoAMemManager(	MMT_TRANSFORM, ElEMENT_MEMORY_SIZES, NodeCleanupRoutines, sizeof(ElEMENT_MEMORY_SIZES)/sizeof(size_t), 
				depthLevel, maxNodeCount, cleanupThreshold, MAX_MEMORY_SLOTS, pListener),
m_pDummyTransform(pDummyTransform)
{
}

TransformSoAManager::~TransformSoAManager()
{
}

void TransformSoAManager::createNode(Transform &outTransform)
{
	const size_t nextSlot = createNewSlot();
	const unsigned char nextSlotIdx = nextSlot % ARRAY_PACKED_FLOATS;
	const size_t nextSlotBase = nextSlot - nextSlotIdx;

	//Set memory ptrs
	outTransform.idx = nextSlotIdx;
	outTransform.parents = reinterpret_cast<Transform**>(m_memPools[TMT_PARENT] + nextSlotBase * m_elmMemSizes[TMT_PARENT]);
	outTransform.owners = reinterpret_cast<Transform**>(m_memPools[TMT_OWNER] + nextSlotBase * m_elmMemSizes[TMT_OWNER]);
	outTransform.positions = reinterpret_cast<SoAVec3*>(m_memPools[TMT_POSITION] + nextSlotBase * m_elmMemSizes[TMT_POSITION]);
	outTransform.rotations = reinterpret_cast<SoAQuat*>(m_memPools[TMT_ROTATION] + nextSlotBase * m_elmMemSizes[TMT_ROTATION]);
	outTransform.scales = reinterpret_cast<SoAVec3*>(m_memPools[TMT_SCALE] + nextSlotBase * m_elmMemSizes[TMT_SCALE] );
	outTransform.worldPositions = reinterpret_cast<SoAVec3*>(m_memPools[TMT_WORLD_POSITION] + nextSlotBase * m_elmMemSizes[TMT_WORLD_POSITION]);
	outTransform.worldRotations = reinterpret_cast<SoAQuat*>(m_memPools[TMT_WORLD_ROTATION] + nextSlotBase * m_elmMemSizes[TMT_WORLD_ROTATION]);
	outTransform.worldScales = reinterpret_cast<SoAVec3*>(m_memPools[TMT_WORLD_SCALE] + nextSlotBase * m_elmMemSizes[TMT_WORLD_SCALE]);
	outTransform.matWorlds = reinterpret_cast<SoAMat4*>(m_memPools[TMT_WORLD_MATRIX] + nextSlotBase * m_elmMemSizes[TMT_WORLD_MATRIX]);

	//Set default values
	outTransform.parents[nextSlotIdx] = m_pDummyTransform;
	outTransform.owners[nextSlotIdx] = &outTransform;
	outTransform.positions->fromVec3(VEC3_ZERO, nextSlotIdx);
	outTransform.rotations->fromQuat(QUAT_IDENTITY, nextSlotIdx);
	outTransform.scales->fromVec3(VEC3_ONE, nextSlotIdx);
	outTransform.worldPositions->fromVec3(VEC3_ZERO, nextSlotIdx);
	outTransform.worldRotations->fromQuat(QUAT_IDENTITY, nextSlotIdx);
	outTransform.worldScales->fromVec3(VEC3_ONE, nextSlotIdx);
	outTransform.matWorlds->fromMat4(MAT4_IDENTITY, nextSlotIdx);
}

void TransformSoAManager::destroyNode(Transform &inOutTransform)
{
	//Zero out important data that would lead to bugs (Remember SIMD SoA means even if
	//there's one object in scene, 4 objects are still parsed simultaneously)

	inOutTransform.parents[inOutTransform.idx] = m_pDummyTransform;
	inOutTransform.owners[inOutTransform.idx] = NULL;
	destroySlot(reinterpret_cast<Byte*>(inOutTransform.parents), inOutTransform.idx);
	//Zero out all pointers
	inOutTransform = Transform();
}

size_t TransformSoAManager::getFirstNode(Transform &outTransform)
{
	outTransform.parents = reinterpret_cast<Transform**>(m_memPools[TMT_PARENT]);
	outTransform.owners = reinterpret_cast<Transform**>(m_memPools[TMT_OWNER]);
	outTransform.positions = reinterpret_cast<SoAVec3*>(m_memPools[TMT_POSITION]);
	outTransform.rotations = reinterpret_cast<SoAQuat*>(m_memPools[TMT_ROTATION]);
	outTransform.scales = reinterpret_cast<SoAVec3*>(m_memPools[TMT_SCALE]);
	outTransform.worldPositions = reinterpret_cast<SoAVec3*>(m_memPools[TMT_WORLD_POSITION]);
	outTransform.worldRotations = reinterpret_cast<SoAQuat*>(m_memPools[TMT_WORLD_ROTATION]);
	outTransform.worldScales = reinterpret_cast<SoAVec3*>(m_memPools[TMT_WORLD_SCALE]);
	//outTransform.matWorlds = reinterpret_cast<Mat4*>(m_memPools[TMT_WORLD_MATRIX]);
	outTransform.matWorlds = reinterpret_cast<SoAMat4*>(m_memPools[TMT_WORLD_MATRIX]);

	return m_memSlotUsed;
}

void TransformSoAManager::slotsRecreated(size_t prevSlotCount)
{
	SoAMemManager::slotsRecreated(prevSlotCount);

	Transform **nodes = reinterpret_cast<Transform**>(m_memPools[TMT_PARENT]) + prevSlotCount;
	for(size_t i = prevSlotCount; i < m_maxMemSlot; ++i )
	{
		*nodes++ = m_pDummyTransform;
	}

	//nodes = reinterpret_cast<Transform**>(m_memPools[TMT_OWNER]);
	/*
	for( size_t i=0; i<prevSlotCount; ++i )
	{
		if( *nodes )
		{
			(*nodes)->_callMemoryChangeListeners();
		}
		++nodes;
	}
	*/
}

CC_NAMESPACE_END
