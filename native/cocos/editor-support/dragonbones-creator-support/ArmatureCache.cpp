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

#include "ArmatureCache.h"
#include "CCFactory.h"
#include "base/TypeDef.h"
#include "base/memory/Memory.h"

USING_NS_MW; // NOLINT(google-build-using-namespace)

using namespace cc; // NOLINT(google-build-using-namespace)

DRAGONBONES_NAMESPACE_BEGIN

float ArmatureCache::FrameTime = 1.0F / 60.0F;
float ArmatureCache::MaxCacheTime = 120.0F;

ArmatureCache::SegmentData::SegmentData() = default;

ArmatureCache::SegmentData::~SegmentData() {
    CC_SAFE_RELEASE_NULL(_texture);
}

void ArmatureCache::SegmentData::setTexture(cc::middleware::Texture2D *value) {
    CC_SAFE_ADD_REF(value);
    CC_SAFE_RELEASE(_texture);
    _texture = value;
}

cc::middleware::Texture2D *ArmatureCache::SegmentData::getTexture() const {
    return _texture;
}

ArmatureCache::FrameData::FrameData() = default;

ArmatureCache::FrameData::~FrameData() {
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

ArmatureCache::BoneData *ArmatureCache::FrameData::buildBoneData(std::size_t index) {
    if (index > _bones.size()) return nullptr;
    if (index == _bones.size()) {
        auto *boneData = new BoneData;
        _bones.push_back(boneData);
    }
    return _bones[index];
}

std::size_t ArmatureCache::FrameData::getBoneCount() const {
    return _bones.size();
}

ArmatureCache::ColorData *ArmatureCache::FrameData::buildColorData(std::size_t index) {
    if (index > _colors.size()) return nullptr;
    if (index == _colors.size()) {
        auto *colorData = new ColorData;
        _colors.push_back(colorData);
    }
    return _colors[index];
}

std::size_t ArmatureCache::FrameData::getColorCount() const {
    return _colors.size();
}

ArmatureCache::SegmentData *ArmatureCache::FrameData::buildSegmentData(std::size_t index) {
    if (index > _segments.size()) return nullptr;
    if (index == _segments.size()) {
        auto *segmentData = new SegmentData;
        _segments.push_back(segmentData);
    }
    return _segments[index];
}

std::size_t ArmatureCache::FrameData::getSegmentCount() const {
    return _segments.size();
}

ArmatureCache::AnimationData::AnimationData() = default;

ArmatureCache::AnimationData::~AnimationData() {
    reset();
}

void ArmatureCache::AnimationData::reset() {
    for (auto &frame : _frames) {
        delete frame;
    }
    _frames.clear();
    _isComplete = false;
    _totalTime = 0.0F;
}

bool ArmatureCache::AnimationData::needUpdate(int toFrameIdx) const {
    return !_isComplete && _totalTime <= MaxCacheTime && (toFrameIdx == -1 || _frames.size() < toFrameIdx + 1);
}

ArmatureCache::FrameData *ArmatureCache::AnimationData::buildFrameData(std::size_t frameIdx) {
    if (frameIdx > _frames.size()) {
        return nullptr;
    }
    if (frameIdx == _frames.size()) {
        auto *frameData = new FrameData();
        _frames.push_back(frameData);
    }
    return _frames[frameIdx];
}

ArmatureCache::FrameData *ArmatureCache::AnimationData::getFrameData(std::size_t frameIdx) const {
    if (frameIdx >= _frames.size()) {
        return nullptr;
    }
    return _frames[frameIdx];
}

std::size_t ArmatureCache::AnimationData::getFrameCount() const {
    return _frames.size();
}

ArmatureCache::ArmatureCache(const std::string &armatureName, const std::string &armatureKey, const std::string &atlasUUID) {
    _armatureDisplay = dragonBones::CCFactory::getFactory()->buildArmatureDisplay(armatureName, armatureKey, "", atlasUUID);
    if (_armatureDisplay) {
        _armatureDisplay->addRef();
    }
}

ArmatureCache::~ArmatureCache() {
    if (_armatureDisplay) {
        _armatureDisplay->release();
        _armatureDisplay = nullptr;
    }

    for (auto &animationCache : _animationCaches) {
        delete animationCache.second;
    }
    _animationCaches.clear();
}

ArmatureCache::AnimationData *ArmatureCache::buildAnimationData(const std::string &animationName) {
    if (!_armatureDisplay) return nullptr;

    AnimationData *aniData = nullptr;
    auto it = _animationCaches.find(animationName);
    if (it == _animationCaches.end()) {
        auto *armature = _armatureDisplay->getArmature();
        auto *animation = armature->getAnimation();
        auto hasAni = animation->hasAnimation(animationName);
        if (!hasAni) return nullptr;

        aniData = new AnimationData();
        aniData->_animationName = animationName;
        _animationCaches[animationName] = aniData;
    } else {
        aniData = it->second;
    }
    return aniData;
}

ArmatureCache::AnimationData *ArmatureCache::getAnimationData(const std::string &animationName) {
    auto it = _animationCaches.find(animationName);
    if (it == _animationCaches.end()) {
        return nullptr;
    }
    return it->second;
}

void ArmatureCache::updateToFrame(const std::string &animationName, int toFrameIdx /*= -1*/) {
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

    auto *armature = _armatureDisplay->getArmature();
    auto *animation = armature->getAnimation();

    // init animation
    if (animationData->getFrameCount() == 0) {
        animation->play(animationName, 1);
    }

    do {
        armature->advanceTime(FrameTime);
        renderAnimationFrame(animationData);
        animationData->_totalTime += FrameTime;
        if (animation->isCompleted()) {
            animationData->_isComplete = true;
        }
    } while (animationData->needUpdate(toFrameIdx));
}

void ArmatureCache::renderAnimationFrame(AnimationData *animationData) {
    std::size_t frameIndex = animationData->getFrameCount();
    _frameData = animationData->buildFrameData(frameIndex);

    _preColor = Color4B(0, 0, 0, 0);
    _color = Color4B(255, 255, 255, 255);

    _preBlendMode = -1;
    _preTextureIndex = -1;
    _curTextureIndex = -1;
    _preISegWritePos = -1;
    _curISegLen = 0;
    _curVSegLen = 0;
    _materialLen = 0;

    auto *armature = _armatureDisplay->getArmature();
    traverseArmature(armature);

    if (_preISegWritePos != -1) {
        SegmentData *preSegmentData = _frameData->buildSegmentData(_materialLen - 1);
        preSegmentData->indexCount = _curISegLen;
        preSegmentData->vertexFloatCount = _curVSegLen;
    }

    auto colorCount = _frameData->getColorCount();
    if (colorCount > 0) {
        ColorData *preColorData = _frameData->buildColorData(colorCount - 1);
        preColorData->vertexFloatOffset = static_cast<int>(_frameData->vb.getCurPos()) / sizeof(float);
    }

    _frameData = nullptr;
}

void ArmatureCache::traverseArmature(Armature *armature, float parentOpacity /*= 1.0f*/) {
    middleware::IOBuffer &vb = _frameData->vb;
    middleware::IOBuffer &ib = _frameData->ib;

    const auto &bones = armature->getBones();
    Bone *bone = nullptr;
    const auto &slots = armature->getSlots();
    CCSlot *slot = nullptr;
    // range [0.0, 1.0]
    Color4B preColor(0, 0, 0, 0);
    Color4B color;
    middleware::Texture2D *texture = nullptr;

    auto flush = [&]() {
        // fill pre segment count field
        if (_preISegWritePos != -1) {
            SegmentData *preSegmentData = _frameData->buildSegmentData(_materialLen - 1);
            preSegmentData->indexCount = _curISegLen;
            preSegmentData->vertexFloatCount = _curVSegLen;
        }

        SegmentData *segmentData = _frameData->buildSegmentData(_materialLen);
        segmentData->setTexture(texture);
        segmentData->blendMode = static_cast<int>(slot->_blendMode);

        // save new segment count pos field
        _preISegWritePos = static_cast<int>(ib.getCurPos() / sizeof(uint16_t));
        // reset pre blend mode to current
        _preBlendMode = static_cast<int>(slot->_blendMode);
        // reset pre texture index to current
        _preTextureIndex = _curTextureIndex;
        // reset index segmentation count
        _curISegLen = 0;
        // reset vertex segmentation count
        _curVSegLen = 0;
        // material length increased
        _materialLen++;
    };

    for (auto *i : bones) {
        bone = i;
        auto boneCount = _frameData->getBoneCount();
        BoneData *boneData = _frameData->buildBoneData(boneCount);
        auto &boneOriginMat = bone->globalTransformMatrix;
        auto &matm = boneData->globalTransformMatrix.m;
        matm[0] = boneOriginMat.a;
        matm[1] = boneOriginMat.b;
        matm[4] = -boneOriginMat.c;
        matm[5] = -boneOriginMat.d;
        matm[12] = boneOriginMat.tx;
        matm[13] = boneOriginMat.ty;
    }

    for (auto *i : slots) {
        slot = dynamic_cast<CCSlot *>(i); // TODO(zhakasi): refine the logic
        if (slot == nullptr) {
            return;
        }
        if (!slot->getVisible()) {
            continue;
        }
        slot->updateWorldMatrix();

        Mat4 *worldMatrix = &slot->worldMatrix;

        // If slots has child armature,will traverse child first.
        Armature *childArmature = slot->getChildArmature();
        if (childArmature != nullptr) {
            traverseArmature(childArmature, parentOpacity * static_cast<float>(slot->color.a) / 255.0F);
            continue;
        }

        texture = slot->getTexture();
        if (!texture) continue;
        _curTextureIndex = texture->getRealTextureIndex();

        auto vbSize = slot->triangles.vertCount * sizeof(middleware::V3F_T2F_C4B);
        vb.checkSpace(vbSize, true);

        // If texture or blendMode change,will change material.
        if (_preTextureIndex != _curTextureIndex || _preBlendMode != static_cast<int>(slot->_blendMode)) {
            flush();
        }

        // Calculation vertex color.
        color.a = static_cast<uint8_t>(slot->color.a * parentOpacity);
        color.r = static_cast<uint8_t>(slot->color.r);
        color.g = static_cast<uint8_t>(slot->color.g);
        color.b = static_cast<uint8_t>(slot->color.b);

        if (preColor != color) {
            preColor = color;
            auto colorCount = _frameData->getColorCount();
            if (colorCount > 0) {
                ColorData *preColorData = _frameData->buildColorData(colorCount - 1);
                preColorData->vertexFloatOffset = vb.getCurPos() / sizeof(float);
            }
            ColorData *colorData = _frameData->buildColorData(colorCount);
            colorData->color = color;
        }

        // Transform component matrix to global matrix
        middleware::Triangles &triangles = slot->triangles;
        middleware::V3F_T2F_C4B *worldTriangles = slot->worldVerts;

        for (int v = 0, w = 0, vn = triangles.vertCount; v < vn; ++v, w += 2) {
            middleware::V3F_T2F_C4B *vertex = triangles.verts + v;
            middleware::V3F_T2F_C4B *worldVertex = worldTriangles + v;

            vertex->vertex.z = 0; //reset for z value
            worldVertex->vertex.transformMat4(vertex->vertex, *worldMatrix);

            worldVertex->color.r = color.r;
            worldVertex->color.g = color.g;
            worldVertex->color.b = color.b;
            worldVertex->color.a = color.a;
        }

        vb.writeBytes(reinterpret_cast<char *>(worldTriangles), vbSize);

        auto ibSize = triangles.indexCount * sizeof(uint16_t);
        ib.checkSpace(ibSize, true);

        auto vertexOffset = _curVSegLen / VF_XYZUVC;
        for (int ii = 0, nn = triangles.indexCount; ii < nn; ii++) {
            ib.writeUint16(triangles.indices[ii] + vertexOffset);
        }

        _curISegLen += triangles.indexCount;
        _curVSegLen += static_cast<int32_t>(vbSize / sizeof(float));
    } // End slot traverse
}

void ArmatureCache::resetAllAnimationData() {
    for (auto &animationCache : _animationCaches) {
        animationCache.second->reset();
    }
}

void ArmatureCache::resetAnimationData(const std::string &animationName) {
    for (auto &animationCache : _animationCaches) {
        if (animationCache.second->_animationName == animationName) {
            animationCache.second->reset();
            break;
        }
    }
}

CCArmatureDisplay *ArmatureCache::getArmatureDisplay() {
    return _armatureDisplay;
}

DRAGONBONES_NAMESPACE_END
