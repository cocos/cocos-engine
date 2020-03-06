#include "scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/gfx-gles2/GFXGLES2.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cocos2d_GFXOffset_proto = nullptr;
se::Class* __jsb_cocos2d_GFXOffset_class = nullptr;

static bool js_gfx_GFXOffset_get_x(se::State& s)
{
    cocos2d::GFXOffset* cobj = (cocos2d::GFXOffset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXOffset_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->x, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXOffset_get_x)

static bool js_gfx_GFXOffset_set_x(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXOffset* cobj = (cocos2d::GFXOffset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXOffset_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXOffset_set_x : Error processing new value");
    cobj->x = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXOffset_set_x)

static bool js_gfx_GFXOffset_get_y(se::State& s)
{
    cocos2d::GFXOffset* cobj = (cocos2d::GFXOffset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXOffset_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->y, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXOffset_get_y)

static bool js_gfx_GFXOffset_set_y(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXOffset* cobj = (cocos2d::GFXOffset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXOffset_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXOffset_set_y : Error processing new value");
    cobj->y = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXOffset_set_y)

static bool js_gfx_GFXOffset_get_z(se::State& s)
{
    cocos2d::GFXOffset* cobj = (cocos2d::GFXOffset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXOffset_get_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->z, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXOffset_get_z)

static bool js_gfx_GFXOffset_set_z(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXOffset* cobj = (cocos2d::GFXOffset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXOffset_set_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXOffset_set_z : Error processing new value");
    cobj->z = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXOffset_set_z)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXOffset_finalize)

static bool js_gfx_GFXOffset_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXOffset* cobj = JSB_ALLOC(cocos2d::GFXOffset);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXOffset* cobj = JSB_ALLOC(cocos2d::GFXOffset);
        int arg0 = 0;
        json->getProperty("x", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (int)tmp; } while(false);
            cobj->x = arg0;
        }
        int arg1 = 0;
        json->getProperty("y", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (int)tmp; } while(false);
            cobj->y = arg1;
        }
        int arg2 = 0;
        json->getProperty("z", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (int)tmp; } while(false);
            cobj->z = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXOffset* cobj = JSB_ALLOC(cocos2d::GFXOffset);
        int arg0 = 0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
            cobj->x = arg0;
        }
        int arg1 = 0;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
            cobj->y = arg1;
        }
        int arg2 = 0;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
            cobj->z = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXOffset_constructor, __jsb_cocos2d_GFXOffset_class, js_cocos2d_GFXOffset_finalize)




static bool js_cocos2d_GFXOffset_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXOffset)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXOffset* cobj = (cocos2d::GFXOffset*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXOffset_finalize)

bool js_register_gfx_GFXOffset(se::Object* obj)
{
    auto cls = se::Class::create("GFXOffset", obj, nullptr, _SE(js_gfx_GFXOffset_constructor));

    cls->defineProperty("x", _SE(js_gfx_GFXOffset_get_x), _SE(js_gfx_GFXOffset_set_x));
    cls->defineProperty("y", _SE(js_gfx_GFXOffset_get_y), _SE(js_gfx_GFXOffset_set_y));
    cls->defineProperty("z", _SE(js_gfx_GFXOffset_get_z), _SE(js_gfx_GFXOffset_set_z));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXOffset_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXOffset>(cls);

    __jsb_cocos2d_GFXOffset_proto = cls->getProto();
    __jsb_cocos2d_GFXOffset_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXRect_proto = nullptr;
se::Class* __jsb_cocos2d_GFXRect_class = nullptr;

static bool js_gfx_GFXRect_get_x(se::State& s)
{
    cocos2d::GFXRect* cobj = (cocos2d::GFXRect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRect_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->x, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRect_get_x)

static bool js_gfx_GFXRect_set_x(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRect* cobj = (cocos2d::GFXRect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRect_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRect_set_x : Error processing new value");
    cobj->x = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRect_set_x)

static bool js_gfx_GFXRect_get_y(se::State& s)
{
    cocos2d::GFXRect* cobj = (cocos2d::GFXRect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRect_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->y, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRect_get_y)

static bool js_gfx_GFXRect_set_y(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRect* cobj = (cocos2d::GFXRect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRect_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRect_set_y : Error processing new value");
    cobj->y = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRect_set_y)

static bool js_gfx_GFXRect_get_width(se::State& s)
{
    cocos2d::GFXRect* cobj = (cocos2d::GFXRect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRect_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRect_get_width)

static bool js_gfx_GFXRect_set_width(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRect* cobj = (cocos2d::GFXRect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRect_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRect_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRect_set_width)

static bool js_gfx_GFXRect_get_height(se::State& s)
{
    cocos2d::GFXRect* cobj = (cocos2d::GFXRect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRect_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRect_get_height)

static bool js_gfx_GFXRect_set_height(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRect* cobj = (cocos2d::GFXRect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRect_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRect_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRect_set_height)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXRect_finalize)

static bool js_gfx_GFXRect_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXRect* cobj = JSB_ALLOC(cocos2d::GFXRect);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXRect* cobj = JSB_ALLOC(cocos2d::GFXRect);
        int arg0 = 0;
        json->getProperty("x", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (int)tmp; } while(false);
            cobj->x = arg0;
        }
        int arg1 = 0;
        json->getProperty("y", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (int)tmp; } while(false);
            cobj->y = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("width", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->width = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("height", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->height = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::GFXRect* cobj = JSB_ALLOC(cocos2d::GFXRect);
        int arg0 = 0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
            cobj->x = arg0;
        }
        int arg1 = 0;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
            cobj->y = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->width = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->height = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXRect_constructor, __jsb_cocos2d_GFXRect_class, js_cocos2d_GFXRect_finalize)




static bool js_cocos2d_GFXRect_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXRect)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXRect* cobj = (cocos2d::GFXRect*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXRect_finalize)

bool js_register_gfx_GFXRect(se::Object* obj)
{
    auto cls = se::Class::create("GFXRect", obj, nullptr, _SE(js_gfx_GFXRect_constructor));

    cls->defineProperty("x", _SE(js_gfx_GFXRect_get_x), _SE(js_gfx_GFXRect_set_x));
    cls->defineProperty("y", _SE(js_gfx_GFXRect_get_y), _SE(js_gfx_GFXRect_set_y));
    cls->defineProperty("width", _SE(js_gfx_GFXRect_get_width), _SE(js_gfx_GFXRect_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXRect_get_height), _SE(js_gfx_GFXRect_set_height));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXRect_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXRect>(cls);

    __jsb_cocos2d_GFXRect_proto = cls->getProto();
    __jsb_cocos2d_GFXRect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXExtent_proto = nullptr;
se::Class* __jsb_cocos2d_GFXExtent_class = nullptr;

static bool js_gfx_GFXExtent_get_width(se::State& s)
{
    cocos2d::GFXExtent* cobj = (cocos2d::GFXExtent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXExtent_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXExtent_get_width)

static bool js_gfx_GFXExtent_set_width(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXExtent* cobj = (cocos2d::GFXExtent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXExtent_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXExtent_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXExtent_set_width)

static bool js_gfx_GFXExtent_get_height(se::State& s)
{
    cocos2d::GFXExtent* cobj = (cocos2d::GFXExtent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXExtent_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXExtent_get_height)

static bool js_gfx_GFXExtent_set_height(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXExtent* cobj = (cocos2d::GFXExtent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXExtent_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXExtent_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXExtent_set_height)

static bool js_gfx_GFXExtent_get_depth(se::State& s)
{
    cocos2d::GFXExtent* cobj = (cocos2d::GFXExtent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXExtent_get_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->depth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXExtent_get_depth)

static bool js_gfx_GFXExtent_set_depth(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXExtent* cobj = (cocos2d::GFXExtent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXExtent_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXExtent_set_depth : Error processing new value");
    cobj->depth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXExtent_set_depth)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXExtent_finalize)

static bool js_gfx_GFXExtent_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXExtent* cobj = JSB_ALLOC(cocos2d::GFXExtent);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXExtent* cobj = JSB_ALLOC(cocos2d::GFXExtent);
        unsigned int arg0 = 0;
        json->getProperty("width", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->width = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("height", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->height = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("depth", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->depth = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXExtent* cobj = JSB_ALLOC(cocos2d::GFXExtent);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->width = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->height = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->depth = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXExtent_constructor, __jsb_cocos2d_GFXExtent_class, js_cocos2d_GFXExtent_finalize)




static bool js_cocos2d_GFXExtent_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXExtent)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXExtent* cobj = (cocos2d::GFXExtent*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXExtent_finalize)

bool js_register_gfx_GFXExtent(se::Object* obj)
{
    auto cls = se::Class::create("GFXExtent", obj, nullptr, _SE(js_gfx_GFXExtent_constructor));

    cls->defineProperty("width", _SE(js_gfx_GFXExtent_get_width), _SE(js_gfx_GFXExtent_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXExtent_get_height), _SE(js_gfx_GFXExtent_set_height));
    cls->defineProperty("depth", _SE(js_gfx_GFXExtent_get_depth), _SE(js_gfx_GFXExtent_set_depth));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXExtent_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXExtent>(cls);

    __jsb_cocos2d_GFXExtent_proto = cls->getProto();
    __jsb_cocos2d_GFXExtent_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXTextureSubres_proto = nullptr;
se::Class* __jsb_cocos2d_GFXTextureSubres_class = nullptr;

static bool js_gfx_GFXTextureSubres_get_baseMipLevel(se::State& s)
{
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_get_baseMipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->baseMipLevel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureSubres_get_baseMipLevel)

static bool js_gfx_GFXTextureSubres_set_baseMipLevel(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_baseMipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_baseMipLevel : Error processing new value");
    cobj->baseMipLevel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_baseMipLevel)

static bool js_gfx_GFXTextureSubres_get_levelCount(se::State& s)
{
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_get_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->levelCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureSubres_get_levelCount)

static bool js_gfx_GFXTextureSubres_set_levelCount(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_levelCount : Error processing new value");
    cobj->levelCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_levelCount)

static bool js_gfx_GFXTextureSubres_get_baseArrayLayer(se::State& s)
{
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_get_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->baseArrayLayer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureSubres_get_baseArrayLayer)

static bool js_gfx_GFXTextureSubres_set_baseArrayLayer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_baseArrayLayer : Error processing new value");
    cobj->baseArrayLayer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_baseArrayLayer)

static bool js_gfx_GFXTextureSubres_get_layerCount(se::State& s)
{
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->layerCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureSubres_get_layerCount)

static bool js_gfx_GFXTextureSubres_set_layerCount(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_layerCount : Error processing new value");
    cobj->layerCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_layerCount)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTextureSubres_finalize)

static bool js_gfx_GFXTextureSubres_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXTextureSubres* cobj = JSB_ALLOC(cocos2d::GFXTextureSubres);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXTextureSubres* cobj = JSB_ALLOC(cocos2d::GFXTextureSubres);
        unsigned int arg0 = 0;
        json->getProperty("baseMipLevel", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->baseMipLevel = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("levelCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->levelCount = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("baseArrayLayer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->baseArrayLayer = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("layerCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->layerCount = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::GFXTextureSubres* cobj = JSB_ALLOC(cocos2d::GFXTextureSubres);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->baseMipLevel = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->levelCount = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->baseArrayLayer = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->layerCount = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXTextureSubres_constructor, __jsb_cocos2d_GFXTextureSubres_class, js_cocos2d_GFXTextureSubres_finalize)




static bool js_cocos2d_GFXTextureSubres_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXTextureSubres)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXTextureSubres_finalize)

bool js_register_gfx_GFXTextureSubres(se::Object* obj)
{
    auto cls = se::Class::create("GFXTextureSubres", obj, nullptr, _SE(js_gfx_GFXTextureSubres_constructor));

    cls->defineProperty("baseMipLevel", _SE(js_gfx_GFXTextureSubres_get_baseMipLevel), _SE(js_gfx_GFXTextureSubres_set_baseMipLevel));
    cls->defineProperty("levelCount", _SE(js_gfx_GFXTextureSubres_get_levelCount), _SE(js_gfx_GFXTextureSubres_set_levelCount));
    cls->defineProperty("baseArrayLayer", _SE(js_gfx_GFXTextureSubres_get_baseArrayLayer), _SE(js_gfx_GFXTextureSubres_set_baseArrayLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_GFXTextureSubres_get_layerCount), _SE(js_gfx_GFXTextureSubres_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXTextureSubres_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXTextureSubres>(cls);

    __jsb_cocos2d_GFXTextureSubres_proto = cls->getProto();
    __jsb_cocos2d_GFXTextureSubres_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXTextureCopy_proto = nullptr;
se::Class* __jsb_cocos2d_GFXTextureCopy_class = nullptr;

static bool js_gfx_GFXTextureCopy_get_srcSubres(se::State& s)
{
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_get_srcSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->srcSubres, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureCopy_get_srcSubres)

static bool js_gfx_GFXTextureCopy_set_srcSubres(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_srcSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_srcSubres : Error processing new value");
    cobj->srcSubres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_srcSubres)

static bool js_gfx_GFXTextureCopy_get_srcOffset(se::State& s)
{
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_get_srcOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->srcOffset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureCopy_get_srcOffset)

static bool js_gfx_GFXTextureCopy_set_srcOffset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_srcOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXOffset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_srcOffset : Error processing new value");
    cobj->srcOffset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_srcOffset)

static bool js_gfx_GFXTextureCopy_get_dstSubres(se::State& s)
{
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_get_dstSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->dstSubres, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureCopy_get_dstSubres)

static bool js_gfx_GFXTextureCopy_set_dstSubres(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_dstSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_dstSubres : Error processing new value");
    cobj->dstSubres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_dstSubres)

static bool js_gfx_GFXTextureCopy_get_dstOffset(se::State& s)
{
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_get_dstOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->dstOffset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureCopy_get_dstOffset)

static bool js_gfx_GFXTextureCopy_set_dstOffset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_dstOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXOffset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_dstOffset : Error processing new value");
    cobj->dstOffset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_dstOffset)

static bool js_gfx_GFXTextureCopy_get_extent(se::State& s)
{
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_get_extent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->extent, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureCopy_get_extent)

static bool js_gfx_GFXTextureCopy_set_extent(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_extent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXExtent* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_extent : Error processing new value");
    cobj->extent = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_extent)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTextureCopy_finalize)

static bool js_gfx_GFXTextureCopy_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXTextureCopy* cobj = JSB_ALLOC(cocos2d::GFXTextureCopy);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXTextureCopy* cobj = JSB_ALLOC(cocos2d::GFXTextureCopy);
        cocos2d::GFXTextureSubres* arg0 = nullptr;
        json->getProperty("srcSubres", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg0);
            cobj->srcSubres = *arg0;
        }
        cocos2d::GFXOffset* arg1 = nullptr;
        json->getProperty("srcOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg1);
            cobj->srcOffset = *arg1;
        }
        cocos2d::GFXTextureSubres* arg2 = nullptr;
        json->getProperty("dstSubres", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->dstSubres = *arg2;
        }
        cocos2d::GFXOffset* arg3 = nullptr;
        json->getProperty("dstOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->dstOffset = *arg3;
        }
        cocos2d::GFXExtent* arg4 = nullptr;
        json->getProperty("extent", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg4);
            cobj->extent = *arg4;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 5)
    {
        cocos2d::GFXTextureCopy* cobj = JSB_ALLOC(cocos2d::GFXTextureCopy);
        cocos2d::GFXTextureSubres* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_reference(args[0], &arg0);
            cobj->srcSubres = *arg0;
        }
        cocos2d::GFXOffset* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_reference(args[1], &arg1);
            cobj->srcOffset = *arg1;
        }
        cocos2d::GFXTextureSubres* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->dstSubres = *arg2;
        }
        cocos2d::GFXOffset* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_reference(args[3], &arg3);
            cobj->dstOffset = *arg3;
        }
        cocos2d::GFXExtent* arg4 = nullptr;
        if (!args[4].isUndefined()) {
            ok &= seval_to_reference(args[4], &arg4);
            cobj->extent = *arg4;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXTextureCopy_constructor, __jsb_cocos2d_GFXTextureCopy_class, js_cocos2d_GFXTextureCopy_finalize)




static bool js_cocos2d_GFXTextureCopy_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXTextureCopy)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXTextureCopy_finalize)

bool js_register_gfx_GFXTextureCopy(se::Object* obj)
{
    auto cls = se::Class::create("GFXTextureCopy", obj, nullptr, _SE(js_gfx_GFXTextureCopy_constructor));

    cls->defineProperty("srcSubres", _SE(js_gfx_GFXTextureCopy_get_srcSubres), _SE(js_gfx_GFXTextureCopy_set_srcSubres));
    cls->defineProperty("srcOffset", _SE(js_gfx_GFXTextureCopy_get_srcOffset), _SE(js_gfx_GFXTextureCopy_set_srcOffset));
    cls->defineProperty("dstSubres", _SE(js_gfx_GFXTextureCopy_get_dstSubres), _SE(js_gfx_GFXTextureCopy_set_dstSubres));
    cls->defineProperty("dstOffset", _SE(js_gfx_GFXTextureCopy_get_dstOffset), _SE(js_gfx_GFXTextureCopy_set_dstOffset));
    cls->defineProperty("extent", _SE(js_gfx_GFXTextureCopy_get_extent), _SE(js_gfx_GFXTextureCopy_set_extent));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXTextureCopy_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXTextureCopy>(cls);

    __jsb_cocos2d_GFXTextureCopy_proto = cls->getProto();
    __jsb_cocos2d_GFXTextureCopy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBufferTextureCopy_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBufferTextureCopy_class = nullptr;

static bool js_gfx_GFXBufferTextureCopy_get_buffOffset(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_buffOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->buffOffset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_buffOffset)

static bool js_gfx_GFXBufferTextureCopy_set_buffOffset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_buffOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_buffOffset : Error processing new value");
    cobj->buffOffset = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_buffOffset)

static bool js_gfx_GFXBufferTextureCopy_get_buffStride(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_buffStride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->buffStride, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_buffStride)

static bool js_gfx_GFXBufferTextureCopy_set_buffStride(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_buffStride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_buffStride : Error processing new value");
    cobj->buffStride = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_buffStride)

static bool js_gfx_GFXBufferTextureCopy_get_buffTexHeight(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_buffTexHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->buffTexHeight, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_buffTexHeight)

static bool js_gfx_GFXBufferTextureCopy_set_buffTexHeight(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_buffTexHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_buffTexHeight : Error processing new value");
    cobj->buffTexHeight = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_buffTexHeight)

static bool js_gfx_GFXBufferTextureCopy_get_texOffset(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_texOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texOffset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_texOffset)

static bool js_gfx_GFXBufferTextureCopy_set_texOffset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_texOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXOffset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_texOffset : Error processing new value");
    cobj->texOffset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_texOffset)

static bool js_gfx_GFXBufferTextureCopy_get_texExtent(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_texExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texExtent, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_texExtent)

static bool js_gfx_GFXBufferTextureCopy_set_texExtent(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_texExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXExtent* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_texExtent : Error processing new value");
    cobj->texExtent = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_texExtent)

static bool js_gfx_GFXBufferTextureCopy_get_texSubres(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_texSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texSubres, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_texSubres)

static bool js_gfx_GFXBufferTextureCopy_set_texSubres(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_texSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_texSubres : Error processing new value");
    cobj->texSubres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_texSubres)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBufferTextureCopy_finalize)

static bool js_gfx_GFXBufferTextureCopy_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXBufferTextureCopy* cobj = JSB_ALLOC(cocos2d::GFXBufferTextureCopy);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXBufferTextureCopy* cobj = JSB_ALLOC(cocos2d::GFXBufferTextureCopy);
        unsigned int arg0 = 0;
        json->getProperty("buffOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->buffOffset = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("buffStride", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->buffStride = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("buffTexHeight", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->buffTexHeight = arg2;
        }
        cocos2d::GFXOffset* arg3 = nullptr;
        json->getProperty("texOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->texOffset = *arg3;
        }
        cocos2d::GFXExtent* arg4 = nullptr;
        json->getProperty("texExtent", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg4);
            cobj->texExtent = *arg4;
        }
        cocos2d::GFXTextureSubres* arg5 = nullptr;
        json->getProperty("texSubres", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg5);
            cobj->texSubres = *arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        cocos2d::GFXBufferTextureCopy* cobj = JSB_ALLOC(cocos2d::GFXBufferTextureCopy);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->buffOffset = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->buffStride = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->buffTexHeight = arg2;
        }
        cocos2d::GFXOffset* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_reference(args[3], &arg3);
            cobj->texOffset = *arg3;
        }
        cocos2d::GFXExtent* arg4 = nullptr;
        if (!args[4].isUndefined()) {
            ok &= seval_to_reference(args[4], &arg4);
            cobj->texExtent = *arg4;
        }
        cocos2d::GFXTextureSubres* arg5 = nullptr;
        if (!args[5].isUndefined()) {
            ok &= seval_to_reference(args[5], &arg5);
            cobj->texSubres = *arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBufferTextureCopy_constructor, __jsb_cocos2d_GFXBufferTextureCopy_class, js_cocos2d_GFXBufferTextureCopy_finalize)




static bool js_cocos2d_GFXBufferTextureCopy_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBufferTextureCopy)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBufferTextureCopy_finalize)

bool js_register_gfx_GFXBufferTextureCopy(se::Object* obj)
{
    auto cls = se::Class::create("GFXBufferTextureCopy", obj, nullptr, _SE(js_gfx_GFXBufferTextureCopy_constructor));

    cls->defineProperty("buffOffset", _SE(js_gfx_GFXBufferTextureCopy_get_buffOffset), _SE(js_gfx_GFXBufferTextureCopy_set_buffOffset));
    cls->defineProperty("buffStride", _SE(js_gfx_GFXBufferTextureCopy_get_buffStride), _SE(js_gfx_GFXBufferTextureCopy_set_buffStride));
    cls->defineProperty("buffTexHeight", _SE(js_gfx_GFXBufferTextureCopy_get_buffTexHeight), _SE(js_gfx_GFXBufferTextureCopy_set_buffTexHeight));
    cls->defineProperty("texOffset", _SE(js_gfx_GFXBufferTextureCopy_get_texOffset), _SE(js_gfx_GFXBufferTextureCopy_set_texOffset));
    cls->defineProperty("texExtent", _SE(js_gfx_GFXBufferTextureCopy_get_texExtent), _SE(js_gfx_GFXBufferTextureCopy_set_texExtent));
    cls->defineProperty("texSubres", _SE(js_gfx_GFXBufferTextureCopy_get_texSubres), _SE(js_gfx_GFXBufferTextureCopy_set_texSubres));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBufferTextureCopy_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBufferTextureCopy>(cls);

    __jsb_cocos2d_GFXBufferTextureCopy_proto = cls->getProto();
    __jsb_cocos2d_GFXBufferTextureCopy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXViewport_proto = nullptr;
se::Class* __jsb_cocos2d_GFXViewport_class = nullptr;

static bool js_gfx_GFXViewport_get_left(se::State& s)
{
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_get_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->left, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXViewport_get_left)

static bool js_gfx_GFXViewport_set_left(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_set_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXViewport_set_left : Error processing new value");
    cobj->left = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXViewport_set_left)

static bool js_gfx_GFXViewport_get_top(se::State& s)
{
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_get_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->top, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXViewport_get_top)

static bool js_gfx_GFXViewport_set_top(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_set_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXViewport_set_top : Error processing new value");
    cobj->top = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXViewport_set_top)

static bool js_gfx_GFXViewport_get_width(se::State& s)
{
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXViewport_get_width)

static bool js_gfx_GFXViewport_set_width(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXViewport_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXViewport_set_width)

static bool js_gfx_GFXViewport_get_height(se::State& s)
{
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXViewport_get_height)

static bool js_gfx_GFXViewport_set_height(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXViewport_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXViewport_set_height)

static bool js_gfx_GFXViewport_get_minDepth(se::State& s)
{
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_get_minDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->minDepth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXViewport_get_minDepth)

static bool js_gfx_GFXViewport_set_minDepth(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_set_minDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXViewport_set_minDepth : Error processing new value");
    cobj->minDepth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXViewport_set_minDepth)

static bool js_gfx_GFXViewport_get_maxDepth(se::State& s)
{
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_get_maxDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->maxDepth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXViewport_get_maxDepth)

static bool js_gfx_GFXViewport_set_maxDepth(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_set_maxDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXViewport_set_maxDepth : Error processing new value");
    cobj->maxDepth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXViewport_set_maxDepth)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXViewport_finalize)

static bool js_gfx_GFXViewport_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXViewport* cobj = JSB_ALLOC(cocos2d::GFXViewport);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXViewport* cobj = JSB_ALLOC(cocos2d::GFXViewport);
        int arg0 = 0;
        json->getProperty("left", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (int)tmp; } while(false);
            cobj->left = arg0;
        }
        int arg1 = 0;
        json->getProperty("top", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (int)tmp; } while(false);
            cobj->top = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("width", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->width = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("height", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->height = arg3;
        }
        float arg4 = 0;
        json->getProperty("minDepth", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg4);
            cobj->minDepth = arg4;
        }
        float arg5 = 0;
        json->getProperty("maxDepth", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg5);
            cobj->maxDepth = arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        cocos2d::GFXViewport* cobj = JSB_ALLOC(cocos2d::GFXViewport);
        int arg0 = 0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
            cobj->left = arg0;
        }
        int arg1 = 0;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
            cobj->top = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->width = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->height = arg3;
        }
        float arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_float(args[4], &arg4);
            cobj->minDepth = arg4;
        }
        float arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_float(args[5], &arg5);
            cobj->maxDepth = arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXViewport_constructor, __jsb_cocos2d_GFXViewport_class, js_cocos2d_GFXViewport_finalize)




static bool js_cocos2d_GFXViewport_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXViewport)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXViewport* cobj = (cocos2d::GFXViewport*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXViewport_finalize)

bool js_register_gfx_GFXViewport(se::Object* obj)
{
    auto cls = se::Class::create("GFXViewport", obj, nullptr, _SE(js_gfx_GFXViewport_constructor));

    cls->defineProperty("left", _SE(js_gfx_GFXViewport_get_left), _SE(js_gfx_GFXViewport_set_left));
    cls->defineProperty("top", _SE(js_gfx_GFXViewport_get_top), _SE(js_gfx_GFXViewport_set_top));
    cls->defineProperty("width", _SE(js_gfx_GFXViewport_get_width), _SE(js_gfx_GFXViewport_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXViewport_get_height), _SE(js_gfx_GFXViewport_set_height));
    cls->defineProperty("minDepth", _SE(js_gfx_GFXViewport_get_minDepth), _SE(js_gfx_GFXViewport_set_minDepth));
    cls->defineProperty("maxDepth", _SE(js_gfx_GFXViewport_get_maxDepth), _SE(js_gfx_GFXViewport_set_maxDepth));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXViewport_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXViewport>(cls);

    __jsb_cocos2d_GFXViewport_proto = cls->getProto();
    __jsb_cocos2d_GFXViewport_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXColor_proto = nullptr;
se::Class* __jsb_cocos2d_GFXColor_class = nullptr;

static bool js_gfx_GFXColor_get_r(se::State& s)
{
    cocos2d::GFXColor* cobj = (cocos2d::GFXColor*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColor_get_r : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->r, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColor_get_r)

static bool js_gfx_GFXColor_set_r(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColor* cobj = (cocos2d::GFXColor*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColor_set_r : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColor_set_r : Error processing new value");
    cobj->r = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColor_set_r)

static bool js_gfx_GFXColor_get_g(se::State& s)
{
    cocos2d::GFXColor* cobj = (cocos2d::GFXColor*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColor_get_g : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->g, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColor_get_g)

static bool js_gfx_GFXColor_set_g(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColor* cobj = (cocos2d::GFXColor*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColor_set_g : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColor_set_g : Error processing new value");
    cobj->g = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColor_set_g)

static bool js_gfx_GFXColor_get_b(se::State& s)
{
    cocos2d::GFXColor* cobj = (cocos2d::GFXColor*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColor_get_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->b, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColor_get_b)

static bool js_gfx_GFXColor_set_b(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColor* cobj = (cocos2d::GFXColor*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColor_set_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColor_set_b : Error processing new value");
    cobj->b = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColor_set_b)

static bool js_gfx_GFXColor_get_a(se::State& s)
{
    cocos2d::GFXColor* cobj = (cocos2d::GFXColor*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColor_get_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->a, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColor_get_a)

static bool js_gfx_GFXColor_set_a(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColor* cobj = (cocos2d::GFXColor*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColor_set_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColor_set_a : Error processing new value");
    cobj->a = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColor_set_a)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXColor_finalize)

static bool js_gfx_GFXColor_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXColor* cobj = JSB_ALLOC(cocos2d::GFXColor);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXColor* cobj = JSB_ALLOC(cocos2d::GFXColor);
        float arg0 = 0;
        json->getProperty("r", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg0);
            cobj->r = arg0;
        }
        float arg1 = 0;
        json->getProperty("g", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg1);
            cobj->g = arg1;
        }
        float arg2 = 0;
        json->getProperty("b", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg2);
            cobj->b = arg2;
        }
        float arg3 = 0;
        json->getProperty("a", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg3);
            cobj->a = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::GFXColor* cobj = JSB_ALLOC(cocos2d::GFXColor);
        float arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_float(args[0], &arg0);
            cobj->r = arg0;
        }
        float arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_float(args[1], &arg1);
            cobj->g = arg1;
        }
        float arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_float(args[2], &arg2);
            cobj->b = arg2;
        }
        float arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_float(args[3], &arg3);
            cobj->a = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXColor_constructor, __jsb_cocos2d_GFXColor_class, js_cocos2d_GFXColor_finalize)




static bool js_cocos2d_GFXColor_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXColor)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXColor* cobj = (cocos2d::GFXColor*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXColor_finalize)

bool js_register_gfx_GFXColor(se::Object* obj)
{
    auto cls = se::Class::create("GFXColor", obj, nullptr, _SE(js_gfx_GFXColor_constructor));

    cls->defineProperty("r", _SE(js_gfx_GFXColor_get_r), _SE(js_gfx_GFXColor_set_r));
    cls->defineProperty("g", _SE(js_gfx_GFXColor_get_g), _SE(js_gfx_GFXColor_set_g));
    cls->defineProperty("b", _SE(js_gfx_GFXColor_get_b), _SE(js_gfx_GFXColor_set_b));
    cls->defineProperty("a", _SE(js_gfx_GFXColor_get_a), _SE(js_gfx_GFXColor_set_a));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXColor_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXColor>(cls);

    __jsb_cocos2d_GFXColor_proto = cls->getProto();
    __jsb_cocos2d_GFXColor_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXDeviceInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXDeviceInfo_class = nullptr;

static bool js_gfx_GFXDeviceInfo_get_windowHandle(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->windowHandle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_windowHandle)

static bool js_gfx_GFXDeviceInfo_set_windowHandle(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    intptr_t arg0 = 0;
    ok &= seval_to_intptr_t(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_windowHandle : Error processing new value");
    cobj->windowHandle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_windowHandle)

static bool js_gfx_GFXDeviceInfo_get_width(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_width)

static bool js_gfx_GFXDeviceInfo_set_width(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_width)

static bool js_gfx_GFXDeviceInfo_get_height(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_height)

static bool js_gfx_GFXDeviceInfo_set_height(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_height)

static bool js_gfx_GFXDeviceInfo_get_nativeWidth(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_nativeWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->nativeWidth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_nativeWidth)

static bool js_gfx_GFXDeviceInfo_set_nativeWidth(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_nativeWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_nativeWidth : Error processing new value");
    cobj->nativeWidth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_nativeWidth)

static bool js_gfx_GFXDeviceInfo_get_nativeHeight(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_nativeHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->nativeHeight, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_nativeHeight)

static bool js_gfx_GFXDeviceInfo_set_nativeHeight(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_nativeHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_nativeHeight : Error processing new value");
    cobj->nativeHeight = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_nativeHeight)

static bool js_gfx_GFXDeviceInfo_get_sharedCtx(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->sharedCtx, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_sharedCtx)

static bool js_gfx_GFXDeviceInfo_set_sharedCtx(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXContext* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_sharedCtx : Error processing new value");
    cobj->sharedCtx = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_sharedCtx)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXDeviceInfo_finalize)

static bool js_gfx_GFXDeviceInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXDeviceInfo* cobj = JSB_ALLOC(cocos2d::GFXDeviceInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXDeviceInfo* cobj = JSB_ALLOC(cocos2d::GFXDeviceInfo);
        intptr_t arg0 = 0;
        json->getProperty("windowHandle", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_intptr_t(field, &arg0);
            cobj->windowHandle = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("width", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->width = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("height", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->height = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("nativeWidth", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->nativeWidth = arg3;
        }
        unsigned int arg4 = 0;
        json->getProperty("nativeHeight", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg4);
            cobj->nativeHeight = arg4;
        }
        cocos2d::GFXContext* arg5 = nullptr;
        json->getProperty("sharedCtx", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg5);
            cobj->sharedCtx = arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        cocos2d::GFXDeviceInfo* cobj = JSB_ALLOC(cocos2d::GFXDeviceInfo);
        intptr_t arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_intptr_t(args[0], &arg0);
            cobj->windowHandle = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->width = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->height = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->nativeWidth = arg3;
        }
        unsigned int arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->nativeHeight = arg4;
        }
        cocos2d::GFXContext* arg5 = nullptr;
        if (!args[5].isUndefined()) {
            ok &= seval_to_native_ptr(args[5], &arg5);
            cobj->sharedCtx = arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXDeviceInfo_constructor, __jsb_cocos2d_GFXDeviceInfo_class, js_cocos2d_GFXDeviceInfo_finalize)




static bool js_cocos2d_GFXDeviceInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXDeviceInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXDeviceInfo_finalize)

bool js_register_gfx_GFXDeviceInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXDeviceInfo", obj, nullptr, _SE(js_gfx_GFXDeviceInfo_constructor));

    cls->defineProperty("windowHandle", _SE(js_gfx_GFXDeviceInfo_get_windowHandle), _SE(js_gfx_GFXDeviceInfo_set_windowHandle));
    cls->defineProperty("width", _SE(js_gfx_GFXDeviceInfo_get_width), _SE(js_gfx_GFXDeviceInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXDeviceInfo_get_height), _SE(js_gfx_GFXDeviceInfo_set_height));
    cls->defineProperty("nativeWidth", _SE(js_gfx_GFXDeviceInfo_get_nativeWidth), _SE(js_gfx_GFXDeviceInfo_set_nativeWidth));
    cls->defineProperty("nativeHeight", _SE(js_gfx_GFXDeviceInfo_get_nativeHeight), _SE(js_gfx_GFXDeviceInfo_set_nativeHeight));
    cls->defineProperty("sharedCtx", _SE(js_gfx_GFXDeviceInfo_get_sharedCtx), _SE(js_gfx_GFXDeviceInfo_set_sharedCtx));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXDeviceInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXDeviceInfo>(cls);

    __jsb_cocos2d_GFXDeviceInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXDeviceInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXWindowInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXWindowInfo_class = nullptr;

static bool js_gfx_GFXWindowInfo_get_title(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_title : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->title);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_title)

