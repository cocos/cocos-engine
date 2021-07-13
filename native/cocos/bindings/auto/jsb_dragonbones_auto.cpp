#include "cocos/bindings/auto/jsb_dragonbones_auto.h"
#if USE_DRAGONBONES > 0
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "editor-support/dragonbones-creator-support/CCDragonBonesHeaders.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_dragonBones_BaseObject_proto = nullptr;
se::Class* __jsb_dragonBones_BaseObject_class = nullptr;

static bool js_dragonbones_BaseObject_returnToPool(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseObject_returnToPool : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->returnToPool();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseObject_returnToPool)

static bool js_dragonbones_BaseObject_clearPool(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::BaseObject::clearPool();
        return true;
    }
    if (argc == 1) {
        HolderType<size_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseObject_clearPool : Error processing arguments");
        dragonBones::BaseObject::clearPool(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseObject_clearPool)

static bool js_dragonbones_BaseObject_setMaxCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<size_t, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseObject_setMaxCount : Error processing arguments");
        dragonBones::BaseObject::setMaxCount(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseObject_setMaxCount)



bool js_register_dragonbones_BaseObject(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BaseObject", obj, nullptr, nullptr);

    cls->defineFunction("returnToPool", _SE(js_dragonbones_BaseObject_returnToPool));
    cls->defineStaticFunction("clearPool", _SE(js_dragonbones_BaseObject_clearPool));
    cls->defineStaticFunction("setMaxCount", _SE(js_dragonbones_BaseObject_setMaxCount));
    cls->install();
    JSBClassType::registerClass<dragonBones::BaseObject>(cls);

    __jsb_dragonBones_BaseObject_proto = cls->getProto();
    __jsb_dragonBones_BaseObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_Rectangle_proto = nullptr;
se::Class* __jsb_dragonBones_Rectangle_class = nullptr;

static bool js_dragonbones_Rectangle_clear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Rectangle>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Rectangle_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Rectangle_clear)

SE_DECLARE_FINALIZE_FUNC(js_dragonBones_Rectangle_finalize)

static bool js_dragonbones_Rectangle_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    dragonBones::Rectangle* cobj = JSB_ALLOC(dragonBones::Rectangle);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_dragonbones_Rectangle_constructor, __jsb_dragonBones_Rectangle_class, js_dragonBones_Rectangle_finalize)



static bool js_dragonBones_Rectangle_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<dragonBones::Rectangle>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<dragonBones::Rectangle>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_Rectangle_finalize)

bool js_register_dragonbones_Rectangle(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Rectangle", obj, nullptr, _SE(js_dragonbones_Rectangle_constructor));

    cls->defineFunction("clear", _SE(js_dragonbones_Rectangle_clear));
    cls->defineFinalizeFunction(_SE(js_dragonBones_Rectangle_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::Rectangle>(cls);

    __jsb_dragonBones_Rectangle_proto = cls->getProto();
    __jsb_dragonBones_Rectangle_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_Matrix_proto = nullptr;
se::Class* __jsb_dragonBones_Matrix_class = nullptr;

static bool js_dragonbones_Matrix_get_a(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_get_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->a, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->a, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Matrix_get_a)

static bool js_dragonbones_Matrix_set_a(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_set_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->a, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Matrix_set_a : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Matrix_set_a)

static bool js_dragonbones_Matrix_get_b(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_get_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->b, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->b, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Matrix_get_b)

static bool js_dragonbones_Matrix_set_b(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_set_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->b, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Matrix_set_b : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Matrix_set_b)

static bool js_dragonbones_Matrix_get_c(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_get_c : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->c, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->c, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Matrix_get_c)

static bool js_dragonbones_Matrix_set_c(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_set_c : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->c, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Matrix_set_c : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Matrix_set_c)

static bool js_dragonbones_Matrix_get_d(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_get_d : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->d, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->d, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Matrix_get_d)

static bool js_dragonbones_Matrix_set_d(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_set_d : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->d, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Matrix_set_d : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Matrix_set_d)

static bool js_dragonbones_Matrix_get_tx(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_get_tx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->tx, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->tx, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Matrix_get_tx)

static bool js_dragonbones_Matrix_set_tx(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_set_tx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->tx, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Matrix_set_tx : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Matrix_set_tx)

static bool js_dragonbones_Matrix_get_ty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_get_ty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->ty, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->ty, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Matrix_get_ty)

static bool js_dragonbones_Matrix_set_ty(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Matrix>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Matrix_set_ty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->ty, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Matrix_set_ty : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Matrix_set_ty)



bool js_register_dragonbones_Matrix(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Matrix", obj, nullptr, nullptr);

    cls->defineProperty("a", _SE(js_dragonbones_Matrix_get_a), _SE(js_dragonbones_Matrix_set_a));
    cls->defineProperty("b", _SE(js_dragonbones_Matrix_get_b), _SE(js_dragonbones_Matrix_set_b));
    cls->defineProperty("c", _SE(js_dragonbones_Matrix_get_c), _SE(js_dragonbones_Matrix_set_c));
    cls->defineProperty("d", _SE(js_dragonbones_Matrix_get_d), _SE(js_dragonbones_Matrix_set_d));
    cls->defineProperty("tx", _SE(js_dragonbones_Matrix_get_tx), _SE(js_dragonbones_Matrix_set_tx));
    cls->defineProperty("ty", _SE(js_dragonbones_Matrix_get_ty), _SE(js_dragonbones_Matrix_set_ty));
    cls->install();
    JSBClassType::registerClass<dragonBones::Matrix>(cls);

    __jsb_dragonBones_Matrix_proto = cls->getProto();
    __jsb_dragonBones_Matrix_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_Transform_proto = nullptr;
se::Class* __jsb_dragonBones_Transform_class = nullptr;

static bool js_dragonbones_Transform_normalizeRadian(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Transform_normalizeRadian : Error processing arguments");
        float result = dragonBones::Transform::normalizeRadian(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Transform_normalizeRadian : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Transform_normalizeRadian)

static bool js_dragonbones_Transform_get_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->x, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->x, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Transform_get_x)

static bool js_dragonbones_Transform_set_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Transform_set_x : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Transform_set_x)

static bool js_dragonbones_Transform_get_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->y, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->y, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Transform_get_y)

static bool js_dragonbones_Transform_set_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Transform_set_y : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Transform_set_y)

static bool js_dragonbones_Transform_get_skew(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_get_skew : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->skew, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->skew, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Transform_get_skew)

static bool js_dragonbones_Transform_set_skew(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_set_skew : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->skew, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Transform_set_skew : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Transform_set_skew)

static bool js_dragonbones_Transform_get_rotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_get_rotation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->rotation, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->rotation, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Transform_get_rotation)

static bool js_dragonbones_Transform_set_rotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_set_rotation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->rotation, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Transform_set_rotation : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Transform_set_rotation)

static bool js_dragonbones_Transform_get_scaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_get_scaleX : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->scaleX, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->scaleX, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Transform_get_scaleX)

static bool js_dragonbones_Transform_set_scaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_set_scaleX : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->scaleX, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Transform_set_scaleX : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Transform_set_scaleX)

static bool js_dragonbones_Transform_get_scaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_get_scaleY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->scaleY, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->scaleY, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Transform_get_scaleY)

static bool js_dragonbones_Transform_set_scaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Transform>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Transform_set_scaleY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->scaleY, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Transform_set_scaleY : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Transform_set_scaleY)



bool js_register_dragonbones_Transform(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Transform", obj, nullptr, nullptr);

    cls->defineProperty("x", _SE(js_dragonbones_Transform_get_x), _SE(js_dragonbones_Transform_set_x));
    cls->defineProperty("y", _SE(js_dragonbones_Transform_get_y), _SE(js_dragonbones_Transform_set_y));
    cls->defineProperty("skew", _SE(js_dragonbones_Transform_get_skew), _SE(js_dragonbones_Transform_set_skew));
    cls->defineProperty("rotation", _SE(js_dragonbones_Transform_get_rotation), _SE(js_dragonbones_Transform_set_rotation));
    cls->defineProperty("scaleX", _SE(js_dragonbones_Transform_get_scaleX), _SE(js_dragonbones_Transform_set_scaleX));
    cls->defineProperty("scaleY", _SE(js_dragonbones_Transform_get_scaleY), _SE(js_dragonbones_Transform_set_scaleY));
    cls->defineStaticFunction("normalizeRadian", _SE(js_dragonbones_Transform_normalizeRadian));
    cls->install();
    JSBClassType::registerClass<dragonBones::Transform>(cls);

    __jsb_dragonBones_Transform_proto = cls->getProto();
    __jsb_dragonBones_Transform_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_TextureAtlasData_proto = nullptr;
se::Class* __jsb_dragonBones_TextureAtlasData_class = nullptr;

static bool js_dragonbones_TextureAtlasData_addTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureAtlasData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureAtlasData_addTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::TextureData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureAtlasData_addTexture : Error processing arguments");
        cobj->addTexture(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TextureAtlasData_addTexture)

static bool js_dragonbones_TextureAtlasData_createTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureAtlasData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureAtlasData_createTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::TextureData* result = cobj->createTexture();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureAtlasData_createTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TextureAtlasData_createTexture)

static bool js_dragonbones_TextureAtlasData_getTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureAtlasData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureAtlasData_getTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureAtlasData_getTexture : Error processing arguments");
        dragonBones::TextureData* result = cobj->getTexture(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureAtlasData_getTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TextureAtlasData_getTexture)

static bool js_dragonbones_TextureAtlasData_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureAtlasData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureAtlasData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_TextureAtlasData_get_name)

static bool js_dragonbones_TextureAtlasData_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureAtlasData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureAtlasData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_TextureAtlasData_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_TextureAtlasData_set_name)



bool js_register_dragonbones_TextureAtlasData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureAtlasData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_dragonbones_TextureAtlasData_get_name), _SE(js_dragonbones_TextureAtlasData_set_name));
    cls->defineFunction("addTexture", _SE(js_dragonbones_TextureAtlasData_addTexture));
    cls->defineFunction("createTexture", _SE(js_dragonbones_TextureAtlasData_createTexture));
    cls->defineFunction("getTexture", _SE(js_dragonbones_TextureAtlasData_getTexture));
    cls->install();
    JSBClassType::registerClass<dragonBones::TextureAtlasData>(cls);

    __jsb_dragonBones_TextureAtlasData_proto = cls->getProto();
    __jsb_dragonBones_TextureAtlasData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_TextureData_proto = nullptr;
se::Class* __jsb_dragonBones_TextureData_class = nullptr;

static bool js_dragonbones_TextureData_getFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureData_getFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::Rectangle* result = cobj->getFrame();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureData_getFrame : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TextureData_getFrame)

static bool js_dragonbones_TextureData_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::TextureAtlasData* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureData_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TextureData_getParent)

static bool js_dragonbones_TextureData_getRegion(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureData_getRegion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Rectangle* result = cobj->getRegion();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureData_getRegion : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TextureData_getRegion)

static bool js_dragonbones_TextureData_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureData_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::Rectangle*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureData_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TextureData_setFrame)

static bool js_dragonbones_TextureData_setParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TextureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TextureData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::TextureAtlasData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureData_setParent : Error processing arguments");
        cobj->setParent(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TextureData_setParent)

static bool js_dragonbones_TextureData_createRectangle(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Rectangle* result = dragonBones::TextureData::createRectangle();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TextureData_createRectangle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TextureData_createRectangle)



bool js_register_dragonbones_TextureData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineFunction("getFrame", _SE(js_dragonbones_TextureData_getFrame));
    cls->defineFunction("getParent", _SE(js_dragonbones_TextureData_getParent));
    cls->defineFunction("getRegion", _SE(js_dragonbones_TextureData_getRegion));
    cls->defineFunction("setFrame", _SE(js_dragonbones_TextureData_setFrame));
    cls->defineFunction("setParent", _SE(js_dragonbones_TextureData_setParent));
    cls->defineStaticFunction("createRectangle", _SE(js_dragonbones_TextureData_createRectangle));
    cls->install();
    JSBClassType::registerClass<dragonBones::TextureData>(cls);

    __jsb_dragonBones_TextureData_proto = cls->getProto();
    __jsb_dragonBones_TextureData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_ArmatureData_proto = nullptr;
se::Class* __jsb_dragonBones_ArmatureData_class = nullptr;

static bool js_dragonbones_ArmatureData_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Rectangle* result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getAABB)

