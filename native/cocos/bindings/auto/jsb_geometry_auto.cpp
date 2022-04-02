
// clang-format off
#include "cocos/bindings/auto/jsb_geometry_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "core/geometry/Geometry.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_geometry_ShapeBase_proto = nullptr; // NOLINT
se::Class* __jsb_cc_geometry_ShapeBase_class = nullptr;  // NOLINT

static bool js_geometry_ShapeBase_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::ShapeBase>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_ShapeBase_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_ShapeBase_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_geometry_ShapeBase_getType)

static bool js_geometry_ShapeBase_setType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::ShapeBase>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_ShapeBase_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::ShapeEnum, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_ShapeBase_setType : Error processing arguments");
        cobj->setType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_geometry_ShapeBase_setType)

bool js_register_geometry_ShapeBase(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ShapeBase", obj, nullptr, nullptr);

    cls->defineProperty("_type", _SE(js_geometry_ShapeBase_getType_asGetter), _SE(js_geometry_ShapeBase_setType_asSetter));
    cls->install();
    JSBClassType::registerClass<cc::geometry::ShapeBase>(cls);

    __jsb_cc_geometry_ShapeBase_proto = cls->getProto();
    __jsb_cc_geometry_ShapeBase_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_geometry_AABB_proto = nullptr; // NOLINT
se::Class* __jsb_cc_geometry_AABB_class = nullptr;  // NOLINT

static bool js_geometry_AABB_contain(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::AABB>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_AABB_contain : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_AABB_contain : Error processing arguments");
        bool result = cobj->contain(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_AABB_contain : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_AABB_contain)

static bool js_geometry_AABB_create_static(se::State& s) // NOLINT(readability-identifier-naming)
{
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
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_AABB_create_static : Error processing arguments");
        cc::geometry::AABB* result = cc::geometry::AABB::create(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_AABB_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_geometry_AABB_create_static)

static bool js_geometry_AABB_toBoundingSphere_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::geometry::Sphere*, false> arg0 = {};
        HolderType<cc::geometry::AABB, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_AABB_toBoundingSphere_static : Error processing arguments");
        cc::geometry::Sphere* result = cc::geometry::AABB::toBoundingSphere(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_AABB_toBoundingSphere_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_geometry_AABB_toBoundingSphere_static)

static bool js_geometry_AABB_get_center(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::AABB>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_AABB_get_center : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->center, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->center, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_geometry_AABB_get_center)

static bool js_geometry_AABB_set_center(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::geometry::AABB>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_AABB_set_center : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->center, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_geometry_AABB_set_center : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_geometry_AABB_set_center)

static bool js_geometry_AABB_get_halfExtents(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::AABB>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_AABB_get_halfExtents : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->halfExtents, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->halfExtents, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_geometry_AABB_get_halfExtents)

static bool js_geometry_AABB_set_halfExtents(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::geometry::AABB>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_AABB_set_halfExtents : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->halfExtents, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_geometry_AABB_set_halfExtents : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_geometry_AABB_set_halfExtents)

SE_DECLARE_FINALIZE_FUNC(js_cc_geometry_AABB_finalize)

static bool js_geometry_AABB_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::AABB);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 6) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg5 = {};
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::AABB, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_geometry_AABB_constructor, __jsb_cc_geometry_AABB_class, js_cc_geometry_AABB_finalize)

static bool js_cc_geometry_AABB_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_geometry_AABB_finalize)

