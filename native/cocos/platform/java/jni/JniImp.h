/****************************************************************************
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/std/container/string.h"

namespace cc {
ccstd::string getObbFilePathJNI();
int getObbAssetFileDescriptorJNI(const ccstd::string &path, int64_t *startOffset, int64_t *size);
ccstd::string getCurrentLanguageJNI();
ccstd::string getCurrentLanguageCodeJNI();
ccstd::string getSystemVersionJNI();
bool openURLJNI(const ccstd::string &url);
void copyTextToClipboardJNI(const ccstd::string &text);
ccstd::string getDeviceModelJNI();
int getDPIJNI();
void setVibrateJNI(float duration);
void setKeepScreenOnJNI(bool isEnabled);
int getNetworkTypeJNI();
float *getSafeAreaEdgeJNI();
int getDeviceRotationJNI();
float getBatteryLevelJNI();
void flushTasksOnGameThreadJNI();
void flushTasksOnGameThreadAtForegroundJNI();
void setAccelerometerEnabledJNI(bool isEnabled);
void setAccelerometerIntervalJNI(float interval);
float *getDeviceMotionValueJNI();
void finishActivity();
/**
 * support for High Performance Emulator
 */
bool getSupportHPE();
} // namespace cc