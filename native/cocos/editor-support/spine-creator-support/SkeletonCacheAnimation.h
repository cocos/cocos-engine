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

#pragma once
#include "MiddlewareManager.h"
#include "SkeletonCache.h"
#include "base/Ref.h"
#include "middleware-adapter.h"
#include "spine/spine.h"
#include <queue>

namespace spine {

class SkeletonCacheAnimation : public cc::middleware::IMiddleware, public cc::Ref {
public:
    SkeletonCacheAnimation(const std::string &uuid, bool isShare);
    virtual ~SkeletonCacheAnimation();

    virtual void update(float dt) override;
    virtual void render(float dt) override;
    virtual uint32_t getRenderOrder() const override;

    Skeleton *getSkeleton() const;

    void setTimeScale(float scale);
    float getTimeScale() const;

    void paused(bool value);

    Bone *findBone(const std::string &boneName) const;
    Slot *findSlot(const std::string &slotName) const;

    void setSkin(const std::string &skinName);
    void setSkin(const char *skinName);

    Attachment *getAttachment(const std::string &slotName, const std::string &attachmentName) const;
    bool setAttachment(const std::string &slotName, const std::string &attachmentName);
    bool setAttachment(const std::string &slotName, const char *attachmentName);
    void setColor(float r, float g, float b, float a);
    void setBatchEnabled(bool enabled);
    void setAttachEnabled(bool enabled);

    void setOpacityModifyRGB(bool value);
    bool isOpacityModifyRGB() const;

    void beginSchedule();
    void stopSchedule();
    void onEnable();
    void onDisable();
    void setUseTint(bool enabled);

    void setAnimation(const std::string &name, bool loop);
    void addAnimation(const std::string &name, bool loop, float delay = 0);
    Animation *findAnimation(const std::string &name) const;

    typedef std::function<void(std::string animationName)> CacheFrameEvent;
    void setStartListener(const CacheFrameEvent &listener);
    void setEndListener(const CacheFrameEvent &listener);
    void setCompleteListener(const CacheFrameEvent &listener);
    void updateAnimationCache(const std::string &animationName);
    void updateAllAnimationCache();

    void setToSetupPose();
    void setBonesToSetupPose();
    void setSlotsToSetupPose();

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
    bool _paused = false;
    bool _useAttach = false;
    bool _batch = true;
    cc::middleware::Color4F _nodeColor = cc::middleware::Color4F::WHITE;
    bool _premultipliedAlpha = false;

    CacheFrameEvent _startListener = nullptr;
    CacheFrameEvent _endListener = nullptr;
    CacheFrameEvent _completeListener = nullptr;

    SkeletonCache *_skeletonCache = nullptr;
    SkeletonCache::AnimationData *_animationData = nullptr;
    int _curFrameIndex = -1;

    float _accTime = 0.0f;
    int _playCount = 0;
    int _playTimes = 0;
    bool _isAniComplete = true;
    std::string _animationName = "";
    bool _useTint = true;

    struct AniQueueData {
        std::string animationName = "";
        bool loop = false;
        float delay = 0.0f;
    };
    std::queue<AniQueueData *> _animationQueue;
    AniQueueData *_headAnimation = nullptr;

    cc::middleware::IOTypedArray *_sharedBufferOffset = nullptr;
    // Js fill this buffer to send parameter to cpp, avoid to call jsb function.
    cc::middleware::IOTypedArray *_paramsBuffer = nullptr;
};
} // namespace spine
