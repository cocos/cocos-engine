#include "Core/CoreStd.h"
#include "SceneMemManager.h"

CC_NAMESPACE_BEGIN

TransformMemManager::TransformMemManager(TransformMemType type):
m_type(type),
m_pTwinMemMgr(NULL),
m_iMaxCnt(500),
m_iMaxClearup(100)
{
	/*
		Manually allocate the memory for the dummy scene nodes 
		(since we can't pass ourselves or yet another object) 
		We only allocate what's needed to prevent access violations.
	*/
	m_dummyTransform.worldPositions = reinterpret_cast<SoAVec3*>(malloc(sizeof(SoAVec3)));
	m_dummyTransform.worldRotations = reinterpret_cast<SoAQuat*>(malloc(sizeof(SoAQuat)));
	m_dummyTransform.worldScales = reinterpret_cast<SoAVec3*>(malloc(sizeof(SoAVec3)));
	m_dummyTransform.matWorlds = reinterpret_cast<SoAMat4*>(malloc(sizeof(SoAMat4)));
	*m_dummyTransform.worldPositions = SOAVEC3_ZERO;
	*m_dummyTransform.worldRotations = SOAQUAT_IDENTITY;
	*m_dummyTransform.worldScales = SOAVEC3_ONE;
	*m_dummyTransform.matWorlds = SOAMAT4_IDENTITY;

}

TransformMemManager::~TransformMemManager()
{
	for(size_t i = 0; i < m_nodeMemMgrs.size(); ++i)
	{
		m_nodeMemMgrs[i]->destroy();
		delete m_nodeMemMgrs[i];
	}

	m_nodeMemMgrs.clear();

//	CC_SAFE_DELETE(m_dummyTransform);
	free(m_dummyTransform.worldPositions);
	free(m_dummyTransform.worldRotations);
	free(m_dummyTransform.worldScales);
	free(m_dummyTransform.matWorlds);
}

void TransformMemManager::setTwin(TransformMemType type, TransformMemManager *pTwinMemMgr)
{
	m_type = type;
	m_pTwinMemMgr = pTwinMemMgr;
}

size_t TransformMemManager::getDepth() const
{
	size_t retVal = (size_t)-1;

	TransformMemManagerList::const_iterator begin = m_nodeMemMgrs.begin();
	TransformMemManagerList::const_iterator itor = m_nodeMemMgrs.begin();
	TransformMemManagerList::const_iterator end = m_nodeMemMgrs.end();
	while(itor != end)
	{
		if((*itor)->getUsedMemory())
		{
			retVal = itor - begin;
		}

		++itor;
	}

	return retVal + 1;
}

size_t TransformMemManager::getFirstNode(Transform &outTransform, size_t depth)
{
	return m_nodeMemMgrs[depth]->getFirstNode(outTransform);
}

void TransformMemManager::growToDepth(size_t depth)
{
	while( depth >= m_nodeMemMgrs.size() )
	{
		m_nodeMemMgrs.push_back(new TransformSoAManager(m_type, &m_dummyTransform, (ui16)m_nodeMemMgrs.size(), m_iMaxCnt, m_iMaxClearup, this));
		m_nodeMemMgrs.back()->initialize();
	}
}

void TransformMemManager::nodeCreated(Transform &outTransform, size_t depth)
{
	growToDepth(depth);

	TransformSoAManager *mgr = m_nodeMemMgrs[depth];
	mgr->createNode(outTransform);
}

void TransformMemManager::nodeDestroyed(Transform &outTransform, size_t depth)
{
	TransformSoAManager *mgr = m_nodeMemMgrs[depth];
	mgr->destroyNode( outTransform );
}

void TransformMemManager::nodeAttached(Transform &outTransform, size_t depth)
{
	growToDepth(depth);

	Transform transform;
	m_nodeMemMgrs[depth]->createNode(transform);

	transform.copy(outTransform);

	TransformSoAManager *mgr = m_nodeMemMgrs[0];
	mgr->destroyNode( outTransform );

	outTransform = transform;
}

void TransformMemManager::nodeDetached(Transform &outTransform, size_t depth)
{
	Transform transform;
	m_nodeMemMgrs[0]->createNode(transform);

	transform.copy(outTransform);
	transform.parents[transform.idx] = &m_dummyTransform;

	TransformSoAManager *mgr = m_nodeMemMgrs[depth];
	mgr->destroyNode(outTransform);

	outTransform = transform;
}

void TransformMemManager::nodeMoved(Transform &inOutTransform, size_t oldDepth, size_t newDepth)
{
	growToDepth( newDepth );

	Transform transform;
	m_nodeMemMgrs[newDepth]->createNode(transform);

	transform.copy(inOutTransform);

	TransformSoAManager *mgr = m_nodeMemMgrs[oldDepth];
	mgr->destroyNode(inOutTransform);

	inOutTransform = transform;
}

void TransformMemManager::migrateTo(Transform &inOutTransform, size_t depth, TransformMemManager *pDstMemMgr)
{
	Transform tmp;
	pDstMemMgr->nodeCreated(tmp, depth);
	tmp.copy(inOutTransform);
	this->nodeDestroyed(inOutTransform, depth);
	inOutTransform = tmp;
}

void TransformMemManager::buildDiffList(MemMgrType type, ui16 level, const MemPoolVec &basePtrs, PtrdiffVec &outDiffsList)
{
}

void TransformMemManager::applyRebase(MemMgrType type, ui16 level, const MemPoolVec &newBasePtrs, const PtrdiffVec &diffsList)
{
	Transform transform;
	const size_t numNodes = this->getFirstNode(transform, level);

	for(size_t i = 0; i < numNodes; i += ARRAY_PACKED_FLOATS)
	{
		for(size_t j = 0; j < ARRAY_PACKED_FLOATS; ++j)
		{
			if(transform.owners[j])
			{
				transform.idx = (Byte)j;
				*transform.owners[j] = transform;
			}
		}

		transform.advancePack();
	}
}

void TransformMemManager::performCleanup(MemMgrType type, ui16 level, const MemPoolVec &basePtrs, size_t const *elementsMemSizes, size_t startInstance, size_t diffInstances)
{
	Transform transform;
	const size_t numNodes = this->getFirstNode(transform, level);

	size_t roundedStart = startInstance / ARRAY_PACKED_FLOATS;

	transform.advancePack(roundedStart);

	for(size_t i = roundedStart * ARRAY_PACKED_FLOATS; i < numNodes; i += ARRAY_PACKED_FLOATS)
	{
		for(size_t j = 0; j < ARRAY_PACKED_FLOATS; ++j)
		{
			if( transform.owners[j] )
			{
				transform.idx = (Byte)j;
				*transform.owners[j] = transform;
			}
		}

		transform.advancePack();
	}
}

CC_NAMESPACE_END