bool js_register_geometry_AABB(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AABB", obj, __jsb_cc_geometry_ShapeBase_proto, _SE(js_geometry_AABB_constructor));

    cls->defineProperty("center", _SE(js_geometry_AABB_get_center), _SE(js_geometry_AABB_set_center));
    cls->defineProperty("halfExtents", _SE(js_geometry_AABB_get_halfExtents), _SE(js_geometry_AABB_set_halfExtents));
    cls->defineFunction("contain", _SE(js_geometry_AABB_contain));
    cls->defineStaticFunction("create", _SE(js_geometry_AABB_create_static));
    cls->defineStaticFunction("toBoundingSphere", _SE(js_geometry_AABB_toBoundingSphere_static));
    cls->defineFinalizeFunction(_SE(js_cc_geometry_AABB_finalize));
    cls->install();
    JSBClassType::registerClass<cc::geometry::AABB>(cls);

    __jsb_cc_geometry_AABB_proto = cls->getProto();
    __jsb_cc_geometry_AABB_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_geometry_Capsule_proto = nullptr; // NOLINT
se::Class* __jsb_cc_geometry_Capsule_class = nullptr;  // NOLINT

static bool js_geometry_Capsule_transform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Capsule>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Capsule_transform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<cc::Mat4, true> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        HolderType<cc::Quaternion, true> arg2 = {};
        HolderType<cc::Vec3, true> arg3 = {};
        HolderType<cc::geometry::Capsule*, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Capsule_transform : Error processing arguments");
        cobj->transform(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_geometry_Capsule_transform)

SE_DECLARE_FINALIZE_FUNC(js_cc_geometry_Capsule_finalize)

static bool js_geometry_Capsule_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::geometry::Capsule, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Capsule, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Capsule);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Capsule, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Capsule, arg0.value(), arg1.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<cc::geometry::Capsule::CenterEnum, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Capsule, arg0.value(), arg1.value(), arg2.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_geometry_Capsule_constructor, __jsb_cc_geometry_Capsule_class, js_cc_geometry_Capsule_finalize)

static bool js_cc_geometry_Capsule_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_geometry_Capsule_finalize)

bool js_register_geometry_Capsule(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Capsule", obj, __jsb_cc_geometry_ShapeBase_proto, _SE(js_geometry_Capsule_constructor));

    cls->defineFunction("transform", _SE(js_geometry_Capsule_transform));
    cls->defineFinalizeFunction(_SE(js_cc_geometry_Capsule_finalize));
    cls->install();
    JSBClassType::registerClass<cc::geometry::Capsule>(cls);

    __jsb_cc_geometry_Capsule_proto = cls->getProto();
    __jsb_cc_geometry_Capsule_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_geometry_Plane_proto = nullptr; // NOLINT
se::Class* __jsb_cc_geometry_Plane_class = nullptr;  // NOLINT

static bool js_geometry_Plane_define(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2( cobj, false, "js_geometry_Plane_define : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<cc::Vec3, true> arg0 = {};
            HolderType<cc::Vec3, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->define(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<cc::Vec3, true> arg0 = {};
            HolderType<cc::Vec3, true> arg1 = {};
            HolderType<cc::Vec3, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->define(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_geometry_Plane_define)

static bool js_geometry_Plane_distance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_distance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Plane_distance : Error processing arguments");
        float result = cobj->distance(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Plane_distance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Plane_distance)

static bool js_geometry_Plane_getW(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_getW : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getW();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Plane_getW : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Plane_getW)

static bool js_geometry_Plane_getX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Plane_getX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Plane_getX)

static bool js_geometry_Plane_getY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Plane_getY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Plane_getY)

static bool js_geometry_Plane_getZ(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_getZ : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getZ();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Plane_getZ : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Plane_getZ)

static bool js_geometry_Plane_transform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_transform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Mat4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Plane_transform : Error processing arguments");
        cobj->transform(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Plane_transform)

static bool js_geometry_Plane_create_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Plane_create_static : Error processing arguments");
        cc::geometry::Plane* result = cc::geometry::Plane::create(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Plane_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_geometry_Plane_create_static)

static bool js_geometry_Plane_get_n(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_get_n : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->n, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->n, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_geometry_Plane_get_n)

static bool js_geometry_Plane_set_n(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_set_n : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->n, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_geometry_Plane_set_n : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_geometry_Plane_set_n)

static bool js_geometry_Plane_get_d(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_get_d : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->d, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->d, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_geometry_Plane_get_d)

static bool js_geometry_Plane_set_d(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Plane_set_d : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->d, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_geometry_Plane_set_d : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_geometry_Plane_set_d)

SE_DECLARE_FINALIZE_FUNC(js_cc_geometry_Plane_finalize)

static bool js_geometry_Plane_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Plane);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 4) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Plane, arg0.value(), arg1.value(), arg2.value(), arg3.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_geometry_Plane_constructor, __jsb_cc_geometry_Plane_class, js_cc_geometry_Plane_finalize)

static bool js_cc_geometry_Plane_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_geometry_Plane_finalize)

