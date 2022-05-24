/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#include "SkeletonCacheAnimation.h"
#include "MiddlewareMacro.h"
#include "SharedBufferManager.h"
#include "SkeletonCacheMgr.h"
#include "base/TypeDef.h"
#include "base/memory/Memory.h"
#include "gfx-base/GFXDef.h"
#include "math/Math.h"

USING_NS_MW; // NOLINT(google-build-using-namespace)

using namespace cc;      // NOLINT(google-build-using-namespace)
using namespace cc::gfx; // NOLINT(google-build-using-namespace)
static const std::string TECH_STAGE  = "opaque";
static const std::string TEXTURE_KEY = "texture";

namespace spine {

SkeletonCacheAnimation::SkeletonCacheAnimation(const std::string &uuid, bool isShare) {
    if (isShare) {
        _skeletonCache = SkeletonCacheMgr::getInstance()->buildSkeletonCache(uuid);
        _skeletonCache->addRef();
    } else {
        _skeletonCache = new SkeletonCache();
        _skeletonCache->initWithUUID(uuid);
    }

    // store global TypedArray begin and end offset
    _sharedBufferOffset = new IOTypedArray(se::Object::TypedArrayType::UINT32, sizeof(uint32_t) * 2);

    // store render order(1), world matrix(16)
    _paramsBuffer = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, sizeof(float) * 17);
    // set render order to 0
    _paramsBuffer->writeFloat32(0);
    // set world transform to identity
    _paramsBuffer->writeBytes(reinterpret_cast<const char *>(&cc::Mat4::IDENTITY), sizeof(float) * 16);

    beginSchedule();
}

SkeletonCacheAnimation::~SkeletonCacheAnimation() {
    if (_sharedBufferOffset) {
        delete _sharedBufferOffset;
        _sharedBufferOffset = nullptr;
    }

    if (_paramsBuffer) {
        delete _paramsBuffer;
        _paramsBuffer = nullptr;
    }

    if (_skeletonCache) {
        _skeletonCache->release();
        _skeletonCache = nullptr;
    }
    while (!_animationQueue.empty()) {
        auto *ani = _animationQueue.front();
        _animationQueue.pop();
        delete ani;
    }
    stopSchedule();
}

void SkeletonCacheAnimation::update(float dt) {
    if (_paused) return;

    auto gTimeScale = SkeletonAnimation::GlobalTimeScale;
    dt *= _timeScale * gTimeScale;

    if (_isAniComplete) {
        if (_animationQueue.empty() && !_headAnimation) {
            if (_animationData && !_animationData->isComplete()) {
                _skeletonCache->updateToFrame(_animationName);
            }
            return;
        }
        if (!_headAnimation) {
            _headAnimation = _animationQueue.front();
            _animationQueue.pop();
        }
        if (!_headAnimation) {
            return;
        }
        _accTime += dt;
        if (_accTime > _headAnimation->delay) {
            std::string name = _headAnimation->animationName;
            bool        loop = _headAnimation->loop;
            delete _headAnimation;
            _headAnimation = nullptr;
            setAnimation(name, loop);
            return;
        }
    }

    if (!_animationData) return;

    if (_accTime <= 0.00001 && _playCount == 0) {
        if (_startListener) {
            _startListener(_animationName);
        }
    }

    _accTime += dt;
    int frameIdx = floor(_accTime / SkeletonCache::FrameTime);
    if (!_animationData->isComplete()) {
        _skeletonCache->updateToFrame(_animationName, frameIdx);
    }

    int finalFrameIndex = static_cast<int>(_animationData->getFrameCount()) - 1;
    if (_animationData->isComplete() && frameIdx >= finalFrameIndex) {
        _playCount++;
        _accTime = 0.0F;
        if (_playTimes > 0 && _playCount >= _playTimes) {
            frameIdx       = finalFrameIndex;
            _playCount     = 0;
            _isAniComplete = true;
        } else {
            frameIdx = 0;
        }
        if (_endListener) {
            _endListener(_animationName);
        }
        if (_completeListener) {
            _completeListener(_animationName);
        }
    }
    _curFrameIndex = frameIdx;
}

