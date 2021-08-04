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

#define LOG_TAG "AudioEngine-inl.mm"
#include "audio/apple/AudioEngine-inl.h"

#import <OpenAL/alc.h>
#import <AVFoundation/AVFoundation.h>
#if CC_PLATFORM == CC_PLATFORM_MAC_IOS
    #import <UIKit/UIApplication.h>
#endif

#include "audio/include/AudioEngine.h"
#include "platform/FileUtils.h"
#include "platform/Application.h"
#include "base/Scheduler.h"
#include "base/Utils.h"

using namespace cc;

static ALCdevice *s_ALDevice = nullptr;
static ALCcontext *s_ALContext = nullptr;
static AudioEngineImpl *s_instance = nullptr;

typedef ALvoid (*alSourceNotificationProc)(ALuint sid, ALuint notificationID, ALvoid *userData);
typedef ALenum (*alSourceAddNotificationProcPtr)(ALuint sid, ALuint notificationID, alSourceNotificationProc notifyProc, ALvoid *userData);
static ALenum alSourceAddNotificationExt(ALuint sid, ALuint notificationID, alSourceNotificationProc notifyProc, ALvoid *userData) {
    static alSourceAddNotificationProcPtr proc = nullptr;

    if (proc == nullptr) {
        proc = (alSourceAddNotificationProcPtr)alcGetProcAddress(nullptr, "alSourceAddNotification");
    }

    if (proc) {
        return proc(sid, notificationID, notifyProc, userData);
    }
    return AL_INVALID_VALUE;
}

#if CC_PLATFORM == CC_PLATFORM_MAC_IOS
@interface AudioEngineSessionHandler : NSObject {
}

- (id)init;
- (void)handleInterruption:(NSNotification *)notification;

@end

@implementation AudioEngineSessionHandler

    // only enable it on iOS. Disable it on tvOS
    #if !defined(CC_TARGET_OS_TVOS)
void AudioEngineInterruptionListenerCallback(void *user_data, UInt32 interruption_state) {
    if (kAudioSessionBeginInterruption == interruption_state) {
        alcMakeContextCurrent(nullptr);
    } else if (kAudioSessionEndInterruption == interruption_state) {
        OSStatus result = AudioSessionSetActive(true);
        if (result) NSLog(@"Error setting audio session active! %d\n", static_cast<int>(result));

        alcMakeContextCurrent(s_ALContext);
    }
}
    #endif

- (id)init {
    if (self = [super init]) {
        if ([[[UIDevice currentDevice] systemVersion] intValue] > 5) {
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleInterruption:) name:AVAudioSessionInterruptionNotification object:[AVAudioSession sharedInstance]];
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleInterruption:) name:UIApplicationDidBecomeActiveNotification object:nil];
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleInterruption:) name:UIApplicationWillResignActiveNotification object:nil];
        }
        // only enable it on iOS. Disable it on tvOS
        // AudioSessionInitialize removed from tvOS
    #if !defined(CC_TARGET_OS_TVOS)
        else {
            AudioSessionInitialize(NULL, NULL, AudioEngineInterruptionListenerCallback, self);
        }
    #endif

        BOOL success = [[AVAudioSession sharedInstance]
            setCategory:AVAudioSessionCategoryAmbient
                  error:nil];
        if (!success)
            ALOGE("Fail to set audio session.");
    }
    return self;
}

