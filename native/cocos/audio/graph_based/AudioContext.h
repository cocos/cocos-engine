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

class AudioContext : public BaseAudioContext {
public:
    AudioContext(const AudioContextOptions& options = {});
    /* a double that represents the number of seconds of processing latency incurred by the AudioContext passing an audio buffer from
    the AudioDestinationNode — i.e. the end of the audio graph — into the host system's audio subsystem ready for playing.*/
    double baseLatency(); // need realtime calculate, readonly
    double outputLatency();
    //AudioListener* listener();

    //Close for the audio context should be implemented as delete inner context and all resources.
    bool close();
    bool resume();
    bool suspend();
    //MediaStreamAudioDestinationNode* createMediaStreamDestination();
    //MediaStreamAudioSourceNode* createMediaStreamSource();
    //MediaStreamTrackAudioSourceNode* createMediaStreamTrackNode(MediaStreamTrack* track);

    //AudioTimestamp& getOutputTimeStamp();
    

private:
    friend class AudioNode;
};
}
