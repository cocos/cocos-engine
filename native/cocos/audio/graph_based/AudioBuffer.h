#pragma once

#include "base/Log.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
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
class AudioBuffer : public RefCounted {
public:
    static AudioBuffer* createBuffer(const ccstd::string& url);
    AudioBuffer(const AudioBufferOptions& options = defaultOptions);
    /* Duration in seconds */
    double getDuration();
    size_t getLength();
    uint32_t getNumberOfChannels();
    uint32_t getSampleRate();

    /* Copy buffer from this, and memcpy to destination float array*/
    void copyFromChannel(ccstd::vector<float>& destination, uint32_t channelNumber, size_t startInChannel);
    void copyToChannel(ccstd::vector<float>& source, uint32_t channelNumber, size_t startInChannel);
    ccstd::vector<float> getChannelData(uint32_t channel);
    std::shared_ptr<lab::AudioBus> getBus() { return _bus; };

private:
    friend class SourceNode;
    AudioBuffer(std::shared_ptr<lab::AudioBus> bus) : _bus(bus){};
    std::shared_ptr<lab::AudioBus> _bus;
};
}