bool js_register_geometry_Plane(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Plane", obj, __jsb_cc_geometry_ShapeBase_proto, _SE(js_geometry_Plane_constructor));

    cls->defineProperty("n", _SE(js_geometry_Plane_get_n), _SE(js_geometry_Plane_set_n));
    cls->defineProperty("d", _SE(js_geometry_Plane_get_d), _SE(js_geometry_Plane_set_d));
    cls->defineFunction("define", _SE(js_geometry_Plane_define));
    cls->defineFunction("distance", _SE(js_geometry_Plane_distance));
    cls->defineFunction("getW", _SE(js_geometry_Plane_getW));
    cls->defineFunction("getX", _SE(js_geometry_Plane_getX));
    cls->defineFunction("getY", _SE(js_geometry_Plane_getY));
    cls->defineFunction("getZ", _SE(js_geometry_Plane_getZ));
    cls->defineFunction("transform", _SE(js_geometry_Plane_transform));
    cls->defineStaticFunction("create", _SE(js_geometry_Plane_create_static));
    cls->defineFinalizeFunction(_SE(js_cc_geometry_Plane_finalize));
    cls->install();
    JSBClassType::registerClass<cc::geometry::Plane>(cls);

    __jsb_cc_geometry_Plane_proto = cls->getProto();
    __jsb_cc_geometry_Plane_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_geometry_Frustum_proto = nullptr; // NOLINT
se::Class* __jsb_cc_geometry_Frustum_class = nullptr;  // NOLINT

static bool js_geometry_Frustum_clone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Frustum_clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::geometry::Frustum result = cobj->clone();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_clone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Frustum_clone)

static bool js_geometry_Frustum_createOrtho(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Frustum_createOrtho : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<cc::Mat4, true> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_createOrtho : Error processing arguments");
        cobj->createOrtho(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_geometry_Frustum_createOrtho)

static bool js_geometry_Frustum_setAccurate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Frustum_setAccurate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_setAccurate : Error processing arguments");
        cobj->setAccurate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Frustum_setAccurate)

static bool js_geometry_Frustum_transform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Frustum_transform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Mat4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_transform : Error processing arguments");
        cobj->transform(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Frustum_transform)

static bool js_geometry_Frustum_clone_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Frustum, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_clone_static : Error processing arguments");
        cc::geometry::Frustum* result = cc::geometry::Frustum::clone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_clone_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Frustum_clone_static)

static bool js_geometry_Frustum_copy_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::geometry::Frustum*, false> arg0 = {};
        HolderType<cc::geometry::Frustum, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_copy_static : Error processing arguments");
        cc::geometry::Frustum* result = cc::geometry::Frustum::copy(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_copy_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_geometry_Frustum_copy_static)

static bool js_geometry_Frustum_create_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::geometry::Frustum* result = cc::geometry::Frustum::create();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Frustum_create_static)

static bool js_geometry_Frustum_createFromAABB_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::geometry::Frustum*, false> arg0 = {};
        HolderType<cc::geometry::AABB, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_createFromAABB_static : Error processing arguments");
        cc::geometry::Frustum* result = cc::geometry::Frustum::createFromAABB(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_createFromAABB_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_geometry_Frustum_createFromAABB_static)

static bool js_geometry_Frustum_createOrtho_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<cc::geometry::Frustum*, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<cc::Mat4, true> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Frustum_createOrtho_static : Error processing arguments");
        cc::geometry::Frustum::createOrtho(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_geometry_Frustum_createOrtho_static)

static bool js_geometry_Frustum_get_vertices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Frustum_get_vertices : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertices, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertices, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_geometry_Frustum_get_vertices)

static bool js_geometry_Frustum_set_vertices(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Frustum_set_vertices : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertices, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_geometry_Frustum_set_vertices : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_geometry_Frustum_set_vertices)

static bool js_geometry_Frustum_get_planes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Frustum_get_planes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->planes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->planes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_geometry_Frustum_get_planes)

static bool js_geometry_Frustum_set_planes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Frustum_set_planes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->planes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_geometry_Frustum_set_planes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_geometry_Frustum_set_planes)

SE_DECLARE_FINALIZE_FUNC(js_cc_geometry_Frustum_finalize)

static bool js_geometry_Frustum_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Frustum);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_geometry_Frustum_constructor, __jsb_cc_geometry_Frustum_class, js_cc_geometry_Frustum_finalize)

static bool js_cc_geometry_Frustum_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_geometry_Frustum_finalize)

