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

#include "CCArmatureCacheDisplay.h"
#include "MiddlewareManager.h"
#include "ArmatureCacheMgr.h"
#include "CCFactory.h"
#include "renderer/gfx/Texture.h"

USING_NS_CC;
USING_NS_MW;
using namespace cocos2d::renderer;
static const std::string techStage = "opaque";
static const std::string textureKey = "texture";
static const std::string startEvent = "start";
static const std::string loopCompleteEvent = "loopComplete";
static const std::string completeEvent = "complete";

DRAGONBONES_NAMESPACE_BEGIN

CCArmatureCacheDisplay::CCArmatureCacheDisplay(const std::string & armatureName, const std::string & armatureKey, const std::string & atlasUUID, bool isShare)
{
    _eventObject = BaseObject::borrowObject<EventObject>();

    if (isShare)
    {
        _armatureCache = ArmatureCacheMgr::getInstance()->buildArmatureCache(armatureName, armatureKey, atlasUUID);
        _armatureCache->retain();
    }
    else
    {
        _armatureCache = new ArmatureCache(armatureName, armatureKey, atlasUUID);
        _armatureCache->retain();
        _armatureCache->autorelease();
    }
    beginSchedule();
}

CCArmatureCacheDisplay::~CCArmatureCacheDisplay ()
{
    dispose();
}

void CCArmatureCacheDisplay::dispose() 
{
    if (_armatureCache)
    {
        _armatureCache->release();
        _armatureCache = nullptr;
    }
    if (_eventObject)
    {
        _eventObject->returnToPool();
        _eventObject = nullptr;
    }
    CC_SAFE_RELEASE_NULL(_nodeProxy);
    CC_SAFE_RELEASE_NULL(_effect);
    stopSchedule();
}

void CCArmatureCacheDisplay::update(float dt) 
{
    auto gTimeScale = dragonBones::CCFactory::getFactory()->getTimeScale();
    dt *= _timeScale * gTimeScale;

    if (_isAniComplete || !_animationData)
    {
        if (_animationData && !_animationData->isComplete())
        {
            _armatureCache->updateToFrame(_animationName);
        }
        return;
    }

    if (_accTime <= 0.00001 && _playCount == 0) 
    {
        _eventObject->type = EventObject::START;
        dispatchDBEvent(startEvent, _eventObject);
    }

    _accTime += dt;
    int frameIdx = floor(_accTime / ArmatureCache::FrameTime);
    if (!_animationData->isComplete()) 
    {
        _armatureCache->updateToFrame(_animationName, frameIdx);
    }

    int finalFrameIndex = (int)_animationData->getFrameCount() - 1;
    if (_animationData->isComplete() && frameIdx >= finalFrameIndex) 
    {
        _playCount++;
        _accTime = 0.0f;
        if (_playTimes > 0 && _playCount >= _playTimes) 
        {
            frameIdx = finalFrameIndex;
            _playCount = 0;
            _isAniComplete = true;
        }
        else 
        {
            frameIdx = 0;
        }

        _eventObject->type = EventObject::COMPLETE;
        dispatchDBEvent(completeEvent, _eventObject);

        _eventObject->type = EventObject::LOOP_COMPLETE;
        dispatchDBEvent(loopCompleteEvent, _eventObject);
    }
    _curFrameIndex = frameIdx;
}

