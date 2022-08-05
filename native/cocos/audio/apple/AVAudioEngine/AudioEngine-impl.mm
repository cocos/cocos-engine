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

#include "audio/apple/AVAudioEngine/AudioEngine-impl.h"
#import "AVFoundation/AVAudioEngine.h"
#import "AVFoundation/AVAudioFile.h"
#import "AVFoundation/AVAudioFormat.h"
#import "AVFoundation/AVAudioPlayerNode.h"
#include "application/ApplicationManager.h"
#include "audio/include/AudioEngine.h"
#include "platform/FileUtils.h"

#include "cocos/profiler/Profiler.h"
static AVAudioEngine* gAvaudioEngine = nullptr;
static AVAudioFormat* gAvaudioFormat = nullptr;
namespace cc {
class Scheduler;

AudioEngineImpl::AudioEngineImpl()
: _currentID(0),
  _lazyInitLoop(true) {}

AudioEngineImpl::~AudioEngineImpl() {
    if (auto sche = _scheduler.lock()) {
        sche->unschedule("AudioEngine", this);
    }

    AUDIO_RELEASE(gAvaudioEngine); // Should be released totally, otherwise a leak occurs
    for (auto& player : _players) {
        delete player.second;
    }
    _players.clear();
    for (auto& player : _unusedPlayers) {
        delete player.second;
    }
    _unusedPlayers.clear();
    for (auto& cache : _caches) {
        delete cache.second;
    }
    _caches.clear();
}

bool AudioEngineImpl::init() {
    _scheduler = CC_CURRENT_ENGINE()->getScheduler();
    // Init with error?
    gAvaudioEngine = [[AVAudioEngine alloc] init];
    AVAudioFormat* outputFormat = [gAvaudioEngine.outputNode outputFormatForBus:0];
    [gAvaudioEngine connect:(AVAudioNode*)gAvaudioEngine.mainMixerNode to:gAvaudioEngine.outputNode format:outputFormat];
    [gAvaudioEngine prepare];
    AudioEngine::addTask([&]{
        NSError* err;
        [gAvaudioEngine startAndReturnError:&err];
        NSERROR_CHECK(AVAUDIOENGINE_START_FAILED, err);
    });
    return true;
}

AudioCache* AudioEngineImpl::preload(const ccstd::string& filePath, const LoadCallback& callback, bool isSync) {
    AudioCache* cache = nullptr;
    auto itr = _caches.find(filePath);

    if (itr != _caches.end()) {
        cache = itr->second;
    } else {
        cache = new AudioCache(filePath);
        _caches[filePath] = cache;
        if (isSync) {
            AUDIO_CHECK(cache->load());
        } else {
            AudioEngine::addTask([cache]() {
                AUDIO_CHECK(cache->load());
            });
        }
    }
    if (cache && callback) {
        cache->addLoadCallback(callback);
    }
    return cache;
}

int32_t AudioEngineImpl::createAudioPlayer() {
    CC_PROFILE(CREATE_PLAYER);
    int32_t audioID{-1};
    AudioPlayer* player;
    if (_unusedPlayers.empty()) {
        player = new AudioPlayer();
        audioID = _currentID;
        _currentID++;
    } else {
        audioID = _unusedPlayers.begin()->first;
        player = _unusedPlayers[audioID];
        _unusedPlayers.erase(audioID);
    }
    _players[audioID] = player;
    return audioID;
}
ccstd::vector<uint8_t> AudioEngineImpl::getOriginalPCMBuffer(char const* url, uint32_t channelID) {
    ccstd::string str(url);
    AudioCache* cache;
    auto itr = _caches.find(str);
    if (itr == _caches.end()) {
        cache = preload(str, nullptr, true);
    } else {
        cache = itr->second;
    }

    return cache->getPCMBuffer(channelID);
}

PCMHeader AudioEngineImpl::getPCMHeader(const char* url) {
    ccstd::string str(url);
    AudioCache* cache = preload(str, nullptr, true);
    return cache->getPCMHeader();
}

int32_t AudioEngineImpl::play2d(const ccstd::string& filePath, bool loop, float volume) {
    CC_PROFILE(AUDIOENGINE_PLAY2D);
    int32_t audioID = createAudioPlayer();
    AudioPlayer* player = _players[audioID];
    AUDIO_CHECK(player->setLoop(loop));
    AUDIO_CHECK(player->setVolume(volume));
    AudioCache* cache = preload(filePath, nullptr);
    if (cache == nullptr) {
        _players.erase(audioID); // ptr will be removed
        _unusedPlayers[audioID] = player;
        CC_LOG_DEBUG("Audio Cache is invalid, plz check if audio resource exist");
#if CC_DEBUG > 0
        assert(false);
#endif
        return AudioEngine::INVALID_AUDIO_ID;
    }
    if (!player->isAttached) {
        CC_PROFILE(ATTACH_PLAYERNODE);
        [gAvaudioEngine attachNode:player->getDescriptor().node];
        [gAvaudioEngine connect:player->getDescriptor().node
                             to:(AVAudioNode*)gAvaudioEngine.mainMixerNode
                         format:cache->getDescriptor().audioFile.processingFormat]; // TODO(timlyeee): err: -10878 format
        player->isAttached = true;
    }
    {
        CC_PROFILE(CACHE_ADD);
    cache->addLoadCallback([&player, &cache](bool) {
        AUDIO_CHECK(player->load(cache));
        AUDIO_CHECK(player->ready());
    });
    
    cache->addPlayCallback([&player, &audioID, this]() {
        if (_lazyInitLoop) {
            CC_PROFILE(START_AND_SETLAZYINIT);
            _lazyInitLoop = false;
            
        }
        AUDIO_CHECK(player->play());
        CC_LOG_DEBUG("[AudioEngine impl] audio player played, with audio id %d", audioID);
        if (auto sche = _scheduler.lock()) {
            sche->schedule([this](auto &&  /*pH1*/) { 
                update(); 
            }, this, 0.05F, false, "AudioEngine");
        }
    });
    }
    return audioID;
}

void AudioEngineImpl::setVolume(int32_t audioID, float volume) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    AUDIO_CHECK(_players[audioID]->setVolume(volume));
}