static bool js_dragonbones_ArmatureData_getAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getAnimation : Error processing arguments");
        dragonBones::AnimationData* result = cobj->getAnimation(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getAnimation)

static bool js_dragonbones_ArmatureData_getAnimationNames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getAnimationNames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getAnimationNames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getAnimationNames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getAnimationNames)

static bool js_dragonbones_ArmatureData_getBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getBone : Error processing arguments");
        dragonBones::BoneData* result = cobj->getBone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getBone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getBone)

static bool js_dragonbones_ArmatureData_getDefaultAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getDefaultAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::AnimationData* result = cobj->getDefaultAnimation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getDefaultAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getDefaultAnimation)

static bool js_dragonbones_ArmatureData_getDefaultSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getDefaultSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::SkinData* result = cobj->getDefaultSkin();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getDefaultSkin : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getDefaultSkin)

static bool js_dragonbones_ArmatureData_getMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::string, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getMesh : Error processing arguments");
        dragonBones::MeshDisplayData* result = cobj->getMesh(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getMesh : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getMesh)

static bool js_dragonbones_ArmatureData_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::DragonBonesData* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getParent)

static bool js_dragonbones_ArmatureData_getSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getSkin : Error processing arguments");
        dragonBones::SkinData* result = cobj->getSkin(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getSkin : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getSkin)

static bool js_dragonbones_ArmatureData_getSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getSlot : Error processing arguments");
        dragonBones::SlotData* result = cobj->getSlot(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getSlot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getSlot)

static bool js_dragonbones_ArmatureData_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getType();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_getType)

static bool js_dragonbones_ArmatureData_setDefaultAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_setDefaultAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::AnimationData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_setDefaultAnimation : Error processing arguments");
        cobj->setDefaultAnimation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_setDefaultAnimation)

static bool js_dragonbones_ArmatureData_setDefaultSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_setDefaultSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::SkinData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_setDefaultSkin : Error processing arguments");
        cobj->setDefaultSkin(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_setDefaultSkin)

static bool js_dragonbones_ArmatureData_setParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::DragonBonesData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_setParent : Error processing arguments");
        cobj->setParent(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_setParent)

static bool js_dragonbones_ArmatureData_setType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_setType : Error processing arguments");
        cobj->setType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_setType)

static bool js_dragonbones_ArmatureData_sortBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_sortBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->sortBones();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureData_sortBones)

static bool js_dragonbones_ArmatureData_get_frameRate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_get_frameRate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->frameRate, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->frameRate, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_ArmatureData_get_frameRate)

static bool js_dragonbones_ArmatureData_set_frameRate(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_set_frameRate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->frameRate, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_set_frameRate : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_ArmatureData_set_frameRate)

static bool js_dragonbones_ArmatureData_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_ArmatureData_get_name)

static bool js_dragonbones_ArmatureData_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureData_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_ArmatureData_set_name)



bool js_register_dragonbones_ArmatureData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ArmatureData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("frameRate", _SE(js_dragonbones_ArmatureData_get_frameRate), _SE(js_dragonbones_ArmatureData_set_frameRate));
    cls->defineProperty("name", _SE(js_dragonbones_ArmatureData_get_name), _SE(js_dragonbones_ArmatureData_set_name));
    cls->defineFunction("getAABB", _SE(js_dragonbones_ArmatureData_getAABB));
    cls->defineFunction("getAnimation", _SE(js_dragonbones_ArmatureData_getAnimation));
    cls->defineFunction("getAnimationNames", _SE(js_dragonbones_ArmatureData_getAnimationNames));
    cls->defineFunction("getBone", _SE(js_dragonbones_ArmatureData_getBone));
    cls->defineFunction("getDefaultAnimation", _SE(js_dragonbones_ArmatureData_getDefaultAnimation));
    cls->defineFunction("getDefaultSkin", _SE(js_dragonbones_ArmatureData_getDefaultSkin));
    cls->defineFunction("getMesh", _SE(js_dragonbones_ArmatureData_getMesh));
    cls->defineFunction("getParent", _SE(js_dragonbones_ArmatureData_getParent));
    cls->defineFunction("getSkin", _SE(js_dragonbones_ArmatureData_getSkin));
    cls->defineFunction("getSlot", _SE(js_dragonbones_ArmatureData_getSlot));
    cls->defineFunction("getType", _SE(js_dragonbones_ArmatureData_getType));
    cls->defineFunction("setDefaultAnimation", _SE(js_dragonbones_ArmatureData_setDefaultAnimation));
    cls->defineFunction("setDefaultSkin", _SE(js_dragonbones_ArmatureData_setDefaultSkin));
    cls->defineFunction("setParent", _SE(js_dragonbones_ArmatureData_setParent));
    cls->defineFunction("setType", _SE(js_dragonbones_ArmatureData_setType));
    cls->defineFunction("sortBones", _SE(js_dragonbones_ArmatureData_sortBones));
    cls->install();
    JSBClassType::registerClass<dragonBones::ArmatureData>(cls);

    __jsb_dragonBones_ArmatureData_proto = cls->getProto();
    __jsb_dragonBones_ArmatureData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_BoneData_proto = nullptr;
se::Class* __jsb_dragonBones_BoneData_class = nullptr;

static bool js_dragonbones_BoneData_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BoneData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::BoneData* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BoneData_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BoneData_getParent)

static bool js_dragonbones_BoneData_getTransfrom(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BoneData_getTransfrom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Transform* result = cobj->getTransfrom();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BoneData_getTransfrom : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BoneData_getTransfrom)

static bool js_dragonbones_BoneData_setParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BoneData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::BoneData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BoneData_setParent : Error processing arguments");
        cobj->setParent(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BoneData_setParent)

static bool js_dragonbones_BoneData_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BoneData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_BoneData_get_name)

static bool js_dragonbones_BoneData_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BoneData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_BoneData_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_BoneData_set_name)

static bool js_dragonbones_BoneData_get_parent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BoneData_get_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->parent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->parent, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_BoneData_get_parent)

static bool js_dragonbones_BoneData_set_parent(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BoneData_set_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->parent, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_BoneData_set_parent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_BoneData_set_parent)



bool js_register_dragonbones_BoneData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BoneData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_dragonbones_BoneData_get_name), _SE(js_dragonbones_BoneData_set_name));
    cls->defineProperty("parent", _SE(js_dragonbones_BoneData_get_parent), _SE(js_dragonbones_BoneData_set_parent));
    cls->defineFunction("getParent", _SE(js_dragonbones_BoneData_getParent));
    cls->defineFunction("getTransfrom", _SE(js_dragonbones_BoneData_getTransfrom));
    cls->defineFunction("setParent", _SE(js_dragonbones_BoneData_setParent));
    cls->install();
    JSBClassType::registerClass<dragonBones::BoneData>(cls);

    __jsb_dragonBones_BoneData_proto = cls->getProto();
    __jsb_dragonBones_BoneData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_SlotData_proto = nullptr;
se::Class* __jsb_dragonBones_SlotData_class = nullptr;

static bool js_dragonbones_SlotData_getBlendMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SlotData_getBlendMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getBlendMode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_SlotData_getBlendMode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_SlotData_getBlendMode)

static bool js_dragonbones_SlotData_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SlotData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::BoneData* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_SlotData_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_SlotData_getParent)

static bool js_dragonbones_SlotData_setBlendMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SlotData_setBlendMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_SlotData_setBlendMode : Error processing arguments");
        cobj->setBlendMode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_SlotData_setBlendMode)

static bool js_dragonbones_SlotData_setParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SlotData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::BoneData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_SlotData_setParent : Error processing arguments");
        cobj->setParent(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_SlotData_setParent)

static bool js_dragonbones_SlotData_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SlotData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_SlotData_get_name)

static bool js_dragonbones_SlotData_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SlotData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_SlotData_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_SlotData_set_name)

static bool js_dragonbones_SlotData_get_parent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SlotData_get_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->parent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->parent, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_SlotData_get_parent)

static bool js_dragonbones_SlotData_set_parent(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SlotData_set_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->parent, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_SlotData_set_parent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_SlotData_set_parent)



bool js_register_dragonbones_SlotData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SlotData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_dragonbones_SlotData_get_name), _SE(js_dragonbones_SlotData_set_name));
    cls->defineProperty("parent", _SE(js_dragonbones_SlotData_get_parent), _SE(js_dragonbones_SlotData_set_parent));
    cls->defineFunction("getBlendMode", _SE(js_dragonbones_SlotData_getBlendMode));
    cls->defineFunction("getParent", _SE(js_dragonbones_SlotData_getParent));
    cls->defineFunction("setBlendMode", _SE(js_dragonbones_SlotData_setBlendMode));
    cls->defineFunction("setParent", _SE(js_dragonbones_SlotData_setParent));
    cls->install();
    JSBClassType::registerClass<dragonBones::SlotData>(cls);

    __jsb_dragonBones_SlotData_proto = cls->getProto();
    __jsb_dragonBones_SlotData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_DragonBonesData_proto = nullptr;
se::Class* __jsb_dragonBones_DragonBonesData_class = nullptr;

static bool js_dragonbones_DragonBonesData_addArmature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::DragonBonesData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_DragonBonesData_addArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::ArmatureData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_DragonBonesData_addArmature : Error processing arguments");
        cobj->addArmature(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_DragonBonesData_addArmature)

static bool js_dragonbones_DragonBonesData_getArmature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::DragonBonesData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_DragonBonesData_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_DragonBonesData_getArmature : Error processing arguments");
        dragonBones::ArmatureData* result = cobj->getArmature(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_DragonBonesData_getArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_DragonBonesData_getArmature)

static bool js_dragonbones_DragonBonesData_getArmatureNames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::DragonBonesData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_DragonBonesData_getArmatureNames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getArmatureNames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_DragonBonesData_getArmatureNames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_DragonBonesData_getArmatureNames)

static bool js_dragonbones_DragonBonesData_getFrameIndices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::DragonBonesData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_DragonBonesData_getFrameIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<unsigned int>* result = cobj->getFrameIndices();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_DragonBonesData_getFrameIndices : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_DragonBonesData_getFrameIndices)

static bool js_dragonbones_DragonBonesData_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::DragonBonesData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_DragonBonesData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_DragonBonesData_get_name)

static bool js_dragonbones_DragonBonesData_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::DragonBonesData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_DragonBonesData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_DragonBonesData_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_DragonBonesData_set_name)



bool js_register_dragonbones_DragonBonesData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DragonBonesData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_dragonbones_DragonBonesData_get_name), _SE(js_dragonbones_DragonBonesData_set_name));
    cls->defineFunction("addArmature", _SE(js_dragonbones_DragonBonesData_addArmature));
    cls->defineFunction("getArmature", _SE(js_dragonbones_DragonBonesData_getArmature));
    cls->defineFunction("getArmatureNames", _SE(js_dragonbones_DragonBonesData_getArmatureNames));
    cls->defineFunction("getFrameIndices", _SE(js_dragonbones_DragonBonesData_getFrameIndices));
    cls->install();
    JSBClassType::registerClass<dragonBones::DragonBonesData>(cls);

    __jsb_dragonBones_DragonBonesData_proto = cls->getProto();
    __jsb_dragonBones_DragonBonesData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_SkinData_proto = nullptr;
se::Class* __jsb_dragonBones_SkinData_class = nullptr;

static bool js_dragonbones_SkinData_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::SkinData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SkinData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_SkinData_get_name)

static bool js_dragonbones_SkinData_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::SkinData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_SkinData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_SkinData_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_SkinData_set_name)



bool js_register_dragonbones_SkinData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkinData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_dragonbones_SkinData_get_name), _SE(js_dragonbones_SkinData_set_name));
    cls->install();
    JSBClassType::registerClass<dragonBones::SkinData>(cls);

    __jsb_dragonBones_SkinData_proto = cls->getProto();
    __jsb_dragonBones_SkinData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_AnimationData_proto = nullptr;
se::Class* __jsb_dragonBones_AnimationData_class = nullptr;

static bool js_dragonbones_AnimationData_getBoneCachedFrameIndices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_getBoneCachedFrameIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_getBoneCachedFrameIndices : Error processing arguments");
        std::vector<int>* result = cobj->getBoneCachedFrameIndices(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_getBoneCachedFrameIndices : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationData_getBoneCachedFrameIndices)

static bool js_dragonbones_AnimationData_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::ArmatureData* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationData_getParent)

static bool js_dragonbones_AnimationData_getSlotCachedFrameIndices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_getSlotCachedFrameIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_getSlotCachedFrameIndices : Error processing arguments");
        std::vector<int>* result = cobj->getSlotCachedFrameIndices(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_getSlotCachedFrameIndices : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationData_getSlotCachedFrameIndices)

