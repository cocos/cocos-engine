/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"

namespace {
    se::Value _tickVal;
    std::vector<se::Object*> _jsTouchObjPool;
    se::Object* _jsTouchObjArray = nullptr;
    se::Object* _jsbNameSpaceObj = nullptr;
    bool _inited = false;
}

namespace cocos2d
{
    std::unordered_map<std::string, EventDispatcher::Node*> EventDispatcher::_listeners;

    void EventDispatcher::init()
    {
        _inited = true;
    }

    void EventDispatcher::destroy()
    {
        for (auto touchObj : _jsTouchObjPool)
        {
            touchObj->unroot();
            touchObj->decRef();
        }
        _jsTouchObjPool.clear();

        if (_jsTouchObjArray != nullptr)
        {
            _jsTouchObjArray->unroot();
            _jsTouchObjArray->decRef();
            _jsTouchObjArray = nullptr;
        }

        if (_jsbNameSpaceObj != nullptr)
        {
            _jsbNameSpaceObj->unroot();
            _jsbNameSpaceObj->decRef();
            _jsbNameSpaceObj = nullptr;
        }
        _inited = false;
        _tickVal.setUndefined();
    }

void EventDispatcher::dispatchTouchEvent(const struct TouchEvent& touchEvent)
{
    se::AutoHandleScope scope;
    assert(_inited);
    if (_jsbNameSpaceObj == nullptr)
    {
        auto global = se::ScriptEngine::getInstance()->getGlobalObject();
        se::Value jsbVal;
        if (global->getProperty("jsb", &jsbVal) && jsbVal.isObject())
        {
            _jsbNameSpaceObj = jsbVal.toObject();
            _jsbNameSpaceObj->incRef();
            _jsbNameSpaceObj->root();
        }
    }

    if (_jsTouchObjArray == nullptr)
    {
        _jsTouchObjArray = se::Object::createArrayObject(0);
        _jsTouchObjArray->root();
    }

    _jsTouchObjArray->setProperty("length", se::Value(touchEvent.touches.size()));

    if (_jsTouchObjPool.size() < touchEvent.touches.size())
    {
        se::Object* touchObj = se::Object::createPlainObject();
        touchObj->root();
        _jsTouchObjPool.push_back(touchObj);
    }

    uint32_t touchIndex = 0;
    int poolIndex = 0;
    for (const auto& touch : touchEvent.touches)
    {
        se::Object* jsTouch = _jsTouchObjPool.at(poolIndex++);
        jsTouch->setProperty("identifier", se::Value(touch.index));
        jsTouch->setProperty("clientX", se::Value(touch.x));
        jsTouch->setProperty("clientY", se::Value(touch.y));
        jsTouch->setProperty("pageX", se::Value(touch.x));
        jsTouch->setProperty("pageY", se::Value(touch.y));

        _jsTouchObjArray->setArrayElement(touchIndex, se::Value(jsTouch));
        ++touchIndex;
    }

    const char* eventName = nullptr;
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
            assert(false);
            break;
    }

    se::Value callbackVal;
    if (_jsbNameSpaceObj->getProperty(eventName, &callbackVal))
    {
        se::ValueArray args;
        args.push_back(se::Value(_jsTouchObjArray));
        callbackVal.toObject()->call(args, nullptr);
    }
}

void EventDispatcher::dispatchKeyEvent(int key, int action)
{
}
    
void EventDispatcher::dispatchTickEvent(float dt)
{
    se::AutoHandleScope scope;

    static std::chrono::steady_clock::time_point prevTime;
    static std::chrono::steady_clock::time_point now;

    if (_tickVal.isUndefined())
    {
        se::ScriptEngine::getInstance()->getGlobalObject()->getProperty("gameTick", &_tickVal);
    }

    prevTime = std::chrono::steady_clock::now();

    se::ValueArray args;
//    args.push_back(se::Value(dt));
    long long microSeconds = std::chrono::duration_cast<std::chrono::microseconds>(prevTime - se::ScriptEngine::getInstance()->getStartTime()).count();
    args.push_back(se::Value((float)(microSeconds * 0.001f)));

    _tickVal.toObject()->call(args, nullptr);

    now = std::chrono::steady_clock::now();
    dt = std::chrono::duration_cast<std::chrono::microseconds>(now - prevTime).count() / 1000000.f;
}

uint32_t EventDispatcher::addCustomEventListener(const std::string& eventName, const CustomEventListener& listener)
{
    static uint32_t __listenerIDCounter = 0;
    uint32_t listenerID = ++__listenerIDCounter;
    listenerID = listenerID == 0 ? 1 : listenerID;

    Node* newNode = new Node();
    newNode->listener = listener;
    newNode->listenerID = listenerID;
    newNode->next = nullptr;

    auto iter = _listeners.find(eventName);
    if (iter == _listeners.end())
    {
        _listeners.emplace(eventName, newNode);
    }
    else
    {
        Node* node = iter->second;
        assert(node != nullptr);
        Node* prev = nullptr;
        while (node != nullptr)
        {
            prev = node;
            node = node->next;
        }
        prev->next = newNode;
    }
    return listenerID;
}

void EventDispatcher::removeCustomEventListener(const std::string& eventName, uint32_t listenerID)
{
    if (eventName.empty())
        return;

    if (listenerID == 0)
        return;

    auto iter = _listeners.find(eventName);
    if (iter != _listeners.end())
    {
        Node* prev = nullptr;
        Node* node = iter->second;
        while (node != nullptr)
        {
            if (node->listenerID == listenerID)
            {
                if (prev != nullptr)
                {
                    prev->next = node->next;
                }
                else if (node->next)
                {
                    _listeners[eventName] = node->next;
                }
                else
                {
                    _listeners.erase(iter);
                }

                delete node;
                return;
            }

            prev = node;
            node = node->next;
        }
    }
}

void EventDispatcher::removeAllCustomEventListeners(const std::string& eventName)
{
    auto iter = _listeners.find(eventName);
    if (iter != _listeners.end())
    {
        Node* node = iter->second;
        while (node != nullptr)
        {
            delete node;
            node = node->next;
        }
        _listeners.erase(iter);
    }
}

void EventDispatcher::dispatchCustomEvent(struct CustomEvent* event)
{
    assert(event);
    auto iter = _listeners.find(event->name);
    if (iter != _listeners.end())
    {
        Node* next = nullptr;
        Node* node = iter->second;
        while (node != nullptr)
        {
            next = node->next;
            node->listener(event);
            node = next;
        }
    }
}
    
} // end of namespace cocos2d
