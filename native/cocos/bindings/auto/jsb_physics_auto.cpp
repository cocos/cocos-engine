#include "cocos/bindings/auto/jsb_physics_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "physics/PhysicsSDK.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_physics_World_proto = nullptr;
se::Class* __jsb_cc_physics_World_class = nullptr;

static bool js_physics_World_createConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_createConvex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::ConvexDesc, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_createConvex : Error processing arguments");
        uintptr_t result = cobj->createConvex(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_createConvex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_World_createConvex)

static bool js_physics_World_createHeightField(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_createHeightField : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::HeightFieldDesc, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_createHeightField : Error processing arguments");
        uintptr_t result = cobj->createHeightField(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_createHeightField : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_World_createHeightField)

static bool js_physics_World_createMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_createMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<unsigned short, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<uint8_t, false> arg4 = {};
        HolderType<uint8_t, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_createMaterial : Error processing arguments");
        uintptr_t result = cobj->createMaterial(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_createMaterial : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_World_createMaterial)

static bool js_physics_World_createTrimesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_createTrimesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::TrimeshDesc, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_createTrimesh : Error processing arguments");
        uintptr_t result = cobj->createTrimesh(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_createTrimesh : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_World_createTrimesh)

static bool js_physics_World_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_World_destroy)

static bool js_physics_World_emitEvents(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_emitEvents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->emitEvents();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_World_emitEvents)

static bool js_physics_World_getContactEventPairs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_getContactEventPairs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<std::shared_ptr<cc::physics::ContactEventPair>>& result = cobj->getContactEventPairs();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_getContactEventPairs : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_World_getContactEventPairs)

static bool js_physics_World_getTriggerEventPairs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_getTriggerEventPairs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<std::shared_ptr<cc::physics::TriggerEventPair>>& result = cobj->getTriggerEventPairs();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_getTriggerEventPairs : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_World_getTriggerEventPairs)

static bool js_physics_World_raycast(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_raycast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::RaycastOptions, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_raycast : Error processing arguments");
        bool result = cobj->raycast(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_raycast : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_World_raycast)

static bool js_physics_World_raycastClosest(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_raycastClosest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::RaycastOptions, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_raycastClosest : Error processing arguments");
        bool result = cobj->raycastClosest(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_raycastClosest : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_World_raycastClosest)

static bool js_physics_World_raycastClosestResult(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_raycastClosestResult : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::physics::RaycastResult& result = cobj->raycastClosestResult();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_raycastClosestResult : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_World_raycastClosestResult)

static bool js_physics_World_raycastResult(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_raycastResult : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<cc::physics::RaycastResult>& result = cobj->raycastResult();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_World_raycastResult : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_World_raycastResult)

static bool js_physics_World_setAllowSleep(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_setAllowSleep : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_setAllowSleep : Error processing arguments");
        cobj->setAllowSleep(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_World_setAllowSleep)

static bool js_physics_World_setCollisionMatrix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_setCollisionMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_setCollisionMatrix : Error processing arguments");
        cobj->setCollisionMatrix(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_physics_World_setCollisionMatrix)

static bool js_physics_World_setGravity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_setGravity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_setGravity : Error processing arguments");
        cobj->setGravity(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_World_setGravity)

static bool js_physics_World_step(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_step : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_World_step : Error processing arguments");
        cobj->step(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_World_step)

static bool js_physics_World_syncSceneToPhysics(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_syncSceneToPhysics : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->syncSceneToPhysics();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_World_syncSceneToPhysics)

static bool js_physics_World_syncSceneWithCheck(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_World_syncSceneWithCheck : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->syncSceneWithCheck();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_World_syncSceneWithCheck)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_World_finalize)

static bool js_physics_World_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::World* cobj = JSB_ALLOC(cc::physics::World);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_World_constructor, __jsb_cc_physics_World_class, js_cc_physics_World_finalize)



static bool js_cc_physics_World_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::World>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::World>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_World_finalize)

bool js_register_physics_World(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("World", obj, nullptr, _SE(js_physics_World_constructor));

    cls->defineFunction("createConvex", _SE(js_physics_World_createConvex));
    cls->defineFunction("createHeightField", _SE(js_physics_World_createHeightField));
    cls->defineFunction("createMaterial", _SE(js_physics_World_createMaterial));
    cls->defineFunction("createTrimesh", _SE(js_physics_World_createTrimesh));
    cls->defineFunction("destroy", _SE(js_physics_World_destroy));
    cls->defineFunction("emitEvents", _SE(js_physics_World_emitEvents));
    cls->defineFunction("getContactEventPairs", _SE(js_physics_World_getContactEventPairs));
    cls->defineFunction("getTriggerEventPairs", _SE(js_physics_World_getTriggerEventPairs));
    cls->defineFunction("raycast", _SE(js_physics_World_raycast));
    cls->defineFunction("raycastClosest", _SE(js_physics_World_raycastClosest));
    cls->defineFunction("raycastClosestResult", _SE(js_physics_World_raycastClosestResult));
    cls->defineFunction("raycastResult", _SE(js_physics_World_raycastResult));
    cls->defineFunction("setAllowSleep", _SE(js_physics_World_setAllowSleep));
    cls->defineFunction("setCollisionMatrix", _SE(js_physics_World_setCollisionMatrix));
    cls->defineFunction("setGravity", _SE(js_physics_World_setGravity));
    cls->defineFunction("step", _SE(js_physics_World_step));
    cls->defineFunction("syncSceneToPhysics", _SE(js_physics_World_syncSceneToPhysics));
    cls->defineFunction("syncSceneWithCheck", _SE(js_physics_World_syncSceneWithCheck));
    cls->defineFinalizeFunction(_SE(js_cc_physics_World_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::World>(cls);

    __jsb_cc_physics_World_proto = cls->getProto();
    __jsb_cc_physics_World_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_RigidBody_proto = nullptr;
se::Class* __jsb_cc_physics_RigidBody_class = nullptr;

static bool js_physics_RigidBody_applyForce(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_applyForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_applyForce : Error processing arguments");
        cobj->applyForce(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_applyForce)

static bool js_physics_RigidBody_applyImpulse(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_applyImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_applyImpulse : Error processing arguments");
        cobj->applyImpulse(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_applyImpulse)

static bool js_physics_RigidBody_applyLocalForce(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_applyLocalForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_applyLocalForce : Error processing arguments");
        cobj->applyLocalForce(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_applyLocalForce)

static bool js_physics_RigidBody_applyLocalImpulse(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_applyLocalImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_applyLocalImpulse : Error processing arguments");
        cobj->applyLocalImpulse(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_applyLocalImpulse)

static bool js_physics_RigidBody_applyLocalTorque(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_applyLocalTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_applyLocalTorque : Error processing arguments");
        cobj->applyLocalTorque(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_applyLocalTorque)

static bool js_physics_RigidBody_applyTorque(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_applyTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_applyTorque : Error processing arguments");
        cobj->applyTorque(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_applyTorque)

static bool js_physics_RigidBody_clearForces(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_clearForces : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearForces();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_clearForces)

static bool js_physics_RigidBody_clearState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_clearState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearState();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_clearState)

static bool js_physics_RigidBody_clearVelocity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_clearVelocity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearVelocity();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_clearVelocity)

static bool js_physics_RigidBody_getAngularVelocity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_getAngularVelocity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Vec3 result = cobj->getAngularVelocity();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_getAngularVelocity : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_getAngularVelocity)

static bool js_physics_RigidBody_getGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGroup();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_getGroup : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_getGroup)

static bool js_physics_RigidBody_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_getImpl)

static bool js_physics_RigidBody_getLinearVelocity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_getLinearVelocity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Vec3 result = cobj->getLinearVelocity();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_getLinearVelocity : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_getLinearVelocity)

static bool js_physics_RigidBody_getMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_getMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_getMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_getMask)

static bool js_physics_RigidBody_getNodeHandle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_getNodeHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getNodeHandle();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_getNodeHandle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_getNodeHandle)

static bool js_physics_RigidBody_getSleepThreshold(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_getSleepThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSleepThreshold();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_getSleepThreshold : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_getSleepThreshold)

static bool js_physics_RigidBody_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        HolderType<cc::physics::ERigidBodyType, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_initialize : Error processing arguments");
        cobj->initialize(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_initialize)

static bool js_physics_RigidBody_isAwake(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_isAwake : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAwake();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_isAwake : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_isAwake)

static bool js_physics_RigidBody_isSleeping(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_isSleeping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isSleeping();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_isSleeping : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_isSleeping)

static bool js_physics_RigidBody_isSleepy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_isSleepy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isSleepy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_isSleepy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_isSleepy)

static bool js_physics_RigidBody_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_onDestroy)

