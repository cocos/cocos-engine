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
#import <AVFoundation/AVAudioBuffer.h>
#import <AVFoundation/AVAudioFile.h>
#import <AVFoundation/AVAudioTime.h>
#include <condition_variable>
#include <queue>
#include "base/Log.h"
#include "cocos/profiler/Profiler.h"
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
AudioPlayer::AudioPlayer() {
    setState(State::UNLOADED);
    _descriptor.node = [[AVAudioPlayerNode alloc] init];
}
AudioPlayer::AudioPlayer(AudioCache* cache) {
    _cache = cache;
    _cache->useCount++;
    setState(State::READY);
    _descriptor.node = [[AVAudioPlayerNode alloc] init];
}
AudioPlayer::~AudioPlayer() {
    assert(_rotateBufferThread == nullptr);
    unload();
    [_descriptor.node release];
}
AudioPlayer::State AudioPlayer::getState() const {
    std::shared_lock<std::shared_mutex> lock(_stateMtx);
    return _state;
}
void AudioPlayer::setState(State state) {
    std::lock_guard<std::shared_mutex> lck(_stateMtx);
    _state = state;
}

bool AudioPlayer::load(AudioCache* cache) {
    _cache = cache;
    _isStreaming = _cache->isStreaming();
    setState(State::READY);
    _isFinished = false;
    return true;
}
AudioCache* AudioPlayer::getCache() const {
    return _cache;
}
bool AudioPlayer::unload() {
    _cache = nullptr;
    setState(State::UNLOADED);
    return true;
}
bool AudioPlayer::ready() {
    bool ret{true};
    do {
        std::lock_guard<std::shared_mutex> lck(_stateMtx);
        if (_state == STOPPED) {
            _state = READY;
            _isFinished = false; // Mean to reset player
            break;
        }
    } while (false);
    return ret;
}
// A method to update buffer if it's a streaming buffer
void AudioPlayer::rotateBuffer() {
    std::queue<AVAudioPCMBuffer*> bufferQ;
    //    std::mutex bufferQCountMtx;
    //    std::condition_variable bufferQCV;
    uint32_t bufferQCount{0};
    // Wake up thread when current frame is played.
    __block auto wake = [this, &bufferQCount]() {
        std::lock_guard<std::mutex> lck(_rotateBufferThreadMtx);
        bufferQCount--; // need to pop
        _rotateBufferThreadBarrier.notify_all();
    };
    // Wake up thread when all rendered.
    __block auto finishWake = [&]() {
        std::lock_guard<std::mutex> lck(_rotateBufferThreadMtx);
        _isFinished = true;
        NSLog(@"Finish wake");
        bufferQCount--;
        // NSLog(@"Finish wake from tail buffer with bufferQCount %d", bufferQCount);
        _rotateBufferThreadBarrier.notify_all();
    };

    // Calculate current frame to start load AVAudioPCMBuffer
    AVAudioFramePosition nextFrameToRead = static_cast<int64_t>(_startTime * (float)_cache->getPCMHeader().sampleRate);
    // Startframe might be invalid, as _startTime is smaller than duration but startFrame is bigger than totalframe.
    if (nextFrameToRead > _cache->getPCMHeader().totalFrames) {
        nextFrameToRead = _cache->getPCMHeader().totalFrames - 1;
    }
    AVAudioFrameCount sizeToRead;
    AVAudioFrameCount sizeLeft;

    // The while loop should only stop when it's in STOPPING state.
    do {
        // _shouldReschedule is only changed outside.
        if (_shouldReschedule) {
            [_descriptor.node stop];
            while (bufferQCount != 0) {
                // Wait until bufferQCount is 0;
            }
            // NSLog(@"Set bufferQCount to %d", bufferQCount);
            nextFrameToRead = static_cast<int64_t>(_startTime * (float)_cache->getPCMHeader().sampleRate);
            // Startframe might be invalid, as _startTime is smaller than duration but startFrame is bigger than totalframe.
            if (nextFrameToRead > _cache->getPCMHeader().totalFrames) {
                nextFrameToRead = _cache->getPCMHeader().totalFrames - 1;
            }
            // NSLog(@"[AUDIO PLAYER RESCHEDULE] next frame to read is %d", nextFrameToRead);
            _shouldReschedule = false;
            _isFinished = false;
        }
        // Dump out buffer rendered.
        while (bufferQ.size() > bufferQCount) {
            auto buf = bufferQ.front();
            bufferQ.pop();
            assert([buf retainCount] == 1); // detect memory leak.
            [buf release];
        }

        // Load buffers
        while (bufferQ.size() < MAX_QUEUE_NUM) {
            // NSLog(@"[AUDIO PLAYER ROTATE THREAD] nextFrameToRead is %d", nextFrameToRead);
            sizeLeft = _cache->getPCMHeader().totalFrames - (uint32_t)nextFrameToRead;
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

            // Schedule buffers, if it's the end buffer, finishWake is called.
            if (sizeToRead == sizeLeft) {
                // Is final cut
                [_descriptor.node scheduleBuffer:tmpBuffer
                          completionCallbackType:AVAudioPlayerNodeCompletionDataPlayedBack
                               completionHandler:^(AVAudioPlayerNodeCompletionCallbackType type) {
                                   // When it's the end of the frames, stop modify the bufferQCount and try to stop the audio. cannot trust it totally.
                                   finishWake();
                               }];
                nextFrameToRead = 0;
                // NSLog(@"[AUDIO PLAYER ROTATE THREAD] Is tail buffer, next frame to read is reset to 0");
            } else {
                [_descriptor.node scheduleBuffer:tmpBuffer
                          completionCallbackType:AVAudioPlayerNodeCompletionDataPlayedBack
                               completionHandler:^(AVAudioPlayerNodeCompletionCallbackType type) {
                                   wake();
                               }];
            }
        }
        if (!_descriptor.node.isPlaying) {
            [_descriptor.node play];
            NSLog(@"[AudioPlayer] GOTO Playing");
        }
        // Sleep in a code block, check if the thread needs to exit or a new buffer need to be loaded.
        // It will only sleep when no buffer to reload or reschedule.
        {
            std::unique_lock<std::mutex> lck(_rotateBufferThreadMtx);
            _rotateBufferThreadBarrier.wait(lck, [&bufferQCount, this] {
                return ((getState() == STOPPING) || (bufferQCount != MAX_QUEUE_NUM) || (_shouldReschedule) || (!_descriptor.node.isPlaying));
            });
        }

        // If it's wake up because it's finished.
        if (_isFinished) {
            [_descriptor.node stop]; // Stop is essential, to get current frame correctly
            _loopSettingMutex.lock();
            if (_isLoop) {
                _isFinished = false;
                // reset start render time to calculate current time directly from last render time of player node
                _startTime = 0;
                nextFrameToRead = 0;
                // replay the node to easy get current time
            } else {
                setState(State::STOPPING);
                // NSLog(@"is rendered, stopping thread");
            }
            _loopSettingMutex.unlock();
        }
    } while (getState() != State::STOPPING);

    // Step to release all.
    if (!_isFinished) {
        [_descriptor.node stop];
        NSLog(@"Finish reset");
        // BUG: when node is stopped, all callbacks will be triggered, which cause unacceptable result.
        _isFinished = false;
    } else {
        // In this situation, node is already stopped?
        // [_descriptor.node stop];
    }

    _startTime = 0;
    while (!bufferQ.empty()) {
        auto buf = bufferQ.front();
        bufferQ.pop();
        assert([buf retainCount] == 1);
        [buf release];
    }
    // Release buffers at the end of thread
    // When trying to read 0 buffer, load to buffer will failed. then there would be release nothing.

    // NSLog(@"Rotate buffer thread exit");
    setState(State::STOPPED);
}

