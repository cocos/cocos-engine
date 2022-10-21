#pragma once
#include "base/std/variant.h"
#include "base/std/optional.h"
#include "LabSound/core/AudioContext.h"
namespace cc {
typedef std::function<void()> CommonCallback;
typedef std::function<void(AudioContextState)> StateChangeCallback;

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
//// Using AudioContextLatencyCategoryStr[cat] to get string back
//static ccstd::string AudioContextLatencyStr[] = {
//    "Balanced", "Interactive", "Playback"
//};
//// Using AudioContextStateStr[cat] to get string back
//static ccstd::string AudioContextStateStr[] = {
//    "Suspended", "Running", "Closed"};
struct AudioContextOptions {
    ccstd::variant<AudioContextLatencyCategory, double> latencyHint{AudioContextLatencyCategory::INTERACTIVE};
    ccstd::optional<float> sampleRate;
};
class BaseAudioContext {
public:
    explicit BaseAudioContext() = default;
    ~BaseAudioContext();
    double currentTime() { return _ctx->currentTime(); }
    AudioDestinationNode* destination() { return _dest.get(); }
    //AudioListener* listener();
    float sampleRate() { return _ctx->sampleRate(); };
    AudioContextState state();
    void onStateChanged(StateChangeCallback cb); // TODO(timlyeee): This function should be called in TS

    // Normally inheritaged from BaseAudioContext
    AudioBuffer* createBuffer(uint32_t numOfChannels = 1, uint32_t length = 0, float sampleRate = 44100);
    SourceNode* createBufferSource();
    GainNode* createGain();
    //PannerNode* createPanner();
    //StereoPannerNode* createStereoPanner();
    //bool decodeAudioData();// Implement in TS?
    lab::AudioContext* getInnerContext() { return _ctx.get(); }

protected:
    friend class AudioNode;
    std::unique_ptr<lab::AudioContext> _ctx{nullptr};
    std::shared_ptr<AudioDestinationNode> _dest{nullptr};
    AudioContextState _state{AudioContextState::RUNNING};
    StateChangeCallback _stateChangeCb;
};
}
