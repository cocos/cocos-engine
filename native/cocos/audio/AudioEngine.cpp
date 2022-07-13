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

#include "audio/include/AudioEngine.h"
#include <cstdint>
#include <condition_variable>
#include <mutex>
#include <thread>
#include "base/Log.h"
#include "base/Utils.h"
#include "base/memory/Memory.h"
#include "base/std/container/queue.h"
#include "platform/FileUtils.h"

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include "audio/android/AudioEngine-inl.h"
#elif CC_PLATFORM == CC_PLATFORM_IOS || CC_PLATFORM == CC_PLATFORM_MACOS
#if CC_USE_OPENAL
    #include "audio/apple/OpenAL/AudioEngine-inl.h"
#endif
#if CC_USE_AVAUDIOENGINE
#include "audio/apple/AVAudioEngine/AudioEngine-impl.h"
#endif
    
#elif CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_OHOS
    #include "audio/oalsoft/AudioEngine-soft.h"
#elif CC_PLATFORM == CC_PLATFORM_WINRT
    #include "audio/winrt/AudioEngine-winrt.h"
#elif CC_PLATFORM == CC_PLATFORM_LINUX || CC_PLATFORM == CC_PLATFORM_QNX
    #include "audio/oalsoft/AudioEngine-soft.h"
#elif CC_PLATFORM == CC_PLATFORM_TIZEN
    #include "audio/tizen/AudioEngine-tizen.h"
#endif

#define TIME_DELAY_PRECISION 0.0001

#ifdef ERROR
    #undef ERROR
#endif // ERROR

namespace cc {

const int AudioEngine::INVALID_AUDIO_ID = -1;
const float AudioEngine::TIME_UNKNOWN = -1.0F;

//audio file path,audio IDs
ccstd::unordered_map<ccstd::string, ccstd::list<int>> AudioEngine::sAudioPathIDMap;
//profileName,ProfileHelper
ccstd::unordered_map<ccstd::string, AudioEngine::ProfileHelper> AudioEngine::sAudioPathProfileHelperMap;
unsigned int AudioEngine::sMaxInstances = MAX_AUDIOINSTANCES;
AudioEngine::ProfileHelper *AudioEngine::sDefaultProfileHelper = nullptr;
ccstd::unordered_map<int, AudioEngine::AudioInfo> AudioEngine::sAudioIDInfoMap;
AudioEngineImpl *AudioEngine::sAudioEngineImpl = nullptr;

float AudioEngine::sVolumeFactor = 1.0F;
uint32_t AudioEngine::sOnPauseListenerID = 0;
uint32_t AudioEngine::sOnResumeListenerID = 0;
ccstd::vector<int> AudioEngine::sBreakAudioID;

AudioEngine::AudioEngineThreadPool *AudioEngine::sThreadPool = nullptr;
bool AudioEngine::sIsEnabled = true;

AudioEngine::AudioInfo::AudioInfo()
: filePath(nullptr),
  profileHelper(nullptr),
  volume(1.0F),
  loop(false),
  duration(TIME_UNKNOWN),
  state(AudioState::INITIALIZING) {
}

class AudioEngine::AudioEngineThreadPool {
public:
    explicit AudioEngineThreadPool(int threads = 4) {
        for (int index = 0; index < threads; ++index) {
            _workers.emplace_back(std::thread([this]() {
                threadFunc();
            }));
        }
    }

    void addTask(const std::function<void()> &task) {
        std::unique_lock<std::mutex> lk(_queueMutex);
        _taskQueue.emplace(task);
        _taskCondition.notify_one();
    }

    ~AudioEngineThreadPool() {
        {
            std::unique_lock<std::mutex> lk(_queueMutex);
            _stop = true;
            _taskCondition.notify_all();
        }

        for (auto &&worker : _workers) {
            worker.join();
        }
    }

private:
    void threadFunc() {
        while (true) {
            std::function<void()> task = nullptr;
            {
                std::unique_lock<std::mutex> lk(_queueMutex);
                if (_stop) {
                    break;
                }
                if (!_taskQueue.empty()) {
                    task = std::move(_taskQueue.front());
                    _taskQueue.pop();
                } else {
                    _taskCondition.wait(lk);
                    continue;
                }
            }

            task();
        }
    }

