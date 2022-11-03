#pragma once
#include "base/RefCounted.h"
#include "audio/graph_based/AudioNode.h"
#include "audio/graph_based/AudioScheduledSourceNode.h"
#include "LabSound/core/SampledAudioNode.h"
#include "LabSound/core/GainNode.h"
namespace cc {
class AudioBuffer;
class AudioClip;
enum ABSNState {
    // Buffer is not set
    UNSET,
    // Buffer is set, not played
    READY,
    // ABSN is used but not stopped.
    PLAYING,
    PAUSED,
    // Should restart
    DIRTY,
};

class SourceNode : public RefCounted{
public:
    SourceNode() = delete;
    SourceNode(BaseAudioContext* ctx, AudioBuffer* buffer = nullptr);
    /*
    JSB binding methods, work for AudioPlayerX.
    */
    void start(float time = 0);
    void pause();
    void stop();
    
    // Standard methods, thinking of abolish.
    /*
    * Is not virtual method, as described in labSound or WebAudio, start for scheduled time for a relative time.
    */

    float getPlaybackRate();
    void setPlaybackRate(float rate);
    bool getLoop() { return _loop; }
    void setBuffer(AudioBuffer* buffer);
    AudioBuffer* getBuffer();
    void setLoop(bool loop);
    float getCurrentTime();
    void setCurrentTime(float time);
    AudioNode* connect(AudioNode* node);
    void disconnect();

private:
    void _pureStart(float time);
    void _restart(float time);
    std::shared_ptr<lab::AudioContext> _ctx;
    std::shared_ptr<lab::SampledAudioNode> _absn;
    std::shared_ptr<lab::GainNode> _gain;
    // When the source node start, we will save the context current time.
    float _cachePlaybackRate{1.f};
    float _startTime{0.f};
    // current time = past time + (ctx.current time - start time) * playback rate
    // past time =  last current time before playbackrate changes.
    float _pastTime{0.f};
    ABSNState _innerState = ABSNState::UNSET;
    IntrusivePtr<AudioBuffer> _buffer{nullptr};
    bool _loop{false};
    float _loopStart{0.f};
    float _loopEnd{0.f};
    IntrusivePtr<AudioParam> _playbackRate{nullptr};
    ccstd::vector<IntrusivePtr<AudioNode>> _connections;
};
}
