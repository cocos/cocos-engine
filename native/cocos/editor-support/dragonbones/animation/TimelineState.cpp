#include "TimelineState.h"
#include "WorldClock.h"
#include "Animation.h"
#include "../model/DragonBonesData.h"
#include "../model/UserData.h"
#include "../model/ArmatureData.h"
#include "../model/ConstraintData.h"
#include "../model/DisplayData.h"
#include "../model/AnimationData.h"
#include "../event/EventObject.h"
#include "../event/IEventDispatcher.h"
#include "../armature/Armature.h"
#include "../armature/Bone.h"
#include "../armature/Slot.h"
#include "../armature/Constraint.h"
#include "../armature/DeformVertices.h"
#include "AnimationState.h"

DRAGONBONES_NAMESPACE_BEGIN

void ActionTimelineState::_onCrossFrame(unsigned frameIndex) const
{
    const auto eventDispatcher = _armature->getProxy();

    if (_animationState->actionEnabled)
    {
        const auto frameOffset = _animationData->frameOffset + _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineFrameOffset + frameIndex];
        const unsigned actionCount = _frameArray[frameOffset + 1];
        const auto& actions = _animationData->parent->actions; // May be the animaton data not belong to this armature data.

        for (std::size_t i = 0; i < actionCount; ++i)
        {
            const auto actionIndex = _frameArray[frameOffset + 2 + i];
            const auto action = actions[actionIndex];

            if (action->type == ActionType::Play)
            {
                const auto eventObject = BaseObject::borrowObject<EventObject>();
                // eventObject->time = _frameArray[frameOffset] * _frameRateR; // Precision problem
                eventObject->time = _frameArray[frameOffset] / _frameRate;
                eventObject->animationState = _animationState;
                EventObject::actionDataToInstance(action, eventObject, _armature);
                _armature->_bufferAction(eventObject, true);
            }
            else
            {
                const auto eventType = action->type == ActionType::Frame ? EventObject::FRAME_EVENT : EventObject::SOUND_EVENT;
                if (action->type == ActionType::Sound || eventDispatcher->hasDBEventListener(eventType)) 
                {
                    const auto eventObject = BaseObject::borrowObject<EventObject>();
                    // eventObject->time = _frameArray[frameOffset] * _frameRateR; // Precision problem
                    eventObject->time = _frameArray[frameOffset] / _frameRate;
                    eventObject->animationState = _animationState;
                    EventObject::actionDataToInstance(action, eventObject, _armature);
                    _armature->_dragonBones->bufferEvent(eventObject);
                }
            }
        }
    }
}

