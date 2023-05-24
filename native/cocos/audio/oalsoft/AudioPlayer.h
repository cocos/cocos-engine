/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <condition_variable>
#include <functional>
#include <mutex>
#include <thread>
#include "base/std/container/string.h"
#ifdef OPENAL_PLAIN_INCLUDES
    #include <al.h>
#elif CC_PLATFORM == CC_PLATFORM_WINDOWS
    #include <OpenalSoft/al.h>
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include <AL/al.h>
#elif CC_PLATFORM == CC_PLATFORM_LINUX || CC_PLATFORM == CC_PLATFORM_QNX
    #include <AL/al.h>
#endif
#include "base/Macros.h"

namespace cc {

class AudioCache;
class AudioEngineImpl;

class CC_DLL AudioPlayer {
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

    AudioCache *_audioCache;

    float _volume;
    bool _loop;
    std::function<void(int, const ccstd::string &)> _finishCallbak;

    bool _isDestroyed;
    bool _removeByAudioEngine;
    bool _ready;
    ALuint _alSource;

    //play by circular buffer
    float _currTime;
    bool _streamingSource;
    ALuint _bufferIds[3];
    std::thread *_rotateBufferThread;
    std::condition_variable _sleepCondition;
    std::mutex _sleepMutex;
    bool _timeDirty;
    bool _isRotateThreadExited;

    std::mutex _play2dMutex;

    unsigned int _id;

    friend class AudioEngineImpl;
};

} // namespace cc
