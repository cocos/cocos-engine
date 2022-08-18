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
#include <sys/_types/_int32_t.h>
#include <cstdint>
#include <functional>
#include "audio/apple/AVAudioEngine/AudioCache.h"
#include "audio/apple/AVAudioEngine/AudioPlayer.h"
#include "base/RefCounted.h"
#include "base/std/container/unordered_map.h"
#include "stack"
#include <queue>

namespace cc {
class Scheduler;

/**
 @common
 */

#define MAX_AUDIOINSTANCES 24

class AudioEngineImpl : public cc::RefCounted {
public:
    AudioEngineImpl();
    ~AudioEngineImpl() override;

    // Life cycle related
    bool init();
    bool release();

    /**
     @deprecated
     Play2d is a terrible method specification, it contains 3 steps at once.
     1. Register audio as audio ID
     2. Load audio as audio cache or some decode data
     3. Play audio.
     The audio engine should actually make these steps accessible, and then developers can control themselves.
     */
    int32_t play2d(const ccstd::string &filePath, bool loop, float volume);

    // Register audio with fileFullPath
    int32_t createAudioPlayer();

    /**
     * Player control.
     */
    // Play from the beginning
    void play(int32_t audioID, bool loop, float volume);
    void setVolume(int32_t audioID, float volume);
    float getVolume(int32_t audioID);
    void setLoop(int32_t audioID, bool loop);
    bool isLoop(int32_t audioID);
    void pause(int32_t audioID);
    void resume(int32_t audioID);
    void stop(int32_t audioID);
    void stopAll();
    float getDuration(int32_t audioID);
    float getDurationFromFile(const ccstd::string &filePath);
    float getCurrentTime(int32_t audioID);
    bool setCurrentTime(int32_t audioID, float time);
    void setFinishCallback(int32_t audioID, const FinishCallback &callback);

    void uncache(const ccstd::string &filePath);
    void uncacheAll();
    PCMHeader getPCMHeader(const char *url);
    ccstd::vector<uint8_t> getOriginalPCMBuffer(char const *url, uint32_t channelID);
    // return CacheID
    AudioCache *preload(const ccstd::string &filePath, const LoadCallback &callback, bool isSync = false);
    void update();

private:
    bool checkAudioIdValid(int32_t audioID);
    std::unordered_map<int32_t, AudioPlayer *> _players;
    std::stack<AudioPlayer *> _syncStack;
    std::unordered_map<std::string, AudioCache *> _caches;
    std::unordered_map<int32_t, AudioPlayer *> _unusedPlayers;
    std::weak_ptr<Scheduler> _scheduler;
    std::mutex _threadMutex;
    bool _lazyInitLoop{false};
    bool _isMixerAttached{false};
    int32_t _currentID;
};
} // namespace cc
