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

#include <android/keycodes.h>
#include <android/log.h>
#include <android/native_window.h>
#include <android/native_window_jni.h>
#include <jni.h>
#include "application/ApplicationManager.h"
#include "base/memory/Memory.h"
#include "engine/EngineEvents.h"
#include "platform/android/AndroidPlatform.h"
#include "platform/java/modules/SystemWindow.h"
#include "platform/java/modules/SystemWindowManager.h"

namespace {
struct cc::TouchEvent touchEvent;

class NativeWindowCache {
public:
    explicit NativeWindowCache(int windowId) : _windowId{windowId} {
    }

    ~NativeWindowCache() {
        setSurface(nullptr);
    }

    void setSurface(jobject surface) {
        if (_nativeWindow != nullptr) {
            ANativeWindow_release(_nativeWindow);
        }
        if (surface != nullptr) {
            _nativeWindow = ANativeWindow_fromSurface(env, surface);
        } else {
            _nativeWindow = nullptr;
        }
    }

    ANativeWindow *getNativeWindow() {
        return _nativeWindow;
    }

    int getWindowId() const {
        return _windowId;
    }

    JNIEnv *env;

private:
    int _windowId{0};
    ANativeWindow *_nativeWindow{nullptr};
};
} // namespace

//#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "JniCocosSurfaceView JNI", __VA_ARGS__)

