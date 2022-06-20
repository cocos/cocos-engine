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

#include "base/RefCounted.h"
#include "base/std/container/list.h"
#include "base/std/container/unordered_map.h"



namespace cc {
class Scheduler;

#define MAX_AUDIOINSTANCES 24

class AudioEngineImpl : public cc::RefCounted {
public:
    AudioEngineImpl();
    ~AudioEngineImpl();

    bool init();
    int play(const ccstd::string &fileFullPath, bool loop, float volume);
    void setVolume(int audioID, float volume);
    void setLoop(int audioID, bool loop);
    bool pause(int audioID);
    bool resume(int audioID);
    void stop(int audioID);
    void stopAll();
    float getDuration(int audioID);
    float getDurationFromFile(const ccstd::string &fileFullPath);
    float getCurrentTime(int audioID);
    bool setCurrentTime(int audioID, float time);
    void setFinishCallback(int audioID, const FinishCallback &callback);

    void uncache(const ccstd::string &filePath);
    void uncacheAll();
    // return CacheID
    uint32_t preload(const ccstd::string &filePath, std::function<void(bool)> callback);
    void update(float dt);

private:
    bool checkAudioIdValid(int audioID);
    void play2dImpl(AudioCache *cache, int audioID);
    
    std::weak_ptr<Scheduler> _scheduler;
};
} // namespace cc