void ActionTimelineState::update(float passedTime)
{
    const auto prevState = playState;
    auto prevPlayTimes = currentPlayTimes;
    auto prevTime = currentTime;

    if (_setCurrentTime(passedTime)) 
    {
        const auto eventDispatcher = _armature->getProxy();
        if (prevState < 0) 
        {
            if (playState != prevState)
            {
                if (_animationState->displayControl && _animationState->resetToPose) // Reset zorder to pose.
                {
                    _armature->_sortZOrder(nullptr, 0);
                }

                prevPlayTimes = currentPlayTimes;

                if (eventDispatcher->hasDBEventListener(EventObject::START))
                {
                    const auto eventObject = BaseObject::borrowObject<EventObject>();
                    eventObject->type = EventObject::START;
                    eventObject->armature = _armature;
                    eventObject->animationState = _animationState;
                    _armature->_dragonBones->bufferEvent(eventObject);
                }
            }
            else 
            {
                return;
            }
        }

        const auto isReverse = _animationState->timeScale < 0.0f;
        EventObject* loopCompleteEvent = nullptr;
        EventObject* completeEvent = nullptr;

        if (currentPlayTimes != prevPlayTimes) 
        {
            if (eventDispatcher->hasDBEventListener(EventObject::LOOP_COMPLETE))
            {
                loopCompleteEvent = BaseObject::borrowObject<EventObject>();
                loopCompleteEvent->type = EventObject::LOOP_COMPLETE;
                loopCompleteEvent->armature = _armature;
                loopCompleteEvent->animationState = _animationState;
            }

            if (playState > 0) 
            {
                if (eventDispatcher->hasDBEventListener(EventObject::COMPLETE))
                {
                    completeEvent = BaseObject::borrowObject<EventObject>();
                    completeEvent->type = EventObject::COMPLETE;
                    completeEvent->armature = _armature;
                    completeEvent->animationState = _animationState;
                }
            }
        }

        if (_frameCount > 1) 
        {
            const auto timelineData = _timelineData;
            const auto timelineFrameIndex = (unsigned)(currentTime * _frameRate); // uint
            const auto frameIndex = (*_frameIndices)[timelineData->frameIndicesOffset + timelineFrameIndex];

            if ((unsigned)_frameIndex != frameIndex) // Arrive at frame.  
            {
                auto crossedFrameIndex = _frameIndex;
                _frameIndex = frameIndex;

                if (_timelineArray != nullptr)
                {
                    _frameOffset = _animationData->frameOffset + _timelineArray[timelineData->offset + (unsigned)BinaryOffset::TimelineFrameOffset + _frameIndex];

                    if (isReverse) 
                    {
                        if (crossedFrameIndex < 0) 
                        {
                            const auto prevFrameIndex = (unsigned)(prevTime * _frameRate);
                            crossedFrameIndex = (*_frameIndices)[timelineData->frameIndicesOffset + prevFrameIndex];

                            if (currentPlayTimes == prevPlayTimes) // Start.
                            {
                                if ((unsigned)crossedFrameIndex == frameIndex) // Uncrossed.
                                {
                                    crossedFrameIndex = -1;
                                }
                            }
                        }

                        while (crossedFrameIndex >= 0) 
                        {
                            const auto frameOffset = _animationData->frameOffset + _timelineArray[timelineData->offset + (unsigned)BinaryOffset::TimelineFrameOffset + crossedFrameIndex];
                            const auto framePosition = (float)_frameArray[frameOffset] / _frameRate;

                            if (
                                _position <= framePosition &&
                                framePosition <= _position + _duration
                            )  // Support interval play.
                            {
                                _onCrossFrame(crossedFrameIndex);
                            }

                            if (loopCompleteEvent != nullptr && crossedFrameIndex == 0) // Add loop complete event after first frame.
                            { 
                                _armature->_dragonBones->bufferEvent(loopCompleteEvent);
                                loopCompleteEvent = nullptr;
                            }

                            if (crossedFrameIndex > 0) 
                            {
                                crossedFrameIndex--;
                            }
                            else 
                            {
                                crossedFrameIndex = _frameCount - 1;
                            }

                            if ((unsigned)crossedFrameIndex ==  frameIndex)
                            {
                                break;
                            }
                        }
                    }
                    else 
                    {
                        if (crossedFrameIndex < 0)
                        {
                            const auto prevFrameIndex = (unsigned)(prevTime * _frameRate);
                            crossedFrameIndex = (*_frameIndices)[timelineData->frameIndicesOffset + prevFrameIndex];
                            const auto frameOffset = _animationData->frameOffset + _timelineArray[timelineData->offset + (unsigned)BinaryOffset::TimelineFrameOffset + crossedFrameIndex];
                            const auto framePosition = (float)_frameArray[frameOffset] / _frameRate;

                            if (currentPlayTimes == prevPlayTimes) // Start.
                            { 
                                if (prevTime <= framePosition) // Crossed.
                                {
                                    if (crossedFrameIndex > 0) 
                                    {
                                        crossedFrameIndex--;
                                    }
                                    else 
                                    {
                                        crossedFrameIndex = _frameCount - 1;
                                    }
                                }
                                else if ((unsigned)crossedFrameIndex == frameIndex) // Uncrossed.
                                { 
                                    crossedFrameIndex = -1;
                                }
                            }
                        }

                        while (crossedFrameIndex >= 0) 
                        {
                            if ((unsigned)crossedFrameIndex < _frameCount - 1) 
                            {
                                crossedFrameIndex++;
                            }
                            else 
                            {
                                crossedFrameIndex = 0;
                            }

                            const auto frameOffset = _animationData->frameOffset + _timelineArray[timelineData->offset + (unsigned)BinaryOffset::TimelineFrameOffset + crossedFrameIndex];
                            const auto framePosition = (float)_frameArray[frameOffset] / _frameRate;

                            if (
                                _position <= framePosition &&
                                framePosition <= _position + _duration
                            ) // Support interval play.
                            {
                                _onCrossFrame(crossedFrameIndex);
                            }

                            if (loopCompleteEvent != nullptr && crossedFrameIndex == 0) // Add loop complete event before first frame.
                            {
                                _armature->_dragonBones->bufferEvent(loopCompleteEvent);
                                loopCompleteEvent = nullptr;
                            }

                            if ((unsigned)crossedFrameIndex == frameIndex)
                            {
                                break;
                            }
                        }
                    }
                }
            }
        }
        else if (_frameIndex < 0) 
        {
            _frameIndex = 0;
            if (_timelineData != nullptr)
            {
                _frameOffset = _animationData->frameOffset + _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineFrameOffset];
                // Arrive at frame.
                const auto framePosition = (float)_frameArray[_frameOffset] / _frameRate;

                if (currentPlayTimes == prevPlayTimes) // Start.
                {
                    if (prevTime <= framePosition) 
                    {
                        _onCrossFrame(_frameIndex);
                    }
                }
                else if (_position <= framePosition) // Loop complete.
                {
                    if (!isReverse && loopCompleteEvent != nullptr) // Add loop complete event before first frame.
                    {
                        _armature->_dragonBones->bufferEvent(loopCompleteEvent);
                        loopCompleteEvent = nullptr;
                    }

                    _onCrossFrame(_frameIndex);
                }
            }
        }

        if (loopCompleteEvent != nullptr)
        {
            _armature->_dragonBones->bufferEvent(loopCompleteEvent);
        }

        if (completeEvent != nullptr)
        {
            _armature->_dragonBones->bufferEvent(completeEvent);
        }
    }
}

