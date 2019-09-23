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

#include "ArmatureCache.h"
#include "CCFactory.h"
#include "base/ccTypes.h"
#include "renderer/gfx/Texture.h"

USING_NS_CC;
USING_NS_MW;
using namespace cocos2d::renderer;

DRAGONBONES_NAMESPACE_BEGIN

float ArmatureCache::FrameTime = 1.0f / 60.0f;
float ArmatureCache::MaxCacheTime = 120.0f;

ArmatureCache::SegmentData::SegmentData() 
{

}

ArmatureCache::SegmentData::~SegmentData() 
{
    CC_SAFE_RELEASE_NULL(_texture);
}

void ArmatureCache::SegmentData::setTexture(cocos2d::middleware::Texture2D* value) 
{
    CC_SAFE_RETAIN(value);
    CC_SAFE_RELEASE(_texture);
    _texture = value;
}

cocos2d::middleware::Texture2D* ArmatureCache::SegmentData::getTexture() const 
{
    return _texture;
}

ArmatureCache::FrameData::FrameData() 
{

}

ArmatureCache::FrameData::~FrameData() 
{
    for (std::size_t i = 0, c = _colors.size(); i < c; i++) 
    {
        delete _colors[i];
    }
    _colors.clear();

    for (std::size_t i = 0, c = _segments.size(); i < c; i++) 
    {
        delete _segments[i];
    }
    _segments.clear();
}

ArmatureCache::ColorData* ArmatureCache::FrameData::buildColorData(std::size_t index) 
{
    if (index > _colors.size()) return nullptr;
    if (index == _colors.size()) {
        ColorData* colorData = new ColorData;
        _colors.push_back(colorData);
    }
    return _colors[index];
}

std::size_t ArmatureCache::FrameData::getColorCount() const 
{
    return _colors.size();
}

ArmatureCache::SegmentData* ArmatureCache::FrameData::buildSegmentData(std::size_t index) 
{
    if (index > _segments.size()) return nullptr;
    if (index == _segments.size()) 
    {
        SegmentData* segmentData = new SegmentData;
        _segments.push_back(segmentData);
    }
    return _segments[index];
}

std::size_t ArmatureCache::FrameData::getSegmentCount() const 
{
    return _segments.size();
}

ArmatureCache::AnimationData::AnimationData() 
{

}

ArmatureCache::AnimationData::~AnimationData() 
{
    reset();
}

void ArmatureCache::AnimationData::reset() 
{
    for (std::size_t i = 0, c = _frames.size(); i < c; i++) 
    {
        delete _frames[i];
    }
    _frames.clear();
    _isComplete = false;
    _totalTime = 0.0f;
}

bool ArmatureCache::AnimationData::needUpdate(int toFrameIdx) const 
{
    return !_isComplete && _totalTime <= MaxCacheTime && (toFrameIdx == -1 || _frames.size() < toFrameIdx + 1);
}

ArmatureCache::FrameData* ArmatureCache::AnimationData::buildFrameData(std::size_t frameIdx) 
{
    if (frameIdx > _frames.size()) 
    {
        return nullptr;
    }
    if (frameIdx == _frames.size()) 
    {
        auto frameData = new FrameData();
        _frames.push_back(frameData);
    }
    return _frames[frameIdx];
}

ArmatureCache::FrameData* ArmatureCache::AnimationData::getFrameData(std::size_t frameIdx) const 
{
    if (frameIdx >= _frames.size()) 
    {
        return nullptr;
    }
    return _frames[frameIdx];
}

std::size_t ArmatureCache::AnimationData::getFrameCount() const 
{
    return _frames.size();
}

ArmatureCache::ArmatureCache(const std::string& armatureName, const std::string& armatureKey, const std::string& atlasUUID)
{
    _armatureDisplay = dragonBones::CCFactory::getFactory()->buildArmatureDisplay(armatureName, armatureKey, "", atlasUUID);
    if (_armatureDisplay) 
    {
        _armatureDisplay->retain();
    }
}

