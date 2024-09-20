
#include "SpineAnimation.h"

using namespace spine;

spine::Vector<Timeline*>& convertAndUseVector(const std::vector<std::shared_ptr<Timeline>>& stdVec, spine::Vector<Timeline*>& _spineVecTimelines) {
    for (const auto& element : stdVec) {
        _spineVecTimelines.add(element.get());
    }

    return _spineVecTimelines;
}

SpineAnimation::SpineAnimation(const String& name, std::vector<std::shared_ptr<Timeline>> timelines, float duration) : Animation(name, convertAndUseVector(timelines, _spineVecTimelines), duration) {
    _vecTimelines = timelines;
}

SpineAnimation::~SpineAnimation() {
    _vecTimelines.clear();
    _spineVecTimelines.clear();
    auto& timelines = getTimelines();
    timelines.clear();
}
