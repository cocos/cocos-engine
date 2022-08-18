/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/
#pragma once
#include <mutex>
#include <shared_mutex>
#include <thread>
#include "AudioCache.h"
#ifdef __OBJC__
    #import <AVFoundation/AVAudioPlayerNode.h>
#else
// other platforms implementation
#endif
/**
 * An AudioPlayerDescriptor is to adapt different platform as we are trying to use an unified AudioPlayer class, or an IAudioPlayer who offers common methods
 */
using AudioPlayerDescriptor = struct AudioPlayerDescriptor {
#ifdef __OBJC__
    AVAudioPlayerNode* node;
#else
    // void* node;
#endif
};
static std::mutex FrameSyncMtx;
static std::condition_variable FrameSyncBarrier;
namespace cc {
using FinishCallback = std::function<void(uint32_t, const ccstd::string&)>;
class AudioPlayer {
public:
    friend class AudioEngineImpl;
    enum State {
        UNLOADED,
        LOADING,
        READY,
        PLAYING,
        PAUSED,
        STOPPING,
        STOPPED,
    };
    /**
     * Create an audio player without audio cache, state keeps UNLOADED
     */
    AudioPlayer();
    /**
     * Create an audio player with an audio cache, state turns to READY
     */
    explicit AudioPlayer(AudioCache* cache);
    ~AudioPlayer();

    /**
     * If UNLOADED, turns to READY, otherwise reload a new cache.
     * If it's playing, stop itself.
     */
    bool load(AudioCache* cache);
    /**
     * unload audio cache, and if it's playing, stop itself.
     */
    bool unload();

    void prepare();
    /**
     * Play the audio, if it's playing, nothing will happen.
     */
    bool play();
    /**
     * Pause the audio. It won't change the seek time.
     */
    bool pause();
    /**
     * Resume the audio, if should seek to some time, do the procedure of reschedule.
     */
    bool resume();
    /**
     * Interrupt the audio and seek to 0.
     */
    void stop();
    /**
     * Post-stop should be called in AudioEngine, when the player is fully stopped.
     */
    void postStop();

    bool setVolume(float volume);
    float getVolume() const;
    bool setLoop(bool isLoop);
    bool isLoop() const;
    float getDuration() const;
    AudioCache* getCache() const;

    /**
     * Change the seekerTime and should reschedule buffer.
     */
    bool setCurrentTime(float targetTime);
    float getCurrentTime() const;
    /**
     * Get a copy of audio player descriptor.
     */
    AudioPlayerDescriptor getDescriptor() const;
    void shortBufferPlay();
    void streamingPlay();
    State getState() const;
    std::function<void(int, const std::string&)> finishCallback{nullptr};

    
    bool isFinished() const;
    void externalSync(int64_t gLastRenderTime);
private:
    void setState(State state);
    /**
     * Loop control, if the streaming audio is playing and the game tries to loop audio,
     * need to lock the mutex to change the value as streaming audio is playing with multi-thread.
     */
    bool _isLoop{false};
    std::mutex _loopSettingMutex;

    float _duration{0};
    bool _isStreaming{false};
    float _volume{0};
    bool _needExternalSync{false};
    /**
     * Finish play in a formal way
     */
    bool _isFinished{false};
    bool _isAttached{false};
    /**
     * Rotate thread
     */
    std::thread* _playerThread{nullptr};

    AudioCache* _cache{nullptr};
    AudioPlayerDescriptor _descriptor;

    /** _state is the only way to check if the player is stopped, to make frame rate stable.*/
    mutable std::shared_mutex _stateMtx;
    State _state{State::UNLOADED};
    int64_t lastRenderTime{0};
    float _startTime{0};
    /** Cache a pausing time to return value when the player is at pause state */
    float _pauseTime{0};
    /**
     * _playerThreadBarrier and _playerThreadMtx are mean to manage thread sleep and wake.
     */
    std::condition_variable _playerThreadBarrier;
    std::mutex _playerThreadMtx;
    bool _shouldReschedule{false};
};
} // namespace cc
