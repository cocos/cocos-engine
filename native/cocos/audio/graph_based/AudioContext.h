#pragma once
#include "audio/graph_based/BaseAudioContext.h"
#include "base/std/variant.h"
#include "base/std/optional.h"

namespace cc {
struct AudioTimestamp {
    double contextTime;
    /*DOMHighResTimeStamp*/
    double performanceTime;
};
//class MediaStreamAudioSourceNode;
//class MediaStreamAudioDestinationNode;
//
//class MediaStreamTrack;
//class MediaStreamTrackAudioSourceNode;

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
class AudioContext : BaseAudioContext {
public:
    AudioContext();
    AudioContext(const AudioContextOptions &options);
    /* a double that represents the number of seconds of processing latency incurred by the AudioContext passing an audio buffer from
    the AudioDestinationNode — i.e. the end of the audio graph — into the host system's audio subsystem ready for playing.*/
    double baseLatency(); // need realtime calculate, readonly
    double outputLatency();
    //AudioListener* listener();

    //bool close(CommonCallback cb);
    bool close();
    bool resume();
    bool suspend();
    //MediaStreamAudioDestinationNode* createMediaStreamDestination();
    //MediaStreamAudioSourceNode* createMediaStreamSource();
    //MediaStreamTrackAudioSourceNode* createMediaStreamTrackNode(MediaStreamTrack* track);

    AudioTimestamp& getOutputTimeStamp();
    

private:
};
}