static bool js_gfx_GFXWindowInfo_set_title(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_title : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_title : Error processing new value");
    cobj->title = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_title)

static bool js_gfx_GFXWindowInfo_get_left(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->left, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_left)

static bool js_gfx_GFXWindowInfo_set_left(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_left : Error processing new value");
    cobj->left = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_left)

static bool js_gfx_GFXWindowInfo_get_top(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->top, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_top)

static bool js_gfx_GFXWindowInfo_set_top(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_top : Error processing new value");
    cobj->top = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_top)

static bool js_gfx_GFXWindowInfo_get_width(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_width)

static bool js_gfx_GFXWindowInfo_set_width(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_width)

static bool js_gfx_GFXWindowInfo_get_height(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_height)

static bool js_gfx_GFXWindowInfo_set_height(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_height)

static bool js_gfx_GFXWindowInfo_get_colorFmt(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_colorFmt : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->colorFmt, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_colorFmt)

static bool js_gfx_GFXWindowInfo_set_colorFmt(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_colorFmt : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_colorFmt : Error processing new value");
    cobj->colorFmt = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_colorFmt)

static bool js_gfx_GFXWindowInfo_get_depthStencilFmt(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_depthStencilFmt : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depthStencilFmt, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_depthStencilFmt)

static bool js_gfx_GFXWindowInfo_set_depthStencilFmt(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_depthStencilFmt : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_depthStencilFmt : Error processing new value");
    cobj->depthStencilFmt = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_depthStencilFmt)

static bool js_gfx_GFXWindowInfo_get_isOffscreen(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_isOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isOffscreen, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_isOffscreen)

static bool js_gfx_GFXWindowInfo_set_isOffscreen(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_isOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_isOffscreen : Error processing new value");
    cobj->isOffscreen = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_isOffscreen)

static bool js_gfx_GFXWindowInfo_get_isFullscreen(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_isFullscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isFullscreen, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_isFullscreen)

static bool js_gfx_GFXWindowInfo_set_isFullscreen(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_isFullscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_isFullscreen : Error processing new value");
    cobj->isFullscreen = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_isFullscreen)

static bool js_gfx_GFXWindowInfo_get_vsyncMode(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->vsyncMode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_vsyncMode)

static bool js_gfx_GFXWindowInfo_set_vsyncMode(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXVsyncMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXVsyncMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_vsyncMode : Error processing new value");
    cobj->vsyncMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_vsyncMode)

static bool js_gfx_GFXWindowInfo_get_windowHandle(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->windowHandle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_windowHandle)

static bool js_gfx_GFXWindowInfo_set_windowHandle(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    intptr_t arg0 = 0;
    ok &= seval_to_intptr_t(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_windowHandle : Error processing new value");
    cobj->windowHandle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_windowHandle)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXWindowInfo_finalize)

static bool js_gfx_GFXWindowInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXWindowInfo* cobj = JSB_ALLOC(cocos2d::GFXWindowInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXWindowInfo* cobj = JSB_ALLOC(cocos2d::GFXWindowInfo);
        cocos2d::String arg0;
        json->getProperty("title", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->title = arg0;
        }
        int arg1 = 0;
        json->getProperty("left", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (int)tmp; } while(false);
            cobj->left = arg1;
        }
        int arg2 = 0;
        json->getProperty("top", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (int)tmp; } while(false);
            cobj->top = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("width", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->width = arg3;
        }
        unsigned int arg4 = 0;
        json->getProperty("height", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg4);
            cobj->height = arg4;
        }
        cocos2d::GFXFormat arg5;
        json->getProperty("colorFmt", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->colorFmt = arg5;
        }
        cocos2d::GFXFormat arg6;
        json->getProperty("depthStencilFmt", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->depthStencilFmt = arg6;
        }
        bool arg7;
        json->getProperty("isOffscreen", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg7);
            cobj->isOffscreen = arg7;
        }
        bool arg8;
        json->getProperty("isFullscreen", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg8);
            cobj->isFullscreen = arg8;
        }
        cocos2d::GFXVsyncMode arg9;
        json->getProperty("vsyncMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cocos2d::GFXVsyncMode)tmp; } while(false);
            cobj->vsyncMode = arg9;
        }
        intptr_t arg10 = 0;
        json->getProperty("windowHandle", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_intptr_t(field, &arg10);
            cobj->windowHandle = arg10;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 11)
    {
        cocos2d::GFXWindowInfo* cobj = JSB_ALLOC(cocos2d::GFXWindowInfo);
        cocos2d::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->title = arg0;
        }
        int arg1 = 0;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
            cobj->left = arg1;
        }
        int arg2 = 0;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
            cobj->top = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->width = arg3;
        }
        unsigned int arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->height = arg4;
        }
        cocos2d::GFXFormat arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->colorFmt = arg5;
        }
        cocos2d::GFXFormat arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->depthStencilFmt = arg6;
        }
        bool arg7;
        if (!args[7].isUndefined()) {
            ok &= seval_to_boolean(args[7], &arg7);
            cobj->isOffscreen = arg7;
        }
        bool arg8;
        if (!args[8].isUndefined()) {
            ok &= seval_to_boolean(args[8], &arg8);
            cobj->isFullscreen = arg8;
        }
        cocos2d::GFXVsyncMode arg9;
        if (!args[9].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cocos2d::GFXVsyncMode)tmp; } while(false);
            cobj->vsyncMode = arg9;
        }
        intptr_t arg10 = 0;
        if (!args[10].isUndefined()) {
            ok &= seval_to_intptr_t(args[10], &arg10);
            cobj->windowHandle = arg10;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXWindowInfo_constructor, __jsb_cocos2d_GFXWindowInfo_class, js_cocos2d_GFXWindowInfo_finalize)




static bool js_cocos2d_GFXWindowInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXWindowInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXWindowInfo_finalize)

bool js_register_gfx_GFXWindowInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXWindowInfo", obj, nullptr, _SE(js_gfx_GFXWindowInfo_constructor));

    cls->defineProperty("title", _SE(js_gfx_GFXWindowInfo_get_title), _SE(js_gfx_GFXWindowInfo_set_title));
    cls->defineProperty("left", _SE(js_gfx_GFXWindowInfo_get_left), _SE(js_gfx_GFXWindowInfo_set_left));
    cls->defineProperty("top", _SE(js_gfx_GFXWindowInfo_get_top), _SE(js_gfx_GFXWindowInfo_set_top));
    cls->defineProperty("width", _SE(js_gfx_GFXWindowInfo_get_width), _SE(js_gfx_GFXWindowInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXWindowInfo_get_height), _SE(js_gfx_GFXWindowInfo_set_height));
    cls->defineProperty("colorFmt", _SE(js_gfx_GFXWindowInfo_get_colorFmt), _SE(js_gfx_GFXWindowInfo_set_colorFmt));
    cls->defineProperty("depthStencilFmt", _SE(js_gfx_GFXWindowInfo_get_depthStencilFmt), _SE(js_gfx_GFXWindowInfo_set_depthStencilFmt));
    cls->defineProperty("isOffscreen", _SE(js_gfx_GFXWindowInfo_get_isOffscreen), _SE(js_gfx_GFXWindowInfo_set_isOffscreen));
    cls->defineProperty("isFullscreen", _SE(js_gfx_GFXWindowInfo_get_isFullscreen), _SE(js_gfx_GFXWindowInfo_set_isFullscreen));
    cls->defineProperty("vsyncMode", _SE(js_gfx_GFXWindowInfo_get_vsyncMode), _SE(js_gfx_GFXWindowInfo_set_vsyncMode));
    cls->defineProperty("windowHandle", _SE(js_gfx_GFXWindowInfo_get_windowHandle), _SE(js_gfx_GFXWindowInfo_set_windowHandle));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXWindowInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXWindowInfo>(cls);

    __jsb_cocos2d_GFXWindowInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXWindowInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXContextInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXContextInfo_class = nullptr;

static bool js_gfx_GFXContextInfo_get_windowHandle(se::State& s)
{
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->windowHandle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXContextInfo_get_windowHandle)

static bool js_gfx_GFXContextInfo_set_windowHandle(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    intptr_t arg0 = 0;
    ok &= seval_to_intptr_t(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContextInfo_set_windowHandle : Error processing new value");
    cobj->windowHandle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXContextInfo_set_windowHandle)

static bool js_gfx_GFXContextInfo_get_sharedCtx(se::State& s)
{
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_get_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->sharedCtx, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXContextInfo_get_sharedCtx)

static bool js_gfx_GFXContextInfo_set_sharedCtx(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_set_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXContext* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContextInfo_set_sharedCtx : Error processing new value");
    cobj->sharedCtx = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXContextInfo_set_sharedCtx)

static bool js_gfx_GFXContextInfo_get_vsyncMode(se::State& s)
{
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_get_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->vsyncMode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXContextInfo_get_vsyncMode)

static bool js_gfx_GFXContextInfo_set_vsyncMode(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_set_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXVsyncMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXVsyncMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContextInfo_set_vsyncMode : Error processing new value");
    cobj->vsyncMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXContextInfo_set_vsyncMode)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXContextInfo_finalize)

static bool js_gfx_GFXContextInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXContextInfo* cobj = JSB_ALLOC(cocos2d::GFXContextInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXContextInfo* cobj = JSB_ALLOC(cocos2d::GFXContextInfo);
        intptr_t arg0 = 0;
        json->getProperty("windowHandle", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_intptr_t(field, &arg0);
            cobj->windowHandle = arg0;
        }
        cocos2d::GFXContext* arg1 = nullptr;
        json->getProperty("sharedCtx", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg1);
            cobj->sharedCtx = arg1;
        }
        cocos2d::GFXVsyncMode arg2;
        json->getProperty("vsyncMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXVsyncMode)tmp; } while(false);
            cobj->vsyncMode = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXContextInfo* cobj = JSB_ALLOC(cocos2d::GFXContextInfo);
        intptr_t arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_intptr_t(args[0], &arg0);
            cobj->windowHandle = arg0;
        }
        cocos2d::GFXContext* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_native_ptr(args[1], &arg1);
            cobj->sharedCtx = arg1;
        }
        cocos2d::GFXVsyncMode arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXVsyncMode)tmp; } while(false);
            cobj->vsyncMode = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXContextInfo_constructor, __jsb_cocos2d_GFXContextInfo_class, js_cocos2d_GFXContextInfo_finalize)




static bool js_cocos2d_GFXContextInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXContextInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXContextInfo_finalize)

bool js_register_gfx_GFXContextInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXContextInfo", obj, nullptr, _SE(js_gfx_GFXContextInfo_constructor));

    cls->defineProperty("windowHandle", _SE(js_gfx_GFXContextInfo_get_windowHandle), _SE(js_gfx_GFXContextInfo_set_windowHandle));
    cls->defineProperty("sharedCtx", _SE(js_gfx_GFXContextInfo_get_sharedCtx), _SE(js_gfx_GFXContextInfo_set_sharedCtx));
    cls->defineProperty("vsyncMode", _SE(js_gfx_GFXContextInfo_get_vsyncMode), _SE(js_gfx_GFXContextInfo_set_vsyncMode));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXContextInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXContextInfo>(cls);

    __jsb_cocos2d_GFXContextInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXContextInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBufferInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBufferInfo_class = nullptr;

static bool js_gfx_GFXBufferInfo_get_usage(se::State& s)
{
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_get_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->usage, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferInfo_get_usage)

static bool js_gfx_GFXBufferInfo_set_usage(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBufferUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBufferUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferInfo_set_usage : Error processing new value");
    cobj->usage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferInfo_set_usage)

static bool js_gfx_GFXBufferInfo_get_memUsage(se::State& s)
{
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_get_memUsage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->memUsage, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferInfo_get_memUsage)

static bool js_gfx_GFXBufferInfo_set_memUsage(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_set_memUsage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXMemoryUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXMemoryUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferInfo_set_memUsage : Error processing new value");
    cobj->memUsage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferInfo_set_memUsage)

static bool js_gfx_GFXBufferInfo_get_stride(se::State& s)
{
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_get_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stride, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferInfo_get_stride)

static bool js_gfx_GFXBufferInfo_set_stride(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_set_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferInfo_set_stride : Error processing new value");
    cobj->stride = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferInfo_set_stride)

static bool js_gfx_GFXBufferInfo_get_size(se::State& s)
{
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_get_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->size, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferInfo_get_size)

static bool js_gfx_GFXBufferInfo_set_size(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_set_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferInfo_set_size : Error processing new value");
    cobj->size = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferInfo_set_size)

static bool js_gfx_GFXBufferInfo_get_flags(se::State& s)
{
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_get_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->flags, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferInfo_get_flags)

static bool js_gfx_GFXBufferInfo_set_flags(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBufferFlagBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBufferFlagBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferInfo_set_flags : Error processing new value");
    cobj->flags = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferInfo_set_flags)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBufferInfo_finalize)

static bool js_gfx_GFXBufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXBufferInfo* cobj = JSB_ALLOC(cocos2d::GFXBufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXBufferInfo* cobj = JSB_ALLOC(cocos2d::GFXBufferInfo);
        cocos2d::GFXBufferUsageBit arg0;
        json->getProperty("usage", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXBufferUsageBit)tmp; } while(false);
            cobj->usage = arg0;
        }
        cocos2d::GFXMemoryUsageBit arg1;
        json->getProperty("memUsage", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXMemoryUsageBit)tmp; } while(false);
            cobj->memUsage = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("stride", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->stride = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("size", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->size = arg3;
        }
        cocos2d::GFXBufferFlagBit arg4;
        json->getProperty("flags", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXBufferFlagBit)tmp; } while(false);
            cobj->flags = arg4;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 5)
    {
        cocos2d::GFXBufferInfo* cobj = JSB_ALLOC(cocos2d::GFXBufferInfo);
        cocos2d::GFXBufferUsageBit arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBufferUsageBit)tmp; } while(false);
            cobj->usage = arg0;
        }
        cocos2d::GFXMemoryUsageBit arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXMemoryUsageBit)tmp; } while(false);
            cobj->memUsage = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->stride = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->size = arg3;
        }
        cocos2d::GFXBufferFlagBit arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXBufferFlagBit)tmp; } while(false);
            cobj->flags = arg4;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBufferInfo_constructor, __jsb_cocos2d_GFXBufferInfo_class, js_cocos2d_GFXBufferInfo_finalize)




static bool js_cocos2d_GFXBufferInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBufferInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBufferInfo_finalize)

bool js_register_gfx_GFXBufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXBufferInfo", obj, nullptr, _SE(js_gfx_GFXBufferInfo_constructor));

    cls->defineProperty("usage", _SE(js_gfx_GFXBufferInfo_get_usage), _SE(js_gfx_GFXBufferInfo_set_usage));
    cls->defineProperty("memUsage", _SE(js_gfx_GFXBufferInfo_get_memUsage), _SE(js_gfx_GFXBufferInfo_set_memUsage));
    cls->defineProperty("stride", _SE(js_gfx_GFXBufferInfo_get_stride), _SE(js_gfx_GFXBufferInfo_set_stride));
    cls->defineProperty("size", _SE(js_gfx_GFXBufferInfo_get_size), _SE(js_gfx_GFXBufferInfo_set_size));
    cls->defineProperty("flags", _SE(js_gfx_GFXBufferInfo_get_flags), _SE(js_gfx_GFXBufferInfo_set_flags));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBufferInfo>(cls);

    __jsb_cocos2d_GFXBufferInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXBufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXDrawInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXDrawInfo_class = nullptr;

static bool js_gfx_GFXDrawInfo_get_vertexCount(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_vertexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->vertexCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_vertexCount)

static bool js_gfx_GFXDrawInfo_set_vertexCount(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_vertexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_vertexCount : Error processing new value");
    cobj->vertexCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_vertexCount)

static bool js_gfx_GFXDrawInfo_get_firstVertex(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_firstVertex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->firstVertex, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_firstVertex)

static bool js_gfx_GFXDrawInfo_set_firstVertex(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_firstVertex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_firstVertex : Error processing new value");
    cobj->firstVertex = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_firstVertex)

static bool js_gfx_GFXDrawInfo_get_indexCount(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_indexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->indexCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_indexCount)

static bool js_gfx_GFXDrawInfo_set_indexCount(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_indexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_indexCount : Error processing new value");
    cobj->indexCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_indexCount)

static bool js_gfx_GFXDrawInfo_get_firstIndex(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_firstIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->firstIndex, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_firstIndex)

static bool js_gfx_GFXDrawInfo_set_firstIndex(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_firstIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_firstIndex : Error processing new value");
    cobj->firstIndex = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_firstIndex)

static bool js_gfx_GFXDrawInfo_get_vertexOffset(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_vertexOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->vertexOffset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_vertexOffset)

static bool js_gfx_GFXDrawInfo_set_vertexOffset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_vertexOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_vertexOffset : Error processing new value");
    cobj->vertexOffset = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_vertexOffset)

static bool js_gfx_GFXDrawInfo_get_instanceCount(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_instanceCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->instanceCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_instanceCount)

static bool js_gfx_GFXDrawInfo_set_instanceCount(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_instanceCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_instanceCount : Error processing new value");
    cobj->instanceCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_instanceCount)

static bool js_gfx_GFXDrawInfo_get_firstInstance(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_firstInstance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->firstInstance, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_firstInstance)

static bool js_gfx_GFXDrawInfo_set_firstInstance(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_firstInstance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_firstInstance : Error processing new value");
    cobj->firstInstance = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_firstInstance)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXDrawInfo_finalize)

static bool js_gfx_GFXDrawInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXDrawInfo* cobj = JSB_ALLOC(cocos2d::GFXDrawInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXDrawInfo* cobj = JSB_ALLOC(cocos2d::GFXDrawInfo);
        unsigned int arg0 = 0;
        json->getProperty("vertexCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->vertexCount = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("firstVertex", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->firstVertex = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("indexCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->indexCount = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("firstIndex", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->firstIndex = arg3;
        }
        unsigned int arg4 = 0;
        json->getProperty("vertexOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg4);
            cobj->vertexOffset = arg4;
        }
        unsigned int arg5 = 0;
        json->getProperty("instanceCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg5);
            cobj->instanceCount = arg5;
        }
        unsigned int arg6 = 0;
        json->getProperty("firstInstance", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg6);
            cobj->firstInstance = arg6;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 7)
    {
        cocos2d::GFXDrawInfo* cobj = JSB_ALLOC(cocos2d::GFXDrawInfo);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->vertexCount = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->firstVertex = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->indexCount = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->firstIndex = arg3;
        }
        unsigned int arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->vertexOffset = arg4;
        }
        unsigned int arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
            cobj->instanceCount = arg5;
        }
        unsigned int arg6 = 0;
        if (!args[6].isUndefined()) {
            ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
            cobj->firstInstance = arg6;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXDrawInfo_constructor, __jsb_cocos2d_GFXDrawInfo_class, js_cocos2d_GFXDrawInfo_finalize)




static bool js_cocos2d_GFXDrawInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXDrawInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXDrawInfo_finalize)

bool js_register_gfx_GFXDrawInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXDrawInfo", obj, nullptr, _SE(js_gfx_GFXDrawInfo_constructor));

    cls->defineProperty("vertexCount", _SE(js_gfx_GFXDrawInfo_get_vertexCount), _SE(js_gfx_GFXDrawInfo_set_vertexCount));
    cls->defineProperty("firstVertex", _SE(js_gfx_GFXDrawInfo_get_firstVertex), _SE(js_gfx_GFXDrawInfo_set_firstVertex));
    cls->defineProperty("indexCount", _SE(js_gfx_GFXDrawInfo_get_indexCount), _SE(js_gfx_GFXDrawInfo_set_indexCount));
    cls->defineProperty("firstIndex", _SE(js_gfx_GFXDrawInfo_get_firstIndex), _SE(js_gfx_GFXDrawInfo_set_firstIndex));
    cls->defineProperty("vertexOffset", _SE(js_gfx_GFXDrawInfo_get_vertexOffset), _SE(js_gfx_GFXDrawInfo_set_vertexOffset));
    cls->defineProperty("instanceCount", _SE(js_gfx_GFXDrawInfo_get_instanceCount), _SE(js_gfx_GFXDrawInfo_set_instanceCount));
    cls->defineProperty("firstInstance", _SE(js_gfx_GFXDrawInfo_get_firstInstance), _SE(js_gfx_GFXDrawInfo_set_firstInstance));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXDrawInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXDrawInfo>(cls);

    __jsb_cocos2d_GFXDrawInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXDrawInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXIndirectBuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GFXIndirectBuffer_class = nullptr;

static bool js_gfx_GFXIndirectBuffer_get_draws(se::State& s)
{
    cocos2d::GFXIndirectBuffer* cobj = (cocos2d::GFXIndirectBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXIndirectBuffer_get_draws : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->draws, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXIndirectBuffer_get_draws)

static bool js_gfx_GFXIndirectBuffer_set_draws(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXIndirectBuffer* cobj = (cocos2d::GFXIndirectBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXIndirectBuffer_set_draws : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXDrawInfo> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXIndirectBuffer_set_draws : Error processing new value");
    cobj->draws = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXIndirectBuffer_set_draws)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXIndirectBuffer_finalize)

static bool js_gfx_GFXIndirectBuffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXIndirectBuffer* cobj = JSB_ALLOC(cocos2d::GFXIndirectBuffer);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cocos2d::GFXIndirectBuffer* cobj = JSB_ALLOC(cocos2d::GFXIndirectBuffer);
        std::vector<cocos2d::GFXDrawInfo> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->draws = arg0;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXIndirectBuffer_constructor, __jsb_cocos2d_GFXIndirectBuffer_class, js_cocos2d_GFXIndirectBuffer_finalize)




static bool js_cocos2d_GFXIndirectBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXIndirectBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXIndirectBuffer* cobj = (cocos2d::GFXIndirectBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXIndirectBuffer_finalize)

bool js_register_gfx_GFXIndirectBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXIndirectBuffer", obj, nullptr, _SE(js_gfx_GFXIndirectBuffer_constructor));

    cls->defineProperty("draws", _SE(js_gfx_GFXIndirectBuffer_get_draws), _SE(js_gfx_GFXIndirectBuffer_set_draws));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXIndirectBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXIndirectBuffer>(cls);

    __jsb_cocos2d_GFXIndirectBuffer_proto = cls->getProto();
    __jsb_cocos2d_GFXIndirectBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXTextureInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXTextureInfo_class = nullptr;

static bool js_gfx_GFXTextureInfo_get_type(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_type)

static bool js_gfx_GFXTextureInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_type)

static bool js_gfx_GFXTextureInfo_get_usage(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->usage, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_usage)

static bool js_gfx_GFXTextureInfo_set_usage(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_usage : Error processing new value");
    cobj->usage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_usage)

static bool js_gfx_GFXTextureInfo_get_format(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_format)

static bool js_gfx_GFXTextureInfo_set_format(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_format)

static bool js_gfx_GFXTextureInfo_get_width(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_width)

static bool js_gfx_GFXTextureInfo_set_width(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_width)

static bool js_gfx_GFXTextureInfo_get_height(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_height)

static bool js_gfx_GFXTextureInfo_set_height(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_height)

static bool js_gfx_GFXTextureInfo_get_depth(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->depth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_depth)

static bool js_gfx_GFXTextureInfo_set_depth(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_depth : Error processing new value");
    cobj->depth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_depth)

static bool js_gfx_GFXTextureInfo_get_arrayLayer(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_arrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->arrayLayer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_arrayLayer)

static bool js_gfx_GFXTextureInfo_set_arrayLayer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_arrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_arrayLayer : Error processing new value");
    cobj->arrayLayer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_arrayLayer)

static bool js_gfx_GFXTextureInfo_get_mipLevel(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->mipLevel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_mipLevel)

static bool js_gfx_GFXTextureInfo_set_mipLevel(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_mipLevel : Error processing new value");
    cobj->mipLevel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_mipLevel)

static bool js_gfx_GFXTextureInfo_get_samples(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_samples : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->samples, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_samples)

static bool js_gfx_GFXTextureInfo_set_samples(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_samples : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXSampleCount arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXSampleCount)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_samples : Error processing new value");
    cobj->samples = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_samples)

static bool js_gfx_GFXTextureInfo_get_flags(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->flags, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_flags)

static bool js_gfx_GFXTextureInfo_set_flags(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureFlagBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureFlagBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_flags : Error processing new value");
    cobj->flags = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_flags)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTextureInfo_finalize)

static bool js_gfx_GFXTextureInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXTextureInfo* cobj = JSB_ALLOC(cocos2d::GFXTextureInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXTextureInfo* cobj = JSB_ALLOC(cocos2d::GFXTextureInfo);
        cocos2d::GFXTextureType arg0;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXTextureType)tmp; } while(false);
            cobj->type = arg0;
        }
        cocos2d::GFXTextureUsageBit arg1;
        json->getProperty("usage", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXTextureUsageBit)tmp; } while(false);
            cobj->usage = arg1;
        }
        cocos2d::GFXFormat arg2;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("width", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->width = arg3;
        }
        unsigned int arg4 = 0;
        json->getProperty("height", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg4);
            cobj->height = arg4;
        }
        unsigned int arg5 = 0;
        json->getProperty("depth", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg5);
            cobj->depth = arg5;
        }
        unsigned int arg6 = 0;
        json->getProperty("arrayLayer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg6);
            cobj->arrayLayer = arg6;
        }
        unsigned int arg7 = 0;
        json->getProperty("mipLevel", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg7);
            cobj->mipLevel = arg7;
        }
        cocos2d::GFXSampleCount arg8;
        json->getProperty("samples", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cocos2d::GFXSampleCount)tmp; } while(false);
            cobj->samples = arg8;
        }
        cocos2d::GFXTextureFlagBit arg9;
        json->getProperty("flags", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cocos2d::GFXTextureFlagBit)tmp; } while(false);
            cobj->flags = arg9;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 10)
    {
        cocos2d::GFXTextureInfo* cobj = JSB_ALLOC(cocos2d::GFXTextureInfo);
        cocos2d::GFXTextureType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureType)tmp; } while(false);
            cobj->type = arg0;
        }
        cocos2d::GFXTextureUsageBit arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXTextureUsageBit)tmp; } while(false);
            cobj->usage = arg1;
        }
        cocos2d::GFXFormat arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->width = arg3;
        }
        unsigned int arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->height = arg4;
        }
        unsigned int arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
            cobj->depth = arg5;
        }
        unsigned int arg6 = 0;
        if (!args[6].isUndefined()) {
            ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
            cobj->arrayLayer = arg6;
        }
        unsigned int arg7 = 0;
        if (!args[7].isUndefined()) {
            ok &= seval_to_uint32(args[7], (uint32_t*)&arg7);
            cobj->mipLevel = arg7;
        }
        cocos2d::GFXSampleCount arg8;
        if (!args[8].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cocos2d::GFXSampleCount)tmp; } while(false);
            cobj->samples = arg8;
        }
        cocos2d::GFXTextureFlagBit arg9;
        if (!args[9].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cocos2d::GFXTextureFlagBit)tmp; } while(false);
            cobj->flags = arg9;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXTextureInfo_constructor, __jsb_cocos2d_GFXTextureInfo_class, js_cocos2d_GFXTextureInfo_finalize)




static bool js_cocos2d_GFXTextureInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXTextureInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXTextureInfo_finalize)

bool js_register_gfx_GFXTextureInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXTextureInfo", obj, nullptr, _SE(js_gfx_GFXTextureInfo_constructor));

    cls->defineProperty("type", _SE(js_gfx_GFXTextureInfo_get_type), _SE(js_gfx_GFXTextureInfo_set_type));
    cls->defineProperty("usage", _SE(js_gfx_GFXTextureInfo_get_usage), _SE(js_gfx_GFXTextureInfo_set_usage));
    cls->defineProperty("format", _SE(js_gfx_GFXTextureInfo_get_format), _SE(js_gfx_GFXTextureInfo_set_format));
    cls->defineProperty("width", _SE(js_gfx_GFXTextureInfo_get_width), _SE(js_gfx_GFXTextureInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXTextureInfo_get_height), _SE(js_gfx_GFXTextureInfo_set_height));
    cls->defineProperty("depth", _SE(js_gfx_GFXTextureInfo_get_depth), _SE(js_gfx_GFXTextureInfo_set_depth));
    cls->defineProperty("arrayLayer", _SE(js_gfx_GFXTextureInfo_get_arrayLayer), _SE(js_gfx_GFXTextureInfo_set_arrayLayer));
    cls->defineProperty("mipLevel", _SE(js_gfx_GFXTextureInfo_get_mipLevel), _SE(js_gfx_GFXTextureInfo_set_mipLevel));
    cls->defineProperty("samples", _SE(js_gfx_GFXTextureInfo_get_samples), _SE(js_gfx_GFXTextureInfo_set_samples));
    cls->defineProperty("flags", _SE(js_gfx_GFXTextureInfo_get_flags), _SE(js_gfx_GFXTextureInfo_set_flags));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXTextureInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXTextureInfo>(cls);

    __jsb_cocos2d_GFXTextureInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXTextureInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXTextureViewInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXTextureViewInfo_class = nullptr;

static bool js_gfx_GFXTextureViewInfo_get_texture(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texture, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_texture)

static bool js_gfx_GFXTextureViewInfo_set_texture(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTexture* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_texture : Error processing new value");
    cobj->texture = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_texture)

static bool js_gfx_GFXTextureViewInfo_get_type(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_type)

static bool js_gfx_GFXTextureViewInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureViewType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureViewType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_type)

static bool js_gfx_GFXTextureViewInfo_get_format(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_format)

static bool js_gfx_GFXTextureViewInfo_set_format(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_format)

static bool js_gfx_GFXTextureViewInfo_get_baseLevel(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_baseLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->baseLevel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_baseLevel)

static bool js_gfx_GFXTextureViewInfo_set_baseLevel(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_baseLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_baseLevel : Error processing new value");
    cobj->baseLevel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_baseLevel)

static bool js_gfx_GFXTextureViewInfo_get_levelCount(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->levelCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_levelCount)

static bool js_gfx_GFXTextureViewInfo_set_levelCount(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_levelCount : Error processing new value");
    cobj->levelCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_levelCount)

static bool js_gfx_GFXTextureViewInfo_get_baseLayer(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_baseLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->baseLayer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_baseLayer)

static bool js_gfx_GFXTextureViewInfo_set_baseLayer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_baseLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_baseLayer : Error processing new value");
    cobj->baseLayer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_baseLayer)

static bool js_gfx_GFXTextureViewInfo_get_layerCount(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->layerCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_layerCount)

static bool js_gfx_GFXTextureViewInfo_set_layerCount(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_layerCount : Error processing new value");
    cobj->layerCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_layerCount)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTextureViewInfo_finalize)

