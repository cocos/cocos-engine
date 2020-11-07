#include "platform/android/jni/JniHelper.h"
#include "platform/Application.h"
#include <jni.h>
#include <android/log.h>

#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "CocosTouchHandler JNI", __VA_ARGS__)

namespace {
    struct cc::TouchEvent touchEvent;
}
extern "C" {
    JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosTouchHandler_handleActionDown(JNIEnv *env, jobject obj, jint id,
                                                             jfloat x, jfloat y) {
        touchEvent.type = cc::TouchEvent::Type::BEGAN;
        touchEvent.touches.emplace_back(x, y, id);
        cc::EventDispatcher::dispatchTouchEvent(touchEvent);
        touchEvent.touches.clear();
    }

    JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosTouchHandler_handleActionUp(JNIEnv *env, jobject obj, jint id, jfloat x,
                                                           jfloat y) {
        touchEvent.type = cc::TouchEvent::Type::ENDED;
        touchEvent.touches.emplace_back(x, y, id);
        cc::EventDispatcher::dispatchTouchEvent(touchEvent);
        touchEvent.touches.clear();
    }

    JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosTouchHandler_handleActionMove(JNIEnv *env, jobject obj,
                                                             jintArray ids,
                                                             jfloatArray xs,
                                                             jfloatArray ys) {

        touchEvent.type = cc::TouchEvent::Type::MOVED;
        int size = env->GetArrayLength(ids);
        jint id[size];
        jfloat x[size];
        jfloat y[size];

        env->GetIntArrayRegion(ids, 0, size, id);
        env->GetFloatArrayRegion(xs, 0, size, x);
        env->GetFloatArrayRegion(ys, 0, size, y);
        for (int i = 0; i < size; i++) {
            touchEvent.touches.emplace_back(x[i], y[i], id[i]);
        }

        cc:
        cc::EventDispatcher::dispatchTouchEvent(touchEvent);
        touchEvent.touches.clear();
    }

    JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosTouchHandler_handleActionCancel(JNIEnv *env, jobject obj,
                                                               jintArray ids,
                                                               jfloatArray xs,
                                                               jfloatArray ys) {
        touchEvent.type = cc::TouchEvent::Type::CANCELLED;
        int size = env->GetArrayLength(ids);
        jint id[size];
        jfloat x[size];
        jfloat y[size];

        env->GetIntArrayRegion(ids, 0, size, id);
        env->GetFloatArrayRegion(xs, 0, size, x);
        env->GetFloatArrayRegion(ys, 0, size, y);
        for (int i = 0; i < size; i++) {
            touchEvent.touches.emplace_back(x[i], y[i], id[i]);
        }
        cc::EventDispatcher::dispatchTouchEvent(touchEvent);
        touchEvent.touches.clear();
    }
}