static bool js_dragonbones_AnimationData_getZOrderTimeline(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_getZOrderTimeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::TimelineData* result = cobj->getZOrderTimeline();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_getZOrderTimeline : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationData_getZOrderTimeline)

static bool js_dragonbones_AnimationData_setParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::ArmatureData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_setParent : Error processing arguments");
        cobj->setParent(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationData_setParent)

static bool js_dragonbones_AnimationData_get_frameCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_get_frameCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->frameCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->frameCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationData_get_frameCount)

static bool js_dragonbones_AnimationData_set_frameCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_set_frameCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->frameCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_set_frameCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationData_set_frameCount)

static bool js_dragonbones_AnimationData_get_playTimes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_get_playTimes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->playTimes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->playTimes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationData_get_playTimes)

static bool js_dragonbones_AnimationData_set_playTimes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_set_playTimes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->playTimes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_set_playTimes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationData_set_playTimes)

static bool js_dragonbones_AnimationData_get_duration(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_get_duration : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->duration, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->duration, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationData_get_duration)

static bool js_dragonbones_AnimationData_set_duration(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_set_duration : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->duration, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_set_duration : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationData_set_duration)

static bool js_dragonbones_AnimationData_get_fadeInTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_get_fadeInTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->fadeInTime, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->fadeInTime, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationData_get_fadeInTime)

static bool js_dragonbones_AnimationData_set_fadeInTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_set_fadeInTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->fadeInTime, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_set_fadeInTime : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationData_set_fadeInTime)

static bool js_dragonbones_AnimationData_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationData_get_name)

static bool js_dragonbones_AnimationData_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationData>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationData_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationData_set_name)



bool js_register_dragonbones_AnimationData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AnimationData", obj, nullptr, nullptr);

    cls->defineProperty("frameCount", _SE(js_dragonbones_AnimationData_get_frameCount), _SE(js_dragonbones_AnimationData_set_frameCount));
    cls->defineProperty("playTimes", _SE(js_dragonbones_AnimationData_get_playTimes), _SE(js_dragonbones_AnimationData_set_playTimes));
    cls->defineProperty("duration", _SE(js_dragonbones_AnimationData_get_duration), _SE(js_dragonbones_AnimationData_set_duration));
    cls->defineProperty("fadeInTime", _SE(js_dragonbones_AnimationData_get_fadeInTime), _SE(js_dragonbones_AnimationData_set_fadeInTime));
    cls->defineProperty("name", _SE(js_dragonbones_AnimationData_get_name), _SE(js_dragonbones_AnimationData_set_name));
    cls->defineFunction("getBoneCachedFrameIndices", _SE(js_dragonbones_AnimationData_getBoneCachedFrameIndices));
    cls->defineFunction("getParent", _SE(js_dragonbones_AnimationData_getParent));
    cls->defineFunction("getSlotCachedFrameIndices", _SE(js_dragonbones_AnimationData_getSlotCachedFrameIndices));
    cls->defineFunction("getZOrderTimeline", _SE(js_dragonbones_AnimationData_getZOrderTimeline));
    cls->defineFunction("setParent", _SE(js_dragonbones_AnimationData_setParent));
    cls->install();
    JSBClassType::registerClass<dragonBones::AnimationData>(cls);

    __jsb_dragonBones_AnimationData_proto = cls->getProto();
    __jsb_dragonBones_AnimationData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_Armature_proto = nullptr;
se::Class* __jsb_dragonBones_Armature_class = nullptr;

static bool js_dragonbones_Armature__addBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature__addBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::Bone*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature__addBone : Error processing arguments");
        cobj->_addBone(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature__addBone)

static bool js_dragonbones_Armature__addSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature__addSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::Slot*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature__addSlot : Error processing arguments");
        cobj->_addSlot(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature__addSlot)

static bool js_dragonbones_Armature__bufferAction(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature__bufferAction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<dragonBones::EventObject*, false> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature__bufferAction : Error processing arguments");
        cobj->_bufferAction(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature__bufferAction)

static bool js_dragonbones_Armature_advanceTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_advanceTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_advanceTime)

static bool js_dragonbones_Armature_containsPoint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_containsPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_containsPoint : Error processing arguments");
        dragonBones::Slot* result = cobj->containsPoint(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_containsPoint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_containsPoint)

static bool js_dragonbones_Armature_dispose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_dispose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dispose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_dispose)

static bool js_dragonbones_Armature_getAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Animation* result = cobj->getAnimation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getAnimation)

static bool js_dragonbones_Armature_getArmatureData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getArmatureData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::ArmatureData* result = cobj->getArmatureData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getArmatureData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getArmatureData)

static bool js_dragonbones_Armature_getBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getBone : Error processing arguments");
        dragonBones::Bone* result = cobj->getBone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getBone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getBone)

static bool js_dragonbones_Armature_getCacheFrameRate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getCacheFrameRate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCacheFrameRate();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getCacheFrameRate : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getCacheFrameRate)

static bool js_dragonbones_Armature_getClock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = cobj->getClock();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getClock : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getClock)

static bool js_dragonbones_Armature_getEventDispatcher(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getEventDispatcher : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::IEventDispatcher* result = cobj->getEventDispatcher();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getEventDispatcher : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getEventDispatcher)

static bool js_dragonbones_Armature_getFlipX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getFlipX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getFlipX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getFlipX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getFlipX)

static bool js_dragonbones_Armature_getFlipY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getFlipY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getFlipY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getFlipY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getFlipY)

static bool js_dragonbones_Armature_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getName)

static bool js_dragonbones_Armature_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Slot* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getParent)

static bool js_dragonbones_Armature_getProxy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getProxy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::IArmatureProxy* result = cobj->getProxy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getProxy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getProxy)

static bool js_dragonbones_Armature_getSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_getSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getSlot : Error processing arguments");
        dragonBones::Slot* result = cobj->getSlot(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_getSlot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_getSlot)

static bool js_dragonbones_Armature_invalidUpdate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_invalidUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->invalidUpdate();
        return true;
    }
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_invalidUpdate : Error processing arguments");
        cobj->invalidUpdate(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_invalidUpdate : Error processing arguments");
        cobj->invalidUpdate(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_invalidUpdate)

static bool js_dragonbones_Armature_render(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->render();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_render)

static bool js_dragonbones_Armature_setCacheFrameRate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_setCacheFrameRate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_setCacheFrameRate : Error processing arguments");
        cobj->setCacheFrameRate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_setCacheFrameRate)

static bool js_dragonbones_Armature_setClock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_setClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::WorldClock*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_setClock : Error processing arguments");
        cobj->setClock(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_setClock)

static bool js_dragonbones_Armature_setFlipX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_setFlipX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_setFlipX : Error processing arguments");
        cobj->setFlipX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_setFlipX)

static bool js_dragonbones_Armature_setFlipY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Armature>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Armature_setFlipY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Armature_setFlipY : Error processing arguments");
        cobj->setFlipY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Armature_setFlipY)



bool js_register_dragonbones_Armature(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Armature", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineFunction("_addBone", _SE(js_dragonbones_Armature__addBone));
    cls->defineFunction("_addSlot", _SE(js_dragonbones_Armature__addSlot));
    cls->defineFunction("_bufferAction", _SE(js_dragonbones_Armature__bufferAction));
    cls->defineFunction("advanceTime", _SE(js_dragonbones_Armature_advanceTime));
    cls->defineFunction("containsPoint", _SE(js_dragonbones_Armature_containsPoint));
    cls->defineFunction("dispose", _SE(js_dragonbones_Armature_dispose));
    cls->defineFunction("getAnimation", _SE(js_dragonbones_Armature_getAnimation));
    cls->defineFunction("getArmatureData", _SE(js_dragonbones_Armature_getArmatureData));
    cls->defineFunction("getBone", _SE(js_dragonbones_Armature_getBone));
    cls->defineFunction("getCacheFrameRate", _SE(js_dragonbones_Armature_getCacheFrameRate));
    cls->defineFunction("getClock", _SE(js_dragonbones_Armature_getClock));
    cls->defineFunction("getEventDispatcher", _SE(js_dragonbones_Armature_getEventDispatcher));
    cls->defineFunction("getFlipX", _SE(js_dragonbones_Armature_getFlipX));
    cls->defineFunction("getFlipY", _SE(js_dragonbones_Armature_getFlipY));
    cls->defineFunction("getName", _SE(js_dragonbones_Armature_getName));
    cls->defineFunction("getParent", _SE(js_dragonbones_Armature_getParent));
    cls->defineFunction("getProxy", _SE(js_dragonbones_Armature_getProxy));
    cls->defineFunction("getSlot", _SE(js_dragonbones_Armature_getSlot));
    cls->defineFunction("invalidUpdate", _SE(js_dragonbones_Armature_invalidUpdate));
    cls->defineFunction("render", _SE(js_dragonbones_Armature_render));
    cls->defineFunction("setCacheFrameRate", _SE(js_dragonbones_Armature_setCacheFrameRate));
    cls->defineFunction("setClock", _SE(js_dragonbones_Armature_setClock));
    cls->defineFunction("setFlipX", _SE(js_dragonbones_Armature_setFlipX));
    cls->defineFunction("setFlipY", _SE(js_dragonbones_Armature_setFlipY));
    cls->install();
    JSBClassType::registerClass<dragonBones::Armature>(cls);

    __jsb_dragonBones_Armature_proto = cls->getProto();
    __jsb_dragonBones_Armature_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_TransformObject_proto = nullptr;
se::Class* __jsb_dragonBones_TransformObject_class = nullptr;

static bool js_dragonbones_TransformObject_getArmature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TransformObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TransformObject_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getArmature();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TransformObject_getArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TransformObject_getArmature)

static bool js_dragonbones_TransformObject_getGlobal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TransformObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TransformObject_getGlobal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Transform* result = cobj->getGlobal();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TransformObject_getGlobal : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TransformObject_getGlobal)

static bool js_dragonbones_TransformObject_getGlobalTransformMatrix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TransformObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TransformObject_getGlobalTransformMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Matrix* result = cobj->getGlobalTransformMatrix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TransformObject_getGlobalTransformMatrix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TransformObject_getGlobalTransformMatrix)

static bool js_dragonbones_TransformObject_getOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TransformObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TransformObject_getOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Transform* result = cobj->getOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TransformObject_getOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TransformObject_getOffset)

static bool js_dragonbones_TransformObject_getOrigin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TransformObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TransformObject_getOrigin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::Transform* result = cobj->getOrigin();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_TransformObject_getOrigin : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TransformObject_getOrigin)

static bool js_dragonbones_TransformObject_updateGlobalTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::TransformObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_TransformObject_updateGlobalTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateGlobalTransform();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_TransformObject_updateGlobalTransform)



bool js_register_dragonbones_TransformObject(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TransformObject", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineFunction("getArmature", _SE(js_dragonbones_TransformObject_getArmature));
    cls->defineFunction("getGlobal", _SE(js_dragonbones_TransformObject_getGlobal));
    cls->defineFunction("getGlobalTransformMatrix", _SE(js_dragonbones_TransformObject_getGlobalTransformMatrix));
    cls->defineFunction("getOffset", _SE(js_dragonbones_TransformObject_getOffset));
    cls->defineFunction("getOrigin", _SE(js_dragonbones_TransformObject_getOrigin));
    cls->defineFunction("updateGlobalTransform", _SE(js_dragonbones_TransformObject_updateGlobalTransform));
    cls->install();
    JSBClassType::registerClass<dragonBones::TransformObject>(cls);

    __jsb_dragonBones_TransformObject_proto = cls->getProto();
    __jsb_dragonBones_TransformObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_AnimationState_proto = nullptr;
se::Class* __jsb_dragonBones_AnimationState_class = nullptr;

static bool js_dragonbones_AnimationState_addBoneMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_addBoneMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_addBoneMask : Error processing arguments");
        cobj->addBoneMask(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_addBoneMask : Error processing arguments");
        cobj->addBoneMask(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_addBoneMask)

static bool js_dragonbones_AnimationState_advanceTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_advanceTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_advanceTime)

static bool js_dragonbones_AnimationState_containsBoneMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_containsBoneMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_containsBoneMask : Error processing arguments");
        bool result = cobj->containsBoneMask(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_containsBoneMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_containsBoneMask)

static bool js_dragonbones_AnimationState_fadeOut(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_fadeOut : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_fadeOut : Error processing arguments");
        cobj->fadeOut(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_fadeOut : Error processing arguments");
        cobj->fadeOut(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_fadeOut)

static bool js_dragonbones_AnimationState_getAnimationData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_getAnimationData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::AnimationData* result = cobj->getAnimationData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_getAnimationData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_getAnimationData)

static bool js_dragonbones_AnimationState_getCurrentPlayTimes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_getCurrentPlayTimes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCurrentPlayTimes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_getCurrentPlayTimes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_getCurrentPlayTimes)

static bool js_dragonbones_AnimationState_getCurrentTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_getCurrentTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getCurrentTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_getCurrentTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_getCurrentTime)

