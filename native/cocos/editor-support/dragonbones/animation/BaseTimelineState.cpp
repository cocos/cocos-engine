#include "BaseTimelineState.h"
#include "../armature/Armature.h"
#include "../armature/Bone.h"
#include "../armature/Slot.h"
#include "../model/AnimationData.h"
#include "../model/ArmatureData.h"
#include "../model/DragonBonesData.h"
#include "AnimationState.h"
#include "TimelineState.h"

#include <math.h>

DRAGONBONES_NAMESPACE_BEGIN

void TimelineState::_onClear() {
    playState = -1;
    currentPlayTimes = -1;
    currentTime = -1.0f;

    _tweenState = TweenState::None;
    _frameRate = 0;
    _frameValueOffset = 0;
    _frameCount = 0;
    _frameOffset = 0;
    _frameIndex = -1;
    _frameRateR = 0.0f;
    _position = 0.0f;
    _duration = 0.0f;
    _timeScale = 1.0f;
    _timeOffset = 0.0f;
    _dragonBonesData = nullptr;
    _animationData = nullptr;
    _timelineData = nullptr;
    _armature = nullptr;
    _animationState = nullptr;
    _actionTimeline = nullptr;
    _frameArray = nullptr;
    _frameIntArray = nullptr;
    _frameFloatArray = nullptr;
    _timelineArray = nullptr;
    _frameIndices = nullptr;
}

bool TimelineState::_setCurrentTime(float passedTime) {
    const auto prevState = playState;
    const auto prevPlayTimes = currentPlayTimes;
    const auto prevTime = currentTime;

    if (_actionTimeline != nullptr && _frameCount <= 1) // No frame or only one frame.
    {
        playState = _actionTimeline->playState >= 0 ? 1 : -1;
        currentPlayTimes = 1;
        currentTime = _actionTimeline->currentTime;
    } else if (_actionTimeline == nullptr || _timeScale != 1.0f || _timeOffset != 0.0f) // Action timeline or has scale and offset.
    {
        const auto playTimes = _animationState->playTimes;
        const auto totalTime = playTimes * _duration;

        passedTime *= _timeScale;
        if (_timeOffset != 0.0f) {
            passedTime += _timeOffset * _animationData->duration;
        }

        if (playTimes > 0 && (passedTime >= totalTime || passedTime <= -totalTime)) {
            if (playState <= 0 && _animationState->_playheadState == 3) {
                playState = 1;
            }

            currentPlayTimes = playTimes;
            if (passedTime < 0.0f) {
                currentTime = 0.0f;
            } else {
                currentTime = _duration + 0.000001f; // Precision problem
            }
        } else {
            if (playState != 0 && _animationState->_playheadState == 3) {
                playState = 0;
            }

            if (passedTime < 0.0f) {
                passedTime = -passedTime;
                currentPlayTimes = (int)(passedTime / _duration);
                currentTime = _duration - fmod(passedTime, _duration);
            } else {
                currentPlayTimes = (int)(passedTime / _duration);
                currentTime = fmod(passedTime, _duration);
            }
        }

        currentTime += _position;
    } else // Multi frames.
    {
        playState = _actionTimeline->playState;
        currentPlayTimes = _actionTimeline->currentPlayTimes;
        currentTime = _actionTimeline->currentTime;
    }

    if (currentPlayTimes == prevPlayTimes && currentTime == prevTime) {
        return false;
    }

    // Clear frame flag when timeline start or loopComplete.
    if (
        (prevState < 0 && playState != prevState) ||
        (playState <= 0 && currentPlayTimes != prevPlayTimes)) {
        _frameIndex = -1;
    }

    return true;
}

void TimelineState::init(Armature* armature, AnimationState* animationState, TimelineData* timelineData) {
    _armature = armature;
    _animationState = animationState;
    _timelineData = timelineData;
    _actionTimeline = _animationState->_actionTimeline;

    if (this == _actionTimeline) {
        _actionTimeline = nullptr; //
    }

    _animationData = _animationState->_animationData;

    _frameRate = _animationData->parent->frameRate;
    _frameRateR = 1.0f / _frameRate;
    _position = _animationState->_position;
    _duration = _animationState->_duration;
    _dragonBonesData = _animationData->parent->parent;

    if (_timelineData != nullptr) {
        _frameIntArray = _dragonBonesData->frameIntArray;
        _frameFloatArray = _dragonBonesData->frameFloatArray;
        _frameArray = _dragonBonesData->frameArray;
        _timelineArray = _dragonBonesData->timelineArray;
        _frameIndices = &(_dragonBonesData->frameIndices);

        _frameCount = _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineKeyFrameCount];
        _frameValueOffset = _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineFrameValueOffset];
        _timeScale = 100.0f / _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineScale];
        _timeOffset = _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineOffset] * 0.01f;
    }
}

