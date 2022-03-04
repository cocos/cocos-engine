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

#include "core/scene-graph/NodeEventProcessor.h"
// #include "2d/framework/UITransform.h"
// #include "core/Director.h"
//#include "core/components/Component.h"
#include "core/scene-graph/Node.h"
//#include "core/scene-graph/NodeUIProperties.h"
#include "math/Vec2.h"

namespace {
std::vector<cc::Node *> cachedArray(16);
cc::Node *              currentHovered = nullptr;
cc::Vec2                pos;

//bool touchStartHandler(cc::event::EventListener *listener, cc::event::Touch *touch, cc::event::Event *event) {
//    auto *touchEvent = static_cast<cc::event::EventTouch *>(event);
//    auto *node       = dynamic_cast<cc::Node *>(listener->owner);
//    if (node == nullptr || !node->getUIProps()->getUITransformComp()) {
//        return false;
//    }
//
//    pos = touch->getUILocation();
//
//    if (node->getUIProps()->getUITransformComp()->isHit(pos)) {
//        touchEvent->setEventName(cc::NodeEventType::TOUCH_START);
//        touchEvent->setTouch(touch);
//        touchEvent->setUseBubbles(true);
//        node->dispatchEvent(touchEvent);
//        return true;
//    }
//
//    return false;
//}
//
//void touchMoveHandler(cc::event::EventListener *listener, cc::event::Touch *touch, cc::event::Event *event) {
//    auto *touchEvent = static_cast<cc::event::EventTouch *>(event);
//    auto *node       = dynamic_cast<cc::Node *>(listener->owner);
//    if (node == nullptr || !node->getUIProps()->getUITransformComp()) {
//        return;
//    }
//
//    touchEvent->setEventName(cc::NodeEventType::TOUCH_MOVE);
//    touchEvent->setTouch(touch);
//    touchEvent->setUseBubbles(true);
//    node->dispatchEvent(touchEvent);
//}
//
//void touchEndHandler(cc::event::EventListener *listener, cc::event::Touch *touch, cc::event::Event *event) {
//    auto *touchEvent = static_cast<cc::event::EventTouch *>(event);
//    auto *node       = dynamic_cast<cc::Node *>(listener->owner);
//    if (node == nullptr || !node->getUIProps()->getUITransformComp()) {
//        return;
//    }
//
//    pos = touch->getUILocation();
//
//    if (node->getUIProps()->getUITransformComp()->isHit(pos)) {
//        event->setEventName(cc::NodeEventType::TOUCH_END);
//    } else {
//        event->setEventName(cc::NodeEventType::TOUCH_CANCEL);
//    }
//
//    touchEvent->setTouch(touch);
//    touchEvent->setUseBubbles(true);
//    node->dispatchEvent(touchEvent);
//}
//
//void touchCancelHandler(cc::event::EventListener *listener, cc::event::Touch *touch, cc::event::Event *event) {
//    auto *touchEvent = static_cast<cc::event::EventTouch *>(event);
//    auto *node       = dynamic_cast<cc::Node *>(listener->owner);
//    if (node == nullptr || !node->getUIProps()->getUITransformComp()) {
//        return;
//    }
//
//    touchEvent->setEventName(cc::NodeEventType::TOUCH_CANCEL);
//    touchEvent->setTouch(touch);
//    touchEvent->setUseBubbles(true);
//    node->dispatchEvent(event);
//}
//
//void mouseDownHandler(cc::event::EventListener *listener, cc::event::EventMouse *mouseEvent) {
//    auto *node = dynamic_cast<cc::Node *>(listener->owner);
//    if (node == nullptr || !node->getUIProps()->getUITransformComp()) {
//        return;
//    }
//
//    pos = mouseEvent->getUILocation();
//
//    if (node->getUIProps()->getUITransformComp()->isHit(pos)) {
//        mouseEvent->setEventName(cc::NodeEventType::MOUSE_DOWN);
//        mouseEvent->setUseBubbles(true);
//        node->dispatchEvent(mouseEvent);
//    }
//}
//
//void mouseMoveHandler(cc::event::EventListener *listener, cc::event::EventMouse *mouseEvent) {
//    auto *node = dynamic_cast<cc::Node *>(listener->owner);
//    if (node == nullptr || !node->getUIProps()->getUITransformComp()) {
//        return;
//    }
//
//    pos = mouseEvent->getUILocation();
//
//    if (node->getUIProps()->getUITransformComp()->isHit(pos)) {
//        if (!listener->_previousIn) {
//            // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
//            if (currentHovered && currentHovered->getEventProcessor()->getMouseListener()) {
//                mouseEvent->setEventName(cc::NodeEventType::MOUSE_LEAVE);
//                currentHovered->dispatchEvent(mouseEvent);
//                if (currentHovered->getEventProcessor()->getMouseListener()) {
//                    currentHovered->getEventProcessor()->getMouseListener()->_previousIn = false;
//                }
//            }
//            currentHovered = node;
//            mouseEvent->setEventName(cc::NodeEventType::MOUSE_ENTER);
//            node->dispatchEvent(mouseEvent);
//            listener->_previousIn = true;
//        }
//        mouseEvent->setEventName(cc::NodeEventType::MOUSE_MOVE);
//        mouseEvent->setUseBubbles(true);
//        node->dispatchEvent(mouseEvent);
//    } else if (listener->_previousIn) {
//        mouseEvent->setEventName(cc::NodeEventType::MOUSE_LEAVE);
//        node->dispatchEvent(mouseEvent);
//        listener->_previousIn = false;
//        currentHovered        = nullptr;
//    } else {
//        // continue dispatching
//        return;
//    }
//
//    // Event processed, cleanup
//    mouseEvent->setPropagationStopped(true);
//}
//void mouseUpHandler(cc::event::EventListener *listener, cc::event::EventMouse *mouseEvent) {
//    auto *node = dynamic_cast<cc::Node *>(listener->owner);
//    if (node == nullptr || !node->getUIProps()->getUITransformComp()) {
//        return;
//    }
//
//    pos = mouseEvent->getUILocation();
//
//    if (node->getUIProps()->getUITransformComp()->isHit(pos)) {
//        mouseEvent->setEventName(cc::NodeEventType::MOUSE_UP);
//        mouseEvent->setUseBubbles(true);
//        node->dispatchEvent(mouseEvent);
//        mouseEvent->setPropagationStopped(true);
//    }
//}
//
//void mouseWheelHandler(cc::event::EventListener *listener, cc::event::EventMouse *mouseEvent) {
//    auto *node = dynamic_cast<cc::Node *>(listener->owner);
//    if (node == nullptr || !node->getUIProps()->getUITransformComp()) {
//        return;
//    }
//
//    pos = mouseEvent->getUILocation();
//
//    if (node->getUIProps()->getUITransformComp()->isHit(pos)) {
//        mouseEvent->setEventName(cc::NodeEventType::MOUSE_WHEEL);
//        mouseEvent->setUseBubbles(true);
//        node->dispatchEvent(mouseEvent);
//        mouseEvent->setPropagationStopped(true);
//    }
//}
//
//void doDispatchEvent(cc::Node *owner, cc::event::Event *event) {
//    cc::Node *target = nullptr;
//    event->setTarget(owner);
//
//    // Event.CAPTURING_PHASE
//    cachedArray.clear();
//    owner->getEventProcessor()->getCapturingTargets(event->getEventName(), cachedArray);
//    // capturing
//    event->setEventPhase(cc::event::Event::Phase::CAPTURING);
//    for (auto i = static_cast<int32_t>(cachedArray.size() - 1); i >= 0; --i) {
//        target = cachedArray[i];
//        if (target->getEventProcessor()->getCapturingTargets()) {
//            event->setCurrentTarget(target);
//            // fire event
//            target->getEventProcessor()->getCapturingTargets()->emit(event->getEventName(), event, cachedArray);
//            // check if propagation stopped
//            if (event->isPropagationStopped()) {
//                cachedArray.clear();
//                return;
//            }
//        }
//    }
//    cachedArray.clear();
//
//    // Event.AT_TARGET
//    // checks if destroyed in capturing callbacks
//    event->setEventPhase(cc::event::Event::Phase::AT_TARGET);
//    event->setCurrentTarget(owner);
//    if (owner->getEventProcessor()->getCapturingTargets()) {
//        owner->getEventProcessor()->getCapturingTargets()->emit(event->getEventName(), event);
//    }
//    if (!event->isPropagationImmediateStopped() && owner->getEventProcessor()->getBubblingTargets()) {
//        owner->getEventProcessor()->getBubblingTargets()->emit(event->getEventName(), event);
//    }
//
//    if (!event->isPropagationStopped() && event->isUseBubbles()) {
//        // Event.BUBBLING_PHASE
//        owner->getEventProcessor()->getBubblingTargets(event->getEventName(), cachedArray);
//        // propagate
//        event->setEventPhase(cc::event::Event::Phase::BUBBLING);
//        for (uint32_t i = 0; i < cachedArray.size(); ++i) {
//            target = cachedArray[i];
//            if (target->getEventProcessor()->getBubblingTargets()) {
//                event->setCurrentTarget(target);
//                // fire event
//                target->getEventProcessor()->getBubblingTargets()->emit(event->getEventName(), event);
//                // check if propagation stopped
//                if (event->isPropagationStopped()) {
//                    cachedArray.clear();
//                    return;
//                }
//            }
//        }
//    }
//    cachedArray.clear();
//}
//
//template <typename T, typename Enabled = std::enable_if_t<std::is_base_of<cc::Component, T>::value, T>>
//std::vector<cc::event::IListenerMask> searchComponentsInParent(cc::Node *node) {
//    index_t                               index = 0;
//    std::vector<cc::event::IListenerMask> list;
//
//    for (cc::Node *curr = node; curr != nullptr && cc::Node::isNode(curr); curr = curr->getParent(), ++index) {
//        auto *comp = curr->getComponent<T>();
//        if (comp != nullptr) {
//            list.emplace_back();
//            auto &info = list.back();
//            info.index = index;
//            info.comp  = comp;
//        }
//    }
//    return list.empty() ? std::vector<cc::event::IListenerMask>() : list;
//}

} // namespace
namespace cc {
NodeEventProcessor::NodeEventProcessor(Node *node) : _node(node) {}

NodeEventProcessor::~NodeEventProcessor() {
    delete _bubblingTargets;
    delete _capturingTargets;
    //    delete _touchListener;
    //    delete _mouseListener;
}

bool NodeEventProcessor::checkListeners(cc::Node *node, const std::vector<CallbacksInvoker::KeyType> &events) {
    if (!node->isPersistNode()) {
        if (node->getEventProcessor()->_bubblingTargets) {
            for (const auto &event : events) {
                if (node->getEventProcessor()->_bubblingTargets->hasEventListener(event)) {
                    return true;
                }
            }
        }
        if (node->getEventProcessor()->_bubblingTargets) {
            for (const auto &event : events) {
                if (node->getEventProcessor()->_bubblingTargets->hasEventListener(event)) {
                    return true;
                }
            }
        }
        return false;
    }
    return true;
}

void NodeEventProcessor::reattach() {
    //    std::vector<event::IListenerMask> currMask;
    //    _node->walk(
    //        [&](Node *node) {
    //            if (currMask.empty()) {
    //                currMask = searchComponentsInParent<Component>(node);
    //            }
    //            if (node->getEventProcessor()->_touchListener != nullptr) {
    //                node->getEventProcessor()->_touchListener->mask = currMask;
    //            }
    //            if (node->getEventProcessor()->_mouseListener != nullptr) {
    //                node->getEventProcessor()->_mouseListener->mask = currMask;
    //            }
    //        });
}

void NodeEventProcessor::destroy() {
    if (currentHovered == _node) {
        currentHovered = nullptr;
    }

    // Remove all event listeners if necessary
    //    if (_touchListener || _mouseListener) {
    //        event::EventManager::getInstance()->removeEventListenersForTarget(_node);
    //        if (_touchListener) {
    //            _touchListener->owner = nullptr;
    //            _touchListener->mask.clear();
    //            _touchListener = nullptr;
    //        }
    //        if (_mouseListener) {
    //            _mouseListener->owner = nullptr;
    //            _mouseListener->mask.clear();
    //            _mouseListener = nullptr;
    //        }
    //    }

    if (_capturingTargets) _capturingTargets->offAll();
    if (_bubblingTargets) _bubblingTargets->offAll();
}

void NodeEventProcessor::off(const CallbacksInvoker::KeyType &type, void *target, bool /*useCapture*/ /* = false*/) {
    //    bool touchEventExist = std::find(TOUCH_EVENTS.begin(), TOUCH_EVENTS.end(), type) != TOUCH_EVENTS.end();
    //    bool mouseEventExist = std::find(MOUSE_EVENTS.begin(), MOUSE_EVENTS.end(), type) != MOUSE_EVENTS.end();
    //    if (touchEventExist || mouseEventExist) {
    //        offDispatch(type, target, useCapture);
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
        _bubblingTargets->offAll(type, target);
    }
}