void ActionTimelineState::setCurrentTime(float value)
{
    _setCurrentTime(value);
    _frameIndex = -1;
}

void ZOrderTimelineState::_onArriveAtFrame()
{
    if (playState >= 0) 
    {
        const auto count = _frameArray[_frameOffset + 1];
        if (count > 0) 
        {
            _armature->_sortZOrder(_frameArray, _frameOffset + 2);
        }
        else {
            _armature->_sortZOrder(nullptr, 0);
        }
    }
}

void BoneAllTimelineState::_onArriveAtFrame()
{
    BoneTimelineState::_onArriveAtFrame();

    if (_timelineData != nullptr) 
    {
        auto valueOffset = _animationData->frameFloatOffset + _frameValueOffset + _frameIndex * 6; // ...(timeline value offset)|xxxxxx|xxxxxx|(Value offset)xxxxx|(Next offset)xxxxx|xxxxxx|xxxxxx|...
        const auto scale = _armature->_armatureData->scale;
        const auto frameFloatArray = _frameFloatArray;
        auto& current = bonePose->current;
        auto& delta = bonePose->delta;
        //
        current.x = frameFloatArray[valueOffset++] * scale;
        current.y = frameFloatArray[valueOffset++] * scale;
        current.rotation = frameFloatArray[valueOffset++];
        current.skew = frameFloatArray[valueOffset++];
        current.scaleX = frameFloatArray[valueOffset++];
        current.scaleY = frameFloatArray[valueOffset++];

        if (_tweenState == TweenState::Always) 
        {
            if ((unsigned)_frameIndex == _frameCount - 1)
            {
                valueOffset = _animationData->frameFloatOffset + _frameValueOffset;
            }

            delta.x = frameFloatArray[valueOffset++] * scale - current.x;
            delta.y = frameFloatArray[valueOffset++] * scale - current.y;
            delta.rotation = frameFloatArray[valueOffset++] - current.rotation;
            delta.skew = frameFloatArray[valueOffset++] - current.skew;
            delta.scaleX = frameFloatArray[valueOffset++] - current.scaleX;
            delta.scaleY = frameFloatArray[valueOffset++] - current.scaleY;
        }
        else 
        {
            delta.x = 0.0f;
            delta.y = 0.0f;
            delta.rotation = 0.0f;
            delta.skew = 0.0f;
            delta.scaleX = 0.0f;
            delta.scaleY = 0.0f;
        }
    }
    else
    {
        auto& current = bonePose->current;
        auto& delta = bonePose->delta;
        current.x = 0.0f;
        current.y = 0.0f;
        current.rotation = 0.0f;
        current.skew = 0.0f;
        current.scaleX = 1.0f;
        current.scaleY = 1.0f;
        delta.x = 0.0f;
        delta.y = 0.0f;
        delta.rotation = 0.0f;
        delta.skew = 0.0f;
        delta.scaleX = 0.0f;
        delta.scaleY = 0.0f;
    }
}

