#include "platform/android/jni/JniHelper.h"
#include "platform/Application.h"
#include <jni.h>
#include <android/log.h>
#include <android/keycodes.h>
#include "platform/Device.h"

#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "JniCocosOrientationHelper JNI", __VA_ARGS__)

extern "C" {
    JNIEXPORT void JNICALL Java_com_cocos_lib_CocosOrientationHelper_nativeOnOrientationChanged(JNIEnv *env, jobject thiz, jint rotation) {
        auto orientation = cc::Device::getDeviceOrientation();
        cc::EventDispatcher::dispatchOrientationChangeEvent((int)orientation);
    }
}
