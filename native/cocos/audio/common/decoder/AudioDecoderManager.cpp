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

#define LOG_TAG "AudioDecoderManager"

#include "audio/common/decoder/AudioDecoderManager.h"
#include "audio/common/decoder/AudioDecoderMp3.h"
#include "audio/common/decoder/AudioDecoderOgg.h"
#include "audio/common/decoder/AudioDecoderWav.h"
#include "audio/include/AudioMacros.h"
#include "base/memory/Memory.h"
#include "platform/FileUtils.h"

namespace cc {

bool AudioDecoderManager::init() {
    return true;
}

void AudioDecoderManager::destroy() {
    AudioDecoderMp3::destroy();
}

AudioDecoder *AudioDecoderManager::createDecoder(const char *path) {
    ccstd::string suffix = FileUtils::getInstance()->getFileExtension(path);
    if (suffix == ".ogg") {
        return ccnew AudioDecoderOgg();
    }

    if (suffix == ".mp3") {
        return ccnew AudioDecoderMp3();
    }
#if CC_PLATFORM == CC_PLATFORM_OHOS || CC_PLATFORM == CC_PLATFORM_WINDOWS
    if (suffix == ".wav") {
        return ccnew AudioDecoderWav();
    }
#endif

    return nullptr;
}

void AudioDecoderManager::destroyDecoder(AudioDecoder *decoder) {
    delete decoder;
}

} // namespace cc
