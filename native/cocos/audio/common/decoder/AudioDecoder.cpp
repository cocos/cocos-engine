/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

#include "audio/common/decoder/AudioDecoder.h"
#include <cstdint>
#include <cstring>
#include "audio/include/AudioMacros.h"
#include "platform/FileUtils.h"

#ifdef LOG_TAG
    #undef LOG_TAG
#endif
#define LOG_TAG "AudioDecoder"

namespace cc {

AudioDecoder::AudioDecoder()
: _isOpened(false) {}

AudioDecoder::~AudioDecoder() = default;

bool AudioDecoder::isOpened() const {
    return _isOpened;
}

uint32_t AudioDecoder::readFixedFrames(uint32_t framesToRead, char *pcmBuf) {
    uint32_t framesRead = 0;
    uint32_t framesReadOnce = 0;
    do {
        framesReadOnce = read(framesToRead - framesRead, pcmBuf + framesRead * _pcmHeader.bytesPerFrame);
        framesRead += framesReadOnce;
    } while (framesReadOnce != 0 && framesRead < framesToRead);

    if (framesRead < framesToRead) {
        memset(pcmBuf + framesRead * _pcmHeader.bytesPerFrame, 0x00, (framesToRead - framesRead) * _pcmHeader.bytesPerFrame);
    }

    return framesRead;
}

uint32_t AudioDecoder::getTotalFrames() const {
    return _pcmHeader.totalFrames;
}

uint32_t AudioDecoder::getBytesPerFrame() const {
    return _pcmHeader.bytesPerFrame;
}

uint32_t AudioDecoder::getSampleRate() const {
    return _pcmHeader.sampleRate;
}

uint32_t AudioDecoder::getChannelCount() const {
    return _pcmHeader.channelCount;
}

AudioDataFormat AudioDecoder::getDataFormat() const {
    return _pcmHeader.dataFormat;
}

PCMHeader AudioDecoder::getPCMHeader() const {
    return _pcmHeader;
}

} // namespace cc
