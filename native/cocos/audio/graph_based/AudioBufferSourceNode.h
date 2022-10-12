#pragma once
#include "audio/graph_based/AudioNode.h"
#include "audio/graph_based/AudioScheduledSourceNode.h"
#include "LabSound/core/SampledAudioNode.h"
namespace cc {
class AudioBuffer;
struct AudioBufferSourceOptions : AudioNodeOptions {
    AudioBuffer* buffer;
    /* K rate */
    float detune{0};
    bool loop{false};
    float loopEnd{0.f};
    float loopStart{0.f};
    /* A rate */
    float playbackRate{1.f};
};
class AudioBufferSourceNode : AudioScheduledSourceNode {
public:
    AudioBufferSourceNode(AudioContext* ctx, const AudioBufferSourceOptions& options = {});
    void start() override;
    void start(float when = 0.f, float offset = 0.f, float duration = 0.f);
    void stop() override;
    AudioParam& detune();
    AudioParam& playbackRate();
    bool loop();
    void setLoop(bool loop);
    float loopStart();
    void setLoopStart(float loopStart);
    float loopEnd();
    void setLoopEnd(float loopEnd);

private:
};
}