static bool js_physics_RigidBody_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_onDisable)

static bool js_physics_RigidBody_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_onEnable)

static bool js_physics_RigidBody_setAllowSleep(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setAllowSleep : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setAllowSleep : Error processing arguments");
        cobj->setAllowSleep(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setAllowSleep)

static bool js_physics_RigidBody_setAngularDamping(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setAngularDamping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setAngularDamping : Error processing arguments");
        cobj->setAngularDamping(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setAngularDamping)

static bool js_physics_RigidBody_setAngularFactor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setAngularFactor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setAngularFactor : Error processing arguments");
        cobj->setAngularFactor(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setAngularFactor)

static bool js_physics_RigidBody_setAngularVelocity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setAngularVelocity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setAngularVelocity : Error processing arguments");
        cobj->setAngularVelocity(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setAngularVelocity)

static bool js_physics_RigidBody_setGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setGroup : Error processing arguments");
        cobj->setGroup(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setGroup)

static bool js_physics_RigidBody_setLinearDamping(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setLinearDamping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setLinearDamping : Error processing arguments");
        cobj->setLinearDamping(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setLinearDamping)

static bool js_physics_RigidBody_setLinearFactor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setLinearFactor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setLinearFactor : Error processing arguments");
        cobj->setLinearFactor(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setLinearFactor)

static bool js_physics_RigidBody_setLinearVelocity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setLinearVelocity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setLinearVelocity : Error processing arguments");
        cobj->setLinearVelocity(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setLinearVelocity)

static bool js_physics_RigidBody_setMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setMask : Error processing arguments");
        cobj->setMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setMask)

static bool js_physics_RigidBody_setMass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setMass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setMass : Error processing arguments");
        cobj->setMass(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setMass)

static bool js_physics_RigidBody_setSleepThreshold(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setSleepThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setSleepThreshold : Error processing arguments");
        cobj->setSleepThreshold(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setSleepThreshold)

static bool js_physics_RigidBody_setType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::ERigidBodyType, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_setType : Error processing arguments");
        cobj->setType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_setType)

static bool js_physics_RigidBody_sleep(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_sleep : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->sleep();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_sleep)

static bool js_physics_RigidBody_useCCD(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_useCCD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_useCCD : Error processing arguments");
        cobj->useCCD(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_useCCD)

static bool js_physics_RigidBody_useGravity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_useGravity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RigidBody_useGravity : Error processing arguments");
        cobj->useGravity(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_useGravity)

static bool js_physics_RigidBody_wakeUp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RigidBody_wakeUp : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->wakeUp();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RigidBody_wakeUp)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_RigidBody_finalize)

static bool js_physics_RigidBody_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::RigidBody* cobj = JSB_ALLOC(cc::physics::RigidBody);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_RigidBody_constructor, __jsb_cc_physics_RigidBody_class, js_cc_physics_RigidBody_finalize)



static bool js_cc_physics_RigidBody_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::RigidBody>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::RigidBody>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_RigidBody_finalize)

bool js_register_physics_RigidBody(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RigidBody", obj, nullptr, _SE(js_physics_RigidBody_constructor));

    cls->defineFunction("applyForce", _SE(js_physics_RigidBody_applyForce));
    cls->defineFunction("applyImpulse", _SE(js_physics_RigidBody_applyImpulse));
    cls->defineFunction("applyLocalForce", _SE(js_physics_RigidBody_applyLocalForce));
    cls->defineFunction("applyLocalImpulse", _SE(js_physics_RigidBody_applyLocalImpulse));
    cls->defineFunction("applyLocalTorque", _SE(js_physics_RigidBody_applyLocalTorque));
    cls->defineFunction("applyTorque", _SE(js_physics_RigidBody_applyTorque));
    cls->defineFunction("clearForces", _SE(js_physics_RigidBody_clearForces));
    cls->defineFunction("clearState", _SE(js_physics_RigidBody_clearState));
    cls->defineFunction("clearVelocity", _SE(js_physics_RigidBody_clearVelocity));
    cls->defineFunction("getAngularVelocity", _SE(js_physics_RigidBody_getAngularVelocity));
    cls->defineFunction("getGroup", _SE(js_physics_RigidBody_getGroup));
    cls->defineFunction("getImpl", _SE(js_physics_RigidBody_getImpl));
    cls->defineFunction("getLinearVelocity", _SE(js_physics_RigidBody_getLinearVelocity));
    cls->defineFunction("getMask", _SE(js_physics_RigidBody_getMask));
    cls->defineFunction("getNodeHandle", _SE(js_physics_RigidBody_getNodeHandle));
    cls->defineFunction("getSleepThreshold", _SE(js_physics_RigidBody_getSleepThreshold));
    cls->defineFunction("initialize", _SE(js_physics_RigidBody_initialize));
    cls->defineFunction("isAwake", _SE(js_physics_RigidBody_isAwake));
    cls->defineFunction("isSleeping", _SE(js_physics_RigidBody_isSleeping));
    cls->defineFunction("isSleepy", _SE(js_physics_RigidBody_isSleepy));
    cls->defineFunction("onDestroy", _SE(js_physics_RigidBody_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_RigidBody_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_RigidBody_onEnable));
    cls->defineFunction("setAllowSleep", _SE(js_physics_RigidBody_setAllowSleep));
    cls->defineFunction("setAngularDamping", _SE(js_physics_RigidBody_setAngularDamping));
    cls->defineFunction("setAngularFactor", _SE(js_physics_RigidBody_setAngularFactor));
    cls->defineFunction("setAngularVelocity", _SE(js_physics_RigidBody_setAngularVelocity));
    cls->defineFunction("setGroup", _SE(js_physics_RigidBody_setGroup));
    cls->defineFunction("setLinearDamping", _SE(js_physics_RigidBody_setLinearDamping));
    cls->defineFunction("setLinearFactor", _SE(js_physics_RigidBody_setLinearFactor));
    cls->defineFunction("setLinearVelocity", _SE(js_physics_RigidBody_setLinearVelocity));
    cls->defineFunction("setMask", _SE(js_physics_RigidBody_setMask));
    cls->defineFunction("setMass", _SE(js_physics_RigidBody_setMass));
    cls->defineFunction("setSleepThreshold", _SE(js_physics_RigidBody_setSleepThreshold));
    cls->defineFunction("setType", _SE(js_physics_RigidBody_setType));
    cls->defineFunction("sleep", _SE(js_physics_RigidBody_sleep));
    cls->defineFunction("useCCD", _SE(js_physics_RigidBody_useCCD));
    cls->defineFunction("useGravity", _SE(js_physics_RigidBody_useGravity));
    cls->defineFunction("wakeUp", _SE(js_physics_RigidBody_wakeUp));
    cls->defineFinalizeFunction(_SE(js_cc_physics_RigidBody_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::RigidBody>(cls);

    __jsb_cc_physics_RigidBody_proto = cls->getProto();
    __jsb_cc_physics_RigidBody_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_SphereShape_proto = nullptr;
se::Class* __jsb_cc_physics_SphereShape_class = nullptr;

static bool js_physics_SphereShape_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_getAABB)

static bool js_physics_SphereShape_getBoundingSphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_getBoundingSphere : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Sphere& result = cobj->getBoundingSphere();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_getBoundingSphere : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_getBoundingSphere)

static bool js_physics_SphereShape_getGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGroup();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_getGroup : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_getGroup)

