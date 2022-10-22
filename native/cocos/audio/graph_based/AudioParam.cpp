#include "audio/graph_based/AudioParam.h"

namespace cc {
AudioParam* AudioParam::createParam(lab::AudioParam* param) {
    return new AudioParam(param);
}
AudioParam::AudioParam(lab::AudioParam* param) : _param(param){};

};

