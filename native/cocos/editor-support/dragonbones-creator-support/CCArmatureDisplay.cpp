/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2020 DragonBones team and other contributors
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
#include "MiddlewareMacro.h"
#include "SharedBufferManager.h"
#include "base/TypeDef.h"
#include "base/memory/Memory.h"
#include "dragonbones-creator-support/CCSlot.h"
#include "math/Math.h"
#include "math/Vec3.h"
#include "gfx-base/GFXDef.h"

USING_NS_MW;
using namespace cc;
using namespace cc::gfx;

static const std::string techStage = "opaque";
static const std::string textureKey = "texture";

DRAGONBONES_NAMESPACE_BEGIN

CCArmatureDisplay *CCArmatureDisplay::create() {
    CCArmatureDisplay *displayContainer = new (std::nothrow) CCArmatureDisplay();
    if (displayContainer) {
        displayContainer->autorelease();
    } else {
        CC_SAFE_DELETE(displayContainer);
    }
    return displayContainer;
}

CCArmatureDisplay::CCArmatureDisplay() {
    _sharedBufferOffset = new IOTypedArray(se::Object::TypedArrayType::UINT32, sizeof(uint32_t) * 2);

    // store render order(1), world matrix(16)
    _paramsBuffer = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, sizeof(float) * 17);
    // set render order to 0
    _paramsBuffer->writeFloat32(0);
    // set world transform to identity
    _paramsBuffer->writeBytes((const char *)&cc::Mat4::IDENTITY, sizeof(float) * 16);
}

CCArmatureDisplay::~CCArmatureDisplay() {
    dispose();

    if (_debugBuffer) {
        delete _debugBuffer;
        _debugBuffer = nullptr;
    }

    if (_sharedBufferOffset) {
        delete _sharedBufferOffset;
        _sharedBufferOffset = nullptr;
    }

    if (_paramsBuffer) {
        delete _paramsBuffer;
        _paramsBuffer = nullptr;
    }
}

void CCArmatureDisplay::dispose(bool disposeProxy) {
    if (_armature != nullptr) {
        _armature->dispose();
        _armature = nullptr;
    }
}

void CCArmatureDisplay::dbInit(Armature *armature) {
    _armature = armature;
}

void CCArmatureDisplay::dbClear() {
    _armature = nullptr;
    release();
}

void CCArmatureDisplay::dbUpdate() {}

