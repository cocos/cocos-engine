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
#include "renderer/renderer/Pass.h"
#include "renderer/renderer/Technique.h"
#include "renderer/gfx/Texture.h"

USING_NS_CC;
USING_NS_MW;
using namespace cocos2d::renderer;

static const std::string techStage = "opaque";
static const std::string textureKey = "texture";

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
    
}

CCArmatureDisplay::~CCArmatureDisplay()
{
    dispose();

    if (_debugBuffer)
    {
        delete _debugBuffer;
        _debugBuffer = nullptr;
    }
    
    CC_SAFE_RELEASE(_nodeProxy);
    CC_SAFE_RELEASE(_effect);
}

void CCArmatureDisplay::dispose(bool disposeProxy)
{
    if (_armature != nullptr)
    {
        _armature->dispose();
        _armature = nullptr;
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

void CCArmatureDisplay::dbUpdate() {}

void CCArmatureDisplay::dbRender()
{
    if (_nodeProxy == nullptr)
    {
        return;
    }
    
    _assembler = (CustomAssembler*)_nodeProxy->getAssembler();
    if (_assembler == nullptr)
    {
        return;
    }
    _assembler->reset();
    _assembler->setUseModel(!_batch);
    
    if (this->_armature->getParent())
        return;
    
    auto mgr = MiddlewareManager::getInstance();
    if (!mgr->isRendering) return;
    
    _preBlendMode = -1;
    _preTextureIndex = -1;
    _curTextureIndex = -1;
	_preISegWritePos = -1;
    _curISegLen = 0;
    
    _debugSlotsLen = 0;
    _materialLen = 0;
    
    // Traverse all aramture to fill vertex and index buffer.
    traverseArmature(_armature);
    if (_preISegWritePos != -1)
    {
		_assembler->updateIARange(_materialLen - 1, _preISegWritePos, _curISegLen);
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
        
       _debugBuffer->writeFloat32(count * 4);
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
            cocos2d::log("You can adjust MAX_DEBUG_BUFFER_SIZE in MiddlewareMacro");
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

void CCArmatureDisplay::traverseArmature(Armature* armature, float parentOpacity)
{
    static cocos2d::Mat4 matrixTemp;
    const cocos2d::Mat4& nodeWorldMat = _nodeProxy->getWorldMatrix();
    
    auto& slots = armature->getSlots();
    auto mgr = MiddlewareManager::getInstance();

    middleware::MeshBuffer* mb = mgr->getMeshBuffer(VF_XYUVC);
    IOBuffer& vb = mb->getVB();
    IOBuffer& ib = mb->getIB();
	float realOpacity = _nodeProxy->getRealOpacity() / 255.0f;
    
	// range [0.0, 255.0]
	float r, g, b, a;
    CCSlot* slot = nullptr;
	middleware::Texture2D* texture = nullptr;
    int isFull = 0;
    
    auto flush = [&]()
    {
        // fill pre segment count field
        if (_preISegWritePos != -1)
        {
			_assembler->updateIARange(_materialLen - 1, _preISegWritePos, _curISegLen);
        }
        
        // prepare to fill new segment field
        switch (slot->_blendMode)
        {
            case BlendMode::Add:
                _curBlendSrc = _premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA;
                _curBlendDst = BlendFactor::ONE;
                break;
            case BlendMode::Multiply:
                _curBlendSrc = BlendFactor::DST_COLOR;
                _curBlendDst = BlendFactor::ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode::Screen:
                _curBlendSrc = BlendFactor::ONE;
                _curBlendDst = BlendFactor::ONE_MINUS_SRC_COLOR;
                break;
            default:
                _curBlendSrc = _premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA;
                _curBlendDst = BlendFactor::ONE_MINUS_SRC_ALPHA;
                break;
        }
        
        double curHash = _curTextureIndex + ((uint8_t)slot->_blendMode << 16) + ((uint8_t)_batch << 24);
        
        Effect* renderEffect = _assembler->getEffect(_materialLen);
        Technique::Parameter* param = nullptr;
        Pass* pass = nullptr;
        
        if (renderEffect)
        {
            double renderHash = renderEffect->getHash();
            if (abs(renderHash - curHash) >= 0.01)
            {
                param = (Technique::Parameter*)&(renderEffect->getProperty(textureKey));
                Technique* tech = renderEffect->getTechnique(techStage);
                Vector<Pass*>& passes = (Vector<Pass*>&)tech->getPasses();
                pass = *(passes.begin());
            }
        }
        else
        {
            if (_effect == nullptr)
            {
                cocos2d::log("ArmatureDisplay:update get effect failed");
                _assembler->reset();
                return;
            }
            auto effect = new cocos2d::renderer::Effect();
            effect->autorelease();
            effect->copy(_effect);
            
            Technique* tech = effect->getTechnique(techStage);
            Vector<Pass*>& passes = (Vector<Pass*>&)tech->getPasses();
            pass = *(passes.begin());
            
            _assembler->updateEffect(_materialLen, effect);
            renderEffect = effect;
            param = (Technique::Parameter*)&(renderEffect->getProperty(textureKey));
        }
        
        if (param)
        {
            param->setTexture(texture->getNativeTexture());
        }
        
        if (pass)
        {
            pass->setBlend(BlendOp::ADD, _curBlendSrc, _curBlendDst,
                           BlendOp::ADD, _curBlendSrc, _curBlendDst);
        }
        
        renderEffect->updateHash(curHash);

		// save new segment count pos field
        _preISegWritePos = (int)ib.getCurPos()/sizeof(unsigned short);
        // save new segment vb and ib
        _assembler->updateIABuffer(_materialLen, mb->getGLVB(), mb->getGLIB());
        // reset pre blend mode to current
        _preBlendMode = (int)slot->_blendMode;  
        // reset pre texture index to current      
        _preTextureIndex = _curTextureIndex;
        
        // reset index segmentation count
        _curISegLen = 0;
        // material length increased
        _materialLen++;
    };
    
    for (std::size_t i = 0, len = slots.size(); i < len; i++)
    {
        isFull = 0;
        slot = (CCSlot*)slots[i];
        if (!slot->getVisible())
        {
            continue;
        }
        
        slot->updateWorldMatrix();
        
        // If slots has child armature,will traverse child first.
        Armature* childArmature = slot->getChildArmature();
        if (childArmature != nullptr)
        {
            traverseArmature(childArmature, parentOpacity * slot->color.a / 255.0f);
            continue;
        }
        
        texture = slot->getTexture();
        if (!texture) continue;
        _curTextureIndex = texture->getNativeTexture()->getHandle();
        
        auto vbSize = slot->triangles.vertCount * sizeof(middleware::V2F_T2F_C4B);
        isFull |= vb.checkSpace(vbSize, true);
        
        // If texture or blendMode change,will change material.
        if (_preTextureIndex != _curTextureIndex || _preBlendMode != (int)slot->_blendMode || isFull)
        {
            flush();
        }
        
        // Calculation vertex color.
        a = realOpacity * slot->color.a * parentOpacity;
        float multiplier = _premultipliedAlpha ? a / 255.0f : 1.0f;
        r = _nodeColor.r * slot->color.r * multiplier;
        g = _nodeColor.g * slot->color.g * multiplier;
        b = _nodeColor.b * slot->color.b * multiplier;
        
        // Transform component matrix to global matrix
        middleware::Triangles& triangles = slot->triangles;
        cocos2d::Mat4* worldMatrix = &slot->worldMatrix;
        if (_batch) {
            cocos2d::Mat4::multiply(nodeWorldMat, *worldMatrix, &matrixTemp);
            worldMatrix = &matrixTemp;
        }
        
        middleware::V2F_T2F_C4B* worldTriangles = slot->worldVerts;
        
        for (int v = 0, w = 0, vn = triangles.vertCount; v < vn; ++v, w += 2)
        {
            middleware::V2F_T2F_C4B* vertex = triangles.verts + v;
            middleware::V2F_T2F_C4B* worldVertex = worldTriangles + v;
            worldVertex->vertex.x = vertex->vertex.x * worldMatrix->m[0] + vertex->vertex.y * worldMatrix->m[4] + worldMatrix->m[12];
            worldVertex->vertex.y = vertex->vertex.x * worldMatrix->m[1] + vertex->vertex.y * worldMatrix->m[5] + worldMatrix->m[13];
            
            worldVertex->color.r = (GLubyte)r;
            worldVertex->color.g = (GLubyte)g;
            worldVertex->color.b = (GLubyte)b;
            worldVertex->color.a = (GLubyte)a;
        }
        
        // Fill MiddlewareManager vertex buffer
        auto vertexOffset = vb.getCurPos() / sizeof(middleware::V2F_T2F_C4B);
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