static bool js_dragonbones_AnimationState_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_getName)

static bool js_dragonbones_AnimationState_getTotalTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_getTotalTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTotalTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_getTotalTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_getTotalTime)

static bool js_dragonbones_AnimationState_isCompleted(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_isCompleted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isCompleted();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_isCompleted : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_isCompleted)

static bool js_dragonbones_AnimationState_isFadeComplete(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_isFadeComplete : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFadeComplete();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_isFadeComplete : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_isFadeComplete)

static bool js_dragonbones_AnimationState_isFadeIn(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_isFadeIn : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFadeIn();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_isFadeIn : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_isFadeIn)

static bool js_dragonbones_AnimationState_isFadeOut(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_isFadeOut : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFadeOut();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_isFadeOut : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_isFadeOut)

static bool js_dragonbones_AnimationState_isPlaying(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_isPlaying : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPlaying();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_isPlaying : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_isPlaying)

static bool js_dragonbones_AnimationState_play(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_play : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->play();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_play)

static bool js_dragonbones_AnimationState_removeAllBoneMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_removeAllBoneMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeAllBoneMask();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_removeAllBoneMask)

static bool js_dragonbones_AnimationState_removeBoneMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_removeBoneMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_removeBoneMask : Error processing arguments");
        cobj->removeBoneMask(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_removeBoneMask : Error processing arguments");
        cobj->removeBoneMask(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_removeBoneMask)

static bool js_dragonbones_AnimationState_setCurrentTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_setCurrentTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_setCurrentTime : Error processing arguments");
        cobj->setCurrentTime(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_setCurrentTime)

static bool js_dragonbones_AnimationState_stop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_stop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stop();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_AnimationState_stop)

static bool js_dragonbones_AnimationState_get_additiveBlending(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_get_additiveBlending : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->additiveBlending, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->additiveBlending, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationState_get_additiveBlending)

static bool js_dragonbones_AnimationState_set_additiveBlending(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_set_additiveBlending : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->additiveBlending, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_set_additiveBlending : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationState_set_additiveBlending)

static bool js_dragonbones_AnimationState_get_displayControl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_get_displayControl : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->displayControl, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->displayControl, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationState_get_displayControl)

static bool js_dragonbones_AnimationState_set_displayControl(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_set_displayControl : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->displayControl, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_set_displayControl : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationState_set_displayControl)

static bool js_dragonbones_AnimationState_get_playTimes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_get_playTimes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->playTimes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->playTimes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationState_get_playTimes)

static bool js_dragonbones_AnimationState_set_playTimes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_set_playTimes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->playTimes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_set_playTimes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationState_set_playTimes)

static bool js_dragonbones_AnimationState_get_timeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_get_timeScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->timeScale, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->timeScale, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationState_get_timeScale)

static bool js_dragonbones_AnimationState_set_timeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_set_timeScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->timeScale, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_set_timeScale : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationState_set_timeScale)

static bool js_dragonbones_AnimationState_get_weight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_get_weight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->weight, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->weight, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationState_get_weight)

static bool js_dragonbones_AnimationState_set_weight(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_set_weight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->weight, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_set_weight : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationState_set_weight)

static bool js_dragonbones_AnimationState_get_autoFadeOutTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_get_autoFadeOutTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->autoFadeOutTime, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->autoFadeOutTime, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationState_get_autoFadeOutTime)

static bool js_dragonbones_AnimationState_set_autoFadeOutTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_set_autoFadeOutTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->autoFadeOutTime, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_set_autoFadeOutTime : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationState_set_autoFadeOutTime)

static bool js_dragonbones_AnimationState_get_fadeTotalTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_get_fadeTotalTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->fadeTotalTime, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->fadeTotalTime, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationState_get_fadeTotalTime)

static bool js_dragonbones_AnimationState_set_fadeTotalTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_set_fadeTotalTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->fadeTotalTime, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_set_fadeTotalTime : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationState_set_fadeTotalTime)

static bool js_dragonbones_AnimationState_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_AnimationState_get_name)

static bool js_dragonbones_AnimationState_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_AnimationState_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_AnimationState_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_AnimationState_set_name)



bool js_register_dragonbones_AnimationState(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AnimationState", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("additiveBlending", _SE(js_dragonbones_AnimationState_get_additiveBlending), _SE(js_dragonbones_AnimationState_set_additiveBlending));
    cls->defineProperty("displayControl", _SE(js_dragonbones_AnimationState_get_displayControl), _SE(js_dragonbones_AnimationState_set_displayControl));
    cls->defineProperty("playTimes", _SE(js_dragonbones_AnimationState_get_playTimes), _SE(js_dragonbones_AnimationState_set_playTimes));
    cls->defineProperty("timeScale", _SE(js_dragonbones_AnimationState_get_timeScale), _SE(js_dragonbones_AnimationState_set_timeScale));
    cls->defineProperty("weight", _SE(js_dragonbones_AnimationState_get_weight), _SE(js_dragonbones_AnimationState_set_weight));
    cls->defineProperty("autoFadeOutTime", _SE(js_dragonbones_AnimationState_get_autoFadeOutTime), _SE(js_dragonbones_AnimationState_set_autoFadeOutTime));
    cls->defineProperty("fadeTotalTime", _SE(js_dragonbones_AnimationState_get_fadeTotalTime), _SE(js_dragonbones_AnimationState_set_fadeTotalTime));
    cls->defineProperty("name", _SE(js_dragonbones_AnimationState_get_name), _SE(js_dragonbones_AnimationState_set_name));
    cls->defineFunction("addBoneMask", _SE(js_dragonbones_AnimationState_addBoneMask));
    cls->defineFunction("advanceTime", _SE(js_dragonbones_AnimationState_advanceTime));
    cls->defineFunction("containsBoneMask", _SE(js_dragonbones_AnimationState_containsBoneMask));
    cls->defineFunction("fadeOut", _SE(js_dragonbones_AnimationState_fadeOut));
    cls->defineFunction("getAnimationData", _SE(js_dragonbones_AnimationState_getAnimationData));
    cls->defineFunction("getCurrentPlayTimes", _SE(js_dragonbones_AnimationState_getCurrentPlayTimes));
    cls->defineFunction("getCurrentTime", _SE(js_dragonbones_AnimationState_getCurrentTime));
    cls->defineFunction("getName", _SE(js_dragonbones_AnimationState_getName));
    cls->defineFunction("getTotalTime", _SE(js_dragonbones_AnimationState_getTotalTime));
    cls->defineFunction("isCompleted", _SE(js_dragonbones_AnimationState_isCompleted));
    cls->defineFunction("isFadeComplete", _SE(js_dragonbones_AnimationState_isFadeComplete));
    cls->defineFunction("isFadeIn", _SE(js_dragonbones_AnimationState_isFadeIn));
    cls->defineFunction("isFadeOut", _SE(js_dragonbones_AnimationState_isFadeOut));
    cls->defineFunction("isPlaying", _SE(js_dragonbones_AnimationState_isPlaying));
    cls->defineFunction("play", _SE(js_dragonbones_AnimationState_play));
    cls->defineFunction("removeAllBoneMask", _SE(js_dragonbones_AnimationState_removeAllBoneMask));
    cls->defineFunction("removeBoneMask", _SE(js_dragonbones_AnimationState_removeBoneMask));
    cls->defineFunction("setCurrentTime", _SE(js_dragonbones_AnimationState_setCurrentTime));
    cls->defineFunction("stop", _SE(js_dragonbones_AnimationState_stop));
    cls->install();
    JSBClassType::registerClass<dragonBones::AnimationState>(cls);

    __jsb_dragonBones_AnimationState_proto = cls->getProto();
    __jsb_dragonBones_AnimationState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_Bone_proto = nullptr;
se::Class* __jsb_dragonBones_Bone_class = nullptr;

static bool js_dragonbones_Bone_contains(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_contains : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<const dragonBones::Bone*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_contains : Error processing arguments");
        bool result = cobj->contains(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_contains : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_contains)

static bool js_dragonbones_Bone_getBoneData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_getBoneData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::BoneData* result = cobj->getBoneData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_getBoneData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_getBoneData)

static bool js_dragonbones_Bone_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_getName)

static bool js_dragonbones_Bone_getOffsetMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_getOffsetMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getOffsetMode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_getOffsetMode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_getOffsetMode)

static bool js_dragonbones_Bone_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Bone* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_getParent)

static bool js_dragonbones_Bone_getVisible(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_getVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getVisible();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_getVisible : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_getVisible)

static bool js_dragonbones_Bone_init(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<const dragonBones::BoneData*, false> arg0 = {};
        HolderType<dragonBones::Armature*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_init : Error processing arguments");
        cobj->init(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_init)

static bool js_dragonbones_Bone_invalidUpdate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_invalidUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->invalidUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_invalidUpdate)

static bool js_dragonbones_Bone_setOffsetMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_setOffsetMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_setOffsetMode : Error processing arguments");
        cobj->setOffsetMode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_setOffsetMode)

static bool js_dragonbones_Bone_setVisible(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_setVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_setVisible : Error processing arguments");
        cobj->setVisible(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_setVisible)

static bool js_dragonbones_Bone_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Bone_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_update)

static bool js_dragonbones_Bone_updateByConstraint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Bone_updateByConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateByConstraint();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Bone_updateByConstraint)



bool js_register_dragonbones_Bone(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Bone", obj, __jsb_dragonBones_TransformObject_proto, nullptr);

    cls->defineFunction("contains", _SE(js_dragonbones_Bone_contains));
    cls->defineFunction("getBoneData", _SE(js_dragonbones_Bone_getBoneData));
    cls->defineFunction("getName", _SE(js_dragonbones_Bone_getName));
    cls->defineFunction("getOffsetMode", _SE(js_dragonbones_Bone_getOffsetMode));
    cls->defineFunction("getParent", _SE(js_dragonbones_Bone_getParent));
    cls->defineFunction("getVisible", _SE(js_dragonbones_Bone_getVisible));
    cls->defineFunction("init", _SE(js_dragonbones_Bone_init));
    cls->defineFunction("invalidUpdate", _SE(js_dragonbones_Bone_invalidUpdate));
    cls->defineFunction("setOffsetMode", _SE(js_dragonbones_Bone_setOffsetMode));
    cls->defineFunction("setVisible", _SE(js_dragonbones_Bone_setVisible));
    cls->defineFunction("update", _SE(js_dragonbones_Bone_update));
    cls->defineFunction("updateByConstraint", _SE(js_dragonbones_Bone_updateByConstraint));
    cls->install();
    JSBClassType::registerClass<dragonBones::Bone>(cls);

    __jsb_dragonBones_Bone_proto = cls->getProto();
    __jsb_dragonBones_Bone_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_Slot_proto = nullptr;
se::Class* __jsb_dragonBones_Slot_class = nullptr;

static bool js_dragonbones_Slot__setZorder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot__setZorder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot__setZorder : Error processing arguments");
        bool result = cobj->_setZorder(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot__setZorder : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot__setZorder)

static bool js_dragonbones_Slot__updateColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot__updateColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->_updateColor();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot__updateColor)

static bool js_dragonbones_Slot_containsPoint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_containsPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_containsPoint : Error processing arguments");
        bool result = cobj->containsPoint(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_containsPoint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_containsPoint)

static bool js_dragonbones_Slot_getBoundingBoxData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_getBoundingBoxData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::BoundingBoxData* result = cobj->getBoundingBoxData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_getBoundingBoxData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_getBoundingBoxData)

static bool js_dragonbones_Slot_getChildArmature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_getChildArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getChildArmature();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_getChildArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_getChildArmature)

static bool js_dragonbones_Slot_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_getName)

static bool js_dragonbones_Slot_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Bone* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_getParent)

static bool js_dragonbones_Slot_getSlotData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_getSlotData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::SlotData* result = cobj->getSlotData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_getSlotData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_getSlotData)

