#include "audio/graph_based/BaseAudioContext.h"
#include "audio/graph_based/AudioBuffer.h"
#include "audio/graph_based/AudioDestinationNode.h"
#include "audio/graph_based/SourceNode.h"
#include "audio/graph_based/GainNode.h"
#include "audio/graph_based/PannerNode.h"
#include "LabSound/LabSound.h"
namespace cc {

BaseAudioContext::~BaseAudioContext() {
    delete _ctx.get();
    delete _dest.get();
}
AudioContextState BaseAudioContext::state() {
    return _state;
}
void BaseAudioContext::onStateChanged(StateChangeCallback cb) {
    _stateChangeCb = cb;
}
AudioBuffer* BaseAudioContext::createBuffer(uint32_t numOfChannels, uint32_t length, float sampleRate) {
    auto options = AudioBufferOptions{numOfChannels, length, sampleRate};
    return new AudioBuffer(options);
}
SourceNode* BaseAudioContext::createBufferSource() {
    return new SourceNode(this);
}

GainNode* BaseAudioContext::createGain() {
    return new GainNode(this);
}

//PannerNode* BaseAudioContext::createPanner() {
//    return new PannerNode(this);
//}

} // namespace cc
