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
#include <cstdint>
#include "base/std/container/unordered_map.h"
#include <functional>
#include "base/RefCounted.h"
#include "audio/apple/AudioPlayer.h"
#include "audio/apple/AudioCache.h"

namespace cc {
class Scheduler;

/**
 @common
 */
typedef std::function<void(uint32_t, const ccstd::string &)> FinishCallback;
typedef std::function<void(bool)> LoadCallback;
#define MAX_AUDIOINSTANCES 24

class AudioEngineImpl : public cc::RefCounted {
public:
    AudioEngineImpl();
    ~AudioEngineImpl();

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
    int play2d(const ccstd::string &fileFullPath, bool loop, float volume);
    
    int32_t getUsablePlayer();
    
    // Register audio with fileFullPath
    int registerAudio();
    
    // Cache audio with audioID specified.
//    bool cacheAudio(uint32_t audioID);
    
    /**
     * Player control.
     */
    // Play from the beginning
    bool play(int32_t audioID, bool loop, float volume);
    void setVolume(int32_t audioID, float volume);
    float getVolume(int32_t audioID);
    void setLoop(int32_t audioID, bool loop);
    bool isLoop(int32_t audioID);
    bool pause(int32_t audioID);
    bool resume(int32_t audioID);
    void stop(int32_t audioID);
    void stopAll();
    float getDuration(int32_t audioID);
    float getDurationFromFile(const ccstd::string &fileFullPath);
    float getCurrentTime(int32_t audioID);
    bool setCurrentTime(int32_t audioID, float time);
    void setFinishCallback(int32_t audioID, const FinishCallback &callback);

    void uncache(const ccstd::string &filePath);
    void uncacheAll();
    
    // return CacheID
    AudioCache* preload(const ccstd::string &filePath, const LoadCallback &callback);
    void update(float dt);

private:
    bool checkAudioIdValid(int32_t audioID);
    std::unordered_map<int32_t, AudioPlayer*> _players;
    std::unordered_map<std::string, AudioCache*> _caches;
    std::unordered_map<int32_t, AudioPlayer*> _unusedPlayers;
    std::weak_ptr<Scheduler> _scheduler;
    std::mutex _threadMutex;
    bool _lazyInitLoop {false};
    int32_t _currentID;
};
} // namespace cc


