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

#import <AudioToolbox/AudioFile.h>
#include <mutex>
#include "base/std/container/string.h"

#include "audio/apple/AudioMacros.h"
#include "base/Macros.h"
#include "base/std/container/vector.h"

namespace cc {
class AudioEngineImpl;
class AudioPlayer;

typedef enum AbstractAudioFileType {
    MP3
} AbstractAudioFileType;



enum class AudioCacheState {
    INITIAL,
    LOADING,
    READY,
    FAILED
};
class AudioCache {
public:


    AudioCache();
    ~AudioCache();

    void addPlayCallback(const std::function<void()> &callback);

    void addLoadCallback(const std::function<void(bool)> &callback);

    // AVFoundation
    char* _audioBuffer;
    AudioCacheState _state;
    AbstractAudioFileType _avFileType;
    
protected:
    void setSkipReadDataTask(bool isSkip) { _isSkipReadDataTask = isSkip; };
    void readDataTask(unsigned int selfId);

    void invokingPlayCallbacks();

    void invokingLoadCallbacks();

//    ALsizei _sampleRate;
    float _duration;
    uint32_t _totalFrames;
    uint32_t _framesRead;
    uint32_t _bytesPerFrame;
    uint32_t _sampleRate;
    uint32_t _queBufferFrames;

    std::mutex _playCallbackMutex;
    ccstd::vector<std::function<void()>> _playCallbacks;

    // loadCallbacks doesn't need mutex since it's invoked only in Cocos thread.
    ccstd::vector<std::function<void(bool)>> _loadCallbacks;

    std::mutex _readDataTaskMutex;

    std::shared_ptr<bool> _isDestroyed;
    ccstd::string _fileFullPath;
    unsigned int _id;
    bool _isStereo;
    bool _isLoadingFinished;
    bool _isSkipReadDataTask;

    friend class AudioEngineImpl;
    friend class AudioPlayer;
};

} // namespace cc
