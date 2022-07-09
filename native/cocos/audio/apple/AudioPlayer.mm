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
#include "base/Log.h"
#import <AVFoundation/AVAudioTime.h>
#import <AVFoundation/AVAudioBuffer.h>
#import <AVFoundation/AVAudioFile.h>
namespace cc {
void showPlayerNodeCurrentStatus(AVAudioPlayerNode* node, AVAudioFile* file) {
    CC_LOG_DEBUG("=== SHOW DEBUG INFO FOR AUDIO PLAYER ==");
    CC_LOG_DEBUG("Current player node is playing : %d", node.isPlaying);
    CC_LOG_DEBUG("Current player node file length is: %d", file.length);
    CC_LOG_DEBUG("Current player node sample rate is: %d", file.processingFormat.sampleRate);
    CC_LOG_DEBUG("Current player node time sample time is valid : %d", node.lastRenderTime.sampleTimeValid);
    CC_LOG_DEBUG("Current player node time sample time is: %d", node.lastRenderTime.sampleTime);
    auto playerTime = [node playerTimeForNodeTime:node.lastRenderTime];
    CC_LOG_DEBUG("Current player time sample time is %d", playerTime.sampleTime);
    CC_LOG_DEBUG("=======================================");
    //[playerTime release];
}
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
    if (_isStreaming) {
        if (_rotateBufferThread != nullptr) {
            _shouldRotateThreadExited = true;
            if (_rotateBufferThread->joinable()) {
                _rotateBufferThread->join();
            }
            delete _rotateBufferThread;
            _rotateBufferThread = nullptr;
            NSLog(@"[AUDIO PLAYER] desctruction: rotateBufferThread exited!");
        }
    }
    unload();
    [_descriptor.node release];
}
bool AudioPlayer::load(AudioCache* cache){
    _cache = cache;
    _isStreaming = _cache->isStreaming();
    return true;
}
bool AudioPlayer::unload() {
    _cache = nullptr;
    return true;
}
//A method to update buffer if it's a streaming buffer
void AudioPlayer::rotateBuffer() {
    // Calculate current frame to start load AVAudioPCMBuffer
    AVAudioFramePosition currentFrame = _startRenderTime * _cache->getPCMHeader().sampleRate;
    // Calculate the number of frames to load
    if (currentFrame > _cache->getPCMHeader().totalFrames) {
        if(!_isLoop){
            _state = State::FINISHED;
            [_descriptor.node stop];
            _startRenderTime = 0;
            return;
        } else {
            currentFrame = 0;
        }
    }
    AVAudioFrameCount sizeOfFrameToLoad = (uint32_t)_cache->getPCMHeader().totalFrames - (uint32_t)currentFrame;
    AVAudioPCMBuffer* tmpBuffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_cache->getDescriptor().audioFile.processingFormat frameCapacity:sizeOfFrameToLoad];
    __block bool shouldTmpBufferBeDeleted = false;
    __block bool isRendered = false;
    NSLog(@"[ROTATE THREAD] Start load to buffer");
    // reset _cache audio file's frame position to current frame
    _cache->loadToBuffer(currentFrame, tmpBuffer, sizeOfFrameToLoad);
    NSLog(@"[ROTATE THREAD] Read into buffer, rotate buffer");
    // play AVAudioPCMBuffer to _descriptor.node
    [_descriptor.node scheduleBuffer:tmpBuffer completionCallbackType:AVAudioPlayerNodeCompletionDataPlayedBack completionHandler:^(AVAudioPlayerNodeCompletionCallbackType type){
        isRendered = true;
    }];
    AVAudioPCMBuffer* buffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_cache->getDescriptor().audioFile.processingFormat frameCapacity:_cache->getPCMHeader().totalFrames];
        // Load all buffer to AVAudioPCMBuffer
    AVAudioFramePosition pos = 0;
    _cache->loadToBuffer(pos, buffer, _cache->getPCMHeader().totalFrames);
    NSLog(@"[AUDIO PLAYER] Read into buffer, rotate buffer, twice");
    [_descriptor.node play];
    NSLog(@"[AUDIO PLAYER] Rotate buffer play");
    while (!_shouldRotateThreadExited) {
        _loopSettingMutex.lock();
        // Create a AVAudioPCMBuffer to play
        if (_isLoop) {
            if (isRendered) {
                isRendered = false;
                // reset start render time to calculate current time directly from last render time of player node
                _startRenderTime = 0;
                // If it's looping, play the buffer again
                [_descriptor.node scheduleBuffer:buffer completionCallbackType:AVAudioPlayerNodeCompletionDataPlayedBack completionHandler:^(AVAudioPlayerNodeCompletionCallbackType type){
                    isRendered = true;
                }];
            }
        } else {
            if (isRendered) {
                _shouldRotateThreadExited = true;
                NSLog(@"is rendered, state to stopped");
                _state = State::FINISHED;
                [_descriptor.node stop];
                _startRenderTime = 0;
            }
        }
        _loopSettingMutex.unlock();
    }
    
    // Release buffers at the end of thread
    // When trying to read 0 buffer, load to buffer will failed. then there would be release nothing.
    [tmpBuffer release];
    [buffer release];
    NSLog(@"Rotate buffer thread exit");
}

