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

#include "cocos2d_specifics.hpp"
#include "cocos2d.h"
#include <typeinfo>
#include "js_bindings_config.h"
#include "jsb_cocos2dx_auto.hpp"
#include "jsb_event_dispatcher_manual.h"
#include "component/CCComponentJS.h"
using namespace cocos2d;

schedFunc_proxy_t *_schedFunc_target_ht = nullptr;
schedTarget_proxy_t *_schedObj_target_ht = nullptr;

JSTouchDelegate::TouchDelegateMap JSTouchDelegate::sTouchDelegateMap;

JSTouchDelegate::JSTouchDelegate()
:  _touchListenerAllAtOnce(nullptr)
, _touchListenerOneByOne(nullptr)
{
    auto cx = ScriptingCore::getInstance()->getGlobalContext();
    _obj.construct(cx);
}

JSTouchDelegate::~JSTouchDelegate()
{
    CCLOGINFO("In the destructor of JSTouchDelegate.");
    _obj.destroyIfConstructed();
}

void JSTouchDelegate::setDelegateForJSObject(JSObject* pJSObj, JSTouchDelegate* pDelegate)
{
    CCASSERT(sTouchDelegateMap.find(pJSObj) == sTouchDelegateMap.end(),
             "pJSObj can't be found in sTouchDelegateMap.");
    sTouchDelegateMap.insert(TouchDelegatePair(pJSObj, pDelegate));
}

JSTouchDelegate* JSTouchDelegate::getDelegateForJSObject(JSObject* pJSObj)
{
    JSTouchDelegate* pRet = nullptr;
    TouchDelegateMap::iterator iter = sTouchDelegateMap.find(pJSObj);
    if (iter != sTouchDelegateMap.end())
    {
        pRet = iter->second;
    }
    return pRet;
}

void JSTouchDelegate::removeDelegateForJSObject(JSObject* pJSObj)
{
    TouchDelegateMap::iterator iter = sTouchDelegateMap.find(pJSObj);
    CCASSERT(iter != sTouchDelegateMap.end(), "pJSObj can't be found in sTouchDelegateMap!");
    if (iter != sTouchDelegateMap.end()) {
        sTouchDelegateMap.erase(pJSObj);
    }
}

void JSTouchDelegate::setJSObject(JS::HandleObject obj)
{
    _obj.ref() = obj;
}

void JSTouchDelegate::registerStandardDelegate(int priority)
{
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->removeEventListener(_touchListenerAllAtOnce);

    auto listener = EventListenerTouchAllAtOnce::create();

    listener->onTouchesBegan = CC_CALLBACK_2(JSTouchDelegate::onTouchesBegan, this);
    listener->onTouchesMoved = CC_CALLBACK_2(JSTouchDelegate::onTouchesMoved, this);
    listener->onTouchesEnded = CC_CALLBACK_2(JSTouchDelegate::onTouchesEnded, this);
    listener->onTouchesCancelled = CC_CALLBACK_2(JSTouchDelegate::onTouchesCancelled, this);

    dispatcher->addEventListenerWithFixedPriority(listener, priority);

    _touchListenerAllAtOnce = listener;
}

void JSTouchDelegate::registerTargetedDelegate(int priority, bool swallowsTouches)
{
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->removeEventListener(_touchListenerOneByOne);

    auto listener = EventListenerTouchOneByOne::create();
    listener->setSwallowTouches(swallowsTouches);

    listener->onTouchBegan = CC_CALLBACK_2(JSTouchDelegate::onTouchBegan, this);
    listener->onTouchMoved = CC_CALLBACK_2(JSTouchDelegate::onTouchMoved, this);
    listener->onTouchEnded = CC_CALLBACK_2(JSTouchDelegate::onTouchEnded, this);
    listener->onTouchCancelled = CC_CALLBACK_2(JSTouchDelegate::onTouchCancelled, this);

    dispatcher->addEventListenerWithFixedPriority(listener, priority);
    _touchListenerOneByOne = listener;
}

void JSTouchDelegate::unregisterTouchDelegate()
{
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->removeEventListener(_touchListenerAllAtOnce);
    dispatcher->removeEventListener(_touchListenerOneByOne);

    this->release();
}

bool JSTouchDelegate::onTouchBegan(Touch *touch, Event *event)
{
    CC_UNUSED_PARAM(event);
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedValue retval(cx);
    bool bRet = false;

    ScriptingCore::getInstance()->executeCustomTouchEvent(EventTouch::EventCode::BEGAN,
        touch, _obj.ref(), &retval);

    if(retval.isBoolean())
    {
        bRet = retval.toBoolean();
    }

    return bRet;
};
// optional

void JSTouchDelegate::onTouchMoved(Touch *touch, Event *event)
{
    CC_UNUSED_PARAM(event);

    ScriptingCore::getInstance()->executeCustomTouchEvent(EventTouch::EventCode::MOVED,
        touch, _obj.ref());
}

void JSTouchDelegate::onTouchEnded(Touch *touch, Event *event)
{
    CC_UNUSED_PARAM(event);

    ScriptingCore::getInstance()->executeCustomTouchEvent(EventTouch::EventCode::ENDED,
        touch, _obj.ref());
}

void JSTouchDelegate::onTouchCancelled(Touch *touch, Event *event)
{
    CC_UNUSED_PARAM(event);
    ScriptingCore::getInstance()->executeCustomTouchEvent(EventTouch::EventCode::CANCELLED,
        touch, _obj.ref());
}

// optional
void JSTouchDelegate::onTouchesBegan(const std::vector<Touch*>& touches, Event *event)
{
    CC_UNUSED_PARAM(event);
    ScriptingCore::getInstance()->executeCustomTouchesEvent(EventTouch::EventCode::BEGAN, touches, _obj.ref());
}

void JSTouchDelegate::onTouchesMoved(const std::vector<Touch*>& touches, Event *event)
{
    CC_UNUSED_PARAM(event);
    ScriptingCore::getInstance()->executeCustomTouchesEvent(EventTouch::EventCode::MOVED, touches, _obj.ref());
}

void JSTouchDelegate::onTouchesEnded(const std::vector<Touch*>& touches, Event *event)
{
    CC_UNUSED_PARAM(event);
    ScriptingCore::getInstance()->executeCustomTouchesEvent(EventTouch::EventCode::ENDED, touches, _obj.ref());
}

void JSTouchDelegate::onTouchesCancelled(const std::vector<Touch*>& touches, Event *event)
{
    CC_UNUSED_PARAM(event);
    ScriptingCore::getInstance()->executeCustomTouchesEvent(EventTouch::EventCode::CANCELLED, touches, _obj.ref());
}

// cc.EventTouch#getTouches
bool js_cocos2dx_EventTouch_getTouches(JSContext *cx, uint32_t argc, jsval *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
            js_proxy_t* jsproxy = js_get_or_create_proxy<cocos2d::Touch>(cx, touchObj);
            if (jsproxy) {
                arrElement = OBJECT_TO_JSVAL(jsproxy->obj);
            }
            if (!JS_SetElement(cx, jsretArr, i, arrElement)) {
                break;
            }
            ++i;
        }

//        JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(jsretArr));
        args.rval().set(OBJECT_TO_JSVAL(jsretArr));
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_EventTouch_getTouches : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