void BoneAllTimelineState::_onUpdateFrame()
{
    BoneTimelineState::_onUpdateFrame();

    auto& current = bonePose->current;
    auto& delta = bonePose->delta;
    auto& result = bonePose->result;

    bone->_transformDirty = true;
    if (_tweenState != TweenState::Always) 
    {
        _tweenState = TweenState::None;
    }

    result.x = current.x + delta.x * _tweenProgress;
    result.y = current.y + delta.y * _tweenProgress;
    result.rotation = current.rotation + delta.rotation * _tweenProgress;
    result.skew = current.skew + delta.skew * _tweenProgress;
    result.scaleX = current.scaleX + delta.scaleX * _tweenProgress;
    result.scaleY = current.scaleY + delta.scaleY * _tweenProgress;
}

void BoneAllTimelineState::fadeOut()
{
    auto& result = bonePose->result;
    result.rotation = Transform::normalizeRadian(result.rotation);
    result.skew = Transform::normalizeRadian(result.skew);
}

void BoneTranslateTimelineState::_onArriveAtFrame()
{
    BoneTimelineState::_onArriveAtFrame();

    if (_timelineData != nullptr)
    {
        auto valueOffset = _animationData->frameFloatOffset + _frameValueOffset + _frameIndex * 2;
        const auto scale = _armature->_armatureData->scale;
        const auto frameFloatArray = _frameFloatArray;
        auto& current = bonePose->current;
        auto& delta = bonePose->delta;

        current.x = frameFloatArray[valueOffset++] * scale;
        current.y = frameFloatArray[valueOffset++] * scale;

        if (_tweenState == TweenState::Always)
        {
            if ((unsigned)_frameIndex == _frameCount - 1)
            {
                valueOffset = _animationData->frameFloatOffset + _frameValueOffset; // + 0 * 2
            }

            delta.x = frameFloatArray[valueOffset++] * scale - current.x;
            delta.y = frameFloatArray[valueOffset++] * scale - current.y;
        }
        else 
        {
            delta.x = 0.0f;
            delta.y = 0.0f;
        }
    }
    else
    {
        auto& current = bonePose->current;
        auto& delta = bonePose->delta;
        current.x = 0.0f;
        current.y = 0.0f;
        delta.x = 0.0f;
        delta.y = 0.0f;
    }
}

void BoneTranslateTimelineState::_onUpdateFrame()
{
    BoneTimelineState::_onUpdateFrame();

    auto& current = bonePose->current;
    auto& delta = bonePose->delta;
    auto& result = bonePose->result;

    bone->_transformDirty = true;
    if (_tweenState != TweenState::Always)
    {
        _tweenState = TweenState::None;
    }

    result.x = current.x + delta.x * _tweenProgress;
    result.y = current.y + delta.y * _tweenProgress;
}

void BoneRotateTimelineState::_onArriveAtFrame()
{
    BoneTimelineState::_onArriveAtFrame();

    if (_timelineData != nullptr)
    {
        auto valueOffset = _animationData->frameFloatOffset + _frameValueOffset + _frameIndex * 2;
        const auto frameFloatArray = _frameFloatArray;
        auto& current = bonePose->current;
        auto& delta = bonePose->delta;

        current.rotation = frameFloatArray[valueOffset++];
        current.skew = frameFloatArray[valueOffset++];

        if (_tweenState == TweenState::Always)
        {
            if ((unsigned)_frameIndex == _frameCount - 1)
            {
                valueOffset = _animationData->frameFloatOffset + _frameValueOffset; // + 0 * 2
                delta.rotation = Transform::normalizeRadian(frameFloatArray[valueOffset++] - current.rotation);
            }
            else 
            {
                delta.rotation = frameFloatArray[valueOffset++] - current.rotation;
            }

            delta.skew = frameFloatArray[valueOffset++] - current.skew;
        }
        else 
        {
            delta.rotation = 0.0f;
            delta.skew = 0.0f;
        }
    }
    else
    {
        auto& current = bonePose->current;
        auto& delta = bonePose->delta;
        current.rotation = 0.0f;
        current.skew = 0.0f;
        delta.rotation = 0.0f;
        delta.skew = 0.0f;
    }
}

