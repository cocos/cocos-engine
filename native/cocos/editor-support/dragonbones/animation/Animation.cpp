#include "Animation.h"
#include "../model/DisplayData.h"
#include "../model/AnimationConfig.h"
#include "../model/AnimationData.h"
#include "../armature/Armature.h"
#include "../armature/Bone.h"
#include "../armature/Slot.h"
#include "AnimationState.h"

DRAGONBONES_NAMESPACE_BEGIN

void Animation::_onClear()
{
    for (const auto animationState : _animationStates)
    {
        animationState->returnToPool();
    }

    if (_animationConfig != nullptr) 
    {
        _animationConfig->returnToPool();
    }

    timeScale = 1.0f;

    _animationDirty = false;
    _inheritTimeScale = 1.0f;
    _animations.clear();
    _animationNames.clear();
    _animationStates.clear();
    _armature = nullptr;
    _animationConfig = nullptr;
    _lastAnimationState = nullptr;
}

void Animation::_fadeOut(AnimationConfig* animationConfig)
{
    switch (animationConfig->fadeOutMode)
    {
        case AnimationFadeOutMode::SameLayer:
            for (const auto animationState : _animationStates)
            {
                if (animationState->layer == (unsigned)animationConfig->layer)
                {
                    animationState->fadeOut(animationConfig->fadeOutTime, animationConfig->pauseFadeOut);
                }
            }
            break;

        case AnimationFadeOutMode::SameGroup:
            for (const auto animationState : _animationStates)
            {
                if (animationState->group == animationConfig->group)
                {
                    animationState->fadeOut(animationConfig->fadeOutTime, animationConfig->pauseFadeOut);
                }
            }
            break;

        case AnimationFadeOutMode::SameLayerAndGroup:
            for (const auto animationState : _animationStates)
            {
                if (animationState->layer == (unsigned)animationConfig->layer && animationState->group == animationConfig->group)
                {
                    animationState->fadeOut(animationConfig->fadeOutTime, animationConfig->pauseFadeOut);
                }
            }
            break;

        case AnimationFadeOutMode::All:
            for (const auto animationState : _animationStates)
            {
                animationState->fadeOut(animationConfig->fadeOutTime, animationConfig->pauseFadeOut);
            }
            break;

        case AnimationFadeOutMode::None:
        case AnimationFadeOutMode::Single:
        default:
            break;
    }
}

void Animation::init(Armature* armature)
{
    if (_armature != nullptr) {
        return;
    }

    _armature = armature;
    _animationConfig = BaseObject::borrowObject<AnimationConfig>();
}

