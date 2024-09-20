#pragma once

#include <spine/AnimationState.h>
#include <map>
#include <memory>
#include "spine/Animation.h"

namespace spine {

class SP_API SpineAnimationState : public AnimationState {
public:
    explicit SpineAnimationState(AnimationStateData* data);

    ~SpineAnimationState();

    TrackEntry* addAnimation(size_t trackIndex, Animation* animation, bool loop, float delay);

private:
    std::map<Animation*, std::shared_ptr<Animation>> _mapAnimations;
};
} // namespace spine
