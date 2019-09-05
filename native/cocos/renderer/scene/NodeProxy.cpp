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

#include "NodeProxy.hpp"

#include <string>

#include "ModelBatcher.hpp"
#include "../renderer/Scene.h"
#include "base/ccMacros.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_renderer_auto.hpp"
#include "NodeMemPool.hpp"
#include <math.h>
#include "RenderFlow.hpp"
#include "assembler/AssemblerSprite.hpp"

RENDERER_BEGIN

NodeProxy::NodeProxy(std::size_t unitID, std::size_t index, const std::string& id, const std::string& name)
{
    _id = id;
    _unitID = unitID;
    _index = index;
    _name = name;
    
    NodeMemPool* pool = NodeMemPool::getInstance();
    CCASSERT(pool, "NodeProxy constructor NodeMemPool is null");
    UnitNode* unit = pool->getUnit(unitID);
    CCASSERT(unit, "NodeProxy constructor unit is null");

    UnitCommon* common = pool->getCommonUnit(unitID);
    _signData = common->getSignData(_index);
    
    _dirty = unit->getDirty(index);
    *_dirty &= ~RenderFlow::PRE_CALCULATE_VERTICES;
    
    _trs = unit->getTRS(index);
    _localMat = unit->getLocalMat(index);
    _worldMat = unit->getWorldMat(index);
    _parentInfo = unit->getParent(index);
    _parentInfo->unitID  = PARENT_INVALID;
    _parentInfo->index = PARENT_INVALID;
    _localZOrder = unit->getZOrder(index);
    _cullingMask = unit->getCullingMask(index);
    _opacity = unit->getOpacity(index);
    _is3DNode = unit->getIs3D(index);
    
    uint64_t* self = unit->getNode(index);
    *self = (uint64_t)this;
}

NodeProxy::~NodeProxy()
{
    for (auto& child : _children)
    {
        child->_parent = nullptr;
    }
}

void NodeProxy::destroyImmediately()
{
    if (_parent)
    {
        _parent->removeChild(this);
    }
    RenderFlow::getInstance()->removeNodeLevel(_level, _worldMat);
    CC_SAFE_RELEASE_NULL(_assembler);
    _level = NODE_LEVEL_INVALID;
    _dirty = nullptr;
    _trs = nullptr;
    _localMat = nullptr;
    _worldMat = nullptr;
    _parentInfo = nullptr;
    _localZOrder = nullptr;
    _cullingMask = nullptr;
    _opacity = nullptr;
    _is3DNode = nullptr;
}

// lazy allocs
void NodeProxy::childrenAlloc()
{
    _children.reserve(4);
}

void NodeProxy::addChild(NodeProxy* child)
{
    if (child == nullptr)
    {
        CCLOGWARN("Argument must be non-nil");
        return;
    }
    if (child->_parent != nullptr)
    {
        CCLOGWARN("child already added. It can't be added again");
        return;
    }
    auto assertNotSelfChild
        ( [ this, child ]() -> bool
          {
              for ( NodeProxy* parent( this ); parent != nullptr;
                    parent = parent->getParent() )
                  if ( parent == child )
                      return false;
              
              return true;
          } );
    (void)assertNotSelfChild;
    
    if (!assertNotSelfChild())
    {
        CCLOGWARN("A node cannot be the child of his own children" );
        return;
    }
    
    if (_children.empty())
    {
        this->childrenAlloc();
    }
    _children.pushBack(child);
    child->setParent(this);
}

void NodeProxy::detachChild(NodeProxy *child, ssize_t childIndex)
{
    // set parent nil at the end
    child->setParent(nullptr);
    _children.erase(childIndex);
}

void NodeProxy::removeChild(NodeProxy* child)
{
    // explicit nil handling
    if (_children.empty())
    {
        return;
    }

    ssize_t index = _children.getIndex(child);
    if( index != CC_INVALID_INDEX )
        this->detachChild( child, index );
}

void NodeProxy::removeAllChildren()
{
    // not using detachChild improves speed here
    for (const auto& child : _children)
    {
        // set parent nil at the end
        child->setParent(nullptr);
    }
    
    _children.clear();
}

NodeProxy* NodeProxy::getChildByName(std::string childName)
{
    for (auto child : _children)
    {
        if (child->_name == childName)
        {
            return child;
        }
    }
    return nullptr;
}

NodeProxy* NodeProxy::getChildByID(std::string id)
{
    for (auto child : _children)
    {
        if (child->_id == id)
        {
            return child;
        }
    }
    return nullptr;
}

void NodeProxy::notifyUpdateParent()
{
    if (_parentInfo->index == PARENT_INVALID)
    {
        if (_parent)
        {
            _parent->removeChild(this);
        }
        updateLevel();
        return;
    }
    
    NodeMemPool* pool = NodeMemPool::getInstance();
    CCASSERT(pool, "NodeProxy updateParent NodeMemPool is null");
    UnitNode* unit = pool->getUnit(_parentInfo->unitID);
    CCASSERT(unit, "NodeProxy updateParent unit is null");
    uint64_t* parentAddrs = unit->getNode(_parentInfo->index);
    NodeProxy* parent = (NodeProxy*)*parentAddrs;
    CCASSERT(parent, "NodeProxy updateParent parent is null");
    
    if (parent != _parent) {
        if (_parent)
        {
            _parent->removeChild(this);
        }
        parent->addChild(this);
        updateLevel();
    }
}

