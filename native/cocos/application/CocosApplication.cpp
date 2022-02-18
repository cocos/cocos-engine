/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "application/CocosApplication.h"

#include "base/Macros.h"

#include "cocos/application/ApplicationObserverManager.h"
#include "cocos/bindings/event/CustomEventTypes.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "cocos/engine/BaseEngine.h"
#include "cocos/platform/interfaces/modules/IScreen.h"

namespace cc {

//const char *kDefaultWindowTitle = "cocos application demo";

CocosApplication::CocosApplication() {
    _engine = BaseEngine::createEngine();
    _engine->registrObserver(this);
}

CocosApplication::~CocosApplication() = default;

int CocosApplication::init() {
    if (_engine->init()) {
        return -1;
    }

    _engine->setExceptionCallback(std::bind(&CocosApplication::handleException, this, // NOLINT(modernize-avoid-bind)
                                            std::placeholders::_1, std::placeholders::_2, std::placeholders::_3));
    return 0;
}

int32_t CocosApplication::run(int argc, const char **argv) {
    CC_UNUSED_PARAM(argc);
    CC_UNUSED_PARAM(argv);
    return _engine->run();
}

void CocosApplication::pause() {
    _engine->pause();
}

void CocosApplication::resume() {
    _engine->resume();
}

void CocosApplication::restart() {
    _engine->restart();
}

void CocosApplication::close() {
    _engine->close();
}

BaseEngine::Ptr CocosApplication::getEngine() const {
    return _engine;
}

void CocosApplication::registrObserver(ApplicationObserver *observer) {
    _observers->registrObserver(observer);
}

void CocosApplication::unregistrObserver(ApplicationObserver *observer) {
    _observers->unregistrObserver(observer);
}

void CocosApplication::onEngineStart() {
    // TODO(cc): Process engine start events
}

void CocosApplication::onEnginePause() {
    // TODO(cc): Process engine pause events
}

void CocosApplication::onEngineResume() {
    // TODO(cc): Process engine resume events
}

void CocosApplication::onEngineClose() {
    // TODO(cc): Process engine close events
}

void CocosApplication::createWindow(const char *title,
                                    int32_t x, int32_t y, int32_t w,
                                    int32_t h, int32_t flags) {
    ISystemWindow *systemWidow{nullptr};
    systemWidow = _engine->getInterface<ISystemWindow>();
    CCASSERT(systemWidow != nullptr, "Invalid interface pointer");
    systemWidow->createWindow(title, x, y, w, h, flags);
}

void CocosApplication::handleException(const char *location, const char *message, const char *stack) {
    // Send exception information to server like Tencent Bugly.
    CC_LOG_ERROR("\nUncaught Exception:\n - location :  %s\n - msg : %s\n - detail : \n      %s\n", location, message, stack);
}

void CocosApplication::setJsDebugIpAndPort(const std::string &serverAddr, uint32_t port, bool isWaitForConnect) {
    _engine->setJsDebugIpAndPort(serverAddr, port, isWaitForConnect);
}

void CocosApplication::runJsScript(const std::string &filePath) {
    _engine->runJsScript(filePath);
}

void CocosApplication::setXXTeaKey(const std::string &key) {
    _engine->setXXTeaKey(key);
}

} // namespace cc
