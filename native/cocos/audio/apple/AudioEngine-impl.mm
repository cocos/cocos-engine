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

#import "AVFoundation/AVAudioEngine.h"
#import "AVFoundation/AVAudioPlayerNode.h"
#import "AVFoundation/AVAudioFile.h"
#import "AVFoundation/AVAudioFormat.h"
#include "audio/apple/AudioEngine-Impl.h"
#include "audio/include/AudioEngine.h"
#include "application/ApplicationManager.h"
#include "platform/FileUtils.h"

static AVAudioEngine* engine_instance = nullptr;

namespace cc {
static AudioEngineImpl* s_instance = nullptr;
class Scheduler;


AudioEngineImpl::AudioEngineImpl():_currentID(0), _lazyInitLoop(true){
    engine_instance = [[AVAudioEngine alloc] init];
    s_instance = this;
}

AudioEngineImpl::~AudioEngineImpl() {
    if (auto sche = _scheduler.lock()) {
        sche->unschedule("AudioEngine", this);
    }
    
    //TODO: release all player nodes attached?
    [engine_instance release];
    _players.clear();
    _caches.clear();
    s_instance = nullptr;
}

bool AudioEngineImpl::init() {
    _scheduler = CC_CURRENT_ENGINE()->getScheduler();
    return true;
    
}

// Return player in memo pool
int32_t AudioEngineImpl::getUsablePlayer() {
    if(_unusedPlayers.empty()) {
        return -1;
    }
    return _unusedPlayers.begin()->first;
}
AudioCache* AudioEngineImpl::preload(const ccstd::string &filePath, const LoadCallback &callback) {
    AudioCache* cache;
    auto itr = _caches.find(filePath);
    
    if(itr != _caches.end()){
        cache = itr->second;
    } else {
        auto fileFullPath = FileUtils::getInstance()->fullPathForFilename(filePath);
        cache = new AudioCache(fileFullPath);
        _caches[filePath] = cache;
        AudioEngine::addTask([cache](){
            cache->load();
        });
        _caches[filePath] = cache;
    }
    if(cache && callback) {
        cache->addLoadCallback(callback);
    }
    return cache;
}

AudioCache* AudioEngineImpl::forceLoad(const ccstd::string &filePath, const LoadCallback &callback) {
    AudioCache* cache;
    auto itr = _caches.find(filePath);
    
    if(itr != _caches.end()){
        cache = itr->second;
        cache->load(); // force load async
        if(callback) {
            cache->addLoadCallback(callback);
        }
    } else {
        auto fileFullPath = FileUtils::getInstance()->fullPathForFilename(filePath);
        cache = new AudioCache(fileFullPath);
        _caches[filePath] = cache;
        cache->load(); // force load
        _caches[filePath] = cache;
        if(callback) {
            cache->addLoadCallback(callback);
        }
    }
    return cache;
}

int32_t AudioEngineImpl::registerAudio() {
    AudioPlayer* player;
    int32_t audioID = getUsablePlayer();
    if (audioID == -1) {
        player = new AudioPlayer();
        audioID = _currentID;
        _currentID++;
    } else {
        player = _unusedPlayers[audioID];
    }
    
    _threadMutex.try_lock();
    _unusedPlayers.erase(audioID);
    _players[audioID] = player;
    _threadMutex.unlock();
    return audioID;
}
ccstd::vector<uint8_t> AudioEngineImpl::getOriginalPCMBuffer(char const* url, uint32_t channelID){
    ccstd::string str(url);
    AudioCache* cache;
    auto itr = _caches.find(str);
    if(itr == _caches.end()) {
        cache = forceLoad(str, nullptr);
    } else {
        cache = itr->second;
    }
    
    return cache->getPCMBuffer(channelID);
}

PCMHeader AudioEngineImpl::getPCMHeader(const char *url) {
    ccstd::string str(url);
    AudioCache* cache = preload(str, nullptr);
    return cache->getPCMHeader();
}

// return audio id, but not really play it.
int32_t AudioEngineImpl::play2d(const ccstd::string &filePath, bool loop, float volume) {
    int32_t audioID = registerAudio();
    AudioPlayer* player = _players[audioID];
    player->setLoop(loop);
    player->setVolume(volume);
    AudioCache* cache = preload(filePath, nullptr);
    cache->addLoadCallback([player, cache](bool){
        player->load(cache);
    });
    if(!player->isAttached) {
        [engine_instance attachNode:player->getDescriptor().node];
        [engine_instance connect:player->getDescriptor().node to:(AVAudioNode*)engine_instance.mainMixerNode format:cache->getDescriptor().buffer.format]; // TODO: err: -10878 format error
        player->isAttached = true;
    }


    
    if(_lazyInitLoop) {
        _lazyInitLoop = false;
        [engine_instance connect:(AVAudioNode*)engine_instance.mainMixerNode to:engine_instance.outputNode format:cache->getDescriptor().buffer.format];
        NSError* err;
        if(![engine_instance startAndReturnError: &err]){
            NSLog(@"%@AudioEngine initialize failed ", [err localizedDescription]);
            [err release];
            return false;
        }
        if (auto sche = _scheduler.lock()) {
            sche->schedule(CC_CALLBACK_1(AudioEngineImpl::update, this), this, 0.05f, false, "AudioEngine");
        }
    }
    cache->addPlayCallback([player](){
        player->play();
    });
    // _lazy init loop also means if there is no audio, the update function might not running
//    if(_lazyInitLoop) {
//        _lazyInitLoop = false;
//        [engine_instance prepare];
//        NSError* err;
//        if(![engine_instance startAndReturnError: &err]){
//            NSLog(@"%@AudioEngine initialize failed ", [err localizedDescription]);
//            [err release];
//            return false;
//        }
//        if (auto sche = _scheduler.lock()) {
//            sche->schedule(CC_CALLBACK_1(AudioEngineImpl::update, this), this, 0.05f, false, "AudioEngine");
//        }
//    }
    return audioID;
}

void AudioEngineImpl::setVolume(int audioID, float volume) {
    if(!checkAudioIdValid(audioID)){
        return;
    }
    _players[audioID]->setVolume(volume);

}

void AudioEngineImpl::setLoop(int audioID, bool loop) {
    if(!checkAudioIdValid(audioID)){
        return;
    }
    _players[audioID]->setLoop(loop);
}

bool AudioEngineImpl::pause(int audioID) {
    if(!checkAudioIdValid(audioID)){
        return false;
    }
    return _players[audioID]->pause();
}

bool AudioEngineImpl::resume(int audioID) {
    if(!checkAudioIdValid(audioID)){
        return false;
    }
    return _players[audioID]->resume();
}

void AudioEngineImpl::stop(int audioID) {
    if(!checkAudioIdValid(audioID)){
        return;
    }
    AudioEngine::addTask([this, audioID](){
        _players[audioID]->stop();
        _unusedPlayers[audioID] = _players[audioID];
        _players.erase(audioID);
    });
    update(0.0f);
    return;
}
void AudioEngineImpl::stopAll() {
    for (auto itr : _players) {
        itr.second->stop();
        _unusedPlayers[itr.first] = itr.second;
        _players.erase(itr.first);
    }
    update(0.0f);
}
float AudioEngineImpl::getDuration(int audioID) {
    if(!checkAudioIdValid(audioID)){
        return 0.0f;
    }
    return _players[audioID]->getDuration();
}
float AudioEngineImpl::getDurationFromFile(const ccstd::string &filePath){
    auto itr = _caches.find(filePath);
    if(itr == _caches.end()) {
        preload(filePath, nullptr);
        return 0.0f;
    }
    uint32_t frameCount = itr->second->getPCMHeader().totalFrames;
    uint32_t sampleRate = itr->second->getPCMHeader().sampleRate;
    return (float)frameCount/(float)sampleRate;
}
float AudioEngineImpl::getCurrentTime(int audioID) {
    if(!checkAudioIdValid(audioID)){
        return 0.0f;
    }
    return _players[audioID]->getCurrentTime();
}
bool AudioEngineImpl::setCurrentTime(int audioID, float time){
    if(!checkAudioIdValid(audioID)){
        return false;
    }
    return _players[audioID]->setCurrentTime(time);
}
void AudioEngineImpl::setFinishCallback(int audioID, const FinishCallback &callback){
    if(!checkAudioIdValid(audioID)){
        return;
    }
    _players[audioID]->finishCallback = callback;
}

void AudioEngineImpl::uncache(const std::string &filePath){
    if (_caches[filePath]->useCount > 0) {
        NSLog(@"use count > 0, could not uncache file");
    }
    delete _caches[filePath];
    _caches.erase(filePath);
}

void AudioEngineImpl::uncacheAll(){
    _caches.clear();
}

// Update audio engine to uncache or cache audio
void AudioEngineImpl::update(float dt){
    int32_t audioID;
    AudioPlayer* player;
    
    // release all players ran out.
    for (auto itr = _players.begin(); itr != _players.end();) {
        audioID = itr->first;
        player = itr->second;
        if (!player->isForceCache && player->state == AudioPlayer::State::STOPPED) {
            player->unload();
            
            _threadMutex.try_lock();
            _unusedPlayers[audioID] = player;
            itr = _players.erase(itr);
            _threadMutex.unlock();
            auto sche = _scheduler.lock();
            if(player->finishCallback)
            {
                std::string filePath;
                if (player->finishCallback) {
                    auto &audioInfo = AudioEngine::sAudioIDInfoMap[audioID];
                    filePath = *audioInfo.filePath;
                }
                sche->performFunctionInCocosThread([audioID, player, filePath](){
                    player->finishCallback(audioID, filePath);
                });
            }
        } else {
            ++itr;
        }
    }
    if (_players.empty()) {
        NSLog(@"players emply");
        _lazyInitLoop = true;
        if (auto sche = _scheduler.lock()) {
            sche->unschedule("AudioEngine", this);
        }
        [engine_instance pause];
    }
}

bool AudioEngineImpl::checkAudioIdValid(int audioID){
    if(_players.find(audioID) != _players.end()){
        return true;
    }
    return false;
}
} //namespace cc

