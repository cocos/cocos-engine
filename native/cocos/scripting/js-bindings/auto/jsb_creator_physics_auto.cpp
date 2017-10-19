#include "scripting/js-bindings/auto/jsb_creator_physics_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "editor-support/creator/physics/CCPhysicsDebugDraw.h"
#include "editor-support/creator/physics/CCPhysicsUtils.h"
#include "editor-support/creator/physics/CCPhysicsContactListener.h"
#include "editor-support/creator/physics/CCPhysicsAABBQueryCallback.h"
#include "editor-support/creator/physics/CCPhysicsRayCastCallback.h"
#include "editor-support/creator/physics/CCPhysicsWorldManifoldWrapper.h"
#include "editor-support/creator/physics/CCPhysicsContactImpulse.h"

se::Object* __jsb_creator_PhysicsDebugDraw_proto = nullptr;
se::Class* __jsb_creator_PhysicsDebugDraw_class = nullptr;

static bool js_creator_physics_PhysicsDebugDraw_getDrawer(se::State& s)
{
    creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsDebugDraw_getDrawer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        creator::GraphicsNode* result = cobj->getDrawer();
        ok &= native_ptr_to_seval<creator::GraphicsNode>((creator::GraphicsNode*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsDebugDraw_getDrawer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsDebugDraw_getDrawer)

static bool js_creator_physics_PhysicsDebugDraw_ClearDraw(se::State& s)
{
    creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsDebugDraw_ClearDraw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ClearDraw();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsDebugDraw_ClearDraw)

static bool js_creator_physics_PhysicsDebugDraw_AddDrawerToNode(se::State& s)
{
    creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsDebugDraw_AddDrawerToNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsDebugDraw_AddDrawerToNode : Error processing arguments");
        cobj->AddDrawerToNode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsDebugDraw_AddDrawerToNode)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsDebugDraw_finalize)

static bool js_creator_physics_PhysicsDebugDraw_constructor(se::State& s)
{
    creator::PhysicsDebugDraw* cobj = new (std::nothrow) creator::PhysicsDebugDraw();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_physics_PhysicsDebugDraw_constructor, __jsb_creator_PhysicsDebugDraw_class, js_creator_PhysicsDebugDraw_finalize)



extern se::Object* __jsb_b2Draw_proto;

static bool js_creator_PhysicsDebugDraw_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::PhysicsDebugDraw)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsDebugDraw_finalize)