bool js_register_geometry_Frustum(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Frustum", obj, __jsb_cc_geometry_ShapeBase_proto, _SE(js_geometry_Frustum_constructor));

    cls->defineProperty("vertices", _SE(js_geometry_Frustum_get_vertices), _SE(js_geometry_Frustum_set_vertices));
    cls->defineProperty("planes", _SE(js_geometry_Frustum_get_planes), _SE(js_geometry_Frustum_set_planes));
    cls->defineFunction("clone", _SE(js_geometry_Frustum_clone));
    cls->defineFunction("createOrtho", _SE(js_geometry_Frustum_createOrtho));
    cls->defineFunction("setAccurate", _SE(js_geometry_Frustum_setAccurate));
    cls->defineFunction("transform", _SE(js_geometry_Frustum_transform));
    cls->defineStaticFunction("clone", _SE(js_geometry_Frustum_clone_static));
    cls->defineStaticFunction("copy", _SE(js_geometry_Frustum_copy_static));
    cls->defineStaticFunction("create", _SE(js_geometry_Frustum_create_static));
    cls->defineStaticFunction("createFromAABB", _SE(js_geometry_Frustum_createFromAABB_static));
    cls->defineStaticFunction("createOrtho", _SE(js_geometry_Frustum_createOrtho_static));
    cls->defineFinalizeFunction(_SE(js_cc_geometry_Frustum_finalize));
    cls->install();
    JSBClassType::registerClass<cc::geometry::Frustum>(cls);

    __jsb_cc_geometry_Frustum_proto = cls->getProto();
    __jsb_cc_geometry_Frustum_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_geometry_Line_proto = nullptr; // NOLINT
se::Class* __jsb_cc_geometry_Line_class = nullptr;  // NOLINT

static bool js_geometry_Line_length(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Line>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Line_length : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->length();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_length : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Line_length)

static bool js_geometry_Line_clone_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Line, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_clone_static : Error processing arguments");
        cc::geometry::Line* result = cc::geometry::Line::clone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_clone_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Line_clone_static)

static bool js_geometry_Line_copy_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::geometry::Line*, false> arg0 = {};
        HolderType<cc::geometry::Line, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_copy_static : Error processing arguments");
        cc::geometry::Line* result = cc::geometry::Line::copy(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_copy_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_geometry_Line_copy_static)

static bool js_geometry_Line_create_static(se::State& s) // NOLINT(readability-identifier-naming)
{
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
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_create_static : Error processing arguments");
        cc::geometry::Line* result = cc::geometry::Line::create(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_geometry_Line_create_static)

static bool js_geometry_Line_fromPoints_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::geometry::Line*, false> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        HolderType<cc::Vec3, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_fromPoints_static : Error processing arguments");
        cc::geometry::Line* result = cc::geometry::Line::fromPoints(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_fromPoints_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_geometry_Line_fromPoints_static)

static bool js_geometry_Line_len_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Line, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_len_static : Error processing arguments");
        float result = cc::geometry::Line::len(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_len_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Line_len_static)

static bool js_geometry_Line_set_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 7) {
        HolderType<cc::geometry::Line*, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        HolderType<float, false> arg6 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        ok &= sevalue_to_native(args[6], &arg6, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_set_static : Error processing arguments");
        cc::geometry::Line* result = cc::geometry::Line::set(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Line_set_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_geometry_Line_set_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_geometry_Line_finalize)

static bool js_geometry_Line_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::geometry::Line, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Line, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Line);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Line, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Line, arg0.value(), arg1.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Line, arg0.value(), arg1.value(), arg2.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 4) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Line, arg0.value(), arg1.value(), arg2.value(), arg3.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 5) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Line, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 6) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg5 = {};
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Line, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_geometry_Line_constructor, __jsb_cc_geometry_Line_class, js_cc_geometry_Line_finalize)

static bool js_cc_geometry_Line_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_geometry_Line_finalize)

