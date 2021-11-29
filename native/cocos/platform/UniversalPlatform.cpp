/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "platform/UniversalPlatform.h"

#include "platform/interfaces/OSInterface.h"

#include "platform/interfaces/modules/IAccelerometer.h"
#include "platform/interfaces/modules/IBattery.h"
#include "platform/interfaces/modules/INetwork.h"
#include "platform/interfaces/modules/IScreen.h"
#include "platform/interfaces/modules/ISystem.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/IVibrator.h"

extern int  cocos_main(int argc, const char** argv); // NOLINT(readability-identifier-naming)
extern void cocos_destory();                         // NOLINT(readability-identifier-naming)

namespace cc {
UniversalPlatform::OSType UniversalPlatform::getOSType() const {
    return getInterface<ISystem>()->getOSType();
}

void UniversalPlatform::dispatchEvent(const OSEvent& ev) {
    bool isHandled = false;
    if (_handleEventCallback) {
        isHandled = (_handleEventCallback)(ev);
    }
    if (isHandled) {
        return;
    }
    if (_handleDefaultEventCallback) {
        isHandled = (_handleDefaultEventCallback)(ev);
    }
    if (!isHandled) {
        handleDefaultEvent(ev);
    }
}

void UniversalPlatform::dispatchTouchEvent(const OSEvent& ev) {
}

void UniversalPlatform::handleDefaultEvent(const OSEvent& ev) {
    // TODO(cc) : Follow-up support
}

void UniversalPlatform::setHandleEventCallback(HandleEventCallback cb) {
    _handleEventCallback = cb;
}

void UniversalPlatform::setHandleDefaultEventCallback(HandleEventCallback cb) {
    _handleDefaultEventCallback = cb;
}

int32_t UniversalPlatform::init() {
    registerInterface(ISystemWindow::createSystemWindowInterface());
    registerInterface(ISystem::createSystemInterface());
    registerInterface(INetwork::createNetworkInterface());
    registerInterface(IScreen::createScreenInterface());
    registerInterface(IBattery::createBatteryInterface());
    registerInterface(IVibrator::createVibratorInterface());
    registerInterface(IAccelerometer::createAccelerometerInterface());
    return 0;
}

int32_t UniversalPlatform::run(int argc, const char** argv) {
    if (cocos_main(argc, argv) != 0) {
        return -1;
    }
    return loop();
}

int UniversalPlatform::getSdkVersion() const {
    return 0;
}

void UniversalPlatform::runInPlatformThread(const ThreadCallback& task) {
    _mainTask = task;
}

void UniversalPlatform::runTask() {
    if (_mainTask) {
        _mainTask();
    }
}

int32_t UniversalPlatform::getFps() const {
    return _fps;
}

void UniversalPlatform::setFps(int32_t fps) {
    _fps = fps;
}

void UniversalPlatform::pollEvent() {
}

void UniversalPlatform::onPause() {
}

void UniversalPlatform::onResume() {
}

void UniversalPlatform::onClose() {
}

void UniversalPlatform::onDestory() {
    cocos_destory();
}

} // namespace cc