void Animation::advanceTime(float passedTime)
{
    if (passedTime < 0.0f)
    {
        passedTime = -passedTime;
    }

    if (_armature->inheritAnimation && _armature->_parent != nullptr) // Inherit parent animation timeScale.
    { 
        _inheritTimeScale = _armature->_parent->_armature->getAnimation()->_inheritTimeScale * timeScale;
    }
    else 
    {
        _inheritTimeScale = timeScale;
    }

    if (_inheritTimeScale != 1.0f) 
    {
        passedTime *= _inheritTimeScale;
    }

    const auto animationStateCount = _animationStates.size();
    if (animationStateCount == 1)
    {
        const auto animationState = _animationStates[0];
        if (animationState->_fadeState > 0 && animationState->_subFadeState > 0)
        {
            _armature->_dragonBones->bufferObject(animationState);
            _animationStates.clear();
            _lastAnimationState = nullptr;
        }
        else
        {
            const auto animationData = animationState->_animationData;
            const auto cacheFrameRate = animationData->cacheFrameRate;
            if (_animationDirty && cacheFrameRate > 0.0f) // Update cachedFrameIndices.
            {
                _animationDirty = false;

                for (const auto bone : _armature->getBones())
                {
                    bone->_cachedFrameIndices = animationData->getBoneCachedFrameIndices(bone->getName());
                }

                for (const auto slot : _armature->getSlots())
                {
                    const auto rawDisplayDatas = slot->getRawDisplayDatas();
                    if (rawDisplayDatas != nullptr && !(*rawDisplayDatas).empty()) 
                    {
                        const auto rawDsplayData = (*rawDisplayDatas)[0];
                        if (rawDsplayData != nullptr) 
                        {
                            if (rawDsplayData->parent == _armature->getArmatureData()->defaultSkin)
                            {
                                slot->_cachedFrameIndices = animationData->getSlotCachedFrameIndices(slot->getName());
                                continue;
                            }
                        }
                    }

                    slot->_cachedFrameIndices = nullptr;
                }
            }

            animationState->advanceTime(passedTime, cacheFrameRate);
        }
    }
    else if (animationStateCount > 1)
    {
        for (std::size_t i = 0, r = 0; i < animationStateCount; ++i)
        {
            const auto animationState = _animationStates[i];
            if (animationState->_fadeState > 0 && animationState->_subFadeState > 0)
            {
                r++;
                _armature->_dragonBones->bufferObject(animationState);
                _animationDirty = true;
                if (_lastAnimationState == animationState)
                {
                    _lastAnimationState = nullptr;
                }
            }
            else
            {
                if (r > 0)
                {
                    _animationStates[i - r] = animationState;
                }

                animationState->advanceTime(passedTime, 0.0f);
            }

            if (i == animationStateCount - 1 && r > 0)
            {
                _animationStates.resize(animationStateCount - r);
                if (_lastAnimationState == nullptr && !_animationStates.empty()) 
                {
                    _lastAnimationState = _animationStates[_animationStates.size() - 1];
                }
            }
        }

        _armature->_cacheFrameIndex = -1;
    }
    else 
    {
        _armature->_cacheFrameIndex = -1;
    }
}

void Animation::reset()
{
    for (const auto animationState : _animationStates)
    {
        animationState->returnToPool();
    }

    _animationDirty = false;
    _animationConfig->clear();
    _animationStates.clear();
    _lastAnimationState = nullptr;
}

void Animation::stop(const std::string& animationName)
{
    if (!animationName.empty())
    {
        const auto animationState = getState(animationName);
        if (animationState != nullptr)
        {
            animationState->stop();
        }
    }
    else
    {
        for (const auto animationState : _animationStates) {
            animationState->stop();
        }
    }
}

