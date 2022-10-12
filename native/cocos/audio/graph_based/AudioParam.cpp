#include "audio/include/graph_based/AudioParam.h"

namespace cc {

AudioParam::AudioParam(ccstd::string& name, ccstd::string& shortName, double defaultValue, double minValue, double maxValue) {
    _param = new lab::AudioParam(name, shortName, defaultValue, minValue, maxValue);
}
AudioParam::AudioParam(lab::AudioParam* param) {
    _param = param;
}
};
