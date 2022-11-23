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
#ifndef DRAGONBONES_BASE_TIMELINE_STATE_H
#define DRAGONBONES_BASE_TIMELINE_STATE_H

#include "../core/BaseObject.h"
#include "../geom/Transform.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * @internal
 */
class TimelineState : public BaseObject {
    ABSTRACT_CLASS(TimelineState)

protected:
    /**
     * @internal
     */
    enum class TweenState {
        None = 0,
        Once = 1,
        Always = 2
    };

public:
    /**
     * -1: start, 0: play, 1: complete;
     */
    int playState;
    int currentPlayTimes;
    float currentTime;

protected:
    TweenState _tweenState;
    unsigned _frameRate;
    unsigned _frameValueOffset;
    unsigned _frameCount;
    unsigned _frameOffset;
    int _frameIndex;
    float _frameRateR;
    float _position;
    float _duration;
    float _timeScale;
    float _timeOffset;
    DragonBonesData* _dragonBonesData;
    AnimationData* _animationData;
    TimelineData* _timelineData;
    Armature* _armature;
    AnimationState* _animationState;
    TimelineState* _actionTimeline;
    const int16_t* _frameArray;
    const int16_t* _frameIntArray;
    const float* _frameFloatArray;
    const uint16_t* _timelineArray;
    const std::vector<unsigned>* _frameIndices;

protected:
    virtual void _onClear() override;
    virtual void _onArriveAtFrame() = 0;
    virtual void _onUpdateFrame() = 0;
    bool _setCurrentTime(float passedTime);

public:
    virtual void init(Armature* armature, AnimationState* animationState, TimelineData* timelineData);
    virtual void fadeOut() {}
    virtual void update(float passedTime);
};
/**
 * @internal
 */
class TweenTimelineState : public TimelineState {
    ABSTRACT_CLASS(TweenTimelineState)

private:
    inline static float _getEasingValue(TweenType tweenType, float progress, float easing) {
        auto value = progress;
        switch (tweenType) {
            case TweenType::QuadIn:
                value = std::pow(progress, 2.0f);
                break;

            case TweenType::QuadOut:
                value = 1.0f - std::pow(1.0f - progress, 2.0f);
                break;

            case TweenType::QuadInOut:
                value = 0.5f * (1.0f - std::cos(progress * Transform::PI));
                break;
            default:
                break;
        }

        return (value - progress) * easing + progress;
    }

    inline static float _getEasingCurveValue(float progress, const int16_t* samples, unsigned count, unsigned offset) {
        if (progress <= 0.0f) {
            return 0.0f;
        } else if (progress >= 1.0f) {
            return 1.0f;
        }

        const auto segmentCount = count + 1; // + 2 - 1
        const auto valueIndex = (unsigned)(progress * segmentCount);
        const auto fromValue = valueIndex == 0 ? 0.0f : samples[offset + valueIndex - 1];
        const auto toValue = (valueIndex == segmentCount - 1) ? 10000.0f : samples[offset + valueIndex];

        return (fromValue + (toValue - fromValue) * (progress * segmentCount - valueIndex)) * 0.0001f;
    }

protected:
    TweenType _tweenType;
    unsigned _curveCount;
    float _framePosition;
    float _frameDurationR;
    float _tweenProgress;
    float _tweenEasing;

protected:
    virtual void _onClear() override;
    virtual void _onArriveAtFrame() override;
    virtual void _onUpdateFrame() override;
};
/**
 * @internal
 */
class BoneTimelineState : public TweenTimelineState {
    ABSTRACT_CLASS(BoneTimelineState)

public:
    Bone* bone;
    BonePose* bonePose;

protected:
    virtual void _onClear() override;

public:
    void blend(int state);
};
/**
 * @internal
 */
class SlotTimelineState : public TweenTimelineState {
    ABSTRACT_CLASS(SlotTimelineState)

public:
    Slot* slot;

protected:
    virtual void _onClear() override;
};
/**
 * @internal
 */
class ConstraintTimelineState : public TweenTimelineState {
    ABSTRACT_CLASS(ConstraintTimelineState)

public:
    Constraint* constraint;

protected:
    virtual void _onClear() override;
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_BASE_TIMELINE_STATE_H
