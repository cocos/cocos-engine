#include "audio/graph_based/AudioDestinationNode.h"
namespace cc {
AudioDestinationNode::AudioDestinationNode(BaseAudioContext* ctx, lab::AudioNode* node) : AudioNode(ctx) {
    _node = std::shared_ptr<lab::AudioNode>(node);
}
}