void CCArmatureDisplay::dbRender() {
    _sharedBufferOffset->reset();
    _sharedBufferOffset->clear();

    if (this->_armature->getParent())
        return;

    auto mgr = MiddlewareManager::getInstance();
    if (!mgr->isRendering) return;

    auto renderMgr = mgr->getRenderInfoMgr();
    auto renderInfo = renderMgr->getBuffer();
    if (!renderInfo) return;

    auto attachMgr = mgr->getAttachInfoMgr();
    auto attachInfo = attachMgr->getBuffer();
    if (!attachInfo) return;

    //  store render info offset
    _sharedBufferOffset->writeUint32((uint32_t)renderInfo->getCurPos() / sizeof(uint32_t));
    // store attach info offset
    _sharedBufferOffset->writeUint32((uint32_t)attachInfo->getCurPos() / sizeof(uint32_t));

    // check enough space
    renderInfo->checkSpace(sizeof(uint32_t) * 2, true);
    // write border
    renderInfo->writeUint32(0xffffffff);

    std::size_t materialLenOffset = renderInfo->getCurPos();
    //reserved space to save material len
    renderInfo->writeUint32(0);

    // render not ready
    auto paramsBuffer = _paramsBuffer->getBuffer();
    float renderOrder = *(float *)paramsBuffer;
    if (renderOrder < 0) {
        return;
    }

    _preBlendMode = -1;
    _preTextureIndex = -1;
    _curTextureIndex = -1;
    _preISegWritePos = -1;
    _curISegLen = 0;

    _debugSlotsLen = 0;
    _materialLen = 0;

    // Traverse all aramture to fill vertex and index buffer.
    traverseArmature(_armature);

    renderInfo->writeUint32(materialLenOffset, _materialLen);
    if (_preISegWritePos != -1) {
        renderInfo->writeUint32(_preISegWritePos, _curISegLen);
    }

    if (_useAttach || _debugDraw) {
        auto &bones = _armature->getBones();
        std::size_t count = bones.size();

        cc::Mat4 boneMat = cc::Mat4::IDENTITY;

        if (_debugDraw) {
            // If enable debug draw,then init debug buffer.
            if (_debugBuffer == nullptr) {
                _debugBuffer = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, MAX_DEBUG_BUFFER_SIZE);
            }
            _debugBuffer->reset();
            _debugBuffer->writeFloat32(count * 4);
        }

        for (int i = 0; i < count; i++) {
            Bone *bone = (Bone *)bones[i];

            float boneLen = 5;
            if (bone->_boneData->length > boneLen) {
                boneLen = bone->_boneData->length;
            }

            boneMat.m[0] = bone->globalTransformMatrix.a;
            boneMat.m[1] = bone->globalTransformMatrix.b;
            boneMat.m[4] = -bone->globalTransformMatrix.c;
            boneMat.m[5] = -bone->globalTransformMatrix.d;
            boneMat.m[12] = bone->globalTransformMatrix.tx;
            boneMat.m[13] = bone->globalTransformMatrix.ty;
            attachInfo->checkSpace(sizeof(boneMat), true);
            attachInfo->writeBytes((const char *)&boneMat, sizeof(boneMat));

            if (_debugDraw) {
                float bx = bone->globalTransformMatrix.tx;
                float by = bone->globalTransformMatrix.ty;
                float endx = bx + bone->globalTransformMatrix.a * boneLen;
                float endy = by + bone->globalTransformMatrix.b * boneLen;
                _debugBuffer->writeFloat32(bx);
                _debugBuffer->writeFloat32(by);
                _debugBuffer->writeFloat32(endx);
                _debugBuffer->writeFloat32(endy);
            }
        }

        if (_debugBuffer && _debugBuffer->isOutRange()) {
            _debugBuffer->writeFloat32(0, 0);
            CC_LOG_INFO("Dragonbones debug data is too large,debug buffer has no space to put in it!!!!!!!!!!");
            CC_LOG_INFO("You can adjust MAX_DEBUG_BUFFER_SIZE in MiddlewareMacro");
        }
    }
}

cc::Vec2 CCArmatureDisplay::convertToRootSpace(float x, float y) const {
    CCSlot *slot = (CCSlot *)_armature->getParent();
    if (!slot) {
        return cc::Vec2(x, y);
    }
    cc::Vec2 newPos;
    slot->updateWorldMatrix();
    cc::Mat4 &worldMatrix = slot->worldMatrix;
    newPos.x = x * worldMatrix.m[0] + y * worldMatrix.m[4] + worldMatrix.m[12];
    newPos.y = x * worldMatrix.m[1] + y * worldMatrix.m[5] + worldMatrix.m[13];
    return newPos;
}

CCArmatureDisplay *CCArmatureDisplay::getRootDisplay() {
    Slot *slot = _armature->getParent();
    if (!slot) {
        return this;
    }

    Slot *parentSlot = slot->_armature->getParent();
    while (parentSlot) {
        slot = parentSlot;
        parentSlot = parentSlot->_armature->getParent();
    }
    return (CCArmatureDisplay *)slot->_armature->getDisplay();
}

