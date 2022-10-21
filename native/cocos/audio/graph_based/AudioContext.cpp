#include "audio/graph_based/AudioContext.h"
#include "LabSound/LabSound.h"
#include "base/Log.h"+
namespace cc {
AudioContext::AudioContext(const AudioContextOptions& options) {
    auto inputConfig = lab::GetDefaultInputAudioDeviceConfiguration();
    auto outputConfig = lab::GetDefaultOutputAudioDeviceConfiguration();
    _ctx = std::unique_ptr<lab::AudioContext>(lab::MakeRealtimeAudioContext(outputConfig, inputConfig));
    // The destination node of LabSound is the device node of audio context, as described in examples.
    _dest = std::make_shared<AudioDestinationNode>(this, _ctx->device());
}
double AudioContext::baseLatency() {
    return 0.0;
}
double AudioContext::outputLatency() {
    return 0.0;
}
bool AudioContext::suspend() {
    _state = AudioContextState::SUSPENDED;
    _ctx->suspend();
}
bool AudioContext::resume() {
    if (_state != AudioContextState::SUSPENDED) {
        CC_LOG_DEBUG("WARNING: Audio context is not suspended, it cannot be resumed.");
        return false;
    }

    _state = AudioContextState::RUNNING;
    _ctx->resume();
}
bool AudioContext::close() {
    if (_state == AudioContextState::CLOSED) {
        CC_LOG_DEBUG("WARNING: Cannot close a closed context.");
        return false;
    }
    _ctx->suspend();//LabSound has no close interface.
}
}
