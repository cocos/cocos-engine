/****************************************************************************
Copyright (c) 2017 Chukong Technologies Inc.

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

#include "BaseJSAction.h"

#include "base/ccUTF8.h"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"

namespace {

    se::Value invokeJSFunction(cocos2d::BaseJSAction* action, const char* funcName, const se::ValueArray& args)
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        se::Value ret;
        se::Value v;
        if (native_ptr_to_seval<cocos2d::BaseJSAction>(action, __jsb_cocos2d_BaseJSAction_class, &v))
        {
            assert(v.isObject());
            se::Value func;
            if (v.toObject()->getProperty(funcName, &func) && func.isObject() && func.toObject()->isFunction())
            {
                if (func.toObject()->call(args, v.toObject(), &ret))
                {
                    return ret;
                }
            }
        }
        
        return ret;
    }
}

NS_CC_BEGIN

BaseJSAction::BaseJSAction()
{
}

BaseJSAction::~BaseJSAction()
{
    CCLOGINFO("deallocing BaseJSAction: %p - tag: %i", this, _tag);
}

std::string BaseJSAction::description() const
{
    return StringUtils::format("<BaseJSAction | Tag = %d", _tag);
}

BaseJSAction* BaseJSAction::clone() const
{
    se::Value jsRet = invokeJSFunction(const_cast<cocos2d::BaseJSAction*>(this), "clone", se::EmptyValueArray);
    cocos2d::BaseJSAction* ret = nullptr;
    seval_to_native_ptr(jsRet, &ret);
    return ret;
}

BaseJSAction *BaseJSAction::reverse() const
{
    se::Value jsRet = invokeJSFunction(const_cast<cocos2d::BaseJSAction*>(this), "reverse", se::EmptyValueArray);
    cocos2d::BaseJSAction* ret = nullptr;
    seval_to_native_ptr(jsRet, &ret);
    return ret;
}

bool BaseJSAction::isDone() const
{
    se::Value jsRet = invokeJSFunction(const_cast<cocos2d::BaseJSAction*>(this), "isDone", se::EmptyValueArray);
    if (jsRet.isBoolean())
    {
        return jsRet.toBoolean();
    }

    return false;
}

void BaseJSAction::step(float dt)
{
    se::ValueArray args;
    args.push_back(se::Value(dt));
    invokeJSFunction(const_cast<cocos2d::BaseJSAction*>(this), "step", args);
}

void BaseJSAction::update(float time)
{
    se::ValueArray args;
    args.push_back(se::Value(time));
    invokeJSFunction(const_cast<cocos2d::BaseJSAction*>(this), "update", args);
}

NS_CC_END