bool js_register_geometry_Line(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Line", obj, __jsb_cc_geometry_ShapeBase_proto, _SE(js_geometry_Line_constructor));

    cls->defineFunction("length", _SE(js_geometry_Line_length));
    cls->defineStaticFunction("clone", _SE(js_geometry_Line_clone_static));
    cls->defineStaticFunction("copy", _SE(js_geometry_Line_copy_static));
    cls->defineStaticFunction("create", _SE(js_geometry_Line_create_static));
    cls->defineStaticFunction("fromPoints", _SE(js_geometry_Line_fromPoints_static));
    cls->defineStaticFunction("len", _SE(js_geometry_Line_len_static));
    cls->defineStaticFunction("set", _SE(js_geometry_Line_set_static));
    cls->defineFinalizeFunction(_SE(js_cc_geometry_Line_finalize));
    cls->install();
    JSBClassType::registerClass<cc::geometry::Line>(cls);

    __jsb_cc_geometry_Line_proto = cls->getProto();
    __jsb_cc_geometry_Line_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_geometry_Ray_proto = nullptr; // NOLINT
se::Class* __jsb_cc_geometry_Ray_class = nullptr;  // NOLINT

static bool js_geometry_Ray_clone_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Ray, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_clone_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::clone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_clone_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Ray_clone_static)

static bool js_geometry_Ray_copy_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::geometry::Ray*, false> arg0 = {};
        HolderType<cc::geometry::Ray, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_copy_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::copy(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_copy_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_geometry_Ray_copy_static)

static bool js_geometry_Ray_create_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::geometry::Ray* result = cc::geometry::Ray::create();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::create(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::create(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::create(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::create(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 5) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::create(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 6) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::create(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_geometry_Ray_create_static)

static bool js_geometry_Ray_fromPoints_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::geometry::Ray*, false> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        HolderType<cc::Vec3, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_fromPoints_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::fromPoints(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_fromPoints_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_geometry_Ray_fromPoints_static)

static bool js_geometry_Ray_set_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 7) {
        HolderType<cc::geometry::Ray*, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        HolderType<float, false> arg6 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        ok &= sevalue_to_native(args[6], &arg6, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_set_static : Error processing arguments");
        cc::geometry::Ray* result = cc::geometry::Ray::set(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Ray_set_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_geometry_Ray_set_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_geometry_Ray_finalize)

static bool js_geometry_Ray_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::geometry::Ray, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Ray, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Ray);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Ray, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Ray, arg0.value(), arg1.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Ray, arg0.value(), arg1.value(), arg2.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 4) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Ray, arg0.value(), arg1.value(), arg2.value(), arg3.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 5) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Ray, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 6) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg5 = {};
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Ray, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_geometry_Ray_constructor, __jsb_cc_geometry_Ray_class, js_cc_geometry_Ray_finalize)

static bool js_cc_geometry_Ray_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_geometry_Ray_finalize)

bool js_register_geometry_Ray(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Ray", obj, __jsb_cc_geometry_ShapeBase_proto, _SE(js_geometry_Ray_constructor));

    cls->defineStaticFunction("clone", _SE(js_geometry_Ray_clone_static));
    cls->defineStaticFunction("copy", _SE(js_geometry_Ray_copy_static));
    cls->defineStaticFunction("create", _SE(js_geometry_Ray_create_static));
    cls->defineStaticFunction("fromPoints", _SE(js_geometry_Ray_fromPoints_static));
    cls->defineStaticFunction("set", _SE(js_geometry_Ray_set_static));
    cls->defineFinalizeFunction(_SE(js_cc_geometry_Ray_finalize));
    cls->install();
    JSBClassType::registerClass<cc::geometry::Ray>(cls);

    __jsb_cc_geometry_Ray_proto = cls->getProto();
    __jsb_cc_geometry_Ray_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_geometry_Sphere_proto = nullptr; // NOLINT
se::Class* __jsb_cc_geometry_Sphere_class = nullptr;  // NOLINT

static bool js_geometry_Sphere_clone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::geometry::Sphere* result = cobj->clone();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_clone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_clone)

static bool js_geometry_Sphere_copy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Sphere*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_copy : Error processing arguments");
        cc::geometry::Sphere* result = cobj->copy(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_copy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_copy)

static bool js_geometry_Sphere_define(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_define : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::AABB, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_define : Error processing arguments");
        cobj->define(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_define)

static bool js_geometry_Sphere_getCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_getCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getCenter();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_getCenter : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_getCenter)

static bool js_geometry_Sphere_getRadius(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_getRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRadius();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_getRadius : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_getRadius)

