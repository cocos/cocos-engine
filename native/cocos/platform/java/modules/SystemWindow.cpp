/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/java/modules/SystemWindow.h"
#include <fcntl.h>
#include <jni.h>
#include <unistd.h>
#include <functional>
#include <thread>
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/native_window.h>
#endif

#include "BasePlatform.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/JniImp.h"
#include "platform/java/jni/glue/JniNativeGlue.h"

namespace {
#ifndef JCLS_COCOSACTIVITY
    #define JCLS_COCOSACTIVITY "com/cocos/lib/CocosActivity"
#endif
} // namespace

namespace cc {
SystemWindow::SystemWindow(uint32_t windowId, void *externalHandle)
: _windowHandle(externalHandle), _windowId(windowId) {
}

void SystemWindow::setCursorEnabled(bool value) {
}

void SystemWindow::copyTextToClipboard(const ccstd::string &text) {
    copyTextToClipboardJNI(text);
}

void SystemWindow::setWindowHandle(void *handle) {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    std::lock_guard lock(_handleMutex);
    bool needNotify = _windowHandle == nullptr;
    _windowHandle = handle;
    if (needNotify) {
        _windowHandlePromise.set_value();
    }
#else
    _windowHandle = handle;
#endif
}

uintptr_t SystemWindow::getWindowHandle() const {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    std::lock_guard lock(const_cast<std::mutex &>(_handleMutex));
    if (!_windowHandle) {
        auto &future = const_cast<std::promise<void> &>(_windowHandlePromise);
        future.get_future().get();
    }
    CC_ASSERT(_windowHandle);
    return reinterpret_cast<uintptr_t>(_windowHandle);
#else
    return reinterpret_cast<uintptr_t>(
        JNI_NATIVE_GLUE()->getWindowHandle());
#endif
}

SystemWindow::Size SystemWindow::getViewSize() const {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    CC_ASSERT(_windowHandle);
    auto *nativeWindow = static_cast<ANativeWindow *>(_windowHandle);
    return Size{static_cast<float>(ANativeWindow_getWidth(nativeWindow)),
                static_cast<float>(ANativeWindow_getHeight(nativeWindow))};
#else
    return Size{static_cast<float>(JNI_NATIVE_GLUE()->getWidth()),
                static_cast<float>(JNI_NATIVE_GLUE()->getHeight())};
#endif
}
void SystemWindow::closeWindow() {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    finishActivity();
#else
    events::Close::broadcast();
    exit(0); //TODO(cc): better exit for ohos
#endif
}

bool SystemWindow::createWindow(const char *title, int x, int y, int w, int h, int flags) {
    CC_UNUSED_PARAM(title);
    CC_UNUSED_PARAM(flags);
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    cc::JniHelper::callObjectVoidMethod(cc::JniHelper::getActivity(), JCLS_COCOSACTIVITY, "createSurface", x, y, w, h, static_cast<jint>(_windowId));
#endif
    return true;
}

bool SystemWindow::createWindow(const char *title, int w, int h, int flags) {
    CC_UNUSED_PARAM(title);
    CC_UNUSED_PARAM(flags);
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    cc::JniHelper::callObjectVoidMethod(cc::JniHelper::getActivity(), JCLS_COCOSACTIVITY, "createSurface", 0, 0, w, h, static_cast<jint>(_windowId));
#endif
    return true;
}

} // namespace cc