static bool js_physics_SphereShape_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_getImpl)

static bool js_physics_SphereShape_getMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_getMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_getMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_getMask)

static bool js_physics_SphereShape_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_initialize)

static bool js_physics_SphereShape_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_onDestroy)

static bool js_physics_SphereShape_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_onDisable)

static bool js_physics_SphereShape_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_onEnable)

static bool js_physics_SphereShape_setAsTrigger(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_setAsTrigger : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_setAsTrigger : Error processing arguments");
        cobj->setAsTrigger(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_setAsTrigger)

static bool js_physics_SphereShape_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_setCenter)

static bool js_physics_SphereShape_setGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_setGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_setGroup : Error processing arguments");
        cobj->setGroup(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_setGroup)

static bool js_physics_SphereShape_setMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_setMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_setMask : Error processing arguments");
        cobj->setMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_setMask)

static bool js_physics_SphereShape_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_setMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<unsigned short, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<uint8_t, false> arg4 = {};
        HolderType<uint8_t, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_setMaterial)

static bool js_physics_SphereShape_setRadius(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_setRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_setRadius : Error processing arguments");
        cobj->setRadius(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_setRadius)

static bool js_physics_SphereShape_updateEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_SphereShape_updateEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::EShapeFilterFlag, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_SphereShape_updateEventListener : Error processing arguments");
        cobj->updateEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_SphereShape_updateEventListener)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_SphereShape_finalize)

static bool js_physics_SphereShape_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::SphereShape* cobj = JSB_ALLOC(cc::physics::SphereShape);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_SphereShape_constructor, __jsb_cc_physics_SphereShape_class, js_cc_physics_SphereShape_finalize)



static bool js_cc_physics_SphereShape_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::SphereShape>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::SphereShape>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_SphereShape_finalize)

bool js_register_physics_SphereShape(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SphereShape", obj, nullptr, _SE(js_physics_SphereShape_constructor));

    cls->defineFunction("getAABB", _SE(js_physics_SphereShape_getAABB));
    cls->defineFunction("getBoundingSphere", _SE(js_physics_SphereShape_getBoundingSphere));
    cls->defineFunction("getGroup", _SE(js_physics_SphereShape_getGroup));
    cls->defineFunction("getImpl", _SE(js_physics_SphereShape_getImpl));
    cls->defineFunction("getMask", _SE(js_physics_SphereShape_getMask));
    cls->defineFunction("initialize", _SE(js_physics_SphereShape_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_SphereShape_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_SphereShape_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_SphereShape_onEnable));
    cls->defineFunction("setAsTrigger", _SE(js_physics_SphereShape_setAsTrigger));
    cls->defineFunction("setCenter", _SE(js_physics_SphereShape_setCenter));
    cls->defineFunction("setGroup", _SE(js_physics_SphereShape_setGroup));
    cls->defineFunction("setMask", _SE(js_physics_SphereShape_setMask));
    cls->defineFunction("setMaterial", _SE(js_physics_SphereShape_setMaterial));
    cls->defineFunction("setRadius", _SE(js_physics_SphereShape_setRadius));
    cls->defineFunction("updateEventListener", _SE(js_physics_SphereShape_updateEventListener));
    cls->defineFinalizeFunction(_SE(js_cc_physics_SphereShape_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::SphereShape>(cls);

    __jsb_cc_physics_SphereShape_proto = cls->getProto();
    __jsb_cc_physics_SphereShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_BoxShape_proto = nullptr;
se::Class* __jsb_cc_physics_BoxShape_class = nullptr;

static bool js_physics_BoxShape_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_getAABB)

static bool js_physics_BoxShape_getBoundingSphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_getBoundingSphere : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Sphere& result = cobj->getBoundingSphere();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_getBoundingSphere : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_getBoundingSphere)

static bool js_physics_BoxShape_getGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGroup();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_getGroup : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_getGroup)

static bool js_physics_BoxShape_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_getImpl)

static bool js_physics_BoxShape_getMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_getMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_getMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_getMask)

static bool js_physics_BoxShape_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_initialize)

static bool js_physics_BoxShape_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_onDestroy)

static bool js_physics_BoxShape_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_onDisable)

static bool js_physics_BoxShape_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_onEnable)

static bool js_physics_BoxShape_setAsTrigger(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_setAsTrigger : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_setAsTrigger : Error processing arguments");
        cobj->setAsTrigger(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_setAsTrigger)

static bool js_physics_BoxShape_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_setCenter)

static bool js_physics_BoxShape_setGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_setGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_setGroup : Error processing arguments");
        cobj->setGroup(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_setGroup)

static bool js_physics_BoxShape_setMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_setMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_setMask : Error processing arguments");
        cobj->setMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_setMask)

static bool js_physics_BoxShape_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_setMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<unsigned short, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<uint8_t, false> arg4 = {};
        HolderType<uint8_t, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_setMaterial)

static bool js_physics_BoxShape_setSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_setSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_setSize : Error processing arguments");
        cobj->setSize(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_setSize)

