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

#pragma once

#include <functional>
#include <string>
#include "cocos/base/Any.h"
#include "core/event/CallbacksInvoker.h"
//#include "core/event/Event.h"
#include "core/scene-graph/NodeEvent.h"

namespace cc {
const std::vector<CallbacksInvoker::KeyType> TOUCH_EVENTS{
    cc::NodeEventType::TOUCH_START,
    cc::NodeEventType::TOUCH_MOVE,
    cc::NodeEventType::TOUCH_END,
    cc::NodeEventType::TOUCH_CANCEL};

const std::vector<CallbacksInvoker::KeyType> MOUSE_EVENTS{
    cc::NodeEventType::MOUSE_DOWN,
    cc::NodeEventType::MOUSE_ENTER,
    cc::NodeEventType::MOUSE_MOVE,
    cc::NodeEventType::MOUSE_LEAVE,
    cc::NodeEventType::MOUSE_UP,
    cc::NodeEventType::MOUSE_WHEEL};

class Node;

class NodeEventProcessor final {
public:
    NodeEventProcessor() = default;
    explicit NodeEventProcessor(Node *node);
    ~NodeEventProcessor();

    inline Node *getNode() { return _node; }
    void         reattach();
    void         destroy();

    /**
     * @zh
     * 分发事件到事件流中。
     *
     * @param event - 分派到事件流中的事件对象。
     */
    //    void dispatchEvent(event::Event *event);

    bool hasEventListener(const CallbacksInvoker::KeyType &type) const;

    bool hasEventListener(const CallbacksInvoker::KeyType &type, CallbackInfoBase::ID cbID) const;

    bool hasEventListener(const CallbacksInvoker::KeyType &type, void *target) const;

    bool hasEventListener(const CallbacksInvoker::KeyType &type, void *target, CallbackInfoBase::ID cbID) const;

    template <typename Target, typename... Args>
    bool hasEventListener(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target) const;

    static bool checkListeners(Node *node, const std::vector<CallbacksInvoker::KeyType> &events);

    template <typename... Args>
    void on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename... Args>
    void on(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture = false);

    template <typename Target, typename... Args>
    void on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename... Args>
    void once(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture = false);

    template <typename... Args>
    void once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename... Args>
    void once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, CallbackInfoBase::ID &cbID, bool useCapture = false);

    void off(const CallbacksInvoker::KeyType &type, CallbackInfoBase::ID cbID, bool useCapture = false);

    void off(const CallbacksInvoker::KeyType &type, void *target, bool useCapture = false);

    template <typename Target, typename... Args>
    void off(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture = false);

    /**
     * @zh
     * 通过事件名发送自定义事件
     *
     * @param type - event type
     * @param args - The  arguments to be passed to the callback
     */
    template <typename... Args>
    void emit(const CallbacksInvoker::KeyType &type, Args &&...args);

    void targetOff(const CallbacksInvoker::KeyType &target);

    void getCapturingTargets(const CallbacksInvoker::KeyType &type, std::vector<Node *> &targets) const;
    void getBubblingTargets(const CallbacksInvoker::KeyType &type, std::vector<Node *> &targets) const;

    inline CallbacksInvoker *getBubblingTargets() const { return _bubblingTargets; }
    inline CallbacksInvoker *getCapturingTargets() const { return _capturingTargets; }
    //    inline event::EventListener *getTouchListener() const { return _touchListener; }
    //    inline event::EventListener *getMouseListener() const { return _mouseListener; }

private:
    /**
     * @zh
     * 节点冒泡事件监听器
     */
    CallbacksInvoker *_bubblingTargets{nullptr};

    /**
     * @zh
     * 节点捕获事件监听器
     */
    CallbacksInvoker *_capturingTargets{nullptr};

    //    /**
    //     * @zh
    //     * 触摸监听器
    //     */
    //    event::EventListenerTouchOneByOne *_touchListener{nullptr};
    //
    //    /**
    //     * @zh
    //     * 鼠标监听器
    //     */
    //    event::EventListenerMouse *_mouseListener{nullptr};

    Node *_node{nullptr};

    //    bool checknSetupSysEvent(const CallbacksInvoker::KeyType &type);