static bool js_gfx_GFXTextureViewInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXTextureViewInfo* cobj = JSB_ALLOC(cocos2d::GFXTextureViewInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXTextureViewInfo* cobj = JSB_ALLOC(cocos2d::GFXTextureViewInfo);
        cocos2d::GFXTexture* arg0 = nullptr;
        json->getProperty("texture", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->texture = arg0;
        }
        cocos2d::GFXTextureViewType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXTextureViewType)tmp; } while(false);
            cobj->type = arg1;
        }
        cocos2d::GFXFormat arg2;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("baseLevel", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->baseLevel = arg3;
        }
        unsigned int arg4 = 0;
        json->getProperty("levelCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg4);
            cobj->levelCount = arg4;
        }
        unsigned int arg5 = 0;
        json->getProperty("baseLayer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg5);
            cobj->baseLayer = arg5;
        }
        unsigned int arg6 = 0;
        json->getProperty("layerCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg6);
            cobj->layerCount = arg6;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 7)
    {
        cocos2d::GFXTextureViewInfo* cobj = JSB_ALLOC(cocos2d::GFXTextureViewInfo);
        cocos2d::GFXTexture* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->texture = arg0;
        }
        cocos2d::GFXTextureViewType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXTextureViewType)tmp; } while(false);
            cobj->type = arg1;
        }
        cocos2d::GFXFormat arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->baseLevel = arg3;
        }
        unsigned int arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->levelCount = arg4;
        }
        unsigned int arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
            cobj->baseLayer = arg5;
        }
        unsigned int arg6 = 0;
        if (!args[6].isUndefined()) {
            ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
            cobj->layerCount = arg6;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXTextureViewInfo_constructor, __jsb_cocos2d_GFXTextureViewInfo_class, js_cocos2d_GFXTextureViewInfo_finalize)




static bool js_cocos2d_GFXTextureViewInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXTextureViewInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXTextureViewInfo_finalize)

bool js_register_gfx_GFXTextureViewInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXTextureViewInfo", obj, nullptr, _SE(js_gfx_GFXTextureViewInfo_constructor));

    cls->defineProperty("texture", _SE(js_gfx_GFXTextureViewInfo_get_texture), _SE(js_gfx_GFXTextureViewInfo_set_texture));
    cls->defineProperty("type", _SE(js_gfx_GFXTextureViewInfo_get_type), _SE(js_gfx_GFXTextureViewInfo_set_type));
    cls->defineProperty("format", _SE(js_gfx_GFXTextureViewInfo_get_format), _SE(js_gfx_GFXTextureViewInfo_set_format));
    cls->defineProperty("baseLevel", _SE(js_gfx_GFXTextureViewInfo_get_baseLevel), _SE(js_gfx_GFXTextureViewInfo_set_baseLevel));
    cls->defineProperty("levelCount", _SE(js_gfx_GFXTextureViewInfo_get_levelCount), _SE(js_gfx_GFXTextureViewInfo_set_levelCount));
    cls->defineProperty("baseLayer", _SE(js_gfx_GFXTextureViewInfo_get_baseLayer), _SE(js_gfx_GFXTextureViewInfo_set_baseLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_GFXTextureViewInfo_get_layerCount), _SE(js_gfx_GFXTextureViewInfo_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXTextureViewInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXTextureViewInfo>(cls);

    __jsb_cocos2d_GFXTextureViewInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXTextureViewInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXSamplerInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXSamplerInfo_class = nullptr;

static bool js_gfx_GFXSamplerInfo_get_name(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_name)

static bool js_gfx_GFXSamplerInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_name)

static bool js_gfx_GFXSamplerInfo_get_minFilter(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->minFilter, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_minFilter)

static bool js_gfx_GFXSamplerInfo_set_minFilter(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFilter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFilter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_minFilter : Error processing new value");
    cobj->minFilter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_minFilter)

static bool js_gfx_GFXSamplerInfo_get_magFilter(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->magFilter, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_magFilter)

static bool js_gfx_GFXSamplerInfo_set_magFilter(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFilter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFilter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_magFilter : Error processing new value");
    cobj->magFilter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_magFilter)

static bool js_gfx_GFXSamplerInfo_get_mipFilter(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->mipFilter, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_mipFilter)

static bool js_gfx_GFXSamplerInfo_set_mipFilter(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFilter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFilter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_mipFilter : Error processing new value");
    cobj->mipFilter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_mipFilter)

static bool js_gfx_GFXSamplerInfo_get_addressU(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_addressU : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->addressU, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_addressU)

static bool js_gfx_GFXSamplerInfo_set_addressU(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_addressU : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXAddress arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXAddress)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_addressU : Error processing new value");
    cobj->addressU = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_addressU)

static bool js_gfx_GFXSamplerInfo_get_addressV(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_addressV : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->addressV, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_addressV)

static bool js_gfx_GFXSamplerInfo_set_addressV(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_addressV : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXAddress arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXAddress)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_addressV : Error processing new value");
    cobj->addressV = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_addressV)

static bool js_gfx_GFXSamplerInfo_get_addressW(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_addressW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->addressW, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_addressW)

static bool js_gfx_GFXSamplerInfo_set_addressW(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_addressW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXAddress arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXAddress)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_addressW : Error processing new value");
    cobj->addressW = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_addressW)

static bool js_gfx_GFXSamplerInfo_get_maxAnisotropy(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_maxAnisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->maxAnisotropy, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_maxAnisotropy)

static bool js_gfx_GFXSamplerInfo_set_maxAnisotropy(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_maxAnisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_maxAnisotropy : Error processing new value");
    cobj->maxAnisotropy = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_maxAnisotropy)

static bool js_gfx_GFXSamplerInfo_get_cmpFunc(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_cmpFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->cmpFunc, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_cmpFunc)

static bool js_gfx_GFXSamplerInfo_set_cmpFunc(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_cmpFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_cmpFunc : Error processing new value");
    cobj->cmpFunc = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_cmpFunc)

static bool js_gfx_GFXSamplerInfo_get_borderColor(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_borderColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->borderColor, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_borderColor)

static bool js_gfx_GFXSamplerInfo_set_borderColor(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_borderColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXColor* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_borderColor : Error processing new value");
    cobj->borderColor = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_borderColor)

static bool js_gfx_GFXSamplerInfo_get_minLOD(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_minLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->minLOD, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_minLOD)

static bool js_gfx_GFXSamplerInfo_set_minLOD(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_minLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_minLOD : Error processing new value");
    cobj->minLOD = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_minLOD)

static bool js_gfx_GFXSamplerInfo_get_maxLOD(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_maxLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->maxLOD, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_maxLOD)

static bool js_gfx_GFXSamplerInfo_set_maxLOD(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_maxLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_maxLOD : Error processing new value");
    cobj->maxLOD = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_maxLOD)

static bool js_gfx_GFXSamplerInfo_get_mipLODBias(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_mipLODBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->mipLODBias, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_mipLODBias)

static bool js_gfx_GFXSamplerInfo_set_mipLODBias(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_mipLODBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_mipLODBias : Error processing new value");
    cobj->mipLODBias = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_mipLODBias)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXSamplerInfo_finalize)

static bool js_gfx_GFXSamplerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXSamplerInfo* cobj = JSB_ALLOC(cocos2d::GFXSamplerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXSamplerInfo* cobj = JSB_ALLOC(cocos2d::GFXSamplerInfo);
        cocos2d::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        cocos2d::GFXFilter arg1;
        json->getProperty("minFilter", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXFilter)tmp; } while(false);
            cobj->minFilter = arg1;
        }
        cocos2d::GFXFilter arg2;
        json->getProperty("magFilter", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXFilter)tmp; } while(false);
            cobj->magFilter = arg2;
        }
        cocos2d::GFXFilter arg3;
        json->getProperty("mipFilter", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXFilter)tmp; } while(false);
            cobj->mipFilter = arg3;
        }
        cocos2d::GFXAddress arg4;
        json->getProperty("addressU", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXAddress)tmp; } while(false);
            cobj->addressU = arg4;
        }
        cocos2d::GFXAddress arg5;
        json->getProperty("addressV", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cocos2d::GFXAddress)tmp; } while(false);
            cobj->addressV = arg5;
        }
        cocos2d::GFXAddress arg6;
        json->getProperty("addressW", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cocos2d::GFXAddress)tmp; } while(false);
            cobj->addressW = arg6;
        }
        unsigned int arg7 = 0;
        json->getProperty("maxAnisotropy", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg7);
            cobj->maxAnisotropy = arg7;
        }
        cocos2d::GFXComparisonFunc arg8;
        json->getProperty("cmpFunc", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
            cobj->cmpFunc = arg8;
        }
        cocos2d::GFXColor* arg9 = nullptr;
        json->getProperty("borderColor", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg9);
            cobj->borderColor = *arg9;
        }
        unsigned int arg10 = 0;
        json->getProperty("minLOD", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg10);
            cobj->minLOD = arg10;
        }
        unsigned int arg11 = 0;
        json->getProperty("maxLOD", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg11);
            cobj->maxLOD = arg11;
        }
        float arg12 = 0;
        json->getProperty("mipLODBias", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg12);
            cobj->mipLODBias = arg12;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 13)
    {
        cocos2d::GFXSamplerInfo* cobj = JSB_ALLOC(cocos2d::GFXSamplerInfo);
        cocos2d::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        cocos2d::GFXFilter arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXFilter)tmp; } while(false);
            cobj->minFilter = arg1;
        }
        cocos2d::GFXFilter arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXFilter)tmp; } while(false);
            cobj->magFilter = arg2;
        }
        cocos2d::GFXFilter arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXFilter)tmp; } while(false);
            cobj->mipFilter = arg3;
        }
        cocos2d::GFXAddress arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXAddress)tmp; } while(false);
            cobj->addressU = arg4;
        }
        cocos2d::GFXAddress arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::GFXAddress)tmp; } while(false);
            cobj->addressV = arg5;
        }
        cocos2d::GFXAddress arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cocos2d::GFXAddress)tmp; } while(false);
            cobj->addressW = arg6;
        }
        unsigned int arg7 = 0;
        if (!args[7].isUndefined()) {
            ok &= seval_to_uint32(args[7], (uint32_t*)&arg7);
            cobj->maxAnisotropy = arg7;
        }
        cocos2d::GFXComparisonFunc arg8;
        if (!args[8].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
            cobj->cmpFunc = arg8;
        }
        cocos2d::GFXColor* arg9 = nullptr;
        if (!args[9].isUndefined()) {
            ok &= seval_to_reference(args[9], &arg9);
            cobj->borderColor = *arg9;
        }
        unsigned int arg10 = 0;
        if (!args[10].isUndefined()) {
            ok &= seval_to_uint32(args[10], (uint32_t*)&arg10);
            cobj->minLOD = arg10;
        }
        unsigned int arg11 = 0;
        if (!args[11].isUndefined()) {
            ok &= seval_to_uint32(args[11], (uint32_t*)&arg11);
            cobj->maxLOD = arg11;
        }
        float arg12 = 0;
        if (!args[12].isUndefined()) {
            ok &= seval_to_float(args[12], &arg12);
            cobj->mipLODBias = arg12;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXSamplerInfo_constructor, __jsb_cocos2d_GFXSamplerInfo_class, js_cocos2d_GFXSamplerInfo_finalize)




static bool js_cocos2d_GFXSamplerInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXSamplerInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXSamplerInfo_finalize)

bool js_register_gfx_GFXSamplerInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXSamplerInfo", obj, nullptr, _SE(js_gfx_GFXSamplerInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_GFXSamplerInfo_get_name), _SE(js_gfx_GFXSamplerInfo_set_name));
    cls->defineProperty("minFilter", _SE(js_gfx_GFXSamplerInfo_get_minFilter), _SE(js_gfx_GFXSamplerInfo_set_minFilter));
    cls->defineProperty("magFilter", _SE(js_gfx_GFXSamplerInfo_get_magFilter), _SE(js_gfx_GFXSamplerInfo_set_magFilter));
    cls->defineProperty("mipFilter", _SE(js_gfx_GFXSamplerInfo_get_mipFilter), _SE(js_gfx_GFXSamplerInfo_set_mipFilter));
    cls->defineProperty("addressU", _SE(js_gfx_GFXSamplerInfo_get_addressU), _SE(js_gfx_GFXSamplerInfo_set_addressU));
    cls->defineProperty("addressV", _SE(js_gfx_GFXSamplerInfo_get_addressV), _SE(js_gfx_GFXSamplerInfo_set_addressV));
    cls->defineProperty("addressW", _SE(js_gfx_GFXSamplerInfo_get_addressW), _SE(js_gfx_GFXSamplerInfo_set_addressW));
    cls->defineProperty("maxAnisotropy", _SE(js_gfx_GFXSamplerInfo_get_maxAnisotropy), _SE(js_gfx_GFXSamplerInfo_set_maxAnisotropy));
    cls->defineProperty("cmpFunc", _SE(js_gfx_GFXSamplerInfo_get_cmpFunc), _SE(js_gfx_GFXSamplerInfo_set_cmpFunc));
    cls->defineProperty("borderColor", _SE(js_gfx_GFXSamplerInfo_get_borderColor), _SE(js_gfx_GFXSamplerInfo_set_borderColor));
    cls->defineProperty("minLOD", _SE(js_gfx_GFXSamplerInfo_get_minLOD), _SE(js_gfx_GFXSamplerInfo_set_minLOD));
    cls->defineProperty("maxLOD", _SE(js_gfx_GFXSamplerInfo_get_maxLOD), _SE(js_gfx_GFXSamplerInfo_set_maxLOD));
    cls->defineProperty("mipLODBias", _SE(js_gfx_GFXSamplerInfo_get_mipLODBias), _SE(js_gfx_GFXSamplerInfo_set_mipLODBias));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXSamplerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXSamplerInfo>(cls);

    __jsb_cocos2d_GFXSamplerInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXSamplerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXShaderMacro_proto = nullptr;
se::Class* __jsb_cocos2d_GFXShaderMacro_class = nullptr;

static bool js_gfx_GFXShaderMacro_get_macro(se::State& s)
{
    cocos2d::GFXShaderMacro* cobj = (cocos2d::GFXShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderMacro_get_macro : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->macro);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderMacro_get_macro)

static bool js_gfx_GFXShaderMacro_set_macro(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXShaderMacro* cobj = (cocos2d::GFXShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderMacro_set_macro : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderMacro_set_macro : Error processing new value");
    cobj->macro = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderMacro_set_macro)

static bool js_gfx_GFXShaderMacro_get_value(se::State& s)
{
    cocos2d::GFXShaderMacro* cobj = (cocos2d::GFXShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderMacro_get_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->value);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderMacro_get_value)

static bool js_gfx_GFXShaderMacro_set_value(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXShaderMacro* cobj = (cocos2d::GFXShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderMacro_set_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderMacro_set_value : Error processing new value");
    cobj->value = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderMacro_set_value)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXShaderMacro_finalize)

static bool js_gfx_GFXShaderMacro_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXShaderMacro* cobj = JSB_ALLOC(cocos2d::GFXShaderMacro);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXShaderMacro* cobj = JSB_ALLOC(cocos2d::GFXShaderMacro);
        cocos2d::String arg0;
        json->getProperty("macro", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->macro = arg0;
        }
        cocos2d::String arg1;
        json->getProperty("value", &field);
        if(!field.isUndefined()) {
            arg1 = field.toStringForce().c_str();
            cobj->value = arg1;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 2)
    {
        cocos2d::GFXShaderMacro* cobj = JSB_ALLOC(cocos2d::GFXShaderMacro);
        cocos2d::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->macro = arg0;
        }
        cocos2d::String arg1;
        if (!args[1].isUndefined()) {
            arg1 = args[1].toStringForce().c_str();
            cobj->value = arg1;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXShaderMacro_constructor, __jsb_cocos2d_GFXShaderMacro_class, js_cocos2d_GFXShaderMacro_finalize)




static bool js_cocos2d_GFXShaderMacro_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXShaderMacro)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXShaderMacro* cobj = (cocos2d::GFXShaderMacro*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXShaderMacro_finalize)

bool js_register_gfx_GFXShaderMacro(se::Object* obj)
{
    auto cls = se::Class::create("GFXShaderMacro", obj, nullptr, _SE(js_gfx_GFXShaderMacro_constructor));

    cls->defineProperty("macro", _SE(js_gfx_GFXShaderMacro_get_macro), _SE(js_gfx_GFXShaderMacro_set_macro));
    cls->defineProperty("value", _SE(js_gfx_GFXShaderMacro_get_value), _SE(js_gfx_GFXShaderMacro_set_value));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXShaderMacro_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXShaderMacro>(cls);

    __jsb_cocos2d_GFXShaderMacro_proto = cls->getProto();
    __jsb_cocos2d_GFXShaderMacro_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXUniform_proto = nullptr;
se::Class* __jsb_cocos2d_GFXUniform_class = nullptr;

static bool js_gfx_GFXUniform_get_name(se::State& s)
{
    cocos2d::GFXUniform* cobj = (cocos2d::GFXUniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniform_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniform_get_name)

static bool js_gfx_GFXUniform_set_name(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniform* cobj = (cocos2d::GFXUniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniform_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniform_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniform_set_name)

static bool js_gfx_GFXUniform_get_type(se::State& s)
{
    cocos2d::GFXUniform* cobj = (cocos2d::GFXUniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniform_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniform_get_type)

static bool js_gfx_GFXUniform_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniform* cobj = (cocos2d::GFXUniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniform_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniform_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniform_set_type)

static bool js_gfx_GFXUniform_get_count(se::State& s)
{
    cocos2d::GFXUniform* cobj = (cocos2d::GFXUniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniform_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniform_get_count)

static bool js_gfx_GFXUniform_set_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniform* cobj = (cocos2d::GFXUniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniform_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniform_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniform_set_count)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXUniform_finalize)

static bool js_gfx_GFXUniform_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXUniform* cobj = JSB_ALLOC(cocos2d::GFXUniform);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXUniform* cobj = JSB_ALLOC(cocos2d::GFXUniform);
        cocos2d::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        cocos2d::GFXType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXType)tmp; } while(false);
            cobj->type = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("count", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->count = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXUniform* cobj = JSB_ALLOC(cocos2d::GFXUniform);
        cocos2d::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        cocos2d::GFXType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXType)tmp; } while(false);
            cobj->type = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->count = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXUniform_constructor, __jsb_cocos2d_GFXUniform_class, js_cocos2d_GFXUniform_finalize)




static bool js_cocos2d_GFXUniform_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXUniform)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXUniform* cobj = (cocos2d::GFXUniform*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXUniform_finalize)

bool js_register_gfx_GFXUniform(se::Object* obj)
{
    auto cls = se::Class::create("GFXUniform", obj, nullptr, _SE(js_gfx_GFXUniform_constructor));

    cls->defineProperty("name", _SE(js_gfx_GFXUniform_get_name), _SE(js_gfx_GFXUniform_set_name));
    cls->defineProperty("type", _SE(js_gfx_GFXUniform_get_type), _SE(js_gfx_GFXUniform_set_type));
    cls->defineProperty("count", _SE(js_gfx_GFXUniform_get_count), _SE(js_gfx_GFXUniform_set_count));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXUniform_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXUniform>(cls);

    __jsb_cocos2d_GFXUniform_proto = cls->getProto();
    __jsb_cocos2d_GFXUniform_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXUniformBlock_proto = nullptr;
se::Class* __jsb_cocos2d_GFXUniformBlock_class = nullptr;

static bool js_gfx_GFXUniformBlock_get_binding(se::State& s)
{
    cocos2d::GFXUniformBlock* cobj = (cocos2d::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->binding, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformBlock_get_binding)

static bool js_gfx_GFXUniformBlock_set_binding(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniformBlock* cobj = (cocos2d::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformBlock_set_binding : Error processing new value");
    cobj->binding = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformBlock_set_binding)

static bool js_gfx_GFXUniformBlock_get_name(se::State& s)
{
    cocos2d::GFXUniformBlock* cobj = (cocos2d::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformBlock_get_name)

static bool js_gfx_GFXUniformBlock_set_name(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniformBlock* cobj = (cocos2d::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformBlock_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformBlock_set_name)

static bool js_gfx_GFXUniformBlock_get_uniforms(se::State& s)
{
    cocos2d::GFXUniformBlock* cobj = (cocos2d::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_get_uniforms : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->uniforms, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformBlock_get_uniforms)

static bool js_gfx_GFXUniformBlock_set_uniforms(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniformBlock* cobj = (cocos2d::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_set_uniforms : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXUniform> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformBlock_set_uniforms : Error processing new value");
    cobj->uniforms = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformBlock_set_uniforms)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXUniformBlock_finalize)

static bool js_gfx_GFXUniformBlock_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXUniformBlock* cobj = JSB_ALLOC(cocos2d::GFXUniformBlock);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXUniformBlock* cobj = JSB_ALLOC(cocos2d::GFXUniformBlock);
        unsigned int arg0 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->binding = arg0;
        }
        cocos2d::String arg1;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg1 = field.toStringForce().c_str();
            cobj->name = arg1;
        }
        std::vector<cocos2d::GFXUniform> arg2;
        json->getProperty("uniforms", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg2);
            cobj->uniforms = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXUniformBlock* cobj = JSB_ALLOC(cocos2d::GFXUniformBlock);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->binding = arg0;
        }
        cocos2d::String arg1;
        if (!args[1].isUndefined()) {
            arg1 = args[1].toStringForce().c_str();
            cobj->name = arg1;
        }
        std::vector<cocos2d::GFXUniform> arg2;
        if (!args[2].isUndefined()) {
            ok &= seval_to_std_vector(args[2], &arg2);
            cobj->uniforms = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXUniformBlock_constructor, __jsb_cocos2d_GFXUniformBlock_class, js_cocos2d_GFXUniformBlock_finalize)




static bool js_cocos2d_GFXUniformBlock_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXUniformBlock)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXUniformBlock* cobj = (cocos2d::GFXUniformBlock*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXUniformBlock_finalize)

bool js_register_gfx_GFXUniformBlock(se::Object* obj)
{
    auto cls = se::Class::create("GFXUniformBlock", obj, nullptr, _SE(js_gfx_GFXUniformBlock_constructor));

    cls->defineProperty("binding", _SE(js_gfx_GFXUniformBlock_get_binding), _SE(js_gfx_GFXUniformBlock_set_binding));
    cls->defineProperty("name", _SE(js_gfx_GFXUniformBlock_get_name), _SE(js_gfx_GFXUniformBlock_set_name));
    cls->defineProperty("uniforms", _SE(js_gfx_GFXUniformBlock_get_uniforms), _SE(js_gfx_GFXUniformBlock_set_uniforms));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXUniformBlock_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXUniformBlock>(cls);

    __jsb_cocos2d_GFXUniformBlock_proto = cls->getProto();
    __jsb_cocos2d_GFXUniformBlock_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXUniformSampler_proto = nullptr;
se::Class* __jsb_cocos2d_GFXUniformSampler_class = nullptr;

static bool js_gfx_GFXUniformSampler_get_binding(se::State& s)
{
    cocos2d::GFXUniformSampler* cobj = (cocos2d::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->binding, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformSampler_get_binding)

static bool js_gfx_GFXUniformSampler_set_binding(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniformSampler* cobj = (cocos2d::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformSampler_set_binding : Error processing new value");
    cobj->binding = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformSampler_set_binding)

static bool js_gfx_GFXUniformSampler_get_name(se::State& s)
{
    cocos2d::GFXUniformSampler* cobj = (cocos2d::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformSampler_get_name)

static bool js_gfx_GFXUniformSampler_set_name(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniformSampler* cobj = (cocos2d::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformSampler_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformSampler_set_name)

static bool js_gfx_GFXUniformSampler_get_type(se::State& s)
{
    cocos2d::GFXUniformSampler* cobj = (cocos2d::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformSampler_get_type)

static bool js_gfx_GFXUniformSampler_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniformSampler* cobj = (cocos2d::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformSampler_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformSampler_set_type)

static bool js_gfx_GFXUniformSampler_get_count(se::State& s)
{
    cocos2d::GFXUniformSampler* cobj = (cocos2d::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformSampler_get_count)

static bool js_gfx_GFXUniformSampler_set_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXUniformSampler* cobj = (cocos2d::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformSampler_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformSampler_set_count)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXUniformSampler_finalize)

static bool js_gfx_GFXUniformSampler_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXUniformSampler* cobj = JSB_ALLOC(cocos2d::GFXUniformSampler);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXUniformSampler* cobj = JSB_ALLOC(cocos2d::GFXUniformSampler);
        unsigned int arg0 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->binding = arg0;
        }
        cocos2d::String arg1;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg1 = field.toStringForce().c_str();
            cobj->name = arg1;
        }
        cocos2d::GFXType arg2;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXType)tmp; } while(false);
            cobj->type = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("count", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->count = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::GFXUniformSampler* cobj = JSB_ALLOC(cocos2d::GFXUniformSampler);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->binding = arg0;
        }
        cocos2d::String arg1;
        if (!args[1].isUndefined()) {
            arg1 = args[1].toStringForce().c_str();
            cobj->name = arg1;
        }
        cocos2d::GFXType arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXType)tmp; } while(false);
            cobj->type = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->count = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXUniformSampler_constructor, __jsb_cocos2d_GFXUniformSampler_class, js_cocos2d_GFXUniformSampler_finalize)




static bool js_cocos2d_GFXUniformSampler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXUniformSampler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXUniformSampler* cobj = (cocos2d::GFXUniformSampler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXUniformSampler_finalize)

bool js_register_gfx_GFXUniformSampler(se::Object* obj)
{
    auto cls = se::Class::create("GFXUniformSampler", obj, nullptr, _SE(js_gfx_GFXUniformSampler_constructor));

    cls->defineProperty("binding", _SE(js_gfx_GFXUniformSampler_get_binding), _SE(js_gfx_GFXUniformSampler_set_binding));
    cls->defineProperty("name", _SE(js_gfx_GFXUniformSampler_get_name), _SE(js_gfx_GFXUniformSampler_set_name));
    cls->defineProperty("type", _SE(js_gfx_GFXUniformSampler_get_type), _SE(js_gfx_GFXUniformSampler_set_type));
    cls->defineProperty("count", _SE(js_gfx_GFXUniformSampler_get_count), _SE(js_gfx_GFXUniformSampler_set_count));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXUniformSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXUniformSampler>(cls);

    __jsb_cocos2d_GFXUniformSampler_proto = cls->getProto();
    __jsb_cocos2d_GFXUniformSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXShaderStage_proto = nullptr;
se::Class* __jsb_cocos2d_GFXShaderStage_class = nullptr;

static bool js_gfx_GFXShaderStage_get_type(se::State& s)
{
    cocos2d::GFXShaderStage* cobj = (cocos2d::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderStage_get_type)

static bool js_gfx_GFXShaderStage_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXShaderStage* cobj = (cocos2d::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderStage_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderStage_set_type)

static bool js_gfx_GFXShaderStage_get_source(se::State& s)
{
    cocos2d::GFXShaderStage* cobj = (cocos2d::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_get_source : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->source);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderStage_get_source)

static bool js_gfx_GFXShaderStage_set_source(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXShaderStage* cobj = (cocos2d::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_set_source : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderStage_set_source : Error processing new value");
    cobj->source = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderStage_set_source)

static bool js_gfx_GFXShaderStage_get_macros(se::State& s)
{
    cocos2d::GFXShaderStage* cobj = (cocos2d::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_get_macros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->macros, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderStage_get_macros)

static bool js_gfx_GFXShaderStage_set_macros(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXShaderStage* cobj = (cocos2d::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_set_macros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXShaderMacro> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderStage_set_macros : Error processing new value");
    cobj->macros = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderStage_set_macros)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXShaderStage_finalize)

static bool js_gfx_GFXShaderStage_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXShaderStage* cobj = JSB_ALLOC(cocos2d::GFXShaderStage);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXShaderStage* cobj = JSB_ALLOC(cocos2d::GFXShaderStage);
        cocos2d::GFXShaderType arg0;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
            cobj->type = arg0;
        }
        cocos2d::String arg1;
        json->getProperty("source", &field);
        if(!field.isUndefined()) {
            arg1 = field.toStringForce().c_str();
            cobj->source = arg1;
        }
        std::vector<cocos2d::GFXShaderMacro> arg2;
        json->getProperty("macros", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg2);
            cobj->macros = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXShaderStage* cobj = JSB_ALLOC(cocos2d::GFXShaderStage);
        cocos2d::GFXShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
            cobj->type = arg0;
        }
        cocos2d::String arg1;
        if (!args[1].isUndefined()) {
            arg1 = args[1].toStringForce().c_str();
            cobj->source = arg1;
        }
        std::vector<cocos2d::GFXShaderMacro> arg2;
        if (!args[2].isUndefined()) {
            ok &= seval_to_std_vector(args[2], &arg2);
            cobj->macros = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXShaderStage_constructor, __jsb_cocos2d_GFXShaderStage_class, js_cocos2d_GFXShaderStage_finalize)




static bool js_cocos2d_GFXShaderStage_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXShaderStage)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXShaderStage* cobj = (cocos2d::GFXShaderStage*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXShaderStage_finalize)

bool js_register_gfx_GFXShaderStage(se::Object* obj)
{
    auto cls = se::Class::create("GFXShaderStage", obj, nullptr, _SE(js_gfx_GFXShaderStage_constructor));

    cls->defineProperty("type", _SE(js_gfx_GFXShaderStage_get_type), _SE(js_gfx_GFXShaderStage_set_type));
    cls->defineProperty("source", _SE(js_gfx_GFXShaderStage_get_source), _SE(js_gfx_GFXShaderStage_set_source));
    cls->defineProperty("macros", _SE(js_gfx_GFXShaderStage_get_macros), _SE(js_gfx_GFXShaderStage_set_macros));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXShaderStage_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXShaderStage>(cls);

    __jsb_cocos2d_GFXShaderStage_proto = cls->getProto();
    __jsb_cocos2d_GFXShaderStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXShaderInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXShaderInfo_class = nullptr;

static bool js_gfx_GFXShaderInfo_get_name(se::State& s)
{
    cocos2d::GFXShaderInfo* cobj = (cocos2d::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderInfo_get_name)

static bool js_gfx_GFXShaderInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXShaderInfo* cobj = (cocos2d::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderInfo_set_name)

static bool js_gfx_GFXShaderInfo_get_stages(se::State& s)
{
    cocos2d::GFXShaderInfo* cobj = (cocos2d::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->stages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderInfo_get_stages)

static bool js_gfx_GFXShaderInfo_set_stages(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXShaderInfo* cobj = (cocos2d::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXShaderStage> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderInfo_set_stages : Error processing new value");
    cobj->stages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderInfo_set_stages)

static bool js_gfx_GFXShaderInfo_get_blocks(se::State& s)
{
    cocos2d::GFXShaderInfo* cobj = (cocos2d::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_get_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->blocks, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderInfo_get_blocks)

static bool js_gfx_GFXShaderInfo_set_blocks(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXShaderInfo* cobj = (cocos2d::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_set_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXUniformBlock> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderInfo_set_blocks : Error processing new value");
    cobj->blocks = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderInfo_set_blocks)

static bool js_gfx_GFXShaderInfo_get_samplers(se::State& s)
{
    cocos2d::GFXShaderInfo* cobj = (cocos2d::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_get_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->samplers, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderInfo_get_samplers)

static bool js_gfx_GFXShaderInfo_set_samplers(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXShaderInfo* cobj = (cocos2d::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_set_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXUniformSampler> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderInfo_set_samplers : Error processing new value");
    cobj->samplers = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderInfo_set_samplers)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXShaderInfo_finalize)

static bool js_gfx_GFXShaderInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXShaderInfo* cobj = JSB_ALLOC(cocos2d::GFXShaderInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXShaderInfo* cobj = JSB_ALLOC(cocos2d::GFXShaderInfo);
        cocos2d::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        std::vector<cocos2d::GFXShaderStage> arg1;
        json->getProperty("stages", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->stages = arg1;
        }
        std::vector<cocos2d::GFXUniformBlock> arg2;
        json->getProperty("blocks", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg2);
            cobj->blocks = arg2;
        }
        std::vector<cocos2d::GFXUniformSampler> arg3;
        json->getProperty("samplers", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg3);
            cobj->samplers = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::GFXShaderInfo* cobj = JSB_ALLOC(cocos2d::GFXShaderInfo);
        cocos2d::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        std::vector<cocos2d::GFXShaderStage> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->stages = arg1;
        }
        std::vector<cocos2d::GFXUniformBlock> arg2;
        if (!args[2].isUndefined()) {
            ok &= seval_to_std_vector(args[2], &arg2);
            cobj->blocks = arg2;
        }
        std::vector<cocos2d::GFXUniformSampler> arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_std_vector(args[3], &arg3);
            cobj->samplers = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXShaderInfo_constructor, __jsb_cocos2d_GFXShaderInfo_class, js_cocos2d_GFXShaderInfo_finalize)




static bool js_cocos2d_GFXShaderInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXShaderInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXShaderInfo* cobj = (cocos2d::GFXShaderInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXShaderInfo_finalize)

bool js_register_gfx_GFXShaderInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXShaderInfo", obj, nullptr, _SE(js_gfx_GFXShaderInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_GFXShaderInfo_get_name), _SE(js_gfx_GFXShaderInfo_set_name));
    cls->defineProperty("stages", _SE(js_gfx_GFXShaderInfo_get_stages), _SE(js_gfx_GFXShaderInfo_set_stages));
    cls->defineProperty("blocks", _SE(js_gfx_GFXShaderInfo_get_blocks), _SE(js_gfx_GFXShaderInfo_set_blocks));
    cls->defineProperty("samplers", _SE(js_gfx_GFXShaderInfo_get_samplers), _SE(js_gfx_GFXShaderInfo_set_samplers));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXShaderInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXShaderInfo>(cls);

    __jsb_cocos2d_GFXShaderInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXShaderInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXAttribute_proto = nullptr;
se::Class* __jsb_cocos2d_GFXAttribute_class = nullptr;

static bool js_gfx_GFXAttribute_get_name(se::State& s)
{
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXAttribute_get_name)

static bool js_gfx_GFXAttribute_set_name(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_name)

static bool js_gfx_GFXAttribute_get_format(se::State& s)
{
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXAttribute_get_format)

static bool js_gfx_GFXAttribute_set_format(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_format)

static bool js_gfx_GFXAttribute_get_isNormalized(se::State& s)
{
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_get_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isNormalized, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXAttribute_get_isNormalized)

static bool js_gfx_GFXAttribute_set_isNormalized(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_isNormalized : Error processing new value");
    cobj->isNormalized = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_isNormalized)

static bool js_gfx_GFXAttribute_get_stream(se::State& s)
{
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_get_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stream, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXAttribute_get_stream)

static bool js_gfx_GFXAttribute_set_stream(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_stream : Error processing new value");
    cobj->stream = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_stream)

static bool js_gfx_GFXAttribute_get_isInstanced(se::State& s)
{
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_get_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isInstanced, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXAttribute_get_isInstanced)

static bool js_gfx_GFXAttribute_set_isInstanced(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_isInstanced : Error processing new value");
    cobj->isInstanced = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_isInstanced)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXAttribute_finalize)

static bool js_gfx_GFXAttribute_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXAttribute* cobj = JSB_ALLOC(cocos2d::GFXAttribute);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXAttribute* cobj = JSB_ALLOC(cocos2d::GFXAttribute);
        cocos2d::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        cocos2d::GFXFormat arg1;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg1;
        }
        bool arg2;
        json->getProperty("isNormalized", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg2);
            cobj->isNormalized = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("stream", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->stream = arg3;
        }
        bool arg4;
        json->getProperty("isInstanced", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg4);
            cobj->isInstanced = arg4;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 5)
    {
        cocos2d::GFXAttribute* cobj = JSB_ALLOC(cocos2d::GFXAttribute);
        cocos2d::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        cocos2d::GFXFormat arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg1;
        }
        bool arg2;
        if (!args[2].isUndefined()) {
            ok &= seval_to_boolean(args[2], &arg2);
            cobj->isNormalized = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->stream = arg3;
        }
        bool arg4;
        if (!args[4].isUndefined()) {
            ok &= seval_to_boolean(args[4], &arg4);
            cobj->isInstanced = arg4;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXAttribute_constructor, __jsb_cocos2d_GFXAttribute_class, js_cocos2d_GFXAttribute_finalize)




static bool js_cocos2d_GFXAttribute_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXAttribute)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXAttribute_finalize)

bool js_register_gfx_GFXAttribute(se::Object* obj)
{
    auto cls = se::Class::create("GFXAttribute", obj, nullptr, _SE(js_gfx_GFXAttribute_constructor));

    cls->defineProperty("name", _SE(js_gfx_GFXAttribute_get_name), _SE(js_gfx_GFXAttribute_set_name));
    cls->defineProperty("format", _SE(js_gfx_GFXAttribute_get_format), _SE(js_gfx_GFXAttribute_set_format));
    cls->defineProperty("isNormalized", _SE(js_gfx_GFXAttribute_get_isNormalized), _SE(js_gfx_GFXAttribute_set_isNormalized));
    cls->defineProperty("stream", _SE(js_gfx_GFXAttribute_get_stream), _SE(js_gfx_GFXAttribute_set_stream));
    cls->defineProperty("isInstanced", _SE(js_gfx_GFXAttribute_get_isInstanced), _SE(js_gfx_GFXAttribute_set_isInstanced));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXAttribute_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXAttribute>(cls);

    __jsb_cocos2d_GFXAttribute_proto = cls->getProto();
    __jsb_cocos2d_GFXAttribute_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXInputAssemblerInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXInputAssemblerInfo_class = nullptr;

static bool js_gfx_GFXInputAssemblerInfo_get_attributes(se::State& s)
{
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->attributes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssemblerInfo_get_attributes)

static bool js_gfx_GFXInputAssemblerInfo_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXAttribute> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_attributes : Error processing new value");
    cobj->attributes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_attributes)

static bool js_gfx_GFXInputAssemblerInfo_get_vertexBuffers(se::State& s)
{
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_get_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->vertexBuffers, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssemblerInfo_get_vertexBuffers)

static bool js_gfx_GFXInputAssemblerInfo_set_vertexBuffers(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXBuffer *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_vertexBuffers : Error processing new value");
    cobj->vertexBuffers = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_vertexBuffers)

static bool js_gfx_GFXInputAssemblerInfo_get_indexBuffer(se::State& s)
{
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_get_indexBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->indexBuffer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssemblerInfo_get_indexBuffer)

static bool js_gfx_GFXInputAssemblerInfo_set_indexBuffer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_indexBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBuffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_indexBuffer : Error processing new value");
    cobj->indexBuffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_indexBuffer)

static bool js_gfx_GFXInputAssemblerInfo_get_indirectBuffer(se::State& s)
{
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_get_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->indirectBuffer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssemblerInfo_get_indirectBuffer)

static bool js_gfx_GFXInputAssemblerInfo_set_indirectBuffer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBuffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_indirectBuffer : Error processing new value");
    cobj->indirectBuffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_indirectBuffer)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXInputAssemblerInfo_finalize)

