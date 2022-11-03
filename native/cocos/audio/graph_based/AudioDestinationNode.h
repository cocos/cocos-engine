#include "audio/graph_based/AudioNode.h"
namespace cc {
class AudioDestinationNode : public AudioNode {
public:
    uint32_t getMaxChannelCount() { return _maxChannelCount; };
    void setMaxChannelCount(uint32_t channelCount);
    static AudioDestinationNode* createDestination(BaseAudioContext* ctx, std::shared_ptr<lab::AudioNode> node);

private:
    friend class BaseAudioContext;
    AudioDestinationNode(BaseAudioContext* ctx, std::shared_ptr<lab::AudioNode> node);
    uint32_t _maxChannelCount{0};
};
}

