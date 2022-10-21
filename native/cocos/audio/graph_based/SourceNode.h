#pragma once
#include "audio/graph_based/AudioNode.h"
#include "audio/graph_based/AudioScheduledSourceNode.h"
#include "LabSound/core/SampledAudioNode.h"
namespace cc {
class AudioBuffer;
class AudioClip;
struct SourceOptions : AudioNodeOptions {
    AudioBuffer* buffer;
    /* K rate */
    float detune{0};
    bool loop{false};
    float loopEnd{0.f};
    float loopStart{0.f};
    /* A rate */
    float playbackRate{1.f};
};
class SourceNode : public AudioScheduledSourceNode {
public:
    SourceNode() = delete;
    SourceNode(BaseAudioContext* ctx, AudioClip* clip = nullptr);
    /*
    JSB binding methods, work for AudioPlayerX.
    */
    void startAt(float offset);
    void restartAt(float offset);
    void pause();
    void stop(float when = 0);
    
    // Standard methods, thinking of abolish.
    /*
    * Is not virtual method, as described in labSound or WebAudio, start for scheduled time for a relative time.
    */
    void start(float when = 0.f, float offset = 0.f, float duration = 0.f);
    AudioParam* detune();
    AudioParam* playbackRate();
    bool loop() { return _loop; }
    void setLoop(bool loop);
    float currentTime();
    void setCurrentTime(float time);
    float loopStart() { return _loopStart; }
    void setLoopStart(float loopStart);
    float loopEnd() { return _loopEnd; }
    void setLoopEnd(float loopEnd);

private:
    std::shared_ptr<AudioClip> _clip{nullptr};
    std::shared_ptr<AudioBuffer> buffer{nullptr};
    bool _loop{false};
    float _loopStart{0.f};
    float _loopEnd{0.f};
    std::shared_ptr<AudioParam> _detune{nullptr};
    std::shared_ptr<AudioParam> _playbackRate{nullptr};

    float _cacheCurrentTIme{0.f};
    float _pastTime{0.f};
    float _startTime{0.f};
};
}