static bool js_gfx_GFXInputAssemblerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXInputAssemblerInfo* cobj = JSB_ALLOC(cocos2d::GFXInputAssemblerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXInputAssemblerInfo* cobj = JSB_ALLOC(cocos2d::GFXInputAssemblerInfo);
        std::vector<cocos2d::GFXAttribute> arg0;
        json->getProperty("attributes", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg0);
            cobj->attributes = arg0;
        }
        std::vector<cocos2d::GFXBuffer *> arg1;
        json->getProperty("vertexBuffers", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->vertexBuffers = arg1;
        }
        cocos2d::GFXBuffer* arg2 = nullptr;
        json->getProperty("indexBuffer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg2);
            cobj->indexBuffer = arg2;
        }
        cocos2d::GFXBuffer* arg3 = nullptr;
        json->getProperty("indirectBuffer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg3);
            cobj->indirectBuffer = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::GFXInputAssemblerInfo* cobj = JSB_ALLOC(cocos2d::GFXInputAssemblerInfo);
        std::vector<cocos2d::GFXAttribute> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->attributes = arg0;
        }
        std::vector<cocos2d::GFXBuffer *> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->vertexBuffers = arg1;
        }
        cocos2d::GFXBuffer* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_native_ptr(args[2], &arg2);
            cobj->indexBuffer = arg2;
        }
        cocos2d::GFXBuffer* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_native_ptr(args[3], &arg3);
            cobj->indirectBuffer = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXInputAssemblerInfo_constructor, __jsb_cocos2d_GFXInputAssemblerInfo_class, js_cocos2d_GFXInputAssemblerInfo_finalize)




static bool js_cocos2d_GFXInputAssemblerInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXInputAssemblerInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXInputAssemblerInfo_finalize)

bool js_register_gfx_GFXInputAssemblerInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXInputAssemblerInfo", obj, nullptr, _SE(js_gfx_GFXInputAssemblerInfo_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_GFXInputAssemblerInfo_get_attributes), _SE(js_gfx_GFXInputAssemblerInfo_set_attributes));
    cls->defineProperty("vertexBuffers", _SE(js_gfx_GFXInputAssemblerInfo_get_vertexBuffers), _SE(js_gfx_GFXInputAssemblerInfo_set_vertexBuffers));
    cls->defineProperty("indexBuffer", _SE(js_gfx_GFXInputAssemblerInfo_get_indexBuffer), _SE(js_gfx_GFXInputAssemblerInfo_set_indexBuffer));
    cls->defineProperty("indirectBuffer", _SE(js_gfx_GFXInputAssemblerInfo_get_indirectBuffer), _SE(js_gfx_GFXInputAssemblerInfo_set_indirectBuffer));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXInputAssemblerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXInputAssemblerInfo>(cls);

    __jsb_cocos2d_GFXInputAssemblerInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXInputAssemblerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXColorAttachment_proto = nullptr;
se::Class* __jsb_cocos2d_GFXColorAttachment_class = nullptr;

static bool js_gfx_GFXColorAttachment_get_format(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_format)

static bool js_gfx_GFXColorAttachment_set_format(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_format)

static bool js_gfx_GFXColorAttachment_get_loadOp(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_loadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->loadOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_loadOp)

static bool js_gfx_GFXColorAttachment_set_loadOp(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_loadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXLoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXLoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_loadOp : Error processing new value");
    cobj->loadOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_loadOp)

static bool js_gfx_GFXColorAttachment_get_storeOp(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_storeOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->storeOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_storeOp)

static bool js_gfx_GFXColorAttachment_set_storeOp(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_storeOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_storeOp : Error processing new value");
    cobj->storeOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_storeOp)

static bool js_gfx_GFXColorAttachment_get_sampleCount(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->sampleCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_sampleCount)

static bool js_gfx_GFXColorAttachment_set_sampleCount(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_sampleCount : Error processing new value");
    cobj->sampleCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_sampleCount)

static bool js_gfx_GFXColorAttachment_get_beginLayout(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->beginLayout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_beginLayout)

static bool js_gfx_GFXColorAttachment_set_beginLayout(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_beginLayout : Error processing new value");
    cobj->beginLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_beginLayout)

static bool js_gfx_GFXColorAttachment_get_endLayout(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->endLayout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_endLayout)

static bool js_gfx_GFXColorAttachment_set_endLayout(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_endLayout : Error processing new value");
    cobj->endLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_endLayout)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXColorAttachment_finalize)

static bool js_gfx_GFXColorAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXColorAttachment* cobj = JSB_ALLOC(cocos2d::GFXColorAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXColorAttachment* cobj = JSB_ALLOC(cocos2d::GFXColorAttachment);
        cocos2d::GFXFormat arg0;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg0;
        }
        cocos2d::GFXLoadOp arg1;
        json->getProperty("loadOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXLoadOp)tmp; } while(false);
            cobj->loadOp = arg1;
        }
        cocos2d::GFXStoreOp arg2;
        json->getProperty("storeOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXStoreOp)tmp; } while(false);
            cobj->storeOp = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("sampleCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->sampleCount = arg3;
        }
        cocos2d::GFXTextureLayout arg4;
        json->getProperty("beginLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXTextureLayout)tmp; } while(false);
            cobj->beginLayout = arg4;
        }
        cocos2d::GFXTextureLayout arg5;
        json->getProperty("endLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cocos2d::GFXTextureLayout)tmp; } while(false);
            cobj->endLayout = arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        cocos2d::GFXColorAttachment* cobj = JSB_ALLOC(cocos2d::GFXColorAttachment);
        cocos2d::GFXFormat arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg0;
        }
        cocos2d::GFXLoadOp arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXLoadOp)tmp; } while(false);
            cobj->loadOp = arg1;
        }
        cocos2d::GFXStoreOp arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXStoreOp)tmp; } while(false);
            cobj->storeOp = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->sampleCount = arg3;
        }
        cocos2d::GFXTextureLayout arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXTextureLayout)tmp; } while(false);
            cobj->beginLayout = arg4;
        }
        cocos2d::GFXTextureLayout arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::GFXTextureLayout)tmp; } while(false);
            cobj->endLayout = arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXColorAttachment_constructor, __jsb_cocos2d_GFXColorAttachment_class, js_cocos2d_GFXColorAttachment_finalize)




static bool js_cocos2d_GFXColorAttachment_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXColorAttachment)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXColorAttachment_finalize)

bool js_register_gfx_GFXColorAttachment(se::Object* obj)
{
    auto cls = se::Class::create("GFXColorAttachment", obj, nullptr, _SE(js_gfx_GFXColorAttachment_constructor));

    cls->defineProperty("format", _SE(js_gfx_GFXColorAttachment_get_format), _SE(js_gfx_GFXColorAttachment_set_format));
    cls->defineProperty("loadOp", _SE(js_gfx_GFXColorAttachment_get_loadOp), _SE(js_gfx_GFXColorAttachment_set_loadOp));
    cls->defineProperty("storeOp", _SE(js_gfx_GFXColorAttachment_get_storeOp), _SE(js_gfx_GFXColorAttachment_set_storeOp));
    cls->defineProperty("sampleCount", _SE(js_gfx_GFXColorAttachment_get_sampleCount), _SE(js_gfx_GFXColorAttachment_set_sampleCount));
    cls->defineProperty("beginLayout", _SE(js_gfx_GFXColorAttachment_get_beginLayout), _SE(js_gfx_GFXColorAttachment_set_beginLayout));
    cls->defineProperty("endLayout", _SE(js_gfx_GFXColorAttachment_get_endLayout), _SE(js_gfx_GFXColorAttachment_set_endLayout));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXColorAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXColorAttachment>(cls);

    __jsb_cocos2d_GFXColorAttachment_proto = cls->getProto();
    __jsb_cocos2d_GFXColorAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXDepthStencilAttachment_proto = nullptr;
se::Class* __jsb_cocos2d_GFXDepthStencilAttachment_class = nullptr;

static bool js_gfx_GFXDepthStencilAttachment_get_format(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_format)

static bool js_gfx_GFXDepthStencilAttachment_set_format(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_format)

static bool js_gfx_GFXDepthStencilAttachment_get_depthLoadOp(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_depthLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depthLoadOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_depthLoadOp)

static bool js_gfx_GFXDepthStencilAttachment_set_depthLoadOp(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_depthLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXLoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXLoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_depthLoadOp : Error processing new value");
    cobj->depthLoadOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_depthLoadOp)

static bool js_gfx_GFXDepthStencilAttachment_get_depthStoreOp(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_depthStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depthStoreOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_depthStoreOp)

static bool js_gfx_GFXDepthStencilAttachment_set_depthStoreOp(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_depthStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_depthStoreOp : Error processing new value");
    cobj->depthStoreOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_depthStoreOp)

static bool js_gfx_GFXDepthStencilAttachment_get_stencilLoadOp(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_stencilLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilLoadOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_stencilLoadOp)

static bool js_gfx_GFXDepthStencilAttachment_set_stencilLoadOp(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_stencilLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXLoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXLoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_stencilLoadOp : Error processing new value");
    cobj->stencilLoadOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_stencilLoadOp)

static bool js_gfx_GFXDepthStencilAttachment_get_stencilStoreOp(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_stencilStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilStoreOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_stencilStoreOp)

static bool js_gfx_GFXDepthStencilAttachment_set_stencilStoreOp(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_stencilStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_stencilStoreOp : Error processing new value");
    cobj->stencilStoreOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_stencilStoreOp)

static bool js_gfx_GFXDepthStencilAttachment_get_sampleCount(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->sampleCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_sampleCount)

static bool js_gfx_GFXDepthStencilAttachment_set_sampleCount(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_sampleCount : Error processing new value");
    cobj->sampleCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_sampleCount)

static bool js_gfx_GFXDepthStencilAttachment_get_beginLayout(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->beginLayout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_beginLayout)

static bool js_gfx_GFXDepthStencilAttachment_set_beginLayout(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_beginLayout : Error processing new value");
    cobj->beginLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_beginLayout)

static bool js_gfx_GFXDepthStencilAttachment_get_endLayout(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->endLayout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_endLayout)

static bool js_gfx_GFXDepthStencilAttachment_set_endLayout(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_endLayout : Error processing new value");
    cobj->endLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_endLayout)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXDepthStencilAttachment_finalize)

static bool js_gfx_GFXDepthStencilAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXDepthStencilAttachment* cobj = JSB_ALLOC(cocos2d::GFXDepthStencilAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXDepthStencilAttachment* cobj = JSB_ALLOC(cocos2d::GFXDepthStencilAttachment);
        cocos2d::GFXFormat arg0;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg0;
        }
        cocos2d::GFXLoadOp arg1;
        json->getProperty("depthLoadOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXLoadOp)tmp; } while(false);
            cobj->depthLoadOp = arg1;
        }
        cocos2d::GFXStoreOp arg2;
        json->getProperty("depthStoreOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXStoreOp)tmp; } while(false);
            cobj->depthStoreOp = arg2;
        }
        cocos2d::GFXLoadOp arg3;
        json->getProperty("stencilLoadOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXLoadOp)tmp; } while(false);
            cobj->stencilLoadOp = arg3;
        }
        cocos2d::GFXStoreOp arg4;
        json->getProperty("stencilStoreOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXStoreOp)tmp; } while(false);
            cobj->stencilStoreOp = arg4;
        }
        unsigned int arg5 = 0;
        json->getProperty("sampleCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg5);
            cobj->sampleCount = arg5;
        }
        cocos2d::GFXTextureLayout arg6;
        json->getProperty("beginLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cocos2d::GFXTextureLayout)tmp; } while(false);
            cobj->beginLayout = arg6;
        }
        cocos2d::GFXTextureLayout arg7;
        json->getProperty("endLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cocos2d::GFXTextureLayout)tmp; } while(false);
            cobj->endLayout = arg7;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 8)
    {
        cocos2d::GFXDepthStencilAttachment* cobj = JSB_ALLOC(cocos2d::GFXDepthStencilAttachment);
        cocos2d::GFXFormat arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
            cobj->format = arg0;
        }
        cocos2d::GFXLoadOp arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXLoadOp)tmp; } while(false);
            cobj->depthLoadOp = arg1;
        }
        cocos2d::GFXStoreOp arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXStoreOp)tmp; } while(false);
            cobj->depthStoreOp = arg2;
        }
        cocos2d::GFXLoadOp arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXLoadOp)tmp; } while(false);
            cobj->stencilLoadOp = arg3;
        }
        cocos2d::GFXStoreOp arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXStoreOp)tmp; } while(false);
            cobj->stencilStoreOp = arg4;
        }
        unsigned int arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
            cobj->sampleCount = arg5;
        }
        cocos2d::GFXTextureLayout arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cocos2d::GFXTextureLayout)tmp; } while(false);
            cobj->beginLayout = arg6;
        }
        cocos2d::GFXTextureLayout arg7;
        if (!args[7].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cocos2d::GFXTextureLayout)tmp; } while(false);
            cobj->endLayout = arg7;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXDepthStencilAttachment_constructor, __jsb_cocos2d_GFXDepthStencilAttachment_class, js_cocos2d_GFXDepthStencilAttachment_finalize)




static bool js_cocos2d_GFXDepthStencilAttachment_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXDepthStencilAttachment)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXDepthStencilAttachment_finalize)

bool js_register_gfx_GFXDepthStencilAttachment(se::Object* obj)
{
    auto cls = se::Class::create("GFXDepthStencilAttachment", obj, nullptr, _SE(js_gfx_GFXDepthStencilAttachment_constructor));

    cls->defineProperty("format", _SE(js_gfx_GFXDepthStencilAttachment_get_format), _SE(js_gfx_GFXDepthStencilAttachment_set_format));
    cls->defineProperty("depthLoadOp", _SE(js_gfx_GFXDepthStencilAttachment_get_depthLoadOp), _SE(js_gfx_GFXDepthStencilAttachment_set_depthLoadOp));
    cls->defineProperty("depthStoreOp", _SE(js_gfx_GFXDepthStencilAttachment_get_depthStoreOp), _SE(js_gfx_GFXDepthStencilAttachment_set_depthStoreOp));
    cls->defineProperty("stencilLoadOp", _SE(js_gfx_GFXDepthStencilAttachment_get_stencilLoadOp), _SE(js_gfx_GFXDepthStencilAttachment_set_stencilLoadOp));
    cls->defineProperty("stencilStoreOp", _SE(js_gfx_GFXDepthStencilAttachment_get_stencilStoreOp), _SE(js_gfx_GFXDepthStencilAttachment_set_stencilStoreOp));
    cls->defineProperty("sampleCount", _SE(js_gfx_GFXDepthStencilAttachment_get_sampleCount), _SE(js_gfx_GFXDepthStencilAttachment_set_sampleCount));
    cls->defineProperty("beginLayout", _SE(js_gfx_GFXDepthStencilAttachment_get_beginLayout), _SE(js_gfx_GFXDepthStencilAttachment_set_beginLayout));
    cls->defineProperty("endLayout", _SE(js_gfx_GFXDepthStencilAttachment_get_endLayout), _SE(js_gfx_GFXDepthStencilAttachment_set_endLayout));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXDepthStencilAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXDepthStencilAttachment>(cls);

    __jsb_cocos2d_GFXDepthStencilAttachment_proto = cls->getProto();
    __jsb_cocos2d_GFXDepthStencilAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXRenderPassInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXRenderPassInfo_class = nullptr;

static bool js_gfx_GFXRenderPassInfo_get_colorAttachments(se::State& s)
{
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_get_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->colorAttachments, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPassInfo_get_colorAttachments)

static bool js_gfx_GFXRenderPassInfo_set_colorAttachments(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_set_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXColorAttachment> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPassInfo_set_colorAttachments : Error processing new value");
    cobj->colorAttachments = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRenderPassInfo_set_colorAttachments)

static bool js_gfx_GFXRenderPassInfo_get_depthStencilAttachment(se::State& s)
{
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_get_depthStencilAttachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->depthStencilAttachment, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPassInfo_get_depthStencilAttachment)

static bool js_gfx_GFXRenderPassInfo_set_depthStencilAttachment(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_set_depthStencilAttachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXDepthStencilAttachment* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPassInfo_set_depthStencilAttachment : Error processing new value");
    cobj->depthStencilAttachment = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRenderPassInfo_set_depthStencilAttachment)

static bool js_gfx_GFXRenderPassInfo_get_subPasses(se::State& s)
{
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_get_subPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->subPasses, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPassInfo_get_subPasses)

static bool js_gfx_GFXRenderPassInfo_set_subPasses(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_set_subPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXSubPass> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPassInfo_set_subPasses : Error processing new value");
    cobj->subPasses = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRenderPassInfo_set_subPasses)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXRenderPassInfo_finalize)

static bool js_gfx_GFXRenderPassInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXRenderPassInfo* cobj = JSB_ALLOC(cocos2d::GFXRenderPassInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXRenderPassInfo* cobj = JSB_ALLOC(cocos2d::GFXRenderPassInfo);
        std::vector<cocos2d::GFXColorAttachment> arg0;
        json->getProperty("colorAttachments", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg0);
            cobj->colorAttachments = arg0;
        }
        cocos2d::GFXDepthStencilAttachment* arg1 = nullptr;
        json->getProperty("depthStencilAttachment", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg1);
            cobj->depthStencilAttachment = *arg1;
        }
        std::vector<cocos2d::GFXSubPass> arg2;
        json->getProperty("subPasses", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg2);
            cobj->subPasses = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXRenderPassInfo* cobj = JSB_ALLOC(cocos2d::GFXRenderPassInfo);
        std::vector<cocos2d::GFXColorAttachment> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->colorAttachments = arg0;
        }
        cocos2d::GFXDepthStencilAttachment* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_reference(args[1], &arg1);
            cobj->depthStencilAttachment = *arg1;
        }
        std::vector<cocos2d::GFXSubPass> arg2;
        if (!args[2].isUndefined()) {
            ok &= seval_to_std_vector(args[2], &arg2);
            cobj->subPasses = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXRenderPassInfo_constructor, __jsb_cocos2d_GFXRenderPassInfo_class, js_cocos2d_GFXRenderPassInfo_finalize)




static bool js_cocos2d_GFXRenderPassInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXRenderPassInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXRenderPassInfo_finalize)

bool js_register_gfx_GFXRenderPassInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXRenderPassInfo", obj, nullptr, _SE(js_gfx_GFXRenderPassInfo_constructor));

    cls->defineProperty("colorAttachments", _SE(js_gfx_GFXRenderPassInfo_get_colorAttachments), _SE(js_gfx_GFXRenderPassInfo_set_colorAttachments));
    cls->defineProperty("depthStencilAttachment", _SE(js_gfx_GFXRenderPassInfo_get_depthStencilAttachment), _SE(js_gfx_GFXRenderPassInfo_set_depthStencilAttachment));
    cls->defineProperty("subPasses", _SE(js_gfx_GFXRenderPassInfo_get_subPasses), _SE(js_gfx_GFXRenderPassInfo_set_subPasses));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXRenderPassInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXRenderPassInfo>(cls);

    __jsb_cocos2d_GFXRenderPassInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXRenderPassInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXFramebufferInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXFramebufferInfo_class = nullptr;

static bool js_gfx_GFXFramebufferInfo_get_renderPass(se::State& s)
{
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->renderPass, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_renderPass)

static bool js_gfx_GFXFramebufferInfo_set_renderPass(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXRenderPass* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_renderPass : Error processing new value");
    cobj->renderPass = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_renderPass)

static bool js_gfx_GFXFramebufferInfo_get_colorViews(se::State& s)
{
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_colorViews : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->colorViews, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_colorViews)

static bool js_gfx_GFXFramebufferInfo_set_colorViews(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_colorViews : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXTextureView *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_colorViews : Error processing new value");
    cobj->colorViews = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_colorViews)

static bool js_gfx_GFXFramebufferInfo_get_depthStencilView(se::State& s)
{
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_depthStencilView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->depthStencilView, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_depthStencilView)

static bool js_gfx_GFXFramebufferInfo_set_depthStencilView(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_depthStencilView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureView* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_depthStencilView : Error processing new value");
    cobj->depthStencilView = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_depthStencilView)

static bool js_gfx_GFXFramebufferInfo_get_isOffscreen(se::State& s)
{
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_isOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isOffscreen, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_isOffscreen)

static bool js_gfx_GFXFramebufferInfo_set_isOffscreen(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_isOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_isOffscreen : Error processing new value");
    cobj->isOffscreen = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_isOffscreen)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXFramebufferInfo_finalize)

static bool js_gfx_GFXFramebufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXFramebufferInfo* cobj = JSB_ALLOC(cocos2d::GFXFramebufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXFramebufferInfo* cobj = JSB_ALLOC(cocos2d::GFXFramebufferInfo);
        cocos2d::GFXRenderPass* arg0 = nullptr;
        json->getProperty("renderPass", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->renderPass = arg0;
        }
        std::vector<cocos2d::GFXTextureView *> arg1;
        json->getProperty("colorViews", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->colorViews = arg1;
        }
        cocos2d::GFXTextureView* arg2 = nullptr;
        json->getProperty("depthStencilView", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg2);
            cobj->depthStencilView = arg2;
        }
        bool arg3;
        json->getProperty("isOffscreen", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg3);
            cobj->isOffscreen = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::GFXFramebufferInfo* cobj = JSB_ALLOC(cocos2d::GFXFramebufferInfo);
        cocos2d::GFXRenderPass* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->renderPass = arg0;
        }
        std::vector<cocos2d::GFXTextureView *> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->colorViews = arg1;
        }
        cocos2d::GFXTextureView* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_native_ptr(args[2], &arg2);
            cobj->depthStencilView = arg2;
        }
        bool arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_boolean(args[3], &arg3);
            cobj->isOffscreen = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXFramebufferInfo_constructor, __jsb_cocos2d_GFXFramebufferInfo_class, js_cocos2d_GFXFramebufferInfo_finalize)




static bool js_cocos2d_GFXFramebufferInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXFramebufferInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXFramebufferInfo_finalize)

bool js_register_gfx_GFXFramebufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXFramebufferInfo", obj, nullptr, _SE(js_gfx_GFXFramebufferInfo_constructor));

    cls->defineProperty("renderPass", _SE(js_gfx_GFXFramebufferInfo_get_renderPass), _SE(js_gfx_GFXFramebufferInfo_set_renderPass));
    cls->defineProperty("colorViews", _SE(js_gfx_GFXFramebufferInfo_get_colorViews), _SE(js_gfx_GFXFramebufferInfo_set_colorViews));
    cls->defineProperty("depthStencilView", _SE(js_gfx_GFXFramebufferInfo_get_depthStencilView), _SE(js_gfx_GFXFramebufferInfo_set_depthStencilView));
    cls->defineProperty("isOffscreen", _SE(js_gfx_GFXFramebufferInfo_get_isOffscreen), _SE(js_gfx_GFXFramebufferInfo_set_isOffscreen));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXFramebufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXFramebufferInfo>(cls);

    __jsb_cocos2d_GFXFramebufferInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXFramebufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBinding_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBinding_class = nullptr;

static bool js_gfx_GFXBinding_get_binding(se::State& s)
{
    cocos2d::GFXBinding* cobj = (cocos2d::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->binding, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBinding_get_binding)

static bool js_gfx_GFXBinding_set_binding(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBinding* cobj = (cocos2d::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBinding_set_binding : Error processing new value");
    cobj->binding = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBinding_set_binding)

static bool js_gfx_GFXBinding_get_type(se::State& s)
{
    cocos2d::GFXBinding* cobj = (cocos2d::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBinding_get_type)

static bool js_gfx_GFXBinding_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBinding* cobj = (cocos2d::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBindingType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBindingType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBinding_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBinding_set_type)

static bool js_gfx_GFXBinding_get_name(se::State& s)
{
    cocos2d::GFXBinding* cobj = (cocos2d::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBinding_get_name)

static bool js_gfx_GFXBinding_set_name(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBinding* cobj = (cocos2d::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBinding_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBinding_set_name)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBinding_finalize)

static bool js_gfx_GFXBinding_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXBinding* cobj = JSB_ALLOC(cocos2d::GFXBinding);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXBinding* cobj = JSB_ALLOC(cocos2d::GFXBinding);
        unsigned int arg0 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->binding = arg0;
        }
        cocos2d::GFXBindingType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXBindingType)tmp; } while(false);
            cobj->type = arg1;
        }
        cocos2d::String arg2;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg2 = field.toStringForce().c_str();
            cobj->name = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXBinding* cobj = JSB_ALLOC(cocos2d::GFXBinding);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->binding = arg0;
        }
        cocos2d::GFXBindingType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXBindingType)tmp; } while(false);
            cobj->type = arg1;
        }
        cocos2d::String arg2;
        if (!args[2].isUndefined()) {
            arg2 = args[2].toStringForce().c_str();
            cobj->name = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBinding_constructor, __jsb_cocos2d_GFXBinding_class, js_cocos2d_GFXBinding_finalize)




static bool js_cocos2d_GFXBinding_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBinding)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBinding* cobj = (cocos2d::GFXBinding*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBinding_finalize)

bool js_register_gfx_GFXBinding(se::Object* obj)
{
    auto cls = se::Class::create("GFXBinding", obj, nullptr, _SE(js_gfx_GFXBinding_constructor));

    cls->defineProperty("binding", _SE(js_gfx_GFXBinding_get_binding), _SE(js_gfx_GFXBinding_set_binding));
    cls->defineProperty("type", _SE(js_gfx_GFXBinding_get_type), _SE(js_gfx_GFXBinding_set_type));
    cls->defineProperty("name", _SE(js_gfx_GFXBinding_get_name), _SE(js_gfx_GFXBinding_set_name));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBinding_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBinding>(cls);

    __jsb_cocos2d_GFXBinding_proto = cls->getProto();
    __jsb_cocos2d_GFXBinding_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBindingLayoutInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBindingLayoutInfo_class = nullptr;

static bool js_gfx_GFXBindingLayoutInfo_get_bindings(se::State& s)
{
    cocos2d::GFXBindingLayoutInfo* cobj = (cocos2d::GFXBindingLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayoutInfo_get_bindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->bindings, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingLayoutInfo_get_bindings)

static bool js_gfx_GFXBindingLayoutInfo_set_bindings(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBindingLayoutInfo* cobj = (cocos2d::GFXBindingLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayoutInfo_set_bindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXBinding> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayoutInfo_set_bindings : Error processing new value");
    cobj->bindings = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingLayoutInfo_set_bindings)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBindingLayoutInfo_finalize)

static bool js_gfx_GFXBindingLayoutInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXBindingLayoutInfo* cobj = JSB_ALLOC(cocos2d::GFXBindingLayoutInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cocos2d::GFXBindingLayoutInfo* cobj = JSB_ALLOC(cocos2d::GFXBindingLayoutInfo);
        std::vector<cocos2d::GFXBinding> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->bindings = arg0;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBindingLayoutInfo_constructor, __jsb_cocos2d_GFXBindingLayoutInfo_class, js_cocos2d_GFXBindingLayoutInfo_finalize)




static bool js_cocos2d_GFXBindingLayoutInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBindingLayoutInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBindingLayoutInfo* cobj = (cocos2d::GFXBindingLayoutInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBindingLayoutInfo_finalize)

bool js_register_gfx_GFXBindingLayoutInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXBindingLayoutInfo", obj, nullptr, _SE(js_gfx_GFXBindingLayoutInfo_constructor));

    cls->defineProperty("bindings", _SE(js_gfx_GFXBindingLayoutInfo_get_bindings), _SE(js_gfx_GFXBindingLayoutInfo_set_bindings));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBindingLayoutInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBindingLayoutInfo>(cls);

    __jsb_cocos2d_GFXBindingLayoutInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXBindingLayoutInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBindingUnit_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBindingUnit_class = nullptr;

static bool js_gfx_GFXBindingUnit_get_binding(se::State& s)
{
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->binding, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_binding)

static bool js_gfx_GFXBindingUnit_set_binding(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_binding : Error processing new value");
    cobj->binding = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_binding)

static bool js_gfx_GFXBindingUnit_get_type(se::State& s)
{
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_type)

static bool js_gfx_GFXBindingUnit_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBindingType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBindingType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_type)

static bool js_gfx_GFXBindingUnit_get_name(se::State& s)
{
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_name)

static bool js_gfx_GFXBindingUnit_set_name(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_name)

static bool js_gfx_GFXBindingUnit_get_buffer(se::State& s)
{
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->buffer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_buffer)

static bool js_gfx_GFXBindingUnit_set_buffer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBuffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_buffer : Error processing new value");
    cobj->buffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_buffer)

