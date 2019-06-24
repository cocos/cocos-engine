/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
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

#include "RenderFlow.hpp"
#include "NodeMemPool.hpp"

RENDERER_BEGIN

const uint32_t InitLevelCount = 3;
const uint32_t InitLevelNodeCount = 100;

const uint32_t LocalMat_Use_Thread_Unit_Count = 5;
const uint32_t WorldMat_Use_Thread_Node_count = 500;

RenderFlow* RenderFlow::_instance = nullptr;

RenderFlow::RenderFlow(DeviceGraphics* device, Scene* scene, ForwardRenderer* forward)
: _device(device)
, _scene(scene)
, _forward(forward)
{
    _instance = this;
    
    _batcher = new ModelBatcher(this);

#if SUB_RENDER_THREAD_COUNT > 0
    _paralleTask = new ParallelTask();
    _paralleTask->init(SUB_RENDER_THREAD_COUNT);

    _runFlag = &_paralleTask->getRunFlag()[0];
    
    for (uint32_t i = 0; i < SUB_RENDER_THREAD_COUNT; i++)
    {
        _paralleTask->pushTask(i, [&](int tid){
            switch(_parallelStage)
            {
                case ParallelStage::LOCAL_MAT:
                    calculateLocalMatrix(tid);
                break;
                case ParallelStage::WORLD_MAT:
                    calculateLevelWorldMatrix(tid);
                break;
                default:
                break;
            }
        });
    }
#endif
    
    _levelInfoArr.resize(InitLevelCount);
    for (auto i = 0; i < InitLevelCount; i++)
    {
        _levelInfoArr[i].reserve(InitLevelNodeCount);
    }
}

RenderFlow::~RenderFlow()
{
    delete _paralleTask;
    CC_SAFE_DELETE(_batcher);
}

void RenderFlow::removeNodeLevel(std::size_t level, cocos2d::Mat4* worldMat)
{
    if (level >= _levelInfoArr.size()) return;
    auto& levelInfos = _levelInfoArr[level];
    for(auto it = levelInfos.begin(); it != levelInfos.end(); it++)
    {
        if (it->worldMat == worldMat)
        {
            levelInfos.erase(it);
            return;
        }
    }
}

void RenderFlow::insertNodeLevel(std::size_t level, const LevelInfo& levelInfo)
{
    if (level >= _levelInfoArr.size())
    {
        _levelInfoArr.resize(level + 1);
    }
    auto& levelInfos = _levelInfoArr[level];
    levelInfos.push_back(levelInfo);
}

void RenderFlow::calculateLocalMatrix(int tid)
{
    const uint16_t SPACE_FREE_FLAG = 0x0;
    cocos2d::Mat4 matTemp;
    
    NodeMemPool* instance = NodeMemPool::getInstance();
    CCASSERT(instance, "RenderFlow calculateLocalMatrix NodeMemPool is null");
    auto& commonList = instance->getCommonList();
    auto& nodePool = instance->getNodePool();

    UnitCommon* commonUnit = nullptr;
    uint16_t usingNum = 0;
    std::size_t contentNum = 0;
    Sign* signData = nullptr;
    UnitNode* nodeUnit = nullptr;
    uint32_t* dirty = nullptr;
    cocos2d::Mat4* localMat = nullptr;
    TRS* trs = nullptr;
    uint8_t* is3D = nullptr;
    cocos2d::Quaternion* quat = nullptr;
    float trsZ = 0.0f, trsSZ = 0.0f;

    std::size_t begin = 0, end = commonList.size();
    std::size_t fieldSize = end / RENDER_THREAD_COUNT;
    if (tid >= 0)
    {
        begin = tid * fieldSize;
        if (tid < RENDER_THREAD_COUNT - 1)
        {
            end = (tid + 1) * fieldSize;
        }
    }

    for(auto i = begin; i < end; i++)
    {
        commonUnit = commonList[i];
        if (!commonUnit) continue;
        usingNum = commonUnit->getUsingNum();
        if (usingNum == 0) continue;
        
        contentNum = commonUnit->getContentNum();
        signData = commonUnit->getSignData(0);
        
        nodeUnit = nodePool[commonUnit->unitID];
        
        dirty = nodeUnit->getDirty(0);
        localMat = nodeUnit->getLocalMat(0);
        trs = nodeUnit->getTRS(0);
        is3D = nodeUnit->getIs3D(0);
        
        for (auto j = 0; j < contentNum; j++, localMat ++, trs ++, is3D ++, signData++, dirty++)
        {
            if (signData->freeFlag == SPACE_FREE_FLAG) continue;
            // reset world transform changed flag
            *dirty &= ~WORLD_TRANSFORM_CHANGED;
            if (!(*dirty & LOCAL_TRANSFORM)) continue;
            
            localMat->setIdentity();
            trsZ = *is3D ? trs->z : 0;
            localMat->translate(trs->x, trs->y, trsZ);
            
            quat = (cocos2d::Quaternion*)&(trs->qx);
            cocos2d::Mat4::createRotation(*quat, &matTemp);
            cocos2d::Mat4::multiply(*localMat, matTemp, localMat);
            
            trsSZ = *is3D ? trs->sz : 1;
            cocos2d::Mat4::createScale(trs->sx, trs->sy, trsSZ, &matTemp);
            cocos2d::Mat4::multiply(*localMat, matTemp, localMat);
            
            *dirty &= ~LOCAL_TRANSFORM;
            *dirty |= WORLD_TRANSFORM;
        }
    }
}