ArmatureCache::~ArmatureCache() 
{
    if (_armatureDisplay) 
    {
        _armatureDisplay->release();
        _armatureDisplay = nullptr;
    }

    for (auto it = _animationCaches.begin(); it != _animationCaches.end(); it++) 
    {
        delete it->second;
    }
    _animationCaches.clear();
}

ArmatureCache::AnimationData* ArmatureCache::buildAnimationData(const std::string& animationName) 
{
    if (!_armatureDisplay) return nullptr;

    AnimationData* aniData = nullptr;
    auto it = _animationCaches.find(animationName);
    if (it == _animationCaches.end()) 
    {
        auto armature = _armatureDisplay->getArmature();
        auto animation = armature->getAnimation();
        auto hasAni = animation->hasAnimation(animationName);
        if (!hasAni) return nullptr;

        aniData = new AnimationData();
        aniData->_animationName = animationName;
        _animationCaches[animationName] = aniData;
    }
    else 
    {
        aniData = it->second;
    }
    return aniData;
}

ArmatureCache::AnimationData* ArmatureCache::getAnimationData(const std::string& animationName) 
{
    auto it = _animationCaches.find(animationName);
    if (it == _animationCaches.end()) 
    {
        return nullptr;
    }
    else 
    {
        return it->second;
    }
}

void ArmatureCache::updateToFrame(const std::string& animationName, int toFrameIdx/*= -1*/) 
{
    auto it = _animationCaches.find(animationName);
    if (it == _animationCaches.end()) 
    {
        return;
    }

    AnimationData* animationData = it->second;
    if (!animationData || !animationData->needUpdate(toFrameIdx)) 
    {
        return;
    }

    if (_curAnimationName != animationName) 
    {
        updateToFrame(_curAnimationName);
        _curAnimationName = animationName;
    }

    auto armature = _armatureDisplay->getArmature();
    auto animation = armature->getAnimation();

    // init animation
    if (animationData->getFrameCount() == 0) 
    {
        animation->play(animationName, 1);
    }

    do {
        armature->advanceTime(FrameTime);
        renderAnimationFrame(animationData);
        animationData->_totalTime += FrameTime;
        if (animation->isCompleted()) 
        {
            animationData->_isComplete = true;
        }
    } while (animationData->needUpdate(toFrameIdx));
}

void ArmatureCache::renderAnimationFrame(AnimationData* animationData) 
{
    std::size_t frameIndex = animationData->getFrameCount();
    _frameData = animationData->buildFrameData(frameIndex);

    _preColor = Color4F(-1.0f, -1.0f, -1.0f, -1.0f);
    _color = Color4F(1.0f, 1.0f, 1.0f, 1.0f);

    _preBlendMode = -1;
    _preTextureIndex = -1;
    _curTextureIndex = -1;
    _preISegWritePos = -1;
    _curISegLen = 0;
    _curVSegLen = 0;
    _materialLen = 0;

    auto armature = _armatureDisplay->getArmature();
    traverseArmature(armature);

    if (_preISegWritePos != -1) 
    {
        SegmentData* preSegmentData = _frameData->buildSegmentData(_materialLen - 1);
        preSegmentData->indexCount = _curISegLen;
        preSegmentData->vertexFloatCount = _curVSegLen;
    }

    auto colorCount = _frameData->getColorCount();
    if (colorCount > 0) 
    {
        ColorData* preColorData = _frameData->buildColorData(colorCount - 1);
        preColorData->vertexFloatOffset = (int)_frameData->vb.getCurPos() / sizeof(float);
    }

    _frameData = nullptr;
}