static bool js_physics_BoxShape_updateEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_BoxShape_updateEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::EShapeFilterFlag, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_BoxShape_updateEventListener : Error processing arguments");
        cobj->updateEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_BoxShape_updateEventListener)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_BoxShape_finalize)

static bool js_physics_BoxShape_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::BoxShape* cobj = JSB_ALLOC(cc::physics::BoxShape);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_BoxShape_constructor, __jsb_cc_physics_BoxShape_class, js_cc_physics_BoxShape_finalize)



static bool js_cc_physics_BoxShape_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::BoxShape>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::BoxShape>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_BoxShape_finalize)

bool js_register_physics_BoxShape(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BoxShape", obj, nullptr, _SE(js_physics_BoxShape_constructor));

    cls->defineFunction("getAABB", _SE(js_physics_BoxShape_getAABB));
    cls->defineFunction("getBoundingSphere", _SE(js_physics_BoxShape_getBoundingSphere));
    cls->defineFunction("getGroup", _SE(js_physics_BoxShape_getGroup));
    cls->defineFunction("getImpl", _SE(js_physics_BoxShape_getImpl));
    cls->defineFunction("getMask", _SE(js_physics_BoxShape_getMask));
    cls->defineFunction("initialize", _SE(js_physics_BoxShape_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_BoxShape_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_BoxShape_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_BoxShape_onEnable));
    cls->defineFunction("setAsTrigger", _SE(js_physics_BoxShape_setAsTrigger));
    cls->defineFunction("setCenter", _SE(js_physics_BoxShape_setCenter));
    cls->defineFunction("setGroup", _SE(js_physics_BoxShape_setGroup));
    cls->defineFunction("setMask", _SE(js_physics_BoxShape_setMask));
    cls->defineFunction("setMaterial", _SE(js_physics_BoxShape_setMaterial));
    cls->defineFunction("setSize", _SE(js_physics_BoxShape_setSize));
    cls->defineFunction("updateEventListener", _SE(js_physics_BoxShape_updateEventListener));
    cls->defineFinalizeFunction(_SE(js_cc_physics_BoxShape_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::BoxShape>(cls);

    __jsb_cc_physics_BoxShape_proto = cls->getProto();
    __jsb_cc_physics_BoxShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_CapsuleShape_proto = nullptr;
se::Class* __jsb_cc_physics_CapsuleShape_class = nullptr;

static bool js_physics_CapsuleShape_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_getAABB)

static bool js_physics_CapsuleShape_getBoundingSphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_getBoundingSphere : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Sphere& result = cobj->getBoundingSphere();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_getBoundingSphere : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_getBoundingSphere)

static bool js_physics_CapsuleShape_getGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGroup();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_getGroup : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_getGroup)

static bool js_physics_CapsuleShape_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_getImpl)

static bool js_physics_CapsuleShape_getMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_getMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_getMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_getMask)

static bool js_physics_CapsuleShape_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_initialize)

static bool js_physics_CapsuleShape_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_onDestroy)

static bool js_physics_CapsuleShape_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_onDisable)

static bool js_physics_CapsuleShape_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_onEnable)

static bool js_physics_CapsuleShape_setAsTrigger(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_setAsTrigger : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_setAsTrigger : Error processing arguments");
        cobj->setAsTrigger(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_setAsTrigger)

static bool js_physics_CapsuleShape_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_setCenter)

static bool js_physics_CapsuleShape_setCylinderHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_setCylinderHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_setCylinderHeight : Error processing arguments");
        cobj->setCylinderHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_setCylinderHeight)

static bool js_physics_CapsuleShape_setDirection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_setDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::EAxisDirection, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_setDirection : Error processing arguments");
        cobj->setDirection(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_setDirection)

static bool js_physics_CapsuleShape_setGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_setGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_setGroup : Error processing arguments");
        cobj->setGroup(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_setGroup)

static bool js_physics_CapsuleShape_setMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_setMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_setMask : Error processing arguments");
        cobj->setMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_setMask)

static bool js_physics_CapsuleShape_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_setMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<unsigned short, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<uint8_t, false> arg4 = {};
        HolderType<uint8_t, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_setMaterial)

static bool js_physics_CapsuleShape_setRadius(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_setRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_setRadius : Error processing arguments");
        cobj->setRadius(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_setRadius)

static bool js_physics_CapsuleShape_updateEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CapsuleShape_updateEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::EShapeFilterFlag, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CapsuleShape_updateEventListener : Error processing arguments");
        cobj->updateEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CapsuleShape_updateEventListener)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_CapsuleShape_finalize)

static bool js_physics_CapsuleShape_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::CapsuleShape* cobj = JSB_ALLOC(cc::physics::CapsuleShape);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_CapsuleShape_constructor, __jsb_cc_physics_CapsuleShape_class, js_cc_physics_CapsuleShape_finalize)



static bool js_cc_physics_CapsuleShape_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::CapsuleShape>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::CapsuleShape>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_CapsuleShape_finalize)

bool js_register_physics_CapsuleShape(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CapsuleShape", obj, nullptr, _SE(js_physics_CapsuleShape_constructor));

    cls->defineFunction("getAABB", _SE(js_physics_CapsuleShape_getAABB));
    cls->defineFunction("getBoundingSphere", _SE(js_physics_CapsuleShape_getBoundingSphere));
    cls->defineFunction("getGroup", _SE(js_physics_CapsuleShape_getGroup));
    cls->defineFunction("getImpl", _SE(js_physics_CapsuleShape_getImpl));
    cls->defineFunction("getMask", _SE(js_physics_CapsuleShape_getMask));
    cls->defineFunction("initialize", _SE(js_physics_CapsuleShape_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_CapsuleShape_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_CapsuleShape_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_CapsuleShape_onEnable));
    cls->defineFunction("setAsTrigger", _SE(js_physics_CapsuleShape_setAsTrigger));
    cls->defineFunction("setCenter", _SE(js_physics_CapsuleShape_setCenter));
    cls->defineFunction("setCylinderHeight", _SE(js_physics_CapsuleShape_setCylinderHeight));
    cls->defineFunction("setDirection", _SE(js_physics_CapsuleShape_setDirection));
    cls->defineFunction("setGroup", _SE(js_physics_CapsuleShape_setGroup));
    cls->defineFunction("setMask", _SE(js_physics_CapsuleShape_setMask));
    cls->defineFunction("setMaterial", _SE(js_physics_CapsuleShape_setMaterial));
    cls->defineFunction("setRadius", _SE(js_physics_CapsuleShape_setRadius));
    cls->defineFunction("updateEventListener", _SE(js_physics_CapsuleShape_updateEventListener));
    cls->defineFinalizeFunction(_SE(js_cc_physics_CapsuleShape_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::CapsuleShape>(cls);

    __jsb_cc_physics_CapsuleShape_proto = cls->getProto();
    __jsb_cc_physics_CapsuleShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_PlaneShape_proto = nullptr;
se::Class* __jsb_cc_physics_PlaneShape_class = nullptr;

static bool js_physics_PlaneShape_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_getAABB)

static bool js_physics_PlaneShape_getBoundingSphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_getBoundingSphere : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Sphere& result = cobj->getBoundingSphere();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_getBoundingSphere : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_getBoundingSphere)

static bool js_physics_PlaneShape_getGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGroup();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_getGroup : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_getGroup)

