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

#include <sys/types.h>
#include <functional>
#include <memory>
#include <mutex>
#include "base/std/container/string.h"
#if defined(OPENAL_PLAIN_INCLUDES)
    #include <al.h>
#elif CC_PLATFORM == CC_PLATFORM_WINDOWS
    #include <OpenalSoft/al.h>
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include <AL/al.h>
#elif CC_PLATFORM == CC_PLATFORM_LINUX || CC_PLATFORM == CC_PLATFORM_QNX
    #include <AL/al.h>
#endif
#include "audio/include/AudioMacros.h"
#include "base/Macros.h"
#include "base/std/container/vector.h"
#define INVALID_AL_BUFFER_ID 0xFFFFFFFF
namespace cc {
class AudioEngineImpl;
class AudioPlayer;

class CC_DLL AudioCache {
public:
    enum class State {
        INITIAL,
        LOADING,
        READY,
        FAILED
    };

    AudioCache();
    ~AudioCache();

    void addPlayCallback(const std::function<void()> &callback);

    void addLoadCallback(const std::function<void(bool)> &callback);

    uint32_t getChannelCount() const { return _channelCount; }
    bool isStreaming() const { return _isStreaming; }

protected:
    void setSkipReadDataTask(bool isSkip) { _isSkipReadDataTask = isSkip; };
    void readDataTask(unsigned int selfId);

    void invokingPlayCallbacks();

    void invokingLoadCallbacks();

    //pcm data related stuff
    ALenum _format{-1};
    ALsizei _sampleRate{-1};
    float _duration{0.0F};
    uint32_t _totalFrames{0};
    uint32_t _framesRead{0};
    uint32_t _bytesPerFrame{0};

    bool _isStreaming{false};
    uint32_t _channelCount{1};

    /*Cache related stuff;
     * Cache pcm data when sizeInBytes less than PCMDATA_CACHEMAXSIZE
     */
    ALuint _alBufferId{INVALID_AL_BUFFER_ID};
    char *_pcmData{nullptr};

    /*Queue buffer related stuff
     *  Streaming in OpenAL when sizeInBytes greater then PCMDATA_CACHEMAXSIZE
     */
    char *_queBuffers[QUEUEBUFFER_NUM];
    ALsizei _queBufferSize[QUEUEBUFFER_NUM];
    uint32_t _queBufferFrames{0};

    std::mutex _playCallbackMutex;
    ccstd::vector<std::function<void()>> _playCallbacks;

    // loadCallbacks doesn't need mutex since it's invoked only in Cocos thread.
    ccstd::vector<std::function<void(bool)>> _loadCallbacks;

    std::mutex _readDataTaskMutex;

    State _state{State::INITIAL};

    std::shared_ptr<bool> _isDestroyed;
    ccstd::string _fileFullPath;
    unsigned int _id;
    bool _isLoadingFinished{false};
    bool _isSkipReadDataTask{false};

    friend class AudioEngineImpl;
    friend class AudioPlayer;
};

} // namespace cc