void TimelineState::update(float passedTime) {
    if (_setCurrentTime(passedTime)) {
        if (_frameCount > 1) {
            const auto timelineFrameIndex = (unsigned)(currentTime * _frameRate);
            const auto frameIndex = (*_frameIndices)[_timelineData->frameIndicesOffset + timelineFrameIndex];
            if ((unsigned)_frameIndex != frameIndex) {
                _frameIndex = frameIndex;
                _frameOffset = _animationData->frameOffset + _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineFrameOffset + _frameIndex];

                _onArriveAtFrame();
            }
        } else if (_frameIndex < 0) {
            _frameIndex = 0;
            if (_timelineData != nullptr) // May be pose timeline.
            {
                _frameOffset = _animationData->frameOffset + _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineFrameOffset];
            }

            _onArriveAtFrame();
        }

        if (_tweenState != TweenState::None) {
            _onUpdateFrame();
        }
    }
}

void TweenTimelineState::_onClear() {
    TimelineState::_onClear();

    _tweenType = TweenType::None;
    _curveCount = 0;
    _framePosition = 0.0f;
    _frameDurationR = 0.0f;
    _tweenProgress = 0.0f;
    _tweenEasing = 0.0f;
}

void TweenTimelineState::_onArriveAtFrame() {
    if (
        _frameCount > 1 &&
        ((unsigned)_frameIndex != _frameCount - 1 ||
         _animationState->playTimes == 0 ||
         _animationState->getCurrentPlayTimes() < _animationState->playTimes - 1)) {
        _tweenType = (TweenType)_frameArray[_frameOffset + (unsigned)BinaryOffset::FrameTweenType]; // TODO recode ture tween type.
        _tweenState = _tweenType == TweenType::None ? TweenState::Once : TweenState::Always;

        if (_tweenType == TweenType::Curve) {
            _curveCount = _frameArray[_frameOffset + (unsigned)BinaryOffset::FrameTweenEasingOrCurveSampleCount];
        } else if (_tweenType != TweenType::None && _tweenType != TweenType::Line) {
            _tweenEasing = _frameArray[_frameOffset + (unsigned)BinaryOffset::FrameTweenEasingOrCurveSampleCount] * 0.01;
        }

        _framePosition = _frameArray[_frameOffset] * _frameRateR;

        if ((unsigned)_frameIndex == _frameCount - 1) {
            _frameDurationR = 1.0f / (_animationData->duration - _framePosition);
        } else {
            const auto nextFrameOffset = _animationData->frameOffset + _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineFrameOffset + _frameIndex + 1];
            const auto frameDuration = _frameArray[nextFrameOffset] * _frameRateR - _framePosition;

            if (frameDuration > 0.0f) // Fixed animation data bug.
            {
                _frameDurationR = 1.0f / frameDuration;
            } else {
                _frameDurationR = 0.0f;
            }
        }
    } else {
        _tweenState = TweenState::Once;
    }
}

void TweenTimelineState::_onUpdateFrame() {
    if (_tweenState == TweenState::Always) {
        _tweenProgress = (currentTime - _framePosition) * _frameDurationR;

        if (_tweenType == TweenType::Curve) {
            _tweenProgress = TweenTimelineState::_getEasingCurveValue(_tweenProgress, _frameArray, _curveCount, _frameOffset + (unsigned)BinaryOffset::FrameCurveSamples);
        } else if (_tweenType != TweenType::Line) {
            _tweenProgress = TweenTimelineState::_getEasingValue(_tweenType, _tweenProgress, _tweenEasing);
        }
    } else {
        _tweenProgress = 0.0f;
    }
}

void BoneTimelineState::_onClear() {
    TweenTimelineState::_onClear();

    bone = nullptr;
    bonePose = nullptr;
}

void BoneTimelineState::blend(int state) {
    const auto blendWeight = bone->_blendState.blendWeight;
    auto& animationPose = bone->animationPose;
    const auto& result = bonePose->result;

    if (state == 2) {
        animationPose.x += result.x * blendWeight;
        animationPose.y += result.y * blendWeight;
        animationPose.rotation += result.rotation * blendWeight;
        animationPose.skew += result.skew * blendWeight;
        animationPose.scaleX += (result.scaleX - 1.0f) * blendWeight;
        animationPose.scaleY += (result.scaleY - 1.0f) * blendWeight;
    } else if (blendWeight != 1.0f) {
        animationPose.x = result.x * blendWeight;
        animationPose.y = result.y * blendWeight;
        animationPose.rotation = result.rotation * blendWeight;
        animationPose.skew = result.skew * blendWeight;
        animationPose.scaleX = (result.scaleX - 1.0f) * blendWeight + 1.0f;
        animationPose.scaleY = (result.scaleY - 1.0f) * blendWeight + 1.0f;
    } else {
        animationPose.x = result.x;
        animationPose.y = result.y;
        animationPose.rotation = result.rotation;
        animationPose.skew = result.skew;
        animationPose.scaleX = result.scaleX;
        animationPose.scaleY = result.scaleY;
    }

    if (_animationState->_fadeState != 0 || _animationState->_subFadeState != 0) {
        bone->_transformDirty = true;
    }
}

void SlotTimelineState::_onClear() {
    TweenTimelineState::_onClear();

    slot = nullptr;
}

void ConstraintTimelineState::_onClear() {
    TweenTimelineState::_onClear();

    constraint = nullptr;
}
DRAGONBONES_NAMESPACE_END