static bool js_physics_PlaneShape_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_getImpl)

static bool js_physics_PlaneShape_getMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_getMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_getMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_getMask)

static bool js_physics_PlaneShape_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_initialize)

static bool js_physics_PlaneShape_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_onDestroy)

static bool js_physics_PlaneShape_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_onDisable)

static bool js_physics_PlaneShape_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_onEnable)

static bool js_physics_PlaneShape_setAsTrigger(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_setAsTrigger : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_setAsTrigger : Error processing arguments");
        cobj->setAsTrigger(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_setAsTrigger)

static bool js_physics_PlaneShape_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_setCenter)

static bool js_physics_PlaneShape_setConstant(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_setConstant : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_setConstant : Error processing arguments");
        cobj->setConstant(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_setConstant)

static bool js_physics_PlaneShape_setGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_setGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_setGroup : Error processing arguments");
        cobj->setGroup(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_setGroup)

static bool js_physics_PlaneShape_setMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_setMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_setMask : Error processing arguments");
        cobj->setMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_setMask)

static bool js_physics_PlaneShape_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_setMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<unsigned short, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<uint8_t, false> arg4 = {};
        HolderType<uint8_t, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_setMaterial)

static bool js_physics_PlaneShape_setNormal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_setNormal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_setNormal : Error processing arguments");
        cobj->setNormal(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_setNormal)

static bool js_physics_PlaneShape_updateEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_PlaneShape_updateEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::EShapeFilterFlag, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_PlaneShape_updateEventListener : Error processing arguments");
        cobj->updateEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_PlaneShape_updateEventListener)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_PlaneShape_finalize)

static bool js_physics_PlaneShape_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::PlaneShape* cobj = JSB_ALLOC(cc::physics::PlaneShape);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_PlaneShape_constructor, __jsb_cc_physics_PlaneShape_class, js_cc_physics_PlaneShape_finalize)



static bool js_cc_physics_PlaneShape_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::PlaneShape>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::PlaneShape>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_PlaneShape_finalize)

bool js_register_physics_PlaneShape(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PlaneShape", obj, nullptr, _SE(js_physics_PlaneShape_constructor));

    cls->defineFunction("getAABB", _SE(js_physics_PlaneShape_getAABB));
    cls->defineFunction("getBoundingSphere", _SE(js_physics_PlaneShape_getBoundingSphere));
    cls->defineFunction("getGroup", _SE(js_physics_PlaneShape_getGroup));
    cls->defineFunction("getImpl", _SE(js_physics_PlaneShape_getImpl));
    cls->defineFunction("getMask", _SE(js_physics_PlaneShape_getMask));
    cls->defineFunction("initialize", _SE(js_physics_PlaneShape_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_PlaneShape_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_PlaneShape_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_PlaneShape_onEnable));
    cls->defineFunction("setAsTrigger", _SE(js_physics_PlaneShape_setAsTrigger));
    cls->defineFunction("setCenter", _SE(js_physics_PlaneShape_setCenter));
    cls->defineFunction("setConstant", _SE(js_physics_PlaneShape_setConstant));
    cls->defineFunction("setGroup", _SE(js_physics_PlaneShape_setGroup));
    cls->defineFunction("setMask", _SE(js_physics_PlaneShape_setMask));
    cls->defineFunction("setMaterial", _SE(js_physics_PlaneShape_setMaterial));
    cls->defineFunction("setNormal", _SE(js_physics_PlaneShape_setNormal));
    cls->defineFunction("updateEventListener", _SE(js_physics_PlaneShape_updateEventListener));
    cls->defineFinalizeFunction(_SE(js_cc_physics_PlaneShape_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::PlaneShape>(cls);

    __jsb_cc_physics_PlaneShape_proto = cls->getProto();
    __jsb_cc_physics_PlaneShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_TrimeshShape_proto = nullptr;
se::Class* __jsb_cc_physics_TrimeshShape_class = nullptr;

static bool js_physics_TrimeshShape_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_getAABB)

static bool js_physics_TrimeshShape_getBoundingSphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_getBoundingSphere : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Sphere& result = cobj->getBoundingSphere();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_getBoundingSphere : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_getBoundingSphere)

static bool js_physics_TrimeshShape_getGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGroup();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_getGroup : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_getGroup)

static bool js_physics_TrimeshShape_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_getImpl)

static bool js_physics_TrimeshShape_getMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_getMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_getMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_getMask)

static bool js_physics_TrimeshShape_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_initialize)

static bool js_physics_TrimeshShape_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_onDestroy)

static bool js_physics_TrimeshShape_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_onDisable)

static bool js_physics_TrimeshShape_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_onEnable)

static bool js_physics_TrimeshShape_setAsTrigger(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_setAsTrigger : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_setAsTrigger : Error processing arguments");
        cobj->setAsTrigger(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_setAsTrigger)

static bool js_physics_TrimeshShape_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_setCenter)

static bool js_physics_TrimeshShape_setGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_setGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_setGroup : Error processing arguments");
        cobj->setGroup(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_setGroup)

static bool js_physics_TrimeshShape_setMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_setMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_setMask : Error processing arguments");
        cobj->setMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_setMask)

static bool js_physics_TrimeshShape_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_setMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<unsigned short, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<uint8_t, false> arg4 = {};
        HolderType<uint8_t, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_setMaterial)

static bool js_physics_TrimeshShape_setMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_setMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<uintptr_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_setMesh : Error processing arguments");
        cobj->setMesh(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_setMesh)

static bool js_physics_TrimeshShape_updateEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_updateEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::EShapeFilterFlag, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_updateEventListener : Error processing arguments");
        cobj->updateEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_updateEventListener)

static bool js_physics_TrimeshShape_useConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TrimeshShape_useConvex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TrimeshShape_useConvex : Error processing arguments");
        cobj->useConvex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TrimeshShape_useConvex)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_TrimeshShape_finalize)

static bool js_physics_TrimeshShape_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::TrimeshShape* cobj = JSB_ALLOC(cc::physics::TrimeshShape);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_TrimeshShape_constructor, __jsb_cc_physics_TrimeshShape_class, js_cc_physics_TrimeshShape_finalize)



static bool js_cc_physics_TrimeshShape_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::TrimeshShape>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::TrimeshShape>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_TrimeshShape_finalize)