void SkeletonCacheAnimation::render(float /*dt*/) {
    if (!_animationData) return;
    SkeletonCache::FrameData *frameData = _animationData->getFrameData(_curFrameIndex);
    if (!frameData) return;

    const auto &segments = frameData->getSegments();
    const auto &colors   = frameData->getColors();
    if (segments.empty() || colors.empty()) return;

    auto *mgr = MiddlewareManager::getInstance();
    if (!mgr->isRendering) return;

    _sharedBufferOffset->reset();
    _sharedBufferOffset->clear();

    auto *renderMgr  = mgr->getRenderInfoMgr();
    auto *renderInfo = renderMgr->getBuffer();
    if (!renderInfo) return;

    auto *attachMgr  = mgr->getAttachInfoMgr();
    auto *attachInfo = attachMgr->getBuffer();
    if (!attachInfo) return;

    //  store render info offset
    _sharedBufferOffset->writeUint32(static_cast<uint32_t>(renderInfo->getCurPos()) / sizeof(uint32_t));
    // store attach info offset
    _sharedBufferOffset->writeUint32(static_cast<uint32_t>(attachInfo->getCurPos()) / sizeof(uint32_t));

    // check enough space
    renderInfo->checkSpace(sizeof(uint32_t) * 2, true);
    // write border
    renderInfo->writeUint32(0xffffffff);

    // material len
    renderInfo->writeUint32(segments.size());

    auto                    vertexFormat = _useTint ? VF_XYZUVCC : VF_XYZUVC;
    middleware::MeshBuffer *mb           = mgr->getMeshBuffer(vertexFormat);
    middleware::IOBuffer &  vb           = mb->getVB();
    middleware::IOBuffer &  ib           = mb->getIB();
    const auto &            srcVB        = frameData->vb;
    const auto &            srcIB        = frameData->ib;

    // vertex size int bytes with one color
    int vbs1 = sizeof(V2F_T2F_C4F);
    // vertex size in floats with one color
    int vs1 = static_cast<int32_t>(vbs1 / sizeof(float));
    // vertex size int bytes with two color
    int vbs2 = sizeof(V2F_T2F_C4F_C4F);
    // vertex size in floats with two color
    int vs2 = static_cast<int32_t>(vbs2 / sizeof(float));

    int vs  = _useTint ? vs2 : vs1;
    int vbs = _useTint ? vbs2 : vbs1;

    auto *          paramsBuffer = _paramsBuffer->getBuffer();
    const cc::Mat4 &nodeWorldMat = *reinterpret_cast<cc::Mat4 *>(&paramsBuffer[4]);

    int                       colorOffset = 0;
    SkeletonCache::ColorData *nowColor    = colors[colorOffset++];
    auto                      maxVFOffset = nowColor->vertexFloatOffset;

    Color4F       finalColor;
    Color4F       darkColor;
    float         tempR                = 0.0F;
    float         tempG                = 0.0F;
    float         tempB                = 0.0F;
    float         tempA                = 0.0F;
    float         multiplier           = 1.0F;
    int           srcVertexBytesOffset = 0;
    int           srcVertexBytes       = 0;
    int           vertexBytes          = 0;
    int           vertexFloats         = 0;
    int           tintBytes            = 0;
    int           srcIndexBytesOffset  = 0;
    int           indexBytes           = 0;
    int           curTextureIndex      = 0;
    double        effectHash           = 0;
    int           blendMode            = 0;
    int           dstVertexOffset      = 0;
    int           dstIndexOffset       = 0;
    float *       dstVertexBuffer      = nullptr;
    unsigned int *dstColorBuffer       = nullptr;
    uint16_t *    dstIndexBuffer       = nullptr;
    bool          needColor            = false;
    int           curBlendSrc          = -1;
    int           curBlendDst          = -1;

    if (abs(_nodeColor.r - 1.0F) > 0.0001F ||
        abs(_nodeColor.g - 1.0F) > 0.0001F ||
        abs(_nodeColor.b - 1.0F) > 0.0001F ||
        abs(_nodeColor.a - 1.0F) > 0.0001F ||
        _premultipliedAlpha) {
        needColor = true;
    }

    auto handleColor = [&](SkeletonCache::ColorData *colorData) {
        tempA      = colorData->finalColor.a * _nodeColor.a;
        multiplier = _premultipliedAlpha ? tempA / 255 : 1;
        tempR      = _nodeColor.r * multiplier;
        tempG      = _nodeColor.g * multiplier;
        tempB      = _nodeColor.b * multiplier;

        finalColor.a = tempA / 255.0f;
        finalColor.r = (colorData->finalColor.r * tempR) / 255.0f;
        finalColor.g = (colorData->finalColor.g * tempG) / 255.0f;
        finalColor.b = (colorData->finalColor.b * tempB) / 255.0f;

        darkColor.r = (colorData->darkColor.r * tempR) / 255.0f;
        darkColor.g = (colorData->darkColor.g * tempG) / 255.0f;
        darkColor.b = (colorData->darkColor.b * tempB) / 255.0f;
        darkColor.a = _premultipliedAlpha ? 1.0f : 0.0f;
    };

    handleColor(nowColor);

    for (auto *segment : segments) {
        srcVertexBytes = static_cast<int32_t>(segment->vertexFloatCount * sizeof(float));
        if (!_useTint) {
            tintBytes    = static_cast<int32_t>(segment->vertexFloatCount / vs2 * sizeof(float));
            vertexBytes  = srcVertexBytes - tintBytes;
            vertexFloats = static_cast<int32_t>(vertexBytes / sizeof(float));
        } else {
            vertexBytes  = srcVertexBytes;
            vertexFloats = segment->vertexFloatCount;
        }

        // check enough space
        renderInfo->checkSpace(sizeof(uint32_t) * 6, true);

        // fill new texture index
        curTextureIndex = segment->getTexture()->getRealTextureIndex();
        renderInfo->writeUint32(curTextureIndex);

        blendMode = segment->blendMode;
        switch (blendMode) {
            case BlendMode_Additive:
                curBlendSrc = static_cast<int>(_premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA);
                curBlendDst = static_cast<int>(BlendFactor::ONE);
                break;
            case BlendMode_Multiply:
                curBlendSrc = static_cast<int>(BlendFactor::DST_COLOR);
                curBlendDst = static_cast<int>(BlendFactor::ONE_MINUS_SRC_ALPHA);
                break;
            case BlendMode_Screen:
                curBlendSrc = static_cast<int>(BlendFactor::ONE);
                curBlendDst = static_cast<int>(BlendFactor::ONE_MINUS_SRC_COLOR);
                break;
            default:
                curBlendSrc = static_cast<int>(_premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA);
                curBlendDst = static_cast<int>(BlendFactor::ONE_MINUS_SRC_ALPHA);
        }
        // fill new blend src and dst
        renderInfo->writeUint32(curBlendSrc);
        renderInfo->writeUint32(curBlendDst);

        // fill vertex buffer
        vb.checkSpace(vertexBytes, true);
        dstVertexOffset = static_cast<int>(vb.getCurPos()) / vbs;
        dstVertexBuffer = reinterpret_cast<float *>(vb.getCurBuffer());
        dstColorBuffer  = reinterpret_cast<unsigned int *>(vb.getCurBuffer());
        if (!_useTint) {
            char *srcBuffer = reinterpret_cast<char *>(srcVB.getBuffer()) + srcVertexBytesOffset;
            for (std::size_t srcBufferIdx = 0; srcBufferIdx < srcVertexBytes; srcBufferIdx += vbs2) {
                vb.writeBytes(srcBuffer + srcBufferIdx, vbs);
            }
        } else {
            vb.writeBytes(reinterpret_cast<char *>(srcVB.getBuffer()) + srcVertexBytesOffset, vertexBytes);
        }

        // batch handle
        if (_batch) {
            cc::Vec3 *point = nullptr;
            for (auto posIndex = 0; posIndex < vertexFloats; posIndex += vs) {
                point = reinterpret_cast<cc::Vec3 *>(dstVertexBuffer + posIndex);
                // force z value to zero
                point->z = 0;
                point->transformMat4(*point, nodeWorldMat);
            }
        }

        // handle vertex color
        if (needColor) {
            int srcVertexFloatOffset = static_cast<int16_t>(srcVertexBytesOffset / sizeof(float));
            if (_useTint) {
                for (auto colorIndex = 0; colorIndex < vertexFloats; colorIndex += vs, srcVertexFloatOffset += vs2) {
                    if (srcVertexFloatOffset >= maxVFOffset) {
                        nowColor = colors[colorOffset++];
                        handleColor(nowColor);
                        maxVFOffset = nowColor->vertexFloatOffset;
                    }
                    memcpy(dstColorBuffer + colorIndex + 5, &finalColor, sizeof(finalColor));
                    memcpy(dstColorBuffer + colorIndex + 9, &darkColor, sizeof(darkColor));
                }
            } else {
                for (auto colorIndex = 0; colorIndex < vertexFloats; colorIndex += vs, srcVertexFloatOffset += vs2) {
                    if (srcVertexFloatOffset >= maxVFOffset) {
                        nowColor = colors[colorOffset++];
                        handleColor(nowColor);
                        maxVFOffset = nowColor->vertexFloatOffset;
                    }
                    memcpy(dstColorBuffer + colorIndex + 5, &finalColor, sizeof(finalColor));
                }
            }
        }

        // move src vertex buffer offset
        srcVertexBytesOffset += srcVertexBytes;

        // fill index buffer
        indexBytes = static_cast<int32_t>(segment->indexCount * sizeof(uint16_t));
        ib.checkSpace(indexBytes, true);
        dstIndexOffset = static_cast<int32_t>(ib.getCurPos() / sizeof(uint16_t));
        dstIndexBuffer = reinterpret_cast<uint16_t *>(ib.getCurBuffer());
        ib.writeBytes(reinterpret_cast<char *>(srcIB.getBuffer()) + srcIndexBytesOffset, indexBytes);
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
        const auto &bonesData = frameData->getBones();
        auto        boneCount = frameData->getBoneCount();

        for (std::size_t i = 0, n = boneCount; i < n; i++) {
            auto *bone = bonesData[i];
            attachInfo->checkSpace(sizeof(cc::Mat4), true);
            attachInfo->writeBytes(reinterpret_cast<const char *>(&bone->globalTransformMatrix), sizeof(cc::Mat4));
        }
    }
}

