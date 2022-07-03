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
#import <AVFoundation/AVAudioBuffer.h>
#import <AVFoundation/AVAudioFile.h>
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
    if (_isStreaming) {
                if (_rotateBufferThread != nullptr) {
                    while (!_isRotateThreadExited) {
                        _sleepCondition.notify_one();
                        std::this_thread::sleep_for(std::chrono::milliseconds(5));
                    }

                    if (_rotateBufferThread->joinable()) {
                        _rotateBufferThread->join();
                    }

                    delete _rotateBufferThread;
                    _rotateBufferThread = nullptr;
                    NSLog(@"rotateBufferThread exited!");

    #if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
                    // some specific OpenAL implement defects existed on iOS platform
                    // refer to: https://github.com/cocos2d/cocos2d-x/issues/18597
                    ALint sourceState;
                    ALint bufferProcessed = 0;
                    alGetSourcei(_alSource, AL_SOURCE_STATE, &sourceState);
                    if (sourceState == AL_PLAYING) {
                        alGetSourcei(_alSource, AL_BUFFERS_PROCESSED, &bufferProcessed);
                        while (bufferProcessed < QUEUEBUFFER_NUM) {
                            std::this_thread::sleep_for(std::chrono::milliseconds(2));
                            alGetSourcei(_alSource, AL_BUFFERS_PROCESSED, &bufferProcessed);
                        }
                        alSourceUnqueueBuffers(_alSource, QUEUEBUFFER_NUM, _bufferIds); CHECK_AL_ERROR_DEBUG();
                    }
                    ALOGVV("UnqueueBuffers Before alSourceStop");
    #endif
                }
    }
    unload();
}
bool AudioPlayer::load(AudioCache* cache){
    _cache = cache;
    _isStreaming = _cache->isStreaming();
    return true;
}
bool AudioPlayer::unload() {
    _cache->useCount--;
    _cache = nullptr;
    [_descriptor.node release];
    return true;
}
//A method to update buffer if it's a streaming buffer
void AudioPlayer::rotateBuffer() {
    // The buffer loop
    AVAudioPCMBuffer* tmpBuffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_cache->getDescriptor().audioFile.processingFormat frameCapacity:_cache->getPCMHeader().totalFrames];
    _cache->loadToBuffer(_descriptor.curFrame, tmpBuffer, _cache->getPCMHeader().totalFrames);
    if (_isLoop) {
        [_descriptor.node scheduleBuffer:tmpBuffer atTime:nil options:AVAudioPlayerNodeBufferLoops completionHandler:nil];
    } else {
        [_descriptor.node scheduleBuffer:tmpBuffer completionHandler:nil];
    }
    [tmpBuffer release];
}
bool AudioPlayer::play() {
    // Play with self define properties. Immediately
    _descriptor.curFrame = (int64_t)(_currentTime * _cache->getPCMHeader().sampleRate);
    // if bigger than max buffer length, need to read buffer and schedule
    if (_isStreaming) {
        // Create a new thread by runnning rotate buffer, it should handle the loop once the whole buffer is loaded.
        _rotateBufferThread = new std::thread(&AudioPlayer::rotateBuffer, this);
        _descriptor.bufferToPlay = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_cache->getDescriptor().audioFile.processingFormat frameCapacity:MAX_BUFFER_LENGTH];
        _cache->loadToBuffer(_descriptor.curFrame, _descriptor.bufferToPlay, MAX_BUFFER_LENGTH);
        [_descriptor.node scheduleBuffer:_descriptor.bufferToPlay completionHandler:nil];
    } else {
        if (_isLoop) {
            [_descriptor.node scheduleBuffer:_cache->getDescriptor().buffer atTime:nil options:AVAudioPlayerNodeBufferLoops completionCallbackType:AVAudioPlayerNodeCompletionDataConsumed completionHandler:nil];
        } else {
            [_descriptor.node scheduleBuffer:_cache->getDescriptor().buffer completionHandler: nil];
        }
    }
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

