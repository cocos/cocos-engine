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
#define LOG_TAG "AudioEngine-OALSOFT"

#include "audio/oalsoft/AudioEngine-soft.h"

#ifdef OPENAL_PLAIN_INCLUDES
    #include "alc.h"
    #include "alext.h"
#elif CC_PLATFORM == CC_PLATFORM_WINDOWS
    #include "OpenalSoft/alc.h"
    #include "OpenalSoft/alext.h"
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include "AL/alc.h"
    #include "AL/alext.h"
#endif
#include "audio/include/AudioEngine.h"
#include "audio/oalsoft/AudioDecoderManager.h"
#include "base/Scheduler.h"
#include "application/ApplicationManager.h"
#include "platform/FileUtils.h"

#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    #include <windows.h>

// log, CC_LOG_DEBUG aren't threadsafe, since we uses sub threads for parsing pcm data, threadsafe log output
// is needed. Define the following macros (ALOGV, ALOGD, ALOGI, ALOGW, ALOGE) for threadsafe log output.

//IDEA: Move _winLog, winLog to a separated file
static void _winLog(const char *format, va_list args) {
    static const int MAX_LOG_LENGTH = 16 * 1024;
    int              bufferSize     = MAX_LOG_LENGTH;
    char *           buf            = nullptr;

    do {
        buf = new (std::nothrow) char[bufferSize];
        if (buf == nullptr)
            return; // not enough memory

        int ret = vsnprintf(buf, bufferSize - 3, format, args);
        if (ret < 0) {
            bufferSize *= 2;

            delete[] buf;
        } else
            break;

    } while (true);

    strcat(buf, "\n");

    int   pos                         = 0;
    auto  len                         = static_cast<int>(strlen(buf));
    char  tempBuf[MAX_LOG_LENGTH + 1] = {0};
    WCHAR wszBuf[MAX_LOG_LENGTH + 1]  = {0};

    do {
        std::copy(buf + pos, buf + pos + MAX_LOG_LENGTH, tempBuf);

        tempBuf[MAX_LOG_LENGTH] = 0;

        MultiByteToWideChar(CP_UTF8, 0, tempBuf, -1, wszBuf, sizeof(wszBuf));
        OutputDebugStringW(wszBuf);

        pos += MAX_LOG_LENGTH;

    } while (pos < len);

    delete[] buf;
}

    #ifndef audioLog
void audioLog(const char *format, ...) {
    va_list args;
    va_start(args, format);
    _winLog(format, args);
    va_end(args);
}
    #endif

#else

    #define audioLog(...) CC_LOG_DEBUG(__VA_ARGS__)

#endif

using namespace cc; //NOLINT

static ALCdevice * sALDevice  = nullptr;
static ALCcontext *sALContext = nullptr;

AudioEngineImpl::AudioEngineImpl()
: _lazyInitLoop(true),
  _currentAudioID(0) {
}

AudioEngineImpl::~AudioEngineImpl() {
    if (auto sche = _scheduler.lock()) {
        sche->unschedule("AudioEngine", this);
    }

    if (sALContext) {
        alDeleteSources(MAX_AUDIOINSTANCES, _alSources);

        _audioCaches.clear();

        alcMakeContextCurrent(nullptr);
        alcDestroyContext(sALContext);
        sALContext = nullptr;
    }

    if (sALDevice) {
        alcCloseDevice(sALDevice);
        sALDevice = nullptr;
    }

    AudioDecoderManager::destroy();
}

bool AudioEngineImpl::init() {
    bool ret = false;
    do {
        sALDevice = alcOpenDevice(nullptr);

        if (sALDevice) {
            alGetError();
            sALContext = alcCreateContext(sALDevice, nullptr);
            alcMakeContextCurrent(sALContext);

            alGenSources(MAX_AUDIOINSTANCES, _alSources);
            auto alError = alGetError();
            if (alError != AL_NO_ERROR) {
                CC_LOG_ERROR("%s:generating sources failed! error = %x\n", __FUNCTION__, alError);
                break;
            }

            for (unsigned int src : _alSources) {
                _alSourceUsed[src] = false;
            }

            _scheduler = CC_CURRENT_ENGINE()->getScheduler();
            ret        = AudioDecoderManager::init();
            CC_LOG_DEBUG("OpenAL was initialized successfully!");
        }
    } while (false);

    return ret;
}

AudioCache *AudioEngineImpl::preload(const std::string &filePath, const std::function<void(bool)> &callback) {
    AudioCache *audioCache = nullptr;

    auto it = _audioCaches.find(filePath);
    if (it == _audioCaches.end()) {
        audioCache                    = &_audioCaches[filePath];
        audioCache->_fileFullPath     = FileUtils::getInstance()->fullPathForFilename(filePath);
        unsigned int cacheId          = audioCache->_id;
        auto         isCacheDestroyed = audioCache->_isDestroyed;
        AudioEngine::addTask([audioCache, cacheId, isCacheDestroyed]() {
            if (*isCacheDestroyed) {
                ALOGV("AudioCache (id=%u) was destroyed, no need to launch readDataTask.", cacheId);
                audioCache->setSkipReadDataTask(true);
                return;
            }
            audioCache->readDataTask(cacheId);
        });
    } else {
        audioCache = &it->second;
    }

    if (audioCache && callback) {
        audioCache->addLoadCallback(callback);
    }
    return audioCache;
}