    ccstd::vector<std::thread> _workers;
    ccstd::queue<std::function<void()>> _taskQueue;

    std::mutex _queueMutex;
    std::condition_variable _taskCondition;
    bool _stop{};
};

void AudioEngine::end() {
    stopAll();

    if (sThreadPool) {
        delete sThreadPool;
        sThreadPool = nullptr;
    }

    delete sAudioEngineImpl;
    sAudioEngineImpl = nullptr;

    delete sDefaultProfileHelper;
    sDefaultProfileHelper = nullptr;

    if (sOnPauseListenerID != 0) {
        EventDispatcher::removeCustomEventListener(EVENT_COME_TO_BACKGROUND, sOnPauseListenerID);
        sOnPauseListenerID = 0;
    }

    if (sOnResumeListenerID != 0) {
        EventDispatcher::removeCustomEventListener(EVENT_COME_TO_FOREGROUND, sOnResumeListenerID);
        sOnResumeListenerID = 0;
    }
}

bool AudioEngine::lazyInit() {
    if (sAudioEngineImpl == nullptr) {
        sAudioEngineImpl = ccnew AudioEngineImpl();
        if (!sAudioEngineImpl || !sAudioEngineImpl->init()) {
            delete sAudioEngineImpl;
            sAudioEngineImpl = nullptr;
            return false;
        }
        sOnPauseListenerID = EventDispatcher::addCustomEventListener(EVENT_COME_TO_BACKGROUND, AudioEngine::onEnterBackground);
        sOnResumeListenerID = EventDispatcher::addCustomEventListener(EVENT_COME_TO_FOREGROUND, AudioEngine::onEnterForeground);
    }

#if (CC_PLATFORM != CC_PLATFORM_ANDROID)
    if (sAudioEngineImpl && sThreadPool == nullptr) {
        sThreadPool = ccnew AudioEngineThreadPool();
    }
#endif

    return true;
}

int AudioEngine::play2d(const ccstd::string &filePath, bool loop, float volume, const AudioProfile *profile) {
    int ret = AudioEngine::INVALID_AUDIO_ID;

    do {
        if (!isEnabled()) {
            break;
        }

        if (!lazyInit()) {
            break;
        }

        if (!FileUtils::getInstance()->isFileExist(filePath)) {
            break;
        }

        auto *profileHelper = sDefaultProfileHelper;
        if (profile && profile != &profileHelper->profile) {
            CC_ASSERT(!profile->name.empty());
            profileHelper = &sAudioPathProfileHelperMap[profile->name];
            profileHelper->profile = *profile;
        }

        if (sAudioIDInfoMap.size() >= sMaxInstances) {
            CC_LOG_INFO("Fail to play %s cause by limited max instance of AudioEngine", filePath.c_str());
            break;
        }
        if (profileHelper) {
            if (profileHelper->profile.maxInstances != 0 && profileHelper->audioIDs.size() >= profileHelper->profile.maxInstances) {
                CC_LOG_INFO("Fail to play %s cause by limited max instance of AudioProfile", filePath.c_str());
                break;
            }
            if (profileHelper->profile.minDelay > TIME_DELAY_PRECISION) {
                auto currTime = std::chrono::high_resolution_clock::now();
                auto delay = static_cast<float>(std::chrono::duration_cast<std::chrono::microseconds>(currTime - profileHelper->lastPlayTime).count()) / 1000000.0;
                if (profileHelper->lastPlayTime.time_since_epoch().count() != 0 && delay <= profileHelper->profile.minDelay) {
                    CC_LOG_INFO("Fail to play %s cause by limited minimum delay", filePath.c_str());
                    break;
                }
            }
        }

        if (volume < 0.0F) {
            volume = 0.0F;
        } else if (volume > 1.0F) {
            volume = 1.0F;
        }

        ret = sAudioEngineImpl->play2d(filePath, loop, volume);
        if (ret != INVALID_AUDIO_ID) {
            sAudioPathIDMap[filePath].push_back(ret);
            CC_LOG_DEBUG("push audio id %d to file path vector %s", ret, filePath.c_str());
            auto it = sAudioPathIDMap.find(filePath);

            auto &audioRef = sAudioIDInfoMap[ret];
            audioRef.volume = volume;
            audioRef.loop = loop;
            audioRef.filePath = &it->first;
            CC_LOG_DEBUG("audio info for id %d 's file path is %s", ret, audioRef.filePath->c_str());
            audioRef.state = AudioState::PLAYING;

            if (profileHelper) {
                profileHelper->lastPlayTime = std::chrono::high_resolution_clock::now();
                profileHelper->audioIDs.push_back(ret);
            }
            audioRef.profileHelper = profileHelper;
        }
    } while (false);

    return ret;
}

void AudioEngine::setLoop(int audioID, bool loop) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end() && it->second.loop != loop) {
        sAudioEngineImpl->setLoop(audioID, loop);
        it->second.loop = loop;
    }
}

