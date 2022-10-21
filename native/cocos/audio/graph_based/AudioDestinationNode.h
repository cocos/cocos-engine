#include "audio/graph_based/AudioNode.h"
namespace cc {
class AudioDestinationNode : AudioNode {
public:
    uint32_t maxChannelCount() { return _maxChannelCount; };
    void setMaxChannelCount(uint32_t channelCount);

private:
    friend class BaseAudioContext;
    AudioDestinationNode(BaseAudioContext* ctx, lab::AudioNode* node);
    uint32_t _maxChannelCount;
};
}

