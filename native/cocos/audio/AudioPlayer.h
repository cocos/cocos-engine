#include "LabSound/core/SampledAudioNode.h"
#include "LabSound/core/AudioDevice.h"
#include "LabSound/core/AudioContext.h"
#include "LabSound/core/AudioBus.h"
#include "audio/include/AudioClip.h"
namespace cc {
typedef std::function<void()> playbackCallback;
class AudioPlayer {
public:

    AudioPlayer(AudioClip* clip);
    AudioPlayer();
    bool setClip(AudioClip* clip);
    AudioClip* getClip();
    bool play();
    bool pause();
    bool resume();
    bool stop();

    void onPlay(playbackCallback cb);
    void offPlay(playbackCallback cb);
    
    void onPause(playbackCallback cb);
    void offPause(playbackCallback cb);

    void onResume(playbackCallback cb);
    void offResume(playbackCallback cb);

    void onStop(playbackCallback cb);
    void offStop(playbackCallback cb);

    void onEnd(playbackCallback cb);
    void offEnd(playbackCallback cb);

    bool setPlaybackRate();
    float getPlaybackRate();
    bool setPan();
    float getPan();

private:
    lab::SampledAudioNode* bufferNode;
    lab::AudioContext* ctx;
    lab::AudioParam* param;

};
}
