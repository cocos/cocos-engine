#pragma once
#include "base/std/optional.h"
#include "base/RefCounted.h"
#include "base/Ptr.h"
#include "base/std/container/vector.h"
#include "audio/graph_based/AudioContext.h"
#include "audio/graph_based/AudioParam.h"
#include "LabSound/core/AudioNode.h"
namespace cc {
struct AudioNodeOptions {
    ccstd::optional<unsigned> channelCount;
    ccstd::optional<lab::ChannelCountMode> channelCountMode;
    ccstd::optional<lab::ChannelInterpretation> channelInterpretation;
};
class AudioNode : public RefCounted {
public:
    AudioNode() = delete;

    virtual ~AudioNode() = default;
    BaseAudioContext* getContext() { return _ctx; };
    uint32_t getNumberOfInputs() { return _node->numberOfInputs(); };
    uint32_t getNumberOfOutputs() { return _node->numberOfOutputs(); };

    uint32_t getChannelCount() { return _node->channelCount(); };
    void setChannelCount(uint32_t count);

    /* Channel Count mode means nothing in moments, this interface is about to lose */
    uint32_t getChannelCountMode();
    void setChannelCountMode(uint32_t mode);

    uint32_t getChannelInterpretation();
    void setChannelInterpretation(uint32_t interpretation);

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
    *
    * OutputIndex is the index of current node, and inputIndex is the index of destination node.
    */
    virtual AudioNode* connect(AudioNode* node, uint32_t outputIndex = 0, uint32_t inputIndex = 0);
    virtual void connect(AudioParam* param, uint32_t outputIndex = 0, uint32_t inputIndex = 0);
    virtual void disconnect(AudioParam* param, uint32_t outputIndex = 0, uint32_t inputIndex = 0);
    virtual void disconnect(AudioNode* node = nullptr, uint32_t outputIndex = 0, uint32_t inputIndex = 0);

protected:
    friend class AudioContext;
    friend class SourceNode;
    explicit AudioNode(BaseAudioContext* ctx);
    IntrusivePtr<BaseAudioContext> _ctx;
    // For all LabSound object, use shared ptr to set use count as so on.
    std::shared_ptr<lab::AudioNode> _node;
    ccstd::vector<IntrusivePtr<AudioNode>> _connections;
};
}
