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

#define LOG_TAG "AudioPlayer"

#import <AVFoundation/AVAudioPlayer.h>
#import <Foundation/Foundation.h>
#import <AVFoundation/AVMediaFormat.h>
#include "audio/apple/AudioCache.h"
#include "audio/apple/AudioDecoder.h"
#import "audio/apple/AudioPlayer.h"
#include "base/memory/Memory.h"
#include "platform/FileUtils.h"

#ifdef VERY_VERY_VERBOSE_LOGGING
    #define ALOGVV ALOGV
#else
    #define ALOGVV(...) \
        do {            \
        } while (false)
#endif

using namespace cc;

namespace {
unsigned int __idIndex = 0;

AVFileType fileTypeInterpreter(AbstractAudioFileType origin) {
    AVFileType dest;
    switch (origin) {
        case AbstractAudioFileType::MP3:
            dest = AVFileTypeMPEGLayer3;
            break;
        default:
            break;
    }
    return dest;
}
}

namespace cc {
AudioPlayer::~AudioPlayer(){
    bool ok = release();
    assert(ok);
}
bool AudioPlayer::release(){
    bool ok {true};
    delete(_cache);
    [_player release];
    if ([(id)_player retainCount] > 0) {
        ok = false;
        assert(ok); //TODO: well manage player
    }
    _state = AudioPlayerState::UNUSED;
    return ok;
}
bool AudioPlayer::init(){
    if (_cache == nullptr) {
        return false;
    }
    // TODO: if pcmData is what we need?
    NSData* pcmData = [[NSData alloc] initWithBytes:_cache->_audioBuffer
                                             length:_cache->_totalFrames*_cache->_bytesPerFrame];
    _player = [[AVAudioPlayer alloc] initWithData:pcmData
                                     fileTypeHint:fileTypeInterpreter(_cache->_avFileType)
                                            error:nil];
    [pcmData release];
    _state = AudioPlayerState::READY;
    if(!_player){
        return false;
    }
    return true;
}
bool AudioPlayer::resume() {
    //TODO: play or playAtTime?
    if (_cache == nullptr || _state != AudioPlayerState::UNUSED) {
        return false;
    }
    
    [(id)_player play];
    _state = AudioPlayerState::PLAYING;
}
bool AudioPlayer::pause() {
    if (_cache == nullptr || _state == AudioPlayerState::UNUSED) {
        return false;
    }
    [(id)_player pause];
    _state = AudioPlayerState::PAUSED;
    return true;
}
bool AudioPlayer::play() {
    if (_cache == nullptr || _state == AudioPlayerState::UNUSED) {
        return false;
    }
    
    [(id)_player play];
    _state = AudioPlayerState::PLAYING;
    return true;
}
void AudioPlayer::stop() {
    [(id)_player stop];
    _state = AudioPlayerState::STOPPED;
}
} //namespace cc
