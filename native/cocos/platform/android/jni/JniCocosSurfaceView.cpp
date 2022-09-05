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

#include <android/keycodes.h>
#include <android/log.h>
#include <android/native_window.h>
#include <android/native_window_jni.h>
#include <jni.h>
#include "base/memory/Memory.h"
#include "platform/android/AndroidPlatform.h"
#include "platform/java/jni/glue/JniNativeGlue.h"
#include "platform/java/modules/SystemWindow.h"
#include "platform/java/modules/SystemWindowManager.h"
#include "application/ApplicationManager.h"
#include "bindings/event/CustomEventTypes.h"

namespace {
struct cc::TouchEvent touchEvent;

class NativeWindowCache {
public:
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

    JNIEnv *env;

private:
    ANativeWindow *_nativeWindow{nullptr};
};

uint32_t getWindowIdFromWindowCache(jlong windowCacheHandle) {
    auto *windowCache = reinterpret_cast<NativeWindowCache *>(windowCacheHandle);
    auto *windowMgr = cc::BasePlatform::getPlatform()->getInterface<cc::SystemWindowManager>();
    cc::ISystemWindow *window = windowMgr->getWindowFromANativeWindow(windowCache->getNativeWindow());
    CC_ASSERT(window);
    return window->getWindowId();
}
} // namespace

//#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "JniCocosSurfaceView JNI", __VA_ARGS__)

