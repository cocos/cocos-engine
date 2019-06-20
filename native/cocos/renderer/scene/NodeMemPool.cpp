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

#include "NodeMemPool.hpp"
#include "base/ccMacros.h"

RENDERER_BEGIN

UnitNode::UnitNode()
{
    
}

UnitNode::~UnitNode()
{
    unset(&dirty, (uint8_t**)&dirtyData, &dirtyLen);
    unset(&trs, (uint8_t**)&trsData, &trsLen);
    unset(&localMat, (uint8_t**)&localMatData, &localMatLen);
    unset(&worldMat, (uint8_t**)&worldMatData, &worldMatLen);
    unset(&parent, (uint8_t**)&parentData, &parentLen);
    unset(&zOrder, (uint8_t**)&zOrderData, &zOrderLen);
    unset(&cullingMask, (uint8_t**)&cullingMaskData, &cullingMaskLen);
    unset(&opacity, (uint8_t**)&opacityData, &opacityLen);
    unset(&is3D, (uint8_t**)&is3DData, &is3DLen);
    unset(&node, (uint8_t**)&nodeData, &nodeLen);
}

void UnitNode::setDirty(se::Object* jsData)
{
    set(&dirty, (uint8_t**)&dirtyData, &dirtyLen, jsData);
}

void UnitNode::setTRS(se::Object* jsData)
{
    set(&trs, (uint8_t**)&trsData, &trsLen, jsData);
}

void UnitNode::setLocalMat(se::Object* jsData)
{
    set(&localMat, (uint8_t**)&localMatData, &localMatLen, jsData);
}

void UnitNode::setWorldMat(se::Object* jsData)
{
    set(&worldMat, (uint8_t**)&worldMatData, &worldMatLen, jsData);
}

void UnitNode::setParent(se::Object* jsData)
{
    set(&parent, (uint8_t**)&parentData, &parentLen, jsData);
}

void UnitNode::setZOrder(se::Object* jsData)
{
    set(&zOrder, (uint8_t**)&zOrderData, &zOrderLen, jsData);
}

void UnitNode::setCullingMask(se::Object* jsData)
{
    set(&cullingMask, (uint8_t**)&cullingMaskData, &cullingMaskLen, jsData);
}

void UnitNode::setOpacity(se::Object* jsData)
{
    set(&opacity, (uint8_t**)&opacityData, &opacityLen, jsData);
}

void UnitNode::setIs3D(se::Object* jsData)
{
    set(&is3D, (uint8_t**)&is3DData, &is3DLen, jsData);
}

void UnitNode::setNode(se::Object *jsData)
{
    set(&node, (uint8_t**)&nodeData, &nodeLen, jsData);
}

NodeMemPool* NodeMemPool::_instance = nullptr;

const std::vector<UnitNode*>& NodeMemPool::getNodePool() const
{
    return _nodePool;
}

UnitNode& NodeMemPool::getUnit(std::size_t unitID) const
{
    CCASSERT(unitID < _nodePool.size(), "NodeMemPool getUnit unitID can not be rather than pool size");
    return *_nodePool[unitID];
}

void NodeMemPool::updateNodeData(std::size_t unitID, se_object_ptr dirty, se_object_ptr trs, se_object_ptr localMat, se_object_ptr worldMat, se_object_ptr parent, se_object_ptr zOrder, se_object_ptr cullingMask, se_object_ptr opacity, se_object_ptr is3D, se_object_ptr node)
{
    // UnitID may equal to node pool size, then node pool must increase size.
    CCASSERT(unitID <= _nodePool.size(), "NodeMemPool updateNodeData unitID can not be rather than pool size");
    
    UnitNode* unit = nullptr;
    if (unitID == _nodePool.size())
    {
        unit = new UnitNode;
        _nodePool.push_back(unit);
    }
    else if (unitID < _nodePool.size())
    {
        unit = _nodePool[unitID];
    }
    else
    {
        return;
    }
    
    unit->setDirty(dirty);
    unit->setTRS(trs);
    unit->setLocalMat(localMat);
    unit->setWorldMat(worldMat);
    unit->setParent(parent);
    unit->setZOrder(zOrder);
    unit->setCullingMask(cullingMask);
    unit->setOpacity(opacity);
    unit->setIs3D(is3D);
    unit->setNode(node);
}

RENDERER_END