bool js_register_physics_TrimeshShape(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TrimeshShape", obj, nullptr, _SE(js_physics_TrimeshShape_constructor));

    cls->defineFunction("getAABB", _SE(js_physics_TrimeshShape_getAABB));
    cls->defineFunction("getBoundingSphere", _SE(js_physics_TrimeshShape_getBoundingSphere));
    cls->defineFunction("getGroup", _SE(js_physics_TrimeshShape_getGroup));
    cls->defineFunction("getImpl", _SE(js_physics_TrimeshShape_getImpl));
    cls->defineFunction("getMask", _SE(js_physics_TrimeshShape_getMask));
    cls->defineFunction("initialize", _SE(js_physics_TrimeshShape_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_TrimeshShape_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_TrimeshShape_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_TrimeshShape_onEnable));
    cls->defineFunction("setAsTrigger", _SE(js_physics_TrimeshShape_setAsTrigger));
    cls->defineFunction("setCenter", _SE(js_physics_TrimeshShape_setCenter));
    cls->defineFunction("setGroup", _SE(js_physics_TrimeshShape_setGroup));
    cls->defineFunction("setMask", _SE(js_physics_TrimeshShape_setMask));
    cls->defineFunction("setMaterial", _SE(js_physics_TrimeshShape_setMaterial));
    cls->defineFunction("setMesh", _SE(js_physics_TrimeshShape_setMesh));
    cls->defineFunction("updateEventListener", _SE(js_physics_TrimeshShape_updateEventListener));
    cls->defineFunction("useConvex", _SE(js_physics_TrimeshShape_useConvex));
    cls->defineFinalizeFunction(_SE(js_cc_physics_TrimeshShape_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::TrimeshShape>(cls);

    __jsb_cc_physics_TrimeshShape_proto = cls->getProto();
    __jsb_cc_physics_TrimeshShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_CylinderShape_proto = nullptr;
se::Class* __jsb_cc_physics_CylinderShape_class = nullptr;

static bool js_physics_CylinderShape_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_getAABB)

static bool js_physics_CylinderShape_getBoundingSphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_getBoundingSphere : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Sphere& result = cobj->getBoundingSphere();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_getBoundingSphere : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_getBoundingSphere)

static bool js_physics_CylinderShape_getGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGroup();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_getGroup : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_getGroup)

static bool js_physics_CylinderShape_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_getImpl)

static bool js_physics_CylinderShape_getMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_getMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_getMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_getMask)

static bool js_physics_CylinderShape_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_initialize)

static bool js_physics_CylinderShape_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_onDestroy)

static bool js_physics_CylinderShape_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_onDisable)

static bool js_physics_CylinderShape_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_onEnable)

static bool js_physics_CylinderShape_setAsTrigger(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_setAsTrigger : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_setAsTrigger : Error processing arguments");
        cobj->setAsTrigger(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_setAsTrigger)

static bool js_physics_CylinderShape_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_setCenter)

static bool js_physics_CylinderShape_setConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_setConvex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<uintptr_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_setConvex : Error processing arguments");
        cobj->setConvex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_setConvex)

static bool js_physics_CylinderShape_setCylinder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_setCylinder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<cc::physics::EAxisDirection, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_setCylinder : Error processing arguments");
        cobj->setCylinder(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_setCylinder)

static bool js_physics_CylinderShape_setGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_setGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_setGroup : Error processing arguments");
        cobj->setGroup(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_setGroup)

static bool js_physics_CylinderShape_setMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_setMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_setMask : Error processing arguments");
        cobj->setMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_setMask)

static bool js_physics_CylinderShape_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_setMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<unsigned short, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<uint8_t, false> arg4 = {};
        HolderType<uint8_t, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_setMaterial)

static bool js_physics_CylinderShape_updateEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_CylinderShape_updateEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::EShapeFilterFlag, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_CylinderShape_updateEventListener : Error processing arguments");
        cobj->updateEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_CylinderShape_updateEventListener)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_CylinderShape_finalize)

static bool js_physics_CylinderShape_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::CylinderShape* cobj = JSB_ALLOC(cc::physics::CylinderShape);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_CylinderShape_constructor, __jsb_cc_physics_CylinderShape_class, js_cc_physics_CylinderShape_finalize)



static bool js_cc_physics_CylinderShape_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::CylinderShape>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::CylinderShape>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_CylinderShape_finalize)

bool js_register_physics_CylinderShape(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CylinderShape", obj, nullptr, _SE(js_physics_CylinderShape_constructor));

    cls->defineFunction("getAABB", _SE(js_physics_CylinderShape_getAABB));
    cls->defineFunction("getBoundingSphere", _SE(js_physics_CylinderShape_getBoundingSphere));
    cls->defineFunction("getGroup", _SE(js_physics_CylinderShape_getGroup));
    cls->defineFunction("getImpl", _SE(js_physics_CylinderShape_getImpl));
    cls->defineFunction("getMask", _SE(js_physics_CylinderShape_getMask));
    cls->defineFunction("initialize", _SE(js_physics_CylinderShape_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_CylinderShape_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_CylinderShape_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_CylinderShape_onEnable));
    cls->defineFunction("setAsTrigger", _SE(js_physics_CylinderShape_setAsTrigger));
    cls->defineFunction("setCenter", _SE(js_physics_CylinderShape_setCenter));
    cls->defineFunction("setConvex", _SE(js_physics_CylinderShape_setConvex));
    cls->defineFunction("setCylinder", _SE(js_physics_CylinderShape_setCylinder));
    cls->defineFunction("setGroup", _SE(js_physics_CylinderShape_setGroup));
    cls->defineFunction("setMask", _SE(js_physics_CylinderShape_setMask));
    cls->defineFunction("setMaterial", _SE(js_physics_CylinderShape_setMaterial));
    cls->defineFunction("updateEventListener", _SE(js_physics_CylinderShape_updateEventListener));
    cls->defineFinalizeFunction(_SE(js_cc_physics_CylinderShape_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::CylinderShape>(cls);

    __jsb_cc_physics_CylinderShape_proto = cls->getProto();
    __jsb_cc_physics_CylinderShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_ConeShape_proto = nullptr;
se::Class* __jsb_cc_physics_ConeShape_class = nullptr;

static bool js_physics_ConeShape_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_getAABB)

static bool js_physics_ConeShape_getBoundingSphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_getBoundingSphere : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Sphere& result = cobj->getBoundingSphere();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_getBoundingSphere : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_getBoundingSphere)

static bool js_physics_ConeShape_getGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGroup();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_getGroup : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_getGroup)

static bool js_physics_ConeShape_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_getImpl)

static bool js_physics_ConeShape_getMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_getMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_getMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_getMask)

static bool js_physics_ConeShape_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_initialize)

static bool js_physics_ConeShape_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_onDestroy)

static bool js_physics_ConeShape_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_onDisable)

static bool js_physics_ConeShape_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_onEnable)

static bool js_physics_ConeShape_setAsTrigger(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_setAsTrigger : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_setAsTrigger : Error processing arguments");
        cobj->setAsTrigger(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_setAsTrigger)

static bool js_physics_ConeShape_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_setCenter)

static bool js_physics_ConeShape_setCone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_setCone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<cc::physics::EAxisDirection, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_setCone : Error processing arguments");
        cobj->setCone(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_setCone)

static bool js_physics_ConeShape_setConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_setConvex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<uintptr_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_setConvex : Error processing arguments");
        cobj->setConvex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_setConvex)

static bool js_physics_ConeShape_setGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_setGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_setGroup : Error processing arguments");
        cobj->setGroup(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_setGroup)

