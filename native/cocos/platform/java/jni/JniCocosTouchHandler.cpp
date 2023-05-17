/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include <jni.h>
#include "engine/EngineEvents.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/glue/JniNativeGlue.h"
#include "platform/java/modules/SystemWindow.h"
#include "platform/java/modules/SystemWindowManager.h"

namespace {
cc::TouchEvent touchEvent;
}
extern "C" {
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionDown(JNIEnv *env, jobject obj, jint id,
                                                                             jfloat x, jfloat y) {
    // TODO(qgh):The windows ID needs to be passed down from the jave, which is currently using the main window.
    touchEvent.windowId = cc::ISystemWindow::mainWindowId;
    touchEvent.type = cc::TouchEvent::Type::BEGAN;
    touchEvent.touches.emplace_back(x, y, id);
    cc::events::Touch::broadcast(touchEvent);
    touchEvent.touches.clear();
}

//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionUp(JNIEnv *env, jobject obj, jint id, jfloat x,
                                                                           jfloat y) {
    touchEvent.windowId = cc::ISystemWindow::mainWindowId;
    touchEvent.type = cc::TouchEvent::Type::ENDED;
    touchEvent.touches.emplace_back(x, y, id);
    cc::events::Touch::broadcast(touchEvent);
    touchEvent.touches.clear();
}

//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionMove(JNIEnv *env, jobject obj,
                                                                             jintArray ids,
                                                                             jfloatArray xs,
                                                                             jfloatArray ys) {
    touchEvent.type = cc::TouchEvent::Type::MOVED;
    touchEvent.windowId = cc::ISystemWindow::mainWindowId;
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
    cc::events::Touch::broadcast(touchEvent);
    touchEvent.touches.clear();
}

//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionCancel(JNIEnv *env, jobject obj,
                                                                               jintArray ids,
                                                                               jfloatArray xs,
                                                                               jfloatArray ys) {
    touchEvent.type = cc::TouchEvent::Type::CANCELLED;
    touchEvent.windowId = cc::ISystemWindow::mainWindowId;
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
    cc::events::Touch::broadcast(touchEvent);
    touchEvent.touches.clear();
}
}