void CCArmatureDisplay::traverseArmature(Armature *armature, float parentOpacity) {
    static cc::Mat4 matrixTemp;

    auto paramsBuffer = _paramsBuffer->getBuffer();
    // data store in buffer which 0 to 3 is render order, left data is node world matrix
    const cc::Mat4 &nodeWorldMat = *(cc::Mat4 *)&paramsBuffer[4];

    auto &slots = armature->getSlots();
    auto mgr = MiddlewareManager::getInstance();

    middleware::MeshBuffer *mb = mgr->getMeshBuffer(VF_XYZUVC);
    IOBuffer &vb = mb->getVB();
    IOBuffer &ib = mb->getIB();

    float realOpacity = _nodeColor.a;
    auto renderMgr = mgr->getRenderInfoMgr();
    auto renderInfo = renderMgr->getBuffer();
    if (!renderInfo) return;

    auto attachMgr = mgr->getAttachInfoMgr();
    auto attachInfo = attachMgr->getBuffer();
    if (!attachInfo) return;

    // range [0.0, 255.0]
    float r, g, b, a;
    CCSlot *slot = nullptr;
    middleware::Texture2D *texture = nullptr;
    int isFull = 0;

    auto flush = [&]() {
        // fill pre segment count field
        if (_preISegWritePos != -1) {
            // _assembler->updateIARange(_materialLen - 1, _preISegWritePos, _curISegLen);
            renderInfo->writeUint32(_preISegWritePos, _curISegLen);
        }

        // prepare to fill new segment field
        switch (slot->_blendMode) {
            case BlendMode::Add:
                _curBlendSrc = (int)(_premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA);
                _curBlendDst = (int)BlendFactor::ONE;
                break;
            case BlendMode::Multiply:
                _curBlendSrc = (int)BlendFactor::DST_COLOR;
                _curBlendDst = (int)BlendFactor::ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode::Screen:
                _curBlendSrc = (int)BlendFactor::ONE;
                _curBlendDst = (int)BlendFactor::ONE_MINUS_SRC_COLOR;
                break;
            default:
                _curBlendSrc = (int)(_premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA);
                _curBlendDst = (int)BlendFactor::ONE_MINUS_SRC_ALPHA;
                break;
        }

        // check enough space
        renderInfo->checkSpace(sizeof(uint32_t) * 6, true);

        // fill new texture index
        renderInfo->writeUint32(_curTextureIndex);
        // fill new blend src and dst
        renderInfo->writeUint32(_curBlendSrc);
        renderInfo->writeUint32(_curBlendDst);
        // fill new index and vertex buffer id
        auto bufferIndex = mb->getBufferPos();
        renderInfo->writeUint32(bufferIndex);

        // fill new index offset
        renderInfo->writeUint32((uint32_t)ib.getCurPos() / sizeof(unsigned short));

        // save new segment indices count pos field
        _preISegWritePos = (int)renderInfo->getCurPos();

        // reserve indice segamentation count
        renderInfo->writeUint32(0);

        // reset pre blend mode to current
        _preBlendMode = (int)slot->_blendMode;
        // reset pre texture index to current
        _preTextureIndex = _curTextureIndex;

        // reset index segmentation count
        _curISegLen = 0;
        // material length increased
        _materialLen++;
    };

    for (std::size_t i = 0, len = slots.size(); i < len; i++) {
        isFull = 0;
        slot = (CCSlot *)slots[i];
        if (!slot->getVisible()) {
            continue;
        }

        slot->updateWorldMatrix();

        // If slots has child armature,will traverse child first.
        Armature *childArmature = slot->getChildArmature();
        if (childArmature != nullptr) {
            traverseArmature(childArmature, parentOpacity * slot->color.a / 255.0f);
            continue;
        }

        texture = slot->getTexture();
        if (!texture) continue;
        _curTextureIndex = texture->getRealTextureIndex();
        auto vbSize = slot->triangles.vertCount * sizeof(middleware::V2F_T2F_C4F);
        isFull |= vb.checkSpace(vbSize, true);

        // If texture or blendMode change,will change material.
        if (_preTextureIndex != _curTextureIndex || _preBlendMode != (int)slot->_blendMode || isFull) {
            flush();
        }

        // Calculation vertex color.
        a = realOpacity * slot->color.a * parentOpacity / 255.0f;
        float multiplier = _premultipliedAlpha ? a / 255.0f : 1.0f / 255.0f;
        r = _nodeColor.r * slot->color.r * multiplier;
        g = _nodeColor.g * slot->color.g * multiplier;
        b = _nodeColor.b * slot->color.b * multiplier;

        // Transform component matrix to global matrix
        middleware::Triangles &triangles = slot->triangles;
        cc::Mat4 *worldMatrix = &slot->worldMatrix;
        if (_batch) {
            cc::Mat4::multiply(nodeWorldMat, *worldMatrix, &matrixTemp);
            worldMatrix = &matrixTemp;
        }

        middleware::V2F_T2F_C4F *worldTriangles = slot->worldVerts;

        for (int v = 0, w = 0, vn = triangles.vertCount; v < vn; ++v, w += 2) {
            middleware::V2F_T2F_C4F *vertex = triangles.verts + v;
            middleware::V2F_T2F_C4F *worldVertex = worldTriangles + v;

            vertex->vertex.z = 0;//reset for z value
            worldVertex->vertex.transformMat4(vertex->vertex, *worldMatrix);

            worldVertex->color.r = r;
            worldVertex->color.g = g;
            worldVertex->color.b = b;
            worldVertex->color.a = a;
        }

        // Fill MiddlewareManager vertex buffer
        auto vertexOffset = vb.getCurPos() / sizeof(middleware::V2F_T2F_C4F);
        vb.writeBytes((char *)worldTriangles, vbSize);

        auto ibSize = triangles.indexCount * sizeof(unsigned short);
        ib.checkSpace(ibSize, true);
        // If vertex buffer current offset is zero,fill it directly or recalculate vertex offset.
        if (vertexOffset > 0) {
            for (int ii = 0, nn = triangles.indexCount; ii < nn; ii++) {
                ib.writeUint16(triangles.indices[ii] + vertexOffset);
            }
        } else {
            ib.writeBytes((char *)triangles.indices, ibSize);
        }

        // Record this turn index segmentation count,it will store in material buffer in the end.
        _curISegLen += triangles.indexCount;
    }
}

