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

#include <stdint.h>
#include "audio/include/AudioDef.h"
#include "audio/oalsoft/AudioCache.h"
#include "audio/oalsoft/AudioPlayer.h"
#include "base/std/container/unordered_map.h"
#include "cocos/base/RefCounted.h"
#include "cocos/base/std/any.h"

namespace cc {

class Scheduler;

#define MAX_AUDIOINSTANCES 32

class CC_DLL AudioEngineImpl : public RefCounted {
public:
    AudioEngineImpl();
    ~AudioEngineImpl() override;

    bool init();
    int play2d(const ccstd::string &filePath, bool loop, float volume);
    void setVolume(int audioID, float volume);
    void setLoop(int audioID, bool loop);
    bool pause(int audioID);
    bool resume(int audioID);
    void stop(int audioID);
    void stopAll();
    float getDuration(int audioID);
    float getDurationFromFile(const ccstd::string &filePath);
    float getCurrentTime(int audioID);
    bool setCurrentTime(int audioID, float time);
    void setFinishCallback(int audioID, const std::function<void(int, const ccstd::string &)> &callback);

    void uncache(const ccstd::string &filePath);
    void uncacheAll();
    AudioCache *preload(const ccstd::string &filePath, const std::function<void(bool)> &callback);
    void update(float dt);
    PCMHeader getPCMHeader(const char *url);
    ccstd::vector<uint8_t> getOriginalPCMBuffer(const char *url, uint32_t channelID);

private:
    bool checkAudioIdValid(int audioID);
    void play2dImpl(AudioCache *cache, int audioID);

    ALuint _alSources[MAX_AUDIOINSTANCES];

    //source,used
    ccstd::unordered_map<ALuint, bool> _alSourceUsed;

    //filePath,bufferInfo
    ccstd::unordered_map<ccstd::string, AudioCache> _audioCaches;

    //audioID,AudioInfo
    ccstd::unordered_map<int, AudioPlayer *> _audioPlayers;
    std::mutex _threadMutex;

    bool _lazyInitLoop;

    int _currentAudioID;
    std::weak_ptr<Scheduler> _scheduler;
};
} // namespace cc
