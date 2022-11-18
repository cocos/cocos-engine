#include "audio/graph_based/BaseAudioContext.h"
#include "audio/graph_based/AudioBuffer.h"
#include "audio/graph_based/SourceNode.h"
#include "audio/graph_based/GainNode.h"
#include "audio/graph_based/StereoPannerNode.h"
#include "audio/graph_based/AudioDestinationNode.h"
#include "LabSound/LabSound.h"
namespace cc {
AudioContextState BaseAudioContext::getState() {
    return _state;
}
void BaseAudioContext::onStateChanged(StateChangeCallback cb) {
    _stateChangeCb = cb;
}
AudioBuffer* BaseAudioContext::createBuffer(uint32_t numOfChannels, uint32_t length, float sampleRate) {
    auto options = AudioBufferOptions{numOfChannels, length, sampleRate};
    return new AudioBuffer(options);
}
StereoPannerNode* BaseAudioContext::createStereoPanner() {
    return new StereoPannerNode(this);
}
GainNode* BaseAudioContext::createGain() {
    return new GainNode(this);
}

AudioBuffer* BaseAudioContext::decodeAudioDataFromUrl(const ccstd::string& url) {
    return AudioBuffer::createBuffer(url);

}
AudioDestinationNode* BaseAudioContext::getDestination() {
    return _dest;
}
// bool BaseAudioContext::retainNode(AudioNode* node) {
//     auto itr = std::find(_nodes.begin(), _nodes.end(), node);
//     if (itr == _nodes.end()) {
//         _nodes.emplace_back(node);
//         return true;
//     }
//     return false;
// }
// bool BaseAudioContext::releaseNode(AudioNode* node) {
//     auto itr = std::find(_nodes.begin(), _nodes.end(), node);
//     if (itr != _nodes.end()) {
//         _nodes.erase(itr);
//         return true;
//     }
//     return false;
// }
//PannerNode* BaseAudioContext::createPanner() {
//    return new PannerNode(this);
//}

} // namespace cc
