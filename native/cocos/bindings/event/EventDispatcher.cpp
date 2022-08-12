/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

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
#include "EventDispatcher.h"
#include <cstdarg>
#include "cocos/application/ApplicationManager.h"
#include "cocos/bindings/event/CustomEventTypes.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global_init.h"
#include "cocos/platform/interfaces/modules/ISystemWindow.h"

namespace {
se::Value tickVal;
se::ValueArray tickArgsValArr(1);
ccstd::vector<se::Object *> jsTouchObjPool;
se::Object *jsTouchObjArray = nullptr;
se::Object *jsMouseEventObj = nullptr;
se::Object *jsKeyboardEventObj = nullptr;
se::Object *jsControllerEventArray = nullptr;
se::Object *jsResizeEventObj = nullptr;
se::Object *jsOrientationEventObj = nullptr;
bool inited = false;
} // namespace
namespace cc {

ccstd::unordered_map<ccstd::string, EventDispatcher::Node *> EventDispatcher::listeners;
uint32_t EventDispatcher::hashListenerId = 1;

bool EventDispatcher::initialized() {
    return inited && se::ScriptEngine::getInstance()->isValid();
};

void EventDispatcher::init() {
    inited = true;
    se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
        EventDispatcher::destroy();
    });
}

void EventDispatcher::destroy() {
    removeAllEventListeners();

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

    if (jsOrientationEventObj != nullptr) {
        jsOrientationEventObj->unroot();
        jsOrientationEventObj->decRef();
        jsOrientationEventObj = nullptr;
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
            CC_ASSERT(false);
            break;
    }

    se::ValueArray args;
    args.emplace_back(se::Value(jsTouchObjArray));
    EventDispatcher::doDispatchJsEvent(eventName, args);
    EventDispatcher::dispatchCustomEvent(eventName,0);
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
    }

    const char *eventName = nullptr;
    const char *jsFunctionName = nullptr;
    switch (type) {
        case MouseEvent::Type::DOWN:
            eventName = EVENT_MOUSE_DOWN;
            jsFunctionName = "onMouseDown";
            break;
        case MouseEvent::Type::MOVE:
            eventName = EVENT_MOUSE_MOVE;
            jsFunctionName = "onMouseMove";
            break;
        case MouseEvent::Type::UP:
            eventName = EVENT_MOUSE_UP;
            jsFunctionName = "onMouseUp";
            break;
        case MouseEvent::Type::WHEEL:
            eventName = EVENT_MOUSE_WHEEL;
            jsFunctionName = "onMouseWheel";
            break;
        default:
            CC_ASSERT(false);
            break;
    }

    se::ValueArray args;
    args.emplace_back(se::Value(jsMouseEventObj));
    EventDispatcher::doDispatchJsEvent(jsFunctionName, args);
    EventDispatcher::dispatchCustomEvent(eventName, 0);
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
            CC_ASSERT(false);
            break;
    }

    jsKeyboardEventObj->setProperty("altKey", se::Value(keyboardEvent.altKeyActive));
    jsKeyboardEventObj->setProperty("ctrlKey", se::Value(keyboardEvent.ctrlKeyActive));
    jsKeyboardEventObj->setProperty("metaKey", se::Value(keyboardEvent.metaKeyActive));
    jsKeyboardEventObj->setProperty("shiftKey", se::Value(keyboardEvent.shiftKeyActive));
    jsKeyboardEventObj->setProperty("repeat", se::Value(keyboardEvent.action == KeyboardEvent::Action::REPEAT));
    jsKeyboardEventObj->setProperty("keyCode", se::Value(keyboardEvent.key));
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
    uint32_t    controllerIndex = 0;
    jsControllerEventArray->setProperty("length", se::Value(static_cast<uint32_t>(controllerEvent.controllerInfos.size())));

    for (const auto &controller : controllerEvent.controllerInfos) {
        auto *jsController = se::Object::createPlainObject();
        jsController->setProperty("number", se::Value(controller->napdId));

        auto *jsButtonInfoList = se::Object::createArrayObject(0);
        jsButtonInfoList->setProperty("length", se::Value(static_cast<uint32_t>(controller->buttonInfos.size())));

        uint32_t buttonIndex       = 0;
        for (const auto &buttonInfo : controller->buttonInfos) {
            auto *jsButtonInfo = se::Object::createPlainObject();
            jsButtonInfo->setProperty("code", se::Value(static_cast<uint32_t>(buttonInfo.key)));
            jsButtonInfo->setProperty("isPressed", se::Value(static_cast<uint32_t>(buttonInfo.isPress)));
            jsButtonInfoList->setArrayElement(buttonIndex, se::Value(jsButtonInfo));
            buttonIndex++;
        }

        auto *jsAxisInfoList = se::Object::createArrayObject(0);
        jsAxisInfoList->setProperty("length", se::Value(static_cast<uint32_t>(controller->axisInfos.size())));

        uint32_t axisIndex = 0;
        for (const auto &axisInfo : controller->axisInfos) {
            auto *jsAxisInfo = se::Object::createPlainObject();
            jsAxisInfo->setProperty("code", se::Value(static_cast<uint32_t>(axisInfo.axis)));
            jsAxisInfo->setProperty("value", se::Value(axisInfo.value));
            jsAxisInfoList->setArrayElement(axisIndex, se::Value(jsAxisInfo));
            axisIndex++;
        }
        jsController->setProperty("axisInfoList", se::Value(jsAxisInfoList));
        jsController->setProperty("buttonInfoList", se::Value(jsButtonInfoList));

        jsControllerEventArray->setArrayElement(controllerIndex, se::Value(jsController));
        controllerIndex++;
    }
    se::ValueArray args;
    args.emplace_back(se::Value(jsControllerEventArray));
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