static bool js_physics_ConeShape_setMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_setMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_setMask : Error processing arguments");
        cobj->setMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_setMask)

static bool js_physics_ConeShape_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_setMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<unsigned short, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<uint8_t, false> arg4 = {};
        HolderType<uint8_t, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_setMaterial)

static bool js_physics_ConeShape_updateEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_ConeShape_updateEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::EShapeFilterFlag, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_ConeShape_updateEventListener : Error processing arguments");
        cobj->updateEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_ConeShape_updateEventListener)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_ConeShape_finalize)

static bool js_physics_ConeShape_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::ConeShape* cobj = JSB_ALLOC(cc::physics::ConeShape);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_ConeShape_constructor, __jsb_cc_physics_ConeShape_class, js_cc_physics_ConeShape_finalize)



static bool js_cc_physics_ConeShape_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::ConeShape>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::ConeShape>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_ConeShape_finalize)

bool js_register_physics_ConeShape(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ConeShape", obj, nullptr, _SE(js_physics_ConeShape_constructor));

    cls->defineFunction("getAABB", _SE(js_physics_ConeShape_getAABB));
    cls->defineFunction("getBoundingSphere", _SE(js_physics_ConeShape_getBoundingSphere));
    cls->defineFunction("getGroup", _SE(js_physics_ConeShape_getGroup));
    cls->defineFunction("getImpl", _SE(js_physics_ConeShape_getImpl));
    cls->defineFunction("getMask", _SE(js_physics_ConeShape_getMask));
    cls->defineFunction("initialize", _SE(js_physics_ConeShape_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_ConeShape_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_ConeShape_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_ConeShape_onEnable));
    cls->defineFunction("setAsTrigger", _SE(js_physics_ConeShape_setAsTrigger));
    cls->defineFunction("setCenter", _SE(js_physics_ConeShape_setCenter));
    cls->defineFunction("setCone", _SE(js_physics_ConeShape_setCone));
    cls->defineFunction("setConvex", _SE(js_physics_ConeShape_setConvex));
    cls->defineFunction("setGroup", _SE(js_physics_ConeShape_setGroup));
    cls->defineFunction("setMask", _SE(js_physics_ConeShape_setMask));
    cls->defineFunction("setMaterial", _SE(js_physics_ConeShape_setMaterial));
    cls->defineFunction("updateEventListener", _SE(js_physics_ConeShape_updateEventListener));
    cls->defineFinalizeFunction(_SE(js_cc_physics_ConeShape_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::ConeShape>(cls);

    __jsb_cc_physics_ConeShape_proto = cls->getProto();
    __jsb_cc_physics_ConeShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_TerrainShape_proto = nullptr;
se::Class* __jsb_cc_physics_TerrainShape_class = nullptr;

static bool js_physics_TerrainShape_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_getAABB)

static bool js_physics_TerrainShape_getBoundingSphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_getBoundingSphere : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Sphere& result = cobj->getBoundingSphere();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_getBoundingSphere : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_getBoundingSphere)

static bool js_physics_TerrainShape_getGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGroup();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_getGroup : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_getGroup)

static bool js_physics_TerrainShape_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_getImpl)

static bool js_physics_TerrainShape_getMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_getMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_getMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_getMask)

static bool js_physics_TerrainShape_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_initialize)

static bool js_physics_TerrainShape_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_onDestroy)

static bool js_physics_TerrainShape_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_onDisable)

static bool js_physics_TerrainShape_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_onEnable)

static bool js_physics_TerrainShape_setAsTrigger(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_setAsTrigger : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_setAsTrigger : Error processing arguments");
        cobj->setAsTrigger(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_setAsTrigger)

static bool js_physics_TerrainShape_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_setCenter)

static bool js_physics_TerrainShape_setGroup(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_setGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_setGroup : Error processing arguments");
        cobj->setGroup(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_setGroup)

static bool js_physics_TerrainShape_setMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_setMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_setMask : Error processing arguments");
        cobj->setMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_setMask)

static bool js_physics_TerrainShape_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_setMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<unsigned short, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<uint8_t, false> arg4 = {};
        HolderType<uint8_t, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_setMaterial)

static bool js_physics_TerrainShape_setTerrain(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_setTerrain : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<uintptr_t, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_setTerrain : Error processing arguments");
        cobj->setTerrain(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_setTerrain)

static bool js_physics_TerrainShape_updateEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_TerrainShape_updateEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::physics::EShapeFilterFlag, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_TerrainShape_updateEventListener : Error processing arguments");
        cobj->updateEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_TerrainShape_updateEventListener)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_TerrainShape_finalize)

static bool js_physics_TerrainShape_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::TerrainShape* cobj = JSB_ALLOC(cc::physics::TerrainShape);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_TerrainShape_constructor, __jsb_cc_physics_TerrainShape_class, js_cc_physics_TerrainShape_finalize)



static bool js_cc_physics_TerrainShape_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::TerrainShape>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::TerrainShape>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_TerrainShape_finalize)

bool js_register_physics_TerrainShape(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TerrainShape", obj, nullptr, _SE(js_physics_TerrainShape_constructor));

    cls->defineFunction("getAABB", _SE(js_physics_TerrainShape_getAABB));
    cls->defineFunction("getBoundingSphere", _SE(js_physics_TerrainShape_getBoundingSphere));
    cls->defineFunction("getGroup", _SE(js_physics_TerrainShape_getGroup));
    cls->defineFunction("getImpl", _SE(js_physics_TerrainShape_getImpl));
    cls->defineFunction("getMask", _SE(js_physics_TerrainShape_getMask));
    cls->defineFunction("initialize", _SE(js_physics_TerrainShape_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_TerrainShape_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_TerrainShape_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_TerrainShape_onEnable));
    cls->defineFunction("setAsTrigger", _SE(js_physics_TerrainShape_setAsTrigger));
    cls->defineFunction("setCenter", _SE(js_physics_TerrainShape_setCenter));
    cls->defineFunction("setGroup", _SE(js_physics_TerrainShape_setGroup));
    cls->defineFunction("setMask", _SE(js_physics_TerrainShape_setMask));
    cls->defineFunction("setMaterial", _SE(js_physics_TerrainShape_setMaterial));
    cls->defineFunction("setTerrain", _SE(js_physics_TerrainShape_setTerrain));
    cls->defineFunction("updateEventListener", _SE(js_physics_TerrainShape_updateEventListener));
    cls->defineFinalizeFunction(_SE(js_cc_physics_TerrainShape_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::TerrainShape>(cls);

    __jsb_cc_physics_TerrainShape_proto = cls->getProto();
    __jsb_cc_physics_TerrainShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_RevoluteJoint_proto = nullptr;
se::Class* __jsb_cc_physics_RevoluteJoint_class = nullptr;

static bool js_physics_RevoluteJoint_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_RevoluteJoint_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_getImpl)

static bool js_physics_RevoluteJoint_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RevoluteJoint_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_initialize)

static bool js_physics_RevoluteJoint_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_onDestroy)

static bool js_physics_RevoluteJoint_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_onDisable)

static bool js_physics_RevoluteJoint_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_onEnable)

