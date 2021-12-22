/****************************************************************************
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "cocos/bindings/event/CustomEventTypes.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_classtype.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/bindings/manual/jsb_module_register.h"
#include "cocos/engine/BaseEngine.h"
#include "cocos/platform/interfaces/modules/IScreen.h"

namespace cc {

//const char *kDefaultWindowTitle = "cocos application demo";

CocosApplication::CocosApplication() {
    _engine      = BaseEngine::createEngine();
    _systemWidow = _engine->getInterface<ISystemWindow>();
    CCASSERT(_systemWidow != nullptr, "Invalid interface pointer");
}

CocosApplication::~CocosApplication() = default;

int CocosApplication::init() {
    if (_engine->init()) {
        return -1;
    }
    auto callback = std::bind(&CocosApplication::handleAppEvent, this, std::placeholders::_1); // NOLINT(modernize-avoid-bind)
    _engine->addEventCallback(OSEventType::APP_OSEVENT, callback);

    se::ScriptEngine *se = se::ScriptEngine::getInstance();

    jsb_init_file_operation_delegate();

    se->setExceptionCallback(
        std::bind(&CocosApplication::handleException, this,                             // NOLINT(modernize-avoid-bind)
                  std::placeholders::_1, std::placeholders::_2, std::placeholders::_3));

    jsb_register_all_modules();

    se->start();

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    auto     logicSize  = _systemWidow->getViewSize();
    IScreen *screen     = _engine->getInterface<IScreen>();
    float    pixelRatio = screen->getDevicePixelRatio();
    cc::EventDispatcher::dispatchResizeEvent(logicSize.x * pixelRatio, logicSize.y * pixelRatio);
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

void CocosApplication::close() {
    _engine->close();
}

BaseEngine::Ptr CocosApplication::getEngine() const {
    return _engine;
}

void CocosApplication::onPause() {
    // TODO(cc): Handling pause events
}

void CocosApplication::onResume() {
    // TODO(cc): Handling resume events
}

void CocosApplication::onClose() {
    // TODO(cc): Handling close events
}

void CocosApplication::setJsDebugIpAndPort(const std::string &serverAddr, uint32_t port, bool isWaitForConnect) {
#if defined(CC_DEBUG) && (CC_DEBUG > 0)
    // Enable debugger here
    jsb_enable_debugger(serverAddr, port, isWaitForConnect);
#endif
}

void CocosApplication::runJsScript(const std::string &filePath) {
    jsb_run_script(filePath);
}

void CocosApplication::handleException(const char *location, const char *message, const char *stack) {
    // Send exception information to server like Tencent Bugly.
    CC_LOG_ERROR("\nUncaught Exception:\n - location :  %s\n - msg : %s\n - detail : \n      %s\n", location, message, stack);
}

void CocosApplication::setXXTeaKey(const std::string &key) {
    jsb_set_xxtea_key(key);
}

void CocosApplication::createWindow(const char *title,
                                    int32_t x, int32_t y, int32_t w,
                                    int32_t h, int32_t flags) {
    _systemWidow->createWindow(title, x, y, w, h, flags);
}

void CocosApplication::handleAppEvent(const OSEvent &ev) {
    const AppEvent &appEv = OSEvent::castEvent<AppEvent>(ev);
    switch (appEv.type) {
        case AppEvent::Type::RESUME:
            onResume();
            break;
        case AppEvent::Type::PAUSE:
            onPause();
            break;
        case AppEvent::Type::CLOSE:
            onClose();
            break;
        default:
            break;
    }
}

} // namespace cc
