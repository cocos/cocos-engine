#include "audio/graph_based/StereoPannerNode.h"
#include "audio/graph_based/BaseAudioContext.h"
#include "LabSound/core/StereoPannerNode.h"
namespace cc {
StereoPannerNode::StereoPannerNode(BaseAudioContext* ctx, const StereoPannerOptions& options) : AudioNode(ctx) {
    _node = std::make_shared<lab::StereoPannerNode>(*ctx->getInnerContext());
    _pan = AudioParam::createParam( std::dynamic_pointer_cast<lab::StereoPannerNode>(_node)->pan());
    if (options.pan) {
        _pan->setValue(options.pan);
    }
}

}
