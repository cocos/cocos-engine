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

#include "platform/java/jni/glue/JniNativeGlue.h"
#include <functional>
#include <future>
#include "application/ApplicationManager.h"
#include "engine/EngineEvents.h"
#include "platform/BasePlatform.h"
#include "platform/java/jni/JniImp.h"
#include "platform/java/jni/glue/MessagePipe.h"
#include "platform/java/jni/log.h"
#include "platform/java/modules/SystemWindow.h"
#include "platform/java/modules/SystemWindowManager.h"

namespace cc {
JniNativeGlue::~JniNativeGlue() = default;

JniNativeGlue* JniNativeGlue::getInstance() {
    static JniNativeGlue jniNativeGlue;
    return &jniNativeGlue;
}

void JniNativeGlue::start(int argc, const char** argv) {
    _messagePipe = std::make_unique<MessagePipe>();

    BasePlatform* platform = cc::BasePlatform::getPlatform();
    if (platform->init()) {
        LOGV("Platform initialization failed");
    }
    platform->run(argc, argv);
}

void JniNativeGlue::setWindowHandle(NativeWindowType* window) {
    if (_pendingWindow) {
        writeCommandSync(JniCommand::JNI_CMD_TERM_WINDOW);
    }
    _pendingWindow = window;
    if (window) {
        writeCommandSync(JniCommand::JNI_CMD_INIT_WINDOW);
    }
}

void JniNativeGlue::setActivityGetter(std::function<NativeActivity(void)> getter) {
    _activityGetter = std::move(getter);
}

void* JniNativeGlue::getActivity() {
    return _activityGetter ? _activityGetter() : nullptr;
}

void JniNativeGlue::setEnvGetter(std::function<NativeEnv(void)> getter) {
    _envGetter = std::move(getter);
}

void* JniNativeGlue::getEnv() {
    return _envGetter ? _envGetter() : nullptr;
}

void JniNativeGlue::setResourceManager(ResourceManagerType* resourceManager) {
    _resourceManager = resourceManager;
}

ResourceManagerType* JniNativeGlue::getResourceManager() {
    return _resourceManager;
}

NativeWindowType* JniNativeGlue::getWindowHandle() {
    return _window;
}

void JniNativeGlue::setSdkVersion(int sdkVersion) {
    _sdkVersion = sdkVersion;
}

int JniNativeGlue::getSdkVersion() const {
    return _sdkVersion;
}

void JniNativeGlue::setObbPath(const std::string& path) {
    _obbPath = path;
}

std::string JniNativeGlue::getObbPath() const {
    return _obbPath;
}

void JniNativeGlue::setRunning(bool isRunning) {
    _threadPromise.set_value();
    _running = isRunning;
}

void JniNativeGlue::waitRunning() {
    _threadPromise.get_future().get();
}

bool JniNativeGlue::isRunning() const {
    return _running;
}

void JniNativeGlue::flushTasksOnGameThread() const {
    // Handle java events send by UI thread. Input events are handled here too.

    flushTasksOnGameThreadJNI();
    if (_animating) {
        flushTasksOnGameThreadAtForegroundJNI();
    }
}

void JniNativeGlue::writeCommandAsync(JniCommand cmd) {
    CommandMsg msg{.cmd = cmd, .callback = nullptr};
    _messagePipe->writeCommand(&msg, sizeof(msg));
}

void JniNativeGlue::writeCommandSync(JniCommand cmd) {
    std::promise<void> fu;
    CommandMsg msg{.cmd = cmd, .callback = [&fu]() {
                       fu.set_value();
                   }};
    _messagePipe->writeCommand(&msg, sizeof(msg));
    fu.get_future().get();
}

int JniNativeGlue::readCommand(CommandMsg* msg) {
    return _messagePipe->readCommand(msg, sizeof(CommandMsg));
}

int JniNativeGlue::readCommandWithTimeout(CommandMsg* cmd, int delayMS) {
    return _messagePipe->readCommandWithTimeout(cmd, sizeof(CommandMsg), delayMS);
}

bool JniNativeGlue::isPause() const {
    if (!_animating) {
        return true;
    }
    if (_appState == JniCommand::JNI_CMD_PAUSE) {
        return true;
    }
    return false;
}

void JniNativeGlue::onPause() {
    writeCommandAsync(JniCommand::JNI_CMD_PAUSE);
}

void JniNativeGlue::onResume() {
    writeCommandAsync(JniCommand::JNI_CMD_RESUME);
}

void JniNativeGlue::onLowMemory() {
    writeCommandAsync(JniCommand::JNI_CMD_LOW_MEMORY);
}

void JniNativeGlue::execCommand() {
    static CommandMsg msg;
    static bool runInLowRate{false};
    runInLowRate = !_animating || JniCommand::JNI_CMD_PAUSE == _appState;

    if (readCommandWithTimeout(&msg, runInLowRate ? 50 : 0) > 0) {
        preExecCmd(msg.cmd);
        engineHandleCmd(msg.cmd);
        postExecCmd(msg.cmd);
        if (msg.callback) {
            msg.callback();
        }
    }
}

void JniNativeGlue::preExecCmd(JniCommand cmd) {
    switch (cmd) {
        case JniCommand::JNI_CMD_INIT_WINDOW: {
            LOGV("JNI_CMD_INIT_WINDOW");
            _animating = true;
            _window = _pendingWindow;
        } break;
        case JniCommand::JNI_CMD_TERM_WINDOW:
            LOGV("JNI_CMD_TERM_WINDOW");
            _animating = false;
            break;
        case JniCommand::JNI_CMD_RESUME:
            LOGV("JNI_CMD_RESUME");
            _appState = cmd;
            break;
        case JniCommand::JNI_CMD_PAUSE:
            LOGV("JNI_CMD_PAUSE");
            _appState = cmd;
            break;
        default:
            break;
    }
}

void JniNativeGlue::engineHandleCmd(JniCommand cmd) {
    static bool isWindowInitialized = false;
    // Handle CMD here if needed.
    switch (cmd) {
        case JniCommand::JNI_CMD_INIT_WINDOW: {
            if (isWindowInitialized) {
                return;
            }
            isWindowInitialized = true;
            // cc::CustomEvent event;
            // event.name = EVENT_RECREATE_WINDOW;
            // event.args->ptrVal = reinterpret_cast<void*>(getWindowHandle());
            ISystemWindowInfo info;
            info.width = getWidth();
            info.height = getHeight();
            info.externalHandle = getWindowHandle();
            BasePlatform* platform = cc::BasePlatform::getPlatform();
            auto* windowMgr = platform->getInterface<SystemWindowManager>();
            CC_ASSERT(windowMgr != nullptr);
            windowMgr->createWindow(info);
            events::WindowRecreated::broadcast(ISystemWindow::mainWindowId);
        } break;
        case JniCommand::JNI_CMD_TERM_WINDOW: {
            events::WindowDestroy::broadcast(ISystemWindow::mainWindowId);
        } break;
        case JniCommand::JNI_CMD_RESUME: {
            events::WindowChanged::broadcast(WindowEvent::Type::SHOW);
        } break;
        case JniCommand::JNI_CMD_PAUSE: {
            events::WindowChanged::broadcast(WindowEvent::Type::HIDDEN);
        } break;
        case JniCommand::JNI_CMD_DESTROY: {
            LOGV("APP_CMD_DESTROY");
            events::WindowChanged::broadcast(WindowEvent::Type::CLOSE);
            setRunning(false);
        } break;
        case JniCommand::JNI_CMD_LOW_MEMORY: {
            events::LowMemory::broadcast();
            break;
        }
        default:
            break;
    }
}

void JniNativeGlue::postExecCmd(JniCommand cmd) {
    switch (cmd) {
        case JniCommand::JNI_CMD_TERM_WINDOW: {
#if CC_PLATFORM == CC_PLATFORM_ANDROID
            if (_window) {
                ANativeWindow_release(_window);
            }
#endif
            _window = nullptr;
        } break;
        default:
            break;
    }
}

int32_t JniNativeGlue::getWidth() const {
    int32_t width = 0;
    if (_window) {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
        width = ANativeWindow_getWidth(_window);
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
        width = NativeLayerHandle(_window, NativeLayerOps::GET_WIDTH);
#endif
    }
    return width;
}

int32_t JniNativeGlue::getHeight() const {
    int32_t height = 0;
    if (_window) {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
        height = ANativeWindow_getHeight(_window);
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
        height = NativeLayerHandle(_window, NativeLayerOps::GET_HEIGHT);
#endif
    }
    return height;
}

} // namespace cc
