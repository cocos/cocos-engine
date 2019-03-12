/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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

#include "spine-creator-support/SpineAnimation.h"
#include "spine-creator-support/spine-cocos2dx.h"
#include "spine/extension.h"
#include <algorithm>

USING_NS_CC;
using std::min;
using std::max;
using std::vector;

namespace spine {

typedef struct _TrackEntryListeners
{
    StartListener startListener;
    InterruptListener interruptListener;
    EndListener endListener;
    DisposeListener disposeListener;
    CompleteListener completeListener;
    EventListener eventListener;
} _TrackEntryListeners;
    
void animationCallback (spAnimationState* state, spEventType type, spTrackEntry* entry, spEvent* event)
{
    ((SpineAnimation*)state->rendererObject)->onAnimationStateEvent(entry, type, event);
}

void trackEntryCallback (spAnimationState* state, spEventType type, spTrackEntry* entry, spEvent* event)
{
    ((SpineAnimation*)state->rendererObject)->onTrackEntryEvent(entry, type, event);
    if (type == SP_ANIMATION_DISPOSE)
        if (entry->rendererObject) delete (spine::_TrackEntryListeners*)entry->rendererObject;
}

static _TrackEntryListeners* getListeners (spTrackEntry* entry)
{
    if (!entry->rendererObject) {
        entry->rendererObject = new spine::_TrackEntryListeners();
        entry->listener = trackEntryCallback;
    }
    return (_TrackEntryListeners*)entry->rendererObject;
}

static float globalTimeScale = 1.0f;
void SpineAnimation::setGlobalTimeScale(float timeScale)
{
    globalTimeScale = timeScale;
}

SpineAnimation* SpineAnimation::create()
{
    SpineAnimation* skeleton = new SpineAnimation();
    skeleton->autorelease();
    return skeleton;
}

SpineAnimation* SpineAnimation::createWithData (spSkeletonData* skeletonData, bool ownsSkeletonData)
{
    SpineAnimation* node = new SpineAnimation();
    node->initWithData(skeletonData, ownsSkeletonData);
    node->autorelease();
    return node;
}

SpineAnimation* SpineAnimation::createWithJsonFile (const std::string& skeletonJsonFile, spAtlas* atlas, float scale)
{
    SpineAnimation* node = new SpineAnimation();
    node->initWithJsonFile(skeletonJsonFile, atlas, scale);
    node->autorelease();
    return node;
}

SpineAnimation* SpineAnimation::createWithJsonFile (const std::string& skeletonJsonFile, const std::string& atlasFile, float scale)
{
    SpineAnimation* node = new SpineAnimation();
    spAtlas* atlas = spAtlas_createFromFile(atlasFile.c_str(), 0);
    node->initWithJsonFile(skeletonJsonFile, atlas, scale);
    node->autorelease();
    return node;
}

SpineAnimation* SpineAnimation::createWithBinaryFile (const std::string& skeletonBinaryFile, spAtlas* atlas, float scale)
{
    SpineAnimation* node = new SpineAnimation();
    node->initWithBinaryFile(skeletonBinaryFile, atlas, scale);
    node->autorelease();
    return node;
}

SpineAnimation* SpineAnimation::createWithBinaryFile (const std::string& skeletonBinaryFile, const std::string& atlasFile, float scale)
{
    SpineAnimation* node = new SpineAnimation();
    spAtlas* atlas = spAtlas_createFromFile(atlasFile.c_str(), 0);
    node->initWithBinaryFile(skeletonBinaryFile, atlas, scale);
    node->autorelease();
    return node;
}

void SpineAnimation::initialize ()
{
    super::initialize();

    _ownsAnimationStateData = true;
    _state = spAnimationState_create(spAnimationStateData_create(_skeleton->data));
    _state->rendererObject = this;
    _state->listener = animationCallback;
}

SpineAnimation::SpineAnimation ()
: SpineRenderer()
{
}

SpineAnimation::SpineAnimation (spSkeletonData *skeletonData, bool ownsSkeletonData)
: SpineRenderer(skeletonData, ownsSkeletonData)
{
    initialize();
}

SpineAnimation::SpineAnimation (const std::string& skeletonDataFile, spAtlas* atlas, float scale)
: SpineRenderer(skeletonDataFile, atlas, scale)
{
    initialize();
}

SpineAnimation::SpineAnimation (const std::string& skeletonDataFile, const std::string& atlasFile, float scale)
: SpineRenderer(skeletonDataFile, atlasFile, scale)
{
    initialize();
}

SpineAnimation::~SpineAnimation ()
{
    clearTracks();
    _startListener = nullptr;
    _interruptListener = nullptr;
    _endListener = nullptr;
    _disposeListener = nullptr;
    _completeListener = nullptr;
    _eventListener = nullptr;

    if (_state)
    {
        if (_ownsAnimationStateData) spAnimationStateData_dispose(_state->data);
        spAnimationState_dispose(_state);
    }
}

void SpineAnimation::update (float deltaTime)
{
    if (!_paused)
    {
        deltaTime *= _timeScale * globalTimeScale;
        spSkeleton_update(_skeleton, deltaTime);
        spAnimationState_update(_state, deltaTime);
        spAnimationState_apply(_state, _skeleton);
        spSkeleton_updateWorldTransform(_skeleton);
    }
    
    super::update(deltaTime);
}

void SpineAnimation::setAnimationStateData (spAnimationStateData* stateData)
{
    CCASSERT(stateData, "stateData cannot be null.");

    if (_ownsAnimationStateData) spAnimationStateData_dispose(_state->data);
    spAnimationState_dispose(_state);

    _ownsAnimationStateData = false;
    _state = spAnimationState_create(stateData);
    _state->rendererObject = this;
    _state->listener = animationCallback;
}

void SpineAnimation::setMix (const std::string& fromAnimation, const std::string& toAnimation, float duration)
{
    spAnimationStateData_setMixByName(_state->data, fromAnimation.c_str(), toAnimation.c_str(), duration);
}

spTrackEntry* SpineAnimation::setAnimation (int trackIndex, const std::string& name, bool loop)
{
    spAnimation* animation = spSkeletonData_findAnimation(_skeleton->data, name.c_str());
    if (!animation) {
        log("Spine: Animation not found: %s", name.c_str());
        return 0;
    }
    return spAnimationState_setAnimation(_state, trackIndex, animation, loop);
}

spTrackEntry* SpineAnimation::addAnimation (int trackIndex, const std::string& name, bool loop, float delay)
{
    spAnimation* animation = spSkeletonData_findAnimation(_skeleton->data, name.c_str());
    if (!animation)
    {
        log("Spine: Animation not found: %s", name.c_str());
        return 0;
    }
    return spAnimationState_addAnimation(_state, trackIndex, animation, loop, delay);
}
    
spTrackEntry* SpineAnimation::setEmptyAnimation (int trackIndex, float mixDuration)
{
    return spAnimationState_setEmptyAnimation(_state, trackIndex, mixDuration);
}

void SpineAnimation::setEmptyAnimations (float mixDuration)
{
    spAnimationState_setEmptyAnimations(_state, mixDuration);
}

spTrackEntry* SpineAnimation::addEmptyAnimation (int trackIndex, float mixDuration, float delay)
{
    return spAnimationState_addEmptyAnimation(_state, trackIndex, mixDuration, delay);
}

spAnimation* SpineAnimation::findAnimation(const std::string& name) const
{
    return spSkeletonData_findAnimation(_skeleton->data, name.c_str());
}

spTrackEntry* SpineAnimation::getCurrent (int trackIndex)
{
    return spAnimationState_getCurrent(_state, trackIndex);
}

void SpineAnimation::clearTracks ()
{
    spAnimationState_clearTracks(_state);
}

void SpineAnimation::clearTrack (int trackIndex)
{
    spAnimationState_clearTrack(_state, trackIndex);
}

void SpineAnimation::onAnimationStateEvent (spTrackEntry* entry, spEventType type, spEvent* event)
{
    switch (type)
    {
    case SP_ANIMATION_START:
        if (_startListener) _startListener(entry);
        break;
    case SP_ANIMATION_INTERRUPT:
        if (_interruptListener) _interruptListener(entry);
        break;
    case SP_ANIMATION_END:
        if (_endListener) _endListener(entry);
        break;
    case SP_ANIMATION_DISPOSE:
        if (_disposeListener) _disposeListener(entry);
        break;
    case SP_ANIMATION_COMPLETE:
        if (_completeListener) _completeListener(entry);
        break;
    case SP_ANIMATION_EVENT:
        if (_eventListener) _eventListener(entry, event);
        break;
    }
}

void SpineAnimation::onTrackEntryEvent (spTrackEntry* entry, spEventType type, spEvent* event)
{
    if (!entry->rendererObject) return;
    _TrackEntryListeners* listeners = (_TrackEntryListeners*)entry->rendererObject;
    switch (type)
    {
    case SP_ANIMATION_START:
        if (listeners->startListener) listeners->startListener(entry);
        break;
    case SP_ANIMATION_INTERRUPT:
        if (listeners->interruptListener) listeners->interruptListener(entry);
        break;
    case SP_ANIMATION_END:
        if (listeners->endListener) listeners->endListener(entry);
        break;
    case SP_ANIMATION_DISPOSE:
        if (listeners->disposeListener) listeners->disposeListener(entry);
        break;
    case SP_ANIMATION_COMPLETE:
        if (listeners->completeListener) listeners->completeListener(entry);
        break;
    case SP_ANIMATION_EVENT:
        if (listeners->eventListener) listeners->eventListener(entry, event);
        break;
    }
}

void SpineAnimation::setStartListener (const StartListener& listener)
{
    _startListener = listener;
}
    
void SpineAnimation::setInterruptListener (const InterruptListener& listener)
{
    _interruptListener = listener;
}
    
void SpineAnimation::setEndListener (const EndListener& listener)
{
    _endListener = listener;
}
    
void SpineAnimation::setDisposeListener (const DisposeListener& listener)
{
    _disposeListener = listener;
}

void SpineAnimation::setCompleteListener (const CompleteListener& listener)
{
    _completeListener = listener;
}

void SpineAnimation::setEventListener (const EventListener& listener)
{
    _eventListener = listener;
}

void SpineAnimation::setTrackStartListener (spTrackEntry* entry, const StartListener& listener)
{
    getListeners(entry)->startListener = listener;
}
    
void SpineAnimation::setTrackInterruptListener (spTrackEntry* entry, const InterruptListener& listener)
{
    getListeners(entry)->interruptListener = listener;
}

void SpineAnimation::setTrackEndListener (spTrackEntry* entry, const EndListener& listener)
{
    getListeners(entry)->endListener = listener;
}
    
void SpineAnimation::setTrackDisposeListener (spTrackEntry* entry, const DisposeListener& listener)
{
    getListeners(entry)->disposeListener = listener;
}

void SpineAnimation::setTrackCompleteListener (spTrackEntry* entry, const CompleteListener& listener)
{
    getListeners(entry)->completeListener = listener;
}

void SpineAnimation::setTrackEventListener (spTrackEntry* entry, const EventListener& listener)
{
    getListeners(entry)->eventListener = listener;
}

spAnimationState* SpineAnimation::getState() const
{
    return _state;
}

}
