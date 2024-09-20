#pragma once

#include <spine/Animation.h>
#include <vector>
#include <memory>

namespace spine {

class SpineAnimation : public Animation {
public:
    SpineAnimation(const String &name, std::vector<std::shared_ptr<Timeline>> timelines, float duration);

    ~SpineAnimation();

private:
    std::vector<std::shared_ptr<Timeline>> _vecTimelines;
};

} // namespace spine
