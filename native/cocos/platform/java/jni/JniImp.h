/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

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

#include "base/std/container/string.h"

extern ccstd::string getObbFilePathJNI();
extern int getObbAssetFileDescriptorJNI(const ccstd::string &path, int64_t *startOffset, int64_t *size);
extern ccstd::string getCurrentLanguageJNI();
extern ccstd::string getCurrentLanguageCodeJNI();
extern ccstd::string getSystemVersionJNI();
extern bool openURLJNI(const ccstd::string &url);
extern void copyTextToClipboardJNI(const ccstd::string &text);
extern ccstd::string getDeviceModelJNI();
extern int getDPIJNI();
extern void setVibrateJNI(float duration);
extern void setKeepScreenOnJNI(bool isEnabled);
extern int getNetworkTypeJNI();
extern float *getSafeAreaEdgeJNI();
extern int getDeviceRotationJNI();
extern float getBatteryLevelJNI();
extern void flushTasksOnGameThreadJNI();
extern void flushTasksOnGameThreadAtForegroundJNI();
extern void setAccelerometerEnabledJNI(bool isEnabled);
extern void setAccelerometerIntervalJNI(float interval);
extern float *getDeviceMotionValueJNI();
extern void finishActivity();
