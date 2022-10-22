#include "audio/graph_based/AudioDestinationNode.h"
namespace cc {
void AudioDestinationNode::setMaxChannelCount(uint32_t channelCount) {
    _maxChannelCount = channelCount;
    // TODO: set lab::AudioDestinationNode max channel count;
}
AudioDestinationNode* AudioDestinationNode::createDestination(BaseAudioContext* ctx, lab::AudioNode* node) {
    return new AudioDestinationNode(ctx, node);
}
AudioDestinationNode::AudioDestinationNode(BaseAudioContext* ctx, lab::AudioNode* node) : AudioNode(ctx) {
    _node = std::shared_ptr<lab::AudioNode>(node);
}
}