void AudioEngineImpl::setLoop(int32_t audioID, bool loop) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    AUDIO_CHECK(_players[audioID]->setLoop(loop));
}

void AudioEngineImpl::pause(int32_t audioID) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    AUDIO_CHECK(_players[audioID]->pause());
}

void AudioEngineImpl::resume(int32_t audioID) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    AUDIO_CHECK(_players[audioID]->resume());
}

void AudioEngineImpl::stop(int audioID) {
    if (!checkAudioIdValid(audioID)) {
        NSLog(@"audio id is not valid");
        return;
    }
    NSLog(@"[Engine Impl] player stop called %d", audioID);
    _players[audioID]->stop();
}
void AudioEngineImpl::stopAll() {
    NSLog(@"[Engine Impl] player stop all called");
    for (auto itr : _players) {
        NSLog(@"[Engine Impl] player stop called %d in stop all", itr.first);
        itr.second->stop();
    }
}
float AudioEngineImpl::getDuration(int32_t audioID) {
    if (!checkAudioIdValid(audioID)) {
        return 0.0F;
    }
    return _players[audioID]->getDuration();
}
float AudioEngineImpl::getDurationFromFile(const ccstd::string& filePath) {
    auto itr = _caches.find(filePath);
    if (itr == _caches.end()) {
        preload(filePath, nullptr);
        return 0.0F;
    }
    uint32_t frameCount = itr->second->getPCMHeader().totalFrames;
    uint32_t sampleRate = itr->second->getPCMHeader().sampleRate;
    return (float)frameCount / (float)sampleRate;
}
float AudioEngineImpl::getCurrentTime(int audioID) {
    if (!checkAudioIdValid(audioID)) {
        CC_LOG_DEBUG("[AENGINE] audio id is invalid");
        return 0.0F;
    }
    return _players[audioID]->getCurrentTime();
}
bool AudioEngineImpl::setCurrentTime(int32_t audioID, float time) {
    if (!checkAudioIdValid(audioID)) {
        return false;
    }
    return _players[audioID]->setCurrentTime(time);
}
void AudioEngineImpl::setFinishCallback(int audioID, const FinishCallback& callback) {
    if (!checkAudioIdValid(audioID)) {
        return;
    }
    CC_LOG_DEBUG("[Audioengine impl] set finish callback for audio id %d", audioID);
    _players[audioID]->finishCallback = callback;
}

void AudioEngineImpl::uncache(const std::string& filePath) {
    if (_caches[filePath]->useCount > 0) {
        NSLog(@"use count > 0, could not uncache file");
    }
    delete _caches[filePath];
    _caches.erase(filePath);
}

void AudioEngineImpl::uncacheAll() {
    for (auto& cache : _caches) {
        delete cache.second;
    }
    _caches.clear();
}

// Update audio engine to uncache or cache audio
void AudioEngineImpl::update() {
    CC_LOG_DEBUG("Updating .......");
    CC_PROFILE(AUDIO_UPDATE);
    int32_t audioID;
    AudioPlayer* player;

    // release all players with state STOPPED.
    for (auto itr = _players.begin(); itr != _players.end();) {
        audioID = itr->first;
        player = itr->second;
        //        NSLog(@"Audio ID %d, state is %d", audioID, player->getState());
        if ((player->getState() == AudioPlayer::State::STOPPED)) {
            player->postStop();
            if (player->isFinished() && player->finishCallback) {
                const ccstd::string fileFullPath{player->getCache()->_fileFullPath};
                CC_LOG_DEBUG("Succeed, audio is finished.");
                auto callback = player->finishCallback;
                if (auto sche = _scheduler.lock()) {
                    // Translate copy but not reference as error occurs.
                    sche->performFunctionInCocosThread([audioID, callback, fileFullPath] {
                        callback(audioID, fileFullPath);
                    });
                }
                
            }
            player->unload();

            if (player->isAttached) {
                // NSLog(@"player node detached");
                [gAvaudioEngine disconnectNodeOutput:player->getDescriptor().node];
                [gAvaudioEngine detachNode:player->getDescriptor().node];
                player->isAttached = false;
            }
            AudioEngine::remove(audioID);
            itr = _players.erase(itr);
            _unusedPlayers[audioID] = player;
        } else {
            ++itr;
        }
    }
    if (_players.empty()) {
        _lazyInitLoop = true;
        if (auto sche = _scheduler.lock()) {
            sche->unschedule("AudioEngine", this);
        }
//      [gAvaudioEngine pause];
    }
}

bool AudioEngineImpl::checkAudioIdValid(int audioID) {
    return _players.find(audioID) != _players.end();
}
} // namespace cc
