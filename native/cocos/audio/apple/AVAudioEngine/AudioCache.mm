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
#include "AudioCache.h"
#include "base/std/container/vector.h"
#include "application/ApplicationManager.h"
#import <AVFoundation/AVAudioFile.h>
#import <AVFoundation/AVAudioBuffer.h>
//static AVAudioFormat* common_audioformat = [[AVAudioFormat alloc]
//                                            initWithCommonFormat:AVAudioPCMFormatInt16
//                                            sampleRate:(double)44100
//                                            channels:2
//                                            interleaved:true];
AudioDataFormat formatConverter(AVAudioCommonFormat originalAppleFormat){
    switch (originalAppleFormat) {
        case AVAudioPCMFormatInt16:
            return AudioDataFormat::SIGNED_16;
        case AVAudioPCMFormatInt32:
            return AudioDataFormat::SIGNED_32;
        case AVAudioPCMFormatFloat32:
            return AudioDataFormat::FLOAT_32;
        case AVAudioPCMFormatFloat64:
            return AudioDataFormat::FLOAT_64;
        default:
            return AudioDataFormat::UNKNOWN;
    }
}
// return byte length of format correspond.
uint32_t formatConvertToLength(AVAudioCommonFormat originalAppleFormat){
    switch (originalAppleFormat) {
        case AVAudioPCMFormatInt16:
            return 2;
        case AVAudioPCMFormatInt32:
        case AVAudioPCMFormatFloat32:
            return 4;
        case AVAudioPCMFormatFloat64:
            return 8;
        default:
            return 0;
    }
}
namespace cc {

AudioCache::AudioCache(std::string &fileFullPath) {
    _descriptor = {nil, nil};
    NSString * path = [[NSString alloc] initWithUTF8String:fileFullPath.c_str()];
    NSURL * url = [[NSURL alloc] initWithString:path];
    NSError * err;
    _descriptor.audioFile = [[AVAudioFile alloc] initForReading:url error:&err];
    if (_descriptor.audioFile == nil) {
        NSLog(@"AVAudioFile Error: ", [err localizedDescription]);
        [err release];
        assert([err retainCount] == 0);
    }
    [url release];
    [path release];
    loadState = State::READY;
    _pcmHeader = {
        static_cast<uint32_t>(_descriptor.audioFile.length),
        _descriptor.audioFile.processingFormat.channelCount * formatConvertToLength( _descriptor.audioFile.processingFormat.commonFormat),
        static_cast<uint32_t>(_descriptor.audioFile.processingFormat.sampleRate),
        _descriptor.audioFile.processingFormat.channelCount,
        formatConverter( _descriptor.audioFile.processingFormat.commonFormat)
    };
    _fileFullPath = fileFullPath;
    // When audio length is bigger than MAX_BUFFER_LENGTH, should make it as a streaming audio.
    if (_pcmHeader.totalFrames * _pcmHeader.bytesPerFrame > MAX_BUFFER_LENGTH) {
        _isStreaming = true;
    }
}
AudioCache::~AudioCache(){
    unload();
    [_descriptor.audioFile release];
    
}


bool AudioCache::load() {
    bool ret{true};
    _readDataMutex.lock();
    AVAudioFrameCount frameCount;
    if (_isStreaming) {
        frameCount = MAX_BUFFER_LENGTH / _pcmHeader.bytesPerFrame;
    } else {
        frameCount = _descriptor.audioFile.length;
    }
    NSError* err = nil;
    // Unify audio decode format with the same samplerate and interleaved.

    _descriptor.buffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_descriptor.audioFile.processingFormat frameCapacity:frameCount];
    [_descriptor.audioFile readIntoBuffer:_descriptor.buffer frameCount:frameCount error:&err];
    _descriptor.audioFile.framePosition = 0;
    NSLog(@"audioFile read into buffer with load function");
    if (err) {
        NSLog(@"%@AVAudioFile read failed:", [err localizedDescription]);
        [err release];
        ret = false;
        assert(ret);
    }
    loadState = State::LOADED;
    invokingLoadCallbacks();
    invokingPlayCallbacks();
    _readDataMutex.unlock();
    return ret;
}
bool AudioCache::unload() {
    bool ret{true};
    _readDataMutex.lock();
    if (loadState == State::LOADED) {
        [_descriptor.buffer release];
    }
    loadState = State::UNLOADED;
    _readDataMutex.unlock();
    return ret;
}
bool AudioCache::resample(PCMHeader header) {
    // TODO: resample
}
bool AudioCache::loadToBuffer(int64_t &startFramePosition, AVAudioPCMBuffer *buffer, uint32_t frameCount) {
    _readDataMutex.lock();
    NSError* err = nil;
    _descriptor.audioFile.framePosition = startFramePosition;
    [_descriptor.audioFile readIntoBuffer:buffer frameCount:frameCount error:&err];
    _descriptor.audioFile.framePosition = 0;//seek to 0
    _readDataMutex.unlock();
    NSLog(@"[AUDIOCACHE] Load audio to buffer");
    if (err) {
        NSLog(@"[AUDIOCACHE] AVAudioFile read failed: %s", [err localizedDescription]);
        [err release];
        return false;
    }
    return true;
}