bool AudioPlayer::play() {
    _state = State::PLAYING;
    if (_isStreaming) {
        _descriptor.node.volume = _volume;
        if (_rotateBufferThread != nullptr) {
            _shouldRotateThreadExited = true;
            if (_rotateBufferThread->joinable()) {
                _rotateBufferThread->join();
            }
            delete _rotateBufferThread;
            _rotateBufferThread = nullptr;
            NSLog(@"rotateBufferThread exited!");
        }
        _shouldRotateThreadExited = false;
        _rotateBufferThread = new std::thread(&AudioPlayer::rotateBuffer, this);
    } else {
        // Calculate current frame to start load AVAudioPCMBuffer
        AVAudioFramePosition currentFrame = _startRenderTime * _cache->getPCMHeader().sampleRate;
        // Calculate the number of frames to load
        AVAudioFrameCount sizeOfFrameToLoad = (uint32_t)_cache->getPCMHeader().totalFrames - (uint32_t)currentFrame;
        __block AVAudioPCMBuffer* tmpBuffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_cache->getDescriptor().audioFile.processingFormat frameCapacity:sizeOfFrameToLoad];
        _cache->loadToBuffer(currentFrame, tmpBuffer, sizeOfFrameToLoad);
        __block AudioPlayer* thiz = this;
        [_descriptor.node scheduleBuffer:tmpBuffer completionCallbackType:AVAudioPlayerNodeCompletionDataPlayedBack completionHandler:^(AVAudioPlayerNodeCompletionCallbackType callbackType) {
            [tmpBuffer release];
                // If tmpBuffer is not fully released, a memory leak occurs.
            assert(!tmpBuffer);
            [thiz->_descriptor.node stop];
        }];
        if (_isLoop) {
            [_descriptor.node scheduleBuffer:_cache->getDescriptor().buffer atTime:nil options:AVAudioPlayerNodeBufferLoops completionHandler:nil];
        }
        _descriptor.node.volume = _volume;
        [_descriptor.node play];
    }
    
}
bool AudioPlayer::pause() {
    [_descriptor.node pause];
    _state = State::PAUSED;
    showPlayerNodeCurrentStatus(_descriptor.node, _cache->getDescriptor().audioFile);
}
//
bool AudioPlayer::resume(){
    [_descriptor.node play];
    _state = State::PLAYING;
    showPlayerNodeCurrentStatus(_descriptor.node, _cache->getDescriptor().audioFile);
}
bool AudioPlayer::stop() {
    if (_isStreaming) {
        if (_rotateBufferThread != nullptr) {
            _shouldRotateThreadExited = true;
            if (_rotateBufferThread->joinable()) {
                _rotateBufferThread->join();
            }
            delete _rotateBufferThread;
            _rotateBufferThread = nullptr;
            NSLog(@"rotateBufferThread exited!");
        }
    }
    _state = State::INTERRUPTED;
    [_descriptor.node stop];
    showPlayerNodeCurrentStatus(_descriptor.node, _cache->getDescriptor().audioFile);
}
float AudioPlayer::getDuration() {
    return (float)_cache->getDescriptor().audioFile.length / (float)_cache->getPCMHeader().sampleRate;
}


bool AudioPlayer::isLoop() { 
    return _isLoop;
}
bool AudioPlayer::setLoop(bool isLoop) {
    std::lock_guard<std::mutex> loopLock(_loopSettingMutex);
    _isLoop = isLoop;
    return true;
}

bool AudioPlayer::setVolume(float volume) {
    _volume = volume;
    if (_state == State::PLAYING) {
        [_descriptor.node setVolume:volume];
    }
    return true;
    
}
float AudioPlayer::getVolume() {
    return _volume;
}
bool AudioPlayer::setCurrentTime(float curTime) {
    //TODO: node set currentTime
    if (_state == State::PLAYING) {
        _startRenderTime = curTime;
        stop();
        play();
    }
}
float AudioPlayer::getCurrentTime() {
    if(_state == State::PLAYING) {
        showPlayerNodeCurrentStatus(_descriptor.node, _cache->getDescriptor().audioFile);
        float lastRenderTime = (float)[_descriptor.node playerTimeForNodeTime:_descriptor.node.lastRenderTime].sampleTime / (float)_cache->getPCMHeader().sampleRate;
        return _startRenderTime + lastRenderTime;
    }
    // update current time
    return _startRenderTime;
}
bool AudioPlayer::isForceCache() {
    return _isForceCache;
}
void AudioPlayer::setForceCache() {
    _isForceCache = true;
}
AudioPlayerDescriptor AudioPlayer::getDescriptor()
{
    return _descriptor;
}

} // namespace cc