void BoneRotateTimelineState::_onUpdateFrame()
{
    BoneTimelineState::_onUpdateFrame();

    auto& current = bonePose->current;
    auto& delta = bonePose->delta;
    auto& result = bonePose->result;

    bone->_transformDirty = true;
    if (_tweenState != TweenState::Always)
    {
        _tweenState = TweenState::None;
    }

    result.rotation = current.rotation + delta.rotation * _tweenProgress;
    result.skew = current.skew + delta.skew * _tweenProgress;
}

void BoneRotateTimelineState::fadeOut()
{
    auto& result = bonePose->result;
    result.rotation = Transform::normalizeRadian(result.rotation);
    result.skew = Transform::normalizeRadian(result.skew);
}

void BoneScaleTimelineState::_onArriveAtFrame()
{
    BoneTimelineState::_onArriveAtFrame();

    if (_timelineData != nullptr)
    {
        auto valueOffset = _animationData->frameFloatOffset + _frameValueOffset + _frameIndex * 2;
        const auto frameFloatArray = _frameFloatArray;
        auto& current = bonePose->current;
        auto& delta = bonePose->delta;

        current.scaleX = frameFloatArray[valueOffset++];
        current.scaleY = frameFloatArray[valueOffset++];

        if (_tweenState == TweenState::Always)
        {
            if ((unsigned)_frameIndex == _frameCount - 1)
            {
                valueOffset = _animationData->frameFloatOffset + _frameValueOffset; // + 0 * 2
            }

            delta.scaleX = frameFloatArray[valueOffset++] - current.scaleX;
            delta.scaleY = frameFloatArray[valueOffset++] - current.scaleY;
        }
        else 
        {
            delta.scaleX = 0.0f;
            delta.scaleY = 0.0f;
        }
    }
    else
    {
        auto& current = bonePose->current;
        auto& delta = bonePose->delta;
        current.scaleX = 1.0f;
        current.scaleY = 1.0f;
        delta.scaleX = 0.0f;
        delta.scaleY = 0.0f;
    }
}

void BoneScaleTimelineState::_onUpdateFrame()
{
    BoneTimelineState::_onUpdateFrame();

    auto& current = bonePose->current;
    auto& delta = bonePose->delta;
    auto& result = bonePose->result;

    bone->_transformDirty = true;
    if (_tweenState != TweenState::Always)
    {
        _tweenState = TweenState::None;
    }

    result.scaleX = current.scaleX + delta.scaleX * _tweenProgress;
    result.scaleY = current.scaleY + delta.scaleY * _tweenProgress;
}

void SlotDislayTimelineState::_onArriveAtFrame()
{
    if (playState >= 0) 
    {
        const auto displayIndex = _timelineData != nullptr ? _frameArray[_frameOffset + 1] : slot->_slotData->displayIndex;
        if (slot->getDisplayIndex() != displayIndex) 
        {
            slot->_setDisplayIndex(displayIndex, true);
        }
    }
}

void SlotColorTimelineState::_onClear()
{
    SlotTimelineState::_onClear();

    _dirty = false;
}

