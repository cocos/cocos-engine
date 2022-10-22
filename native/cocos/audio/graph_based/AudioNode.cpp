#include "audio/graph_based/AudioNode.h"
#include "LabSound/extended/AudioContextLock.h"
namespace cc {
AudioNode::AudioNode(BaseAudioContext* ctx) {
    _ctx = std::shared_ptr<BaseAudioContext>(ctx);
}
void AudioNode::setChannelCount(uint32_t count) {
    lab::ContextGraphLock lck(_ctx->_ctx.get(), "setChannelCount");
    _node->setChannelCount(lck, count);

}
uint32_t AudioNode::channelCountMode() {
    return static_cast<uint32_t>(_node->channelCountMode());
}

void AudioNode::setChannelCountMode(uint32_t mode) {
    lab::ContextGraphLock lck(_ctx->_ctx.get(), "setChannelCountMode");
    _node->setChannelCountMode(lck, lab::ChannelCountMode(mode));
}
uint32_t AudioNode::channelInterpretation() {
    return static_cast<uint32_t>(_node->channelInterpretation());
}
void AudioNode::setChannelInterpretation(uint32_t interpretation) {
    _node->setChannelInterpretation(lab::ChannelInterpretation(interpretation));
}
    AudioNode* AudioNode::connect(AudioNode* node, uint32_t outputIdx, uint32_t inputIdx) {
    // OutputIndex is the index of current node, and inputIndex is the index of destination node, thus here we should do a reverse call
    _ctx->_ctx->connect(node->_node, _node, inputIdx, outputIdx);
    return this;
}
void AudioNode::connect(AudioParam* param, uint32_t outputIdx, uint32_t inputIdx) {
    // connect to destination param from driver node, in this case, the driver node is this, and index is the output index of driver node.

    _ctx->_ctx->connectParam(param->_param, _node, outputIdx);
}
void AudioNode::disconnect(AudioNode* node, uint32_t outputIdx, uint32_t inputIdx) {
    if (node) {
        _ctx->_ctx->disconnect(node->_node, _node, inputIdx, outputIdx);
        return;
    }
    // input index of destination. It calls destIndex in labsound.
    _ctx->_ctx->disconnect(_node, inputIdx);
}
void AudioNode::disconnect(AudioParam* param, uint32_t outputIdx, uint32_t inputIdx) {
    _ctx->_ctx->disconnectParam(param->_param, _node, inputIdx);
}
}; // namespace cc