void NodeEventProcessor::off(const CallbacksInvoker::KeyType &type, CallbackInfoBase::ID cbID, bool /*useCapture*/) {
    //    bool touchEventExist = std::find(TOUCH_EVENTS.begin(), TOUCH_EVENTS.end(), type) != TOUCH_EVENTS.end();
    //    bool mouseEventExist = std::find(MOUSE_EVENTS.begin(), MOUSE_EVENTS.end(), type) != MOUSE_EVENTS.end();
    //    if (touchEventExist || mouseEventExist) {
    //        offDispatch(type, cbID, useCapture);
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
        _bubblingTargets->off(type, cbID);
    }
}

//void NodeEventProcessor::dispatchEvent(event::Event *event) {
//    doDispatchEvent(_node, event);
//    cachedArray.clear();
//}

bool NodeEventProcessor::hasEventListener(const CallbacksInvoker::KeyType &type) const {
    bool has = false;
    if (_bubblingTargets) {
        has = _bubblingTargets->hasEventListener(type);
    }
    if (!has && _capturingTargets) {
        has = _capturingTargets->hasEventListener(type);
    }
    return has;
}

bool NodeEventProcessor::hasEventListener(const CallbacksInvoker::KeyType &type, CallbackInfoBase::ID cbID) const {
    bool has = false;
    if (_bubblingTargets) {
        has = _bubblingTargets->hasEventListener(type, cbID);
    }
    if (!has && _capturingTargets) {
        has = _capturingTargets->hasEventListener(type, cbID);
    }
    return has;
}

