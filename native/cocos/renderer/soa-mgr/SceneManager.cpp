#include "Core/CoreStd.h"
#include"SceneManager.h"


CC_NAMESPACE_BEGIN

    bool SceneManager::m_bDebug = false;
    SceneManager::SceneManager()
    {

    }
    SceneManager::~SceneManager()
    {

    }

    bool SceneManager::initialize()
    {
        TransformMemType type = SMT_DYNAMIC;
        // create scene memory managers
        m_nodeMemMgrs[SMT_STATIC] = new TransformMemManager(SMT_STATIC);
        m_nodeMemMgrs[SMT_DYNAMIC] = new TransformMemManager(SMT_DYNAMIC);
        m_nodeMemMgrs[SMT_STATIC]->setTwin(SMT_STATIC, m_nodeMemMgrs[SMT_DYNAMIC]);
        m_nodeMemMgrs[SMT_DYNAMIC]->setTwin(SMT_DYNAMIC, m_nodeMemMgrs[SMT_STATIC]);

        m_updateNodeMemMgrs.resize(SMT_COUNT);

        for (size_t i = 0; i < SMT_COUNT; ++i)
        {
            m_updateNodeMemMgrs[i] = m_nodeMemMgrs[i];
        }
        return true;
    }

    void SceneManager::destroy()
    {
        for (size_t i = 0; i < SMT_COUNT; ++i)
        {
            delete m_nodeMemMgrs[i];
        }
    }

    void SceneManager::createTransform(Transform & trans, ui16 depth, TransformMemType type)
    {
        TransformMemManager *pNodeMemMgr = m_nodeMemMgrs[type];
	    pNodeMemMgr->nodeCreated(trans, depth);
    }
    void SceneManager::destroyTransfrom(Transform & trans, ui16 depth/* , TransformMemType type */)
    {
        TransformMemType type = SMT_DYNAMIC;
        TransformMemManager *pNodeMemMgr = m_nodeMemMgrs[type];
		pNodeMemMgr->nodeDestroyed(trans, depth);
    }

    void SceneManager::myPrint(const char * cmd, ...) 
    {
        if(SceneManager::m_bDebug) 
        {
            va_list args;       //定义一个va_list类型的变量，用来储存单个参数  
            va_start(args,cmd); //使args指向可变参数的第一个参数  
            vprintf(cmd,args);  //必须用vprintf等带V的  
            va_end(args);       //结束可变参数的获取
        }
    }

    void SceneManager::setDebug(bool val)
    {
        SceneManager::m_bDebug = val;
    }

    void SceneManager::updateTransform()
    {
        for (size_t i = 0; i < m_updateNodeMemMgrs.size(); ++i)
        {
            TransformMemManager* pNodeMemMgr = m_updateNodeMemMgrs[i];
            if (!pNodeMemMgr)
            {
                continue;
            } 

            const size_t numDepths = pNodeMemMgr->getDepth();
            size_t start = 0;//pNodeMemMgr->getType() == SMT_STATIC ? staticMinDepthLevelDirty : 0;
            
            myPrint("++++++++grow to depth %d \n",(int)numDepths);
            //Start from the first level (not root) unless static (start from first dirty)
            for (size_t d = start; d < numDepths; ++d)
            {
                Transform transform;
                const size_t numNodes = pNodeMemMgr->getFirstNode(transform, d);
                myPrint("-----depth: %d numNodes: %d \n",(int)d , (int)numNodes);
                for (size_t i = 0; i < numNodes; i += ARRAY_PACKED_FLOATS)
                {
                    myPrint("===num of indes : %d \n", (int)i);
                    //Retrieve from parents. Unfortunately we need to do SoA -> AoS -> SoA conversion
                    SoAMat4 matWorldP;

                    for (size_t j = 0; j < ARRAY_PACKED_FLOATS; ++j)
                    {
                        Transform* parentTrans = transform.parents[j];
                        matWorldP.fromMat4(parentTrans->matWorlds->getMat4(parentTrans->idx), j);
                    }

                    // myPrint("parent world\n");
                    myPrint("parent world scale: %f %f %f postion: %f %f %f rotation: %f %f %f %f\n", 
                    transform.parents[0]->worldScales->getVec3(0).x,transform.parents[0]->worldScales->getVec3(0).y,transform.parents[0]->worldScales->getVec3(0).z,
                    transform.parents[0]->worldPositions->getVec3(0).x,transform.parents[0]->worldPositions->getVec3(0).y, transform.parents[0]->worldPositions->getVec3(0).z,
                    transform.parents[0]->worldRotations->getQuat(0).x,transform.parents[0]->worldRotations->getQuat(0).y,transform.parents[0]->worldRotations->getQuat(0).z,transform.parents[0]->worldRotations->getQuat(0).w);

                    SoAMat4 matLocal;
                    matLocal.compose(*transform.positions, *transform.scales, *transform.rotations);

                    //myPrint("local\n");
                    myPrint("scale: %f %f %f positons: %f %f %f  rotation: %f %f %f %f\n",
                    transform.scales->getVec3(0).x,transform.scales->getVec3(0).y,transform.scales->getVec3(0).z,  
                    transform.positions->getVec3(0).x,transform.positions->getVec3(0).y,transform.positions->getVec3(0).z,
                    transform.rotations->getQuat(0).x,transform.rotations->getQuat(0).y,transform.rotations->getQuat(0).z,transform.rotations->getQuat(0).w);

                    *transform.matWorlds = matWorldP * matLocal;
                    transform.matWorlds->decompose(*transform.worldPositions, *transform.worldScales, *transform.worldRotations);


                   // myPrint("world\n");
                    myPrint("wscale: %f %f %f  wposition: %f %f %f wrotation: %f %f %f %f\n", 
                    transform.worldScales->getVec3(0).x,transform.worldScales->getVec3(0).y,transform.worldScales->getVec3(0).z, 
                    transform.worldPositions->getVec3(0).x, transform.worldPositions->getVec3(0).y,transform.worldPositions->getVec3(0).z,
                    transform.worldRotations->getQuat(0).x,transform.worldRotations->getQuat(0).y,transform.worldRotations->getQuat(0).z,transform.worldRotations->getQuat(0).w);

                    transform.advancePack();
                }       
            }
        }
    }

    void SceneManager::nodeMoved(Transform &inOutTransform, ui16 oldDepth, ui16 newDepth/* , TransformMemType type */)
    {
        if(oldDepth == newDepth)
        {
            return;
        }

        TransformMemType type = SMT_DYNAMIC;
        TransformMemManager *pNodeMemMgr = m_nodeMemMgrs[type];
        pNodeMemMgr->growToDepth( newDepth );

        Transform transform;
        pNodeMemMgr->nodeCreated(transform, newDepth);

        transform.copy(inOutTransform);
        pNodeMemMgr->nodeDestroyed(inOutTransform, oldDepth);

        inOutTransform = transform;
    }

CC_NAMESPACE_END