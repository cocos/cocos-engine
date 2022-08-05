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
#import <AVFoundation/AVAudioBuffer.h>
#import <AVFoundation/AVAudioFile.h>
#include <system_error>
#include "application/ApplicationManager.h"
#include "audio/include/AudioDef.h"
#include "base/std/container/vector.h"
#include "platform/FileUtils.h"
#include "cocos/profiler/Profiler.h"
namespace {
AudioDataFormat formatConverter(AVAudioCommonFormat originalAppleFormat) {
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
uint32_t formatConvertToLength(AVAudioCommonFormat originalAppleFormat) {
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
} // namespace
namespace cc {

AudioCache::AudioCache(const ccstd::string &filePath) {
    auto fileFullPath = FileUtils::getInstance()->fullPathForFilename(filePath);
    _descriptor = {nil, nil};
    NSString *path = [[NSString alloc] initWithUTF8String:fileFullPath.c_str()];
    NSURL *url = [[NSURL alloc] initWithString:path];
    NSError *err;
    _descriptor.audioFile = [[AVAudioFile alloc] initForReading:url error:&err];
    NSERROR_CHECK(AVAUDIOFILE_INIT_FAIlED, err);
    [url release];
    [path release];
    loadState = State::READY;
    _pcmHeader = {
        static_cast<uint32_t>(_descriptor.audioFile.length),
        _descriptor.audioFile.processingFormat.channelCount * formatConvertToLength(_descriptor.audioFile.processingFormat.commonFormat),
        static_cast<uint32_t>(_descriptor.audioFile.processingFormat.sampleRate),
        _descriptor.audioFile.processingFormat.channelCount,
        formatConverter(_descriptor.audioFile.processingFormat.commonFormat)};
    _fileFullPath = fileFullPath;
    // When audio length is bigger than MAX_BUFFER_LENGTH, should make it as a streaming audio.
    if (_pcmHeader.totalFrames > MAX_FRAMES_LENGTH) {
        _isStreaming = true;
    }
}
AudioCache::~AudioCache() {
    unload();
    AUDIO_RELEASE(_descriptor.audioFile);
}

bool AudioCache::load() {
    bool ret{true};
    do {
        if (_isStreaming) {
            // Streaming audio will not be load to save time and memory
            loadState = State::LOADED;
            break;
        }
        _readDataMutex.lock();
        AVAudioFrameCount frameCount = _descriptor.audioFile.length;
        NSError *err = nil;
        _descriptor.buffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_descriptor.audioFile.processingFormat
                                                           frameCapacity:frameCount];
        [_descriptor.audioFile readIntoBuffer:_descriptor.buffer
                                   frameCount:frameCount
                                        error:&err];
        if (!err) {
            loadState = State::LOADED;
        } else {
            NSERROR_CHECK(READ_INTO_BUFFER_FAILED, err);
            ret = false;
        }
        _readDataMutex.unlock();
        // Reset for next time read.
        _descriptor.audioFile.framePosition = 0;
        
    } while (false);
    if (ret) {
        invokingLoadCallbacks();
        invokingPlayCallbacks();
    }
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
bool AudioCache::resample(PCMHeader  /*header*/) {
    // TODO(timlyeee): resample
    return true;
}
bool AudioCache::loadToBuffer(int64_t &startFramePosition, AVAudioPCMBuffer *buffer, uint32_t frameCount) {
    _readDataMutex.lock();
    NSError *err = nil;
    _descriptor.audioFile.framePosition = startFramePosition;
    [_descriptor.audioFile readIntoBuffer:buffer
                               frameCount:frameCount
                                    error:&err];
    _descriptor.audioFile.framePosition = 0; // seek to 0
    _readDataMutex.unlock();
    NSERROR_CHECK(READ_INTO_BUFFER_FAILED, err);
    return true;
}

ccstd::vector<uint8_t> AudioCache::getPCMBuffer(uint32_t channelID) {
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
        AVAudioPCMBuffer *tmpBuffer;
        if (!_isStreaming) {
            // if is not streaming audio, it will be fully loaded once inited.
            tmpBuffer = _descriptor.buffer;
        } else {
            tmpBuffer = [[AVAudioPCMBuffer alloc] initWithPCMFormat:_descriptor.audioFile.processingFormat
                                                                        frameCapacity:_descriptor.audioFile.length];
            // Read entire buffer into _descriptor buffer.
            const uint32_t frameCount = _pcmHeader.totalFrames;
            AVAudioFramePosition startPos = 0;
            loadToBuffer(startPos, tmpBuffer, frameCount);
        }
        NSLog(@"[AUDIOCACHE] Get PCM buffer");
        ret.resize(_pcmHeader.bytesPerFrame * _pcmHeader.totalFrames / _pcmHeader.channelCount);
        uint8_t *buffer = ret.data();
        auto stride = tmpBuffer.stride;
        switch (_pcmHeader.dataFormat) {
            case AudioDataFormat::FLOAT_32: {
                const auto *datas = tmpBuffer.floatChannelData;
                for (int itr = 0; itr < _pcmHeader.totalFrames; itr++) {
                    // Explaination of usage https://developer.apple.com/forums/thread/65772
                    std::memcpy(buffer, &datas[channelID][itr * stride], 4);
                    // printf("buffer copied from datas is %f", *reinterpret_cast<float*>(buffer));
                    buffer += 4;
                }
                break;
            }
            case AudioDataFormat::SIGNED_16: {
                const auto *datas = tmpBuffer.int16ChannelData;
                for (int itr = 0; itr < _pcmHeader.totalFrames; itr++) {
                    std::memcpy(buffer, &datas[channelID][itr * stride], 2);
                    buffer += 2;
                }
                break;
            }
            case AudioDataFormat::SIGNED_32: {
                const auto *datas = tmpBuffer.int32ChannelData;
                for (int itr = 0; itr < _pcmHeader.totalFrames; itr++) {
                    std::memcpy(buffer, &datas[channelID][itr * stride], 4);
                    buffer += 4;
                }
                break;
            }
            case AudioDataFormat::UNKNOWN:
            case AudioDataFormat::SIGNED_8:
            case AudioDataFormat::UNSIGNED_8:
            case AudioDataFormat::UNSIGNED_16:
            case AudioDataFormat::UNSIGNED_32:
            case AudioDataFormat::FLOAT_64: break;
        };
        [tmpBuffer release];

    } while (false);

    return ret;
}

PCMHeader AudioCache::getPCMHeader() {
    return _pcmHeader;
}
void AudioCache::addLoadCallback(const LoadCallback &callback) {
    CC_PROFILE(ADD_LOADCALLBACK);
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
    CC_PROFILE(ADD_PlAYCALLBACK);
    std::lock_guard<std::mutex> lck(_playCallbackMutex);
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
    std::lock_guard<std::mutex> lck(_playCallbackMutex);

    for (auto &&callback : _playCallbacks) {
        callback();
    }

    _playCallbacks.clear();
}
void AudioCache::invokingLoadCallbacks() {
    auto scheduler = CC_CURRENT_ENGINE()->getScheduler();
    scheduler->performFunctionInCocosThread([&]() {
        for (auto &&callback : _loadCallbacks) {
            callback(loadState == State::LOADED);
        }
        _loadCallbacks.clear();
    });
}
} // namespace cc