bool CCArmatureDisplay::hasDBEventListener(const std::string &type) const {
    auto it = _listenerIDMap.find(type);
    return it != _listenerIDMap.end();
}

void CCArmatureDisplay::addDBEventListener(const std::string &type, const std::function<void(EventObject *)> &callback) {
    _listenerIDMap[type] = true;
}

void CCArmatureDisplay::dispatchDBEvent(const std::string &type, EventObject *value) {
    auto it = _listenerIDMap.find(type);
    if (it == _listenerIDMap.end()) {
        return;
    }

    if (_dbEventCallback) {
        _dbEventCallback(value);
    }
}

void CCArmatureDisplay::removeDBEventListener(const std::string &type, const std::function<void(EventObject *)> &callback) {
    auto it = _listenerIDMap.find(type);
    if (it != _listenerIDMap.end()) {
        _listenerIDMap.erase(it);
    }
}

se_object_ptr CCArmatureDisplay::getDebugData() const {
    if (_debugBuffer) {
        return _debugBuffer->getTypeArray();
    }
    return nullptr;
}

void CCArmatureDisplay::setColor(float r, float g, float b, float a) {
    _nodeColor.r = r / 255.0f;
    _nodeColor.g = g / 255.0f;
    _nodeColor.b = b / 255.0f;
    _nodeColor.a = a / 255.0f;
}

se_object_ptr CCArmatureDisplay::getSharedBufferOffset() const {
    if (_sharedBufferOffset) {
        return _sharedBufferOffset->getTypeArray();
    }
    return nullptr;
}

se_object_ptr CCArmatureDisplay::getParamsBuffer() const {
    if (_paramsBuffer) {
        return _paramsBuffer->getTypeArray();
    }
    return nullptr;
}

uint32_t CCArmatureDisplay::getRenderOrder() const {
    if (_paramsBuffer) {
        auto buffer = _paramsBuffer->getBuffer();
        return (uint32_t)buffer[0];
    }
    return 0;
}

DRAGONBONES_NAMESPACE_END
