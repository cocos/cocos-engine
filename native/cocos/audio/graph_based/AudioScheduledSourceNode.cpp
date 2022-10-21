#include "audio/graph_based/AudioScheduledSourceNode.h"
namespace cc {
AudioScheduledSourceNode::~AudioScheduledSourceNode() {

}
void AudioScheduledSourceNode::start(float when) {
    static_cast<lab::AudioScheduledSourceNode*>(_node.get())->start(when);
}
void AudioScheduledSourceNode::stop(float when) {
    static_cast<lab::AudioScheduledSourceNode*>(_node.get())->stop(when);
}
void AudioScheduledSourceNode::onEnded(CommonCallback cb) {
    _cbs.push_back(cb);
}
void AudioScheduledSourceNode::offEnded(CommonCallback cb) {
    auto element = std::find(_cbs.begin(), _cbs.end(), cb);
    if (element != _cbs.end()) {
        _cbs.erase(element, element + 1);
    }
}
}
