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
#include <condition_variable>
#include <queue>
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
    __block auto wake = [this](){
        std::lock_guard<std::mutex> lck(_rotateBufferMutex);
        _rotateBarrier.notify_all();
    };
    
    
    // Shared value with AVAudioNode.
    __block uint32_t bufferQCount{0};
    uint32_t* bufferQCount_ptr = &bufferQCount;
    // Calculate current frame to start load AVAudioPCMBuffer
    AVAudioFramePosition nextFrameToRead = _startTime * _cache->getPCMHeader().sampleRate;
    // Startframe might be invalid, as _startTime is smaller than duration but startFrame is bigger than totalframe.
    if ( nextFrameToRead > _cache->getPCMHeader().totalFrames ) {
        nextFrameToRead = _cache->getPCMHeader().totalFrames - 1;
    }
    __block bool isAllRendered = false;
    __block bool isTailBuffer = false;
    AVAudioFrameCount sizeToRead;
    AVAudioFrameCount sizeLeft;
    std::queue<AVAudioPCMBuffer*> bufferQ;
    
    
    while (!_shouldRotateThreadExited) {
        // Dump out buffer rendered.
        while (bufferQ.size() > bufferQCount) {
            auto buf = bufferQ.front();
            bufferQ.pop();
            assert([buf retainCount] == 1);
            [buf release];
        }
        
        // Load buffers
        while (bufferQ.size() < MAX_QUEUE_NUM) {
            CC_LOG_DEBUG("nextFrameToRead is %d", nextFrameToRead);
            sizeLeft = (uint32_t)_cache->getPCMHeader().totalFrames - (uint32_t)nextFrameToRead;
            if (sizeLeft > MAX_FRAMES_LENGTH) {
                sizeToRead = MAX_FRAMES_LENGTH;
            } else {
                sizeToRead = sizeLeft;
            }
            
            // Read buffer, push to Q
            AVAudioPCMBuffer* tmpBuffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_cache->getDescriptor().audioFile.processingFormat frameCapacity:sizeToRead];
            _cache->loadToBuffer(nextFrameToRead, tmpBuffer, sizeToRead);
            bufferQ.push(tmpBuffer);
            bufferQCount++;
            nextFrameToRead += sizeToRead;
            
            // Schedule buffers
            if (sizeToRead == sizeLeft) {
                // Is final cut
                [_descriptor.node scheduleBuffer:tmpBuffer completionCallbackType:AVAudioPlayerNodeCompletionDataPlayedBack completionHandler:^(AVAudioPlayerNodeCompletionCallbackType type){
                    // When it's the end of the frames, stop modify the bufferQCount and try to stop the audio.
                    isAllRendered = true;
                    wake();
                }];
                nextFrameToRead = 0;
            } else {
                [_descriptor.node scheduleBuffer:tmpBuffer completionCallbackType:AVAudioPlayerNodeCompletionDataPlayedBack completionHandler:^(AVAudioPlayerNodeCompletionCallbackType type){
                    bufferQCount--;
                    wake();
                }];
            }
        }
        
        if (!_descriptor.node.isPlaying) {
            [_descriptor.node play];
        }
        
        // Sleep in a code block, check if the thread needs to exit or a new buffer need to be loaded.
        {
            std::unique_lock<std::mutex> lck(_rotateBufferMutex);
            while (!_shouldRotateThreadExited && (bufferQCount == MAX_QUEUE_NUM)) {
                NSLog(@"sleep, _shouldRotateThreadExited = %d, bufferQCount = %d", _shouldRotateThreadExited, bufferQCount);
                _rotateBarrier.wait(lck);
            }
                
        }
            
        
        if (isAllRendered || _shouldRotateThreadExited) {
            [_descriptor.node stop];
            _loopSettingMutex.lock();
            if (_isLoop) {
                isAllRendered = false;
                // reset start render time to calculate current time directly from last render time of player node
                _startTime = 0;
                nextFrameToRead = 0;
                isTailBuffer = false;
                bufferQCount = 0;
                // replay the node to easy get current time
            } else {
                _shouldRotateThreadExited = true;
                NSLog(@"is rendered, state to stopped");
                if (isAllRendered)
                    _state = State::FINISHED;
                _startTime = 0;
                while (bufferQ.size() > 0) {
                    auto buf = bufferQ.front();
                    bufferQ.pop();
                    assert([buf retainCount] == 1);
                    [buf release];
                }
            }
            
            _loopSettingMutex.unlock();
        }
    }
    
    // Release buffers at the end of thread
    // When trying to read 0 buffer, load to buffer will failed. then there would be release nothing.

    NSLog(@"Rotate buffer thread exit");
}

