/****************************************************************************
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

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
#include "EventDispatcher.h"
#include <cstdarg>
#include "cocos/application/ApplicationManager.h"
#include "cocos/bindings/jswrapper/HandleObject.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global_init.h"
#include "cocos/platform/interfaces/modules/ISystemWindow.h"
#include "cocos/platform/interfaces/modules/ISystemWindowManager.h"

namespace {
se::Value tickVal;
se::ValueArray tickArgsValArr(1);
ccstd::vector<se::Object *> jsTouchObjPool;
se::Object *jsTouchObjArray = nullptr;
se::Object *jsMouseEventObj = nullptr;
se::Object *jsKeyboardEventObj = nullptr;
se::Object *jsControllerEventArray = nullptr;
se::Object *jsControllerChangeEventArray = nullptr;
se::Object *jsResizeEventObj = nullptr;
se::Object *jsOrientationChangeObj = nullptr;
bool inited = false;
bool busListenerInited = false;

// attach the argument object to the function
void accessCacheArgObj(se::Object *func, se::Value *argObj, const char *cacheKey = "__reusedArgumentObject") {
    func->getProperty(cacheKey, argObj);
    if (argObj->isUndefined()) {
        se::HandleObject argumentObj(se::Object::createPlainObject());
        argObj->setObject(argumentObj);
    }
}

} // namespace
namespace cc {

events::EnterForeground::Listener EventDispatcher::listenerEnterForeground;
events::EnterBackground::Listener EventDispatcher::listenerEnterBackground;
events::WindowChanged::Listener EventDispatcher::listenerWindowChanged;
events::LowMemory::Listener EventDispatcher::listenerLowMemory;
events::Touch::Listener EventDispatcher::listenerTouch;
events::Mouse::Listener EventDispatcher::listenerMouse;
events::Keyboard::Listener EventDispatcher::listenerKeyboard;
events::Controller::Listener EventDispatcher::listenerConroller;
events::ControllerChange::Listener EventDispatcher::listenerConrollerChange;
events::Tick::Listener EventDispatcher::listenerTick;
events::Resize::Listener EventDispatcher::listenerResize;
events::Orientation::Listener EventDispatcher::listenerOrientation;
events::RestartVM::Listener EventDispatcher::listenerRestartVM;
events::Close::Listener EventDispatcher::listenerClose;
events::PointerLock::Listener EventDispatcher::listenerPointerLock;

uint32_t EventDispatcher::hashListenerId = 1;

bool EventDispatcher::initialized() {
    return inited && se::ScriptEngine::getInstance()->isValid();
}

void EventDispatcher::init() {
    inited = true;
    se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
        EventDispatcher::destroy();
    });

    if (!busListenerInited) {
        listenerTouch.bind(&dispatchTouchEvent);
        listenerMouse.bind(&dispatchMouseEvent);
        listenerKeyboard.bind(&dispatchKeyboardEvent);
        listenerConroller.bind(&dispatchControllerEvent);
        listenerConrollerChange.bind(&dispatchControllerChangeEvent);
        listenerTick.bind(&dispatchTickEvent);
        listenerResize.bind(&dispatchResizeEvent);
        listenerOrientation.bind(&dispatchOrientationChangeEvent);
        listenerEnterBackground.bind(&dispatchEnterBackgroundEvent);
        listenerEnterForeground.bind(&dispatchEnterForegroundEvent);
        listenerLowMemory.bind(&dispatchMemoryWarningEvent);
        listenerClose.bind(&dispatchCloseEvent);
        listenerRestartVM.bind(&dispatchRestartVM);
        listenerPointerLock.bind(&dispatchPointerlockChangeEvent);
        busListenerInited = true;
    }
}

void EventDispatcher::destroy() {
    for (auto *touchObj : jsTouchObjPool) {
        touchObj->unroot();
        touchObj->decRef();
    }
    jsTouchObjPool.clear();

    if (jsTouchObjArray != nullptr) {
        jsTouchObjArray->unroot();
        jsTouchObjArray->decRef();
        jsTouchObjArray = nullptr;
    }

    if (jsControllerEventArray != nullptr) {
        jsControllerEventArray->unroot();
        jsControllerEventArray->decRef();
        jsControllerEventArray = nullptr;
    }

    if (jsControllerChangeEventArray != nullptr) {
        jsControllerChangeEventArray->unroot();
        jsControllerChangeEventArray->decRef();
        jsControllerChangeEventArray = nullptr;
    }

    if (jsMouseEventObj != nullptr) {
        jsMouseEventObj->unroot();
        jsMouseEventObj->decRef();
        jsMouseEventObj = nullptr;
    }

    if (jsKeyboardEventObj != nullptr) {
        jsKeyboardEventObj->unroot();
        jsKeyboardEventObj->decRef();
        jsKeyboardEventObj = nullptr;
    }

    if (jsResizeEventObj != nullptr) {
        jsResizeEventObj->unroot();
        jsResizeEventObj->decRef();
        jsResizeEventObj = nullptr;
    }

    if (jsOrientationChangeObj != nullptr) {
        jsOrientationChangeObj->unroot();
        jsOrientationChangeObj->decRef();
        jsOrientationChangeObj = nullptr;
    }

    inited = false;
    tickVal.setUndefined();
}

void EventDispatcher::dispatchTouchEvent(const TouchEvent &touchEvent) {
    se::AutoHandleScope scope;
    if (!jsTouchObjArray) {
        jsTouchObjArray = se::Object::createArrayObject(0);
        jsTouchObjArray->root();
    }

    jsTouchObjArray->setProperty("length", se::Value(static_cast<uint32_t>(touchEvent.touches.size())));

    while (jsTouchObjPool.size() < touchEvent.touches.size()) {
        se::Object *touchObj = se::Object::createPlainObject();
        touchObj->root();
        jsTouchObjPool.emplace_back(touchObj);
    }

    uint32_t touchIndex = 0;
    int poolIndex = 0;
    for (const auto &touch : touchEvent.touches) {
        se::Object *jsTouch = jsTouchObjPool.at(poolIndex++);
        jsTouch->setProperty("identifier", se::Value(touch.index));
        jsTouch->setProperty("clientX", se::Value(touch.x));
        jsTouch->setProperty("clientY", se::Value(touch.y));
        jsTouch->setProperty("pageX", se::Value(touch.x));
        jsTouch->setProperty("pageY", se::Value(touch.y));

        jsTouchObjArray->setArrayElement(touchIndex, se::Value(jsTouch));
        ++touchIndex;
    }

    const char *eventName = nullptr;
    switch (touchEvent.type) {
        case TouchEvent::Type::BEGAN:
            eventName = "onTouchStart";
            break;
        case TouchEvent::Type::MOVED:
            eventName = "onTouchMove";
            break;
        case TouchEvent::Type::ENDED:
            eventName = "onTouchEnd";
            break;
        case TouchEvent::Type::CANCELLED:
            eventName = "onTouchCancel";
            break;
        default:
            CC_ABORT();
            break;
    }

    se::ValueArray args;
    args.emplace_back(se::Value(jsTouchObjArray));
    args.emplace_back(se::Value(touchEvent.windowId));
    EventDispatcher::doDispatchJsEvent(eventName, args);
}

void EventDispatcher::dispatchMouseEvent(const MouseEvent &mouseEvent) {
    se::AutoHandleScope scope;
    if (!jsMouseEventObj) {
        jsMouseEventObj = se::Object::createPlainObject();
        jsMouseEventObj->root();
    }

    const auto &xVal = se::Value(mouseEvent.x);
    const auto &yVal = se::Value(mouseEvent.y);
    const MouseEvent::Type type = mouseEvent.type;

    if (type == MouseEvent::Type::WHEEL) {
        jsMouseEventObj->setProperty("wheelDeltaX", xVal);
        jsMouseEventObj->setProperty("wheelDeltaY", yVal);
    } else {
        if (type == MouseEvent::Type::DOWN || type == MouseEvent::Type::UP) {
            jsMouseEventObj->setProperty("button", se::Value(mouseEvent.button));
        }
        jsMouseEventObj->setProperty("x", xVal);
        jsMouseEventObj->setProperty("y", yVal);
        if (type == MouseEvent::Type::MOVE) {
            const auto &xDelta = se::Value(mouseEvent.xDelta);
            const auto &yDelta = se::Value(mouseEvent.yDelta);
            jsMouseEventObj->setProperty("xDelta", xDelta);
            jsMouseEventObj->setProperty("yDelta", yDelta);
        }
    }

    jsMouseEventObj->setProperty("windowId", se::Value(mouseEvent.windowId));

    const char *eventName = nullptr;
    const char *jsFunctionName = nullptr;
    switch (type) {
        case MouseEvent::Type::DOWN:
            jsFunctionName = "onMouseDown";
            break;
        case MouseEvent::Type::MOVE:
            jsFunctionName = "onMouseMove";
            break;
        case MouseEvent::Type::UP:
            jsFunctionName = "onMouseUp";
            break;
        case MouseEvent::Type::WHEEL:
            jsFunctionName = "onMouseWheel";
            break;
        default:
            CC_ABORT();
            break;
    }

    se::ValueArray args;
    args.emplace_back(se::Value(jsMouseEventObj));
    EventDispatcher::doDispatchJsEvent(jsFunctionName, args);
}

void EventDispatcher::dispatchKeyboardEvent(const KeyboardEvent &keyboardEvent) {
    se::AutoHandleScope scope;
    if (!jsKeyboardEventObj) {
        jsKeyboardEventObj = se::Object::createPlainObject();
        jsKeyboardEventObj->root();
    }

    const char *eventName = nullptr;
    switch (keyboardEvent.action) {
        case KeyboardEvent::Action::PRESS:
        case KeyboardEvent::Action::REPEAT:
            eventName = "onKeyDown";
            break;
        case KeyboardEvent::Action::RELEASE:
            eventName = "onKeyUp";
            break;
        default:
            CC_ABORT();
            break;
    }

    jsKeyboardEventObj->setProperty("altKey", se::Value(keyboardEvent.altKeyActive));
    jsKeyboardEventObj->setProperty("ctrlKey", se::Value(keyboardEvent.ctrlKeyActive));
    jsKeyboardEventObj->setProperty("metaKey", se::Value(keyboardEvent.metaKeyActive));
    jsKeyboardEventObj->setProperty("shiftKey", se::Value(keyboardEvent.shiftKeyActive));
    jsKeyboardEventObj->setProperty("repeat", se::Value(keyboardEvent.action == KeyboardEvent::Action::REPEAT));
    jsKeyboardEventObj->setProperty("keyCode", se::Value(keyboardEvent.key));
    jsKeyboardEventObj->setProperty("windowId", se::Value(keyboardEvent.windowId));
    jsKeyboardEventObj->setProperty("code", se::Value(keyboardEvent.code));

    se::ValueArray args;
    args.emplace_back(se::Value(jsKeyboardEventObj));
    EventDispatcher::doDispatchJsEvent(eventName, args);
}

void EventDispatcher::dispatchControllerEvent(const ControllerEvent &controllerEvent) {
    se::AutoHandleScope scope;
    if (!jsControllerEventArray) {
        jsControllerEventArray = se::Object::createArrayObject(0);
        jsControllerEventArray->root();
    }

    const char *eventName = "onControllerInput";
    if (controllerEvent.type == ControllerEvent::Type::HANDLE) {
        eventName = "onHandleInput";
    }
    uint32_t controllerIndex = 0;
    jsControllerEventArray->setProperty("length", se::Value(static_cast<uint32_t>(controllerEvent.controllerInfos.size())));

    for (const auto &controller : controllerEvent.controllerInfos) {
        se::HandleObject jsController{se::Object::createPlainObject()};
        jsController->setProperty("id", se::Value(controller->napdId));

        se::HandleObject jsButtonInfoList{se::Object::createArrayObject(static_cast<uint32_t>(controller->buttonInfos.size()))};

        uint32_t buttonIndex = 0;
        for (const auto &buttonInfo : controller->buttonInfos) {
            se::HandleObject jsButtonInfo{se::Object::createPlainObject()};
            jsButtonInfo->setProperty("code", se::Value(static_cast<uint32_t>(buttonInfo.key)));
            jsButtonInfo->setProperty("isPressed", se::Value(static_cast<uint32_t>(buttonInfo.isPress)));
            jsButtonInfoList->setArrayElement(buttonIndex, se::Value(jsButtonInfo));
            buttonIndex++;
        }

        se::HandleObject jsAxisInfoList{se::Object::createArrayObject(static_cast<uint32_t>(controller->axisInfos.size()))};

        uint32_t axisIndex = 0;
        for (const auto &axisInfo : controller->axisInfos) {
            se::HandleObject jsAxisInfo{se::Object::createPlainObject()};
            jsAxisInfo->setProperty("code", se::Value(static_cast<uint32_t>(axisInfo.axis)));
            jsAxisInfo->setProperty("value", se::Value(axisInfo.value));
            jsAxisInfoList->setArrayElement(axisIndex, se::Value(jsAxisInfo));
            axisIndex++;
        }

        se::HandleObject jsTouchInfoList{se::Object::createArrayObject(static_cast<uint32_t>(controller->touchInfos.size()))};

        uint32_t touchIndex = 0;
        for (const auto &touchInfo : controller->touchInfos) {
            se::HandleObject jsTouchInfo{se::Object::createPlainObject()};
            jsTouchInfo->setProperty("code", se::Value(static_cast<uint32_t>(touchInfo.key)));
            jsTouchInfo->setProperty("value", se::Value(touchInfo.value));
            jsTouchInfoList->setArrayElement(touchIndex, se::Value(jsTouchInfo));
            touchIndex++;
        }
        jsController->setProperty("axisInfoList", se::Value(jsAxisInfoList));
        jsController->setProperty("buttonInfoList", se::Value(jsButtonInfoList));
        jsController->setProperty("touchInfoList", se::Value(jsTouchInfoList));

        jsControllerEventArray->setArrayElement(controllerIndex, se::Value(jsController));
        controllerIndex++;
    }
    se::ValueArray args;
    args.emplace_back(se::Value(jsControllerEventArray));
    EventDispatcher::doDispatchJsEvent(eventName, args);
}

void EventDispatcher::dispatchControllerChangeEvent(const ControllerChangeEvent &changeEvent) {
    se::AutoHandleScope scope;
    if (!jsControllerChangeEventArray) {
        jsControllerChangeEventArray = se::Object::createArrayObject(0);
        jsControllerChangeEventArray->root();
    }

    const char *eventName = "onControllerChange";
    jsControllerChangeEventArray->setProperty("length", se::Value(static_cast<uint32_t>(changeEvent.controllerIds.size())));

    int index = 0;
    for (const auto id : changeEvent.controllerIds) {
        jsControllerChangeEventArray->setArrayElement(index++, se::Value(id));
    }
    se::ValueArray args;
    args.emplace_back(se::Value(jsControllerChangeEventArray));
    EventDispatcher::doDispatchJsEvent(eventName, args);
}

void EventDispatcher::dispatchTickEvent(float /*dt*/) {
    if (!se::ScriptEngine::getInstance()->isValid()) {
        return;
    }

    se::AutoHandleScope scope;
    if (tickVal.isUndefined()) {
        se::ScriptEngine::getInstance()->getGlobalObject()->getProperty("gameTick", &tickVal);
    }

    static std::chrono::steady_clock::time_point prevTime;
    prevTime = std::chrono::steady_clock::now();

    int64_t milliSeconds = std::chrono::duration_cast<std::chrono::milliseconds>(prevTime - se::ScriptEngine::getInstance()->getStartTime()).count();
    tickArgsValArr[0].setDouble(static_cast<double>(milliSeconds));

    if (!tickVal.isUndefined()) {
        tickVal.toObject()->call(tickArgsValArr, nullptr);
    }
}
// NOLINTNEXTLINE
void EventDispatcher::dispatchResizeEvent(int width, int height, uint32_t windowId) {
    se::AutoHandleScope scope;
    if (!jsResizeEventObj) {
        jsResizeEventObj = se::Object::createPlainObject();
        jsResizeEventObj->root();
    }

    jsResizeEventObj->setProperty("windowId", se::Value(windowId));
    jsResizeEventObj->setProperty("width", se::Value(width));
    jsResizeEventObj->setProperty("height", se::Value(height));

    se::ValueArray args;
    args.emplace_back(se::Value(jsResizeEventObj));
    EventDispatcher::doDispatchJsEvent("onResize", args);
}