void AudioEngine::setVolume(int audioID, float volume) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end()) {
        if (volume < 0.0F) {
            volume = 0.0F;
        } else if (volume > 1.0F) {
            volume = 1.0F;
        }

        if (it->second.volume != volume) {
            sAudioEngineImpl->setVolume(audioID, volume * sVolumeFactor);
            it->second.volume = volume;
        }
    }
}

void AudioEngine::setVolumeFactor(float factor) {
    if (factor > 1.0F) {
        factor = 1.0F;
    }
    if (factor < 0) {
        factor = 0.0F;
    }
    sVolumeFactor = factor;
    for (auto &item : sAudioIDInfoMap) {
        sAudioEngineImpl->setVolume(item.first, item.second.volume * sVolumeFactor);
    }
}

void AudioEngine::pause(int audioID) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end() && it->second.state == AudioState::PLAYING) {
        sAudioEngineImpl->pause(audioID);
        it->second.state = AudioState::PAUSED;
    }
}

void AudioEngine::pauseAll() {
    auto itEnd = sAudioIDInfoMap.end();
    for (auto it = sAudioIDInfoMap.begin(); it != itEnd; ++it) {
        if (it->second.state == AudioState::PLAYING) {
            sAudioEngineImpl->pause(it->first);
            it->second.state = AudioState::PAUSED;
        }
    }
}

void AudioEngine::resume(int audioID) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end() && it->second.state == AudioState::PAUSED) {
        sAudioEngineImpl->resume(audioID);
        it->second.state = AudioState::PLAYING;
    }
}

void AudioEngine::resumeAll() {
    auto itEnd = sAudioIDInfoMap.end();
    for (auto it = sAudioIDInfoMap.begin(); it != itEnd; ++it) {
        if (it->second.state == AudioState::PAUSED) {
            sAudioEngineImpl->resume(it->first);
            it->second.state = AudioState::PLAYING;
        }
    }
}

void AudioEngine::onEnterBackground(const CustomEvent & /*event*/) {
    auto itEnd = sAudioIDInfoMap.end();
    for (auto it = sAudioIDInfoMap.begin(); it != itEnd; ++it) {
        if (it->second.state == AudioState::PLAYING) {
            sAudioEngineImpl->pause(it->first);
            it->second.state = AudioState::PAUSED;
            sBreakAudioID.push_back(it->first);
        }
    }

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    if (sAudioEngineImpl) {
        sAudioEngineImpl->onPause();
    }
#endif
}

