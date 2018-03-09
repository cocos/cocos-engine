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
#include <mutex>

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
    
void EventDispatcher::dispatchTickEvent()
{
    se::AutoHandleScope scope;

    static std::chrono::steady_clock::time_point prevTime;
    static std::chrono::steady_clock::time_point now;

    float dt = 0.f;
    if (_tickVal.isUndefined())
    {
        jsb_run_script("jsb/index.js", &_tickVal);
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
    
} // end of namespace cocos2d
