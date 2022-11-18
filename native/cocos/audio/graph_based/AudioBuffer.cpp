#include "audio/graph_based/AudioBuffer.h"
#include "LabSound/extended/AudioFileReader.h"
#include "FileUtils.h"
namespace cc {
AudioBuffer* AudioBuffer::createBuffer(const ccstd::string& url) {
    if (url.empty()) {
        CC_LOG_ERROR("[AudioBuffer] Trying to create a buffer with an empty file path");
        CC_ASSERT(false);
        return nullptr;
    }
    auto fileExtension = url.substr(url.find_last_of('.') + 1);
    auto fileData = FileUtils::getInstance()->getDataFromFile(url);
    ccstd::vector<uint8_t> rawData;
    auto size = fileData.getSize();
    rawData.resize(size);
    memcpy(rawData.data(), fileData.getBytes(), size);
    auto bus = lab::MakeBusFromMemory(rawData, fileExtension, false);
    auto ret = new AudioBuffer(bus);
    return ret;
}

AudioBuffer::AudioBuffer(const AudioBufferOptions& options) {
    _bus = std::make_shared<lab::AudioBus>(options.numberOfChannels, options.length, true);
    _bus->setSampleRate(options.sampleRate);
}

double AudioBuffer::getDuration() {
    return _bus->length() / _bus->sampleRate(); //Too heavy
}

size_t AudioBuffer::getLength() {
    return _bus->length();
}

uint32_t AudioBuffer::getNumberOfChannels() {
    return _bus->numberOfChannels();
}

uint32_t AudioBuffer::getSampleRate() {
    return _bus->sampleRate();
}

void AudioBuffer::copyFromChannel(ccstd::vector<float>& destination, uint32_t channelNumber, size_t startInChannel) {
    auto channel = _bus->channel(channelNumber);
    auto bytesOffset = startInChannel * sizeof(float);
    auto bytesCountToCopy = destination.size() * sizeof(float);
    memcpy(destination.data(), channel->data() + bytesOffset, bytesCountToCopy);
}

void AudioBuffer::copyToChannel(ccstd::vector<float>& source, uint32_t channelNumber, size_t startInChannel) {
    auto channel = _bus->channel(channelNumber);
    auto bytesOffset = startInChannel * sizeof(float);

    if (startInChannel >= channel->length()) {
        //Copy failed as INDEX_SIZE_ERR
        CC_LOG_DEBUG("Copy to channel failed as start in channel is greater than channel length");
        return;
    }
    auto bytesCountToCopy = (channel->length()-startInChannel) * sizeof(float);
    memcpy(channel->mutableData() + startInChannel * sizeof(float), source.data(), bytesCountToCopy);
}

ccstd::vector<float> AudioBuffer::getChannelData(uint32_t channelID) {
    ccstd::vector<float> pcmData;
    auto channel = _bus->channel(channelID);
    auto size = sizeof(float) * channel->length();
    pcmData.resize(size);
    memcpy(pcmData.data(), channel->data(), size);
    return pcmData;
}




} // namespace cc
