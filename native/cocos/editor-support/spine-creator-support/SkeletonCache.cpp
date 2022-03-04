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

#include "SkeletonCache.h"
#include "spine-creator-support/AttachmentVertices.h"
#include "base/memory/Memory.h"

USING_NS_MW;        // NOLINT(google-build-using-namespace)
using namespace cc; // NOLINT(google-build-using-namespace)

namespace spine {

float SkeletonCache::FrameTime    = 1.0F / 60.0F;
float SkeletonCache::MaxCacheTime = 120.0F;

SkeletonCache::SegmentData::SegmentData() = default;

SkeletonCache::SegmentData::~SegmentData() {
    CC_SAFE_RELEASE_NULL(_texture);
}

void SkeletonCache::SegmentData::setTexture(cc::middleware::Texture2D *value) {
    CC_SAFE_ADD_REF(value);
    CC_SAFE_RELEASE(_texture);
    _texture = value;
}

cc::middleware::Texture2D *SkeletonCache::SegmentData::getTexture() const {
    return _texture;
}

SkeletonCache::FrameData::FrameData() = default;

SkeletonCache::FrameData::~FrameData() {
    for (auto &bone : _bones) {
        delete bone;
    }
    _bones.clear();

    for (auto &color : _colors) {
        delete color;
    }
    _colors.clear();

    for (auto &segment : _segments) {
        delete segment;
    }
    _segments.clear();
}

SkeletonCache::BoneData *SkeletonCache::FrameData::buildBoneData(std::size_t index) {
    if (index > _bones.size()) return nullptr;
    if (index == _bones.size()) {
        auto *boneData = new BoneData;
        _bones.push_back(boneData);
    }
    return _bones[index];
}

std::size_t SkeletonCache::FrameData::getBoneCount() const {
    return _bones.size();
}

SkeletonCache::ColorData *SkeletonCache::FrameData::buildColorData(std::size_t index) {
    if (index > _colors.size()) return nullptr;
    if (index == _colors.size()) {
        auto *colorData = new ColorData;
        _colors.push_back(colorData);
    }
    return _colors[index];
}

std::size_t SkeletonCache::FrameData::getColorCount() const {
    return _colors.size();
}

SkeletonCache::SegmentData *SkeletonCache::FrameData::buildSegmentData(std::size_t index) {
    if (index > _segments.size()) return nullptr;
    if (index == _segments.size()) {
        auto *segmentData = new SegmentData;
        _segments.push_back(segmentData);
    }
    return _segments[index];
}

std::size_t SkeletonCache::FrameData::getSegmentCount() const {
    return _segments.size();
}

SkeletonCache::AnimationData::AnimationData() = default;

SkeletonCache::AnimationData::~AnimationData() {
    reset();
}

void SkeletonCache::AnimationData::reset() {
    for (auto &frame : _frames) {
        delete frame;
    }
    _frames.clear();
    _isComplete = false;
    _totalTime  = 0.0F;
}

bool SkeletonCache::AnimationData::needUpdate(int toFrameIdx) const {
    return !_isComplete && _totalTime <= MaxCacheTime && (toFrameIdx == -1 || _frames.size() < toFrameIdx + 1);
}

SkeletonCache::FrameData *SkeletonCache::AnimationData::buildFrameData(std::size_t frameIdx) {
    if (frameIdx > _frames.size()) {
        return nullptr;
    }
    if (frameIdx == _frames.size()) {
        auto *frameData = new FrameData();
        _frames.push_back(frameData);
    }
    return _frames[frameIdx];
}

SkeletonCache::FrameData *SkeletonCache::AnimationData::getFrameData(std::size_t frameIdx) const {
    if (frameIdx >= _frames.size()) {
        return nullptr;
    }
    return _frames[frameIdx];
}

std::size_t SkeletonCache::AnimationData::getFrameCount() const {
    return _frames.size();
}

SkeletonCache::SkeletonCache() = default;

SkeletonCache::~SkeletonCache() {
    for (auto &animationCache : _animationCaches) {
        delete animationCache.second;
    }
    _animationCaches.clear();
}

SkeletonCache::AnimationData *SkeletonCache::buildAnimationData(const std::string &animationName) {
    AnimationData *aniData = nullptr;
    auto           it      = _animationCaches.find(animationName);
    if (it == _animationCaches.end()) {
        auto *animation = findAnimation(animationName);
        if (animation == nullptr) return nullptr;

        aniData                         = new AnimationData();
        aniData->_animationName         = animationName;
        _animationCaches[animationName] = aniData;
    } else {
        aniData = it->second;
    }
    return aniData;
}

SkeletonCache::AnimationData *SkeletonCache::getAnimationData(const std::string &animationName) {
    auto it = _animationCaches.find(animationName);
    if (it == _animationCaches.end()) {
        return nullptr;
    }
    return it->second;
}

void SkeletonCache::update(float deltaTime) {
    if (!_skeleton) return;
    if (_ownsSkeleton) _skeleton->update(deltaTime);
    _state->update(deltaTime);
    _state->apply(*_skeleton);
    _skeleton->updateWorldTransform();
}

void SkeletonCache::updateToFrame(const std::string &animationName, int toFrameIdx /*= -1*/) {
    auto it = _animationCaches.find(animationName);
    if (it == _animationCaches.end()) {
        return;
    }

    AnimationData *animationData = it->second;
    if (!animationData || !animationData->needUpdate(toFrameIdx)) {
        return;
    }

    if (_curAnimationName != animationName) {
        updateToFrame(_curAnimationName);
        _curAnimationName = animationName;
    }

    // init animation
    if (animationData->getFrameCount() == 0) {
        setAnimation(0, animationName, false);
    }

    do {
        update(FrameTime);
        renderAnimationFrame(animationData);
        animationData->_totalTime += FrameTime;
    } while (animationData->needUpdate(toFrameIdx));
}

void SkeletonCache::renderAnimationFrame(AnimationData *animationData) {
    std::size_t frameIndex = animationData->getFrameCount();
    FrameData * frameData  = animationData->buildFrameData(frameIndex);

    if (!_skeleton) return;

    // If opacity is 0,then return.
    if (_skeleton->getColor().a == 0) {
        return;
    }

    Color4F preColor(-1.0F, -1.0F, -1.0F, -1.0F);
    Color4F preDarkColor(-1.0F, -1.0F, -1.0F, -1.0F);
    // range [0.0, 1.0]
    Color4F color;
    Color4F darkColor;

    AttachmentVertices *  attachmentVertices = nullptr;
    middleware::IOBuffer &vb                 = frameData->vb;
    middleware::IOBuffer &ib                 = frameData->ib;

    // vertex size int bytes with two color
    int vbs2 = sizeof(V2F_T2F_C4F_C4F);
    // vertex size in floats with two color
    int vs2 = static_cast<int32_t>(vbs2 / sizeof(float));

    int vbSize = 0;
    int ibSize = 0;

    int preBlendMode    = -1;
    int preTextureIndex = -1;
    int curTextureIndex = -1;

    int preISegWritePos = -1;
    int curISegLen      = 0;
    int curVSegLen      = 0;

    int   materialLen = 0;
    Slot *slot        = nullptr;

    middleware::Texture2D *texture = nullptr;

    auto flush = [&]() {
        // fill pre segment count field
        if (preISegWritePos != -1) {
            SegmentData *preSegmentData      = frameData->buildSegmentData(materialLen - 1);
            preSegmentData->indexCount       = curISegLen;
            preSegmentData->vertexFloatCount = curVSegLen;
        }

        SegmentData *segmentData = frameData->buildSegmentData(materialLen);
        segmentData->setTexture(texture);
        segmentData->blendMode = slot->getData().getBlendMode();

        // save new segment count pos field
        preISegWritePos = static_cast<int>(ib.getCurPos() / sizeof(uint16_t));
        // reset pre blend mode to current
        preBlendMode = static_cast<int>(slot->getData().getBlendMode());
        // reset pre texture index to current
        preTextureIndex = curTextureIndex;
        // reset index segmentation count
        curISegLen = 0;
        // reset vertex segmentation count
        curVSegLen = 0;
        // material length increased
        materialLen++;
    };

    auto &bones = _skeleton->getBones();
    for (std::size_t i = 0, n = bones.size(); i < n; i++) {
        auto &    bone      = bones[i];
        auto      boneCount = frameData->getBoneCount();
        BoneData *boneData  = frameData->buildBoneData(boneCount);
        auto &    matm      = boneData->globalTransformMatrix.m;
        matm[0]             = bone->getA();
        matm[1]             = bone->getC();
        matm[4]             = bone->getB();
        matm[5]             = bone->getD();
        matm[12]            = bone->getWorldX();
        matm[13]            = bone->getWorldY();
    }

    auto &drawOrder = _skeleton->getDrawOrder();
    for (size_t i = 0, n = drawOrder.size(); i < n; ++i) {
        slot = drawOrder[i];

        if (!slot->getAttachment()) {
            _clipper->clipEnd(*slot);
            continue;
        }

        // Early exit if slot is invisible
        if (slot->getColor().a == 0) {
            _clipper->clipEnd(*slot);
            continue;
        }

        TwoColorTriangles trianglesTwoColor;

        if (slot->getAttachment()->getRTTI().isExactly(RegionAttachment::rtti)) {
            auto *attachment   = dynamic_cast<RegionAttachment *>(slot->getAttachment());
            attachmentVertices = static_cast<AttachmentVertices *>(attachment->getRendererObject());

            // Early exit if attachment is invisible
            if (attachment->getColor().a == 0) {
                _clipper->clipEnd(*slot);
                continue;
            }

            trianglesTwoColor.vertCount = attachmentVertices->_triangles->vertCount;
            vbSize                      = static_cast<int32_t>(trianglesTwoColor.vertCount * sizeof(V2F_T2F_C4F_C4F));
            vb.checkSpace(vbSize, true);
            trianglesTwoColor.verts = reinterpret_cast<V2F_T2F_C4F_C4F *>(vb.getCurBuffer());
            for (int ii = 0; ii < trianglesTwoColor.vertCount; ii++) {
                trianglesTwoColor.verts[ii].texCoord = attachmentVertices->_triangles->verts[ii].texCoord;
            }
            attachment->computeWorldVertices(slot->getBone(), reinterpret_cast<float *>(trianglesTwoColor.verts), 0, vs2);

            trianglesTwoColor.indexCount = attachmentVertices->_triangles->indexCount;
            ibSize                       = static_cast<int32_t>(trianglesTwoColor.indexCount * sizeof(uint16_t));
            ib.checkSpace(ibSize, true);
            trianglesTwoColor.indices = reinterpret_cast<uint16_t *>(ib.getCurBuffer());
            memcpy(trianglesTwoColor.indices, attachmentVertices->_triangles->indices, ibSize);

            color.r = attachment->getColor().r;
            color.g = attachment->getColor().g;
            color.b = attachment->getColor().b;
            color.a = attachment->getColor().a;

        } else if (slot->getAttachment()->getRTTI().isExactly(MeshAttachment::rtti)) {
            auto *attachment   = dynamic_cast<MeshAttachment *>(slot->getAttachment());
            attachmentVertices = static_cast<AttachmentVertices *>(attachment->getRendererObject());

            // Early exit if attachment is invisible
            if (attachment->getColor().a == 0) {
                _clipper->clipEnd(*slot);
                continue;
            }

            trianglesTwoColor.vertCount = attachmentVertices->_triangles->vertCount;
            vbSize                      = static_cast<int32_t>(trianglesTwoColor.vertCount * sizeof(V2F_T2F_C4F_C4F));
            vb.checkSpace(vbSize, true);
            trianglesTwoColor.verts = reinterpret_cast<V2F_T2F_C4F_C4F *>(vb.getCurBuffer());
            for (int ii = 0; ii < trianglesTwoColor.vertCount; ii++) {
                trianglesTwoColor.verts[ii].texCoord = attachmentVertices->_triangles->verts[ii].texCoord;
            }
            attachment->computeWorldVertices(*slot, 0, attachment->getWorldVerticesLength(), reinterpret_cast<float *>(trianglesTwoColor.verts), 0, vs2);

            trianglesTwoColor.indexCount = attachmentVertices->_triangles->indexCount;
            ibSize                       = static_cast<int32_t>(trianglesTwoColor.indexCount * sizeof(uint16_t));
            ib.checkSpace(ibSize, true);
            trianglesTwoColor.indices = reinterpret_cast<uint16_t *>(ib.getCurBuffer());
            memcpy(trianglesTwoColor.indices, attachmentVertices->_triangles->indices, ibSize);

            color.r = attachment->getColor().r;
            color.g = attachment->getColor().g;
            color.b = attachment->getColor().b;
            color.a = attachment->getColor().a;

        } else if (slot->getAttachment()->getRTTI().isExactly(ClippingAttachment::rtti)) {
            auto *clip = dynamic_cast<ClippingAttachment *>(slot->getAttachment());
            _clipper->clipStart(*slot, clip);
            continue;
        } else {
            _clipper->clipEnd(*slot);
            continue;
        }

        color.a = _skeleton->getColor().a * slot->getColor().a * color.a * 255;
        // skip rendering if the color of this attachment is 0
        if (color.a == 0) {
            _clipper->clipEnd(*slot);
            continue;
        }

        float red   = _skeleton->getColor().r * color.r * 255;
        float green = _skeleton->getColor().g * color.g * 255;
        float blue  = _skeleton->getColor().b * color.b * 255;

        color.r = red * slot->getColor().r;
        color.g = green * slot->getColor().g;
        color.b = blue * slot->getColor().b;

        if (slot->hasDarkColor()) {
            darkColor.r = red * slot->getDarkColor().r;
            darkColor.g = green * slot->getDarkColor().g;
            darkColor.b = blue * slot->getDarkColor().b;
        } else {
            darkColor.r = 0;
            darkColor.g = 0;
            darkColor.b = 0;
        }
        darkColor.a = 0;

        if (preColor != color || preDarkColor != darkColor) {
            preColor        = color;
            preDarkColor    = darkColor;
            auto colorCount = frameData->getColorCount();
            if (colorCount > 0) {
                ColorData *preColorData         = frameData->buildColorData(colorCount - 1);
                preColorData->vertexFloatOffset = static_cast<int>(vb.getCurPos() / sizeof(float));
            }
            ColorData *colorData  = frameData->buildColorData(colorCount);
            colorData->finalColor = color;
            colorData->darkColor  = darkColor;
        }

        // Two color tint logic
        if (_clipper->isClipping()) {
            _clipper->clipTriangles(reinterpret_cast<float *>(&trianglesTwoColor.verts[0].vertex), trianglesTwoColor.indices, trianglesTwoColor.indexCount, reinterpret_cast<float *>(&trianglesTwoColor.verts[0].texCoord), vs2);

            if (_clipper->getClippedTriangles().size() == 0) {
                _clipper->clipEnd(*slot);
                continue;
            }

            trianglesTwoColor.vertCount = static_cast<int>(_clipper->getClippedVertices().size()) >> 1;
            vbSize                      = static_cast<int32_t>(trianglesTwoColor.vertCount * sizeof(V2F_T2F_C4F_C4F));
            vb.checkSpace(vbSize, true);
            trianglesTwoColor.verts = reinterpret_cast<V2F_T2F_C4F_C4F *>(vb.getCurBuffer());

            trianglesTwoColor.indexCount = static_cast<int>(_clipper->getClippedTriangles().size());
            ibSize                       = static_cast<int32_t>(trianglesTwoColor.indexCount * sizeof(uint16_t));
            ib.checkSpace(ibSize, true);
            trianglesTwoColor.indices = reinterpret_cast<uint16_t *>(ib.getCurBuffer());
            memcpy(trianglesTwoColor.indices, _clipper->getClippedTriangles().buffer(), sizeof(uint16_t) * _clipper->getClippedTriangles().size());

            float *verts = _clipper->getClippedVertices().buffer();
            float *uvs   = _clipper->getClippedUVs().buffer();

            for (int v = 0, vn = trianglesTwoColor.vertCount, vv = 0; v < vn; ++v, vv += 2) {
                V2F_T2F_C4F_C4F *vertex = trianglesTwoColor.verts + v;
                vertex->vertex.x        = verts[vv];
                vertex->vertex.y        = verts[vv + 1];
                vertex->texCoord.u      = uvs[vv];
                vertex->texCoord.v      = uvs[vv + 1];
                vertex->color.r         = color.r / 255.0F;
                vertex->color.g         = color.g / 255.0F;
                vertex->color.b         = color.b / 255.0F;
                vertex->color.a         = color.a / 255.0F;
                vertex->color2.r        = darkColor.r / 255.0F;
                vertex->color2.g        = darkColor.g / 255.0F;
                vertex->color2.b        = darkColor.b / 255.0F;
                vertex->color2.a        = darkColor.a / 255.0F;
            }
        } else {
            for (int v = 0, vn = trianglesTwoColor.vertCount; v < vn; ++v) {
                V2F_T2F_C4F_C4F *vertex = trianglesTwoColor.verts + v;
                vertex->color.r         = color.r / 255.0F;
                vertex->color.g         = color.g / 255.0F;
                vertex->color.b         = color.b / 255.0F;
                vertex->color.a         = color.a / 255.0F;
                vertex->color2.r        = darkColor.r / 255.0F;
                vertex->color2.g        = darkColor.g / 255.0F;
                vertex->color2.b        = darkColor.b / 255.0F;
                vertex->color2.a        = darkColor.a / 255.0F;
            }
        }

        texture         = attachmentVertices->_texture;
        curTextureIndex = attachmentVertices->_texture->getRealTextureIndex();
        // If texture or blendMode change,will change material.
        if (preTextureIndex != curTextureIndex || preBlendMode != slot->getData().getBlendMode()) {
            flush();
        }

        if (vbSize > 0 && ibSize > 0) {
            auto vertexOffset = curVSegLen / vs2;

            if (vertexOffset > 0) {
                auto *ibBuffer = reinterpret_cast<uint16_t *>(ib.getCurBuffer());
                for (uint32_t ii = 0, nn = ibSize / sizeof(uint16_t); ii < nn; ii++) {
                    ibBuffer[ii] += vertexOffset;
                }
            }
            vb.move(vbSize);
            ib.move(ibSize);

            // Record this turn index segmentation count,it will store in material buffer in the end.
            curISegLen += static_cast<int32_t>(ibSize / sizeof(uint16_t));
            curVSegLen += static_cast<int32_t>(vbSize / sizeof(float));
        }

        _clipper->clipEnd(*slot);
    } // End slot traverse

    _clipper->clipEnd();

    if (preISegWritePos != -1) {
        SegmentData *preSegmentData      = frameData->buildSegmentData(materialLen - 1);
        preSegmentData->indexCount       = curISegLen;
        preSegmentData->vertexFloatCount = curVSegLen;
    }

    auto colorCount = frameData->getColorCount();
    if (colorCount > 0) {
        ColorData *preColorData         = frameData->buildColorData(colorCount - 1);
        preColorData->vertexFloatOffset = static_cast<int>(vb.getCurPos() / sizeof(float));
    }
}

void SkeletonCache::onAnimationStateEvent(TrackEntry *entry, EventType type, Event *event) {
    SkeletonAnimation::onAnimationStateEvent(entry, type, event);
    if (type == EventType_Complete && entry) {
        Animation *ani = entry->getAnimation();
        if (!ani) return;
        std::string aniName = ani->getName().buffer();
        if (aniName == _curAnimationName) {
            AnimationData *aniData = getAnimationData(_curAnimationName);
            if (!aniData) return;
            aniData->_isComplete = true;
        }
    }
}

void SkeletonCache::resetAllAnimationData() {
    for (auto &animationCache : _animationCaches) {
        animationCache.second->reset();
    }
}

void SkeletonCache::resetAnimationData(const std::string &animationName) {
    for (auto &animationCache : _animationCaches) {
        if (animationCache.second->_animationName == animationName) {
            animationCache.second->reset();
            break;
        }
    }
}
} // namespace spine