static bool js_dragonbones_Slot_getVisible(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_getVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getVisible();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_getVisible : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_getVisible)

static bool js_dragonbones_Slot_invalidUpdate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_invalidUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->invalidUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_invalidUpdate)

static bool js_dragonbones_Slot_setChildArmature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_setChildArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::Armature*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_setChildArmature : Error processing arguments");
        cobj->setChildArmature(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_setChildArmature)

static bool js_dragonbones_Slot_setVisible(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_setVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_setVisible : Error processing arguments");
        cobj->setVisible(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_setVisible)

static bool js_dragonbones_Slot_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_update)

static bool js_dragonbones_Slot_updateTransformAndMatrix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_updateTransformAndMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateTransformAndMatrix();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Slot_updateTransformAndMatrix)

static bool js_dragonbones_Slot_get_displayController(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_get_displayController : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->displayController, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->displayController, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Slot_get_displayController)

static bool js_dragonbones_Slot_set_displayController(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_set_displayController : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->displayController, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_set_displayController : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Slot_set_displayController)

static bool js_dragonbones_Slot_get__zOrder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_get__zOrder : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_zOrder, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_zOrder, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Slot_get__zOrder)

static bool js_dragonbones_Slot_set__zOrder(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Slot_set__zOrder : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_zOrder, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Slot_set__zOrder : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Slot_set__zOrder)



bool js_register_dragonbones_Slot(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Slot", obj, nullptr, nullptr);

    cls->defineProperty("displayController", _SE(js_dragonbones_Slot_get_displayController), _SE(js_dragonbones_Slot_set_displayController));
    cls->defineProperty("_zOrder", _SE(js_dragonbones_Slot_get__zOrder), _SE(js_dragonbones_Slot_set__zOrder));
    cls->defineFunction("_setZorder", _SE(js_dragonbones_Slot__setZorder));
    cls->defineFunction("_updateColor", _SE(js_dragonbones_Slot__updateColor));
    cls->defineFunction("containsPoint", _SE(js_dragonbones_Slot_containsPoint));
    cls->defineFunction("getBoundingBoxData", _SE(js_dragonbones_Slot_getBoundingBoxData));
    cls->defineFunction("getChildArmature", _SE(js_dragonbones_Slot_getChildArmature));
    cls->defineFunction("getName", _SE(js_dragonbones_Slot_getName));
    cls->defineFunction("getParent", _SE(js_dragonbones_Slot_getParent));
    cls->defineFunction("getSlotData", _SE(js_dragonbones_Slot_getSlotData));
    cls->defineFunction("getVisible", _SE(js_dragonbones_Slot_getVisible));
    cls->defineFunction("invalidUpdate", _SE(js_dragonbones_Slot_invalidUpdate));
    cls->defineFunction("setChildArmature", _SE(js_dragonbones_Slot_setChildArmature));
    cls->defineFunction("setVisible", _SE(js_dragonbones_Slot_setVisible));
    cls->defineFunction("update", _SE(js_dragonbones_Slot_update));
    cls->defineFunction("updateTransformAndMatrix", _SE(js_dragonbones_Slot_updateTransformAndMatrix));
    cls->install();
    JSBClassType::registerClass<dragonBones::Slot>(cls);

    __jsb_dragonBones_Slot_proto = cls->getProto();
    __jsb_dragonBones_Slot_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_WorldClock_proto = nullptr;
se::Class* __jsb_dragonBones_WorldClock_class = nullptr;

static bool js_dragonbones_WorldClock_advanceTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::WorldClock>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_WorldClock_advanceTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_WorldClock_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_WorldClock_advanceTime)

static bool js_dragonbones_WorldClock_clear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::WorldClock>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_WorldClock_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_WorldClock_clear)

static bool js_dragonbones_WorldClock_getClock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::WorldClock>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_WorldClock_getClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = cobj->getClock();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_WorldClock_getClock : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_WorldClock_getClock)

static bool js_dragonbones_WorldClock_render(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::WorldClock>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_WorldClock_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->render();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_WorldClock_render)

static bool js_dragonbones_WorldClock_setClock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::WorldClock>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_WorldClock_setClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::WorldClock*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_WorldClock_setClock : Error processing arguments");
        cobj->setClock(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_WorldClock_setClock)

static bool js_dragonbones_WorldClock_getStaticClock(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = dragonBones::WorldClock::getStaticClock();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_WorldClock_getStaticClock : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_WorldClock_getStaticClock)



bool js_register_dragonbones_WorldClock(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("WorldClock", obj, nullptr, nullptr);

    cls->defineFunction("advanceTime", _SE(js_dragonbones_WorldClock_advanceTime));
    cls->defineFunction("clear", _SE(js_dragonbones_WorldClock_clear));
    cls->defineFunction("getClock", _SE(js_dragonbones_WorldClock_getClock));
    cls->defineFunction("render", _SE(js_dragonbones_WorldClock_render));
    cls->defineFunction("setClock", _SE(js_dragonbones_WorldClock_setClock));
    cls->defineStaticFunction("getStaticClock", _SE(js_dragonbones_WorldClock_getStaticClock));
    cls->install();
    JSBClassType::registerClass<dragonBones::WorldClock>(cls);

    __jsb_dragonBones_WorldClock_proto = cls->getProto();
    __jsb_dragonBones_WorldClock_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_Animation_proto = nullptr;
se::Class* __jsb_dragonBones_Animation_class = nullptr;

static bool js_dragonbones_Animation_advanceTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_advanceTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_advanceTime)

static bool js_dragonbones_Animation_fadeIn(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_fadeIn : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 4) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        HolderType<int, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 5) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        HolderType<int, false> arg3 = {};
        HolderType<std::string, true> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 6) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        HolderType<int, false> arg3 = {};
        HolderType<std::string, true> arg4 = {};
        HolderType<dragonBones::AnimationFadeOutMode, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_fadeIn : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_fadeIn)

static bool js_dragonbones_Animation_getAnimationNames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_getAnimationNames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getAnimationNames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_getAnimationNames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_getAnimationNames)

static bool js_dragonbones_Animation_getLastAnimationName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_getLastAnimationName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getLastAnimationName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_getLastAnimationName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_getLastAnimationName)

static bool js_dragonbones_Animation_getLastAnimationState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_getLastAnimationState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::AnimationState* result = cobj->getLastAnimationState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_getLastAnimationState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_getLastAnimationState)

static bool js_dragonbones_Animation_getState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_getState : Error processing arguments");
        dragonBones::AnimationState* result = cobj->getState(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_getState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_getState)

static bool js_dragonbones_Animation_gotoAndPlayByFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_gotoAndPlayByFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByFrame(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByFrame(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByFrame(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_gotoAndPlayByFrame)

static bool js_dragonbones_Animation_gotoAndPlayByProgress(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_gotoAndPlayByProgress : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByProgress(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByProgress(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByProgress(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_gotoAndPlayByProgress)

static bool js_dragonbones_Animation_gotoAndPlayByTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_gotoAndPlayByTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByTime(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByTime(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByTime(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_gotoAndPlayByTime)

static bool js_dragonbones_Animation_gotoAndStopByFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_gotoAndStopByFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByFrame(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByFrame(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_gotoAndStopByFrame)

static bool js_dragonbones_Animation_gotoAndStopByProgress(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_gotoAndStopByProgress : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByProgress(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByProgress(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_gotoAndStopByProgress)

static bool js_dragonbones_Animation_gotoAndStopByTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_gotoAndStopByTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByTime(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByTime(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_gotoAndStopByTime)

static bool js_dragonbones_Animation_hasAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_hasAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_hasAnimation : Error processing arguments");
        bool result = cobj->hasAnimation(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_hasAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_hasAnimation)

static bool js_dragonbones_Animation_init(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::Armature*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_init : Error processing arguments");
        cobj->init(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_init)

static bool js_dragonbones_Animation_isCompleted(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_isCompleted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isCompleted();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_isCompleted : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_isCompleted)

static bool js_dragonbones_Animation_isPlaying(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_isPlaying : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPlaying();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_isPlaying : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_isPlaying)

static bool js_dragonbones_Animation_play(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_play : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::AnimationState* result = cobj->play();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_play : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_play : Error processing arguments");
        dragonBones::AnimationState* result = cobj->play(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_play : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_play : Error processing arguments");
        dragonBones::AnimationState* result = cobj->play(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_play : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_play)

static bool js_dragonbones_Animation_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_reset)

static bool js_dragonbones_Animation_stop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_stop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_stop : Error processing arguments");
        cobj->stop(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_Animation_stop)

static bool js_dragonbones_Animation_get_timeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_get_timeScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->timeScale, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->timeScale, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_Animation_get_timeScale)

static bool js_dragonbones_Animation_set_timeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_Animation_set_timeScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->timeScale, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_Animation_set_timeScale : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_Animation_set_timeScale)



bool js_register_dragonbones_Animation(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Animation", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("timeScale", _SE(js_dragonbones_Animation_get_timeScale), _SE(js_dragonbones_Animation_set_timeScale));
    cls->defineFunction("advanceTime", _SE(js_dragonbones_Animation_advanceTime));
    cls->defineFunction("fadeIn", _SE(js_dragonbones_Animation_fadeIn));
    cls->defineFunction("getAnimationNames", _SE(js_dragonbones_Animation_getAnimationNames));
    cls->defineFunction("getLastAnimationName", _SE(js_dragonbones_Animation_getLastAnimationName));
    cls->defineFunction("getLastAnimationState", _SE(js_dragonbones_Animation_getLastAnimationState));
    cls->defineFunction("getState", _SE(js_dragonbones_Animation_getState));
    cls->defineFunction("gotoAndPlayByFrame", _SE(js_dragonbones_Animation_gotoAndPlayByFrame));
    cls->defineFunction("gotoAndPlayByProgress", _SE(js_dragonbones_Animation_gotoAndPlayByProgress));
    cls->defineFunction("gotoAndPlayByTime", _SE(js_dragonbones_Animation_gotoAndPlayByTime));
    cls->defineFunction("gotoAndStopByFrame", _SE(js_dragonbones_Animation_gotoAndStopByFrame));
    cls->defineFunction("gotoAndStopByProgress", _SE(js_dragonbones_Animation_gotoAndStopByProgress));
    cls->defineFunction("gotoAndStopByTime", _SE(js_dragonbones_Animation_gotoAndStopByTime));
    cls->defineFunction("hasAnimation", _SE(js_dragonbones_Animation_hasAnimation));
    cls->defineFunction("init", _SE(js_dragonbones_Animation_init));
    cls->defineFunction("isCompleted", _SE(js_dragonbones_Animation_isCompleted));
    cls->defineFunction("isPlaying", _SE(js_dragonbones_Animation_isPlaying));
    cls->defineFunction("play", _SE(js_dragonbones_Animation_play));
    cls->defineFunction("reset", _SE(js_dragonbones_Animation_reset));
    cls->defineFunction("stop", _SE(js_dragonbones_Animation_stop));
    cls->install();
    JSBClassType::registerClass<dragonBones::Animation>(cls);

    __jsb_dragonBones_Animation_proto = cls->getProto();
    __jsb_dragonBones_Animation_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_EventObject_proto = nullptr;
se::Class* __jsb_dragonBones_EventObject_class = nullptr;

static bool js_dragonbones_EventObject_getAnimationState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_getAnimationState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::AnimationState* result = cobj->getAnimationState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_getAnimationState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_EventObject_getAnimationState)

static bool js_dragonbones_EventObject_getArmature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getArmature();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_getArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_EventObject_getArmature)

static bool js_dragonbones_EventObject_getBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_getBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Bone* result = cobj->getBone();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_getBone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_EventObject_getBone)

static bool js_dragonbones_EventObject_getSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_getSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Slot* result = cobj->getSlot();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_getSlot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_EventObject_getSlot)

static bool js_dragonbones_EventObject_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_EventObject_get_type)

static bool js_dragonbones_EventObject_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_EventObject_set_type)

static bool js_dragonbones_EventObject_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_EventObject_get_name)

static bool js_dragonbones_EventObject_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_EventObject_set_name)

static bool js_dragonbones_EventObject_get_armature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_get_armature : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->armature, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->armature, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_EventObject_get_armature)

static bool js_dragonbones_EventObject_set_armature(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_set_armature : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->armature, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_set_armature : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_EventObject_set_armature)

static bool js_dragonbones_EventObject_get_bone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_get_bone : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bone, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bone, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_EventObject_get_bone)

static bool js_dragonbones_EventObject_set_bone(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_set_bone : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bone, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_set_bone : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_EventObject_set_bone)

static bool js_dragonbones_EventObject_get_slot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_get_slot : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->slot, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->slot, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_EventObject_get_slot)

static bool js_dragonbones_EventObject_set_slot(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_set_slot : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->slot, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_set_slot : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_EventObject_set_slot)

static bool js_dragonbones_EventObject_get_animationState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_get_animationState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->animationState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->animationState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_dragonbones_EventObject_get_animationState)

