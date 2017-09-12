/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
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

#include "base/ccUTF8.h"
#include "BaseJSAction.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"

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

BaseJSAction *BaseJSAction::clone() const
{
	JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();

	JS::RootedObject jsObj(cx);
	JS::RootedObject proto(cx, jsb_cocos2d_BaseJSAction_prototype->get());
	jsb_ref_get_or_create_jsobject(cx, (Ref *)this, jsb_cocos2d_BaseJSAction_class, proto, &jsObj, "BaseJSAction::clone");

	JS::RootedValue retVal(cx);
	JS::RootedValue owner(cx, JS::ObjectOrNullValue(jsObj));
    ScriptingCore::getInstance()->executeFunctionWithOwner(owner, "clone", JS::HandleValueArray::empty(), &retVal);

	JS::RootedObject retObj(cx, retVal.toObjectOrNull());
    auto proxy = jsb_get_js_proxy(cx, retObj);
    BaseJSAction* action = (BaseJSAction *)(proxy ? proxy->ptr : nullptr);
    return action;
}

BaseJSAction *BaseJSAction::reverse() const
{
	JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
	
	JS::RootedObject jsObj(cx);
	JS::RootedObject proto(cx, jsb_cocos2d_BaseJSAction_prototype->get());
    jsb_ref_get_or_create_jsobject(cx, (Ref *)this, jsb_cocos2d_BaseJSAction_class, proto, &jsObj, "BaseJSAction::reverse");
	
	JS::RootedValue retVal(cx);
	JS::RootedValue owner(cx, JS::ObjectOrNullValue(jsObj));
    ScriptingCore::getInstance()->executeFunctionWithOwner(owner, "reverse", JS::HandleValueArray::empty(), &retVal);

    JS::RootedObject retObj(cx, retVal.toObjectOrNull());
    auto proxy = jsb_get_js_proxy(cx, retObj);
    BaseJSAction* action = (BaseJSAction *)(proxy ? proxy->ptr : nullptr);
    return action;
}

bool BaseJSAction::isDone() const
{
	JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
	
	JS::RootedObject jsObj(cx);
	JS::RootedObject proto(cx, jsb_cocos2d_BaseJSAction_prototype->get());
    jsb_ref_get_or_create_jsobject(cx, (Ref *)this, jsb_cocos2d_BaseJSAction_class, proto, &jsObj, "BaseJSAction::isDone");
    
	JS::RootedValue retVal(cx);
	JS::RootedValue owner(cx, JS::ObjectOrNullValue(jsObj));
	ScriptingCore::getInstance()->executeFunctionWithOwner(owner, "isDone", JS::HandleValueArray::empty(), &retVal);

    if (retVal.isBoolean()) {
        return retVal.toBoolean();
    }
    return false;
}

void BaseJSAction::step(float dt)
{
	JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();

	JS::RootedObject jsObj(cx);
	JS::RootedObject proto(cx, jsb_cocos2d_BaseJSAction_prototype->get());
    jsb_ref_get_or_create_jsobject(cx, this, jsb_cocos2d_BaseJSAction_class, proto, &jsObj, "BaseJSAction::step");
	
	JS::RootedValue argv(cx, JS::DoubleValue(dt));
	JS::HandleValueArray args(argv);
	JS::RootedValue owner(cx, JS::ObjectOrNullValue(jsObj));
    ScriptingCore::getInstance()->executeFunctionWithOwner(owner, "step", args);
}

void BaseJSAction::update(float time)
{
	JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();

	JS::RootedObject jsObj(cx);
	JS::RootedObject proto(cx, jsb_cocos2d_BaseJSAction_prototype->get());
    jsb_ref_get_or_create_jsobject(cx, this, jsb_cocos2d_BaseJSAction_class, proto, &jsObj, "BaseJSAction::update");

	JS::RootedValue argv(cx, JS::DoubleValue(time));
	JS::HandleValueArray args(argv);
	JS::RootedValue owner(cx, JS::ObjectOrNullValue(jsObj));
	ScriptingCore::getInstance()->executeFunctionWithOwner(owner, "update", args);
}

NS_CC_END
