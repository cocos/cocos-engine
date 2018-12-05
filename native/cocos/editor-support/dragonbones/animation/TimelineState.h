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
#ifndef DRAGONBONES_TIMELINE_STATE_H
#define DRAGONBONES_TIMELINE_STATE_H

#include "BaseTimelineState.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * @internal
 */
class ActionTimelineState : public TimelineState
{
    BIND_CLASS_TYPE_A(ActionTimelineState);

    void _onCrossFrame(unsigned frameIndex) const;

protected:
    virtual void _onArriveAtFrame() override {}
    virtual void _onUpdateFrame() override {}

public:
    void update(float passedTime) override;
    void setCurrentTime(float value);
};
/**
 * @internal
 */
class ZOrderTimelineState : public TimelineState 
{
    BIND_CLASS_TYPE_A(ZOrderTimelineState);

protected:
    virtual void _onArriveAtFrame() override;
    virtual void _onUpdateFrame() override {}
};
/**
 * @internal
 */
class BoneAllTimelineState : public BoneTimelineState
{
    BIND_CLASS_TYPE_A(BoneAllTimelineState);

protected:
    virtual void _onArriveAtFrame() override;
    virtual void _onUpdateFrame() override;

public:
    virtual void fadeOut() override;
};
/**
 * @internal
 */
class BoneTranslateTimelineState : public BoneTimelineState
{
    BIND_CLASS_TYPE_A(BoneTranslateTimelineState);

protected:
    virtual void _onArriveAtFrame() override;
    virtual void _onUpdateFrame() override;
};
/**
 * @internal
 */
class BoneRotateTimelineState : public BoneTimelineState
{
    BIND_CLASS_TYPE_A(BoneRotateTimelineState);

protected:
    virtual void _onArriveAtFrame() override;
    virtual void _onUpdateFrame() override;

public:
    virtual void fadeOut() override;
};
/**
 * @internal
 */
class BoneScaleTimelineState : public BoneTimelineState
{
    BIND_CLASS_TYPE_A(BoneScaleTimelineState);

protected:
    virtual void _onArriveAtFrame() override;
    virtual void _onUpdateFrame() override;
};
/**
 * @internal
 */
class SlotDislayTimelineState : public SlotTimelineState
{
    BIND_CLASS_TYPE_A(SlotDislayTimelineState);

protected:
    virtual void _onArriveAtFrame() override;
};
/**
 * @internal
 */
class SlotColorTimelineState : public SlotTimelineState
{
    BIND_CLASS_TYPE_B(SlotColorTimelineState);

private:
    bool _dirty;
    int* _current;
    int* _delta;
    float* _result;

public:
    SlotColorTimelineState() :
        _current(new int[8]{ 0 }),
        _delta(new int[8]{ 0 }),
        _result(new float[8]{ 0.0f })
    { 
        _onClear(); 
    }
    ~SlotColorTimelineState()
    {
        _onClear();

        delete _current;
        delete _delta;
        delete _result;
    }

protected:
    void _onClear() override;
    void _onArriveAtFrame() override;
    void _onUpdateFrame() override;

public:
    void fadeOut() override;
    void update(float passedTime) override;
};
/**
 * @internal
 */
class DeformTimelineState : public SlotTimelineState
{
    BIND_CLASS_TYPE_A(DeformTimelineState);

public:
    unsigned vertexOffset;

private:
    bool _dirty;
    unsigned _frameFloatOffset;
    unsigned _deformCount;
    unsigned _valueCount;
    unsigned _valueOffset;
    std::vector<float> _current;
    std::vector<float> _delta;
    std::vector<float> _result;

protected:
    virtual void _onClear() override;
    virtual void _onArriveAtFrame() override;
    virtual void _onUpdateFrame() override;

public:
    virtual void init(Armature* armature, AnimationState* animationState, TimelineData* timelineData) override;
    virtual void fadeOut() override;
    virtual void update(float passedTime) override;
};

/**
 * @internal
 */
class IKConstraintTimelineState : public ConstraintTimelineState 
{
    BIND_CLASS_TYPE_A(IKConstraintTimelineState);

private:
    float _current;
    float _delta;

protected:
    virtual void _onClear() override;
    virtual void _onArriveAtFrame() override;
    virtual void _onUpdateFrame() override;
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_TIMELINE_STATE_H