void RenderFlow::calculateLevelWorldMatrix(int tid)
{
    auto& levelInfos = _levelInfoArr[_curLevel];

    std::size_t begin = 0, end = levelInfos.size();
    std::size_t fieldSize = end / RENDER_THREAD_COUNT;
    if (tid >= 0)
    {
        begin = tid * fieldSize;
        if (tid < RENDER_THREAD_COUNT - 1)
        {
            end = (tid + 1) * fieldSize;
        }
    }

    for(std::size_t index = begin; index < end; index++)
    {
        auto& info = levelInfos[index];
        auto selfDirty = *info.dirty & WORLD_TRANSFORM;
        if (info.parentDirty != nullptr && ((*info.parentDirty & WORLD_TRANSFORM_CHANGED) || selfDirty))
        {
            info.worldMat->multiply(*info.parentWorldMat, *info.localMat, info.worldMat);
            *info.dirty |= WORLD_TRANSFORM_CHANGED;
            *info.dirty &= ~WORLD_TRANSFORM;
        }
        else if (selfDirty)
        {
            *info.worldMat = *info.localMat;
            *info.dirty |= WORLD_TRANSFORM_CHANGED;
            *info.dirty &= ~WORLD_TRANSFORM;
        }
    }
}

void RenderFlow::calculateWorldMatrix()
{
    for(std::size_t level = 0, n = _levelInfoArr.size(); level < n; level++)
    {
        auto& levelInfos = _levelInfoArr[level];
        for(std::size_t index = 0, count = levelInfos.size(); index < count; index++)
        {
            auto& info = levelInfos[index];
            auto selfDirty = *info.dirty & WORLD_TRANSFORM;
            if (info.parentDirty != nullptr && ((*info.parentDirty & WORLD_TRANSFORM_CHANGED) || selfDirty))
            {
                info.worldMat->multiply(*info.parentWorldMat, *info.localMat, info.worldMat);
                *info.dirty |= WORLD_TRANSFORM_CHANGED;
                *info.dirty &= ~WORLD_TRANSFORM;
            }
            else if (selfDirty)
            {
                *info.worldMat = *info.localMat;
                *info.dirty |= WORLD_TRANSFORM_CHANGED;
                *info.dirty &= ~WORLD_TRANSFORM;
            }
        }
    }
}

void RenderFlow::render(NodeProxy* scene)
{
    if (scene != nullptr)
    {
        
//#if SUB_RENDER_THREAD_COUNT > 0
//
//        int mainThreadTid = RENDER_THREAD_COUNT - 1;
//        bool threadBegan = false;
//
//        NodeMemPool* instance = NodeMemPool::getInstance();
//        auto& commonList = instance->getCommonList();
//        if (commonList.size() < LocalMat_Use_Thread_Unit_Count)
//        {
//            calculateLocalMatrix();
//        }
//        else
//        {
//            _parallelStage = ParallelStage::LOCAL_MAT;
//            _paralleTask->begin();
//            threadBegan = true;
//
//            calculateLocalMatrix(mainThreadTid);
//            while(*_runFlag != ParallelTask::RunFlag::ProcessFinished) std::this_thread::yield();
//        }
//
//        _parallelStage = ParallelStage::WORLD_MAT;
//        _curLevel = 0;
//        for(auto count = _levelInfoArr.size(); _curLevel < count; _curLevel++)
//        {
//            auto& levelInfos = _levelInfoArr[_curLevel];
//            if (levelInfos.size() < WorldMat_Use_Thread_Node_count)
//            {
//                calculateLevelWorldMatrix();
//            }
//            else
//            {
//                if (!threadBegan) _paralleTask->begin();
//                *_runFlag = ParallelTask::RunFlag::ToProcess;
//                calculateLevelWorldMatrix(mainThreadTid);
//                while(*_runFlag != ParallelTask::RunFlag::ProcessFinished) std::this_thread::yield();
//            }
//        }
//
//        if (threadBegan) _paralleTask->stop();
//#else
//        calculateLocalMatrix();
//        calculateWorldMatrix();
//#endif
        
        _batcher->startBatch();
        scene->visitAsRoot(_batcher, _scene);
        _batcher->terminateBatch();

        _forward->render(_scene);
    }
}

void RenderFlow::visit(NodeProxy* rootNode)
{
    rootNode->visit(_batcher, _scene);
}

RENDERER_END
