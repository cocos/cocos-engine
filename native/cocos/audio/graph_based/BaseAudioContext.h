#pragma once

#include "base/RefCounted.h"
#include "base/Ptr.h"
#include "base/std/variant.h"
#include "base/std/optional.h"
#include "LabSound/core/AudioContext.h"
namespace cc {


class AudioBuffer;
class SourceNode;
class AudioDestinationNode;
class GainNode;
class PannerNode;
//class StereoPannerNode;

enum class AudioContextLatencyCategory {
    BALANCED,
    INTERACTIVE,
    PLAYBACK,
};
enum class AudioContextState {
    SUSPENDED,
    RUNNING,
    CLOSED
};
typedef std::function<void()> CommonCallback;
typedef std::function<void(AudioBuffer*)> BufferLoadCallback;
typedef std::function<void(AudioContextState)> StateChangeCallback;
//// Using AudioContextLatencyCategoryStr[cat] to get string back
//static ccstd::string AudioContextLatencyStr[] = {
//    "Balanced", "Interactive", "Playback"
//};
//// Using AudioContextStateStr[cat] to get string back
//static ccstd::string AudioContextStateStr[] = {
//    "Suspended", "Running", "Closed"};
struct AudioContextOptions {
    AudioContextLatencyCategory latencyHint{AudioContextLatencyCategory::INTERACTIVE};
    ccstd::optional<float> sampleRate;
};
class BaseAudioContext : public RefCounted {
public:
    explicit BaseAudioContext() = default;
    virtual ~BaseAudioContext() = default;
    double getCurrentTime() { return _ctx->currentTime(); }
    AudioDestinationNode* getDestination() { return _dest.get(); }
    //AudioListener* listener();
    float getSampleRate() { return _ctx->sampleRate(); };
    AudioContextState getState();
    void onStateChanged(StateChangeCallback cb); // TODO(timlyeee): This function should be called in TS

    // Normally inheritaged from BaseAudioContext
    AudioBuffer* createBuffer(uint32_t numOfChannels = 1, uint32_t length = 0, float sampleRate = 44100);

    GainNode* createGain();
    //PannerNode* createPanner();
    //StereoPannerNode* createStereoPanner();
    //bool decodeAudioData();// Implement in TS?
    std::shared_ptr<lab::AudioContext> getInnerContext() { return _ctx; }
    AudioBuffer* decodeAudioData(const ccstd::string& url);

protected:
    friend class AudioNode;
    std::shared_ptr<lab::AudioContext> _ctx{nullptr};

    IntrusivePtr<AudioDestinationNode> _dest{nullptr};

    AudioContextState _state{AudioContextState::RUNNING};
    StateChangeCallback _stateChangeCb;
};
}
