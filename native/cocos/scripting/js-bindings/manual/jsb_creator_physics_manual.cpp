/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#include "jsb_creator_physics_manual.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/jsb_box2d_manual.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_creator_physics_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_box2d_auto.hpp"

#include "editor-support/creator/physics/CCPhysicsContactListener.h"
#include "editor-support/creator/physics/CCPhysicsUtils.h"
#include "editor-support/creator/physics/CCPhysicsAABBQueryCallback.h"
#include "editor-support/creator/physics/CCPhysicsRayCastCallback.h"
#include "editor-support/creator/physics/CCPhysicsContactImpulse.h"

#include "editor-support/spine/spine-cocos2dx.h"

static bool js_creator_PhysicsContactListener_setPreSolve(se::State& s)
{
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (b2Contact *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](b2Contact* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= native_ptr_to_rooted_seval<b2Contact>(larg0, __jsb_b2Contact_class, &args[0]);

                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setPreSolve(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsContactListener_setPreSolve)

static bool js_creator_PhysicsContactListener_setPostSolve(se::State& s)
{
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (b2Contact *, const creator::PhysicsContactImpulse *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](b2Contact* larg0, const creator::PhysicsContactImpulse* larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);

                    bool fromCache = false;
                    ok &= native_ptr_to_rooted_seval<b2Contact>(larg0, __jsb_b2Contact_class, &args[0]);
                    ok &= native_ptr_to_seval<creator::PhysicsContactImpulse>((creator::PhysicsContactImpulse*)larg1, __jsb_creator_PhysicsContactImpulse_class, &args[1], &fromCache);
                    if (!fromCache)
                    {
                        jsThis.toObject()->attachObject(args[1].toObject());
                    }
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();

                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setPostSolve(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsContactListener_setPostSolve)

static bool js_creator_PhysicsContactListener_setBeginContact(se::State& s)
{
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (b2Contact *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](b2Contact* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);

                    /*
                     The order of callback is:
                        * setBeginContact
                        * setPreSolve
                        * setPostSolve
                        * setEndContact
                     */
                    ok &= native_ptr_to_rooted_seval<b2Contact>(larg0, __jsb_b2Contact_class, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setBeginContact(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsContactListener_setBeginContact)

static bool js_creator_PhysicsContactListener_setEndContact(se::State& s)
{
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (b2Contact *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](b2Contact* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= native_ptr_to_rooted_seval<b2Contact>(larg0, __jsb_b2Contact_class, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setEndContact(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsContactListener_setEndContact)

static bool js_creator_PhysicsAABBQueryCallback_getFixtures(se::State& s)
{
    creator::PhysicsAABBQueryCallback* cobj = (creator::PhysicsAABBQueryCallback *)s.nativeThisObject();
    const auto& ret = cobj->getFixtures();
    array_of_b2Fixture_to_seval(ret, &s.rval());
    return true;
}
SE_BIND_FUNC(js_creator_PhysicsAABBQueryCallback_getFixtures)

static bool js_creator_PhysicsRayCastCallback_getFixtures(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback *)s.nativeThisObject();
    const auto& ret = cobj->getFixtures();
    array_of_b2Fixture_to_seval(ret, &s.rval());
    return true;
}
SE_BIND_FUNC(js_creator_PhysicsRayCastCallback_getFixtures)

static bool js_creator_PhysicsRayCastCallback_getPoints(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback *)s.nativeThisObject();
    const auto& ret = cobj->getPoints();
    array_of_b2Vec2_to_seval(ret, &s.rval());
    return true;
}
SE_BIND_FUNC(js_creator_PhysicsRayCastCallback_getPoints)

static bool js_creator_PhysicsRayCastCallback_getNormals(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback *)s.nativeThisObject();
    const auto& ret = cobj->getNormals();
    array_of_b2Vec2_to_seval(ret, &s.rval());
    return true;
}
SE_BIND_FUNC(js_creator_PhysicsRayCastCallback_getNormals)


bool register_all_creator_physics_manual(se::Object* obj)
{
    // Physics

    __jsb_creator_PhysicsContactListener_proto->defineFunction("setPreSolve", _SE(js_creator_PhysicsContactListener_setPreSolve));
    __jsb_creator_PhysicsContactListener_proto->defineFunction("setPostSolve", _SE(js_creator_PhysicsContactListener_setPostSolve));
    __jsb_creator_PhysicsContactListener_proto->defineFunction("setBeginContact", _SE(js_creator_PhysicsContactListener_setBeginContact));
    __jsb_creator_PhysicsContactListener_proto->defineFunction("setEndContact", _SE(js_creator_PhysicsContactListener_setEndContact));

    __jsb_creator_PhysicsAABBQueryCallback_proto->defineFunction("getFixtures", _SE(js_creator_PhysicsAABBQueryCallback_getFixtures));

    __jsb_creator_PhysicsRayCastCallback_proto->defineFunction("getFixtures", _SE(js_creator_PhysicsRayCastCallback_getFixtures));
    __jsb_creator_PhysicsRayCastCallback_proto->defineFunction("getPoints", _SE(js_creator_PhysicsRayCastCallback_getPoints));
    __jsb_creator_PhysicsRayCastCallback_proto->defineFunction("getNormals", _SE(js_creator_PhysicsRayCastCallback_getNormals));

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

