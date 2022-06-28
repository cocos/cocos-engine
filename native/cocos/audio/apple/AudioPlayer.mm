/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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
#include "AudioPlayer.h"
#import <AVFoundation/AVAudioTime.h>

namespace cc {
// The life cycle of AudioCache does not controlled by AudioPlayer. Some part of implementation of AudioPlayer can be unified
AudioPlayer::AudioPlayer(){
    _descriptor.node = [[AVAudioPlayerNode alloc] init];
}
AudioPlayer::AudioPlayer(AudioCache* cache){
    _cache = cache;
    _cache->useCount++;
    _descriptor.node = [[AVAudioPlayerNode alloc] init];
}
AudioPlayer::~AudioPlayer(){
    unload();
}
bool AudioPlayer::load(AudioCache* cache){
    _cache = cache;
    return true;
}
bool AudioPlayer::unload() {
    _cache->useCount--;
    _cache = nullptr;
    [_descriptor.node release];
    return true;
}
bool AudioPlayer::play() {
    // Play with self define properties. Immediately
    _descriptor.curFrame = (int64_t)(_currentTime * _cache->getPCMHeader().sampleRate);
    // if bigger than max buffer length, need to read buffer and schedule
    if(_cache->getPCMHeader().totalFrames > MAX_BUFFER_LENGTH) {
        _descriptor.bufferToPlay = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_cache->getDescriptor().audioFile.processingFormat frameCapacity:MAX_BUFFER_LENGTH];
        _cache->loadToBuffer(_descriptor.curFrame, _descriptor.bufferToPlay);
        
        [_descriptor.node scheduleBuffer:_descriptor.bufferToPlay atTime:nil options: AVAudioPlayerNodeBufferLoops completionCallbackType:AVAudioPlayerNodeCompletionDataConsumed completionHandler:^(AVAudioPlayerNodeCompletionCallbackType callbackType) {
            if(_descriptor.curFrame < _cache->getPCMHeader().totalFrames) {
                // Not all played.
                _cache->loadToBuffer(_descriptor.curFrame, _descriptor.bufferToPlay);
            } else if (_descriptor.curFrame == _cache->getPCMHeader().totalFrames && _isLoop) {
                // reload buffer from beginning and replay again, because it's a loop audio
                _descriptor.curFrame = 0; //reset to 0
                _cache->loadToBuffer(_descriptor.curFrame, _descriptor.bufferToPlay);
            }
        }];
    } else {
//        _cache->load();
        if(_isLoop) {
            [_descriptor.node scheduleBuffer:_cache->getDescriptor().buffer atTime:nil options:AVAudioPlayerNodeBufferLoops completionCallbackType:AVAudioPlayerNodeCompletionDataConsumed completionHandler:nil];
        } else {
            [_descriptor.node scheduleBuffer:_cache->getDescriptor().buffer completionHandler: nil];
        }
    }
        //TODO: Why the fucking audioFile.length is int64? when should we have -1?
    
    _descriptor.node.volume = _volume;
    [_descriptor.node play];
    
    
}
bool AudioPlayer::pause() {
    [_descriptor.node pause];
    state = State::PAUSED;
}
bool AudioPlayer::resume(){
//    [_descriptor.node resume];
    state = State::PLAYING;
}
bool AudioPlayer::stop() {
    [_descriptor.node stop];
    state = State::STOPPED;
}
float AudioPlayer::getDuration() {
    return (float)_cache->getDescriptor().audioFile.length / (float)_cache->getPCMHeader().sampleRate;
}

bool AudioPlayer::isLoop() {
    return _isLoop;
}
bool AudioPlayer::setLoop(bool isLoop) {
    if (_isLoop != isLoop) {
        //TODO: reschedule loop options if not equal
        return false;
    }
    _isLoop = isLoop;
    return true;
}

bool AudioPlayer::setVolume(float volume) {
    _volume = volume;
    if(state == State::PLAYING) {
        [_descriptor.node setVolume:volume];
    }
    return true;
    
}
float AudioPlayer::getVolume() {
    return _volume;
}
bool AudioPlayer::setCurrentTime(float curTime) {
    _currentTime = curTime;
    //TODO: node set currentTime
    play();
}
float AudioPlayer::getCurrentTime() {
    if(state == State::PLAYING) {
        return (float)_descriptor.node.lastRenderTime.sampleTime/(float)_cache->getPCMHeader().sampleRate;
        
    }
    return _currentTime;
}
AudioPlayerDescriptor AudioPlayer::getDescriptor()
{
    return _descriptor;
}


} // namespace cc