int AudioEngineImpl::play2d(const std::string &filePath, bool loop, float volume) {
    if (sALDevice == nullptr) {
        return AudioEngine::INVALID_AUDIO_ID;
    }

    bool   sourceFlag = false;
    ALuint alSource   = 0;
    for (unsigned int src : _alSources) {
        alSource = src;

        if (!_alSourceUsed[alSource]) {
            sourceFlag = true;
            break;
        }
    }
    if (!sourceFlag) {
        return AudioEngine::INVALID_AUDIO_ID;
    }

    auto player = new (std::nothrow) AudioPlayer;
    if (player == nullptr) {
        return AudioEngine::INVALID_AUDIO_ID;
    }

    player->_alSource = alSource;
    player->_loop     = loop;
    player->_volume   = volume;

    auto audioCache = preload(filePath, nullptr);
    if (audioCache == nullptr) {
        delete player;
        return AudioEngine::INVALID_AUDIO_ID;
    }

    player->setCache(audioCache);
    _threadMutex.lock();
    _audioPlayers[_currentAudioID] = player;
    _threadMutex.unlock();

    _alSourceUsed[alSource] = true;

    audioCache->addPlayCallback(std::bind(&AudioEngineImpl::play2dImpl, this, audioCache, _currentAudioID));

    if (_lazyInitLoop) {
        _lazyInitLoop = false;
        if (auto sche = _scheduler.lock()) {
            sche->schedule(CC_CALLBACK_1(AudioEngineImpl::update, this), this, 0.05F, false, "AudioEngine");
        }
    }

    return _currentAudioID++;
}

void AudioEngineImpl::play2dImpl(AudioCache *cache, int audioID) {
    //Note: It may bn in sub thread or main thread :(
    if (!*cache->_isDestroyed && cache->_state == AudioCache::State::READY) {
        _threadMutex.lock();
        auto playerIt = _audioPlayers.find(audioID);
        if (playerIt != _audioPlayers.end() && playerIt->second->play2d()) {
            if (auto sche = _scheduler.lock()) {
                sche->performFunctionInCocosThread([audioID]() {
                    if (AudioEngine::sAudioIDInfoMap.find(audioID) != AudioEngine::sAudioIDInfoMap.end()) {
                        AudioEngine::sAudioIDInfoMap[audioID].state = AudioEngine::AudioState::PLAYING;
                    }
                });
            }
        }
        _threadMutex.unlock();
    } else {
        CC_LOG_DEBUG("AudioEngineImpl::play2dImpl, cache was destroyed or not ready!");
        auto iter = _audioPlayers.find(audioID);
        if (iter != _audioPlayers.end()) {
            iter->second->_removeByAudioEngine = true;
        }
    }
}

void AudioEngineImpl::setVolume(int audioID, float volume) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    auto player     = _audioPlayers[audioID];
    player->_volume = volume;

    if (player->_ready) {
        alSourcef(_audioPlayers[audioID]->_alSource, AL_GAIN, volume);

        auto error = alGetError();
        if (error != AL_NO_ERROR) {
            ALOGE("%s: audio id = %d, error = %x", __FUNCTION__, audioID, error);
        }
    }
}

void AudioEngineImpl::setLoop(int audioID, bool loop) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    auto player = _audioPlayers[audioID];

    if (player->_ready) {
        if (player->_streamingSource) {
            player->setLoop(loop);
        } else {
            if (loop) {
                alSourcei(player->_alSource, AL_LOOPING, AL_TRUE);
            } else {
                alSourcei(player->_alSource, AL_LOOPING, AL_FALSE);
            }

            auto error = alGetError();
            if (error != AL_NO_ERROR) {
                ALOGE("%s: audio id = %d, error = %x", __FUNCTION__, audioID, error);
            }
        }
    } else {
        player->_loop = loop;
    }
}

bool AudioEngineImpl::pause(int audioID) {
    if (!checkAudioIdValid(audioID)) {
        return false;
    }
    bool ret = true;
    alSourcePause(_audioPlayers[audioID]->_alSource);

    auto error = alGetError();
    if (error != AL_NO_ERROR) {
        ret = false;
        ALOGE("%s: audio id = %d, error = %x\n", __FUNCTION__, audioID, error);
    }

    return ret;
}

bool AudioEngineImpl::resume(int audioID) {
    if (!checkAudioIdValid(audioID)) {
        return false;
    }
    bool ret = true;
    alSourcePlay(_audioPlayers[audioID]->_alSource);

    auto error = alGetError();
    if (error != AL_NO_ERROR) {
        ret = false;
        ALOGE("%s: audio id = %d, error = %x\n", __FUNCTION__, audioID, error);
    }

    return ret;
}