static bool js_geometry_Sphere_interset(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2( cobj, false, "js_geometry_Sphere_interset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::geometry::Plane, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            int result = cobj->interset(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_geometry_Sphere_interset : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::geometry::Frustum, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->interset(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_geometry_Sphere_interset : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_interset)

static bool js_geometry_Sphere_merge(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2( cobj, false, "js_geometry_Sphere_merge : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::Vec3, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->merge(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::geometry::AABB*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->merge(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<std::vector<cc::Vec3>, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->merge(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::geometry::Frustum, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->merge(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_merge)

static bool js_geometry_Sphere_mergeAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_mergeAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<const cc::geometry::AABB*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_mergeAABB : Error processing arguments");
        cobj->mergeAABB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_mergeAABB)

static bool js_geometry_Sphere_mergeFrustum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_mergeFrustum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Frustum, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_mergeFrustum : Error processing arguments");
        cobj->mergeFrustum(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_mergeFrustum)

static bool js_geometry_Sphere_mergePoint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_mergePoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_mergePoint : Error processing arguments");
        cobj->mergePoint(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_mergePoint)

static bool js_geometry_Sphere_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_setCenter)

static bool js_geometry_Sphere_setRadius(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_setRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_setRadius : Error processing arguments");
        cobj->setRadius(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_setRadius)

static bool js_geometry_Sphere_setScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_setScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Vec3, true> arg0 = {};
        HolderType<cc::geometry::Sphere*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_setScale : Error processing arguments");
        cobj->setScale(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_setScale)

static bool js_geometry_Sphere_sphereFrustum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_sphereFrustum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Frustum, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_sphereFrustum : Error processing arguments");
        bool result = cobj->sphereFrustum(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_sphereFrustum : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_sphereFrustum)

static bool js_geometry_Sphere_spherePlane(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_spherePlane : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Plane, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_spherePlane : Error processing arguments");
        int result = cobj->spherePlane(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_spherePlane : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_spherePlane)

static bool js_geometry_Sphere_transform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_transform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<cc::Mat4, true> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        HolderType<cc::Quaternion, true> arg2 = {};
        HolderType<cc::Vec3, true> arg3 = {};
        HolderType<cc::geometry::Sphere*, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_transform : Error processing arguments");
        cobj->transform(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_transform)

static bool js_geometry_Sphere_translateAndRotate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::geometry::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_geometry_Sphere_translateAndRotate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::Mat4, true> arg0 = {};
        HolderType<cc::Quaternion, true> arg1 = {};
        HolderType<cc::geometry::Sphere*, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_translateAndRotate : Error processing arguments");
        cobj->translateAndRotate(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_translateAndRotate)

static bool js_geometry_Sphere_clone_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Sphere, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_clone_static : Error processing arguments");
        cc::geometry::Sphere* result = cc::geometry::Sphere::clone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_clone_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_clone_static)

static bool js_geometry_Sphere_copy_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::geometry::Sphere*, false> arg0 = {};
        HolderType<cc::geometry::Sphere, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_copy_static : Error processing arguments");
        cc::geometry::Sphere* result = cc::geometry::Sphere::copy(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_copy_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_copy_static)

static bool js_geometry_Sphere_create_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_create_static : Error processing arguments");
        cc::geometry::Sphere* result = cc::geometry::Sphere::create(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_create_static)

static bool js_geometry_Sphere_fromPoints_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::geometry::Sphere*, false> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        HolderType<cc::Vec3, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_fromPoints_static : Error processing arguments");
        cc::geometry::Sphere* result = cc::geometry::Sphere::fromPoints(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_fromPoints_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_fromPoints_static)

static bool js_geometry_Sphere_mergeAABB_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::geometry::Sphere*, false> arg0 = {};
        HolderType<cc::geometry::Sphere, true> arg1 = {};
        HolderType<cc::geometry::AABB, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_mergeAABB_static : Error processing arguments");
        cc::geometry::Sphere* result = cc::geometry::Sphere::mergeAABB(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_mergeAABB_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_mergeAABB_static)

static bool js_geometry_Sphere_mergePoint_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::geometry::Sphere*, false> arg0 = {};
        HolderType<cc::geometry::Sphere, true> arg1 = {};
        HolderType<cc::Vec3, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_mergePoint_static : Error processing arguments");
        cc::geometry::Sphere* result = cc::geometry::Sphere::mergePoint(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_mergePoint_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_mergePoint_static)

static bool js_geometry_Sphere_set_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<cc::geometry::Sphere*, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_set_static : Error processing arguments");
        cc::geometry::Sphere* result = cc::geometry::Sphere::set(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Sphere_set_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_geometry_Sphere_set_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_geometry_Sphere_finalize)

static bool js_geometry_Sphere_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Sphere);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_geometry_Sphere_constructor, __jsb_cc_geometry_Sphere_class, js_cc_geometry_Sphere_finalize)

static bool js_cc_geometry_Sphere_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_geometry_Sphere_finalize)

