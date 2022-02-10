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

#include "spine-creator-support/SkeletonAnimation.h"
#include <algorithm>
#include "base/DeferredReleasePool.h"
#include "base/Log.h"
#include "spine-creator-support/spine-cocos2dx.h"
#include "spine/Extension.h"

namespace spine {

struct TrackEntryListeners {
    StartListener     startListener;
    InterruptListener interruptListener;
    EndListener       endListener;
    DisposeListener   disposeListener;
    CompleteListener  completeListener;
    EventListener     eventListener;
};

void animationCallback(AnimationState *state, EventType type, TrackEntry *entry, Event *event) {
    (static_cast<SkeletonAnimation *>(state->getRendererObject()))->onAnimationStateEvent(entry, type, event);
}

void trackEntryCallback(AnimationState *state, EventType type, TrackEntry *entry, Event *event) {
    (static_cast<SkeletonAnimation *>(state->getRendererObject()))->onTrackEntryEvent(entry, type, event);
    if (type == EventType_Dispose) {
        if (entry->getRendererObject()) {
            delete static_cast<spine::TrackEntryListeners *>(entry->getRendererObject());
            entry->setRendererObject(nullptr);
        }
    }
}

static TrackEntryListeners *getListeners(TrackEntry *entry) {
    if (!entry->getRendererObject()) {
        entry->setRendererObject(new spine::TrackEntryListeners());
        entry->setListener(trackEntryCallback);
    }
    return static_cast<TrackEntryListeners *>(entry->getRendererObject());
}

float SkeletonAnimation::GlobalTimeScale = 1.0F;
void  SkeletonAnimation::setGlobalTimeScale(float timeScale) {
    GlobalTimeScale = timeScale;
}

SkeletonAnimation *SkeletonAnimation::create() {
    auto *skeleton = new SkeletonAnimation();
    return skeleton;
}

SkeletonAnimation *SkeletonAnimation::createWithData(SkeletonData *skeletonData, bool ownsSkeletonData) {
    auto *node = new SkeletonAnimation();
    node->initWithData(skeletonData, ownsSkeletonData);
    return node;
}

SkeletonAnimation *SkeletonAnimation::createWithJsonFile(const std::string &skeletonJsonFile, const std::string &atlasFile, float scale) {
    auto *node = new SkeletonAnimation();
    node->initWithJsonFile(skeletonJsonFile, atlasFile, scale);
    return node;
}

SkeletonAnimation *SkeletonAnimation::createWithBinaryFile(const std::string &skeletonBinaryFile, const std::string &atlasFile, float scale) {
    auto *node = new SkeletonAnimation();
    node->initWithBinaryFile(skeletonBinaryFile, atlasFile, scale);
    return node;
}

void SkeletonAnimation::initialize() {
    super::initialize();

    _ownsAnimationStateData = true;
    _state                  = new (__FILE__, __LINE__) AnimationState(new (__FILE__, __LINE__) AnimationStateData(_skeleton->getData()));
    _state->setRendererObject(this);
    _state->setListener(animationCallback);
}

SkeletonAnimation::SkeletonAnimation() = default;

SkeletonAnimation::~SkeletonAnimation() {
    _startListener     = nullptr;
    _interruptListener = nullptr;
    _endListener       = nullptr;
    _disposeListener   = nullptr;
    _completeListener  = nullptr;
    _eventListener     = nullptr;

    if (_state) {
        if (_ownsAnimationStateData) delete _state->getData();
        delete _state;
    }
}

void SkeletonAnimation::update(float deltaTime) {
    if (!_skeleton) return;
    if (!_paused) {
        deltaTime *= _timeScale * GlobalTimeScale;
        if (_ownsSkeleton) _skeleton->update(deltaTime);
        _state->update(deltaTime);
        _state->apply(*_skeleton);
        _skeleton->updateWorldTransform();
    }
}

void SkeletonAnimation::setAnimationStateData(AnimationStateData *stateData) {
    CCASSERT(stateData, "stateData cannot be null.");

    if (_state) {
        if (_ownsAnimationStateData) delete _state->getData();
        delete _state;
    }

    _ownsAnimationStateData = false;
    _state                  = new (__FILE__, __LINE__) AnimationState(stateData);
    _state->setRendererObject(this);
    _state->setListener(animationCallback);
}

void SkeletonAnimation::setMix(const std::string &fromAnimation, const std::string &toAnimation, float duration) {
    if (_state) {
        _state->getData()->setMix(fromAnimation.c_str(), toAnimation.c_str(), duration);
    }
}

TrackEntry *SkeletonAnimation::setAnimation(int trackIndex, const std::string &name, bool loop) {
    if (!_skeleton) return nullptr;
    Animation *animation = _skeleton->getData()->findAnimation(name.c_str());
    if (!animation) {
        CC_LOG_WARNING("Spine: Animation not found: %s", name.c_str());
        return nullptr;
    }
    auto *trackEntry = _state->setAnimation(trackIndex, animation, loop);
    _state->apply(*_skeleton);
    return trackEntry;
}

TrackEntry *SkeletonAnimation::addAnimation(int trackIndex, const std::string &name, bool loop, float delay) {
    if (!_skeleton) return nullptr;
    Animation *animation = _skeleton->getData()->findAnimation(name.c_str());
    if (!animation) {
        CC_LOG_WARNING("Spine: Animation not found: %s", name.c_str());
        return nullptr;
    }
    return _state->addAnimation(trackIndex, animation, loop, delay);
}

TrackEntry *SkeletonAnimation::setEmptyAnimation(int trackIndex, float mixDuration) {
    if (_state) {
        return _state->setEmptyAnimation(trackIndex, mixDuration);
    }
    return nullptr;
}

void SkeletonAnimation::setEmptyAnimations(float mixDuration) {
    if (_state) {
        _state->setEmptyAnimations(mixDuration);
    }
}

TrackEntry *SkeletonAnimation::addEmptyAnimation(int trackIndex, float mixDuration, float delay) {
    if (_state) {
        return _state->addEmptyAnimation(trackIndex, mixDuration, delay);
    }
    return nullptr;
}

Animation *SkeletonAnimation::findAnimation(const std::string &name) const {
    if (_skeleton) {
        return _skeleton->getData()->findAnimation(name.c_str());
    }
    return nullptr;
}

TrackEntry *SkeletonAnimation::getCurrent(int trackIndex) {
    if (_state) {
        return _state->getCurrent(trackIndex);
    }
    return nullptr;
}

void SkeletonAnimation::clearTracks() {
    if (_state) {
        _state->clearTracks();
        super::setToSetupPose();
    }
}

void SkeletonAnimation::clearTrack(int trackIndex) {
    if (_state) {
        _state->clearTrack(trackIndex);
    }
}

void SkeletonAnimation::onAnimationStateEvent(TrackEntry *entry, EventType type, Event *event) {
    switch (type) {
        case EventType_Start:
            if (_startListener) _startListener(entry);
            break;
        case EventType_Interrupt:
            if (_interruptListener) _interruptListener(entry);
            break;
        case EventType_End:
            if (_endListener) _endListener(entry);
            break;
        case EventType_Dispose:
            if (_disposeListener) _disposeListener(entry);
            break;
        case EventType_Complete:
            if (_completeListener) _completeListener(entry);
            break;
        case EventType_Event:
            if (_eventListener) _eventListener(entry, event);
            break;
    }
}

void SkeletonAnimation::onTrackEntryEvent(TrackEntry *entry, EventType type, Event *event) {
    if (!entry->getRendererObject()) return;
    auto *listeners = static_cast<TrackEntryListeners *>(entry->getRendererObject());
    switch (type) {
        case EventType_Start:
            if (listeners->startListener) listeners->startListener(entry);
            break;
        case EventType_Interrupt:
            if (listeners->interruptListener) listeners->interruptListener(entry);
            break;
        case EventType_End:
            if (listeners->endListener) listeners->endListener(entry);
            break;
        case EventType_Dispose:
            if (listeners->disposeListener) listeners->disposeListener(entry);
            break;
        case EventType_Complete:
            if (listeners->completeListener) listeners->completeListener(entry);
            break;
        case EventType_Event:
            if (listeners->eventListener) listeners->eventListener(entry, event);
            break;
    }
}

void SkeletonAnimation::setStartListener(const StartListener &listener) {
    _startListener = listener;
}

void SkeletonAnimation::setInterruptListener(const InterruptListener &listener) {
    _interruptListener = listener;
}

void SkeletonAnimation::setEndListener(const EndListener &listener) {
    _endListener = listener;
}

void SkeletonAnimation::setDisposeListener(const DisposeListener &listener) {
    _disposeListener = listener;
}

void SkeletonAnimation::setCompleteListener(const CompleteListener &listener) {
    _completeListener = listener;
}

void SkeletonAnimation::setEventListener(const EventListener &listener) {
    _eventListener = listener;
}

void SkeletonAnimation::setTrackStartListener(TrackEntry *entry, const StartListener &listener) { // NOLINT(readability-convert-member-functions-to-static)
    getListeners(entry)->startListener = listener;
}

void SkeletonAnimation::setTrackInterruptListener(TrackEntry *entry, const InterruptListener &listener) { // NOLINT(readability-convert-member-functions-to-static)
    getListeners(entry)->interruptListener = listener;
}

void SkeletonAnimation::setTrackEndListener(TrackEntry *entry, const EndListener &listener) { // NOLINT(readability-convert-member-functions-to-static)
    getListeners(entry)->endListener = listener;
}

void SkeletonAnimation::setTrackDisposeListener(TrackEntry *entry, const DisposeListener &listener) { // NOLINT(readability-convert-member-functions-to-static)
    getListeners(entry)->disposeListener = listener;
}

void SkeletonAnimation::setTrackCompleteListener(TrackEntry *entry, const CompleteListener &listener) { // NOLINT(readability-convert-member-functions-to-static)
    getListeners(entry)->completeListener = listener;
}

void SkeletonAnimation::setTrackEventListener(TrackEntry *entry, const EventListener &listener) { // NOLINT(readability-convert-member-functions-to-static)
    getListeners(entry)->eventListener = listener;
}

AnimationState *SkeletonAnimation::getState() const {
    return _state;
}

} // namespace spine
