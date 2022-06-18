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

#include "audio/apple/AudioMacros.h"
#include "base/Macros.h"

#include <condition_variable>
#include <mutex>
#include <thread>
#include "base/std/container/string.h"

namespace cc {
typedef std::function<void(int, const ccstd::string &)> FinishCallback;
class AudioCache;
class AudioEngineImpl;
enum class AudioPlayerState {
    UNUSED,
    READY,
    PLAYING,
    PAUSED,
    STOPPED
};
class AudioPlayer {
public:
    AudioPlayer() = default;
    ~AudioPlayer();
    AudioCache *getCache() const { return _cache; }
    void setCache(AudioCache* cache){ _cache = cache; }
    
    // AVAudioPlayer is readonly
    void* getPlayer() { return _player; }
    // Release audio player, it's useful when trying to use memory pool.
    bool play();
    bool pause();
    bool resume();
    void stop();
    
    // Init when audio cache is enabled.
    bool init();
    bool release();
private:
    AudioCache * _cache {nullptr};
    void * _player {nullptr};
    AudioPlayerState _state {AudioPlayerState::UNUSED};
    uint32_t _audioID {0};
    friend class AudioEngineImpl;
    
    FinishCallback _finishCallback;
};
} //namespace cc