void EventDispatcher::dispatchResizeEvent(int width, int height) {
    se::AutoHandleScope scope;
    if (!jsResizeEventObj) {
        jsResizeEventObj = se::Object::createPlainObject();
        jsResizeEventObj->root();
    }

    jsResizeEventObj->setProperty("width", se::Value(width));
    jsResizeEventObj->setProperty("height", se::Value(height));

    se::ValueArray args;
    args.emplace_back(se::Value(jsResizeEventObj));
    EventDispatcher::doDispatchJsEvent("onResize", args);
    EventDispatcher::dispatchCustomEvent(EVENT_RESIZE, 0);
}

void EventDispatcher::dispatchOrientationChangeEvent(int orientation) {
    if (!se::ScriptEngine::getInstance()->isValid()) {
        return;
    }

    se::AutoHandleScope scope;
    CC_ASSERT(inited);

    if (jsOrientationEventObj == nullptr) {
        jsOrientationEventObj = se::Object::createPlainObject();
        jsOrientationEventObj->root();
    }

    se::Value func;
    __jsbObj->getProperty("onOrientationChanged", &func);
    if (func.isObject() && func.toObject()->isFunction()) {
        jsOrientationEventObj->setProperty("orientation", se::Value(orientation));

        se::ValueArray args;
        args.emplace_back(se::Value(jsOrientationEventObj));
        func.toObject()->call(args, nullptr);
    }
}

void EventDispatcher::dispatchEnterBackgroundEvent() {
    EventDispatcher::doDispatchJsEvent("onPause", se::EmptyValueArray);
    EventDispatcher::dispatchCustomEvent(EVENT_COME_TO_BACKGROUND, 0);
}

void EventDispatcher::dispatchEnterForegroundEvent() {
    EventDispatcher::doDispatchJsEvent("onResume", se::EmptyValueArray);
    EventDispatcher::dispatchCustomEvent(EVENT_COME_TO_FOREGROUND, 0);
}

void EventDispatcher::dispatchMemoryWarningEvent() {
    EventDispatcher::doDispatchJsEvent("onMemoryWarning", se::EmptyValueArray);
    EventDispatcher::dispatchCustomEvent(EVENT_MEMORY_WARNING, 0);
}

void EventDispatcher::dispatchRestartVM() {
    EventDispatcher::doDispatchJsEvent("onRestartVM", se::EmptyValueArray);
    EventDispatcher::dispatchCustomEvent(EVENT_RESTART_VM, 0);
}