extern "C" {

JNIEXPORT jlong Java_com_cocos_lib_CocosSurfaceView_constructNative(JNIEnv *env, jobject /*thiz*/) {//NOLINT JNI function name
    auto *cache = ccnew NativeWindowCache();
    cache->env = env;
    return reinterpret_cast<jlong>(cache);
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_destructNative(JNIEnv */*env*/, jobject /*thiz*/, jlong handle) {//NOLINT JNI function name
    auto *windowCache = reinterpret_cast<NativeWindowCache *>(handle);
    CC_SAFE_DELETE(windowCache);
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSizeChangedNative(JNIEnv */*env*/, jobject /*thiz*/, jlong handle, jint width, jint height) {//NOLINT JNI function name
    cc::WindowEvent ev;
    ev.windowId = getWindowIdFromWindowCache(handle);
    ev.type = cc::WindowEvent::Type::SIZE_CHANGED;
    ev.width = width;
    ev.height = height;
    auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
    platform->dispatchEvent(ev);
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSurfaceRedrawNeededNative(JNIEnv */*env*/, jobject /*thiz*/, jlong handle) {//NOLINT JNI function name
    //
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSurfaceCreatedNative(JNIEnv *env, jobject /*thiz*/, jlong handle, jobject surface) { //NOLINT JNI function name
    CC_UNUSED_PARAM(env);
    auto *windowCache = (NativeWindowCache *)handle;
    ANativeWindow *oldNativeWindow = windowCache->getNativeWindow();
    windowCache->setSurface(surface);
    ANativeWindow *nativeWindow = windowCache->getNativeWindow();

    auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
    auto *windowMgr = platform->getInterface<cc::SystemWindowManager>();
    if (oldNativeWindow) {
        auto *iSysWindow = windowMgr->getWindowFromANativeWindow(oldNativeWindow);
        auto *sysWindow = static_cast<cc::SystemWindow *>(iSysWindow);
        sysWindow->setWindowHandle(nativeWindow);

        cc::CustomEvent event;
        event.name = EVENT_RECREATE_WINDOW;
        event.args->ptrVal = reinterpret_cast<void *>(sysWindow->getWindowId());
        auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
        platform->dispatchEvent(event);
    } else {
        cc::ISystemWindowInfo info;
        info.width  = ANativeWindow_getWidth(nativeWindow);
        info.height = ANativeWindow_getHeight(nativeWindow);
        info.externalHandle = nativeWindow;
        cc::ISystemWindow *window = windowMgr->createWindow(info);
    }
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSurfaceChangedNative(JNIEnv *env,//NOLINT JNI function name
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
            auto *iSysWindow = CC_GET_PLATFORM_INTERFACE(cc::SystemWindowManager)->getWindowFromANativeWindow(oldNativeWindow);
            auto *sysWindow = static_cast<cc::SystemWindow *>(iSysWindow);
            sysWindow->setWindowHandle(newNativeWindow);

            cc::CustomEvent event;
            event.name = EVENT_RECREATE_WINDOW;
            event.args->ptrVal = reinterpret_cast<void *>(sysWindow->getWindowId());
            auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
            platform->dispatchEvent(event);
        }
        // Release the window we acquired earlier.
        if (oldNativeWindow != nullptr) {
            ANativeWindow_release(oldNativeWindow);
        }
    }
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosSurfaceView_onSurfaceDestroyedNative(JNIEnv *env, jobject /*thiz*/, jlong handle) { //NOLINT JNI function name
    auto *windowCache = (NativeWindowCache *)handle;
    ANativeWindow *nativeWindow = windowCache->getNativeWindow();

    // todo: destroy gfx surface
    auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
    cc::CustomEvent event;
    event.name = EVENT_DESTROY_WINDOW;
    event.args->ptrVal = reinterpret_cast<void *>(nativeWindow);
    platform->dispatchEvent(event);

}

// NOLINTNEXTLINE
JNIEXPORT void JNICALL
Java_com_cocos_lib_CocosTouchHandler_handleActionDown(JNIEnv *env,//NOLINT JNI function name
                                                      jobject obj,
                                                      jlong windowCacheHandle,
                                                      jint id,
                                                      jfloat x,
                                                      jfloat y) {
    CC_UNUSED_PARAM(env);
    CC_UNUSED_PARAM(obj);

    touchEvent.windowId = getWindowIdFromWindowCache(windowCacheHandle);
    touchEvent.type = cc::TouchEvent::Type::BEGAN;
    touchEvent.touches.emplace_back(x, y, id);
    auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
    platform->dispatchEvent(touchEvent);
    touchEvent.touches.clear();
}

// NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionUp(JNIEnv *env,//NOLINT JNI function name
                                                                           jobject obj,
                                                                           jlong windowCacheHandle,
                                                                           jint id,
                                                                           jfloat x,
                                                                           jfloat y) {
    CC_UNUSED_PARAM(env);
    CC_UNUSED_PARAM(obj);

    touchEvent.windowId = getWindowIdFromWindowCache(windowCacheHandle);
    touchEvent.type = cc::TouchEvent::Type::ENDED;
    touchEvent.touches.emplace_back(x, y, id);
    auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
    platform->dispatchEvent(touchEvent);
    touchEvent.touches.clear();
}

// NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionMove(JNIEnv *env,//NOLINT JNI function name
                                                                             jobject obj,
                                                                             jlong windowCacheHandle,
                                                                             jintArray ids,
                                                                             jfloatArray xs,
                                                                             jfloatArray ys) {
    CC_UNUSED_PARAM(obj);

    touchEvent.windowId = getWindowIdFromWindowCache(windowCacheHandle);
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

    auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
    platform->dispatchEvent(touchEvent);
    touchEvent.touches.clear();
}

// NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosTouchHandler_handleActionCancel(JNIEnv *env,//NOLINT JNI function name
                                                                               jobject obj,
                                                                               jlong windowCacheHandle,
                                                                               jintArray ids,
                                                                               jfloatArray xs,
                                                                               jfloatArray ys) {
    CC_UNUSED_PARAM(obj);

    touchEvent.windowId = getWindowIdFromWindowCache(windowCacheHandle);
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
    auto *platform = static_cast<cc::AndroidPlatform *>(cc::BasePlatform::getPlatform());
    platform->dispatchEvent(touchEvent);
    touchEvent.touches.clear();
}
}