void NodeProxy::updateLevel()
{
    static RenderFlow::LevelInfo levelInfo;
    auto renderFlow = RenderFlow::getInstance();

    renderFlow->removeNodeLevel(_level, _worldMat);
    
    levelInfo.dirty = _dirty;
    levelInfo.localMat = _localMat;
    levelInfo.worldMat = _worldMat;
    levelInfo.opacity = _opacity;
    levelInfo.realOpacity = &_realOpacity;
    
    if (_parent)
    {
        _level = _parent->_level + 1;
        levelInfo.parentWorldMat = _parent->_worldMat;
        levelInfo.parentDirty = _parent->_dirty;
        levelInfo.parentRealOpacity = &_parent->_realOpacity;
    }
    else
    {
        _level = 0;
        levelInfo.parentWorldMat = nullptr;
        levelInfo.parentDirty = nullptr;
        levelInfo.parentRealOpacity = nullptr;
    }
    renderFlow->insertNodeLevel(_level, levelInfo);
    
    for (auto it = _children.begin(); it != _children.end(); it++)
    {
        (*it)->updateLevel();
    }
}

void NodeProxy::setLocalZOrder(int zOrder)
{
    *_localZOrder = zOrder;
    if (_parent != nullptr)
    {
        *_parent->_dirty |= RenderFlow::REORDER_CHILDREN;
    }
}

void NodeProxy::reorderChildren()
{
    if (*_dirty & RenderFlow::REORDER_CHILDREN)
    {
#if CC_64BITS
        std::sort(std::begin(_children), std::end(_children), [](NodeProxy* n1, NodeProxy* n2) {
            return (*n1->_localZOrder < *n2->_localZOrder);
        });
#else
        std::stable_sort(std::begin(_children), std::end(_children), [](NodeProxy* n1, NodeProxy* n2) {
            return *n1->_localZOrder < *n2->_localZOrder;
        });
#endif
        *_dirty &= ~RenderFlow::REORDER_CHILDREN;
    }
}

void NodeProxy::setAssembler(AssemblerBase* assembler)
{
    if (assembler == _assembler) return;
    CC_SAFE_RELEASE(_assembler);
    _assembler = assembler;
    CC_SAFE_RETAIN(_assembler);
    
    auto assemblerSprite = dynamic_cast<AssemblerSprite*>(_assembler);
    if (assemblerSprite)
    {
        *_dirty |= RenderFlow::PRE_CALCULATE_VERTICES;
    }
    else
    {
        *_dirty &= ~RenderFlow::PRE_CALCULATE_VERTICES;
    }
}

void NodeProxy::clearAssembler()
{
    CC_SAFE_RELEASE_NULL(_assembler);
    *_dirty &= ~RenderFlow::PRE_CALCULATE_VERTICES;
}

AssemblerBase* NodeProxy::getAssembler() const
{
    return _assembler;
}

void NodeProxy::getPosition(cocos2d::Vec3* out) const
{
    out->x = _trs->x;
    out->y = _trs->y;
    out->z = _trs->z;
}

void NodeProxy::getRotation(cocos2d::Quaternion* out) const
{
    out->x = _trs->qx;
    out->y = _trs->qy;
    out->z = _trs->qz;
    out->w = _trs->qw;
}

void NodeProxy::getScale(cocos2d::Vec3* out) const
{
    out->x = _trs->sx;
    out->y = _trs->sy;
    out->z = _trs->sz;
}

void NodeProxy::getWorldPosition(cocos2d::Vec3* out) const
{
    getPosition(out);
    
    cocos2d::Vec3 pos;
    cocos2d::Quaternion rot;
    cocos2d::Vec3 scale;
    NodeProxy* curr = _parent;
    while (curr != nullptr)
    {
        curr->getPosition(&pos);
        curr->getRotation(&rot);
        curr->getScale(&scale);
        
        out->multiply(scale);
        out->transformQuat(rot);
        out->add(pos);
        curr = curr->getParent();
    }
}

void NodeProxy::getWorldRT(cocos2d::Mat4* out) const
{
    cocos2d::Vec3 opos(_trs->x, _trs->y, _trs->z);
    cocos2d::Quaternion orot(_trs->qx, _trs->qy, _trs->qz, _trs->qw);
    
    cocos2d::Vec3 pos;
    cocos2d::Quaternion rot;
    cocos2d::Vec3 scale;
    NodeProxy* curr = _parent;
    while (curr != nullptr)
    {
        curr->getPosition(&pos);
        curr->getRotation(&rot);
        curr->getScale(&scale);
        
        opos.multiply(scale);
        opos.transformQuat(rot);
        opos.add(pos);
        orot.multiply(rot);
        curr = curr->getParent();
    }
    out->setIdentity();
    out->translate(opos);
    cocos2d::Mat4 quatMat;
    cocos2d::Mat4::createRotation(orot, &quatMat);
    out->multiply(quatMat);
}

