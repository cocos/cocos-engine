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
    GainNode(BaseAudioContext* ctx, const GainNodeOptions& = {});
    AudioParam& gain();
    void setGain(float gain) { _gainNode->gain()->setValue(gain); } /*Only way to set value*/

private:
    std::shared_ptr<lab::GainNode> _gainNode;
    std::shared_ptr<AudioParam> _gainRef;
};
}; // namespace cc
