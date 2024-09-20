
#include "SpineAnimationState.h"

using namespace spine; 

SpineAnimationState::SpineAnimationState(AnimationStateData* data) : AnimationState(data) {

}

SpineAnimationState::~SpineAnimationState() {
    _vecAnimations.clear();
}

TrackEntry* SpineAnimationState::addAnimation(size_t trackIndex, std::shared_ptr<Animation> animation, bool loop, float delay) {
    _vecAnimations.push_back(animation);
    return AnimationState::addAnimation(trackIndex, animation.get(), loop, delay);
}



