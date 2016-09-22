#include "AnimationState.h"
#include "TimelineState.h"
#include "../armature/Armature.h"
#include "../armature/Bone.h"
#include "../armature/Slot.h"
#include "../animation/Animation.h"

DRAGONBONES_NAMESPACE_BEGIN

AnimationState::AnimationState() :
    _timeline(nullptr)
{
    _onClear();
}
AnimationState::~AnimationState() 
{
    _onClear();
}

void AnimationState::_onClear()
{
    displayControl = true;
    additiveBlending = false;
    playTimes = 1;
    timeScale = 1.f;
    weight = 1.f;
    autoFadeOutTime = -1.f;
    fadeTotalTime = 0.f;

    _isFadeOutComplete = false;
    _layer = 0;
    _position = 0.f;
    _duration = 0.f;
    _clipDutation = 0.f;
    _weightResult = 0.f;
    _fadeProgress = 0.f;
    _group.clear();

    if (_timeline)
    {
        _timeline->returnToPool();
        _timeline = nullptr;
    }
    
    _isPlaying = true;
    _isPausePlayhead = false;
    _isFadeOut = false;
    _currentPlayTimes = 0;
    _fadeTime = 0.f;
    _time = 0.f;
    _name.clear();
    _armature = nullptr;
    _clip = nullptr;
    _boneMask.clear();

    for (const auto timeline : _boneTimelines)
    {
        timeline->returnToPool();
    }

    for (const auto timeline : _slotTimelines)
    {
        timeline->returnToPool();
    }

    for (const auto timeline : _ffdTimelines)
    {
        timeline->returnToPool();
    }

    _boneTimelines.clear();
    _slotTimelines.clear();
    _ffdTimelines.clear();
}

void AnimationState::_advanceFadeTime(float passedTime)
{
    if (passedTime < 0.f)
    {
        passedTime = -passedTime;
    }

    _fadeTime += passedTime;

    auto fadeProgress = 0.f;
    if (_fadeTime >= fadeTotalTime)
    {
        fadeProgress = _isFadeOut? 0.f : 1.f;
    }
    else if (_fadeTime > 0.f)
    {
        fadeProgress = _isFadeOut ? (1.f - _fadeTime / fadeTotalTime) : (_fadeTime / fadeTotalTime);
    }
    else
    {
        fadeProgress = _isFadeOut ? 1.f : 0.f;
    }

    if (_fadeProgress != fadeProgress)
    {
        _fadeProgress = fadeProgress;

        const auto eventDispatcher = _armature->_display;

        if (_fadeTime <= passedTime)
        {
            if (_isFadeOut)
            {
                if (eventDispatcher->hasEvent(EventObject::FADE_OUT))
                {
                    auto event = BaseObject::borrowObject<EventObject>();
                    event->animationState = this;
                    _armature->_bufferEvent(event, EventObject::FADE_OUT);
                }
            }
            else
            {
                if (eventDispatcher->hasEvent(EventObject::FADE_IN))
                {
                    auto event = BaseObject::borrowObject<EventObject>();
                    event->animationState = this;
                    _armature->_bufferEvent(event, EventObject::FADE_IN);
                }
            }
        }

        if (_fadeTime >= fadeTotalTime)
        {
            if (_isFadeOut)
            {
                _isFadeOutComplete = true;

                if (eventDispatcher->hasEvent(EventObject::FADE_OUT_COMPLETE))
                {
                    auto event = BaseObject::borrowObject<EventObject>();
                    event->animationState = this;
                    _armature->_bufferEvent(event, EventObject::FADE_OUT_COMPLETE);
                }
            }
            else
            {
                _isPausePlayhead = false;

                if (eventDispatcher->hasEvent(EventObject::FADE_IN_COMPLETE))
                {
                    auto event = BaseObject::borrowObject<EventObject>();
                    event->animationState = this;
                    _armature->_bufferEvent(event, EventObject::FADE_IN_COMPLETE);
                }
            }
        }
    }
}

