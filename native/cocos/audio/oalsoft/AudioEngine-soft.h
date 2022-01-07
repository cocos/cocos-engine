/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include <unordered_map>

#include "audio/oalsoft/AudioCache.h"
#include "audio/oalsoft/AudioPlayer.h"
#include "cocos/base/RefCounted.h"

namespace cc {

class Scheduler;

#define MAX_AUDIOINSTANCES 32

class CC_DLL AudioEngineImpl : public RefCounted {
public:
    AudioEngineImpl();
    ~AudioEngineImpl() override;

    bool  init();
    int   play2d(const std::string &filePath, bool loop, float volume);
    void  setVolume(int audioID, float volume);
    void  setLoop(int audioID, bool loop);
    bool  pause(int audioID);
    bool  resume(int audioID);
    void  stop(int audioID);
    void  stopAll();
    float getDuration(int audioID);
    float getDurationFromFile(const std::string &filePath);
    float getCurrentTime(int audioID);
    bool  setCurrentTime(int audioID, float time);
    void  setFinishCallback(int audioID, const std::function<void(int, const std::string &)> &callback);

    void        uncache(const std::string &filePath);
    void        uncacheAll();
    AudioCache *preload(const std::string &filePath, const std::function<void(bool)> &callback);
    void        update(float dt);

private:
    bool checkAudioIdValid(int audioID);
    void play2dImpl(AudioCache *cache, int audioID);

    ALuint _alSources[MAX_AUDIOINSTANCES];

    //source,used
    std::unordered_map<ALuint, bool> _alSourceUsed;

    //filePath,bufferInfo
    std::unordered_map<std::string, AudioCache> _audioCaches;

    //audioID,AudioInfo
    std::unordered_map<int, AudioPlayer *> _audioPlayers;
    std::mutex                             _threadMutex;

    bool _lazyInitLoop;

    int                      _currentAudioID;
    std::weak_ptr<Scheduler> _scheduler;
};
} // namespace cc