- (void)handleInterruption:(NSNotification *)notification {
    static bool isAudioSessionInterrupted = false;
    static bool resumeOnBecomingActive = false;
    static bool pauseOnResignActive = false;

    if ([notification.name isEqualToString:AVAudioSessionInterruptionNotification]) {
        NSInteger reason = [[[notification userInfo] objectForKey:AVAudioSessionInterruptionTypeKey] integerValue];
        if (reason == AVAudioSessionInterruptionTypeBegan) {
            isAudioSessionInterrupted = true;
            alcMakeContextCurrent(nullptr);

            if ([UIApplication sharedApplication].applicationState == UIApplicationStateActive) {
                ALOGD("AVAudioSessionInterruptionTypeBegan, application == UIApplicationStateActive, pauseOnResignActive = true");
                pauseOnResignActive = true;
            }
        }

        if (reason == AVAudioSessionInterruptionTypeEnded) {
            isAudioSessionInterrupted = false;

            NSError *error = nil;
            [[AVAudioSession sharedInstance] setActive:YES error:&error];
            alcMakeContextCurrent(s_ALContext);

            if ([UIApplication sharedApplication].applicationState != UIApplicationStateActive) {
                ALOGD("AVAudioSessionInterruptionTypeEnded, application != UIApplicationStateActive, resumeOnBecomingActive = true");
                resumeOnBecomingActive = true;
            }
        }
    } else if ([notification.name isEqualToString:UIApplicationWillResignActiveNotification]) {
        ALOGD("UIApplicationWillResignActiveNotification");
        if (pauseOnResignActive) {
            pauseOnResignActive = false;
            ALOGD("UIApplicationWillResignActiveNotification, alcMakeContextCurrent(nullptr)");
            alcMakeContextCurrent(nullptr);
        }
    } else if ([notification.name isEqualToString:UIApplicationDidBecomeActiveNotification]) {
        ALOGD("UIApplicationDidBecomeActiveNotification");
        if (resumeOnBecomingActive) {
            resumeOnBecomingActive = false;
            ALOGD("UIApplicationDidBecomeActiveNotification, alcMakeContextCurrent(s_ALContext)");
            NSError *error = nil;
            BOOL success = [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:&error];
            if (!success) {
                ALOGE("Fail to set audio session.");
                return;
            }
            [[AVAudioSession sharedInstance] setActive:YES error:&error];
            alcMakeContextCurrent(s_ALContext);
        } else if (isAudioSessionInterrupted) {
            ALOGD("Audio session is still interrupted, pause director!");
            //IDEA: Director::getInstance()->pause();
        }
    }
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:AVAudioSessionInterruptionNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidBecomeActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationWillResignActiveNotification object:nil];

    [super dealloc];
}
@end

static id s_AudioEngineSessionHandler = nullptr;
#endif

ALvoid AudioEngineImpl::myAlSourceNotificationCallback(ALuint sid, ALuint notificationID, ALvoid *userData) {
    // Currently, we only care about AL_BUFFERS_PROCESSED event
    if (notificationID != AL_BUFFERS_PROCESSED)
        return;

    AudioPlayer *player = nullptr;
    s_instance->_threadMutex.lock();
    for (const auto &e : s_instance->_audioPlayers) {
        player = e.second;
        if (player->_alSource == sid && player->_streamingSource) {
            player->wakeupRotateThread();
        }
    }
    s_instance->_threadMutex.unlock();
}

AudioEngineImpl::AudioEngineImpl()
: _lazyInitLoop(true), _currentAudioID(0) {
    s_instance = this;
}

AudioEngineImpl::~AudioEngineImpl() {
    if (auto sche = _scheduler.lock()) {
        sche->unschedule("AudioEngine", this);
    }

    if (s_ALContext) {
        alDeleteSources(MAX_AUDIOINSTANCES, _alSources);

        _audioCaches.clear();

        alcMakeContextCurrent(nullptr);
        alcDestroyContext(s_ALContext);
    }
    if (s_ALDevice) {
        alcCloseDevice(s_ALDevice);
    }

#if CC_PLATFORM == CC_PLATFORM_MAC_IOS
    [s_AudioEngineSessionHandler release];
#endif
    s_instance = nullptr;
}

