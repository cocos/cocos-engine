#include "AnimationData.h"
#include "ArmatureData.h"
#include "ConstraintData.h"

DRAGONBONES_NAMESPACE_BEGIN

void AnimationData::_onClear() {
    for (const auto& pair : boneTimelines) {
        for (const auto timeline : pair.second) {
            timeline->returnToPool();
        }
    }

    for (const auto& pair : slotTimelines) {
        for (const auto timeline : pair.second) {
            timeline->returnToPool();
        }
    }

    for (const auto& pair : constraintTimelines) {
        for (const auto timeline : pair.second) {
            timeline->returnToPool();
        }
    }

    if (actionTimeline != nullptr) {
        actionTimeline->returnToPool();
    }

    if (zOrderTimeline != nullptr) {
        zOrderTimeline->returnToPool();
    }

    frameIntOffset = 0;
    frameFloatOffset = 0;
    frameOffset = 0;
    frameCount = 0;
    playTimes = 0;
    duration = 0.0f;
    scale = 1.0f;
    fadeInTime = 0.0f;
    cacheFrameRate = 0.0f;
    name = "";
    cachedFrames.clear();
    boneTimelines.clear();
    slotTimelines.clear();
    constraintTimelines.clear();
    boneCachedFrameIndices.clear();
    slotCachedFrameIndices.clear();
    parent = nullptr;
    actionTimeline = nullptr;
    zOrderTimeline = nullptr;
}

void AnimationData::cacheFrames(unsigned frameRate) {
    if (cacheFrameRate > 0.0f) // TODO clear cache.
    {
        return;
    }

    cacheFrameRate = std::max(std::ceil(frameRate * scale), 1.0f);
    const auto cacheFrameCount = std::ceil(cacheFrameRate * duration) + 1; // Cache one more frame.

    cachedFrames.resize(cacheFrameCount, false);

    for (const auto bone : parent->sortedBones) {
        boneCachedFrameIndices[bone->name].resize(cacheFrameCount, -1);
    }

    for (const auto slot : parent->sortedSlots) {
        slotCachedFrameIndices[slot->name].resize(cacheFrameCount, -1);
    }
}

void AnimationData::addBoneTimeline(BoneData* bone, TimelineData* value) {
    auto& timelines = boneTimelines[bone->name];
    if (std::find(timelines.cbegin(), timelines.cend(), value) == timelines.cend()) {
        timelines.push_back(value);
    }
}

void AnimationData::addSlotTimeline(SlotData* slot, TimelineData* value) {
    auto& timelines = slotTimelines[slot->name];
    if (std::find(timelines.cbegin(), timelines.cend(), value) == timelines.cend()) {
        timelines.push_back(value);
    }
}

void AnimationData::addConstraintTimeline(ConstraintData* constraint, TimelineData* value) {
    auto& timelines = constraintTimelines[constraint->name];
    if (std::find(timelines.cbegin(), timelines.cend(), value) == timelines.cend()) {
        timelines.push_back(value);
    }
}

void TimelineData::_onClear() {
    type = TimelineType::BoneAll;
    offset = 0;
    frameIndicesOffset = -1;
}

DRAGONBONES_NAMESPACE_END
