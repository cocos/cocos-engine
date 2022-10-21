#include "audio/AudioClip.h"
#include "LabSound/extended/AudioFileReader.h"
namespace cc {
AudioClip::AudioClip(const ccstd::string& url) {
    auto itr = bufferMap.find(url);
    if (itr != bufferMap.end()) {
        buffer = std::make_unique<AudioBuffer>(itr->second);
        return;
    }
    auto buf = lab::MakeBusFromFile(url, false);
    buffer = std::make_unique<AudioBuffer>(new AudioBuffer(buf.get()));
    bufferMap[url] = buffer.get();
    
}
}
