/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "platform/android/jni/JniHelper.h"
#include "platform/Application.h"
#include <jni.h>
#include <android/log.h>

#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "CocosTouchHandler JNI", __VA_ARGS__)

namespace {
struct cc::TouchEvent touchEvent;
}
extern "C" {
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionDown(JNIEnv *env, jobject obj, jint id,
                                                                             jfloat x, jfloat y) {
    touchEvent.type = cc::TouchEvent::Type::BEGAN;
    touchEvent.touches.emplace_back(x, y, id);
    cc::EventDispatcher::dispatchTouchEvent(touchEvent);
    touchEvent.touches.clear();
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionUp(JNIEnv *env, jobject obj, jint id, jfloat x,
                                                                           jfloat y) {
    touchEvent.type = cc::TouchEvent::Type::ENDED;
    touchEvent.touches.emplace_back(x, y, id);
    cc::EventDispatcher::dispatchTouchEvent(touchEvent);
    touchEvent.touches.clear();
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionMove(JNIEnv *env, jobject obj,
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

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionCancel(JNIEnv *env, jobject obj,
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
