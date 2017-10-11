#include "scripting/js-bindings/auto/jsb_cocos2dx_dragonbones_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "editor-support/dragonbones/cocos2dx/CCDragonBonesHeaders.h"

se::Object* __jsb_dragonBones_BaseObject_proto = nullptr;
se::Class* __jsb_dragonBones_BaseObject_class = nullptr;

static bool js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex(se::State& s)
{
    dragonBones::BaseObject* cobj = (dragonBones::BaseObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = cobj->getClassTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex)

static bool js_cocos2dx_dragonbones_BaseObject_returnToPool(se::State& s)
{
    dragonBones::BaseObject* cobj = (dragonBones::BaseObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseObject_returnToPool : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->returnToPool();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseObject_returnToPool)

static bool js_cocos2dx_dragonbones_BaseObject_clearPool(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned long arg0 = 0;
        ok &= seval_to_ulong(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseObject_clearPool : Error processing arguments");
        dragonBones::BaseObject::clearPool(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseObject_clearPool)

static bool js_cocos2dx_dragonbones_BaseObject_setMaxCount(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned long arg0 = 0;
        unsigned long arg1 = 0;
        ok &= seval_to_ulong(args[0], &arg0);
        ok &= seval_to_ulong(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseObject_setMaxCount : Error processing arguments");
        dragonBones::BaseObject::setMaxCount(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseObject_setMaxCount)




bool js_register_cocos2dx_dragonbones_BaseObject(se::Object* obj)
{
    auto cls = se::Class::create("BaseObject", obj, nullptr, nullptr);

    cls->defineFunction("getClassTypeIndex", _SE(js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex));
    cls->defineFunction("returnToPool", _SE(js_cocos2dx_dragonbones_BaseObject_returnToPool));
    cls->defineStaticFunction("clearPool", _SE(js_cocos2dx_dragonbones_BaseObject_clearPool));
    cls->defineStaticFunction("setMaxCount", _SE(js_cocos2dx_dragonbones_BaseObject_setMaxCount));
    cls->install();
    JSBClassType::registerClass<dragonBones::BaseObject>(cls);

    __jsb_dragonBones_BaseObject_proto = cls->getProto();
    __jsb_dragonBones_BaseObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Matrix_proto = nullptr;
se::Class* __jsb_dragonBones_Matrix_class = nullptr;

static bool js_cocos2dx_dragonbones_Matrix_get_a(se::State& s)
{
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_get_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->a, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Matrix_get_a)

static bool js_cocos2dx_dragonbones_Matrix_set_a(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_set_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Matrix_set_a : Error processing new value");
    cobj->a = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Matrix_set_a)

static bool js_cocos2dx_dragonbones_Matrix_get_b(se::State& s)
{
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_get_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->b, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Matrix_get_b)

static bool js_cocos2dx_dragonbones_Matrix_set_b(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_set_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Matrix_set_b : Error processing new value");
    cobj->b = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Matrix_set_b)

static bool js_cocos2dx_dragonbones_Matrix_get_c(se::State& s)
{
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_get_c : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->c, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Matrix_get_c)

static bool js_cocos2dx_dragonbones_Matrix_set_c(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_set_c : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Matrix_set_c : Error processing new value");
    cobj->c = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Matrix_set_c)

static bool js_cocos2dx_dragonbones_Matrix_get_d(se::State& s)
{
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_get_d : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->d, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Matrix_get_d)

static bool js_cocos2dx_dragonbones_Matrix_set_d(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_set_d : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Matrix_set_d : Error processing new value");
    cobj->d = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Matrix_set_d)

static bool js_cocos2dx_dragonbones_Matrix_get_tx(se::State& s)
{
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_get_tx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->tx, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Matrix_get_tx)

static bool js_cocos2dx_dragonbones_Matrix_set_tx(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_set_tx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Matrix_set_tx : Error processing new value");
    cobj->tx = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Matrix_set_tx)

static bool js_cocos2dx_dragonbones_Matrix_get_ty(se::State& s)
{
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_get_ty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->ty, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Matrix_get_ty)

static bool js_cocos2dx_dragonbones_Matrix_set_ty(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Matrix* cobj = (dragonBones::Matrix*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Matrix_set_ty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Matrix_set_ty : Error processing new value");
    cobj->ty = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Matrix_set_ty)




bool js_register_cocos2dx_dragonbones_Matrix(se::Object* obj)
{
    auto cls = se::Class::create("Matrix", obj, nullptr, nullptr);

    cls->defineProperty("a", _SE(js_cocos2dx_dragonbones_Matrix_get_a), _SE(js_cocos2dx_dragonbones_Matrix_set_a));
    cls->defineProperty("b", _SE(js_cocos2dx_dragonbones_Matrix_get_b), _SE(js_cocos2dx_dragonbones_Matrix_set_b));
    cls->defineProperty("c", _SE(js_cocos2dx_dragonbones_Matrix_get_c), _SE(js_cocos2dx_dragonbones_Matrix_set_c));
    cls->defineProperty("d", _SE(js_cocos2dx_dragonbones_Matrix_get_d), _SE(js_cocos2dx_dragonbones_Matrix_set_d));
    cls->defineProperty("tx", _SE(js_cocos2dx_dragonbones_Matrix_get_tx), _SE(js_cocos2dx_dragonbones_Matrix_set_tx));
    cls->defineProperty("ty", _SE(js_cocos2dx_dragonbones_Matrix_get_ty), _SE(js_cocos2dx_dragonbones_Matrix_set_ty));
    cls->install();
    JSBClassType::registerClass<dragonBones::Matrix>(cls);

    __jsb_dragonBones_Matrix_proto = cls->getProto();
    __jsb_dragonBones_Matrix_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Transform_proto = nullptr;
se::Class* __jsb_dragonBones_Transform_class = nullptr;

static bool js_cocos2dx_dragonbones_Transform_getRotation(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_getRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRotation();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_getRotation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Transform_getRotation)

static bool js_cocos2dx_dragonbones_Transform_setRotation(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_setRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_setRotation : Error processing arguments");
        cobj->setRotation(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Transform_setRotation)

static bool js_cocos2dx_dragonbones_Transform_normalizeRadian(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_normalizeRadian : Error processing arguments");
        float result = dragonBones::Transform::normalizeRadian(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_normalizeRadian : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Transform_normalizeRadian)

static bool js_cocos2dx_dragonbones_Transform_get_x(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->x, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Transform_get_x)

static bool js_cocos2dx_dragonbones_Transform_set_x(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_set_x : Error processing new value");
    cobj->x = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Transform_set_x)

static bool js_cocos2dx_dragonbones_Transform_get_y(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->y, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Transform_get_y)

static bool js_cocos2dx_dragonbones_Transform_set_y(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_set_y : Error processing new value");
    cobj->y = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Transform_set_y)

static bool js_cocos2dx_dragonbones_Transform_get_skewX(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_get_skewX : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->skewX, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Transform_get_skewX)

static bool js_cocos2dx_dragonbones_Transform_set_skewX(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_set_skewX : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_set_skewX : Error processing new value");
    cobj->skewX = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Transform_set_skewX)

static bool js_cocos2dx_dragonbones_Transform_get_skewY(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_get_skewY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->skewY, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Transform_get_skewY)

static bool js_cocos2dx_dragonbones_Transform_set_skewY(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_set_skewY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_set_skewY : Error processing new value");
    cobj->skewY = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Transform_set_skewY)

static bool js_cocos2dx_dragonbones_Transform_get_scaleX(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_get_scaleX : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->scaleX, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Transform_get_scaleX)

static bool js_cocos2dx_dragonbones_Transform_set_scaleX(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_set_scaleX : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_set_scaleX : Error processing new value");
    cobj->scaleX = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Transform_set_scaleX)

static bool js_cocos2dx_dragonbones_Transform_get_scaleY(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_get_scaleY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->scaleY, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Transform_get_scaleY)

static bool js_cocos2dx_dragonbones_Transform_set_scaleY(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_set_scaleY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_set_scaleY : Error processing new value");
    cobj->scaleY = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Transform_set_scaleY)




bool js_register_cocos2dx_dragonbones_Transform(se::Object* obj)
{
    auto cls = se::Class::create("Transform", obj, nullptr, nullptr);

    cls->defineProperty("x", _SE(js_cocos2dx_dragonbones_Transform_get_x), _SE(js_cocos2dx_dragonbones_Transform_set_x));
    cls->defineProperty("y", _SE(js_cocos2dx_dragonbones_Transform_get_y), _SE(js_cocos2dx_dragonbones_Transform_set_y));
    cls->defineProperty("skewX", _SE(js_cocos2dx_dragonbones_Transform_get_skewX), _SE(js_cocos2dx_dragonbones_Transform_set_skewX));
    cls->defineProperty("skewY", _SE(js_cocos2dx_dragonbones_Transform_get_skewY), _SE(js_cocos2dx_dragonbones_Transform_set_skewY));
    cls->defineProperty("scaleX", _SE(js_cocos2dx_dragonbones_Transform_get_scaleX), _SE(js_cocos2dx_dragonbones_Transform_set_scaleX));
    cls->defineProperty("scaleY", _SE(js_cocos2dx_dragonbones_Transform_get_scaleY), _SE(js_cocos2dx_dragonbones_Transform_set_scaleY));
    cls->defineFunction("getRotation", _SE(js_cocos2dx_dragonbones_Transform_getRotation));
    cls->defineFunction("setRotation", _SE(js_cocos2dx_dragonbones_Transform_setRotation));
    cls->defineStaticFunction("normalizeRadian", _SE(js_cocos2dx_dragonbones_Transform_normalizeRadian));
    cls->install();
    JSBClassType::registerClass<dragonBones::Transform>(cls);

    __jsb_dragonBones_Transform_proto = cls->getProto();
    __jsb_dragonBones_Transform_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_TextureData_proto = nullptr;
se::Class* __jsb_dragonBones_TextureData_class = nullptr;


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_TextureData(se::Object* obj)
{
    auto cls = se::Class::create("TextureData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->install();
    JSBClassType::registerClass<dragonBones::TextureData>(cls);

    __jsb_dragonBones_TextureData_proto = cls->getProto();
    __jsb_dragonBones_TextureData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_TextureAtlasData_proto = nullptr;
se::Class* __jsb_dragonBones_TextureAtlasData_class = nullptr;

static bool js_cocos2dx_dragonbones_TextureAtlasData_addTexture(se::State& s)
{
    dragonBones::TextureAtlasData* cobj = (dragonBones::TextureAtlasData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureAtlasData_addTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::TextureData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureAtlasData_addTexture : Error processing arguments");
        cobj->addTexture(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureAtlasData_addTexture)

static bool js_cocos2dx_dragonbones_TextureAtlasData_generateTexture(se::State& s)
{
    dragonBones::TextureAtlasData* cobj = (dragonBones::TextureAtlasData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureAtlasData_generateTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::TextureData* result = cobj->generateTexture();
        ok &= native_ptr_to_rooted_seval<dragonBones::TextureData>((dragonBones::TextureData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureAtlasData_generateTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureAtlasData_generateTexture)

static bool js_cocos2dx_dragonbones_TextureAtlasData_getTexture(se::State& s)
{
    dragonBones::TextureAtlasData* cobj = (dragonBones::TextureAtlasData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureAtlasData_getTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureAtlasData_getTexture : Error processing arguments");
        dragonBones::TextureData* result = cobj->getTexture(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::TextureData>((dragonBones::TextureData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureAtlasData_getTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureAtlasData_getTexture)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_TextureAtlasData(se::Object* obj)
{
    auto cls = se::Class::create("TextureAtlasData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineFunction("addTexture", _SE(js_cocos2dx_dragonbones_TextureAtlasData_addTexture));
    cls->defineFunction("generateTexture", _SE(js_cocos2dx_dragonbones_TextureAtlasData_generateTexture));
    cls->defineFunction("getTexture", _SE(js_cocos2dx_dragonbones_TextureAtlasData_getTexture));
    cls->install();
    JSBClassType::registerClass<dragonBones::TextureAtlasData>(cls);

    __jsb_dragonBones_TextureAtlasData_proto = cls->getProto();
    __jsb_dragonBones_TextureAtlasData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_AnimationData_proto = nullptr;
se::Class* __jsb_dragonBones_AnimationData_class = nullptr;

static bool js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = cobj->getClassTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex)

static bool js_cocos2dx_dragonbones_AnimationData_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::AnimationData::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_getTypeIndex)

static bool js_cocos2dx_dragonbones_AnimationData_get_frameCount(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_get_frameCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval(cobj->frameCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationData_get_frameCount)

static bool js_cocos2dx_dragonbones_AnimationData_set_frameCount(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_set_frameCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_set_frameCount : Error processing new value");
    cobj->frameCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationData_set_frameCount)

static bool js_cocos2dx_dragonbones_AnimationData_get_playTimes(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_get_playTimes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval(cobj->playTimes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationData_get_playTimes)

static bool js_cocos2dx_dragonbones_AnimationData_set_playTimes(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_set_playTimes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_set_playTimes : Error processing new value");
    cobj->playTimes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationData_set_playTimes)

static bool js_cocos2dx_dragonbones_AnimationData_get_position(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_get_position : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->position, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationData_get_position)

static bool js_cocos2dx_dragonbones_AnimationData_set_position(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_set_position : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_set_position : Error processing new value");
    cobj->position = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationData_set_position)

static bool js_cocos2dx_dragonbones_AnimationData_get_duration(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_get_duration : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->duration, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationData_get_duration)

static bool js_cocos2dx_dragonbones_AnimationData_set_duration(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_set_duration : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_set_duration : Error processing new value");
    cobj->duration = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationData_set_duration)

static bool js_cocos2dx_dragonbones_AnimationData_get_fadeInTime(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_get_fadeInTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->fadeInTime, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationData_get_fadeInTime)

static bool js_cocos2dx_dragonbones_AnimationData_set_fadeInTime(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_set_fadeInTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_set_fadeInTime : Error processing new value");
    cobj->fadeInTime = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationData_set_fadeInTime)

static bool js_cocos2dx_dragonbones_AnimationData_get_name(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationData_get_name)

static bool js_cocos2dx_dragonbones_AnimationData_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationData_set_name)




bool js_register_cocos2dx_dragonbones_AnimationData(se::Object* obj)
{
    auto cls = se::Class::create("AnimationData", obj, nullptr, nullptr);

    cls->defineProperty("frameCount", _SE(js_cocos2dx_dragonbones_AnimationData_get_frameCount), _SE(js_cocos2dx_dragonbones_AnimationData_set_frameCount));
    cls->defineProperty("playTimes", _SE(js_cocos2dx_dragonbones_AnimationData_get_playTimes), _SE(js_cocos2dx_dragonbones_AnimationData_set_playTimes));
    cls->defineProperty("position", _SE(js_cocos2dx_dragonbones_AnimationData_get_position), _SE(js_cocos2dx_dragonbones_AnimationData_set_position));
    cls->defineProperty("duration", _SE(js_cocos2dx_dragonbones_AnimationData_get_duration), _SE(js_cocos2dx_dragonbones_AnimationData_set_duration));
    cls->defineProperty("fadeInTime", _SE(js_cocos2dx_dragonbones_AnimationData_get_fadeInTime), _SE(js_cocos2dx_dragonbones_AnimationData_set_fadeInTime));
    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_AnimationData_get_name), _SE(js_cocos2dx_dragonbones_AnimationData_set_name));
    cls->defineFunction("getClassTypeIndex", _SE(js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_AnimationData_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::AnimationData>(cls);

    __jsb_dragonBones_AnimationData_proto = cls->getProto();
    __jsb_dragonBones_AnimationData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_BoneData_proto = nullptr;
se::Class* __jsb_dragonBones_BoneData_class = nullptr;

static bool js_cocos2dx_dragonbones_BoneData_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::BoneData::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BoneData_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BoneData_getTypeIndex)

static bool js_cocos2dx_dragonbones_BoneData_get_name(se::State& s)
{
    dragonBones::BoneData* cobj = (dragonBones::BoneData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BoneData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_BoneData_get_name)

static bool js_cocos2dx_dragonbones_BoneData_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::BoneData* cobj = (dragonBones::BoneData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BoneData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BoneData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_BoneData_set_name)

static bool js_cocos2dx_dragonbones_BoneData_get_parent(se::State& s)
{
    dragonBones::BoneData* cobj = (dragonBones::BoneData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BoneData_get_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_rooted_seval<dragonBones::BoneData>((dragonBones::BoneData*)cobj->parent, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_BoneData_get_parent)

static bool js_cocos2dx_dragonbones_BoneData_set_parent(se::State& s)
{
    const auto& args = s.args();
    dragonBones::BoneData* cobj = (dragonBones::BoneData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BoneData_set_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    dragonBones::BoneData* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BoneData_set_parent : Error processing new value");
    cobj->parent = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_BoneData_set_parent)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_BoneData(se::Object* obj)
{
    auto cls = se::Class::create("BoneData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_BoneData_get_name), _SE(js_cocos2dx_dragonbones_BoneData_set_name));
    cls->defineProperty("parent", _SE(js_cocos2dx_dragonbones_BoneData_get_parent), _SE(js_cocos2dx_dragonbones_BoneData_set_parent));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_BoneData_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::BoneData>(cls);

    __jsb_dragonBones_BoneData_proto = cls->getProto();
    __jsb_dragonBones_BoneData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_SlotData_proto = nullptr;
se::Class* __jsb_dragonBones_SlotData_class = nullptr;

static bool js_cocos2dx_dragonbones_SlotData_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::SlotData::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_getTypeIndex)

static bool js_cocos2dx_dragonbones_SlotData_get_name(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_SlotData_get_name)

static bool js_cocos2dx_dragonbones_SlotData_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_SlotData_set_name)

static bool js_cocos2dx_dragonbones_SlotData_get_parent(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_get_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_rooted_seval<dragonBones::BoneData>((dragonBones::BoneData*)cobj->parent, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_SlotData_get_parent)

static bool js_cocos2dx_dragonbones_SlotData_set_parent(se::State& s)
{
    const auto& args = s.args();
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_set_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    dragonBones::BoneData* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_set_parent : Error processing new value");
    cobj->parent = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_SlotData_set_parent)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_SlotData(se::Object* obj)
{
    auto cls = se::Class::create("SlotData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_SlotData_get_name), _SE(js_cocos2dx_dragonbones_SlotData_set_name));
    cls->defineProperty("parent", _SE(js_cocos2dx_dragonbones_SlotData_get_parent), _SE(js_cocos2dx_dragonbones_SlotData_set_parent));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_SlotData_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::SlotData>(cls);

    __jsb_dragonBones_SlotData_proto = cls->getProto();
    __jsb_dragonBones_SlotData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_SkinData_proto = nullptr;
se::Class* __jsb_dragonBones_SkinData_class = nullptr;

static bool js_cocos2dx_dragonbones_SkinData_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::SkinData::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SkinData_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SkinData_getTypeIndex)

static bool js_cocos2dx_dragonbones_SkinData_get_name(se::State& s)
{
    dragonBones::SkinData* cobj = (dragonBones::SkinData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SkinData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_SkinData_get_name)

static bool js_cocos2dx_dragonbones_SkinData_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::SkinData* cobj = (dragonBones::SkinData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SkinData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SkinData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_SkinData_set_name)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_SkinData(se::Object* obj)
{
    auto cls = se::Class::create("SkinData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_SkinData_get_name), _SE(js_cocos2dx_dragonbones_SkinData_set_name));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_SkinData_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::SkinData>(cls);

    __jsb_dragonBones_SkinData_proto = cls->getProto();
    __jsb_dragonBones_SkinData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_ArmatureData_proto = nullptr;
se::Class* __jsb_dragonBones_ArmatureData_class = nullptr;

static bool js_cocos2dx_dragonbones_ArmatureData_getBone(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getBone : Error processing arguments");
        dragonBones::BoneData* result = cobj->getBone(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::BoneData>((dragonBones::BoneData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getBone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getBone)

static bool js_cocos2dx_dragonbones_ArmatureData_getAnimation(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getAnimation : Error processing arguments");
        dragonBones::AnimationData* result = cobj->getAnimation(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationData>((dragonBones::AnimationData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getAnimation)

static bool js_cocos2dx_dragonbones_ArmatureData_getSlot(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getSlot : Error processing arguments");
        dragonBones::SlotData* result = cobj->getSlot(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::SlotData>((dragonBones::SlotData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getSlot : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getSlot)

static bool js_cocos2dx_dragonbones_ArmatureData_getSkin(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getSkin : Error processing arguments");
        dragonBones::SkinData* result = cobj->getSkin(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::SkinData>((dragonBones::SkinData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getSkin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getSkin)

static bool js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::SkinData* result = cobj->getDefaultSkin();
        ok &= native_ptr_to_rooted_seval<dragonBones::SkinData>((dragonBones::SkinData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin)

static bool js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::AnimationData* result = cobj->getDefaultAnimation();
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationData>((dragonBones::AnimationData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation)

static bool js_cocos2dx_dragonbones_ArmatureData_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::ArmatureData::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getTypeIndex)

static bool js_cocos2dx_dragonbones_ArmatureData_get_frameRate(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_get_frameRate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval(cobj->frameRate, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_ArmatureData_get_frameRate)

static bool js_cocos2dx_dragonbones_ArmatureData_set_frameRate(se::State& s)
{
    const auto& args = s.args();
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_set_frameRate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_set_frameRate : Error processing new value");
    cobj->frameRate = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_ArmatureData_set_frameRate)

static bool js_cocos2dx_dragonbones_ArmatureData_get_name(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_ArmatureData_get_name)

static bool js_cocos2dx_dragonbones_ArmatureData_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_ArmatureData_set_name)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_ArmatureData(se::Object* obj)
{
    auto cls = se::Class::create("ArmatureData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("frameRate", _SE(js_cocos2dx_dragonbones_ArmatureData_get_frameRate), _SE(js_cocos2dx_dragonbones_ArmatureData_set_frameRate));
    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_ArmatureData_get_name), _SE(js_cocos2dx_dragonbones_ArmatureData_set_name));
    cls->defineFunction("getBone", _SE(js_cocos2dx_dragonbones_ArmatureData_getBone));
    cls->defineFunction("getAnimation", _SE(js_cocos2dx_dragonbones_ArmatureData_getAnimation));
    cls->defineFunction("getSlot", _SE(js_cocos2dx_dragonbones_ArmatureData_getSlot));
    cls->defineFunction("getSkin", _SE(js_cocos2dx_dragonbones_ArmatureData_getSkin));
    cls->defineFunction("getDefaultSkin", _SE(js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin));
    cls->defineFunction("getDefaultAnimation", _SE(js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_ArmatureData_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::ArmatureData>(cls);

    __jsb_dragonBones_ArmatureData_proto = cls->getProto();
    __jsb_dragonBones_ArmatureData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_DragonBonesData_proto = nullptr;
se::Class* __jsb_dragonBones_DragonBonesData_class = nullptr;

static bool js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames(se::State& s)
{
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getArmatureNames();
        ok &= std_vector_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames)

static bool js_cocos2dx_dragonbones_DragonBonesData_getArmature(se::State& s)
{
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmature : Error processing arguments");
        dragonBones::ArmatureData* result = cobj->getArmature(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::ArmatureData>((dragonBones::ArmatureData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_DragonBonesData_getArmature)

static bool js_cocos2dx_dragonbones_DragonBonesData_addArmature(se::State& s)
{
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_DragonBonesData_addArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::ArmatureData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_DragonBonesData_addArmature : Error processing arguments");
        cobj->addArmature(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_DragonBonesData_addArmature)

static bool js_cocos2dx_dragonbones_DragonBonesData_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::DragonBonesData::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_DragonBonesData_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_DragonBonesData_getTypeIndex)

static bool js_cocos2dx_dragonbones_DragonBonesData_get_name(se::State& s)
{
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_DragonBonesData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_DragonBonesData_get_name)

static bool js_cocos2dx_dragonbones_DragonBonesData_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_DragonBonesData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_DragonBonesData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_DragonBonesData_set_name)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_DragonBonesData(se::Object* obj)
{
    auto cls = se::Class::create("DragonBonesData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_DragonBonesData_get_name), _SE(js_cocos2dx_dragonbones_DragonBonesData_set_name));
    cls->defineFunction("getArmatureNames", _SE(js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames));
    cls->defineFunction("getArmature", _SE(js_cocos2dx_dragonbones_DragonBonesData_getArmature));
    cls->defineFunction("addArmature", _SE(js_cocos2dx_dragonbones_DragonBonesData_addArmature));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_DragonBonesData_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::DragonBonesData>(cls);

    __jsb_dragonBones_DragonBonesData_proto = cls->getProto();
    __jsb_dragonBones_DragonBonesData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_EventObject_proto = nullptr;
se::Class* __jsb_dragonBones_EventObject_class = nullptr;

static bool js_cocos2dx_dragonbones_EventObject_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::EventObject::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_EventObject_getTypeIndex)

static bool js_cocos2dx_dragonbones_EventObject_get_type(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_EventObject_get_type)

static bool js_cocos2dx_dragonbones_EventObject_set_type(se::State& s)
{
    const auto& args = s.args();
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_EventObject_set_type)

static bool js_cocos2dx_dragonbones_EventObject_get_name(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_EventObject_get_name)

static bool js_cocos2dx_dragonbones_EventObject_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_EventObject_set_name)

static bool js_cocos2dx_dragonbones_EventObject_get_armature(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_get_armature : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)cobj->armature, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_EventObject_get_armature)

static bool js_cocos2dx_dragonbones_EventObject_set_armature(se::State& s)
{
    const auto& args = s.args();
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_set_armature : Invalid Native Object");

    CC_UNUSED bool ok = true;
    dragonBones::Armature* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_set_armature : Error processing new value");
    cobj->armature = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_EventObject_set_armature)

static bool js_cocos2dx_dragonbones_EventObject_get_bone(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_get_bone : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_rooted_seval<dragonBones::Bone>((dragonBones::Bone*)cobj->bone, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_EventObject_get_bone)

static bool js_cocos2dx_dragonbones_EventObject_set_bone(se::State& s)
{
    const auto& args = s.args();
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_set_bone : Invalid Native Object");

    CC_UNUSED bool ok = true;
    dragonBones::Bone* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_set_bone : Error processing new value");
    cobj->bone = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_EventObject_set_bone)

static bool js_cocos2dx_dragonbones_EventObject_get_slot(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_get_slot : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)cobj->slot, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_EventObject_get_slot)

static bool js_cocos2dx_dragonbones_EventObject_set_slot(se::State& s)
{
    const auto& args = s.args();
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_set_slot : Invalid Native Object");

    CC_UNUSED bool ok = true;
    dragonBones::Slot* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_set_slot : Error processing new value");
    cobj->slot = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_EventObject_set_slot)

static bool js_cocos2dx_dragonbones_EventObject_get_animationState(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_get_animationState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)cobj->animationState, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_EventObject_get_animationState)

static bool js_cocos2dx_dragonbones_EventObject_set_animationState(se::State& s)
{
    const auto& args = s.args();
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_set_animationState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    dragonBones::AnimationState* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_set_animationState : Error processing new value");
    cobj->animationState = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_EventObject_set_animationState)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_EventObject(se::Object* obj)
{
    auto cls = se::Class::create("EventObject", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("type", _SE(js_cocos2dx_dragonbones_EventObject_get_type), _SE(js_cocos2dx_dragonbones_EventObject_set_type));
    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_EventObject_get_name), _SE(js_cocos2dx_dragonbones_EventObject_set_name));
    cls->defineProperty("armature", _SE(js_cocos2dx_dragonbones_EventObject_get_armature), _SE(js_cocos2dx_dragonbones_EventObject_set_armature));
    cls->defineProperty("bone", _SE(js_cocos2dx_dragonbones_EventObject_get_bone), _SE(js_cocos2dx_dragonbones_EventObject_set_bone));
    cls->defineProperty("slot", _SE(js_cocos2dx_dragonbones_EventObject_get_slot), _SE(js_cocos2dx_dragonbones_EventObject_set_slot));
    cls->defineProperty("animationState", _SE(js_cocos2dx_dragonbones_EventObject_get_animationState), _SE(js_cocos2dx_dragonbones_EventObject_set_animationState));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_EventObject_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::EventObject>(cls);

    __jsb_dragonBones_EventObject_proto = cls->getProto();
    __jsb_dragonBones_EventObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Armature_proto = nullptr;
se::Class* __jsb_dragonBones_Armature_class = nullptr;

static bool js_cocos2dx_dragonbones_Armature_getSlot(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getSlot : Error processing arguments");
        dragonBones::Slot* result = cobj->getSlot(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getSlot : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getSlot)

static bool js_cocos2dx_dragonbones_Armature__bufferAction(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature__bufferAction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::ActionData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature__bufferAction : Error processing arguments");
        cobj->_bufferAction(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature__bufferAction)

static bool js_cocos2dx_dragonbones_Armature_getCacheFrameRate(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getCacheFrameRate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCacheFrameRate();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getCacheFrameRate : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getCacheFrameRate)

static bool js_cocos2dx_dragonbones_Armature_getName(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getName)

static bool js_cocos2dx_dragonbones_Armature_dispose(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_dispose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dispose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_dispose)

static bool js_cocos2dx_dragonbones_Armature_addSlot(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_addSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        dragonBones::Slot* arg0 = nullptr;
        std::string arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_addSlot : Error processing arguments");
        cobj->addSlot(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_addSlot)

static bool js_cocos2dx_dragonbones_Armature_invalidUpdate(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_invalidUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->invalidUpdate();
        return true;
    }
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_invalidUpdate : Error processing arguments");
        cobj->invalidUpdate(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_invalidUpdate : Error processing arguments");
        cobj->invalidUpdate(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_invalidUpdate)

static bool js_cocos2dx_dragonbones_Armature_getBoneByDisplay(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getBoneByDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        void* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getBoneByDisplay : Error processing arguments");
        dragonBones::Bone* result = cobj->getBoneByDisplay(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::Bone>((dragonBones::Bone*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getBoneByDisplay : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getBoneByDisplay)

static bool js_cocos2dx_dragonbones_Armature_setCacheFrameRate(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_setCacheFrameRate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_setCacheFrameRate : Error processing arguments");
        cobj->setCacheFrameRate(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_setCacheFrameRate)

static bool js_cocos2dx_dragonbones_Armature_removeSlot(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_removeSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Slot* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_removeSlot : Error processing arguments");
        cobj->removeSlot(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_removeSlot)

static bool js_cocos2dx_dragonbones_Armature_addBone(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_addBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Bone* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_addBone : Error processing arguments");
        cobj->addBone(arg0);
        return true;
    }
    if (argc == 2) {
        dragonBones::Bone* arg0 = nullptr;
        std::string arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_addBone : Error processing arguments");
        cobj->addBone(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_addBone)

static bool js_cocos2dx_dragonbones_Armature_advanceTime(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_advanceTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_advanceTime)

static bool js_cocos2dx_dragonbones_Armature_getBone(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getBone : Error processing arguments");
        dragonBones::Bone* result = cobj->getBone(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::Bone>((dragonBones::Bone*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getBone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getBone)

static bool js_cocos2dx_dragonbones_Armature_getParent(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Slot* result = cobj->getParent();
        ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getParent)

static bool js_cocos2dx_dragonbones_Armature_getSlotByDisplay(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getSlotByDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        void* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getSlotByDisplay : Error processing arguments");
        dragonBones::Slot* result = cobj->getSlotByDisplay(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getSlotByDisplay : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getSlotByDisplay)

static bool js_cocos2dx_dragonbones_Armature_removeBone(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_removeBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Bone* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_removeBone : Error processing arguments");
        cobj->removeBone(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_removeBone)

static bool js_cocos2dx_dragonbones_Armature_replaceTexture(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_replaceTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        void* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_replaceTexture : Error processing arguments");
        cobj->replaceTexture(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_replaceTexture)

static bool js_cocos2dx_dragonbones_Armature_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::Armature::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getTypeIndex)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_Armature(se::Object* obj)
{
    auto cls = se::Class::create("Armature", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineFunction("getSlot", _SE(js_cocos2dx_dragonbones_Armature_getSlot));
    cls->defineFunction("_bufferAction", _SE(js_cocos2dx_dragonbones_Armature__bufferAction));
    cls->defineFunction("getCacheFrameRate", _SE(js_cocos2dx_dragonbones_Armature_getCacheFrameRate));
    cls->defineFunction("getName", _SE(js_cocos2dx_dragonbones_Armature_getName));
    cls->defineFunction("dispose", _SE(js_cocos2dx_dragonbones_Armature_dispose));
    cls->defineFunction("addSlot", _SE(js_cocos2dx_dragonbones_Armature_addSlot));
    cls->defineFunction("invalidUpdate", _SE(js_cocos2dx_dragonbones_Armature_invalidUpdate));
    cls->defineFunction("getBoneByDisplay", _SE(js_cocos2dx_dragonbones_Armature_getBoneByDisplay));
    cls->defineFunction("setCacheFrameRate", _SE(js_cocos2dx_dragonbones_Armature_setCacheFrameRate));
    cls->defineFunction("removeSlot", _SE(js_cocos2dx_dragonbones_Armature_removeSlot));
    cls->defineFunction("addBone", _SE(js_cocos2dx_dragonbones_Armature_addBone));
    cls->defineFunction("advanceTime", _SE(js_cocos2dx_dragonbones_Armature_advanceTime));
    cls->defineFunction("getBone", _SE(js_cocos2dx_dragonbones_Armature_getBone));
    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_Armature_getParent));
    cls->defineFunction("getSlotByDisplay", _SE(js_cocos2dx_dragonbones_Armature_getSlotByDisplay));
    cls->defineFunction("removeBone", _SE(js_cocos2dx_dragonbones_Armature_removeBone));
    cls->defineFunction("replaceTexture", _SE(js_cocos2dx_dragonbones_Armature_replaceTexture));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_Armature_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::Armature>(cls);

    __jsb_dragonBones_Armature_proto = cls->getProto();
    __jsb_dragonBones_Armature_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Animation_proto = nullptr;
se::Class* __jsb_dragonBones_Animation_class = nullptr;

static bool js_cocos2dx_dragonbones_Animation_reset(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_reset)

static bool js_cocos2dx_dragonbones_Animation_play(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_play : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::AnimationState* result = cobj->play();
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_play : Error processing arguments");
        return true;
    }
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_play : Error processing arguments");
        dragonBones::AnimationState* result = cobj->play(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_play : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        int arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_play : Error processing arguments");
        dragonBones::AnimationState* result = cobj->play(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_play : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_play)

static bool js_cocos2dx_dragonbones_Animation_getLastAnimationState(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::AnimationState* result = cobj->getLastAnimationState();
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_getLastAnimationState)

static bool js_cocos2dx_dragonbones_Animation_getAnimationNames(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_getAnimationNames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getAnimationNames();
        ok &= std_vector_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_getAnimationNames : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_getAnimationNames)

static bool js_cocos2dx_dragonbones_Animation_stop(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_stop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_stop : Error processing arguments");
        cobj->stop(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_stop)

static bool js_cocos2dx_dragonbones_Animation_hasAnimation(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_hasAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_hasAnimation : Error processing arguments");
        bool result = cobj->hasAnimation(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_hasAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_hasAnimation)

static bool js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByProgress(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByProgress(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress)

static bool js_cocos2dx_dragonbones_Animation_gotoAndStopByTime(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByTime(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByTime(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_gotoAndStopByTime)

static bool js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByTime(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByTime(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByTime(arg0, arg1, arg2);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime)

static bool js_cocos2dx_dragonbones_Animation_isCompleted(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_isCompleted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isCompleted();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_isCompleted : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_isCompleted)

static bool js_cocos2dx_dragonbones_Animation_fadeIn(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1, arg2);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    if (argc == 4) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1, arg2, arg3);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    if (argc == 5) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    if (argc == 6) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_int32(args[5], (int32_t*)&arg5);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    if (argc == 7) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        bool arg6;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_int32(args[5], (int32_t*)&arg5);
        ok &= seval_to_boolean(args[6], &arg6);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    if (argc == 8) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        bool arg6;
        bool arg7;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_int32(args[5], (int32_t*)&arg5);
        ok &= seval_to_boolean(args[6], &arg6);
        ok &= seval_to_boolean(args[7], &arg7);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    if (argc == 9) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        bool arg6;
        bool arg7;
        bool arg8;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_int32(args[5], (int32_t*)&arg5);
        ok &= seval_to_boolean(args[6], &arg6);
        ok &= seval_to_boolean(args[7], &arg7);
        ok &= seval_to_boolean(args[8], &arg8);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    if (argc == 10) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        bool arg6;
        bool arg7;
        bool arg8;
        bool arg9;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_int32(args[5], (int32_t*)&arg5);
        ok &= seval_to_boolean(args[6], &arg6);
        ok &= seval_to_boolean(args[7], &arg7);
        ok &= seval_to_boolean(args[8], &arg8);
        ok &= seval_to_boolean(args[9], &arg9);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 10);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_fadeIn)

static bool js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByFrame(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        unsigned int arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByFrame(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        unsigned int arg1 = 0;
        int arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByFrame(arg0, arg1, arg2);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame)

static bool js_cocos2dx_dragonbones_Animation_getLastAnimationName(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getLastAnimationName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_getLastAnimationName)

static bool js_cocos2dx_dragonbones_Animation_getState(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_getState : Error processing arguments");
        dragonBones::AnimationState* result = cobj->getState(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_getState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_getState)

static bool js_cocos2dx_dragonbones_Animation_isPlaying(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_isPlaying : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPlaying();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_isPlaying : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_isPlaying)

static bool js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByFrame(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        unsigned int arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndStopByFrame(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame)

static bool js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByProgress(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByProgress(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        dragonBones::AnimationState* result = cobj->gotoAndPlayByProgress(arg0, arg1, arg2);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress)

static bool js_cocos2dx_dragonbones_Animation_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::Animation::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_getTypeIndex)

static bool js_cocos2dx_dragonbones_Animation_get_timeScale(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_get_timeScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->timeScale, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Animation_get_timeScale)

static bool js_cocos2dx_dragonbones_Animation_set_timeScale(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_set_timeScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_set_timeScale : Error processing new value");
    cobj->timeScale = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Animation_set_timeScale)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_Animation(se::Object* obj)
{
    auto cls = se::Class::create("Animation", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("timeScale", _SE(js_cocos2dx_dragonbones_Animation_get_timeScale), _SE(js_cocos2dx_dragonbones_Animation_set_timeScale));
    cls->defineFunction("reset", _SE(js_cocos2dx_dragonbones_Animation_reset));
    cls->defineFunction("play", _SE(js_cocos2dx_dragonbones_Animation_play));
    cls->defineFunction("getLastAnimationState", _SE(js_cocos2dx_dragonbones_Animation_getLastAnimationState));
    cls->defineFunction("getAnimationNames", _SE(js_cocos2dx_dragonbones_Animation_getAnimationNames));
    cls->defineFunction("stop", _SE(js_cocos2dx_dragonbones_Animation_stop));
    cls->defineFunction("hasAnimation", _SE(js_cocos2dx_dragonbones_Animation_hasAnimation));
    cls->defineFunction("gotoAndStopByProgress", _SE(js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress));
    cls->defineFunction("gotoAndStopByTime", _SE(js_cocos2dx_dragonbones_Animation_gotoAndStopByTime));
    cls->defineFunction("gotoAndPlayByTime", _SE(js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime));
    cls->defineFunction("isCompleted", _SE(js_cocos2dx_dragonbones_Animation_isCompleted));
    cls->defineFunction("fadeIn", _SE(js_cocos2dx_dragonbones_Animation_fadeIn));
    cls->defineFunction("gotoAndPlayByFrame", _SE(js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame));
    cls->defineFunction("getLastAnimationName", _SE(js_cocos2dx_dragonbones_Animation_getLastAnimationName));
    cls->defineFunction("getState", _SE(js_cocos2dx_dragonbones_Animation_getState));
    cls->defineFunction("isPlaying", _SE(js_cocos2dx_dragonbones_Animation_isPlaying));
    cls->defineFunction("gotoAndStopByFrame", _SE(js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame));
    cls->defineFunction("gotoAndPlayByProgress", _SE(js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_Animation_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::Animation>(cls);

    __jsb_dragonBones_Animation_proto = cls->getProto();
    __jsb_dragonBones_Animation_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_TransformObject_proto = nullptr;
se::Class* __jsb_dragonBones_TransformObject_class = nullptr;

static bool js_cocos2dx_dragonbones_TransformObject__setArmature(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject__setArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Armature* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject__setArmature : Error processing arguments");
        cobj->_setArmature(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TransformObject__setArmature)

static bool js_cocos2dx_dragonbones_TransformObject__setParent(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject__setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Bone* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject__setParent : Error processing arguments");
        cobj->_setParent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TransformObject__setParent)

static bool js_cocos2dx_dragonbones_TransformObject_getParent(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Bone* result = cobj->getParent();
        ok &= native_ptr_to_rooted_seval<dragonBones::Bone>((dragonBones::Bone*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TransformObject_getParent)

static bool js_cocos2dx_dragonbones_TransformObject_getArmature(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getArmature();
        ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject_getArmature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TransformObject_getArmature)

static bool js_cocos2dx_dragonbones_TransformObject_get_name(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_TransformObject_get_name)

static bool js_cocos2dx_dragonbones_TransformObject_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_TransformObject_set_name)

static bool js_cocos2dx_dragonbones_TransformObject_get_globalTransformMatrix(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_get_globalTransformMatrix : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_rooted_seval<dragonBones::Matrix>((dragonBones::Matrix*)cobj->globalTransformMatrix, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_TransformObject_get_globalTransformMatrix)

static bool js_cocos2dx_dragonbones_TransformObject_set_globalTransformMatrix(se::State& s)
{
    const auto& args = s.args();
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_set_globalTransformMatrix : Invalid Native Object");

    CC_UNUSED bool ok = true;
    dragonBones::Matrix* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject_set_globalTransformMatrix : Error processing new value");
    cobj->globalTransformMatrix = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_TransformObject_set_globalTransformMatrix)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_TransformObject(se::Object* obj)
{
    auto cls = se::Class::create("TransformObject", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_TransformObject_get_name), _SE(js_cocos2dx_dragonbones_TransformObject_set_name));
    cls->defineProperty("globalTransformMatrix", _SE(js_cocos2dx_dragonbones_TransformObject_get_globalTransformMatrix), _SE(js_cocos2dx_dragonbones_TransformObject_set_globalTransformMatrix));
    cls->defineFunction("_setArmature", _SE(js_cocos2dx_dragonbones_TransformObject__setArmature));
    cls->defineFunction("_setParent", _SE(js_cocos2dx_dragonbones_TransformObject__setParent));
    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_TransformObject_getParent));
    cls->defineFunction("getArmature", _SE(js_cocos2dx_dragonbones_TransformObject_getArmature));
    cls->install();
    JSBClassType::registerClass<dragonBones::TransformObject>(cls);

    __jsb_dragonBones_TransformObject_proto = cls->getProto();
    __jsb_dragonBones_TransformObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Bone_proto = nullptr;
se::Class* __jsb_dragonBones_Bone_class = nullptr;

static bool js_cocos2dx_dragonbones_Bone_getIK(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_getIK : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Bone* result = cobj->getIK();
        ok &= native_ptr_to_rooted_seval<dragonBones::Bone>((dragonBones::Bone*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_getIK : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_getIK)

static bool js_cocos2dx_dragonbones_Bone_getIKChainIndex(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_getIKChainIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIKChainIndex();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_getIKChainIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_getIKChainIndex)

static bool js_cocos2dx_dragonbones_Bone_contains(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_contains : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const dragonBones::TransformObject* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_contains : Error processing arguments");
        bool result = cobj->contains(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_contains : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_contains)

static bool js_cocos2dx_dragonbones_Bone_getIKChain(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_getIKChain : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIKChain();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_getIKChain : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_getIKChain)

static bool js_cocos2dx_dragonbones_Bone_getVisible(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_getVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getVisible();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_getVisible : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_getVisible)

static bool js_cocos2dx_dragonbones_Bone_setVisible(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_setVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_setVisible : Error processing arguments");
        cobj->setVisible(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_setVisible)

static bool js_cocos2dx_dragonbones_Bone_invalidUpdate(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_invalidUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->invalidUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_invalidUpdate)

static bool js_cocos2dx_dragonbones_Bone_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::Bone::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_getTypeIndex)


extern se::Object* __jsb_dragonBones_TransformObject_proto;


bool js_register_cocos2dx_dragonbones_Bone(se::Object* obj)
{
    auto cls = se::Class::create("Bone", obj, __jsb_dragonBones_TransformObject_proto, nullptr);

    cls->defineFunction("getIK", _SE(js_cocos2dx_dragonbones_Bone_getIK));
    cls->defineFunction("getIKChainIndex", _SE(js_cocos2dx_dragonbones_Bone_getIKChainIndex));
    cls->defineFunction("contains", _SE(js_cocos2dx_dragonbones_Bone_contains));
    cls->defineFunction("getIKChain", _SE(js_cocos2dx_dragonbones_Bone_getIKChain));
    cls->defineFunction("getVisible", _SE(js_cocos2dx_dragonbones_Bone_getVisible));
    cls->defineFunction("setVisible", _SE(js_cocos2dx_dragonbones_Bone_setVisible));
    cls->defineFunction("invalidUpdate", _SE(js_cocos2dx_dragonbones_Bone_invalidUpdate));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_Bone_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::Bone>(cls);

    __jsb_dragonBones_Bone_proto = cls->getProto();
    __jsb_dragonBones_Bone_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Slot_proto = nullptr;
se::Class* __jsb_dragonBones_Slot_class = nullptr;

static bool js_cocos2dx_dragonbones_Slot_getChildArmature(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_getChildArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getChildArmature();
        ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_getChildArmature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getChildArmature)

static bool js_cocos2dx_dragonbones_Slot_invalidUpdate(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_invalidUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->invalidUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_invalidUpdate)

static bool js_cocos2dx_dragonbones_Slot_setDisplayIndex(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_setDisplayIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_setDisplayIndex : Error processing arguments");
        cobj->setDisplayIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_setDisplayIndex)

static bool js_cocos2dx_dragonbones_Slot_setChildArmature(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_setChildArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Armature* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_setChildArmature : Error processing arguments");
        cobj->setChildArmature(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_setChildArmature)

static bool js_cocos2dx_dragonbones_Slot_getDisplayIndex(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_getDisplayIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getDisplayIndex();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_getDisplayIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getDisplayIndex)

static bool js_cocos2dx_dragonbones_Slot_get_inheritAnimation(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_get_inheritAnimation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->inheritAnimation, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Slot_get_inheritAnimation)

static bool js_cocos2dx_dragonbones_Slot_set_inheritAnimation(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_set_inheritAnimation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_set_inheritAnimation : Error processing new value");
    cobj->inheritAnimation = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Slot_set_inheritAnimation)

static bool js_cocos2dx_dragonbones_Slot_get_displayController(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_get_displayController : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->displayController, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Slot_get_displayController)

static bool js_cocos2dx_dragonbones_Slot_set_displayController(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_set_displayController : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_set_displayController : Error processing new value");
    cobj->displayController = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Slot_set_displayController)




bool js_register_cocos2dx_dragonbones_Slot(se::Object* obj)
{
    auto cls = se::Class::create("Slot", obj, nullptr, nullptr);

    cls->defineProperty("inheritAnimation", _SE(js_cocos2dx_dragonbones_Slot_get_inheritAnimation), _SE(js_cocos2dx_dragonbones_Slot_set_inheritAnimation));
    cls->defineProperty("displayController", _SE(js_cocos2dx_dragonbones_Slot_get_displayController), _SE(js_cocos2dx_dragonbones_Slot_set_displayController));
    cls->defineFunction("getChildArmature", _SE(js_cocos2dx_dragonbones_Slot_getChildArmature));
    cls->defineFunction("invalidUpdate", _SE(js_cocos2dx_dragonbones_Slot_invalidUpdate));
    cls->defineFunction("setDisplayIndex", _SE(js_cocos2dx_dragonbones_Slot_setDisplayIndex));
    cls->defineFunction("setChildArmature", _SE(js_cocos2dx_dragonbones_Slot_setChildArmature));
    cls->defineFunction("getDisplayIndex", _SE(js_cocos2dx_dragonbones_Slot_getDisplayIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::Slot>(cls);

    __jsb_dragonBones_Slot_proto = cls->getProto();
    __jsb_dragonBones_Slot_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_BaseFactory_proto = nullptr;
se::Class* __jsb_dragonBones_BaseFactory_class = nullptr;

static bool js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData : Error processing arguments");
        cobj->removeDragonBonesData(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData : Error processing arguments");
        cobj->removeDragonBonesData(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData)

static bool js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData : Error processing arguments");
        cobj->removeTextureAtlasData(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData : Error processing arguments");
        cobj->removeTextureAtlasData(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData)

static bool js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesData(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::DragonBonesData>((dragonBones::DragonBonesData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        const char* arg0 = nullptr;
        std::string arg1;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesData(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::DragonBonesData>((dragonBones::DragonBonesData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        const char* arg0 = nullptr;
        std::string arg1;
        float arg2 = 0;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesData(arg0, arg1, arg2);
        ok &= native_ptr_to_rooted_seval<dragonBones::DragonBonesData>((dragonBones::DragonBonesData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData)

static bool js_cocos2dx_dragonbones_BaseFactory_clear(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_clear : Error processing arguments");
        cobj->clear(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_clear)

static bool js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::DragonBonesData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData : Error processing arguments");
        cobj->addDragonBonesData(arg0);
        return true;
    }
    if (argc == 2) {
        dragonBones::DragonBonesData* arg0 = nullptr;
        std::string arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData : Error processing arguments");
        cobj->addDragonBonesData(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData)

static bool js_cocos2dx_dragonbones_BaseFactory_buildArmature(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* result = cobj->buildArmature(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* result = cobj->buildArmature(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* result = cobj->buildArmature(arg0, arg1, arg2);
        ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_buildArmature)

static bool js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::TextureAtlasData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData : Error processing arguments");
        cobj->addTextureAtlasData(arg0);
        return true;
    }
    if (argc == 2) {
        dragonBones::TextureAtlasData* arg0 = nullptr;
        std::string arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData : Error processing arguments");
        cobj->addTextureAtlasData(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData)

static bool js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->getDragonBonesData(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::DragonBonesData>((dragonBones::DragonBonesData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData)




bool js_register_cocos2dx_dragonbones_BaseFactory(se::Object* obj)
{
    auto cls = se::Class::create("BaseFactory", obj, nullptr, nullptr);

    cls->defineFunction("removeDragonBonesData", _SE(js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData));
    cls->defineFunction("removeTextureAtlasData", _SE(js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData));
    cls->defineFunction("parseDragonBonesData", _SE(js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData));
    cls->defineFunction("clear", _SE(js_cocos2dx_dragonbones_BaseFactory_clear));
    cls->defineFunction("addDragonBonesData", _SE(js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData));
    cls->defineFunction("buildArmature", _SE(js_cocos2dx_dragonbones_BaseFactory_buildArmature));
    cls->defineFunction("addTextureAtlasData", _SE(js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData));
    cls->defineFunction("getDragonBonesData", _SE(js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData));
    cls->install();
    JSBClassType::registerClass<dragonBones::BaseFactory>(cls);

    __jsb_dragonBones_BaseFactory_proto = cls->getProto();
    __jsb_dragonBones_BaseFactory_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_WorldClock_proto = nullptr;
se::Class* __jsb_dragonBones_WorldClock_class = nullptr;

static bool js_cocos2dx_dragonbones_WorldClock_clear(se::State& s)
{
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_WorldClock_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_WorldClock_clear)

static bool js_cocos2dx_dragonbones_WorldClock_advanceTime(se::State& s)
{
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_WorldClock_advanceTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_WorldClock_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_WorldClock_advanceTime)

static bool js_cocos2dx_dragonbones_WorldClock_contains(se::State& s)
{
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_WorldClock_contains : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const dragonBones::IAnimateble* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_WorldClock_contains : Error processing arguments");
        bool result = cobj->contains(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_WorldClock_contains : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_WorldClock_contains)




bool js_register_cocos2dx_dragonbones_WorldClock(se::Object* obj)
{
    auto cls = se::Class::create("WorldClock", obj, nullptr, nullptr);

    cls->defineFunction("clear", _SE(js_cocos2dx_dragonbones_WorldClock_clear));
    cls->defineFunction("advanceTime", _SE(js_cocos2dx_dragonbones_WorldClock_advanceTime));
    cls->defineFunction("contains", _SE(js_cocos2dx_dragonbones_WorldClock_contains));
    cls->install();
    JSBClassType::registerClass<dragonBones::WorldClock>(cls);

    __jsb_dragonBones_WorldClock_proto = cls->getProto();
    __jsb_dragonBones_WorldClock_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_AnimationState_proto = nullptr;
se::Class* __jsb_dragonBones_AnimationState_class = nullptr;

static bool js_cocos2dx_dragonbones_AnimationState_setCurrentTime(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_setCurrentTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_setCurrentTime : Error processing arguments");
        cobj->setCurrentTime(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_setCurrentTime)

static bool js_cocos2dx_dragonbones_AnimationState_removeBoneMask(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_removeBoneMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_removeBoneMask : Error processing arguments");
        cobj->removeBoneMask(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_removeBoneMask : Error processing arguments");
        cobj->removeBoneMask(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_removeBoneMask)

static bool js_cocos2dx_dragonbones_AnimationState_getGroup(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_getGroup : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getGroup();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_getGroup : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getGroup)

static bool js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCurrentPlayTimes();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes)

static bool js_cocos2dx_dragonbones_AnimationState_getName(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getName)

static bool js_cocos2dx_dragonbones_AnimationState_getCurrentTime(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_getCurrentTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getCurrentTime();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_getCurrentTime : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getCurrentTime)

static bool js_cocos2dx_dragonbones_AnimationState_getTotalTime(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_getTotalTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTotalTime();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_getTotalTime : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getTotalTime)

static bool js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeAllBoneMask();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask)

static bool js_cocos2dx_dragonbones_AnimationState_getLayer(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_getLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getLayer();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_getLayer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getLayer)

static bool js_cocos2dx_dragonbones_AnimationState_isCompleted(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_isCompleted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isCompleted();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_isCompleted : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_isCompleted)

static bool js_cocos2dx_dragonbones_AnimationState_play(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_play : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->play();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_play)

static bool js_cocos2dx_dragonbones_AnimationState_fadeOut(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_fadeOut : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_fadeOut : Error processing arguments");
        cobj->fadeOut(arg0);
        return true;
    }
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_fadeOut : Error processing arguments");
        cobj->fadeOut(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_fadeOut)

static bool js_cocos2dx_dragonbones_AnimationState_stop(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_stop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stop();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_stop)

static bool js_cocos2dx_dragonbones_AnimationState_isPlaying(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_isPlaying : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPlaying();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_isPlaying : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_isPlaying)

static bool js_cocos2dx_dragonbones_AnimationState_addBoneMask(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_addBoneMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_addBoneMask : Error processing arguments");
        cobj->addBoneMask(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_addBoneMask : Error processing arguments");
        cobj->addBoneMask(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_addBoneMask)

static bool js_cocos2dx_dragonbones_AnimationState_containsBoneMask(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_containsBoneMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_containsBoneMask : Error processing arguments");
        bool result = cobj->containsBoneMask(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_containsBoneMask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_containsBoneMask)

static bool js_cocos2dx_dragonbones_AnimationState_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::AnimationState::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getTypeIndex)

static bool js_cocos2dx_dragonbones_AnimationState_get_displayControl(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_get_displayControl : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->displayControl, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationState_get_displayControl)

static bool js_cocos2dx_dragonbones_AnimationState_set_displayControl(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_set_displayControl : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_set_displayControl : Error processing new value");
    cobj->displayControl = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationState_set_displayControl)

static bool js_cocos2dx_dragonbones_AnimationState_get_additiveBlending(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_get_additiveBlending : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->additiveBlending, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationState_get_additiveBlending)

static bool js_cocos2dx_dragonbones_AnimationState_set_additiveBlending(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_set_additiveBlending : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_set_additiveBlending : Error processing new value");
    cobj->additiveBlending = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationState_set_additiveBlending)

static bool js_cocos2dx_dragonbones_AnimationState_get_playTimes(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_get_playTimes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval(cobj->playTimes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationState_get_playTimes)

static bool js_cocos2dx_dragonbones_AnimationState_set_playTimes(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_set_playTimes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_set_playTimes : Error processing new value");
    cobj->playTimes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationState_set_playTimes)

static bool js_cocos2dx_dragonbones_AnimationState_get_timeScale(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_get_timeScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->timeScale, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationState_get_timeScale)

static bool js_cocos2dx_dragonbones_AnimationState_set_timeScale(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_set_timeScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_set_timeScale : Error processing new value");
    cobj->timeScale = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationState_set_timeScale)

static bool js_cocos2dx_dragonbones_AnimationState_get_weight(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_get_weight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->weight, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationState_get_weight)

static bool js_cocos2dx_dragonbones_AnimationState_set_weight(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_set_weight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_set_weight : Error processing new value");
    cobj->weight = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationState_set_weight)

static bool js_cocos2dx_dragonbones_AnimationState_get_autoFadeOutTime(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_get_autoFadeOutTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->autoFadeOutTime, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationState_get_autoFadeOutTime)

static bool js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime : Error processing new value");
    cobj->autoFadeOutTime = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime)

static bool js_cocos2dx_dragonbones_AnimationState_get_fadeTotalTime(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_get_fadeTotalTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->fadeTotalTime, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationState_get_fadeTotalTime)

static bool js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime : Error processing new value");
    cobj->fadeTotalTime = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_AnimationState(se::Object* obj)
{
    auto cls = se::Class::create("AnimationState", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("displayControl", _SE(js_cocos2dx_dragonbones_AnimationState_get_displayControl), _SE(js_cocos2dx_dragonbones_AnimationState_set_displayControl));
    cls->defineProperty("additiveBlending", _SE(js_cocos2dx_dragonbones_AnimationState_get_additiveBlending), _SE(js_cocos2dx_dragonbones_AnimationState_set_additiveBlending));
    cls->defineProperty("playTimes", _SE(js_cocos2dx_dragonbones_AnimationState_get_playTimes), _SE(js_cocos2dx_dragonbones_AnimationState_set_playTimes));
    cls->defineProperty("timeScale", _SE(js_cocos2dx_dragonbones_AnimationState_get_timeScale), _SE(js_cocos2dx_dragonbones_AnimationState_set_timeScale));
    cls->defineProperty("weight", _SE(js_cocos2dx_dragonbones_AnimationState_get_weight), _SE(js_cocos2dx_dragonbones_AnimationState_set_weight));
    cls->defineProperty("autoFadeOutTime", _SE(js_cocos2dx_dragonbones_AnimationState_get_autoFadeOutTime), _SE(js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime));
    cls->defineProperty("fadeTotalTime", _SE(js_cocos2dx_dragonbones_AnimationState_get_fadeTotalTime), _SE(js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime));
    cls->defineFunction("setCurrentTime", _SE(js_cocos2dx_dragonbones_AnimationState_setCurrentTime));
    cls->defineFunction("removeBoneMask", _SE(js_cocos2dx_dragonbones_AnimationState_removeBoneMask));
    cls->defineFunction("getGroup", _SE(js_cocos2dx_dragonbones_AnimationState_getGroup));
    cls->defineFunction("getCurrentPlayTimes", _SE(js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes));
    cls->defineFunction("getName", _SE(js_cocos2dx_dragonbones_AnimationState_getName));
    cls->defineFunction("getCurrentTime", _SE(js_cocos2dx_dragonbones_AnimationState_getCurrentTime));
    cls->defineFunction("getTotalTime", _SE(js_cocos2dx_dragonbones_AnimationState_getTotalTime));
    cls->defineFunction("removeAllBoneMask", _SE(js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask));
    cls->defineFunction("getLayer", _SE(js_cocos2dx_dragonbones_AnimationState_getLayer));
    cls->defineFunction("isCompleted", _SE(js_cocos2dx_dragonbones_AnimationState_isCompleted));
    cls->defineFunction("play", _SE(js_cocos2dx_dragonbones_AnimationState_play));
    cls->defineFunction("fadeOut", _SE(js_cocos2dx_dragonbones_AnimationState_fadeOut));
    cls->defineFunction("stop", _SE(js_cocos2dx_dragonbones_AnimationState_stop));
    cls->defineFunction("isPlaying", _SE(js_cocos2dx_dragonbones_AnimationState_isPlaying));
    cls->defineFunction("addBoneMask", _SE(js_cocos2dx_dragonbones_AnimationState_addBoneMask));
    cls->defineFunction("containsBoneMask", _SE(js_cocos2dx_dragonbones_AnimationState_containsBoneMask));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_AnimationState_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::AnimationState>(cls);

    __jsb_dragonBones_AnimationState_proto = cls->getProto();
    __jsb_dragonBones_AnimationState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCTextureData_proto = nullptr;
se::Class* __jsb_dragonBones_CCTextureData_class = nullptr;

static bool js_cocos2dx_dragonbones_CCTextureData_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::CCTextureData::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCTextureData_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCTextureData_getTypeIndex)


extern se::Object* __jsb_dragonBones_TextureData_proto;


bool js_register_cocos2dx_dragonbones_CCTextureData(se::Object* obj)
{
    auto cls = se::Class::create("CCTextureData", obj, __jsb_dragonBones_TextureData_proto, nullptr);

    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_CCTextureData_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCTextureData>(cls);

    __jsb_dragonBones_CCTextureData_proto = cls->getProto();
    __jsb_dragonBones_CCTextureData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCTextureAtlasData_proto = nullptr;
se::Class* __jsb_dragonBones_CCTextureAtlasData_class = nullptr;

static bool js_cocos2dx_dragonbones_CCTextureAtlasData_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::CCTextureAtlasData::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCTextureAtlasData_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCTextureAtlasData_getTypeIndex)


extern se::Object* __jsb_dragonBones_TextureAtlasData_proto;


bool js_register_cocos2dx_dragonbones_CCTextureAtlasData(se::Object* obj)
{
    auto cls = se::Class::create("CCTextureAtlasData", obj, __jsb_dragonBones_TextureAtlasData_proto, nullptr);

    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_CCTextureAtlasData_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCTextureAtlasData>(cls);

    __jsb_dragonBones_CCTextureAtlasData_proto = cls->getProto();
    __jsb_dragonBones_CCTextureAtlasData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCArmatureDisplay_proto = nullptr;
se::Class* __jsb_dragonBones_CCArmatureDisplay_class = nullptr;

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf : Error processing arguments");
        cobj->advanceTimeBySelf(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent : Error processing arguments");
        cobj->removeEvent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_dispose(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dispose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dispose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_dispose)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->hasEventCallback();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (dragonBones::EventObject *)> arg0;
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
                    ok &= native_ptr_to_rooted_seval<dragonBones::EventObject>((dragonBones::EventObject*)larg0, &args[0]);
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
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback : Error processing arguments");
        cobj->setEventCallback(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_clearEventCallback(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_clearEventCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearEventCallback();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_clearEventCallback)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::function<void (dragonBones::EventObject *)> arg1;
        ok &= seval_to_std_string(args[0], &arg0);
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
                    ok &= native_ptr_to_rooted_seval<dragonBones::EventObject>((dragonBones::EventObject*)larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1 = lambda;
            }
            else
            {
                arg1 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent : Error processing arguments");
        cobj->addEvent(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent : Error processing arguments");
        bool result = cobj->hasEvent(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getArmature();
        ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_create(se::State& s)
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
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_create)


extern se::Object* __jsb_cocos2d_Node_proto;

static bool js_dragonBones_CCArmatureDisplay_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (dragonBones::CCArmatureDisplay)", s.nativeThisObject());
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_CCArmatureDisplay_finalize)

bool js_register_cocos2dx_dragonbones_CCArmatureDisplay(se::Object* obj)
{
    auto cls = se::Class::create("CCArmatureDisplay", obj, __jsb_cocos2d_Node_proto, nullptr);

    cls->defineFunction("advanceTimeBySelf", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf));
    cls->defineFunction("removeEventListener", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent));
    cls->defineFunction("dispose", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_dispose));
    cls->defineFunction("hasEventCallback", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback));
    cls->defineFunction("setEventCallback", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback));
    cls->defineFunction("clearEventCallback", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_clearEventCallback));
    cls->defineFunction("addEventListener", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent));
    cls->defineFunction("hasEvent", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent));
    cls->defineFunction("armature", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_create));
    cls->defineFinalizeFunction(_SE(js_dragonBones_CCArmatureDisplay_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCArmatureDisplay>(cls);

    __jsb_dragonBones_CCArmatureDisplay_proto = cls->getProto();
    __jsb_dragonBones_CCArmatureDisplay_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_DBCCSprite_proto = nullptr;
se::Class* __jsb_dragonBones_DBCCSprite_class = nullptr;

static bool js_cocos2dx_dragonbones_DBCCSprite_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = dragonBones::DBCCSprite::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_dragonBones_DBCCSprite_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_DBCCSprite_create)


extern se::Object* __jsb_cocos2d_Sprite_proto;

static bool js_dragonBones_DBCCSprite_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (dragonBones::DBCCSprite)", s.nativeThisObject());
    dragonBones::DBCCSprite* cobj = (dragonBones::DBCCSprite*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_DBCCSprite_finalize)

bool js_register_cocos2dx_dragonbones_DBCCSprite(se::Object* obj)
{
    auto cls = se::Class::create("DBCCSprite", obj, __jsb_cocos2d_Sprite_proto, nullptr);

    cls->defineStaticFunction("create", _SE(js_cocos2dx_dragonbones_DBCCSprite_create));
    cls->defineFinalizeFunction(_SE(js_dragonBones_DBCCSprite_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::DBCCSprite>(cls);

    __jsb_dragonBones_DBCCSprite_proto = cls->getProto();
    __jsb_dragonBones_DBCCSprite_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCSlot_proto = nullptr;
se::Class* __jsb_dragonBones_CCSlot_class = nullptr;

static bool js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex(se::State& s)
{
    dragonBones::CCSlot* cobj = (dragonBones::CCSlot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = cobj->getClassTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex)

static bool js_cocos2dx_dragonbones_CCSlot_getTypeIndex(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = dragonBones::CCSlot::getTypeIndex();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCSlot_getTypeIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCSlot_getTypeIndex)


extern se::Object* __jsb_dragonBones_Slot_proto;


bool js_register_cocos2dx_dragonbones_CCSlot(se::Object* obj)
{
    auto cls = se::Class::create("CCSlot", obj, __jsb_dragonBones_Slot_proto, nullptr);

    cls->defineFunction("getClassTypeIndex", _SE(js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex));
    cls->defineStaticFunction("getTypeIndex", _SE(js_cocos2dx_dragonbones_CCSlot_getTypeIndex));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCSlot>(cls);

    __jsb_dragonBones_CCSlot_proto = cls->getProto();
    __jsb_dragonBones_CCSlot_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCFactory_proto = nullptr;
se::Class* __jsb_dragonBones_CCFactory_class = nullptr;

static bool js_cocos2dx_dragonbones_CCFactory_getTextureDisplay(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : Error processing arguments");
        cocos2d::Sprite* result = cobj->getTextureDisplay(arg0);
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : Error processing arguments");
        cocos2d::Sprite* result = cobj->getTextureDisplay(arg0, arg1);
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_getTextureDisplay)

static bool js_cocos2dx_dragonbones_CCFactory_getSoundEventManater(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_getSoundEventManater : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::CCArmatureDisplay* result = cobj->getSoundEventManater();
        ok &= native_ptr_to_seval<dragonBones::CCArmatureDisplay>((dragonBones::CCArmatureDisplay*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getSoundEventManater : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_getSoundEventManater)

static bool js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* result = cobj->buildArmatureDisplay(arg0);
        ok &= native_ptr_to_seval<dragonBones::CCArmatureDisplay>((dragonBones::CCArmatureDisplay*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* result = cobj->buildArmatureDisplay(arg0, arg1);
        ok &= native_ptr_to_seval<dragonBones::CCArmatureDisplay>((dragonBones::CCArmatureDisplay*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* result = cobj->buildArmatureDisplay(arg0, arg1, arg2);
        ok &= native_ptr_to_seval<dragonBones::CCArmatureDisplay>((dragonBones::CCArmatureDisplay*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay)

static bool js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Error processing arguments");
        dragonBones::TextureAtlasData* result = cobj->parseTextureAtlasData(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::TextureAtlasData>((dragonBones::TextureAtlasData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Error processing arguments");
        dragonBones::TextureAtlasData* result = cobj->parseTextureAtlasData(arg0, arg1, arg2);
        ok &= native_ptr_to_rooted_seval<dragonBones::TextureAtlasData>((dragonBones::TextureAtlasData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Error processing arguments");
        return true;
    }
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        float arg3 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Error processing arguments");
        dragonBones::TextureAtlasData* result = cobj->parseTextureAtlasData(arg0, arg1, arg2, arg3);
        ok &= native_ptr_to_rooted_seval<dragonBones::TextureAtlasData>((dragonBones::TextureAtlasData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData)

SE_DECLARE_FINALIZE_FUNC(js_dragonBones_CCFactory_finalize)

static bool js_cocos2dx_dragonbones_CCFactory_constructor(se::State& s)
{
    dragonBones::CCFactory* cobj = new (std::nothrow) dragonBones::CCFactory();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_dragonbones_CCFactory_constructor, __jsb_dragonBones_CCFactory_class, js_dragonBones_CCFactory_finalize)



extern se::Object* __jsb_dragonBones_BaseFactory_proto;

static bool js_dragonBones_CCFactory_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (dragonBones::CCFactory)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_CCFactory_finalize)

bool js_register_cocos2dx_dragonbones_CCFactory(se::Object* obj)
{
    auto cls = se::Class::create("CCFactory", obj, __jsb_dragonBones_BaseFactory_proto, _SE(js_cocos2dx_dragonbones_CCFactory_constructor));

    cls->defineFunction("getTextureDisplay", _SE(js_cocos2dx_dragonbones_CCFactory_getTextureDisplay));
    cls->defineFunction("getSoundEventManater", _SE(js_cocos2dx_dragonbones_CCFactory_getSoundEventManater));
    cls->defineFunction("buildArmatureDisplay", _SE(js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay));
    cls->defineFunction("parseTextureAtlasData", _SE(js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData));
    cls->defineFinalizeFunction(_SE(js_dragonBones_CCFactory_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCFactory>(cls);

    __jsb_dragonBones_CCFactory_proto = cls->getProto();
    __jsb_dragonBones_CCFactory_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_dragonbones(se::Object* obj)
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

    js_register_cocos2dx_dragonbones_Slot(ns);
    js_register_cocos2dx_dragonbones_Matrix(ns);
    js_register_cocos2dx_dragonbones_Transform(ns);
    js_register_cocos2dx_dragonbones_BaseObject(ns);
    js_register_cocos2dx_dragonbones_Animation(ns);
    js_register_cocos2dx_dragonbones_TextureData(ns);
    js_register_cocos2dx_dragonbones_CCTextureData(ns);
    js_register_cocos2dx_dragonbones_BaseFactory(ns);
    js_register_cocos2dx_dragonbones_CCFactory(ns);
    js_register_cocos2dx_dragonbones_WorldClock(ns);
    js_register_cocos2dx_dragonbones_DBCCSprite(ns);
    js_register_cocos2dx_dragonbones_TextureAtlasData(ns);
    js_register_cocos2dx_dragonbones_CCArmatureDisplay(ns);
    js_register_cocos2dx_dragonbones_AnimationState(ns);
    js_register_cocos2dx_dragonbones_BoneData(ns);
    js_register_cocos2dx_dragonbones_ArmatureData(ns);
    js_register_cocos2dx_dragonbones_CCTextureAtlasData(ns);
    js_register_cocos2dx_dragonbones_TransformObject(ns);
    js_register_cocos2dx_dragonbones_CCSlot(ns);
    js_register_cocos2dx_dragonbones_Armature(ns);
    js_register_cocos2dx_dragonbones_Bone(ns);
    js_register_cocos2dx_dragonbones_SkinData(ns);
    js_register_cocos2dx_dragonbones_EventObject(ns);
    js_register_cocos2dx_dragonbones_SlotData(ns);
    js_register_cocos2dx_dragonbones_DragonBonesData(ns);
    js_register_cocos2dx_dragonbones_AnimationData(ns);
    return true;
}