    template <typename... Args>
    void onDispatch(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename... Args>
    void onDispatch(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture = false);

    template <typename Target, typename... Args>
    void onDispatch(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture = false);

    void offDispatch(const CallbacksInvoker::KeyType &type, CallbackInfoBase::ID cbID, bool useCapture = false);
    void offDispatch(const CallbacksInvoker::KeyType &type, void *target, bool useCapture = false);

    template <typename Target, typename... Args>
    void offDispatch(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture = false);

    CC_DISALLOW_COPY_MOVE_ASSIGN(NodeEventProcessor);
};

template <typename... Args>
void NodeEventProcessor::emit(const CallbacksInvoker::KeyType &type, Args &&...args) {
    if (_bubblingTargets != nullptr) {
        _bubblingTargets->emit(type, std::forward<Args>(args)...);
    }
}
template <typename... Args>
void NodeEventProcessor::onDispatch(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool useCapture) {
    CallbacksInvoker *listeners = nullptr;
    if (useCapture) {
        if (_capturingTargets == nullptr) {
            _capturingTargets = new CallbacksInvoker();
        }
        listeners = _capturingTargets;
    } else {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        listeners = _bubblingTargets;
    }
    if (!listeners->hasEventListener(type)) {
        listeners->on(type, std::forward<std::function<void(Args...)>>(callback), cbID);
    }
}

template <typename Target, typename... Args>
void NodeEventProcessor::onDispatch(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture) {
    CallbacksInvoker *listeners = nullptr;
    if (useCapture) {
        if (_capturingTargets == nullptr) {
            _capturingTargets = new CallbacksInvoker();
        }
        listeners = _capturingTargets;
    } else {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        listeners = _bubblingTargets;
    }
    if (!listeners->hasEventListener(type)) {
        listeners->on(type, std::forward<std::function<void(Args...)>>(callback), target, cbID);
    }
}

template <typename Target, typename... Args>
void NodeEventProcessor::onDispatch(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture) {
    CallbacksInvoker *listeners = nullptr;
    if (useCapture) {
        if (_capturingTargets == nullptr) {
            _capturingTargets = new CallbacksInvoker();
        }
        listeners = _capturingTargets;
    } else {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        listeners = _bubblingTargets;
    }
    if (!listeners->hasEventListener(type)) {
        listeners->on(type, memberFn, target);
    }
}

template <typename... Args>
void NodeEventProcessor::on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool /*useCapture*/) {
    //    bool forDispatch = checknSetupSysEvent(type);
    //    if (forDispatch) {
    //        onDispatch(type, std::forward<std::function<void(Args...)>>(callback), cbID, useCapture);
    //    } else
    {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        _bubblingTargets->on(type, std::forward<std::function<void(Args...)>>(callback), cbID);
    }
}

template <typename Target, typename... Args>
void NodeEventProcessor::on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target * /*target*/, CallbackInfoBase::ID &cbID, bool /*useCapture*/) {
    //    bool forDispatch = checknSetupSysEvent(type);
    //    if (forDispatch) {
    //        onDispatch(type, std::forward<std::function<void(Args...)>>(callback), target, cbID, useCapture);
    //    } else
    {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        _bubblingTargets->on(type, std::forward<std::function<void(Args...)>>(callback), cbID);
    }
}

template <typename Target, typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
NodeEventProcessor::on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, CallbackInfoBase::ID &cbID, bool /*useCapture*/) {
    //    bool forDispatch = checknSetupSysEvent(type);
    //    if (forDispatch) {
    //        onDispatch(type, CallbacksInvoker::toFunction(std::forward<LambdaType>(callback)), target, cbID, useCapture);
    //    } else
    {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        _bubblingTargets->on(type, callback, target, cbID);
    }
}

template <typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
NodeEventProcessor::on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, CallbackInfoBase::ID &cbID, bool /*useCapture*/) {
    //    bool forDispatch = checknSetupSysEvent(type);
    //    if (forDispatch) {
    //        onDispatch(type, CallbacksInvoker::toFunction(std::forward<LambdaType>(callback)), cbID, useCapture);
    //    } else
    {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        _bubblingTargets->on(type, callback, cbID);
    }
}