bool AudioEngineImpl::init() {
    bool ret = false;
    do {
#if CC_PLATFORM == CC_PLATFORM_MAC_IOS
        s_AudioEngineSessionHandler = [[AudioEngineSessionHandler alloc] init];
#endif

        s_ALDevice = alcOpenDevice(nullptr);

        if (s_ALDevice) {
            s_ALContext = alcCreateContext(s_ALDevice, nullptr);
            alcMakeContextCurrent(s_ALContext);

            alGenSources(MAX_AUDIOINSTANCES, _alSources);
            auto alError = alGetError();
            if (alError != AL_NO_ERROR) {
                ALOGE("%s:generating sources failed! error = %x", __PRETTY_FUNCTION__, alError);
                break;
            }

            for (int i = 0; i < MAX_AUDIOINSTANCES; ++i) {
                _unusedSourcesPool.push_back(_alSources[i]);
                alSourceAddNotificationExt(_alSources[i], AL_BUFFERS_PROCESSED, myAlSourceNotificationCallback, nullptr);
            }

            // fixed #16170: Random crash in alGenBuffers(AudioCache::readDataTask) at startup
            // Please note that, as we know the OpenAL operation is atomic (threadsafe),
            // 'alGenBuffers' may be invoked by different threads. But in current implementation of 'alGenBuffers',
            // When the first time it's invoked, application may crash!!!
            // Why? OpenAL is opensource by Apple and could be found at
            // http://opensource.apple.com/source/OpenAL/OpenAL-48.7/Source/OpenAL/oalImp.cpp .
            /*

            void InitializeBufferMap()
            {
                if (gOALBufferMap == NULL) // Position 1
                {
                    gOALBufferMap = new OALBufferMap ();  // Position 2

                    // Position Gap

                    gBufferMapLock = new CAGuard("OAL:BufferMapLock"); // Position 3
                    gDeadOALBufferMap = new OALBufferMap ();

                    OALBuffer   *newBuffer = new OALBuffer (AL_NONE);
                    gOALBufferMap->Add(AL_NONE, &newBuffer);
                }
            }

            AL_API ALvoid AL_APIENTRY alGenBuffers(ALsizei n, ALuint *bids)
            {
                ...

                try {
                    if (n < 0)
                    throw ((OSStatus) AL_INVALID_VALUE);

                    InitializeBufferMap();
                    if (gOALBufferMap == NULL)
                    throw ((OSStatus) AL_INVALID_OPERATION);

                    CAGuard::Locker locked(*gBufferMapLock);  // Position 4
                ...
                ...
            }

             */
            // 'gBufferMapLock' will be initialized in the 'InitializeBufferMap' function,
            // that's the problem. It means that 'InitializeBufferMap' may be invoked in different threads.
            // It will be very dangerous in multi-threads environment.
            // Imagine there're two threads (Thread A, Thread B), they call 'alGenBuffers' simultaneously.
            // While A goto 'Position Gap', 'gOALBufferMap' was assigned, then B goto 'Position 1' and find
            // that 'gOALBufferMap' isn't NULL, B just jump over 'InitialBufferMap' and goto 'Position 4'.
            // Meanwhile, A is still at 'Position Gap', B will crash at '*gBufferMapLock' since 'gBufferMapLock'
            // is still a null pointer. Oops, how could Apple implemented this method in this fucking way?

            // Workaround is do an unused invocation in the mainthread right after OpenAL is initialized successfully
            // as bellow.
            // ================ Workaround begin ================ //

            ALuint unusedAlBufferId = 0;
            alGenBuffers(1, &unusedAlBufferId);
            alDeleteBuffers(1, &unusedAlBufferId);

            // ================ Workaround end ================ //

            _scheduler = Application::getInstance()->getScheduler();
            ret = true;
            ALOGI("OpenAL was initialized successfully!");
        }
    } while (false);

    return ret;
}

AudioCache *AudioEngineImpl::preload(const std::string &filePath, std::function<void(bool)> callback) {
    AudioCache *audioCache = nullptr;

    auto it = _audioCaches.find(filePath);
    if (it == _audioCaches.end()) {
        audioCache = &_audioCaches[filePath];
        audioCache->_fileFullPath = FileUtils::getInstance()->fullPathForFilename(filePath);
        unsigned int cacheId = audioCache->_id;
        auto isCacheDestroyed = audioCache->_isDestroyed;
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
    if (s_ALDevice == nullptr) {
        return AudioEngine::INVALID_AUDIO_ID;
    }

    ALuint alSource = findValidSource();
    if (alSource == AL_INVALID) {
        return AudioEngine::INVALID_AUDIO_ID;
    }

    auto player = new (std::nothrow) AudioPlayer;
    if (player == nullptr) {
        return AudioEngine::INVALID_AUDIO_ID;
    }

    player->_alSource = alSource;
    player->_loop = loop;
    player->_volume = volume;

    auto audioCache = preload(filePath, nullptr);
    if (audioCache == nullptr) {
        delete player;
        return AudioEngine::INVALID_AUDIO_ID;
    }

    player->setCache(audioCache);
    _threadMutex.lock();
    _audioPlayers[_currentAudioID] = player;
    _threadMutex.unlock();

    audioCache->addPlayCallback(std::bind(&AudioEngineImpl::play2dImpl, this, audioCache, _currentAudioID));

    if (_lazyInitLoop) {
        _lazyInitLoop = false;
        if (auto sche = _scheduler.lock()) {
            sche->schedule(CC_CALLBACK_1(AudioEngineImpl::update, this), this, 0.05f, false, "AudioEngine");
        }
    }

    return _currentAudioID++;
}

void AudioEngineImpl::play2dImpl(AudioCache *cache, int audioID) {
    //Note: It may be in sub thread or main thread :(
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
        ALOGD("AudioEngineImpl::play2dImpl, cache was destroyed or not ready!");
        auto iter = _audioPlayers.find(audioID);
        if (iter != _audioPlayers.end()) {
            iter->second->_removeByAudioEngine = true;
        }
    }
}

ALuint AudioEngineImpl::findValidSource() {
    ALuint sourceId = AL_INVALID;
    if (!_unusedSourcesPool.empty()) {
        sourceId = _unusedSourcesPool.front();
        _unusedSourcesPool.pop_front();
    }

    return sourceId;
}

