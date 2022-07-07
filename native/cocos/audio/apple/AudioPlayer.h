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
#ifdef __OBJC__
typedef struct AudioPlayerDescriptor {
    AVAudioPlayerNode* node;
    AVAudioPCMBuffer* bufferToPlay;
    AVAudioFramePosition curFrame;
    bool isAttached {false};
} AudioPlayerDescriptor;
#else
typedef struct AudioPlayerDescriptor {
    void* node;
} AudioPlayerDescriptor;
#endif

namespace cc {
class AudioPlayer {
public:
    enum State {
        UNUSED,
        READY,
        PLAYING,
        PAUSED,
        STOPPED,
    };
    /**
     * Create an audio player without audio cache.
     */
    AudioPlayer();
    AudioPlayer(AudioCache* cache);
    ~AudioPlayer();
    
    /**
     * Update _cache and if it's playing, stop itself.
     */
    bool load(AudioCache* cache);
    // If the audio is playing, then it will play at current time specified
    bool play();
    // Pause will update _currentTime
    bool pause();
    // Resume or play audio
    bool resume();
    // Stop.
    bool stop();
    /**
     * unload audio cache, and if it's playing, stop itself.
     */
    bool unload();
    
    bool setVolume(float volume);
    float getVolume();
    bool setLoop(bool isLoop);
    bool isLoop();
    float getDuration();
    float getCurrentTime();
    bool setCurrentTime(float curTime);
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
    float _startRenderTime {0};
    float _duration {0};

    std::condition_variable _sleepCondition;
    std::mutex              _sleepMutex;
};
} // namespace cc
