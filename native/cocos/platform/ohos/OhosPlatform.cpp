/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include <thread>

#include "modules/Screen.h"
#include "modules/System.h"
#include "platform/java/jni/glue/JniNativeGlue.h"
#include "platform/java/modules/Accelerometer.h"
#include "platform/java/modules/Battery.h"
#include "platform/java/modules/Network.h"
#include "platform/java/modules/SystemWindow.h"
#include "platform/java/modules/SystemWindowManager.h"
#include "platform/java/modules/Vibrator.h"
#include "platform/ohos/OhosPlatform.h"

#include "base/memory/Memory.h"
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
    registerInterface(std::make_shared<SystemWindowManager>());
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
}

void OhosPlatform::exit() {

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

ISystemWindow *OhosPlatform::createNativeWindow(uint32_t windowId, void *externalHandle) {
    return ccnew SystemWindow(windowId, externalHandle);
}

}; // namespace cc