Skeleton *SkeletonCacheAnimation::getSkeleton() const {
    return _skeletonCache->getSkeleton();
}

void SkeletonCacheAnimation::setTimeScale(float scale) {
    _timeScale = scale;
}

float SkeletonCacheAnimation::getTimeScale() const {
    return _timeScale;
}

void SkeletonCacheAnimation::paused(bool value) {
    _paused = value;
}

Bone *SkeletonCacheAnimation::findBone(const std::string &boneName) const {
    return _skeletonCache->findBone(boneName);
}

Slot *SkeletonCacheAnimation::findSlot(const std::string &slotName) const {
    return _skeletonCache->findSlot(slotName);
}

void SkeletonCacheAnimation::setSkin(const std::string &skinName) {
    _skeletonCache->setSkin(skinName);
    _skeletonCache->resetAllAnimationData();
}

void SkeletonCacheAnimation::setSkin(const char *skinName) {
    _skeletonCache->setSkin(skinName);
    _skeletonCache->resetAllAnimationData();
}

Attachment *SkeletonCacheAnimation::getAttachment(const std::string &slotName, const std::string &attachmentName) const {
    return _skeletonCache->getAttachment(slotName, attachmentName);
}

bool SkeletonCacheAnimation::setAttachment(const std::string &slotName, const std::string &attachmentName) {
    auto ret = _skeletonCache->setAttachment(slotName, attachmentName);
    _skeletonCache->resetAllAnimationData();
    return ret;
}

