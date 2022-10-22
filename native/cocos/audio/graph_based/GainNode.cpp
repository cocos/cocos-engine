#include "audio/graph_based/GainNode.h"
#include "LabSound/extended/AudioContextLock.h"
namespace cc {
GainNode::GainNode(BaseAudioContext* ctx, const GainNodeOptions& options) : AudioNode(ctx) {
    _node = std::make_shared<lab::GainNode>(*ctx->getInnerContext());
    if (options.gain) {
        _gain = std::shared_ptr<AudioParam>(AudioParam::createParam(std::dynamic_pointer_cast<lab::GainNode>(_node)->gain().get()));
    };
    lab::ContextGraphLock lck(_ctx->getInnerContext(), "initNode");
    if (options.channelCount.is_initialized()) {
        _node->setChannelCount(lck, options.channelCount.get()); 
    }
    _node->setChannelCountMode(lck, options.channelCountMode.value_or(lab::ChannelCountMode::Max));
    if (options.channelInterpretation.is_initialized()) {
        _node->setChannelInterpretation(options.channelInterpretation.get());
    }
}
AudioParam* GainNode::gain() {
    return _gain.get();
}

}