extern "C" {

JNIEXPORT jlong Java_com_cocos_lib_CocosSurfaceView_constructNative(JNIEnv *env, jobject /*thiz*/, jint windowId) { // NOLINT JNI function name
    auto *cache = ccnew NativeWindowCache(windowId);
    cache->env = env;
    return reinterpret_cast<jlong>(cache);
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_destructNative(JNIEnv * /*env*/, jobject /*thiz*/, jlong handle) { // NOLINT JNI function name
    auto *windowCache = reinterpret_cast<NativeWindowCache *>(handle);
    CC_SAFE_DELETE(windowCache);
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSizeChangedNative(JNIEnv * /*env*/, jobject /*thiz*/, jint windowId, jint width, jint height) { // NOLINT JNI function name
    auto func = [width, height, windowId]() -> void {
        cc::events::Resize::broadcast(width, height, windowId);
    };
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(func);
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSurfaceRedrawNeededNative(JNIEnv * /*env*/, jobject /*thiz*/, jlong handle) { // NOLINT JNI function name
    //
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSurfaceCreatedNative(JNIEnv *env, jobject /*thiz*/, jlong handle, jobject surface) { // NOLINT JNI function name
    CC_UNUSED_PARAM(env);
    auto *windowCache = reinterpret_cast<NativeWindowCache *>(handle);
    ANativeWindow *oldNativeWindow = windowCache->getNativeWindow();
    windowCache->setSurface(surface);
    ANativeWindow *nativeWindow = windowCache->getNativeWindow();

    auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
    auto *windowMgr = platform->getInterface<cc::SystemWindowManager>();
    auto *iSysWindow = windowMgr->getWindow(windowCache->getWindowId());
    auto *sysWindow = static_cast<cc::SystemWindow *>(iSysWindow);
    sysWindow->setWindowHandle(nativeWindow);
    if (oldNativeWindow) {
        auto func = [sysWindow]() -> void {
            cc::events::WindowRecreated::broadcast(sysWindow->getWindowId());
        };
        CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(func);
    }
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSurfaceChangedNative(JNIEnv *env, // NOLINT JNI function name
                                                                                  jobject /*thiz*/,
                                                                                  jlong handle,
                                                                                  jobject surface,
                                                                                  jint format,
                                                                                  jint width,
                                                                                  jint height) {
    CC_UNUSED_PARAM(env);
    CC_UNUSED_PARAM(format);
    CC_UNUSED_PARAM(width);
    CC_UNUSED_PARAM(height);
    if (handle != 0) {
        auto *windowCache = (NativeWindowCache *)handle;
        ANativeWindow *oldNativeWindow = windowCache->getNativeWindow();
        // Fix for window being destroyed behind the scenes on older Android
        // versions.
        if (oldNativeWindow != nullptr) {
            ANativeWindow_acquire(oldNativeWindow);
        }

        windowCache->setSurface(surface);
        ANativeWindow *newNativeWindow = windowCache->getNativeWindow();
        if (oldNativeWindow != newNativeWindow) {
            auto *iSysWindow = CC_GET_PLATFORM_INTERFACE(cc::SystemWindowManager)->getWindow(windowCache->getWindowId());
            auto *sysWindow = static_cast<cc::SystemWindow *>(iSysWindow);
            sysWindow->setWindowHandle(newNativeWindow);

            auto func = [sysWindow]() -> void {
                cc::events::WindowRecreated::broadcast(sysWindow->getWindowId());
            };
            CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(func);
        }
        // Release the window we acquired earlier.
        if (oldNativeWindow != nullptr) {
            ANativeWindow_release(oldNativeWindow);
        }
    }
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSurfaceDestroyedNative(JNIEnv *env, jobject /*thiz*/, jlong handle) { // NOLINT JNI function name
    auto *windowCache = (NativeWindowCache *)handle;
    ANativeWindow *nativeWindow = windowCache->getNativeWindow();

    // todo: destroy gfx surface
    auto func = [nativeWindow]() -> void {
        auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
        auto *windowMgr = platform->getInterface<cc::SystemWindowManager>();
        cc::ISystemWindow *window = windowMgr->getWindowFromANativeWindow(nativeWindow);

        cc::events::WindowDestroy::broadcast(window->getWindowId());
    };
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(func);
}

// NOLINTNEXTLINE
JNIEXPORT void JNICALL
Java_com_cocos_lib_CocosTouchHandler_handleActionDown(JNIEnv *env, // NOLINT JNI function name
                                                      jobject obj,
                                                      jint windowId,
                                                      jint id,
                                                      jfloat x,
                                                      jfloat y) {
    CC_UNUSED_PARAM(env);
    CC_UNUSED_PARAM(obj);

    touchEvent.windowId = windowId;
    touchEvent.type = cc::TouchEvent::Type::BEGAN;
    touchEvent.touches.emplace_back(x, y, id);
    cc::events::Touch::broadcast(touchEvent);
    touchEvent.touches.clear();
}

// NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionUp(JNIEnv *env, // NOLINT JNI function name
                                                                           jobject obj,
                                                                           jint windowId,
                                                                           jint id,
                                                                           jfloat x,
                                                                           jfloat y) {
    CC_UNUSED_PARAM(env);
    CC_UNUSED_PARAM(obj);

    touchEvent.windowId = windowId;
    touchEvent.type = cc::TouchEvent::Type::ENDED;
    touchEvent.touches.emplace_back(x, y, id);
    cc::events::Touch::broadcast(touchEvent);
    touchEvent.touches.clear();
}

// NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionMove(JNIEnv *env, // NOLINT JNI function name
                                                                             jobject obj,
                                                                             jint windowId,
                                                                             jintArray ids,
                                                                             jfloatArray xs,
                                                                             jfloatArray ys) {
    CC_UNUSED_PARAM(obj);

    touchEvent.windowId = windowId;
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

    cc::events::Touch::broadcast(touchEvent);
    touchEvent.touches.clear();
}

// NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionCancel(JNIEnv *env, // NOLINT JNI function name
                                                                               jobject obj,
                                                                               jint windowId,
                                                                               jintArray ids,
                                                                               jfloatArray xs,
                                                                               jfloatArray ys) {
    CC_UNUSED_PARAM(obj);

    touchEvent.windowId = windowId;
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
    cc::events::Touch::broadcast(touchEvent);
    touchEvent.touches.clear();
}
}