bool AnimationState::_isDisabled(const Slot& slot) const
{
    if (
        displayControl &&
        (
            slot.displayController.empty() ||
            slot.displayController == _name ||
            slot.displayController == _group
        )
    )
    {
        return false;
    }

    return true;
}

void AnimationState::_fadeIn(
    Armature* armature, AnimationData* clip, const std::string& animationName, 
    unsigned playTimes, float position, float duration, float time, float timeScale, float fadeInTime,
    bool pausePlayhead
)
{
    _armature = armature;
    _clip = clip;
    _name = animationName;

    this->playTimes = playTimes;
    this->timeScale = timeScale;
    fadeTotalTime = fadeInTime;

    _position = position;
    _duration = duration;
    _time = time;
    _clipDutation = _clip->duration;
    _isPausePlayhead = pausePlayhead;
    if (fadeTotalTime == 0.f)
    {
        _fadeProgress = 0.999999f;
    }

    _timeline = BaseObject::borrowObject<AnimationTimelineState>();
    _timeline->fadeIn(_armature, this, _clip, _time);

    _updateTimelineStates();
}

void AnimationState::_updateTimelineStates()
{
    auto time = _time;
    if (!_clip->hasAsynchronyTimeline)
    {
        time = _timeline->_currentTime;
    }

    std::map<std::string, BoneTimelineState*> boneTimelineStates;
    std::map<std::string, SlotTimelineState*> slotTimelineStates;

    //
    for (const auto timelineState : _boneTimelines)
    {
        boneTimelineStates[timelineState->bone->name] = timelineState;
    }

    const auto& bones = _armature->getBones();
    for (const auto bone : bones)
    {
        const auto& timelineName = bone->name;
        const auto timelineData = _clip->getBoneTimeline(timelineName);

        if (timelineData && containsBoneMask(timelineName))
        {
            const auto iterator = boneTimelineStates.find(timelineName);
            if (iterator != boneTimelineStates.end())
            {
                boneTimelineStates.erase(iterator);
            }
            else
            {
                const auto timelineState = BaseObject::borrowObject<BoneTimelineState>();
                timelineState->bone = bone;
                timelineState->fadeIn(_armature, this, timelineData, time);
                _boneTimelines.push_back(timelineState);
            }
        }
    }

    for (const auto& pair : boneTimelineStates)
    {
        const auto timelineState = pair.second;
        _boneTimelines.erase(std::find(_boneTimelines.cbegin(), _boneTimelines.cend(), timelineState));
        timelineState->returnToPool();
    }

    //
    for (auto timelineState : _slotTimelines)
    {
        slotTimelineStates[timelineState->slot->name] = timelineState;
    }

    for (const auto slot : _armature->getSlots())
    {
        const auto& timelineName = slot->name;
        const auto& parentTimelineName = slot->getParent()->name;
        const auto slotTimelineData = _clip->getSlotTimeline(timelineName);

        if (slotTimelineData && containsBoneMask(parentTimelineName) && !_isFadeOut)
        {
            const auto iterator = slotTimelineStates.find(timelineName);
            if (iterator != slotTimelineStates.end())
            {
                slotTimelineStates.erase(iterator);
            }
            else
            {
                const auto timelineState = BaseObject::borrowObject<SlotTimelineState>();
                timelineState->slot = slot;
                timelineState->fadeIn(_armature, this, slotTimelineData, time);
                _slotTimelines.push_back(timelineState);
            }
        }
    }

    for (const auto& pair : slotTimelineStates)
    {
        const auto timelineState = pair.second;
        _slotTimelines.erase(std::find(_slotTimelines.cbegin(), _slotTimelines.cend(), timelineState));
        timelineState->returnToPool();
    }

    _updateFFDTimelineStates();
}

