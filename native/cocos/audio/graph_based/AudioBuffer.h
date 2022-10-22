#pragma once
#include "base/std/container/vector.h"
#include "audio/graph_based/AudioNode.h"
#include "base/Log.h"
#include "LabSound/core/AudioBus.h"
#include "LabSound/core/AudioArray.h"
#include "LabSound/core/AudioChannel.h"

namespace cc {
struct AudioBufferOptions {
    uint32_t numberOfChannels{1};
    uint32_t length{1};
    float sampleRate{44100};
};
static AudioBufferOptions defaultOptions = AudioBufferOptions{1, 1, 44100};
    /* An AudioBuffer in cpp is a reference to real buffer, without translate to ts layer. The translation task is heavy. */
class AudioBuffer {
public:
    
    AudioBuffer(const AudioBufferOptions& options = defaultOptions);
    /* Duration in seconds */
    double duration();
    size_t length();
    uint32_t numberOfChannels();
    uint32_t sampleRate();

    /* Copy buffer from this, and memcpy to destination float array*/
    void copyFromChannel(ccstd::vector<float>& destination, uint32_t channelNumber, size_t startInChannel);
    void copyToChannel(ccstd::vector<float>& source, uint32_t channelNumber, size_t startInChannel);
    ccstd::vector<float> getChannelData(uint32_t channel);

private:
    AudioBuffer(lab::AudioBus* bus);
    friend class SourceNode;
    friend class AudioClip;
    std::shared_ptr<lab::AudioBus> _bus;
};
}