void EventDispatcher::dispatchOrientationChangeEvent(int orientation) {
    se::AutoHandleScope scope;
    if (!jsOrientationChangeObj) {
        jsOrientationChangeObj = se::Object::createPlainObject();
        jsOrientationChangeObj->root();
    }

    jsOrientationChangeObj->setProperty("orientation", se::Value(orientation));

    se::ValueArray args;
    args.emplace_back(se::Value(jsOrientationChangeObj));
    EventDispatcher::doDispatchJsEvent("onOrientationChanged", args);
}

void EventDispatcher::dispatchEnterBackgroundEvent() {
    EventDispatcher::doDispatchJsEvent("onPause", se::EmptyValueArray);
}

void EventDispatcher::dispatchEnterForegroundEvent() {
    EventDispatcher::doDispatchJsEvent("onResume", se::EmptyValueArray);
}

void EventDispatcher::dispatchMemoryWarningEvent() {
    EventDispatcher::doDispatchJsEvent("onMemoryWarning", se::EmptyValueArray);
}

void EventDispatcher::dispatchRestartVM() {
    EventDispatcher::doDispatchJsEvent("onRestartVM", se::EmptyValueArray);
}

void EventDispatcher::dispatchCloseEvent() {
    EventDispatcher::doDispatchJsEvent("onClose", se::EmptyValueArray);
}

void EventDispatcher::dispatchPointerlockChangeEvent(bool value) {
    se::ValueArray args;
    args.emplace_back(se::Value(value));
    EventDispatcher::doDispatchJsEvent("onPointerlockChange", args);
}

void EventDispatcher::doDispatchJsEvent(const char *jsFunctionName, const std::vector<se::Value> &args) {
    if (!se::ScriptEngine::getInstance()->isValid()) {
        return;
    }

    se::AutoHandleScope scope;
    CC_ASSERT(inited);

    se::Value func;
    __jsbObj->getProperty(jsFunctionName, &func);
    if (func.isObject() && func.toObject()->isFunction()) {
        func.toObject()->call(args, nullptr);
    }
}

} // end of namespace cc
