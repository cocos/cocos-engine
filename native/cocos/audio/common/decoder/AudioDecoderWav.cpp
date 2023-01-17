/****************************************************************************
Copyright (c) 2016 Chukong Technologies Inc.
Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#define LOG_TAG "AudioDecoderWav"

#include "audio/common/decoder/AudioDecoderWav.h"
#include "base/Log.h"
#include "platform/FileUtils.h"

namespace cc {

AudioDecoderWav::AudioDecoderWav() {
    CC_LOG_DEBUG("Create AudioDecoderWav");
}

AudioDecoderWav::~AudioDecoderWav() {
    close();
};

bool AudioDecoderWav::open(const char *path) {
    bool ret{false};
    auto fullPath = FileUtils::getInstance()->fullPathForFilename(path);
    if (fullPath.empty()) {
        CC_LOG_DEBUG("File does not exist %s", fullPath.c_str());
        return false;
    }
    do {
        sf::SF_INFO info;
        _sf_handle = sf::sf_open_read(fullPath.c_str(), &info, nullptr, nullptr);
        if (_sf_handle == nullptr) {
            CC_LOG_ERROR("file %s open failed, it might be invalid", fullPath.c_str());
            break;
        }
        if (info.frames == 0) {
            CC_LOG_ERROR("file %s has no frame, is it an invalid wav file?", fullPath.c_str());
            break;
        }
        CC_LOG_DEBUG("wav info: frames: %d, samplerate: %d, channels: %d, format: %d", info.frames, info.samplerate, info.channels, info.format);
        _pcmHeader.channelCount = info.channels;
        _pcmHeader.bytesPerFrame = 2 * info.channels;       // FIXED_16
        _pcmHeader.dataFormat = AudioDataFormat::SIGNED_16; //FIXED,
        _pcmHeader.sampleRate = info.samplerate;
        _pcmHeader.totalFrames = info.frames;
        _isOpened = true;
        ret = true;

    } while (false);
    return ret;
}

uint32_t AudioDecoderWav::read(uint32_t framesToRead, char *pcmBuf) {
    //size_t bytesToRead = framesToRead * _pcmHeader.bytesPerFrame;
    size_t framesRead = sf::sf_readf_short(_sf_handle, reinterpret_cast<int16_t *>(pcmBuf), framesToRead);
    return framesRead;
}

bool AudioDecoderWav::seek(uint32_t frameOffset) {
    auto offset = sf::sf_seek(_sf_handle, frameOffset, SEEK_SET);
    return offset >= 0 && offset == frameOffset;
}
uint32_t AudioDecoderWav::tell() const {
    return static_cast<uint32_t>(sf::sf_tell(_sf_handle));
}
void AudioDecoderWav::close() {
    if (_isOpened) {
        if (_sf_handle) {
            sf::sf_close(_sf_handle);
        }
        _isOpened = false;
    }
}
} // namespace cc