bool NodeEventProcessor::hasEventListener(const CallbacksInvoker::KeyType &type, void *target) const {
    bool has = false;
    if (_bubblingTargets) {
        has = _bubblingTargets->hasEventListener(type, target);
    }
    if (!has && _capturingTargets) {
        has = _capturingTargets->hasEventListener(type, target);
    }
    return has;
}
bool NodeEventProcessor::hasEventListener(const CallbacksInvoker::KeyType &type, void *target, CallbackInfoBase::ID cbID) const {
    bool has = false;
    if (_bubblingTargets) {
        has = _bubblingTargets->hasEventListener(type, target, cbID);
    }
    if (!has && _capturingTargets) {
        has = _capturingTargets->hasEventListener(type, target, cbID);
    }
    return has;
}

void NodeEventProcessor::targetOff(const CallbacksInvoker::KeyType &target) {
    if (_capturingTargets) {
        _capturingTargets->offAll(target);
    }
    if (_bubblingTargets) {
        _bubblingTargets->offAll(target);
    }

    //    if (_touchListener && !checkListeners(_node, TOUCH_EVENTS)) {
    //        event::EventManager::getInstance()->removeEventListener(_touchListener);
    //        _touchListener = nullptr;
    //    }
    //    if (_mouseListener && !checkListeners(_node, MOUSE_EVENTS)) {
    //        event::EventManager::getInstance()->removeEventListener(_mouseListener);
    //        _mouseListener = nullptr;
    //    }
}

