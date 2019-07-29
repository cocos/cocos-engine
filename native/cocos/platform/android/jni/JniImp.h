/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

#include <string>

typedef void (*EditTextCallback)(const std::string& text, void* ctx);

extern bool getApplicationExited();

extern void restartJSVM();
extern void exitApplication();

extern std::string getApkPathJNI();
extern std::string getPackageNameJNI();
extern int getObbAssetFileDescriptorJNI(const std::string& path, long* startOffset, long* size);
extern void convertEncodingJNI(const std::string& src, int byteSize, const std::string& fromCharset, std::string& dst, const std::string& newCharset);

extern int getDeviceSampleRateJNI();
extern int getDeviceAudioBufferSizeInFramesJNI();

extern std::string getCurrentLanguageJNI();
extern std::string getCurrentLanguageCodeJNI();
extern std::string getSystemVersionJNI();
extern bool openURLJNI(const std::string& url);
extern void copyTextToClipboardJNI(const std::string& text);
extern void setPreferredFramesPerSecondJNI(int fps);
extern void setGameInfoDebugViewTextJNI(int index, const std::string& text);
extern void setJSBInvocationCountJNI(int count);
extern void openDebugViewJNI();
extern void disableBatchGLCommandsToNativeJNI();
extern int getAndroidSDKInt();
