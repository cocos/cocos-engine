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
#include <math.h>

RENDERER_BEGIN

int NodeProxy::_parentOpacityDirty = 0;
int NodeProxy::_worldMatDirty = 0;

NodeProxy::NodeProxy()
: _jsTRS(nullptr)
, _jsTRSData(nullptr)
, _parent(nullptr)
{
    _localMat = Mat4::IDENTITY;
    _worldMat = Mat4::IDENTITY;
}

NodeProxy::~NodeProxy()
{
    CCLOGINFO( "deallocing NodeProxy: %p", this );

    for (auto& child : _children)
    {
        child->_parent = nullptr;
    }
    
    if (_jsTRS != nullptr)
    {
        _jsTRS->unroot();
        _jsTRS->decRef();
        _jsTRS = nullptr;
    }
    _jsTRSData = nullptr;
}

void NodeProxy::reset()
{
    if (_parent)
    {
        _parent->removeChild(this);
    }
    removeAllChildren();
    _localZOrder = 0;
    _childrenOrderDirty = false;
    _cullingMask = -1;
    _localMat.setIdentity();
    _worldMat.setIdentity();
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
              for ( NodeProxy* parent( getParent() ); parent != nullptr;
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
    _childrenOrderDirty = true;
    child->setParent(this);
    child->updateRealOpacity();
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

void NodeProxy::setLocalZOrder(int zOrder)
{
    _localZOrder = zOrder;
    if (_parent != nullptr)
    {
        _parent->setChildrenOrderDirty();
    }
}

void NodeProxy::reorderChildren()
{
    if (_childrenOrderDirty)
    {
#if CC_64BITS
        std::sort(std::begin(_children), std::end(_children), [](NodeProxy* n1, NodeProxy* n2) {
            return (n1->_localZOrder < n2->_localZOrder);
        });
#else
        std::stable_sort(std::begin(_children), std::end(_children), [](NodeProxy* n1, NodeProxy* n2) {
            return n1->_localZOrder < n2->_localZOrder;
        });
#endif
        _childrenOrderDirty = false;
    }
}

void NodeProxy::addHandle(const std::string& sysid, SystemHandle* handle)
{
    _handles[sysid] = handle;
}

void NodeProxy::removeHandle(const std::string& sysid)
{
    _handles.erase(sysid);
}

SystemHandle* NodeProxy::getHandle(const std::string& sysid)
{
    auto it = _handles.find(sysid);
    if (it != _handles.end())
    {
        return it->second;
    }
    return nullptr;
}

void NodeProxy::updateJSTRS(se::Object* trs)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;
    
    if (_jsTRS != nullptr)
    {
        _jsTRS->unroot();
        _jsTRS->decRef();
    }
    
    trs->root();
    trs->incRef();
    _jsTRS = trs;
    _jsTRSData = nullptr;
    size_t length;
    trs->getTypedArrayData((uint8_t**)(&_jsTRSData), &length);
}

void NodeProxy::getPosition(cocos2d::Vec3* out) const
{
    out->x = _jsTRSData[1];
    out->y = _jsTRSData[2];
    out->z = _jsTRSData[3];
}

void NodeProxy::getRotation(cocos2d::Quaternion* out) const
{
    out->x = _jsTRSData[4];
    out->y = _jsTRSData[5];
    out->z = _jsTRSData[6];
    out->w = _jsTRSData[7];
}

void NodeProxy::getScale(cocos2d::Vec3* out) const
{
    out->x = _jsTRSData[8];
    out->y = _jsTRSData[9];
    out->z = _jsTRSData[10];
}

void NodeProxy::getWorldPosition(cocos2d::Vec3* out) const
{
    if (_jsTRSData != nullptr)
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
}

void NodeProxy::getWorldRT(cocos2d::Mat4* out) const
{
    if (_jsTRSData != nullptr)
    {
        cocos2d::Vec3 opos(_jsTRSData[1], _jsTRSData[2], _jsTRSData[3]);
        cocos2d::Quaternion orot(_jsTRSData[4], _jsTRSData[5], _jsTRSData[6], _jsTRSData[7]);
        
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
}

void NodeProxy::setOpacity(uint8_t opacity)
{
    if (_opacity != opacity)
    {
        _opacity = opacity;
        updateRealOpacity();
    }
}

void NodeProxy::updateRealOpacity()
{
    float parentOpacity = _parent ? _parent->getRealOpacity() / 255.0f : 1.0f;
    float opacity = (uint8_t)(_opacity * parentOpacity);
    _realOpacity = opacity;
    _opacityUpdated = true;
    
    auto handle = getHandle("render");
    if (handle)
    {
        handle->notifyDirty(SystemHandle::OPACITY);
    }
}

void NodeProxy::updateMatrix()
{
    if (_matrixUpdated || _worldMatDirty > 0)
    {
        // Update world matrix
        const cocos2d::Mat4& parentMat = _parent == nullptr ? cocos2d::Mat4::IDENTITY : _parent->getWorldMatrix();
        _worldMat.multiply(parentMat, _localMat, &_worldMat);
        _matrixUpdated = false;
    }
}

void NodeProxy::updateFromJS()
{
    uint32_t flag = _jsTRSData[0];
    if (flag & _TRANSFORM)
    {
        _localMat.setIdentity();

        // Transform = Translate * Rotation * Scale;
        cocos2d::Quaternion q(_jsTRSData[4], _jsTRSData[5], _jsTRSData[6], _jsTRSData[7]);
        if (_is3DNode)
        {
            _localMat.translate(_jsTRSData[1], _jsTRSData[2], _jsTRSData[3]);
            _localMat.rotate(q);
            _localMat.scale(_jsTRSData[8], _jsTRSData[9], _jsTRSData[10]);
        }
        else
        {
            _localMat.translate(_jsTRSData[1], _jsTRSData[2], 0);
            _localMat.rotate(q);
            _localMat.scale(_jsTRSData[8], _jsTRSData[9], 1);
        }

        _jsTRSData[0] = 0;

        _matrixUpdated = true;
    }
}

void NodeProxy::visitAsRoot(ModelBatcher* batcher, Scene* scene)
{
    _worldMatDirty = 0;
    _parentOpacityDirty = 0;
    visit(batcher, scene);
}

void NodeProxy::visit(ModelBatcher* batcher, Scene* scene)
{
    bool worldMatUpdated = false;
    bool parentOpacityUpdated = false;

    if (_parent != nullptr && _parentOpacityDirty > 0)
    {
        updateRealOpacity();
    }
    
    if (_realOpacity == 0)
    {
        return;
    }
    
    reorderChildren();
    updateFromJS();
    
    if (_matrixUpdated)
    {
        _worldMatDirty++;
        worldMatUpdated = true;
    }
    updateMatrix();
    
    for (const auto& handler : _handles)
    {
        handler.second->handle(this, batcher, scene);
    }
    
    if (_opacityUpdated)
    {
        _parentOpacityDirty++;
        _opacityUpdated = false;
        parentOpacityUpdated = true;
    }
    
    for (const auto& child : _children)
    {
        child->visit(batcher, scene);
    }
    
    for (const auto& handler : _handles)
    {
        handler.second->postHandle(this, batcher, scene);
    }
    
    if (worldMatUpdated)
    {
        _worldMatDirty--;
    }
    if (parentOpacityUpdated)
    {
        _parentOpacityDirty--;
    }
}

RENDERER_END