AnimationState* Animation::playConfig(AnimationConfig* animationConfig)
{
    const auto& animationName = animationConfig->animation;
    if (_animations.find(animationName) == _animations.end())
    {
        DRAGONBONES_ASSERT(
            false,
            "Non-existent animation.\n" +
            " DragonBones name: " + this->_armature->getArmatureData().parent->name +
            " Armature name: " + this->_armature->name +
            " Animation name: " + animationName
        );

        return nullptr;
    }

    const auto animationData = _animations[animationName];

    if (animationConfig->fadeOutMode == AnimationFadeOutMode::Single) 
    {
        for (const auto animationState : _animationStates) 
        {
            if (animationState->_animationData == animationData) 
            {
                return animationState;
            }
        }
    }

    if (animationConfig->fadeInTime < 0.0f) 
    {
        if (_animationStates.empty()) 
        {
            animationConfig->fadeInTime = 0.0f;
        }
        else 
        {
            animationConfig->fadeInTime = animationData->fadeInTime;
        }
    }

    if (animationConfig->fadeOutTime < 0.0f) 
    {
        animationConfig->fadeOutTime = animationConfig->fadeInTime;
    }

    if (animationConfig->timeScale <= -100.0f) 
    {
        animationConfig->timeScale = 1.0f / animationData->scale;
    }

    if (animationData->frameCount > 1)
    {
        if (animationConfig->position < 0.0f) 
        {
            animationConfig->position = fmod(animationConfig->position, animationData->duration);
            animationConfig->position = animationData->duration - animationConfig->position;
        }
        else if (animationConfig->position == animationData->duration)
        {
            animationConfig->position -= 0.000001f; // Play a little time before end.
        }
        else if (animationConfig->position > animationData->duration) 
        {
            animationConfig->position = fmod(animationConfig->position, animationData->duration);
        }

        if (animationConfig->duration > 0.0f && animationConfig->position + animationConfig->duration > animationData->duration) 
        {
            animationConfig->duration = animationData->duration - animationConfig->position;
        }

        if (animationConfig->playTimes < 0) 
        {
            animationConfig->playTimes = animationData->playTimes;
        }
    }
    else 
    {
        animationConfig->playTimes = 1;
        animationConfig->position = 0.0f;
        if (animationConfig->duration > 0.0f) 
        {
            animationConfig->duration = 0.0f;
        }
    }

    if (animationConfig->duration == 0.0f)
    {
        animationConfig->duration = -1.0f;
    }

    _fadeOut(animationConfig);

    const auto animationState = BaseObject::borrowObject<AnimationState>();
    animationState->init(_armature, animationData, animationConfig);
    _animationDirty = true;
    _armature->_cacheFrameIndex = -1;

    if (!_animationStates.empty())
    {
        auto added = false;
        for (std::size_t i = 0, l = _animationStates.size(); i < l; ++i) 
        {
            if (animationState->layer > _animationStates[i]->layer) 
            {
                added = true;
                auto parentInerator = std::find(_animationStates.begin(), _animationStates.end(), _animationStates[i]);
                _animationStates.insert(parentInerator, animationState);
                break;
            }
            else if (i != l - 1 && animationState->layer > _animationStates[i + 1]->layer)
            {
                added = true;
                auto parentInerator = std::find(_animationStates.begin(), _animationStates.end(), _animationStates[i]);
                _animationStates.insert(parentInerator + 1, animationState);
                break;
            }
        }

        if (!added) 
        {
            _animationStates.push_back(animationState);
        }
    }
    else 
    {
        _animationStates.push_back(animationState);
    }

    // Child armature play same name animation.
    for (const auto slot : _armature->getSlots()) 
    {
        const auto childArmature = slot->getChildArmature();
        if (
            childArmature != nullptr && childArmature->inheritAnimation &&
            childArmature->getAnimation()->hasAnimation(animationName) &&
            childArmature->getAnimation()->getState(animationName) == nullptr
        )
        {
            childArmature->getAnimation()->fadeIn(animationName); //
        }
    }

    if (animationConfig->fadeInTime <= 0.0f) // Blend animation state, update armature.
    {
       _armature->advanceTime(0.0f);
    }

    _lastAnimationState = animationState;

    return animationState;
}