void SlotColorTimelineState::_onArriveAtFrame()
{
    SlotTimelineState::_onArriveAtFrame();

    if (_timelineData != nullptr) 
    {
        const auto intArray = _dragonBonesData->intArray;
        const auto frameIntArray = _frameIntArray;
        const auto valueOffset = _animationData->frameIntOffset + _frameValueOffset + _frameIndex * 1; // ...(timeline value offset)|x|x|(Value offset)|(Next offset)|x|x|...
        int colorOffset = frameIntArray[valueOffset];

        if (colorOffset < 0)
        {
            colorOffset += 65536; // Fixed out of bouds bug. 
        }

        _current[0] = intArray[colorOffset++];
        _current[1] = intArray[colorOffset++];
        _current[2] = intArray[colorOffset++];
        _current[3] = intArray[colorOffset++];
        _current[4] = intArray[colorOffset++];
        _current[5] = intArray[colorOffset++];
        _current[6] = intArray[colorOffset++];
        _current[7] = intArray[colorOffset++];

        if (_tweenState == TweenState::Always) 
        {
            if ((unsigned)_frameIndex == _frameCount - 1)
            {
                colorOffset = frameIntArray[_animationData->frameIntOffset + _frameValueOffset];
            }
            else 
            {
                colorOffset = frameIntArray[valueOffset + 1 * 1];
            }

            if (colorOffset < 0)
            {
                colorOffset += 65536; // Fixed out of bouds bug. 
            }

            _delta[0] = intArray[colorOffset++] - _current[0];
            _delta[1] = intArray[colorOffset++] - _current[1];
            _delta[2] = intArray[colorOffset++] - _current[2];
            _delta[3] = intArray[colorOffset++] - _current[3];
            _delta[4] = intArray[colorOffset++] - _current[4];
            _delta[5] = intArray[colorOffset++] - _current[5];
            _delta[6] = intArray[colorOffset++] - _current[6];
            _delta[7] = intArray[colorOffset++] - _current[7];
        }
    }
    else 
    {
        const auto color = slot->_slotData->color;

        _current[0] = color->alphaMultiplier * 100.0f;
        _current[1] = color->redMultiplier * 100.0f;
        _current[2] = color->greenMultiplier * 100.0f;
        _current[3] = color->blueMultiplier * 100.0f;
        _current[4] = color->alphaOffset;
        _current[5] = color->redOffset;
        _current[6] = color->greenOffset;
        _current[7] = color->blueOffset;
    }
}

void SlotColorTimelineState::_onUpdateFrame()
{
    SlotTimelineState::_onUpdateFrame();

    _dirty = true;
    if (_tweenState != TweenState::Always) 
    {
        _tweenState = TweenState::None;
    }

    _result[0] = (_current[0] + _delta[0] * _tweenProgress) * 0.01f;
    _result[1] = (_current[1] + _delta[1] * _tweenProgress) * 0.01f;
    _result[2] = (_current[2] + _delta[2] * _tweenProgress) * 0.01f;
    _result[3] = (_current[3] + _delta[3] * _tweenProgress) * 0.01f;
    _result[4] = _current[4] + _delta[4] * _tweenProgress;
    _result[5] = _current[5] + _delta[5] * _tweenProgress;
    _result[6] = _current[6] + _delta[6] * _tweenProgress;
    _result[7] = _current[7] + _delta[7] * _tweenProgress;
}

void SlotColorTimelineState::fadeOut()
{
    _tweenState = TweenState::None;
    _dirty = false;
}

void SlotColorTimelineState::update(float passedTime)
{
    SlotTimelineState::update(passedTime);

    // Fade animation.
    if (_tweenState != TweenState::None || _dirty) 
    {
        auto& result = slot->_colorTransform;

        if (_animationState->_fadeState != 0 || _animationState->_subFadeState != 0)
        {
            if (
                result.alphaMultiplier != _result[0] ||
                result.redMultiplier != _result[1] ||
                result.greenMultiplier != _result[2] ||
                result.blueMultiplier != _result[3] ||
                result.alphaOffset != _result[4] ||
                result.redOffset != _result[5] ||
                result.greenOffset != _result[6] ||
                result.blueOffset != _result[7]
            ) 
            {
                const auto fadeProgress = pow(_animationState->_fadeProgress, 2);

                result.alphaMultiplier += (_result[0] - result.alphaMultiplier) * fadeProgress;
                result.redMultiplier += (_result[1] - result.redMultiplier) * fadeProgress;
                result.greenMultiplier += (_result[2] - result.greenMultiplier) * fadeProgress;
                result.blueMultiplier += (_result[3] - result.blueMultiplier) * fadeProgress;
                result.alphaOffset += (_result[4] - result.alphaOffset) * fadeProgress;
                result.redOffset += (_result[5] - result.redOffset) * fadeProgress;
                result.greenOffset += (_result[6] - result.greenOffset) * fadeProgress;
                result.blueOffset += (_result[7] - result.blueOffset) * fadeProgress;

                slot->_colorDirty = true;
            }
        }
        else if (_dirty) 
        {
            _dirty = false;
            if (
                result.alphaMultiplier != _result[0] ||
                result.redMultiplier != _result[1] ||
                result.greenMultiplier != _result[2] ||
                result.blueMultiplier != _result[3] ||
                result.alphaOffset != _result[4] ||
                result.redOffset != _result[5] ||
                result.greenOffset != _result[6] ||
                result.blueOffset != _result[7]
            ) 
            {
                result.alphaMultiplier = _result[0];
                result.redMultiplier = _result[1];
                result.greenMultiplier = _result[2];
                result.blueMultiplier = _result[3];
                result.alphaOffset = _result[4];
                result.redOffset = _result[5];
                result.greenOffset = _result[6];
                result.blueOffset = _result[7];

                slot->_colorDirty = true;
            }
        }
    }
}

