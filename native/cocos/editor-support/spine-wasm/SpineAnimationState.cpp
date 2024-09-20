
#include "SpineAnimationState.h"

using namespace spine;

SpineAnimationState::SpineAnimationState(AnimationStateData* data) : AnimationState(data) {
}

SpineAnimationState::~SpineAnimationState() {
    _mapAnimations.clear();
}

TrackEntry* SpineAnimationState::addAnimation(size_t trackIndex, Animation* animation, bool loop, float delay) {
    if (_mapAnimations.count(animation) == 0) {
        _mapAnimations[animation] = std::shared_ptr<Animation>(animation);
    }
    return AnimationState::addAnimation(trackIndex, animation, loop, delay);
}
