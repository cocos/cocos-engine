
#include "SpineAnimation.h"

using namespace spine;

spine::Vector<Timeline*> convertAndUseVector(const std::vector<std::shared_ptr<Timeline>>& stdVec) {
    spine::Vector<Timeline*> spineVec;

    for (const auto& element : stdVec) {
        spineVec.add(element.get());
    }

    return spineVec;
}

SpineAnimation::SpineAnimation(const String& name, std::vector<std::shared_ptr<Timeline>> timelines, float duration) : Animation(name, std::move(convertAndUseVector(timelines)), duration) {
    _vecTimelines = timelines;
}

SpineAnimation::~SpineAnimation() {
    _vecTimelines.clear();
    auto& timelines = getTimelines();
    timelines.clear();
}
