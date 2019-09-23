#include "scripting/js-bindings/auto/jsb_cocos2dx_dragonbones_auto.hpp"
#if USE_DRAGONBONES > 0
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "editor-support/dragonbones-creator-support/CCDragonBonesHeaders.h"

se::Object* __jsb_dragonBones_BaseObject_proto = nullptr;
se::Class* __jsb_dragonBones_BaseObject_class = nullptr;

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
    if (argc == 0) {
        dragonBones::BaseObject::clearPool();
        return true;
    }
    if (argc == 1) {
        size_t arg0 = 0;
        ok &= seval_to_size(args[0], &arg0);
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
        size_t arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_size(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
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

static bool js_cocos2dx_dragonbones_Transform_get_skew(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_get_skew : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->skew, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Transform_get_skew)

static bool js_cocos2dx_dragonbones_Transform_set_skew(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_set_skew : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_set_skew : Error processing new value");
    cobj->skew = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Transform_set_skew)

static bool js_cocos2dx_dragonbones_Transform_get_rotation(se::State& s)
{
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_get_rotation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->rotation, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_Transform_get_rotation)

static bool js_cocos2dx_dragonbones_Transform_set_rotation(se::State& s)
{
    const auto& args = s.args();
    dragonBones::Transform* cobj = (dragonBones::Transform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Transform_set_rotation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Transform_set_rotation : Error processing new value");
    cobj->rotation = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_Transform_set_rotation)

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
    cls->defineProperty("skew", _SE(js_cocos2dx_dragonbones_Transform_get_skew), _SE(js_cocos2dx_dragonbones_Transform_set_skew));
    cls->defineProperty("rotation", _SE(js_cocos2dx_dragonbones_Transform_get_rotation), _SE(js_cocos2dx_dragonbones_Transform_set_rotation));
    cls->defineProperty("scaleX", _SE(js_cocos2dx_dragonbones_Transform_get_scaleX), _SE(js_cocos2dx_dragonbones_Transform_set_scaleX));
    cls->defineProperty("scaleY", _SE(js_cocos2dx_dragonbones_Transform_get_scaleY), _SE(js_cocos2dx_dragonbones_Transform_set_scaleY));
    cls->defineStaticFunction("normalizeRadian", _SE(js_cocos2dx_dragonbones_Transform_normalizeRadian));
    cls->install();
    JSBClassType::registerClass<dragonBones::Transform>(cls);

    __jsb_dragonBones_Transform_proto = cls->getProto();
    __jsb_dragonBones_Transform_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_TextureAtlasData_proto = nullptr;
se::Class* __jsb_dragonBones_TextureAtlasData_class = nullptr;

static bool js_cocos2dx_dragonbones_TextureAtlasData_createTexture(se::State& s)
{
    dragonBones::TextureAtlasData* cobj = (dragonBones::TextureAtlasData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureAtlasData_createTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::TextureData* result = cobj->createTexture();
        ok &= native_ptr_to_rooted_seval<dragonBones::TextureData>((dragonBones::TextureData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureAtlasData_createTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureAtlasData_createTexture)

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

static bool js_cocos2dx_dragonbones_TextureAtlasData_get_name(se::State& s)
{
    dragonBones::TextureAtlasData* cobj = (dragonBones::TextureAtlasData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureAtlasData_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_TextureAtlasData_get_name)

static bool js_cocos2dx_dragonbones_TextureAtlasData_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::TextureAtlasData* cobj = (dragonBones::TextureAtlasData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureAtlasData_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureAtlasData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_TextureAtlasData_set_name)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_TextureAtlasData(se::Object* obj)
{
    auto cls = se::Class::create("TextureAtlasData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_TextureAtlasData_get_name), _SE(js_cocos2dx_dragonbones_TextureAtlasData_set_name));
    cls->defineFunction("createTexture", _SE(js_cocos2dx_dragonbones_TextureAtlasData_createTexture));
    cls->defineFunction("getTexture", _SE(js_cocos2dx_dragonbones_TextureAtlasData_getTexture));
    cls->defineFunction("addTexture", _SE(js_cocos2dx_dragonbones_TextureAtlasData_addTexture));
    cls->install();
    JSBClassType::registerClass<dragonBones::TextureAtlasData>(cls);

    __jsb_dragonBones_TextureAtlasData_proto = cls->getProto();
    __jsb_dragonBones_TextureAtlasData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_TextureData_proto = nullptr;
se::Class* __jsb_dragonBones_TextureData_class = nullptr;

static bool js_cocos2dx_dragonbones_TextureData_getParent(se::State& s)
{
    dragonBones::TextureData* cobj = (dragonBones::TextureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::TextureAtlasData* result = cobj->getParent();
        ok &= native_ptr_to_rooted_seval<dragonBones::TextureAtlasData>((dragonBones::TextureAtlasData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureData_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureData_getParent)

static bool js_cocos2dx_dragonbones_TextureData_setFrame(se::State& s)
{
    dragonBones::TextureData* cobj = (dragonBones::TextureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureData_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Rectangle* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureData_setFrame : Error processing arguments");
        cobj->setFrame(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureData_setFrame)

static bool js_cocos2dx_dragonbones_TextureData_getRegion(se::State& s)
{
    dragonBones::TextureData* cobj = (dragonBones::TextureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureData_getRegion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Rectangle* result = cobj->getRegion();
        ok &= native_ptr_to_seval<dragonBones::Rectangle>((dragonBones::Rectangle*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureData_getRegion : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureData_getRegion)

static bool js_cocos2dx_dragonbones_TextureData_getFrame(se::State& s)
{
    dragonBones::TextureData* cobj = (dragonBones::TextureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureData_getFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::Rectangle* result = cobj->getFrame();
        ok &= native_ptr_to_seval<dragonBones::Rectangle>((dragonBones::Rectangle*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureData_getFrame : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureData_getFrame)

static bool js_cocos2dx_dragonbones_TextureData_setParent(se::State& s)
{
    dragonBones::TextureData* cobj = (dragonBones::TextureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TextureData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::TextureAtlasData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureData_setParent : Error processing arguments");
        cobj->setParent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureData_setParent)

static bool js_cocos2dx_dragonbones_TextureData_createRectangle(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Rectangle* result = dragonBones::TextureData::createRectangle();
        ok &= native_ptr_to_seval<dragonBones::Rectangle>((dragonBones::Rectangle*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TextureData_createRectangle : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TextureData_createRectangle)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_TextureData(se::Object* obj)
{
    auto cls = se::Class::create("TextureData", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_TextureData_getParent));
    cls->defineFunction("setFrame", _SE(js_cocos2dx_dragonbones_TextureData_setFrame));
    cls->defineFunction("getRegion", _SE(js_cocos2dx_dragonbones_TextureData_getRegion));
    cls->defineFunction("getFrame", _SE(js_cocos2dx_dragonbones_TextureData_getFrame));
    cls->defineFunction("setParent", _SE(js_cocos2dx_dragonbones_TextureData_setParent));
    cls->defineStaticFunction("createRectangle", _SE(js_cocos2dx_dragonbones_TextureData_createRectangle));
    cls->install();
    JSBClassType::registerClass<dragonBones::TextureData>(cls);

    __jsb_dragonBones_TextureData_proto = cls->getProto();
    __jsb_dragonBones_TextureData_class = cls;

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

static bool js_cocos2dx_dragonbones_ArmatureData_addAction(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_addAction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        dragonBones::ActionData* arg0 = nullptr;
        bool arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_addAction : Error processing arguments");
        cobj->addAction(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_addAction)

static bool js_cocos2dx_dragonbones_ArmatureData_setUserData(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_setUserData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::UserData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_setUserData : Error processing arguments");
        cobj->setUserData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_setUserData)

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

static bool js_cocos2dx_dragonbones_ArmatureData_setDefaultAnimation(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_setDefaultAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::AnimationData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_setDefaultAnimation : Error processing arguments");
        cobj->setDefaultAnimation(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_setDefaultAnimation)

static bool js_cocos2dx_dragonbones_ArmatureData_setType(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_setType : Error processing arguments");
        cobj->setType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_setType)

static bool js_cocos2dx_dragonbones_ArmatureData_setParent(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::DragonBonesData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_setParent : Error processing arguments");
        cobj->setParent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_setParent)

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

static bool js_cocos2dx_dragonbones_ArmatureData_getMesh(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getMesh : Error processing arguments");
        dragonBones::MeshDisplayData* result = cobj->getMesh(arg0, arg1, arg2);
        ok &= native_ptr_to_seval<dragonBones::MeshDisplayData>((dragonBones::MeshDisplayData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getMesh : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getMesh)

static bool js_cocos2dx_dragonbones_ArmatureData_setDefaultSkin(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_setDefaultSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::SkinData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_setDefaultSkin : Error processing arguments");
        cobj->setDefaultSkin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_setDefaultSkin)

static bool js_cocos2dx_dragonbones_ArmatureData_getAnimationNames(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getAnimationNames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getAnimationNames();
        ok &= std_vector_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getAnimationNames : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getAnimationNames)

static bool js_cocos2dx_dragonbones_ArmatureData_getType(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getType)

static bool js_cocos2dx_dragonbones_ArmatureData_addConstraint(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_addConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::ConstraintData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_addConstraint : Error processing arguments");
        cobj->addConstraint(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_addConstraint)

static bool js_cocos2dx_dragonbones_ArmatureData_getUserData(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getUserData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::UserData* result = cobj->getUserData();
        ok &= native_ptr_to_seval<dragonBones::UserData>((dragonBones::UserData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getUserData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getUserData)

static bool js_cocos2dx_dragonbones_ArmatureData_getAABB(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Rectangle* result = cobj->getAABB();
        ok &= native_ptr_to_seval<dragonBones::Rectangle>((dragonBones::Rectangle*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getAABB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getAABB)

static bool js_cocos2dx_dragonbones_ArmatureData_getParent(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::DragonBonesData* result = cobj->getParent();
        ok &= native_ptr_to_rooted_seval<dragonBones::DragonBonesData>((dragonBones::DragonBonesData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getParent)

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

static bool js_cocos2dx_dragonbones_ArmatureData_getConstraint(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_getConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getConstraint : Error processing arguments");
        dragonBones::ConstraintData* result = cobj->getConstraint(arg0);
        ok &= native_ptr_to_seval<dragonBones::ConstraintData>((dragonBones::ConstraintData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureData_getConstraint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_getConstraint)

static bool js_cocos2dx_dragonbones_ArmatureData_sortBones(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureData_sortBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->sortBones();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureData_sortBones)

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
    cls->defineFunction("addAction", _SE(js_cocos2dx_dragonbones_ArmatureData_addAction));
    cls->defineFunction("setUserData", _SE(js_cocos2dx_dragonbones_ArmatureData_setUserData));
    cls->defineFunction("getSlot", _SE(js_cocos2dx_dragonbones_ArmatureData_getSlot));
    cls->defineFunction("getSkin", _SE(js_cocos2dx_dragonbones_ArmatureData_getSkin));
    cls->defineFunction("setDefaultAnimation", _SE(js_cocos2dx_dragonbones_ArmatureData_setDefaultAnimation));
    cls->defineFunction("setType", _SE(js_cocos2dx_dragonbones_ArmatureData_setType));
    cls->defineFunction("setParent", _SE(js_cocos2dx_dragonbones_ArmatureData_setParent));
    cls->defineFunction("getDefaultSkin", _SE(js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin));
    cls->defineFunction("getMesh", _SE(js_cocos2dx_dragonbones_ArmatureData_getMesh));
    cls->defineFunction("setDefaultSkin", _SE(js_cocos2dx_dragonbones_ArmatureData_setDefaultSkin));
    cls->defineFunction("getAnimationNames", _SE(js_cocos2dx_dragonbones_ArmatureData_getAnimationNames));
    cls->defineFunction("getType", _SE(js_cocos2dx_dragonbones_ArmatureData_getType));
    cls->defineFunction("addConstraint", _SE(js_cocos2dx_dragonbones_ArmatureData_addConstraint));
    cls->defineFunction("getUserData", _SE(js_cocos2dx_dragonbones_ArmatureData_getUserData));
    cls->defineFunction("getAABB", _SE(js_cocos2dx_dragonbones_ArmatureData_getAABB));
    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_ArmatureData_getParent));
    cls->defineFunction("getDefaultAnimation", _SE(js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation));
    cls->defineFunction("getAnimation", _SE(js_cocos2dx_dragonbones_ArmatureData_getAnimation));
    cls->defineFunction("getConstraint", _SE(js_cocos2dx_dragonbones_ArmatureData_getConstraint));
    cls->defineFunction("sortBones", _SE(js_cocos2dx_dragonbones_ArmatureData_sortBones));
    cls->install();
    JSBClassType::registerClass<dragonBones::ArmatureData>(cls);

    __jsb_dragonBones_ArmatureData_proto = cls->getProto();
    __jsb_dragonBones_ArmatureData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_BoneData_proto = nullptr;
se::Class* __jsb_dragonBones_BoneData_class = nullptr;

static bool js_cocos2dx_dragonbones_BoneData_setParent(se::State& s)
{
    dragonBones::BoneData* cobj = (dragonBones::BoneData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BoneData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::BoneData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BoneData_setParent : Error processing arguments");
        cobj->setParent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BoneData_setParent)

static bool js_cocos2dx_dragonbones_BoneData_getTransfrom(se::State& s)
{
    dragonBones::BoneData* cobj = (dragonBones::BoneData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BoneData_getTransfrom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Transform* result = cobj->getTransfrom();
        ok &= native_ptr_to_rooted_seval<dragonBones::Transform>((dragonBones::Transform*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BoneData_getTransfrom : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BoneData_getTransfrom)

static bool js_cocos2dx_dragonbones_BoneData_setUserData(se::State& s)
{
    dragonBones::BoneData* cobj = (dragonBones::BoneData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BoneData_setUserData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::UserData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BoneData_setUserData : Error processing arguments");
        cobj->setUserData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BoneData_setUserData)

static bool js_cocos2dx_dragonbones_BoneData_getUserData(se::State& s)
{
    dragonBones::BoneData* cobj = (dragonBones::BoneData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BoneData_getUserData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::UserData* result = cobj->getUserData();
        ok &= native_ptr_to_seval<dragonBones::UserData>((dragonBones::UserData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BoneData_getUserData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BoneData_getUserData)

static bool js_cocos2dx_dragonbones_BoneData_getParent(se::State& s)
{
    dragonBones::BoneData* cobj = (dragonBones::BoneData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BoneData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::BoneData* result = cobj->getParent();
        ok &= native_ptr_to_rooted_seval<dragonBones::BoneData>((dragonBones::BoneData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BoneData_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BoneData_getParent)

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
    cls->defineFunction("setParent", _SE(js_cocos2dx_dragonbones_BoneData_setParent));
    cls->defineFunction("getTransfrom", _SE(js_cocos2dx_dragonbones_BoneData_getTransfrom));
    cls->defineFunction("setUserData", _SE(js_cocos2dx_dragonbones_BoneData_setUserData));
    cls->defineFunction("getUserData", _SE(js_cocos2dx_dragonbones_BoneData_getUserData));
    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_BoneData_getParent));
    cls->install();
    JSBClassType::registerClass<dragonBones::BoneData>(cls);

    __jsb_dragonBones_BoneData_proto = cls->getProto();
    __jsb_dragonBones_BoneData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_SlotData_proto = nullptr;
se::Class* __jsb_dragonBones_SlotData_class = nullptr;

static bool js_cocos2dx_dragonbones_SlotData_setUserData(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_setUserData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::UserData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_setUserData : Error processing arguments");
        cobj->setUserData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_setUserData)

static bool js_cocos2dx_dragonbones_SlotData_setColor(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::ColorTransform* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_setColor : Error processing arguments");
        cobj->setColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_setColor)

static bool js_cocos2dx_dragonbones_SlotData_getUserData(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_getUserData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::UserData* result = cobj->getUserData();
        ok &= native_ptr_to_seval<dragonBones::UserData>((dragonBones::UserData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_getUserData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_getUserData)

static bool js_cocos2dx_dragonbones_SlotData_getColor(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_getColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::ColorTransform* result = cobj->getColor();
        ok &= native_ptr_to_seval<dragonBones::ColorTransform>((dragonBones::ColorTransform*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_getColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_getColor)

static bool js_cocos2dx_dragonbones_SlotData_setBlendMode(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_setBlendMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_setBlendMode : Error processing arguments");
        cobj->setBlendMode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_setBlendMode)

static bool js_cocos2dx_dragonbones_SlotData_getBlendMode(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_getBlendMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getBlendMode();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_getBlendMode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_getBlendMode)

static bool js_cocos2dx_dragonbones_SlotData_setParent(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::BoneData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_setParent : Error processing arguments");
        cobj->setParent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_setParent)

static bool js_cocos2dx_dragonbones_SlotData_getParent(se::State& s)
{
    dragonBones::SlotData* cobj = (dragonBones::SlotData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SlotData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::BoneData* result = cobj->getParent();
        ok &= native_ptr_to_rooted_seval<dragonBones::BoneData>((dragonBones::BoneData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_getParent)

static bool js_cocos2dx_dragonbones_SlotData_createColor(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::ColorTransform* result = dragonBones::SlotData::createColor();
        ok &= native_ptr_to_seval<dragonBones::ColorTransform>((dragonBones::ColorTransform*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_createColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_createColor)

static bool js_cocos2dx_dragonbones_SlotData_getDefaultColor(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::ColorTransform* result = dragonBones::SlotData::getDefaultColor();
        ok &= native_ptr_to_seval<dragonBones::ColorTransform>((dragonBones::ColorTransform*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SlotData_getDefaultColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SlotData_getDefaultColor)

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
    cls->defineFunction("setUserData", _SE(js_cocos2dx_dragonbones_SlotData_setUserData));
    cls->defineFunction("setColor", _SE(js_cocos2dx_dragonbones_SlotData_setColor));
    cls->defineFunction("getUserData", _SE(js_cocos2dx_dragonbones_SlotData_getUserData));
    cls->defineFunction("getColor", _SE(js_cocos2dx_dragonbones_SlotData_getColor));
    cls->defineFunction("setBlendMode", _SE(js_cocos2dx_dragonbones_SlotData_setBlendMode));
    cls->defineFunction("getBlendMode", _SE(js_cocos2dx_dragonbones_SlotData_getBlendMode));
    cls->defineFunction("setParent", _SE(js_cocos2dx_dragonbones_SlotData_setParent));
    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_SlotData_getParent));
    cls->defineStaticFunction("createColor", _SE(js_cocos2dx_dragonbones_SlotData_createColor));
    cls->defineStaticFunction("getDefaultColor", _SE(js_cocos2dx_dragonbones_SlotData_getDefaultColor));
    cls->install();
    JSBClassType::registerClass<dragonBones::SlotData>(cls);

    __jsb_dragonBones_SlotData_proto = cls->getProto();
    __jsb_dragonBones_SlotData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_DragonBonesData_proto = nullptr;
se::Class* __jsb_dragonBones_DragonBonesData_class = nullptr;

static bool js_cocos2dx_dragonbones_DragonBonesData_setUserData(se::State& s)
{
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_DragonBonesData_setUserData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::UserData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_DragonBonesData_setUserData : Error processing arguments");
        cobj->setUserData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_DragonBonesData_setUserData)

static bool js_cocos2dx_dragonbones_DragonBonesData_getUserData(se::State& s)
{
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_DragonBonesData_getUserData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::UserData* result = cobj->getUserData();
        ok &= native_ptr_to_seval<dragonBones::UserData>((dragonBones::UserData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_DragonBonesData_getUserData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_DragonBonesData_getUserData)

static bool js_cocos2dx_dragonbones_DragonBonesData_getFrameIndices(se::State& s)
{
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_DragonBonesData_getFrameIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<unsigned int>* result = cobj->getFrameIndices();
        ok &= native_ptr_to_seval<std::vector<unsigned int>>((std::vector<unsigned int>*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_DragonBonesData_getFrameIndices : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_DragonBonesData_getFrameIndices)

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
    cls->defineFunction("setUserData", _SE(js_cocos2dx_dragonbones_DragonBonesData_setUserData));
    cls->defineFunction("getUserData", _SE(js_cocos2dx_dragonbones_DragonBonesData_getUserData));
    cls->defineFunction("getFrameIndices", _SE(js_cocos2dx_dragonbones_DragonBonesData_getFrameIndices));
    cls->defineFunction("getArmature", _SE(js_cocos2dx_dragonbones_DragonBonesData_getArmature));
    cls->defineFunction("getArmatureNames", _SE(js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames));
    cls->defineFunction("addArmature", _SE(js_cocos2dx_dragonbones_DragonBonesData_addArmature));
    cls->install();
    JSBClassType::registerClass<dragonBones::DragonBonesData>(cls);

    __jsb_dragonBones_DragonBonesData_proto = cls->getProto();
    __jsb_dragonBones_DragonBonesData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_SkinData_proto = nullptr;
se::Class* __jsb_dragonBones_SkinData_class = nullptr;

static bool js_cocos2dx_dragonbones_SkinData_addDisplay(se::State& s)
{
    dragonBones::SkinData* cobj = (dragonBones::SkinData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SkinData_addDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        dragonBones::DisplayData* arg1 = nullptr;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SkinData_addDisplay : Error processing arguments");
        cobj->addDisplay(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SkinData_addDisplay)

static bool js_cocos2dx_dragonbones_SkinData_getDisplay(se::State& s)
{
    dragonBones::SkinData* cobj = (dragonBones::SkinData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_SkinData_getDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SkinData_getDisplay : Error processing arguments");
        dragonBones::DisplayData* result = cobj->getDisplay(arg0, arg1);
        ok &= native_ptr_to_seval<dragonBones::DisplayData>((dragonBones::DisplayData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_SkinData_getDisplay : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_SkinData_getDisplay)

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
    cls->defineFunction("addDisplay", _SE(js_cocos2dx_dragonbones_SkinData_addDisplay));
    cls->defineFunction("getDisplay", _SE(js_cocos2dx_dragonbones_SkinData_getDisplay));
    cls->install();
    JSBClassType::registerClass<dragonBones::SkinData>(cls);

    __jsb_dragonBones_SkinData_proto = cls->getProto();
    __jsb_dragonBones_SkinData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_AnimationData_proto = nullptr;
se::Class* __jsb_dragonBones_AnimationData_class = nullptr;

static bool js_cocos2dx_dragonbones_AnimationData_getActionTimeline(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_getActionTimeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::TimelineData* result = cobj->getActionTimeline();
        ok &= native_ptr_to_seval<dragonBones::TimelineData>((dragonBones::TimelineData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_getActionTimeline : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_getActionTimeline)

static bool js_cocos2dx_dragonbones_AnimationData_setParent(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::ArmatureData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_setParent : Error processing arguments");
        cobj->setParent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_setParent)

static bool js_cocos2dx_dragonbones_AnimationData_setActionTimeline(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_setActionTimeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::TimelineData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_setActionTimeline : Error processing arguments");
        cobj->setActionTimeline(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_setActionTimeline)

static bool js_cocos2dx_dragonbones_AnimationData_getSlotCachedFrameIndices(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_getSlotCachedFrameIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_getSlotCachedFrameIndices : Error processing arguments");
        std::vector<int>* result = cobj->getSlotCachedFrameIndices(arg0);
        ok &= native_ptr_to_seval<std::vector<int>>((std::vector<int>*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_getSlotCachedFrameIndices : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_getSlotCachedFrameIndices)

static bool js_cocos2dx_dragonbones_AnimationData_addConstraintTimeline(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_addConstraintTimeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        dragonBones::ConstraintData* arg0 = nullptr;
        dragonBones::TimelineData* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_addConstraintTimeline : Error processing arguments");
        cobj->addConstraintTimeline(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_addConstraintTimeline)

static bool js_cocos2dx_dragonbones_AnimationData_getBoneCachedFrameIndices(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_getBoneCachedFrameIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_getBoneCachedFrameIndices : Error processing arguments");
        std::vector<int>* result = cobj->getBoneCachedFrameIndices(arg0);
        ok &= native_ptr_to_seval<std::vector<int>>((std::vector<int>*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_getBoneCachedFrameIndices : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_getBoneCachedFrameIndices)

static bool js_cocos2dx_dragonbones_AnimationData_getZOrderTimeline(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_getZOrderTimeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::TimelineData* result = cobj->getZOrderTimeline();
        ok &= native_ptr_to_seval<dragonBones::TimelineData>((dragonBones::TimelineData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_getZOrderTimeline : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_getZOrderTimeline)

static bool js_cocos2dx_dragonbones_AnimationData_setZOrderTimeline(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_setZOrderTimeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::TimelineData* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_setZOrderTimeline : Error processing arguments");
        cobj->setZOrderTimeline(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_setZOrderTimeline)

static bool js_cocos2dx_dragonbones_AnimationData_getParent(se::State& s)
{
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::ArmatureData* result = cobj->getParent();
        ok &= native_ptr_to_rooted_seval<dragonBones::ArmatureData>((dragonBones::ArmatureData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationData_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationData_getParent)

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
    cls->defineProperty("duration", _SE(js_cocos2dx_dragonbones_AnimationData_get_duration), _SE(js_cocos2dx_dragonbones_AnimationData_set_duration));
    cls->defineProperty("fadeInTime", _SE(js_cocos2dx_dragonbones_AnimationData_get_fadeInTime), _SE(js_cocos2dx_dragonbones_AnimationData_set_fadeInTime));
    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_AnimationData_get_name), _SE(js_cocos2dx_dragonbones_AnimationData_set_name));
    cls->defineFunction("getActionTimeline", _SE(js_cocos2dx_dragonbones_AnimationData_getActionTimeline));
    cls->defineFunction("setParent", _SE(js_cocos2dx_dragonbones_AnimationData_setParent));
    cls->defineFunction("setActionTimeline", _SE(js_cocos2dx_dragonbones_AnimationData_setActionTimeline));
    cls->defineFunction("getSlotCachedFrameIndices", _SE(js_cocos2dx_dragonbones_AnimationData_getSlotCachedFrameIndices));
    cls->defineFunction("addConstraintTimeline", _SE(js_cocos2dx_dragonbones_AnimationData_addConstraintTimeline));
    cls->defineFunction("getBoneCachedFrameIndices", _SE(js_cocos2dx_dragonbones_AnimationData_getBoneCachedFrameIndices));
    cls->defineFunction("getZOrderTimeline", _SE(js_cocos2dx_dragonbones_AnimationData_getZOrderTimeline));
    cls->defineFunction("setZOrderTimeline", _SE(js_cocos2dx_dragonbones_AnimationData_setZOrderTimeline));
    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_AnimationData_getParent));
    cls->install();
    JSBClassType::registerClass<dragonBones::AnimationData>(cls);

    __jsb_dragonBones_AnimationData_proto = cls->getProto();
    __jsb_dragonBones_AnimationData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Armature_proto = nullptr;
se::Class* __jsb_dragonBones_Armature_class = nullptr;

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

static bool js_cocos2dx_dragonbones_Armature_getClock(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = cobj->getClock();
        ok &= native_ptr_to_rooted_seval<dragonBones::WorldClock>((dragonBones::WorldClock*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getClock : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getClock)

static bool js_cocos2dx_dragonbones_Armature_render(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->render();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_render)

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

static bool js_cocos2dx_dragonbones_Armature_setClock(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_setClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::WorldClock* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_setClock : Error processing arguments");
        cobj->setClock(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_setClock)

static bool js_cocos2dx_dragonbones_Armature__bufferAction(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature__bufferAction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        dragonBones::EventObject* arg0 = nullptr;
        bool arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature__bufferAction : Error processing arguments");
        cobj->_bufferAction(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature__bufferAction)

static bool js_cocos2dx_dragonbones_Armature__addBone(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature__addBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Bone* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature__addBone : Error processing arguments");
        cobj->_addBone(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature__addBone)

static bool js_cocos2dx_dragonbones_Armature_getAnimatable(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getAnimatable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::IAnimatable* result = cobj->getAnimatable();
        ok &= native_ptr_to_seval<dragonBones::IAnimatable>((dragonBones::IAnimatable*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getAnimatable : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getAnimatable)

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

static bool js_cocos2dx_dragonbones_Armature_getFlipY(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getFlipY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getFlipY();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getFlipY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getFlipY)

static bool js_cocos2dx_dragonbones_Armature_getFlipX(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getFlipX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getFlipX();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getFlipX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getFlipX)

static bool js_cocos2dx_dragonbones_Armature_intersectsSegment(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_intersectsSegment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_intersectsSegment : Error processing arguments");
        dragonBones::Slot* result = cobj->intersectsSegment(arg0, arg1, arg2, arg3);
        ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_intersectsSegment : Error processing arguments");
        return true;
    }
    if (argc == 5) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        dragonBones::Point* arg4 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_native_ptr(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_intersectsSegment : Error processing arguments");
        dragonBones::Slot* result = cobj->intersectsSegment(arg0, arg1, arg2, arg3, arg4);
        ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_intersectsSegment : Error processing arguments");
        return true;
    }
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        dragonBones::Point* arg4 = 0;
        dragonBones::Point* arg5 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_native_ptr(args[4], &arg4);
        ok &= seval_to_native_ptr(args[5], &arg5);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_intersectsSegment : Error processing arguments");
        dragonBones::Slot* result = cobj->intersectsSegment(arg0, arg1, arg2, arg3, arg4, arg5);
        ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_intersectsSegment : Error processing arguments");
        return true;
    }
    if (argc == 7) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        dragonBones::Point* arg4 = 0;
        dragonBones::Point* arg5 = 0;
        dragonBones::Point* arg6 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_native_ptr(args[4], &arg4);
        ok &= seval_to_native_ptr(args[5], &arg5);
        ok &= seval_to_native_ptr(args[6], &arg6);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_intersectsSegment : Error processing arguments");
        dragonBones::Slot* result = cobj->intersectsSegment(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_intersectsSegment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_intersectsSegment)

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

static bool js_cocos2dx_dragonbones_Armature__addConstraint(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature__addConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Constraint* arg0 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature__addConstraint : Error processing arguments");
        cobj->_addConstraint(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature__addConstraint)

static bool js_cocos2dx_dragonbones_Armature_setFlipY(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_setFlipY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_setFlipY : Error processing arguments");
        cobj->setFlipY(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_setFlipY)

static bool js_cocos2dx_dragonbones_Armature_setFlipX(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_setFlipX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_setFlipX : Error processing arguments");
        cobj->setFlipX(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_setFlipX)

static bool js_cocos2dx_dragonbones_Armature_getArmatureData(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getArmatureData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::ArmatureData* result = cobj->getArmatureData();
        ok &= native_ptr_to_rooted_seval<dragonBones::ArmatureData>((dragonBones::ArmatureData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getArmatureData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getArmatureData)

static bool js_cocos2dx_dragonbones_Armature__addSlot(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature__addSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Slot* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature__addSlot : Error processing arguments");
        cobj->_addSlot(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature__addSlot)

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

static bool js_cocos2dx_dragonbones_Armature_getAnimation(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Animation* result = cobj->getAnimation();
        ok &= native_ptr_to_rooted_seval<dragonBones::Animation>((dragonBones::Animation*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getAnimation)

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

static bool js_cocos2dx_dragonbones_Armature_getEventDispatcher(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getEventDispatcher : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::IEventDispatcher* result = cobj->getEventDispatcher();
        ok &= native_ptr_to_seval<dragonBones::IEventDispatcher>((dragonBones::IEventDispatcher*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getEventDispatcher : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getEventDispatcher)

static bool js_cocos2dx_dragonbones_Armature_containsPoint(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_containsPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_containsPoint : Error processing arguments");
        dragonBones::Slot* result = cobj->containsPoint(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_containsPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_containsPoint)

static bool js_cocos2dx_dragonbones_Armature_getProxy(se::State& s)
{
    dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Armature_getProxy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::IArmatureProxy* result = cobj->getProxy();
        ok &= native_ptr_to_seval<dragonBones::IArmatureProxy>((dragonBones::IArmatureProxy*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Armature_getProxy : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getProxy)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_Armature(se::Object* obj)
{
    auto cls = se::Class::create("Armature", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineFunction("getBone", _SE(js_cocos2dx_dragonbones_Armature_getBone));
    cls->defineFunction("getClock", _SE(js_cocos2dx_dragonbones_Armature_getClock));
    cls->defineFunction("render", _SE(js_cocos2dx_dragonbones_Armature_render));
    cls->defineFunction("getSlot", _SE(js_cocos2dx_dragonbones_Armature_getSlot));
    cls->defineFunction("setClock", _SE(js_cocos2dx_dragonbones_Armature_setClock));
    cls->defineFunction("_bufferAction", _SE(js_cocos2dx_dragonbones_Armature__bufferAction));
    cls->defineFunction("_addBone", _SE(js_cocos2dx_dragonbones_Armature__addBone));
    cls->defineFunction("getAnimatable", _SE(js_cocos2dx_dragonbones_Armature_getAnimatable));
    cls->defineFunction("getName", _SE(js_cocos2dx_dragonbones_Armature_getName));
    cls->defineFunction("dispose", _SE(js_cocos2dx_dragonbones_Armature_dispose));
    cls->defineFunction("invalidUpdate", _SE(js_cocos2dx_dragonbones_Armature_invalidUpdate));
    cls->defineFunction("getCacheFrameRate", _SE(js_cocos2dx_dragonbones_Armature_getCacheFrameRate));
    cls->defineFunction("getFlipY", _SE(js_cocos2dx_dragonbones_Armature_getFlipY));
    cls->defineFunction("getFlipX", _SE(js_cocos2dx_dragonbones_Armature_getFlipX));
    cls->defineFunction("intersectsSegment", _SE(js_cocos2dx_dragonbones_Armature_intersectsSegment));
    cls->defineFunction("setCacheFrameRate", _SE(js_cocos2dx_dragonbones_Armature_setCacheFrameRate));
    cls->defineFunction("_addConstraint", _SE(js_cocos2dx_dragonbones_Armature__addConstraint));
    cls->defineFunction("setFlipY", _SE(js_cocos2dx_dragonbones_Armature_setFlipY));
    cls->defineFunction("setFlipX", _SE(js_cocos2dx_dragonbones_Armature_setFlipX));
    cls->defineFunction("getArmatureData", _SE(js_cocos2dx_dragonbones_Armature_getArmatureData));
    cls->defineFunction("_addSlot", _SE(js_cocos2dx_dragonbones_Armature__addSlot));
    cls->defineFunction("advanceTime", _SE(js_cocos2dx_dragonbones_Armature_advanceTime));
    cls->defineFunction("getAnimation", _SE(js_cocos2dx_dragonbones_Armature_getAnimation));
    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_Armature_getParent));
    cls->defineFunction("getEventDispatcher", _SE(js_cocos2dx_dragonbones_Armature_getEventDispatcher));
    cls->defineFunction("containsPoint", _SE(js_cocos2dx_dragonbones_Armature_containsPoint));
    cls->defineFunction("getProxy", _SE(js_cocos2dx_dragonbones_Armature_getProxy));
    cls->install();
    JSBClassType::registerClass<dragonBones::Armature>(cls);

    __jsb_dragonBones_Armature_proto = cls->getProto();
    __jsb_dragonBones_Armature_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_TransformObject_proto = nullptr;
se::Class* __jsb_dragonBones_TransformObject_class = nullptr;

static bool js_cocos2dx_dragonbones_TransformObject_getOffset(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_getOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Transform* result = cobj->getOffset();
        ok &= native_ptr_to_rooted_seval<dragonBones::Transform>((dragonBones::Transform*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject_getOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TransformObject_getOffset)

static bool js_cocos2dx_dragonbones_TransformObject_getGlobal(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_getGlobal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Transform* result = cobj->getGlobal();
        ok &= native_ptr_to_rooted_seval<dragonBones::Transform>((dragonBones::Transform*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject_getGlobal : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TransformObject_getGlobal)

static bool js_cocos2dx_dragonbones_TransformObject_getOrigin(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_getOrigin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::Transform* result = cobj->getOrigin();
        ok &= native_ptr_to_rooted_seval<dragonBones::Transform>((dragonBones::Transform*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject_getOrigin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TransformObject_getOrigin)

static bool js_cocos2dx_dragonbones_TransformObject_getGlobalTransformMatrix(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_getGlobalTransformMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Matrix* result = cobj->getGlobalTransformMatrix();
        ok &= native_ptr_to_rooted_seval<dragonBones::Matrix>((dragonBones::Matrix*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_TransformObject_getGlobalTransformMatrix : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TransformObject_getGlobalTransformMatrix)

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

static bool js_cocos2dx_dragonbones_TransformObject_updateGlobalTransform(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_TransformObject_updateGlobalTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateGlobalTransform();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_TransformObject_updateGlobalTransform)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_TransformObject(se::Object* obj)
{
    auto cls = se::Class::create("TransformObject", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineFunction("getOffset", _SE(js_cocos2dx_dragonbones_TransformObject_getOffset));
    cls->defineFunction("getGlobal", _SE(js_cocos2dx_dragonbones_TransformObject_getGlobal));
    cls->defineFunction("getOrigin", _SE(js_cocos2dx_dragonbones_TransformObject_getOrigin));
    cls->defineFunction("getGlobalTransformMatrix", _SE(js_cocos2dx_dragonbones_TransformObject_getGlobalTransformMatrix));
    cls->defineFunction("getArmature", _SE(js_cocos2dx_dragonbones_TransformObject_getArmature));
    cls->defineFunction("updateGlobalTransform", _SE(js_cocos2dx_dragonbones_TransformObject_updateGlobalTransform));
    cls->install();
    JSBClassType::registerClass<dragonBones::TransformObject>(cls);

    __jsb_dragonBones_TransformObject_proto = cls->getProto();
    __jsb_dragonBones_TransformObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_AnimationState_proto = nullptr;
se::Class* __jsb_dragonBones_AnimationState_class = nullptr;

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

static bool js_cocos2dx_dragonbones_AnimationState_getName(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getName)

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

static bool js_cocos2dx_dragonbones_AnimationState_init(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        dragonBones::Armature* arg0 = nullptr;
        dragonBones::AnimationData* arg1 = nullptr;
        dragonBones::AnimationConfig* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_init : Error processing arguments");
        cobj->init(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_init)

static bool js_cocos2dx_dragonbones_AnimationState_isFadeIn(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_isFadeIn : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFadeIn();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_isFadeIn : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_isFadeIn)

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

static bool js_cocos2dx_dragonbones_AnimationState_getAnimationData(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_getAnimationData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::AnimationData* result = cobj->getAnimationData();
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationData>((dragonBones::AnimationData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_getAnimationData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getAnimationData)

static bool js_cocos2dx_dragonbones_AnimationState_isFadeComplete(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_isFadeComplete : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFadeComplete();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_isFadeComplete : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_isFadeComplete)

static bool js_cocos2dx_dragonbones_AnimationState_advanceTime(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_advanceTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_advanceTime)

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

static bool js_cocos2dx_dragonbones_AnimationState_isFadeOut(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_isFadeOut : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFadeOut();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_isFadeOut : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_isFadeOut)

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

static bool js_cocos2dx_dragonbones_AnimationState_get_name(se::State& s)
{
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_string_to_seval(cobj->name, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_AnimationState_get_name)

static bool js_cocos2dx_dragonbones_AnimationState_set_name(se::State& s)
{
    const auto& args = s.args();
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_AnimationState_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::string arg0;
    ok &= seval_to_std_string(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_AnimationState_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_dragonbones_AnimationState_set_name)


extern se::Object* __jsb_dragonBones_BaseObject_proto;


bool js_register_cocos2dx_dragonbones_AnimationState(se::Object* obj)
{
    auto cls = se::Class::create("AnimationState", obj, __jsb_dragonBones_BaseObject_proto, nullptr);

    cls->defineProperty("additiveBlending", _SE(js_cocos2dx_dragonbones_AnimationState_get_additiveBlending), _SE(js_cocos2dx_dragonbones_AnimationState_set_additiveBlending));
    cls->defineProperty("displayControl", _SE(js_cocos2dx_dragonbones_AnimationState_get_displayControl), _SE(js_cocos2dx_dragonbones_AnimationState_set_displayControl));
    cls->defineProperty("playTimes", _SE(js_cocos2dx_dragonbones_AnimationState_get_playTimes), _SE(js_cocos2dx_dragonbones_AnimationState_set_playTimes));
    cls->defineProperty("timeScale", _SE(js_cocos2dx_dragonbones_AnimationState_get_timeScale), _SE(js_cocos2dx_dragonbones_AnimationState_set_timeScale));
    cls->defineProperty("weight", _SE(js_cocos2dx_dragonbones_AnimationState_get_weight), _SE(js_cocos2dx_dragonbones_AnimationState_set_weight));
    cls->defineProperty("autoFadeOutTime", _SE(js_cocos2dx_dragonbones_AnimationState_get_autoFadeOutTime), _SE(js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime));
    cls->defineProperty("fadeTotalTime", _SE(js_cocos2dx_dragonbones_AnimationState_get_fadeTotalTime), _SE(js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime));
    cls->defineProperty("name", _SE(js_cocos2dx_dragonbones_AnimationState_get_name), _SE(js_cocos2dx_dragonbones_AnimationState_set_name));
    cls->defineFunction("isCompleted", _SE(js_cocos2dx_dragonbones_AnimationState_isCompleted));
    cls->defineFunction("play", _SE(js_cocos2dx_dragonbones_AnimationState_play));
    cls->defineFunction("fadeOut", _SE(js_cocos2dx_dragonbones_AnimationState_fadeOut));
    cls->defineFunction("getName", _SE(js_cocos2dx_dragonbones_AnimationState_getName));
    cls->defineFunction("stop", _SE(js_cocos2dx_dragonbones_AnimationState_stop));
    cls->defineFunction("setCurrentTime", _SE(js_cocos2dx_dragonbones_AnimationState_setCurrentTime));
    cls->defineFunction("getCurrentTime", _SE(js_cocos2dx_dragonbones_AnimationState_getCurrentTime));
    cls->defineFunction("getTotalTime", _SE(js_cocos2dx_dragonbones_AnimationState_getTotalTime));
    cls->defineFunction("init", _SE(js_cocos2dx_dragonbones_AnimationState_init));
    cls->defineFunction("isFadeIn", _SE(js_cocos2dx_dragonbones_AnimationState_isFadeIn));
    cls->defineFunction("addBoneMask", _SE(js_cocos2dx_dragonbones_AnimationState_addBoneMask));
    cls->defineFunction("containsBoneMask", _SE(js_cocos2dx_dragonbones_AnimationState_containsBoneMask));
    cls->defineFunction("removeAllBoneMask", _SE(js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask));
    cls->defineFunction("getAnimationData", _SE(js_cocos2dx_dragonbones_AnimationState_getAnimationData));
    cls->defineFunction("isFadeComplete", _SE(js_cocos2dx_dragonbones_AnimationState_isFadeComplete));
    cls->defineFunction("advanceTime", _SE(js_cocos2dx_dragonbones_AnimationState_advanceTime));
    cls->defineFunction("isPlaying", _SE(js_cocos2dx_dragonbones_AnimationState_isPlaying));
    cls->defineFunction("removeBoneMask", _SE(js_cocos2dx_dragonbones_AnimationState_removeBoneMask));
    cls->defineFunction("getCurrentPlayTimes", _SE(js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes));
    cls->defineFunction("isFadeOut", _SE(js_cocos2dx_dragonbones_AnimationState_isFadeOut));
    cls->install();
    JSBClassType::registerClass<dragonBones::AnimationState>(cls);

    __jsb_dragonBones_AnimationState_proto = cls->getProto();
    __jsb_dragonBones_AnimationState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Bone_proto = nullptr;
se::Class* __jsb_dragonBones_Bone_class = nullptr;

static bool js_cocos2dx_dragonbones_Bone_getOffsetMode(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_getOffsetMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getOffsetMode();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_getOffsetMode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_getOffsetMode)

static bool js_cocos2dx_dragonbones_Bone_getParent(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Bone* result = cobj->getParent();
        ok &= native_ptr_to_rooted_seval<dragonBones::Bone>((dragonBones::Bone*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_getParent)

static bool js_cocos2dx_dragonbones_Bone_getName(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_getName)

static bool js_cocos2dx_dragonbones_Bone_contains(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_contains : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const dragonBones::Bone* arg0 = nullptr;
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

static bool js_cocos2dx_dragonbones_Bone_update(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_update)

static bool js_cocos2dx_dragonbones_Bone_updateByConstraint(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_updateByConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateByConstraint();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_updateByConstraint)

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

static bool js_cocos2dx_dragonbones_Bone_init(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const dragonBones::BoneData* arg0 = nullptr;
        dragonBones::Armature* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_init : Error processing arguments");
        cobj->init(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_init)

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

static bool js_cocos2dx_dragonbones_Bone_setOffsetMode(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_setOffsetMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_setOffsetMode : Error processing arguments");
        cobj->setOffsetMode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_setOffsetMode)

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

static bool js_cocos2dx_dragonbones_Bone_getBoneData(se::State& s)
{
    dragonBones::Bone* cobj = (dragonBones::Bone*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Bone_getBoneData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::BoneData* result = cobj->getBoneData();
        ok &= native_ptr_to_rooted_seval<dragonBones::BoneData>((dragonBones::BoneData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Bone_getBoneData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Bone_getBoneData)


extern se::Object* __jsb_dragonBones_TransformObject_proto;


bool js_register_cocos2dx_dragonbones_Bone(se::Object* obj)
{
    auto cls = se::Class::create("Bone", obj, __jsb_dragonBones_TransformObject_proto, nullptr);

    cls->defineFunction("getOffsetMode", _SE(js_cocos2dx_dragonbones_Bone_getOffsetMode));
    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_Bone_getParent));
    cls->defineFunction("getName", _SE(js_cocos2dx_dragonbones_Bone_getName));
    cls->defineFunction("contains", _SE(js_cocos2dx_dragonbones_Bone_contains));
    cls->defineFunction("update", _SE(js_cocos2dx_dragonbones_Bone_update));
    cls->defineFunction("updateByConstraint", _SE(js_cocos2dx_dragonbones_Bone_updateByConstraint));
    cls->defineFunction("getVisible", _SE(js_cocos2dx_dragonbones_Bone_getVisible));
    cls->defineFunction("init", _SE(js_cocos2dx_dragonbones_Bone_init));
    cls->defineFunction("invalidUpdate", _SE(js_cocos2dx_dragonbones_Bone_invalidUpdate));
    cls->defineFunction("setOffsetMode", _SE(js_cocos2dx_dragonbones_Bone_setOffsetMode));
    cls->defineFunction("setVisible", _SE(js_cocos2dx_dragonbones_Bone_setVisible));
    cls->defineFunction("getBoneData", _SE(js_cocos2dx_dragonbones_Bone_getBoneData));
    cls->install();
    JSBClassType::registerClass<dragonBones::Bone>(cls);

    __jsb_dragonBones_Bone_proto = cls->getProto();
    __jsb_dragonBones_Bone_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Slot_proto = nullptr;
se::Class* __jsb_dragonBones_Slot_class = nullptr;

static bool js_cocos2dx_dragonbones_Slot__updateColor(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot__updateColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->_updateColor();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot__updateColor)

static bool js_cocos2dx_dragonbones_Slot_setRawDisplayDatas(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_setRawDisplayDatas : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const std::vector<dragonBones::DisplayData *>* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_setRawDisplayDatas : Error processing arguments");
        cobj->setRawDisplayDatas(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_setRawDisplayDatas)

static bool js_cocos2dx_dragonbones_Slot_getVisible(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_getVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getVisible();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_getVisible : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getVisible)

static bool js_cocos2dx_dragonbones_Slot_getSlotData(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_getSlotData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const dragonBones::SlotData* result = cobj->getSlotData();
        ok &= native_ptr_to_rooted_seval<dragonBones::SlotData>((dragonBones::SlotData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_getSlotData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getSlotData)

static bool js_cocos2dx_dragonbones_Slot_getName(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getName)

static bool js_cocos2dx_dragonbones_Slot__setZorder(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot__setZorder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot__setZorder : Error processing arguments");
        bool result = cobj->_setZorder(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot__setZorder : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot__setZorder)

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

static bool js_cocos2dx_dragonbones_Slot_intersectsSegment(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_intersectsSegment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_intersectsSegment : Error processing arguments");
        int result = cobj->intersectsSegment(arg0, arg1, arg2, arg3);
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_intersectsSegment : Error processing arguments");
        return true;
    }
    if (argc == 5) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        dragonBones::Point* arg4 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_native_ptr(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_intersectsSegment : Error processing arguments");
        int result = cobj->intersectsSegment(arg0, arg1, arg2, arg3, arg4);
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_intersectsSegment : Error processing arguments");
        return true;
    }
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        dragonBones::Point* arg4 = 0;
        dragonBones::Point* arg5 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_native_ptr(args[4], &arg4);
        ok &= seval_to_native_ptr(args[5], &arg5);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_intersectsSegment : Error processing arguments");
        int result = cobj->intersectsSegment(arg0, arg1, arg2, arg3, arg4, arg5);
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_intersectsSegment : Error processing arguments");
        return true;
    }
    if (argc == 7) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        dragonBones::Point* arg4 = 0;
        dragonBones::Point* arg5 = 0;
        dragonBones::Point* arg6 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_native_ptr(args[4], &arg4);
        ok &= seval_to_native_ptr(args[5], &arg5);
        ok &= seval_to_native_ptr(args[6], &arg6);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_intersectsSegment : Error processing arguments");
        int result = cobj->intersectsSegment(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_intersectsSegment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_intersectsSegment)

static bool js_cocos2dx_dragonbones_Slot_update(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_update)

static bool js_cocos2dx_dragonbones_Slot_updateTransformAndMatrix(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_updateTransformAndMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateTransformAndMatrix();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_updateTransformAndMatrix)

static bool js_cocos2dx_dragonbones_Slot_getParent(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Bone* result = cobj->getParent();
        ok &= native_ptr_to_rooted_seval<dragonBones::Bone>((dragonBones::Bone*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getParent)

static bool js_cocos2dx_dragonbones_Slot_getBoundingBoxData(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_getBoundingBoxData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::BoundingBoxData* result = cobj->getBoundingBoxData();
        ok &= native_ptr_to_seval<dragonBones::BoundingBoxData>((dragonBones::BoundingBoxData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_getBoundingBoxData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getBoundingBoxData)

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

static bool js_cocos2dx_dragonbones_Slot_replaceDisplayData(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_replaceDisplayData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        dragonBones::DisplayData* arg0 = nullptr;
        int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_replaceDisplayData : Error processing arguments");
        cobj->replaceDisplayData(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_replaceDisplayData)

static bool js_cocos2dx_dragonbones_Slot_containsPoint(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_containsPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_containsPoint : Error processing arguments");
        bool result = cobj->containsPoint(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_containsPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_containsPoint)

static bool js_cocos2dx_dragonbones_Slot_setVisible(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Slot_setVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Slot_setVisible : Error processing arguments");
        cobj->setVisible(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_setVisible)

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

    cls->defineProperty("displayController", _SE(js_cocos2dx_dragonbones_Slot_get_displayController), _SE(js_cocos2dx_dragonbones_Slot_set_displayController));
    cls->defineFunction("_updateColor", _SE(js_cocos2dx_dragonbones_Slot__updateColor));
    cls->defineFunction("setRawDisplayDatas", _SE(js_cocos2dx_dragonbones_Slot_setRawDisplayDatas));
    cls->defineFunction("getVisible", _SE(js_cocos2dx_dragonbones_Slot_getVisible));
    cls->defineFunction("getSlotData", _SE(js_cocos2dx_dragonbones_Slot_getSlotData));
    cls->defineFunction("getName", _SE(js_cocos2dx_dragonbones_Slot_getName));
    cls->defineFunction("_setZorder", _SE(js_cocos2dx_dragonbones_Slot__setZorder));
    cls->defineFunction("invalidUpdate", _SE(js_cocos2dx_dragonbones_Slot_invalidUpdate));
    cls->defineFunction("getChildArmature", _SE(js_cocos2dx_dragonbones_Slot_getChildArmature));
    cls->defineFunction("intersectsSegment", _SE(js_cocos2dx_dragonbones_Slot_intersectsSegment));
    cls->defineFunction("update", _SE(js_cocos2dx_dragonbones_Slot_update));
    cls->defineFunction("updateTransformAndMatrix", _SE(js_cocos2dx_dragonbones_Slot_updateTransformAndMatrix));
    cls->defineFunction("getParent", _SE(js_cocos2dx_dragonbones_Slot_getParent));
    cls->defineFunction("getBoundingBoxData", _SE(js_cocos2dx_dragonbones_Slot_getBoundingBoxData));
    cls->defineFunction("setChildArmature", _SE(js_cocos2dx_dragonbones_Slot_setChildArmature));
    cls->defineFunction("replaceDisplayData", _SE(js_cocos2dx_dragonbones_Slot_replaceDisplayData));
    cls->defineFunction("containsPoint", _SE(js_cocos2dx_dragonbones_Slot_containsPoint));
    cls->defineFunction("setVisible", _SE(js_cocos2dx_dragonbones_Slot_setVisible));
    cls->install();
    JSBClassType::registerClass<dragonBones::Slot>(cls);

    __jsb_dragonBones_Slot_proto = cls->getProto();
    __jsb_dragonBones_Slot_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_WorldClock_proto = nullptr;
se::Class* __jsb_dragonBones_WorldClock_class = nullptr;

static bool js_cocos2dx_dragonbones_WorldClock_render(se::State& s)
{
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_WorldClock_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->render();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_WorldClock_render)

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

static bool js_cocos2dx_dragonbones_WorldClock_contains(se::State& s)
{
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_WorldClock_contains : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const dragonBones::IAnimatable* arg0 = nullptr;
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

static bool js_cocos2dx_dragonbones_WorldClock_getClock(se::State& s)
{
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_WorldClock_getClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = cobj->getClock();
        ok &= native_ptr_to_rooted_seval<dragonBones::WorldClock>((dragonBones::WorldClock*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_WorldClock_getClock : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_WorldClock_getClock)

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

static bool js_cocos2dx_dragonbones_WorldClock_setClock(se::State& s)
{
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_WorldClock_setClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::WorldClock* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_WorldClock_setClock : Error processing arguments");
        cobj->setClock(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_WorldClock_setClock)

static bool js_cocos2dx_dragonbones_WorldClock_getStaticClock(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = dragonBones::WorldClock::getStaticClock();
        ok &= native_ptr_to_rooted_seval<dragonBones::WorldClock>((dragonBones::WorldClock*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_WorldClock_getStaticClock : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_WorldClock_getStaticClock)




bool js_register_cocos2dx_dragonbones_WorldClock(se::Object* obj)
{
    auto cls = se::Class::create("WorldClock", obj, nullptr, nullptr);

    cls->defineFunction("render", _SE(js_cocos2dx_dragonbones_WorldClock_render));
    cls->defineFunction("clear", _SE(js_cocos2dx_dragonbones_WorldClock_clear));
    cls->defineFunction("contains", _SE(js_cocos2dx_dragonbones_WorldClock_contains));
    cls->defineFunction("getClock", _SE(js_cocos2dx_dragonbones_WorldClock_getClock));
    cls->defineFunction("advanceTime", _SE(js_cocos2dx_dragonbones_WorldClock_advanceTime));
    cls->defineFunction("setClock", _SE(js_cocos2dx_dragonbones_WorldClock_setClock));
    cls->defineStaticFunction("getStaticClock", _SE(js_cocos2dx_dragonbones_WorldClock_getStaticClock));
    cls->install();
    JSBClassType::registerClass<dragonBones::WorldClock>(cls);

    __jsb_dragonBones_WorldClock_proto = cls->getProto();
    __jsb_dragonBones_WorldClock_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_Animation_proto = nullptr;
se::Class* __jsb_dragonBones_Animation_class = nullptr;

static bool js_cocos2dx_dragonbones_Animation_init(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Armature* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_init : Error processing arguments");
        cobj->init(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_init)

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
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
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
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
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
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (int)tmp; } while(false);
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
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (int)tmp; } while(false);
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
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (int)tmp; } while(false);
        ok &= seval_to_std_string(args[4], &arg4);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (dragonBones::AnimationFadeOutMode)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* result = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_fadeIn)

static bool js_cocos2dx_dragonbones_Animation_playConfig(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_playConfig : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::AnimationConfig* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_playConfig : Error processing arguments");
        dragonBones::AnimationState* result = cobj->playConfig(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_playConfig : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_playConfig)

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
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
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

static bool js_cocos2dx_dragonbones_Animation_getLastAnimationName(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getLastAnimationName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_getLastAnimationName)

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

static bool js_cocos2dx_dragonbones_Animation_advanceTime(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_advanceTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_advanceTime)

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
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
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

static bool js_cocos2dx_dragonbones_Animation_getAnimationConfig(se::State& s)
{
    dragonBones::Animation* cobj = (dragonBones::Animation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_Animation_getAnimationConfig : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::AnimationConfig* result = cobj->getAnimationConfig();
        ok &= native_ptr_to_seval<dragonBones::AnimationConfig>((dragonBones::AnimationConfig*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_Animation_getAnimationConfig : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Animation_getAnimationConfig)

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
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
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
    cls->defineFunction("init", _SE(js_cocos2dx_dragonbones_Animation_init));
    cls->defineFunction("gotoAndPlayByTime", _SE(js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime));
    cls->defineFunction("fadeIn", _SE(js_cocos2dx_dragonbones_Animation_fadeIn));
    cls->defineFunction("playConfig", _SE(js_cocos2dx_dragonbones_Animation_playConfig));
    cls->defineFunction("isCompleted", _SE(js_cocos2dx_dragonbones_Animation_isCompleted));
    cls->defineFunction("play", _SE(js_cocos2dx_dragonbones_Animation_play));
    cls->defineFunction("getState", _SE(js_cocos2dx_dragonbones_Animation_getState));
    cls->defineFunction("stop", _SE(js_cocos2dx_dragonbones_Animation_stop));
    cls->defineFunction("getLastAnimationName", _SE(js_cocos2dx_dragonbones_Animation_getLastAnimationName));
    cls->defineFunction("getLastAnimationState", _SE(js_cocos2dx_dragonbones_Animation_getLastAnimationState));
    cls->defineFunction("getAnimationNames", _SE(js_cocos2dx_dragonbones_Animation_getAnimationNames));
    cls->defineFunction("advanceTime", _SE(js_cocos2dx_dragonbones_Animation_advanceTime));
    cls->defineFunction("isPlaying", _SE(js_cocos2dx_dragonbones_Animation_isPlaying));
    cls->defineFunction("gotoAndPlayByProgress", _SE(js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress));
    cls->defineFunction("getAnimationConfig", _SE(js_cocos2dx_dragonbones_Animation_getAnimationConfig));
    cls->defineFunction("reset", _SE(js_cocos2dx_dragonbones_Animation_reset));
    cls->defineFunction("hasAnimation", _SE(js_cocos2dx_dragonbones_Animation_hasAnimation));
    cls->defineFunction("gotoAndStopByTime", _SE(js_cocos2dx_dragonbones_Animation_gotoAndStopByTime));
    cls->defineFunction("gotoAndStopByProgress", _SE(js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress));
    cls->defineFunction("gotoAndPlayByFrame", _SE(js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame));
    cls->defineFunction("gotoAndStopByFrame", _SE(js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame));
    cls->install();
    JSBClassType::registerClass<dragonBones::Animation>(cls);

    __jsb_dragonBones_Animation_proto = cls->getProto();
    __jsb_dragonBones_Animation_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_EventObject_proto = nullptr;
se::Class* __jsb_dragonBones_EventObject_class = nullptr;

static bool js_cocos2dx_dragonbones_EventObject_getBone(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_getBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Bone* result = cobj->getBone();
        ok &= native_ptr_to_rooted_seval<dragonBones::Bone>((dragonBones::Bone*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_getBone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_EventObject_getBone)

static bool js_cocos2dx_dragonbones_EventObject_getData(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::UserData* result = cobj->getData();
        ok &= native_ptr_to_seval<dragonBones::UserData>((dragonBones::UserData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_getData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_EventObject_getData)

static bool js_cocos2dx_dragonbones_EventObject_getAnimationState(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_getAnimationState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::AnimationState* result = cobj->getAnimationState();
        ok &= native_ptr_to_rooted_seval<dragonBones::AnimationState>((dragonBones::AnimationState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_getAnimationState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_EventObject_getAnimationState)

static bool js_cocos2dx_dragonbones_EventObject_getArmature(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getArmature();
        ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_getArmature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_EventObject_getArmature)

static bool js_cocos2dx_dragonbones_EventObject_getSlot(se::State& s)
{
    dragonBones::EventObject* cobj = (dragonBones::EventObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_EventObject_getSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Slot* result = cobj->getSlot();
        ok &= native_ptr_to_rooted_seval<dragonBones::Slot>((dragonBones::Slot*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_getSlot : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_EventObject_getSlot)

static bool js_cocos2dx_dragonbones_EventObject_actionDataToInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        const dragonBones::ActionData* arg0 = nullptr;
        dragonBones::EventObject* arg1 = nullptr;
        dragonBones::Armature* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_EventObject_actionDataToInstance : Error processing arguments");
        dragonBones::EventObject::actionDataToInstance(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_EventObject_actionDataToInstance)

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
    cls->defineFunction("getBone", _SE(js_cocos2dx_dragonbones_EventObject_getBone));
    cls->defineFunction("getData", _SE(js_cocos2dx_dragonbones_EventObject_getData));
    cls->defineFunction("getAnimationState", _SE(js_cocos2dx_dragonbones_EventObject_getAnimationState));
    cls->defineFunction("getArmature", _SE(js_cocos2dx_dragonbones_EventObject_getArmature));
    cls->defineFunction("getSlot", _SE(js_cocos2dx_dragonbones_EventObject_getSlot));
    cls->defineStaticFunction("actionDataToInstance", _SE(js_cocos2dx_dragonbones_EventObject_actionDataToInstance));
    cls->install();
    JSBClassType::registerClass<dragonBones::EventObject>(cls);

    __jsb_dragonBones_EventObject_proto = cls->getProto();
    __jsb_dragonBones_EventObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_BaseFactory_proto = nullptr;
se::Class* __jsb_dragonBones_BaseFactory_class = nullptr;

static bool js_cocos2dx_dragonbones_BaseFactory_replaceSkin(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_replaceSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        dragonBones::Armature* arg0 = nullptr;
        dragonBones::SkinData* arg1 = nullptr;
        bool arg2;
        std::vector<std::string> arg3;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        ok &= seval_to_std_vector_string(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceSkin : Error processing arguments");
        bool result = cobj->replaceSkin(arg0, arg1, arg2, arg3);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceSkin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_replaceSkin)

static bool js_cocos2dx_dragonbones_BaseFactory_replaceAnimation(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_replaceAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        dragonBones::Armature* arg0 = nullptr;
        dragonBones::ArmatureData* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceAnimation : Error processing arguments");
        bool result = cobj->replaceAnimation(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceAnimation : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        dragonBones::Armature* arg0 = nullptr;
        dragonBones::ArmatureData* arg1 = nullptr;
        bool arg2;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceAnimation : Error processing arguments");
        bool result = cobj->replaceAnimation(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_replaceAnimation)

static bool js_cocos2dx_dragonbones_BaseFactory_getClock(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_getClock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = cobj->getClock();
        ok &= native_ptr_to_rooted_seval<dragonBones::WorldClock>((dragonBones::WorldClock*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_getClock : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_getClock)

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
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* result = cobj->buildArmature(arg0, arg1, arg2, arg3);
        ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
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

static bool js_cocos2dx_dragonbones_BaseFactory_getArmatureData(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_getArmatureData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_getArmatureData : Error processing arguments");
        dragonBones::ArmatureData* result = cobj->getArmatureData(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::ArmatureData>((dragonBones::ArmatureData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_getArmatureData : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_getArmatureData : Error processing arguments");
        dragonBones::ArmatureData* result = cobj->getArmatureData(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::ArmatureData>((dragonBones::ArmatureData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_getArmatureData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_getArmatureData)

static bool js_cocos2dx_dragonbones_BaseFactory_replaceSlotDisplay(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_replaceSlotDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        dragonBones::Slot* arg4 = nullptr;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_native_ptr(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceSlotDisplay : Error processing arguments");
        bool result = cobj->replaceSlotDisplay(arg0, arg1, arg2, arg3, arg4);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceSlotDisplay : Error processing arguments");
        return true;
    }
    if (argc == 6) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        dragonBones::Slot* arg4 = nullptr;
        int arg5 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_native_ptr(args[4], &arg4);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceSlotDisplay : Error processing arguments");
        bool result = cobj->replaceSlotDisplay(arg0, arg1, arg2, arg3, arg4, arg5);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceSlotDisplay : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_replaceSlotDisplay)

static bool js_cocos2dx_dragonbones_BaseFactory_changeSkin(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_changeSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        dragonBones::Armature* arg0 = nullptr;
        dragonBones::SkinData* arg1 = nullptr;
        std::vector<std::string> arg2;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_std_vector_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_changeSkin : Error processing arguments");
        bool result = cobj->changeSkin(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_changeSkin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_changeSkin)

static bool js_cocos2dx_dragonbones_BaseFactory_replaceDisplay(se::State& s)
{
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_BaseFactory_replaceDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        dragonBones::Slot* arg0 = nullptr;
        dragonBones::DisplayData* arg1 = nullptr;
        int arg2 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_BaseFactory_replaceDisplay : Error processing arguments");
        cobj->replaceDisplay(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_BaseFactory_replaceDisplay)

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

    cls->defineFunction("replaceSkin", _SE(js_cocos2dx_dragonbones_BaseFactory_replaceSkin));
    cls->defineFunction("replaceAnimation", _SE(js_cocos2dx_dragonbones_BaseFactory_replaceAnimation));
    cls->defineFunction("getClock", _SE(js_cocos2dx_dragonbones_BaseFactory_getClock));
    cls->defineFunction("removeDragonBonesData", _SE(js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData));
    cls->defineFunction("removeTextureAtlasData", _SE(js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData));
    cls->defineFunction("parseDragonBonesData", _SE(js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData));
    cls->defineFunction("clear", _SE(js_cocos2dx_dragonbones_BaseFactory_clear));
    cls->defineFunction("addDragonBonesData", _SE(js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData));
    cls->defineFunction("buildArmature", _SE(js_cocos2dx_dragonbones_BaseFactory_buildArmature));
    cls->defineFunction("addTextureAtlasData", _SE(js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData));
    cls->defineFunction("getArmatureData", _SE(js_cocos2dx_dragonbones_BaseFactory_getArmatureData));
    cls->defineFunction("replaceSlotDisplay", _SE(js_cocos2dx_dragonbones_BaseFactory_replaceSlotDisplay));
    cls->defineFunction("changeSkin", _SE(js_cocos2dx_dragonbones_BaseFactory_changeSkin));
    cls->defineFunction("replaceDisplay", _SE(js_cocos2dx_dragonbones_BaseFactory_replaceDisplay));
    cls->defineFunction("getDragonBonesData", _SE(js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData));
    cls->install();
    JSBClassType::registerClass<dragonBones::BaseFactory>(cls);

    __jsb_dragonBones_BaseFactory_proto = cls->getProto();
    __jsb_dragonBones_BaseFactory_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCTextureAtlasData_proto = nullptr;
se::Class* __jsb_dragonBones_CCTextureAtlasData_class = nullptr;

static bool js_cocos2dx_dragonbones_CCTextureAtlasData_setRenderTexture(se::State& s)
{
    dragonBones::CCTextureAtlasData* cobj = (dragonBones::CCTextureAtlasData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCTextureAtlasData_setRenderTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::middleware::Texture2D* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCTextureAtlasData_setRenderTexture : Error processing arguments");
        cobj->setRenderTexture(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCTextureAtlasData_setRenderTexture)

static bool js_cocos2dx_dragonbones_CCTextureAtlasData_getRenderTexture(se::State& s)
{
    dragonBones::CCTextureAtlasData* cobj = (dragonBones::CCTextureAtlasData*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCTextureAtlasData_getRenderTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::middleware::Texture2D* result = cobj->getRenderTexture();
        ok &= native_ptr_to_seval<cocos2d::middleware::Texture2D>((cocos2d::middleware::Texture2D*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCTextureAtlasData_getRenderTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCTextureAtlasData_getRenderTexture)


extern se::Object* __jsb_dragonBones_TextureAtlasData_proto;


bool js_register_cocos2dx_dragonbones_CCTextureAtlasData(se::Object* obj)
{
    auto cls = se::Class::create("CCTextureAtlasData", obj, __jsb_dragonBones_TextureAtlasData_proto, nullptr);

    cls->defineFunction("setRenderTexture", _SE(js_cocos2dx_dragonbones_CCTextureAtlasData_setRenderTexture));
    cls->defineFunction("getRenderTexture", _SE(js_cocos2dx_dragonbones_CCTextureAtlasData_getRenderTexture));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCTextureAtlasData>(cls);

    __jsb_dragonBones_CCTextureAtlasData_proto = cls->getProto();
    __jsb_dragonBones_CCTextureAtlasData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCTextureData_proto = nullptr;
se::Class* __jsb_dragonBones_CCTextureData_class = nullptr;


extern se::Object* __jsb_dragonBones_TextureData_proto;


bool js_register_cocos2dx_dragonbones_CCTextureData(se::Object* obj)
{
    auto cls = se::Class::create("CCTextureData", obj, __jsb_dragonBones_TextureData_proto, nullptr);

    cls->install();
    JSBClassType::registerClass<dragonBones::CCTextureData>(cls);

    __jsb_dragonBones_CCTextureData_proto = cls->getProto();
    __jsb_dragonBones_CCTextureData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCSlot_proto = nullptr;
se::Class* __jsb_dragonBones_CCSlot_class = nullptr;

static bool js_cocos2dx_dragonbones_CCSlot_getTexture(se::State& s)
{
    dragonBones::CCSlot* cobj = (dragonBones::CCSlot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCSlot_getTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::middleware::Texture2D* result = cobj->getTexture();
        ok &= native_ptr_to_seval<cocos2d::middleware::Texture2D>((cocos2d::middleware::Texture2D*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCSlot_getTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCSlot_getTexture)

static bool js_cocos2dx_dragonbones_CCSlot_updateWorldMatrix(se::State& s)
{
    dragonBones::CCSlot* cobj = (dragonBones::CCSlot*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCSlot_updateWorldMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateWorldMatrix();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCSlot_updateWorldMatrix)


extern se::Object* __jsb_dragonBones_Slot_proto;


bool js_register_cocos2dx_dragonbones_CCSlot(se::Object* obj)
{
    auto cls = se::Class::create("CCSlot", obj, __jsb_dragonBones_Slot_proto, nullptr);

    cls->defineFunction("getTexture", _SE(js_cocos2dx_dragonbones_CCSlot_getTexture));
    cls->defineFunction("updateWorldMatrix", _SE(js_cocos2dx_dragonbones_CCSlot_updateWorldMatrix));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCSlot>(cls);

    __jsb_dragonBones_CCSlot_proto = cls->getProto();
    __jsb_dragonBones_CCSlot_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCArmatureDisplay_proto = nullptr;
se::Class* __jsb_dragonBones_CCArmatureDisplay_class = nullptr;

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_dbInit(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dbInit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Armature* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dbInit : Error processing arguments");
        cobj->dbInit(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_dbInit)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_addDBEventListener(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_addDBEventListener : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_addDBEventListener : Error processing arguments");
        cobj->addDBEventListener(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_addDBEventListener)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_getRootDisplay(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getRootDisplay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::CCArmatureDisplay* result = cobj->getRootDisplay();
        ok &= native_ptr_to_seval<dragonBones::CCArmatureDisplay>((dragonBones::CCArmatureDisplay*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getRootDisplay : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_getRootDisplay)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_removeDBEventListener(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_removeDBEventListener : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_removeDBEventListener : Error processing arguments");
        cobj->removeDBEventListener(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_removeDBEventListener)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_setEffect(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Effect* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setEffect : Error processing arguments");
        cobj->setEffect(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_setEffect)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_dispose(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dispose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->dispose();
        return true;
    }
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dispose : Error processing arguments");
        cobj->dispose(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_dispose)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_setOpacityModifyRGB(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setOpacityModifyRGB : Error processing arguments");
        cobj->setOpacityModifyRGB(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_setOpacityModifyRGB)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_dbClear(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dbClear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dbClear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_dbClear)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_dispatchDBEvent(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dispatchDBEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        dragonBones::EventObject* arg1 = nullptr;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dispatchDBEvent : Error processing arguments");
        cobj->dispatchDBEvent(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_dispatchDBEvent)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_getDebugData(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getDebugData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se_object_ptr result = cobj->getDebugData();
        s.rval().setObject(result);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getDebugData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_getDebugData)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_hasDBEventListener(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasDBEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasDBEventListener : Error processing arguments");
        bool result = cobj->hasDBEventListener(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasDBEventListener : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_hasDBEventListener)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_dbUpdate(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dbUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dbUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_dbUpdate)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_setDBEventCallback(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setDBEventCallback : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setDBEventCallback : Error processing arguments");
        cobj->setDBEventCallback(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_setDBEventCallback)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_setDebugBonesEnabled(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setDebugBonesEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setDebugBonesEnabled : Error processing arguments");
        cobj->setDebugBonesEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_setDebugBonesEnabled)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Animation* result = cobj->getAnimation();
        ok &= native_ptr_to_rooted_seval<dragonBones::Animation>((dragonBones::Animation*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_setColor(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setColor : Error processing arguments");
        cobj->setColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_setColor)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_bindNodeProxy(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_bindNodeProxy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_bindNodeProxy : Error processing arguments");
        cobj->bindNodeProxy(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_bindNodeProxy)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_setBatchEnabled(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setBatchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setBatchEnabled : Error processing arguments");
        cobj->setBatchEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_setBatchEnabled)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_dbRender(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dbRender : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dbRender();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_dbRender)

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

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_convertToRootSpace(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_convertToRootSpace : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_convertToRootSpace : Error processing arguments");
        cocos2d::Vec2 result = cobj->convertToRootSpace(arg0);
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_convertToRootSpace : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_convertToRootSpace)

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

SE_DECLARE_FINALIZE_FUNC(js_dragonBones_CCArmatureDisplay_finalize)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_constructor(se::State& s)
{
    dragonBones::CCArmatureDisplay* cobj = new (std::nothrow) dragonBones::CCArmatureDisplay();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_dragonbones_CCArmatureDisplay_constructor, __jsb_dragonBones_CCArmatureDisplay_class, js_dragonBones_CCArmatureDisplay_finalize)




static bool js_dragonBones_CCArmatureDisplay_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (dragonBones::CCArmatureDisplay)", s.nativeThisObject());
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_CCArmatureDisplay_finalize)

bool js_register_cocos2dx_dragonbones_CCArmatureDisplay(se::Object* obj)
{
    auto cls = se::Class::create("CCArmatureDisplay", obj, nullptr, _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_constructor));

    cls->defineFunction("dbInit", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_dbInit));
    cls->defineFunction("addDBEventListener", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_addDBEventListener));
    cls->defineFunction("getRootDisplay", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_getRootDisplay));
    cls->defineFunction("removeDBEventListener", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_removeDBEventListener));
    cls->defineFunction("setEffect", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_setEffect));
    cls->defineFunction("dispose", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_dispose));
    cls->defineFunction("setOpacityModifyRGB", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_setOpacityModifyRGB));
    cls->defineFunction("dbClear", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_dbClear));
    cls->defineFunction("dispatchDBEvent", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_dispatchDBEvent));
    cls->defineFunction("getDebugData", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_getDebugData));
    cls->defineFunction("hasDBEventListener", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_hasDBEventListener));
    cls->defineFunction("dbUpdate", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_dbUpdate));
    cls->defineFunction("setDBEventCallback", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_setDBEventCallback));
    cls->defineFunction("setDebugBonesEnabled", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_setDebugBonesEnabled));
    cls->defineFunction("getAnimation", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation));
    cls->defineFunction("setColor", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_setColor));
    cls->defineFunction("bindNodeProxy", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_bindNodeProxy));
    cls->defineFunction("setBatchEnabled", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_setBatchEnabled));
    cls->defineFunction("dbRender", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_dbRender));
    cls->defineFunction("armature", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature));
    cls->defineFunction("convertToRootSpace", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_convertToRootSpace));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_create));
    cls->defineFinalizeFunction(_SE(js_dragonBones_CCArmatureDisplay_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCArmatureDisplay>(cls);

    __jsb_dragonBones_CCArmatureDisplay_proto = cls->getProto();
    __jsb_dragonBones_CCArmatureDisplay_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_CCFactory_proto = nullptr;
se::Class* __jsb_dragonBones_CCFactory_class = nullptr;

static bool js_cocos2dx_dragonbones_CCFactory_setTimeScale(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_setTimeScale)

static bool js_cocos2dx_dragonbones_CCFactory_getSoundEventManager(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_getSoundEventManager : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::CCArmatureDisplay* result = cobj->getSoundEventManager();
        ok &= native_ptr_to_seval<dragonBones::CCArmatureDisplay>((dragonBones::CCArmatureDisplay*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getSoundEventManager : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_getSoundEventManager)

static bool js_cocos2dx_dragonbones_CCFactory_render(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_render : Error processing arguments");
        cobj->render(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_render)

static bool js_cocos2dx_dragonbones_CCFactory_removeDragonBonesDataByUUID(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_removeDragonBonesDataByUUID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_removeDragonBonesDataByUUID : Error processing arguments");
        cobj->removeDragonBonesDataByUUID(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_removeDragonBonesDataByUUID : Error processing arguments");
        cobj->removeDragonBonesDataByUUID(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_removeDragonBonesDataByUUID)

static bool js_cocos2dx_dragonbones_CCFactory_update(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_update)

static bool js_cocos2dx_dragonbones_CCFactory_remove(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_remove : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Armature* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_remove : Error processing arguments");
        cobj->remove(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_remove)

static bool js_cocos2dx_dragonbones_CCFactory_getTextureAtlasDataByIndex(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_getTextureAtlasDataByIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        int arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getTextureAtlasDataByIndex : Error processing arguments");
        dragonBones::CCTextureAtlasData* result = cobj->getTextureAtlasDataByIndex(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::CCTextureAtlasData>((dragonBones::CCTextureAtlasData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getTextureAtlasDataByIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_getTextureAtlasDataByIndex)

static bool js_cocos2dx_dragonbones_CCFactory_getDragonBones(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_getDragonBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::DragonBones* result = cobj->getDragonBones();
        ok &= native_ptr_to_seval<dragonBones::DragonBones>((dragonBones::DragonBones*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getDragonBones : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_getDragonBones)

static bool js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesDataByPath(arg0);
        ok &= native_ptr_to_rooted_seval<dragonBones::DragonBonesData>((dragonBones::DragonBonesData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesDataByPath(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<dragonBones::DragonBonesData>((dragonBones::DragonBonesData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        float arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        dragonBones::DragonBonesData* result = cobj->parseDragonBonesDataByPath(arg0, arg1, arg2);
        ok &= native_ptr_to_rooted_seval<dragonBones::DragonBonesData>((dragonBones::DragonBonesData*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath)

static bool js_cocos2dx_dragonbones_CCFactory_add(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_add : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        dragonBones::Armature* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_add : Error processing arguments");
        cobj->add(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_add)

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
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* result = cobj->buildArmatureDisplay(arg0, arg1, arg2, arg3);
        ok &= native_ptr_to_seval<dragonBones::CCArmatureDisplay>((dragonBones::CCArmatureDisplay*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay)

static bool js_cocos2dx_dragonbones_CCFactory_stopSchedule(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_stopSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_stopSchedule)

static bool js_cocos2dx_dragonbones_CCFactory_removeTextureAtlasDataByIndex(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_removeTextureAtlasDataByIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        int arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_removeTextureAtlasDataByIndex : Error processing arguments");
        cobj->removeTextureAtlasDataByIndex(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_removeTextureAtlasDataByIndex)

static bool js_cocos2dx_dragonbones_CCFactory_getTimeScale(se::State& s)
{
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCFactory_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getTimeScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_getTimeScale)

static bool js_cocos2dx_dragonbones_CCFactory_isInit(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = dragonBones::CCFactory::isInit();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_isInit : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_isInit)

static bool js_cocos2dx_dragonbones_CCFactory_destroyFactory(se::State& s)
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
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_destroyFactory)

static bool js_cocos2dx_dragonbones_CCFactory_getClock(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::WorldClock* result = dragonBones::CCFactory::getClock();
        ok &= native_ptr_to_rooted_seval<dragonBones::WorldClock>((dragonBones::WorldClock*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getClock : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_getClock)

static bool js_cocos2dx_dragonbones_CCFactory_getFactory(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::CCFactory* result = dragonBones::CCFactory::getFactory();
        ok &= native_ptr_to_seval<dragonBones::CCFactory>((dragonBones::CCFactory*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCFactory_getFactory : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_getFactory)

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

    cls->defineFunction("setTimeScale", _SE(js_cocos2dx_dragonbones_CCFactory_setTimeScale));
    cls->defineFunction("getSoundEventManager", _SE(js_cocos2dx_dragonbones_CCFactory_getSoundEventManager));
    cls->defineFunction("render", _SE(js_cocos2dx_dragonbones_CCFactory_render));
    cls->defineFunction("removeDragonBonesDataByUUID", _SE(js_cocos2dx_dragonbones_CCFactory_removeDragonBonesDataByUUID));
    cls->defineFunction("update", _SE(js_cocos2dx_dragonbones_CCFactory_update));
    cls->defineFunction("remove", _SE(js_cocos2dx_dragonbones_CCFactory_remove));
    cls->defineFunction("getTextureAtlasDataByIndex", _SE(js_cocos2dx_dragonbones_CCFactory_getTextureAtlasDataByIndex));
    cls->defineFunction("getDragonBones", _SE(js_cocos2dx_dragonbones_CCFactory_getDragonBones));
    cls->defineFunction("parseDragonBonesDataByPath", _SE(js_cocos2dx_dragonbones_CCFactory_parseDragonBonesDataByPath));
    cls->defineFunction("add", _SE(js_cocos2dx_dragonbones_CCFactory_add));
    cls->defineFunction("buildArmatureDisplay", _SE(js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay));
    cls->defineFunction("stopSchedule", _SE(js_cocos2dx_dragonbones_CCFactory_stopSchedule));
    cls->defineFunction("removeTextureAtlasDataByIndex", _SE(js_cocos2dx_dragonbones_CCFactory_removeTextureAtlasDataByIndex));
    cls->defineFunction("getTimeScale", _SE(js_cocos2dx_dragonbones_CCFactory_getTimeScale));
    cls->defineStaticFunction("isInit", _SE(js_cocos2dx_dragonbones_CCFactory_isInit));
    cls->defineStaticFunction("destroyFactory", _SE(js_cocos2dx_dragonbones_CCFactory_destroyFactory));
    cls->defineStaticFunction("getClock", _SE(js_cocos2dx_dragonbones_CCFactory_getClock));
    cls->defineStaticFunction("getInstance", _SE(js_cocos2dx_dragonbones_CCFactory_getFactory));
    cls->defineFinalizeFunction(_SE(js_dragonBones_CCFactory_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCFactory>(cls);

    __jsb_dragonBones_CCFactory_proto = cls->getProto();
    __jsb_dragonBones_CCFactory_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_dragonBones_ArmatureCacheMgr_proto = nullptr;
se::Class* __jsb_dragonBones_ArmatureCacheMgr_class = nullptr;

static bool js_cocos2dx_dragonbones_ArmatureCacheMgr_removeArmatureCache(se::State& s)
{
    dragonBones::ArmatureCacheMgr* cobj = (dragonBones::ArmatureCacheMgr*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureCacheMgr_removeArmatureCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureCacheMgr_removeArmatureCache : Error processing arguments");
        cobj->removeArmatureCache(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureCacheMgr_removeArmatureCache)

static bool js_cocos2dx_dragonbones_ArmatureCacheMgr_buildArmatureCache(se::State& s)
{
    dragonBones::ArmatureCacheMgr* cobj = (dragonBones::ArmatureCacheMgr*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_ArmatureCacheMgr_buildArmatureCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureCacheMgr_buildArmatureCache : Error processing arguments");
        dragonBones::ArmatureCache* result = cobj->buildArmatureCache(arg0, arg1, arg2);
        ok &= native_ptr_to_seval<dragonBones::ArmatureCache>((dragonBones::ArmatureCache*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureCacheMgr_buildArmatureCache : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureCacheMgr_buildArmatureCache)

static bool js_cocos2dx_dragonbones_ArmatureCacheMgr_destroyInstance(se::State& s)
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
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureCacheMgr_destroyInstance)

static bool js_cocos2dx_dragonbones_ArmatureCacheMgr_getInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::ArmatureCacheMgr* result = dragonBones::ArmatureCacheMgr::getInstance();
        ok &= native_ptr_to_seval<dragonBones::ArmatureCacheMgr>((dragonBones::ArmatureCacheMgr*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_ArmatureCacheMgr_getInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_ArmatureCacheMgr_getInstance)



static bool js_dragonBones_ArmatureCacheMgr_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (dragonBones::ArmatureCacheMgr)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        dragonBones::ArmatureCacheMgr* cobj = (dragonBones::ArmatureCacheMgr*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_ArmatureCacheMgr_finalize)

bool js_register_cocos2dx_dragonbones_ArmatureCacheMgr(se::Object* obj)
{
    auto cls = se::Class::create("ArmatureCacheMgr", obj, nullptr, nullptr);

    cls->defineFunction("removeArmatureCache", _SE(js_cocos2dx_dragonbones_ArmatureCacheMgr_removeArmatureCache));
    cls->defineFunction("buildArmatureCache", _SE(js_cocos2dx_dragonbones_ArmatureCacheMgr_buildArmatureCache));
    cls->defineStaticFunction("destroyInstance", _SE(js_cocos2dx_dragonbones_ArmatureCacheMgr_destroyInstance));
    cls->defineStaticFunction("getInstance", _SE(js_cocos2dx_dragonbones_ArmatureCacheMgr_getInstance));
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

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setTimeScale(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setTimeScale)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_render(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_render : Error processing arguments");
        cobj->render(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_render)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_addDBEventListener(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_addDBEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_addDBEventListener : Error processing arguments");
        cobj->addDBEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_addDBEventListener)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_removeDBEventListener(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_removeDBEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_removeDBEventListener : Error processing arguments");
        cobj->removeDBEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_removeDBEventListener)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_onEnable(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_onEnable)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setEffect(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Effect* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setEffect : Error processing arguments");
        cobj->setEffect(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setEffect)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_dispose(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_dispose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dispose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_dispose)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB : Error processing arguments");
        cobj->setOpacityModifyRGB(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        dragonBones::EventObject* arg1 = nullptr;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent : Error processing arguments");
        cobj->dispatchDBEvent(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_beginSchedule(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_beginSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_beginSchedule)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_updateAllAnimationCache(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_updateAllAnimationCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateAllAnimationCache();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_updateAllAnimationCache)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_update(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_update)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_playAnimation(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_playAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        int arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_playAnimation : Error processing arguments");
        cobj->playAnimation(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_playAnimation)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setDBEventCallback(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setDBEventCallback : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setDBEventCallback : Error processing arguments");
        cobj->setDBEventCallback(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setDBEventCallback)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_updateAnimationCache(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_updateAnimationCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_updateAnimationCache : Error processing arguments");
        cobj->updateAnimationCache(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_updateAnimationCache)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getTimeScale(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getTimeScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getTimeScale)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getAnimation(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Animation* result = cobj->getAnimation();
        ok &= native_ptr_to_rooted_seval<dragonBones::Animation>((dragonBones::Animation*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getAnimation)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_onDisable(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_onDisable)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setColor(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setColor : Error processing arguments");
        cobj->setColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setColor)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_bindNodeProxy(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_bindNodeProxy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_bindNodeProxy : Error processing arguments");
        cobj->bindNodeProxy(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_bindNodeProxy)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setBatchEnabled(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setBatchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setBatchEnabled : Error processing arguments");
        cobj->setBatchEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setBatchEnabled)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getArmature(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getArmature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        dragonBones::Armature* result = cobj->getArmature();
        ok &= native_ptr_to_rooted_seval<dragonBones::Armature>((dragonBones::Armature*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getArmature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getArmature)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_stopSchedule(se::State& s)
{
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_stopSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_stopSchedule)

SE_DECLARE_FINALIZE_FUNC(js_dragonBones_CCArmatureCacheDisplay_finalize)

static bool js_cocos2dx_dragonbones_CCArmatureCacheDisplay_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    std::string arg0;
    std::string arg1;
    std::string arg2;
    bool arg3;
    ok &= seval_to_std_string(args[0], &arg0);
    ok &= seval_to_std_string(args[1], &arg1);
    ok &= seval_to_std_string(args[2], &arg2);
    ok &= seval_to_boolean(args[3], &arg3);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_dragonbones_CCArmatureCacheDisplay_constructor : Error processing arguments");
    dragonBones::CCArmatureCacheDisplay* cobj = new (std::nothrow) dragonBones::CCArmatureCacheDisplay(arg0, arg1, arg2, arg3);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_constructor, __jsb_dragonBones_CCArmatureCacheDisplay_class, js_dragonBones_CCArmatureCacheDisplay_finalize)




static bool js_dragonBones_CCArmatureCacheDisplay_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (dragonBones::CCArmatureCacheDisplay)", s.nativeThisObject());
    dragonBones::CCArmatureCacheDisplay* cobj = (dragonBones::CCArmatureCacheDisplay*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_dragonBones_CCArmatureCacheDisplay_finalize)

bool js_register_cocos2dx_dragonbones_CCArmatureCacheDisplay(se::Object* obj)
{
    auto cls = se::Class::create("CCArmatureCacheDisplay", obj, nullptr, _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_constructor));

    cls->defineFunction("setTimeScale", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setTimeScale));
    cls->defineFunction("render", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_render));
    cls->defineFunction("addDBEventListener", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_addDBEventListener));
    cls->defineFunction("removeDBEventListener", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_removeDBEventListener));
    cls->defineFunction("onEnable", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_onEnable));
    cls->defineFunction("setEffect", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setEffect));
    cls->defineFunction("dispose", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_dispose));
    cls->defineFunction("setOpacityModifyRGB", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB));
    cls->defineFunction("dispatchDBEvent", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent));
    cls->defineFunction("beginSchedule", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_beginSchedule));
    cls->defineFunction("updateAllAnimationCache", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_updateAllAnimationCache));
    cls->defineFunction("update", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_update));
    cls->defineFunction("playAnimation", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_playAnimation));
    cls->defineFunction("setDBEventCallback", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setDBEventCallback));
    cls->defineFunction("updateAnimationCache", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_updateAnimationCache));
    cls->defineFunction("getTimeScale", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getTimeScale));
    cls->defineFunction("getAnimation", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getAnimation));
    cls->defineFunction("onDisable", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_onDisable));
    cls->defineFunction("setColor", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setColor));
    cls->defineFunction("bindNodeProxy", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_bindNodeProxy));
    cls->defineFunction("setBatchEnabled", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_setBatchEnabled));
    cls->defineFunction("armature", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_getArmature));
    cls->defineFunction("stopSchedule", _SE(js_cocos2dx_dragonbones_CCArmatureCacheDisplay_stopSchedule));
    cls->defineFinalizeFunction(_SE(js_dragonBones_CCArmatureCacheDisplay_finalize));
    cls->install();
    JSBClassType::registerClass<dragonBones::CCArmatureCacheDisplay>(cls);

    __jsb_dragonBones_CCArmatureCacheDisplay_proto = cls->getProto();
    __jsb_dragonBones_CCArmatureCacheDisplay_class = cls;

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
    js_register_cocos2dx_dragonbones_ArmatureCacheMgr(ns);
    js_register_cocos2dx_dragonbones_SkinData(ns);
    js_register_cocos2dx_dragonbones_EventObject(ns);
    js_register_cocos2dx_dragonbones_SlotData(ns);
    js_register_cocos2dx_dragonbones_DragonBonesData(ns);
    js_register_cocos2dx_dragonbones_AnimationData(ns);
    js_register_cocos2dx_dragonbones_CCArmatureCacheDisplay(ns);
    return true;
}

#endif //#if USE_DRAGONBONES > 0
