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
#include "AudioCache.h"
#include <mutex>
#include <thread>
#ifdef __OBJC__
#import <AVFoundation/AVAudioPlayerNode.h>
#else
// other platforms implementation
#endif
/**
 * An AudioPlayerDescriptor is to adapt different platform as we are trying to use an unified AudioPlayer class, or an IAudioPlayer who offers common methods
 */
typedef struct AudioPlayerDescriptor {
#ifdef __OBJC__
    AVAudioPlayerNode* node;
#else
    void* node;
#endif
} AudioPlayerDescriptor;



namespace cc {
class AudioPlayer {
public:
    enum State {
        UNLOADED,
        READY, // READY TO PLAY
        PLAYING,
        PAUSING,
        PAUSED,
        INTERRUPTING,
        INTERRUPTED,
        FINISHED,
    };
    /**
     * Create an audio player without audio cache, state keeps UNLOADED
     */
    AudioPlayer();
    /**
     * Create an audio player with an audio cache, state turns to READY
     */
    AudioPlayer(AudioCache* cache);
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
    bool stop();

    
    bool setVolume(float volume);
    float getVolume() const;
    bool setLoop(bool isLoop);
    bool isLoop() const;
    float getDuration() const;
    
    
    /**
     * Change the seekerTime and should reschedule buffer.
     */
    bool setCurrentTime(float curTime);
    float getCurrentTime() const;
    /**
     * Get a copy of audio player descriptor.
     */
    AudioPlayerDescriptor getDescriptor();
    void rotateBuffer();
    bool isForceCache();
    void setForceCache();
    State getState() const {return _state;}
    
    std::function<void(int, const std::string&)> finishCallback {nullptr};
    
#ifdef __OBJC__
    bool isAttached {false};
#endif
    
private:
    /**
     * Loop control, if the streaming audio is playing and the game tries to loop audio,
     * need to lock the mutex to change the value as _isLoop is uesd in multi-thread.
     */
    bool _isLoop {false};
    std::mutex _loopSettingMutex;
    
    /**
     * Rotate thread
     */
    std::thread* _rotateBufferThread {nullptr};
    bool _shouldRotateThreadExited {false};
    
    AudioCache* _cache {nullptr};
    AudioPlayerDescriptor _descriptor;
    State _state;
    bool _isStreaming {false};
    bool _isForceCache {false};
    float _volume {0};
    float _seeker {0};
    float _duration {0};
    bool _shouldRescheduleBuffer {false};

    std::condition_variable _rotateBarrier;
    std::mutex _readBufferMutex;
};
} // namespace cc
