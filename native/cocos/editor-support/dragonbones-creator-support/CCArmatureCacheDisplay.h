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

#pragma once

#include "ArmatureCache.h"
#include "CCArmatureDisplay.h"
#include "base/Ref.h"
#include "dragonbones/DragonBonesHeaders.h"

DRAGONBONES_NAMESPACE_BEGIN

class CCArmatureCacheDisplay : public cc::middleware::IMiddleware, public cc::Ref {
public:
    CCArmatureCacheDisplay(const std::string &armatureName, const std::string &armatureKey, const std::string &atlasUUID, bool isShare);
    virtual ~CCArmatureCacheDisplay();
    void dispose();

    virtual void update(float dt) override;
    virtual void render(float dt) override;
    virtual uint32_t getRenderOrder() const override;

    void setTimeScale(float scale) {
        _timeScale = scale;
    }

    float getTimeScale() const {
        return _timeScale;
    }

    void beginSchedule();
    void stopSchedule();
    void onEnable();
    void onDisable();

    Armature *getArmature() const;
    Animation *getAnimation() const;

    void setColor(float r, float g, float b, float a);
    void setBatchEnabled(bool enabled) {
        // disable switch batch mode, force to enable batch, it may be changed in future version
        // _batch = enabled;
    }
    void setAttachEnabled(bool enabled);

    void setOpacityModifyRGB(bool value) {
        _premultipliedAlpha = value;
    }

    typedef std::function<void(EventObject *)> dbEventCallback;
    void setDBEventCallback(dbEventCallback callback) {
        _dbEventCallback = callback;
    }
    void addDBEventListener(const std::string &type);
    void removeDBEventListener(const std::string &type);
    void dispatchDBEvent(const std::string &type, EventObject *value);

    void playAnimation(const std::string &name, int playTimes);
    void updateAnimationCache(const std::string &animationName);
    void updateAllAnimationCache();

    /**
     * @return shared buffer offset, it's a Uint32Array
     * format |render info offset|attach info offset|
     */
    se_object_ptr getSharedBufferOffset() const;
    /**
         * @return js send to cpp parameters, it's a Uint32Array
		 * format |render order|world matrix|
         */
    se_object_ptr getParamsBuffer() const;

private:
    float _timeScale = 1;
    int _curFrameIndex = -1;
    float _accTime = 0.0f;
    int _playCount = 0;
    int _playTimes = 0;
    bool _isAniComplete = true;
    std::string _animationName = "";

    Armature *_armature = nullptr;
    ArmatureCache::AnimationData *_animationData = nullptr;
    std::map<std::string, bool> _listenerIDMap;

    bool _useAttach = false;
    bool _batch = true;
    cc::middleware::Color4F _nodeColor = cc::middleware::Color4F::WHITE;

    bool _premultipliedAlpha = false;
    dbEventCallback _dbEventCallback = nullptr;
    ArmatureCache *_armatureCache = nullptr;
    EventObject *_eventObject;

    cc::middleware::IOTypedArray *_sharedBufferOffset = nullptr;
    // Js fill this buffer to send parameter to cpp, avoid to call jsb function.
    cc::middleware::IOTypedArray *_paramsBuffer = nullptr;
};

DRAGONBONES_NAMESPACE_END