static bool js_physics_RevoluteJoint_setAxis(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_setAxis : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RevoluteJoint_setAxis : Error processing arguments");
        cobj->setAxis(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_setAxis)

static bool js_physics_RevoluteJoint_setConnectedBody(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_setConnectedBody : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<uintptr_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RevoluteJoint_setConnectedBody : Error processing arguments");
        cobj->setConnectedBody(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_setConnectedBody)

static bool js_physics_RevoluteJoint_setEnableCollision(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_setEnableCollision : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RevoluteJoint_setEnableCollision : Error processing arguments");
        cobj->setEnableCollision(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_setEnableCollision)

static bool js_physics_RevoluteJoint_setPivotA(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_setPivotA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RevoluteJoint_setPivotA : Error processing arguments");
        cobj->setPivotA(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_setPivotA)

static bool js_physics_RevoluteJoint_setPivotB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_RevoluteJoint_setPivotB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_RevoluteJoint_setPivotB : Error processing arguments");
        cobj->setPivotB(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_RevoluteJoint_setPivotB)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_RevoluteJoint_finalize)

static bool js_physics_RevoluteJoint_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::RevoluteJoint* cobj = JSB_ALLOC(cc::physics::RevoluteJoint);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_RevoluteJoint_constructor, __jsb_cc_physics_RevoluteJoint_class, js_cc_physics_RevoluteJoint_finalize)



static bool js_cc_physics_RevoluteJoint_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::RevoluteJoint>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_RevoluteJoint_finalize)

bool js_register_physics_RevoluteJoint(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RevoluteJoint", obj, nullptr, _SE(js_physics_RevoluteJoint_constructor));

    cls->defineFunction("getImpl", _SE(js_physics_RevoluteJoint_getImpl));
    cls->defineFunction("initialize", _SE(js_physics_RevoluteJoint_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_RevoluteJoint_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_RevoluteJoint_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_RevoluteJoint_onEnable));
    cls->defineFunction("setAxis", _SE(js_physics_RevoluteJoint_setAxis));
    cls->defineFunction("setConnectedBody", _SE(js_physics_RevoluteJoint_setConnectedBody));
    cls->defineFunction("setEnableCollision", _SE(js_physics_RevoluteJoint_setEnableCollision));
    cls->defineFunction("setPivotA", _SE(js_physics_RevoluteJoint_setPivotA));
    cls->defineFunction("setPivotB", _SE(js_physics_RevoluteJoint_setPivotB));
    cls->defineFinalizeFunction(_SE(js_cc_physics_RevoluteJoint_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::RevoluteJoint>(cls);

    __jsb_cc_physics_RevoluteJoint_proto = cls->getProto();
    __jsb_cc_physics_RevoluteJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_physics_DistanceJoint_proto = nullptr;
se::Class* __jsb_cc_physics_DistanceJoint_class = nullptr;

static bool js_physics_DistanceJoint_getImpl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_DistanceJoint_getImpl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uintptr_t result = cobj->getImpl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_physics_DistanceJoint_getImpl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_DistanceJoint_getImpl)

static bool js_physics_DistanceJoint_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_DistanceJoint_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_DistanceJoint_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_DistanceJoint_initialize)

static bool js_physics_DistanceJoint_onDestroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_DistanceJoint_onDestroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_DistanceJoint_onDestroy)

static bool js_physics_DistanceJoint_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_DistanceJoint_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_DistanceJoint_onDisable)

static bool js_physics_DistanceJoint_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_DistanceJoint_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_physics_DistanceJoint_onEnable)

static bool js_physics_DistanceJoint_setConnectedBody(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_DistanceJoint_setConnectedBody : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<uintptr_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_DistanceJoint_setConnectedBody : Error processing arguments");
        cobj->setConnectedBody(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_DistanceJoint_setConnectedBody)

static bool js_physics_DistanceJoint_setEnableCollision(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_DistanceJoint_setEnableCollision : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_DistanceJoint_setEnableCollision : Error processing arguments");
        cobj->setEnableCollision(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_physics_DistanceJoint_setEnableCollision)

static bool js_physics_DistanceJoint_setPivotA(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_DistanceJoint_setPivotA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_DistanceJoint_setPivotA : Error processing arguments");
        cobj->setPivotA(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_DistanceJoint_setPivotA)

static bool js_physics_DistanceJoint_setPivotB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
    SE_PRECONDITION2(cobj, false, "js_physics_DistanceJoint_setPivotB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_physics_DistanceJoint_setPivotB : Error processing arguments");
        cobj->setPivotB(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_physics_DistanceJoint_setPivotB)

SE_DECLARE_FINALIZE_FUNC(js_cc_physics_DistanceJoint_finalize)

static bool js_physics_DistanceJoint_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::physics::DistanceJoint* cobj = JSB_ALLOC(cc::physics::DistanceJoint);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_physics_DistanceJoint_constructor, __jsb_cc_physics_DistanceJoint_class, js_cc_physics_DistanceJoint_finalize)



static bool js_cc_physics_DistanceJoint_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::physics::DistanceJoint>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::physics::DistanceJoint>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_physics_DistanceJoint_finalize)

bool js_register_physics_DistanceJoint(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DistanceJoint", obj, nullptr, _SE(js_physics_DistanceJoint_constructor));

    cls->defineFunction("getImpl", _SE(js_physics_DistanceJoint_getImpl));
    cls->defineFunction("initialize", _SE(js_physics_DistanceJoint_initialize));
    cls->defineFunction("onDestroy", _SE(js_physics_DistanceJoint_onDestroy));
    cls->defineFunction("onDisable", _SE(js_physics_DistanceJoint_onDisable));
    cls->defineFunction("onEnable", _SE(js_physics_DistanceJoint_onEnable));
    cls->defineFunction("setConnectedBody", _SE(js_physics_DistanceJoint_setConnectedBody));
    cls->defineFunction("setEnableCollision", _SE(js_physics_DistanceJoint_setEnableCollision));
    cls->defineFunction("setPivotA", _SE(js_physics_DistanceJoint_setPivotA));
    cls->defineFunction("setPivotB", _SE(js_physics_DistanceJoint_setPivotB));
    cls->defineFinalizeFunction(_SE(js_cc_physics_DistanceJoint_finalize));
    cls->install();
    JSBClassType::registerClass<cc::physics::DistanceJoint>(cls);

    __jsb_cc_physics_DistanceJoint_proto = cls->getProto();
    __jsb_cc_physics_DistanceJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_physics(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb.physics", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb.physics", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_physics_World(ns);
    js_register_physics_RigidBody(ns);
    js_register_physics_SphereShape(ns);
    js_register_physics_BoxShape(ns);
    js_register_physics_CapsuleShape(ns);
    js_register_physics_PlaneShape(ns);
    js_register_physics_TrimeshShape(ns);
    js_register_physics_CylinderShape(ns);
    js_register_physics_ConeShape(ns);
    js_register_physics_TerrainShape(ns);
    js_register_physics_RevoluteJoint(ns);
    js_register_physics_DistanceJoint(ns);
    return true;
}

