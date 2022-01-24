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

#include "audio/oalsoft/AudioDecoderMp3.h"
#include "audio/oalsoft/AudioMacros.h"
#include "platform/FileUtils.h"

#if CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_LINUX || CC_PLATFORM == CC_PLATFORM_QNX
    #include "mpg123/mpg123.h"
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include "cocos/platform/ohos/FileUtils-ohos.h"
    #include "mpg123.h"
    #include <unistd.h>
#endif

#include <sys/stat.h>
#include <cstdlib>

#ifdef LOG_TAG
    #undef LOG_TAG
#endif
#define LOG_TAG "AudioDecoderMp3"

namespace cc {

static bool sMp3Inited = false;

bool AudioDecoderMp3::lazyInit() {
    bool ret = true;
    if (!sMp3Inited) {
        int error = mpg123_init();
        if (error == MPG123_OK) {
            sMp3Inited = true;
        } else {
            ALOGE("Basic setup goes wrong: %s", mpg123_plain_strerror(error));
            ret = false;
        }
    }
    return ret;
}

void AudioDecoderMp3::destroy() {
    if (sMp3Inited) {
        mpg123_exit();
        sMp3Inited = false;
    }
}

AudioDecoderMp3::AudioDecoderMp3() {
    lazyInit();
}

AudioDecoderMp3::~AudioDecoderMp3() {
    close();
}

bool AudioDecoderMp3::open(const char *path) {
    std::string fullPath = FileUtils::getInstance()->fullPathForFilename(path);

    long rate        = 0; //NOLINT(google-runtime-int)
    int  error       = MPG123_OK;
    int  mp3Encoding = 0;
    int  channel     = 0;
    do {
        _mpg123handle = mpg123_new(nullptr, &error);
        if (nullptr == _mpg123handle) {
            ALOGE("Basic setup goes wrong: %s", mpg123_plain_strerror(error));
            break;
        }
#if CC_PLATFORM_OHOS == CC_PLATFORM
        auto *fu      = static_cast<FileUtilsOHOS *>(FileUtils::getInstance());
        _fdAndDeleter = fu->getFd(fullPath);
        if (mpg123_open_fd(_mpg123handle, _fdAndDeleter.first) != MPG123_OK || mpg123_getformat(_mpg123handle, &rate, &channel, &mp3Encoding) != MPG123_OK) {
#else
        if (mpg123_open(_mpg123handle, FileUtils::getInstance()->getSuitableFOpen(fullPath).c_str()) != MPG123_OK || mpg123_getformat(_mpg123handle, &rate, &channel, &mp3Encoding) != MPG123_OK) {
#endif
            ALOGE("Trouble with mpg123: %s\n", mpg123_strerror(_mpg123handle));
            break;
        }

        _channelCount = channel;
        _sampleRate   = rate;

        if (mp3Encoding == MPG123_ENC_SIGNED_16) {
            _bytesPerFrame = 2 * _channelCount;
        } else if (mp3Encoding == MPG123_ENC_FLOAT_32) {
            _bytesPerFrame = 4 * _channelCount;
        } else {
            ALOGE("Bad encoding: 0x%x!\n", mp3Encoding);
            break;
        }

        /* Ensure that this output format will not change (it could, when we allow it). */
        mpg123_format_none(_mpg123handle);
        mpg123_format(_mpg123handle, rate, channel, mp3Encoding);
        /* Ensure that we can get accurate length by call mpg123_length */
        mpg123_scan(_mpg123handle);

        _totalFrames = mpg123_length(_mpg123handle);

        _isOpened = true;
        return true;
    } while (false);

    if (_mpg123handle != nullptr) {
        mpg123_close(_mpg123handle);
        mpg123_delete(_mpg123handle);
        _mpg123handle = nullptr;
    }
    return false;
}

void AudioDecoderMp3::close() {
    if (isOpened()) {
        if (_mpg123handle != nullptr) {
            mpg123_close(_mpg123handle);
            mpg123_delete(_mpg123handle);
            _mpg123handle = nullptr;
        }
        _isOpened = false;
    }
#if CC_PLATFORM_OHOS == CC_PLATFORM
    if (_fdAndDeleter.second) {
        _fdAndDeleter.second();
        _fdAndDeleter.second = nullptr;
    }
#endif
}

uint32_t AudioDecoderMp3::read(uint32_t framesToRead, char *pcmBuf) {
    size_t bytesToRead = framesToRead * _bytesPerFrame;
    size_t bytesRead   = 0;
    int    err         = mpg123_read(_mpg123handle, reinterpret_cast<unsigned char *>(pcmBuf), bytesToRead, &bytesRead);
    if (err == MPG123_ERR) {
        ALOGE("Trouble with mpg123: %s\n", mpg123_strerror(_mpg123handle));
        return 0;
    }

    return static_cast<uint32_t>(bytesRead / _bytesPerFrame);
}

bool AudioDecoderMp3::seek(uint32_t frameOffset) {
    off_t offset = mpg123_seek(_mpg123handle, frameOffset, SEEK_SET);
    //ALOGD("mpg123_seek return: %d", (int)offset);
    return offset >= 0 && offset == frameOffset;
}

uint32_t AudioDecoderMp3::tell() const {
    return static_cast<uint32_t>(mpg123_tell(_mpg123handle));
}

} // namespace cc
