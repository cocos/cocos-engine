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
#include "audio/apple/AudioCache.h"
#include "audio/apple/AudioDecoder.h"
#import <AVFoundation/AVAudioFile.h>
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

AudioCache::AudioCache(ccstd::string &fileFullPath) {
    _descriptor = {nil, nil};
    NSString * path = [[NSString alloc] initWithUTF8String:fileFullPath.c_str()];
    NSURL * url = [[NSURL alloc] initWithString:path];
    NSError * err;
    _descriptor.audioFile = [[AVAudioFile alloc] initForReading:url error:&err];
    if (_descriptor.audioFile == nil) {
        NSLog(@"%AVAudioFile Error: ", [err localizedDescription]);
        [err release];
        assert([err retainCount] == 0);
    }
    [url release];
    [path release];
    loadState = State::READY;
    _pcmHeader = {
        _descriptor.audioFile.length,
        _descriptor.audioFile.fileFormat.channelCount * formatConvertToLength( _descriptor.audioFile.fileFormat.commonFormat),
        _descriptor.audioFile.fileFormat.sampleRate,
        _descriptor.audioFile.fileFormat.channelCount,
        formatConverter( _descriptor.audioFile.fileFormat.commonFormat)
    };
    // When audio length is bigger than MAX_BUFFER_LENGTH, should make it as a streaming audio.
    if (_pcmHeader.totalFrames * _pcmHeader.bytesPerFrame > MAX_BUFFER_LENGTH) {
        _isStreaming = true;
    }
}
AudioCache::~AudioCache(){
    unload(nullptr);
    [_descriptor.audioFile release];
    
}


bool AudioCache::load(LoadCallback &cb) {
    bool ret{true};
    _readDataMutex.try_lock();
    if (_isStreaming) {
        AVAudioFrameCount frameCount = MAX_BUFFER_LENGTH / _pcmHeader.bytesPerFrame;
    } else {
        AVAudioFrameCount frameCount = _descriptor.audioFile.length;
    }
    NSError* err = nil;
    // TODO: should buffer be initilized?
    [_file readIntoBuffer:_descriptor.buffer frameCount:frameCount error:&err];
    if (err) {
        NSLog(@"%@AVAudioFile read failed:", [err localizedDescription]);
        [err release];
        ret = false;
    }
    _readDataMutex.unlock();
    return ret;
}
bool AudioCache::unload(LoadCallback &cb) {
    bool ret{true};
    _readDataMutex.try_lock();
    if (loadState == State::LOADED) {
        [_descriptor.buffer release];
    }
    _readDataMutex.unlock();
    return ret;
}
bool AudioCache::resample(PCMHeader header) {
    /**
     fake code:
     AVAudioFormat fromFormat, toFormat.
     AVAudioConverter init
     _descriptor = ....
     */
}

ccstd::vector<char> AudioCache::getPCMBuffer() {
    ccstd::vector<char> ret;
    if (loadState != State::LOADED) {
        return ret;
    }
    if (channelID > _pcmHeader.channelCount) {
        NSLog(@"ChannelID is bigger than channel count");
    }
    const uint32_t frameCount = _descriptor.buffer.frameLength;
    ret.resize(_pcmHeader.bytesPerFrame * _pcmHeader.totalFrames / _pcmHeader.channelCount);
    char *buffer = ret.data();
    void *dataInDescriptor;
    uint32_t bitLength = _pcmHeader.bytesPerFrame / _pcmHeader.channelCount * 8;
    switch (_pcmHeader.dataFormat) {
        // TODO: if float 32 and float 63 both convert to float 32 by default?
        case AudioDataFormat::FLOAT_32:
        case AudioDataFormat::FLOAT_64:
            dataInDescriptor = reinterpret_cast<float*>(_descriptor.buffer.floatChannelData);
            break;
        case AudioDataFormat::SIGNED_16:
            dataInDescriptor = reinterpret_cast<int16_t*>(_descriptor.buffer.floatChannelData);
            break;
        case AudioDataFormat::SIGNED_32:
            dataInDescriptor = reinterpret_cast<int32_t*>(_descriptor.buffer.floatChannelData);
            break;
    }
    
    memcpy(buffer, dataInDescriptor, frameCount * bitLength);
    return ret;
}

// TODO: If is streaming audio, return partial data? or whole data.
ccstd::vector<char> AudioCache::getPCMBuffer(uint32_t channelID){
    ccstd::vector<char> ret;
    if (loadState != State::LOADED) {
        return ret;
    }
    if (channelID > _pcmHeader.channelCount) {
        NSLog(@"ChannelID is bigger than channel count");
    }
    const uint32_t frameCount = _descriptor.buffer.frameLength;
    ret.resize(_pcmHeader.bytesPerFrame * _pcmHeader.totalFrames / _pcmHeader.channelCount);
    char *buffer = ret.data();
    void *dataInDescriptor;
    uint32_t bitLength = _pcmHeader.bytesPerFrame / _pcmHeader.channelCount * 8;
    switch (_pcmHeader.dataFormat) {
        // TODO: if float 32 and float 63 both convert to float 32 by default?
        case AudioDataFormat::FLOAT_32:
        case AudioDataFormat::FLOAT_64:
            dataInDescriptor = reinterpret_cast<float*>(_descriptor.buffer.floatChannelData);
            break;
        case AudioDataFormat::SIGNED_16:
            dataInDescriptor = reinterpret_cast<int16_t*>(_descriptor.buffer.floatChannelData);
            break;
        case AudioDataFormat::SIGNED_32:
            dataInDescriptor = reinterpret_cast<int32_t*>(_descriptor.buffer.floatChannelData);
            break;
    }
    
    for (int itr = 0; itr< _pcmHeader.totalFrames; itr++) {
        // Explaination of usage https://developer.apple.com/forums/thread/65772
        memcpy(buffer, dataInDescriptor[channelID][itr], bitLength);
        buffer += bitLength;
    }
    return ret;
}

PCMHeader AudioCache::getPCMHeader() {
    return _pcmHeader;
}

}