// cc.EventTouch#setTouches
bool js_cocos2dx_EventTouch_setTouches(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::EventTouch* cobj = (cocos2d::EventTouch *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_EventTouch_setTouches : Invalid Native Object");
    if (argc == 1) {
        std::vector<Touch*> arg0;
        JS::RootedObject jsobj(cx, args.get(0).toObjectOrNull());

        JSB_PRECONDITION3( ok, cx, false, "Error converting value to object");
        JSB_PRECONDITION3( jsobj && JS_IsArrayObject( cx, jsobj),  cx, false, "Object must be an array");

        uint32_t len = 0;
        JS_GetArrayLength(cx, jsobj, &len);

        for (uint32_t i=0; i < len; i++)
        {
            JS::RootedValue value(cx);
            if (JS_GetElement(cx, jsobj, i, &value))
            {
                JS::RootedObject tmp(cx, value.toObjectOrNull());
                proxy = jsb_get_js_proxy(tmp);
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

    JS_ReportError(cx, "js_cocos2dx_EventTouch_setTouches : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

static void addCallBackAndThis(JSObject *obj, jsval callback, jsval &thisObj)
{
    if(callback != JSVAL_VOID) {
        ScriptingCore::getInstance()->setReservedSpot(0, obj, callback);
    }
    if(thisObj != JSVAL_VOID) {
        ScriptingCore::getInstance()->setReservedSpot(1, obj, thisObj);
    }
}

bool js_cocos2dx_CCMenu_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc > 0) {
        Vector<MenuItem*> items;
        uint32_t i = 0;
        while (i < argc) {
            js_proxy_t *proxy;
            JS::RootedObject tmpObj(cx, args.get(i).toObjectOrNull());
            proxy = jsb_get_js_proxy(tmpObj);
            cocos2d::MenuItem *item = (cocos2d::MenuItem*)(proxy ? proxy->ptr : nullptr);
            TEST_NATIVE_OBJECT(cx, item)
            items.pushBack(item);
            i++;
        }
        cocos2d::Menu* ret = cocos2d::Menu::createWithArray(items);
        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *p = jsb_get_native_proxy(ret);
                if (p) {
                    jsret = OBJECT_TO_JSVAL(p->obj);
                } else {
                    // create a new js obj of that class
                    js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::Menu>(cx, ret);
                    jsret = OBJECT_TO_JSVAL(proxy->obj);
                }
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);

        args.rval().set(jsret);
        return true;
    }
    if (argc == 0) {
        cocos2d::Menu* ret = cocos2d::Menu::create();
        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *p = jsb_get_native_proxy(ret);
                if (p) {
                    jsret = OBJECT_TO_JSVAL(p->obj);
                } else {
                    // create a new js obj of that class
                    js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::Menu>(cx, ret);
                    jsret = OBJECT_TO_JSVAL(proxy->obj);
                }
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);

        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_cocos2dx_CCSequence_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc > 0) {
        Vector<FiniteTimeAction*> array;
        JS::RootedObject actions(cx, args.get(0).toObjectOrNull());
        if (argc == 1 && JS_IsArrayObject(cx, actions)) {
            bool ok = true;
            ok &= jsval_to_ccvector(cx, args.get(0), &array);
            JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        } else {
            uint32_t i = 0;
            while (i < argc) {
                js_proxy_t *proxy;
                JS::RootedObject tmpObj(cx, args.get(i).toObjectOrNull());
                proxy = jsb_get_js_proxy(tmpObj);
                cocos2d::FiniteTimeAction *item = (cocos2d::FiniteTimeAction*)(proxy ? proxy->ptr : nullptr);
                TEST_NATIVE_OBJECT(cx, item)
                array.pushBack(item);
                i++;
            }
        }
        cocos2d::FiniteTimeAction* ret = cocos2d::Sequence::create(array);
        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *p = jsb_get_native_proxy(ret);
                if (p) {
                    jsret = OBJECT_TO_JSVAL(p->obj);
                } else {
                    // create a new js obj of that class
                    js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::FiniteTimeAction>(cx, ret);
                    jsret = OBJECT_TO_JSVAL(proxy->obj);
                }
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);

        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_cocos2dx_CCSpawn_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc > 0) {
        Vector<FiniteTimeAction*> array;
        JS::RootedObject actions(cx, args.get(0).toObjectOrNull());
        if (argc == 1 && JS_IsArrayObject(cx, actions)) {
            bool ok = true;
            ok &= jsval_to_ccvector(cx, args.get(0), &array);
            JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        } else {
            uint32_t i = 0;
            while (i < argc) {
                js_proxy_t *proxy;
                JS::RootedObject tmpObj(cx, args[i].toObjectOrNull());
                proxy = jsb_get_js_proxy(tmpObj);
                cocos2d::FiniteTimeAction *item = (cocos2d::FiniteTimeAction*)(proxy ? proxy->ptr : nullptr);
                TEST_NATIVE_OBJECT(cx, item)
                array.pushBack(item);
                i++;
            }
        }
        cocos2d::FiniteTimeAction* ret = cocos2d::Spawn::create(array);
        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *p = jsb_get_native_proxy(ret);
                if (p) {
                    jsret = OBJECT_TO_JSVAL(p->obj);
                } else {
                    // create a new js obj of that class
                    js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::FiniteTimeAction>(cx, ret);
                    jsret = OBJECT_TO_JSVAL(proxy->obj);
                }
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_cocos2dx_CCMenuItemToggle_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc >= 1) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
        cocos2d::MenuItemToggle* ret = cocos2d::MenuItemToggle::create();

        for (uint32_t i = 0; i < argc; i++) {
            js_proxy_t *proxy;
            JS::RootedObject tmpObj(cx, args.get(i).toObjectOrNull());
            proxy = jsb_get_js_proxy(tmpObj);
            cocos2d::MenuItem* item = (cocos2d::MenuItem*)(proxy ? proxy->ptr : nullptr);
            TEST_NATIVE_OBJECT(cx, item)
            ret->addSubItem(item);
        }

        ret->setSelectedIndex(0);

        jsval jsret;
        if (ret) {
            js_proxy_t *proxy = jsb_get_native_proxy(ret);
            if (proxy) {
                jsret = OBJECT_TO_JSVAL(proxy->obj);
            } else {
                // create a new js obj of that class
                proxy = js_get_or_create_proxy<cocos2d::MenuItemToggle>(cx, ret);
                jsret = OBJECT_TO_JSVAL(proxy->obj);
            }
        } else {
            jsret = JSVAL_NULL;
        }

        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_cocos2dx_CCAnimation_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    bool ok = true;
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc <= 3) {
        cocos2d::Animation* ret = nullptr;
        double arg1 = 0.0f;
        if (argc == 2) {
            Vector<SpriteFrame*> arg0;
            ok &= jsval_to_ccvector(cx, args.get(0), &arg0);
            JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
            
            JS::RootedValue jsarg1(cx, args.get(1));
            ok &= JS::ToNumber(cx, jsarg1, &arg1);
            JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
            ret = cocos2d::Animation::createWithSpriteFrames(arg0, arg1);
        } else if (argc == 3) {
            Vector<AnimationFrame*> arg0;
            ok &= jsval_to_ccvector(cx, args.get(0), &arg0);
            JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
            
            unsigned int loops;
            JS::RootedValue jsarg1(cx, args.get(1));
            ok &= JS::ToNumber(cx, jsarg1, &arg1);
            ok &= jsval_to_uint32(cx, args.get(2), &loops);
            JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
            ret = cocos2d::Animation::create(arg0, arg1, loops);
        } else if (argc == 1) {
            Vector<SpriteFrame*> arg0;
            ok &= jsval_to_ccvector(cx, args.get(0), &arg0);
            JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
            
            ret = cocos2d::Animation::createWithSpriteFrames(arg0);
        } else if (argc == 0) {
            ret = cocos2d::Animation::create();
        }
        jsval jsret;
        if (ret) {
            js_proxy_t *proxy = jsb_get_native_proxy(ret);
            if (proxy) {
                jsret = OBJECT_TO_JSVAL(proxy->obj);
            } else {
                // create a new js obj of that class
                proxy = js_get_or_create_proxy<cocos2d::Animation>(cx, ret);
                jsret = OBJECT_TO_JSVAL(proxy->obj);
            }
        } else {
            jsret = JSVAL_NULL;
        }
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_cocos2dx_CCScene_init(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Scene* cobj = (cocos2d::Scene *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Scene_init : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->init();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_Scene_init : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_CCLayerMultiplex_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    Vector<Layer*> arg0;
    bool ok = true;
    ok &= jsvals_variadic_to_ccvector(cx, args, &arg0);
    JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

    cocos2d::LayerMultiplex* ret = cocos2d::LayerMultiplex::createWithArray(arg0);
    jsval jsret;
    do {
        if (ret) {
            js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::LayerMultiplex>(cx, ret);
            jsret = OBJECT_TO_JSVAL(proxy->obj);
        } else {
            jsret = JSVAL_NULL;
        }
    } while (0);
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_JSTouchDelegate_registerStandardDelegate(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc == 1 || argc == 2)
    {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
        JSTouchDelegate *touch = new (std::nothrow) JSTouchDelegate();

        int priority = 1;
        if (argc == 2)
        {
            priority = args.get(1).toInt32();
        }

        touch->registerStandardDelegate(priority);

        JS::RootedObject jsobj(cx, args.get(0).toObjectOrNull());
        touch->setJSObject(jsobj);
        JSTouchDelegate::setDelegateForJSObject(jsobj, touch);
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_JSTouchDelegate_registerTargetedDelegate(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc == 3)
    {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JSTouchDelegate *touch = new (std::nothrow) JSTouchDelegate();
        touch->registerTargetedDelegate(args.get(0).toInt32(), args.get(1).toBoolean());

        JS::RootedObject jsobj(cx, args.get(2).toObjectOrNull());
        touch->setJSObject(jsobj);
        JSTouchDelegate::setDelegateForJSObject(jsobj, touch);

        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}

bool js_cocos2dx_JSTouchDelegate_unregisterTouchDelegate(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc == 1) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
        JS::RootedObject jsobj(cx, args.get(0).toObjectOrNull());
        JSTouchDelegate* pDelegate = JSTouchDelegate::getDelegateForJSObject(jsobj);
        if (pDelegate)
        {
            pDelegate->unregisterTouchDelegate();
            JSTouchDelegate::removeDelegateForJSObject(jsobj);
        }

        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

JSObject* getObjectFromNamespace(JSContext* cx, JS::HandleObject ns, const char *name) {
    JS::RootedValue out(cx);
    bool ok = true;
    if (JS_GetProperty(cx, ns, name, &out) == true) {
        JS::RootedObject obj(cx);
        ok &= JS_ValueToObject(cx, out, &obj);
        JSB_PRECONDITION2(ok, cx, nullptr, "Error processing arguments");
    }
    return nullptr;
}

jsval anonEvaluate(JSContext *cx, JS::HandleObject thisObj, const char* string) {
    JS::RootedValue out(cx);
    //JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
    if (JS_EvaluateScript(cx, thisObj, string, (unsigned int)strlen(string), "(string)", 1, &out) == true) {
        return out.get();
    }
    return JSVAL_VOID;
}

JSCallbackWrapper::JSCallbackWrapper()
{
    JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
    _jsCallback.construct(cx, JS::NullHandleValue);
    _jsThisObj.construct(cx, JS::NullHandleValue);
    _extraData.construct(cx, JS::NullHandleValue);
}

JSCallbackWrapper::~JSCallbackWrapper()
{
    _jsCallback.destroyIfConstructed();
    _jsThisObj.destroyIfConstructed();
    _extraData.destroyIfConstructed();
}

void JSCallbackWrapper::setJSCallbackFunc(JS::HandleValue func) {
    if (!func.isNullOrUndefined()) {
        _jsCallback.ref() = func;
    }
}

void JSCallbackWrapper::setJSCallbackThis(JS::HandleValue thisObj) {
    if (!thisObj.isNullOrUndefined()) {
        _jsThisObj.ref() = thisObj;
    }
}

void JSCallbackWrapper::setJSExtraData(JS::HandleValue data) {
    if (!data.isNullOrUndefined()) {
        _extraData.ref() = data;
    }
}

const jsval JSCallbackWrapper::getJSCallbackFunc() const
{
    return _jsCallback.ref().get();
}

const jsval JSCallbackWrapper::getJSCallbackThis() const
{
    return _jsThisObj.ref().get();
}

const jsval JSCallbackWrapper::getJSExtraData() const
{
    return _extraData.ref().get();
}

// cc.CallFunc.create( func, this, [data])
// cc.CallFunc.create( func )
static bool js_callFunc(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc >= 1 && argc <= 3) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        std::shared_ptr<JSCallbackWrapper> tmpCobj(new JSCallbackWrapper());

        JS::RootedValue callback(cx, args.get(0));
        tmpCobj->setJSCallbackFunc(callback);
        if(argc >= 2) {
            JS::RootedValue thisObj(cx, args.get(1));
            tmpCobj->setJSCallbackThis(thisObj);
        } if(argc == 3) {
            JS::RootedValue data(cx, args.get(2));
            tmpCobj->setJSExtraData(data);
        }

        cocos2d::CallFuncN *ret = new (std::nothrow) cocos2d::CallFuncN;
        ret->initWithFunction([=](Node* sender){
            JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
            JS::RootedValue jsvalThis(cx, tmpCobj->getJSCallbackThis());
            JS::RootedObject thisObj(cx, jsvalThis.toObjectOrNull());
            JS::RootedValue jsvalCallback(cx, tmpCobj->getJSCallbackFunc());
            JS::RootedValue jsvalExtraData(cx, tmpCobj->getJSExtraData());

            JS::RootedValue senderVal(cx);

            if (sender == nullptr) {
                sender = ret->getTarget();
            }
            
            if(sender)
            {
                js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::Node>(cx, sender);
                senderVal.set(OBJECT_TO_JSVAL(proxy->obj));
            }
            else
            {
                senderVal.set(JS::NullValue());
            }

            if (!jsvalCallback.isNullOrUndefined())
            {
                JS::RootedValue retval(cx);
                jsval valArr[2];
                valArr[0] = senderVal;
                valArr[1] = jsvalExtraData;

                JS::HandleValueArray callArgs = JS::HandleValueArray::fromMarkedLocation(2, valArr);
                JS_CallFunctionValue(cx, thisObj, jsvalCallback, callArgs, &retval);
            }
        });
        ret->autorelease();

        js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::CallFunc>(cx, ret);
        args.rval().set(OBJECT_TO_JSVAL(proxy->obj));

        return true;
    }
    JS_ReportError(cx, "Invalid number of arguments");
    return false;
}

// callFunc.initWithFunction( func, this, [data])
// callFunc.initWithFunction( func )
bool js_cocos2dx_CallFunc_initWithFunction(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc >= 1 && argc <= 3) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
        JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(obj);
        CallFuncN *action = (cocos2d::CallFuncN *)(proxy ? proxy->ptr : nullptr);
        JSB_PRECONDITION2(action, cx, false, "Invalid Native Object");

        std::shared_ptr<JSCallbackWrapper> tmpCobj(new JSCallbackWrapper());

        JS::RootedValue callback(cx, args.get(0));
        tmpCobj->setJSCallbackFunc(callback);
        if(argc >= 2) {
            JS::RootedValue thisObj(cx, args.get(1));
            tmpCobj->setJSCallbackThis(thisObj);
        } if(argc == 3) {
            JS::RootedValue data(cx, args.get(2));
            tmpCobj->setJSExtraData(data);
        }

        action->initWithFunction([=](Node* sender){
            JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
            JS::RootedValue jsvalThis(cx, tmpCobj->getJSCallbackThis());
            JS::RootedObject thisObj(cx, jsvalThis.toObjectOrNull());
            JS::RootedValue jsvalCallback(cx, tmpCobj->getJSCallbackFunc());
            JS::RootedValue jsvalExtraData(cx, tmpCobj->getJSExtraData());

            JS::RootedValue senderVal(cx);

            if(sender)
            {
                js_proxy_t *senderProxy = js_get_or_create_proxy<cocos2d::Node>(cx, sender);
                senderVal.set(OBJECT_TO_JSVAL(senderProxy->obj));
            }
            else
            {
                senderVal.set(JS::NullValue());
            }

            if (!jsvalCallback.isNullOrUndefined())
            {
                JS::RootedValue retval(cx);
                jsval valArr[2];
                valArr[0] = senderVal;
                valArr[1] = jsvalExtraData;

                JS::HandleValueArray callArgs = JS::HandleValueArray::fromMarkedLocation(2, valArr);
                JS_CallFunctionValue(cx, thisObj, jsvalCallback, callArgs, &retval);
            }
        });

        return true;
    }
    JS_ReportError(cx, "Invalid number of arguments");
    return false;
}

JSScheduleWrapper::JSScheduleWrapper()
: _pTarget(nullptr)
, _priority(0)
, _isUpdateSchedule(false)
{
    JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
    _pPureJSTarget.construct(cx);
}

JSScheduleWrapper::~JSScheduleWrapper()
{
    _pPureJSTarget.destroyIfConstructed();
}

void JSScheduleWrapper::setTargetForSchedule(JS::HandleValue sched, JSScheduleWrapper *target) {
    do {
        JSObject* jsfunc = sched.toObjectOrNull();
        auto targetArray = getTargetForSchedule(sched);
        if (nullptr == targetArray) {
            targetArray = new (std::nothrow) JSBinding::Array;
            schedFunc_proxy_t *p = (schedFunc_proxy_t *)malloc(sizeof(schedFunc_proxy_t));
            assert(p);
            p->jsfuncObj = jsfunc;
            p->targets = targetArray;
            HASH_ADD_PTR(_schedFunc_target_ht, jsfuncObj, p);
        }

        CCASSERT(!targetArray->contains(target), "The target was already added.");

        targetArray->pushBack(target);
    } while(0);
}

JSBinding::Array* JSScheduleWrapper::getTargetForSchedule(JS::HandleValue sched) {
    schedFunc_proxy_t *t = nullptr;
    JSObject *o = sched.toObjectOrNull();
    HASH_FIND_PTR(_schedFunc_target_ht, &o, t);
    return t != nullptr ? t->targets : nullptr;
}


void JSScheduleWrapper::setTargetForJSObject(JS::HandleObject jsTargetObj, JSScheduleWrapper *target)
{
    auto targetArray = getTargetForJSObject(jsTargetObj);
    if (nullptr == targetArray) {
        targetArray = new (std::nothrow) JSBinding::Array;
        schedTarget_proxy_t *p = (schedTarget_proxy_t *)malloc(sizeof(schedTarget_proxy_t));
        assert(p);
        p->jsTargetObj = jsTargetObj;
        p->targets = targetArray;
        HASH_ADD_PTR(_schedObj_target_ht, jsTargetObj, p);
    }

    CCASSERT(!targetArray->contains(target), "The target was already added.");
    targetArray->pushBack(target);
}

JSBinding::Array* JSScheduleWrapper::getTargetForJSObject(JS::HandleObject jsTargetObj)
{
    schedTarget_proxy_t *t = nullptr;
    HASH_FIND_PTR(_schedObj_target_ht, &jsTargetObj.get(), t);
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
            std::vector<Ref*> objectsNeedToBeReleased;
            auto targets = current->targets;
            for (const auto& pObj : *targets)
            {
                JSScheduleWrapper* wrapper = static_cast<JSScheduleWrapper*>(pObj);
                bool isUpdateSchedule = wrapper->isUpdateSchedule();
                if (!isUpdateSchedule || (isUpdateSchedule && wrapper->getPriority() >= minPriority))
                {
                    objectsNeedToBeReleased.push_back(pObj);
                }
            }

            std::vector<Ref*>::iterator iter = objectsNeedToBeReleased.begin();
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
            std::vector<Ref*> objectsNeedToBeReleased;
            auto targets = current->targets;
            for (const auto& pObj : *targets)
            {
                JSScheduleWrapper* wrapper = static_cast<JSScheduleWrapper*>(pObj);
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

void JSScheduleWrapper::removeAllTargetsForJSObject(JS::HandleObject jsTargetObj)
{
    CCLOGINFO("removeAllTargetsForNatiaveNode begin");
    dump();
    JSBinding::Array* removeNativeTargets = nullptr;
    schedTarget_proxy_t *t = nullptr;
    HASH_FIND_PTR(_schedObj_target_ht, &jsTargetObj.get(), t);
    if (t != nullptr) {
        removeNativeTargets = t->targets;
        HASH_DEL(_schedObj_target_ht, t);
    }

    if (removeNativeTargets == nullptr) return;

    schedFunc_proxy_t *current, *tmp;
    HASH_ITER(hh, _schedFunc_target_ht, current, tmp) {
        std::vector<Ref*> objectsNeedToBeReleased;
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

void JSScheduleWrapper::removeTargetForJSObject(JS::HandleObject jsTargetObj, JSScheduleWrapper* target)
{
    CCLOGINFO("removeTargetForJSObject begin");
    dump();
    schedTarget_proxy_t *t = nullptr;
    HASH_FIND_PTR(_schedObj_target_ht, &jsTargetObj.get(), t);
    if (t != nullptr) {
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
            JSScheduleWrapper* pOneTarget = static_cast<JSScheduleWrapper*>(pObj);
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
        Ref* pObj = nullptr;
        CCARRAY_FOREACH(current->targets, pObj)
        {
            CCLOG("js target ( %p ), native target[%d]=( %p )", current->jsTargetObj, nativeTargetsCount, pObj);
            nativeTargetsCount++;
        }
    }

    CCLOG("\n-----------------------------\n");

    schedFunc_proxy_t *current_func, *tmp_func;
    int jsfuncTargetCount = 0;
    HASH_ITER(hh, _schedFunc_target_ht, current_func, tmp_func) {
        Ref* pObj = nullptr;
        CCARRAY_FOREACH(current_func->targets, pObj)
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
    jsval data = DOUBLE_TO_JSVAL(dt);

    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();

    JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET

    JS::RootedValue callback(cx, getJSCallbackFunc());
    if(!callback.isNullOrUndefined()) {
        JS::HandleValueArray args = JS::HandleValueArray::fromMarkedLocation(1, &data);
        JS::RootedValue retval(cx);
        JS::RootedObject callbackTarget(cx, getJSCallbackThis().toObjectOrNull());

        JS_CallFunctionValue(cx, callbackTarget, callback, args, &retval);
    }
}

void JSScheduleWrapper::update(float dt)
{
    jsval data = DOUBLE_TO_JSVAL(dt);

    ScriptingCore::getInstance()->executeFunctionWithOwner(getJSCallbackThis(), "update", 1, &data);
}

Ref*  JSScheduleWrapper::getTarget()
{
    return _pTarget;
}

void JSScheduleWrapper::setTarget(Ref* pTarget)
{
    _pTarget = pTarget;
}

void JSScheduleWrapper::setPureJSTarget(JS::HandleObject pPureJSTarget)
{
    _pPureJSTarget.ref() = pPureJSTarget;
}

JSObject* JSScheduleWrapper::getPureJSTarget()
{
    return _pPureJSTarget.ref().get();
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

bool js_CCNode_unschedule(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc == 1) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(obj);
        cocos2d::Node *node = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
        JSB_PRECONDITION2(node, cx, false, "Invalid Native Object");

        Scheduler *sched = node->getScheduler();

        auto targetArray = JSScheduleWrapper::getTargetForSchedule(args.get(0));
        if (targetArray) {
            CCLOGINFO("unschedule target number: %d", targetArray->count());

            for (const auto& tmp : *targetArray)
            {
                JSScheduleWrapper* target = static_cast<JSScheduleWrapper*>(tmp);
                if (node == target->getTarget())
                {
                    sched->unschedule(schedule_selector(JSScheduleWrapper::scheduleFunc), target);
                    JSScheduleWrapper::removeTargetForJSObject(obj, target);
                    break;
                }
            }
        }

        args.rval().setUndefined();
    }
    return true;
}

bool js_cocos2dx_CCNode_unscheduleAllSelectors(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 0)
    {
        cobj->unscheduleAllCallbacks();

        auto arr = JSScheduleWrapper::getTargetForJSObject(obj);
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

        JSScheduleWrapper::removeAllTargetsForJSObject(obj);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_CCNode_scheduleOnce(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc >= 1) {
        bool ok = true;
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedValue thisValue(cx, args.thisv());
        JS::RootedObject obj(cx, thisValue.toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(obj);
        cocos2d::Node *node = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
        if (node == nullptr) {
            return false;
        }

        Scheduler *sched = node->getScheduler();
        if (sched == nullptr) {
            return false;
        }
        JSScheduleWrapper *tmpCobj = nullptr;

        //
        // delay
        //
        double delay;
        if( argc >= 2 ) {
            JS::RootedValue jsdelay(cx, args.get(1));
            ok &= JS::ToNumber(cx, jsdelay, &delay);
            JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        }

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(obj);
        if (pTargetArr)
        {
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = static_cast<JSScheduleWrapper*>(pObj);
                if (args.get(0) == pTarget->getJSCallbackFunc())
                {
                    tmpCobj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCobj = new (std::nothrow) JSScheduleWrapper();
            tmpCobj->autorelease();
            tmpCobj->setJSCallbackThis(thisValue);
            tmpCobj->setJSCallbackFunc(args.get(0));
            tmpCobj->setTarget(node);

            JSScheduleWrapper::setTargetForSchedule(args.get(0), tmpCobj);
            JSScheduleWrapper::setTargetForJSObject(obj, tmpCobj);
        }

        if(argc == 1) {
            sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCobj, 0, 0, 0.0f, !node->isRunning());
        } else {
            sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCobj, 0, 0, delay, !node->isRunning());
        }

        /* We shouldn't set the js callback function to reserved slot,
           since the target object may execute more than one schedule.
           Therefore, previous js callback function will be replaced
           by the current one. For example:
              this.scheduleOnce(function() { temporary function 1 }, 0.5);
              this.scheduleOnce(function() { temporary function 2 }, 0.5);
           In this case, the temporary function 1 will be removed from reserved slot 0.
           And temporary function 2 will be set to reserved slot 0 of this object.
           If gc is triggered before the 'JSScheduleWrapper::scheduleFunc' is invoked,
           crash will happen. You could simply reproduce it by adding '__jsc__.garbageCollect();' after scheduleOnce.

           [Solution] Because one schedule corresponds to one JSScheduleWrapper, we root
           the js callback function in JSScheduleWrapper::setJSCallbackFunc and unroot it
           at the destructor of JSScheduleWrapper.
        */
        //jsb_set_reserved_slot(proxy->obj, 0, args.get(0));

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_CCNode_schedule(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc >= 1) {
        bool ok = true;
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedValue thisValue(cx, args.thisv());
        JS::RootedObject obj(cx, thisValue.toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(obj);
        cocos2d::Node *node = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
        Scheduler *sched = node->getScheduler();

        JSScheduleWrapper *tmpCobj = nullptr;

        double interval = 0.0;
        if( argc >= 2 ) {
            JS::RootedValue jsinterval(cx, args.get(1));
            ok &= JS::ToNumber(cx, jsinterval, &interval);
        }

        //
        // repeat
        //
        double repeat = 0.0;
        if( argc >= 3 ) {
            JS::RootedValue jsrepeat(cx, args.get(2));
            ok &= JS::ToNumber(cx, jsrepeat, &repeat);
        }

        //
        // delay
        //
        double delay = 0.0;
        if( argc >= 4 ) {
            JS::RootedValue jsdelay(cx, args.get(3));
            ok &= JS::ToNumber(cx, jsdelay, &delay);
        }

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        bool bFound = false;
        auto targetArray = JSScheduleWrapper::getTargetForJSObject(obj);
        if (targetArray)
        {
            for (auto&& pObj : *targetArray)
            {
                auto target = static_cast<JSScheduleWrapper*>(pObj);
                if (args.get(0) == target->getJSCallbackFunc())
                {
                    tmpCobj = target;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCobj = new (std::nothrow) JSScheduleWrapper();
            tmpCobj->autorelease();
            tmpCobj->setJSCallbackThis(thisValue);
            tmpCobj->setJSCallbackFunc(args.get(0));
            tmpCobj->setTarget(node);
            JSScheduleWrapper::setTargetForSchedule(args.get(0), tmpCobj);
            JSScheduleWrapper::setTargetForJSObject(obj, tmpCobj);
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

        // I comment next line with the same reason in the js_CCNode_scheduleOnce.
        //jsb_set_reserved_slot(proxy->obj, 0, args.get(0));

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_cocos2dx_CCNode_scheduleUpdateWithPriority(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedValue thisValue(cx, args.thisv());
    JS::RootedObject obj(cx, thisValue.toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        bool isFoundUpdate = false;
        ok = JS_HasProperty(cx, obj, "update", &isFoundUpdate);
        JS::RootedValue jsUpdateFunc(cx);
        if (ok && isFoundUpdate) {
            ok = JS_GetProperty(cx, obj, "update", &jsUpdateFunc);
        }

        // if no 'update' property, return true directly.
        if (!ok) {
            args.rval().setUndefined();
            return true;
        }

        JSScheduleWrapper* tmpCobj = nullptr;

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(obj);
        if (pTargetArr)
        {
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = static_cast<JSScheduleWrapper*>(pObj);
                if (jsUpdateFunc == pTarget->getJSCallbackFunc())
                {
                    tmpCobj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCobj = new (std::nothrow) JSScheduleWrapper();
            tmpCobj->autorelease();
            tmpCobj->setJSCallbackThis(thisValue);
            tmpCobj->setJSCallbackFunc(jsUpdateFunc);
            tmpCobj->setTarget(cobj);
            tmpCobj->setUpdateSchedule(true);
            JSScheduleWrapper::setTargetForSchedule(jsUpdateFunc, tmpCobj);
            JSScheduleWrapper::setTargetForJSObject(obj, tmpCobj);
        }

        tmpCobj->setPriority(arg0);
        cobj->getScheduler()->scheduleUpdate(tmpCobj, arg0, !cobj->isRunning());

        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_unscheduleUpdate(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 0)
    {
        cobj->unscheduleUpdate();
        do {
            auto arr = JSScheduleWrapper::getTargetForJSObject(obj);
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
                    CCASSERT(OBJECT_TO_JSVAL(obj) == wrapper->getJSCallbackThis(), "Wrong target object.");
                    JSScheduleWrapper::removeTargetForJSObject(obj, wrapper);
                    break;
                }
            }
        } while (0);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_CCNode_scheduleUpdate(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    JS::RootedValue thisValue(cx, args.thisv());
    JS::RootedObject obj(cx, thisValue.toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 0) {

        bool isFoundUpdate = false;
        ok = JS_HasProperty(cx, obj, "update", &isFoundUpdate);
        JS::RootedValue jsUpdateFunc(cx);
        if (ok && isFoundUpdate) {
            ok = JS_GetProperty(cx, obj, "update", &jsUpdateFunc);
        }

        // if no 'update' property, return true directly.
        if (!ok) {
            args.rval().setUndefined();
            return true;
        }

        JSScheduleWrapper* tmpCobj = nullptr;

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(obj);
        if (pTargetArr)
        {
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = static_cast<JSScheduleWrapper*>(pObj);
                if (jsUpdateFunc == pTarget->getJSCallbackFunc())
                {
                    tmpCobj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCobj = new (std::nothrow) JSScheduleWrapper();
            tmpCobj->autorelease();
            tmpCobj->setJSCallbackThis(thisValue);
            tmpCobj->setJSCallbackFunc(jsUpdateFunc);
            tmpCobj->setTarget(cobj);
            tmpCobj->setUpdateSchedule(true);
            JSScheduleWrapper::setTargetForSchedule(jsUpdateFunc, tmpCobj);
            JSScheduleWrapper::setTargetForJSObject(obj, tmpCobj);
        }

        cobj->getScheduler()->scheduleUpdate(tmpCobj, 0, !cobj->isRunning());

        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_unscheduleAllSelectorsForTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 1) {
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());

            auto arr = JSScheduleWrapper::getTargetForJSObject(tmpObj);
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
            JSScheduleWrapper::removeAllTargetsForJSObject(tmpObj);

        } while (0);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_CCScheduler_scheduleUpdateForTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc >= 1) {
        bool ok = true;
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
        js_proxy_t *proxy = jsb_get_js_proxy(obj);
        cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

        JSScheduleWrapper *tmpCObj = nullptr;

        JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
        proxy = jsb_get_js_proxy(tmpObj);
        bool isPureJSTarget = proxy ? false : true;

        bool isFoundUpdate = false;
        ok = JS_HasProperty(cx, tmpObj, "update", &isFoundUpdate);
        JS::RootedValue jsUpdateFunc(cx);
        if (ok && isFoundUpdate) {
            ok = JS_GetProperty(cx, tmpObj, "update", &jsUpdateFunc);
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
            JS::RootedValue jspaused(cx, args.get(2));
            paused = JS::ToBoolean(jspaused);
        }

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(tmpObj);
        if (pTargetArr)
        {
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = static_cast<JSScheduleWrapper*>(pObj);
                if (jsUpdateFunc == pTarget->getJSCallbackFunc())
                {
                    tmpCObj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCObj = new (std::nothrow) JSScheduleWrapper();
            tmpCObj->autorelease();
            tmpCObj->setJSCallbackThis(args.get(0));
            tmpCObj->setJSCallbackFunc(jsUpdateFunc);
            tmpCObj->setUpdateSchedule(true);
            if (isPureJSTarget) {
                tmpCObj->setPureJSTarget(tmpObj);
            }

            JSScheduleWrapper::setTargetForSchedule(jsUpdateFunc, tmpCObj);
            JSScheduleWrapper::setTargetForJSObject(tmpObj, tmpCObj);
        }
        tmpCObj->setPriority(arg1);
        sched->scheduleUpdate(tmpCObj, arg1, paused);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_CCScheduler_unscheduleUpdateForTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if (argc == 1) {
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());

            auto arr = JSScheduleWrapper::getTargetForJSObject(tmpObj);
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
                    CCASSERT(args.get(0) == wrapper->getJSCallbackThis(), "Wrong target object.");
                    JSScheduleWrapper::removeTargetForJSObject(tmpObj, wrapper);
                    break;
                }
            }
        } while (0);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_CCScheduler_scheduleCallbackForTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc >= 2) {
        bool ok = true;
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedObject obj(cx);
        obj = args.thisv().toObjectOrNull();
        js_proxy_t *proxy = jsb_get_js_proxy(obj);
        cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

        JSScheduleWrapper *tmpCObj = nullptr;

        JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
        proxy = jsb_get_js_proxy(tmpObj);
        bool isPureJSTarget = proxy ? false : true;

        double interval = 0;
        if( argc >= 3 ) {
            JS::RootedValue jsinterval(cx, args.get(2));
            ok &= JS::ToNumber(cx, jsinterval, &interval);
        }

        //
        // repeat
        //
        double repeat = kRepeatForever;
        if( argc >= 4 ) {
            JS::RootedValue jsrepeat(cx, args.get(3));
            ok &= JS::ToNumber(cx, jsrepeat, &repeat);
        }

        //
        // delay
        //
        double delay = 0;
        if( argc >= 5 ) {
            JS::RootedValue jsdelay(cx, args.get(4));
            ok &= JS::ToNumber(cx, jsdelay, &delay);
        }

        bool paused = false;

        if( argc >= 6 ) {
            JS::RootedValue jspaused(cx, args.get(5));
            paused = JS::ToBoolean(jspaused);
        }

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        bool bFound = false;
        auto pTargetArr = JSScheduleWrapper::getTargetForJSObject(tmpObj);
        if (pTargetArr)
        {
            for (auto&& pObj : *pTargetArr)
            {
                JSScheduleWrapper* pTarget = static_cast<JSScheduleWrapper*>(pObj);
                if (args.get(1) == pTarget->getJSCallbackFunc())
                {
                    tmpCObj = pTarget;
                    bFound = true;
                    break;
                }
            }
        }

        if (!bFound)
        {
            tmpCObj = new (std::nothrow) JSScheduleWrapper();
            tmpCObj->autorelease();
            tmpCObj->setJSCallbackThis(args.get(0));
            tmpCObj->setJSCallbackFunc(args.get(1));
            if (isPureJSTarget) {
                tmpCObj->setPureJSTarget(tmpObj);
            }

            JSScheduleWrapper::setTargetForSchedule(args.get(1), tmpCObj);
            JSScheduleWrapper::setTargetForJSObject(tmpObj, tmpCObj);
        }

        sched->schedule(schedule_selector(JSScheduleWrapper::scheduleFunc), tmpCObj, interval, repeat, delay, paused);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_CCScheduler_schedule(JSContext *cx, uint32_t argc, jsval *vp)
{
    if (argc >= 2) {
        bool ok = true;
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

        JS::RootedObject obj(cx);
        obj = args.thisv().toObjectOrNull();
        js_proxy_t *proxy = jsb_get_js_proxy(obj);
        cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

        std::function<void (float)> callback;
        JS::RootedObject targetObj(cx);
        do {
            JS::RootedValue callbackVal(cx);
            if (JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
            {
                callbackVal.set(args.get(0));
                targetObj.set(args.get(1).toObjectOrNull());
            }
            else if (JS_TypeOfValue(cx, args.get(1)) == JSTYPE_FUNCTION)
            {
                targetObj.set(args.get(0).toObjectOrNull());
                callbackVal.set(args.get(1));
            }
            else
            {
                ok = false;
                callback = nullptr;
                break;
            }

            std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, targetObj, callbackVal));
            auto lambda = [=](float larg0) -> void {
                JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
                    jsval largv[1];
                largv[0] = DOUBLE_TO_JSVAL(larg0);
                JS::RootedValue rval(cx);
                bool invokeOk = func->invoke(1, &largv[0], &rval);
                if (!invokeOk && JS_IsExceptionPending(cx)) {
                    JS_ReportPendingException(cx);
                }
            };
            callback = lambda;
        } while(0);

        double interval = 0;
        if( argc >= 3 ) {
            JS::RootedValue jsinterval(cx, args.get(2));
            ok &= JS::ToNumber(cx, jsinterval, &interval);
        }

        //
        // repeat
        //
        double repeat = kRepeatForever;
        if( argc >= 4 ) {
            JS::RootedValue jsrepeat(cx, args.get(3));
            ok &= JS::ToNumber(cx, jsrepeat, &repeat);
        }

        //
        // delay
        //
        double delay = 0;
        if( argc >= 5 ) {
            JS::RootedValue jsdelay(cx, args.get(4));
            ok &= JS::ToNumber(cx, jsdelay, &delay);
        }

        bool paused = false;
        if( argc >= 6 ) {
            JS::RootedValue jspaused(cx, args.get(5));
            paused = JS::ToBoolean(jspaused);
        }

        std::string key;
        if( argc >= 7 ) {
            jsval_to_std_string(cx, args.get(6), &key);
        }

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        sched->schedule(callback, targetObj, interval, repeat, delay, paused, key);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments");
    return false;
}

bool js_CCScheduler_unscheduleCallbackForTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

                auto arr = JSScheduleWrapper::getTargetForJSObject(tmpObj);
                // If there aren't any targets, just return true.
                // Otherwise, the for loop will break immediately.
                // It will lead to logic errors.
                // For details to reproduce it, please refer to SchedulerTest/SchedulerUpdate.
                if(! arr) return true;

                JSScheduleWrapper* wrapper = nullptr;
                for(ssize_t i = 0; i < arr->size(); ++i) {
                    wrapper = (JSScheduleWrapper*)arr->at(i);
                    if(wrapper && wrapper->getJSCallbackFunc() == args.get(1)) {
                        cobj->unschedule(schedule_selector(JSScheduleWrapper::scheduleFunc), wrapper);
                        JSScheduleWrapper::removeTargetForJSObject(tmpObj, wrapper);
                        break;
                    }
                }
            }
        } while (0);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_unscheduleAll(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 0) {
        cobj->unscheduleAll();
        JSScheduleWrapper::removeAllTargets();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_unscheduleAllCallbacksWithMinPriority(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}


bool js_cocos2dx_CCScheduler_pauseTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

    if (argc == 1) {
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            auto arr = JSScheduleWrapper::getTargetForJSObject(tmpObj);
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
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_resumeTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Scheduler *sched = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);

    if (argc == 1) {
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            auto arr = JSScheduleWrapper::getTargetForJSObject(tmpObj);
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
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_isTargetPaused(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        bool ret = false;
        do {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            auto arr = JSScheduleWrapper::getTargetForJSObject(tmpObj);
            if(! arr) return true;
            for(ssize_t i = 0; i < arr->size(); ++i) {
                if(arr->at(i)) {
                    ret = cobj->isTargetPaused(arr->at(i)) ? true : false;
                    // break directly since all targets have the same `pause` status.
                    break;
                }
            }
        } while (0);
//        JS_SET_RVAL(cx, vp, BOOLEAN_TO_JSVAL(ret));
        args.rval().set(BOOLEAN_TO_JSVAL(ret));
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCScheduler_isScheduled(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Scheduler* cobj = (cocos2d::Scheduler *)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj);

    if (argc == 2) {
        bool isScheduled = false;
        JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());

        auto arr = JSScheduleWrapper::getTargetForJSObject(tmpObj);
        if(! arr) {
    	    args.rval().set(BOOLEAN_TO_JSVAL(isScheduled));
    	    return true;
        };
        for (ssize_t i = 0; i < arr->size(); ++i) {
            Ref *wrapper = arr->at(i);
            if (wrapper) {
                isScheduled = cobj->isScheduled(schedule_selector(JSScheduleWrapper::scheduleFunc), wrapper);
                break;
            }
        }
    	args.rval().set(BOOLEAN_TO_JSVAL(isScheduled));
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_forceGC(JSContext *cx, uint32_t argc, jsval *vp) {
    JSRuntime *rt = JS_GetRuntime(cx);
    JS_GC(rt);
    return true;
}

bool js_cocos2dx_retain(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Ref* cobj = (cocos2d::Ref *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_retain : Invalid Native Object");

    cobj->retain();
    ScriptingCore::getInstance()->recordJSRetain(cobj);
    
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_release(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Ref* cobj = (cocos2d::Ref *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_release : Invalid Native Object");

    cobj->release();
    ScriptingCore::getInstance()->recordJSRelease(cobj);
    
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_onEnter(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_onEnter : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->onEnter();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_onExit(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_onExit : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->onExit();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_onEnterTransitionDidFinish(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_onEnterTransitionDidFinish : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->onEnterTransitionDidFinish();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_onExitTransitionDidStart(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_onExitTransitionDidStart : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->onExitTransitionDidStart();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_Node_cleanup(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_cleanup : Invalid Native Object");

    ScriptingCore::getInstance()->setCalledFromScript(true);
    cobj->cleanup();
    args.rval().setUndefined();
    return true;
}

bool js_cocos2dx_CCNode_setPosition(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
        double x;
        JS::RootedValue jsx(cx, args.get(0));
        ok &= JS::ToNumber(cx, jsx, &x);
        double y;
        JS::RootedValue jsy(cx, args.get(1));
        ok &= JS::ToNumber(cx, jsy, &y);
        JSB_PRECONDITION2(ok, cx, false, "Error processing argumenjs_cocos2dx_CCNode_setContentSizets");

        cobj->setPosition(Point(x,y));
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_setContentSize(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
        double width;
        JS::RootedValue jsw(cx, args.get(0));
        ok &= JS::ToNumber(cx, jsw, &width);
        double height;
        JS::RootedValue jsh(cx, args.get(1));
        ok &= JS::ToNumber(cx, jsh, &height);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cobj->setContentSize(Size(width,height));
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_setAnchorPoint(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
        double x;
        ok &= JS::ToNumber(cx, args.get(0), &x );
        double y;
        ok &= JS::ToNumber(cx, args.get(1), &y );
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cobj->setAnchorPoint(Point(x,y));
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_setColor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_cocos2dx_Node_setColor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCNode_pause(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_pause : Invalid Native Object");
    if (argc == 0) {
        do {
            auto arr = JSScheduleWrapper::getTargetForJSObject(obj);
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

    JS_ReportError(cx, "js_cocos2dx_Node_pause : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_CCNode_resume(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Node_resume : Invalid Native Object");
    if (argc == 0) {
        do {
            auto arr = JSScheduleWrapper::getTargetForJSObject(obj);
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

    JS_ReportError(cx, "js_cocos2dx_Node_resume : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_CCNode_convertToWorldSpace(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CCNode_convertToWorldSpace : Invalid Native Object");
    cocos2d::Vec2 arg0;
    if (argc == 1) {
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CCNode_convertToWorldSpace : Error processing arguments");
    }
    else if (argc != 0) {
        JS_ReportError(cx, "js_cocos2dx_CCNode_convertToWorldSpace : wrong number of arguments: %d, was expecting 0 or 1", argc);
        return false;
    }

    cocos2d::Vec2 ret = cobj->convertToWorldSpace(arg0);
    jsval jsret = JSVAL_NULL;
    jsret = vector2_to_jsval(cx, ret);
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_CCNode_convertToWorldSpaceAR(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Node* cobj = (cocos2d::Node *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CCNode_convertToWorldSpaceAR : Invalid Native Object");
    cocos2d::Vec2 arg0;
    if (argc == 1) {
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CCNode_convertToWorldSpaceAR : Error processing arguments");
    }
    else if (argc != 0) {
        JS_ReportError(cx, "js_cocos2dx_CCNode_convertToWorldSpaceAR : wrong number of arguments: %d, was expecting 0 or 1", argc);
        return false;
    }

    cocos2d::Vec2 ret = cobj->convertToWorldSpaceAR(arg0);
    jsval jsret = JSVAL_NULL;
    jsret = vector2_to_jsval(cx, ret);
    args.rval().set(jsret);
    return true;
}

bool js_cocos2dx_CCTMXLayer_getTiles(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::TMXLayer* cobj = (cocos2d::TMXLayer *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 0) {
        auto ret = cobj->getTiles();
        Size size = cobj->getLayerSize();
        int count = size.width * size.height;
        JS::RootedObject array(cx, JS_NewUint32Array(cx, count));
        if (nullptr == array) {
            JS_ReportError(cx, "Can't allocate enough memory.");
            return false;
        }
        uint32_t* bufdata = (uint32_t*)JS_GetArrayBufferViewData(array);
        memcpy(bufdata, ret, count*sizeof(int32_t));

        args.rval().set(OBJECT_TO_JSVAL(array));
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}


// Actions

bool js_cocos2dx_ActionInterval_repeat(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ActionInterval_repeat : Invalid Native Object");

    if (argc == 1)
    {
        double times;
        if( ! JS::ToNumber(cx, args.get(0), &times) ) {
            return false;
        }
        int timesInt = (int)times;
        if (timesInt <= 0) {
            JS_ReportError(cx, "js_cocos2dx_ActionInterval_repeat : Repeat times must be greater than 0");
        }

        cocos2d::Repeat* action = cocos2d::Repeat::create(cobj, timesInt);
        // Unbind current proxy binding
        JS::RemoveObjectRoot(cx, &proxy->obj);
        jsb_remove_proxy(proxy);
        // Rebind js obj with new action
        js_proxy_t* newProxy = jsb_new_proxy(action, obj);
        JS::AddNamedObjectRoot(cx, &newProxy->obj, "cocos2d::Repeat");

        args.rval().set(OBJECT_TO_JSVAL(obj));
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_ActionInterval_repeat : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ActionInterval_repeatForever(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ActionInterval_repeatForever : Invalid Native Object");

    if (argc == 0) {
        cocos2d::RepeatForever* action = cocos2d::RepeatForever::create(cobj);
        // Unbind current proxy binding
        JS::RemoveObjectRoot(cx, &proxy->obj);
        jsb_remove_proxy(proxy);
        // Rebind js obj with new action
        js_proxy_t* newProxy = jsb_new_proxy(action, obj);
        JS::AddNamedObjectRoot(cx, &newProxy->obj, "cocos2d::RepeatForever");

        args.rval().set(OBJECT_TO_JSVAL(obj));
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_ActionInterval_repeatForever : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_ActionInterval_speed(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ActionInterval_speed : Invalid Native Object");

    if (argc == 1)
    {
        double speed;
        if( ! JS::ToNumber(cx, args.get(0), &speed) ) {
            return false;
        }
        if (speed < 0) {
            JS_ReportError(cx, "js_cocos2dx_ActionInterval_speed : Speed must not be negative");
            return false;
        }

        cocos2d::Speed* action = cocos2d::Speed::create(cobj, speed);
        // Unbind current proxy binding
        JS::RemoveObjectRoot(cx, &proxy->obj);
        jsb_remove_proxy(proxy);
        // Rebind js obj with new action
        js_proxy_t* newProxy = jsb_new_proxy(action, obj);
        JS::AddNamedObjectRoot(cx, &newProxy->obj, "cocos2d::Speed");

        args.rval().set(OBJECT_TO_JSVAL(obj));
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_ActionInterval_speed : wrong number of arguments: %d, was expecting %d", argc, 1);
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

bool js_cocos2dx_ActionInterval_easing(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ActionInterval_easing : Invalid Native Object");

    cocos2d::ActionInterval* currentAction = cobj;
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
            JS::ToNumber(cx, jsTag, &tag);
        
        bool hasParam = JS_GetProperty(cx, tmp, "param", &jsParam) && !jsParam.isUndefined();
        JS::ToNumber(cx, jsParam, &parameter);
        
        if (!ok) continue;

        cocos2d::ActionEase* action;
        ok = true;
        if (tag == EASE_IN)
        {
            if (!hasParam) ok = false;
            action = cocos2d::EaseIn::create(currentAction, parameter);
        }
        else if (tag == EASE_OUT)
        {
            if (!hasParam) ok = false;
            action = cocos2d::EaseOut::create(currentAction, parameter);
        }
        else if (tag == EASE_INOUT)
        {
            if (!hasParam) ok = false;
            action = cocos2d::EaseInOut::create(currentAction, parameter);
        }
        else if (tag == EASE_EXPONENTIAL_IN)
            action = cocos2d::EaseExponentialIn::create(currentAction);
        else if (tag == EASE_EXPONENTIAL_OUT)
            action = cocos2d::EaseExponentialOut::create(currentAction);
        else if (tag == EASE_EXPONENTIAL_INOUT)
            action = cocos2d::EaseExponentialInOut::create(currentAction);
        else if (tag == EASE_SINE_IN)
            action = cocos2d::EaseSineIn::create(currentAction);
        else if (tag == EASE_SINE_OUT)
            action = cocos2d::EaseSineOut::create(currentAction);
        else if (tag == EASE_SINE_INOUT)
            action = cocos2d::EaseSineInOut::create(currentAction);
        else if (tag == EASE_ELASTIC_IN)
        {
            if (!hasParam) parameter = 0.3;
            action = cocos2d::EaseElasticIn::create(currentAction, parameter);
        }
        else if (tag == EASE_ELASTIC_OUT)
        {
            if (!hasParam) parameter = 0.3;
            action = cocos2d::EaseElasticOut::create(currentAction, parameter);
        }
        else if (tag == EASE_ELASTIC_INOUT)
        {
            if (!hasParam) parameter = 0.3;
            action = cocos2d::EaseElasticInOut::create(currentAction, parameter);
        }
        else if (tag == EASE_BOUNCE_IN)
            action = cocos2d::EaseBounceIn::create(currentAction);
        else if (tag == EASE_BOUNCE_OUT)
            action = cocos2d::EaseBounceOut::create(currentAction);
        else if (tag == EASE_BOUNCE_INOUT)
            action = cocos2d::EaseBounceInOut::create(currentAction);
        else if (tag == EASE_BACK_IN)
            action = cocos2d::EaseBackIn::create(currentAction);
        else if (tag == EASE_BACK_OUT)
            action = cocos2d::EaseBackOut::create(currentAction);
        else if (tag == EASE_BACK_INOUT)
            action = cocos2d::EaseBackInOut::create(currentAction);

        else if (tag == EASE_QUADRATIC_IN)
            action = cocos2d::EaseQuadraticActionIn::create(currentAction);
        else if (tag == EASE_QUADRATIC_OUT)
            action = cocos2d::EaseQuadraticActionOut::create(currentAction);
        else if (tag == EASE_QUADRATIC_INOUT)
            action = cocos2d::EaseQuadraticActionInOut::create(currentAction);
        else if (tag == EASE_QUARTIC_IN)
            action = cocos2d::EaseQuarticActionIn::create(currentAction);
        else if (tag == EASE_QUARTIC_OUT)
            action = cocos2d::EaseQuarticActionOut::create(currentAction);
        else if (tag == EASE_QUARTIC_INOUT)
            action = cocos2d::EaseQuarticActionInOut::create(currentAction);
        else if (tag == EASE_QUINTIC_IN)
            action = cocos2d::EaseQuinticActionIn::create(currentAction);
        else if (tag == EASE_QUINTIC_OUT)
            action = cocos2d::EaseQuinticActionOut::create(currentAction);
        else if (tag == EASE_QUINTIC_INOUT)
            action = cocos2d::EaseQuinticActionInOut::create(currentAction);
        else if (tag == EASE_CIRCLE_IN)
            action = cocos2d::EaseCircleActionIn::create(currentAction);
        else if (tag == EASE_CIRCLE_OUT)
            action = cocos2d::EaseCircleActionOut::create(currentAction);
        else if (tag == EASE_CIRCLE_INOUT)
            action = cocos2d::EaseCircleActionInOut::create(currentAction);
        else if (tag == EASE_CUBIC_IN)
            action = cocos2d::EaseCubicActionIn::create(currentAction);
        else if (tag == EASE_CUBIC_OUT)
            action = cocos2d::EaseCubicActionOut::create(currentAction);
        else if (tag == EASE_CUBIC_INOUT)
            action = cocos2d::EaseCubicActionInOut::create(currentAction);
        else if (tag == EASE_BEZIER_ACTION)
        {
            JS::RootedValue jsParam2(cx);
            JS::RootedValue jsParam3(cx);
            JS::RootedValue jsParam4(cx);
            double parameter2, parameter3, parameter4;
            ok &= JS_GetProperty(cx, tmp, "param2", &jsParam2);
            ok &= JS::ToNumber(cx, jsParam2, &parameter2);
            ok &= JS_GetProperty(cx, tmp, "param3", &jsParam3);
            ok &= JS::ToNumber(cx, jsParam3, &parameter3);
            ok &= JS_GetProperty(cx, tmp, "param4", &jsParam4);
            ok &= JS::ToNumber(cx, jsParam4, &parameter4);
            if (!ok) continue;

            action = cocos2d::EaseBezierAction::create(currentAction);
            ((EaseBezierAction *)action)->setBezierParamer(parameter, parameter2, parameter3, parameter4);
        }
        else
            continue;

        if (!ok || !action) {
            JS_ReportError(cx, "js_cocos2dx_ActionInterval_easing : Invalid action: At least one action was expecting parameter");
            return false;
        }

        currentAction = action;
    }

    // Unbind current proxy binding
    JS::RemoveObjectRoot(cx, &proxy->obj);
    jsb_remove_proxy(proxy);
    // Rebind js obj with new action
    js_proxy_t* newProxy = jsb_new_proxy(currentAction, obj);
    JS::AddNamedObjectRoot(cx, &newProxy->obj, "cocos2d::EaseAction");
    args.rval().set(OBJECT_TO_JSVAL(obj));
    return true;
}


template<class T>
bool js_BezierActions_create(JSContext *cx, uint32_t argc, jsval *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    if (argc == 2) {
        double t;
        if( ! JS::ToNumber(cx, args.get(0), &t) ) {
            return false;
        }

        int num;
        Point *arr;
        jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);

        ccBezierConfig config;
        config.controlPoint_1 = arr[0];
        config.controlPoint_2 = arr[1];
        config.endPosition = arr[2];

        T* ret =  T::create(t, config);

        delete [] arr;

        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *p = jsb_get_native_proxy(ret);
                if (p) {
                    jsret = OBJECT_TO_JSVAL(p->obj);
                } else {
                    // create a new js obj of that class
                    js_proxy_t *proxy = js_get_or_create_proxy<T>(cx, ret);
                    jsret = OBJECT_TO_JSVAL(proxy->obj);
                }
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);
        args.rval().set(jsret);
        return true;

    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

template<class T>
bool js_BezierActions_initWithDuration(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    T* cobj = (T *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Bezier_initWithDuration : Invalid Native Object");
    if (argc == 2) {
        double arg0;
        cocos2d::_ccBezierConfig arg1;
        ok &= JS::ToNumber(cx, args.get(0), &arg0);

        int num;
        cocos2d::Vec2 *arr;
        jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);

        arg1.controlPoint_1 = arr[0];
        arg1.controlPoint_2 = arr[1];
        arg1.endPosition = arr[2];

        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Bezier_initWithDuration : Error processing arguments");
        bool ret = cobj->initWithDuration(arg0, arg1);
        delete [] arr;
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_BezierTo_initWithDuration : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

template<class T>
bool js_CardinalSplineActions_create(JSContext *cx, uint32_t argc, jsval *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    if (argc == 3) {
        double dur;
        ok &= JS::ToNumber(cx, args.get(0), &dur);

        int num;
        Point *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);

        double ten;
        ok &= JS::ToNumber(cx, args.get(2), &ten);

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        PointArray *points = PointArray::create(num);

        for( int i=0; i < num;i++) {
            points->addControlPoint(arr[i]);
        }

        T *ret = T::create(dur, points, ten);

        delete [] arr;

        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *p = jsb_get_native_proxy(ret);
                if (p) {
                    jsret = OBJECT_TO_JSVAL(p->obj);
                } else {
                    // create a new js obj of that class
                    js_proxy_t *proxy = js_get_or_create_proxy<T>(cx, ret);
                    jsret = OBJECT_TO_JSVAL(proxy->obj);
                }
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);
        args.rval().set(jsret);
        return true;

    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

template<class T>
bool js_CatmullRomActions_create(JSContext *cx, uint32_t argc, jsval *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    if (argc == 2) {
        double dur;
        ok &= JS::ToNumber(cx, args.get(0), &dur);

        int num;
        Point *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        PointArray *points = PointArray::create(num);

        for( int i=0; i < num;i++) {
            points->addControlPoint(arr[i]);
        }

        T *ret = T::create(dur, points);

        delete [] arr;

        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *p = jsb_get_native_proxy(ret);
                if (p) {
                    jsret = OBJECT_TO_JSVAL(p->obj);
                } else {
                    // create a new js obj of that class
                    js_proxy_t *proxy = js_get_or_create_proxy<T>(cx, ret);
                    jsret = OBJECT_TO_JSVAL(proxy->obj);
                }
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);
        args.rval().set(jsret);
        return true;

    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

template<class T>
bool js_CatmullRomActions_initWithDuration(JSContext *cx, uint32_t argc, jsval *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    T* cobj = (T *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CatmullRom_initWithDuration : Invalid Native Object");
    if (argc == 2) {
        double arg0;
        JS::RootedValue jsarg0(cx, args.get(0));
        ok &= JS::ToNumber(cx, jsarg0, &arg0);

        int num;
        Point *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);

        cocos2d::PointArray* arg1 = cocos2d::PointArray::create(num);
        for( int i=0; i < num;i++) {
            arg1->addControlPoint(arr[i]);
        }


        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CatmullRom_initWithDuration : Error processing arguments");
        bool ret = cobj->initWithDuration(arg0, arg1);
        delete [] arr;
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_CatmullRom_initWithDuration : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}


bool JSB_CCBezierBy_actionWithDuration(JSContext *cx, uint32_t argc, jsval *vp) {
    return js_BezierActions_create<cocos2d::BezierBy>(cx, argc, vp);
}

bool JSB_CCBezierTo_actionWithDuration(JSContext *cx, uint32_t argc, jsval *vp) {
    return js_BezierActions_create<cocos2d::BezierTo>(cx, argc, vp);
}

bool JSB_CCBezierBy_initWithDuration(JSContext *cx, uint32_t argc, jsval *vp)
{
    return js_BezierActions_initWithDuration<cocos2d::BezierBy>(cx, argc, vp);
}

bool JSB_CCBezierTo_initWithDuration(JSContext *cx, uint32_t argc, jsval *vp)
{
    return js_BezierActions_initWithDuration<cocos2d::BezierTo>(cx, argc, vp);
}

bool JSB_CCCardinalSplineBy_actionWithDuration(JSContext *cx, uint32_t argc, jsval *vp) {
    return js_CardinalSplineActions_create<cocos2d::CardinalSplineBy>(cx, argc, vp);
}

bool JSB_CCCardinalSplineTo_actionWithDuration(JSContext *cx, uint32_t argc, jsval *vp) {
    return js_CardinalSplineActions_create<cocos2d::CardinalSplineTo>(cx, argc, vp);
}

bool js_cocos2dx_CardinalSplineTo_initWithDuration(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::CardinalSplineTo* cobj = (cocos2d::CardinalSplineTo *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CardinalSplineTo_initWithDuration : Invalid Native Object");
    if (argc == 3) {
        double arg0;

        double arg2;
        JS::RootedValue jsarg0(cx, args.get(0));
        ok &= JS::ToNumber(cx, jsarg0, &arg0);

        int num;
        Point *arr;
        ok &= jsval_to_ccarray_of_CCPoint(cx, args.get(1), &arr, &num);
        cocos2d::PointArray* arg1 = PointArray::create(num);
        for( int i=0; i < num;i++) {
            arg1->addControlPoint(arr[i]);
        }

        JS::RootedValue jsarg2(cx, args.get(2));
        ok &= JS::ToNumber(cx, jsarg2, &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CardinalSplineTo_initWithDuration : Error processing arguments");
        bool ret = cobj->initWithDuration(arg0, arg1, arg2);

        delete [] arr;
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_CardinalSplineTo_initWithDuration : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}

bool JSB_CCCatmullRomBy_actionWithDuration(JSContext *cx, uint32_t argc, jsval *vp) {
    return js_CatmullRomActions_create<cocos2d::CatmullRomBy>(cx, argc, vp);
}

bool JSB_CCCatmullRomTo_actionWithDuration(JSContext *cx, uint32_t argc, jsval *vp) {
    return js_CatmullRomActions_create<cocos2d::CatmullRomTo>(cx, argc, vp);
}

bool JSB_CatmullRomBy_initWithDuration(JSContext *cx, uint32_t argc, jsval *vp) {
    return js_CatmullRomActions_initWithDuration<cocos2d::CatmullRomBy>(cx, argc, vp);
}

bool JSB_CatmullRomTo_initWithDuration(JSContext *cx, uint32_t argc, jsval *vp) {
    return js_CatmullRomActions_initWithDuration<cocos2d::CatmullRomTo>(cx, argc, vp);
}

bool js_cocos2dx_ccGLEnableVertexAttribs(JSContext *cx, uint32_t argc, jsval *vp)
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

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ccmat4CreateTranslation(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc == 1)
    {
        cocos2d::Vec3 arg0;
        bool ok = jsval_to_vector3(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cocos2d::Mat4 ret;
        cocos2d::Mat4::createTranslation(arg0, &ret);
        jsval jsret = matrix_to_jsval(cx, ret);

        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ccmat4CreateRotation(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc == 1)
    {
        cocos2d::Quaternion arg0;
        bool ok = jsval_to_quaternion(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        cocos2d::Mat4 ret;
        cocos2d::Mat4::createRotation(arg0, &ret);
        jsval jsret = matrix_to_jsval(cx, ret);

        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ccmat4Multiply(JSContext *cx, uint32_t argc, jsval *vp)
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
        jsval jsret = matrix_to_jsval(cx, ret);

        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_ccmat4MultiplyVec3(JSContext *cx, uint32_t argc, jsval *vp)
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
        jsval jsret = vector3_to_jsval(cx, ret);

        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_ccmat4GetInversed(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if(argc == 1)
    {
        cocos2d::Mat4 arg0;
        bool ok = jsval_to_matrix(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        jsval jsret = matrix_to_jsval(cx, arg0.getInversed());

        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_ccmat4TransformVector(JSContext *cx, uint32_t argc, jsval *vp)
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
        jsval jsret = vector4_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    else if (argc >= 5)
    {
        cocos2d::Mat4 arg0;
        double arg1 = 0.0,arg2 = 0.0,arg3 = 0.0, arg4 = 0.0;
        cocos2d::Vec3 ret;

        bool ok = jsval_to_matrix(cx, args.get(0), &arg0) &&
                  JS::ToNumber(cx, args.get(1), &arg1) &&
                  JS::ToNumber(cx, args.get(2), &arg2) &&
                  JS::ToNumber(cx, args.get(3), &arg3) &&
                  JS::ToNumber(cx, args.get(4), &arg4);

        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        arg0.transformVector(arg1, arg2, arg3, arg4, &ret);
        jsval jsret = vector3_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}

bool js_cocos2dx_ccmat4TransformPoint(JSContext *cx, uint32_t argc, jsval *vp)
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
        jsval jsret = vector3_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}

bool js_cocos2dx_ccquatMultiply(JSContext *cx, uint32_t argc, jsval *vp)
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
        jsval jsret = quaternion_to_jsval(cx, ret);

        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_Sprite_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        jsval jsret = JSVAL_NULL;
        if (!ok) {
            CCLOGERROR("js_cocos2dx_Sprite_create error: argc is 1,transform jsval to string failed!");
            args.rval().set(jsret);
            return true;
        }
        auto ret = cocos2d::Sprite::create(arg0);
        if (ret) {
            js_proxy_t *jsProxy = js_get_or_create_proxy<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret);
            jsret = OBJECT_TO_JSVAL(jsProxy->obj);
        }

        args.rval().set(jsret);
        return true;
    }

    if (argc == 0) {
        auto ret = cocos2d::Sprite::create();
        jsval jsret = JSVAL_NULL;
        if (ret) {
            js_proxy_t *jsProxy = js_get_or_create_proxy<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret);
            jsret = OBJECT_TO_JSVAL(jsProxy->obj);
        }
        args.rval().set(jsret);
        return true;
    }

    if (argc == 2) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        jsval jsret = JSVAL_NULL;
        if (!ok) {
            CCLOGERROR("js_cocos2dx_Sprite_create error: argc is 2,transform jsval to string failed!");
            args.rval().set(jsret);
            return true;
        }

        cocos2d::Rect arg1;
        ok &= jsval_to_ccrect(cx, args.get(1), &arg1);
        if (!ok) {
            CCLOGERROR("js_cocos2dx_Sprite_create error: transform jsval to cocos2d::Rect failed!");
            args.rval().set(jsret);
            return true;
        }

        auto ret = cocos2d::Sprite::create(arg0, arg1);
        if (ret) {
            js_proxy_t *jsProxy = js_get_or_create_proxy<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret);
            jsret = OBJECT_TO_JSVAL(jsProxy->obj);
        }
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_Sprite_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_Sprite_initWithPolygon(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Sprite* cobj = (cocos2d::Sprite *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Sprite_initWithPolygon : Invalid Native Object");
    if (argc == 1) {
        cocos2d::PolygonInfo *arg0;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(tmpObj);
            arg0 = (cocos2d::PolygonInfo*)(jsProxy ? jsProxy->ptr : nullptr);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Sprite_initWithPolygon : Error processing arguments");
        bool ret = cobj->initWithPolygon(*arg0);
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_Sprite_initWithPolygon : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_Sprite_setPolygonInfo(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Sprite* cobj = (cocos2d::Sprite *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_Sprite_setPolygonInfo : Invalid Native Object");
    if (argc == 1) {
        cocos2d::PolygonInfo *arg0;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(tmpObj);
            arg0 = (cocos2d::PolygonInfo*)(jsProxy ? jsProxy->ptr : nullptr);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_Sprite_setPolygonInfo : Error processing arguments");
        cobj->setPolygonInfo(*arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_Sprite_setPolygonInfo : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_Sprite_textureLoaded(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    Sprite* cobj = (Sprite*)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj);

    bool ret = false;
    if( cobj->getTexture() )
        ret = true;

    args.rval().set(BOOLEAN_TO_JSVAL(ret));
    return true;
}

bool js_cocos2dx_CCTexture2D_setTexParameters(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}

bool js_cocos2dx_CCMenu_alignItemsInRows(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(jsthis);
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
    JS_ReportError(cx, "Error in js_cocos2dx_CCMenu_alignItemsInRows");
    return false;
}

bool js_cocos2dx_CCMenu_alignItemsInColumns(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    bool ok = true;
    js_proxy_t *proxy = jsb_get_js_proxy(jsthis);
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
    JS_ReportError(cx, "Error in js_cocos2dx_CCMenu_alignItemsInColumns");
    return false;
}

bool js_cocos2dx_CCLayer_init(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::Layer* cobj = (cocos2d::Layer *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CCLayer_init : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->init();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_CCLayer_init : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}


// TMXLayer
bool js_cocos2dx_CCTMXLayer_getTileFlagsAt(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

        args.rval().set(UINT_TO_JSVAL((uint32_t)flags));
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

//#pragma mark - DrawNode

// Arguments: Array of points, fill color (Color4F), width(float), border color (Color4F)
// Ret value: void
bool js_cocos2dx_CCDrawNode_drawPolygon(JSContext *cx, uint32_t argc, jsval *vp)
{

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    DrawNode* cobj = (DrawNode*)(proxy ? proxy->ptr : nullptr);
    TEST_NATIVE_OBJECT(cx, cobj)

    if ( argc == 4) {
        bool ok = true;
        JS::RootedObject argArray(cx);
        Color4F argFillColor = Color4F(0.0f, 0.0f, 0.0f, 0.0f);
        double argWidth = 0.0;
        Color4F argBorderColor = Color4F(0.0f, 0.0f, 0.0f, 0.0f);

        // Points
        ok &= JS_ValueToObject(cx, args.get(0), &argArray);
        JSB_PRECONDITION2( (argArray && JS_IsArrayObject(cx, argArray)) , cx, false, "Vertex should be anArray object");

        // Color 4F
        ok &= jsval_to_cccolor4f(cx, args.get(1), &argFillColor);

        // Width
        ok &= JS::ToNumber( cx, args.get(2), &argWidth );

        // Color Border (4F)
        ok &= jsval_to_cccolor4f(cx, args.get(3), &argBorderColor);

        JSB_PRECONDITION2(ok, cx, false, "Error parsing arguments");

        {
            uint32_t l;
            if( ! JS_GetArrayLength(cx, argArray, &l) )
                return false;

            Point* verts = new (std::nothrow) Point[ l ];
            Point p;

            for( uint32_t i=0; i<l; i++ ) {
                JS::RootedValue pointvp(cx);
                ok &= JS_GetElement(cx, argArray, i, &pointvp);
                JSB_PRECONDITION2(ok, cx, false, "JS_GetElement fails.");

                ok &= jsval_to_ccpoint(cx, pointvp, &p);
                JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
                verts[i] = p;
            }

            cobj->drawPolygon(verts, l, argFillColor, argWidth, argBorderColor);
            CC_SAFE_DELETE_ARRAY(verts);
        }
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}

static bool jsval_to_string_vector(JSContext* cx, jsval v, std::vector<std::string>& ret) {
    JS::RootedObject jsobj(cx);
    JS::RootedValue jsv(cx, v);
    bool ok = JS_ValueToObject(cx, jsv, &jsobj);
    JSB_PRECONDITION2( ok, cx, false, "Error converting value to object");
    JSB_PRECONDITION2( jsobj && JS_IsArrayObject( cx, jsobj),  cx, false, "Object must be an array");

    uint32_t len = 0;
    JS_GetArrayLength(cx, jsobj, &len);

    for (uint32_t i=0; i < len; i++) {
        JS::RootedValue elt(cx);
        if (JS_GetElement(cx, jsobj, i, &elt)) {

            if (elt.isString())
            {
                JSStringWrapper str(elt.toString());
                ret.push_back(str.get());
            }
        }
    }

    return true;
}


static jsval string_vector_to_jsval(JSContext* cx, const std::vector<std::string>& arr) {

    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, 0));

    int i = 0;
    for(auto iter = arr.begin(); iter != arr.end(); ++iter, ++i) {
        JS::RootedValue arrElement(cx, std_string_to_jsval(cx, *iter));
        if(!JS_SetElement(cx, jsretArr, i, arrElement)) {
            break;
        }
    }
    return OBJECT_TO_JSVAL(jsretArr);
}

bool js_cocos2dx_CCFileUtils_setSearchResolutionsOrder(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if (argc == 1) {
        std::vector<std::string> arg0;
        ok &= jsval_to_string_vector(cx, args.get(0), arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->setSearchResolutionsOrder(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCFileUtils_setSearchPaths(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if (argc == 1) {
        std::vector<std::string> arg0;
        ok &= jsval_to_string_vector(cx, args.get(0), arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->setSearchPaths(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_CCFileUtils_getSearchPaths(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if (argc == 0) {
        std::vector<std::string> ret = cobj->getSearchPaths();
        jsval jsret;
        jsret = string_vector_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_CCFileUtils_getDataFromFile(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

                uint8_t* bufdata = (uint8_t*)JS_GetArrayBufferViewData(array);
                memcpy(bufdata, data.getBytes(), size*sizeof(uint8_t));

                args.rval().set(OBJECT_TO_JSVAL(array));
                return true;
            }
        } while(false);

        // return null if read failed.
        args.rval().set(JSVAL_NULL);
        return true;
        //JS_ReportError(cx, "get file(%s) data fails", arg0.c_str());
        //return false;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}

bool js_cocos2dx_CCFileUtils_writeDataToFile(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_CCFileUtils_writeDataToFile : Invalid Native Object");
    if (argc == 2) {
        Data arg0;
        std::string arg1;

        // copy bytes from UInit8Array
        JSObject &obj0 = args.get(0).toObject();
        if( JS_IsUint8Array(&obj0) ) {
            uint32_t len = JS_GetArrayBufferViewByteLength(&obj0);
            uint8_t* bufdata = (uint8_t*)JS_GetArrayBufferViewData(&obj0);
            arg0.copy(bufdata, len);
        } else {
            ok = false;
        }

        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_CCFileUtils_writeDataToFile : Error processing arguments");
        bool ret = cobj->writeDataToFile(arg0, arg1);
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_CCFileUtils_writeDataToFile : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_CCFileUtils_getSearchResolutionsOrder(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if (argc == 0) {
        std::vector<std::string> ret = cobj->getSearchResolutionsOrder();
        jsval jsret;
        jsret = string_vector_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

static bool js_cocos2dx_FileUtils_createDictionaryWithContentsOfFile(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cocos2d::ValueMap ret = FileUtils::getInstance()->getValueMapFromFile(arg0.c_str());
        jsval jsret;
        jsret = ccvaluemap_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_cocos2dx_CCGLProgram_setUniformLocationWith4f(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::GLProgram* cobj = (cocos2d::GLProgram *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    int arg0;
    double arg1;
    double arg2;
    double arg3;
    double arg4;
    ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
    ok &= JS::ToNumber(cx, args.get(1), &arg1);

    if(argc == 2) {
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->setUniformLocationWith1f(arg0, arg1);
    }
    if (argc == 3) {
        ok &= JS::ToNumber(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->setUniformLocationWith2f(arg0, arg1, arg2);
    }
    if(argc == 4) {
        ok &= JS::ToNumber(cx, args.get(2), &arg2);
        ok &= JS::ToNumber(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->setUniformLocationWith3f(arg0, arg1, arg2, arg3);
    }
    if(argc == 5) {
        ok &= JS::ToNumber(cx, args.get(2), &arg2);
        ok &= JS::ToNumber(cx, args.get(3), &arg3);
        ok &= JS::ToNumber(cx, args.get(4), &arg4);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        cobj->setUniformLocationWith4f(arg0, arg1, arg2, arg3, arg4);
    }

    args.rval().setUndefined();
    return true;
    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 5);
    return false;
}

bool js_cocos2dx_CCGLProgram_setUniformLocationWithMatrixfvUnion(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}

bool js_cocos2dx_CCGLProgram_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if(argc != 2) {
        JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
        return false;
    }

    const char *arg0, *arg1;
    std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
    std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();

    GLProgram* ret = new (std::nothrow) GLProgram();
    ret->autorelease();

    ret->initWithFilenames(arg0, arg1);

    jsval jsret;
    do {
        if (ret) {
            js_proxy_t *p = jsb_get_native_proxy(ret);
            if (p) {
                jsret = OBJECT_TO_JSVAL(p->obj);
            } else {
                // create a new js obj of that class
                js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::GLProgram>(cx, ret);
                jsret = OBJECT_TO_JSVAL(proxy->obj);
            }
        } else {
            jsret = JSVAL_NULL;
        }
    } while (0);
    args.rval().set(jsret);
    return true;

}


bool js_cocos2dx_CCGLProgram_createWithString(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if(argc != 2) {
        JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
        return false;
    }

    const char *arg0, *arg1;
    std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
    std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();

    GLProgram* ret = new (std::nothrow) GLProgram();
    ret->initWithByteArrays(arg0, arg1);

    jsval jsret;
    do {
        if (ret) {
            js_proxy_t *p = jsb_get_native_proxy(ret);
            if (p) {
                jsret = OBJECT_TO_JSVAL(p->obj);
            } else {
                // create a new js obj of that class
                js_proxy_t *proxy = js_get_or_create_proxy<cocos2d::GLProgram>(cx, ret);
                jsret = OBJECT_TO_JSVAL(proxy->obj);
            }
        } else {
            jsret = JSVAL_NULL;
        }
    } while (0);
    args.rval().set(jsret);
    return true;

}

bool js_cocos2dx_CCGLProgram_getProgram(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::GLProgram* cobj = (cocos2d::GLProgram *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 0) {
        GLuint ret = cobj->getProgram();
        args.rval().set(UINT_TO_JSVAL((uint32_t)ret));
        return true;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_GLProgramState_setVertexAttribPointer(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_cocos2dx_GLProgramState_setVertexAttribPointer : wrong number of arguments: %d, was expecting %d", argc, 6);
    return false;
}

bool js_cocos2dx_GLProgramState_setUniformVec4(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t* proxy = jsb_get_js_proxy(obj);
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
    JS_ReportError(cx, "js_cocos2dx_GLProgramState_setUniformVec4 : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_cocos2dx_SpriteBatchNode_getDescendants(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::SpriteBatchNode* cobj = (cocos2d::SpriteBatchNode *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_SpriteBatchNode_getDescendants : Invalid Native Object");
    if (argc == 0) {
        std::vector<Sprite*> ret = cobj->getDescendants();

        JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, 0));
        size_t vSize = ret.size();
        JS::RootedValue jsret(cx);
        for (size_t i = 0; i < vSize; i++)
        {
            proxy = js_get_or_create_proxy<cocos2d::Sprite>(cx, ret[i]);
            jsret = OBJECT_TO_JSVAL(proxy->obj);
            JS_SetElement(cx, jsretArr, static_cast<uint32_t>(i), jsret);
        }
        args.rval().set(OBJECT_TO_JSVAL(jsretArr));
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_SpriteBatchNode_getDescendants : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_NodeGrid_setGrid(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::NodeGrid* cobj = (cocos2d::NodeGrid *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_NodeGrid_setGrid : Invalid Native Object");
    if (argc == 1) {
        cocos2d::GridBase* arg0;
        do {
            if(args.get(0).isNull()) { arg0 = nullptr; break;}
            if (!args.get(0).isObject()) { ok = false; break; }
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            proxy = jsb_get_js_proxy(tmpObj);
            arg0 = (cocos2d::GridBase*)(proxy ? proxy->ptr : nullptr);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_NodeGrid_setGrid : Error processing arguments");
        cobj->setGrid(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_NodeGrid_setGrid : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

// cc.PlistParser.getInstance()
bool js_PlistParser_getInstance(JSContext *cx, unsigned argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    __JSPlistDelegator* delegator = __JSPlistDelegator::getInstance();
    SAXParser* parser = delegator->getParser();

    jsval jsret;
    if (parser) {
        js_proxy_t *p = jsb_get_native_proxy(parser);
        if (p) {
            jsret = OBJECT_TO_JSVAL(p->obj);
        } else {
            // create a new js obj of that class
            js_proxy_t *proxy = js_get_or_create_proxy<SAXParser>(cx, parser);
            jsret = OBJECT_TO_JSVAL(proxy->obj);
        }
    } else {
        jsret = JSVAL_NULL;
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
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        std::string parsedStr = delegator->parseText(arg0);
        std::replace(parsedStr.begin(), parsedStr.end(), '\n', ' ');

        jsval strVal = std_string_to_jsval(cx, parsedStr);
        // create a new js obj of the parsed string
        JS::RootedValue outVal(cx);

        //JS_GetStringCharsZ was removed in SpiderMonkey 33
        JS::RootedString jsout(cx, strVal.toString());
        ok = JS_ParseJSON(cx, jsout, &outVal);

        if (ok)
            args.rval().set(outVal);
        else {
            args.rval().setUndefined();
            JS_ReportError(cx, "js_PlistParser_parse : parse error");
        }
        return true;
    }
    JS_ReportError(cx, "js_PlistParser_parse : wrong number of arguments: %d, was expecting %d", argc, 1);
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
        parser.parse(FileUtils::getInstance()->fullPathForFilename(path).c_str());
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

bool js_cocos2dx_Label_createWithTTF(JSContext *cx, uint32_t argc, jsval *vp)
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
    label->autorelease();

    if (ok)
    {
        auto proxy = js_get_or_create_proxy(cx, label);
        jsval jsret = OBJECT_TO_JSVAL(proxy->obj);
        args.rval().set(jsret);
        return true;
    }

    // else

    JS_ReportError(cx, "js_cocos2dx_Label_createWithTTF : wrong number of arguments");
    return false;
}

bool js_cocos2dx_Label_setTTFConfig(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_cocos2dx_Label_setTTFConfig : wrong number of arguments");
    return false;
}

bool js_cocos2dx_RenderTexture_saveToFile(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    cocos2d::RenderTexture* cobj = nullptr;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Image::Format arg1;
            ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
            if (!ok) { ok = true; break; }
            bool arg2;
            JS::RootedValue jsarg2(cx, args.get(2));
            arg2 = JS::ToBoolean(jsarg2);
            bool ret = cobj->saveToFile(arg0, arg1, arg2);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 4) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Image::Format arg1;
            ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
            if (!ok) { ok = true; break; }
            bool arg2;
            JS::RootedValue jsarg2(cx, args.get(2));
            arg2 = JS::ToBoolean(jsarg2);
            std::function<void (cocos2d::RenderTexture *, const std::basic_string<char> &)> arg3;
            do {
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, args.get(3)));
                auto lambda = [=](cocos2d::RenderTexture* larg0, const std::string& larg1) -> void {
                    jsval largv[2];
                    do {
                        if (larg0) {
                            js_proxy_t *jsProxy = js_get_or_create_proxy<cocos2d::RenderTexture>(cx, (cocos2d::RenderTexture*)larg0);
                            largv[0] = OBJECT_TO_JSVAL(jsProxy->obj);
                        } else {
                            largv[0] = JSVAL_NULL;
                        }
                    } while (0);
                    do {
                        largv[1] = std_string_to_jsval(cx, larg1);
                    } while (0);
                    JS::RootedValue rval(cx);
                    bool invokeOk = func->invoke(2, largv, &rval);
                    if (!invokeOk && JS_IsExceptionPending(cx)) {
                        JS_ReportPendingException(cx);
                    }
                };
                arg3 = lambda;
            } while(0)
                ;
            if (!ok) { ok = true; break; }
            bool ret = cobj->saveToFile(arg0, arg1, arg2, arg3);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
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
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool arg1;
            JS::RootedValue jsarg1(cx, args.get(1));
            arg1 = JS::ToBoolean(jsarg1);
            bool ret = cobj->saveToFile(arg0, arg1);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool arg1;
            JS::RootedValue jsarg1(cx, args.get(1));
            arg1 = JS::ToBoolean(jsarg1);
            std::function<void (cocos2d::RenderTexture *, const std::basic_string<char> &)> arg2;
            do {
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, args.get(2)));
                auto lambda = [=](cocos2d::RenderTexture* larg0, const std::string& larg1) -> void {
                    jsval largv[2];
                    do {
                        if (larg0) {
                            js_proxy_t *jsProxy = js_get_or_create_proxy<cocos2d::RenderTexture>(cx, (cocos2d::RenderTexture*)larg0);
                            largv[0] = OBJECT_TO_JSVAL(jsProxy->obj);
                        } else {
                            largv[0] = JSVAL_NULL;
                        }
                    } while (0);
                    do {
                        largv[1] = std_string_to_jsval(cx, larg1);
                    } while (0);
                    JS::RootedValue rval(cx);
                    bool invokeOk = func->invoke(2, largv, &rval);
                    if (!invokeOk && JS_IsExceptionPending(cx)) {
                        JS_ReportPendingException(cx);
                    }
                };
                arg2 = lambda;
            } while(0)
                ;
            if (!ok) { ok = true; break; }
            bool ret = cobj->saveToFile(arg0, arg1, arg2);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_cocos2dx_RenderTexture_saveToFile : wrong number of arguments");
    return false;
}

bool js_cocos2dx_Node_setAdditionalTransform(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    JS::RootedObject obj(cx);
    cocos2d::Node* cobj = nullptr;
    obj = args.thisv().toObjectOrNull();
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_cocos2dx_Node_setAdditionalTransform : wrong number of arguments");
    return false;
}

bool js_cocos2dx_ClippingNode_init(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::ClippingNode* cobj = (cocos2d::ClippingNode *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ClippingNode_init : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->init();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        cocos2d::Node* arg0;
        do {
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : nullptr);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_ClippingNode_init : Error processing arguments");
        bool ret = cobj->init(arg0);
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_ClippingNode_init : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

// EventKeyboard class bindings, need manual bind for transform key codes

JSClass  *jsb_cocos2d_EventKeyboard_class;
JSObject *jsb_cocos2d_EventKeyboard_prototype;

bool js_cocos2dx_EventKeyboard_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    cocos2d::EventKeyboard::KeyCode arg0;
    ScriptingCore *core = ScriptingCore::getInstance();
    JS::RootedValue retVal(cx);
    core->executeFunctionWithOwner(OBJECT_TO_JSVAL(core->getGlobalObject()), "parseKeyCode", args, &retVal);
    ok &= jsval_to_int32(cx, retVal, (int32_t *)&arg0);

    bool arg1;
    JS::RootedValue jsarg1(cx, args.get(1));
    arg1 = JS::ToBoolean(jsarg1);

    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_EventKeyboard_constructor : Error processing arguments");

    cocos2d::EventKeyboard* cobj = new (std::nothrow) cocos2d::EventKeyboard(arg0, arg1);
    cocos2d::Ref *_ccobj = dynamic_cast<cocos2d::Ref *>(cobj);
    if (_ccobj) {
        _ccobj->autorelease();
    }
    TypeTest<cocos2d::EventKeyboard> t;
    js_type_class_t *typeClass = nullptr;
    std::string typeName = t.s_name();
    auto typeMapIter = _js_global_type_map.find(typeName);
    CCASSERT(typeMapIter != _js_global_type_map.end(), "Can't find the class type!");
    typeClass = typeMapIter->second;
    CCASSERT(typeClass, "The value is null.");
    JS::RootedObject proto(cx, typeClass->proto.ref());
    JS::RootedObject parentProto(cx, typeClass->parentProto.ref());
    JS::RootedObject obj(cx, JS_NewObject(cx, typeClass->jsclass, proto, parentProto));
    JS::RootedValue objVal(cx, OBJECT_TO_JSVAL(obj));
    args.rval().set(objVal);
    // link the native object with the javascript object
    js_proxy_t* p = jsb_new_proxy(cobj, obj);
    JS::AddNamedObjectRoot(cx, &p->obj, "cocos2d::EventKeyboard");
    return true;
}


extern JSObject *jsb_cocos2d_Event_prototype;

static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().set(BOOLEAN_TO_JSVAL(true));
    return true;
}

void js_register_cocos2dx_EventKeyboard(JSContext *cx, JS::HandleObject global) {
    jsb_cocos2d_EventKeyboard_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_cocos2d_EventKeyboard_class->name = "EventKeyboard";
    jsb_cocos2d_EventKeyboard_class->addProperty = JS_PropertyStub;
    jsb_cocos2d_EventKeyboard_class->delProperty = JS_DeletePropertyStub;
    jsb_cocos2d_EventKeyboard_class->getProperty = JS_PropertyStub;
    jsb_cocos2d_EventKeyboard_class->setProperty = JS_StrictPropertyStub;
    jsb_cocos2d_EventKeyboard_class->enumerate = JS_EnumerateStub;
    jsb_cocos2d_EventKeyboard_class->resolve = JS_ResolveStub;
    jsb_cocos2d_EventKeyboard_class->convert = JS_ConvertStub;
    jsb_cocos2d_EventKeyboard_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PSG("__nativeObj", js_is_native_obj, JSPROP_ENUMERATE | JSPROP_PERMANENT),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = nullptr;

    JS::RootedObject parentProto(cx, jsb_cocos2d_Event_prototype);
    jsb_cocos2d_EventKeyboard_prototype = JS_InitClass(
                                                       cx, global,
                                                       parentProto,
                                                       jsb_cocos2d_EventKeyboard_class,
                                                       js_cocos2dx_EventKeyboard_constructor, 0, // constructor
                                                       properties,
                                                       funcs,
                                                       nullptr, // no static properties
                                                       st_funcs);

    // add the proto and JSClass to the type->js info hash table
    JS::RootedObject proto(cx, jsb_cocos2d_EventKeyboard_prototype);
    jsb_register_class<cocos2d::EventKeyboard>(cx, jsb_cocos2d_EventKeyboard_class, proto, parentProto);
}

// console.log("Message");
bool js_console_log(JSContext *cx, uint32_t argc, jsval *vp)
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

    return false;
}

void get_or_create_js_obj(JSContext* cx, JS::HandleObject obj, const std::string &name, JS::MutableHandleObject jsObj)
{
    JS::RootedValue nsval(cx);
    JS_GetProperty(cx, obj, name.c_str(), &nsval);
    if (nsval == JSVAL_VOID) {
        jsObj.set(JS_NewObject(cx, nullptr, JS::NullPtr(), JS::NullPtr()));
        nsval = OBJECT_TO_JSVAL(jsObj);
        JS_SetProperty(cx, obj, name.c_str(), nsval);
    } else {
        jsObj.set(nsval.toObjectOrNull());
    }
}

JSClass  *jsb_cocos2d_PolygonInfo_class;
JSObject *jsb_cocos2d_PolygonInfo_prototype;

bool js_cocos2dx_PolygonInfo_getArea(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_PolygonInfo_getArea : Invalid Native Object");
    if (argc == 0)
    {
        const float ret = cobj->getArea();
        jsval jsret = JSVAL_NULL;
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_PolygonInfo_getArea : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_PolygonInfo_getTrianglesCount(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_PolygonInfo_getTrianglesCount : Invalid Native Object");
    if (argc == 0)
    {
        const unsigned int ret = cobj->getTrianglesCount();
        jsval jsret = JSVAL_NULL;
        jsret = uint32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_PolygonInfo_getTrianglesCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_PolygonInfo_getVertCount(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_PolygonInfo_getVertCount : Invalid Native Object");
    if (argc == 0)
    {
        const unsigned int ret = cobj->getVertCount();
        jsval jsret = JSVAL_NULL;
        jsret = uint32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_PolygonInfo_getVertCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

// PolygonInfo.rect
bool js_get_PolygonInfo_rect(JSContext* cx, uint32_t argc, jsval* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    if (cobj)
    {
        jsval ret = ccrect_to_jsval(cx, cobj->rect);

        if (ret != JSVAL_NULL)
        {
            args.rval().set(ret);
            return true;
        }
        CCLOGERROR("js_get_PolygonInfo_rect : Fail to retrieve property from PolygonInfo.");
        return false;
    }
    JS_ReportError(cx, "js_get_PolygonInfo_rect : Invalid native object.");
    return false;
}
bool js_set_PolygonInfo_rect(JSContext* cx, uint32_t argc, jsval* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    if (cobj)
    {
        JS::RootedValue jsrect(cx, args.get(0));
        jsval_to_ccrect(cx, jsrect, &cobj->rect);
        return true;
    }
    JS_ReportError(cx, "js_set_PolygonInfo_rect : Invalid native object.");
    return false;
}

// PolygonInfo.filename
bool js_get_PolygonInfo_filename(JSContext* cx, uint32_t argc, jsval* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    if (cobj)
    {
        jsval ret = std_string_to_jsval(cx, cobj->filename);

        if (ret != JSVAL_NULL)
        {
            args.rval().set(ret);
            return true;
        }
        CCLOGERROR("js_get_PolygonInfo_filename : Fail to retrieve property from PolygonInfo.");
        return false;
    }
    JS_ReportError(cx, "js_get_PolygonInfo_filename : Invalid native object.");
    return false;
}
bool js_set_PolygonInfo_filename(JSContext* cx, uint32_t argc, jsval* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::PolygonInfo* cobj = (cocos2d::PolygonInfo *)(proxy ? proxy->ptr : nullptr);
    if (cobj)
    {
        JS::RootedValue jsstr(cx, args.get(0));
        jsval_to_std_string(cx, jsstr, &cobj->filename);
        return true;
    }
    JS_ReportError(cx, "js_set_PolygonInfo_filename : Invalid native object.");
    return false;
}

bool js_cocos2dx_PolygonInfo_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::PolygonInfo* cobj = new (std::nothrow) cocos2d::PolygonInfo();
    TypeTest<cocos2d::PolygonInfo> t;
    js_type_class_t *typeClass = nullptr;
    std::string typeName = t.s_name();
    auto typeMapIter = _js_global_type_map.find(typeName);
    CCASSERT(typeMapIter != _js_global_type_map.end(), "Can't find the class type!");
    typeClass = typeMapIter->second;
    CCASSERT(typeClass, "The value is null.");

    JS::RootedObject proto(cx, typeClass->proto.ref());
    JS::RootedObject parent(cx, typeClass->parentProto.ref());
    JS::RootedObject obj(cx, JS_NewObject(cx, typeClass->jsclass, proto, parent));
    args.rval().set(OBJECT_TO_JSVAL(obj));
    // link the native object with the javascript object
    jsb_new_proxy(cobj, obj);
    if (JS_HasProperty(cx, obj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    return true;
}

void js_cocos2d_PolygonInfo_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (PolygonInfo)", obj);

    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedObject jsobj(cx, obj);
    auto proxy = jsb_get_js_proxy(jsobj);
    if (proxy)
    {
        auto nobj = static_cast<cocos2d::PolygonInfo *>(proxy->ptr);
        if (nobj)
            delete nobj;

        jsb_remove_proxy(proxy);
    }
}

void js_register_cocos2dx_PolygonInfo(JSContext *cx, JS::HandleObject global)
{
    jsb_cocos2d_PolygonInfo_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_cocos2d_PolygonInfo_class->name = "PolygonInfo";
    jsb_cocos2d_PolygonInfo_class->addProperty = JS_PropertyStub;
    jsb_cocos2d_PolygonInfo_class->delProperty = JS_DeletePropertyStub;
    jsb_cocos2d_PolygonInfo_class->getProperty = JS_PropertyStub;
    jsb_cocos2d_PolygonInfo_class->setProperty = JS_StrictPropertyStub;
    jsb_cocos2d_PolygonInfo_class->enumerate = JS_EnumerateStub;
    jsb_cocos2d_PolygonInfo_class->resolve = JS_ResolveStub;
    jsb_cocos2d_PolygonInfo_class->convert = JS_ConvertStub;
    jsb_cocos2d_PolygonInfo_class->finalize = js_cocos2d_PolygonInfo_finalize;
    jsb_cocos2d_PolygonInfo_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] =
    {
        JS_PSG("__nativeObj", js_is_native_obj, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("rect", js_get_PolygonInfo_rect, js_set_PolygonInfo_rect, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("filename", js_get_PolygonInfo_filename, js_set_PolygonInfo_filename, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] =
    {
        JS_FN("getArea", js_cocos2dx_PolygonInfo_getArea, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTrianglesCount", js_cocos2dx_PolygonInfo_getTrianglesCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getVertCount", js_cocos2dx_PolygonInfo_getVertCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = nullptr;

    jsb_cocos2d_PolygonInfo_prototype = JS_InitClass(
                                                     cx, global,
                                                     JS::NullPtr(), // parent proto
                                                     jsb_cocos2d_PolygonInfo_class,
                                                     js_cocos2dx_PolygonInfo_constructor, 0, // constructor
                                                     properties,
                                                     funcs,
                                                     nullptr, // no static properties
                                                     st_funcs);

    // add the proto and JSClass to the type->js info hash table
    JS::RootedObject proto(cx, jsb_cocos2d_PolygonInfo_prototype);
    jsb_register_class<cocos2d::PolygonInfo>(cx, jsb_cocos2d_PolygonInfo_class, proto, JS::NullPtr());
}

bool js_cocos2dx_ComponentJS_getScriptObject(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cocos2d::ComponentJS* cobj = (cocos2d::ComponentJS *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_ComponentJS_getScriptObject : Invalid Native Object");
    if (argc == 0) {
        JS::RootedObject ret(cx, static_cast<JSObject*>(cobj->getScriptObject()));
        jsval jsret = OBJECT_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_cocos2dx_ComponentJS_getScriptObject : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void register_cocos2dx_js_core(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject ccObj(cx);
    JS::RootedObject jsbObj(cx);
    JS::RootedValue tmpVal(cx);
    JS::RootedObject tmpObj(cx);
    get_or_create_js_obj(cx, global, "cc", &ccObj);
    get_or_create_js_obj(cx, global, "jsb", &jsbObj);

    js_register_cocos2dx_PolygonInfo(cx, jsbObj);

    JS_GetProperty(cx, ccObj, "PlistParser", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "getInstance", js_PlistParser_getInstance, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS::RootedObject proto(cx, jsb_cocos2d_SAXParser_prototype);
    JS_DefineFunction(cx, proto, "parse", js_PlistParser_parse, 1, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "Label", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "createWithTTF", js_cocos2dx_Label_createWithTTF, 4, JSPROP_READONLY | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Label_prototype);
    JS_DefineFunction(cx, tmpObj, "setTTFConfig", js_cocos2dx_Label_setTTFConfig, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_NodeGrid_prototype);
    JS_DefineFunction(cx, tmpObj, "setGrid", js_cocos2dx_NodeGrid_setGrid, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Node_prototype);
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

    tmpObj.set(jsb_cocos2d_EventListener_prototype);
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Touch_prototype);
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_EventTouch_prototype);
    JS_DefineFunction(cx, tmpObj, "getTouches", js_cocos2dx_EventTouch_getTouches, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setTouches", js_cocos2dx_EventTouch_setTouches, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_GLProgram_prototype);
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setUniformLocationF32", js_cocos2dx_CCGLProgram_setUniformLocationWith4f, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "getProgram", js_cocos2dx_CCGLProgram_getProgram, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setUniformLocationWithMatrixfvUnion", js_cocos2dx_CCGLProgram_setUniformLocationWithMatrixfvUnion, 4, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_GLProgramState_prototype);
    JS_DefineFunction(cx, tmpObj, "setVertexAttribPointer", js_cocos2dx_GLProgramState_setVertexAttribPointer, 6, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setUniformVec4", js_cocos2dx_GLProgramState_setUniformVec4, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Scheduler_prototype);
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

    tmpObj.set(jsb_cocos2d_ActionManager_prototype);
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_TMXLayer_prototype);
    JS_DefineFunction(cx, tmpObj, "getTileFlagsAt", js_cocos2dx_CCTMXLayer_getTileFlagsAt, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_DrawNode_prototype);
    JS_DefineFunction(cx, tmpObj, "drawPoly", js_cocos2dx_CCDrawNode_drawPolygon, 4, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Texture2D_prototype);
    JS_DefineFunction(cx, tmpObj, "setTexParameters", js_cocos2dx_CCTexture2D_setTexParameters, 4, JSPROP_ENUMERATE  | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Menu_prototype);
    JS_DefineFunction(cx, tmpObj, "alignItemsInRows", js_cocos2dx_CCMenu_alignItemsInRows, 1, JSPROP_ENUMERATE  | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "alignItemsInColumns", js_cocos2dx_CCMenu_alignItemsInColumns, 1, JSPROP_ENUMERATE  | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Layer_prototype);
    JS_DefineFunction(cx, tmpObj, "init", js_cocos2dx_CCLayer_init, 0, JSPROP_ENUMERATE  | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_FileUtils_prototype);
    JS_DefineFunction(cx, tmpObj, "setSearchResolutionsOrder", js_cocos2dx_CCFileUtils_setSearchResolutionsOrder, 1, JSPROP_PERMANENT );
    JS_DefineFunction(cx, tmpObj, "setSearchPaths", js_cocos2dx_CCFileUtils_setSearchPaths, 1, JSPROP_PERMANENT );
    JS_DefineFunction(cx, tmpObj, "getSearchPaths", js_cocos2dx_CCFileUtils_getSearchPaths, 0, JSPROP_PERMANENT );
    JS_DefineFunction(cx, tmpObj, "getSearchResolutionsOrder", js_cocos2dx_CCFileUtils_getSearchResolutionsOrder, 0, JSPROP_PERMANENT );
    JS_DefineFunction(cx, tmpObj, "createDictionaryWithContentsOfFile", js_cocos2dx_FileUtils_createDictionaryWithContentsOfFile, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "getDataFromFile", js_cocos2dx_CCFileUtils_getDataFromFile, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "writeDataToFile", js_cocos2dx_CCFileUtils_writeDataToFile, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

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

    JS_GetProperty(cx, ccObj, "EventListenerFocus", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_EventListenerFocus_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "BezierBy", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCBezierBy_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_BezierBy_prototype);
    JS_DefineFunction(cx, tmpObj, "initWithDuration", JSB_CCBezierBy_initWithDuration, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "BezierTo", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCBezierTo_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_BezierTo_prototype);
    JS_DefineFunction(cx, tmpObj, "initWithDuration", JSB_CCBezierTo_initWithDuration, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "CardinalSplineBy", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCCardinalSplineBy_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "CardinalSplineTo", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCCardinalSplineTo_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_CardinalSplineTo_prototype);
    JS_DefineFunction(cx, tmpObj, "initWithDuration", js_cocos2dx_CardinalSplineTo_initWithDuration, 3, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "CatmullRomBy", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCCatmullRomBy_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_CatmullRomBy_prototype);
    JS_DefineFunction(cx, tmpObj, "initWithDuration", JSB_CatmullRomBy_initWithDuration, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "CatmullRomTo", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", JSB_CCCatmullRomTo_actionWithDuration, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_CatmullRomTo_prototype);
    JS_DefineFunction(cx, tmpObj, "initWithDuration", JSB_CatmullRomBy_initWithDuration, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "Sprite", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "_create", js_cocos2dx_Sprite_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_Sprite_prototype);
    JS_DefineFunction(cx, tmpObj, "initWithPolygon", js_cocos2dx_Sprite_initWithPolygon, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setPolygonInfo", js_cocos2dx_Sprite_setPolygonInfo, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "textureLoaded", js_cocos2dx_Sprite_textureLoaded, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_SpriteBatchNode_prototype);
    JS_DefineFunction(cx, tmpObj, "getDescendants", js_cocos2dx_SpriteBatchNode_getDescendants, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Action_prototype);
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_Animation_prototype);
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_SpriteFrame_prototype);
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_MenuItem_prototype);
    JS_DefineFunction(cx, tmpObj, "setCallback", js_cocos2dx_MenuItem_setCallback, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_TMXLayer_prototype);
    JS_DefineFunction(cx, tmpObj, "getTiles", js_cocos2dx_CCTMXLayer_getTiles, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_ActionInterval_prototype);
    JS_DefineFunction(cx, tmpObj, "repeat", js_cocos2dx_ActionInterval_repeat, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "repeatForever", js_cocos2dx_ActionInterval_repeatForever, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "_speed", js_cocos2dx_ActionInterval_speed, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "easing", js_cocos2dx_ActionInterval_easing, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_RenderTexture_prototype);
    JS_DefineFunction(cx, tmpObj, "saveToFile", js_cocos2dx_RenderTexture_saveToFile, 4, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "Menu", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "_create", js_cocos2dx_CCMenu_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_GetProperty(cx, ccObj, "MenuItemToggle", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "_create", js_cocos2dx_CCMenuItemToggle_create, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_GetProperty(cx, ccObj, "Sequence", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_cocos2dx_CCSequence_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_GetProperty(cx, ccObj, "Spawn", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_cocos2dx_CCSpawn_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_Scene_prototype);
    JS_DefineFunction(cx, tmpObj, "init", js_cocos2dx_CCScene_init, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE);
    JS_GetProperty(cx, ccObj, "LayerMultiplex", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_cocos2dx_CCLayerMultiplex_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "CallFunc", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_callFunc, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_CallFuncN_prototype);
    JS_DefineFunction(cx, tmpObj, "initWithFunction", js_cocos2dx_CallFunc_initWithFunction, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "GLProgram", &tmpVal);
    tmpObj = tmpVal.toObjectOrNull();
    JS_DefineFunction(cx, tmpObj, "create", js_cocos2dx_CCGLProgram_create, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "createWithString", js_cocos2dx_CCGLProgram_createWithString, 1, JSPROP_READONLY | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_ClippingNode_prototype);
    JS_DefineFunction(cx, tmpObj, "init", js_cocos2dx_ClippingNode_init, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_cocos2d_ComponentJS_prototype);
    JS_DefineFunction(cx, tmpObj, "getScriptObject", js_cocos2dx_ComponentJS_getScriptObject, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_DefineFunction(cx, ccObj, "glEnableVertexAttribs", js_cocos2dx_ccGLEnableVertexAttribs, 1, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_DefineFunction(cx, ccObj, "registerTargetedDelegate", js_cocos2dx_JSTouchDelegate_registerTargetedDelegate, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, ccObj, "registerStandardDelegate", js_cocos2dx_JSTouchDelegate_registerStandardDelegate, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, ccObj, "unregisterTouchDelegate", js_cocos2dx_JSTouchDelegate_unregisterTouchDelegate, 1, JSPROP_READONLY | JSPROP_PERMANENT);

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

