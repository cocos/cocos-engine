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

#pragma once

#include "dragonbones/DragonBonesHeaders.h"
#include "base/CCRef.h"
#include "renderer/scene/NodeProxy.hpp"
#include "renderer/scene/assembler/CustomAssembler.hpp"
#include "CCArmatureDisplay.h"
#include "ArmatureCache.h"

DRAGONBONES_NAMESPACE_BEGIN
class CCArmatureCacheDisplay : public cocos2d::middleware::IMiddleware, public cocos2d::Ref
{
public:
    CCArmatureCacheDisplay(const std::string& armatureName, const std::string& armatureKey, const std::string& atlasUUID, bool isShare);
    virtual ~CCArmatureCacheDisplay();
    void dispose();

    virtual void update(float dt) override;
    virtual void render(float dt) override;

    void setTimeScale(float scale)
    {
        _timeScale = scale;
    }

    float getTimeScale() const 
    {
        return _timeScale;
    }

    void beginSchedule();
    void stopSchedule();
    void onEnable();
    void onDisable();

    Armature* getArmature() const;
    Animation* getAnimation() const;

    void bindNodeProxy(cocos2d::renderer::NodeProxy* node)
    {
        CC_SAFE_RELEASE(_nodeProxy);
        _nodeProxy = node;
        CC_SAFE_RETAIN(_nodeProxy);
    }

    void setEffect(cocos2d::renderer::Effect* effect)
    {
        if (effect == _effect) return;
        CC_SAFE_RELEASE(_effect);
        _effect = effect;
        CC_SAFE_RETAIN(_effect);
    }

    void setColor(cocos2d::Color4B& color)
    {
        _nodeColor.r = color.r / 255.0f;
        _nodeColor.g = color.g / 255.0f;
        _nodeColor.b = color.b / 255.0f;
        _nodeColor.a = color.a / 255.0f;
    }

    void setBatchEnabled(bool enabled)
    {
        _batch = enabled;
    }

    void setOpacityModifyRGB(bool value)
    {
        _premultipliedAlpha = value;
    }

    typedef std::function<void(EventObject*)> dbEventCallback;
    void setDBEventCallback(dbEventCallback callback)
    {
        _dbEventCallback = callback;
    }
    void addDBEventListener(const std::string& type);
    void removeDBEventListener(const std::string& type);
    void dispatchDBEvent(const std::string& type, EventObject* value);

    void playAnimation(const std::string& name, int playTimes);
    void updateAnimationCache (const std::string& animationName);
    void updateAllAnimationCache ();
private:
    float _timeScale = 1;
    int _curFrameIndex = -1;
    float _accTime = 0.0f;
    int _playCount = 0;
    int _playTimes = 0;
    bool _isAniComplete = true;
    std::string _animationName = "";

    Armature* _armature = nullptr;
    ArmatureCache::AnimationData* _animationData = nullptr;
    std::map<std::string, bool> _listenerIDMap;
    cocos2d::Color4F _nodeColor = cocos2d::Color4F::WHITE;

    bool _batch = false;
    bool _premultipliedAlpha = false;
    dbEventCallback _dbEventCallback = nullptr;
    cocos2d::renderer::NodeProxy* _nodeProxy = nullptr;
    cocos2d::renderer::Effect* _effect = nullptr;
    cocos2d::renderer::CustomAssembler* _assembler = nullptr;
    ArmatureCache* _armatureCache = nullptr;
    EventObject* _eventObject;
};

DRAGONBONES_NAMESPACE_END
