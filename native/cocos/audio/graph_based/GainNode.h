#include "audio/graph_based/AudioNode.h"
#include "LabSound/core/GainNode.h"
namespace cc {
class AudioContext;
struct GainNodeOptions : AudioNodeOptions {
    /* A-Rate range */
    float gain{1.0};
};
class GainNode : AudioNode {
public:
    GainNode(BaseAudioContext* ctx, const GainNodeOptions& options = {});
    AudioParam* gain();

private:
    std::shared_ptr<AudioParam> _gain;
};
}; // namespace cc