static bool js_dragonbones_EventObject_set_animationState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<dragonBones::EventObject>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_EventObject_set_animationState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->animationState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_EventObject_set_animationState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_dragonbones_EventObject_set_animationState)



bool js_register_dragonbones_EventObject(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("EventObject", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("type", _SE(js_dragonbones_EventObject_get_type), _SE(js_dragonbones_EventObject_set_type));
    cls->defineProperty("name", _SE(js_dragonbones_EventObject_get_name), _SE(js_dragonbones_EventObject_set_name));
    cls->defineProperty("armature", _SE(js_dragonbones_EventObject_get_armature), _SE(js_dragonbones_EventObject_set_armature));
    cls->defineProperty("bone", _SE(js_dragonbones_EventObject_get_bone), _SE(js_dragonbones_EventObject_set_bone));
    cls->defineProperty("slot", _SE(js_dragonbones_EventObject_get_slot), _SE(js_dragonbones_EventObject_set_slot));
    cls->defineProperty("animationState", _SE(js_dragonbones_EventObject_get_animationState), _SE(js_dragonbones_EventObject_set_animationState));
    cls->defineFunction("getAnimationState", _SE(js_dragonbones_EventObject_getAnimationState));
    cls->defineFunction("getArmature", _SE(js_dragonbones_EventObject_getArmature));
    cls->defineFunction("getBone", _SE(js_dragonbones_EventObject_getBone));
    cls->defineFunction("getSlot", _SE(js_dragonbones_EventObject_getSlot));
    cls->install();
    JSBClassType::registerClass<dragonBones::EventObject>(cls);

    __jsb_dragonBones_EventObject_proto = cls->getProto();
    __jsb_dragonBones_EventObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_BaseFactory_proto = nullptr;
se::Class* __jsb_dragonBones_BaseFactory_class = nullptr;

static bool js_dragonbones_BaseFactory_addDragonBonesData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_addDragonBonesData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::DragonBonesData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_addDragonBonesData : Error processing arguments");
        cobj->addDragonBonesData(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<dragonBones::DragonBonesData*, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_addDragonBonesData : Error processing arguments");
        cobj->addDragonBonesData(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_addDragonBonesData)

static bool js_dragonbones_BaseFactory_addTextureAtlasData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_addTextureAtlasData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::TextureAtlasData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_addTextureAtlasData : Error processing arguments");
        cobj->addTextureAtlasData(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<dragonBones::TextureAtlasData*, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_addTextureAtlasData : Error processing arguments");
        cobj->addTextureAtlasData(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_addTextureAtlasData)

static bool js_dragonbones_BaseFactory_buildArmature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_buildArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* result = cobj->buildArmature(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* result = cobj->buildArmature(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::string, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* result = cobj->buildArmature(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 4) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::string, true> arg2 = {};
        HolderType<std::string, true> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* result = cobj->buildArmature(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_buildArmature)

static bool js_dragonbones_BaseFactory_changeSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_changeSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<dragonBones::Armature*, false> arg0 = {};
        HolderType<dragonBones::SkinData*, false> arg1 = {};
        HolderType<std::vector<std::string>, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_changeSkin : Error processing arguments");
        bool result = cobj->changeSkin(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_changeSkin : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_changeSkin)

static bool js_dragonbones_BaseFactory_clear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_clear : Error processing arguments");
        cobj->clear(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_clear)

static bool js_dragonbones_BaseFactory_getArmatureData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_getArmatureData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_getArmatureData : Error processing arguments");
        dragonBones::ArmatureData* result = cobj->getArmatureData(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_getArmatureData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_getArmatureData : Error processing arguments");
        dragonBones::ArmatureData* result = cobj->getArmatureData(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_getArmatureData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_getArmatureData)

static bool js_dragonbones_BaseFactory_getClock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_getClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = cobj->getClock();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_getClock : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_getClock)

static bool js_dragonbones_BaseFactory_getDragonBonesData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_getDragonBonesData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_getDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->getDragonBonesData(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_getDragonBonesData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_getDragonBonesData)

static bool js_dragonbones_BaseFactory_parseDragonBonesData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_parseDragonBonesData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<const char*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesData(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<const char*, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesData(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<const char*, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesData(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_parseDragonBonesData)

static bool js_dragonbones_BaseFactory_removeDragonBonesData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_removeDragonBonesData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_removeDragonBonesData : Error processing arguments");
        cobj->removeDragonBonesData(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_removeDragonBonesData : Error processing arguments");
        cobj->removeDragonBonesData(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_removeDragonBonesData)

static bool js_dragonbones_BaseFactory_removeTextureAtlasData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_removeTextureAtlasData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_removeTextureAtlasData : Error processing arguments");
        cobj->removeTextureAtlasData(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_removeTextureAtlasData : Error processing arguments");
        cobj->removeTextureAtlasData(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_removeTextureAtlasData)

static bool js_dragonbones_BaseFactory_replaceAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_replaceAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<dragonBones::Armature*, false> arg0 = {};
        HolderType<dragonBones::ArmatureData*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceAnimation : Error processing arguments");
        bool result = cobj->replaceAnimation(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<dragonBones::Armature*, false> arg0 = {};
        HolderType<dragonBones::ArmatureData*, false> arg1 = {};
        HolderType<bool, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceAnimation : Error processing arguments");
        bool result = cobj->replaceAnimation(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_replaceAnimation)

static bool js_dragonbones_BaseFactory_replaceSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_replaceSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<dragonBones::Armature*, false> arg0 = {};
        HolderType<dragonBones::SkinData*, false> arg1 = {};
        HolderType<bool, false> arg2 = {};
        HolderType<std::vector<std::string>, true> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceSkin : Error processing arguments");
        bool result = cobj->replaceSkin(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceSkin : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_replaceSkin)

static bool js_dragonbones_BaseFactory_replaceSlotDisplay(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::BaseFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_BaseFactory_replaceSlotDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::string, true> arg2 = {};
        HolderType<std::string, true> arg3 = {};
        HolderType<dragonBones::Slot*, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceSlotDisplay : Error processing arguments");
        bool result = cobj->replaceSlotDisplay(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceSlotDisplay : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 6) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::string, true> arg2 = {};
        HolderType<std::string, true> arg3 = {};
        HolderType<dragonBones::Slot*, false> arg4 = {};
        HolderType<int, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceSlotDisplay : Error processing arguments");
        bool result = cobj->replaceSlotDisplay(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_BaseFactory_replaceSlotDisplay : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_dragonbones_BaseFactory_replaceSlotDisplay)



bool js_register_dragonbones_BaseFactory(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BaseFactory", obj, nullptr, nullptr);

    cls->defineFunction("addDragonBonesData", _SE(js_dragonbones_BaseFactory_addDragonBonesData));
    cls->defineFunction("addTextureAtlasData", _SE(js_dragonbones_BaseFactory_addTextureAtlasData));
    cls->defineFunction("buildArmature", _SE(js_dragonbones_BaseFactory_buildArmature));
    cls->defineFunction("changeSkin", _SE(js_dragonbones_BaseFactory_changeSkin));
    cls->defineFunction("clear", _SE(js_dragonbones_BaseFactory_clear));
    cls->defineFunction("getArmatureData", _SE(js_dragonbones_BaseFactory_getArmatureData));
    cls->defineFunction("getClock", _SE(js_dragonbones_BaseFactory_getClock));
    cls->defineFunction("getDragonBonesData", _SE(js_dragonbones_BaseFactory_getDragonBonesData));
    cls->defineFunction("parseDragonBonesData", _SE(js_dragonbones_BaseFactory_parseDragonBonesData));
    cls->defineFunction("removeDragonBonesData", _SE(js_dragonbones_BaseFactory_removeDragonBonesData));
    cls->defineFunction("removeTextureAtlasData", _SE(js_dragonbones_BaseFactory_removeTextureAtlasData));
    cls->defineFunction("replaceAnimation", _SE(js_dragonbones_BaseFactory_replaceAnimation));
    cls->defineFunction("replaceSkin", _SE(js_dragonbones_BaseFactory_replaceSkin));
    cls->defineFunction("replaceSlotDisplay", _SE(js_dragonbones_BaseFactory_replaceSlotDisplay));
    cls->install();
    JSBClassType::registerClass<dragonBones::BaseFactory>(cls);

    __jsb_dragonBones_BaseFactory_proto = cls->getProto();
    __jsb_dragonBones_BaseFactory_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_CCSlot_proto = nullptr;
se::Class* __jsb_dragonBones_CCSlot_class = nullptr;

static bool js_dragonbones_CCSlot_updateWorldMatrix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCSlot>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCSlot_updateWorldMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateWorldMatrix();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCSlot_updateWorldMatrix)



bool js_register_dragonbones_CCSlot(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CCSlot", obj, __jsb_dragonBones_Slot_proto, nullptr);

    cls->defineFunction("updateWorldMatrix", _SE(js_dragonbones_CCSlot_updateWorldMatrix));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCSlot>(cls);

    __jsb_dragonBones_CCSlot_proto = cls->getProto();
    __jsb_dragonBones_CCSlot_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_CCArmatureDisplay_proto = nullptr;
se::Class* __jsb_dragonBones_CCArmatureDisplay_class = nullptr;

static bool js_dragonbones_CCArmatureDisplay_addDBEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_addDBEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::function<void (dragonBones::EventObject *)>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](dragonBones::EventObject* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_addDBEventListener : Error processing arguments");
        cobj->addDBEventListener(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_addDBEventListener)

static bool js_dragonbones_CCArmatureDisplay_getArmature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getArmature();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_getArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_getArmature)

static bool js_dragonbones_CCArmatureDisplay_convertToRootSpace(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_convertToRootSpace : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_convertToRootSpace : Error processing arguments");
        cc::Vec2 result = cobj->convertToRootSpace(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_convertToRootSpace : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_convertToRootSpace)

static bool js_dragonbones_CCArmatureDisplay_dbClear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_dbClear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dbClear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_dbClear)

static bool js_dragonbones_CCArmatureDisplay_dbInit(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_dbInit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::Armature*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_dbInit : Error processing arguments");
        cobj->dbInit(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_dbInit)

static bool js_dragonbones_CCArmatureDisplay_dbRender(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_dbRender : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dbRender();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_dbRender)

static bool js_dragonbones_CCArmatureDisplay_dbUpdate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_dbUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dbUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_dbUpdate)

static bool js_dragonbones_CCArmatureDisplay_dispatchDBEvent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_dispatchDBEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<dragonBones::EventObject*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_dispatchDBEvent : Error processing arguments");
        cobj->dispatchDBEvent(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_dispatchDBEvent)

static bool js_dragonbones_CCArmatureDisplay_dispose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_dispose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->dispose();
        return true;
    }
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_dispose : Error processing arguments");
        cobj->dispose(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_dispose)

static bool js_dragonbones_CCArmatureDisplay_getAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_getAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Animation* result = cobj->getAnimation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_getAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_getAnimation)

static bool js_dragonbones_CCArmatureDisplay_getDebugData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_getDebugData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se_object_ptr result = cobj->getDebugData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_getDebugData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_getDebugData)

static bool js_dragonbones_CCArmatureDisplay_getParamsBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_getParamsBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se_object_ptr result = cobj->getParamsBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_getParamsBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_getParamsBuffer)

static bool js_dragonbones_CCArmatureDisplay_getRootDisplay(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_getRootDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::CCArmatureDisplay* result = cobj->getRootDisplay();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_getRootDisplay : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_getRootDisplay)

static bool js_dragonbones_CCArmatureDisplay_getSharedBufferOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_getSharedBufferOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se_object_ptr result = cobj->getSharedBufferOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_getSharedBufferOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_getSharedBufferOffset)

static bool js_dragonbones_CCArmatureDisplay_hasDBEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_hasDBEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_hasDBEventListener : Error processing arguments");
        bool result = cobj->hasDBEventListener(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_hasDBEventListener : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_hasDBEventListener)

static bool js_dragonbones_CCArmatureDisplay_removeDBEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_removeDBEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::function<void (dragonBones::EventObject *)>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](dragonBones::EventObject* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_removeDBEventListener : Error processing arguments");
        cobj->removeDBEventListener(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_removeDBEventListener)

static bool js_dragonbones_CCArmatureDisplay_setAttachEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_setAttachEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_setAttachEnabled : Error processing arguments");
        cobj->setAttachEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_setAttachEnabled)

static bool js_dragonbones_CCArmatureDisplay_setBatchEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_setBatchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_setBatchEnabled : Error processing arguments");
        cobj->setBatchEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_setBatchEnabled)

static bool js_dragonbones_CCArmatureDisplay_setColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_setColor : Error processing arguments");
        cobj->setColor(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_setColor)

static bool js_dragonbones_CCArmatureDisplay_setDBEventCallback(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_setDBEventCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (dragonBones::EventObject *)>, false> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](dragonBones::EventObject* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_setDBEventCallback : Error processing arguments");
        cobj->setDBEventCallback(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_setDBEventCallback)

static bool js_dragonbones_CCArmatureDisplay_setDebugBonesEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_setDebugBonesEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_setDebugBonesEnabled : Error processing arguments");
        cobj->setDebugBonesEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_setDebugBonesEnabled)

static bool js_dragonbones_CCArmatureDisplay_setOpacityModifyRGB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureDisplay_setOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureDisplay_setOpacityModifyRGB : Error processing arguments");
        cobj->setOpacityModifyRGB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_setOpacityModifyRGB)

static bool js_dragonbones_CCArmatureDisplay_create(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = dragonBones::CCArmatureDisplay::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_dragonBones_CCArmatureDisplay_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureDisplay_create)

SE_DECLARE_FINALIZE_FUNC(js_dragonBones_CCArmatureDisplay_finalize)

static bool js_dragonbones_CCArmatureDisplay_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    dragonBones::CCArmatureDisplay* cobj = JSB_ALLOC(dragonBones::CCArmatureDisplay);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_dragonbones_CCArmatureDisplay_constructor, __jsb_dragonBones_CCArmatureDisplay_class, js_dragonBones_CCArmatureDisplay_finalize)



static bool js_dragonBones_CCArmatureDisplay_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj =SE_THIS_OBJECT<dragonBones::CCArmatureDisplay>(s);
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_CCArmatureDisplay_finalize)

bool js_register_dragonbones_CCArmatureDisplay(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CCArmatureDisplay", obj, nullptr, _SE(js_dragonbones_CCArmatureDisplay_constructor));

    cls->defineFunction("addDBEventListener", _SE(js_dragonbones_CCArmatureDisplay_addDBEventListener));
    cls->defineFunction("armature", _SE(js_dragonbones_CCArmatureDisplay_getArmature));
    cls->defineFunction("convertToRootSpace", _SE(js_dragonbones_CCArmatureDisplay_convertToRootSpace));
    cls->defineFunction("dbClear", _SE(js_dragonbones_CCArmatureDisplay_dbClear));
    cls->defineFunction("dbInit", _SE(js_dragonbones_CCArmatureDisplay_dbInit));
    cls->defineFunction("dbRender", _SE(js_dragonbones_CCArmatureDisplay_dbRender));
    cls->defineFunction("dbUpdate", _SE(js_dragonbones_CCArmatureDisplay_dbUpdate));
    cls->defineFunction("dispatchDBEvent", _SE(js_dragonbones_CCArmatureDisplay_dispatchDBEvent));
    cls->defineFunction("dispose", _SE(js_dragonbones_CCArmatureDisplay_dispose));
    cls->defineFunction("getAnimation", _SE(js_dragonbones_CCArmatureDisplay_getAnimation));
    cls->defineFunction("getDebugData", _SE(js_dragonbones_CCArmatureDisplay_getDebugData));
    cls->defineFunction("getParamsBuffer", _SE(js_dragonbones_CCArmatureDisplay_getParamsBuffer));
    cls->defineFunction("getRootDisplay", _SE(js_dragonbones_CCArmatureDisplay_getRootDisplay));
    cls->defineFunction("getSharedBufferOffset", _SE(js_dragonbones_CCArmatureDisplay_getSharedBufferOffset));
    cls->defineFunction("hasDBEventListener", _SE(js_dragonbones_CCArmatureDisplay_hasDBEventListener));
    cls->defineFunction("removeDBEventListener", _SE(js_dragonbones_CCArmatureDisplay_removeDBEventListener));
    cls->defineFunction("setAttachEnabled", _SE(js_dragonbones_CCArmatureDisplay_setAttachEnabled));
    cls->defineFunction("setBatchEnabled", _SE(js_dragonbones_CCArmatureDisplay_setBatchEnabled));
    cls->defineFunction("setColor", _SE(js_dragonbones_CCArmatureDisplay_setColor));
    cls->defineFunction("setDBEventCallback", _SE(js_dragonbones_CCArmatureDisplay_setDBEventCallback));
    cls->defineFunction("setDebugBonesEnabled", _SE(js_dragonbones_CCArmatureDisplay_setDebugBonesEnabled));
    cls->defineFunction("setOpacityModifyRGB", _SE(js_dragonbones_CCArmatureDisplay_setOpacityModifyRGB));
    cls->defineStaticFunction("create", _SE(js_dragonbones_CCArmatureDisplay_create));
    cls->defineFinalizeFunction(_SE(js_dragonBones_CCArmatureDisplay_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCArmatureDisplay>(cls);

    __jsb_dragonBones_CCArmatureDisplay_proto = cls->getProto();
    __jsb_dragonBones_CCArmatureDisplay_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_ArmatureCacheMgr_proto = nullptr;
se::Class* __jsb_dragonBones_ArmatureCacheMgr_class = nullptr;

static bool js_dragonbones_ArmatureCacheMgr_buildArmatureCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureCacheMgr>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureCacheMgr_buildArmatureCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::string, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureCacheMgr_buildArmatureCache : Error processing arguments");
        dragonBones::ArmatureCache* result = cobj->buildArmatureCache(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureCacheMgr_buildArmatureCache : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureCacheMgr_buildArmatureCache)

static bool js_dragonbones_ArmatureCacheMgr_removeArmatureCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureCacheMgr>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_ArmatureCacheMgr_removeArmatureCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureCacheMgr_removeArmatureCache : Error processing arguments");
        cobj->removeArmatureCache(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureCacheMgr_removeArmatureCache)

static bool js_dragonbones_ArmatureCacheMgr_destroyInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        dragonBones::ArmatureCacheMgr::destroyInstance();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureCacheMgr_destroyInstance)

static bool js_dragonbones_ArmatureCacheMgr_getInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::ArmatureCacheMgr* result = dragonBones::ArmatureCacheMgr::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_ArmatureCacheMgr_getInstance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_ArmatureCacheMgr_getInstance)


static bool js_dragonBones_ArmatureCacheMgr_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<dragonBones::ArmatureCacheMgr>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<dragonBones::ArmatureCacheMgr>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_ArmatureCacheMgr_finalize)

bool js_register_dragonbones_ArmatureCacheMgr(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ArmatureCacheMgr", obj, nullptr, nullptr);

    cls->defineFunction("buildArmatureCache", _SE(js_dragonbones_ArmatureCacheMgr_buildArmatureCache));
    cls->defineFunction("removeArmatureCache", _SE(js_dragonbones_ArmatureCacheMgr_removeArmatureCache));
    cls->defineStaticFunction("destroyInstance", _SE(js_dragonbones_ArmatureCacheMgr_destroyInstance));
    cls->defineStaticFunction("getInstance", _SE(js_dragonbones_ArmatureCacheMgr_getInstance));
    cls->defineFinalizeFunction(_SE(js_dragonBones_ArmatureCacheMgr_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::ArmatureCacheMgr>(cls);

    __jsb_dragonBones_ArmatureCacheMgr_proto = cls->getProto();
    __jsb_dragonBones_ArmatureCacheMgr_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_CCArmatureCacheDisplay_proto = nullptr;
se::Class* __jsb_dragonBones_CCArmatureCacheDisplay_class = nullptr;

static bool js_dragonbones_CCArmatureCacheDisplay_addDBEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_addDBEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_addDBEventListener : Error processing arguments");
        cobj->addDBEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_addDBEventListener)

static bool js_dragonbones_CCArmatureCacheDisplay_getArmature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getArmature();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_getArmature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_getArmature)

static bool js_dragonbones_CCArmatureCacheDisplay_beginSchedule(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_beginSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_beginSchedule)

static bool js_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<dragonBones::EventObject*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent : Error processing arguments");
        cobj->dispatchDBEvent(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent)

static bool js_dragonbones_CCArmatureCacheDisplay_dispose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_dispose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dispose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_dispose)

static bool js_dragonbones_CCArmatureCacheDisplay_getAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_getAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Animation* result = cobj->getAnimation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_getAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_getAnimation)

static bool js_dragonbones_CCArmatureCacheDisplay_getParamsBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_getParamsBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se_object_ptr result = cobj->getParamsBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_getParamsBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_getParamsBuffer)

