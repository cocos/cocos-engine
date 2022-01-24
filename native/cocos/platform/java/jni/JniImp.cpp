/****************************************************************************
 Copyright (c) 2018-2021 Xiamen Yaji Software Co., Ltd.

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

#include "JniImp.h"

#include <jni.h>
#include "JniHelper.h"

#ifndef JCLS_HELPER
    #define JCLS_HELPER "com/cocos/lib/CocosHelper"
#endif

#ifndef JCLS_SENSOR
    #define JCLS_SENSOR "com/cocos/lib/CocosSensorHandler"
#endif

using namespace cc; //NOLINT

/***********************************************************
 * Functions invoke from cpp to Java.
 ***********************************************************/

std::string getObbFilePathJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getObbFilePath");
}

int getObbAssetFileDescriptorJNI(const std::string &path, int64_t *startOffset, int64_t *size) {
    JniMethodInfo methodInfo;
    int           fd = 0;

    if (JniHelper::getStaticMethodInfo(methodInfo, JCLS_HELPER, "getObbAssetFileDescriptor", "(Ljava/lang/String;)[J")) {
        jstring stringArg   = methodInfo.env->NewStringUTF(path.c_str());
        auto *  newArray    = static_cast<jlongArray>(methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID, stringArg));
        jsize   theArrayLen = methodInfo.env->GetArrayLength(newArray);

        if (3 == theArrayLen) {
            jboolean copy  = JNI_FALSE;
            jlong *  array = methodInfo.env->GetLongArrayElements(newArray, &copy);
            fd             = static_cast<int>(array[0]);
            *startOffset   = array[1];
            *size          = array[2];
            methodInfo.env->ReleaseLongArrayElements(newArray, array, 0);
        }

        ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        ccDeleteLocalRef(methodInfo.env, stringArg);
    }

    return fd;
}

std::string getCurrentLanguageJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getCurrentLanguage");
}

std::string getCurrentLanguageCodeJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getCurrentLanguageCode");
}

std::string getSystemVersionJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getSystemVersion");
}

bool openURLJNI(const std::string &url) {
    return JniHelper::callStaticBooleanMethod(JCLS_HELPER, "openURL", url);
}

void copyTextToClipboardJNI(const std::string &text) {
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "copyTextToClipboard", text);
}

std::string getDeviceModelJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getDeviceModel");
}

int getDPIJNI() {
    return JniHelper::callStaticIntMethod(JCLS_HELPER, "getDPI");
}

void setVibrateJNI(float duration) {
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "vibrate", duration);
}

int getNetworkTypeJNI() {
    return JniHelper::callStaticIntMethod(JCLS_HELPER, "getNetworkType");
}

float *getSafeAreaEdgeJNI() {
    return JniHelper::callStaticFloatArrayMethod(JCLS_HELPER, "getSafeArea");
}

int getDeviceRotationJNI() {
    return JniHelper::callStaticIntMethod(JCLS_HELPER, "getDeviceRotation");
}

float getBatteryLevelJNI() {
    return JniHelper::callStaticFloatMethod(JCLS_HELPER, "getBatteryLevel");
}

void flushTasksOnGameThreadJNI() {
    cc::JniHelper::callStaticVoidMethod(JCLS_HELPER,
                                        "flushTasksOnGameThread");
}

void flushTasksOnGameThreadAtForegroundJNI() {
    cc::JniHelper::callStaticVoidMethod(JCLS_HELPER,
                                        "flushTasksOnGameThreadAtForeground");
}

void setAccelerometerEnabledJNI(bool isEnabled) {
    JniHelper::callStaticVoidMethod(JCLS_SENSOR, "setAccelerometerEnabled", isEnabled);
}

void setAccelerometerIntervalJNI(float interval) {
    JniHelper::callStaticVoidMethod(JCLS_SENSOR, "setAccelerometerInterval", interval);
}

float *getDeviceMotionValueJNI() {
    return JniHelper::callStaticFloatArrayMethod(JCLS_SENSOR, "getDeviceMotionValue");
}