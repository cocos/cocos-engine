#ifndef __SCENEMEMMANAGER_H__
#define __SCENEMEMMANAGER_H__

#include "SoAMemManager.h"

CC_NAMESPACE_BEGIN

class  TransformMemManager: public RebaseListener
{
public:
	TransformMemManager(TransformMemType type);
	virtual ~TransformMemManager();

	typedef std::vector<TransformSoAManager*>	TransformMemManagerList;

public:
	inline TransformMemType		getType() const { return m_type; }
	inline TransformMemManager*	getTwin() const { return m_pTwinMemMgr; }
	inline const Transform&	getDummyTransform() const { return m_dummyTransform; }

	void				setTwin(TransformMemType type, TransformMemManager *pTwinMemMgr);

	size_t				getDepth() const;
	size_t				getFirstNode(Transform &outTransform, size_t depth);

	void				growToDepth(size_t depth);
	void				nodeCreated(Transform &outTransform, size_t depth);
	void				nodeDestroyed(Transform &outTransform, size_t depth);
	void				nodeAttached(Transform &outTransform, size_t depth);
	void				nodeDetached(Transform &outTransform, size_t depth);
	void				nodeMoved(Transform &inOutTransform, size_t oldDepth, size_t newDepth);
    void				migrateTo(Transform &inOutTransform, size_t depth, TransformMemManager *pDstMemMgr);

	// Derived from RebaseListener
	virtual void		buildDiffList(MemMgrType type, ui16 level, const MemPoolVec &basePtrs, PtrdiffVec &outDiffsList);
	virtual void		applyRebase(MemMgrType type, ui16 level, const MemPoolVec &newBasePtrs, const PtrdiffVec &diffsList);
	virtual void		performCleanup(MemMgrType type, ui16 level, const MemPoolVec &basePtrs, size_t const *elementsMemSizes, size_t startInstance, size_t diffInstances);

protected:
	TransformMemType		m_type;

	/** Memory managers can have a 'twin' (optional). A twin is used when there
		static and dynamic scene managers, thus caching their pointers here is
		very convenient. */
	TransformMemManager		*m_pTwinMemMgr;

	TransformMemManagerList	m_nodeMemMgrs;

	// Dummy node where to point Transform::mParents[i] when they're unused slots.
//	Transform			*m_pDummyNode;
	Transform			m_dummyTransform;

	ui32	m_iMaxCnt;
	ui32	m_iMaxClearup;
};


	
CC_NAMESPACE_END

#endif