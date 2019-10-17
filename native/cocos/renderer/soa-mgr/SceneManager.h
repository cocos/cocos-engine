#ifndef __SCENEMANAGER_H__
#define __SCENEMANAGER_H__

#include "SceneMemManager.h"

CC_NAMESPACE_BEGIN
typedef std::vector<TransformMemManager*> TransformMemMgrList;
class SceneManager
{
public:
    SceneManager();
    ~SceneManager();

    bool initialize();
    void destroy();

    void createTransform(Transform & trans, ui16 depth, TransformMemType type = SMT_DYNAMIC);
    void destroyTransfrom(Transform & trans, ui16 depth/* , TransformMemType type = SMT_DYNAMIC */);

    void nodeMoved(Transform &inOutTransform, ui16 oldDepth, ui16 newDepth/* , TransformMemType type = SMT_DYNAMIC */);
    void updateTransform();

    static void setDebug(bool val);
    static void myPrint(const char * cmd, ...);
protected:
	TransformMemManager*			m_nodeMemMgrs[SMT_COUNT];
	// Filled and cleared every frame in HighLevelCull()
	TransformMemMgrList			m_updateNodeMemMgrs;
    static bool    m_bDebug;
};

CC_NAMESPACE_END

#endif