void AnimationState::_updateFFDTimelineStates()
{
    auto time = _time;
    if (!_clip->hasAsynchronyTimeline)
    {
        time = _timeline->_currentTime;
    }

    std::map<std::string, FFDTimelineState*> ffdTimelineStates;

    for (const auto timelineState : _ffdTimelines)
    {
        ffdTimelineStates[timelineState->slot->name] = timelineState;
    }

    for (const auto slot : _armature->getSlots())
    {
        const auto& timelineName = slot->name;
        const auto& parentTimelineName = slot->getParent()->name;

        if (slot->_meshData)
        {
            const auto timelineData = _clip->getFFDTimeline(_armature->_skinData->name, timelineName, slot->getDisplayIndex());
            if (timelineData && containsBoneMask(parentTimelineName)) //  && !_isFadeOut
            {
                const auto iterator = ffdTimelineStates.find(timelineName);
                if (iterator != ffdTimelineStates.end())
                {
                    ffdTimelineStates.erase(iterator);
                }
                else
                {
                    const auto timelineState = BaseObject::borrowObject<FFDTimelineState>();
                    timelineState->slot = slot;
                    timelineState->fadeIn(_armature, this, timelineData, time);
                    _ffdTimelines.push_back(timelineState);
                }
            }
            else
            {
                const auto totalCount = slot->_ffdVertices.size();
                slot->_ffdVertices.clear();
                slot->_ffdVertices.resize(totalCount, 0.f);
                slot->_ffdDirty = true;
            }
        }
    }

    for (const auto& pair : ffdTimelineStates)
    {
        const auto timelineState = pair.second;
        _ffdTimelines.erase(std::find(_ffdTimelines.cbegin(), _ffdTimelines.cend(), timelineState));
        timelineState->returnToPool();
    }
}

void AnimationState::_advanceTime(float passedTime, float weightLeft, int index)
{
    if (passedTime != 0.f)
    {
        _advanceFadeTime(passedTime);
    }

    passedTime *= timeScale;

    if (passedTime != 0.f && _isPlaying && !_isPausePlayhead)
    {
        _time += passedTime;
        _timeline->update(_time);

        if (autoFadeOutTime >= 0.f && _fadeProgress >= 1.f && _timeline->_isCompleted)
        {
            fadeOut(autoFadeOutTime);
        }
    }

    _weightResult = weight * _fadeProgress * weightLeft;

    if (_weightResult != 0.f)
    {
        auto time = _time;
        if (!_clip->hasAsynchronyTimeline)
        {
            time = _timeline->_currentTime;
        }

        if (_fadeProgress >= 1.f && index == 0 && _armature->getCacheFrameRate() > 0)
        {
            std::size_t cacheFrameIndex = (unsigned)(_timeline->_currentTime * _clip->cacheTimeToFrameScale);
            _armature->_cacheFrameIndex = cacheFrameIndex;

            if (_armature->_animation->_animationStateDirty)
            {
                _armature->_animation->_animationStateDirty = false;

                for (const auto boneTimeline : _boneTimelines)
                {
                    boneTimeline->bone->_cacheFrames = &(boneTimeline->_timeline->cachedFrames);
                }

                for (const auto slotTimeline : _slotTimelines)
                {
                    slotTimeline->slot->_cacheFrames = &(slotTimeline->_timeline->cachedFrames);
                }
            }

            if (!_clip->cachedFrames[cacheFrameIndex] || _clip->hasBoneTimelineEvent)
            {
                _clip->cachedFrames[cacheFrameIndex] = true;

                for (const auto timelineState : _boneTimelines)
                {
                    timelineState->update(time);
                }
            }
        }
        else
        {
            _armature->_cacheFrameIndex = -1;

            for (const auto timelineState : _boneTimelines)
            {
                timelineState->update(time);
            }
        }

        for (const auto timelineState : _slotTimelines)
        {
            timelineState->update(time);
        }

        for (const auto timelineState : _ffdTimelines)
        {
            timelineState->update(time);
        }
    }
}

