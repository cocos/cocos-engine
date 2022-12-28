/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "application/CocosApplication.h"

#include "base/Macros.h"

#include "ApplicationManager.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_classtype.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/bindings/manual/jsb_module_register.h"
#include "cocos/engine/BaseEngine.h"
#include "cocos/platform/interfaces/modules/IScreen.h"
#include "cocos/platform/interfaces/modules/ISystemWindowManager.h"

namespace cc {

CocosApplication::CocosApplication() {
    _engine = BaseEngine::createEngine();
}

CocosApplication::~CocosApplication() {
    unregisterAllEngineEvents();
}

void CocosApplication::unregisterAllEngineEvents() {
    if (_engine != nullptr) {
        _engine->off(_engineEvents);
    }
}

int CocosApplication::init() {
    if (_engine->init()) {
        return -1;
    }
    unregisterAllEngineEvents();

    _systemWindow = CC_GET_MAIN_SYSTEM_WINDOW();

    _engineEvents = _engine->on<BaseEngine::EngineStatusChange>([this](BaseEngine * /*emitter*/, BaseEngine::EngineStatus status) {
        switch (status) {
            case BaseEngine::ON_START:
                this->onStart();
                break;
            case BaseEngine::ON_RESUME:
                this->onResume();
                break;
            case BaseEngine::ON_PAUSE:
                this->onPause();
                break;
            case BaseEngine::ON_CLOSE:
                this->onClose();
                break;
            default:
                CC_ABORT();
        }
    });

    se::ScriptEngine *se = se::ScriptEngine::getInstance();

    jsb_init_file_operation_delegate();

    se->setExceptionCallback(
        std::bind(&CocosApplication::handleException, this, // NOLINT(modernize-avoid-bind)
                  std::placeholders::_1, std::placeholders::_2, std::placeholders::_3));

    jsb_register_all_modules();
#if CC_EDITOR
    auto isolate = v8::Isolate::GetCurrent();
    se->start(isolate);
#else
    se->start();
#endif

#if (CC_PLATFORM == CC_PLATFORM_IOS)
    auto logicSize = _systemWindow->getViewSize();
    IScreen *screen = _engine->getInterface<IScreen>();
    float pixelRatio = screen->getDevicePixelRatio();
    uint32_t windowId = _systemWindow->getWindowId();
    events::Resize::broadcast(logicSize.width * pixelRatio, logicSize.height * pixelRatio, windowId);
#endif
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
// IMPORTANT!!The method `onClose` is a function to be listen close event, while `close` is a jsb binding method mean to close the whole application.
void CocosApplication::close() {
    _systemWindow->closeWindow();
}

BaseEngine::Ptr CocosApplication::getEngine() const {
    return _engine;
}

const std::vector<std::string> &CocosApplication::getArguments() const {
    return _argv;
}

void CocosApplication::setArgumentsInternal(int argc, const char *argv[]) {
    _argv.clear();
    _argv.reserve(argc);
    for (int i = 0; i < argc; ++i) {
        _argv.emplace_back(argv[i]);
    }
}

void CocosApplication::onStart() {
    // TODO(cc): Handling engine start events
}

void CocosApplication::onPause() {
    // TODO(cc): Handling pause events
}

void CocosApplication::onResume() {
    // TODO(cc): Handling resume events
}

void CocosApplication::onClose() {
    _engine->close();
}

void CocosApplication::setDebugIpAndPort(const ccstd::string &serverAddr, uint32_t port, bool isWaitForConnect) {
    // Enable debugger here
    jsb_enable_debugger(serverAddr, port, isWaitForConnect);
}

void CocosApplication::runScript(const ccstd::string &filePath) {
    jsb_run_script(filePath);
}

void CocosApplication::handleException(const char *location, const char *message, const char *stack) {
    // Send exception information to server like Tencent Bugly.
    CC_LOG_ERROR("\nUncaught Exception:\n - location :  %s\n - msg : %s\n - detail : \n      %s\n", location, message, stack);
}

void CocosApplication::setXXTeaKey(const ccstd::string &key) {
    jsb_set_xxtea_key(key);
}
#if CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_LINUX || CC_PLATFORM == CC_PLATFORM_QNX || CC_PLATFORM == CC_PLATFORM_MACOS
void CocosApplication::createWindow(const char *title, int32_t w,
                                    int32_t h, int32_t flags) {
    _systemWindow->createWindow(title, w, h, flags);
}

void CocosApplication::createWindow(const char *title,
                                    int32_t x, int32_t y, int32_t w,
                                    int32_t h, int32_t flags) {
    _systemWindow->createWindow(title, x, y, w, h, flags);
}
#endif

} // namespace cc
