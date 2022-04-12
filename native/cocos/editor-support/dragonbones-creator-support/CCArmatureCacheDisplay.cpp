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

#include "CCArmatureCacheDisplay.h"
#include "ArmatureCacheMgr.h"
#include "CCFactory.h"
#include "MiddlewareManager.h"
#include "SharedBufferManager.h"
#include "base/TypeDef.h"
#include "base/memory/Memory.h"
#include "math/Math.h"
#include "gfx-base/GFXDef.h"

using namespace cc;
using namespace cc::gfx;

static const std::string techStage = "opaque";
static const std::string textureKey = "texture";
static const std::string startEvent = "start";
static const std::string loopCompleteEvent = "loopComplete";
static const std::string completeEvent = "complete";

DRAGONBONES_NAMESPACE_BEGIN

USING_NS_MW;
CCArmatureCacheDisplay::CCArmatureCacheDisplay(const std::string &armatureName, const std::string &armatureKey, const std::string &atlasUUID, bool isShare) {
    _eventObject = BaseObject::borrowObject<EventObject>();

    if (isShare) {
        _armatureCache = ArmatureCacheMgr::getInstance()->buildArmatureCache(armatureName, armatureKey, atlasUUID);
        _armatureCache->retain();
    } else {
        _armatureCache = new ArmatureCache(armatureName, armatureKey, atlasUUID);
        _armatureCache->retain();
        _armatureCache->autorelease();
    }

    // store global TypedArray begin and end offset
    _sharedBufferOffset = new IOTypedArray(se::Object::TypedArrayType::UINT32, sizeof(uint32_t) * 2);

    // store render order(1), world matrix(16)
    _paramsBuffer = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, sizeof(float) * 17);
    // set render order to 0
    _paramsBuffer->writeFloat32(0);
    // set world transform to identity
    _paramsBuffer->writeBytes((const char *)&cc::Mat4::IDENTITY, sizeof(float) * 16);

    beginSchedule();
}

CCArmatureCacheDisplay::~CCArmatureCacheDisplay() {
    dispose();

    if (_sharedBufferOffset) {
        delete _sharedBufferOffset;
        _sharedBufferOffset = nullptr;
    }

    if (_paramsBuffer) {
        delete _paramsBuffer;
        _paramsBuffer = nullptr;
    }
}

void CCArmatureCacheDisplay::dispose() {

    if (_armatureCache) {
        _armatureCache->release();
        _armatureCache = nullptr;
    }
    if (_eventObject) {
        _eventObject->returnToPool();
        _eventObject = nullptr;
    }

    stopSchedule();
}

void CCArmatureCacheDisplay::update(float dt) {
    auto gTimeScale = dragonBones::CCFactory::getFactory()->getTimeScale();
    dt *= _timeScale * gTimeScale;

    if (_isAniComplete || !_animationData) {
        if (_animationData && !_animationData->isComplete()) {
            _armatureCache->updateToFrame(_animationName);
        }
        return;
    }

    if (_accTime <= 0.00001 && _playCount == 0) {
        _eventObject->type = EventObject::START;
        dispatchDBEvent(startEvent, _eventObject);
    }

    _accTime += dt;
    int frameIdx = floor(_accTime / ArmatureCache::FrameTime);
    if (!_animationData->isComplete()) {
        _armatureCache->updateToFrame(_animationName, frameIdx);
    }

    int finalFrameIndex = (int)_animationData->getFrameCount() - 1;
    if (_animationData->isComplete() && frameIdx >= finalFrameIndex) {
        _playCount++;
        _accTime = 0.0f;
        if (_playTimes > 0 && _playCount >= _playTimes) {
            frameIdx = finalFrameIndex;
            _playCount = 0;
            _isAniComplete = true;
        } else {
            frameIdx = 0;
        }

        _eventObject->type = EventObject::COMPLETE;
        dispatchDBEvent(completeEvent, _eventObject);

        _eventObject->type = EventObject::LOOP_COMPLETE;
        dispatchDBEvent(loopCompleteEvent, _eventObject);
    }
    _curFrameIndex = frameIdx;
}