bool js_register_creator_physics_PhysicsDebugDraw(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsDebugDraw", obj, __jsb_b2Draw_proto, _SE(js_creator_physics_PhysicsDebugDraw_constructor));

    cls->defineFunction("getDrawer", _SE(js_creator_physics_PhysicsDebugDraw_getDrawer));
    cls->defineFunction("ClearDraw", _SE(js_creator_physics_PhysicsDebugDraw_ClearDraw));
    cls->defineFunction("AddDrawerToNode", _SE(js_creator_physics_PhysicsDebugDraw_AddDrawerToNode));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsDebugDraw_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsDebugDraw>(cls);

    __jsb_creator_PhysicsDebugDraw_proto = cls->getProto();
    __jsb_creator_PhysicsDebugDraw_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsWorldManifoldWrapper_proto = nullptr;
se::Class* __jsb_creator_PhysicsWorldManifoldWrapper_class = nullptr;

static bool js_creator_physics_PhysicsWorldManifoldWrapper_getSeparation(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getSeparation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getSeparation : Error processing arguments");
        float result = cobj->getSeparation(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getSeparation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsWorldManifoldWrapper_getSeparation)

static bool js_creator_physics_PhysicsWorldManifoldWrapper_getX(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getX : Error processing arguments");
        float result = cobj->getX(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsWorldManifoldWrapper_getX)

static bool js_creator_physics_PhysicsWorldManifoldWrapper_getY(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getY : Error processing arguments");
        float result = cobj->getY(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsWorldManifoldWrapper_getY)

static bool js_creator_physics_PhysicsWorldManifoldWrapper_getCount(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsWorldManifoldWrapper_getCount)

static bool js_creator_physics_PhysicsWorldManifoldWrapper_getNormalY(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getNormalY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNormalY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getNormalY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsWorldManifoldWrapper_getNormalY)

static bool js_creator_physics_PhysicsWorldManifoldWrapper_getNormalX(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getNormalX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNormalX();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsWorldManifoldWrapper_getNormalX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsWorldManifoldWrapper_getNormalX)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsWorldManifoldWrapper_finalize)

static bool js_creator_physics_PhysicsWorldManifoldWrapper_constructor(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = new (std::nothrow) creator::PhysicsWorldManifoldWrapper();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_physics_PhysicsWorldManifoldWrapper_constructor, __jsb_creator_PhysicsWorldManifoldWrapper_class, js_creator_PhysicsWorldManifoldWrapper_finalize)




static bool js_creator_PhysicsWorldManifoldWrapper_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::PhysicsWorldManifoldWrapper)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsWorldManifoldWrapper_finalize)

bool js_register_creator_physics_PhysicsWorldManifoldWrapper(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsWorldManifoldWrapper", obj, nullptr, _SE(js_creator_physics_PhysicsWorldManifoldWrapper_constructor));

    cls->defineFunction("getSeparation", _SE(js_creator_physics_PhysicsWorldManifoldWrapper_getSeparation));
    cls->defineFunction("getX", _SE(js_creator_physics_PhysicsWorldManifoldWrapper_getX));
    cls->defineFunction("getY", _SE(js_creator_physics_PhysicsWorldManifoldWrapper_getY));
    cls->defineFunction("getCount", _SE(js_creator_physics_PhysicsWorldManifoldWrapper_getCount));
    cls->defineFunction("getNormalY", _SE(js_creator_physics_PhysicsWorldManifoldWrapper_getNormalY));
    cls->defineFunction("getNormalX", _SE(js_creator_physics_PhysicsWorldManifoldWrapper_getNormalX));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsWorldManifoldWrapper_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsWorldManifoldWrapper>(cls);

    __jsb_creator_PhysicsWorldManifoldWrapper_proto = cls->getProto();
    __jsb_creator_PhysicsWorldManifoldWrapper_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsManifoldWrapper_proto = nullptr;
se::Class* __jsb_creator_PhysicsManifoldWrapper_class = nullptr;

static bool js_creator_physics_PhysicsManifoldWrapper_getNormalImpulse(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getNormalImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getNormalImpulse : Error processing arguments");
        float result = cobj->getNormalImpulse(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getNormalImpulse : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getNormalImpulse)

static bool js_creator_physics_PhysicsManifoldWrapper_getLocalNormalY(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getLocalNormalY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLocalNormalY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getLocalNormalY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getLocalNormalY)

static bool js_creator_physics_PhysicsManifoldWrapper_getLocalNormalX(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getLocalNormalX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLocalNormalX();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getLocalNormalX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getLocalNormalX)

static bool js_creator_physics_PhysicsManifoldWrapper_getLocalPointY(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getLocalPointY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLocalPointY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getLocalPointY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getLocalPointY)

static bool js_creator_physics_PhysicsManifoldWrapper_getLocalPointX(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getLocalPointX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLocalPointX();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getLocalPointX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getLocalPointX)

static bool js_creator_physics_PhysicsManifoldWrapper_getType(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getType)

static bool js_creator_physics_PhysicsManifoldWrapper_getX(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getX : Error processing arguments");
        float result = cobj->getX(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getX)

static bool js_creator_physics_PhysicsManifoldWrapper_getY(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getY : Error processing arguments");
        float result = cobj->getY(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getY)

static bool js_creator_physics_PhysicsManifoldWrapper_getTangentImpulse(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getTangentImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getTangentImpulse : Error processing arguments");
        float result = cobj->getTangentImpulse(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getTangentImpulse : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getTangentImpulse)

static bool js_creator_physics_PhysicsManifoldWrapper_getCount(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsManifoldWrapper_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsManifoldWrapper_getCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsManifoldWrapper_getCount)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsManifoldWrapper_finalize)

static bool js_creator_physics_PhysicsManifoldWrapper_constructor(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = new (std::nothrow) creator::PhysicsManifoldWrapper();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_physics_PhysicsManifoldWrapper_constructor, __jsb_creator_PhysicsManifoldWrapper_class, js_creator_PhysicsManifoldWrapper_finalize)




static bool js_creator_PhysicsManifoldWrapper_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::PhysicsManifoldWrapper)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsManifoldWrapper_finalize)

bool js_register_creator_physics_PhysicsManifoldWrapper(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsManifoldWrapper", obj, nullptr, _SE(js_creator_physics_PhysicsManifoldWrapper_constructor));

    cls->defineFunction("getNormalImpulse", _SE(js_creator_physics_PhysicsManifoldWrapper_getNormalImpulse));
    cls->defineFunction("getLocalNormalY", _SE(js_creator_physics_PhysicsManifoldWrapper_getLocalNormalY));
    cls->defineFunction("getLocalNormalX", _SE(js_creator_physics_PhysicsManifoldWrapper_getLocalNormalX));
    cls->defineFunction("getLocalPointY", _SE(js_creator_physics_PhysicsManifoldWrapper_getLocalPointY));
    cls->defineFunction("getLocalPointX", _SE(js_creator_physics_PhysicsManifoldWrapper_getLocalPointX));
    cls->defineFunction("getType", _SE(js_creator_physics_PhysicsManifoldWrapper_getType));
    cls->defineFunction("getX", _SE(js_creator_physics_PhysicsManifoldWrapper_getX));
    cls->defineFunction("getY", _SE(js_creator_physics_PhysicsManifoldWrapper_getY));
    cls->defineFunction("getTangentImpulse", _SE(js_creator_physics_PhysicsManifoldWrapper_getTangentImpulse));
    cls->defineFunction("getCount", _SE(js_creator_physics_PhysicsManifoldWrapper_getCount));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsManifoldWrapper_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsManifoldWrapper>(cls);

    __jsb_creator_PhysicsManifoldWrapper_proto = cls->getProto();
    __jsb_creator_PhysicsManifoldWrapper_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsUtils_proto = nullptr;
se::Class* __jsb_creator_PhysicsUtils_class = nullptr;

static bool js_creator_physics_PhysicsUtils_addB2Body(se::State& s)
{
    creator::PhysicsUtils* cobj = (creator::PhysicsUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsUtils_addB2Body : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Body* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsUtils_addB2Body : Error processing arguments");
        cobj->addB2Body(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsUtils_addB2Body)

static bool js_creator_physics_PhysicsUtils_syncNode(se::State& s)
{
    creator::PhysicsUtils* cobj = (creator::PhysicsUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsUtils_syncNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->syncNode();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsUtils_syncNode)

static bool js_creator_physics_PhysicsUtils_removeB2Body(se::State& s)
{
    creator::PhysicsUtils* cobj = (creator::PhysicsUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsUtils_removeB2Body : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Body* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsUtils_removeB2Body : Error processing arguments");
        cobj->removeB2Body(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsUtils_removeB2Body)

static bool js_creator_physics_PhysicsUtils_getContactManifoldWrapper(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Contact* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsUtils_getContactManifoldWrapper : Error processing arguments");
        const creator::PhysicsManifoldWrapper* result = creator::PhysicsUtils::getContactManifoldWrapper(arg0);
        ok &= native_ptr_to_rooted_seval<creator::PhysicsManifoldWrapper>((creator::PhysicsManifoldWrapper*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsUtils_getContactManifoldWrapper : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsUtils_getContactManifoldWrapper)

static bool js_creator_physics_PhysicsUtils_getContactWorldManifoldWrapper(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Contact* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsUtils_getContactWorldManifoldWrapper : Error processing arguments");
        const creator::PhysicsWorldManifoldWrapper* result = creator::PhysicsUtils::getContactWorldManifoldWrapper(arg0);
        ok &= native_ptr_to_rooted_seval<creator::PhysicsWorldManifoldWrapper>((creator::PhysicsWorldManifoldWrapper*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsUtils_getContactWorldManifoldWrapper : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsUtils_getContactWorldManifoldWrapper)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsUtils_finalize)

static bool js_creator_physics_PhysicsUtils_constructor(se::State& s)
{
    creator::PhysicsUtils* cobj = new (std::nothrow) creator::PhysicsUtils();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_physics_PhysicsUtils_constructor, __jsb_creator_PhysicsUtils_class, js_creator_PhysicsUtils_finalize)




static bool js_creator_PhysicsUtils_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::PhysicsUtils)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsUtils* cobj = (creator::PhysicsUtils*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsUtils_finalize)

bool js_register_creator_physics_PhysicsUtils(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsUtils", obj, nullptr, _SE(js_creator_physics_PhysicsUtils_constructor));

    cls->defineFunction("addB2Body", _SE(js_creator_physics_PhysicsUtils_addB2Body));
    cls->defineFunction("syncNode", _SE(js_creator_physics_PhysicsUtils_syncNode));
    cls->defineFunction("removeB2Body", _SE(js_creator_physics_PhysicsUtils_removeB2Body));
    cls->defineStaticFunction("getContactManifoldWrapper", _SE(js_creator_physics_PhysicsUtils_getContactManifoldWrapper));
    cls->defineStaticFunction("getContactWorldManifoldWrapper", _SE(js_creator_physics_PhysicsUtils_getContactWorldManifoldWrapper));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsUtils_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsUtils>(cls);

    __jsb_creator_PhysicsUtils_proto = cls->getProto();
    __jsb_creator_PhysicsUtils_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsContactImpulse_proto = nullptr;
se::Class* __jsb_creator_PhysicsContactImpulse_class = nullptr;

static bool js_creator_physics_PhysicsContactImpulse_getCount(se::State& s)
{
    creator::PhysicsContactImpulse* cobj = (creator::PhysicsContactImpulse*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsContactImpulse_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsContactImpulse_getCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsContactImpulse_getCount)

static bool js_creator_physics_PhysicsContactImpulse_getNormalImpulse(se::State& s)
{
    creator::PhysicsContactImpulse* cobj = (creator::PhysicsContactImpulse*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsContactImpulse_getNormalImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsContactImpulse_getNormalImpulse : Error processing arguments");
        float result = cobj->getNormalImpulse(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsContactImpulse_getNormalImpulse : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsContactImpulse_getNormalImpulse)

static bool js_creator_physics_PhysicsContactImpulse_getTangentImpulse(se::State& s)
{
    creator::PhysicsContactImpulse* cobj = (creator::PhysicsContactImpulse*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsContactImpulse_getTangentImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsContactImpulse_getTangentImpulse : Error processing arguments");
        float result = cobj->getTangentImpulse(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsContactImpulse_getTangentImpulse : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsContactImpulse_getTangentImpulse)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsContactImpulse_finalize)

static bool js_creator_physics_PhysicsContactImpulse_constructor(se::State& s)
{
    creator::PhysicsContactImpulse* cobj = new (std::nothrow) creator::PhysicsContactImpulse();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_physics_PhysicsContactImpulse_constructor, __jsb_creator_PhysicsContactImpulse_class, js_creator_PhysicsContactImpulse_finalize)




static bool js_creator_PhysicsContactImpulse_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::PhysicsContactImpulse)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsContactImpulse_finalize)

bool js_register_creator_physics_PhysicsContactImpulse(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsContactImpulse", obj, nullptr, _SE(js_creator_physics_PhysicsContactImpulse_constructor));

    cls->defineFunction("getCount", _SE(js_creator_physics_PhysicsContactImpulse_getCount));
    cls->defineFunction("getNormalImpulse", _SE(js_creator_physics_PhysicsContactImpulse_getNormalImpulse));
    cls->defineFunction("getTangentImpulse", _SE(js_creator_physics_PhysicsContactImpulse_getTangentImpulse));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsContactImpulse_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsContactImpulse>(cls);

    __jsb_creator_PhysicsContactImpulse_proto = cls->getProto();
    __jsb_creator_PhysicsContactImpulse_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsContactListener_proto = nullptr;
se::Class* __jsb_creator_PhysicsContactListener_class = nullptr;

static bool js_creator_physics_PhysicsContactListener_unregisterContactFixture(se::State& s)
{
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsContactListener_unregisterContactFixture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Fixture* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsContactListener_unregisterContactFixture : Error processing arguments");
        cobj->unregisterContactFixture(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsContactListener_unregisterContactFixture)

static bool js_creator_physics_PhysicsContactListener_registerContactFixture(se::State& s)
{
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsContactListener_registerContactFixture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Fixture* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsContactListener_registerContactFixture : Error processing arguments");
        cobj->registerContactFixture(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsContactListener_registerContactFixture)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsContactListener_finalize)

static bool js_creator_physics_PhysicsContactListener_constructor(se::State& s)
{
    creator::PhysicsContactListener* cobj = new (std::nothrow) creator::PhysicsContactListener();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_physics_PhysicsContactListener_constructor, __jsb_creator_PhysicsContactListener_class, js_creator_PhysicsContactListener_finalize)



extern se::Object* __jsb_b2ContactListener_proto;

static bool js_creator_PhysicsContactListener_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::PhysicsContactListener)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsContactListener_finalize)

bool js_register_creator_physics_PhysicsContactListener(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsContactListener", obj, __jsb_b2ContactListener_proto, _SE(js_creator_physics_PhysicsContactListener_constructor));

    cls->defineFunction("unregisterContactFixture", _SE(js_creator_physics_PhysicsContactListener_unregisterContactFixture));
    cls->defineFunction("registerContactFixture", _SE(js_creator_physics_PhysicsContactListener_registerContactFixture));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsContactListener_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsContactListener>(cls);

    __jsb_creator_PhysicsContactListener_proto = cls->getProto();
    __jsb_creator_PhysicsContactListener_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsAABBQueryCallback_proto = nullptr;
se::Class* __jsb_creator_PhysicsAABBQueryCallback_class = nullptr;

static bool js_creator_physics_PhysicsAABBQueryCallback_init(se::State& s)
{
    CC_UNUSED bool ok = true;
    creator::PhysicsAABBQueryCallback* cobj = (creator::PhysicsAABBQueryCallback*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_creator_physics_PhysicsAABBQueryCallback_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            b2Vec2 arg0;
            ok &= seval_to_b2Vec2(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->init(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            cobj->init();
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsAABBQueryCallback_init)

static bool js_creator_physics_PhysicsAABBQueryCallback_getFixture(se::State& s)
{
    creator::PhysicsAABBQueryCallback* cobj = (creator::PhysicsAABBQueryCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsAABBQueryCallback_getFixture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Fixture* result = cobj->getFixture();
        ok &= native_ptr_to_seval<b2Fixture>((b2Fixture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsAABBQueryCallback_getFixture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsAABBQueryCallback_getFixture)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsAABBQueryCallback_finalize)

static bool js_creator_physics_PhysicsAABBQueryCallback_constructor(se::State& s)
{
    creator::PhysicsAABBQueryCallback* cobj = new (std::nothrow) creator::PhysicsAABBQueryCallback();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_physics_PhysicsAABBQueryCallback_constructor, __jsb_creator_PhysicsAABBQueryCallback_class, js_creator_PhysicsAABBQueryCallback_finalize)



extern se::Object* __jsb_b2QueryCallback_proto;

static bool js_creator_PhysicsAABBQueryCallback_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::PhysicsAABBQueryCallback)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsAABBQueryCallback* cobj = (creator::PhysicsAABBQueryCallback*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsAABBQueryCallback_finalize)

bool js_register_creator_physics_PhysicsAABBQueryCallback(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsAABBQueryCallback", obj, __jsb_b2QueryCallback_proto, _SE(js_creator_physics_PhysicsAABBQueryCallback_constructor));

    cls->defineFunction("init", _SE(js_creator_physics_PhysicsAABBQueryCallback_init));
    cls->defineFunction("getFixture", _SE(js_creator_physics_PhysicsAABBQueryCallback_getFixture));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsAABBQueryCallback_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsAABBQueryCallback>(cls);

    __jsb_creator_PhysicsAABBQueryCallback_proto = cls->getProto();
    __jsb_creator_PhysicsAABBQueryCallback_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsRayCastCallback_proto = nullptr;
se::Class* __jsb_creator_PhysicsRayCastCallback_class = nullptr;

static bool js_creator_physics_PhysicsRayCastCallback_getType(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsRayCastCallback_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsRayCastCallback_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsRayCastCallback_getType)

static bool js_creator_physics_PhysicsRayCastCallback_init(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsRayCastCallback_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsRayCastCallback_init : Error processing arguments");
        cobj->init(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsRayCastCallback_init)

static bool js_creator_physics_PhysicsRayCastCallback_getFractions(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_physics_PhysicsRayCastCallback_getFractions : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<float, std::allocator<float> >& result = cobj->getFractions();
        ok &= std_vector_float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_physics_PhysicsRayCastCallback_getFractions : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_physics_PhysicsRayCastCallback_getFractions)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsRayCastCallback_finalize)

static bool js_creator_physics_PhysicsRayCastCallback_constructor(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = new (std::nothrow) creator::PhysicsRayCastCallback();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_physics_PhysicsRayCastCallback_constructor, __jsb_creator_PhysicsRayCastCallback_class, js_creator_PhysicsRayCastCallback_finalize)



extern se::Object* __jsb_b2RayCastCallback_proto;

static bool js_creator_PhysicsRayCastCallback_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::PhysicsRayCastCallback)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsRayCastCallback_finalize)

bool js_register_creator_physics_PhysicsRayCastCallback(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsRayCastCallback", obj, __jsb_b2RayCastCallback_proto, _SE(js_creator_physics_PhysicsRayCastCallback_constructor));

    cls->defineFunction("getType", _SE(js_creator_physics_PhysicsRayCastCallback_getType));
    cls->defineFunction("init", _SE(js_creator_physics_PhysicsRayCastCallback_init));
    cls->defineFunction("getFractions", _SE(js_creator_physics_PhysicsRayCastCallback_getFractions));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsRayCastCallback_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsRayCastCallback>(cls);

    __jsb_creator_PhysicsRayCastCallback_proto = cls->getProto();
    __jsb_creator_PhysicsRayCastCallback_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_creator_physics(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("cc", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("cc", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_creator_physics_PhysicsManifoldWrapper(ns);
    js_register_creator_physics_PhysicsRayCastCallback(ns);
    js_register_creator_physics_PhysicsDebugDraw(ns);
    js_register_creator_physics_PhysicsContactListener(ns);
    js_register_creator_physics_PhysicsContactImpulse(ns);
    js_register_creator_physics_PhysicsUtils(ns);
    js_register_creator_physics_PhysicsWorldManifoldWrapper(ns);
    js_register_creator_physics_PhysicsAABBQueryCallback(ns);
    return true;
}

