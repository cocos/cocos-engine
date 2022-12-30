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

#include "audio/common/decoder/AudioDecoderOgg.h"
#include <cstdint>

#include "audio/include/AudioMacros.h"
#include "platform/FileUtils.h"

#if CC_PLATFORM == CC_PLATFORM_OHOS
    #include "audio/ohos/FsCallback.h"
namespace {
int ohosSeek_wrap(void *source, ogg_int64_t offset, int whence) {   //NOLINT
    return cc::ohosSeek(source, static_cast<long>(offset), whence); //NOLINT
}

ov_callbacks ogg_callbacks = { //NOLINT
    static_cast<size_t (*)(void *, size_t, size_t, void *)>(cc::ohosRead),
    static_cast<int (*)(void *, ogg_int64_t, int)>(ohosSeek_wrap),
    static_cast<int (*)(void *)>(cc::ohosClose),
    static_cast<long (*)(void *)>(cc::ohosTell)}; //NOLINT
} // namespace
#endif

#ifdef LOG_TAG
    #undef LOG_TAG
#endif
#define LOG_TAG "AudioDecoderOgg"

namespace cc {

AudioDecoderOgg::AudioDecoderOgg() = default;

AudioDecoderOgg::~AudioDecoderOgg() {
    close();
}

bool AudioDecoderOgg::open(const char *path) {
    ccstd::string fullPath = FileUtils::getInstance()->fullPathForFilename(path);
#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    if (0 == ov_fopen(FileUtils::getInstance()->getSuitableFOpen(fullPath).c_str(), &_vf)) {
#elif CC_PLATFORM == CC_PLATFORM_LINUX || CC_PLATFORM == CC_PLATFORM_QNX
    if (0 == ov_fopen(FileUtils::getInstance()->getSuitableFOpen(fullPath).c_str(), &_vf)) {
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    auto *fp = cc::ohosOpen(FileUtils::getInstance()->getSuitableFOpen(fullPath).c_str(), this);
    if (0 == ov_open_callbacks(fp, &_vf, nullptr, 0, ogg_callbacks)) {
#endif
        // header
        vorbis_info *vi = ov_info(&_vf, -1);
        _pcmHeader.sampleRate = static_cast<uint32_t>(vi->rate);
        _pcmHeader.channelCount = vi->channels;
        _pcmHeader.bytesPerFrame = vi->channels * sizeof(int16_t);
        _pcmHeader.dataFormat = AudioDataFormat::SIGNED_16;
        _pcmHeader.totalFrames = static_cast<uint32_t>(ov_pcm_total(&_vf, -1));
        _isOpened = true;
        return true;
    }
    return false;
}

void AudioDecoderOgg::close() {
    if (isOpened()) {
        ov_clear(&_vf);
        _isOpened = false;
    }
}

uint32_t AudioDecoderOgg::read(uint32_t framesToRead, char *pcmBuf) {
    int currentSection = 0;
    auto bytesToRead = framesToRead * _pcmHeader.bytesPerFrame;
#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    auto bytesRead = ov_read(&_vf, pcmBuf, bytesToRead, 0, 2, 1, &currentSection);
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    int bitstream = 0;
    auto bytesRead = ov_read(&_vf, pcmBuf, bytesToRead, &bitstream);
#elif CC_PLATFORM == CC_PLATFORM_LINUX || CC_PLATFORM == CC_PLATFORM_QNX
    auto bytesRead = ov_read(&_vf, pcmBuf, bytesToRead, 0, 2, 1, &currentSection);
#endif
    return static_cast<uint32_t>(bytesRead / _pcmHeader.bytesPerFrame);
}

bool AudioDecoderOgg::seek(uint32_t frameOffset) {
    return 0 == ov_pcm_seek(&_vf, frameOffset);
}

uint32_t AudioDecoderOgg::tell() const {
    return static_cast<uint32_t>(ov_pcm_tell(const_cast<OggVorbis_File *>(&_vf)));
}

} // namespace cc
