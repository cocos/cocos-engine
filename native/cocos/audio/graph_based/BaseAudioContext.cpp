#include "audio/graph_based/BaseAudioContext.h"
#include "audio/graph_based/AudioBuffer.h"
#include "audio/graph_based/AudioDestinationNode.h"
#include "audio/graph_based/SourceNode.h"
#include "audio/graph_based/GainNode.h"
#include "audio/graph_based/PannerNode.h"
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

GainNode* BaseAudioContext::createGain() {
    return new GainNode(this);
}

AudioBuffer* BaseAudioContext::decodeAudioData(const ccstd::string& url) {
    return AudioBuffer::createBuffer(url);

}
//PannerNode* BaseAudioContext::createPanner() {
//    return new PannerNode(this);
//}

} // namespace cc
