#include "audio/include/graph_based/AudioNode.h"
namespace cc {
AudioNode::~AudioNode() {
    delete _node.get();
}
void AudioNode::setChannelCount(uint32_t count) {
    lab::ContextGraphLock lck(_ctx->innerCtx, "setChannelCount");
    _node->setChannelCount(lck, count);

}
    uint32_t AudioNode::
    AudioNode&
    AudioNode::connect(AudioNode* node, uint32_t outputIndex, uint32_t inputIndex) {
    if (_node->)
}
}; // namespace cc