bool AudioPlayer::play() {
    bool ret = true;
    do {
        {
            std::shared_lock<std::shared_mutex> lck(_stateMtx);
            if (_state != State::READY && _state != State::PLAYING && _state != State::PAUSED) {
                // NSLog(@"[State is incorrect]");
                ret = false;
                break;
            }
        }

        if (!_isStreaming) {
            // Only to play at _startTime when it's not playing and _startTime > 0
            // Calculate current frame to start load AVAudioPCMBuffer
            AVAudioFramePosition currentFrame = static_cast<int64_t>(_startTime * (float)_cache->getPCMHeader().sampleRate);
            // Calculate the number of frames to load
            AVAudioFrameCount sizeOfFrameToLoad = _cache->getPCMHeader().totalFrames - currentFrame;
            // NON ARC environment, tmpbuffer should be declared as __block so that it can be release in finishPlay procedure.
            __block AVAudioPCMBuffer* tmpBuffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_cache->getDescriptor().audioFile.processingFormat frameCapacity:sizeOfFrameToLoad];
            __block auto finishPlay = [&] {
                setState(State::STOPPED);
                _isFinished = true;
            };
            _cache->loadToBuffer(currentFrame, tmpBuffer, sizeOfFrameToLoad);
            // Set state to playing before truly play it, otherwise it's not thread safe.
            setState(State::PLAYING);
            [_descriptor.node scheduleBuffer:tmpBuffer
                                      atTime:nil
                                     options:AVAudioPlayerNodeBufferInterrupts
                      completionCallbackType:AVAudioPlayerNodeCompletionDataPlayedBack
                           completionHandler:^(AVAudioPlayerNodeCompletionCallbackType callbackType) {
                               finishPlay();
                               [tmpBuffer release];
                           }];
            // If _isLoop, loop the _cache buffer.
            if (_isLoop) {
                [_descriptor.node scheduleBuffer:_cache->getDescriptor().buffer atTime:nil options:AVAudioPlayerNodeBufferLoops completionHandler:nil];
            }
            _descriptor.node.volume = _volume;
            [_descriptor.node play];

            break;
        }
        {
            CC_PROFILE(AUDIO_PLAY_SHORT);
            _descriptor.node.volume = _volume;
            if (getState() == State::PLAYING || getState() == State::PAUSED) {
                std::lock_guard<std::mutex> lck(_rotateBufferThreadMtx);
                _rotateBufferThreadBarrier.notify_one();
            } else if (_state == State::READY) {
                // start to play
                _rotateBufferThread = new std::thread(&AudioPlayer::rotateBuffer, this);
                _rotateBufferThread->detach();
            }
            setState(State::PLAYING);
        }
    } while (false);
    return ret;
}
bool AudioPlayer::pause() {
    // update current time
    _pauseTime = (float)[_descriptor.node playerTimeForNodeTime:_descriptor.node.lastRenderTime].sampleTime / (float)_cache->getPCMHeader().sampleRate;
    [_descriptor.node pause];
    setState(State::PAUSED);
    return true;
}
bool AudioPlayer::resume() {
    return play();
}

