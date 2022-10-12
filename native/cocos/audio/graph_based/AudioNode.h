#pragma once
#include "base/std/optional.h"
#include "audio/graph_based/AudioContext.h"
#include "audio/graph_based/AudioParam.h"
#include "LabSound/core/AudioNode.h"
namespace cc {
struct AudioNodeOptions {
    ccstd::optional<unsigned> channelCount;
    ccstd::optional<lab::ChannelCountMode> channelCountMode;
    ccstd::optional<lab::ChannelInterpretation> channelInterpretation;
};
class AudioNode {
public:
    AudioNode() = delete;
    ~AudioNode();
    AudioContext* context() { return _ctx.get(); };
    uint32_t numberOfInputs() { return _node->numberOfInputs(); };
    uint32_t numberOfOutputs() { return _node->numberOfOutputs(); };
    uint32_t channelCount() { return _node->channelCount(); };

    void setChannelCount(uint32_t count);

    /* Channel Count mode means nothing in moments, this interface is about to lose */
    lab::ChannelCountMode channelCountMode();
    void setChannelCountMode(lab::ChannelCountMode mode);
    lab::ChannelInterpretation channelInterpretation();
    void setChannelInterpretation(lab::ChannelInterpretation interpretation);

    /**
    * Usage:
    * 1. Connect the LFO to gain AudioParam, this means the value of the LFO will not produce any audio but change the gain value.
    *   ```
    *   lfo.connect(gain.gain);
    *   ```
    * 2. Connect to AudioNode and will produce the audio
    *   ```
    *   bufferNode.connect(audioCtx.destination);
    *   ```
    * return value: a reference to the destination AudioNode object, allowing you to chain multiple connect() calls.or undefined for param.
    */
    AudioNode& connect(AudioNode* node, uint32_t outputIndex = 0, uint32_t inputIndex = 0);
    void connect(AudioParam* param, uint32_t outputIndex = 0, uint32_t inputIndex = 0);
    AudioNode& disconnect(AudioParam* param);
    AudioNode& disconnect(AudioNode* node = nullptr, uint32_t output = 0, uint32_t input = 0);

protected:
    std::shared_ptr<AudioContext> _ctx;
    std::shared_ptr<lab::AudioNode> _node;
};
}
