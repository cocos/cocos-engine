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
void AudioScheduledSourceNode::onEnded(const CommonCallback&cb) {
    _cbs.push_back(cb);
}
void AudioScheduledSourceNode::offEnded(const CommonCallback& cb) {
    // TODO(timlyeee): erase target callback;

    //auto element = std::find_if(_cbs.begin(), _cbs.end(), [](auto currentElement) {

    //    //return currentElement.target<CommonCallback>() ==  (CommonCallback)cb;
    //    //return true;
    //});
    //if (element != _cbs.end()) {
    //    _cbs.erase(element, element + 1);
    //}
}
}