void AudioPlayer::stop() {
    if (_isStreaming) {
        if (_rotateBufferThread != nullptr) {
            setState(State::STOPPING);
            _rotateBufferThreadBarrier.notify_all();
        }
    } else {
        [_descriptor.node stop];
        setState(State::STOPPED);
        _isFinished = false;
    }
}

void AudioPlayer::postStop() {
    if (_rotateBufferThread != nullptr) {
        delete _rotateBufferThread;
        _rotateBufferThread = nullptr;
    }
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
bool AudioPlayer::isFinished() const {
    return _isFinished;
}

bool AudioPlayer::setVolume(float volume) {
    _volume = volume;
    if (getState() == State::PLAYING) {
        [_descriptor.node setVolume:volume];
    }
    return true;
}
float AudioPlayer::getVolume() const {
    return _volume;
}

// Thread safe done
bool AudioPlayer::setCurrentTime(float targetTime) {
    bool ret = true;
    _shouldReschedule = true;
    _startTime = targetTime;
    if (getState() == State::PLAYING) {
        // NSLog(@"State is playing, call play");
        ret = play();
    }
    return ret;
}
float AudioPlayer::getCurrentTime() const {
    float currentTime{0.F};
    std::shared_lock<std::shared_mutex> lck(_stateMtx);
    if (_state == State::PLAYING) {
        // showPlayerNodeCurrentStatus(_descriptor.node, _cache->getDescriptor().audioFile);
        currentTime = (float)[_descriptor.node playerTimeForNodeTime:_descriptor.node.lastRenderTime].sampleTime / (float)_cache->getPCMHeader().sampleRate;
    } else if (_state == State::PAUSED) {
        currentTime = _pauseTime;
    }
    // update current time
    // NSLog(@"return %f", _startTime + currentTime);
    return _startTime + currentTime;
}

AudioPlayerDescriptor AudioPlayer::getDescriptor() const {
    return _descriptor;
}

} // namespace cc
