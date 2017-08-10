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

#include "jsapi.h"
#include "jsfriendapi.h"
#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/js_bindings_config.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"

#include "scripting/js-bindings/manual/js_manual_conversions.h"

#include "scripting/js-bindings/manual/creator/js_bindings_creator_manual.h"
#include "scripting/js-bindings/manual/box2d/js_bindings_box2d_manual.h"

#include "scripting/js-bindings/auto/jsb_creator_auto.hpp"

#include "editor-support/creator/physics/CCPhysicsContactListener.h"
#include "editor-support/creator/physics/CCPhysicsUtils.h"
#include "editor-support/creator/physics/CCPhysicsAABBQueryCallback.h"
#include "editor-support/creator/physics/CCPhysicsRayCastCallback.h"
#include "editor-support/creator/physics/CCPhysicsContactImpulse.h"

USING_NS_CC_EXT;

#pragma mark - conversions

bool js_creator_PhysicsContactListener_setEndContact(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsContactListener_setEndContact : Invalid Native Object");
    if (argc == 1) {
        std::function<void (b2Contact *)> arg0;
        do {
            if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
            {
                JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
                JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
                auto lambda = [=](b2Contact* larg0) -> void {
                    JS::RootedValue largv(cx);
                    if (larg0) {
                        JS::RootedObject arg0Obj(cx);
                        js_get_or_create_jsobject<b2Contact>(cx, (b2Contact*)larg0, &arg0Obj);
                        largv = JS::ObjectOrNullValue(arg0Obj);
                    }
                    JS::RootedValue rval(cx);
                    JS::HandleValueArray largs(largv);
                    bool succeed = func->invoke(largs, &rval);
                    if (!succeed && JS_IsExceptionPending(cx)) {
                        handlePendingException(cx);
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(0)
            ;
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactListener_setEndContact : Error processing arguments");
        cobj->setEndContact(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsContactListener_setEndContact : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsContactListener_setBeginContact(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsContactListener_setBeginContact : Invalid Native Object");
    if (argc == 1) {
        std::function<void (b2Contact *)> arg0;
        do {
            if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
            {
                JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
                JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
                auto lambda = [=](b2Contact* larg0) -> void {
                    JS::RootedValue largv(cx);
                    if (larg0) {
                        // box2d will reuse cached memory, need first remove old proxy when create new jsobject
                        auto larg0Proxy = jsb_get_native_proxy(larg0);
                        if (larg0Proxy) {
                            jsb_remove_proxy(larg0Proxy);
                        }
                        JS::RootedObject arg0Obj(cx);
                        js_get_or_create_jsobject<b2Contact>(cx, (b2Contact*)larg0, &arg0Obj);
                        largv = JS::ObjectOrNullValue(arg0Obj);
                    }
                    JS::RootedValue rval(cx);
                    JS::HandleValueArray largs(largv);
                    bool succeed = func->invoke(largs, &rval);
                    if (!succeed && JS_IsExceptionPending(cx)) {
                        handlePendingException(cx);
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(0)
            ;
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactListener_setBeginContact : Error processing arguments");
        cobj->setBeginContact(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsContactListener_setBeginContact : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_creator_PhysicsContactListener_setPreSolve(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsContactListener_setPreSolve : Invalid Native Object");
    if (argc == 1) {
        std::function<void (b2Contact *)> arg0;
        do {
            if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
            {
                JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
                JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
                auto lambda = [=](b2Contact* larg0) -> void {
                    JS::RootedValue largv(cx);
                    if (larg0) {
                        JS::RootedObject arg0Obj(cx);
                        js_get_or_create_jsobject<b2Contact>(cx, (b2Contact*)larg0, &arg0Obj);
                        largv = JS::ObjectOrNullValue(arg0Obj);
                    }
                    JS::RootedValue rval(cx);
                    JS::HandleValueArray largs(largv);
                    bool succeed = func->invoke(largs, &rval);
                    if (!succeed && JS_IsExceptionPending(cx)) {
                        handlePendingException(cx);
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(0)
            ;
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactListener_setPreSolve : Error processing arguments");
        cobj->setPreSolve(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsContactListener_setPreSolve : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_creator_PhysicsContactListener_setPostSolve(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsContactListener_setPostSolve : Invalid Native Object");
    if (argc == 1) {
        std::function<void (b2Contact *, const creator::PhysicsContactImpulse *)> arg0;
        do {
            if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
            {
                JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
                JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
                auto lambda = [=](b2Contact* larg0, const creator::PhysicsContactImpulse* larg1) -> void {
                    JS::AutoValueVector largv(cx);
                    if (larg0) {
                        JS::RootedObject arg0Obj(cx);
                        js_get_or_create_jsobject<b2Contact>(cx, (b2Contact*)larg0, &arg0Obj);
                        largv.append(JS::ObjectOrNullValue(arg0Obj));
                    } else {
                        largv.append(JS::NullHandleValue);
                    }
                    if (larg1) {
                        JS::RootedObject arg1Obj(cx);
                        js_get_or_create_jsobject<creator::PhysicsContactImpulse>(cx, (creator::PhysicsContactImpulse*)larg1, &arg1Obj);
                        largv.append(JS::ObjectOrNullValue(arg1Obj));
                    } else {
                        largv.append(JS::NullValue());
                    }
                    JS::RootedValue rval(cx);
                    JS::HandleValueArray largs(largv);
                    bool succeed = func->invoke(largs, &rval);
                    if (!succeed && JS_IsExceptionPending(cx)) {
                        handlePendingException(cx);
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(0)
            ;
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactListener_setPostSolve : Error processing arguments");
        cobj->setPostSolve(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsContactListener_setPostSolve : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_creator_PhysicsAABBQueryCallback_getFixtures(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsAABBQueryCallback* cobj = (creator::PhysicsAABBQueryCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsAABBQueryCallback_getFixtures : Invalid Native Object");
    if (argc == 0) {
        std::vector<b2Fixture *> ret = cobj->getFixtures();
        
        JS::RootedValue jsret(cx);
        array_of_b2Fixture_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsAABBQueryCallback_getFixtures : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_creator_PhysicsRayCastCallback_getFixtures(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsRayCastCallback_getFixtures : Invalid Native Object");
    if (argc == 0) {
        std::vector<b2Fixture *> ret = cobj->getFixtures();
       
        JS::RootedValue jsret(cx);
        array_of_b2Fixture_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsRayCastCallback_getFixtures : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_creator_PhysicsRayCastCallback_getPoints(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsRayCastCallback_getPoints : Invalid Native Object");
    if (argc == 0) {
        std::vector<b2Vec2, std::allocator<b2Vec2> >& ret = cobj->getPoints();
        
        JS::RootedValue jsret(cx);
        array_of_b2Vec2_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsRayCastCallback_getPoints : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsRayCastCallback_getNormals(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsRayCastCallback_getNormals : Invalid Native Object");
    if (argc == 0) {
        std::vector<b2Vec2, std::allocator<b2Vec2> >& ret = cobj->getNormals();
        
        JS::RootedValue jsret(cx);
        array_of_b2Vec2_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsRayCastCallback_getNormals : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void register_all_creatorclasses_manual(JSContext* cx, JS::HandleObject obj) {
    JS::RootedObject tmpObj(cx);
    
    tmpObj.set(jsb_creator_PhysicsContactListener_prototype->get());
    JS_DefineFunction(cx, tmpObj, "setPreSolve", js_creator_PhysicsContactListener_setPreSolve, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setPostSolve", js_creator_PhysicsContactListener_setPostSolve, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setBeginContact", js_creator_PhysicsContactListener_setBeginContact, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "setEndContact", js_creator_PhysicsContactListener_setEndContact, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    tmpObj.set(jsb_creator_PhysicsAABBQueryCallback_prototype->get());
    JS_DefineFunction(cx, tmpObj, "getFixtures", js_creator_PhysicsAABBQueryCallback_getFixtures, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_creator_PhysicsRayCastCallback_prototype->get());
    JS_DefineFunction(cx, tmpObj, "getFixtures", js_creator_PhysicsRayCastCallback_getFixtures, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "getPoints", js_creator_PhysicsRayCastCallback_getPoints, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "getNormals", js_creator_PhysicsRayCastCallback_getNormals, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
}

