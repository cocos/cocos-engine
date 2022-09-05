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

#include <thread>

#include "platform/ohos/OhosPlatform.h"
#include "platform/java/jni/glue/JniNativeGlue.h"
#include "platform/java/modules/Accelerometer.h"
#include "platform/java/modules/Battery.h"
#include "platform/java/modules/Network.h"
#include "platform/java/modules/SystemWindow.h"
#include "platform/java/modules/Vibrator.h"
#include "modules/Screen.h"
#include "modules/System.h"

namespace cc {
OhosPlatform::OhosPlatform() {
    _jniNativeGlue = JNI_NATIVE_GLUE();
}

int OhosPlatform::init() {
    registerInterface(std::make_shared<Accelerometer>());
    registerInterface(std::make_shared<Battery>());
    registerInterface(std::make_shared<Network>());
    registerInterface(std::make_shared<Screen>());
    registerInterface(std::make_shared<System>());
    registerInterface(std::make_shared<SystemWindow>());
    registerInterface(std::make_shared<Vibrator>());
    return 0;
}

int OhosPlatform::getSdkVersion() const {
    return _jniNativeGlue->getSdkVersion();
}

int32_t OhosPlatform::run(int argc, const char **argv) {
    std::thread mainLogicThread([this, argc, argv]() {
        waitWindowInitialized();
        UniversalPlatform::run(argc, argv);
        onDestroy();
    });
    mainLogicThread.detach();
    _jniNativeGlue->waitRunning();
    return 0;
}

void OhosPlatform::waitWindowInitialized() {
    _jniNativeGlue->setRunning(true);
    while (_jniNativeGlue->isRunning()) {
        pollEvent();
        NativeWindowType *wndHandle = _jniNativeGlue->getWindowHandle();
        if (wndHandle != nullptr) {
            break;
        }
    }
    _jniNativeGlue->setEventDispatch(this);
}

int32_t OhosPlatform::loop() {
    while (_jniNativeGlue->isRunning()) {
        pollEvent();
        runTask();
    }
    return 0;
}

void OhosPlatform::pollEvent() {
    _jniNativeGlue->execCommand();
    if (!_jniNativeGlue->isPause()) {
        std::this_thread::yield();
    }
    _jniNativeGlue->flushTasksOnGameThread();
}

}; // namespace cc
