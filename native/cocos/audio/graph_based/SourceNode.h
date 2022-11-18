#pragma once
#include "base/RefCounted.h"
#include "base/std/container/vector.h"
#include "base/Ptr.h"
#include "cocos/audio/graph_based/AudioNode.h"
#include "LabSound/core/SampledAudioNode.h"
#include "LabSound/core/GainNode.h"
namespace cc {
class AudioBuffer;
class BaseAudioContext;
class AudioParam;
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

class SourceNode final: public AudioNode{
public:
    SourceNode() = delete;
    SourceNode(BaseAudioContext* ctx, AudioBuffer* buffer = nullptr);
    /*
    JSB binding methods, work for AudioPlayerX.
    */
    bool start(float time = 0);
    void pause();
    void stop();

    // Standard methods, thinking of abolish.
    /*
    * Is not virtual method, as described in labSound or WebAudio, start for scheduled time for a relative time.
    */
    void setVolume(float vol);
    float getVolume();
    float getPlaybackRate();
    void setPlaybackRate(float rate);
    bool getLoop() { return _loop; }
    void setBuffer(AudioBuffer* buffer);
    AudioBuffer* getBuffer();
    void setLoop(bool loop);
    float getCurrentTime();
    void setCurrentTime(float time);
    // AudioNode* connect(AudioNode* node);
    // void disconnect();
    void setOnEnded(std::function<void()> fn);
private:
    void _pureStart(float time);
    void _restart(float time);
    void _onEnd();
    std::function<void()> _finishCallback;
    std::function<void()> _stopCallback;
    std::shared_ptr<lab::SampledAudioNode> _absn{nullptr};
    // When the source node start, we will save the context current time.
    float _cachePlaybackRate{1.f};
    float _startTime{0.f};
    // current time = past time + (ctx.current time - start time) * playback rate
    // past time =  last current time before playbackrate changes.
    float _pastTime{0.f};
    ABSNState _innerState{ABSNState::UNSET};
    IntrusivePtr<AudioBuffer> _buffer{nullptr};
    bool _loop{false};
    float _loopStart{0.f};
    float _loopEnd{0.f};
    IntrusivePtr<AudioParam> _playbackRate{nullptr};
    IntrusivePtr<AudioParam> _gain{nullptr};
    IntrusivePtr<BaseAudioContext> _ccctx{nullptr};
};
}
