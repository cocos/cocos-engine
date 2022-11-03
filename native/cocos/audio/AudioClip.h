#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "audio/graph_based/AudioBuffer.h"
namespace cc {
class AudioClip {
public:
    AudioClip(const ccstd::string& url);
    std::shared_ptr<AudioBuffer> buffer;

static ccstd::unordered_map<ccstd::string, AudioBuffer*> bufferMap;
};
}