void AudioEngine::onEnterForeground(const CustomEvent & /*event*/) {
    auto itEnd = sBreakAudioID.end();
    for (auto it = sBreakAudioID.begin(); it != itEnd; ++it) {
        auto iter = sAudioIDInfoMap.find(*it);
        if (iter != sAudioIDInfoMap.end() && iter->second.state == AudioState::PAUSED) {
            sAudioEngineImpl->resume(*it);
            iter->second.state = AudioState::PLAYING;
        }
    }
    sBreakAudioID.clear();

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    if (sAudioEngineImpl) {
        sAudioEngineImpl->onResume();
    }
#endif
}

void AudioEngine::stop(int audioID) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end()) {
        sAudioEngineImpl->stop(audioID);

        remove(audioID);
    }
}

void AudioEngine::remove(int audioID) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end()) {
        if (it->second.profileHelper) {
            it->second.profileHelper->audioIDs.remove(audioID);
        }
        CC_LOG_DEBUG("Trying to remove audio id %d for audio path %s", audioID, (*it->second.filePath).c_str());
        sAudioPathIDMap[*it->second.filePath].remove(audioID);
        sAudioIDInfoMap.erase(audioID);
    }
}

void AudioEngine::stopAll() {
    if (!sAudioEngineImpl) {
        return;
    }
    CC_LOG_DEBUG("[Audio engine] Stop all");
    sAudioEngineImpl->stopAll();
    auto itEnd = sAudioIDInfoMap.end();
    for (auto it = sAudioIDInfoMap.begin(); it != itEnd; ++it) {
        if (it->second.profileHelper) {
            it->second.profileHelper->audioIDs.remove(it->first);
        }
    }
    sAudioPathIDMap.clear();
    CC_LOG_DEBUG("[Audio engine] ID info map clear all");
    sAudioIDInfoMap.clear();
}

void AudioEngine::uncache(const ccstd::string &filePath) {
    auto audioIDsIter = sAudioPathIDMap.find(filePath);
    if (audioIDsIter != sAudioPathIDMap.end()) {
        //@Note: For safely iterating elements from the audioID list, we need to copy the list
        // since 'AudioEngine::remove' may be invoked in 'sAudioEngineImpl->stop' synchronously.
        // If this happens, it will break the iteration, and crash will appear on some devices.
        ccstd::list<int> copiedIDs(audioIDsIter->second);

        for (int audioID : copiedIDs) {
            sAudioEngineImpl->stop(audioID);

            auto itInfo = sAudioIDInfoMap.find(audioID);
            if (itInfo != sAudioIDInfoMap.end()) {
                if (itInfo->second.profileHelper) {
                    itInfo->second.profileHelper->audioIDs.remove(audioID);
                }
                sAudioIDInfoMap.erase(audioID);
                CC_LOG_DEBUG("[Audio engine] audio id info map erase audio id %d", audioID);
            }
        }
        sAudioPathIDMap.erase(filePath);
    }

    if (sAudioEngineImpl) {
        sAudioEngineImpl->uncache(filePath);
    }
}

void AudioEngine::uncacheAll() {
    if (!sAudioEngineImpl) {
        return;
    }
    stopAll();
    sAudioEngineImpl->uncacheAll();
}

float AudioEngine::getDuration(int audioID) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end() && it->second.state != AudioState::INITIALIZING) {
        if (it->second.duration == TIME_UNKNOWN) {
            it->second.duration = sAudioEngineImpl->getDuration(audioID);
        }
        return it->second.duration;
    }

    return TIME_UNKNOWN;
}

float AudioEngine::getDurationFromFile(const ccstd::string &filePath) {
    lazyInit();

    if (sAudioEngineImpl) {
        return sAudioEngineImpl->getDurationFromFile(filePath);
    }

    return TIME_UNKNOWN;
}

bool AudioEngine::setCurrentTime(int audioID, float time) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end() && it->second.state != AudioState::INITIALIZING) {
        return sAudioEngineImpl->setCurrentTime(audioID, time);
    }

    return false;
}

