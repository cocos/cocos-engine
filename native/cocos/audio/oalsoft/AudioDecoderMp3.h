/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "audio/oalsoft/AudioDecoder.h"

#include <functional>

struct mpg123_handle_struct;

namespace cc {

/**
 * @brief The class for decoding compressed audio file to PCM buffer.
 */
class AudioDecoderMp3 : public AudioDecoder {
public:
    /**
     * @brief Opens an audio file specified by a file path.
     * @return true if succeed, otherwise false.
     */
    bool open(const char *path) override;

    /**
     * @brief Closes opened audio file.
     * @note The method will also be automatically invoked in the destructor.
     */
    void close() override;

    /**
     * @brief Reads audio frames of PCM format.
     * @param framesToRead The number of frames excepted to be read.
     * @param pcmBuf The buffer to hold the frames to be read, its size should be >= |framesToRead| * _bytesPerFrame.
     * @return The number of frames actually read, it's probably less than 'framesToRead'. Returns 0 means reach the end of file.
     */
    uint32_t read(uint32_t framesToRead, char *pcmBuf) override;

    /**
     * @brief Sets frame offest to be read.
     * @param frameOffset The frame offest to be set.
     * @return true if succeed, otherwise false
     */
    bool seek(uint32_t frameOffset) override;

    /**
     * @brief Tells the current frame offset.
     * @return The current frame offset.
     */
    uint32_t tell() const override;

protected:
    AudioDecoderMp3();
    ~AudioDecoderMp3() override;

    static bool lazyInit();
    static void destroy();

    struct mpg123_handle_struct *_mpg123handle = nullptr;

#if CC_PLATFORM_OHOS == CC_PLATFORM
    std::pair<int, std::function<void()>> _fdAndDeleter;
#endif

    friend class AudioDecoderManager;
};

} // namespace cc
