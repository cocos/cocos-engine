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

#define QUEUEBUFFER_NUM       (3)
#define QUEUEBUFFER_TIME_STEP (0.05f)

#define QUOTEME_(x) #x
#define QUOTEME(x)  QUOTEME_(x)

#if defined(CC_DEBUG) && CC_DEBUG > 0
    #define ALOGV(fmt, ...) printf("V/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#else
    #define ALOGV(fmt, ...) \
        do {                \
        } while (false)
#endif
#define ALOGD(fmt, ...) printf("D/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#define ALOGI(fmt, ...) printf("I/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#define ALOGW(fmt, ...) printf("W/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#define ALOGE(fmt, ...) printf("E/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)

#if defined(CC_DEBUG) && CC_DEBUG > 0
    #define CHECK_AL_ERROR_DEBUG()                                                                     \
        do {                                                                                           \
            ALenum __error = alGetError();                                                             \
            if (__error) {                                                                             \
                ALOGE("OpenAL error 0x%04X in %s %s %d\n", __error, __FILE__, __FUNCTION__, __LINE__); \
            }                                                                                          \
        } while (false)
#else
    #define CHECK_AL_ERROR_DEBUG()
#endif

#define BREAK_IF(condition) \
    if (!!(condition)) {    \
        break;              \
    }

#define BREAK_IF_ERR_LOG(condition, fmt, ...)                                   \
    if (!!(condition)) {                                                        \
        ALOGE("(" QUOTEME(condition) ") failed, message: " fmt, ##__VA_ARGS__); \
        break;                                                                  \
    }
