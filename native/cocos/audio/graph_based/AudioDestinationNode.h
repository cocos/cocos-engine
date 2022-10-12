#include "audio/graph_based/AudioNode.h"
namespace cc {
class AudioDestinationNode : AudioNode {
public:
    uint32_t maxChannelCount() { return _maxChannelCount; };
    void setMaxChannelCount(uint32_t channelCount);

private:
    friend class AudioContext;
    AudioDestinationNode(AudioContext* ctx, lab::AudioDevice* device);
    uint32_t _maxChannelCount;
    std::shared_ptr<lab::AudioDevice> _device;
};
}

