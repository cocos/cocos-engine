/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

#include "base/CCEventListener.h"
#include "base/CCConsole.h"
#include "base/CCEventListenerCustom.h"

NS_CC_BEGIN

EventListener::EventListener()
{
}

EventListener::~EventListener()
{
    CCLOGINFO("In the destructor of EventListener. %p", this);
}

bool EventListener::init(Type t, const std::function<void(Event*)>& callback)
{
    _onEvent = callback;
    _type = t;
    switch (_type) {
        case Type::TOUCH_ONE_BY_ONE:
            _typeKey = TYPEKEY_TOUCH_ONE_BY_ONE;
            break;
        case Type::TOUCH_ALL_AT_ONCE:
            _typeKey = TYPEKEY_ALL_AT_ONCE;
            break;
        case Type::ACCELERATION:
            _typeKey = TYPEKEY_ACCELERATION;
            break;
        case Type::KEYBOARD:
            _typeKey = TYPEKEY_KEYBOARD;
            break;
        case Type::MOUSE:
            _typeKey = TYPEKEY_MOUSE;
            break;
        case Type::FOCUS:
            _typeKey = TYPEKEY_FOCUS;
            break;
        case Type::GAME_CONTROLLER:
            _typeKey = TYPEKEY_GAME_CONTROLLER;
            break;
        case Type::CUSTOM:
        {
            auto customListener = static_cast<EventListenerCustom*>(this);
            _typeKey = getHashCode(customListener->getEventName());
            break;
        }
        default:
            break;
    }

    _isRegistered = false;
    _paused = true;
    _isEnabled = true;

    return true;
}

bool EventListener::checkAvailable()
{
    return (_onEvent != nullptr);
}

size_t EventListener::getHashCode(const std::string& eventName)
{
    static std::hash<std::string> h;
    if (eventName.empty()) {
        return EventListener::TYPEKEY_CUSTOM;
    } else {
        return h(eventName);
    }
}

NS_CC_END

