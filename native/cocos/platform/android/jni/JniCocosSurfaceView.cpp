#include "platform/android/jni/JniHelper.h"
#include "platform/Application.h"
#include <jni.h>
#include <android/log.h>
#include <android/keycodes.h>

#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "JniCocosSurfaceView JNI", __VA_ARGS__)

extern "C" {
    JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_nativeOnSizeChanged(JNIEnv *env, jobject thiz, jint width,
                                                                jint height) {
            cc::EventDispatcher::dispatchResizeEvent(width, height);
        }
}