float AudioEngine::getCurrentTime(int audioID) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end() && it->second.state != AudioState::INITIALIZING) {
        return sAudioEngineImpl->getCurrentTime(audioID);
    }
    return 0.0F;
}

void AudioEngine::setFinishCallback(int audioID, const std::function<void(int, const ccstd::string &)> &callback) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end()) {
        sAudioEngineImpl->setFinishCallback(audioID, callback);
    }
}

bool AudioEngine::setMaxAudioInstance(int maxInstances) {
    if (maxInstances > 0 && maxInstances <= MAX_AUDIOINSTANCES) {
        sMaxInstances = maxInstances;
        return true;
    }

    return false;
}

bool AudioEngine::isLoop(int audioID) {
    auto tmpIterator = sAudioIDInfoMap.find(audioID);
    if (tmpIterator != sAudioIDInfoMap.end()) {
        return tmpIterator->second.loop;
    }

    CC_LOG_INFO("AudioEngine::isLoop-->The audio instance %d is non-existent", audioID);
    return false;
}

float AudioEngine::getVolume(int audioID) {
    auto tmpIterator = sAudioIDInfoMap.find(audioID);
    if (tmpIterator != sAudioIDInfoMap.end()) {
        return tmpIterator->second.volume;
    }

    CC_LOG_INFO("AudioEngine::getVolume-->The audio instance %d is non-existent", audioID);
    return 0.0F;
}

AudioEngine::AudioState AudioEngine::getState(int audioID) {
    auto tmpIterator = sAudioIDInfoMap.find(audioID);
    if (tmpIterator != sAudioIDInfoMap.end()) {
        return tmpIterator->second.state;
    }

    return AudioState::ERROR;
}

AudioProfile *AudioEngine::getProfile(int audioID) {
    auto it = sAudioIDInfoMap.find(audioID);
    if (it != sAudioIDInfoMap.end()) {
        return &it->second.profileHelper->profile;
    }

    return nullptr;
}

AudioProfile *AudioEngine::getDefaultProfile() {
    if (sDefaultProfileHelper == nullptr) {
        sDefaultProfileHelper = ccnew ProfileHelper();
    }

    return &sDefaultProfileHelper->profile;
}

AudioProfile *AudioEngine::getProfile(const ccstd::string &name) {
    auto it = sAudioPathProfileHelperMap.find(name);
    if (it != sAudioPathProfileHelperMap.end()) {
        return &it->second.profile;
    }
    return nullptr;
}

void AudioEngine::preload(const ccstd::string &filePath, const std::function<void(bool isSuccess)> &callback) {
    if (!isEnabled()) {
        callback(false);
        return;
    }

    lazyInit();

    if (sAudioEngineImpl) {
        if (!FileUtils::getInstance()->isFileExist(filePath)) {
            if (callback) {
                callback(false);
            }
            return;
        }

        sAudioEngineImpl->preload(filePath, callback);
    }
}

void AudioEngine::addTask(const std::function<void()> &task) {
    lazyInit();

    if (sAudioEngineImpl && sThreadPool) {
        sThreadPool->addTask(task);
    }
}

int AudioEngine::getPlayingAudioCount() {
    return static_cast<int>(sAudioIDInfoMap.size());
}

void AudioEngine::setEnabled(bool isEnabled) {
    if (sIsEnabled != isEnabled) {
        sIsEnabled = isEnabled;

        if (!sIsEnabled) {
            stopAll();
        }
    }
}

bool AudioEngine::isEnabled() {
    return sIsEnabled;
}

PCMHeader AudioEngine::getPCMHeader(const char *url) {
    lazyInit();
    return sAudioEngineImpl->getPCMHeader(url);
}
ccstd::vector<uint8_t> AudioEngine::getOriginalPCMBuffer(const char *url, uint32_t channelID) {
    lazyInit();
    return sAudioEngineImpl->getOriginalPCMBuffer(url, channelID);
}
} // namespace cc