void ArmatureCache::traverseArmature(Armature* armature, float parentOpacity/*= 1.0f*/) 
{
    middleware::IOBuffer& vb = _frameData->vb;
    middleware::IOBuffer& ib = _frameData->ib;

    auto& slots = armature->getSlots();
    CCSlot* slot = nullptr;
    // range [0.0, 1.0]
    Color4F preColor(-1.0f, -1.0f, -1.0f, -1.0f);
    Color4F color;
    middleware::Texture2D* texture = nullptr;

    auto flush = [&]()
    {
        // fill pre segment count field
        if (_preISegWritePos != -1)
        {
            SegmentData* preSegmentData = _frameData->buildSegmentData(_materialLen - 1);
            preSegmentData->indexCount = _curISegLen;
            preSegmentData->vertexFloatCount = _curVSegLen;
        }

        SegmentData* segmentData = _frameData->buildSegmentData(_materialLen);
        segmentData->setTexture(texture);
        segmentData->blendMode = (int)(slot->_blendMode);

        // save new segment count pos field
        _preISegWritePos = (int)ib.getCurPos() / sizeof(unsigned short);
        // reset pre blend mode to current
        _preBlendMode = (int)slot->_blendMode;
        // reset pre texture index to current
        _preTextureIndex = _curTextureIndex;
        // reset index segmentation count
        _curISegLen = 0;
        // reset vertex segmentation count
        _curVSegLen = 0;
        // material length increased
        _materialLen++;
    };

    for (std::size_t i = 0, len = slots.size(); i < len; i++)
    {
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
        vb.checkSpace(vbSize, true);

        // If texture or blendMode change,will change material.
        if (_preTextureIndex != _curTextureIndex || _preBlendMode != (int)slot->_blendMode)
        {
            flush();
        }

        // Calculation vertex color.
        color.a = slot->color.a * parentOpacity;
        color.r = slot->color.r;
        color.g = slot->color.g;
        color.b = slot->color.b;

        if (preColor != color) {
            preColor = color;
            auto colorCount = _frameData->getColorCount();
            if (colorCount > 0) {
                ColorData* preColorData = _frameData->buildColorData(colorCount - 1);
                preColorData->vertexFloatOffset = vb.getCurPos() / sizeof(float);
            }
            ColorData* colorData = _frameData->buildColorData(colorCount);
            colorData->color = color;
        }

        // Transform component matrix to global matrix
        middleware::Triangles& triangles = slot->triangles;
        cocos2d::Mat4* worldMatrix = &slot->worldMatrix;
        middleware::V2F_T2F_C4B* worldTriangles = slot->worldVerts;

        for (int v = 0, w = 0, vn = triangles.vertCount; v < vn; ++v, w += 2)
        {
            middleware::V2F_T2F_C4B* vertex = triangles.verts + v;
            middleware::V2F_T2F_C4B* worldVertex = worldTriangles + v;
            worldVertex->vertex.x = vertex->vertex.x * worldMatrix->m[0] + vertex->vertex.y * worldMatrix->m[4] + worldMatrix->m[12];
            worldVertex->vertex.y = vertex->vertex.x * worldMatrix->m[1] + vertex->vertex.y * worldMatrix->m[5] + worldMatrix->m[13];

            worldVertex->color.r = (GLubyte)color.r;
            worldVertex->color.g = (GLubyte)color.g;
            worldVertex->color.b = (GLubyte)color.b;
            worldVertex->color.a = (GLubyte)color.a;
        }

        vb.writeBytes((char*)worldTriangles, vbSize);

        auto ibSize = triangles.indexCount * sizeof(unsigned short);
        ib.checkSpace(ibSize, true);

        auto vertexOffset = _curVSegLen / 5;
        for (int ii = 0, nn = triangles.indexCount; ii < nn; ii++)
        {
            ib.writeUint16(triangles.indices[ii] + vertexOffset);
        }

        _curISegLen += triangles.indexCount;
        _curVSegLen += vbSize / sizeof(float);
    } // End slot traverse
}

void ArmatureCache::resetAllAnimationData() 
{
    for (auto it = _animationCaches.begin(); it != _animationCaches.end(); it++)
    {
        it->second->reset();
    }
}

void ArmatureCache::resetAnimationData(const std::string& animationName) {
    for (auto it = _animationCaches.begin(); it != _animationCaches.end(); it++)
    {
        if (it->second->_animationName == animationName)
        {
            it->second->reset();
            break;
        }
    }
}

CCArmatureDisplay* ArmatureCache::getArmatureDisplay()
{
    return _armatureDisplay;
}

DRAGONBONES_NAMESPACE_END
