/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
#include "dragonbones-creator-support/CCArmatureDisplay.h"
#include "dragonbones-creator-support/CCSlot.h"
#include "MiddlewareMacro.h"

USING_NS_CC;
USING_NS_MW;

DRAGONBONES_NAMESPACE_BEGIN

CCArmatureDisplay* CCArmatureDisplay::create()
{
    CCArmatureDisplay* displayContainer = new (std::nothrow) CCArmatureDisplay();
    if (displayContainer)
    {
        displayContainer->autorelease();
    }
    else
    {
        CC_SAFE_DELETE(displayContainer);
    }
    return displayContainer;
}

CCArmatureDisplay::CCArmatureDisplay()
{
    _materialBuffer = new IOTypedArray(se::Object::TypedArrayType::UINT32, MAX_MATERIAL_BUFFER_SIZE);
}

CCArmatureDisplay::~CCArmatureDisplay()
{
    dispose();
    if (_materialBuffer)
    {
        delete _materialBuffer;
        _materialBuffer = nullptr;
    }

    if (_debugBuffer)
    {
        delete _debugBuffer;
        _debugBuffer = nullptr;
    }
}

void CCArmatureDisplay::dbInit(Armature* armature)
{
    _armature = armature;
}

void CCArmatureDisplay::dbClear()
{
    _armature = nullptr;
    release();
}

void CCArmatureDisplay::dispose(bool disposeProxy)
{
    if (_armature != nullptr) 
    {
        _armature->dispose();
        _armature = nullptr;
    }
}

void CCArmatureDisplay::dbUpdate()
{
    if (this->_armature->getParent())
        return;
    
    auto mgr = MiddlewareManager::getInstance();
    if (!mgr->isUpdating) return;
    
    IOBuffer& vb = mgr->getVB(VF_XYUVC);
    IOBuffer& ib = mgr->getIB();
    
    _materialBuffer->reset();
    
    _preBlendSrc = -1;
    _preBlendDst = -1;
    _preTextureIndex = -1;
    _curBlendSrc = -1;
    _curBlendDst = -1;
    _curTextureIndex = -1;
    
    _preISegWritePos = -1;
    _curISegLen = 0;
    
    _debugSlotsLen = 0;
    _materialLen = 0;
    
    // Reserved space to save material len
    _materialBuffer->writeUint32(0);
    // Reserved space to save index offset
    _materialBuffer->writeUint32((uint32_t)ib.getCurPos()/sizeof(unsigned short));
    
    // Traverse all aramture to fill vertex and index buffer.
    traverseArmature(_armature);
    
    bool isVBOutRange = vb.isOutRange();
    bool isIBOutRange = ib.isOutRange();
    bool isMatOutRange = _materialBuffer->isOutRange();
    
    // If vertex buffer or index buffer or material buffer out of range,then discard this time render
    // next time will enlarge vertex buffer or index buffer to fill the animation data.
    if (isVBOutRange || isIBOutRange || isMatOutRange)
    {
        _materialBuffer->writeUint32(0, 0);
    }
    else
    {
        _materialBuffer->writeUint32(0, _materialLen);
        
        if (_preISegWritePos != -1)
        {
            _materialBuffer->writeUint32(_preISegWritePos, _curISegLen);
        }
    }
    
    // If material buffer is out of range,it will no enlarge automatically,because the size which is 512 bytes is
    // enough large,exceed the size means call gl draw function too many times,you better to optimize resource.
    if (isMatOutRange)
    {
        cocos2d::log("Dragonbones material data is too large,buffer has no space to put in it!!!!!!!!!!");
        cocos2d::log("You can adjust MAX_MATERIAL_BUFFER_SIZE in Macro");
        cocos2d::log("But It's better to optimize resource to avoid large material.Because it can advance performance");
    }
    
    if (_debugDraw)
    {
        // If enable debug draw,then init debug buffer.
        if (_debugBuffer == nullptr)
        {
            _debugBuffer = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, MAX_DEBUG_BUFFER_SIZE);
        }
        
        _debugBuffer->reset();
        
        auto& bones = _armature->getBones();
        std::size_t count = bones.size();
        
       _debugBuffer->writeFloat32(count*4);
        for (int i = 0; i < count; i++)
        {
            Bone* bone = (Bone*)bones[i];
            float boneLen = 5;
            if (bone->_boneData->length > boneLen)
            {
                boneLen = bone->_boneData->length;
            }
            
            float bx = bone->globalTransformMatrix.tx;
            float by = -bone->globalTransformMatrix.ty;
            float endx = bx + bone->globalTransformMatrix.a * boneLen;
            float endy = by - bone->globalTransformMatrix.b * boneLen;
            
            _debugBuffer->writeFloat32(bx);
            _debugBuffer->writeFloat32(by);
            _debugBuffer->writeFloat32(endx);
            _debugBuffer->writeFloat32(endy);
        }
        
        if (_debugBuffer->isOutRange())
        {
            _debugBuffer->writeFloat32(0, 0);
            cocos2d::log("Dragonbones debug data is too large,debug buffer has no space to put in it!!!!!!!!!!");
            cocos2d::log("You can adjust MAX_DEBUG_BUFFER_SIZE in Macro");
        }
    }
}

