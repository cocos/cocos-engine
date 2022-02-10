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
#ifndef DRAGONBONES_ANIMATION_DATA_H
#define DRAGONBONES_ANIMATION_DATA_H

#include "ArmatureData.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The animation data.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 动画数据。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class AnimationData : public BaseObject
{
    BIND_CLASS_TYPE_B(AnimationData);

public:
    /**
     * - FrameIntArray.
     * @internal
     */
    unsigned frameIntOffset;
    /**
     * - FrameFloatArray.
     * @internal
     */
    unsigned frameFloatOffset;
    /**
     * - FrameArray.
     * @internal
     */
    unsigned frameOffset;
    /**
     * - The frame count of the animation.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画的帧数。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    unsigned frameCount;
    /**
     * - The play times of the animation. [0: Loop play, [1~N]: Play N times]
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画的播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @version DragonBones 3.0
     * @language zh_CN
     */
    unsigned playTimes;
    /**
     * - The duration of the animation. (In seconds)
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画的持续时间。 （以秒为单位）
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float duration;
    /**
     * @private
     */
    float scale;
    /**
     * - The fade in time of the animation. (In seconds)
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画的淡入时间。 （以秒为单位）
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float fadeInTime;
    /**
     * @private
     */
    float cacheFrameRate;
    /**
     * - The animation name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::string name;
    /**
     * @private
     */
    std::vector<bool> cachedFrames;
    /**
     * @private
     */
    std::map<std::string, std::vector<TimelineData*>> boneTimelines;
    /**
     * @private
     */
    std::map<std::string, std::vector<TimelineData*>> slotTimelines;
    /**
     * @private
     */
    std::map<std::string, std::vector<TimelineData*>> constraintTimelines;
    /**
     * @private
     */
    std::map<std::string, std::vector<int>> boneCachedFrameIndices;
    /**
     * @private
     */
    std::map<std::string, std::vector<int>> slotCachedFrameIndices;
    /**
     * @private
     */
    TimelineData* actionTimeline;
    /**
     * @private
     */
    TimelineData* zOrderTimeline;
    /**
     * @private
     */
    ArmatureData* parent;
    AnimationData() :
        actionTimeline(nullptr),
        zOrderTimeline(nullptr)
    {
        _onClear();
    }
    ~AnimationData()
    {
        _onClear();
    }

protected:
    virtual void _onClear() override;

public:
    /**
     * @internal
     */
    void cacheFrames(unsigned frameRate);
    /**
     * @private
     */
    void addBoneTimeline(BoneData* bone, TimelineData* value);
    /**
     * @private
     */
    void addSlotTimeline(SlotData* slot, TimelineData* value);
    /**
     * @private
     */
    void addConstraintTimeline(ConstraintData* constraint, TimelineData* value);
    /**
     * @private
     */
    std::vector<TimelineData*>* getBoneTimelines(const std::string& timelineName)
    {
        return mapFindB(boneTimelines, timelineName);
    }
    /**
     * @private
     */
    inline std::vector<TimelineData*>* getSlotTimelines(const std::string& timelineName)
    {
        return mapFindB(slotTimelines, timelineName);
    }
    /**
     * @private
     */
    inline std::vector<TimelineData*>* getConstraintTimelines(const std::string& timelineName)
    {
        return mapFindB(constraintTimelines, timelineName);
    }
    /**
     * @private
     */
    inline std::vector<int>* getBoneCachedFrameIndices(const std::string& boneName)
    {
        return mapFindB(boneCachedFrameIndices, boneName);
    }
    /**
     * @private
     */
    inline std::vector<int>* getSlotCachedFrameIndices(const std::string& slotName)
    {
        return mapFindB(slotCachedFrameIndices, slotName);
    }

public: // For WebAssembly.
    TimelineData* getActionTimeline() const { return actionTimeline; }
    void setActionTimeline(TimelineData* pactionTimeline) { actionTimeline = pactionTimeline; }

    TimelineData* getZOrderTimeline() const { return zOrderTimeline; }
    void setZOrderTimeline(TimelineData* value) { zOrderTimeline = value; }

    ArmatureData* getParent() const { return parent; }
    void setParent(ArmatureData* value) { parent = value; }
};
/**
 * @internal
 */
class TimelineData : public BaseObject
{
    BIND_CLASS_TYPE_A(TimelineData);

public:
    TimelineType type;
    unsigned offset;
    int frameIndicesOffset;

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    int getType() const { return (int)type; }
    void setType(int value) { type = (TimelineType)value; }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_ANIMATION_DATA_H