AnimationState* Animation::play(const std::string& animationName, int playTimes)
{
    _animationConfig->clear();
    _animationConfig->resetToPose = true;
    _animationConfig->playTimes = playTimes;
    _animationConfig->fadeInTime = 0.0f;
    _animationConfig->animation = animationName;

    if (!animationName.empty())
    {
        playConfig(_animationConfig);
    }
    else if (_lastAnimationState == nullptr)
    {
        const auto defaultAnimation = _armature->_armatureData->defaultAnimation;
        if (defaultAnimation != nullptr)
        {
            _animationConfig->animation = defaultAnimation->name;
            playConfig(_animationConfig);
        }
    }
    else if (!_lastAnimationState->isPlaying() && !_lastAnimationState->isCompleted())
    {
        _lastAnimationState->play();
    }
    else
    {
        _animationConfig->animation = _lastAnimationState->name;
        playConfig(_animationConfig);
    }

    return _lastAnimationState;
}
#ifdef EGRET_WASM
AnimationState* Animation::fadeIn(
    const std::string& animationName, float fadeInTime, int playTimes,
    int layer, const std::string& group, int fadeOutMode /*AnimationFadeOutMode*/
#else
AnimationState* Animation::fadeIn(
    const std::string& animationName, float fadeInTime, int playTimes,
    int layer, const std::string& group, AnimationFadeOutMode fadeOutMode
#endif // EGRET_WASM
)
{
    _animationConfig->clear();
    _animationConfig->fadeOutMode = (AnimationFadeOutMode)fadeOutMode;
    _animationConfig->playTimes = playTimes;
    _animationConfig->layer = layer;
    _animationConfig->fadeInTime = fadeInTime;
    _animationConfig->animation = animationName;
    _animationConfig->group = group;

    return playConfig(_animationConfig);
}

AnimationState* Animation::gotoAndPlayByTime(const std::string& animationName, float time, int playTimes)
{
    _animationConfig->clear();
    _animationConfig->resetToPose = true;
    _animationConfig->playTimes = playTimes;
    _animationConfig->position = time;
    _animationConfig->fadeInTime = 0.0f;
    _animationConfig->animation = animationName;

    return playConfig(_animationConfig);
}

AnimationState* Animation::gotoAndPlayByFrame(const std::string& animationName, unsigned frame, int playTimes)
{
    _animationConfig->clear();
    _animationConfig->resetToPose = true;
    _animationConfig->playTimes = playTimes;
    _animationConfig->fadeInTime = 0.0f;
    _animationConfig->animation = animationName;

    const auto animationData = mapFind(_animations, animationName);
    if (animationData != nullptr)
    {
        _animationConfig->position = animationData->duration * frame / animationData->frameCount;
    }

    return playConfig(_animationConfig);
}

AnimationState* Animation::gotoAndPlayByProgress(const std::string& animationName, float progress, int playTimes)
{
    _animationConfig->clear();
    _animationConfig->resetToPose = true;
    _animationConfig->playTimes = playTimes;
    _animationConfig->fadeInTime = 0.0f;
    _animationConfig->animation = animationName;

    const auto animationData = mapFind(_animations, animationName);
    if (animationData != nullptr) {
        _animationConfig->position = animationData->duration * (progress > 0.0f ? progress : 0.0f);
    }

    return playConfig(_animationConfig);
}

AnimationState* Animation::gotoAndStopByTime(const std::string& animationName, float time)
{
    const auto animationState = gotoAndPlayByTime(animationName, time, 1);
    if (animationState != nullptr)
    {
        animationState->stop();
    }

    return animationState;
}

AnimationState* Animation::gotoAndStopByFrame(const std::string& animationName, unsigned frame)
{
    const auto animationState = gotoAndPlayByFrame(animationName, frame, 1);
    if (animationState != nullptr)
    {
        animationState->stop();
    }

    return animationState;
}

AnimationState* Animation::gotoAndStopByProgress(const std::string& animationName, float progress)
{
    const auto animationState = gotoAndPlayByProgress(animationName, progress, 1);
    if (animationState != nullptr)
    {
        animationState->stop();
    }

    return animationState;
}

AnimationState* Animation::getState(const std::string& animationName) const
{
    int i = _animationStates.size();
    while (i--)
    {
        const auto animationState = _animationStates[i];
        if (animationState->name == animationName)
        {
            return animationState;
        }
    }

    return nullptr;
}

bool Animation::hasAnimation(const std::string& animationName) const
{
    return _animations.find(animationName) != _animations.end();
}

bool Animation::isPlaying() const
{
    for (const auto animationState : _animationStates)
    {
        if (animationState->isPlaying())
        {
            return true;
        }
    }

    return false;
}

bool Animation::isCompleted() const
{
    for (const auto animationState : _animationStates)
    {
        if (!animationState->isCompleted())
        {
            return false;
        }
    }

    return !_animationStates.empty();
}

const std::string& Animation::getLastAnimationName() const
{
    if (_lastAnimationState != nullptr)
    {
        return _lastAnimationState->name;
    }

    static const std::string DEFAULT_NAME = "";
    return DEFAULT_NAME;
}

void Animation::setAnimations(const std::map<std::string, AnimationData*>& value)
{
    if (_animations == value)
    {
        return;
    }

    _animationNames.clear();
    _animations.clear();

    for (const auto& pair : value)
    {
        _animationNames.push_back(pair.first);
        _animations[pair.first] = pair.second;
    }
}

AnimationConfig* Animation::getAnimationConfig() const
{
    _animationConfig->clear();
    return _animationConfig;
}

DRAGONBONES_NAMESPACE_END