void CCArmatureCacheDisplay::render(float dt) 
{
    if (_nodeProxy == nullptr)
    {
        return;
    }
    
    CustomAssembler* assembler = (CustomAssembler*)_nodeProxy->getAssembler();
    if (assembler == nullptr)
    {
        return;
    }
    assembler->reset();
    assembler->setUseModel(!_batch);
    
    if (!_animationData) return;
    ArmatureCache::FrameData* frameData = _animationData->getFrameData(_curFrameIndex);
    if (!frameData) return;

    auto mgr = MiddlewareManager::getInstance();
    if (!mgr->isRendering) return;

    _nodeColor.a = _nodeProxy->getRealOpacity() / (float)255;

    middleware::MeshBuffer* mb = mgr->getMeshBuffer(VF_XYUVC);
    middleware::IOBuffer& vb = mb->getVB();
    middleware::IOBuffer& ib = mb->getIB();
    const auto& srcVB = frameData->vb;
    const auto& srcIB = frameData->ib;

    const cocos2d::Mat4& nodeWorldMat = _nodeProxy->getWorldMatrix();
    auto& segments = frameData->getSegments();
    auto& colors = frameData->getColors();

    int colorOffset = 0;
    ArmatureCache::ColorData* nowColor = colors[colorOffset++];
    auto maxVFOffset = nowColor->vertexFloatOffset;

    Color4B color;
    float tempR = 0.0f, tempG = 0.0f, tempB = 0.0f;
    float multiplier = 1.0f;
    std::size_t srcVertexBytesOffset = 0;
    std::size_t srcIndexBytesOffset = 0;
    std::size_t vertexBytes = 0;
    std::size_t indexBytes = 0;
    GLuint textureHandle = 0;
    double effectHash = 0;
    BlendMode blendMode = BlendMode::Normal;
    std::size_t dstVertexOffset = 0;
    float* dstVertexBuffer = nullptr;
    unsigned int* dstColorBuffer = nullptr;
    unsigned short* dstIndexBuffer = nullptr;
    bool needColor = false;
    BlendFactor curBlendSrc = BlendFactor::ONE;
    BlendFactor curBlendDst = BlendFactor::ZERO;

    if (abs(_nodeColor.r - 1.0f) > 0.0001f ||
        abs(_nodeColor.g - 1.0f) > 0.0001f ||
        abs(_nodeColor.b - 1.0f) > 0.0001f ||
        abs(_nodeColor.a - 1.0f) > 0.0001f ||
        _premultipliedAlpha) {
        needColor = true;
    }

    auto handleColor = [&](ArmatureCache::ColorData* colorData) 
    {
        color.a = (GLubyte)(colorData->color.a * _nodeColor.a);
        multiplier = _premultipliedAlpha ? color.a / 255 : 1;
        tempR = _nodeColor.r * multiplier;
        tempG = _nodeColor.g * multiplier;
        tempB = _nodeColor.b * multiplier;
        
        color.r = (GLubyte)(colorData->color.r * tempR);
        color.g = (GLubyte)(colorData->color.g * tempG);
        color.b = (GLubyte)(colorData->color.b * tempB);
    };

    handleColor(nowColor);

    for (std::size_t segIndex = 0, segLen = segments.size(); segIndex < segLen; segIndex++) 
    {
        auto segment = segments[segIndex];
        vertexBytes = segment->vertexFloatCount * sizeof(float);

        // fill vertex buffer
        vb.checkSpace(vertexBytes, true);
        dstVertexOffset = vb.getCurPos() / sizeof(V2F_T2F_C4B);
        dstVertexBuffer = (float*)vb.getCurBuffer();
        dstColorBuffer = (unsigned int*)vb.getCurBuffer();
        vb.writeBytes((char*)srcVB.getBuffer() + srcVertexBytesOffset, vertexBytes);

        // batch handle
        if (_batch) 
        {
            cocos2d::Vec3* point = nullptr;
            float tempZ = 0.0f;
            for (auto posIndex = 0; posIndex < segment->vertexFloatCount; posIndex += 5)
            {
                point = (cocos2d::Vec3*)(dstVertexBuffer + posIndex);
                tempZ = point->z;
                point->z = 0;
                nodeWorldMat.transformPoint(point);
                point->z = tempZ;
            }
        }

        // handle vertex color
        if (needColor) 
        {
            auto frameFloatOffset = srcVertexBytesOffset / sizeof(float);
            for (auto colorIndex = 0; colorIndex < segment->vertexFloatCount; colorIndex += 5)
            {
                if (frameFloatOffset >= maxVFOffset) 
                {
                    nowColor = colors[colorOffset++];
                    handleColor(nowColor);
                    maxVFOffset = nowColor->vertexFloatOffset;
                }
                memcpy(dstColorBuffer + colorIndex + 4, &color, sizeof(color));
            }
        }

        // move src vertex buffer offset
        srcVertexBytesOffset += vertexBytes;

        // fill index buffer
        indexBytes = segment->indexCount * sizeof(unsigned short);
        ib.checkSpace(indexBytes, true);
        assembler->updateIARange(segIndex, (int)ib.getCurPos() / sizeof(unsigned short), (int)segment->indexCount);
        dstIndexBuffer = (unsigned short*)ib.getCurBuffer();
        ib.writeBytes((char*)srcIB.getBuffer() + srcIndexBytesOffset, indexBytes);
        for (auto indexPos = 0; indexPos < segment->indexCount; indexPos++) 
        {
            dstIndexBuffer[indexPos] += dstVertexOffset;
        }
        srcIndexBytesOffset += indexBytes;

        // set assembler glvb and glib
        assembler->updateIABuffer(segIndex, mb->getGLVB(), mb->getGLIB());

        // handle material
        textureHandle = segment->getTexture()->getNativeTexture()->getHandle();
        blendMode = (BlendMode)segment->blendMode;

        effectHash = textureHandle + ((uint8_t)blendMode << 16) + ((uint8_t)_batch << 24);
        Effect* renderEffect = assembler->getEffect(segIndex);
        Technique::Parameter* param = nullptr;
        Pass* pass = nullptr;

        if (renderEffect) 
        {
            double renderHash = renderEffect->getHash();
            if (abs(renderHash - effectHash) >= 0.01) 
            {
                param = (Technique::Parameter*)&(renderEffect->getProperty(textureKey));
                Technique* tech = renderEffect->getTechnique(techStage);
                cocos2d::Vector<Pass*>& passes = (cocos2d::Vector<Pass*>&)tech->getPasses();
                pass = *(passes.begin());
            }
        }
        else 
        {
            if (_effect == nullptr) 
            {
                cocos2d::log("ArmatureCacheAnimation:update get effect failed");
                assembler->reset();
                return;
            }
            auto effect = new cocos2d::renderer::Effect();
            effect->autorelease();
            effect->copy(_effect);

            Technique* tech = effect->getTechnique(techStage);
            cocos2d::Vector<Pass*>& passes = (cocos2d::Vector<Pass*>&)tech->getPasses();
            pass = *(passes.begin());

            assembler->updateEffect(segIndex, effect);
            renderEffect = effect;
            param = (Technique::Parameter*)&(renderEffect->getProperty(textureKey));
        }

        if (param) 
        {
            param->setTexture(segment->getTexture()->getNativeTexture());
        }

        switch (blendMode) 
        {
            case BlendMode::Add:
                curBlendSrc = _premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA;
                curBlendDst = BlendFactor::ONE;
                break;
            case BlendMode::Multiply:
                curBlendSrc = BlendFactor::DST_COLOR;
                curBlendDst = BlendFactor::ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode::Screen:
                curBlendSrc = BlendFactor::ONE;
                curBlendDst = BlendFactor::ONE_MINUS_SRC_COLOR;
                break;
            default:
                curBlendSrc = _premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA;
                curBlendDst = BlendFactor::ONE_MINUS_SRC_ALPHA;
                break;
        }

        if (pass) {
            pass->setBlend(BlendOp::ADD, curBlendSrc, curBlendDst,
                BlendOp::ADD, curBlendSrc, curBlendDst);
        }

        renderEffect->updateHash(effectHash);
    }
}