static bool js_gfx_GFXBindingUnit_get_texView(se::State& s)
{
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_texView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texView, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_texView)

static bool js_gfx_GFXBindingUnit_set_texView(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_texView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureView* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_texView : Error processing new value");
    cobj->texView = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_texView)

static bool js_gfx_GFXBindingUnit_get_sampler(se::State& s)
{
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_sampler : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->sampler, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_sampler)

static bool js_gfx_GFXBindingUnit_set_sampler(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_sampler : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXSampler* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_sampler : Error processing new value");
    cobj->sampler = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_sampler)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBindingUnit_finalize)

static bool js_gfx_GFXBindingUnit_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXBindingUnit* cobj = JSB_ALLOC(cocos2d::GFXBindingUnit);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXBindingUnit* cobj = JSB_ALLOC(cocos2d::GFXBindingUnit);
        unsigned int arg0 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->binding = arg0;
        }
        cocos2d::GFXBindingType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXBindingType)tmp; } while(false);
            cobj->type = arg1;
        }
        cocos2d::String arg2;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg2 = field.toStringForce().c_str();
            cobj->name = arg2;
        }
        cocos2d::GFXBuffer* arg3 = nullptr;
        json->getProperty("buffer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg3);
            cobj->buffer = arg3;
        }
        cocos2d::GFXTextureView* arg4 = nullptr;
        json->getProperty("texView", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg4);
            cobj->texView = arg4;
        }
        cocos2d::GFXSampler* arg5 = nullptr;
        json->getProperty("sampler", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg5);
            cobj->sampler = arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        cocos2d::GFXBindingUnit* cobj = JSB_ALLOC(cocos2d::GFXBindingUnit);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->binding = arg0;
        }
        cocos2d::GFXBindingType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXBindingType)tmp; } while(false);
            cobj->type = arg1;
        }
        cocos2d::String arg2;
        if (!args[2].isUndefined()) {
            arg2 = args[2].toStringForce().c_str();
            cobj->name = arg2;
        }
        cocos2d::GFXBuffer* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_native_ptr(args[3], &arg3);
            cobj->buffer = arg3;
        }
        cocos2d::GFXTextureView* arg4 = nullptr;
        if (!args[4].isUndefined()) {
            ok &= seval_to_native_ptr(args[4], &arg4);
            cobj->texView = arg4;
        }
        cocos2d::GFXSampler* arg5 = nullptr;
        if (!args[5].isUndefined()) {
            ok &= seval_to_native_ptr(args[5], &arg5);
            cobj->sampler = arg5;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBindingUnit_constructor, __jsb_cocos2d_GFXBindingUnit_class, js_cocos2d_GFXBindingUnit_finalize)




static bool js_cocos2d_GFXBindingUnit_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBindingUnit)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBindingUnit_finalize)

bool js_register_gfx_GFXBindingUnit(se::Object* obj)
{
    auto cls = se::Class::create("GFXBindingUnit", obj, nullptr, _SE(js_gfx_GFXBindingUnit_constructor));

    cls->defineProperty("binding", _SE(js_gfx_GFXBindingUnit_get_binding), _SE(js_gfx_GFXBindingUnit_set_binding));
    cls->defineProperty("type", _SE(js_gfx_GFXBindingUnit_get_type), _SE(js_gfx_GFXBindingUnit_set_type));
    cls->defineProperty("name", _SE(js_gfx_GFXBindingUnit_get_name), _SE(js_gfx_GFXBindingUnit_set_name));
    cls->defineProperty("buffer", _SE(js_gfx_GFXBindingUnit_get_buffer), _SE(js_gfx_GFXBindingUnit_set_buffer));
    cls->defineProperty("texView", _SE(js_gfx_GFXBindingUnit_get_texView), _SE(js_gfx_GFXBindingUnit_set_texView));
    cls->defineProperty("sampler", _SE(js_gfx_GFXBindingUnit_get_sampler), _SE(js_gfx_GFXBindingUnit_set_sampler));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBindingUnit_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBindingUnit>(cls);

    __jsb_cocos2d_GFXBindingUnit_proto = cls->getProto();
    __jsb_cocos2d_GFXBindingUnit_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXPushConstantRange_proto = nullptr;
se::Class* __jsb_cocos2d_GFXPushConstantRange_class = nullptr;

static bool js_gfx_GFXPushConstantRange_get_shaderType(se::State& s)
{
    cocos2d::GFXPushConstantRange* cobj = (cocos2d::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_get_shaderType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shaderType, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPushConstantRange_get_shaderType)

static bool js_gfx_GFXPushConstantRange_set_shaderType(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPushConstantRange* cobj = (cocos2d::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_set_shaderType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPushConstantRange_set_shaderType : Error processing new value");
    cobj->shaderType = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPushConstantRange_set_shaderType)

static bool js_gfx_GFXPushConstantRange_get_offset(se::State& s)
{
    cocos2d::GFXPushConstantRange* cobj = (cocos2d::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_get_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->offset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPushConstantRange_get_offset)

static bool js_gfx_GFXPushConstantRange_set_offset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPushConstantRange* cobj = (cocos2d::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_set_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPushConstantRange_set_offset : Error processing new value");
    cobj->offset = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPushConstantRange_set_offset)

static bool js_gfx_GFXPushConstantRange_get_count(se::State& s)
{
    cocos2d::GFXPushConstantRange* cobj = (cocos2d::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPushConstantRange_get_count)

static bool js_gfx_GFXPushConstantRange_set_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPushConstantRange* cobj = (cocos2d::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPushConstantRange_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPushConstantRange_set_count)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXPushConstantRange_finalize)

static bool js_gfx_GFXPushConstantRange_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXPushConstantRange* cobj = JSB_ALLOC(cocos2d::GFXPushConstantRange);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXPushConstantRange* cobj = JSB_ALLOC(cocos2d::GFXPushConstantRange);
        cocos2d::GFXShaderType arg0;
        json->getProperty("shaderType", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
            cobj->shaderType = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("offset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->offset = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("count", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->count = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXPushConstantRange* cobj = JSB_ALLOC(cocos2d::GFXPushConstantRange);
        cocos2d::GFXShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
            cobj->shaderType = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->offset = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->count = arg2;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXPushConstantRange_constructor, __jsb_cocos2d_GFXPushConstantRange_class, js_cocos2d_GFXPushConstantRange_finalize)




static bool js_cocos2d_GFXPushConstantRange_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXPushConstantRange)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXPushConstantRange* cobj = (cocos2d::GFXPushConstantRange*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXPushConstantRange_finalize)

bool js_register_gfx_GFXPushConstantRange(se::Object* obj)
{
    auto cls = se::Class::create("GFXPushConstantRange", obj, nullptr, _SE(js_gfx_GFXPushConstantRange_constructor));

    cls->defineProperty("shaderType", _SE(js_gfx_GFXPushConstantRange_get_shaderType), _SE(js_gfx_GFXPushConstantRange_set_shaderType));
    cls->defineProperty("offset", _SE(js_gfx_GFXPushConstantRange_get_offset), _SE(js_gfx_GFXPushConstantRange_set_offset));
    cls->defineProperty("count", _SE(js_gfx_GFXPushConstantRange_get_count), _SE(js_gfx_GFXPushConstantRange_set_count));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXPushConstantRange_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXPushConstantRange>(cls);

    __jsb_cocos2d_GFXPushConstantRange_proto = cls->getProto();
    __jsb_cocos2d_GFXPushConstantRange_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXPipelineLayoutInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXPipelineLayoutInfo_class = nullptr;

static bool js_gfx_GFXPipelineLayoutInfo_get_pushConstantsRanges(se::State& s)
{
    cocos2d::GFXPipelineLayoutInfo* cobj = (cocos2d::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_get_pushConstantsRanges : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->pushConstantsRanges, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineLayoutInfo_get_pushConstantsRanges)

static bool js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineLayoutInfo* cobj = (cocos2d::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXPushConstantRange> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges : Error processing new value");
    cobj->pushConstantsRanges = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges)

static bool js_gfx_GFXPipelineLayoutInfo_get_layouts(se::State& s)
{
    cocos2d::GFXPipelineLayoutInfo* cobj = (cocos2d::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_get_layouts : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->layouts, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineLayoutInfo_get_layouts)

static bool js_gfx_GFXPipelineLayoutInfo_set_layouts(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineLayoutInfo* cobj = (cocos2d::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_set_layouts : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXBindingLayout *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayoutInfo_set_layouts : Error processing new value");
    cobj->layouts = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineLayoutInfo_set_layouts)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXPipelineLayoutInfo_finalize)

static bool js_gfx_GFXPipelineLayoutInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXPipelineLayoutInfo* cobj = JSB_ALLOC(cocos2d::GFXPipelineLayoutInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXPipelineLayoutInfo* cobj = JSB_ALLOC(cocos2d::GFXPipelineLayoutInfo);
        std::vector<cocos2d::GFXPushConstantRange> arg0;
        json->getProperty("pushConstantsRanges", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg0);
            cobj->pushConstantsRanges = arg0;
        }
        std::vector<cocos2d::GFXBindingLayout *> arg1;
        json->getProperty("layouts", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->layouts = arg1;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 2)
    {
        cocos2d::GFXPipelineLayoutInfo* cobj = JSB_ALLOC(cocos2d::GFXPipelineLayoutInfo);
        std::vector<cocos2d::GFXPushConstantRange> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->pushConstantsRanges = arg0;
        }
        std::vector<cocos2d::GFXBindingLayout *> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->layouts = arg1;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXPipelineLayoutInfo_constructor, __jsb_cocos2d_GFXPipelineLayoutInfo_class, js_cocos2d_GFXPipelineLayoutInfo_finalize)




static bool js_cocos2d_GFXPipelineLayoutInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXPipelineLayoutInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXPipelineLayoutInfo* cobj = (cocos2d::GFXPipelineLayoutInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXPipelineLayoutInfo_finalize)

bool js_register_gfx_GFXPipelineLayoutInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineLayoutInfo", obj, nullptr, _SE(js_gfx_GFXPipelineLayoutInfo_constructor));

    cls->defineProperty("pushConstantsRanges", _SE(js_gfx_GFXPipelineLayoutInfo_get_pushConstantsRanges), _SE(js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges));
    cls->defineProperty("layouts", _SE(js_gfx_GFXPipelineLayoutInfo_get_layouts), _SE(js_gfx_GFXPipelineLayoutInfo_set_layouts));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXPipelineLayoutInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXPipelineLayoutInfo>(cls);

    __jsb_cocos2d_GFXPipelineLayoutInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXPipelineLayoutInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXInputState_proto = nullptr;
se::Class* __jsb_cocos2d_GFXInputState_class = nullptr;

static bool js_gfx_GFXInputState_get_attributes(se::State& s)
{
    cocos2d::GFXInputState* cobj = (cocos2d::GFXInputState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputState_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->attributes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputState_get_attributes)

static bool js_gfx_GFXInputState_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXInputState* cobj = (cocos2d::GFXInputState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputState_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXAttribute> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputState_set_attributes : Error processing new value");
    cobj->attributes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputState_set_attributes)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXInputState_finalize)

static bool js_gfx_GFXInputState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXInputState* cobj = JSB_ALLOC(cocos2d::GFXInputState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cocos2d::GFXInputState* cobj = JSB_ALLOC(cocos2d::GFXInputState);
        std::vector<cocos2d::GFXAttribute> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->attributes = arg0;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXInputState_constructor, __jsb_cocos2d_GFXInputState_class, js_cocos2d_GFXInputState_finalize)




static bool js_cocos2d_GFXInputState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXInputState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXInputState* cobj = (cocos2d::GFXInputState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXInputState_finalize)

bool js_register_gfx_GFXInputState(se::Object* obj)
{
    auto cls = se::Class::create("GFXInputState", obj, nullptr, _SE(js_gfx_GFXInputState_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_GFXInputState_get_attributes), _SE(js_gfx_GFXInputState_set_attributes));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXInputState_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXInputState>(cls);

    __jsb_cocos2d_GFXInputState_proto = cls->getProto();
    __jsb_cocos2d_GFXInputState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXRasterizerState_proto = nullptr;
se::Class* __jsb_cocos2d_GFXRasterizerState_class = nullptr;

static bool js_gfx_GFXRasterizerState_get_isDiscard(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isDiscard, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_isDiscard)

static bool js_gfx_GFXRasterizerState_set_isDiscard(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_isDiscard : Error processing new value");
    cobj->isDiscard = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_isDiscard)

static bool js_gfx_GFXRasterizerState_get_polygonMode(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->polygonMode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_polygonMode)

static bool js_gfx_GFXRasterizerState_set_polygonMode(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXPolygonMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXPolygonMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_polygonMode : Error processing new value");
    cobj->polygonMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_polygonMode)

static bool js_gfx_GFXRasterizerState_get_shadeModel(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shadeModel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_shadeModel)

static bool js_gfx_GFXRasterizerState_set_shadeModel(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXShadeModel arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXShadeModel)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_shadeModel : Error processing new value");
    cobj->shadeModel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_shadeModel)

static bool js_gfx_GFXRasterizerState_get_cullMode(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->cullMode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_cullMode)

static bool js_gfx_GFXRasterizerState_set_cullMode(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXCullMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXCullMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_cullMode : Error processing new value");
    cobj->cullMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_cullMode)

static bool js_gfx_GFXRasterizerState_get_isFrontFaceCCW(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isFrontFaceCCW, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_isFrontFaceCCW)

static bool js_gfx_GFXRasterizerState_set_isFrontFaceCCW(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_isFrontFaceCCW : Error processing new value");
    cobj->isFrontFaceCCW = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_isFrontFaceCCW)

static bool js_gfx_GFXRasterizerState_get_depthBias(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->depthBias, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_depthBias)

static bool js_gfx_GFXRasterizerState_set_depthBias(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_depthBias : Error processing new value");
    cobj->depthBias = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_depthBias)

static bool js_gfx_GFXRasterizerState_get_depthBiasClamp(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->depthBiasClamp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_depthBiasClamp)

static bool js_gfx_GFXRasterizerState_set_depthBiasClamp(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_depthBiasClamp : Error processing new value");
    cobj->depthBiasClamp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_depthBiasClamp)

static bool js_gfx_GFXRasterizerState_get_depthBiasSlop(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->depthBiasSlop, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_depthBiasSlop)

static bool js_gfx_GFXRasterizerState_set_depthBiasSlop(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_depthBiasSlop : Error processing new value");
    cobj->depthBiasSlop = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_depthBiasSlop)

static bool js_gfx_GFXRasterizerState_get_isDepthClip(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isDepthClip, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_isDepthClip)

static bool js_gfx_GFXRasterizerState_set_isDepthClip(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_isDepthClip : Error processing new value");
    cobj->isDepthClip = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_isDepthClip)

static bool js_gfx_GFXRasterizerState_get_isMultisample(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isMultisample, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_isMultisample)

static bool js_gfx_GFXRasterizerState_set_isMultisample(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_isMultisample : Error processing new value");
    cobj->isMultisample = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_isMultisample)

static bool js_gfx_GFXRasterizerState_get_lineWidth(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->lineWidth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_lineWidth)

static bool js_gfx_GFXRasterizerState_set_lineWidth(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_lineWidth : Error processing new value");
    cobj->lineWidth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_lineWidth)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXRasterizerState_finalize)

static bool js_gfx_GFXRasterizerState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXRasterizerState* cobj = JSB_ALLOC(cocos2d::GFXRasterizerState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXRasterizerState* cobj = JSB_ALLOC(cocos2d::GFXRasterizerState);
        bool arg0;
        json->getProperty("isDiscard", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg0);
            cobj->isDiscard = arg0;
        }
        cocos2d::GFXPolygonMode arg1;
        json->getProperty("polygonMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXPolygonMode)tmp; } while(false);
            cobj->polygonMode = arg1;
        }
        cocos2d::GFXShadeModel arg2;
        json->getProperty("shadeModel", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXShadeModel)tmp; } while(false);
            cobj->shadeModel = arg2;
        }
        cocos2d::GFXCullMode arg3;
        json->getProperty("cullMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXCullMode)tmp; } while(false);
            cobj->cullMode = arg3;
        }
        bool arg4;
        json->getProperty("isFrontFaceCCW", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg4);
            cobj->isFrontFaceCCW = arg4;
        }
        float arg5 = 0;
        json->getProperty("depthBias", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg5);
            cobj->depthBias = arg5;
        }
        float arg6 = 0;
        json->getProperty("depthBiasClamp", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg6);
            cobj->depthBiasClamp = arg6;
        }
        float arg7 = 0;
        json->getProperty("depthBiasSlop", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg7);
            cobj->depthBiasSlop = arg7;
        }
        bool arg8;
        json->getProperty("isDepthClip", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg8);
            cobj->isDepthClip = arg8;
        }
        bool arg9;
        json->getProperty("isMultisample", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg9);
            cobj->isMultisample = arg9;
        }
        float arg10 = 0;
        json->getProperty("lineWidth", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg10);
            cobj->lineWidth = arg10;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 11)
    {
        cocos2d::GFXRasterizerState* cobj = JSB_ALLOC(cocos2d::GFXRasterizerState);
        bool arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->isDiscard = arg0;
        }
        cocos2d::GFXPolygonMode arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXPolygonMode)tmp; } while(false);
            cobj->polygonMode = arg1;
        }
        cocos2d::GFXShadeModel arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXShadeModel)tmp; } while(false);
            cobj->shadeModel = arg2;
        }
        cocos2d::GFXCullMode arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXCullMode)tmp; } while(false);
            cobj->cullMode = arg3;
        }
        bool arg4;
        if (!args[4].isUndefined()) {
            ok &= seval_to_boolean(args[4], &arg4);
            cobj->isFrontFaceCCW = arg4;
        }
        float arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_float(args[5], &arg5);
            cobj->depthBias = arg5;
        }
        float arg6 = 0;
        if (!args[6].isUndefined()) {
            ok &= seval_to_float(args[6], &arg6);
            cobj->depthBiasClamp = arg6;
        }
        float arg7 = 0;
        if (!args[7].isUndefined()) {
            ok &= seval_to_float(args[7], &arg7);
            cobj->depthBiasSlop = arg7;
        }
        bool arg8;
        if (!args[8].isUndefined()) {
            ok &= seval_to_boolean(args[8], &arg8);
            cobj->isDepthClip = arg8;
        }
        bool arg9;
        if (!args[9].isUndefined()) {
            ok &= seval_to_boolean(args[9], &arg9);
            cobj->isMultisample = arg9;
        }
        float arg10 = 0;
        if (!args[10].isUndefined()) {
            ok &= seval_to_float(args[10], &arg10);
            cobj->lineWidth = arg10;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXRasterizerState_constructor, __jsb_cocos2d_GFXRasterizerState_class, js_cocos2d_GFXRasterizerState_finalize)




static bool js_cocos2d_GFXRasterizerState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXRasterizerState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXRasterizerState_finalize)

bool js_register_gfx_GFXRasterizerState(se::Object* obj)
{
    auto cls = se::Class::create("GFXRasterizerState", obj, nullptr, _SE(js_gfx_GFXRasterizerState_constructor));

    cls->defineProperty("isDiscard", _SE(js_gfx_GFXRasterizerState_get_isDiscard), _SE(js_gfx_GFXRasterizerState_set_isDiscard));
    cls->defineProperty("polygonMode", _SE(js_gfx_GFXRasterizerState_get_polygonMode), _SE(js_gfx_GFXRasterizerState_set_polygonMode));
    cls->defineProperty("shadeModel", _SE(js_gfx_GFXRasterizerState_get_shadeModel), _SE(js_gfx_GFXRasterizerState_set_shadeModel));
    cls->defineProperty("cullMode", _SE(js_gfx_GFXRasterizerState_get_cullMode), _SE(js_gfx_GFXRasterizerState_set_cullMode));
    cls->defineProperty("isFrontFaceCCW", _SE(js_gfx_GFXRasterizerState_get_isFrontFaceCCW), _SE(js_gfx_GFXRasterizerState_set_isFrontFaceCCW));
    cls->defineProperty("depthBias", _SE(js_gfx_GFXRasterizerState_get_depthBias), _SE(js_gfx_GFXRasterizerState_set_depthBias));
    cls->defineProperty("depthBiasClamp", _SE(js_gfx_GFXRasterizerState_get_depthBiasClamp), _SE(js_gfx_GFXRasterizerState_set_depthBiasClamp));
    cls->defineProperty("depthBiasSlop", _SE(js_gfx_GFXRasterizerState_get_depthBiasSlop), _SE(js_gfx_GFXRasterizerState_set_depthBiasSlop));
    cls->defineProperty("isDepthClip", _SE(js_gfx_GFXRasterizerState_get_isDepthClip), _SE(js_gfx_GFXRasterizerState_set_isDepthClip));
    cls->defineProperty("isMultisample", _SE(js_gfx_GFXRasterizerState_get_isMultisample), _SE(js_gfx_GFXRasterizerState_set_isMultisample));
    cls->defineProperty("lineWidth", _SE(js_gfx_GFXRasterizerState_get_lineWidth), _SE(js_gfx_GFXRasterizerState_set_lineWidth));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXRasterizerState_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXRasterizerState>(cls);

    __jsb_cocos2d_GFXRasterizerState_proto = cls->getProto();
    __jsb_cocos2d_GFXRasterizerState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXDepthStencilState_proto = nullptr;
se::Class* __jsb_cocos2d_GFXDepthStencilState_class = nullptr;

static bool js_gfx_GFXDepthStencilState_get_depthTest(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->depthTest, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_depthTest)

static bool js_gfx_GFXDepthStencilState_set_depthTest(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_depthTest : Error processing new value");
    cobj->depthTest = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_depthTest)

static bool js_gfx_GFXDepthStencilState_get_depthWrite(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->depthWrite, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_depthWrite)

static bool js_gfx_GFXDepthStencilState_set_depthWrite(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_depthWrite : Error processing new value");
    cobj->depthWrite = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_depthWrite)

static bool js_gfx_GFXDepthStencilState_get_depthFunc(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depthFunc, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_depthFunc)

static bool js_gfx_GFXDepthStencilState_set_depthFunc(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_depthFunc : Error processing new value");
    cobj->depthFunc = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_depthFunc)

static bool js_gfx_GFXDepthStencilState_get_stencilTestFront(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->stencilTestFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilTestFront)

static bool js_gfx_GFXDepthStencilState_set_stencilTestFront(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilTestFront : Error processing new value");
    cobj->stencilTestFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilTestFront)

static bool js_gfx_GFXDepthStencilState_get_stencilFuncFront(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilFuncFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilFuncFront)

static bool js_gfx_GFXDepthStencilState_set_stencilFuncFront(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilFuncFront : Error processing new value");
    cobj->stencilFuncFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilFuncFront)

static bool js_gfx_GFXDepthStencilState_get_stencilReadMaskFront(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilReadMaskFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilReadMaskFront)

static bool js_gfx_GFXDepthStencilState_set_stencilReadMaskFront(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilReadMaskFront : Error processing new value");
    cobj->stencilReadMaskFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilReadMaskFront)

static bool js_gfx_GFXDepthStencilState_get_stencilWriteMaskFront(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilWriteMaskFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilWriteMaskFront)

static bool js_gfx_GFXDepthStencilState_set_stencilWriteMaskFront(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilWriteMaskFront : Error processing new value");
    cobj->stencilWriteMaskFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilWriteMaskFront)

static bool js_gfx_GFXDepthStencilState_get_stencilFailOpFront(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilFailOpFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilFailOpFront)

static bool js_gfx_GFXDepthStencilState_set_stencilFailOpFront(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilFailOpFront : Error processing new value");
    cobj->stencilFailOpFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilFailOpFront)

static bool js_gfx_GFXDepthStencilState_get_stencilZFailOpFront(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilZFailOpFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilZFailOpFront)

static bool js_gfx_GFXDepthStencilState_set_stencilZFailOpFront(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilZFailOpFront : Error processing new value");
    cobj->stencilZFailOpFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilZFailOpFront)

static bool js_gfx_GFXDepthStencilState_get_stencilPassOpFront(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilPassOpFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilPassOpFront)

static bool js_gfx_GFXDepthStencilState_set_stencilPassOpFront(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilPassOpFront : Error processing new value");
    cobj->stencilPassOpFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilPassOpFront)

static bool js_gfx_GFXDepthStencilState_get_stencilRefFront(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilRefFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilRefFront)

static bool js_gfx_GFXDepthStencilState_set_stencilRefFront(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilRefFront : Error processing new value");
    cobj->stencilRefFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilRefFront)

static bool js_gfx_GFXDepthStencilState_get_stencilTestBack(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->stencilTestBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilTestBack)

static bool js_gfx_GFXDepthStencilState_set_stencilTestBack(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilTestBack : Error processing new value");
    cobj->stencilTestBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilTestBack)

static bool js_gfx_GFXDepthStencilState_get_stencilFuncBack(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilFuncBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilFuncBack)

static bool js_gfx_GFXDepthStencilState_set_stencilFuncBack(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilFuncBack : Error processing new value");
    cobj->stencilFuncBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilFuncBack)

static bool js_gfx_GFXDepthStencilState_get_stencilReadMaskBack(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilReadMaskBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilReadMaskBack)

static bool js_gfx_GFXDepthStencilState_set_stencilReadMaskBack(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilReadMaskBack : Error processing new value");
    cobj->stencilReadMaskBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilReadMaskBack)

static bool js_gfx_GFXDepthStencilState_get_stencilWriteMaskBack(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilWriteMaskBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilWriteMaskBack)

static bool js_gfx_GFXDepthStencilState_set_stencilWriteMaskBack(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilWriteMaskBack : Error processing new value");
    cobj->stencilWriteMaskBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilWriteMaskBack)

static bool js_gfx_GFXDepthStencilState_get_stencilFailOpBack(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilFailOpBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilFailOpBack)

static bool js_gfx_GFXDepthStencilState_set_stencilFailOpBack(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilFailOpBack : Error processing new value");
    cobj->stencilFailOpBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilFailOpBack)

static bool js_gfx_GFXDepthStencilState_get_stencilZFailOpBack(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilZFailOpBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilZFailOpBack)

static bool js_gfx_GFXDepthStencilState_set_stencilZFailOpBack(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilZFailOpBack : Error processing new value");
    cobj->stencilZFailOpBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilZFailOpBack)

static bool js_gfx_GFXDepthStencilState_get_stencilPassOpBack(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilPassOpBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilPassOpBack)

static bool js_gfx_GFXDepthStencilState_set_stencilPassOpBack(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilPassOpBack : Error processing new value");
    cobj->stencilPassOpBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilPassOpBack)

static bool js_gfx_GFXDepthStencilState_get_stencilRefBack(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilRefBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencilRefBack)

static bool js_gfx_GFXDepthStencilState_set_stencilRefBack(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilRefBack : Error processing new value");
    cobj->stencilRefBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilRefBack)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXDepthStencilState_finalize)

static bool js_gfx_GFXDepthStencilState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXDepthStencilState* cobj = JSB_ALLOC(cocos2d::GFXDepthStencilState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXDepthStencilState* cobj = JSB_ALLOC(cocos2d::GFXDepthStencilState);
        bool arg0;
        json->getProperty("depthTest", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg0);
            cobj->depthTest = arg0;
        }
        bool arg1;
        json->getProperty("depthWrite", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg1);
            cobj->depthWrite = arg1;
        }
        cocos2d::GFXComparisonFunc arg2;
        json->getProperty("depthFunc", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
            cobj->depthFunc = arg2;
        }
        bool arg3;
        json->getProperty("stencilTestFront", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg3);
            cobj->stencilTestFront = arg3;
        }
        cocos2d::GFXComparisonFunc arg4;
        json->getProperty("stencilFuncFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
            cobj->stencilFuncFront = arg4;
        }
        unsigned int arg5 = 0;
        json->getProperty("stencilReadMaskFront", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg5);
            cobj->stencilReadMaskFront = arg5;
        }
        unsigned int arg6 = 0;
        json->getProperty("stencilWriteMaskFront", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg6);
            cobj->stencilWriteMaskFront = arg6;
        }
        cocos2d::GFXStencilOp arg7;
        json->getProperty("stencilFailOpFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilFailOpFront = arg7;
        }
        cocos2d::GFXStencilOp arg8;
        json->getProperty("stencilZFailOpFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilZFailOpFront = arg8;
        }
        cocos2d::GFXStencilOp arg9;
        json->getProperty("stencilPassOpFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilPassOpFront = arg9;
        }
        unsigned int arg10 = 0;
        json->getProperty("stencilRefFront", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg10);
            cobj->stencilRefFront = arg10;
        }
        bool arg11;
        json->getProperty("stencilTestBack", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg11);
            cobj->stencilTestBack = arg11;
        }
        cocos2d::GFXComparisonFunc arg12;
        json->getProperty("stencilFuncBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg12 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
            cobj->stencilFuncBack = arg12;
        }
        unsigned int arg13 = 0;
        json->getProperty("stencilReadMaskBack", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg13);
            cobj->stencilReadMaskBack = arg13;
        }
        unsigned int arg14 = 0;
        json->getProperty("stencilWriteMaskBack", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg14);
            cobj->stencilWriteMaskBack = arg14;
        }
        cocos2d::GFXStencilOp arg15;
        json->getProperty("stencilFailOpBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg15 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilFailOpBack = arg15;
        }
        cocos2d::GFXStencilOp arg16;
        json->getProperty("stencilZFailOpBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg16 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilZFailOpBack = arg16;
        }
        cocos2d::GFXStencilOp arg17;
        json->getProperty("stencilPassOpBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg17 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilPassOpBack = arg17;
        }
        unsigned int arg18 = 0;
        json->getProperty("stencilRefBack", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg18);
            cobj->stencilRefBack = arg18;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 19)
    {
        cocos2d::GFXDepthStencilState* cobj = JSB_ALLOC(cocos2d::GFXDepthStencilState);
        bool arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->depthTest = arg0;
        }
        bool arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_boolean(args[1], &arg1);
            cobj->depthWrite = arg1;
        }
        cocos2d::GFXComparisonFunc arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
            cobj->depthFunc = arg2;
        }
        bool arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_boolean(args[3], &arg3);
            cobj->stencilTestFront = arg3;
        }
        cocos2d::GFXComparisonFunc arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
            cobj->stencilFuncFront = arg4;
        }
        unsigned int arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
            cobj->stencilReadMaskFront = arg5;
        }
        unsigned int arg6 = 0;
        if (!args[6].isUndefined()) {
            ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
            cobj->stencilWriteMaskFront = arg6;
        }
        cocos2d::GFXStencilOp arg7;
        if (!args[7].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilFailOpFront = arg7;
        }
        cocos2d::GFXStencilOp arg8;
        if (!args[8].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilZFailOpFront = arg8;
        }
        cocos2d::GFXStencilOp arg9;
        if (!args[9].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilPassOpFront = arg9;
        }
        unsigned int arg10 = 0;
        if (!args[10].isUndefined()) {
            ok &= seval_to_uint32(args[10], (uint32_t*)&arg10);
            cobj->stencilRefFront = arg10;
        }
        bool arg11;
        if (!args[11].isUndefined()) {
            ok &= seval_to_boolean(args[11], &arg11);
            cobj->stencilTestBack = arg11;
        }
        cocos2d::GFXComparisonFunc arg12;
        if (!args[12].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[12], &tmp); arg12 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
            cobj->stencilFuncBack = arg12;
        }
        unsigned int arg13 = 0;
        if (!args[13].isUndefined()) {
            ok &= seval_to_uint32(args[13], (uint32_t*)&arg13);
            cobj->stencilReadMaskBack = arg13;
        }
        unsigned int arg14 = 0;
        if (!args[14].isUndefined()) {
            ok &= seval_to_uint32(args[14], (uint32_t*)&arg14);
            cobj->stencilWriteMaskBack = arg14;
        }
        cocos2d::GFXStencilOp arg15;
        if (!args[15].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[15], &tmp); arg15 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilFailOpBack = arg15;
        }
        cocos2d::GFXStencilOp arg16;
        if (!args[16].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[16], &tmp); arg16 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilZFailOpBack = arg16;
        }
        cocos2d::GFXStencilOp arg17;
        if (!args[17].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[17], &tmp); arg17 = (cocos2d::GFXStencilOp)tmp; } while(false);
            cobj->stencilPassOpBack = arg17;
        }
        unsigned int arg18 = 0;
        if (!args[18].isUndefined()) {
            ok &= seval_to_uint32(args[18], (uint32_t*)&arg18);
            cobj->stencilRefBack = arg18;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXDepthStencilState_constructor, __jsb_cocos2d_GFXDepthStencilState_class, js_cocos2d_GFXDepthStencilState_finalize)