void CCArmatureCacheDisplay::render(float dt) {

    if (!_animationData) return;
    ArmatureCache::FrameData *frameData = _animationData->getFrameData(_curFrameIndex);
    if (!frameData) return;

    auto mgr = MiddlewareManager::getInstance();
    if (!mgr->isRendering) return;

    auto &segments = frameData->getSegments();
    auto &colors = frameData->getColors();

    _sharedBufferOffset->reset();
    _sharedBufferOffset->clear();

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

    // matieral len
    renderInfo->writeUint32(segments.size());

    if (segments.size() == 0 || colors.size() == 0) return;

    middleware::MeshBuffer *mb = mgr->getMeshBuffer(VF_XYZUVC);
    middleware::IOBuffer &vb = mb->getVB();
    middleware::IOBuffer &ib = mb->getIB();
    const auto &srcVB = frameData->vb;
    const auto &srcIB = frameData->ib;

    auto paramsBuffer = _paramsBuffer->getBuffer();
    const cc::Mat4 &nodeWorldMat = *(cc::Mat4 *)&paramsBuffer[4];

    int colorOffset = 0;
    ArmatureCache::ColorData *nowColor = colors[colorOffset++];
    auto maxVFOffset = nowColor->vertexFloatOffset;

    Color4F color;

    float tempR = 0.0f, tempG = 0.0f, tempB = 0.0f, tempA = 0.0f;
    float multiplier = 1.0f;
    std::size_t srcVertexBytesOffset = 0;
    std::size_t srcIndexBytesOffset = 0;
    std::size_t vertexBytes = 0;
    std::size_t indexBytes = 0;
    int curTextureIndex = 0;
    BlendMode blendMode = BlendMode::Normal;
    std::size_t dstVertexOffset = 0;
    std::size_t dstIndexOffset = 0;
    float *dstVertexBuffer = nullptr;
    unsigned int *dstColorBuffer = nullptr;
    unsigned short *dstIndexBuffer = nullptr;
    bool needColor = false;
    int curBlendSrc = -1;
    int curBlendDst = -1;

    if (abs(_nodeColor.r - 1.0f) > 0.0001f ||
        abs(_nodeColor.g - 1.0f) > 0.0001f ||
        abs(_nodeColor.b - 1.0f) > 0.0001f ||
        abs(_nodeColor.a - 1.0f) > 0.0001f ||
        _premultipliedAlpha) {
        needColor = true;
    }

    auto handleColor = [&](ArmatureCache::ColorData *colorData) {
        tempA = colorData->color.a * _nodeColor.a;
        multiplier = _premultipliedAlpha ? tempA / 255.0f : 1.0f;
        tempR = _nodeColor.r * multiplier;
        tempG = _nodeColor.g * multiplier;
        tempB = _nodeColor.b * multiplier;

        color.a = tempA;
        color.r = colorData->color.r * tempR;
        color.g = colorData->color.g * tempG;
        color.b = colorData->color.b * tempB;
    };

    handleColor(nowColor);

    for (std::size_t segIndex = 0, segLen = segments.size(); segIndex < segLen; segIndex++) {
        auto segment = segments[segIndex];
        vertexBytes = segment->vertexFloatCount * sizeof(float);

        // check enough space
        renderInfo->checkSpace(sizeof(uint32_t) * 6, true);

        // fill new texture index
        curTextureIndex = segment->getTexture()->getRealTextureIndex();
        renderInfo->writeUint32(curTextureIndex);

        blendMode = (BlendMode)segment->blendMode;
        switch (blendMode) {
            case BlendMode::Add:
                curBlendSrc = (int)(_premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA);
                curBlendDst = (int)BlendFactor::ONE;
                break;
            case BlendMode::Multiply:
                curBlendSrc = (int)BlendFactor::DST_COLOR;
                curBlendDst = (int)BlendFactor::ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode::Screen:
                curBlendSrc = (int)BlendFactor::ONE;
                curBlendDst = (int)BlendFactor::ONE_MINUS_SRC_COLOR;
                break;
            default:
                curBlendSrc = (int)(_premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA);
                curBlendDst = (int)BlendFactor::ONE_MINUS_SRC_ALPHA;
                break;
        }
        // fill new blend src and dst
        renderInfo->writeUint32(curBlendSrc);
        renderInfo->writeUint32(curBlendDst);

        // fill vertex buffer
        vb.checkSpace(vertexBytes, true);
        dstVertexOffset = vb.getCurPos() / sizeof(V2F_T2F_C4F);
        dstVertexBuffer = (float *)vb.getCurBuffer();
        dstColorBuffer = (unsigned int *)vb.getCurBuffer();
        vb.writeBytes((char *)srcVB.getBuffer() + srcVertexBytesOffset, vertexBytes);

        // batch handle
        if (_batch) {
            cc::Vec3 *point = nullptr;

            for (auto posIndex = 0; posIndex < segment->vertexFloatCount; posIndex += VF_XYZUVC) {
                point = (cc::Vec3 *)(dstVertexBuffer + posIndex);
                // force z value to zero
                point->z = 0;
                point->transformMat4(*point, nodeWorldMat);
            }
        }

        // handle vertex color
        if (needColor) {
            auto frameFloatOffset = srcVertexBytesOffset / sizeof(float);
            for (auto colorIndex = 0; colorIndex < segment->vertexFloatCount; colorIndex += VF_XYZUVC, frameFloatOffset += VF_XYZUVC) {
                if (frameFloatOffset >= maxVFOffset) {
                    nowColor = colors[colorOffset++];
                    handleColor(nowColor);
                    maxVFOffset = nowColor->vertexFloatOffset;
                }
                memcpy(dstColorBuffer + colorIndex + 5, &color, sizeof(color));
            }
        }

        // move src vertex buffer offset
        srcVertexBytesOffset += vertexBytes;

        // fill index buffer
        indexBytes = segment->indexCount * sizeof(unsigned short);
        ib.checkSpace(indexBytes, true);
        dstIndexOffset = (int)ib.getCurPos() / sizeof(unsigned short);
        dstIndexBuffer = (unsigned short *)ib.getCurBuffer();
        ib.writeBytes((char *)srcIB.getBuffer() + srcIndexBytesOffset, indexBytes);
        for (auto indexPos = 0; indexPos < segment->indexCount; indexPos++) {
            dstIndexBuffer[indexPos] += dstVertexOffset;
        }
        srcIndexBytesOffset += indexBytes;

        // fill new index and vertex buffer id
        auto bufferIndex = mb->getBufferPos();
        renderInfo->writeUint32(bufferIndex);

        // fill new index offset
        renderInfo->writeUint32(dstIndexOffset);
        // fill new indice segamentation count
        renderInfo->writeUint32(segment->indexCount);
    }

    if (_useAttach) {
        auto &bonesData = frameData->getBones();
        auto boneCount = frameData->getBoneCount();

        for (int i = 0, n = boneCount; i < n; i++) {
            auto bone = bonesData[i];
            attachInfo->checkSpace(sizeof(cc::Mat4), true);
            attachInfo->writeBytes((const char *)&bone->globalTransformMatrix, sizeof(cc::Mat4));
        }
    }
}
void CCArmatureCacheDisplay::beginSchedule() {
    MiddlewareManager::getInstance()->addTimer(this);
}