void NodeProxy::setOpacity(uint8_t opacity)
{
    if (*_opacity != opacity)
    {
        *_opacity = opacity;
        *_dirty |= RenderFlow::OPACITY;
    }
}

void NodeProxy::updateRealOpacity()
{
    bool selfOpacityDirty = *_dirty & RenderFlow::OPACITY;
    if (_parent)
    {
        if (selfOpacityDirty || *_parent->_dirty & RenderFlow::NODE_OPACITY_CHANGED)
        {
            _realOpacity = *_opacity * _parent->getRealOpacity() / 255.0f;
            *_dirty &= ~RenderFlow::OPACITY;
            *_dirty |= RenderFlow::NODE_OPACITY_CHANGED;
        }
    }
    else
    {
        if (selfOpacityDirty)
        {
            _realOpacity = *_opacity;
            *_dirty &= ~RenderFlow::OPACITY;
            *_dirty |= RenderFlow::NODE_OPACITY_CHANGED;
        }
    }
}

void NodeProxy::updateWorldMatrix()
{
    if (!_updateWorldMatrix) return;
    
    bool selfWorldDirty = *_dirty & RenderFlow::WORLD_TRANSFORM;
    if (_parent)
    {
        if (selfWorldDirty || *_parent->_dirty & RenderFlow::WORLD_TRANSFORM_CHANGED)
        {
            updateWorldMatrix(_parent->getWorldMatrix());
        }
    }
    else if (selfWorldDirty)
    {
        *_worldMat = *_localMat;
        *_dirty &= ~RenderFlow::WORLD_TRANSFORM;
        *_dirty |= RenderFlow::WORLD_TRANSFORM_CHANGED;
    }
}

void NodeProxy::updateWorldMatrix(const cocos2d::Mat4& parentMatrix)
{
    _worldMat->multiply(parentMatrix, *_localMat, _worldMat);
    *_dirty &= ~RenderFlow::WORLD_TRANSFORM;
    *_dirty |= RenderFlow::WORLD_TRANSFORM_CHANGED;
}

void NodeProxy::updateLocalMatrix()
{
    if (*_dirty & RenderFlow::LOCAL_TRANSFORM)
    {
        _localMat->setIdentity();

        // Transform = Translate * Rotation * Scale;
        cocos2d::Quaternion q(_trs->qx, _trs->qy, _trs->qz, _trs->qw);
        if (*_is3DNode)
        {
            _localMat->translate(_trs->x, _trs->y, _trs->z);
            _localMat->rotate(q);
            _localMat->scale(_trs->sx, _trs->sy, _trs->sz);
        }
        else
        {
            _localMat->translate(_trs->x, _trs->y, 0);
            _localMat->rotate(q);
            _localMat->scale(_trs->sx, _trs->sy, 1);
        }

        *_dirty &= ~RenderFlow::LOCAL_TRANSFORM;
        *_dirty |= RenderFlow::WORLD_TRANSFORM;
    }
}

void NodeProxy::render(ModelBatcher* batcher, Scene* scene)
{
    if (!_needVisit || _realOpacity == 0) return;

    bool needRender = *_dirty & RenderFlow::RENDER;
    if (_needRender != needRender)
    {
        if (_assembler) _assembler->enableDirty(AssemblerBase::VERTICES_OPACITY_CHANGED);
        _needRender = needRender;
    }
    
    // pre render
    if (_assembler && needRender) _assembler->handle(this, batcher, scene);

    reorderChildren();
    for (const auto& child : _children)
    {
        child->render(batcher, scene);
    }

    // post render
    bool needPostRender = *_dirty & RenderFlow::POST_RENDER;
    if (_assembler && needPostRender) _assembler->postHandle(this, batcher, scene);
}

void NodeProxy::visit(ModelBatcher* batcher, Scene* scene)
{
    if (!_needVisit) return;

    updateRealOpacity();

    if (_realOpacity == 0)
    {
        return;
    }
    
    updateLocalMatrix();
    updateWorldMatrix();
    
    bool needRender = *_dirty & RenderFlow::RENDER;
    if (_needRender != needRender)
    {
        if (_assembler) _assembler->enableDirty(AssemblerBase::VERTICES_OPACITY_CHANGED);
        _needRender = needRender;
    }
    
    // pre render
    if (_assembler && needRender) _assembler->handle(this, batcher, scene);
    
    reorderChildren();
    for (const auto& child : _children)
    {
        child->visit(batcher, scene);
    }
    
    // post render
    bool needPostRender = *_dirty & RenderFlow::POST_RENDER;
    if (_assembler && needPostRender) _assembler->postHandle(this, batcher, scene);
}

RENDERER_END