static bool js_cocos2d_GFXDepthStencilState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXDepthStencilState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXDepthStencilState_finalize)

bool js_register_gfx_GFXDepthStencilState(se::Object* obj)
{
    auto cls = se::Class::create("GFXDepthStencilState", obj, nullptr, _SE(js_gfx_GFXDepthStencilState_constructor));

    cls->defineProperty("depthTest", _SE(js_gfx_GFXDepthStencilState_get_depthTest), _SE(js_gfx_GFXDepthStencilState_set_depthTest));
    cls->defineProperty("depthWrite", _SE(js_gfx_GFXDepthStencilState_get_depthWrite), _SE(js_gfx_GFXDepthStencilState_set_depthWrite));
    cls->defineProperty("depthFunc", _SE(js_gfx_GFXDepthStencilState_get_depthFunc), _SE(js_gfx_GFXDepthStencilState_set_depthFunc));
    cls->defineProperty("stencilTestFront", _SE(js_gfx_GFXDepthStencilState_get_stencilTestFront), _SE(js_gfx_GFXDepthStencilState_set_stencilTestFront));
    cls->defineProperty("stencilFuncFront", _SE(js_gfx_GFXDepthStencilState_get_stencilFuncFront), _SE(js_gfx_GFXDepthStencilState_set_stencilFuncFront));
    cls->defineProperty("stencilReadMaskFront", _SE(js_gfx_GFXDepthStencilState_get_stencilReadMaskFront), _SE(js_gfx_GFXDepthStencilState_set_stencilReadMaskFront));
    cls->defineProperty("stencilWriteMaskFront", _SE(js_gfx_GFXDepthStencilState_get_stencilWriteMaskFront), _SE(js_gfx_GFXDepthStencilState_set_stencilWriteMaskFront));
    cls->defineProperty("stencilFailOpFront", _SE(js_gfx_GFXDepthStencilState_get_stencilFailOpFront), _SE(js_gfx_GFXDepthStencilState_set_stencilFailOpFront));
    cls->defineProperty("stencilZFailOpFront", _SE(js_gfx_GFXDepthStencilState_get_stencilZFailOpFront), _SE(js_gfx_GFXDepthStencilState_set_stencilZFailOpFront));
    cls->defineProperty("stencilPassOpFront", _SE(js_gfx_GFXDepthStencilState_get_stencilPassOpFront), _SE(js_gfx_GFXDepthStencilState_set_stencilPassOpFront));
    cls->defineProperty("stencilRefFront", _SE(js_gfx_GFXDepthStencilState_get_stencilRefFront), _SE(js_gfx_GFXDepthStencilState_set_stencilRefFront));
    cls->defineProperty("stencilTestBack", _SE(js_gfx_GFXDepthStencilState_get_stencilTestBack), _SE(js_gfx_GFXDepthStencilState_set_stencilTestBack));
    cls->defineProperty("stencilFuncBack", _SE(js_gfx_GFXDepthStencilState_get_stencilFuncBack), _SE(js_gfx_GFXDepthStencilState_set_stencilFuncBack));
    cls->defineProperty("stencilReadMaskBack", _SE(js_gfx_GFXDepthStencilState_get_stencilReadMaskBack), _SE(js_gfx_GFXDepthStencilState_set_stencilReadMaskBack));
    cls->defineProperty("stencilWriteMaskBack", _SE(js_gfx_GFXDepthStencilState_get_stencilWriteMaskBack), _SE(js_gfx_GFXDepthStencilState_set_stencilWriteMaskBack));
    cls->defineProperty("stencilFailOpBack", _SE(js_gfx_GFXDepthStencilState_get_stencilFailOpBack), _SE(js_gfx_GFXDepthStencilState_set_stencilFailOpBack));
    cls->defineProperty("stencilZFailOpBack", _SE(js_gfx_GFXDepthStencilState_get_stencilZFailOpBack), _SE(js_gfx_GFXDepthStencilState_set_stencilZFailOpBack));
    cls->defineProperty("stencilPassOpBack", _SE(js_gfx_GFXDepthStencilState_get_stencilPassOpBack), _SE(js_gfx_GFXDepthStencilState_set_stencilPassOpBack));
    cls->defineProperty("stencilRefBack", _SE(js_gfx_GFXDepthStencilState_get_stencilRefBack), _SE(js_gfx_GFXDepthStencilState_set_stencilRefBack));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXDepthStencilState_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXDepthStencilState>(cls);

    __jsb_cocos2d_GFXDepthStencilState_proto = cls->getProto();
    __jsb_cocos2d_GFXDepthStencilState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBlendTarget_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBlendTarget_class = nullptr;

static bool js_gfx_GFXBlendTarget_get_blend(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->blend, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blend)

static bool js_gfx_GFXBlendTarget_set_blend(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blend : Error processing new value");
    cobj->blend = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blend)

static bool js_gfx_GFXBlendTarget_get_blendSrc(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendSrc, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blendSrc)

static bool js_gfx_GFXBlendTarget_set_blendSrc(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendSrc : Error processing new value");
    cobj->blendSrc = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendSrc)

static bool js_gfx_GFXBlendTarget_get_blendDst(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendDst, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blendDst)

static bool js_gfx_GFXBlendTarget_set_blendDst(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendDst : Error processing new value");
    cobj->blendDst = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendDst)

static bool js_gfx_GFXBlendTarget_get_blendEq(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendEq, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blendEq)

static bool js_gfx_GFXBlendTarget_set_blendEq(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendEq : Error processing new value");
    cobj->blendEq = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendEq)

static bool js_gfx_GFXBlendTarget_get_blendSrcAlpha(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendSrcAlpha, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blendSrcAlpha)

static bool js_gfx_GFXBlendTarget_set_blendSrcAlpha(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendSrcAlpha : Error processing new value");
    cobj->blendSrcAlpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendSrcAlpha)

static bool js_gfx_GFXBlendTarget_get_blendDstAlpha(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendDstAlpha, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blendDstAlpha)

static bool js_gfx_GFXBlendTarget_set_blendDstAlpha(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendDstAlpha : Error processing new value");
    cobj->blendDstAlpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendDstAlpha)

static bool js_gfx_GFXBlendTarget_get_blendAlphaEq(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendAlphaEq, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blendAlphaEq)

static bool js_gfx_GFXBlendTarget_set_blendAlphaEq(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendAlphaEq : Error processing new value");
    cobj->blendAlphaEq = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendAlphaEq)

static bool js_gfx_GFXBlendTarget_get_blendColorMask(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendColorMask, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blendColorMask)

static bool js_gfx_GFXBlendTarget_set_blendColorMask(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXColorMask arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXColorMask)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendColorMask : Error processing new value");
    cobj->blendColorMask = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendColorMask)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBlendTarget_finalize)

static bool js_gfx_GFXBlendTarget_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXBlendTarget* cobj = JSB_ALLOC(cocos2d::GFXBlendTarget);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXBlendTarget* cobj = JSB_ALLOC(cocos2d::GFXBlendTarget);
        bool arg0;
        json->getProperty("blend", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg0);
            cobj->blend = arg0;
        }
        cocos2d::GFXBlendFactor arg1;
        json->getProperty("blendSrc", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXBlendFactor)tmp; } while(false);
            cobj->blendSrc = arg1;
        }
        cocos2d::GFXBlendFactor arg2;
        json->getProperty("blendDst", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXBlendFactor)tmp; } while(false);
            cobj->blendDst = arg2;
        }
        cocos2d::GFXBlendOp arg3;
        json->getProperty("blendEq", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXBlendOp)tmp; } while(false);
            cobj->blendEq = arg3;
        }
        cocos2d::GFXBlendFactor arg4;
        json->getProperty("blendSrcAlpha", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXBlendFactor)tmp; } while(false);
            cobj->blendSrcAlpha = arg4;
        }
        cocos2d::GFXBlendFactor arg5;
        json->getProperty("blendDstAlpha", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cocos2d::GFXBlendFactor)tmp; } while(false);
            cobj->blendDstAlpha = arg5;
        }
        cocos2d::GFXBlendOp arg6;
        json->getProperty("blendAlphaEq", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cocos2d::GFXBlendOp)tmp; } while(false);
            cobj->blendAlphaEq = arg6;
        }
        cocos2d::GFXColorMask arg7;
        json->getProperty("blendColorMask", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cocos2d::GFXColorMask)tmp; } while(false);
            cobj->blendColorMask = arg7;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 8)
    {
        cocos2d::GFXBlendTarget* cobj = JSB_ALLOC(cocos2d::GFXBlendTarget);
        bool arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->blend = arg0;
        }
        cocos2d::GFXBlendFactor arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXBlendFactor)tmp; } while(false);
            cobj->blendSrc = arg1;
        }
        cocos2d::GFXBlendFactor arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXBlendFactor)tmp; } while(false);
            cobj->blendDst = arg2;
        }
        cocos2d::GFXBlendOp arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXBlendOp)tmp; } while(false);
            cobj->blendEq = arg3;
        }
        cocos2d::GFXBlendFactor arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXBlendFactor)tmp; } while(false);
            cobj->blendSrcAlpha = arg4;
        }
        cocos2d::GFXBlendFactor arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::GFXBlendFactor)tmp; } while(false);
            cobj->blendDstAlpha = arg5;
        }
        cocos2d::GFXBlendOp arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cocos2d::GFXBlendOp)tmp; } while(false);
            cobj->blendAlphaEq = arg6;
        }
        cocos2d::GFXColorMask arg7;
        if (!args[7].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cocos2d::GFXColorMask)tmp; } while(false);
            cobj->blendColorMask = arg7;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBlendTarget_constructor, __jsb_cocos2d_GFXBlendTarget_class, js_cocos2d_GFXBlendTarget_finalize)




static bool js_cocos2d_GFXBlendTarget_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBlendTarget)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBlendTarget_finalize)

bool js_register_gfx_GFXBlendTarget(se::Object* obj)
{
    auto cls = se::Class::create("GFXBlendTarget", obj, nullptr, _SE(js_gfx_GFXBlendTarget_constructor));

    cls->defineProperty("blend", _SE(js_gfx_GFXBlendTarget_get_blend), _SE(js_gfx_GFXBlendTarget_set_blend));
    cls->defineProperty("blendSrc", _SE(js_gfx_GFXBlendTarget_get_blendSrc), _SE(js_gfx_GFXBlendTarget_set_blendSrc));
    cls->defineProperty("blendDst", _SE(js_gfx_GFXBlendTarget_get_blendDst), _SE(js_gfx_GFXBlendTarget_set_blendDst));
    cls->defineProperty("blendEq", _SE(js_gfx_GFXBlendTarget_get_blendEq), _SE(js_gfx_GFXBlendTarget_set_blendEq));
    cls->defineProperty("blendSrcAlpha", _SE(js_gfx_GFXBlendTarget_get_blendSrcAlpha), _SE(js_gfx_GFXBlendTarget_set_blendSrcAlpha));
    cls->defineProperty("blendDstAlpha", _SE(js_gfx_GFXBlendTarget_get_blendDstAlpha), _SE(js_gfx_GFXBlendTarget_set_blendDstAlpha));
    cls->defineProperty("blendAlphaEq", _SE(js_gfx_GFXBlendTarget_get_blendAlphaEq), _SE(js_gfx_GFXBlendTarget_set_blendAlphaEq));
    cls->defineProperty("blendColorMask", _SE(js_gfx_GFXBlendTarget_get_blendColorMask), _SE(js_gfx_GFXBlendTarget_set_blendColorMask));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBlendTarget_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBlendTarget>(cls);

    __jsb_cocos2d_GFXBlendTarget_proto = cls->getProto();
    __jsb_cocos2d_GFXBlendTarget_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBlendState_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBlendState_class = nullptr;

static bool js_gfx_GFXBlendState_get_isA2C(se::State& s)
{
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_get_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isA2C, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendState_get_isA2C)

static bool js_gfx_GFXBlendState_set_isA2C(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_isA2C : Error processing new value");
    cobj->isA2C = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendState_set_isA2C)

static bool js_gfx_GFXBlendState_get_isIndepend(se::State& s)
{
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_get_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isIndepend, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendState_get_isIndepend)

static bool js_gfx_GFXBlendState_set_isIndepend(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_isIndepend : Error processing new value");
    cobj->isIndepend = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendState_set_isIndepend)

static bool js_gfx_GFXBlendState_get_blendColor(se::State& s)
{
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_get_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->blendColor, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendState_get_blendColor)

static bool js_gfx_GFXBlendState_set_blendColor(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXColor* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_blendColor : Error processing new value");
    cobj->blendColor = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendState_set_blendColor)

static bool js_gfx_GFXBlendState_get_targets(se::State& s)
{
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_get_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->targets, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendState_get_targets)

static bool js_gfx_GFXBlendState_set_targets(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXBlendTarget> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_targets : Error processing new value");
    cobj->targets = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendState_set_targets)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBlendState_finalize)

static bool js_gfx_GFXBlendState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXBlendState* cobj = JSB_ALLOC(cocos2d::GFXBlendState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXBlendState* cobj = JSB_ALLOC(cocos2d::GFXBlendState);
        bool arg0;
        json->getProperty("isA2C", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg0);
            cobj->isA2C = arg0;
        }
        bool arg1;
        json->getProperty("isIndepend", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg1);
            cobj->isIndepend = arg1;
        }
        cocos2d::GFXColor* arg2 = nullptr;
        json->getProperty("blendColor", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->blendColor = *arg2;
        }
        std::vector<cocos2d::GFXBlendTarget> arg3;
        json->getProperty("targets", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg3);
            cobj->targets = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::GFXBlendState* cobj = JSB_ALLOC(cocos2d::GFXBlendState);
        bool arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->isA2C = arg0;
        }
        bool arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_boolean(args[1], &arg1);
            cobj->isIndepend = arg1;
        }
        cocos2d::GFXColor* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->blendColor = *arg2;
        }
        std::vector<cocos2d::GFXBlendTarget> arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_std_vector(args[3], &arg3);
            cobj->targets = arg3;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBlendState_constructor, __jsb_cocos2d_GFXBlendState_class, js_cocos2d_GFXBlendState_finalize)




static bool js_cocos2d_GFXBlendState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBlendState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBlendState_finalize)

bool js_register_gfx_GFXBlendState(se::Object* obj)
{
    auto cls = se::Class::create("GFXBlendState", obj, nullptr, _SE(js_gfx_GFXBlendState_constructor));

    cls->defineProperty("isA2C", _SE(js_gfx_GFXBlendState_get_isA2C), _SE(js_gfx_GFXBlendState_set_isA2C));
    cls->defineProperty("isIndepend", _SE(js_gfx_GFXBlendState_get_isIndepend), _SE(js_gfx_GFXBlendState_set_isIndepend));
    cls->defineProperty("blendColor", _SE(js_gfx_GFXBlendState_get_blendColor), _SE(js_gfx_GFXBlendState_set_blendColor));
    cls->defineProperty("targets", _SE(js_gfx_GFXBlendState_get_targets), _SE(js_gfx_GFXBlendState_set_targets));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBlendState_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBlendState>(cls);

    __jsb_cocos2d_GFXBlendState_proto = cls->getProto();
    __jsb_cocos2d_GFXBlendState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXPipelineStateInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXPipelineStateInfo_class = nullptr;

static bool js_gfx_GFXPipelineStateInfo_get_primitive(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->primitive, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_primitive)

static bool js_gfx_GFXPipelineStateInfo_set_primitive(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXPrimitiveMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXPrimitiveMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_primitive : Error processing new value");
    cobj->primitive = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_primitive)

static bool js_gfx_GFXPipelineStateInfo_get_shader(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->shader, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_shader)

static bool js_gfx_GFXPipelineStateInfo_set_shader(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXShader* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_shader : Error processing new value");
    cobj->shader = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_shader)

static bool js_gfx_GFXPipelineStateInfo_get_inputState(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_inputState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->inputState, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_inputState)

static bool js_gfx_GFXPipelineStateInfo_set_inputState(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_inputState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXInputState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_inputState : Error processing new value");
    cobj->inputState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_inputState)

static bool js_gfx_GFXPipelineStateInfo_get_rasterizerState(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->rasterizerState, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_rasterizerState)

static bool js_gfx_GFXPipelineStateInfo_set_rasterizerState(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXRasterizerState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_rasterizerState : Error processing new value");
    cobj->rasterizerState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_rasterizerState)

static bool js_gfx_GFXPipelineStateInfo_get_depthStencilState(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->depthStencilState, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_depthStencilState)

static bool js_gfx_GFXPipelineStateInfo_set_depthStencilState(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXDepthStencilState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_depthStencilState : Error processing new value");
    cobj->depthStencilState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_depthStencilState)

static bool js_gfx_GFXPipelineStateInfo_get_blendState(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->blendState, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_blendState)

static bool js_gfx_GFXPipelineStateInfo_set_blendState(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_blendState : Error processing new value");
    cobj->blendState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_blendState)

static bool js_gfx_GFXPipelineStateInfo_get_dynamicStates(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->dynamicStates, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_dynamicStates)

static bool js_gfx_GFXPipelineStateInfo_set_dynamicStates(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXDynamicState> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_dynamicStates : Error processing new value");
    cobj->dynamicStates = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_dynamicStates)

static bool js_gfx_GFXPipelineStateInfo_get_layout(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->layout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_layout)

static bool js_gfx_GFXPipelineStateInfo_set_layout(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXPipelineLayout* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_layout : Error processing new value");
    cobj->layout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_layout)

static bool js_gfx_GFXPipelineStateInfo_get_renderPass(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->renderPass, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_renderPass)

static bool js_gfx_GFXPipelineStateInfo_set_renderPass(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXRenderPass* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_renderPass : Error processing new value");
    cobj->renderPass = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_renderPass)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXPipelineStateInfo_finalize)

static bool js_gfx_GFXPipelineStateInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXPipelineStateInfo* cobj = JSB_ALLOC(cocos2d::GFXPipelineStateInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXPipelineStateInfo* cobj = JSB_ALLOC(cocos2d::GFXPipelineStateInfo);
        cocos2d::GFXPrimitiveMode arg0;
        json->getProperty("primitive", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXPrimitiveMode)tmp; } while(false);
            cobj->primitive = arg0;
        }
        cocos2d::GFXShader* arg1 = nullptr;
        json->getProperty("shader", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg1);
            cobj->shader = arg1;
        }
        cocos2d::GFXInputState* arg2 = nullptr;
        json->getProperty("inputState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->inputState = *arg2;
        }
        cocos2d::GFXRasterizerState* arg3 = nullptr;
        json->getProperty("rasterizerState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->rasterizerState = *arg3;
        }
        cocos2d::GFXDepthStencilState* arg4 = nullptr;
        json->getProperty("depthStencilState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg4);
            cobj->depthStencilState = *arg4;
        }
        cocos2d::GFXBlendState* arg5 = nullptr;
        json->getProperty("blendState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg5);
            cobj->blendState = *arg5;
        }
        std::vector<cocos2d::GFXDynamicState> arg6;
        json->getProperty("dynamicStates", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg6);
            cobj->dynamicStates = arg6;
        }
        cocos2d::GFXPipelineLayout* arg7 = nullptr;
        json->getProperty("layout", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg7);
            cobj->layout = arg7;
        }
        cocos2d::GFXRenderPass* arg8 = nullptr;
        json->getProperty("renderPass", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg8);
            cobj->renderPass = arg8;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 9)
    {
        cocos2d::GFXPipelineStateInfo* cobj = JSB_ALLOC(cocos2d::GFXPipelineStateInfo);
        cocos2d::GFXPrimitiveMode arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXPrimitiveMode)tmp; } while(false);
            cobj->primitive = arg0;
        }
        cocos2d::GFXShader* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_native_ptr(args[1], &arg1);
            cobj->shader = arg1;
        }
        cocos2d::GFXInputState* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->inputState = *arg2;
        }
        cocos2d::GFXRasterizerState* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_reference(args[3], &arg3);
            cobj->rasterizerState = *arg3;
        }
        cocos2d::GFXDepthStencilState* arg4 = nullptr;
        if (!args[4].isUndefined()) {
            ok &= seval_to_reference(args[4], &arg4);
            cobj->depthStencilState = *arg4;
        }
        cocos2d::GFXBlendState* arg5 = nullptr;
        if (!args[5].isUndefined()) {
            ok &= seval_to_reference(args[5], &arg5);
            cobj->blendState = *arg5;
        }
        std::vector<cocos2d::GFXDynamicState> arg6;
        if (!args[6].isUndefined()) {
            ok &= seval_to_std_vector(args[6], &arg6);
            cobj->dynamicStates = arg6;
        }
        cocos2d::GFXPipelineLayout* arg7 = nullptr;
        if (!args[7].isUndefined()) {
            ok &= seval_to_native_ptr(args[7], &arg7);
            cobj->layout = arg7;
        }
        cocos2d::GFXRenderPass* arg8 = nullptr;
        if (!args[8].isUndefined()) {
            ok &= seval_to_native_ptr(args[8], &arg8);
            cobj->renderPass = arg8;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXPipelineStateInfo_constructor, __jsb_cocos2d_GFXPipelineStateInfo_class, js_cocos2d_GFXPipelineStateInfo_finalize)




static bool js_cocos2d_GFXPipelineStateInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXPipelineStateInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXPipelineStateInfo_finalize)

bool js_register_gfx_GFXPipelineStateInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineStateInfo", obj, nullptr, _SE(js_gfx_GFXPipelineStateInfo_constructor));

    cls->defineProperty("primitive", _SE(js_gfx_GFXPipelineStateInfo_get_primitive), _SE(js_gfx_GFXPipelineStateInfo_set_primitive));
    cls->defineProperty("shader", _SE(js_gfx_GFXPipelineStateInfo_get_shader), _SE(js_gfx_GFXPipelineStateInfo_set_shader));
    cls->defineProperty("inputState", _SE(js_gfx_GFXPipelineStateInfo_get_inputState), _SE(js_gfx_GFXPipelineStateInfo_set_inputState));
    cls->defineProperty("rasterizerState", _SE(js_gfx_GFXPipelineStateInfo_get_rasterizerState), _SE(js_gfx_GFXPipelineStateInfo_set_rasterizerState));
    cls->defineProperty("depthStencilState", _SE(js_gfx_GFXPipelineStateInfo_get_depthStencilState), _SE(js_gfx_GFXPipelineStateInfo_set_depthStencilState));
    cls->defineProperty("blendState", _SE(js_gfx_GFXPipelineStateInfo_get_blendState), _SE(js_gfx_GFXPipelineStateInfo_set_blendState));
    cls->defineProperty("dynamicStates", _SE(js_gfx_GFXPipelineStateInfo_get_dynamicStates), _SE(js_gfx_GFXPipelineStateInfo_set_dynamicStates));
    cls->defineProperty("layout", _SE(js_gfx_GFXPipelineStateInfo_get_layout), _SE(js_gfx_GFXPipelineStateInfo_set_layout));
    cls->defineProperty("renderPass", _SE(js_gfx_GFXPipelineStateInfo_get_renderPass), _SE(js_gfx_GFXPipelineStateInfo_set_renderPass));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXPipelineStateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXPipelineStateInfo>(cls);

    __jsb_cocos2d_GFXPipelineStateInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXPipelineStateInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXCommandBufferInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXCommandBufferInfo_class = nullptr;

static bool js_gfx_GFXCommandBufferInfo_get_allocator(se::State& s)
{
    cocos2d::GFXCommandBufferInfo* cobj = (cocos2d::GFXCommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBufferInfo_get_allocator : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->allocator, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXCommandBufferInfo_get_allocator)

static bool js_gfx_GFXCommandBufferInfo_set_allocator(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXCommandBufferInfo* cobj = (cocos2d::GFXCommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBufferInfo_set_allocator : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXCommandAllocator* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBufferInfo_set_allocator : Error processing new value");
    cobj->allocator = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXCommandBufferInfo_set_allocator)

static bool js_gfx_GFXCommandBufferInfo_get_type(se::State& s)
{
    cocos2d::GFXCommandBufferInfo* cobj = (cocos2d::GFXCommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBufferInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXCommandBufferInfo_get_type)

static bool js_gfx_GFXCommandBufferInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXCommandBufferInfo* cobj = (cocos2d::GFXCommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBufferInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXCommandBufferType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXCommandBufferType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBufferInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXCommandBufferInfo_set_type)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXCommandBufferInfo_finalize)

static bool js_gfx_GFXCommandBufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXCommandBufferInfo* cobj = JSB_ALLOC(cocos2d::GFXCommandBufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXCommandBufferInfo* cobj = JSB_ALLOC(cocos2d::GFXCommandBufferInfo);
        cocos2d::GFXCommandAllocator* arg0 = nullptr;
        json->getProperty("allocator", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->allocator = arg0;
        }
        cocos2d::GFXCommandBufferType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXCommandBufferType)tmp; } while(false);
            cobj->type = arg1;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 2)
    {
        cocos2d::GFXCommandBufferInfo* cobj = JSB_ALLOC(cocos2d::GFXCommandBufferInfo);
        cocos2d::GFXCommandAllocator* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->allocator = arg0;
        }
        cocos2d::GFXCommandBufferType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXCommandBufferType)tmp; } while(false);
            cobj->type = arg1;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXCommandBufferInfo_constructor, __jsb_cocos2d_GFXCommandBufferInfo_class, js_cocos2d_GFXCommandBufferInfo_finalize)




static bool js_cocos2d_GFXCommandBufferInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXCommandBufferInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXCommandBufferInfo* cobj = (cocos2d::GFXCommandBufferInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXCommandBufferInfo_finalize)

bool js_register_gfx_GFXCommandBufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXCommandBufferInfo", obj, nullptr, _SE(js_gfx_GFXCommandBufferInfo_constructor));

    cls->defineProperty("allocator", _SE(js_gfx_GFXCommandBufferInfo_get_allocator), _SE(js_gfx_GFXCommandBufferInfo_set_allocator));
    cls->defineProperty("type", _SE(js_gfx_GFXCommandBufferInfo_get_type), _SE(js_gfx_GFXCommandBufferInfo_set_type));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXCommandBufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXCommandBufferInfo>(cls);

    __jsb_cocos2d_GFXCommandBufferInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXCommandBufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXQueueInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXQueueInfo_class = nullptr;

static bool js_gfx_GFXQueueInfo_get_type(se::State& s)
{
    cocos2d::GFXQueueInfo* cobj = (cocos2d::GFXQueueInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueueInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXQueueInfo_get_type)

static bool js_gfx_GFXQueueInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXQueueInfo* cobj = (cocos2d::GFXQueueInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueueInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXQueueType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXQueueType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXQueueInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXQueueInfo_set_type)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXQueueInfo_finalize)

static bool js_gfx_GFXQueueInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXQueueInfo* cobj = JSB_ALLOC(cocos2d::GFXQueueInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cocos2d::GFXQueueInfo* cobj = JSB_ALLOC(cocos2d::GFXQueueInfo);
        cocos2d::GFXQueueType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXQueueType)tmp; } while(false);
            cobj->type = arg0;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXQueueInfo_constructor, __jsb_cocos2d_GFXQueueInfo_class, js_cocos2d_GFXQueueInfo_finalize)




static bool js_cocos2d_GFXQueueInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXQueueInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXQueueInfo* cobj = (cocos2d::GFXQueueInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXQueueInfo_finalize)

bool js_register_gfx_GFXQueueInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXQueueInfo", obj, nullptr, _SE(js_gfx_GFXQueueInfo_constructor));

    cls->defineProperty("type", _SE(js_gfx_GFXQueueInfo_get_type), _SE(js_gfx_GFXQueueInfo_set_type));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXQueueInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXQueueInfo>(cls);

    __jsb_cocos2d_GFXQueueInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXQueueInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXFormatInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXFormatInfo_class = nullptr;

static bool js_gfx_GFXFormatInfo_get_name(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_name)

static bool js_gfx_GFXFormatInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_name)

static bool js_gfx_GFXFormatInfo_get_size(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->size, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_size)

static bool js_gfx_GFXFormatInfo_set_size(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_size : Error processing new value");
    cobj->size = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_size)

static bool js_gfx_GFXFormatInfo_get_count(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_count)

static bool js_gfx_GFXFormatInfo_set_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_count)

static bool js_gfx_GFXFormatInfo_get_type(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_type)

static bool js_gfx_GFXFormatInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormatType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormatType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_type)

static bool js_gfx_GFXFormatInfo_get_hasAlpha(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_hasAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->hasAlpha, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_hasAlpha)

static bool js_gfx_GFXFormatInfo_set_hasAlpha(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_hasAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_hasAlpha : Error processing new value");
    cobj->hasAlpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_hasAlpha)

static bool js_gfx_GFXFormatInfo_get_hasDepth(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_hasDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->hasDepth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_hasDepth)

static bool js_gfx_GFXFormatInfo_set_hasDepth(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_hasDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_hasDepth : Error processing new value");
    cobj->hasDepth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_hasDepth)

static bool js_gfx_GFXFormatInfo_get_hasStencil(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_hasStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->hasStencil, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_hasStencil)

static bool js_gfx_GFXFormatInfo_set_hasStencil(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_hasStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_hasStencil : Error processing new value");
    cobj->hasStencil = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_hasStencil)

static bool js_gfx_GFXFormatInfo_get_isCompressed(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_isCompressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isCompressed, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_isCompressed)

static bool js_gfx_GFXFormatInfo_set_isCompressed(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_isCompressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_isCompressed : Error processing new value");
    cobj->isCompressed = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_isCompressed)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXFormatInfo_finalize)

static bool js_gfx_GFXFormatInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXFormatInfo* cobj = JSB_ALLOC(cocos2d::GFXFormatInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXFormatInfo* cobj = JSB_ALLOC(cocos2d::GFXFormatInfo);
        cocos2d::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("size", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->size = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("count", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->count = arg2;
        }
        cocos2d::GFXFormatType arg3;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXFormatType)tmp; } while(false);
            cobj->type = arg3;
        }
        bool arg4;
        json->getProperty("hasAlpha", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg4);
            cobj->hasAlpha = arg4;
        }
        bool arg5;
        json->getProperty("hasDepth", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg5);
            cobj->hasDepth = arg5;
        }
        bool arg6;
        json->getProperty("hasStencil", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg6);
            cobj->hasStencil = arg6;
        }
        bool arg7;
        json->getProperty("isCompressed", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg7);
            cobj->isCompressed = arg7;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 8)
    {
        cocos2d::GFXFormatInfo* cobj = JSB_ALLOC(cocos2d::GFXFormatInfo);
        cocos2d::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->size = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->count = arg2;
        }
        cocos2d::GFXFormatType arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXFormatType)tmp; } while(false);
            cobj->type = arg3;
        }
        bool arg4;
        if (!args[4].isUndefined()) {
            ok &= seval_to_boolean(args[4], &arg4);
            cobj->hasAlpha = arg4;
        }
        bool arg5;
        if (!args[5].isUndefined()) {
            ok &= seval_to_boolean(args[5], &arg5);
            cobj->hasDepth = arg5;
        }
        bool arg6;
        if (!args[6].isUndefined()) {
            ok &= seval_to_boolean(args[6], &arg6);
            cobj->hasStencil = arg6;
        }
        bool arg7;
        if (!args[7].isUndefined()) {
            ok &= seval_to_boolean(args[7], &arg7);
            cobj->isCompressed = arg7;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXFormatInfo_constructor, __jsb_cocos2d_GFXFormatInfo_class, js_cocos2d_GFXFormatInfo_finalize)




static bool js_cocos2d_GFXFormatInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXFormatInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXFormatInfo_finalize)

bool js_register_gfx_GFXFormatInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXFormatInfo", obj, nullptr, _SE(js_gfx_GFXFormatInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_GFXFormatInfo_get_name), _SE(js_gfx_GFXFormatInfo_set_name));
    cls->defineProperty("size", _SE(js_gfx_GFXFormatInfo_get_size), _SE(js_gfx_GFXFormatInfo_set_size));
    cls->defineProperty("count", _SE(js_gfx_GFXFormatInfo_get_count), _SE(js_gfx_GFXFormatInfo_set_count));
    cls->defineProperty("type", _SE(js_gfx_GFXFormatInfo_get_type), _SE(js_gfx_GFXFormatInfo_set_type));
    cls->defineProperty("hasAlpha", _SE(js_gfx_GFXFormatInfo_get_hasAlpha), _SE(js_gfx_GFXFormatInfo_set_hasAlpha));
    cls->defineProperty("hasDepth", _SE(js_gfx_GFXFormatInfo_get_hasDepth), _SE(js_gfx_GFXFormatInfo_set_hasDepth));
    cls->defineProperty("hasStencil", _SE(js_gfx_GFXFormatInfo_get_hasStencil), _SE(js_gfx_GFXFormatInfo_set_hasStencil));
    cls->defineProperty("isCompressed", _SE(js_gfx_GFXFormatInfo_get_isCompressed), _SE(js_gfx_GFXFormatInfo_set_isCompressed));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXFormatInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXFormatInfo>(cls);

    __jsb_cocos2d_GFXFormatInfo_proto = cls->getProto();
    __jsb_cocos2d_GFXFormatInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXMemoryStatus_proto = nullptr;
