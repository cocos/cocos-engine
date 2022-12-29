/****************************************************************************
 Copyright (c) 2012-2020 DragonBones team and other contributors
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <utility>

#include "ArmatureCache.h"
#include "CCArmatureDisplay.h"
#include "base/RefCounted.h"
#include "dragonbones/DragonBonesHeaders.h"

namespace cc {
class RenderEntity;
class RenderDrawInfo;
class Material;
}; // namespace cc

DRAGONBONES_NAMESPACE_BEGIN

class CCArmatureCacheDisplay : public cc::RefCounted, public cc::middleware::IMiddleware {
public:
    CCArmatureCacheDisplay(const std::string &armatureName, const std::string &armatureKey, const std::string &atlasUUID, bool isShare);
    ~CCArmatureCacheDisplay() override;
    void dispose();

    void update(float dt) override;
    void render(float dt) override;

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
    void setBatchEnabled(bool enabled);
    void setAttachEnabled(bool enabled);

    void setOpacityModifyRGB(bool value) {
        _premultipliedAlpha = value;
    }

    using dbEventCallback = std::function<void(EventObject *)>;
    void setDBEventCallback(dbEventCallback callback) {
        _dbEventCallback = std::move(callback);
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

    cc::RenderDrawInfo *requestDrawInfo(int idx);
    cc::Material *requestMaterial(uint16_t blendSrc, uint16_t blendDst);
    void setMaterial(cc::Material *material);
    void setRenderEntity(cc::RenderEntity *entity);

private:
    float _timeScale = 1;
    int _curFrameIndex = -1;
    float _accTime = 0.0F;
    int _playCount = 0;
    int _playTimes = 0;
    bool _isAniComplete = true;
    std::string _animationName;

    Armature *_armature = nullptr;
    ArmatureCache::AnimationData *_animationData = nullptr;
    std::map<std::string, bool> _listenerIDMap;

    bool _useAttach = false;
    bool _enableBatch = true;
    cc::middleware::Color4F _nodeColor = cc::middleware::Color4F::WHITE;

    bool _premultipliedAlpha = false;
    dbEventCallback _dbEventCallback = nullptr;
    ArmatureCache *_armatureCache = nullptr;
    EventObject *_eventObject;

    cc::middleware::IOTypedArray *_sharedBufferOffset = nullptr;

    cc::RenderEntity *_entity = nullptr;
    cc::Material *_material = nullptr;
    ccstd::vector<cc::RenderDrawInfo *> _drawInfoArray;
    ccstd::unordered_map<uint32_t, cc::Material *> _materialCaches;
};

DRAGONBONES_NAMESPACE_END