cocos2d::Vec2 CCArmatureDisplay::convertToRootSpace(const cocos2d::Vec2& pos) const
{
    CCSlot* slot = (CCSlot*)_armature->getParent();
    if (!slot)
    {
        return pos;
    }
    cocos2d::Vec2 newPos;
    slot->updateWorldMatrix();
    cocos2d::Mat4& worldMatrix = slot->worldMatrix;
    newPos.x = pos.x * worldMatrix.m[0] + pos.y * worldMatrix.m[4] + worldMatrix.m[12];
    newPos.y = pos.x * worldMatrix.m[1] + pos.y * worldMatrix.m[5] + worldMatrix.m[13];
    return newPos;
}

CCArmatureDisplay* CCArmatureDisplay::getRootDisplay()
{
    Slot* slot = _armature->getParent();
    if (!slot)
    {
        return this;
    }
    
    Slot* parentSlot = slot->_armature->getParent();
    while (parentSlot)
    {
        slot = parentSlot;
        parentSlot = parentSlot->_armature->getParent();
    }
    return (CCArmatureDisplay*)slot->_armature->getDisplay();
}

void CCArmatureDisplay::traverseArmature(Armature* armature)
{
    auto& slots = armature->getSlots();
    auto mgr = MiddlewareManager::getInstance();
    IOBuffer& vb = mgr->getVB(VF_XYUVC);
    IOBuffer& ib = mgr->getIB();
    
    for (std::size_t i = 0, len = slots.size(); i < len; i++)
    {
        CCSlot* slot = (CCSlot*)slots[i];
        if (!slot->getVisible())
        {
            continue;
        }
        
        slot->updateWorldMatrix();
        
        // If slots has child armature,will traverse child first.
        Armature* childArmature = slot->getChildArmature();
        if (childArmature != nullptr)
        {
            traverseArmature(childArmature);
            continue;
        }
        
        switch (slot->_blendMode)
        {
            case BlendMode::Add:
                _curBlendSrc = _premultipliedAlpha ? GL_ONE : GL_SRC_ALPHA;
                _curBlendDst = GL_ONE;
                break;
            case BlendMode::Multiply:
                _curBlendSrc = GL_DST_COLOR;
                _curBlendDst = GL_ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode::Screen:
                _curBlendSrc = GL_ONE;
                _curBlendDst = GL_ONE_MINUS_SRC_COLOR;
                break;
            default:
                _curBlendSrc = _premultipliedAlpha ? GL_ONE : GL_SRC_ALPHA;
                _curBlendDst = GL_ONE_MINUS_SRC_ALPHA;
                break;
        }
        
        middleware::Texture2D* texture = slot->getTexture();
        if (!texture) continue;
        _curTextureIndex = texture->getRealTextureIndex();
        
        // If texture or blendMode change,will change material.
        if (_preTextureIndex != _curTextureIndex || _preBlendDst != _curBlendDst || _preBlendSrc != _curBlendSrc)
        {
            if (_preISegWritePos != -1)
            {
                _materialBuffer->writeUint32(_preISegWritePos,_curISegLen);
            }
            
            _materialBuffer->writeUint32(_curTextureIndex);
            _materialBuffer->writeUint32(_curBlendSrc);
            _materialBuffer->writeUint32(_curBlendDst);
            
            //Reserve indice segamentation count.
            _preISegWritePos = (int)_materialBuffer->getCurPos();
            _materialBuffer->writeUint32(0);
            
            _preTextureIndex = _curTextureIndex;
            _preBlendDst = _curBlendDst;
            _preBlendSrc = _curBlendSrc;
            
            // Clear index segmentation count,prepare to next segmentation.
            _curISegLen = 0;
            
            _materialLen++;
        }
        
        // Calculation vertex color.
        _finalColor.a = _nodeColor.a * slot->color.a * 255;
        float multiplier = _premultipliedAlpha ? slot->color.a : 255;
        _finalColor.r = _nodeColor.r * slot->color.r * multiplier;
        _finalColor.g = _nodeColor.g * slot->color.g * multiplier;
        _finalColor.b = _nodeColor.b * slot->color.b * multiplier;
        
        // Transform component matrix to global matrix
        middleware::Triangles& triangles = slot->triangles;
        cocos2d::Mat4& worldMatrix = slot->worldMatrix;
        middleware::V2F_T2F_C4B* worldTriangles = slot->worldVerts;
        for (int v = 0, w = 0, vn = triangles.vertCount; v < vn; ++v, w += 2)
        {
            middleware::V2F_T2F_C4B* vertex = triangles.verts + v;
            middleware::V2F_T2F_C4B* worldVertex = worldTriangles + v;
            worldVertex->vertex.x = vertex->vertex.x * worldMatrix.m[0] + vertex->vertex.y * worldMatrix.m[4] + worldMatrix.m[12];
            worldVertex->vertex.y = vertex->vertex.x * worldMatrix.m[1] + vertex->vertex.y * worldMatrix.m[5] + worldMatrix.m[13];
            worldVertex->color.r = (GLubyte)_finalColor.r;
            worldVertex->color.g = (GLubyte)_finalColor.g;
            worldVertex->color.b = (GLubyte)_finalColor.b;
            worldVertex->color.a = (GLubyte)_finalColor.a;
        }
        
        // Fill MiddlewareManager vertex buffer
        auto vertexOffset = vb.getCurPos() / sizeof(middleware::V2F_T2F_C4B);
		auto vbSize = triangles.vertCount * sizeof(middleware::V2F_T2F_C4B);
		vb.checkSpace(vbSize, true);
        vb.writeBytes((char*)worldTriangles, vbSize);
        
		auto ibSize = triangles.indexCount * sizeof(unsigned short);
		ib.checkSpace(ibSize, true);
        // If vertex buffer current offset is zero,fill it directly or recalculate vertex offset.
        if (vertexOffset > 0)
        {
            for (int ii = 0, nn = triangles.indexCount; ii < nn; ii++)
            {
                ib.writeUint16(triangles.indices[ii] + vertexOffset);
            }
        }
        else
        {
            ib.writeBytes((char*)triangles.indices, ibSize);
        }
        
        // Record this turn index segmentation count,it will store in material buffer in the end.
        _curISegLen += triangles.indexCount;
    }
}

bool CCArmatureDisplay::hasDBEventListener(const std::string& type) const
{
    auto it = _listenerIDMap.find(type);
    return it != _listenerIDMap.end();
}

void CCArmatureDisplay::addDBEventListener(const std::string& type, const std::function<void(EventObject*)>& callback)
{
    _listenerIDMap[type] = true;
}

void CCArmatureDisplay::dispatchDBEvent(const std::string& type, EventObject* value)
{
    auto it = _listenerIDMap.find(type);
    if (it == _listenerIDMap.end())
    {
        return;
    }
    
    if (_dbEventCallback)
    {
        _dbEventCallback(value);
    }
}

void CCArmatureDisplay::removeDBEventListener(const std::string& type, const std::function<void(EventObject*)>& callback)
{
    auto it = _listenerIDMap.find(type);
    if (it != _listenerIDMap.end())
    {
        _listenerIDMap.erase(it);
    }
}

DRAGONBONES_NAMESPACE_END