se::Class* __jsb_cocos2d_GFXMemoryStatus_class = nullptr;

static bool js_gfx_GFXMemoryStatus_get_bufferSize(se::State& s)
{
    cocos2d::GFXMemoryStatus* cobj = (cocos2d::GFXMemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXMemoryStatus_get_bufferSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->bufferSize, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXMemoryStatus_get_bufferSize)

static bool js_gfx_GFXMemoryStatus_set_bufferSize(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXMemoryStatus* cobj = (cocos2d::GFXMemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXMemoryStatus_set_bufferSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXMemoryStatus_set_bufferSize : Error processing new value");
    cobj->bufferSize = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXMemoryStatus_set_bufferSize)

static bool js_gfx_GFXMemoryStatus_get_textureSize(se::State& s)
{
    cocos2d::GFXMemoryStatus* cobj = (cocos2d::GFXMemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXMemoryStatus_get_textureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->textureSize, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXMemoryStatus_get_textureSize)

static bool js_gfx_GFXMemoryStatus_set_textureSize(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXMemoryStatus* cobj = (cocos2d::GFXMemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXMemoryStatus_set_textureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXMemoryStatus_set_textureSize : Error processing new value");
    cobj->textureSize = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXMemoryStatus_set_textureSize)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXMemoryStatus_finalize)

static bool js_gfx_GFXMemoryStatus_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXMemoryStatus* cobj = JSB_ALLOC(cocos2d::GFXMemoryStatus);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXMemoryStatus* cobj = JSB_ALLOC(cocos2d::GFXMemoryStatus);
        unsigned int arg0 = 0;
        json->getProperty("bufferSize", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->bufferSize = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("textureSize", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->textureSize = arg1;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 2)
    {
        cocos2d::GFXMemoryStatus* cobj = JSB_ALLOC(cocos2d::GFXMemoryStatus);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->bufferSize = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->textureSize = arg1;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXMemoryStatus_constructor, __jsb_cocos2d_GFXMemoryStatus_class, js_cocos2d_GFXMemoryStatus_finalize)




static bool js_cocos2d_GFXMemoryStatus_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXMemoryStatus)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXMemoryStatus* cobj = (cocos2d::GFXMemoryStatus*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXMemoryStatus_finalize)

bool js_register_gfx_GFXMemoryStatus(se::Object* obj)
{
    auto cls = se::Class::create("GFXMemoryStatus", obj, nullptr, _SE(js_gfx_GFXMemoryStatus_constructor));

    cls->defineProperty("bufferSize", _SE(js_gfx_GFXMemoryStatus_get_bufferSize), _SE(js_gfx_GFXMemoryStatus_set_bufferSize));
    cls->defineProperty("textureSize", _SE(js_gfx_GFXMemoryStatus_get_textureSize), _SE(js_gfx_GFXMemoryStatus_set_textureSize));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXMemoryStatus_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXMemoryStatus>(cls);

    __jsb_cocos2d_GFXMemoryStatus_proto = cls->getProto();
    __jsb_cocos2d_GFXMemoryStatus_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXDevice_proto = nullptr;
se::Class* __jsb_cocos2d_GFXDevice_class = nullptr;

static bool js_gfx_GFXDevice_height(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_height : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->height();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_height : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_height)

static bool js_gfx_GFXDevice_renderer(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_renderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::String& result = cobj->renderer();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_renderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_renderer)

static bool js_gfx_GFXDevice_createCommandAllocator(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createCommandAllocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandAllocatorInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createCommandAllocator : Error processing arguments");
        cocos2d::GFXCommandAllocator* result = cobj->createCommandAllocator(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createCommandAllocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createCommandAllocator)

static bool js_gfx_GFXDevice_nativeWidth(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_nativeWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->nativeWidth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_nativeWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_nativeWidth)

static bool js_gfx_GFXDevice_commandAllocator(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_commandAllocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXCommandAllocator* result = cobj->commandAllocator();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_commandAllocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_commandAllocator)

static bool js_gfx_GFXDevice_createPipelineState(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineStateInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createPipelineState : Error processing arguments");
        cocos2d::GFXPipelineState* result = cobj->createPipelineState(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createPipelineState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createPipelineState)

static bool js_gfx_GFXDevice_vendor(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_vendor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::String& result = cobj->vendor();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_vendor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_vendor)

static bool js_gfx_GFXDevice_width(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_width : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->width();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_width : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_width)

static bool js_gfx_GFXDevice_createCommandBuffer(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createCommandBuffer : Error processing arguments");
        cocos2d::GFXCommandBuffer* result = cobj->createCommandBuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createCommandBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createCommandBuffer)

static bool js_gfx_GFXDevice_present(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_present)

static bool js_gfx_GFXDevice_createTexture(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createTexture : Error processing arguments");
        cocos2d::GFXTexture* result = cobj->createTexture(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createTexture)

static bool js_gfx_GFXDevice_destroy(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_destroy)

static bool js_gfx_GFXDevice_createFramebuffer(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXFramebufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createFramebuffer : Error processing arguments");
        cocos2d::GFXFramebuffer* result = cobj->createFramebuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createFramebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createFramebuffer)

static bool js_gfx_GFXDevice_createRenderPass(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRenderPassInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createRenderPass : Error processing arguments");
        cocos2d::GFXRenderPass* result = cobj->createRenderPass(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createRenderPass)

static bool js_gfx_GFXDevice_createPipelineLayout(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineLayoutInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createPipelineLayout : Error processing arguments");
        cocos2d::GFXPipelineLayout* result = cobj->createPipelineLayout(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createPipelineLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createPipelineLayout)

static bool js_gfx_GFXDevice_memoryStatus(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_memoryStatus : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXMemoryStatus& result = cobj->memoryStatus();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_memoryStatus : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_memoryStatus)

static bool js_gfx_GFXDevice_createWindow(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXWindowInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createWindow : Error processing arguments");
        cocos2d::GFXWindow* result = cobj->createWindow(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createWindow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createWindow)

static bool js_gfx_GFXDevice_numDrawCalls(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_numDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->numDrawCalls();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_numDrawCalls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_numDrawCalls)

static bool js_gfx_GFXDevice_createShader(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXShaderInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createShader : Error processing arguments");
        cocos2d::GFXShader* result = cobj->createShader(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createShader)

static bool js_gfx_GFXDevice_gfxAPI(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_gfxAPI : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->gfxAPI();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_gfxAPI : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_gfxAPI)

static bool js_gfx_GFXDevice_createInputAssembler(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssemblerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createInputAssembler : Error processing arguments");
        cocos2d::GFXInputAssembler* result = cobj->createInputAssembler(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createInputAssembler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createInputAssembler)

static bool js_gfx_GFXDevice_createSampler(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXSamplerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createSampler : Error processing arguments");
        cocos2d::GFXSampler* result = cobj->createSampler(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createSampler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createSampler)

static bool js_gfx_GFXDevice_createBuffer(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createBuffer : Error processing arguments");
        cocos2d::GFXBuffer* result = cobj->createBuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createBuffer)

static bool js_gfx_GFXDevice_hasFeature(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_hasFeature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXFeature arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFeature)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_hasFeature : Error processing arguments");
        bool result = cobj->hasFeature(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_hasFeature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_hasFeature)

static bool js_gfx_GFXDevice_initialize(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXDeviceInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_initialize)

static bool js_gfx_GFXDevice_resize(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_resize : Error processing arguments");
        cobj->resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_resize)

static bool js_gfx_GFXDevice_nativeHeight(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_nativeHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->nativeHeight();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_nativeHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_nativeHeight)

static bool js_gfx_GFXDevice_createQueue(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXQueueInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createQueue : Error processing arguments");
        cocos2d::GFXQueue* result = cobj->createQueue(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createQueue)

static bool js_gfx_GFXDevice_numTris(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_numTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->numTris();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_numTris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_numTris)

static bool js_gfx_GFXDevice_queue(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_queue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXQueue* result = cobj->queue();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_queue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_queue)

static bool js_gfx_GFXDevice_context(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_context : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXContext* result = cobj->context();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_context : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_context)

static bool js_gfx_GFXDevice_mainWindow(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_mainWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXWindow* result = cobj->mainWindow();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_mainWindow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_mainWindow)

static bool js_gfx_GFXDevice_createBindingLayout(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayoutInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createBindingLayout : Error processing arguments");
        cocos2d::GFXBindingLayout* result = cobj->createBindingLayout(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createBindingLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createBindingLayout)

static bool js_gfx_GFXDevice_createTextureView(se::State& s)
{
    cocos2d::GFXDevice* cobj = (cocos2d::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureViewInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createTextureView : Error processing arguments");
        cocos2d::GFXTextureView* result = cobj->createTextureView(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createTextureView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createTextureView)




bool js_register_gfx_GFXDevice(se::Object* obj)
{
    auto cls = se::Class::create("GFXDevice", obj, nullptr, nullptr);

    cls->defineProperty("nativeHeight", _SE(js_gfx_GFXDevice_nativeHeight), nullptr);
    cls->defineProperty("nativeWidth", _SE(js_gfx_GFXDevice_nativeWidth), nullptr);
    cls->defineProperty("numDrawCalls", _SE(js_gfx_GFXDevice_numDrawCalls), nullptr);
    cls->defineProperty("memoryStatus", _SE(js_gfx_GFXDevice_memoryStatus), nullptr);
    cls->defineProperty("numTris", _SE(js_gfx_GFXDevice_numTris), nullptr);
    cls->defineProperty("height", _SE(js_gfx_GFXDevice_height), nullptr);
    cls->defineProperty("queue", _SE(js_gfx_GFXDevice_queue), nullptr);
    cls->defineProperty("width", _SE(js_gfx_GFXDevice_width), nullptr);
    cls->defineProperty("commandAllocator", _SE(js_gfx_GFXDevice_commandAllocator), nullptr);
    cls->defineProperty("renderer", _SE(js_gfx_GFXDevice_renderer), nullptr);
    cls->defineProperty("context", _SE(js_gfx_GFXDevice_context), nullptr);
    cls->defineProperty("vendor", _SE(js_gfx_GFXDevice_vendor), nullptr);
    cls->defineProperty("mainWindow", _SE(js_gfx_GFXDevice_mainWindow), nullptr);
    cls->defineFunction("createCommandAllocator", _SE(js_gfx_GFXDevice_createCommandAllocator));
    cls->defineFunction("createPipelineState", _SE(js_gfx_GFXDevice_createPipelineState));
    cls->defineFunction("createCommandBuffer", _SE(js_gfx_GFXDevice_createCommandBuffer));
    cls->defineFunction("present", _SE(js_gfx_GFXDevice_present));
    cls->defineFunction("createTexture", _SE(js_gfx_GFXDevice_createTexture));
    cls->defineFunction("destroy", _SE(js_gfx_GFXDevice_destroy));
    cls->defineFunction("createFramebuffer", _SE(js_gfx_GFXDevice_createFramebuffer));
    cls->defineFunction("createRenderPass", _SE(js_gfx_GFXDevice_createRenderPass));
    cls->defineFunction("createPipelineLayout", _SE(js_gfx_GFXDevice_createPipelineLayout));
    cls->defineFunction("createWindow", _SE(js_gfx_GFXDevice_createWindow));
    cls->defineFunction("createShader", _SE(js_gfx_GFXDevice_createShader));
    cls->defineFunction("gfxAPI", _SE(js_gfx_GFXDevice_gfxAPI));
    cls->defineFunction("createInputAssembler", _SE(js_gfx_GFXDevice_createInputAssembler));
    cls->defineFunction("createSampler", _SE(js_gfx_GFXDevice_createSampler));
    cls->defineFunction("createBuffer", _SE(js_gfx_GFXDevice_createBuffer));
    cls->defineFunction("hasFeature", _SE(js_gfx_GFXDevice_hasFeature));
    cls->defineFunction("initialize", _SE(js_gfx_GFXDevice_initialize));
    cls->defineFunction("resize", _SE(js_gfx_GFXDevice_resize));
    cls->defineFunction("createQueue", _SE(js_gfx_GFXDevice_createQueue));
    cls->defineFunction("createBindingLayout", _SE(js_gfx_GFXDevice_createBindingLayout));
    cls->defineFunction("createTextureView", _SE(js_gfx_GFXDevice_createTextureView));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXDevice>(cls);

    __jsb_cocos2d_GFXDevice_proto = cls->getProto();
    __jsb_cocos2d_GFXDevice_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXWindow_proto = nullptr;
se::Class* __jsb_cocos2d_GFXWindow_class = nullptr;

static bool js_gfx_GFXWindow_nativeHeight(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_nativeHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->nativeHeight();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_nativeHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_nativeHeight)

static bool js_gfx_GFXWindow_depthStencilTexView(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_depthStencilTexView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTextureView* result = cobj->depthStencilTexView();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_depthStencilTexView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_depthStencilTexView)

static bool js_gfx_GFXWindow_renderPass(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_renderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXRenderPass* result = cobj->renderPass();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_renderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_renderPass)

static bool js_gfx_GFXWindow_nativeWidth(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_nativeWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->nativeWidth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_nativeWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_nativeWidth)

static bool js_gfx_GFXWindow_title(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_title : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::String& result = cobj->title();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_title : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_title)

static bool js_gfx_GFXWindow_isOffscreen(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_isOffscreen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isOffscreen();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_isOffscreen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_isOffscreen)

static bool js_gfx_GFXWindow_top(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_top : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->top();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_top : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_top)

static bool js_gfx_GFXWindow_detphStencilFormat(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_detphStencilFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->detphStencilFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_detphStencilFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_detphStencilFormat)

static bool js_gfx_GFXWindow_height(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_height : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->height();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_height : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_height)

static bool js_gfx_GFXWindow_device(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_device)

static bool js_gfx_GFXWindow_colorTexView(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_colorTexView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTextureView* result = cobj->colorTexView();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_colorTexView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_colorTexView)

static bool js_gfx_GFXWindow_depthStencilTexture(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_depthStencilTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTexture* result = cobj->depthStencilTexture();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_depthStencilTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_depthStencilTexture)

static bool js_gfx_GFXWindow_colorTexture(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_colorTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTexture* result = cobj->colorTexture();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_colorTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_colorTexture)

static bool js_gfx_GFXWindow_initialize(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXWindowInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_initialize)

static bool js_gfx_GFXWindow_destroy(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_destroy)

static bool js_gfx_GFXWindow_framebuffer(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_framebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXFramebuffer* result = cobj->framebuffer();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_framebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_framebuffer)

static bool js_gfx_GFXWindow_colorFormat(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_colorFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->colorFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_colorFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_colorFormat)

static bool js_gfx_GFXWindow_width(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_width : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->width();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_width : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_width)

static bool js_gfx_GFXWindow_resize(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_resize : Error processing arguments");
        cobj->resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_resize)

static bool js_gfx_GFXWindow_left(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_left : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->left();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_left : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXWindow_left)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXWindow_finalize)

static bool js_gfx_GFXWindow_constructor(se::State& s)
{
    //#3 cocos2d::GFXWindow: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXWindow constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXWindow_constructor, __jsb_cocos2d_GFXWindow_class, js_cocos2d_GFXWindow_finalize)




static bool js_cocos2d_GFXWindow_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXWindow)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXWindow_finalize)

bool js_register_gfx_GFXWindow(se::Object* obj)
{
    auto cls = se::Class::create("GFXWindow", obj, nullptr, _SE(js_gfx_GFXWindow_constructor));

    cls->defineProperty("nativeHeight", _SE(js_gfx_GFXWindow_nativeHeight), nullptr);
    cls->defineProperty("depthStencilTexView", _SE(js_gfx_GFXWindow_depthStencilTexView), nullptr);
    cls->defineProperty("nativeWidth", _SE(js_gfx_GFXWindow_nativeWidth), nullptr);
    cls->defineProperty("title", _SE(js_gfx_GFXWindow_title), nullptr);
    cls->defineProperty("isOffscreen", _SE(js_gfx_GFXWindow_isOffscreen), nullptr);
    cls->defineProperty("top", _SE(js_gfx_GFXWindow_top), nullptr);
    cls->defineProperty("height", _SE(js_gfx_GFXWindow_height), nullptr);
    cls->defineProperty("width", _SE(js_gfx_GFXWindow_width), nullptr);
    cls->defineProperty("colorTexView", _SE(js_gfx_GFXWindow_colorTexView), nullptr);
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_GFXWindow_depthStencilTexture), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXWindow_device), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_GFXWindow_renderPass), nullptr);
    cls->defineProperty("framebuffer", _SE(js_gfx_GFXWindow_framebuffer), nullptr);
    cls->defineProperty("colorFormat", _SE(js_gfx_GFXWindow_colorFormat), nullptr);
    cls->defineProperty("colorTexture", _SE(js_gfx_GFXWindow_colorTexture), nullptr);
    cls->defineProperty("left", _SE(js_gfx_GFXWindow_left), nullptr);
    cls->defineFunction("detphStencilFormat", _SE(js_gfx_GFXWindow_detphStencilFormat));
    cls->defineFunction("initialize", _SE(js_gfx_GFXWindow_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXWindow_destroy));
    cls->defineFunction("resize", _SE(js_gfx_GFXWindow_resize));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXWindow_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXWindow>(cls);

    __jsb_cocos2d_GFXWindow_proto = cls->getProto();
    __jsb_cocos2d_GFXWindow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBuffer_class = nullptr;

static bool js_gfx_GFXBuffer_count(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->count();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_count : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_count)

static bool js_gfx_GFXBuffer_memUsage(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_memUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->memUsage();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_memUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_memUsage)

static bool js_gfx_GFXBuffer_usage(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_usage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->usage();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_usage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_usage)

static bool js_gfx_GFXBuffer_bufferView(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_bufferView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->bufferView();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_bufferView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_bufferView)

static bool js_gfx_GFXBuffer_device(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_device)

static bool js_gfx_GFXBuffer_flags(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_flags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->flags();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_flags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_flags)

static bool js_gfx_GFXBuffer_initialize(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_initialize)

static bool js_gfx_GFXBuffer_destroy(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_destroy)

static bool js_gfx_GFXBuffer_stride(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_stride : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->stride();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_stride : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_stride)

static bool js_gfx_GFXBuffer_resize(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_resize : Error processing arguments");
        cobj->resize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_resize)

static bool js_gfx_GFXBuffer_size(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_size : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->size();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_size : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_size)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBuffer_finalize)

static bool js_gfx_GFXBuffer_constructor(se::State& s)
{
    //#3 cocos2d::GFXBuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXBuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBuffer_constructor, __jsb_cocos2d_GFXBuffer_class, js_cocos2d_GFXBuffer_finalize)




static bool js_cocos2d_GFXBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBuffer_finalize)

bool js_register_gfx_GFXBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXBuffer", obj, nullptr, _SE(js_gfx_GFXBuffer_constructor));

    cls->defineProperty("count", _SE(js_gfx_GFXBuffer_count), nullptr);
    cls->defineProperty("memUsage", _SE(js_gfx_GFXBuffer_memUsage), nullptr);
    cls->defineProperty("stride", _SE(js_gfx_GFXBuffer_stride), nullptr);
    cls->defineProperty("bufferView", _SE(js_gfx_GFXBuffer_bufferView), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_GFXBuffer_usage), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_GFXBuffer_flags), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXBuffer_device), nullptr);
    cls->defineProperty("size", _SE(js_gfx_GFXBuffer_size), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXBuffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXBuffer_destroy));
    cls->defineFunction("resize", _SE(js_gfx_GFXBuffer_resize));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBuffer>(cls);

    __jsb_cocos2d_GFXBuffer_proto = cls->getProto();
    __jsb_cocos2d_GFXBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXTexture_proto = nullptr;
se::Class* __jsb_cocos2d_GFXTexture_class = nullptr;

static bool js_gfx_GFXTexture_arrayLayer(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_arrayLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->arrayLayer();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_arrayLayer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_arrayLayer)

static bool js_gfx_GFXTexture_format(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_format : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->format();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_format : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_format)

static bool js_gfx_GFXTexture_buffer(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_buffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->buffer();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_buffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_buffer)

static bool js_gfx_GFXTexture_mipLevel(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_mipLevel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->mipLevel();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_mipLevel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_mipLevel)

static bool js_gfx_GFXTexture_height(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_height : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->height();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_height : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_height)

static bool js_gfx_GFXTexture_usage(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_usage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->usage();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_usage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_usage)

static bool js_gfx_GFXTexture_depth(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_depth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->depth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_depth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_depth)

static bool js_gfx_GFXTexture_flags(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_flags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->flags();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_flags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_flags)

static bool js_gfx_GFXTexture_samples(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_samples : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->samples();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_samples : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_samples)

static bool js_gfx_GFXTexture_initialize(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_initialize)

static bool js_gfx_GFXTexture_destroy(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_destroy)

static bool js_gfx_GFXTexture_type(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_type : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->type();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_type : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_type)

static bool js_gfx_GFXTexture_width(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_width : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->width();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_width : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_width)

static bool js_gfx_GFXTexture_resize(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_resize : Error processing arguments");
        cobj->resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_resize)

static bool js_gfx_GFXTexture_size(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_size : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->size();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_size : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_size)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTexture_finalize)

static bool js_gfx_GFXTexture_constructor(se::State& s)
{
    //#3 cocos2d::GFXTexture: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXTexture constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXTexture_constructor, __jsb_cocos2d_GFXTexture_class, js_cocos2d_GFXTexture_finalize)




static bool js_cocos2d_GFXTexture_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXTexture)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXTexture_finalize)

bool js_register_gfx_GFXTexture(se::Object* obj)
{
    auto cls = se::Class::create("GFXTexture", obj, nullptr, _SE(js_gfx_GFXTexture_constructor));

    cls->defineProperty("arrayLayer", _SE(js_gfx_GFXTexture_arrayLayer), nullptr);
    cls->defineProperty("format", _SE(js_gfx_GFXTexture_format), nullptr);
    cls->defineProperty("buffer", _SE(js_gfx_GFXTexture_buffer), nullptr);
    cls->defineProperty("mipLevel", _SE(js_gfx_GFXTexture_mipLevel), nullptr);
    cls->defineProperty("height", _SE(js_gfx_GFXTexture_height), nullptr);
    cls->defineProperty("width", _SE(js_gfx_GFXTexture_width), nullptr);
    cls->defineProperty("depth", _SE(js_gfx_GFXTexture_depth), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_GFXTexture_flags), nullptr);
    cls->defineProperty("samples", _SE(js_gfx_GFXTexture_samples), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_GFXTexture_usage), nullptr);
    cls->defineProperty("type", _SE(js_gfx_GFXTexture_type), nullptr);
    cls->defineProperty("size", _SE(js_gfx_GFXTexture_size), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXTexture_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXTexture_destroy));
    cls->defineFunction("resize", _SE(js_gfx_GFXTexture_resize));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXTexture>(cls);

    __jsb_cocos2d_GFXTexture_proto = cls->getProto();
    __jsb_cocos2d_GFXTexture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXTextureView_proto = nullptr;
se::Class* __jsb_cocos2d_GFXTextureView_class = nullptr;

static bool js_gfx_GFXTextureView_baseLevel(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_baseLevel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->baseLevel();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_baseLevel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureView_baseLevel)

static bool js_gfx_GFXTextureView_format(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_format : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->format();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_format : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureView_format)

static bool js_gfx_GFXTextureView_levelCount(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_levelCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->levelCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_levelCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureView_levelCount)

static bool js_gfx_GFXTextureView_texture(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_texture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTexture* result = cobj->texture();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_texture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureView_texture)

static bool js_gfx_GFXTextureView_device(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureView_device)

static bool js_gfx_GFXTextureView_layerCount(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_layerCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->layerCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_layerCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureView_layerCount)

static bool js_gfx_GFXTextureView_initialize(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureViewInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_initialize)

static bool js_gfx_GFXTextureView_destroy(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_destroy)

static bool js_gfx_GFXTextureView_baseLayer(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_baseLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->baseLayer();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_baseLayer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureView_baseLayer)

static bool js_gfx_GFXTextureView_type(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_type : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->type();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_type : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureView_type)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTextureView_finalize)

static bool js_gfx_GFXTextureView_constructor(se::State& s)
{
    //#3 cocos2d::GFXTextureView: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXTextureView constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXTextureView_constructor, __jsb_cocos2d_GFXTextureView_class, js_cocos2d_GFXTextureView_finalize)




static bool js_cocos2d_GFXTextureView_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXTextureView)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXTextureView_finalize)

bool js_register_gfx_GFXTextureView(se::Object* obj)
{
    auto cls = se::Class::create("GFXTextureView", obj, nullptr, _SE(js_gfx_GFXTextureView_constructor));

    cls->defineProperty("baseLevel", _SE(js_gfx_GFXTextureView_baseLevel), nullptr);
    cls->defineProperty("format", _SE(js_gfx_GFXTextureView_format), nullptr);
    cls->defineProperty("levelCount", _SE(js_gfx_GFXTextureView_levelCount), nullptr);
    cls->defineProperty("texture", _SE(js_gfx_GFXTextureView_texture), nullptr);
    cls->defineProperty("layerCount", _SE(js_gfx_GFXTextureView_layerCount), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXTextureView_device), nullptr);
    cls->defineProperty("baseLayer", _SE(js_gfx_GFXTextureView_baseLayer), nullptr);
    cls->defineProperty("type", _SE(js_gfx_GFXTextureView_type), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXTextureView_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXTextureView_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXTextureView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXTextureView>(cls);

    __jsb_cocos2d_GFXTextureView_proto = cls->getProto();
    __jsb_cocos2d_GFXTextureView_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXSampler_proto = nullptr;
se::Class* __jsb_cocos2d_GFXSampler_class = nullptr;

static bool js_gfx_GFXSampler_borderColor(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_borderColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXColor& result = cobj->borderColor();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_borderColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_borderColor)

static bool js_gfx_GFXSampler_mipFilter(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_mipFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->mipFilter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_mipFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_mipFilter)

static bool js_gfx_GFXSampler_minFilter(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_minFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->minFilter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_minFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_minFilter)

static bool js_gfx_GFXSampler_name(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_name : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::String& result = cobj->name();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_name : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_name)

static bool js_gfx_GFXSampler_cmpFunc(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_cmpFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->cmpFunc();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_cmpFunc : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_cmpFunc)

static bool js_gfx_GFXSampler_maxLOD(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_maxLOD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->maxLOD();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_maxLOD : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_maxLOD)

static bool js_gfx_GFXSampler_magFilter(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_magFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->magFilter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_magFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_magFilter)

static bool js_gfx_GFXSampler_addressU(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_addressU : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->addressU();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_addressU : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_addressU)

static bool js_gfx_GFXSampler_addressV(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_addressV : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->addressV();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_addressV : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_addressV)

static bool js_gfx_GFXSampler_addressW(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_addressW : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->addressW();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_addressW : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_addressW)

static bool js_gfx_GFXSampler_device(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_device)

static bool js_gfx_GFXSampler_maxAnisotropy(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_maxAnisotropy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->maxAnisotropy();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_maxAnisotropy : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_maxAnisotropy)

static bool js_gfx_GFXSampler_mipLODBias(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_mipLODBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->mipLODBias();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_mipLODBias : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_mipLODBias)

static bool js_gfx_GFXSampler_initialize(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXSamplerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_initialize)

static bool js_gfx_GFXSampler_destroy(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_destroy)

static bool js_gfx_GFXSampler_minLOD(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_minLOD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->minLOD();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_minLOD : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_minLOD)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXSampler_finalize)

static bool js_gfx_GFXSampler_constructor(se::State& s)
{
    //#3 cocos2d::GFXSampler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXSampler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXSampler_constructor, __jsb_cocos2d_GFXSampler_class, js_cocos2d_GFXSampler_finalize)




static bool js_cocos2d_GFXSampler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXSampler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXSampler_finalize)

bool js_register_gfx_GFXSampler(se::Object* obj)
{
    auto cls = se::Class::create("GFXSampler", obj, nullptr, _SE(js_gfx_GFXSampler_constructor));

    cls->defineProperty("borderColor", _SE(js_gfx_GFXSampler_borderColor), nullptr);
    cls->defineProperty("mipFilter", _SE(js_gfx_GFXSampler_mipFilter), nullptr);
    cls->defineProperty("minFilter", _SE(js_gfx_GFXSampler_minFilter), nullptr);
    cls->defineProperty("name", _SE(js_gfx_GFXSampler_name), nullptr);
    cls->defineProperty("maxLOD", _SE(js_gfx_GFXSampler_maxLOD), nullptr);
    cls->defineProperty("magFilter", _SE(js_gfx_GFXSampler_magFilter), nullptr);
    cls->defineProperty("addressU", _SE(js_gfx_GFXSampler_addressU), nullptr);
    cls->defineProperty("addressV", _SE(js_gfx_GFXSampler_addressV), nullptr);
    cls->defineProperty("addressW", _SE(js_gfx_GFXSampler_addressW), nullptr);
    cls->defineProperty("cmpFunc", _SE(js_gfx_GFXSampler_cmpFunc), nullptr);
    cls->defineProperty("maxAnisotropy", _SE(js_gfx_GFXSampler_maxAnisotropy), nullptr);
    cls->defineProperty("mipLODBias", _SE(js_gfx_GFXSampler_mipLODBias), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXSampler_device), nullptr);
    cls->defineProperty("minLOD", _SE(js_gfx_GFXSampler_minLOD), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXSampler_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXSampler_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXSampler>(cls);

    __jsb_cocos2d_GFXSampler_proto = cls->getProto();
    __jsb_cocos2d_GFXSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXShader_proto = nullptr;
se::Class* __jsb_cocos2d_GFXShader_class = nullptr;

static bool js_gfx_GFXShader_hash(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_hash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->hash();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_hash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_hash)

static bool js_gfx_GFXShader_name(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_name : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::String& result = cobj->name();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_name : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_name)

static bool js_gfx_GFXShader_samplers(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_samplers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXUniformSampler>& result = cobj->samplers();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_samplers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_samplers)

static bool js_gfx_GFXShader_blocks(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_blocks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXUniformBlock>& result = cobj->blocks();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_blocks : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_blocks)

static bool js_gfx_GFXShader_device(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_device)

static bool js_gfx_GFXShader_initialize(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXShaderInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_initialize)

static bool js_gfx_GFXShader_destroy(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_destroy)

static bool js_gfx_GFXShader_stages(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_stages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXShaderStage>& result = cobj->stages();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_stages : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_stages)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXShader_finalize)

static bool js_gfx_GFXShader_constructor(se::State& s)
{
    //#3 cocos2d::GFXShader: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXShader constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXShader_constructor, __jsb_cocos2d_GFXShader_class, js_cocos2d_GFXShader_finalize)




static bool js_cocos2d_GFXShader_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXShader)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXShader_finalize)

bool js_register_gfx_GFXShader(se::Object* obj)
{
    auto cls = se::Class::create("GFXShader", obj, nullptr, _SE(js_gfx_GFXShader_constructor));

    cls->defineProperty("blocks", _SE(js_gfx_GFXShader_blocks), nullptr);
    cls->defineProperty("name", _SE(js_gfx_GFXShader_name), nullptr);
    cls->defineProperty("samplers", _SE(js_gfx_GFXShader_samplers), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXShader_device), nullptr);
    cls->defineProperty("hash", _SE(js_gfx_GFXShader_hash), nullptr);
    cls->defineProperty("stages", _SE(js_gfx_GFXShader_stages), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXShader_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXShader_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXShader_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXShader>(cls);

    __jsb_cocos2d_GFXShader_proto = cls->getProto();
    __jsb_cocos2d_GFXShader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXInputAssembler_proto = nullptr;
se::Class* __jsb_cocos2d_GFXInputAssembler_class = nullptr;

static bool js_gfx_GFXInputAssembler_vertexBuffers(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertexBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXBuffer *>& result = cobj->vertexBuffers();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertexBuffers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_vertexBuffers)

static bool js_gfx_GFXInputAssembler_firstInstance(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_firstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->firstInstance();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_firstInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_firstInstance)

static bool js_gfx_GFXInputAssembler_initialize(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssemblerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_initialize)

static bool js_gfx_GFXInputAssembler_setIndexCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setIndexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setIndexCount : Error processing arguments");
        cobj->setIndexCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setIndexCount)

static bool js_gfx_GFXInputAssembler_vertexOffset(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->vertexOffset();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertexOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_vertexOffset)

static bool js_gfx_GFXInputAssembler_setFirstInstance(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setFirstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setFirstInstance : Error processing arguments");
        cobj->setFirstInstance(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setFirstInstance)

static bool js_gfx_GFXInputAssembler_destroy(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_destroy)

static bool js_gfx_GFXInputAssembler_setVertexOffset(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setVertexOffset : Error processing arguments");
        cobj->setVertexOffset(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setVertexOffset)

static bool js_gfx_GFXInputAssembler_firstVertex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_firstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->firstVertex();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_firstVertex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_firstVertex)

static bool js_gfx_GFXInputAssembler_instanceCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_instanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->instanceCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_instanceCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_instanceCount)

static bool js_gfx_GFXInputAssembler_vertexCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->vertexCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_vertexCount)

static bool js_gfx_GFXInputAssembler_attributes(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_attributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXAttribute>& result = cobj->attributes();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_attributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_attributes)

static bool js_gfx_GFXInputAssembler_device(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_device)

