#pragma once
#include "audio/graph_based/AudioNode.h"
namespace cc {
class BaseAudioContext;
struct GainNodeOptions : public AudioNodeOptions {
    /* A-Rate range */
    float gain{1.0};
};
class GainNode : public AudioNode {
public:
    GainNode(BaseAudioContext* ctx, const GainNodeOptions& options = {});
    AudioParam* getGain() { return _gain; };

private:
    IntrusivePtr<AudioParam> _gain;
};
}; // namespace cc
