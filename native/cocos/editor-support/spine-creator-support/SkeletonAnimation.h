/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated May 1, 2019. Replaces all prior versions.
 *
 * Copyright (c) 2013-2019, Esoteric Software LLC
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
 * THIS SOFTWARE IS PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 * NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, BUSINESS
 * INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#pragma once
#include "spine-creator-support/SkeletonRenderer.h"
#include "spine/spine.h"

namespace cc {

typedef std::function<void(spine::TrackEntry *entry)> StartListener;
typedef std::function<void(spine::TrackEntry *entry)> InterruptListener;
typedef std::function<void(spine::TrackEntry *entry)> EndListener;
typedef std::function<void(spine::TrackEntry *entry)> DisposeListener;
typedef std::function<void(spine::TrackEntry *entry)> CompleteListener;
typedef std::function<void(spine::TrackEntry *entry, spine::Event *event)> EventListener;

/** Draws an animated skeleton, providing an AnimationState for applying one or more animations and queuing animations to be
  * played later. */
class SkeletonAnimation : public cc::SkeletonRenderer {
public:
    static SkeletonAnimation *create();
    static SkeletonAnimation *createWithData(spine::SkeletonData *skeletonData, bool ownsSkeletonData = false);
    static SkeletonAnimation *createWithJsonFile(const std::string &skeletonJsonFile, const std::string &atlasFile, float scale = 1);
    static SkeletonAnimation *createWithBinaryFile(const std::string &skeletonBinaryFile, const std::string &atlasFile, float scale = 1);
    static void setGlobalTimeScale(float timeScale);

    virtual void update(float deltaTime) override;

    void setAnimationStateData(spine::AnimationStateData *stateData);
    void setMix(const std::string &fromAnimation, const std::string &toAnimation, float duration);

    spine::TrackEntry *setAnimation(int trackIndex, const std::string &name, bool loop);
    spine::TrackEntry *addAnimation(int trackIndex, const std::string &name, bool loop, float delay = 0);
    spine::TrackEntry *setEmptyAnimation(int trackIndex, float mixDuration);
    void setEmptyAnimations(float mixDuration);
    spine::TrackEntry *addEmptyAnimation(int trackIndex, float mixDuration, float delay = 0);
    spine::Animation *findAnimation(const std::string &name) const;
    spine::TrackEntry *getCurrent(int trackIndex = 0);
    void clearTracks();
    void clearTrack(int trackIndex = 0);

    void setStartListener(const StartListener &listener);
    void setInterruptListener(const InterruptListener &listener);
    void setEndListener(const EndListener &listener);
    void setDisposeListener(const DisposeListener &listener);
    void setCompleteListener(const CompleteListener &listener);
    void setEventListener(const EventListener &listener);

    void setTrackStartListener(spine::TrackEntry *entry, const StartListener &listener);
    void setTrackInterruptListener(spine::TrackEntry *entry, const InterruptListener &listener);
    void setTrackEndListener(spine::TrackEntry *entry, const EndListener &listener);
    void setTrackDisposeListener(spine::TrackEntry *entry, const DisposeListener &listener);
    void setTrackCompleteListener(spine::TrackEntry *entry, const CompleteListener &listener);
    void setTrackEventListener(spine::TrackEntry *entry, const EventListener &listener);

    virtual void onAnimationStateEvent(spine::TrackEntry *entry, spine::EventType type, spine::Event *event);
    virtual void onTrackEntryEvent(spine::TrackEntry *entry, spine::EventType type, spine::Event *event);

    spine::AnimationState *getState() const;

    SkeletonAnimation();
    virtual ~SkeletonAnimation();
    virtual void initialize() override;

public:
    static float GlobalTimeScale;

protected:
    spine::AnimationState *_state = nullptr;
    bool _ownsAnimationStateData = false;
    StartListener _startListener = nullptr;
    InterruptListener _interruptListener = nullptr;
    EndListener _endListener = nullptr;
    DisposeListener _disposeListener = nullptr;
    CompleteListener _completeListener = nullptr;
    EventListener _eventListener = nullptr;

private:
    typedef cc::SkeletonRenderer super;
};

} // namespace cc
