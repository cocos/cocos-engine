/*
 * Copyright (c) 2012 Zynga Inc.
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"

#include <typeinfo>
#include "2d/CCAction.h"
#include "2d/CCActionCatmullRom.h"
#include "2d/CCActionEase.h"
#include "2d/CCActionInstant.h"
#include "2d/CCActionInterval.h"
#include "2d/CCActionTween.h"
#include "2d/CCClippingNode.h"
#include "2d/CCMenu.h"
#include "2d/CCNodeGrid.h"
#include "2d/CCRenderTexture.h"
#include "2d/CCSprite.h"
#include "2d/CCTMXLayer.h"
#include "base/CCData.h"
#include "base/CCDirector.h"
#include "base/CCEventDispatcher.h"
#include "base/CCScheduler.h"
#include "platform/CCFileUtils.h"
#include "renderer/ccGLStateCache.h"
#include "scripting/js-bindings/manual/js_bindings_config.h"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "scripting/js-bindings/manual/jsb_event_dispatcher_manual.h"
using namespace cocos2d;

schedFunc_proxy_t *_schedFunc_target_ht = nullptr;
schedTarget_proxy_t *_schedObj_target_ht = nullptr;


// JSFunctionWrapper
JSFunctionWrapper::JSFunctionWrapper(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func)
: _cppOwner(nullptr)
, _cx(cx)
{
    _jsthis = new jsb::Object();
    _func = new jsb::Object();
    _owner = new jsb::Object();
    _data = new jsb::Object();
    
    _jsthis->setObj(cx, jsthis);
    _func->setObj(cx, func);
}
JSFunctionWrapper::JSFunctionWrapper(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
: _cppOwner(nullptr)
, _cx(cx)
{
    _jsthis = new jsb::Object();
    _func = new jsb::Object();
    _owner = new jsb::Object();
    _data = new jsb::Object();
    
    _jsthis->setObj(cx, jsthis);
    _func->setObj(cx, func);
    setOwner(cx, owner);
}

JSFunctionWrapper::~JSFunctionWrapper()
{
    ScriptingCore* sc = ScriptingCore::getInstance();
    
    if (sc->getFinalizing())
    {
        bool ok = true;
        JSContext* cx = sc->getGlobalContext();
        JS::RootedObject ownerObj(cx);
        _owner->getObj(&ownerObj);
        JS::RootedValue ownerVal(_cx, JS::ObjectOrNullValue(ownerObj));
        
        if (!ownerVal.isObject())
        {
            ok = false;
        }
        else if (_cppOwner != nullptr)
        {
            js_proxy *t = jsb_get_js_proxy(cx, ownerObj);
            // JS object already released, no need to do the following release anymore, gc will take care of everything
            if (t == nullptr || _cppOwner != t->ptr)
            {
                ok = false;
            }
        }
        
        if (ok)
        {
            JS::RootedObject obj(cx);
            _jsthis->getObj(&obj);
            JS::RootedValue thisVal(_cx, JS::ObjectOrNullValue(obj));
            if (!thisVal.isNullOrUndefined())
            {
                js_remove_object_reference(ownerVal, thisVal);
            }
            _func->getObj(&obj);
            JS::RootedValue funcVal(_cx, JS::ObjectOrNullValue(obj));
            if (!funcVal.isNullOrUndefined())
            {
                js_remove_object_reference(ownerVal, funcVal);
            }
        }
    }
    
    CC_SAFE_DELETE(_jsthis);
    CC_SAFE_DELETE(_func);
    CC_SAFE_DELETE(_owner);
    CC_SAFE_DELETE(_data);
}

void JSFunctionWrapper::setOwner(JSContext* cx, JS::HandleObject owner)
{
    JS::RootedValue ownerVal(cx, JS::ObjectOrNullValue(owner));
    if (!ownerVal.isNullOrUndefined())
    {
        _owner->setObj(cx, owner);
        js_proxy *t = jsb_get_js_proxy(cx, owner);
        if (t) {
            _cppOwner = t->ptr;
        }
        
        JS::RootedObject obj(cx);
        _jsthis->getObj(&obj);
        JS::RootedValue thisVal(cx, JS::ObjectOrNullValue(obj));
        if (thisVal.isObject() && obj.get() != owner.get())
        {
            js_add_object_reference(ownerVal, thisVal);
        }
        _func->getObj(&obj);
        JS::RootedValue funcVal(cx, JS::ObjectOrNullValue(obj));
        if (funcVal.isObject())
        {
            js_add_object_reference(ownerVal, funcVal);
        }
    }
}

void JSFunctionWrapper::setData(JSContext* cx, JS::HandleObject data)
{
    JS::RootedObject oldData(cx);
    _data->getObj(&oldData);
    _data->setObj(cx, data);
    
    JS::RootedObject owner(cx);
    _owner->getObj(&owner);
    JS::RootedValue ownerVal(cx, JS::ObjectOrNullValue(owner));
    if (!ownerVal.isNullOrUndefined())
    {
        JS::RootedValue dataVal(cx, JS::ObjectOrNullValue(oldData));
        if (!dataVal.isNullOrUndefined())
        {
            js_remove_object_reference(ownerVal, dataVal);
        }
        dataVal.set(JS::ObjectOrNullValue(data));
        if (!dataVal.isNullOrUndefined() && data.get() != owner.get())
        {
            js_add_object_reference(ownerVal, dataVal);
        }
    }
}

void JSFunctionWrapper::getData(JSContext* cx, JS::MutableHandleObject data)
{
    _data->getObj(data);
}

void JSFunctionWrapper::setJSCallback(JSContext* cx, JS::HandleObject callback)
{
    JS::RootedObject oldCallback(cx);
    _func->getObj(&oldCallback);
    _func->setObj(cx, callback);
    
    JS::RootedObject owner(cx);
    _owner->getObj(&owner);
    JS::RootedValue ownerVal(cx, JS::ObjectOrNullValue(owner));
    if (!ownerVal.isNullOrUndefined())
    {
        JS::RootedValue callbackVal(cx, JS::ObjectOrNullValue(oldCallback));
        if (!callbackVal.isNullOrUndefined())
        {
            js_remove_object_reference(ownerVal, callbackVal);
        }
        callbackVal.set(JS::ObjectOrNullValue(callback));
        if (!callbackVal.isNullOrUndefined() && callback.get() != owner.get())
        {
            js_add_object_reference(ownerVal, callbackVal);
        }
    }
}

void JSFunctionWrapper::getJSCallback(JSContext* cx, JS::MutableHandleObject callback)
{
    _func->getObj(callback);
}

void JSFunctionWrapper::setJSTarget(JSContext* cx, JS::HandleObject target)
{
    JS::RootedObject oldThis(cx);
    _jsthis->getObj(&oldThis);
    _jsthis->setObj(cx, target);
    
    JS::RootedObject owner(cx);
    _owner->getObj(&owner);
    JS::RootedValue ownerVal(cx, JS::ObjectOrNullValue(owner));
    if (!ownerVal.isNullOrUndefined())
    {
        JS::RootedValue targetVal(cx, JS::ObjectOrNullValue(oldThis));
        if (!targetVal.isNullOrUndefined())
        {
            js_remove_object_reference(ownerVal, targetVal);
        }
        targetVal.set(JS::ObjectOrNullValue(target));
        if (!targetVal.isNullOrUndefined() && target.get() != owner.get())
        {
            js_add_object_reference(ownerVal, targetVal);
        }
    }
}

void JSFunctionWrapper::getJSTarget(JSContext* cx, JS::MutableHandleObject target)
{
    _jsthis->getObj(target);
}

bool JSFunctionWrapper::invoke(JS::HandleValueArray args, JS::MutableHandleValue rval)
{
    JS::RootedObject thisObj(_cx);
    _jsthis->getObj(&thisObj);
    JS::RootedObject funcObj(_cx);
    _func->getObj(&funcObj);
    JS::RootedValue fval(_cx, JS::ObjectOrNullValue(funcObj));
    bool ok = JS_CallFunctionValue(_cx, thisObj, fval, args, rval);
    if (!ok && JS_IsExceptionPending(_cx)) {
        handlePendingException(_cx);
    }
    return ok;
}


// cc.EventTouch#getTouches
bool js_cocos2dx_EventTouch_getTouches(JSContext *cx, uint32_t argc, JS::Value *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::EventTouch* cobj = (cocos2d::EventTouch *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_EventTouch_getTouches : Invalid Native Object");
    if (argc == 0) {
        const std::vector<cocos2d::Touch*>& ret = cobj->getTouches();
        JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, 0));

        int i = 0;
        for (cocos2d::Touch* touchObj : ret)
        {
            JS::RootedValue arrElement(cx);

            //First, check whether object is associated with js object.
            JS::RootedObject jsobj(cx);
            js_get_or_create_jsobject<cocos2d::Touch>(cx, touchObj, &jsobj);
            if (jsobj)
                arrElement = JS::ObjectOrNullValue(jsobj);
            if (!JS_SetElement(cx, jsretArr, i, arrElement)) {
                break;
            }
            ++i;
        }

        args.rval().set(JS::ObjectOrNullValue(jsretArr));
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_EventTouch_getTouches : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

// cc.EventTouch#setTouches
bool js_cocos2dx_EventTouch_setTouches(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::EventTouch* cobj = (cocos2d::EventTouch *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_EventTouch_setTouches : Invalid Native Object");
    if (argc == 1) {
        std::vector<Touch*> arg0;
        JS::RootedObject jsobj(cx, args.get(0).toObjectOrNull());
        JSB_PRECONDITION3( ok, cx, false, "Error converting value to object");
        bool isArray;
        JSB_PRECONDITION3(JS_IsArrayObject( cx, jsobj, &isArray) && isArray,  cx, false, "Object must be an array");

        uint32_t len = 0;
        JS_GetArrayLength(cx, jsobj, &len);

        for (uint32_t i=0; i < len; i++)
        {
            JS::RootedValue value(cx);
            if (JS_GetElement(cx, jsobj, i, &value))
            {
                JS::RootedObject tmp(cx, value.toObjectOrNull());
                proxy = jsb_get_js_proxy(cx, tmp);
                cocos2d::Touch* touchObj = (cocos2d::Touch *)(proxy ? proxy->ptr : nullptr);
                if (touchObj) {
                    arg0.push_back(touchObj);
                }
            }
        }
        cobj->setTouches(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_EventTouch_setTouches : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

// TODO: This function is deprecated. The new API is "new Menu" instead of "Menu.create"
// There are not js tests for this function. Impossible to know wether it works Ok.
bool js_cocos2dx_CCMenu_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    cocos2d::Menu* menu = nullptr;
    bool ok = false;

    if (argc == 0)
    {
        menu = new (std::nothrow) cocos2d::Menu;
        Vector<MenuItem*> items;
        ok = menu->initWithArray(items);
    }
    else // argc > 0
    {
        Vector<MenuItem*> items;
        uint32_t i = 0;
        while (i < argc) {
            js_proxy_t *proxy;
            JS::RootedObject tmpObj(cx, args.get(i).toObjectOrNull());
            proxy = jsb_get_js_proxy(cx, tmpObj);
            cocos2d::MenuItem *item = (cocos2d::MenuItem*)(proxy ? proxy->ptr : nullptr);
            TEST_NATIVE_OBJECT(cx, item)
            items.pushBack(item);
            i++;
        }
        menu = new (std::nothrow) cocos2d::Menu;
        ok = menu->initWithArray(items);
    }

    if (ok)
    {
        // link the native object with the javascript object
        JS::RootedObject jsobj(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_Menu_prototype->get());
        jsb_ref_create_jsobject(cx, menu, jsb_cocos2d_Menu_class, proto, &jsobj, "cocos2d::Menu");
        args.rval().set(JS::ObjectOrNullValue(jsobj));
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments");
    return false;
}

// TODO: This function is deprecated. The new API is "new MenuItemToggle" instead of "MenuItemToggle.create"
// There are not js tests for this function. Impossible to know weather it works Ok.
bool js_cocos2dx_CCMenuItemToggle_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc >= 1) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
        cocos2d::MenuItemToggle* ret = new (std::nothrow) cocos2d::MenuItemToggle;
        if (ret->initWithItem(nullptr))
        {

            for (uint32_t i=0; i < argc; i++) {
                js_proxy_t *proxy;
                JS::RootedObject tmpObj(cx, args.get(i).toObjectOrNull());
                proxy = jsb_get_js_proxy(cx, tmpObj);
                cocos2d::MenuItem* item = (cocos2d::MenuItem*)(proxy ? proxy->ptr : nullptr);
                TEST_NATIVE_OBJECT(cx, item)
                ret->addSubItem(item);
            }

            ret->setSelectedIndex(0);

            // link the native object with the javascript object
            JS::RootedObject jsobj(cx);
            JS::RootedObject proto(cx, jsb_cocos2d_MenuItemToggle_prototype->get());
            jsb_ref_create_jsobject(cx, ret, jsb_cocos2d_MenuItemToggle_class, proto, &jsobj, "cocos2d::MenuItemToggle");
            args.rval().set(JS::ObjectOrNullValue(jsobj));
            return true;
        }
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments");
    return false;
}

bool js_cocos2dx_CCScene_init(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scene* cobj = (cocos2d::Scene *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Scene_init : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->init();
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_Scene_init : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void js_add_FinalizeHook(JSContext *cx, JS::HandleObject target, bool isRef)
{
    JS::RootedObject hook(cx);
    if (isRef)
    {
        JS::RootedObject proto(cx, jsb_RefFinalizeHook_prototype);
        hook = JS_NewObjectWithGivenProto(cx, jsb_RefFinalizeHook_class, proto);
    }
    else
    {
        JS::RootedObject proto(cx, jsb_ObjFinalizeHook_prototype);
        hook = JS_NewObjectWithGivenProto(cx, jsb_ObjFinalizeHook_class, proto);
    }
    JS::RootedValue hookVal(cx, JS::ObjectOrNullValue(hook));
    JS_SetProperty(cx, target, "__hook", hookVal);
}

bool anonEvaluate(JSContext *cx, JS::HandleObject thisObj, const char* string, JS::MutableHandleValue out)
{
    JS::CompileOptions opts(cx);
    JS::Evaluate(cx, opts, string, (unsigned int)strlen(string), out);
    if (JS_IsExceptionPending(cx)) {
        handlePendingException(cx);
        return false;
    }
    return true;
}

void js_add_object_reference(JS::HandleValue owner, JS::HandleValue target)
{
    if (!owner.isObject() || !target.isObject() || owner == target)
    {
        return;
    }

    ScriptingCore *engine = ScriptingCore::getInstance();
    JSContext *cx = engine->getGlobalContext();
    JS::RootedObject global(cx, engine->getGlobalObject());
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "jsb", &jsbObj);
    JS::RootedValue jsbVal(cx, JS::ObjectOrNullValue(jsbObj));
    if (jsbVal.isNullOrUndefined())
    {
        return;
    }

    JS::RootedValue retval(cx);
    JS::AutoValueVector valArr(cx);
    valArr.append(owner);
    valArr.append(target);
    JS::HandleValueArray args(valArr);

    engine->executeFunctionWithOwner(jsbVal, "registerNativeRef", args, &retval);
}
void js_remove_object_reference(JS::HandleValue owner, JS::HandleValue target)
{
    if (!owner.isObject() || !target.isObject())
    {
        return;
    }
    ScriptingCore *engine = ScriptingCore::getInstance();
    JSContext *cx = engine->getGlobalContext();
    JS::RootedObject global(cx, engine->getGlobalObject());
    JS::RootedObject ownerObj(cx, owner.toObjectOrNull());
    JS::RootedObject targetObj(cx, target.toObjectOrNull());

    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "jsb", &jsbObj);
    JS::RootedValue jsbVal(cx, JS::ObjectOrNullValue(jsbObj));
    if (jsbVal.isNullOrUndefined())
    {
        return;
    }

    JS::RootedValue retval(cx);
    JS::AutoValueVector valArr(cx);
    valArr.append(owner);
    valArr.append(target);
    JS::HandleValueArray args(valArr);

    engine->executeFunctionWithOwner(jsbVal, "unregisterNativeRef", args, &retval);
}
void js_add_object_root(JS::HandleValue target)
{
    if (target.isPrimitive())
    {
        return;
    }

    ScriptingCore *engine = ScriptingCore::getInstance();
    JSContext *cx = engine->getGlobalContext();
    JS::RootedObject global(cx, engine->getGlobalObject());
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "jsb", &jsbObj);
    JS::RootedValue jsbVal(cx, JS::ObjectOrNullValue(jsbObj));
    if (jsbVal.isNullOrUndefined())
    {
        return;
    }

    JS::RootedObject root(cx);
    get_or_create_js_obj(cx, jsbObj, "_root", &root);
    JS::RootedValue valRoot(cx, JS::ObjectOrNullValue(root));

    JS::RootedValue retval(cx);
    JS::AutoValueVector valArr(cx);
    valArr.append(valRoot);
    valArr.append(target);
    JS::HandleValueArray args(valArr);
    
    engine->executeFunctionWithOwner(jsbVal, "registerNativeRef", args, &retval);
}
void js_remove_object_root(JS::HandleValue target)
{
    if (target.isPrimitive())
    {
        return;
    }
    ScriptingCore *engine = ScriptingCore::getInstance();
    JSContext *cx = engine->getGlobalContext();
    JS::RootedObject global(cx, engine->getGlobalObject());
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "jsb", &jsbObj);
    JS::RootedValue jsbVal(cx, JS::ObjectOrNullValue(jsbObj));
    if (jsbVal.isNullOrUndefined())
    {
        return;
    }

    JS::RootedObject root(cx);
    get_or_create_js_obj(cx, jsbObj, "_root", &root);
    JS::RootedValue valRoot(cx, JS::ObjectOrNullValue(root));

    JS::RootedValue retval(cx);
    JS::AutoValueVector valArr(cx);
    valArr.append(valRoot);
    valArr.append(target);
    JS::HandleValueArray args(valArr);

    engine->executeFunctionWithOwner(jsbVal, "unregisterNativeRef", args, &retval);
}

// cc.CallFunc.create( func, this, [data])
// cc.CallFunc.create( func )
static bool js_callFunc(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc >= 1 && argc <= 3) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        cocos2d::CallFuncN *ret = new (std::nothrow) cocos2d::CallFuncN;
        // link the native object with the javascript object
        JS::RootedObject jsobj(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_CallFuncN_prototype->get());
        jsb_ref_create_jsobject(cx, ret, jsb_cocos2d_CallFuncN_class, proto, &jsobj, "cocos2d::CallFuncN");

        JS::RootedObject callback(cx, args.get(0).toObjectOrNull());
        JS::RootedObject thisObj(cx);
        if (argc >= 2)
        {
            thisObj = args.get(1).toObjectOrNull();
        }
        std::shared_ptr<JSFunctionWrapper> tmpCobj(new JSFunctionWrapper(cx, thisObj, callback, jsobj));

        bool ok = ret->initWithFunction([=](Node* sender){
            JS::RootedValue senderVal(cx);
            if (sender == nullptr)
            {
                sender = ret->getTarget();
            }
            if(sender)
            {
                JS::RootedObject nodeObj(cx);
                JS::RootedObject proto(cx, jsb_cocos2d_Node_prototype->get());
                jsb_ref_get_or_create_jsobject(cx, sender, jsb_cocos2d_Node_class, proto, &nodeObj, "cocos2d::Node");
                senderVal.set(JS::ObjectOrNullValue(nodeObj));
            }
            else
            {
                senderVal.set(JS::NullValue());
            }
            
            JS::RootedValue retval(cx);
            JS::HandleValueArray callArgs(senderVal);
            
            tmpCobj->invoke(callArgs, &retval);
        });
        if (ok)
        {
            JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
            args.rval().set(retVal);
            return true;
        }
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_callFunc: Invalid number of arguments");
    return false;
}

// callFunc.initWithFunction( func, this, [data])
// callFunc.initWithFunction( func )
bool js_cocos2dx_CallFunc_initWithFunction(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc >= 1 && argc <= 3) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
        JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
        CallFuncN *action = (cocos2d::CallFuncN *)(proxy ? proxy->ptr : nullptr);
        JSB_PRECONDITION2(action, cx, false, "Invalid Native Object");

        JS::RootedObject callback(cx, args.get(0).toObjectOrNull());
        JS::RootedObject thisObj(cx);
        if (argc >= 2)
        {
            thisObj = args.get(1).toObjectOrNull();
        }
        std::shared_ptr<JSFunctionWrapper> tmpCobj(new JSFunctionWrapper(cx, thisObj, callback, obj));

        action->initWithFunction([=](Node* sender){
            JS::RootedValue senderVal(cx);
            if (sender)
            {
                JS::RootedObject jsobj(cx);
                JS::RootedObject proto(cx, jsb_cocos2d_Node_prototype->get());
                jsb_ref_get_or_create_jsobject(cx, sender, jsb_cocos2d_Node_class, proto, &jsobj, "cocos2d::Node");
                senderVal.set(JS::ObjectOrNullValue(jsobj));
            }
            else
            {
                senderVal.set(JS::NullValue());
            }
            
            JS::RootedValue retval(cx);
            JS::HandleValueArray callArgs(senderVal);
            
            tmpCobj->invoke(callArgs, &retval);
        });
        return true;
    }
    JS_ReportErrorUTF8(cx, "Invalid number of arguments");
    return false;
}

std::string JSScheduleWrapper::_jsRefName = "__sched";

JSScheduleWrapper::JSScheduleWrapper(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func)
: JSFunctionWrapper(cx, jsthis, func)
, cocos2d::Ref()
, _pTarget(nullptr)
, _priority(0)
, _isUpdateSchedule(false)
{
}

JSScheduleWrapper::JSScheduleWrapper(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
: JSFunctionWrapper(cx, jsthis, func, owner)
, cocos2d::Ref()
, _pTarget(nullptr)
, _priority(0)
, _isUpdateSchedule(false)
{
}

void JSScheduleWrapper::setTargetForSchedule(JSContext* cx, JS::HandleValue sched, JSScheduleWrapper *target) {
    do {
        JS::RootedObject jsfunc(cx, sched.toObjectOrNull());
        auto targetArray = getTargetForSchedule(cx, sched);
        if (nullptr == targetArray) {
            targetArray = new (std::nothrow) cocos2d::Vector<JSScheduleWrapper*>;
            schedFunc_proxy_t *p = (schedFunc_proxy_t *)malloc(sizeof(schedFunc_proxy_t));
            assert(p);
            p->jsfuncObj = new jsb::Object(cx, jsfunc, _jsRefName);
            p->targets = targetArray;
            HASH_ADD_PTR(_schedFunc_target_ht, jsfuncObj, p);
        }

        CCASSERT(!targetArray->contains(target), "The target was already added.");

        targetArray->pushBack(target);
    } while(0);
}

cocos2d::Vector<JSScheduleWrapper*>* JSScheduleWrapper::getTargetForSchedule(JSContext *cx, JS::HandleValue sched) {
    schedFunc_proxy_t *t = nullptr;
    JS::RootedObject obj(cx, sched.toObjectOrNull());
    jsb::Object *jsbObj = jsb::Object::getJSBObject(cx, obj, _jsRefName);
    HASH_FIND_PTR(_schedFunc_target_ht, &jsbObj, t);
    return t != nullptr ? t->targets : nullptr;
}


void JSScheduleWrapper::setTargetForJSObject(JSContext* cx, JS::HandleObject jsTargetObj, JSScheduleWrapper *target)
{
    auto targetArray = getTargetForJSObject(cx, jsTargetObj);
    if (nullptr == targetArray) {
        targetArray = new (std::nothrow) cocos2d::Vector<JSScheduleWrapper*>;
        schedTarget_proxy_t *p = (schedTarget_proxy_t *)malloc(sizeof(schedTarget_proxy_t));
        assert(p);
        p->jsTargetObj = new jsb::Object(cx, jsTargetObj, _jsRefName);
        p->targets = targetArray;
        HASH_ADD_PTR(_schedObj_target_ht, jsTargetObj, p);
    }

    CCASSERT(!targetArray->contains(target), "The target was already added.");
    targetArray->pushBack(target);
}

cocos2d::Vector<JSScheduleWrapper*>* JSScheduleWrapper::getTargetForJSObject(JSContext *cx, JS::HandleObject jsTargetObj)
{
    schedTarget_proxy_t *t = nullptr;
    jsb::Object *jsbObj = jsb::Object::getJSBObject(cx, jsTargetObj, _jsRefName);
    HASH_FIND_PTR(_schedObj_target_ht, &jsbObj, t);
    return t != nullptr ? t->targets : nullptr;
}

void JSScheduleWrapper::removeAllTargets()
{
    CCLOGINFO("removeAllTargets begin");
    dump();

    {
        schedFunc_proxy_t *current, *tmp;
        HASH_ITER(hh, _schedFunc_target_ht, current, tmp) {
            current->targets->clear();
            delete current->targets;
            HASH_DEL(_schedFunc_target_ht, current);
            free(current);
        }
    }

    {
        schedTarget_proxy_t *current, *tmp;
        HASH_ITER(hh, _schedObj_target_ht, current, tmp) {
            current->targets->clear();
            delete current->targets;
            HASH_DEL(_schedObj_target_ht, current);
            free(current);
        }
    }

    dump();
    CCLOGINFO("removeAllTargets end");
}

void JSScheduleWrapper::removeAllTargetsForMinPriority(int minPriority)
{
    CCLOGINFO("removeAllTargetsForPriority begin");
    dump();

    {
        schedFunc_proxy_t *current, *tmp;
        HASH_ITER(hh, _schedFunc_target_ht, current, tmp) {
            std::vector<JSScheduleWrapper*> objectsNeedToBeReleased;
            auto targets = current->targets;
            for (const auto& pObj : *targets)
            {
                JSScheduleWrapper* wrapper = pObj;
                bool isUpdateSchedule = wrapper->isUpdateSchedule();
                if (!isUpdateSchedule || (isUpdateSchedule && wrapper->getPriority() >= minPriority))
                {
                    objectsNeedToBeReleased.push_back(pObj);
                }
            }

            std::vector<JSScheduleWrapper*>::iterator iter = objectsNeedToBeReleased.begin();
            for (; iter != objectsNeedToBeReleased.end(); ++iter)
            {
                targets->eraseObject(*iter, true);
            }

            if (targets->empty())
            {
                HASH_DEL(_schedFunc_target_ht, current);
                delete targets;
                free(current);
            }
        }
    }

    {
        schedTarget_proxy_t *current, *tmp;
        HASH_ITER(hh, _schedObj_target_ht, current, tmp) {
            std::vector<JSScheduleWrapper*> objectsNeedToBeReleased;
            auto targets = current->targets;
            for (const auto& pObj : *targets)
            {
                JSScheduleWrapper* wrapper = pObj;
                bool isUpdateSchedule = wrapper->isUpdateSchedule();
                if (!isUpdateSchedule || (isUpdateSchedule && wrapper->getPriority() >= minPriority))
                {
                    CCLOG("isUpdateSchedule2:%d", isUpdateSchedule);
                    objectsNeedToBeReleased.push_back(pObj);
                }
            }

            auto iter = objectsNeedToBeReleased.begin();
            for (; iter != objectsNeedToBeReleased.end(); ++iter)
            {
                targets->eraseObject(*iter, true);
            }

            if (targets->empty())
            {
                HASH_DEL(_schedObj_target_ht, current);
                delete targets;
                free(current);
            }
        }
    }

    dump();
    CCLOGINFO("removeAllTargetsForPriority end");
}

void JSScheduleWrapper::removeAllTargetsForJSObject(JSContext *cx, JS::HandleObject jsTargetObj)
{
    CCLOGINFO("removeAllTargetsForNatiaveNode begin");
    dump();
    cocos2d::Vector<JSScheduleWrapper*>* removeNativeTargets = nullptr;
    schedTarget_proxy_t *t = nullptr;
    jsb::Object *jsbObj = jsb::Object::getJSBObject(cx, jsTargetObj, _jsRefName);
    HASH_FIND_PTR(_schedObj_target_ht, &jsbObj, t);
    if (t != nullptr) {
        removeNativeTargets = t->targets;
        HASH_DEL(_schedObj_target_ht, t);
    }

    if (removeNativeTargets == nullptr) return;

    schedFunc_proxy_t *current, *tmp;
    HASH_ITER(hh, _schedFunc_target_ht, current, tmp) {
        std::vector<JSScheduleWrapper*> objectsNeedToBeReleased;
        auto targets = current->targets;
        for (const auto& pObj : *targets)
        {
            if (removeNativeTargets->contains(pObj))
            {
                objectsNeedToBeReleased.push_back(pObj);
            }
        }

        auto iter = objectsNeedToBeReleased.begin();
        for (; iter != objectsNeedToBeReleased.end(); ++iter)
        {
            targets->eraseObject(*iter, true);
        }

        if (targets->empty())
        {
            HASH_DEL(_schedFunc_target_ht, current);
            delete targets;
            free(current);
        }
    }

    removeNativeTargets->clear();
    delete removeNativeTargets;
    free(t);
    dump();
    CCLOGINFO("removeAllTargetsForNatiaveNode end");
}

void JSScheduleWrapper::removeTargetForJSObject(JSContext *cx, JS::HandleObject jsTargetObj, JSScheduleWrapper* target)
{
    CCLOGINFO("removeTargetForJSObject begin");
    dump();
    schedTarget_proxy_t *t = nullptr;
    jsb::Object *jsbObj = jsb::Object::getJSBObject(cx, jsTargetObj, _jsRefName);
    HASH_FIND_PTR(_schedObj_target_ht, &jsbObj, t);
    if (t != nullptr) {
        target->retain();
        target->autorelease();
        t->targets->eraseObject(target,true);
        if (t->targets->empty())
        {
            delete t->targets;
            HASH_DEL(_schedObj_target_ht, t);
            free(t);
        }
    }

    schedFunc_proxy_t *current, *tmp, *removed=nullptr;

    HASH_ITER(hh, _schedFunc_target_ht, current, tmp) {
        auto targets = current->targets;
        for (const auto& pObj : *targets)
        {
            JSScheduleWrapper* pOneTarget = pObj;
            if (pOneTarget == target)
            {
                removed = current;
                break;
            }
        }
        if (removed) break;
    }

    if (removed)
    {
        removed->targets->eraseObject(target, true);
        if (removed->targets->empty())
        {
            delete removed->targets;
            HASH_DEL(_schedFunc_target_ht, removed);
            free(removed);
        }
    }
    dump();
    CCLOGINFO("removeTargetForJSObject end");
}

void JSScheduleWrapper::dump()
{
#if COCOS2D_DEBUG > 1
    CCLOG("\n---------JSScheduleWrapper dump begin--------------\n");
    CCLOG("target hash count = %d, func hash count = %d", HASH_COUNT(_schedObj_target_ht), HASH_COUNT(_schedFunc_target_ht));
    schedTarget_proxy_t *current, *tmp;
    int nativeTargetsCount = 0;
    HASH_ITER(hh, _schedObj_target_ht, current, tmp) {
        auto targets = current->targets;
        for (const auto& pObj : *targets)
        {
            CCLOG("js target ( %p ), native target[%d]=( %p )", current->jsTargetObj, nativeTargetsCount, pObj);
            nativeTargetsCount++;
        }
    }

    CCLOG("\n-----------------------------\n");

    schedFunc_proxy_t *current_func, *tmp_func;
    int jsfuncTargetCount = 0;
    HASH_ITER(hh, _schedFunc_target_ht, current_func, tmp_func)
    {
        auto targets = current_func->targets;
        for (const auto& pObj : *targets)
        {
            CCLOG("js func ( %p ), native target[%d]=( %p )", current_func->jsfuncObj, jsfuncTargetCount, pObj);
            jsfuncTargetCount++;
        }
    }
    CCASSERT(nativeTargetsCount == jsfuncTargetCount, "nativeTargetsCount should be equal to jsfuncTargetCount.");
    CCLOG("\n---------JSScheduleWrapper dump end--------------\n");
#endif
}

void JSScheduleWrapper::scheduleFunc(float dt)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    
    JS::RootedValue data(cx, JS::DoubleValue(dt));
    JS::RootedObject callback(cx);
    getJSCallback(cx, &callback);
    JS::RootedValue callbackVal(cx, JS::ObjectOrNullValue(callback));
    if(!callbackVal.isNullOrUndefined())
    {
        auto exist = JSScheduleWrapper::getTargetForSchedule(cx, callbackVal);
        if (exist)
        {
            JS::HandleValueArray args(data);
            JS::RootedValue retval(cx);
            invoke(args, &retval);
        }
    }
}

void JSScheduleWrapper::update(float dt)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedValue data(cx, JS::DoubleValue(dt));
    JS::HandleValueArray args(data);
    JS::RootedValue retval(cx);
    invoke(args, &retval);
}

Ref* JSScheduleWrapper::getTarget()
{
    return _pTarget;
}

void JSScheduleWrapper::setTarget(Ref* pTarget)
{
    _pTarget = pTarget;
}

void JSScheduleWrapper::setPriority(int priority)
{
    _priority = priority;
}

int  JSScheduleWrapper::getPriority()
{
    return _priority;
}

void JSScheduleWrapper::setUpdateSchedule(bool isUpdateSchedule)
{
    _isUpdateSchedule = isUpdateSchedule;
}

bool JSScheduleWrapper::isUpdateSchedule()
{
    return _isUpdateSchedule;
}

bool js_CCNode_unschedule(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc == 1) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
        cocos2d::Node *node = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
        JSB_PRECONDITION2(node, cx, false, "Invalid Native Object");

        Scheduler *sched = node->getScheduler();

        auto targetArray = JSScheduleWrapper::getTargetForSchedule(cx, args.get(0));
        if (targetArray) {
            CCLOGINFO("unschedule target number: %ld", static_cast<long>(targetArray->size()));

            JS::RootedObject func(cx, args.get(0).toObjectOrNull());
            for (const auto& tmp : *targetArray)
            {
                JSScheduleWrapper* wrapper = tmp;
                JS::RootedObject wrapperFunc(cx);
                wrapper->getJSCallback(cx, &wrapperFunc);
                if (node == wrapper->getTarget() && wrapperFunc.get() == func.get())
                {
                    sched->unschedule(schedule_selector(JSScheduleWrapper::scheduleFunc), wrapper);
                    JSScheduleWrapper::removeTargetForJSObject(cx, obj, wrapper);
                    break;
                }
            }
        }

        args.rval().setUndefined();
    }
    return true;
}

bool js_cocos2dx_CCNode_unscheduleAllSelectors(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 0)
    {
        cobj->unscheduleAllCallbacks();

        auto arr = JSScheduleWrapper::getTargetForJSObject(cx, obj);
        // If there aren't any targets, just return true.
        // Otherwise, the for loop will break immediately.
        // It will lead to logic errors.
        // For details to reproduce it, please refer to SchedulerTest/SchedulerUpdate.
        if(! arr) return true;
        JSScheduleWrapper* wrapper = nullptr;
        for(ssize_t i = 0; i < arr->size(); ++i) {
            wrapper = (JSScheduleWrapper*)arr->at(i);
            if(wrapper) {
                cobj->getScheduler()->unscheduleAllForTarget(wrapper);
            }
        }

        JSScheduleWrapper::removeAllTargetsForJSObject(cx, obj);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_CCNode_scheduleOnce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc >= 1) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedValue thisValue(cx, args.thisv());
        JS::RootedObject obj(cx, thisValue.toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
        cocos2d::Node *node = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
        if (node == nullptr) {
            return false;
        }

        Scheduler *sched = node->getScheduler();
        if (sched == nullptr) {
            return false;
        }
        JSScheduleWrapper *tmpCobj = nullptr;

        JS::RootedObject jsFunc(cx, args.get(0).toObjectOrNull());
        //
        // delay
        //
        double delay = 0;
        if( argc >= 2 && args.get(1).isNumber() ) {
            delay = args.get(1).toNumber();
        }

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(cx, obj);
        if (pTargetArr)
        {
            JS::RootedObject wrapperFunc(cx);
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = pObj;
                pTarget->getJSCallback(cx, &wrapperFunc);
                if (jsFunc.get() == wrapperFunc.get())
                {
                    tmpCobj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCobj = new (std::nothrow) JSScheduleWrapper(cx, obj, jsFunc, obj);
            tmpCobj->autorelease();
            tmpCobj->setTarget(node);

            JSScheduleWrapper::setTargetForSchedule(cx, args.get(0), tmpCobj);
            JSScheduleWrapper::setTargetForJSObject(cx, obj, tmpCobj);
        }

        if(argc == 1) {
            sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCobj, 0, 0, 0.0f, !node->isRunning());
        } else {
            sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCobj, 0, 0, delay, !node->isRunning());
        }

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments");
    return false;
}

bool js_CCNode_schedule(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc >= 1) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedValue thisValue(cx, args.thisv());
        JS::RootedObject obj(cx, thisValue.toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
        cocos2d::Node *node = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
        Scheduler *sched = node->getScheduler();

        JSScheduleWrapper *tmpCobj = nullptr;
        
        JS::RootedObject jsFunc(cx, args.get(0).toObjectOrNull());

        double interval = 0.0;
        if( argc >= 2 && args.get(1).isNumber() ) {
            interval = args.get(1).toNumber();
        }

        //
        // repeat
        //
        double repeat = 0.0;
        if( argc >= 3 && args.get(2).isNumber() ) {
            repeat = args.get(2).toNumber();
        }

        //
        // delay
        //
        double delay = 0.0;
        if( argc >= 4 && args.get(3).isNumber() ) {
            delay = args.get(3).toNumber();
        }

        bool bFound = false;
        auto targetArray = JSScheduleWrapper::getTargetForJSObject(cx, obj);
        if (targetArray)
        {
            JS::RootedObject wrapperFunc(cx);
            for (auto&& pObj : *targetArray)
            {
                auto target = pObj;
                target->getJSCallback(cx, &wrapperFunc);
                if (jsFunc.get() == wrapperFunc.get())
                {
                    tmpCobj = target;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCobj = new (std::nothrow) JSScheduleWrapper(cx, obj, jsFunc, obj);
            tmpCobj->autorelease();
            tmpCobj->setTarget(node);
            JSScheduleWrapper::setTargetForSchedule(cx, args.get(0), tmpCobj);
            JSScheduleWrapper::setTargetForJSObject(cx, obj, tmpCobj);
        }

        if(argc == 1) {
            sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCobj, 0, !node->isRunning());
        }else if(argc == 2) {
            sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCobj, interval, !node->isRunning());
        }else if(argc == 3) {
            sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCobj, interval, (unsigned int)repeat, 0, !node->isRunning());
        }else if (argc == 4) {
            sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCobj, interval, (unsigned int)repeat, delay, !node->isRunning());
        }

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments");
    return false;
}

bool js_cocos2dx_CCNode_scheduleUpdateWithPriority(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedValue thisValue(cx, args.thisv());
    JS::RootedObject obj(cx, thisValue.toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        bool isFoundUpdate = false;
        ok = JS_HasProperty(cx, obj, "update", &isFoundUpdate);
        JS::RootedObject jsUpdateFunc(cx);
        JS::RootedValue updateFuncVal(cx);
        if (ok && isFoundUpdate) {
            ok = JS_GetProperty(cx, obj, "update", &updateFuncVal);
            jsUpdateFunc.set(updateFuncVal.toObjectOrNull());
        }

        // if no 'update' property, return true directly.
        if (!ok) {
            args.rval().setUndefined();
            return true;
        }

        JSScheduleWrapper* tmpCobj = nullptr;

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(cx, obj);
        if (pTargetArr)
        {
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = pObj;
                if (pTarget && pTarget->isUpdateSchedule())
                {
                    tmpCobj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCobj = new (std::nothrow) JSScheduleWrapper(cx, obj, jsUpdateFunc);
            tmpCobj->autorelease();
            tmpCobj->setTarget(cobj);
            tmpCobj->setUpdateSchedule(true);
            JSScheduleWrapper::setTargetForSchedule(cx, updateFuncVal, tmpCobj);
            JSScheduleWrapper::setTargetForJSObject(cx, obj, tmpCobj);
        }

        tmpCobj->setPriority(arg0);
        cobj->getScheduler()->scheduleUpdate(tmpCobj, arg0, !cobj->isRunning());

        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_unscheduleUpdate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 0)
    {
        cobj->unscheduleUpdate();
        do {
            auto arr = JSScheduleWrapper::getTargetForJSObject(cx, obj);
            // If there aren't any targets, just return true.
            // Otherwise, the for loop will break immediately.
            // It will lead to logic errors.
            // For details to reproduce it, please refer to SchedulerTest/SchedulerUpdate.
            if(! arr) return true;

            JSScheduleWrapper* wrapper = nullptr;
            for(ssize_t i = 0; i < arr->size(); ++i) {
                wrapper = (JSScheduleWrapper*)arr->at(i);
                if(wrapper && wrapper->isUpdateSchedule()) {
                    cobj->getScheduler()->unscheduleUpdate(wrapper);
                    JS::RootedObject wrapperTarget(cx);
                    wrapper->getJSTarget(cx, &wrapperTarget);
                    CCASSERT(obj.get() == wrapperTarget.get(), "Wrong target object.");
                    JSScheduleWrapper::removeTargetForJSObject(cx, obj, wrapper);
                    break;
                }
            }
        } while (0);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_CCNode_scheduleUpdate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedValue thisValue(cx, args.thisv());
    JS::RootedObject obj(cx, thisValue.toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 0) {
        bool isFoundUpdate = false;
        ok = JS_HasProperty(cx, obj, "update", &isFoundUpdate);
        JS::RootedObject jsUpdateFunc(cx);
        JS::RootedValue updateFuncVal(cx);
        if (ok && isFoundUpdate) {
            ok = JS_GetProperty(cx, obj, "update", &updateFuncVal);
            jsUpdateFunc.set(updateFuncVal.toObjectOrNull());
        }

        // if no 'update' property, return true directly.
        if (!ok) {
            args.rval().setUndefined();
            return true;
        }

        JSScheduleWrapper* tmpCobj = nullptr;

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(cx, obj);
        if (pTargetArr)
        {
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = pObj;
                if (pTarget->isUpdateSchedule())
                {
                    tmpCobj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCobj = new (std::nothrow) JSScheduleWrapper(cx, obj, jsUpdateFunc);
            tmpCobj->autorelease();
            tmpCobj->setTarget(cobj);
            tmpCobj->setUpdateSchedule(true);
            JSScheduleWrapper::setTargetForSchedule(cx, updateFuncVal, tmpCobj);
            JSScheduleWrapper::setTargetForJSObject(cx, obj, tmpCobj);
        }

        cobj->getScheduler()->scheduleUpdate(tmpCobj, 0, !cobj->isRunning());

        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_unscheduleAllSelectorsForTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 1) {
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());

            auto arr = JSScheduleWrapper::getTargetForJSObject(cx, tmpObj);
            // If there aren't any targets, just return true.
            // Otherwise, the for loop will break immediately.
            // It will lead to logic errors.
            // For details to reproduce it, please refer to SchedulerTest/SchedulerUpdate.
            if(! arr) return true;

            JSScheduleWrapper* wrapper = nullptr;
            for(ssize_t i = 0; i < arr->size(); ++i) {
                wrapper = (JSScheduleWrapper*)arr->at(i);
                if(wrapper) {
                    cobj->unscheduleAllForTarget(wrapper);
                }
            }
            JSScheduleWrapper::removeAllTargetsForJSObject(cx, tmpObj);

        } while (0);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_CCScheduler_scheduleUpdateForTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc >= 1) {
        bool ok = true;
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
        JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
        cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

        JSScheduleWrapper *tmpCObj = nullptr;

        JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
        proxy = jsb_get_js_proxy(cx, tmpObj);

        bool isFoundUpdate = false;
        ok = JS_HasProperty(cx, tmpObj, "update", &isFoundUpdate);
        JS::RootedObject jsUpdateFunc(cx);
        JS::RootedValue updateFuncVal(cx);
        if (ok && isFoundUpdate) {
            ok = JS_GetProperty(cx, tmpObj, "update", &updateFuncVal);
            jsUpdateFunc.set(updateFuncVal.toObjectOrNull());
        }

        // if no 'update' property, return true directly.
        if (!ok) {
            args.rval().setUndefined();
            return true;
        }

        int arg1 = 0;
        if (argc >= 2) {
            ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        }

        bool paused = false;

        if( argc >= 3 ) {
            ok &= jsval_to_bool(cx, args.get(2), &paused);
        }

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(cx, tmpObj);
        if (pTargetArr)
        {
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = pObj;
                if (pTarget->isUpdateSchedule())
                {
                    tmpCObj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCObj = new (std::nothrow) JSScheduleWrapper(cx, tmpObj, jsUpdateFunc, obj);
            tmpCObj->autorelease();
            tmpCObj->setUpdateSchedule(true);

            JSScheduleWrapper::setTargetForSchedule(cx, updateFuncVal, tmpCObj);
            JSScheduleWrapper::setTargetForJSObject(cx, tmpObj, tmpCObj);
        }
        tmpCObj->setPriority(arg1);
        sched->scheduleUpdate(tmpCObj, arg1, paused);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments");
    return false;
}

bool js_CCScheduler_unscheduleUpdateForTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 1) {
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());

            auto arr = JSScheduleWrapper::getTargetForJSObject(cx, tmpObj);
            // If there aren't any targets, just return true.
            // Otherwise, the for loop will break immediately.
            // It will lead to logic errors.
            // For details to reproduce it, please refer to SchedulerTest/SchedulerUpdate.
            if(! arr) return true;

            JSScheduleWrapper* wrapper = nullptr;
            for(ssize_t i = 0; i < arr->size(); ++i) {
                wrapper = (JSScheduleWrapper*)arr->at(i);
                if(wrapper && wrapper->isUpdateSchedule()) {
                    cobj->unscheduleUpdate(wrapper);
                    JS::RootedObject wrapperTarget(cx);
                    wrapper->getJSTarget(cx, &wrapperTarget);
                    CCASSERT(tmpObj.get() == wrapperTarget.get(), "Wrong target object.");
                    JSScheduleWrapper::removeTargetForJSObject(cx, tmpObj, wrapper);
                    break;
                }
            }
        } while (0);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_CCScheduler_scheduleCallbackForTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc >= 2) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
        cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

        JSScheduleWrapper *tmpCObj = nullptr;

        JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
        proxy = jsb_get_js_proxy(cx, tmpObj);
        
        JS::RootedObject jsFunc(cx, args.get(1).toObjectOrNull());

        double interval = 0;
        if( argc >= 3 && args.get(2).isNumber() ) {
            interval = args.get(2).toNumber();
        }

        //
        // repeat
        //
        double repeat = kRepeatForever;
        if( argc >= 4 && args.get(3).isNumber() ) {
            repeat = args.get(3).toNumber();
        }

        //
        // delay
        //
        double delay = 0;
        if( argc >= 5 && args.get(4).isNumber() ) {
            delay = args.get(4).toNumber();
        }

        bool paused = false;

        if( argc >= 6 && args.get(5).isBoolean() ) {
            paused = args.get(5).toBoolean();
        }

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(cx, tmpObj);
        if (pTargetArr)
        {
            JS::RootedObject wrapperFunc(cx);
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = pObj;
                pTarget->getJSCallback(cx, &wrapperFunc);
                if (jsFunc.get() == wrapperFunc.get())
                {
                    tmpCObj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCObj = new (std::nothrow) JSScheduleWrapper(cx, tmpObj, jsFunc, obj);
            tmpCObj->autorelease();

            JSScheduleWrapper::setTargetForSchedule(cx, args.get(1), tmpCObj);
            JSScheduleWrapper::setTargetForJSObject(cx, tmpObj, tmpCObj);
        }

        sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCObj, interval, repeat, delay, paused);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments");
    return false;
}

bool js_CCScheduler_schedule(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc >= 2) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
        cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

        std::function<void (float)> callback;
        JS::RootedObject targetObj(cx);
        do {
            JS::RootedObject callbackObj(cx);
            if (JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
            {
                callbackObj.set(args.get(0).toObjectOrNull());
                targetObj.set(args.get(1).toObjectOrNull());
            }
            else if (JS_TypeOfValue(cx, args.get(1)) == JSTYPE_FUNCTION)
            {
                targetObj.set(args.get(0).toObjectOrNull());
                callbackObj.set(args.get(1).toObjectOrNull());
            }
            else
            {
                callback = nullptr;
                JSB_PRECONDITION2(false, cx, false, "Error processing arguments");
            }

            std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, targetObj, callbackObj, obj));
            auto lambda = [=](float larg0) -> void {
                JS::RootedValue largv(cx, JS::DoubleValue(larg0));
                JS::RootedValue rval(cx);
                JS::HandleValueArray args(largv);
                bool invokeOk = func->invoke(args, &rval);
                if (!invokeOk && JS_IsExceptionPending(cx)) {
                    handlePendingException(cx);
                }
            };
            callback = lambda;
        } while(0);

        double interval = 0;
        if( argc >= 3 && args.get(2).isNumber() ) {
            interval = args.get(2).toNumber();
        }

        //
        // repeat
        //
        double repeat = kRepeatForever;
        if( argc >= 4 && args.get(3).isNumber() ) {
            repeat = args.get(3).toNumber();
        }

        //
        // delay
        //
        double delay = 0;
        if( argc >= 5 && args.get(4).isNumber() ) {
            delay = args.get(4).toNumber();
        }

        bool paused = false;
        if( argc >= 6 && args.get(5).isBoolean() ) {
            paused = args.get(5).toBoolean();
        }

        std::string key;
        if ( argc >= 7 ) {
            jsval_to_std_string(cx, args.get(6), &key);
        }

        sched->schedule(callback, targetObj, interval, repeat, delay, paused, key);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments");
    return false;
}

bool js_CCScheduler_unscheduleCallbackForTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 2) {
        do {
            if (args.get(0).isString()) {
                std::string key;
                bool ok = jsval_to_std_string(cx, args.get(0), &key);
                JSB_PRECONDITION2(ok, cx, false, "Error processing argument: key");

                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                cobj->unschedule(key, tmpObj);
            }
            else {
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());

                auto arr = JSScheduleWrapper::getTargetForJSObject(cx, tmpObj);
                // If there aren't any targets, just return true.
                // Otherwise, the for loop will break immediately.
                // It will lead to logic errors.
                // For details to reproduce it, please refer to SchedulerTest/SchedulerUpdate.
                if(! arr) return true;

                JS::RootedObject tmpFunc(cx, args.get(1).toObjectOrNull());
                JSScheduleWrapper* wrapper = nullptr;
                for(ssize_t i = 0; i < arr->size(); ++i) {
                    wrapper = (JSScheduleWrapper*)arr->at(i);
                    JS::RootedObject wrapperFunc(cx);
                    wrapper->getJSCallback(cx, &wrapperFunc);
                    if(wrapperFunc.get() == tmpFunc.get()) {
                        cobj->unschedule(schedule_selector(JSScheduleWrapper::scheduleFunc), wrapper);
                        JSScheduleWrapper::removeTargetForJSObject(cx, tmpObj, wrapper);
                        break;
                    }
                }
            }
        } while (0);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_unscheduleAll(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 0) {
        cobj->unscheduleAll();
        JSScheduleWrapper::removeAllTargets();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_unscheduleAllCallbacksWithMinPriority(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        int arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->unscheduleAllWithMinPriority(arg0);
        JSScheduleWrapper::removeAllTargetsForMinPriority(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}


bool js_cocos2dx_CCScheduler_pauseTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

    if (argc == 1) {
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            auto arr = JSScheduleWrapper::getTargetForJSObject(cx, tmpObj);
            if(! arr) return true;
            for(ssize_t i = 0; i < arr->size(); ++i) {
                if(arr->at(i)) {
                    sched->pauseTarget(arr->at(i));
                }
            }

        } while (0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_resumeTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

    if (argc == 1) {
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            auto arr = JSScheduleWrapper::getTargetForJSObject(cx, tmpObj);
            if(! arr) return true;
            for(ssize_t i = 0; i < arr->size(); ++i) {
                if(arr->at(i)) {
                    sched->resumeTarget(arr->at(i));
                }
            }

        } while (0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_isTargetPaused(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        bool ret = false;
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            auto arr = JSScheduleWrapper::getTargetForJSObject(cx, tmpObj);
            if(! arr) return true;
            for(ssize_t i = 0; i < arr->size(); ++i) {
                if(arr->at(i)) {
                    ret = cobj->isTargetPaused(arr->at(i)) ? true : false;
                    // break directly since all targets have the same `pause` status.
                    break;
                }
            }
        } while (0);
        args.rval().set(JS::BooleanValue(ret));
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_isScheduled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj);

    if (argc == 2) {
        bool isScheduled = false;
        JS::RootedObject funcObj(cx, args.get(0).toObjectOrNull());
        JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());

        auto arr = JSScheduleWrapper::getTargetForJSObject(cx, tmpObj);
        if(! arr) {
    	    args.rval().set(JS::BooleanValue(isScheduled));
    	    return true;
        };
        JSScheduleWrapper* wrapper = nullptr;
        JS::RootedObject wrapperFunc(cx);
        for (ssize_t i = 0; i < arr->size(); ++i) {
            wrapper = (JSScheduleWrapper*)arr->at(i);
            wrapper->getJSCallback(cx, &wrapperFunc);
            if(wrapper && funcObj.get() == wrapperFunc.get()) {
                isScheduled = cobj->isScheduled(schedule_selector(JSScheduleWrapper::scheduleFunc), wrapper);
                break;
            }
        }
        args.rval().set(JS::BooleanValue(isScheduled));
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_pauseAllTargets(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj);

    if (argc == 0) {
        cobj->pauseAllTargets();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_pauseAllTargetsWithMinPriority(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj);
    bool ok = true;
    if (argc == 1) {
        int arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->pauseAllTargetsWithMinPriority(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_resumeTargets(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj);

    if (argc == 1) {
        JS::RootedValue v(cx, args.get(0));

        bool ok = v.isObject() && JS_ValueToObject(cx, v, &obj);
        JSB_PRECONDITION3(ok, cx, false, "Error converting value to object");
        JSB_PRECONDITION3(JS_IsArrayObject(cx, obj, &ok) && ok, cx, false, "Object must be an array");

        uint32_t len = 0;
        JS_GetArrayLength(cx, obj, &len);

        std::set<void*> arg0;

        for (uint32_t i = 0; i < len; i++) {
        JS::RootedValue value(cx);
            if (JS_GetElement(cx, obj, i, &value)) {
                if (value.isObject()) {
                    JS::RootedObject element(cx, value.toObjectOrNull());
                    arg0.insert(element);
                }
            }
        }

        cobj->resumeTargets(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_forceGC(JSContext *cx, uint32_t argc, JS::Value *vp) {
    JS_GC(cx);
    return true;
}

bool js_cocos2dx_retain(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
#if ! CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Ref* cobj = (cocos2d::Ref *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_retain : Invalid Native Object");

    cobj->retain();
#endif // CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_release(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
#if ! CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Ref* cobj = (cocos2d::Ref *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_release : Invalid Native Object");

    cobj->release();
#endif // CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_onEnter(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_onEnter : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->onEnter();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_onExit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_onExit : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->onExit();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_onEnterTransitionDidFinish(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_onEnterTransitionDidFinish : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->onEnterTransitionDidFinish();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_onExitTransitionDidStart(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_onExitTransitionDidStart : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->onExitTransitionDidStart();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_cleanup(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_cleanup : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->cleanup();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_CCNode_setPosition(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 1) {
        cocos2d::Point arg0;
        ok &= jsval_to_ccpoint(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cobj->setPosition(arg0);
        args.rval().setUndefined();
        return true;
    } if (argc == 2) {
        double x, y;
        ok &= jsval_to_double(cx, args.get(0), &x);
        ok &= jsval_to_double(cx, args.get(1), &y);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        
        cobj->setPosition(Point(x,y));
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_setContentSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cobj->setContentSize(arg0);
        args.rval().setUndefined();
        return true;
    } if (argc == 2) {
        double width, height;
        ok &= jsval_to_double(cx, args.get(0), &width);
        ok &= jsval_to_double(cx, args.get(1), &height);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cobj->setContentSize(Size(width,height));
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_setAnchorPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 1) {
        cocos2d::Point arg0;
        ok &= jsval_to_ccpoint(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cobj->setAnchorPoint(arg0);
        args.rval().setUndefined();
        return true;
    } if (argc == 2) {
        double x, y;
        ok &= jsval_to_double(cx, args.get(0), &x);
        ok &= jsval_to_double(cx, args.get(1), &y);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        
        cobj->setAnchorPoint(Point(x,y));
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_setColor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_setColor : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Color3B arg0;
        ok &= jsval_to_cccolor3b(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Node_setColor : Error processing arguments");
        cobj->setColor(arg0);

        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_Node_setColor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_pause(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_pause : Invalid Native Object");
    if (argc == 0) {
        do {
            auto arr = JSScheduleWrapper::getTargetForJSObject(cx, obj);
            if(arr){
                JSScheduleWrapper* wrapper = nullptr;
                for(ssize_t i = 0; i < arr->size(); ++i) {
                    wrapper = (JSScheduleWrapper*)arr->at(i);
                    if(wrapper) {
                        cobj->getScheduler()->pauseTarget(wrapper);
                    }
                }
            }
        } while (0);

        cobj->pause();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_Node_pause : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_CCNode_resume(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_resume : Invalid Native Object");
    if (argc == 0) {
        do {
            auto arr = JSScheduleWrapper::getTargetForJSObject(cx, obj);
            if(arr){
                JSScheduleWrapper* wrapper = nullptr;
                for(ssize_t i = 0; i < arr->size(); ++i) {
                    wrapper = (JSScheduleWrapper*)arr->at(i);
                    if(wrapper) {
                        cobj->getScheduler()->resumeTarget(wrapper);
                    }
                }
            }
        } while (0);

        cobj->resume();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_Node_resume : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_CCNode_convertToWorldSpace(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CCNode_convertToWorldSpace : Invalid Native Object");
    cocos2d::Vec2 arg0;
    if (argc == 1) {
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CCNode_convertToWorldSpace : Error processing arguments");
    }
    else if (argc != 0) {
        JS_ReportErrorUTF8(cx, "js_cocos2dx_CCNode_convertToWorldSpace : wrong number of arguments: %d, was expecting 0 or 1", argc);
        return false;
    }

    cocos2d::Vec2 ret = cobj->convertToWorldSpace(arg0);
    JS::RootedValue jsret(cx);
    vector2_to_jsval(cx, ret, &jsret);
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_CCNode_convertToWorldSpaceAR(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CCNode_convertToWorldSpaceAR : Invalid Native Object");
    cocos2d::Vec2 arg0;
    if (argc == 1) {
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CCNode_convertToWorldSpaceAR : Error processing arguments");
    }
    else if (argc != 0) {
        JS_ReportErrorUTF8(cx, "js_cocos2dx_CCNode_convertToWorldSpaceAR : wrong number of arguments: %d, was expecting 0 or 1", argc);
        return false;
    }

    cocos2d::Vec2 ret = cobj->convertToWorldSpaceAR(arg0);
    JS::RootedValue jsret(cx);
    vector2_to_jsval(cx, ret, &jsret);
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_CCTMXLayer_getTiles(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::TMXLayer* cobj = (cocos2d::TMXLayer *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 0) {
        auto ret = cobj->getTiles();
        Size size = cobj->getLayerSize();
        int count = size.width * size.height;
        JS::RootedObject array(cx, JS_NewUint32Array(cx, count));
        if (nullptr == array) {
            JS_ReportErrorUTF8(cx, "Can't allocate enough memory.");
            return false;
        }
        bool flag;
        uint32_t* bufdata = (uint32_t*)JS_GetArrayBufferViewData(array, &flag, JS::AutoCheckCannotGC());
        memcpy(bufdata, ret, count*sizeof(int32_t));

        args.rval().set(JS::ObjectOrNullValue(array));
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}


// Actions

bool js_cocos2dx_ActionInterval_repeat(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ActionInterval_repeat : Invalid Native Object");

    if (argc == 1)
    {
        int timesInt;
        bool ok = jsval_to_int32(cx, args.get(0), (int32_t*)&timesInt);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_ActionInterval_repeat : Error processing arguments");
        if (timesInt <= 0) {
            JS_ReportErrorUTF8(cx, "js_cocos2dx_ActionInterval_repeat : Repeat times must be greater than 0");
        }

        cocos2d::Repeat* action = new (std::nothrow) cocos2d::Repeat;
        action->initWithAction(cobj, timesInt);
        jsb_ref_rebind(cx, obj, proxy, cobj, action, "cocos2d::Repeat");

        args.rval().set(JS::ObjectOrNullValue(obj));
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_ActionInterval_repeat : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ActionInterval_repeatForever(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsobj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsobj);
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ActionInterval_repeatForever : Invalid Native Object");

    if (argc == 0) {
        cocos2d::RepeatForever* action = new (std::nothrow) cocos2d::RepeatForever;
        action->initWithAction(cobj);
        jsb_ref_rebind(cx, jsobj, proxy, cobj, action, "cocos2d::RepeatForever");
        args.rval().set(JS::ObjectOrNullValue(jsobj));
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_ActionInterval_repeatForever : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_ActionInterval_speed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ActionInterval_speed : Invalid Native Object");

    if (argc == 1)
    {
        double speed;
        bool ok = jsval_to_double(cx, args.get(0), &speed);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_ActionInterval_speed : Error processing arguments");
        if (speed < 0) {
            JS_ReportErrorUTF8(cx, "js_cocos2dx_ActionInterval_speed : Speed must not be negative");
            return false;
        }

        cocos2d::Speed* action = new (std::nothrow) cocos2d::Speed;
        action->initWithAction(cobj, speed);
        jsb_ref_rebind(cx, obj, proxy, cobj, action, "cocos2d::Speed");

        args.rval().set(JS::ObjectOrNullValue(obj));
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_ActionInterval_speed : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

enum ACTION_TAG {
    EASE_IN = 0,
    EASE_OUT,
    EASE_INOUT,
    EASE_EXPONENTIAL_IN,
    EASE_EXPONENTIAL_OUT,
    EASE_EXPONENTIAL_INOUT,
    EASE_SINE_IN,
    EASE_SINE_OUT,
    EASE_SINE_INOUT,
    EASE_ELASTIC_IN,
    EASE_ELASTIC_OUT,
    EASE_ELASTIC_INOUT,
    EASE_BOUNCE_IN,
    EASE_BOUNCE_OUT,
    EASE_BOUNCE_INOUT,
    EASE_BACK_IN,
    EASE_BACK_OUT,
    EASE_BACK_INOUT,

    EASE_BEZIER_ACTION,
    EASE_QUADRATIC_IN,
    EASE_QUADRATIC_OUT,
    EASE_QUADRATIC_INOUT,
    EASE_QUARTIC_IN,
    EASE_QUARTIC_OUT,
    EASE_QUARTIC_INOUT,
    EASE_QUINTIC_IN,
    EASE_QUINTIC_OUT,
    EASE_QUINTIC_INOUT,
    EASE_CIRCLE_IN,
    EASE_CIRCLE_OUT,
    EASE_CIRCLE_INOUT,
    EASE_CUBIC_IN,
    EASE_CUBIC_OUT,
    EASE_CUBIC_INOUT
};

bool js_cocos2dx_ActionInterval_easing(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsobj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsobj);
    cocos2d::ActionInterval* oldAction = (cocos2d::ActionInterval *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2 (oldAction, cx, false, "js_cocos2dx_ActionInterval_easing : Invalid Native Object");

    cocos2d::ActionInterval* newAction = nullptr;
    JS::RootedObject tmp(cx);
    JS::RootedValue jsTag(cx);
    JS::RootedValue jsParam(cx);
    double tag;
    double parameter;

    for (uint32_t i = 0; i < argc; i++)
    {
        JS::RootedValue vpi(cx, args.get(i));
        bool ok = vpi.isObject() &&
        JS_ValueToObject(cx, vpi, &tmp) &&
        JS_GetProperty(cx, tmp, "tag", &jsTag) &&
        JS_GetProperty(cx, tmp, "param", &jsParam) &&
        jsTag.isNumber();
        if (!ok) continue;
        bool hasParam = jsParam.isNumber();
        tag = jsTag.toNumber();
        if (hasParam) parameter = jsParam.toNumber();

        ok = true;
        if (tag == EASE_IN)
        {
            if (!hasParam) ok = false;
            auto tmpaction = new (std::nothrow) cocos2d::EaseIn;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_OUT)
        {
            if (!hasParam) ok = false;
            auto tmpaction = new (std::nothrow) cocos2d::EaseOut;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_INOUT)
        {
            if (!hasParam) ok = false;
            auto tmpaction = new (std::nothrow) cocos2d::EaseInOut;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_EXPONENTIAL_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseExponentialIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_EXPONENTIAL_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseExponentialOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_EXPONENTIAL_INOUT)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseExponentialInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_SINE_IN)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseSineIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_SINE_OUT)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseSineOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_SINE_INOUT)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseSineInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_ELASTIC_IN)
        {
            if (!hasParam) parameter = 0.3;
            auto tmpaction = new (std::nothrow)cocos2d::EaseElasticIn;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_ELASTIC_OUT)
        {
            if (!hasParam) parameter = 0.3;
            auto tmpaction = new (std::nothrow)cocos2d::EaseElasticOut;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_ELASTIC_INOUT)
        {
            if (!hasParam) parameter = 0.3;
            auto tmpaction = new (std::nothrow)cocos2d::EaseElasticInOut;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_BOUNCE_IN)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseBounceIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BOUNCE_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBounceOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BOUNCE_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBounceInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BACK_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBackIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BACK_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBackOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BACK_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBackInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUADRATIC_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuadraticActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUADRATIC_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuadraticActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUADRATIC_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuadraticActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUARTIC_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuarticActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUARTIC_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuarticActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUARTIC_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuarticActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUINTIC_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuinticActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUINTIC_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuinticActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUINTIC_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuinticActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CIRCLE_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCircleActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CIRCLE_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCircleActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CIRCLE_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCircleActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CUBIC_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCubicActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CUBIC_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCubicActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CUBIC_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCubicActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BEZIER_ACTION)
        {
            JS::RootedValue jsParam2(cx);
            JS::RootedValue jsParam3(cx);
            JS::RootedValue jsParam4(cx);
            double parameter2, parameter3, parameter4;
            ok &= JS_GetProperty(cx, tmp, "param2", &jsParam2) &&
                  JS_GetProperty(cx, tmp, "param3", &jsParam3) &&
                  JS_GetProperty(cx, tmp, "param4", &jsParam4) &&
                  jsParam2.isNumber() && jsParam3.isNumber() && jsParam4.isNumber();
            if (!ok) continue;
            parameter2 = jsParam2.toNumber();
            parameter3 = jsParam3.toNumber();
            parameter4 = jsParam4.toNumber();

            auto tmpaction = new (std::nothrow) cocos2d::EaseBezierAction;
            tmpaction->initWithAction(oldAction);
            tmpaction->setBezierParamer(parameter, parameter2, parameter3, parameter4);
            newAction = tmpaction;
        }
        else
            continue;

        if (!ok || !newAction) {
            JS_ReportErrorUTF8(cx, "js_cocos2dx_ActionInterval_easing : Invalid action: At least one action was expecting parameter");
            return false;
        }
    }

    // Unbind existing proxy binding with cobj, and rebind with the new action
    jsb_ref_rebind(cx, jsobj, proxy, oldAction, newAction, "cocos2d::EaseAction");

    args.rval().set(JS::ObjectOrNullValue(jsobj));
    return true;
}


template<class T>
bool js_BezierActions_create(JSContext *cx, uint32_t argc, JS::Value *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    if (argc == 2) {
        double t;
        bool ok = jsval_to_double(cx, args.get(0), &t);

        int num;
        Point *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);
        
        JSB_PRECONDITION2(ok, cx, false, "js_BezierActions_create : Error processing arguments");

        ccBezierConfig config;
        config.controlPoint_1 = arr[0];
        config.controlPoint_2 = arr[1];
        config.endPosition = arr[2];

        T* ret = new (std::nothrow) T;
        ret->initWithDuration(t, config);

        delete [] arr;

        js_type_class_t *typeProxy = js_get_type_from_native<T>(ret);
        JS::RootedObject jsobj(cx);
        JS::RootedObject proto(cx, typeProxy->proto->get());
        jsb_ref_create_jsobject(cx, ret, typeProxy->jsclass, proto, &jsobj, typeid(*ret).name());
        JS::RootedValue jsval(cx, JS::ObjectOrNullValue(jsobj));
        args.rval().set(jsval);
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

template<class T>
bool js_BezierActions_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    T* cobj = (T *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Bezier_initWithDuration : Invalid Native Object");
    if (argc == 2) {
        double arg0;
        ok &= jsval_to_double(cx, args.get(0), &arg0);
        cocos2d::_ccBezierConfig arg1;
        int num;
        cocos2d::Vec2 *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);
        
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Bezier_initWithDuration : Error processing arguments");

        arg1.controlPoint_1 = arr[0];
        arg1.controlPoint_2 = arr[1];
        arg1.endPosition = arr[2];

        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Bezier_initWithDuration : Error processing arguments");
        bool ret = cobj->initWithDuration(arg0, arg1);
        delete [] arr;
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_BezierTo_initWithDuration : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

template<class T>
bool js_CardinalSplineActions_create(JSContext *cx, uint32_t argc, JS::Value *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    if (argc == 3) {
        int num;
        Point *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);
        double dur, ten;
        ok &= jsval_to_double(cx, args.get(0), &dur);
        ok &= jsval_to_double(cx, args.get(2), &ten);
        
        JSB_PRECONDITION2(ok, cx, false, "js_CardinalSplineActions_create : Error processing arguments");

        PointArray *points = PointArray::create(num);

        for( int i=0; i < num;i++) {
            points->addControlPoint(arr[i]);
        }

        T *ret = new (std::nothrow) T;
        ret->initWithDuration(dur, points, ten);

        delete [] arr;

        js_type_class_t *typeProxy = js_get_type_from_native<T>(ret);
        JS::RootedObject jsobj(cx);
        JS::RootedObject proto(cx, typeProxy->proto->get());
        jsb_ref_create_jsobject(cx, ret, typeProxy->jsclass, proto, &jsobj, typeid(*ret).name());
        JS::RootedValue jsval(cx, JS::ObjectOrNullValue(jsobj));
        args.rval().set(jsval);
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

template<class T>
bool js_CatmullRomActions_create(JSContext *cx, uint32_t argc, JS::Value *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    if (argc == 2) {
        int num;
        Point *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);
        double dur;
        ok &= jsval_to_double(cx, args.get(0), &dur);
        
        JSB_PRECONDITION2(ok, cx, false, "js_CardinalSplineActions_create : Error processing arguments");

        PointArray *points = PointArray::create(num);

        for( int i=0; i < num;i++) {
            points->addControlPoint(arr[i]);
        }

        T *ret = new (std::nothrow) T;
        ret->initWithDuration(dur, points);

        delete [] arr;

        js_type_class_t *typeProxy = js_get_type_from_native<T>(ret);
        JS::RootedObject jsobj(cx);
        JS::RootedObject proto(cx, typeProxy->proto->get());
        jsb_ref_create_jsobject(cx, ret, typeProxy->jsclass, proto, &jsobj, typeid(*ret).name());
        JS::RootedValue jsval(cx, JS::ObjectOrNullValue(jsobj));
        args.rval().set(jsval);
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

template<class T>
bool js_CatmullRomActions_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    T* cobj = (T *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CatmullRom_initWithDuration : Invalid Native Object");
    if (argc == 2) {
        double arg0;
        ok &= jsval_to_double(cx, args.get(0), &arg0);
        int num;
        Point *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);
        
        JSB_PRECONDITION2(ok, cx, false, "js_CatmullRomActions_initWithDuration : Error processing arguments");

        cocos2d::PointArray* arg1 = cocos2d::PointArray::create(num);
        for( int i=0; i < num;i++) {
            arg1->addControlPoint(arr[i]);
        }

        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CatmullRom_initWithDuration : Error processing arguments");
        bool ret = cobj->initWithDuration(arg0, arg1);
        delete [] arr;
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_CatmullRom_initWithDuration : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool JSB_CCBezierBy_actionWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp) {
    return js_BezierActions_create<cocos2d::BezierBy>(cx, argc, vp);
}

bool JSB_CCBezierTo_actionWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp) {
    return js_BezierActions_create<cocos2d::BezierTo>(cx, argc, vp);
}

bool JSB_CCBezierBy_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    return js_BezierActions_initWithDuration<cocos2d::BezierBy>(cx, argc, vp);
}

bool JSB_CCBezierTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    return js_BezierActions_initWithDuration<cocos2d::BezierTo>(cx, argc, vp);
}

bool JSB_CCCardinalSplineBy_actionWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp) {
    return js_CardinalSplineActions_create<cocos2d::CardinalSplineBy>(cx, argc, vp);
}

bool JSB_CCCardinalSplineTo_actionWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp) {
    return js_CardinalSplineActions_create<cocos2d::CardinalSplineTo>(cx, argc, vp);
}

bool js_cocos2dx_CardinalSplineTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::CardinalSplineTo* cobj = (cocos2d::CardinalSplineTo *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CardinalSplineTo_initWithDuration : Invalid Native Object");
    if (argc == 3) {
        int num;
        Point *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);
        cocos2d::PointArray* arg1 = PointArray::create(num);
        for( int i=0; i < num;i++) {
            arg1->addControlPoint(arr[i]);
        }
        double arg0, arg2;
        ok &= jsval_to_double(cx, args.get(0), &arg0);
        ok &= jsval_to_double(cx, args.get(2), &arg2);
        
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CardinalSplineTo_initWithDuration : Error processing arguments");
        
        bool ret = cobj->initWithDuration(arg0, arg1, arg2);

        delete [] arr;
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_CardinalSplineTo_initWithDuration : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}

bool JSB_CCCatmullRomBy_actionWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    return js_CatmullRomActions_create<cocos2d::CatmullRomBy>(cx, argc, vp);
}

bool JSB_CCCatmullRomTo_actionWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    return js_CatmullRomActions_create<cocos2d::CatmullRomTo>(cx, argc, vp);
}

bool JSB_CatmullRomBy_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    return js_CatmullRomActions_initWithDuration<cocos2d::CatmullRomBy>(cx, argc, vp);
}

bool JSB_CatmullRomTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    return js_CatmullRomActions_initWithDuration<cocos2d::CatmullRomTo>(cx, argc, vp);
}

bool js_cocos2dx_ccGLEnableVertexAttribs(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    if (argc == 1) {
        unsigned int arg0;
        ok &= jsval_to_uint32(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        GL::enableVertexAttribs(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ccmat4CreateTranslation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc == 1)
    {
        cocos2d::Vec3 arg0;
        bool ok = jsval_to_vector3(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cocos2d::Mat4 ret;
        cocos2d::Mat4::createTranslation(arg0, &ret);
        JS::RootedValue jsret(cx);
        matrix_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ccmat4CreateRotation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc == 1)
    {
        cocos2d::Quaternion arg0;
        bool ok = jsval_to_quaternion(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cocos2d::Mat4 ret;
        cocos2d::Mat4::createRotation(arg0, &ret);
        JS::RootedValue jsret(cx);
        matrix_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ccmat4Multiply(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc == 2)
    {
        cocos2d::Mat4 arg0;
        cocos2d::Mat4 arg1;
        bool ok = jsval_to_matrix(cx, args.get(0), &arg0);
        ok &= jsval_to_matrix(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cocos2d::Mat4 ret = arg0 * arg1;
        JS::RootedValue jsret(cx);
        matrix_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_ccmat4MultiplyVec3(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc == 2)
    {
        cocos2d::Mat4 arg0;
        cocos2d::Vec3 arg1;
        bool ok = jsval_to_matrix(cx, args.get(0), &arg0);
        ok &= jsval_to_vector3(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cocos2d::Vec3 ret = arg0 * arg1;
        JS::RootedValue jsret(cx);
        vector3_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_ccmat4GetInversed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc == 1)
    {
        cocos2d::Mat4 arg0;
        bool ok = jsval_to_matrix(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        JS::RootedValue jsret(cx);
        matrix_to_jsval(cx, arg0.getInversed(), &jsret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ccmat4TransformVector(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc >= 2)
    {
        cocos2d::Mat4 arg0;
        cocos2d::Vec4 arg1;
        cocos2d::Vec4 ret;
        bool ok = jsval_to_matrix(cx, args.get(0), &arg0);
        ok &= jsval_to_vector4(cx, args.get(1), &arg1);

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        arg0.transformVector(arg1, &ret);
        JS::RootedValue jsret(cx);
        vector4_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }
    else if (argc >= 5)
    {
        cocos2d::Mat4 arg0;
        double arg1 = 0.0, arg2 = 0.0, arg3 = 0.0, arg4 = 0.0;
        cocos2d::Vec3 ret;

        bool ok = jsval_to_matrix(cx, args.get(0), &arg0);
        ok &= jsval_to_double(cx, args.get(1), &arg1);
        ok &= jsval_to_double(cx, args.get(2), &arg2);
        ok &= jsval_to_double(cx, args.get(3), &arg3);
        ok &= jsval_to_double(cx, args.get(4), &arg4);
        
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_ccmat4TransformVector : Error processing arguments");

        arg0.transformVector(arg1, arg2, arg3, arg4, &ret);
        JS::RootedValue jsret(cx);
        vector3_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}

bool js_cocos2dx_ccmat4TransformPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc >= 2)
    {
        cocos2d::Mat4 arg0;
        cocos2d::Vec3 arg1;
        cocos2d::Vec3 ret;
        bool ok = jsval_to_matrix(cx, args.get(0), &arg0);
        ok &= jsval_to_vector3(cx, args.get(1), &arg1);

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        arg0.transformPoint(arg1, &ret);
        JS::RootedValue jsret(cx);
        vector3_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}

bool js_cocos2dx_ccquatMultiply(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc == 2)
    {
        cocos2d::Quaternion arg0;
        cocos2d::Quaternion arg1;
        bool ok = jsval_to_quaternion(cx, args.get(0), &arg0);
        ok &= jsval_to_quaternion(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cocos2d::Quaternion ret = arg0 * arg1;
        JS::RootedValue jsret(cx);
        quaternion_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_Sprite_initWithPolygon(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Sprite* cobj = (cocos2d::Sprite *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Sprite_initWithPolygon : Invalid Native Object");
    if (argc == 1) {
        cocos2d::PolygonInfo *arg0;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::PolygonInfo*)(jsProxy ? jsProxy->ptr : nullptr);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Sprite_initWithPolygon : Error processing arguments");
        bool ret = cobj->initWithPolygon(*arg0);
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_Sprite_initWithPolygon : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_Sprite_setPolygonInfo(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Sprite* cobj = (cocos2d::Sprite *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Sprite_setPolygonInfo : Invalid Native Object");
    if (argc == 1) {
        cocos2d::PolygonInfo *arg0;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::PolygonInfo*)(jsProxy ? jsProxy->ptr : nullptr);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Sprite_setPolygonInfo : Error processing arguments");
        cobj->setPolygonInfo(*arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_Sprite_setPolygonInfo : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_Sprite_textureLoaded(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    Sprite* cobj = (Sprite*)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj);

    bool ret = false;
    if( cobj->getTexture() )
        ret = true;

    args.rval().set(JS::BooleanValue(ret));
    return true;
}

bool js_cocos2dx_CCTexture2D_setTexParameters(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    Texture2D* cobj = (Texture2D*)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 4)
    {
        bool ok = true;

        GLuint arg0, arg1, arg2, arg3;

        ok &= jsval_to_uint32(cx, args.get(0), &arg0);
        ok &= jsval_to_uint32(cx, args.get(1), &arg1);
        ok &= jsval_to_uint32(cx, args.get(2), &arg2);
        ok &= jsval_to_uint32(cx, args.get(3), &arg3);

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        Texture2D::TexParams param = { arg0, arg1, arg2, arg3 };

        cobj->setTexParameters(param);

        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}

bool js_cocos2dx_CCMenu_alignItemsInRows(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    Menu* cobj = (Menu*)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    ValueVector items;
    ok &= jsvals_variadic_to_ccvaluevector(cx, args.array(), argc, &items);
    if (ok)
    {
        cobj->alignItemsInRowsWithArray(items);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "Error in js_cocos2dx_CCMenu_alignItemsInRows");
    return false;
}

bool js_cocos2dx_CCMenu_alignItemsInColumns(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    Menu* cobj = (Menu*)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)


    ValueVector items;
    ok &= jsvals_variadic_to_ccvaluevector(cx, args.array(), argc, &items);
    if (ok)
    {
        cobj->alignItemsInColumnsWithArray(items);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "Error in js_cocos2dx_CCMenu_alignItemsInColumns");
    return false;
}

bool js_cocos2dx_CCLayer_init(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Layer* cobj = (cocos2d::Layer *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CCLayer_init : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->init();
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_CCLayer_init : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}


// TMXLayer
bool js_cocos2dx_CCTMXLayer_getTileFlagsAt(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    auto cobj = (TMXLayer*)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)
    if (argc == 1)
    {
        bool ok = true;
        TMXTileFlags flags;
        Point arg0;
        ok &= jsval_to_ccpoint(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->getTileGIDAt(arg0, &flags);

        args.rval().set(JS::Int32Value((uint32_t)flags));
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_CCFileUtils_getDataFromFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        Data data = cobj->getDataFromFile(arg0);
        do
        {
            if (!data.isNull())
            {
                uint32_t size = static_cast<uint32_t>(data.getSize());
                JS::RootedObject array(cx, JS_NewUint8Array(cx, size));
                if (nullptr == array)
                    break;

                bool flag;
                uint8_t* bufdata = (uint8_t*)JS_GetArrayBufferViewData(array, &flag, JS::AutoCheckCannotGC());
                memcpy(bufdata, data.getBytes(), size*sizeof(uint8_t));

                args.rval().set(JS::ObjectOrNullValue(array));
                return true;
            }
        } while(false);

        // return null if read failed.
        args.rval().set(JS::NullValue());
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}

bool js_cocos2dx_CCFileUtils_writeDataToFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CCFileUtils_writeDataToFile : Invalid Native Object");
    if (argc == 2) {
        Data arg0;
        std::string arg1;

        // copy bytes from UInit8Array
        JSObject &obj0 = args.get(0).toObject();
        if( JS_IsUint8Array(&obj0) ) {
            uint32_t len = JS_GetArrayBufferViewByteLength(&obj0);
            bool flag;
            uint8_t* bufdata = (uint8_t*)JS_GetArrayBufferViewData(&obj0, &flag, JS::AutoCheckCannotGC());
            arg0.copy(bufdata, len);
        } else {
            ok = false;
        }

        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CCFileUtils_writeDataToFile : Error processing arguments");
        bool ret = cobj->writeDataToFile(arg0, arg1);
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_CCFileUtils_writeDataToFile : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

static bool js_cocos2dx_FileUtils_createDictionaryWithContentsOfFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cocos2d::ValueMap ret = FileUtils::getInstance()->getValueMapFromFile(arg0);
        JS::RootedValue jsret(cx);
        ccvaluemap_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCGLProgram_setUniformLocationWith4f(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::GLProgram* cobj = (cocos2d::GLProgram *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2(cobj, cx, false, "Invalid Native Object");
    
    int arg0;
    double arg1;
    bool ok = jsval_to_int32(cx, args.get(0), (int32_t*)&arg0);
    ok &= jsval_to_double(cx, args.get(1), &arg1);
    JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

    if (argc == 2) {
        cobj->setUniformLocationWith1f(arg0, arg1);
    }
    if (argc == 3) {
        double arg2;
        ok &= jsval_to_double(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->setUniformLocationWith2f(arg0, arg1, arg2);
    }
    if(argc == 4) {
        double arg2, arg3;
        ok &= jsval_to_double(cx, args.get(2), &arg2);
        ok &= jsval_to_double(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->setUniformLocationWith3f(arg0, arg1, arg2, arg3);
    }
    if(argc == 5) {
        double arg2, arg3, arg4;
        ok &= jsval_to_double(cx, args.get(2), &arg2);
        ok &= jsval_to_double(cx, args.get(3), &arg3);
        ok &= jsval_to_double(cx, args.get(4), &arg4);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->setUniformLocationWith4f(arg0, arg1, arg2, arg3, arg4);
    }

    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_CCGLProgram_setUniformLocationWithMatrixfvUnion(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::GLProgram* cobj = (cocos2d::GLProgram *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if (argc == 4) {
        GLint arg0;
        std::vector<float> arg1;
        unsigned int arg2;
        int fvType;
        ok &= jsval_to_int32(cx, args.get(0), (int *)&arg0);
        ok &= jsval_to_std_vector_float(cx, args.get(1), &arg1);
        ok &= jsval_to_uint32(cx, args.get(2), &arg2);
        ok &= jsval_to_int32(cx, args.get(3), (int *)&fvType);

        // fvType defined in jsb_cocos2d.js
        switch(fvType)
        {
            case 2:
                cobj->setUniformLocationWithMatrix2fv(arg0, (GLfloat *)&arg1[0], arg2);
                break;
            case 3:
                cobj->setUniformLocationWithMatrix3fv(arg0, (GLfloat *)&arg1[0], arg2);
                break;
            case 4:
                cobj->setUniformLocationWithMatrix4fv(arg0, (GLfloat *)&arg1[0], arg2);
                break;
        }

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}

bool js_cocos2dx_CCGLProgram_getProgram(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::GLProgram* cobj = (cocos2d::GLProgram *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 0) {
        GLuint ret = cobj->getProgram();
        args.rval().set(JS::Int32Value((uint32_t)ret));
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_GLProgramState_setVertexAttribPointer(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::GLProgramState* cobj = (cocos2d::GLProgramState *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_GLProgramState_setVertexAttribPointer : Invalid Native Object");
    if (argc == 6) {
        std::string arg0;
        int arg1;
        unsigned int arg2;
        uint16_t arg3;
        int arg4;
        long arg5;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        ok &= jsval_to_uint32(cx, args.get(2), &arg2);
        ok &= jsval_to_uint16(cx, args.get(3), &arg3);
        ok &= jsval_to_int32(cx, args.get(4), (int32_t *)&arg4);
        ok &= jsval_to_long(cx, args.get(5), &arg5);

        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_GLProgramState_setVertexAttribPointer : Error processing arguments");
        cobj->setVertexAttribPointer(arg0, arg1, arg2, arg3, arg4, (GLvoid*)arg5);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_GLProgramState_setVertexAttribPointer : wrong number of arguments: %d, was expecting %d", argc, 6);
    return false;
}

bool js_cocos2dx_GLProgramState_setUniformVec4(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t* proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::GLProgramState* cobj = (cocos2d::GLProgramState *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_GLProgramState_setUniformVec4 : Invalid Native Object");
    bool ok = true;
    if(argc == 2)
    {
        do {
            if (argc == 2) {
                std::string arg0;
                ok &= jsval_to_std_string(cx, args.get(0), &arg0);
                if (!ok) { ok = true; break; }
                cocos2d::Vec4 arg1;
                ok &= jsval_to_vector4(cx, args.get(1), &arg1);
                if (!ok) { ok = true; break; }
                cobj->setUniformVec4(arg0, arg1);
                args.rval().setUndefined();
                return true;
            }
        } while(0);

        do {
            if (argc == 2) {
                int arg0;
                ok &= jsval_to_int(cx, args.get(0), &arg0);
                if (!ok) { ok = true; break; }
                cocos2d::Vec4 arg1;
                ok &= jsval_to_vector4(cx, args.get(1), &arg1);
                if (!ok) { ok = true; break; }
                cobj->setUniformVec4(arg0, arg1);
                args.rval().setUndefined();
                return true;
            }
        } while(0);
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_GLProgramState_setUniformVec4 : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_SpriteBatchNode_getDescendants(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::SpriteBatchNode* cobj = (cocos2d::SpriteBatchNode *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_SpriteBatchNode_getDescendants : Invalid Native Object");
    if (argc == 0) {
        std::vector<Sprite*> ret = cobj->getDescendants();

        JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, 0));
        size_t vSize = ret.size();
        JS::RootedValue jsret(cx);

        for (size_t i = 0; i < vSize; i++)
        {
            JS::RootedObject jsobj(cx);
            JS::RootedObject proto(cx, jsb_cocos2d_Sprite_prototype->get());
            jsb_ref_get_or_create_jsobject(cx, ret[i], jsb_cocos2d_Sprite_class, proto, &jsobj, "cocos2d::Sprite");
            jsret = JS::ObjectOrNullValue(jsobj);
            JS_SetElement(cx, jsretArr, static_cast<uint32_t>(i), jsret);
        }
        args.rval().set(JS::ObjectOrNullValue(jsretArr));
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_SpriteBatchNode_getDescendants : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

// cc.PlistParser.getInstance()
bool js_PlistParser_getInstance(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    __JSPlistDelegator* delegator = __JSPlistDelegator::getInstance();
    SAXParser* parser = delegator->getParser();

    JS::RootedValue jsret(cx);
    if (parser) {
        js_proxy_t *p = jsb_get_native_proxy(parser);
        if (p) {
            jsret = JS::ObjectOrNullValue(p->obj);
        } else {
            // create a new js obj of that class
            JS::RootedObject parserObj(cx);
            js_get_or_create_jsobject<SAXParser>(cx, parser, &parserObj);
            jsret = JS::ObjectOrNullValue(parserObj);
        }
    }
    args.rval().set(jsret);
    return true;
}
// cc.PlistParser.getInstance().parse(text)
bool js_PlistParser_parse(JSContext *cx, unsigned argc, JS::Value *vp) {
    __JSPlistDelegator* delegator = __JSPlistDelegator::getInstance();

    bool ok = true;
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);

        std::string parsedStr = delegator->parseText(arg0);
        std::replace(parsedStr.begin(), parsedStr.end(), '\n', ' ');

        JS::RootedValue strVal(cx);
        ok &= std_string_to_jsval(cx, parsedStr, &strVal);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        
        // create a new js obj of the parsed string
        JS::RootedValue outVal(cx);
        //JS_GetStringCharsZ was removed in SpiderMonkey 33
        JS::RootedString jsout(cx, strVal.toString());
        ok = JS_ParseJSON(cx, jsout, &outVal);

        if (ok)
            args.rval().set(outVal);
        else {
            args.rval().setUndefined();
            JS_ReportErrorUTF8(cx, "js_PlistParser_parse : parse error");
        }
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_PlistParser_parse : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

cocos2d::SAXParser* __JSPlistDelegator::getParser() {
    return &_parser;
}

std::string __JSPlistDelegator::parse(const std::string& path) {
    _result.clear();

    SAXParser parser;
    if (false != parser.init("UTF-8") )
    {
        parser.setDelegator(this);
        parser.parse(FileUtils::getInstance()->fullPathForFilename(path));
    }

    return _result;
}

__JSPlistDelegator::~__JSPlistDelegator(){
    CCLOGINFO("deallocing __JSSAXDelegator: %p", this);
}

std::string __JSPlistDelegator::parseText(const std::string& text){
     _result.clear();

    SAXParser parser;
    if (false != parser.init("UTF-8") )
    {
        parser.setDelegator(this);
        parser.parse(text.c_str(), text.size());
    }

    return _result;
}

void __JSPlistDelegator::startElement(void *ctx, const char *name, const char **atts) {
    _isStoringCharacters = true;
    _currentValue.clear();

    std::string elementName = (char*)name;

    int end = (int)_result.size() - 1;
    if(end >= 0 && _result[end] != '{' && _result[end] != '[' && _result[end] != ':') {
        _result += ",";
    }

    if (elementName == "dict") {
        _result += "{";
    }
    else if (elementName == "array") {
        _result += "[";
    }
}

void __JSPlistDelegator::endElement(void *ctx, const char *name) {
    _isStoringCharacters = false;
    std::string elementName = (char*)name;

    if (elementName == "dict") {
        _result += "}";
    }
    else if (elementName == "array") {
        _result += "]";
    }
    else if (elementName == "key") {
        _result += "\"" + _currentValue + "\":";
    }
    else if (elementName == "string") {
        _result += "\"" + _currentValue + "\"";
    }
    else if (elementName == "false" || elementName == "true") {
        _result += elementName;
    }
    else if (elementName == "real" || elementName == "integer") {
        _result += _currentValue;
    }
}

void __JSPlistDelegator::textHandler(void *ctx, const char *ch, int len) {
    CC_UNUSED_PARAM(ctx);
    std::string text((char*)ch, 0, len);

    if (_isStoringCharacters)
    {
        _currentValue += text;
    }
}

// TODO: This function is deprecated. The new API is "new Label" instead of "Label.create"
// There are not js tests for this function. Impossible to know weather it works Ok.
bool js_cocos2dx_Label_createWithTTF(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc < 2)
        return false;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    TTFConfig ttfConfig("");
    std::string text;

    ok &= jsval_to_TTFConfig(cx, args.get(0), &ttfConfig);
    ok &= jsval_to_std_string(cx, args.get(1), &text);

    cocos2d::Label* label = nullptr;

    if (argc == 2) {
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Label_createWithTTF : Error processing arguments");
        label = new (std::nothrow) cocos2d::Label;
        label->initWithTTF(ttfConfig, text);
    }
    else if (argc == 3)
    {
        int arg2;
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Label_createWithTTF : Error processing arguments");
        TextHAlignment alignment = TextHAlignment(arg2);
        label = new (std::nothrow) cocos2d::Label;
        label->initWithTTF(ttfConfig, text, alignment);
    }
    else if (argc == 4)
    {
        int arg2,arg3;
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Label_createWithTTF : Error processing arguments");
        TextHAlignment alignment = TextHAlignment(arg2);
        label = new (std::nothrow) cocos2d::Label;
        label->initWithTTF(ttfConfig, text, alignment, arg3);
    }

    if (ok)
    {
        // link the native object with the javascript object
        JS::RootedObject jsobj(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_Label_prototype->get());
        jsb_ref_create_jsobject(cx, label, jsb_cocos2d_Label_class, proto, &jsobj, "cocos2d::Label");
        args.rval().set(JS::ObjectOrNullValue(jsobj));
        return true;
    }

    // else

    JS_ReportErrorUTF8(cx, "js_cocos2dx_Label_createWithTTF : wrong number of arguments");
    return false;
}

bool js_cocos2dx_Label_setTTFConfig(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::Label* cobj = (cocos2d::Label *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Label_setTTFConfig : Invalid Native Object");

    if (argc == 1) {
        TTFConfig ttfConfig("");
        do {
            if (!args.get(0).isObject()) { ok = false; break; }
            ok &= jsval_to_TTFConfig(cx, args.get(0), &ttfConfig);
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Label_setTTFConfig : Error processing arguments");
        cobj->setTTFConfig(ttfConfig);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_Label_setTTFConfig : wrong number of arguments");
    return false;
}

bool js_cocos2dx_RenderTexture_saveToFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    cocos2d::RenderTexture* cobj = nullptr;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (cocos2d::RenderTexture *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_RenderTexture_saveToFile : Invalid Native Object");
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Image::Format arg1;
            ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
            if (!ok) { ok = true; break; }
            bool ret = cobj->saveToFile(arg0, arg1);
            JS::RootedValue jsret(cx, JS::BooleanValue(ret));
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            cocos2d::Image::Format arg1;
            ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
            bool arg2;
            ok &= jsval_to_bool(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            bool ret = cobj->saveToFile(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::BooleanValue(ret));
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 4) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            cocos2d::Image::Format arg1;
            ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
            bool arg2;
            ok &= jsval_to_bool(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            std::function<void (cocos2d::RenderTexture *, const std::basic_string<char> &)> arg3;
            do {
                JS::RootedObject jsfunc(cx, args.get(3).toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, jsfunc, obj));
                auto lambda = [=](cocos2d::RenderTexture* larg0, const std::string& larg1) -> void {
                    JS::AutoValueVector largv(cx);
                    do {
                        if (larg0) {
                            JS::RootedObject arg0Obj(cx);
                            js_get_or_create_jsobject<cocos2d::RenderTexture>(cx, (cocos2d::RenderTexture*)larg0, &arg0Obj);
                            largv.append(JS::ObjectOrNullValue(arg0Obj));
                        } else {
                            largv.append(JS::NullValue());
                        }
                    } while (0);
                    do {
                        JS::RootedValue larg(cx);
                        std_string_to_jsval(cx, larg1, &larg);
                        largv.append(larg);
                    } while (0);
                    JS::RootedValue rval(cx);
                    JS::HandleValueArray largs(largv);
                    bool invokeOk = func->invoke(largs, &rval);
                    if (!invokeOk && JS_IsExceptionPending(cx)) {
                        handlePendingException(cx);
                    }
                };
                arg3 = lambda;
            } while(0)
                ;
            if (!ok) { ok = true; break; }
            bool ret = cobj->saveToFile(arg0, arg1, arg2, arg3);
            JS::RootedValue jsret(cx, JS::BooleanValue(ret));
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->saveToFile(arg0);
            JS::RootedValue jsret(cx, JS::BooleanValue(ret));
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            bool arg1;
            ok &= jsval_to_bool(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            bool ret = cobj->saveToFile(arg0, arg1);
            JS::RootedValue jsret(cx, JS::BooleanValue(ret));
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            bool arg1;
            ok &= jsval_to_bool(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            std::function<void (cocos2d::RenderTexture *, const std::basic_string<char> &)> arg2;
            do {
                JS::RootedObject jsfunc(cx, args.get(2).toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, jsfunc, obj));
                auto lambda = [=](cocos2d::RenderTexture* larg0, const std::string& larg1) -> void {
                    JS::AutoValueVector largv(cx);
                    do {
                        if (larg0) {
                            JS::RootedObject arg0Obj(cx);
                            js_get_or_create_jsobject<cocos2d::RenderTexture>(cx, (cocos2d::RenderTexture*)larg0, &arg0Obj);
                            largv.append(JS::ObjectOrNullValue(arg0Obj));
                        } else {
                            largv.append(JS::NullValue());
                        }
                    } while (0);
                    do {
                        JS::RootedValue larg(cx);
                        std_string_to_jsval(cx, larg1, &larg);
                        largv.append(larg);
                    } while (0);
                    JS::RootedValue rval(cx);
                    JS::HandleValueArray largs(largv);
                    bool invokeOk = func->invoke(largs, &rval);
                    if (!invokeOk && JS_IsExceptionPending(cx)) {
                        handlePendingException(cx);
                    }
                };
                arg2 = lambda;
            } while(0)
                ;
            if (!ok) { ok = true; break; }
            bool ret = cobj->saveToFile(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::BooleanValue(ret));
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_RenderTexture_saveToFile : wrong number of arguments");
    return false;
}

bool js_cocos2dx_Node_setAdditionalTransform(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    JS::RootedObject obj(cx);
    cocos2d::Node* cobj = nullptr;
    obj = args.thisv().toObjectOrNull();
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_setAdditionalTransform : Invalid Native Object");

    do {
        if (argc == 1) {
            cocos2d::Mat4 arg0;
            ok &= jsval_to_matrix(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj->setAdditionalTransform(&arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        if (argc == 1) {
            cocos2d::AffineTransform arg0;
            ok &= jsval_to_ccaffinetransform(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj->setAdditionalTransform(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_Node_setAdditionalTransform : wrong number of arguments");
    return false;
}

bool js_cocos2dx_ClippingNode_init(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::ClippingNode* cobj = (cocos2d::ClippingNode *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ClippingNode_init : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->init();
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        cocos2d::Node* arg0;
        do {
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : nullptr);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_ClippingNode_init : Error processing arguments");
        bool ret = cobj->init(arg0);
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_ClippingNode_init : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

// EventKeyboard class bindings, need manual bind for transform key codes

JSClass  *jsb_cocos2d_EventKeyboard_class;
JS::PersistentRootedObject *jsb_cocos2d_EventKeyboard_prototype;

bool js_cocos2dx_EventKeyboard_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    cocos2d::EventKeyboard::KeyCode arg0;
    ScriptingCore *core = ScriptingCore::getInstance();
    JS::RootedValue owner(cx, JS::ObjectOrNullValue(core->getGlobalObject()));
    JS::HandleValueArray argsv(args);
    JS::RootedValue retVal(cx);
    core->executeFunctionWithOwner(owner, "parseKeyCode", argsv, &retVal);
    ok &= jsval_to_int32(cx, retVal, (int32_t *)&arg0);
    bool arg1;
    ok &= jsval_to_bool(cx, args.get(1), &arg1);

    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_EventKeyboard_constructor : Error processing arguments");

    cocos2d::EventKeyboard* cobj = new (std::nothrow) cocos2d::EventKeyboard(arg0, arg1);
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_EventKeyboard_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_EventKeyboard_class, proto, &jsobj, "cocos2d::EventKeyboard");

    args.rval().set(JS::ObjectOrNullValue(jsobj));
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_Event_prototype;

void js_register_cocos2dx_EventKeyboard(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps EventKeyboard_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass EventKeyboard_class = {
        "EventKeyboard",
        JSCLASS_HAS_PRIVATE,
        &EventKeyboard_classOps
    };
    jsb_cocos2d_EventKeyboard_class = &EventKeyboard_class;

    JS::RootedObject parentProto(cx, jsb_cocos2d_Event_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(cx, global,
                                            parentProto,
                                            jsb_cocos2d_EventKeyboard_class,
                                            js_cocos2dx_EventKeyboard_constructor, 0, // constructor
                                            nullptr,
                                            nullptr,
                                            nullptr, // no static properties
                                            nullptr));
    
    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::EventKeyboard>(cx, jsb_cocos2d_EventKeyboard_class, proto);
    jsb_cocos2d_EventKeyboard_prototype = typeClass->proto;
    
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "EventKeyboard", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
}

// console.log("Message");
bool js_console_log(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc >= 1) {
        std::string msg;
        bool ok = jsval_to_std_string(cx, args.get(0), &msg);
        if (!ok) {
            log("js_console_log : Error processing arguments");
        }
        else
            log("%s", msg.c_str());

        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_console_log : wrong number of arguments");
    return false;
}

void get_or_create_js_obj(JSContext* cx, JS::HandleObject obj, const std::string &name, JS::MutableHandleObject jsObj)
{
    JS::RootedValue nsval(cx);
    JS_GetProperty(cx, obj, name.c_str(), &nsval);
    if (nsval.isUndefined()) {
        jsObj.set(JS_NewPlainObject(cx));
        nsval = JS::ObjectOrNullValue(jsObj);
        JS_SetProperty(cx, obj, name.c_str(), nsval);
    } else {
        jsObj.set(nsval.toObjectOrNull());
    }
}
void get_or_create_js_obj(const std::string &name, JS::MutableHandleObject jsObj)
{
    ScriptingCore *engine = ScriptingCore::getInstance();
    JSContext *cx = engine->getGlobalContext();
    JS::RootedObject obj(cx, engine->getGlobalObject());
    JS::RootedObject prop(cx);

    size_t start = 0;
    size_t found = name.find_first_of(".", start);
    std::string subProp;

    while (found != std::string::npos)
    {
        subProp = name.substr(start, found - start);
        if (!subProp.empty())
        {
            get_or_create_js_obj(cx, obj, subProp, &prop);
            obj.set(prop);
        }

        start = found+1;
        found = name.find_first_of(".", start);
    }
    if (start < name.length())
    {
        subProp = name.substr(start);
        get_or_create_js_obj(cx, obj, subProp, &prop);
        obj.set(prop);
    }
    jsObj.set(obj);
}

JSClass  *jsb_cocos2d_PolygonInfo_class;
JS::PersistentRootedObject *jsb_cocos2d_PolygonInfo_prototype;

bool js_cocos2dx_PolygonInfo_getArea(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_PolygonInfo_getArea : Invalid Native Object");
    if (argc == 0)
    {
        const float ret = cobj->getArea();
        JS::RootedValue jsret(cx, JS::DoubleValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_PolygonInfo_getArea : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_PolygonInfo_getTrianglesCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_PolygonInfo_getTrianglesCount : Invalid Native Object");
    if (argc == 0)
    {
        const unsigned int ret = cobj->getTrianglesCount();
        JS::RootedValue jsret(cx, JS::NumberValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_PolygonInfo_getTrianglesCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_PolygonInfo_getVertCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_PolygonInfo_getVertCount : Invalid Native Object");
    if (argc == 0)
    {
        const unsigned int ret = cobj->getVertCount();
        JS::RootedValue jsret(cx, JS::NumberValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_PolygonInfo_getVertCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

// PolygonInfo.rect
bool js_get_PolygonInfo_rect(JSContext* cx, uint32_t argc, JS::Value* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    if (cobj)
    {
        JS::RootedValue ret(cx);
        if (ccrect_to_jsval(cx, cobj->rect, &ret) && ret.isObject())
        {
            args.rval().set(ret);
            return true;
        }
        CCLOGERROR("js_get_PolygonInfo_rect : Fail to retrieve property from PolygonInfo.");
        return false;
    }
    JS_ReportErrorUTF8(cx, "js_get_PolygonInfo_rect : Invalid native object.");
    return false;
}
bool js_set_PolygonInfo_rect(JSContext* cx, uint32_t argc, JS::Value* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    if (cobj)
    {
        JS::RootedValue jsrect(cx, args.get(0));
        jsval_to_ccrect(cx, jsrect, &cobj->rect);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_set_PolygonInfo_rect : Invalid native object.");
    return false;
}

// PolygonInfo.filename
bool js_get_PolygonInfo_filename(JSContext* cx, uint32_t argc, JS::Value* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    if (cobj)
    {
        JS::RootedValue ret(cx);
        bool ok = std_string_to_jsval(cx, cobj->filename, &ret);

        if (ok && !ret.isNullOrUndefined())
        {
            args.rval().set(ret);
            return true;
        }
        CCLOGERROR("js_get_PolygonInfo_filename : Fail to retrieve property from PolygonInfo.");
        return false;
    }
    JS_ReportErrorUTF8(cx, "js_get_PolygonInfo_filename : Invalid native object.");
    return false;
}
bool js_set_PolygonInfo_filename(JSContext* cx, uint32_t argc, JS::Value* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    if (cobj)
    {
        JS::RootedValue jsstr(cx, args.get(0));
        jsval_to_std_string(cx, jsstr, &cobj->filename);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_set_PolygonInfo_filename : Invalid native object.");
    return false;
}

bool js_cocos2dx_PolygonInfo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::PolygonInfo* cobj = new (std::nothrow) cocos2d::PolygonInfo();
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_PolygonInfo_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_cocos2d_PolygonInfo_class, proto, &jsobj, "cocos2d::PolygonInfo");
    JS_SetPrivate(jsobj.get(), cobj);
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}

void js_cocos2d_PolygonInfo_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (PolygonInfo)", obj);
    cocos2d::PolygonInfo *nobj = static_cast<cocos2d::PolygonInfo *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}

void js_register_cocos2dx_PolygonInfo(JSContext *cx, JS::HandleObject global)
{
    static const JSClassOps PolygonInfo_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_cocos2d_PolygonInfo_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass PolygonInfo_class = {
        "PolygonInfo",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &PolygonInfo_classOps
    };
    jsb_cocos2d_PolygonInfo_class = &PolygonInfo_class;
    
    static JSPropertySpec properties[] =
    {
        JS_PSGS("rect", js_get_PolygonInfo_rect, js_set_PolygonInfo_rect, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("filename", js_get_PolygonInfo_filename, js_set_PolygonInfo_filename, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] =
    {
        JS_FN("getArea", js_cocos2dx_PolygonInfo_getArea, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTrianglesCount", js_cocos2dx_PolygonInfo_getTrianglesCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTriaglesCount", js_cocos2dx_PolygonInfo_getTrianglesCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getVertCount", js_cocos2dx_PolygonInfo_getVertCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(cx, global,
                                            parent_proto,
                                            jsb_cocos2d_PolygonInfo_class,
                                            js_cocos2dx_PolygonInfo_constructor, 0, // constructor
                                            properties,
                                            funcs,
                                            nullptr, // no static properties
                                            nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::PolygonInfo>(cx, jsb_cocos2d_PolygonInfo_class, proto);
    jsb_cocos2d_PolygonInfo_prototype = typeClass->proto;
    
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PolygonInfo", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
}

JSClass  *jsb_cocos2d_AutoPolygon_class;
JS::PersistentRootedObject *jsb_cocos2d_AutoPolygon_prototype;

bool js_cocos2dx_AutoPolygon_generatePolygon(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_AutoPolygon_generatePolygon : Error processing arguments");
        cocos2d::PolygonInfo* ret = new (std::nothrow) cocos2d::PolygonInfo(cocos2d::AutoPolygon::generatePolygon(arg0));
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject retObj(cx);
            js_get_or_create_jsobject<cocos2d::PolygonInfo>(cx, ret, &retObj);
            jsret = JS::ObjectOrNullValue(retObj);
        }
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::Rect arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_ccrect(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_AutoPolygon_generatePolygon : Error processing arguments");
        cocos2d::PolygonInfo* ret = new (std::nothrow) cocos2d::PolygonInfo(cocos2d::AutoPolygon::generatePolygon(arg0, arg1));
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject retObj(cx);
            js_get_or_create_jsobject<cocos2d::PolygonInfo>(cx, ret, &retObj);
            jsret = JS::ObjectOrNullValue(retObj);
        }
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        cocos2d::Rect arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_ccrect(cx, args.get(1), &arg1);
        double arg2;
        ok &= jsval_to_double(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_AutoPolygon_generatePolygon : Error processing arguments");
        cocos2d::PolygonInfo* ret = new (std::nothrow) cocos2d::PolygonInfo(cocos2d::AutoPolygon::generatePolygon(arg0, arg1, arg2));
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject retObj(cx);
            js_get_or_create_jsobject<cocos2d::PolygonInfo>(cx, ret, &retObj);
            jsret = JS::ObjectOrNullValue(retObj);
        }
        args.rval().set(jsret);
        return true;
    }
    if (argc == 4) {
        std::string arg0;
        cocos2d::Rect arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_ccrect(cx, args.get(1), &arg1);
        double arg2, arg3;
        ok &= jsval_to_double(cx, args.get(2), &arg2);
        ok &= jsval_to_double(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_AutoPolygon_generatePolygon : Error processing arguments");
        cocos2d::PolygonInfo* ret = new (std::nothrow) cocos2d::PolygonInfo(cocos2d::AutoPolygon::generatePolygon(arg0, arg1, arg2, arg3));
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject retObj(cx);
            js_get_or_create_jsobject<cocos2d::PolygonInfo>(cx, ret, &retObj);
            jsret = JS::ObjectOrNullValue(retObj);
        }
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_AutoPolygon_generatePolygon : wrong number of arguments");
    return false;
}

bool js_cocos2dx_AutoPolygon_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_AutoPolygon_constructor : Error processing arguments");
    cocos2d::AutoPolygon* cobj = new (std::nothrow) cocos2d::AutoPolygon(arg0);
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_AutoPolygon_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_cocos2d_AutoPolygon_class, proto, &jsobj, "cocos2d::AutoPolygon");
    JS_SetPrivate(jsobj.get(), cobj);
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}

void js_cocos2d_AutoPolygon_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (AutoPolygon)", obj);
    cocos2d::AutoPolygon *nobj = static_cast<cocos2d::AutoPolygon *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}

void js_register_cocos2dx_AutoPolygon(JSContext *cx, JS::HandleObject global)
{
    static const JSClassOps AutoPolygon_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_cocos2d_AutoPolygon_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass AutoPolygon_class = {
        "AutoPolygon",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &AutoPolygon_classOps
    };
    jsb_cocos2d_AutoPolygon_class = &AutoPolygon_class;

    static JSFunctionSpec st_funcs[] = {
        JS_FN("generatePolygon", js_cocos2dx_AutoPolygon_generatePolygon, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(cx, global,
                                            parent_proto,
                                            jsb_cocos2d_AutoPolygon_class,
                                            js_cocos2dx_AutoPolygon_constructor, 0, // constructor
                                            nullptr,
                                            nullptr,
                                            nullptr,
                                            st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::AutoPolygon>(cx, jsb_cocos2d_AutoPolygon_class, proto);
    jsb_cocos2d_AutoPolygon_prototype = typeClass->proto;
}

JSClass  *jsb_RefFinalizeHook_class;
JSObject *jsb_RefFinalizeHook_prototype;
JSClass  *jsb_ObjFinalizeHook_class;
JSObject *jsb_ObjFinalizeHook_prototype;
JSClass  *jsb_PrivateHook_class;
JSObject *jsb_PrivateHook_prototype;

static bool jsb_RefFinalizeHook_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    // Create new object
    JS::RootedObject proto(cx, jsb_RefFinalizeHook_prototype);
    JS::RootedObject obj(cx, JS_NewObjectWithGivenProto(cx, jsb_RefFinalizeHook_class, proto));
    args.rval().set(JS::ObjectOrNullValue(obj));
    return true;
}
void jsb_RefFinalizeHook_finalize(JSFreeOp *fop, JSObject *obj)
{
    ScriptingCore *sc = ScriptingCore::getInstance();
    
    js_proxy_t *proxy = static_cast<js_proxy_t*>(JS_GetPrivate(obj));
    if (proxy)
    {
        sc->setFinalizing(true);
        
        cocos2d::Ref *refObj = static_cast<cocos2d::Ref *>(proxy->ptr);
        bool ok = jsb_remove_proxy(proxy);
        
        if (ok && refObj)
        {
            int count = refObj->getReferenceCount();
            if (count == 1)
            {
                // Can't release directly the native object, otherwise any JS Object manipulation in destructor may cause JSB crash,
                // because it's during garbage collection process
                refObj->autorelease();
            }
            else
            {
                CC_SAFE_RELEASE(refObj);
            }
#if COCOS2D_DEBUG > 1
            CCLOG("------RELEASED------ Cpp: %p - Proxy: %p", refObj, proxy);
#endif // COCOS2D_DEBUG
        }
        sc->setFinalizing(false);
    }
#if COCOS2D_DEBUG > 1
    else {
        CCLOG("jsbindings: Failed to remove proxy for js object, it may cause memory leak and future crash");
    }
#endif // COCOS2D_DEBUG
}
static bool jsb_ObjFinalizeHook_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    // Create new object
    JS::RootedObject proto(cx, jsb_ObjFinalizeHook_prototype);
    JS::RootedObject obj(cx, JS_NewObjectWithGivenProto(cx, jsb_ObjFinalizeHook_class, proto));
    args.rval().set(JS::ObjectOrNullValue(obj));
    return true;
}
void jsb_ObjFinalizeHook_finalize(JSFreeOp *fop, JSObject *obj)
{
    js_proxy_t *proxy = static_cast<js_proxy_t*>(JS_GetPrivate(obj));
    if (proxy)
    {
#if COCOS2D_DEBUG > 1
        CCLOG("------WEAK_REF------ Cpp: %p - Proxy: %p", proxy->ptr, proxy);
#endif // COCOS2D_DEBUG
        jsb_remove_proxy(proxy);
    }
}

void jsb_register_RefFinalizeHook(JSContext *cx, JS::HandleObject global)
{
    static const JSClassOps RefFinalizeHook_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        jsb_RefFinalizeHook_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass RefFinalizeHook_class = {
        "RefFinalizeHook",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &RefFinalizeHook_classOps
    };
    jsb_RefFinalizeHook_class = &RefFinalizeHook_class;
    
    jsb_RefFinalizeHook_prototype = JS_InitClass(cx, global,
                                              nullptr,
                                              jsb_RefFinalizeHook_class,
                                              jsb_RefFinalizeHook_constructor, 0, // constructor
                                              nullptr, nullptr, nullptr, nullptr);
}
void jsb_register_ObjFinalizeHook(JSContext *cx, JS::HandleObject global)
{
    static const JSClassOps ObjFinalizeHook_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        jsb_ObjFinalizeHook_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass ObjFinalizeHook_class = {
        "ObjFinalizeHook",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &ObjFinalizeHook_classOps
    };
    jsb_ObjFinalizeHook_class = &ObjFinalizeHook_class;
    
    jsb_ObjFinalizeHook_prototype = JS_InitClass(cx, global,
                                              nullptr,
                                              jsb_ObjFinalizeHook_class,
                                              jsb_ObjFinalizeHook_constructor, 0, // constructor
                                              nullptr, nullptr, nullptr, nullptr);
}
void jsb_register_PrivateHook(JSContext *cx, JS::HandleObject global)
{
    static const JSClassOps PrivateHook_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass PrivateHook_class = {
        "PrivateHook",
        JSCLASS_HAS_PRIVATE,
        &PrivateHook_classOps
    };
    jsb_PrivateHook_class = &PrivateHook_class;
    
    jsb_PrivateHook_prototype = JS_InitClass(cx, global,
                                                 nullptr,
                                                 jsb_PrivateHook_class,
                                                 nullptr, 0, // constructor
                                                 nullptr, nullptr, nullptr, nullptr);
}

void register_cocos2dx_js_core(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject ccObj(cx);
    JS::RootedObject jsbObj(cx);
    JS::RootedValue tmpVal(cx);
    JS::RootedObject tmpObj(cx);
    get_or_create_js_obj(cx, global, "cc", &ccObj);
    get_or_create_js_obj(cx, global, "jsb", &jsbObj);

    // Memory management related
    jsb_register_RefFinalizeHook(cx, jsbObj);
    jsb_register_ObjFinalizeHook(cx, jsbObj);
    jsb_register_PrivateHook(cx, jsbObj);

    js_register_cocos2dx_PolygonInfo(cx, jsbObj);
    js_register_cocos2dx_AutoPolygon(cx, jsbObj);

    JS_GetProperty(cx, ccObj, "PlistParser", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "getInstance", js_PlistParser_getInstance, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS::RootedObject proto(cx, jsb_cocos2d_SAXParser_prototype->get());
    JS_DefineFunction(cx, proto, "parse", js_PlistParser_parse, 1, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "Label", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "createWithTTF", js_cocos2dx_Label_createWithTTF, 4, JSPROP_READONLY | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Label_prototype->get());
    JS_DefineFunction(cx, tmpObj, "setTTFConfig", js_cocos2dx_Label_setTTFConfig, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Node_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "onEnter", js_cocos2dx_Node_onEnter, 0, JSPROP_ENUMERATE  | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "onExit", js_cocos2dx_Node_onExit, 0, JSPROP_ENUMERATE  | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "onEnterTransitionDidFinish", js_cocos2dx_Node_onEnterTransitionDidFinish, 0, JSPROP_ENUMERATE  | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "onExitTransitionDidStart", js_cocos2dx_Node_onExitTransitionDidStart, 0, JSPROP_ENUMERATE  | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "cleanup", js_cocos2dx_Node_cleanup, 0, JSPROP_ENUMERATE  | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "schedule", js_CCNode_schedule, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "scheduleOnce", js_CCNode_scheduleOnce, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "scheduleUpdateWithPriority", js_cocos2dx_CCNode_scheduleUpdateWithPriority, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "unscheduleUpdate", js_cocos2dx_CCNode_unscheduleUpdate, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "scheduleUpdate", js_cocos2dx_CCNode_scheduleUpdate, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "unschedule", js_CCNode_unschedule, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "unscheduleAllCallbacks", js_cocos2dx_CCNode_unscheduleAllSelectors, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setPosition", js_cocos2dx_CCNode_setPosition, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setContentSize", js_cocos2dx_CCNode_setContentSize, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setAnchorPoint", js_cocos2dx_CCNode_setAnchorPoint, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setColor", js_cocos2dx_CCNode_setColor, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "pause", js_cocos2dx_CCNode_pause, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "resume", js_cocos2dx_CCNode_resume, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "convertToWorldSpace", js_cocos2dx_CCNode_convertToWorldSpace, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "convertToWorldSpaceAR", js_cocos2dx_CCNode_convertToWorldSpaceAR, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setAdditionalTransform", js_cocos2dx_Node_setAdditionalTransform, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_EventListener_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Touch_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_EventTouch_prototype->get());
    JS_DefineFunction(cx, tmpObj, "getTouches", js_cocos2dx_EventTouch_getTouches, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setTouches", js_cocos2dx_EventTouch_setTouches, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_GLProgram_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setUniformLocationF32", js_cocos2dx_CCGLProgram_setUniformLocationWith4f, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "getProgram", js_cocos2dx_CCGLProgram_getProgram, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setUniformLocationWithMatrixfvUnion", js_cocos2dx_CCGLProgram_setUniformLocationWithMatrixfvUnion, 4, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_GLProgramState_prototype->get());
    JS_DefineFunction(cx, tmpObj, "setVertexAttribPointer", js_cocos2dx_GLProgramState_setVertexAttribPointer, 6, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setUniformVec4", js_cocos2dx_GLProgramState_setUniformVec4, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Scheduler_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "resumeTarget", js_cocos2dx_CCScheduler_resumeTarget, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "pauseTarget", js_cocos2dx_CCScheduler_pauseTarget, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "scheduleUpdateForTarget", js_CCScheduler_scheduleUpdateForTarget, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "unscheduleUpdate", js_CCScheduler_unscheduleUpdateForTarget, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "schedule", js_CCScheduler_schedule, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "scheduleCallbackForTarget", js_CCScheduler_scheduleCallbackForTarget, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "unschedule", js_CCScheduler_unscheduleCallbackForTarget, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "unscheduleCallbackForTarget", js_CCScheduler_unscheduleCallbackForTarget, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "unscheduleAllForTarget", js_cocos2dx_CCScheduler_unscheduleAllSelectorsForTarget, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "unscheduleAllCallbacks", js_cocos2dx_CCScheduler_unscheduleAll, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "unscheduleAllCallbacksWithMinPriority", js_cocos2dx_CCScheduler_unscheduleAllCallbacksWithMinPriority, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "isTargetPaused", js_cocos2dx_CCScheduler_isTargetPaused, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "isScheduled", js_cocos2dx_CCScheduler_isScheduled, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "pauseAllTargets", js_cocos2dx_CCScheduler_pauseAllTargets, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "pauseAllTargetsWithMinPriority", js_cocos2dx_CCScheduler_pauseAllTargetsWithMinPriority, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "resumeTargets", js_cocos2dx_CCScheduler_resumeTargets, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_ActionManager_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_TMXLayer_prototype->get());
    JS_DefineFunction(cx, tmpObj, "getTileFlagsAt", js_cocos2dx_CCTMXLayer_getTileFlagsAt, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Texture2D_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setTexParameters", js_cocos2dx_CCTexture2D_setTexParameters, 4, JSPROP_ENUMERATE  | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Menu_prototype->get());
    JS_DefineFunction(cx, tmpObj, "alignItemsInRows", js_cocos2dx_CCMenu_alignItemsInRows, 1, JSPROP_ENUMERATE  | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "alignItemsInColumns", js_cocos2dx_CCMenu_alignItemsInColumns, 1, JSPROP_ENUMERATE  | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Layer_prototype->get());
    JS_DefineFunction(cx, tmpObj, "init", js_cocos2dx_CCLayer_init, 0, JSPROP_ENUMERATE  | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_FileUtils_prototype->get());
    JS_DefineFunction(cx, tmpObj, "createDictionaryWithContentsOfFile", js_cocos2dx_FileUtils_createDictionaryWithContentsOfFile, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "getDataFromFile", js_cocos2dx_CCFileUtils_getDataFromFile, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "writeDataToFile", js_cocos2dx_CCFileUtils_writeDataToFile, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_EventDispatcher_prototype->get());
    JS_DefineFunction(cx, tmpObj, "addCustomListener", js_EventDispatcher_addCustomEventListener, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE);
    
    JS_GetProperty(cx, ccObj, "EventListenerTouchOneByOne", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_EventListenerTouchOneByOne_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "EventListenerTouchAllAtOnce", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_EventListenerTouchAllAtOnce_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "EventListenerMouse", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_EventListenerMouse_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "EventListenerKeyboard", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_EventListenerKeyboard_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    
    JS_GetProperty(cx, ccObj, "EventListenerAcceleration", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_EventListenerAcceleration_create, 1, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "EventListenerFocus", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_EventListenerFocus_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    
    JS_GetProperty(cx, ccObj, "EventListenerCustom", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_EventListenerCustom_create, 2, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "BezierBy", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCBezierBy_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_BezierBy_prototype->get());
    JS_DefineFunction(cx, tmpObj, "initWithDuration", JSB_CCBezierBy_initWithDuration, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "BezierTo", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCBezierTo_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_BezierTo_prototype->get());
    JS_DefineFunction(cx, tmpObj, "initWithDuration", JSB_CCBezierTo_initWithDuration, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "CardinalSplineBy", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCCardinalSplineBy_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "CardinalSplineTo", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCCardinalSplineTo_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_CardinalSplineTo_prototype->get());
    JS_DefineFunction(cx, tmpObj, "initWithDuration", js_cocos2dx_CardinalSplineTo_initWithDuration, 3, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "CatmullRomBy", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCCatmullRomBy_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_CatmullRomBy_prototype->get());
    JS_DefineFunction(cx, tmpObj, "initWithDuration", JSB_CatmullRomBy_initWithDuration, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "CatmullRomTo", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCCatmullRomTo_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_CatmullRomTo_prototype->get());
    JS_DefineFunction(cx, tmpObj, "initWithDuration", JSB_CatmullRomBy_initWithDuration, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Sprite_prototype->get());
    JS_DefineFunction(cx, tmpObj, "initWithPolygon", js_cocos2dx_Sprite_initWithPolygon, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setPolygonInfo", js_cocos2dx_Sprite_setPolygonInfo, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "textureLoaded", js_cocos2dx_Sprite_textureLoaded, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_SpriteBatchNode_prototype->get());
    JS_DefineFunction(cx, tmpObj, "getDescendants", js_cocos2dx_SpriteBatchNode_getDescendants, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Action_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_SpriteFrame_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_MenuItem_prototype->get());
    JS_DefineFunction(cx, tmpObj, "setCallback", js_cocos2dx_MenuItem_setCallback, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_TMXLayer_prototype->get());
    JS_DefineFunction(cx, tmpObj, "getTiles", js_cocos2dx_CCTMXLayer_getTiles, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_ActionInterval_prototype->get());
    JS_DefineFunction(cx, tmpObj, "repeat", js_cocos2dx_ActionInterval_repeat, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "repeatForever", js_cocos2dx_ActionInterval_repeatForever, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "_speed", js_cocos2dx_ActionInterval_speed, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "easing", js_cocos2dx_ActionInterval_easing, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_RenderTexture_prototype->get());
    JS_DefineFunction(cx, tmpObj, "saveToFile", js_cocos2dx_RenderTexture_saveToFile, 4, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "Menu", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "_create", js_cocos2dx_CCMenu_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_GetProperty(cx, ccObj, "MenuItemToggle", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "_create", js_cocos2dx_CCMenuItemToggle_create, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_Scene_prototype->get());
    JS_DefineFunction(cx, tmpObj, "init", js_cocos2dx_CCScene_init, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE);

    JS_GetProperty(cx, ccObj, "CallFunc", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_callFunc, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_CallFuncN_prototype->get());
    JS_DefineFunction(cx, tmpObj, "initWithFunction", js_cocos2dx_CallFunc_initWithFunction, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_ClippingNode_prototype->get());
    JS_DefineFunction(cx, tmpObj, "init", js_cocos2dx_ClippingNode_init, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_DefineFunction(cx, ccObj, "glEnableVertexAttribs", js_cocos2dx_ccGLEnableVertexAttribs, 1, JSPROP_READONLY | JSPROP_PERMANENT);

    get_or_create_js_obj(cx, ccObj, "math", &tmpObj);

    JS_DefineFunction(cx, tmpObj, "mat4CreateTranslation", js_cocos2dx_ccmat4CreateTranslation, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "mat4CreateRotation", js_cocos2dx_ccmat4CreateRotation, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "mat4Multiply", js_cocos2dx_ccmat4Multiply, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "mat4MultiplyVec3", js_cocos2dx_ccmat4MultiplyVec3, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "mat4GetInversed", js_cocos2dx_ccmat4GetInversed, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "mat4TransformVector", js_cocos2dx_ccmat4TransformVector, 3, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "mat4TransformPoint", js_cocos2dx_ccmat4TransformPoint, 3, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "quatMultiply", js_cocos2dx_ccquatMultiply, 2, JSPROP_READONLY | JSPROP_PERMANENT);

    js_register_cocos2dx_EventKeyboard(cx, ccObj);

    get_or_create_js_obj(cx, global, "console", &tmpObj);
    JS_DefineFunction(cx, tmpObj, "log", js_console_log, 1, JSPROP_PERMANENT);

    JS_DefineFunction(cx, global, "garbageCollect", js_forceGC, 1, JSPROP_READONLY | JSPROP_PERMANENT);
}
