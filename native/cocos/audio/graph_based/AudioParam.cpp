#include "audio/graph_based/AudioParam.h"

namespace cc {
AudioParam* AudioParam::createParam(std::shared_ptr<lab::AudioParam> param) {
    return new AudioParam(param);
}
AudioParam::AudioParam(std::shared_ptr<lab::AudioParam> param) : _param(param){};

};

