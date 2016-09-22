#ifndef DRAGONBONES_ANIMATION_STATE_H
#define DRAGONBONES_ANIMATION_STATE_H

#include "../core/BaseObject.h"
#include "../model/AnimationData.h"

DRAGONBONES_NAMESPACE_BEGIN

class Armature;
class Bone;
class Slot;
class AnimationTimelineState;
class BoneTimelineState;
class SlotTimelineState;
class FFDTimelineState;

class AnimationState final : public BaseObject
{
    BIND_CLASS_TYPE(AnimationState);

public:
    bool displayControl;
    bool additiveBlending;
    unsigned playTimes;
    float timeScale;
    float weight;
    float autoFadeOutTime;
    float fadeTotalTime;

public:
    bool _isFadeOutComplete;
    int _layer;
    float _position;
    float _duration;
    float _clipDutation;
    float _weightResult;
    float _fadeProgress;
    std::string _group;
    AnimationTimelineState* _timeline;

private:
    bool _isPlaying;
    bool _isPausePlayhead;
    bool _isFadeOut;
    unsigned _currentPlayTimes;
    float _fadeTime;
    float _time;
    std::string _name;
    Armature* _armature;
    AnimationData* _clip;
    std::vector<std::string> _boneMask;
    std::vector<BoneTimelineState*> _boneTimelines;
    std::vector<SlotTimelineState*> _slotTimelines;
    std::vector<FFDTimelineState*> _ffdTimelines;

public:
    AnimationState();
    ~AnimationState();

private:
    DRAGONBONES_DISALLOW_COPY_AND_ASSIGN(AnimationState);

    void _advanceFadeTime(float passedTime);

protected:
    void _onClear() override;

public:
    bool _isDisabled(const Slot& slot) const;
    void _fadeIn(Armature* armature, AnimationData* clip, const std::string& animationName,
        unsigned playTimes, float position, float duration, float time, float timeScale, float fadeInTime,
        bool pausePlayhead
    );
    void _updateTimelineStates();
    void _updateFFDTimelineStates();
    void _advanceTime(float passedTime, float weightLeft, int index);

public:
    void play();
    void stop();
    void fadeOut(float fadeOutTime, bool pausePlayhead = true);
    void addBoneMask(const std::string& name, bool recursive = true);
    void removeBoneMask(const std::string& name, bool recursive = true);
    void removeAllBoneMask();

    bool getIsCompleted() const;
    float getCurrentTime() const;
    void setCurrentTime(float value);

    bool containsBoneMask(const std::string& name)
    {
        return _boneMask.empty() || std::find(_boneMask.cbegin(), _boneMask.cend(), name) != _boneMask.cend();
    }

    inline int getLayer() const 
    {
        return _layer;
    }

    inline const std::string& getName() const
    {
        return _name;
    }

    inline const std::string& getGroup() const
    {
        return _group;
    }

    inline const AnimationData& getClip() const
    {
        return *_clip;
    }

    inline bool getIsPlaying() const
    {
        return (_isPlaying && !getIsCompleted());
    }

    inline unsigned getCurrentPlayTimes() const
    {
        return _currentPlayTimes;
    }

    inline float getTotalTime() const
    {
        return _duration;
    }
};

DRAGONBONES_NAMESPACE_END
#endif  // DRAGONBONES_ANIMATION_STATE_H