void EventDispatcher::dispatchCloseEvent() {
    EventDispatcher::doDispatchJsEvent("onClose", se::EmptyValueArray);
    EventDispatcher::dispatchCustomEvent(EVENT_CLOSE, 0);
}

void EventDispatcher::dispatchDestroyWindowEvent() {
#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    EventDispatcher::dispatchCustomEvent(EVENT_DESTROY_WINDOW, 1,
                                         reinterpret_cast<void *>(CC_GET_PLATFORM_INTERFACE(ISystemWindow)->getWindowHandle()));
#else
    EventDispatcher::dispatchCustomEvent(EVENT_DESTROY_WINDOW, 0);
#endif
}

void EventDispatcher::dispatchRecreateWindowEvent() {
#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    EventDispatcher::dispatchCustomEvent(EVENT_RECREATE_WINDOW, 1,
                                         reinterpret_cast<void *>(CC_GET_PLATFORM_INTERFACE(ISystemWindow)->getWindowHandle()));
#else
    EventDispatcher::dispatchCustomEvent(EVENT_RECREATE_WINDOW, 0);
#endif
}

void EventDispatcher::dispatchSceneLoadEvent() {
    EventDispatcher::dispatchCustomEvent(EVENT_SCENE_LOAD, 0);
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

uint32_t EventDispatcher::addCustomEventListener(const ccstd::string &eventName, const CustomEventListener &listener) {
    Node *newNode = ccnew Node();
    newNode->listener = listener;
    newNode->listenerID = hashListenerId;
    newNode->next = nullptr;

    auto iter = listeners.find(eventName);
    if (iter == listeners.end()) {
        listeners.emplace(eventName, newNode);
    } else {
        Node *node = iter->second;
        CC_ASSERT(node != nullptr);
        Node *prev = nullptr;
        while (node != nullptr) {
            prev = node;
            node = node->next;
        }
        prev->next = newNode;
    }
    return hashListenerId++;
}

void EventDispatcher::removeCustomEventListener(const ccstd::string &eventName, uint32_t listenerID) {
    if (eventName.empty()) {
        return;
    }

    if (listenerID == 0) {
        return;
    }

    auto iter = listeners.find(eventName);
    if (iter != listeners.end()) {
        Node *prev = nullptr;
        Node *node = iter->second;
        while (node != nullptr) {
            if (node->listenerID == listenerID) {
                if (prev != nullptr) {
                    prev->next = node->next;
                } else if (node->next) {
                    listeners[eventName] = node->next;
                } else {
                    listeners.erase(iter);
                }

                delete node;
                return;
            }

            prev = node;
            node = node->next;
        }
    }
}

void EventDispatcher::removeAllCustomEventListeners(const ccstd::string &eventName) {
    auto iter = listeners.find(eventName);
    if (iter != listeners.end()) {
        Node *node = iter->second;
        while (node != nullptr) {
            Node *next = node->next;
            delete node;
            node = next;
        }
        listeners.erase(iter);
    }
}

void EventDispatcher::removeAllEventListeners() {
    for (auto &&node : listeners) {
        delete node.second;
    }
    listeners.clear();
    //start from 1 cuz 0 represents pause and resume
    hashListenerId = 1;
}

void EventDispatcher::dispatchCustomEvent(const char *eventName, int argNum, ...) {
    CC_ASSERT(eventName && (strcmp(eventName, "") != 0));
    CustomEvent event;
    event.name = eventName;
    va_list vl;
    va_start(vl, argNum);
    // Step through the list.
    for (int i = 0; i < argNum; ++i) {
        event.args[i] = va_arg(vl, EventParameterType);
    }
    va_end(vl);
    dispatchCustomEvent(event);
}
void EventDispatcher::dispatchCustomEvent(const CustomEvent &event) {
    auto iter = listeners.find(event.name);
    if (iter != listeners.end()) {
        Node *next = nullptr;
        Node *node = iter->second;
        while (node != nullptr) {
            next = node->next;
            node->listener(event);
            node = next;
        }
    }
}

} // end of namespace cc