// TODO: If is streaming audio, return partial data? or whole data.
ccstd::vector<uint8_t> AudioCache::getPCMBuffer(uint32_t channelID){
    ccstd::vector<uint8_t> ret;
    do {
        if (loadState != State::LOADED) {
            NSLog(@"[AUDIOCACHE] AudioCache is not ready");
            break;
        }
        if (channelID > _pcmHeader.channelCount) {
            NSLog(@"[AUDIOCACHE] ChannelID is bigger than channel count");
            break;
        }
        
        AVAudioPCMBuffer* tmpBuffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_descriptor.audioFile.processingFormat frameCapacity:_descriptor.audioFile.length];
        // Read entire buffer into _descriptor buffer.
        const uint32_t frameCount = _pcmHeader.totalFrames;
        AVAudioFramePosition startPos = 0;
        loadToBuffer(startPos, tmpBuffer, frameCount);
        NSLog(@"[AUDIOCACHE] Get PCM buffer");
        ret.resize(_pcmHeader.bytesPerFrame * _pcmHeader.totalFrames / _pcmHeader.channelCount);
        uint8_t *buffer = ret.data();
        auto stride = tmpBuffer.stride;
        switch (_pcmHeader.dataFormat) {
            // TODO: if float 32 and float 63 both convert to float 32 by default?
            case AudioDataFormat::FLOAT_32: {
                auto datas = tmpBuffer.floatChannelData;
                for (int itr = 0; itr < _pcmHeader.totalFrames; itr ++) {
                    // Explaination of usage https://developer.apple.com/forums/thread/65772
                    std::memcpy(buffer, &datas[channelID][itr * stride], 4);
                    //printf("buffer copied from datas is %f", *reinterpret_cast<float*>(buffer));
                    buffer += 4;
                }
                break;
            }
            case AudioDataFormat::SIGNED_16: {
                auto datas = tmpBuffer.int16ChannelData;
                for (int itr = 0; itr < _pcmHeader.totalFrames; itr++) {
                    std::memcpy(buffer, &datas[channelID][itr * stride], 2);
                    buffer += 2;
                }
                break;
            }
            case AudioDataFormat::SIGNED_32: {
                auto datas = tmpBuffer.int32ChannelData;
                for (int itr = 0; itr < _pcmHeader.totalFrames; itr++) {
                    std::memcpy(buffer, &datas[channelID][itr * stride], 4);
                    buffer += 4;
                }
                break;
            }
        };
        [tmpBuffer release];
        
    } while(false);

    
    
    
    return ret;
}

PCMHeader AudioCache::getPCMHeader() {
    return _pcmHeader;
}
void AudioCache::addLoadCallback(const LoadCallback &callback) {
    switch (loadState) {
            case State::READY:
                _loadCallbacks.push_back(callback);
                break;
            case State::LOADED:
                callback(true);
                break;
            case State::FAILED:
                callback(false);
                break;
            default:
                printf("Invalid state: %d", loadState);
                break;
        }
}

void AudioCache::addPlayCallback(const std::function<void()> &callback) {
    std::lock_guard<std::mutex> lk(_playCallbackMutex);
    switch (loadState) {
        case State::READY:
            _playCallbacks.push_back(callback);
            break;
        case State::LOADED:
        // If state is failure, we still need to invoke the callback
        // since the callback will set the 'AudioPlayer::_removeByAudioEngine' flag to true.
        case State::FAILED:
            callback();
            break;

        default:
            printf("Invalid state: %d", loadState);
            break;
    }
}
void AudioCache::invokingPlayCallbacks() {
    std::lock_guard<std::mutex> lk(_playCallbackMutex);

    for (auto &&cb : _playCallbacks) {
        cb();
    }

    _playCallbacks.clear();
}
void AudioCache::invokingLoadCallbacks() {
    auto scheduler = CC_CURRENT_ENGINE()->getScheduler();
    scheduler->performFunctionInCocosThread([&]() {

        for (auto &&cb : _loadCallbacks) {
            cb(loadState == State::LOADED);
        }
        _loadCallbacks.clear();
    });
}
}
