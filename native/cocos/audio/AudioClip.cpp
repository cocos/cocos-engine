#include "audio/AudioClip.h"
#include "LabSound/extended/AudioFileReader.h"
namespace cc {
AudioClip::AudioClip(const ccstd::string& url) {
    auto itr = bufferMap.find(url);
    if (itr != bufferMap.end()) {
        buffer = std::shared_ptr<AudioBuffer>(itr->second);
        return;
    }
    auto buf = lab::MakeBusFromFile(url, false);
    
    auto tmpBuf = new AudioBuffer(buf.get());

    bufferMap[url] = tmpBuf;
    buffer = std::shared_ptr<AudioBuffer>(tmpBuf);
}
}