static bool js_dragonbones_CCArmatureCacheDisplay_getSharedBufferOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_getSharedBufferOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se_object_ptr result = cobj->getSharedBufferOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_getSharedBufferOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_getSharedBufferOffset)

static bool js_dragonbones_CCArmatureCacheDisplay_getTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_getTimeScale : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_getTimeScale)

static bool js_dragonbones_CCArmatureCacheDisplay_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_onDisable)

static bool js_dragonbones_CCArmatureCacheDisplay_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_onEnable)

static bool js_dragonbones_CCArmatureCacheDisplay_playAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_playAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_playAnimation : Error processing arguments");
        cobj->playAnimation(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_playAnimation)

static bool js_dragonbones_CCArmatureCacheDisplay_removeDBEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_removeDBEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_removeDBEventListener : Error processing arguments");
        cobj->removeDBEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_removeDBEventListener)

static bool js_dragonbones_CCArmatureCacheDisplay_render(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_render : Error processing arguments");
        cobj->render(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_render)

static bool js_dragonbones_CCArmatureCacheDisplay_setAttachEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_setAttachEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_setAttachEnabled : Error processing arguments");
        cobj->setAttachEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_setAttachEnabled)

static bool js_dragonbones_CCArmatureCacheDisplay_setBatchEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_setBatchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_setBatchEnabled : Error processing arguments");
        cobj->setBatchEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_setBatchEnabled)

static bool js_dragonbones_CCArmatureCacheDisplay_setColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_setColor : Error processing arguments");
        cobj->setColor(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_setColor)

static bool js_dragonbones_CCArmatureCacheDisplay_setDBEventCallback(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_setDBEventCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (dragonBones::EventObject *)>, false> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](dragonBones::EventObject* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_setDBEventCallback : Error processing arguments");
        cobj->setDBEventCallback(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_setDBEventCallback)

static bool js_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB : Error processing arguments");
        cobj->setOpacityModifyRGB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB)

static bool js_dragonbones_CCArmatureCacheDisplay_setTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_setTimeScale)

static bool js_dragonbones_CCArmatureCacheDisplay_stopSchedule(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_stopSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_stopSchedule)

static bool js_dragonbones_CCArmatureCacheDisplay_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_update)

static bool js_dragonbones_CCArmatureCacheDisplay_updateAllAnimationCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_updateAllAnimationCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateAllAnimationCache();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_updateAllAnimationCache)

static bool js_dragonbones_CCArmatureCacheDisplay_updateAnimationCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCArmatureCacheDisplay_updateAnimationCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_updateAnimationCache : Error processing arguments");
        cobj->updateAnimationCache(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCArmatureCacheDisplay_updateAnimationCache)

SE_DECLARE_FINALIZE_FUNC(js_dragonBones_CCArmatureCacheDisplay_finalize)

static bool js_dragonbones_CCArmatureCacheDisplay_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    std::string arg0;
    std::string arg1;
    std::string arg2;
    bool arg3;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
    ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
    ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_dragonbones_CCArmatureCacheDisplay_constructor : Error processing arguments");
    dragonBones::CCArmatureCacheDisplay* cobj = JSB_ALLOC(dragonBones::CCArmatureCacheDisplay, arg0, arg1, arg2, arg3);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_dragonbones_CCArmatureCacheDisplay_constructor, __jsb_dragonBones_CCArmatureCacheDisplay_class, js_dragonBones_CCArmatureCacheDisplay_finalize)



static bool js_dragonBones_CCArmatureCacheDisplay_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj =SE_THIS_OBJECT<dragonBones::CCArmatureCacheDisplay>(s);
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_CCArmatureCacheDisplay_finalize)