void NodeEventProcessor::getCapturingTargets(const CallbacksInvoker::KeyType &type, std::vector<Node *> &targets) const {
    auto *parent = _node->getParent();
    while (parent != nullptr) {
        if (parent->getEventProcessor()->_capturingTargets != nullptr && parent->getEventProcessor()->_capturingTargets->hasEventListener(type)) {
            targets.emplace_back(parent);
        }
        parent = parent->getParent();
    }
}

void NodeEventProcessor::getBubblingTargets(const CallbacksInvoker::KeyType &type, std::vector<Node *> &targets) const {
    auto *parent = _node->getParent();
    while (parent != nullptr) {
        if (parent->getEventProcessor()->_bubblingTargets != nullptr && parent->getEventProcessor()->_bubblingTargets->hasEventListener(type)) {
            targets.emplace_back(parent);
        }
        parent = parent->getParent();
    }
}

//bool NodeEventProcessor::checknSetupSysEvent(const CallbacksInvoker::KeyType &type) {
//    bool newAdded    = false;
//    bool forDispatch = false;
//    // just for ui
//
//    auto *eventManager = event::EventManager::getInstance();
//    if (std::find(TOUCH_EVENTS.begin(), TOUCH_EVENTS.end(), type) != TOUCH_EVENTS.end()) {
//        if (_touchListener != nullptr) {
//            _touchListener = event::EventListenerTouchOneByOne::create();
//            _touchListener->setSwallowTouches(true);
//            _touchListener->owner = _node;
//            //cjh TODO:            _touchListener->mask = searchComponentsInParent(_node, NodeEventProcessor._comp),
//            event::EventListener *listener = _touchListener;
//            _touchListener->onTouchBegan   = [=](event::Touch *touch, event::Event *event) -> bool {
//                return touchStartHandler(listener, touch, event);
//            };
//            _touchListener->onTouchMoved = [=](event::Touch *touch, event::Event *event) {
//                touchMoveHandler(listener, touch, event);
//            };
//            _touchListener->onTouchEnded = [=](event::Touch *touch, event::Event *event) {
//                touchEndHandler(listener, touch, event);
//            };
//            _touchListener->onTouchCancelled = [=](event::Touch *touch, event::Event *event) {
//                touchCancelHandler(listener, touch, event);
//            };
//            eventManager->addEventListenerWithSceneGraphPriority(_touchListener, _node);
//            newAdded = true;
//        }
//        forDispatch = true;
//    } else if (std::find(MOUSE_EVENTS.begin(), MOUSE_EVENTS.end(), type) != MOUSE_EVENTS.end()) {
//        if (_mouseListener != nullptr) {
//            _mouseListener              = event::EventListenerMouse::create();
//            _mouseListener->_previousIn = false;
//            _mouseListener->owner       = _node;
//            //cjh _mouseListener->mask = searchComponentsInParent(_node, NodeEventProcessor._comp),
//
//            event::EventListener *listener = _mouseListener;
//            _mouseListener->onMouseDown    = [=](event::EventMouse *event) {
//                mouseDownHandler(listener, event);
//            };
//
//            _mouseListener->onMouseMove = [=](event::EventMouse *event) {
//                mouseMoveHandler(listener, event);
//            };
//
//            _mouseListener->onMouseUp = [=](event::EventMouse *event) {
//                mouseUpHandler(listener, event);
//            };
//
//            _mouseListener->onMouseScroll = [=](event::EventMouse *event) {
//                mouseWheelHandler(listener, event);
//            };
//
//            eventManager->addEventListenerWithSceneGraphPriority(_mouseListener, _node);
//            newAdded = true;
//        }
//        forDispatch = true;
//    }
//    // TODO(xwx): not sure use scheduler
//    // if (newAdded && !_node->isActiveInHierarchy()) {
//    //     Director::getInstance()->getScheduler()->schedule([](){
//    //         if (!_node->isActiveInHierarchy()) {
//    //             eventManager.pauseTarget(_node);
//    //         }
//    //         }, _node, 0, 0, 0, false);
//    // }
//    return forDispatch;
//}

void NodeEventProcessor::offDispatch(const CallbacksInvoker::KeyType &type, CallbackInfoBase::ID cbID, bool useCapture) {
    if (cbID == 0) {
        if (_capturingTargets != nullptr) {
            _capturingTargets->offAll(type);
        }
        if (_bubblingTargets != nullptr) {
            _bubblingTargets->offAll(type);
        }
    } else {
        CallbacksInvoker *listeners = useCapture ? _capturingTargets : _bubblingTargets;
        if (listeners != nullptr) {
            listeners->off(type, cbID);
        }
    }
}

void NodeEventProcessor::offDispatch(const CallbacksInvoker::KeyType &type, void *target, bool useCapture) {
    CallbacksInvoker *listeners = useCapture ? _capturingTargets : _bubblingTargets;
    if (listeners != nullptr) {
        listeners->offAll(type, target);
    }
}

} // namespace cc
