#include "AnimationConfig.h"
#include "../armature/Armature.h"
#include "../armature/Bone.h"

DRAGONBONES_NAMESPACE_BEGIN

void AnimationConfig::_onClear() {
    pauseFadeOut = true;
    fadeOutMode = AnimationFadeOutMode::All;
    fadeOutTweenType = TweenType::Line;
    fadeOutTime = -1.0f;

    actionEnabled = true;
    additiveBlending = false;
    displayControl = true;
    pauseFadeIn = true;
    resetToPose = true;
    fadeInTweenType = TweenType::Line;
    playTimes = -1;
    layer = 0;
    position = 0.0f;
    duration = -1.0f;
    timeScale = -100.0f;
    weight = 1.0f;
    fadeInTime = -1.0f;
    autoFadeOutTime = -1.0f;
    name = "";
    animation = "";
    group = "";
    boneMask.clear();
}

void AnimationConfig::clear() {
    _onClear();
}

void AnimationConfig::copyFrom(AnimationConfig* value) {
    pauseFadeOut = value->pauseFadeOut;
    fadeOutMode = value->fadeOutMode;
    autoFadeOutTime = value->autoFadeOutTime;
    fadeOutTweenType = value->fadeOutTweenType;

    actionEnabled = value->actionEnabled;
    additiveBlending = value->additiveBlending;
    displayControl = value->displayControl;
    pauseFadeIn = value->pauseFadeIn;
    resetToPose = value->resetToPose;
    playTimes = value->playTimes;
    layer = value->layer;
    position = value->position;
    duration = value->duration;
    timeScale = value->timeScale;
    weight = value->weight;
    fadeInTime = value->fadeInTime;
    fadeOutTime = value->fadeOutTime;
    fadeInTweenType = value->fadeInTweenType;
    name = value->name;
    animation = value->animation;
    group = value->group;
    boneMask = value->boneMask;
}

bool AnimationConfig::containsBoneMask(const std::string& boneName) const {
    return boneMask.empty() || std::find(boneMask.cbegin(), boneMask.cend(), boneName) != boneMask.cend();
}

void AnimationConfig::addBoneMask(Armature* armature, const std::string& boneName, bool recursive) {
    const auto currentBone = armature->getBone(boneName);
    if (currentBone == nullptr) {
        return;
    }

    if (std::find(boneMask.cbegin(), boneMask.cend(), boneName) == boneMask.cend()) // Add mixing
    {
        boneMask.push_back(boneName);
    }

    if (recursive) // Add recursive mixing.
    {
        for (const auto bone : armature->getBones()) {
            if (std::find(boneMask.cbegin(), boneMask.cend(), bone->getName()) == boneMask.cend() && currentBone->contains(bone)) {
                boneMask.push_back(bone->getName());
            }
        }
    }
}

void AnimationConfig::removeBoneMask(Armature* armature, const std::string& boneName, bool recursive) {
    {
        auto iterator = std::find(boneMask.begin(), boneMask.end(), boneName);
        if (iterator != boneMask.end()) // Remove mixing.
        {
            boneMask.erase(iterator);
        }
    }

    if (recursive) {
        const auto currentBone = armature->getBone(boneName);
        if (currentBone != nullptr) {
            if (!boneMask.empty()) // Remove recursive mixing.
            {
                for (const auto bone : armature->getBones()) {
                    auto iterator = std::find(boneMask.begin(), boneMask.end(), bone->getName());
                    if (iterator != boneMask.end() && currentBone->contains(bone)) {
                        boneMask.erase(iterator);
                    }
                }
            } else // Add unrecursive mixing.
            {
                for (const auto bone : armature->getBones()) {
                    if (bone == currentBone) {
                        continue;
                    }

                    if (!currentBone->contains(bone)) {
                        boneMask.push_back(bone->getName());
                    }
                }
            }
        }
    }
}

DRAGONBONES_NAMESPACE_END