bool AudioPlayer::play() {
    if (_isStreaming) {
        _descriptor.node.volume = _volume;
        if (_rotateBufferThread != nullptr) {
            {
                std::lock_guard<std::mutex> lck(_rotateBufferMutex);
                _shouldRotateThreadExited = true;
            }
            CC_LOG_DEBUG("locking");
            _rotateBarrier.notify_all();
            if (_rotateBufferThread->joinable()) {
                _rotateBufferThread->join();
            }
            CC_LOG_DEBUG("player state %d", _state);
            delete _rotateBufferThread;
            _rotateBufferThread = nullptr;
            NSLog(@"rotateBufferThread exited!");
        }
        _shouldRotateThreadExited = false;
        _rotateBufferThread = new std::thread(&AudioPlayer::rotateBuffer, this);
    } else {
        // Calculate current frame to start load AVAudioPCMBuffer
        AVAudioFramePosition currentFrame = _startTime * _cache->getPCMHeader().sampleRate;
        // Calculate the number of frames to load
        AVAudioFrameCount sizeOfFrameToLoad = (uint32_t)_cache->getPCMHeader().totalFrames - (uint32_t)currentFrame;
        
        //_cache->loadToBuffer(currentFrame, tmpBuffer, sizeOfFrameToLoad);
        //__block AudioPlayer* thiz = this;
        [_descriptor.node scheduleBuffer:_cache->getDescriptor().buffer  completionCallbackType:AVAudioPlayerNodeCompletionDataPlayedBack completionHandler:^(AVAudioPlayerNodeCompletionCallbackType callbackType) {
        }];
        if (_isLoop) {
            [_descriptor.node scheduleBuffer:_cache->getDescriptor().buffer atTime:nil options:AVAudioPlayerNodeBufferLoops completionHandler:nil];
        }
        _descriptor.node.volume = _volume;
        [_descriptor.node play];
    }
    _state = State::PLAYING;
    
}
bool AudioPlayer::pause() {
    //update current time
    _pausingTime = getCurrentTime();
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
            {
                std::lock_guard<std::mutex> lck(_rotateBufferMutex);
                _shouldRotateThreadExited = true;
            }
            CC_LOG_DEBUG("locking");
            _rotateBarrier.notify_all();
            CC_LOG_DEBUG("wake up the sub thread");
            if (_rotateBufferThread->joinable()) {
                _rotateBufferThread->join();
            }
            delete _rotateBufferThread;
            _rotateBufferThread = nullptr;
            NSLog(@"rotateBufferThread exited!");
        }
        _shouldRotateThreadExited = false;
    } else {
        [_descriptor.node stop];
    }
    showPlayerNodeCurrentStatus(_descriptor.node, _cache->getDescriptor().audioFile);
    _state = State::INTERRUPTED;
}
float AudioPlayer::getDuration() const {
    return (float)_cache->getDescriptor().audioFile.length / (float)_cache->getPCMHeader().sampleRate;
}


bool AudioPlayer::isLoop() const {
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
float AudioPlayer::getVolume() const {
    return _volume;
}
bool AudioPlayer::setCurrentTime(float targetTime) {
    if (_state == State::PLAYING|| _state == State::PAUSED) {
        NSLog(@"Setting currentTime while old is %f, and new one is %f and _currentTime is %f", _startTime, targetTime, getCurrentTime());
        _startTime = targetTime;
        stop();
        play();
    }
}
float AudioPlayer::getCurrentTime() const {
    float currentTime;
    if(_state == State::PLAYING) {
        //showPlayerNodeCurrentStatus(_descriptor.node, _cache->getDescriptor().audioFile);
        currentTime = (float)[_descriptor.node playerTimeForNodeTime:_descriptor.node.lastRenderTime].sampleTime / (float)_cache->getPCMHeader().sampleRate;
    } else if (_state == State::PAUSED) {
        return _pausingTime;
    }
    // update current time
    NSLog(@"return %f", _startTime+currentTime);
    return _startTime + currentTime;
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

