#include "audio/graph_based/AudioNode.h"
#include "LabSound/core/StereoPannerNode.h"
namespace cc {
class AudioContext;
struct StereoPannerOptions : AudioNodeOptions {
    float pan{0.0f};
};
class StereoPannerNode : AudioNode {
public:
    StereoPannerNode( BaseAudioContext* ctx, const StereoPannerOptions& options = {});
    AudioParam* pan();

private:
    std::shared_ptr<AudioParam> _pan{nullptr};
};
}