bool SkeletonCacheAnimation::setAttachment(const std::string &slotName, const char *attachmentName) {
    auto ret = _skeletonCache->setAttachment(slotName, attachmentName);
    _skeletonCache->resetAllAnimationData();
    return ret;
}

void SkeletonCacheAnimation::setColor(float r, float g, float b, float a) {
    _nodeColor.r = r / 255.0F;
    _nodeColor.g = g / 255.0F;
    _nodeColor.b = b / 255.0F;
    _nodeColor.a = a / 255.0F;
}

void SkeletonCacheAnimation::setBatchEnabled(bool enabled) {
    // disable switch batch mode, force to enable batch, it may be changed in future version
    // _batch = enabled;
}

void SkeletonCacheAnimation::setOpacityModifyRGB(bool value) {
    _premultipliedAlpha = value;
}

bool SkeletonCacheAnimation::isOpacityModifyRGB() const {
    return _premultipliedAlpha;
}

void SkeletonCacheAnimation::beginSchedule() {
    MiddlewareManager::getInstance()->addTimer(this);
}

void SkeletonCacheAnimation::stopSchedule() {
    MiddlewareManager::getInstance()->removeTimer(this);

    if (_sharedBufferOffset) {
        _sharedBufferOffset->reset();
        _sharedBufferOffset->clear();
    }
}

