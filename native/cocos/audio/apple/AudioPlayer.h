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
    AudioPlayer();
    AudioPlayer(AudioCache* cache);
    ~AudioPlayer();
    
    bool load(AudioCache* cache);
    bool play();
    bool playAtTime();
    bool pause();
    bool resume();
    bool stop();
    bool unload();

    bool setVolume(float volume);
    float getVolume();
    bool setLoop(bool isLoop);
    bool isLoop();
    float getDuration();
    float getCurrentTime();
    bool setCurrentTime(float curTime);
    AudioPlayerDescriptor getDescriptor();
    void rotateBuffer();
    bool isForceCache {false};
    State state;
    bool isAttached {false};
    std::function<void(int, const std::string&)> finishCallback {nullptr};
private:
    std::mutex _playMutex;
    
    AudioCache* _cache {nullptr};
    AudioPlayerDescriptor _descriptor;
    bool _isLoop {false};
    bool _isStreaming {false};
    float _volume {0};
    float _currentTime {0};
    float _duration {0};
    std::thread* _rotateBufferThread {nullptr};
    bool _isRotateThreadExited {false};
    std::condition_variable _sleepCondition;
    std::mutex              _sleepMutex;
};
} // namespace cc
