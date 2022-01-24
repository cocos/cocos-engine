/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
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

#include "base/Macros.h"
#include "audio/apple/AudioMacros.h"

#include <condition_variable>
#include <mutex>
#include <string>
#include <thread>
#include <OpenAL/al.h>

namespace cc {
class AudioCache;
class AudioEngineImpl;

class AudioPlayer {
public:
    AudioPlayer();
    ~AudioPlayer();

    void destroy();

    //queue buffer related stuff
    bool setTime(float time);
    float getTime() { return _currTime; }
    bool setLoop(bool loop);

protected:
    void setCache(AudioCache *cache);
    void rotateBufferThread(int offsetFrame);
    bool play2d();
    void wakeupRotateThread();

    AudioCache *_audioCache;

    float _volume;
    bool _loop;
    std::function<void(int, const std::string &)> _finishCallbak;

    bool _isDestroyed;
    bool _removeByAudioEngine;
    bool _ready;
    ALuint _alSource;

    //play by circular buffer
    float _currTime;
    bool _streamingSource;
    ALuint _bufferIds[QUEUEBUFFER_NUM];
    std::thread *_rotateBufferThread;
    std::condition_variable _sleepCondition;
    std::mutex _sleepMutex;
    bool _timeDirty;
    bool _isRotateThreadExited;
    std::atomic_bool _needWakeupRotateThread;

    std::mutex _play2dMutex;

    unsigned int _id;

    friend class AudioEngineImpl;
};

} // namespace cc