void CCArmatureCacheDisplay::stopSchedule() {
    MiddlewareManager::getInstance()->removeTimer(this);

    if (_sharedBufferOffset) {
        _sharedBufferOffset->reset();
        _sharedBufferOffset->clear();
    }
}

void CCArmatureCacheDisplay::onEnable() {
    beginSchedule();
}

void CCArmatureCacheDisplay::onDisable() {
    stopSchedule();
}

Armature *CCArmatureCacheDisplay::getArmature() const {
    auto armatureDisplay = _armatureCache->getArmatureDisplay();
    return armatureDisplay->getArmature();
}

Animation *CCArmatureCacheDisplay::getAnimation() const {
    auto armature = getArmature();
    return armature->getAnimation();
}

void CCArmatureCacheDisplay::playAnimation(const std::string &name, int playTimes) {
    _playTimes = playTimes;
    _animationName = name;
    _animationData = _armatureCache->buildAnimationData(_animationName);
    _isAniComplete = false;
    _accTime = 0.0f;
    _playCount = 0;
    _curFrameIndex = 0;
}

void CCArmatureCacheDisplay::addDBEventListener(const std::string &type) {
    _listenerIDMap[type] = true;
}

void CCArmatureCacheDisplay::removeDBEventListener(const std::string &type) {
    auto it = _listenerIDMap.find(type);
    if (it != _listenerIDMap.end()) {
        _listenerIDMap.erase(it);
    }
}

void CCArmatureCacheDisplay::dispatchDBEvent(const std::string &type, EventObject *value) {
    auto it = _listenerIDMap.find(type);
    if (it == _listenerIDMap.end()) {
        return;
    }

    if (_dbEventCallback) {
        _dbEventCallback(value);
    }
}

void CCArmatureCacheDisplay::updateAnimationCache(const std::string &animationName) {
    _armatureCache->resetAnimationData(animationName);
}

void CCArmatureCacheDisplay::updateAllAnimationCache() {
    _armatureCache->resetAllAnimationData();
}

void CCArmatureCacheDisplay::setColor(float r, float g, float b, float a) {
    _nodeColor.r = r / 255.0f;
    _nodeColor.g = g / 255.0f;
    _nodeColor.b = b / 255.0f;
    _nodeColor.a = a / 255.0f;
}

void CCArmatureCacheDisplay::setAttachEnabled(bool enabled) {
    _useAttach = enabled;
}

se_object_ptr CCArmatureCacheDisplay::getSharedBufferOffset() const {
    if (_sharedBufferOffset) {
        return _sharedBufferOffset->getTypeArray();
    }
    return nullptr;
}

se_object_ptr CCArmatureCacheDisplay::getParamsBuffer() const {
    if (_paramsBuffer) {
        return _paramsBuffer->getTypeArray();
    }
    return nullptr;
}

uint32_t CCArmatureCacheDisplay::getRenderOrder() const {
    if (_paramsBuffer) {
        auto buffer = _paramsBuffer->getBuffer();
        return (uint32_t)buffer[0];
    }
    return 0;
}

DRAGONBONES_NAMESPACE_END
