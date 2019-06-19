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

RenderFlow* RenderFlow::_instance = nullptr;

RenderFlow::RenderFlow(DeviceGraphics* device, Scene* scene, ForwardRenderer* forward)
: _device(device)
, _scene(scene)
, _forward(forward)
{
    _instance = this;
    
    _batcher = new ModelBatcher(this);
    
    _levelInfoArr.resize(InitLevelCount);
    for (auto i = 0; i < InitLevelCount; i++)
    {
        _levelInfoArr[i].reserve(InitLevelNodeCount);
    }
}

RenderFlow::~RenderFlow()
{
    CC_SAFE_DELETE(_batcher);
}

void RenderFlow::removeNodeLevel(uint32_t level, cocos2d::Mat4* worldMat)
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

void RenderFlow::insertNodeLevel(uint32_t level, const LevelInfo& levelInfo)
{
    if (level >= _levelInfoArr.size())
    {
        _levelInfoArr.resize(level + 1);
    }
    auto& levelInfos = _levelInfoArr[level];
    levelInfos.push_back(levelInfo);
}

void RenderFlow::calculateLocalMatrix()
{
    const uint16_t SPACE_FREE_FLAG = 0x0;
    static cocos2d::Mat4 matTemp;
    
    NodeMemPool* instance = NodeMemPool::getInstance();
    CCASSERT(instance, "RenderFlow calculateLocalMatrix NodeMemPool is null");
    auto& commonPool = instance->getCommonPool();
    auto& nodePool = instance->getNodePool();
    for(auto i = 0; i < commonPool.size(); i++)
    {
        UnitCommon* commonUnit = commonPool[i];
        uint16_t usingNum = commonUnit->getUsingNum();
        if (usingNum == 0) continue;
        
        std::size_t contentNum = commonUnit->getContentNum();
        Sign* signData = commonUnit->getSignData(0);
        
        UnitNode* nodeUnit = nodePool[i];
        uint32_t* dirty = nodeUnit->getDirty(0);
        cocos2d::Mat4* localMat = nodeUnit->getLocalMat(0);
        TRS* trs = nodeUnit->getTRS(0);
        uint8_t* is3D = nodeUnit->getIs3D(0);
        cocos2d::Quaternion* quat = nullptr;
        float trsZ = 0.0f, trsSZ = 0.0f;
        
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

void RenderFlow::calculateWorldMatrix()
{
    for(std::size_t level = 0, n = _levelInfoArr.size(); level < n; level++)
    {
        auto& levelInfos = _levelInfoArr[level];
        for(auto it = levelInfos.begin(); it != levelInfos.end(); it++)
        {
            auto selfDirty = *it->dirty & WORLD_TRANSFORM;
            if (it->parentDirty != nullptr && ((*it->parentDirty & WORLD_TRANSFORM_CHANGED) || selfDirty))
            {
                it->worldMat->multiply(*it->parentWorldMat, *it->localMat, it->worldMat);
                *it->dirty |= WORLD_TRANSFORM_CHANGED;
            }
            else if (selfDirty)
            {
                *it->worldMat = *it->localMat;
                *it->dirty |= WORLD_TRANSFORM_CHANGED;
            }
            *it->dirty &= ~WORLD_TRANSFORM;
        }
    }
}

void RenderFlow::render(NodeProxy* scene)
{
    if (scene != nullptr)
    {
        calculateLocalMatrix();
        calculateWorldMatrix();
        
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
