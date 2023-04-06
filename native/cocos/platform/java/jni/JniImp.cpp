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

#include "JniImp.h"

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include <android/log.h>
#else
    #include <hilog/log.h>
#endif

#include <jni.h>
#include "JniHelper.h"
#include "cocos/audio/include/AudioEngine.h"

#ifndef JCLS_HELPER
    #define JCLS_HELPER "com/cocos/lib/CocosHelper"
#endif

#ifndef JCLS_SENSOR
    #define JCLS_SENSOR "com/cocos/lib/CocosSensorHandler"
#endif

#ifndef COM_AUDIOFOCUS_CLASS_NAME
    #define COM_AUDIOFOCUS_CLASS_NAME com_cocos_lib_CocosAudioFocusManager
#endif
#define JNI_AUDIO(FUNC) JNI_METHOD1(COM_AUDIOFOCUS_CLASS_NAME, FUNC)


/***********************************************************
 * Functions invoke from cpp to Java.
 ***********************************************************/
namespace cc {
ccstd::string getObbFilePathJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getObbFilePath");
}

int getObbAssetFileDescriptorJNI(const ccstd::string &path, int64_t *startOffset, int64_t *size) {
    JniMethodInfo methodInfo;
    int fd = 0;

    if (JniHelper::getStaticMethodInfo(methodInfo, JCLS_HELPER, "getObbAssetFileDescriptor", "(Ljava/lang/String;)[J")) {
        jstring stringArg = methodInfo.env->NewStringUTF(path.c_str());
        auto *newArray = static_cast<jlongArray>(methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID, stringArg));
        jsize theArrayLen = methodInfo.env->GetArrayLength(newArray);

        if (3 == theArrayLen) {
            jboolean copy = JNI_FALSE;
            jlong *array = methodInfo.env->GetLongArrayElements(newArray, &copy);
            fd = static_cast<int>(array[0]);
            *startOffset = array[1];
            *size = array[2];
            methodInfo.env->ReleaseLongArrayElements(newArray, array, 0);
        }

        ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        ccDeleteLocalRef(methodInfo.env, stringArg);
    }

    return fd;
}

ccstd::string getCurrentLanguageJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getCurrentLanguage");
}

ccstd::string getCurrentLanguageCodeJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getCurrentLanguageCode");
}

ccstd::string getSystemVersionJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getSystemVersion");
}

bool openURLJNI(const ccstd::string &url) {
    return JniHelper::callStaticBooleanMethod(JCLS_HELPER, "openURL", url);
}

void copyTextToClipboardJNI(const ccstd::string &text) {
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "copyTextToClipboard", text);
}

ccstd::string getDeviceModelJNI() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getDeviceModel");
}

int getDPIJNI() {
    return JniHelper::callStaticIntMethod(JCLS_HELPER, "getDPI");
}

void setVibrateJNI(float duration) {
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "vibrate", duration);
}

void setKeepScreenOnJNI(bool isEnabled) {
    return JniHelper::callStaticVoidMethod(JCLS_HELPER, "setKeepScreenOn", isEnabled);
}

void finishActivity() {
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "finishActivity");
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
    JniHelper::callStaticVoidMethod(JCLS_HELPER,
                                        "flushTasksOnGameThread");
}

void flushTasksOnGameThreadAtForegroundJNI() {
    JniHelper::callStaticVoidMethod(JCLS_HELPER,
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

bool getSupportHPE() {
    return JniHelper::callStaticBooleanMethod(JCLS_HELPER, "supportHPE");
}

} // namespace cc
extern "C" {
JNIEXPORT void JNICALL JNI_AUDIO(nativeSetAudioVolumeFactor)(JNIEnv * /*env*/, jclass /* thiz*/, jfloat volumeFactor) {
#if CC_USE_AUDIO
    cc::AudioEngine::setVolumeFactor(volumeFactor);
#endif
}
}