bool js_register_geometry_Sphere(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Sphere", obj, __jsb_cc_geometry_ShapeBase_proto, _SE(js_geometry_Sphere_constructor));

    cls->defineFunction("clone", _SE(js_geometry_Sphere_clone));
    cls->defineFunction("copy", _SE(js_geometry_Sphere_copy));
    cls->defineFunction("define", _SE(js_geometry_Sphere_define));
    cls->defineFunction("getCenter", _SE(js_geometry_Sphere_getCenter));
    cls->defineFunction("getRadius", _SE(js_geometry_Sphere_getRadius));
    cls->defineFunction("interset", _SE(js_geometry_Sphere_interset));
    cls->defineFunction("merge", _SE(js_geometry_Sphere_merge));
    cls->defineFunction("mergeAABB", _SE(js_geometry_Sphere_mergeAABB));
    cls->defineFunction("mergeFrustum", _SE(js_geometry_Sphere_mergeFrustum));
    cls->defineFunction("mergePoint", _SE(js_geometry_Sphere_mergePoint));
    cls->defineFunction("setCenter", _SE(js_geometry_Sphere_setCenter));
    cls->defineFunction("setRadius", _SE(js_geometry_Sphere_setRadius));
    cls->defineFunction("setScale", _SE(js_geometry_Sphere_setScale));
    cls->defineFunction("sphereFrustum", _SE(js_geometry_Sphere_sphereFrustum));
    cls->defineFunction("spherePlane", _SE(js_geometry_Sphere_spherePlane));
    cls->defineFunction("transform", _SE(js_geometry_Sphere_transform));
    cls->defineFunction("translateAndRotate", _SE(js_geometry_Sphere_translateAndRotate));
    cls->defineStaticFunction("clone", _SE(js_geometry_Sphere_clone_static));
    cls->defineStaticFunction("copy", _SE(js_geometry_Sphere_copy_static));
    cls->defineStaticFunction("create", _SE(js_geometry_Sphere_create_static));
    cls->defineStaticFunction("fromPoints", _SE(js_geometry_Sphere_fromPoints_static));
    cls->defineStaticFunction("mergeAABB", _SE(js_geometry_Sphere_mergeAABB_static));
    cls->defineStaticFunction("mergePoint", _SE(js_geometry_Sphere_mergePoint_static));
    cls->defineStaticFunction("set", _SE(js_geometry_Sphere_set_static));
    cls->defineFinalizeFunction(_SE(js_cc_geometry_Sphere_finalize));
    cls->install();
    JSBClassType::registerClass<cc::geometry::Sphere>(cls);

    __jsb_cc_geometry_Sphere_proto = cls->getProto();
    __jsb_cc_geometry_Sphere_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_geometry_Triangle_proto = nullptr; // NOLINT
se::Class* __jsb_cc_geometry_Triangle_class = nullptr;  // NOLINT

static bool js_geometry_Triangle_clone_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Triangle, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_clone_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::clone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_clone_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_geometry_Triangle_clone_static)

static bool js_geometry_Triangle_copy_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::geometry::Triangle*, false> arg0 = {};
        HolderType<cc::geometry::Triangle, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_copy_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::copy(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_copy_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_geometry_Triangle_copy_static)