void CCArmatureCacheDisplay::beginSchedule() 
{
    MiddlewareManager::getInstance()->addTimer(this);
}

void CCArmatureCacheDisplay::stopSchedule() 
{
    MiddlewareManager::getInstance()->removeTimer(this);
}

void CCArmatureCacheDisplay::onEnable() 
{
    beginSchedule();
}

void CCArmatureCacheDisplay::onDisable() 
{
    stopSchedule();
}

Armature* CCArmatureCacheDisplay::getArmature() const
{
    auto armatureDisplay = _armatureCache->getArmatureDisplay();
    return armatureDisplay->getArmature();
}

Animation* CCArmatureCacheDisplay::getAnimation() const
{
    auto armature = getArmature();
    return armature->getAnimation();
}

void CCArmatureCacheDisplay::playAnimation(const std::string& name, int playTimes)
{
    _playTimes = playTimes;
    _animationName = name;
    _animationData = _armatureCache->buildAnimationData(_animationName);
    _isAniComplete = false;
    _accTime = 0.0f;
    _playCount = 0;
    _curFrameIndex = 0;
}

void CCArmatureCacheDisplay::addDBEventListener(const std::string& type)
{
    _listenerIDMap[type] = true;
}

void CCArmatureCacheDisplay::removeDBEventListener(const std::string& type)
{
    auto it = _listenerIDMap.find(type);
    if (it != _listenerIDMap.end())
    {
        _listenerIDMap.erase(it);
    }
}

void CCArmatureCacheDisplay::dispatchDBEvent(const std::string& type, EventObject* value)
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

void CCArmatureCacheDisplay::updateAnimationCache (const std::string& animationName)
{
    _armatureCache->resetAnimationData(animationName);
}

void CCArmatureCacheDisplay::updateAllAnimationCache ()
{
    _armatureCache->resetAllAnimationData();
}

DRAGONBONES_NAMESPACE_END