void AudioEngineImpl::setVolume(int audioID, float volume) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    auto player = _audioPlayers[audioID];
    player->_volume = volume;

    if (player->_ready) {
        alSourcef(_audioPlayers[audioID]->_alSource, AL_GAIN, volume);

        auto error = alGetError();
        if (error != AL_NO_ERROR) {
            ALOGE("%s: audio id = %d, error = %x", __PRETTY_FUNCTION__, audioID, error);
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
                ALOGE("%s: audio id = %d, error = %x", __PRETTY_FUNCTION__, audioID, error);
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
        ALOGE("%s: audio id = %d, error = %x", __PRETTY_FUNCTION__, audioID, error);
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
        ALOGE("%s: audio id = %d, error = %x", __PRETTY_FUNCTION__, audioID, error);
    }

    return ret;
}

void AudioEngineImpl::stop(int audioID) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    auto player = _audioPlayers[audioID];
    player->destroy();

    // Call 'update' method to cleanup immediately since the schedule may be cancelled without any notification.
    update(0.0f);
}

void AudioEngineImpl::stopAll() {
    for (auto &&player : _audioPlayers) {
        player.second->destroy();
    }

    // Call 'update' method to cleanup immediately since the schedule may be cancelled without any notification.
    update(0.0f);
}

float AudioEngineImpl::getDuration(int audioID) {
    if (!checkAudioIdValid(audioID)) {
        return 0.0f;
    }
    auto player = _audioPlayers[audioID];
    if (player->_ready) {
        return player->_audioCache->_duration;
    } else {
        return AudioEngine::TIME_UNKNOWN;
    }
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
        return 0.0f;
    }
    float ret = 0.0f;
    auto player = _audioPlayers[audioID];
    if (player->_ready) {
        if (player->_streamingSource) {
            ret = player->getTime();
        } else {
            alGetSourcef(player->_alSource, AL_SEC_OFFSET, &ret);

            auto error = alGetError();
            if (error != AL_NO_ERROR) {
                ALOGE("%s, audio id:%d,error code:%x", __PRETTY_FUNCTION__, audioID, error);
            }
        }
    }

    return ret;
}

bool AudioEngineImpl::setCurrentTime(int audioID, float time) {
    if (!checkAudioIdValid(audioID)) {
        return false;
    }
    bool ret = false;
    auto player = _audioPlayers[audioID];

    do {
        if (!player->_ready) {
            break;
        }

        if (player->_streamingSource) {
            ret = player->setTime(time);
            break;
        } else {
            if (player->_audioCache->_framesRead != player->_audioCache->_totalFrames &&
                (time * player->_audioCache->_sampleRate) > player->_audioCache->_framesRead) {
                ALOGE("%s: audio id = %d", __PRETTY_FUNCTION__, audioID);
                break;
            }

            alSourcef(player->_alSource, AL_SEC_OFFSET, time);

            auto error = alGetError();
            if (error != AL_NO_ERROR) {
                ALOGE("%s: audio id = %d, error = %x", __PRETTY_FUNCTION__, audioID, error);
            }
            ret = true;
        }
    } while (0);

    return ret;
}

void AudioEngineImpl::setFinishCallback(int audioID, const std::function<void(int, const std::string &)> &callback) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    _audioPlayers[audioID]->_finishCallbak = callback;
}

void AudioEngineImpl::update(float dt) {
    ALint sourceState;
    int audioID;
    AudioPlayer *player;
    ALuint alSource;

    //    ALOGV("AudioPlayer count: %d", (int)_audioPlayers.size());

    for (auto it = _audioPlayers.begin(); it != _audioPlayers.end();) {
        audioID = it->first;
        player = it->second;
        alSource = player->_alSource;
        alGetSourcei(alSource, AL_SOURCE_STATE, &sourceState);

        if (player->_removeByAudioEngine) {
            AudioEngine::remove(audioID);
            _threadMutex.lock();
            it = _audioPlayers.erase(it);
            _threadMutex.unlock();
            delete player;
            _unusedSourcesPool.push_back(alSource);
        } else if (player->_ready && sourceState == AL_STOPPED) {

            std::string filePath;
            if (player->_finishCallbak) {
                auto &audioInfo = AudioEngine::sAudioIDInfoMap[audioID];
                filePath = *audioInfo.filePath;
            }

            AudioEngine::remove(audioID);
            _threadMutex.lock();
            it = _audioPlayers.erase(it);
            _threadMutex.unlock();

            if (auto sche = _scheduler.lock()) {
                if (player->_finishCallbak) {
                    auto cb = player->_finishCallbak;
                    sche->performFunctionInCocosThread([audioID, cb, filePath]() {
                        cb(audioID, filePath); //IDEA: callback will delay 50ms
                    });
                }
            }

            delete player;
            _unusedSourcesPool.push_back(alSource);
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