void AnimationState::play()
{
    _isPlaying = true;
}

void AnimationState::stop()
{
    _isPlaying = false;
}

void AnimationState::fadeOut(float fadeOutTime, bool pausePlayhead)
{
    if (fadeOutTime < 0.f || fadeOutTime != fadeOutTime)
    {
        fadeOutTime = 0.f;
    }

    _isPausePlayhead = pausePlayhead;

    if (_isFadeOut)
    {
        if (fadeOutTime > fadeOutTime - _fadeTime)
        {
            return;
        }
    }
    else
    {
        _isFadeOut = true;
        if (fadeOutTime == 0.f || _fadeProgress <= 0.f)
        {
            _fadeProgress = 0.000001f;
        }

        for (const auto timelineState : _boneTimelines)
        {
            timelineState->fadeOut();
        }

        for (const auto timelineState : _slotTimelines)
        {
            timelineState->fadeOut();
        }
    }

    displayControl = false;
    fadeTotalTime = _fadeProgress > 0.000001f ? fadeOutTime / _fadeProgress : 0.f;
    _fadeTime = fadeTotalTime * (1.f - _fadeProgress);
}

void AnimationState::addBoneMask(const std::string& name, bool recursive)
{
    const auto currentBone = _armature->getBone(name);
    if (!currentBone)
    {
        return;
    }

    if (
        std::find(_boneMask.cbegin(), _boneMask.cend(), name) == _boneMask.cend() &&
        _clip->getBoneTimeline(name)
        )
    {
        _boneMask.push_back(name);
    }

    if (recursive)
    {
        for (const auto bone : _armature->getBones())
        {
            const auto& boneName = bone->name;
            if (
                std::find(_boneMask.cbegin(), _boneMask.cend(), boneName) == _boneMask.cend() &&
                _clip->getBoneTimeline(boneName) &&
                currentBone->contains(bone)
                )
            {
                _boneMask.push_back(boneName);
            }
        }
    }

    _updateTimelineStates();
}

void AnimationState::removeBoneMask(const std::string& name, bool recursive)
{
    const auto iterator = std::find(_boneMask.cbegin(), _boneMask.cend(), name);
    if (iterator != _boneMask.cend())
    {
        _boneMask.erase(iterator);
    }

    if (recursive)
    {
        const auto currentBone = _armature->getBone(name);
        if (currentBone)
        {
            for (const auto bone : _armature->getBones())
            {
                const auto boneName = bone->name;
                const auto iterator = std::find(_boneMask.cbegin(), _boneMask.cend(), boneName);
                if (
                    iterator != _boneMask.cend() &&
                    currentBone->contains(bone)
                    )
                {
                    _boneMask.erase(iterator);
                }
            }
        }
    }

    _updateTimelineStates();
}

void AnimationState::removeAllBoneMask()
{
    _boneMask.clear();
    _updateTimelineStates();
}

bool AnimationState::getIsCompleted() const
{
    return _timeline->_isCompleted;
}

float AnimationState::getCurrentTime() const
{
    return _timeline->_currentTime;
}

void AnimationState::setCurrentTime(float value)
{
    if (value < 0 || value != value)
    {
        value = 0;
    }

    _time = value;
    _timeline->setCurrentTime(_time);

    if (_weightResult != 0.f)
    {
        auto time = _time;
        if (!_clip->hasAsynchronyTimeline)
        {
            time = _timeline->_currentTime;
        }

        for (const auto timeline : _boneTimelines)
        {
            timeline->setCurrentTime(time);
        }

        for (const auto timeline : _slotTimelines)
        {
            timeline->setCurrentTime(time);
        }

        for (const auto timeline : _ffdTimelines)
        {
            timeline->setCurrentTime(time);
        }
    }
}

DRAGONBONES_NAMESPACE_END