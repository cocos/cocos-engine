/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "platform/android/jni/glue/JniNativeGlue.h"

#include <android/asset_manager_jni.h>
#include <android/log.h>
#include <android/native_window_jni.h>
#include <android_native_app_glue.h>
#include <fcntl.h>
#include <jni.h>
#include <unistd.h>
#include <thread>
#include <vector>
#include "cocos/bindings/event/CustomEventTypes.h"
#include "platform/android/jni/JniCocosActivity.h"


#include "cocos/bindings/event/EventDispatcher.h"
#include "platform/android/FileUtils-android.h"
#include "platform/android/jni/JniCocosActivity.h"
#include "platform/java/jni/JniHelper.h"

namespace cc {
JniInteraction::JniInteraction() = default;

JniInteraction* JniInteraction::getInstance() {
    static JniInteraction cocosInstaction;
    return &cocosInstaction;
}

void JniInteraction::init() {
}

void JniInteraction::setObbPath(const std::string& path) {
    _obbPath = path;
}

void JniInteraction::setAAssetManager(AAssetManager* assetManager) {
    _assetManager = assetManager;
}

void JniInteraction::setWindow(ANativeWindow* window) {
    if (_pendingWindow) {
        writeCommandSync(ABILITY_CMD_TERM_WINDOW);
    }
    _pendingWindow = window;
}

void JniInteraction::initWithPendingWindow() {
    if (_pendingWindow) {
        writeCommandSync(ABILITY_CMD_INIT_WINDOW);
    }
}

void JniInteraction::preExecCmd(int8_t cmd) {
    switch (cmd) {
        case ABILITY_CMD_INIT_WINDOW: {
            LOGV("ABILITY_CMD_INIT_WINDOW");
            _window = _pendingWindow;
            setAnimating(true);
        } break;
        case ABILITY_CMD_TERM_WINDOW:
            LOGV("ABILITY_CMD_TERM_WINDOW");
            setAnimating(false);
            break;
        case ABILITY_CMD_RESUME:
            LOGV("ABILITY_CMD_RESUME");
            handlePauseResume(cmd);
            break;
        case ABILITY_CMD_PAUSE:
            LOGV("ABILITY_CMD_PAUSE");
            handlePauseResume(cmd);
            break;
        case ABILITY_CMD_DESTROY:
            LOGV("ABILITY_CMD_DESTROY");
            cc::cocosApp.destroyRequested = true;
            break;
        default:
            break;
    }
}

void JniInteraction::postExecCmd(int8_t cmd) {
    switch (cmd) {
        case ABILITY_CMD_TERM_WINDOW: {
            _window        = nullptr;
            _pendingWindow = nullptr;
        } break;
        default:
            break;
    }
}

void JniInteraction::setAppState(int8_t cmd) {
    /*
    std::unique_lock<std::mutex> lk(_mutex);
    writeCommand(cmd);
    while (_appState != cmd) {
        _cond.wait(lk);
    }
    */
    writeCommandSync(cmd);
}

void JniInteraction::handlePauseResume(int8_t cmd) {
    LOGV("appState=%d", cmd);
    _appState = static_cast<uint8_t>(cmd);
}

void JniInteraction::flushTasksOnGameThread() const {
    if (getAnimating()) {
        // Handle java events send by UI thread. Input events are handled here too.
        flushTasksOnGameThreadJNI();
    }
}

void JniInteraction::setRunning(bool isRunning) {
    _ThreadPromise.set_value();
    _running = isRunning;
    //_systemWindow = _platform->getInterfaces<SystemWindow>();
}

void JniInteraction::waitRunning() {
    _ThreadPromise.get_future().get();
}

bool JniInteraction::isRunning() {
    return _running;
}

ANativeWindow* JniInteraction::getWindowHandle() {
    return _window;
}

void JniInteraction::execCommand() {
    CommandMsg msg;
    if (readCommand(&msg) > 0) {
        preExecCmd(msg.cmd);
        engineHandleCmd(msg.cmd);
        postExecCmd(msg.cmd);
    }
}

bool JniInteraction::isPause() const {
    if (!getAnimating()) {
        return true;
    }
    if (_appState == APP_CMD_PAUSE) {
        return true;
    }
    return false;
}

void JniInteraction::engineHandleCmd(int cmd) {
    static bool isWindowInitialized = false;
    // Handle CMD here if needed.
    switch (cmd) {
        case APP_CMD_INIT_WINDOW: {
            if (!isWindowInitialized) {
                isWindowInitialized = true;
                return;
            }
            cc::CustomEvent event;
            event.name         = EVENT_RECREATE_WINDOW;
            event.args->ptrVal = reinterpret_cast<void*>(getWindowHandle());
            dispatchEvent(event);
        } break;
        case APP_CMD_TERM_WINDOW: {
            cc::CustomEvent event;
            event.name         = EVENT_DESTROY_WINDOW;
            event.args->ptrVal = reinterpret_cast<void*>(getWindowHandle());
            dispatchEvent(event);
        } break;
        case APP_CMD_RESUME: {
            WindowEvent ev;
            ev.type = WindowEvent::Type::SHOW;
            dispatchEvent(ev);
        } break;
        case APP_CMD_PAUSE: {
            WindowEvent ev;
            ev.type = WindowEvent::Type::HIDDEN;
            dispatchEvent(ev);
        } break;
        case APP_CMD_DESTROY: {
            LOGV("APP_CMD_DESTROY");
            WindowEvent ev;
            ev.type = WindowEvent::Type::CLOSE;
            dispatchEvent(ev);
        } break;
        case APP_CMD_LOW_MEMORY: {
            DeviceEvent ev;
            ev.type = DeviceEvent::Type::DEVICE_MEMORY;
            dispatchEvent(ev);
            break;
        }
        default:
            break;
    }
}

} // namespace cc