template <typename Target, typename... Args>
void NodeEventProcessor::on(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool /*useCapture*/) {
    using CallbackInfoType = CallbackInfo<Args...>;
    //    bool forDispatch       = checknSetupSysEvent(type);
    //    if (forDispatch) {
    //        onDispatch(type, memberFn, target, useCapture);
    //    } else
    {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        _bubblingTargets->on(type, memberFn, target);
    }
}

template <typename... Args>
void NodeEventProcessor::once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool useCapture /* = false*/) {
    once<std::nullptr_t>(type, std::forward<Args...>(callback), nullptr, cbID, useCapture);
}

template <typename Target, typename... Args>
void NodeEventProcessor::once(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture) {
    CallbacksInvoker *listeners = nullptr;
    if (useCapture) {
        if (_capturingTargets == nullptr) {
            _capturingTargets = new CallbacksInvoker();
        }
        listeners = _capturingTargets;
    } else {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        listeners = _bubblingTargets;
    }

    listeners->on(type, memberFn, target, true);
    listeners->on(
        type, [=](Args... /*unused*/) { off(type, memberFn, target); }, true);
}

template <typename Target, typename... Args>
void NodeEventProcessor::once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture) {
    CallbacksInvoker *listeners = nullptr;
    if (useCapture) {
        if (_capturingTargets == nullptr) {
            _capturingTargets = new CallbacksInvoker();
        }
        listeners = _capturingTargets;
    } else {
        if (_bubblingTargets == nullptr) {
            _bubblingTargets = new CallbacksInvoker();
        }
        listeners = _bubblingTargets;
    }
    listeners->on(type, std::forward<std::function<void(Args...)>>(callback), target, cbID, true);
    CallbackInfoBase::ID cacheID = cbID;
    listeners->on(
        type, [=](Args... /*unused*/) { off(type, cacheID); }, target, true);
}

template <typename Target, typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
NodeEventProcessor::once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture) {
    once(type, CallbacksInvoker::toFunction(callback), target, cbID, useCapture);
}

template <typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
NodeEventProcessor::once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, CallbackInfoBase::ID &cbID, bool useCapture) {
    once<std::nullptr_t>(type, std::forward<LambdaType>(callback), nullptr, cbID, useCapture);
}

template <typename Target, typename... Args>
void NodeEventProcessor::off(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool /*useCapture*/) {
    //    bool touchEventExist = std::find(TOUCH_EVENTS.begin(), TOUCH_EVENTS.end(), type) != TOUCH_EVENTS.end();
    //    bool mouseEventExist = std::find(MOUSE_EVENTS.begin(), MOUSE_EVENTS.end(), type) != MOUSE_EVENTS.end();
    //    if (touchEventExist || mouseEventExist) {
    //        offDispatch(type, memberFn, target, useCapture);
    //
    //        if (touchEventExist) {
    //            if (_touchListener && !checkListeners(_node, TOUCH_EVENTS)) {
    //                event::EventManager::getInstance()->removeEventListener(_touchListener);
    //                _touchListener = nullptr;
    //            }
    //        } else if (mouseEventExist) {
    //            if (_mouseListener && !checkListeners(_node, MOUSE_EVENTS)) {
    //                event::EventManager::getInstance()->removeEventListener(_mouseListener);
    //                _mouseListener = nullptr;
    //            }
    //        }
    //    } else
    if (_bubblingTargets != nullptr) {
        _bubblingTargets->off(type, memberFn, target);
    }
}

template <typename Target, typename... Args>
void NodeEventProcessor::offDispatch(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture) {
    if (memberFn == nullptr) {
        if (_capturingTargets != nullptr) {
            _capturingTargets->offAll(type, target);
        }
        if (_bubblingTargets != nullptr) {
            _bubblingTargets->offAll(type, target);
        }
    } else {
        CallbacksInvoker *listeners = useCapture ? _capturingTargets : _bubblingTargets;
        if (listeners != nullptr) {
            listeners->off(type, memberFn, target);
        }
    }
}

template <typename Target, typename... Args>
bool NodeEventProcessor::hasEventListener(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target) const {
    bool has = false;
    if (_bubblingTargets) {
        has = _bubblingTargets->hasEventListener(type, memberFn, target);
    }
    if (!has && _capturingTargets) {
        has = _capturingTargets->hasEventListener(type, memberFn, target);
    }
    return has;
}
} // namespace cc
