#include "audio/graph_based/AudioNode.h"
#include "LabSound/core/StereoPannerNode.h"
namespace cc {
class AudioContext;
struct StereoPannerOptions : public AudioNodeOptions {
    float pan{0.0f};
};
class StereoPannerNode : public AudioNode {
public:
    StereoPannerNode( BaseAudioContext* ctx, const StereoPannerOptions& options = {});
    AudioParam* getPan() { return _pan; }

private:
    IntrusivePtr<AudioParam> _pan{nullptr};
};
}