void SkeletonCacheAnimation::onEnable() {
    beginSchedule();
}

void SkeletonCacheAnimation::onDisable() {
    stopSchedule();
}

void SkeletonCacheAnimation::setUseTint(bool enabled) {
    // cache mode default enable use tint
    // _useTint = enabled;
}

void SkeletonCacheAnimation::setAttachEnabled(bool enabled) {
    _useAttach = enabled;
}

void SkeletonCacheAnimation::setAnimation(const std::string &name, bool loop) {
    _playTimes     = loop ? 0 : 1;
    _animationName = name;
    _animationData = _skeletonCache->buildAnimationData(_animationName);
    _isAniComplete = false;
    _accTime       = 0.0F;
    _playCount     = 0;
    _curFrameIndex = 0;
}

void SkeletonCacheAnimation::addAnimation(const std::string &name, bool loop, float delay) {
    auto *aniInfo          = new AniQueueData();
    aniInfo->animationName = name;
    aniInfo->loop          = loop;
    aniInfo->delay         = delay;
    _animationQueue.push(aniInfo);
}

Animation *SkeletonCacheAnimation::findAnimation(const std::string &name) const {
    return _skeletonCache->findAnimation(name);
}

void SkeletonCacheAnimation::setStartListener(const CacheFrameEvent &listener) {
    _startListener = listener;
}

void SkeletonCacheAnimation::setEndListener(const CacheFrameEvent &listener) {
    _endListener = listener;
}

void SkeletonCacheAnimation::setCompleteListener(const CacheFrameEvent &listener) {
    _completeListener = listener;
}

void SkeletonCacheAnimation::updateAnimationCache(const std::string &animationName) {
    _skeletonCache->resetAnimationData(animationName);
}

void SkeletonCacheAnimation::updateAllAnimationCache() {
    _skeletonCache->resetAllAnimationData();
}

se_object_ptr SkeletonCacheAnimation::getSharedBufferOffset() const {
    if (_sharedBufferOffset) {
        return _sharedBufferOffset->getTypeArray();
    }
    return nullptr;
}

se_object_ptr SkeletonCacheAnimation::getParamsBuffer() const {
    if (_paramsBuffer) {
        return _paramsBuffer->getTypeArray();
    }
    return nullptr;
}

uint32_t SkeletonCacheAnimation::getRenderOrder() const {
    if (_paramsBuffer) {
        auto *buffer = _paramsBuffer->getBuffer();
        return static_cast<uint32_t>(buffer[0]);
    }
    return 0;
}

void SkeletonCacheAnimation::setToSetupPose() {
    if (_skeletonCache) {
        _skeletonCache->setToSetupPose();
    }
}

void SkeletonCacheAnimation::setBonesToSetupPose() {
    if (_skeletonCache) {
        _skeletonCache->setBonesToSetupPose();
    }
}

void SkeletonCacheAnimation::setSlotsToSetupPose() {
    if (_skeletonCache) {
        _skeletonCache->setSlotsToSetupPose();
    }
}
} // namespace spine