void AudioEngineImpl::stop(int audioID) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    auto player = _audioPlayers[audioID];
    player->destroy();
    //Note: Don't set the flag to false here, it should be set in 'update' function.
    // Otherwise, the state got from alSourceState may be wrong
    //    _alSourceUsed[player->_alSource] = false;

    // Call 'update' method to cleanup immediately since the schedule may be cancelled without any notification.
    update(0.0F);
}

void AudioEngineImpl::stopAll() {
    for (auto &&player : _audioPlayers) {
        player.second->destroy();
    }
    //Note: Don't set the flag to false here, it should be set in 'update' function.
    // Otherwise, the state got from alSourceState may be wrong
    //    for(int index = 0; index < MAX_AUDIOINSTANCES; ++index)
    //    {
    //        _alSourceUsed[_alSources[index]] = false;
    //    }

    // Call 'update' method to cleanup immediately since the schedule may be cancelled without any notification.
    update(0.0F);
}

float AudioEngineImpl::getDuration(int audioID) {
    if (!checkAudioIdValid(audioID)) {
        return 0.0F;
    }
    auto player = _audioPlayers[audioID];
    if (player->_ready) {
        return player->_audioCache->_duration;
    }
    return AudioEngine::TIME_UNKNOWN;
}

float AudioEngineImpl::getDurationFromFile(const std::string &filePath) {
    auto it = _audioCaches.find(filePath);
    if (it == _audioCaches.end()) {
        this->preload(filePath, nullptr);
        return AudioEngine::TIME_UNKNOWN;
    }

    return it->second._duration;
}

float AudioEngineImpl::getCurrentTime(int audioID) {
    if (!checkAudioIdValid(audioID)) {
        return 0.0F;
    }
    float ret    = 0.0F;
    auto  player = _audioPlayers[audioID];
    if (player->_ready) {
        if (player->_streamingSource) {
            ret = player->getTime();
        } else {
            alGetSourcef(player->_alSource, AL_SEC_OFFSET, &ret);

            auto error = alGetError();
            if (error != AL_NO_ERROR) {
                ALOGE("%s, audio id:%d,error code:%x", __FUNCTION__, audioID, error);
            }
        }
    }

    return ret;
}

bool AudioEngineImpl::setCurrentTime(int audioID, float time) {
    if (!checkAudioIdValid(audioID)) {
        return false;
    }
    bool ret    = false;
    auto player = _audioPlayers[audioID];

    do {
        if (!player->_ready) {
            break;
        }

        if (player->_streamingSource) {
            ret = player->setTime(time);
            break;
        }

        if (player->_audioCache->_framesRead != player->_audioCache->_totalFrames &&
            (time * player->_audioCache->_sampleRate) > player->_audioCache->_framesRead) {
            ALOGE("%s: audio id = %d", __FUNCTION__, audioID);
            break;
        }

        alSourcef(player->_alSource, AL_SEC_OFFSET, time);

        auto error = alGetError();
        if (error != AL_NO_ERROR) {
            ALOGE("%s: audio id = %d, error = %x", __FUNCTION__, audioID, error);
        }
        ret = true;

    } while (false);

    return ret;
}

void AudioEngineImpl::setFinishCallback(int audioID, const std::function<void(int, const std::string &)> &callback) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    _audioPlayers[audioID]->_finishCallbak = callback;
}

void AudioEngineImpl::update(float /*dt*/) {
    ALint        sourceState;
    int          audioID;
    AudioPlayer *player;
    ALuint       alSource;

    //    ALOGV("AudioPlayer count: %d", (int)_audioPlayers.size());

    for (auto it = _audioPlayers.begin(); it != _audioPlayers.end();) {
        audioID  = it->first;
        player   = it->second;
        alSource = player->_alSource;
        alGetSourcei(alSource, AL_SOURCE_STATE, &sourceState);

        if (player->_removeByAudioEngine) {
            AudioEngine::remove(audioID);
            _threadMutex.lock();
            it = _audioPlayers.erase(it);
            _threadMutex.unlock();
            delete player;
            _alSourceUsed[alSource] = false;
        } else if (player->_ready && sourceState == AL_STOPPED) {
            std::string filePath;
            if (player->_finishCallbak) {
                auto &audioInfo = AudioEngine::sAudioIDInfoMap[audioID];
                filePath        = *audioInfo.filePath;
            }

            AudioEngine::remove(audioID);

            _threadMutex.lock();
            it = _audioPlayers.erase(it);
            _threadMutex.unlock();

            if (player->_finishCallbak) {
                player->_finishCallbak(audioID, filePath); //IDEA: callback will delay 50ms
            }
            delete player;
            _alSourceUsed[alSource] = false;
        } else {
            ++it;
        }
    }

    if (_audioPlayers.empty()) {
        _lazyInitLoop = true;
        if (auto sche = _scheduler.lock()) {
            sche->unschedule("AudioEngine", this);
        }
    }
}

void AudioEngineImpl::uncache(const std::string &filePath) {
    _audioCaches.erase(filePath);
}

void AudioEngineImpl::uncacheAll() {
    _audioCaches.clear();
}

bool AudioEngineImpl::checkAudioIdValid(int audioID) {
    return _audioPlayers.find(audioID) != _audioPlayers.end();
}
