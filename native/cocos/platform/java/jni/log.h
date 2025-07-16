/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#define JNI_IMP_LOG_TAG "JniImp"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/log.h>
    #define LOGV(...) __android_log_print(ANDROID_LOG_INFO, "CocosActivity JNI", __VA_ARGS__)
    #define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, JNI_IMP_LOG_TAG, __VA_ARGS__)
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    #include <hilog/log.h>
    #define LOGV(...) HILOG_INFO(LOG_APP, __VA_ARGS__)
    #define LOGD(...)
#endif