static bool js_geometry_Triangle_create_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::geometry::Triangle* result = cc::geometry::Triangle::create();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::create(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::create(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::create(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::create(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 5) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::create(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 6) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::create(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 7) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        HolderType<float, false> arg6 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        ok &= sevalue_to_native(args[6], &arg6, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::create(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 8) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        HolderType<float, false> arg6 = {};
        HolderType<float, false> arg7 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        ok &= sevalue_to_native(args[6], &arg6, nullptr);
        ok &= sevalue_to_native(args[7], &arg7, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::create(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value(), arg7.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 9) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        HolderType<float, false> arg6 = {};
        HolderType<float, false> arg7 = {};
        HolderType<float, false> arg8 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        ok &= sevalue_to_native(args[6], &arg6, nullptr);
        ok &= sevalue_to_native(args[7], &arg7, nullptr);
        ok &= sevalue_to_native(args[8], &arg8, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::create(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value(), arg7.value(), arg8.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 9);
    return false;
}
SE_BIND_FUNC(js_geometry_Triangle_create_static)

static bool js_geometry_Triangle_fromPoints_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::geometry::Triangle*, false> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        HolderType<cc::Vec3, true> arg2 = {};
        HolderType<cc::Vec3, true> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_fromPoints_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::fromPoints(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_fromPoints_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_geometry_Triangle_fromPoints_static)

static bool js_geometry_Triangle_set_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 10) {
        HolderType<cc::geometry::Triangle*, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        HolderType<float, false> arg6 = {};
        HolderType<float, false> arg7 = {};
        HolderType<float, false> arg8 = {};
        HolderType<float, false> arg9 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        ok &= sevalue_to_native(args[4], &arg4, nullptr);
        ok &= sevalue_to_native(args[5], &arg5, nullptr);
        ok &= sevalue_to_native(args[6], &arg6, nullptr);
        ok &= sevalue_to_native(args[7], &arg7, nullptr);
        ok &= sevalue_to_native(args[8], &arg8, nullptr);
        ok &= sevalue_to_native(args[9], &arg9, nullptr);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_set_static : Error processing arguments");
        cc::geometry::Triangle* result = cc::geometry::Triangle::set(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value(), arg7.value(), arg8.value(), arg9.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_geometry_Triangle_set_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 10);
    return false;
}
SE_BIND_FUNC(js_geometry_Triangle_set_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_geometry_Triangle_finalize)

static bool js_geometry_Triangle_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::geometry::Triangle, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value(), arg1.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value(), arg1.value(), arg2.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 4) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value(), arg1.value(), arg2.value(), arg3.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 5) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 6) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg5 = {};
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 7) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg5 = {};
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg6 = {};
            ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 8) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg5 = {};
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg6 = {};
            ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg7 = {};
            ok &= sevalue_to_native(args[7], &arg7, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value(), arg7.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 9) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg5 = {};
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg6 = {};
            ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg7 = {};
            ok &= sevalue_to_native(args[7], &arg7, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg8 = {};
            ok &= sevalue_to_native(args[8], &arg8, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::geometry::Triangle, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value(), arg7.value(), arg8.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_geometry_Triangle_constructor, __jsb_cc_geometry_Triangle_class, js_cc_geometry_Triangle_finalize)

static bool js_cc_geometry_Triangle_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_geometry_Triangle_finalize)

bool js_register_geometry_Triangle(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Triangle", obj, __jsb_cc_geometry_ShapeBase_proto, _SE(js_geometry_Triangle_constructor));

    cls->defineStaticFunction("clone", _SE(js_geometry_Triangle_clone_static));
    cls->defineStaticFunction("copy", _SE(js_geometry_Triangle_copy_static));
    cls->defineStaticFunction("create", _SE(js_geometry_Triangle_create_static));
    cls->defineStaticFunction("fromPoints", _SE(js_geometry_Triangle_fromPoints_static));
    cls->defineStaticFunction("set", _SE(js_geometry_Triangle_set_static));
    cls->defineFinalizeFunction(_SE(js_cc_geometry_Triangle_finalize));
    cls->install();
    JSBClassType::registerClass<cc::geometry::Triangle>(cls);

    __jsb_cc_geometry_Triangle_proto = cls->getProto();
    __jsb_cc_geometry_Triangle_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_geometry(se::Object* obj)    // NOLINT
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("ns", &nsVal, true))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("ns", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_geometry_ShapeBase(ns);
    js_register_geometry_AABB(ns);
    js_register_geometry_Capsule(ns);
    js_register_geometry_Frustum(ns);
    js_register_geometry_Line(ns);
    js_register_geometry_Plane(ns);
    js_register_geometry_Ray(ns);
    js_register_geometry_Sphere(ns);
    js_register_geometry_Triangle(ns);
    return true;
}

// clang-format on