void DeformTimelineState::_onClear()
{
    SlotTimelineState::_onClear();

    vertexOffset = 0;

    _dirty = false;
    _frameFloatOffset = 0;
    _deformCount = 0;
    _valueCount = 0;
    _valueOffset = 0;
    _current.clear();
    _delta.clear();
    _result.clear();
}

void DeformTimelineState::_onArriveAtFrame()
{
    SlotTimelineState::_onArriveAtFrame();

    if (_timelineData != nullptr) 
    {
        const auto valueOffset = _animationData->frameFloatOffset + _frameValueOffset + _frameIndex * _valueCount;
        const auto scale = _armature->_armatureData->scale;
        const auto frameFloatArray = _frameFloatArray;

        if (_tweenState == TweenState::Always)
        {
            auto nextValueOffset = valueOffset + _valueCount;
            if ((unsigned)_frameIndex == _frameCount - 1)
            {
                nextValueOffset = _animationData->frameFloatOffset + _frameValueOffset;
            }

            for (std::size_t i = 0; i < _valueCount; ++i)
            {
                _delta[i] = frameFloatArray[nextValueOffset + i] * scale - (_current[i] = frameFloatArray[valueOffset + i] * scale);
            }
        }
        else 
        {
            for (std::size_t i = 0; i < _valueCount; ++i)
            {
                _current[i] = frameFloatArray[valueOffset + i] * scale;
            }
        }
    }
    else 
    {
        for (std::size_t i = 0; i < _valueCount; ++i)
        {
            _current[i] = 0.0f;
        }
    }
}

void DeformTimelineState::_onUpdateFrame()
{
    SlotTimelineState::_onUpdateFrame();

    _dirty = true;
    if (_tweenState != TweenState::Always) 
    {
        _tweenState = TweenState::None;
    }

    for (std::size_t i = 0; i < _valueCount; ++i)
    {
        _result[i] = _current[i] + _delta[i] * _tweenProgress;
    }
}

void DeformTimelineState::init(Armature* armature, AnimationState* animationState, TimelineData* timelineData)
{
    SlotTimelineState::init(armature, animationState, timelineData);

    if (_timelineData != nullptr) 
    {
        const auto frameIntOffset = _animationData->frameIntOffset + _timelineArray[_timelineData->offset + (unsigned)BinaryOffset::TimelineFrameValueCount];
        vertexOffset = _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformVertexOffset];

        if (vertexOffset < 0)
        {
            vertexOffset += 65536; // Fixed out of bouds bug. 
        }

        _deformCount = _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformCount];
        _valueCount = _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformValueCount];
        _valueOffset = _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformValueOffset];
        _frameFloatOffset = _frameIntArray[frameIntOffset + (unsigned)BinaryOffset::DeformFloatOffset] + _animationData->frameFloatOffset;
    }
    else 
    {
        const auto deformVertices = slot->_deformVertices;
        _deformCount = deformVertices != nullptr ? deformVertices->vertices.size() : 0;
        _valueCount = _deformCount;
        _valueOffset = 0;
        _frameFloatOffset = 0;
    }

    _current.resize(_valueCount);
    _delta.resize(_valueCount, 0.0f);
    _result.resize(_valueCount);
}

void DeformTimelineState::fadeOut()
{
    _tweenState = TweenState::None;
    _dirty = false;
}