static bool js_gfx_GFXInputAssembler_setFirstVertex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setFirstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setFirstVertex : Error processing arguments");
        cobj->setFirstVertex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setFirstVertex)

static bool js_gfx_GFXInputAssembler_firstIndex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_firstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->firstIndex();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_firstIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_firstIndex)

static bool js_gfx_GFXInputAssembler_indirectBuffer(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_indirectBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXBuffer* result = cobj->indirectBuffer();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_indirectBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_indirectBuffer)

static bool js_gfx_GFXInputAssembler_indexCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_indexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->indexCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_indexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_indexCount)

static bool js_gfx_GFXInputAssembler_setVertexCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setVertexCount : Error processing arguments");
        cobj->setVertexCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setVertexCount)

static bool js_gfx_GFXInputAssembler_indexBuffer(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_indexBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXBuffer* result = cobj->indexBuffer();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_indexBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_indexBuffer)

static bool js_gfx_GFXInputAssembler_setFirstIndex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setFirstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setFirstIndex : Error processing arguments");
        cobj->setFirstIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setFirstIndex)

static bool js_gfx_GFXInputAssembler_setInstanceCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setInstanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setInstanceCount : Error processing arguments");
        cobj->setInstanceCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setInstanceCount)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXInputAssembler_finalize)

static bool js_gfx_GFXInputAssembler_constructor(se::State& s)
{
    //#3 cocos2d::GFXInputAssembler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXInputAssembler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXInputAssembler_constructor, __jsb_cocos2d_GFXInputAssembler_class, js_cocos2d_GFXInputAssembler_finalize)




static bool js_cocos2d_GFXInputAssembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXInputAssembler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXInputAssembler_finalize)

bool js_register_gfx_GFXInputAssembler(se::Object* obj)
{
    auto cls = se::Class::create("GFXInputAssembler", obj, nullptr, _SE(js_gfx_GFXInputAssembler_constructor));

    cls->defineProperty("instanceCount", _SE(js_gfx_GFXInputAssembler_instanceCount), nullptr);
    cls->defineProperty("vertexBuffers", _SE(js_gfx_GFXInputAssembler_vertexBuffers), nullptr);
    cls->defineProperty("firstInstance", _SE(js_gfx_GFXInputAssembler_firstInstance), nullptr);
    cls->defineProperty("vertexOffset", _SE(js_gfx_GFXInputAssembler_vertexOffset), nullptr);
    cls->defineProperty("vertexCount", _SE(js_gfx_GFXInputAssembler_vertexCount), nullptr);
    cls->defineProperty("indexBuffer", _SE(js_gfx_GFXInputAssembler_indexBuffer), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXInputAssembler_device), nullptr);
    cls->defineProperty("attributes", _SE(js_gfx_GFXInputAssembler_attributes), nullptr);
    cls->defineProperty("indexCount", _SE(js_gfx_GFXInputAssembler_indexCount), nullptr);
    cls->defineProperty("firstIndex", _SE(js_gfx_GFXInputAssembler_firstIndex), nullptr);
    cls->defineProperty("indirectBuffer", _SE(js_gfx_GFXInputAssembler_indirectBuffer), nullptr);
    cls->defineProperty("firstVertex", _SE(js_gfx_GFXInputAssembler_firstVertex), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXInputAssembler_initialize));
    cls->defineFunction("setIndexCount", _SE(js_gfx_GFXInputAssembler_setIndexCount));
    cls->defineFunction("setFirstInstance", _SE(js_gfx_GFXInputAssembler_setFirstInstance));
    cls->defineFunction("destroy", _SE(js_gfx_GFXInputAssembler_destroy));
    cls->defineFunction("setVertexOffset", _SE(js_gfx_GFXInputAssembler_setVertexOffset));
    cls->defineFunction("setFirstVertex", _SE(js_gfx_GFXInputAssembler_setFirstVertex));
    cls->defineFunction("setVertexCount", _SE(js_gfx_GFXInputAssembler_setVertexCount));
    cls->defineFunction("setFirstIndex", _SE(js_gfx_GFXInputAssembler_setFirstIndex));
    cls->defineFunction("setInstanceCount", _SE(js_gfx_GFXInputAssembler_setInstanceCount));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXInputAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXInputAssembler>(cls);

    __jsb_cocos2d_GFXInputAssembler_proto = cls->getProto();
    __jsb_cocos2d_GFXInputAssembler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXRenderPass_proto = nullptr;
se::Class* __jsb_cocos2d_GFXRenderPass_class = nullptr;

static bool js_gfx_GFXRenderPass_colorAttachments(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_colorAttachments : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXColorAttachment>& result = cobj->colorAttachments();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_colorAttachments : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPass_colorAttachments)

static bool js_gfx_GFXRenderPass_subPasses(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_subPasses : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXSubPass>& result = cobj->subPasses();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_subPasses : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPass_subPasses)

static bool js_gfx_GFXRenderPass_device(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPass_device)

static bool js_gfx_GFXRenderPass_initialize(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRenderPassInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_initialize)

static bool js_gfx_GFXRenderPass_destroy(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_destroy)

static bool js_gfx_GFXRenderPass_depthStencilAttachment(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_depthStencilAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXDepthStencilAttachment& result = cobj->depthStencilAttachment();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_depthStencilAttachment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPass_depthStencilAttachment)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXRenderPass_finalize)

static bool js_gfx_GFXRenderPass_constructor(se::State& s)
{
    //#3 cocos2d::GFXRenderPass: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXRenderPass constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXRenderPass_constructor, __jsb_cocos2d_GFXRenderPass_class, js_cocos2d_GFXRenderPass_finalize)




static bool js_cocos2d_GFXRenderPass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXRenderPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXRenderPass_finalize)

bool js_register_gfx_GFXRenderPass(se::Object* obj)
{
    auto cls = se::Class::create("GFXRenderPass", obj, nullptr, _SE(js_gfx_GFXRenderPass_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXRenderPass_device), nullptr);
    cls->defineProperty("colorAttachments", _SE(js_gfx_GFXRenderPass_colorAttachments), nullptr);
    cls->defineProperty("depthStencilAttachment", _SE(js_gfx_GFXRenderPass_depthStencilAttachment), nullptr);
    cls->defineProperty("subPasses", _SE(js_gfx_GFXRenderPass_subPasses), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXRenderPass_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXRenderPass_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXRenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXRenderPass>(cls);

    __jsb_cocos2d_GFXRenderPass_proto = cls->getProto();
    __jsb_cocos2d_GFXRenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXFramebuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GFXFramebuffer_class = nullptr;

static bool js_gfx_GFXFramebuffer_depthStencilView(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_depthStencilView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTextureView* result = cobj->depthStencilView();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_depthStencilView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_depthStencilView)

static bool js_gfx_GFXFramebuffer_isOffscreen(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_isOffscreen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isOffscreen();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_isOffscreen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_isOffscreen)

static bool js_gfx_GFXFramebuffer_device(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_device)

static bool js_gfx_GFXFramebuffer_renderPass(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_renderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXRenderPass* result = cobj->renderPass();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_renderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_renderPass)

static bool js_gfx_GFXFramebuffer_initialize(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXFramebufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_initialize)

static bool js_gfx_GFXFramebuffer_destroy(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_destroy)

static bool js_gfx_GFXFramebuffer_colorViews(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_colorViews : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXTextureView *>& result = cobj->colorViews();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_colorViews : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_colorViews)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXFramebuffer_finalize)

static bool js_gfx_GFXFramebuffer_constructor(se::State& s)
{
    //#3 cocos2d::GFXFramebuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXFramebuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXFramebuffer_constructor, __jsb_cocos2d_GFXFramebuffer_class, js_cocos2d_GFXFramebuffer_finalize)




static bool js_cocos2d_GFXFramebuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXFramebuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXFramebuffer_finalize)

bool js_register_gfx_GFXFramebuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXFramebuffer", obj, nullptr, _SE(js_gfx_GFXFramebuffer_constructor));

    cls->defineFunction("depthStencilView", _SE(js_gfx_GFXFramebuffer_depthStencilView));
    cls->defineFunction("isOffscreen", _SE(js_gfx_GFXFramebuffer_isOffscreen));
    cls->defineFunction("device", _SE(js_gfx_GFXFramebuffer_device));
    cls->defineFunction("renderPass", _SE(js_gfx_GFXFramebuffer_renderPass));
    cls->defineFunction("initialize", _SE(js_gfx_GFXFramebuffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXFramebuffer_destroy));
    cls->defineFunction("colorViews", _SE(js_gfx_GFXFramebuffer_colorViews));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXFramebuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXFramebuffer>(cls);

    __jsb_cocos2d_GFXFramebuffer_proto = cls->getProto();
    __jsb_cocos2d_GFXFramebuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBindingLayout_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBindingLayout_class = nullptr;

static bool js_gfx_GFXBindingLayout_bindTextureView(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cocos2d::GFXTextureView* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_bindTextureView : Error processing arguments");
        cobj->bindTextureView(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_bindTextureView)

static bool js_gfx_GFXBindingLayout_bindingUnits(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindingUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXBindingUnit>& result = cobj->bindingUnits();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_bindingUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingLayout_bindingUnits)

static bool js_gfx_GFXBindingLayout_bindBuffer(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cocos2d::GFXBuffer* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_bindBuffer : Error processing arguments");
        cobj->bindBuffer(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_bindBuffer)

static bool js_gfx_GFXBindingLayout_bindSampler(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cocos2d::GFXSampler* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_bindSampler : Error processing arguments");
        cobj->bindSampler(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_bindSampler)

static bool js_gfx_GFXBindingLayout_update(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_update)

static bool js_gfx_GFXBindingLayout_device(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingLayout_device)

static bool js_gfx_GFXBindingLayout_initialize(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayoutInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_initialize)

static bool js_gfx_GFXBindingLayout_destroy(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBindingLayout_finalize)

static bool js_gfx_GFXBindingLayout_constructor(se::State& s)
{
    //#3 cocos2d::GFXBindingLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXBindingLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBindingLayout_constructor, __jsb_cocos2d_GFXBindingLayout_class, js_cocos2d_GFXBindingLayout_finalize)




static bool js_cocos2d_GFXBindingLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBindingLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBindingLayout_finalize)

bool js_register_gfx_GFXBindingLayout(se::Object* obj)
{
    auto cls = se::Class::create("GFXBindingLayout", obj, nullptr, _SE(js_gfx_GFXBindingLayout_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXBindingLayout_device), nullptr);
    cls->defineProperty("bindingUnits", _SE(js_gfx_GFXBindingLayout_bindingUnits), nullptr);
    cls->defineFunction("bindTextureView", _SE(js_gfx_GFXBindingLayout_bindTextureView));
    cls->defineFunction("bindBuffer", _SE(js_gfx_GFXBindingLayout_bindBuffer));
    cls->defineFunction("bindSampler", _SE(js_gfx_GFXBindingLayout_bindSampler));
    cls->defineFunction("update", _SE(js_gfx_GFXBindingLayout_update));
    cls->defineFunction("initialize", _SE(js_gfx_GFXBindingLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXBindingLayout_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBindingLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBindingLayout>(cls);

    __jsb_cocos2d_GFXBindingLayout_proto = cls->getProto();
    __jsb_cocos2d_GFXBindingLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXPipelineLayout_proto = nullptr;
se::Class* __jsb_cocos2d_GFXPipelineLayout_class = nullptr;

static bool js_gfx_GFXPipelineLayout_device(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineLayout_device)

static bool js_gfx_GFXPipelineLayout_initialize(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineLayoutInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_initialize)

static bool js_gfx_GFXPipelineLayout_destroy(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXPipelineLayout_finalize)

static bool js_gfx_GFXPipelineLayout_constructor(se::State& s)
{
    //#3 cocos2d::GFXPipelineLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXPipelineLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXPipelineLayout_constructor, __jsb_cocos2d_GFXPipelineLayout_class, js_cocos2d_GFXPipelineLayout_finalize)




static bool js_cocos2d_GFXPipelineLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXPipelineLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXPipelineLayout_finalize)

bool js_register_gfx_GFXPipelineLayout(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineLayout", obj, nullptr, _SE(js_gfx_GFXPipelineLayout_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXPipelineLayout_device), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXPipelineLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXPipelineLayout_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXPipelineLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXPipelineLayout>(cls);

    __jsb_cocos2d_GFXPipelineLayout_proto = cls->getProto();
    __jsb_cocos2d_GFXPipelineLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXPipelineState_proto = nullptr;
se::Class* __jsb_cocos2d_GFXPipelineState_class = nullptr;

static bool js_gfx_GFXPipelineState_primitive(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_primitive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->primitive();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_primitive : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_primitive)

static bool js_gfx_GFXPipelineState_renderPass(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_renderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXRenderPass* result = cobj->renderPass();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_renderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_renderPass)

static bool js_gfx_GFXPipelineState_rasterizerState(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_rasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXRasterizerState& result = cobj->rasterizerState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_rasterizerState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_rasterizerState)

static bool js_gfx_GFXPipelineState_dynamicStates(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_dynamicStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXDynamicState>& result = cobj->dynamicStates();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_dynamicStates : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_dynamicStates)

static bool js_gfx_GFXPipelineState_shader(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_shader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXShader* result = cobj->shader();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_shader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_shader)

static bool js_gfx_GFXPipelineState_inputState(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_inputState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXInputState& result = cobj->inputState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_inputState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_inputState)

static bool js_gfx_GFXPipelineState_device(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_device)

static bool js_gfx_GFXPipelineState_blendState(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_blendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXBlendState& result = cobj->blendState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_blendState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_blendState)

static bool js_gfx_GFXPipelineState_pipelineLayout(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_pipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXPipelineLayout* result = cobj->pipelineLayout();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_pipelineLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_pipelineLayout)

static bool js_gfx_GFXPipelineState_initialize(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineStateInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_initialize)

static bool js_gfx_GFXPipelineState_destroy(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_destroy)

static bool js_gfx_GFXPipelineState_depthStencilState(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_depthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXDepthStencilState& result = cobj->depthStencilState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_depthStencilState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_depthStencilState)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXPipelineState_finalize)

static bool js_gfx_GFXPipelineState_constructor(se::State& s)
{
    //#3 cocos2d::GFXPipelineState: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXPipelineState constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXPipelineState_constructor, __jsb_cocos2d_GFXPipelineState_class, js_cocos2d_GFXPipelineState_finalize)




static bool js_cocos2d_GFXPipelineState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXPipelineState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXPipelineState_finalize)

bool js_register_gfx_GFXPipelineState(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineState", obj, nullptr, _SE(js_gfx_GFXPipelineState_constructor));

    cls->defineProperty("primitive", _SE(js_gfx_GFXPipelineState_primitive), nullptr);
    cls->defineProperty("rasterizerState", _SE(js_gfx_GFXPipelineState_rasterizerState), nullptr);
    cls->defineProperty("shader", _SE(js_gfx_GFXPipelineState_shader), nullptr);
    cls->defineProperty("blendState", _SE(js_gfx_GFXPipelineState_blendState), nullptr);
    cls->defineProperty("pipelineLayout", _SE(js_gfx_GFXPipelineState_pipelineLayout), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_GFXPipelineState_renderPass), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXPipelineState_device), nullptr);
    cls->defineProperty("inputState", _SE(js_gfx_GFXPipelineState_inputState), nullptr);
    cls->defineProperty("depthStencilState", _SE(js_gfx_GFXPipelineState_depthStencilState), nullptr);
    cls->defineFunction("dynamicStates", _SE(js_gfx_GFXPipelineState_dynamicStates));
    cls->defineFunction("initialize", _SE(js_gfx_GFXPipelineState_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXPipelineState_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXPipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXPipelineState>(cls);

    __jsb_cocos2d_GFXPipelineState_proto = cls->getProto();
    __jsb_cocos2d_GFXPipelineState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXCommandAllocator_proto = nullptr;
se::Class* __jsb_cocos2d_GFXCommandAllocator_class = nullptr;

static bool js_gfx_GFXCommandAllocator_initialize(se::State& s)
{
    cocos2d::GFXCommandAllocator* cobj = (cocos2d::GFXCommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandAllocator_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandAllocatorInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandAllocator_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandAllocator_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandAllocator_initialize)

static bool js_gfx_GFXCommandAllocator_destroy(se::State& s)
{
    cocos2d::GFXCommandAllocator* cobj = (cocos2d::GFXCommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandAllocator_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandAllocator_destroy)

static bool js_gfx_GFXCommandAllocator_device(se::State& s)
{
    cocos2d::GFXCommandAllocator* cobj = (cocos2d::GFXCommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandAllocator_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandAllocator_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandAllocator_device)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXCommandAllocator_finalize)

static bool js_gfx_GFXCommandAllocator_constructor(se::State& s)
{
    //#3 cocos2d::GFXCommandAllocator: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXCommandAllocator constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXCommandAllocator_constructor, __jsb_cocos2d_GFXCommandAllocator_class, js_cocos2d_GFXCommandAllocator_finalize)




static bool js_cocos2d_GFXCommandAllocator_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXCommandAllocator)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXCommandAllocator* cobj = (cocos2d::GFXCommandAllocator*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXCommandAllocator_finalize)

bool js_register_gfx_GFXCommandAllocator(se::Object* obj)
{
    auto cls = se::Class::create("GFXCommandAllocator", obj, nullptr, _SE(js_gfx_GFXCommandAllocator_constructor));

    cls->defineFunction("initialize", _SE(js_gfx_GFXCommandAllocator_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXCommandAllocator_destroy));
    cls->defineFunction("device", _SE(js_gfx_GFXCommandAllocator_device));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXCommandAllocator_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXCommandAllocator>(cls);

    __jsb_cocos2d_GFXCommandAllocator_proto = cls->getProto();
    __jsb_cocos2d_GFXCommandAllocator_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXCommandBuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GFXCommandBuffer_class = nullptr;

static bool js_gfx_GFXCommandBuffer_draw(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_draw : Error processing arguments");
        cobj->draw(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_draw)

static bool js_gfx_GFXCommandBuffer_setBlendConstants(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setBlendConstants : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXColor* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setBlendConstants : Error processing arguments");
        cobj->setBlendConstants(*arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setBlendConstants)

static bool js_gfx_GFXCommandBuffer_device(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXCommandBuffer_device)

static bool js_gfx_GFXCommandBuffer_setDepthBound(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setDepthBound : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setDepthBound : Error processing arguments");
        cobj->setDepthBound(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setDepthBound)

static bool js_gfx_GFXCommandBuffer_copyBufferToTexture(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_copyBufferToTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cocos2d::GFXBuffer* arg0 = nullptr;
        cocos2d::GFXTexture* arg1 = nullptr;
        cocos2d::GFXTextureLayout arg2;
        std::vector<cocos2d::GFXBufferTextureCopy> arg3;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXTextureLayout)tmp; } while(false);
        ok &= seval_to_std_vector(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_copyBufferToTexture : Error processing arguments");
        cobj->copyBufferToTexture(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_copyBufferToTexture)

static bool js_gfx_GFXCommandBuffer_setLineWidth(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setLineWidth)

static bool js_gfx_GFXCommandBuffer_updateBuffer(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_updateBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::GFXBuffer* arg0 = nullptr;
        void* arg1 = nullptr;
        unsigned int arg2 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_updateBuffer : Error processing arguments");
        cobj->updateBuffer(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::GFXBuffer* arg0 = nullptr;
        void* arg1 = nullptr;
        unsigned int arg2 = 0;
        unsigned int arg3 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_updateBuffer : Error processing arguments");
        cobj->updateBuffer(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_updateBuffer)

static bool js_gfx_GFXCommandBuffer_end(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_end : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->end();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_end)

static bool js_gfx_GFXCommandBuffer_setStencilWriteMask(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setStencilWriteMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXStencilFace arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilFace)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setStencilWriteMask : Error processing arguments");
        cobj->setStencilWriteMask(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setStencilWriteMask)

static bool js_gfx_GFXCommandBuffer_setStencilCompareMask(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setStencilCompareMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::GFXStencilFace arg0;
        int arg1 = 0;
        unsigned int arg2 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilFace)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setStencilCompareMask : Error processing arguments");
        cobj->setStencilCompareMask(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setStencilCompareMask)

static bool js_gfx_GFXCommandBuffer_bindInputAssembler(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_bindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_bindInputAssembler : Error processing arguments");
        cobj->bindInputAssembler(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_bindInputAssembler)

static bool js_gfx_GFXCommandBuffer_allocator(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_allocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXCommandAllocator* result = cobj->allocator();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_allocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXCommandBuffer_allocator)

static bool js_gfx_GFXCommandBuffer_bindPipelineState(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_bindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineState* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_bindPipelineState : Error processing arguments");
        cobj->bindPipelineState(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_bindPipelineState)

static bool js_gfx_GFXCommandBuffer_destroy(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_destroy)

static bool js_gfx_GFXCommandBuffer_type(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_type : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->type();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_type : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXCommandBuffer_type)

static bool js_gfx_GFXCommandBuffer_setViewport(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXViewport* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setViewport : Error processing arguments");
        cobj->setViewport(*arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setViewport)

static bool js_gfx_GFXCommandBuffer_setDepthBias(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setDepthBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setDepthBias : Error processing arguments");
        cobj->setDepthBias(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setDepthBias)

static bool js_gfx_GFXCommandBuffer_begin(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_begin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->begin();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_begin)

static bool js_gfx_GFXCommandBuffer_numDrawCalls(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_numDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->numDrawCalls();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_numDrawCalls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXCommandBuffer_numDrawCalls)

static bool js_gfx_GFXCommandBuffer_bindBindingLayout(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_bindBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayout* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_bindBindingLayout : Error processing arguments");
        cobj->bindBindingLayout(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_bindBindingLayout)

static bool js_gfx_GFXCommandBuffer_endRenderPass(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_endRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->endRenderPass();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_endRenderPass)

static bool js_gfx_GFXCommandBuffer_initialize(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_initialize)

static bool js_gfx_GFXCommandBuffer_setScissor(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRect* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setScissor : Error processing arguments");
        cobj->setScissor(*arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setScissor)

static bool js_gfx_GFXCommandBuffer_numTris(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_numTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->numTris();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_numTris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXCommandBuffer_numTris)

static bool js_gfx_GFXCommandBuffer_beginRenderPass(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_beginRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        cocos2d::GFXFramebuffer* arg0 = nullptr;
        cocos2d::GFXRect* arg1 = nullptr;
        cocos2d::GFXClearFlagBit arg2;
        std::vector<cocos2d::GFXColor> arg3;
        float arg4 = 0;
        int arg5 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_reference(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXClearFlagBit)tmp; } while(false);
        ok &= seval_to_std_vector(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_beginRenderPass : Error processing arguments");
        cobj->beginRenderPass(arg0, *arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_beginRenderPass)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXCommandBuffer_finalize)

static bool js_gfx_GFXCommandBuffer_constructor(se::State& s)
{
    //#3 cocos2d::GFXCommandBuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXCommandBuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXCommandBuffer_constructor, __jsb_cocos2d_GFXCommandBuffer_class, js_cocos2d_GFXCommandBuffer_finalize)




static bool js_cocos2d_GFXCommandBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXCommandBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXCommandBuffer_finalize)

bool js_register_gfx_GFXCommandBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXCommandBuffer", obj, nullptr, _SE(js_gfx_GFXCommandBuffer_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXCommandBuffer_device), nullptr);
    cls->defineProperty("numDrawCalls", _SE(js_gfx_GFXCommandBuffer_numDrawCalls), nullptr);
    cls->defineProperty("type", _SE(js_gfx_GFXCommandBuffer_type), nullptr);
    cls->defineProperty("numTris", _SE(js_gfx_GFXCommandBuffer_numTris), nullptr);
    cls->defineProperty("allocator", _SE(js_gfx_GFXCommandBuffer_allocator), nullptr);
    cls->defineFunction("draw", _SE(js_gfx_GFXCommandBuffer_draw));
    cls->defineFunction("setBlendConstants", _SE(js_gfx_GFXCommandBuffer_setBlendConstants));
    cls->defineFunction("setDepthBound", _SE(js_gfx_GFXCommandBuffer_setDepthBound));
    cls->defineFunction("copyBufferToTexture", _SE(js_gfx_GFXCommandBuffer_copyBufferToTexture));
    cls->defineFunction("setLineWidth", _SE(js_gfx_GFXCommandBuffer_setLineWidth));
    cls->defineFunction("updateBuffer", _SE(js_gfx_GFXCommandBuffer_updateBuffer));
    cls->defineFunction("end", _SE(js_gfx_GFXCommandBuffer_end));
    cls->defineFunction("setStencilWriteMask", _SE(js_gfx_GFXCommandBuffer_setStencilWriteMask));
    cls->defineFunction("setStencilCompareMask", _SE(js_gfx_GFXCommandBuffer_setStencilCompareMask));
    cls->defineFunction("bindInputAssembler", _SE(js_gfx_GFXCommandBuffer_bindInputAssembler));
    cls->defineFunction("bindPipelineState", _SE(js_gfx_GFXCommandBuffer_bindPipelineState));
    cls->defineFunction("destroy", _SE(js_gfx_GFXCommandBuffer_destroy));
    cls->defineFunction("setViewport", _SE(js_gfx_GFXCommandBuffer_setViewport));
    cls->defineFunction("setDepthBias", _SE(js_gfx_GFXCommandBuffer_setDepthBias));
    cls->defineFunction("begin", _SE(js_gfx_GFXCommandBuffer_begin));
    cls->defineFunction("bindBindingLayout", _SE(js_gfx_GFXCommandBuffer_bindBindingLayout));
    cls->defineFunction("endRenderPass", _SE(js_gfx_GFXCommandBuffer_endRenderPass));
    cls->defineFunction("initialize", _SE(js_gfx_GFXCommandBuffer_initialize));
    cls->defineFunction("setScissor", _SE(js_gfx_GFXCommandBuffer_setScissor));
    cls->defineFunction("beginRenderPass", _SE(js_gfx_GFXCommandBuffer_beginRenderPass));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXCommandBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXCommandBuffer>(cls);

    __jsb_cocos2d_GFXCommandBuffer_proto = cls->getProto();
    __jsb_cocos2d_GFXCommandBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXQueue_proto = nullptr;
se::Class* __jsb_cocos2d_GFXQueue_class = nullptr;

static bool js_gfx_GFXQueue_submit(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_submit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<cocos2d::GFXCommandBuffer *> arg0;
        ok &= seval_to_std_vector(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_submit : Error processing arguments");
        cobj->submit(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_submit)

static bool js_gfx_GFXQueue_device(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXQueue_device)

static bool js_gfx_GFXQueue_initialize(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXQueueInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_initialize)

static bool js_gfx_GFXQueue_destroy(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_destroy)

static bool js_gfx_GFXQueue_type(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_type : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->type();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_type : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXQueue_type)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXQueue_finalize)

static bool js_gfx_GFXQueue_constructor(se::State& s)
{
    //#3 cocos2d::GFXQueue: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXQueue constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXQueue_constructor, __jsb_cocos2d_GFXQueue_class, js_cocos2d_GFXQueue_finalize)




static bool js_cocos2d_GFXQueue_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXQueue)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXQueue_finalize)

bool js_register_gfx_GFXQueue(se::Object* obj)
{
    auto cls = se::Class::create("GFXQueue", obj, nullptr, _SE(js_gfx_GFXQueue_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXQueue_device), nullptr);
    cls->defineProperty("type", _SE(js_gfx_GFXQueue_type), nullptr);
    cls->defineFunction("submit", _SE(js_gfx_GFXQueue_submit));
    cls->defineFunction("initialize", _SE(js_gfx_GFXQueue_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXQueue_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXQueue_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXQueue>(cls);

    __jsb_cocos2d_GFXQueue_proto = cls->getProto();
    __jsb_cocos2d_GFXQueue_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2Device_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Device_class = nullptr;

static bool js_gfx_GLES2Device_checkExtension(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_checkExtension : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_checkExtension : Error processing arguments");
        bool result = cobj->checkExtension(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_checkExtension : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_checkExtension)

static bool js_gfx_GLES2Device_useInstancedArrays(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_useInstancedArrays : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->useInstancedArrays();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_useInstancedArrays : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_useInstancedArrays)

static bool js_gfx_GLES2Device_useVAO(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_useVAO : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->useVAO();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_useVAO : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_useVAO)

static bool js_gfx_GLES2Device_useDrawInstanced(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_useDrawInstanced : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->useDrawInstanced();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_useDrawInstanced : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_useDrawInstanced)

static bool js_gfx_GLES2Device_useDiscardFramebuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_useDiscardFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->useDiscardFramebuffer();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_useDiscardFramebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_useDiscardFramebuffer)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Device_finalize)

static bool js_gfx_GLES2Device_constructor(se::State& s)
{
    cocos2d::GLES2Device* cobj = JSB_ALLOC(cocos2d::GLES2Device);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Device_constructor, __jsb_cocos2d_GLES2Device_class, js_cocos2d_GLES2Device_finalize)



extern se::Object* __jsb_cocos2d_GFXDevice_proto;

static bool js_cocos2d_GLES2Device_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Device)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Device_finalize)

bool js_register_gfx_GLES2Device(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Device", obj, __jsb_cocos2d_GFXDevice_proto, _SE(js_gfx_GLES2Device_constructor));

    cls->defineFunction("checkExtension", _SE(js_gfx_GLES2Device_checkExtension));
    cls->defineFunction("useInstancedArrays", _SE(js_gfx_GLES2Device_useInstancedArrays));
    cls->defineFunction("useVAO", _SE(js_gfx_GLES2Device_useVAO));
    cls->defineFunction("useDrawInstanced", _SE(js_gfx_GLES2Device_useDrawInstanced));
    cls->defineFunction("useDiscardFramebuffer", _SE(js_gfx_GLES2Device_useDiscardFramebuffer));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Device_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Device>(cls);

    __jsb_cocos2d_GLES2Device_proto = cls->getProto();
    __jsb_cocos2d_GLES2Device_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_gfx(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("gfx", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("gfx", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_gfx_GFXExtent(ns);
    js_register_gfx_GFXBlendState(ns);
    js_register_gfx_GFXBufferTextureCopy(ns);
    js_register_gfx_GFXUniform(ns);
    js_register_gfx_GFXTextureViewInfo(ns);
    js_register_gfx_GFXWindowInfo(ns);
    js_register_gfx_GFXBuffer(ns);
    js_register_gfx_GFXRenderPass(ns);
    js_register_gfx_GFXPipelineLayoutInfo(ns);
    js_register_gfx_GFXBindingUnit(ns);
    js_register_gfx_GFXDevice(ns);
    js_register_gfx_GFXPipelineStateInfo(ns);
    js_register_gfx_GFXWindow(ns);
    js_register_gfx_GFXSampler(ns);
    js_register_gfx_GFXUniformBlock(ns);
    js_register_gfx_GFXBindingLayoutInfo(ns);
    js_register_gfx_GFXUniformSampler(ns);
    js_register_gfx_GFXFormatInfo(ns);
    js_register_gfx_GFXInputAssembler(ns);
    js_register_gfx_GFXContextInfo(ns);
    js_register_gfx_GFXShader(ns);
    js_register_gfx_GFXDeviceInfo(ns);
    js_register_gfx_GFXTextureView(ns);
    js_register_gfx_GFXPipelineLayout(ns);
    js_register_gfx_GFXFramebufferInfo(ns);
    js_register_gfx_GFXPipelineState(ns);
    js_register_gfx_GFXBinding(ns);
    js_register_gfx_GFXRasterizerState(ns);
    js_register_gfx_GFXTextureInfo(ns);
    js_register_gfx_GFXQueueInfo(ns);
    js_register_gfx_GFXShaderStage(ns);
    js_register_gfx_GFXShaderInfo(ns);
    js_register_gfx_GFXOffset(ns);
    js_register_gfx_GFXPushConstantRange(ns);
    js_register_gfx_GFXMemoryStatus(ns);
    js_register_gfx_GFXCommandBuffer(ns);
    js_register_gfx_GFXColorAttachment(ns);
    js_register_gfx_GFXCommandBufferInfo(ns);
    js_register_gfx_GLES2Device(ns);
    js_register_gfx_GFXBindingLayout(ns);
    js_register_gfx_GFXTexture(ns);
    js_register_gfx_GFXQueue(ns);
    js_register_gfx_GFXViewport(ns);
    js_register_gfx_GFXDepthStencilState(ns);
    js_register_gfx_GFXDepthStencilAttachment(ns);
    js_register_gfx_GFXBufferInfo(ns);
    js_register_gfx_GFXInputState(ns);
    js_register_gfx_GFXDrawInfo(ns);
    js_register_gfx_GFXTextureSubres(ns);
    js_register_gfx_GFXTextureCopy(ns);
    js_register_gfx_GFXIndirectBuffer(ns);
    js_register_gfx_GFXSamplerInfo(ns);
    js_register_gfx_GFXRect(ns);
    js_register_gfx_GFXShaderMacro(ns);
    js_register_gfx_GFXRenderPassInfo(ns);
    js_register_gfx_GFXFramebuffer(ns);
    js_register_gfx_GFXCommandAllocator(ns);
    js_register_gfx_GFXBlendTarget(ns);
    js_register_gfx_GFXInputAssemblerInfo(ns);
    js_register_gfx_GFXColor(ns);
    js_register_gfx_GFXAttribute(ns);
    return true;
}