bool js_register_dragonbones_CCArmatureCacheDisplay(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CCArmatureCacheDisplay", obj, nullptr, _SE(js_dragonbones_CCArmatureCacheDisplay_constructor));

    cls->defineFunction("addDBEventListener", _SE(js_dragonbones_CCArmatureCacheDisplay_addDBEventListener));
    cls->defineFunction("armature", _SE(js_dragonbones_CCArmatureCacheDisplay_getArmature));
    cls->defineFunction("beginSchedule", _SE(js_dragonbones_CCArmatureCacheDisplay_beginSchedule));
    cls->defineFunction("dispatchDBEvent", _SE(js_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent));
    cls->defineFunction("dispose", _SE(js_dragonbones_CCArmatureCacheDisplay_dispose));
    cls->defineFunction("getAnimation", _SE(js_dragonbones_CCArmatureCacheDisplay_getAnimation));
    cls->defineFunction("getParamsBuffer", _SE(js_dragonbones_CCArmatureCacheDisplay_getParamsBuffer));
    cls->defineFunction("getSharedBufferOffset", _SE(js_dragonbones_CCArmatureCacheDisplay_getSharedBufferOffset));
    cls->defineFunction("getTimeScale", _SE(js_dragonbones_CCArmatureCacheDisplay_getTimeScale));
    cls->defineFunction("onDisable", _SE(js_dragonbones_CCArmatureCacheDisplay_onDisable));
    cls->defineFunction("onEnable", _SE(js_dragonbones_CCArmatureCacheDisplay_onEnable));
    cls->defineFunction("playAnimation", _SE(js_dragonbones_CCArmatureCacheDisplay_playAnimation));
    cls->defineFunction("removeDBEventListener", _SE(js_dragonbones_CCArmatureCacheDisplay_removeDBEventListener));
    cls->defineFunction("render", _SE(js_dragonbones_CCArmatureCacheDisplay_render));
    cls->defineFunction("setAttachEnabled", _SE(js_dragonbones_CCArmatureCacheDisplay_setAttachEnabled));
    cls->defineFunction("setBatchEnabled", _SE(js_dragonbones_CCArmatureCacheDisplay_setBatchEnabled));
    cls->defineFunction("setColor", _SE(js_dragonbones_CCArmatureCacheDisplay_setColor));
    cls->defineFunction("setDBEventCallback", _SE(js_dragonbones_CCArmatureCacheDisplay_setDBEventCallback));
    cls->defineFunction("setOpacityModifyRGB", _SE(js_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB));
    cls->defineFunction("setTimeScale", _SE(js_dragonbones_CCArmatureCacheDisplay_setTimeScale));
    cls->defineFunction("stopSchedule", _SE(js_dragonbones_CCArmatureCacheDisplay_stopSchedule));
    cls->defineFunction("update", _SE(js_dragonbones_CCArmatureCacheDisplay_update));
    cls->defineFunction("updateAllAnimationCache", _SE(js_dragonbones_CCArmatureCacheDisplay_updateAllAnimationCache));
    cls->defineFunction("updateAnimationCache", _SE(js_dragonbones_CCArmatureCacheDisplay_updateAnimationCache));
    cls->defineFinalizeFunction(_SE(js_dragonBones_CCArmatureCacheDisplay_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCArmatureCacheDisplay>(cls);

    __jsb_dragonBones_CCArmatureCacheDisplay_proto = cls->getProto();
    __jsb_dragonBones_CCArmatureCacheDisplay_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_CCFactory_proto = nullptr;
se::Class* __jsb_dragonBones_CCFactory_class = nullptr;

static bool js_dragonbones_CCFactory_add(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_add : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::Armature*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_add : Error processing arguments");
        cobj->add(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_add)

static bool js_dragonbones_CCFactory_buildArmatureDisplay(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_buildArmatureDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* result = cobj->buildArmatureDisplay(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* result = cobj->buildArmatureDisplay(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::string, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* result = cobj->buildArmatureDisplay(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 4) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::string, true> arg2 = {};
        HolderType<std::string, true> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* result = cobj->buildArmatureDisplay(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_buildArmatureDisplay)

static bool js_dragonbones_CCFactory_getDragonBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_getDragonBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::DragonBones* result = cobj->getDragonBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_getDragonBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_getDragonBones)

static bool js_dragonbones_CCFactory_getSoundEventManager(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_getSoundEventManager : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::CCArmatureDisplay* result = cobj->getSoundEventManager();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_getSoundEventManager : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_getSoundEventManager)

static bool js_dragonbones_CCFactory_getTextureAtlasDataByIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_getTextureAtlasDataByIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_getTextureAtlasDataByIndex : Error processing arguments");
        dragonBones::CCTextureAtlasData* result = cobj->getTextureAtlasDataByIndex(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_getTextureAtlasDataByIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_getTextureAtlasDataByIndex)

static bool js_dragonbones_CCFactory_getTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_getTimeScale : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_getTimeScale)

static bool js_dragonbones_CCFactory_parseDragonBonesDataByPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_parseDragonBonesDataByPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesDataByPath(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesDataByPath(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesDataByPath(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_parseDragonBonesDataByPath)

static bool js_dragonbones_CCFactory_remove(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_remove : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<dragonBones::Armature*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_remove : Error processing arguments");
        cobj->remove(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_remove)

static bool js_dragonbones_CCFactory_removeDragonBonesDataByUUID(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_removeDragonBonesDataByUUID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_removeDragonBonesDataByUUID : Error processing arguments");
        cobj->removeDragonBonesDataByUUID(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_removeDragonBonesDataByUUID : Error processing arguments");
        cobj->removeDragonBonesDataByUUID(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_removeDragonBonesDataByUUID)

static bool js_dragonbones_CCFactory_removeTextureAtlasDataByIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_removeTextureAtlasDataByIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_removeTextureAtlasDataByIndex : Error processing arguments");
        cobj->removeTextureAtlasDataByIndex(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_removeTextureAtlasDataByIndex)

static bool js_dragonbones_CCFactory_render(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_render : Error processing arguments");
        cobj->render(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_render)

static bool js_dragonbones_CCFactory_setTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_setTimeScale)

static bool js_dragonbones_CCFactory_stopSchedule(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_stopSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_stopSchedule)

static bool js_dragonbones_CCFactory_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
    SE_PRECONDITION2(cobj, false, "js_dragonbones_CCFactory_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_update)

static bool js_dragonbones_CCFactory_isInit(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = dragonBones::CCFactory::isInit();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_isInit : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_isInit)

static bool js_dragonbones_CCFactory_destroyFactory(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        dragonBones::CCFactory::destroyFactory();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_destroyFactory)

static bool js_dragonbones_CCFactory_getFactory(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::CCFactory* result = dragonBones::CCFactory::getFactory();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_getFactory : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_getFactory)

static bool js_dragonbones_CCFactory_getClock(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = dragonBones::CCFactory::getClock();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_dragonbones_CCFactory_getClock : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_dragonbones_CCFactory_getClock)

SE_DECLARE_FINALIZE_FUNC(js_dragonBones_CCFactory_finalize)

static bool js_dragonbones_CCFactory_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    dragonBones::CCFactory* cobj = JSB_ALLOC(dragonBones::CCFactory);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_dragonbones_CCFactory_constructor, __jsb_dragonBones_CCFactory_class, js_dragonBones_CCFactory_finalize)



static bool js_dragonBones_CCFactory_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<dragonBones::CCFactory>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<dragonBones::CCFactory>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_CCFactory_finalize)

bool js_register_dragonbones_CCFactory(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CCFactory", obj, __jsb_dragonBones_BaseFactory_proto, _SE(js_dragonbones_CCFactory_constructor));

    cls->defineFunction("add", _SE(js_dragonbones_CCFactory_add));
    cls->defineFunction("buildArmatureDisplay", _SE(js_dragonbones_CCFactory_buildArmatureDisplay));
    cls->defineFunction("getDragonBones", _SE(js_dragonbones_CCFactory_getDragonBones));
    cls->defineFunction("getSoundEventManager", _SE(js_dragonbones_CCFactory_getSoundEventManager));
    cls->defineFunction("getTextureAtlasDataByIndex", _SE(js_dragonbones_CCFactory_getTextureAtlasDataByIndex));
    cls->defineFunction("getTimeScale", _SE(js_dragonbones_CCFactory_getTimeScale));
    cls->defineFunction("parseDragonBonesDataByPath", _SE(js_dragonbones_CCFactory_parseDragonBonesDataByPath));
    cls->defineFunction("remove", _SE(js_dragonbones_CCFactory_remove));
    cls->defineFunction("removeDragonBonesDataByUUID", _SE(js_dragonbones_CCFactory_removeDragonBonesDataByUUID));
    cls->defineFunction("removeTextureAtlasDataByIndex", _SE(js_dragonbones_CCFactory_removeTextureAtlasDataByIndex));
    cls->defineFunction("render", _SE(js_dragonbones_CCFactory_render));
    cls->defineFunction("setTimeScale", _SE(js_dragonbones_CCFactory_setTimeScale));
    cls->defineFunction("stopSchedule", _SE(js_dragonbones_CCFactory_stopSchedule));
    cls->defineFunction("update", _SE(js_dragonbones_CCFactory_update));
    cls->defineStaticFunction("isInit", _SE(js_dragonbones_CCFactory_isInit));
    cls->defineStaticFunction("destroyFactory", _SE(js_dragonbones_CCFactory_destroyFactory));
    cls->defineStaticFunction("getFactory", _SE(js_dragonbones_CCFactory_getFactory));
    cls->defineStaticFunction("getClock", _SE(js_dragonbones_CCFactory_getClock));
    cls->defineFinalizeFunction(_SE(js_dragonBones_CCFactory_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCFactory>(cls);

    __jsb_dragonBones_CCFactory_proto = cls->getProto();
    __jsb_dragonBones_CCFactory_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_CCTextureAtlasData_proto = nullptr;
se::Class* __jsb_dragonBones_CCTextureAtlasData_class = nullptr;



bool js_register_dragonbones_CCTextureAtlasData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CCTextureAtlasData", obj, __jsb_dragonBones_TextureAtlasData_proto, nullptr);

    cls->install();
    JSBClassType::registerClass<dragonBones::CCTextureAtlasData>(cls);

    __jsb_dragonBones_CCTextureAtlasData_proto = cls->getProto();
    __jsb_dragonBones_CCTextureAtlasData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_dragonBones_CCTextureData_proto = nullptr;
se::Class* __jsb_dragonBones_CCTextureData_class = nullptr;



bool js_register_dragonbones_CCTextureData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CCTextureData", obj, __jsb_dragonBones_TextureData_proto, nullptr);

    cls->install();
    JSBClassType::registerClass<dragonBones::CCTextureData>(cls);

    __jsb_dragonBones_CCTextureData_proto = cls->getProto();
    __jsb_dragonBones_CCTextureData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_dragonbones(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("dragonBones", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("dragonBones", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_dragonbones_Slot(ns);
    js_register_dragonbones_Matrix(ns);
    js_register_dragonbones_Transform(ns);
    js_register_dragonbones_BaseObject(ns);
    js_register_dragonbones_Animation(ns);
    js_register_dragonbones_TextureData(ns);
    js_register_dragonbones_CCTextureData(ns);
    js_register_dragonbones_BaseFactory(ns);
    js_register_dragonbones_CCFactory(ns);
    js_register_dragonbones_WorldClock(ns);
    js_register_dragonbones_Rectangle(ns);
    js_register_dragonbones_TextureAtlasData(ns);
    js_register_dragonbones_CCArmatureDisplay(ns);
    js_register_dragonbones_AnimationState(ns);
    js_register_dragonbones_BoneData(ns);
    js_register_dragonbones_ArmatureData(ns);
    js_register_dragonbones_CCTextureAtlasData(ns);
    js_register_dragonbones_TransformObject(ns);
    js_register_dragonbones_CCSlot(ns);
    js_register_dragonbones_Armature(ns);
    js_register_dragonbones_Bone(ns);
    js_register_dragonbones_ArmatureCacheMgr(ns);
    js_register_dragonbones_SkinData(ns);
    js_register_dragonbones_EventObject(ns);
    js_register_dragonbones_SlotData(ns);
    js_register_dragonbones_DragonBonesData(ns);
    js_register_dragonbones_AnimationData(ns);
    js_register_dragonbones_CCArmatureCacheDisplay(ns);
    return true;
}

#endif //#if USE_DRAGONBONES > 0