void DeformTimelineState::update(float passedTime)
{
    const auto deformVertices = slot->_deformVertices;
    if (deformVertices == nullptr || deformVertices->verticesData == nullptr || deformVertices->verticesData->offset != vertexOffset)
    {
        return;
    }
    else if (_timelineData != nullptr && _dragonBonesData != deformVertices->verticesData->data) 
    {
        return;
    }

    SlotTimelineState::update(passedTime);

    // Fade animation.
    if (_tweenState != TweenState::None || _dirty) 
    {
        auto& result = deformVertices->vertices;

        if (_animationState->_fadeState != 0 || _animationState->_subFadeState != 0)
        {
            const auto fadeProgress = pow(_animationState->_fadeProgress, 2);

            if (_timelineData != nullptr)
            {
                for (std::size_t i = 0; i < _deformCount; ++i)
                {
                    if (i < _valueOffset)
                    {
                        result[i] += (_frameFloatArray[_frameFloatOffset + i] - result[i]) * fadeProgress;
                    }
                    else if (i < _valueOffset + _valueCount)
                    {
                        result[i] += (_result[i - _valueOffset] - result[i]) * fadeProgress;
                    }
                    else
                    {
                        result[i] += (_frameFloatArray[_frameFloatOffset + i - _valueCount] - result[i]) * fadeProgress;
                    }
                }
            }
            else 
            {
                _deformCount = result.size();

                for (std::size_t i = 0; i < _deformCount; ++i)
                {
                    result[i] += (0.0f - result[i]) * fadeProgress;
                }
            }

            deformVertices->verticesDirty = true;
        }
        else if (_dirty) 
        {
            _dirty = false;

            if (_timelineData != nullptr)
            {
                for (std::size_t i = 0; i < _deformCount; ++i)
                {
                    if (i < _valueOffset)
                    {
                        result[i] = _frameFloatArray[_frameFloatOffset + i];
                    }
                    else if (i < _valueOffset + _valueCount)
                    {
                        result[i] = _result[i - _valueOffset];
                    }
                    else
                    {
                        result[i] = _frameFloatArray[_frameFloatOffset + i - _valueCount];
                    }
                }
            }
            else 
            {
                _deformCount = result.size();

                for (std::size_t i = 0; i < _deformCount; ++i)
                {
                    result[i] = 0.0f;
                }
            }

            deformVertices->verticesDirty = true;
        }
    }
}

void IKConstraintTimelineState::_onClear()
{
    ConstraintTimelineState::_onClear();

    _current = 0.0f;
    _delta = 0.0f;
}

void IKConstraintTimelineState::_onArriveAtFrame()
{
    ConstraintTimelineState::_onArriveAtFrame();

    const auto ikConstraint = static_cast<IKConstraint*>(constraint);

    if (_timelineData != nullptr)
    {
        auto valueOffset = _animationData->frameIntOffset + _frameValueOffset + _frameIndex * 2;
        const auto frameIntArray = _frameIntArray;
        const auto bendPositive = frameIntArray[valueOffset++] != 0;
        _current = frameIntArray[valueOffset++] * 0.01f;

        if (_tweenState == TweenState::Always) 
        {
            if ((unsigned)_frameIndex == _frameCount - 1)
            {
                valueOffset = _animationData->frameIntOffset + _frameValueOffset; // + 0 * 2
            }

            _delta = frameIntArray[valueOffset + 1] * 0.01f - _current;
        }
        else 
        {
            _delta = 0.0f;
        }

        ikConstraint->_bendPositive = bendPositive;
    }
    else 
    {
        const auto ikConstraintData = static_cast<IKConstraintData*>(ikConstraint->_constraintData);
        _current = ikConstraintData->weight;
        _delta = 0.0f;
        ikConstraint->_bendPositive = ikConstraintData->bendPositive;
    }

    ikConstraint->invalidUpdate();
}

void IKConstraintTimelineState::_onUpdateFrame()
{
    ConstraintTimelineState::_onUpdateFrame();

    if (_tweenState != TweenState::Always) 
    {
        _tweenState = TweenState::None;
    }

    const auto ikConstraint = static_cast<IKConstraint*>(constraint);
    ikConstraint->_weight = _current + _delta * _tweenProgress;
    ikConstraint->invalidUpdate();
}


DRAGONBONES_NAMESPACE_END
