/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include <jni.h>
#include "cocos/bindings/event/EventDispatcher.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/glue/JniNativeGlue.h"

namespace {
struct cc::TouchEvent touchEvent;
}
extern "C" {
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionDown(JNIEnv *env, jobject obj, jint id,
                                                                             jfloat x, jfloat y) {
    touchEvent.type = cc::TouchEvent::Type::BEGAN;
    touchEvent.touches.emplace_back(x, y, id);
    JNI_NATIVE_GLUE()->dispatchEvent(touchEvent);
    touchEvent.touches.clear();
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionUp(JNIEnv *env, jobject obj, jint id, jfloat x,
                                                                           jfloat y) {
    touchEvent.type = cc::TouchEvent::Type::ENDED;
    touchEvent.touches.emplace_back(x, y, id);
    JNI_NATIVE_GLUE()->dispatchEvent(touchEvent);
    touchEvent.touches.clear();
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionMove(JNIEnv *env, jobject obj,
                                                                             jintArray   ids,
                                                                             jfloatArray xs,
                                                                             jfloatArray ys) {
    touchEvent.type = cc::TouchEvent::Type::MOVED;
    int    size     = env->GetArrayLength(ids);
    jint   id[size];
    jfloat x[size];
    jfloat y[size];

    env->GetIntArrayRegion(ids, 0, size, id);
    env->GetFloatArrayRegion(xs, 0, size, x);
    env->GetFloatArrayRegion(ys, 0, size, y);
    for (int i = 0; i < size; i++) {
        touchEvent.touches.emplace_back(x[i], y[i], id[i]);
    }

    JNI_NATIVE_GLUE()->dispatchEvent(touchEvent);
    touchEvent.touches.clear();
}

//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionCancel(JNIEnv *env, jobject obj,
                                                                               jintArray   ids,
                                                                               jfloatArray xs,
                                                                               jfloatArray ys) {
    touchEvent.type = cc::TouchEvent::Type::CANCELLED;
    int    size     = env->GetArrayLength(ids);
    jint   id[size];
    jfloat x[size];
    jfloat y[size];

    env->GetIntArrayRegion(ids, 0, size, id);
    env->GetFloatArrayRegion(xs, 0, size, x);
    env->GetFloatArrayRegion(ys, 0, size, y);
    for (int i = 0; i < size; i++) {
        touchEvent.touches.emplace_back(x[i], y[i], id[i]);
    }
    JNI_NATIVE_GLUE()->dispatchEvent(touchEvent);
    touchEvent.touches.clear();
}
}
