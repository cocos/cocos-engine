#include "scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/core/Core.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_gfx_GFXOffset_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXOffset_class = nullptr;

static bool js_gfx_GFXOffset_get_x(se::State& s)
{
    cc::gfx::GFXOffset* cobj = (cc::gfx::GFXOffset*)s.nativeThisObject();
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
    cc::gfx::GFXOffset* cobj = (cc::gfx::GFXOffset*)s.nativeThisObject();
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
    cc::gfx::GFXOffset* cobj = (cc::gfx::GFXOffset*)s.nativeThisObject();
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
    cc::gfx::GFXOffset* cobj = (cc::gfx::GFXOffset*)s.nativeThisObject();
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
    cc::gfx::GFXOffset* cobj = (cc::gfx::GFXOffset*)s.nativeThisObject();
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
    cc::gfx::GFXOffset* cobj = (cc::gfx::GFXOffset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXOffset_set_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXOffset_set_z : Error processing new value");
    cobj->z = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXOffset_set_z)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXOffset_finalize)

static bool js_gfx_GFXOffset_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXOffset* cobj = JSB_ALLOC(cc::gfx::GFXOffset);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXOffset* cobj = JSB_ALLOC(cc::gfx::GFXOffset);
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
        cc::gfx::GFXOffset* cobj = JSB_ALLOC(cc::gfx::GFXOffset);
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
SE_BIND_CTOR(js_gfx_GFXOffset_constructor, __jsb_cc_gfx_GFXOffset_class, js_cc_gfx_GFXOffset_finalize)




static bool js_cc_gfx_GFXOffset_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXOffset)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXOffset* cobj = (cc::gfx::GFXOffset*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXOffset_finalize)

bool js_register_gfx_GFXOffset(se::Object* obj)
{
    auto cls = se::Class::create("GFXOffset", obj, nullptr, _SE(js_gfx_GFXOffset_constructor));

    cls->defineProperty("x", _SE(js_gfx_GFXOffset_get_x), _SE(js_gfx_GFXOffset_set_x));
    cls->defineProperty("y", _SE(js_gfx_GFXOffset_get_y), _SE(js_gfx_GFXOffset_set_y));
    cls->defineProperty("z", _SE(js_gfx_GFXOffset_get_z), _SE(js_gfx_GFXOffset_set_z));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXOffset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXOffset>(cls);

    __jsb_cc_gfx_GFXOffset_proto = cls->getProto();
    __jsb_cc_gfx_GFXOffset_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXRect_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXRect_class = nullptr;

static bool js_gfx_GFXRect_get_x(se::State& s)
{
    cc::gfx::GFXRect* cobj = (cc::gfx::GFXRect*)s.nativeThisObject();
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
    cc::gfx::GFXRect* cobj = (cc::gfx::GFXRect*)s.nativeThisObject();
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
    cc::gfx::GFXRect* cobj = (cc::gfx::GFXRect*)s.nativeThisObject();
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
    cc::gfx::GFXRect* cobj = (cc::gfx::GFXRect*)s.nativeThisObject();
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
    cc::gfx::GFXRect* cobj = (cc::gfx::GFXRect*)s.nativeThisObject();
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
    cc::gfx::GFXRect* cobj = (cc::gfx::GFXRect*)s.nativeThisObject();
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
    cc::gfx::GFXRect* cobj = (cc::gfx::GFXRect*)s.nativeThisObject();
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
    cc::gfx::GFXRect* cobj = (cc::gfx::GFXRect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRect_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRect_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRect_set_height)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXRect_finalize)

static bool js_gfx_GFXRect_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXRect* cobj = JSB_ALLOC(cc::gfx::GFXRect);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXRect* cobj = JSB_ALLOC(cc::gfx::GFXRect);
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
        cc::gfx::GFXRect* cobj = JSB_ALLOC(cc::gfx::GFXRect);
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
SE_BIND_CTOR(js_gfx_GFXRect_constructor, __jsb_cc_gfx_GFXRect_class, js_cc_gfx_GFXRect_finalize)




static bool js_cc_gfx_GFXRect_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXRect)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXRect* cobj = (cc::gfx::GFXRect*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXRect_finalize)

bool js_register_gfx_GFXRect(se::Object* obj)
{
    auto cls = se::Class::create("GFXRect", obj, nullptr, _SE(js_gfx_GFXRect_constructor));

    cls->defineProperty("x", _SE(js_gfx_GFXRect_get_x), _SE(js_gfx_GFXRect_set_x));
    cls->defineProperty("y", _SE(js_gfx_GFXRect_get_y), _SE(js_gfx_GFXRect_set_y));
    cls->defineProperty("width", _SE(js_gfx_GFXRect_get_width), _SE(js_gfx_GFXRect_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXRect_get_height), _SE(js_gfx_GFXRect_set_height));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXRect_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXRect>(cls);

    __jsb_cc_gfx_GFXRect_proto = cls->getProto();
    __jsb_cc_gfx_GFXRect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXExtent_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXExtent_class = nullptr;

static bool js_gfx_GFXExtent_get_width(se::State& s)
{
    cc::gfx::GFXExtent* cobj = (cc::gfx::GFXExtent*)s.nativeThisObject();
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
    cc::gfx::GFXExtent* cobj = (cc::gfx::GFXExtent*)s.nativeThisObject();
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
    cc::gfx::GFXExtent* cobj = (cc::gfx::GFXExtent*)s.nativeThisObject();
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
    cc::gfx::GFXExtent* cobj = (cc::gfx::GFXExtent*)s.nativeThisObject();
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
    cc::gfx::GFXExtent* cobj = (cc::gfx::GFXExtent*)s.nativeThisObject();
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
    cc::gfx::GFXExtent* cobj = (cc::gfx::GFXExtent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXExtent_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXExtent_set_depth : Error processing new value");
    cobj->depth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXExtent_set_depth)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXExtent_finalize)

static bool js_gfx_GFXExtent_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXExtent* cobj = JSB_ALLOC(cc::gfx::GFXExtent);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXExtent* cobj = JSB_ALLOC(cc::gfx::GFXExtent);
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
        cc::gfx::GFXExtent* cobj = JSB_ALLOC(cc::gfx::GFXExtent);
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
SE_BIND_CTOR(js_gfx_GFXExtent_constructor, __jsb_cc_gfx_GFXExtent_class, js_cc_gfx_GFXExtent_finalize)




static bool js_cc_gfx_GFXExtent_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXExtent)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXExtent* cobj = (cc::gfx::GFXExtent*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXExtent_finalize)

bool js_register_gfx_GFXExtent(se::Object* obj)
{
    auto cls = se::Class::create("GFXExtent", obj, nullptr, _SE(js_gfx_GFXExtent_constructor));

    cls->defineProperty("width", _SE(js_gfx_GFXExtent_get_width), _SE(js_gfx_GFXExtent_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXExtent_get_height), _SE(js_gfx_GFXExtent_set_height));
    cls->defineProperty("depth", _SE(js_gfx_GFXExtent_get_depth), _SE(js_gfx_GFXExtent_set_depth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXExtent_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXExtent>(cls);

    __jsb_cc_gfx_GFXExtent_proto = cls->getProto();
    __jsb_cc_gfx_GFXExtent_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXTextureSubres_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXTextureSubres_class = nullptr;

static bool js_gfx_GFXTextureSubres_get_mipLevel(se::State& s)
{
    cc::gfx::GFXTextureSubres* cobj = (cc::gfx::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_get_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->mipLevel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureSubres_get_mipLevel)

static bool js_gfx_GFXTextureSubres_set_mipLevel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXTextureSubres* cobj = (cc::gfx::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_mipLevel : Error processing new value");
    cobj->mipLevel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_mipLevel)

static bool js_gfx_GFXTextureSubres_get_baseArrayLayer(se::State& s)
{
    cc::gfx::GFXTextureSubres* cobj = (cc::gfx::GFXTextureSubres*)s.nativeThisObject();
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
    cc::gfx::GFXTextureSubres* cobj = (cc::gfx::GFXTextureSubres*)s.nativeThisObject();
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
    cc::gfx::GFXTextureSubres* cobj = (cc::gfx::GFXTextureSubres*)s.nativeThisObject();
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
    cc::gfx::GFXTextureSubres* cobj = (cc::gfx::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_layerCount : Error processing new value");
    cobj->layerCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_layerCount)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXTextureSubres_finalize)

static bool js_gfx_GFXTextureSubres_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXTextureSubres* cobj = JSB_ALLOC(cc::gfx::GFXTextureSubres);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXTextureSubres* cobj = JSB_ALLOC(cc::gfx::GFXTextureSubres);
        unsigned int arg0 = 0;
        json->getProperty("mipLevel", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->mipLevel = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("baseArrayLayer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->baseArrayLayer = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("layerCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->layerCount = arg2;
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
        cc::gfx::GFXTextureSubres* cobj = JSB_ALLOC(cc::gfx::GFXTextureSubres);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->mipLevel = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->baseArrayLayer = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->layerCount = arg2;
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
SE_BIND_CTOR(js_gfx_GFXTextureSubres_constructor, __jsb_cc_gfx_GFXTextureSubres_class, js_cc_gfx_GFXTextureSubres_finalize)




static bool js_cc_gfx_GFXTextureSubres_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXTextureSubres)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXTextureSubres* cobj = (cc::gfx::GFXTextureSubres*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXTextureSubres_finalize)

bool js_register_gfx_GFXTextureSubres(se::Object* obj)
{
    auto cls = se::Class::create("GFXTextureSubres", obj, nullptr, _SE(js_gfx_GFXTextureSubres_constructor));

    cls->defineProperty("mipLevel", _SE(js_gfx_GFXTextureSubres_get_mipLevel), _SE(js_gfx_GFXTextureSubres_set_mipLevel));
    cls->defineProperty("baseArrayLayer", _SE(js_gfx_GFXTextureSubres_get_baseArrayLayer), _SE(js_gfx_GFXTextureSubres_set_baseArrayLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_GFXTextureSubres_get_layerCount), _SE(js_gfx_GFXTextureSubres_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXTextureSubres_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXTextureSubres>(cls);

    __jsb_cc_gfx_GFXTextureSubres_proto = cls->getProto();
    __jsb_cc_gfx_GFXTextureSubres_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXTextureCopy_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXTextureCopy_class = nullptr;

static bool js_gfx_GFXTextureCopy_get_srcSubres(se::State& s)
{
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_srcSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_srcSubres : Error processing new value");
    cobj->srcSubres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_srcSubres)

static bool js_gfx_GFXTextureCopy_get_srcOffset(se::State& s)
{
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_srcOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXOffset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_srcOffset : Error processing new value");
    cobj->srcOffset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_srcOffset)

static bool js_gfx_GFXTextureCopy_get_dstSubres(se::State& s)
{
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_dstSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_dstSubres : Error processing new value");
    cobj->dstSubres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_dstSubres)

static bool js_gfx_GFXTextureCopy_get_dstOffset(se::State& s)
{
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_dstOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXOffset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_dstOffset : Error processing new value");
    cobj->dstOffset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_dstOffset)

static bool js_gfx_GFXTextureCopy_get_extent(se::State& s)
{
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_extent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXExtent* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_extent : Error processing new value");
    cobj->extent = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_extent)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXTextureCopy_finalize)

static bool js_gfx_GFXTextureCopy_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXTextureCopy* cobj = JSB_ALLOC(cc::gfx::GFXTextureCopy);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXTextureCopy* cobj = JSB_ALLOC(cc::gfx::GFXTextureCopy);
        cc::gfx::GFXTextureSubres* arg0 = nullptr;
        json->getProperty("srcSubres", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg0);
            cobj->srcSubres = *arg0;
        }
        cc::gfx::GFXOffset* arg1 = nullptr;
        json->getProperty("srcOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg1);
            cobj->srcOffset = *arg1;
        }
        cc::gfx::GFXTextureSubres* arg2 = nullptr;
        json->getProperty("dstSubres", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->dstSubres = *arg2;
        }
        cc::gfx::GFXOffset* arg3 = nullptr;
        json->getProperty("dstOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->dstOffset = *arg3;
        }
        cc::gfx::GFXExtent* arg4 = nullptr;
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
        cc::gfx::GFXTextureCopy* cobj = JSB_ALLOC(cc::gfx::GFXTextureCopy);
        cc::gfx::GFXTextureSubres* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_reference(args[0], &arg0);
            cobj->srcSubres = *arg0;
        }
        cc::gfx::GFXOffset* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_reference(args[1], &arg1);
            cobj->srcOffset = *arg1;
        }
        cc::gfx::GFXTextureSubres* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->dstSubres = *arg2;
        }
        cc::gfx::GFXOffset* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_reference(args[3], &arg3);
            cobj->dstOffset = *arg3;
        }
        cc::gfx::GFXExtent* arg4 = nullptr;
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
SE_BIND_CTOR(js_gfx_GFXTextureCopy_constructor, __jsb_cc_gfx_GFXTextureCopy_class, js_cc_gfx_GFXTextureCopy_finalize)




static bool js_cc_gfx_GFXTextureCopy_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXTextureCopy)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXTextureCopy* cobj = (cc::gfx::GFXTextureCopy*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXTextureCopy_finalize)

bool js_register_gfx_GFXTextureCopy(se::Object* obj)
{
    auto cls = se::Class::create("GFXTextureCopy", obj, nullptr, _SE(js_gfx_GFXTextureCopy_constructor));

    cls->defineProperty("srcSubres", _SE(js_gfx_GFXTextureCopy_get_srcSubres), _SE(js_gfx_GFXTextureCopy_set_srcSubres));
    cls->defineProperty("srcOffset", _SE(js_gfx_GFXTextureCopy_get_srcOffset), _SE(js_gfx_GFXTextureCopy_set_srcOffset));
    cls->defineProperty("dstSubres", _SE(js_gfx_GFXTextureCopy_get_dstSubres), _SE(js_gfx_GFXTextureCopy_set_dstSubres));
    cls->defineProperty("dstOffset", _SE(js_gfx_GFXTextureCopy_get_dstOffset), _SE(js_gfx_GFXTextureCopy_set_dstOffset));
    cls->defineProperty("extent", _SE(js_gfx_GFXTextureCopy_get_extent), _SE(js_gfx_GFXTextureCopy_set_extent));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXTextureCopy_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXTextureCopy>(cls);

    __jsb_cc_gfx_GFXTextureCopy_proto = cls->getProto();
    __jsb_cc_gfx_GFXTextureCopy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXBufferTextureCopy_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXBufferTextureCopy_class = nullptr;

static bool js_gfx_GFXBufferTextureCopy_get_buffStride(se::State& s)
{
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_texOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXOffset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_texOffset : Error processing new value");
    cobj->texOffset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_texOffset)

static bool js_gfx_GFXBufferTextureCopy_get_texExtent(se::State& s)
{
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_texExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXExtent* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_texExtent : Error processing new value");
    cobj->texExtent = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_texExtent)

static bool js_gfx_GFXBufferTextureCopy_get_texSubres(se::State& s)
{
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
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
    cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_texSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_texSubres : Error processing new value");
    cobj->texSubres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_texSubres)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXBufferTextureCopy_finalize)

static bool js_gfx_GFXBufferTextureCopy_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXBufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::GFXBufferTextureCopy);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXBufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::GFXBufferTextureCopy);
        unsigned int arg0 = 0;
        json->getProperty("buffStride", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->buffStride = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("buffTexHeight", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->buffTexHeight = arg1;
        }
        cc::gfx::GFXOffset* arg2 = nullptr;
        json->getProperty("texOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->texOffset = *arg2;
        }
        cc::gfx::GFXExtent* arg3 = nullptr;
        json->getProperty("texExtent", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->texExtent = *arg3;
        }
        cc::gfx::GFXTextureSubres* arg4 = nullptr;
        json->getProperty("texSubres", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg4);
            cobj->texSubres = *arg4;
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
        cc::gfx::GFXBufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::GFXBufferTextureCopy);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->buffStride = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->buffTexHeight = arg1;
        }
        cc::gfx::GFXOffset* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->texOffset = *arg2;
        }
        cc::gfx::GFXExtent* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_reference(args[3], &arg3);
            cobj->texExtent = *arg3;
        }
        cc::gfx::GFXTextureSubres* arg4 = nullptr;
        if (!args[4].isUndefined()) {
            ok &= seval_to_reference(args[4], &arg4);
            cobj->texSubres = *arg4;
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
SE_BIND_CTOR(js_gfx_GFXBufferTextureCopy_constructor, __jsb_cc_gfx_GFXBufferTextureCopy_class, js_cc_gfx_GFXBufferTextureCopy_finalize)




static bool js_cc_gfx_GFXBufferTextureCopy_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXBufferTextureCopy)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXBufferTextureCopy* cobj = (cc::gfx::GFXBufferTextureCopy*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXBufferTextureCopy_finalize)

bool js_register_gfx_GFXBufferTextureCopy(se::Object* obj)
{
    auto cls = se::Class::create("GFXBufferTextureCopy", obj, nullptr, _SE(js_gfx_GFXBufferTextureCopy_constructor));

    cls->defineProperty("buffStride", _SE(js_gfx_GFXBufferTextureCopy_get_buffStride), _SE(js_gfx_GFXBufferTextureCopy_set_buffStride));
    cls->defineProperty("buffTexHeight", _SE(js_gfx_GFXBufferTextureCopy_get_buffTexHeight), _SE(js_gfx_GFXBufferTextureCopy_set_buffTexHeight));
    cls->defineProperty("texOffset", _SE(js_gfx_GFXBufferTextureCopy_get_texOffset), _SE(js_gfx_GFXBufferTextureCopy_set_texOffset));
    cls->defineProperty("texExtent", _SE(js_gfx_GFXBufferTextureCopy_get_texExtent), _SE(js_gfx_GFXBufferTextureCopy_set_texExtent));
    cls->defineProperty("texSubres", _SE(js_gfx_GFXBufferTextureCopy_get_texSubres), _SE(js_gfx_GFXBufferTextureCopy_set_texSubres));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXBufferTextureCopy_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXBufferTextureCopy>(cls);

    __jsb_cc_gfx_GFXBufferTextureCopy_proto = cls->getProto();
    __jsb_cc_gfx_GFXBufferTextureCopy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXViewport_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXViewport_class = nullptr;

static bool js_gfx_GFXViewport_get_left(se::State& s)
{
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
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
    cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXViewport_set_maxDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXViewport_set_maxDepth : Error processing new value");
    cobj->maxDepth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXViewport_set_maxDepth)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXViewport_finalize)

static bool js_gfx_GFXViewport_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXViewport* cobj = JSB_ALLOC(cc::gfx::GFXViewport);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXViewport* cobj = JSB_ALLOC(cc::gfx::GFXViewport);
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
        cc::gfx::GFXViewport* cobj = JSB_ALLOC(cc::gfx::GFXViewport);
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
SE_BIND_CTOR(js_gfx_GFXViewport_constructor, __jsb_cc_gfx_GFXViewport_class, js_cc_gfx_GFXViewport_finalize)




static bool js_cc_gfx_GFXViewport_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXViewport)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXViewport* cobj = (cc::gfx::GFXViewport*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXViewport_finalize)

bool js_register_gfx_GFXViewport(se::Object* obj)
{
    auto cls = se::Class::create("GFXViewport", obj, nullptr, _SE(js_gfx_GFXViewport_constructor));

    cls->defineProperty("left", _SE(js_gfx_GFXViewport_get_left), _SE(js_gfx_GFXViewport_set_left));
    cls->defineProperty("top", _SE(js_gfx_GFXViewport_get_top), _SE(js_gfx_GFXViewport_set_top));
    cls->defineProperty("width", _SE(js_gfx_GFXViewport_get_width), _SE(js_gfx_GFXViewport_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXViewport_get_height), _SE(js_gfx_GFXViewport_set_height));
    cls->defineProperty("minDepth", _SE(js_gfx_GFXViewport_get_minDepth), _SE(js_gfx_GFXViewport_set_minDepth));
    cls->defineProperty("maxDepth", _SE(js_gfx_GFXViewport_get_maxDepth), _SE(js_gfx_GFXViewport_set_maxDepth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXViewport_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXViewport>(cls);

    __jsb_cc_gfx_GFXViewport_proto = cls->getProto();
    __jsb_cc_gfx_GFXViewport_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXColor_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXColor_class = nullptr;

static bool js_gfx_GFXColor_get_r(se::State& s)
{
    cc::gfx::GFXColor* cobj = (cc::gfx::GFXColor*)s.nativeThisObject();
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
    cc::gfx::GFXColor* cobj = (cc::gfx::GFXColor*)s.nativeThisObject();
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
    cc::gfx::GFXColor* cobj = (cc::gfx::GFXColor*)s.nativeThisObject();
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
    cc::gfx::GFXColor* cobj = (cc::gfx::GFXColor*)s.nativeThisObject();
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
    cc::gfx::GFXColor* cobj = (cc::gfx::GFXColor*)s.nativeThisObject();
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
    cc::gfx::GFXColor* cobj = (cc::gfx::GFXColor*)s.nativeThisObject();
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
    cc::gfx::GFXColor* cobj = (cc::gfx::GFXColor*)s.nativeThisObject();
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
    cc::gfx::GFXColor* cobj = (cc::gfx::GFXColor*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColor_set_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColor_set_a : Error processing new value");
    cobj->a = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColor_set_a)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXColor_finalize)

static bool js_gfx_GFXColor_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXColor* cobj = JSB_ALLOC(cc::gfx::GFXColor);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXColor* cobj = JSB_ALLOC(cc::gfx::GFXColor);
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
        cc::gfx::GFXColor* cobj = JSB_ALLOC(cc::gfx::GFXColor);
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
SE_BIND_CTOR(js_gfx_GFXColor_constructor, __jsb_cc_gfx_GFXColor_class, js_cc_gfx_GFXColor_finalize)




static bool js_cc_gfx_GFXColor_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXColor)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXColor* cobj = (cc::gfx::GFXColor*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXColor_finalize)

bool js_register_gfx_GFXColor(se::Object* obj)
{
    auto cls = se::Class::create("GFXColor", obj, nullptr, _SE(js_gfx_GFXColor_constructor));

    cls->defineProperty("r", _SE(js_gfx_GFXColor_get_r), _SE(js_gfx_GFXColor_set_r));
    cls->defineProperty("g", _SE(js_gfx_GFXColor_get_g), _SE(js_gfx_GFXColor_set_g));
    cls->defineProperty("b", _SE(js_gfx_GFXColor_get_b), _SE(js_gfx_GFXColor_set_b));
    cls->defineProperty("a", _SE(js_gfx_GFXColor_get_a), _SE(js_gfx_GFXColor_set_a));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXColor_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXColor>(cls);

    __jsb_cc_gfx_GFXColor_proto = cls->getProto();
    __jsb_cc_gfx_GFXColor_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXDeviceInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXDeviceInfo_class = nullptr;

static bool js_gfx_GFXDeviceInfo_get_windowHandle(se::State& s)
{
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    uintptr_t_to_seval(cobj->windowHandle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_windowHandle)

static bool js_gfx_GFXDeviceInfo_set_windowHandle(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    uintptr_t arg0 = 0;
    ok &= seval_to_uintptr_t(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_windowHandle : Error processing new value");
    cobj->windowHandle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_windowHandle)

static bool js_gfx_GFXDeviceInfo_get_width(se::State& s)
{
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXContext* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_sharedCtx : Error processing new value");
    cobj->sharedCtx = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_sharedCtx)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXDeviceInfo_finalize)

static bool js_gfx_GFXDeviceInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXDeviceInfo* cobj = JSB_ALLOC(cc::gfx::GFXDeviceInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXDeviceInfo* cobj = JSB_ALLOC(cc::gfx::GFXDeviceInfo);
        uintptr_t arg0 = 0;
        json->getProperty("windowHandle", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uintptr_t(field, &arg0);
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
        cc::gfx::GFXContext* arg5 = nullptr;
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
        cc::gfx::GFXDeviceInfo* cobj = JSB_ALLOC(cc::gfx::GFXDeviceInfo);
        uintptr_t arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uintptr_t(args[0], &arg0);
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
        cc::gfx::GFXContext* arg5 = nullptr;
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
SE_BIND_CTOR(js_gfx_GFXDeviceInfo_constructor, __jsb_cc_gfx_GFXDeviceInfo_class, js_cc_gfx_GFXDeviceInfo_finalize)




static bool js_cc_gfx_GFXDeviceInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXDeviceInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXDeviceInfo* cobj = (cc::gfx::GFXDeviceInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXDeviceInfo_finalize)

bool js_register_gfx_GFXDeviceInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXDeviceInfo", obj, nullptr, _SE(js_gfx_GFXDeviceInfo_constructor));

    cls->defineProperty("windowHandle", _SE(js_gfx_GFXDeviceInfo_get_windowHandle), _SE(js_gfx_GFXDeviceInfo_set_windowHandle));
    cls->defineProperty("width", _SE(js_gfx_GFXDeviceInfo_get_width), _SE(js_gfx_GFXDeviceInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXDeviceInfo_get_height), _SE(js_gfx_GFXDeviceInfo_set_height));
    cls->defineProperty("nativeWidth", _SE(js_gfx_GFXDeviceInfo_get_nativeWidth), _SE(js_gfx_GFXDeviceInfo_set_nativeWidth));
    cls->defineProperty("nativeHeight", _SE(js_gfx_GFXDeviceInfo_get_nativeHeight), _SE(js_gfx_GFXDeviceInfo_set_nativeHeight));
    cls->defineProperty("sharedCtx", _SE(js_gfx_GFXDeviceInfo_get_sharedCtx), _SE(js_gfx_GFXDeviceInfo_set_sharedCtx));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXDeviceInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXDeviceInfo>(cls);

    __jsb_cc_gfx_GFXDeviceInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXDeviceInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXContextInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXContextInfo_class = nullptr;

static bool js_gfx_GFXContextInfo_get_windowHandle(se::State& s)
{
    cc::gfx::GFXContextInfo* cobj = (cc::gfx::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    uintptr_t_to_seval(cobj->windowHandle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXContextInfo_get_windowHandle)

static bool js_gfx_GFXContextInfo_set_windowHandle(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXContextInfo* cobj = (cc::gfx::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    uintptr_t arg0 = 0;
    ok &= seval_to_uintptr_t(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContextInfo_set_windowHandle : Error processing new value");
    cobj->windowHandle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXContextInfo_set_windowHandle)

static bool js_gfx_GFXContextInfo_get_sharedCtx(se::State& s)
{
    cc::gfx::GFXContextInfo* cobj = (cc::gfx::GFXContextInfo*)s.nativeThisObject();
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
    cc::gfx::GFXContextInfo* cobj = (cc::gfx::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_set_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXContext* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContextInfo_set_sharedCtx : Error processing new value");
    cobj->sharedCtx = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXContextInfo_set_sharedCtx)

static bool js_gfx_GFXContextInfo_get_vsyncMode(se::State& s)
{
    cc::gfx::GFXContextInfo* cobj = (cc::gfx::GFXContextInfo*)s.nativeThisObject();
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
    cc::gfx::GFXContextInfo* cobj = (cc::gfx::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_set_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXVsyncMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXVsyncMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContextInfo_set_vsyncMode : Error processing new value");
    cobj->vsyncMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXContextInfo_set_vsyncMode)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXContextInfo_finalize)

static bool js_gfx_GFXContextInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXContextInfo* cobj = JSB_ALLOC(cc::gfx::GFXContextInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXContextInfo* cobj = JSB_ALLOC(cc::gfx::GFXContextInfo);
        uintptr_t arg0 = 0;
        json->getProperty("windowHandle", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uintptr_t(field, &arg0);
            cobj->windowHandle = arg0;
        }
        cc::gfx::GFXContext* arg1 = nullptr;
        json->getProperty("sharedCtx", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg1);
            cobj->sharedCtx = arg1;
        }
        cc::gfx::GFXVsyncMode arg2;
        json->getProperty("vsyncMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXVsyncMode)tmp; } while(false);
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
        cc::gfx::GFXContextInfo* cobj = JSB_ALLOC(cc::gfx::GFXContextInfo);
        uintptr_t arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uintptr_t(args[0], &arg0);
            cobj->windowHandle = arg0;
        }
        cc::gfx::GFXContext* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_native_ptr(args[1], &arg1);
            cobj->sharedCtx = arg1;
        }
        cc::gfx::GFXVsyncMode arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXVsyncMode)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXContextInfo_constructor, __jsb_cc_gfx_GFXContextInfo_class, js_cc_gfx_GFXContextInfo_finalize)




static bool js_cc_gfx_GFXContextInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXContextInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXContextInfo* cobj = (cc::gfx::GFXContextInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXContextInfo_finalize)

bool js_register_gfx_GFXContextInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXContextInfo", obj, nullptr, _SE(js_gfx_GFXContextInfo_constructor));

    cls->defineProperty("windowHandle", _SE(js_gfx_GFXContextInfo_get_windowHandle), _SE(js_gfx_GFXContextInfo_set_windowHandle));
    cls->defineProperty("sharedCtx", _SE(js_gfx_GFXContextInfo_get_sharedCtx), _SE(js_gfx_GFXContextInfo_set_sharedCtx));
    cls->defineProperty("vsyncMode", _SE(js_gfx_GFXContextInfo_get_vsyncMode), _SE(js_gfx_GFXContextInfo_set_vsyncMode));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXContextInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXContextInfo>(cls);

    __jsb_cc_gfx_GFXContextInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXContextInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXBufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXBufferInfo_class = nullptr;

static bool js_gfx_GFXBufferInfo_get_usage(se::State& s)
{
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBufferUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBufferUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferInfo_set_usage : Error processing new value");
    cobj->usage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferInfo_set_usage)

static bool js_gfx_GFXBufferInfo_get_memUsage(se::State& s)
{
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_set_memUsage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXMemoryUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXMemoryUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferInfo_set_memUsage : Error processing new value");
    cobj->memUsage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferInfo_set_memUsage)

static bool js_gfx_GFXBufferInfo_get_stride(se::State& s)
{
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBufferFlagBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBufferFlagBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferInfo_set_flags : Error processing new value");
    cobj->flags = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferInfo_set_flags)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXBufferInfo_finalize)

static bool js_gfx_GFXBufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXBufferInfo* cobj = JSB_ALLOC(cc::gfx::GFXBufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXBufferInfo* cobj = JSB_ALLOC(cc::gfx::GFXBufferInfo);
        cc::gfx::GFXBufferUsageBit arg0;
        json->getProperty("usage", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXBufferUsageBit)tmp; } while(false);
            cobj->usage = arg0;
        }
        cc::gfx::GFXMemoryUsageBit arg1;
        json->getProperty("memUsage", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXMemoryUsageBit)tmp; } while(false);
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
        cc::gfx::GFXBufferFlagBit arg4;
        json->getProperty("flags", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::GFXBufferFlagBit)tmp; } while(false);
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
        cc::gfx::GFXBufferInfo* cobj = JSB_ALLOC(cc::gfx::GFXBufferInfo);
        cc::gfx::GFXBufferUsageBit arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBufferUsageBit)tmp; } while(false);
            cobj->usage = arg0;
        }
        cc::gfx::GFXMemoryUsageBit arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXMemoryUsageBit)tmp; } while(false);
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
        cc::gfx::GFXBufferFlagBit arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::GFXBufferFlagBit)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXBufferInfo_constructor, __jsb_cc_gfx_GFXBufferInfo_class, js_cc_gfx_GFXBufferInfo_finalize)




static bool js_cc_gfx_GFXBufferInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXBufferInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXBufferInfo* cobj = (cc::gfx::GFXBufferInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXBufferInfo_finalize)

bool js_register_gfx_GFXBufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXBufferInfo", obj, nullptr, _SE(js_gfx_GFXBufferInfo_constructor));

    cls->defineProperty("usage", _SE(js_gfx_GFXBufferInfo_get_usage), _SE(js_gfx_GFXBufferInfo_set_usage));
    cls->defineProperty("memUsage", _SE(js_gfx_GFXBufferInfo_get_memUsage), _SE(js_gfx_GFXBufferInfo_set_memUsage));
    cls->defineProperty("stride", _SE(js_gfx_GFXBufferInfo_get_stride), _SE(js_gfx_GFXBufferInfo_set_stride));
    cls->defineProperty("size", _SE(js_gfx_GFXBufferInfo_get_size), _SE(js_gfx_GFXBufferInfo_set_size));
    cls->defineProperty("flags", _SE(js_gfx_GFXBufferInfo_get_flags), _SE(js_gfx_GFXBufferInfo_set_flags));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXBufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXBufferInfo>(cls);

    __jsb_cc_gfx_GFXBufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXBufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXDrawInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXDrawInfo_class = nullptr;

static bool js_gfx_GFXDrawInfo_get_vertexCount(se::State& s)
{
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
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
    cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_firstInstance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_firstInstance : Error processing new value");
    cobj->firstInstance = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_firstInstance)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXDrawInfo_finalize)

static bool js_gfx_GFXDrawInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXDrawInfo* cobj = JSB_ALLOC(cc::gfx::GFXDrawInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXDrawInfo* cobj = JSB_ALLOC(cc::gfx::GFXDrawInfo);
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
        cc::gfx::GFXDrawInfo* cobj = JSB_ALLOC(cc::gfx::GFXDrawInfo);
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
SE_BIND_CTOR(js_gfx_GFXDrawInfo_constructor, __jsb_cc_gfx_GFXDrawInfo_class, js_cc_gfx_GFXDrawInfo_finalize)




static bool js_cc_gfx_GFXDrawInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXDrawInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXDrawInfo* cobj = (cc::gfx::GFXDrawInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXDrawInfo_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXDrawInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXDrawInfo>(cls);

    __jsb_cc_gfx_GFXDrawInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXDrawInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXIndirectBuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXIndirectBuffer_class = nullptr;

static bool js_gfx_GFXIndirectBuffer_get_drawInfos(se::State& s)
{
    cc::gfx::GFXIndirectBuffer* cobj = (cc::gfx::GFXIndirectBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXIndirectBuffer_get_drawInfos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->drawInfos, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXIndirectBuffer_get_drawInfos)

static bool js_gfx_GFXIndirectBuffer_set_drawInfos(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXIndirectBuffer* cobj = (cc::gfx::GFXIndirectBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXIndirectBuffer_set_drawInfos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXDrawInfo> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXIndirectBuffer_set_drawInfos : Error processing new value");
    cobj->drawInfos = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXIndirectBuffer_set_drawInfos)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXIndirectBuffer_finalize)

static bool js_gfx_GFXIndirectBuffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXIndirectBuffer* cobj = JSB_ALLOC(cc::gfx::GFXIndirectBuffer);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cc::gfx::GFXIndirectBuffer* cobj = JSB_ALLOC(cc::gfx::GFXIndirectBuffer);
        std::vector<cc::gfx::GFXDrawInfo> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->drawInfos = arg0;
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
SE_BIND_CTOR(js_gfx_GFXIndirectBuffer_constructor, __jsb_cc_gfx_GFXIndirectBuffer_class, js_cc_gfx_GFXIndirectBuffer_finalize)




static bool js_cc_gfx_GFXIndirectBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXIndirectBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXIndirectBuffer* cobj = (cc::gfx::GFXIndirectBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXIndirectBuffer_finalize)

bool js_register_gfx_GFXIndirectBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXIndirectBuffer", obj, nullptr, _SE(js_gfx_GFXIndirectBuffer_constructor));

    cls->defineProperty("drawInfos", _SE(js_gfx_GFXIndirectBuffer_get_drawInfos), _SE(js_gfx_GFXIndirectBuffer_set_drawInfos));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXIndirectBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXIndirectBuffer>(cls);

    __jsb_cc_gfx_GFXIndirectBuffer_proto = cls->getProto();
    __jsb_cc_gfx_GFXIndirectBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXTextureInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXTextureInfo_class = nullptr;

static bool js_gfx_GFXTextureInfo_get_type(se::State& s)
{
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXTextureType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_type)

static bool js_gfx_GFXTextureInfo_get_usage(se::State& s)
{
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXTextureUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_usage : Error processing new value");
    cobj->usage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_usage)

static bool js_gfx_GFXTextureInfo_get_format(se::State& s)
{
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_format)

static bool js_gfx_GFXTextureInfo_get_width(se::State& s)
{
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_samples : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXSampleCount arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXSampleCount)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_samples : Error processing new value");
    cobj->samples = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_samples)

static bool js_gfx_GFXTextureInfo_get_flags(se::State& s)
{
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureFlagBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXTextureFlagBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_flags : Error processing new value");
    cobj->flags = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_flags)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXTextureInfo_finalize)

static bool js_gfx_GFXTextureInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXTextureInfo* cobj = JSB_ALLOC(cc::gfx::GFXTextureInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXTextureInfo* cobj = JSB_ALLOC(cc::gfx::GFXTextureInfo);
        cc::gfx::GFXTextureType arg0;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXTextureType)tmp; } while(false);
            cobj->type = arg0;
        }
        cc::gfx::GFXTextureUsageBit arg1;
        json->getProperty("usage", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXTextureUsageBit)tmp; } while(false);
            cobj->usage = arg1;
        }
        cc::gfx::GFXFormat arg2;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXFormat)tmp; } while(false);
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
        cc::gfx::GFXSampleCount arg8;
        json->getProperty("samples", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cc::gfx::GFXSampleCount)tmp; } while(false);
            cobj->samples = arg8;
        }
        cc::gfx::GFXTextureFlagBit arg9;
        json->getProperty("flags", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cc::gfx::GFXTextureFlagBit)tmp; } while(false);
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
        cc::gfx::GFXTextureInfo* cobj = JSB_ALLOC(cc::gfx::GFXTextureInfo);
        cc::gfx::GFXTextureType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXTextureType)tmp; } while(false);
            cobj->type = arg0;
        }
        cc::gfx::GFXTextureUsageBit arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXTextureUsageBit)tmp; } while(false);
            cobj->usage = arg1;
        }
        cc::gfx::GFXFormat arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXFormat)tmp; } while(false);
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
        cc::gfx::GFXSampleCount arg8;
        if (!args[8].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cc::gfx::GFXSampleCount)tmp; } while(false);
            cobj->samples = arg8;
        }
        cc::gfx::GFXTextureFlagBit arg9;
        if (!args[9].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cc::gfx::GFXTextureFlagBit)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXTextureInfo_constructor, __jsb_cc_gfx_GFXTextureInfo_class, js_cc_gfx_GFXTextureInfo_finalize)




static bool js_cc_gfx_GFXTextureInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXTextureInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXTextureInfo* cobj = (cc::gfx::GFXTextureInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXTextureInfo_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXTextureInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXTextureInfo>(cls);

    __jsb_cc_gfx_GFXTextureInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXTextureInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXTextureViewInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXTextureViewInfo_class = nullptr;

static bool js_gfx_GFXTextureViewInfo_get_texture(se::State& s)
{
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTexture* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_texture : Error processing new value");
    cobj->texture = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_texture)

static bool js_gfx_GFXTextureViewInfo_get_type(se::State& s)
{
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXTextureType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_type)

static bool js_gfx_GFXTextureViewInfo_get_format(se::State& s)
{
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_format)

static bool js_gfx_GFXTextureViewInfo_get_baseLevel(se::State& s)
{
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
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
    cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_layerCount : Error processing new value");
    cobj->layerCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_layerCount)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXTextureViewInfo_finalize)

static bool js_gfx_GFXTextureViewInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXTextureViewInfo* cobj = JSB_ALLOC(cc::gfx::GFXTextureViewInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXTextureViewInfo* cobj = JSB_ALLOC(cc::gfx::GFXTextureViewInfo);
        cc::gfx::GFXTexture* arg0 = nullptr;
        json->getProperty("texture", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->texture = arg0;
        }
        cc::gfx::GFXTextureType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXTextureType)tmp; } while(false);
            cobj->type = arg1;
        }
        cc::gfx::GFXFormat arg2;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXFormat)tmp; } while(false);
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
        cc::gfx::GFXTextureViewInfo* cobj = JSB_ALLOC(cc::gfx::GFXTextureViewInfo);
        cc::gfx::GFXTexture* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->texture = arg0;
        }
        cc::gfx::GFXTextureType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXTextureType)tmp; } while(false);
            cobj->type = arg1;
        }
        cc::gfx::GFXFormat arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXFormat)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXTextureViewInfo_constructor, __jsb_cc_gfx_GFXTextureViewInfo_class, js_cc_gfx_GFXTextureViewInfo_finalize)




static bool js_cc_gfx_GFXTextureViewInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXTextureViewInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXTextureViewInfo* cobj = (cc::gfx::GFXTextureViewInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXTextureViewInfo_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXTextureViewInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXTextureViewInfo>(cls);

    __jsb_cc_gfx_GFXTextureViewInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXTextureViewInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXSamplerInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXSamplerInfo_class = nullptr;

static bool js_gfx_GFXSamplerInfo_get_name(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_name)

static bool js_gfx_GFXSamplerInfo_get_minFilter(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXFilter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFilter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_minFilter : Error processing new value");
    cobj->minFilter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_minFilter)

static bool js_gfx_GFXSamplerInfo_get_magFilter(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXFilter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFilter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_magFilter : Error processing new value");
    cobj->magFilter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_magFilter)

static bool js_gfx_GFXSamplerInfo_get_mipFilter(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXFilter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFilter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_mipFilter : Error processing new value");
    cobj->mipFilter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_mipFilter)

static bool js_gfx_GFXSamplerInfo_get_addressU(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_addressU : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXAddress arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXAddress)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_addressU : Error processing new value");
    cobj->addressU = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_addressU)

static bool js_gfx_GFXSamplerInfo_get_addressV(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_addressV : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXAddress arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXAddress)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_addressV : Error processing new value");
    cobj->addressV = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_addressV)

static bool js_gfx_GFXSamplerInfo_get_addressW(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_addressW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXAddress arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXAddress)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_addressW : Error processing new value");
    cobj->addressW = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_addressW)

static bool js_gfx_GFXSamplerInfo_get_maxAnisotropy(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_cmpFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_cmpFunc : Error processing new value");
    cobj->cmpFunc = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_cmpFunc)

static bool js_gfx_GFXSamplerInfo_get_borderColor(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_borderColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXColor* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_borderColor : Error processing new value");
    cobj->borderColor = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_borderColor)

static bool js_gfx_GFXSamplerInfo_get_minLOD(se::State& s)
{
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_mipLODBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_mipLODBias : Error processing new value");
    cobj->mipLODBias = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_mipLODBias)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXSamplerInfo_finalize)

static bool js_gfx_GFXSamplerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXSamplerInfo* cobj = JSB_ALLOC(cc::gfx::GFXSamplerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXSamplerInfo* cobj = JSB_ALLOC(cc::gfx::GFXSamplerInfo);
        cc::gfx::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::GFXFilter arg1;
        json->getProperty("minFilter", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXFilter)tmp; } while(false);
            cobj->minFilter = arg1;
        }
        cc::gfx::GFXFilter arg2;
        json->getProperty("magFilter", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXFilter)tmp; } while(false);
            cobj->magFilter = arg2;
        }
        cc::gfx::GFXFilter arg3;
        json->getProperty("mipFilter", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::GFXFilter)tmp; } while(false);
            cobj->mipFilter = arg3;
        }
        cc::gfx::GFXAddress arg4;
        json->getProperty("addressU", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::GFXAddress)tmp; } while(false);
            cobj->addressU = arg4;
        }
        cc::gfx::GFXAddress arg5;
        json->getProperty("addressV", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cc::gfx::GFXAddress)tmp; } while(false);
            cobj->addressV = arg5;
        }
        cc::gfx::GFXAddress arg6;
        json->getProperty("addressW", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cc::gfx::GFXAddress)tmp; } while(false);
            cobj->addressW = arg6;
        }
        unsigned int arg7 = 0;
        json->getProperty("maxAnisotropy", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg7);
            cobj->maxAnisotropy = arg7;
        }
        cc::gfx::GFXComparisonFunc arg8;
        json->getProperty("cmpFunc", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
            cobj->cmpFunc = arg8;
        }
        cc::gfx::GFXColor* arg9 = nullptr;
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
        cc::gfx::GFXSamplerInfo* cobj = JSB_ALLOC(cc::gfx::GFXSamplerInfo);
        cc::gfx::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::GFXFilter arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXFilter)tmp; } while(false);
            cobj->minFilter = arg1;
        }
        cc::gfx::GFXFilter arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXFilter)tmp; } while(false);
            cobj->magFilter = arg2;
        }
        cc::gfx::GFXFilter arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::GFXFilter)tmp; } while(false);
            cobj->mipFilter = arg3;
        }
        cc::gfx::GFXAddress arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::GFXAddress)tmp; } while(false);
            cobj->addressU = arg4;
        }
        cc::gfx::GFXAddress arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cc::gfx::GFXAddress)tmp; } while(false);
            cobj->addressV = arg5;
        }
        cc::gfx::GFXAddress arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cc::gfx::GFXAddress)tmp; } while(false);
            cobj->addressW = arg6;
        }
        unsigned int arg7 = 0;
        if (!args[7].isUndefined()) {
            ok &= seval_to_uint32(args[7], (uint32_t*)&arg7);
            cobj->maxAnisotropy = arg7;
        }
        cc::gfx::GFXComparisonFunc arg8;
        if (!args[8].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
            cobj->cmpFunc = arg8;
        }
        cc::gfx::GFXColor* arg9 = nullptr;
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
SE_BIND_CTOR(js_gfx_GFXSamplerInfo_constructor, __jsb_cc_gfx_GFXSamplerInfo_class, js_cc_gfx_GFXSamplerInfo_finalize)




static bool js_cc_gfx_GFXSamplerInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXSamplerInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXSamplerInfo* cobj = (cc::gfx::GFXSamplerInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXSamplerInfo_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXSamplerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXSamplerInfo>(cls);

    __jsb_cc_gfx_GFXSamplerInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXSamplerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXShaderMacro_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXShaderMacro_class = nullptr;

static bool js_gfx_GFXShaderMacro_get_macro(se::State& s)
{
    cc::gfx::GFXShaderMacro* cobj = (cc::gfx::GFXShaderMacro*)s.nativeThisObject();
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
    cc::gfx::GFXShaderMacro* cobj = (cc::gfx::GFXShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderMacro_set_macro : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderMacro_set_macro : Error processing new value");
    cobj->macro = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderMacro_set_macro)

static bool js_gfx_GFXShaderMacro_get_value(se::State& s)
{
    cc::gfx::GFXShaderMacro* cobj = (cc::gfx::GFXShaderMacro*)s.nativeThisObject();
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
    cc::gfx::GFXShaderMacro* cobj = (cc::gfx::GFXShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderMacro_set_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderMacro_set_value : Error processing new value");
    cobj->value = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderMacro_set_value)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXShaderMacro_finalize)

static bool js_gfx_GFXShaderMacro_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXShaderMacro* cobj = JSB_ALLOC(cc::gfx::GFXShaderMacro);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXShaderMacro* cobj = JSB_ALLOC(cc::gfx::GFXShaderMacro);
        cc::gfx::String arg0;
        json->getProperty("macro", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->macro = arg0;
        }
        cc::gfx::String arg1;
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
        cc::gfx::GFXShaderMacro* cobj = JSB_ALLOC(cc::gfx::GFXShaderMacro);
        cc::gfx::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->macro = arg0;
        }
        cc::gfx::String arg1;
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
SE_BIND_CTOR(js_gfx_GFXShaderMacro_constructor, __jsb_cc_gfx_GFXShaderMacro_class, js_cc_gfx_GFXShaderMacro_finalize)




static bool js_cc_gfx_GFXShaderMacro_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXShaderMacro)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXShaderMacro* cobj = (cc::gfx::GFXShaderMacro*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXShaderMacro_finalize)

bool js_register_gfx_GFXShaderMacro(se::Object* obj)
{
    auto cls = se::Class::create("GFXShaderMacro", obj, nullptr, _SE(js_gfx_GFXShaderMacro_constructor));

    cls->defineProperty("macro", _SE(js_gfx_GFXShaderMacro_get_macro), _SE(js_gfx_GFXShaderMacro_set_macro));
    cls->defineProperty("value", _SE(js_gfx_GFXShaderMacro_get_value), _SE(js_gfx_GFXShaderMacro_set_value));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXShaderMacro_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXShaderMacro>(cls);

    __jsb_cc_gfx_GFXShaderMacro_proto = cls->getProto();
    __jsb_cc_gfx_GFXShaderMacro_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXUniform_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXUniform_class = nullptr;

static bool js_gfx_GFXUniform_get_name(se::State& s)
{
    cc::gfx::GFXUniform* cobj = (cc::gfx::GFXUniform*)s.nativeThisObject();
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
    cc::gfx::GFXUniform* cobj = (cc::gfx::GFXUniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniform_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniform_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniform_set_name)

static bool js_gfx_GFXUniform_get_type(se::State& s)
{
    cc::gfx::GFXUniform* cobj = (cc::gfx::GFXUniform*)s.nativeThisObject();
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
    cc::gfx::GFXUniform* cobj = (cc::gfx::GFXUniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniform_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniform_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniform_set_type)

static bool js_gfx_GFXUniform_get_count(se::State& s)
{
    cc::gfx::GFXUniform* cobj = (cc::gfx::GFXUniform*)s.nativeThisObject();
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
    cc::gfx::GFXUniform* cobj = (cc::gfx::GFXUniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniform_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniform_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniform_set_count)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXUniform_finalize)

static bool js_gfx_GFXUniform_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXUniform* cobj = JSB_ALLOC(cc::gfx::GFXUniform);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXUniform* cobj = JSB_ALLOC(cc::gfx::GFXUniform);
        cc::gfx::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::GFXType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXType)tmp; } while(false);
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
        cc::gfx::GFXUniform* cobj = JSB_ALLOC(cc::gfx::GFXUniform);
        cc::gfx::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::GFXType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXType)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXUniform_constructor, __jsb_cc_gfx_GFXUniform_class, js_cc_gfx_GFXUniform_finalize)




static bool js_cc_gfx_GFXUniform_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXUniform)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXUniform* cobj = (cc::gfx::GFXUniform*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXUniform_finalize)

bool js_register_gfx_GFXUniform(se::Object* obj)
{
    auto cls = se::Class::create("GFXUniform", obj, nullptr, _SE(js_gfx_GFXUniform_constructor));

    cls->defineProperty("name", _SE(js_gfx_GFXUniform_get_name), _SE(js_gfx_GFXUniform_set_name));
    cls->defineProperty("type", _SE(js_gfx_GFXUniform_get_type), _SE(js_gfx_GFXUniform_set_type));
    cls->defineProperty("count", _SE(js_gfx_GFXUniform_get_count), _SE(js_gfx_GFXUniform_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXUniform_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXUniform>(cls);

    __jsb_cc_gfx_GFXUniform_proto = cls->getProto();
    __jsb_cc_gfx_GFXUniform_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXUniformBlock_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXUniformBlock_class = nullptr;

static bool js_gfx_GFXUniformBlock_get_shaderStages(se::State& s)
{
    cc::gfx::GFXUniformBlock* cobj = (cc::gfx::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_get_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shaderStages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformBlock_get_shaderStages)

static bool js_gfx_GFXUniformBlock_set_shaderStages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXUniformBlock* cobj = (cc::gfx::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_set_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformBlock_set_shaderStages : Error processing new value");
    cobj->shaderStages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformBlock_set_shaderStages)

static bool js_gfx_GFXUniformBlock_get_binding(se::State& s)
{
    cc::gfx::GFXUniformBlock* cobj = (cc::gfx::GFXUniformBlock*)s.nativeThisObject();
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
    cc::gfx::GFXUniformBlock* cobj = (cc::gfx::GFXUniformBlock*)s.nativeThisObject();
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
    cc::gfx::GFXUniformBlock* cobj = (cc::gfx::GFXUniformBlock*)s.nativeThisObject();
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
    cc::gfx::GFXUniformBlock* cobj = (cc::gfx::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformBlock_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformBlock_set_name)

static bool js_gfx_GFXUniformBlock_get_uniforms(se::State& s)
{
    cc::gfx::GFXUniformBlock* cobj = (cc::gfx::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_get_uniforms : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->uniforms, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformBlock_get_uniforms)

static bool js_gfx_GFXUniformBlock_set_uniforms(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXUniformBlock* cobj = (cc::gfx::GFXUniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformBlock_set_uniforms : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXUniform> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformBlock_set_uniforms : Error processing new value");
    cobj->uniforms = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformBlock_set_uniforms)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXUniformBlock_finalize)

static bool js_gfx_GFXUniformBlock_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXUniformBlock* cobj = JSB_ALLOC(cc::gfx::GFXUniformBlock);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXUniformBlock* cobj = JSB_ALLOC(cc::gfx::GFXUniformBlock);
        cc::gfx::GFXShaderType arg0;
        json->getProperty("shaderStages", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::String arg2;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg2 = field.toStringForce().c_str();
            cobj->name = arg2;
        }
        std::vector<cc::gfx::GFXUniform> arg3;
        json->getProperty("uniforms", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg3);
            cobj->uniforms = arg3;
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
        cc::gfx::GFXUniformBlock* cobj = JSB_ALLOC(cc::gfx::GFXUniformBlock);
        cc::gfx::GFXShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::String arg2;
        if (!args[2].isUndefined()) {
            arg2 = args[2].toStringForce().c_str();
            cobj->name = arg2;
        }
        std::vector<cc::gfx::GFXUniform> arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_std_vector(args[3], &arg3);
            cobj->uniforms = arg3;
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
SE_BIND_CTOR(js_gfx_GFXUniformBlock_constructor, __jsb_cc_gfx_GFXUniformBlock_class, js_cc_gfx_GFXUniformBlock_finalize)




static bool js_cc_gfx_GFXUniformBlock_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXUniformBlock)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXUniformBlock* cobj = (cc::gfx::GFXUniformBlock*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXUniformBlock_finalize)

bool js_register_gfx_GFXUniformBlock(se::Object* obj)
{
    auto cls = se::Class::create("GFXUniformBlock", obj, nullptr, _SE(js_gfx_GFXUniformBlock_constructor));

    cls->defineProperty("shaderStages", _SE(js_gfx_GFXUniformBlock_get_shaderStages), _SE(js_gfx_GFXUniformBlock_set_shaderStages));
    cls->defineProperty("binding", _SE(js_gfx_GFXUniformBlock_get_binding), _SE(js_gfx_GFXUniformBlock_set_binding));
    cls->defineProperty("name", _SE(js_gfx_GFXUniformBlock_get_name), _SE(js_gfx_GFXUniformBlock_set_name));
    cls->defineProperty("uniforms", _SE(js_gfx_GFXUniformBlock_get_uniforms), _SE(js_gfx_GFXUniformBlock_set_uniforms));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXUniformBlock_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXUniformBlock>(cls);

    __jsb_cc_gfx_GFXUniformBlock_proto = cls->getProto();
    __jsb_cc_gfx_GFXUniformBlock_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXUniformSampler_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXUniformSampler_class = nullptr;

static bool js_gfx_GFXUniformSampler_get_shaderStages(se::State& s)
{
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_get_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shaderStages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXUniformSampler_get_shaderStages)

static bool js_gfx_GFXUniformSampler_set_shaderStages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_set_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformSampler_set_shaderStages : Error processing new value");
    cobj->shaderStages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformSampler_set_shaderStages)

static bool js_gfx_GFXUniformSampler_get_binding(se::State& s)
{
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
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
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
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
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
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
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformSampler_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformSampler_set_name)

static bool js_gfx_GFXUniformSampler_get_type(se::State& s)
{
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
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
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformSampler_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformSampler_set_type)

static bool js_gfx_GFXUniformSampler_get_count(se::State& s)
{
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
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
    cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXUniformSampler_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXUniformSampler_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXUniformSampler_set_count)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXUniformSampler_finalize)

static bool js_gfx_GFXUniformSampler_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXUniformSampler* cobj = JSB_ALLOC(cc::gfx::GFXUniformSampler);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXUniformSampler* cobj = JSB_ALLOC(cc::gfx::GFXUniformSampler);
        cc::gfx::GFXShaderType arg0;
        json->getProperty("shaderStages", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::String arg2;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg2 = field.toStringForce().c_str();
            cobj->name = arg2;
        }
        cc::gfx::GFXType arg3;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::GFXType)tmp; } while(false);
            cobj->type = arg3;
        }
        unsigned int arg4 = 0;
        json->getProperty("count", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg4);
            cobj->count = arg4;
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
        cc::gfx::GFXUniformSampler* cobj = JSB_ALLOC(cc::gfx::GFXUniformSampler);
        cc::gfx::GFXShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::String arg2;
        if (!args[2].isUndefined()) {
            arg2 = args[2].toStringForce().c_str();
            cobj->name = arg2;
        }
        cc::gfx::GFXType arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::GFXType)tmp; } while(false);
            cobj->type = arg3;
        }
        unsigned int arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->count = arg4;
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
SE_BIND_CTOR(js_gfx_GFXUniformSampler_constructor, __jsb_cc_gfx_GFXUniformSampler_class, js_cc_gfx_GFXUniformSampler_finalize)




static bool js_cc_gfx_GFXUniformSampler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXUniformSampler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXUniformSampler* cobj = (cc::gfx::GFXUniformSampler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXUniformSampler_finalize)

bool js_register_gfx_GFXUniformSampler(se::Object* obj)
{
    auto cls = se::Class::create("GFXUniformSampler", obj, nullptr, _SE(js_gfx_GFXUniformSampler_constructor));

    cls->defineProperty("shaderStages", _SE(js_gfx_GFXUniformSampler_get_shaderStages), _SE(js_gfx_GFXUniformSampler_set_shaderStages));
    cls->defineProperty("binding", _SE(js_gfx_GFXUniformSampler_get_binding), _SE(js_gfx_GFXUniformSampler_set_binding));
    cls->defineProperty("name", _SE(js_gfx_GFXUniformSampler_get_name), _SE(js_gfx_GFXUniformSampler_set_name));
    cls->defineProperty("type", _SE(js_gfx_GFXUniformSampler_get_type), _SE(js_gfx_GFXUniformSampler_set_type));
    cls->defineProperty("count", _SE(js_gfx_GFXUniformSampler_get_count), _SE(js_gfx_GFXUniformSampler_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXUniformSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXUniformSampler>(cls);

    __jsb_cc_gfx_GFXUniformSampler_proto = cls->getProto();
    __jsb_cc_gfx_GFXUniformSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXShaderStage_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXShaderStage_class = nullptr;

static bool js_gfx_GFXShaderStage_get_type(se::State& s)
{
    cc::gfx::GFXShaderStage* cobj = (cc::gfx::GFXShaderStage*)s.nativeThisObject();
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
    cc::gfx::GFXShaderStage* cobj = (cc::gfx::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderStage_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderStage_set_type)

static bool js_gfx_GFXShaderStage_get_source(se::State& s)
{
    cc::gfx::GFXShaderStage* cobj = (cc::gfx::GFXShaderStage*)s.nativeThisObject();
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
    cc::gfx::GFXShaderStage* cobj = (cc::gfx::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_set_source : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderStage_set_source : Error processing new value");
    cobj->source = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderStage_set_source)

static bool js_gfx_GFXShaderStage_get_macros(se::State& s)
{
    cc::gfx::GFXShaderStage* cobj = (cc::gfx::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_get_macros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->macros, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderStage_get_macros)

static bool js_gfx_GFXShaderStage_set_macros(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXShaderStage* cobj = (cc::gfx::GFXShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderStage_set_macros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXShaderMacro> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderStage_set_macros : Error processing new value");
    cobj->macros = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderStage_set_macros)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXShaderStage_finalize)

static bool js_gfx_GFXShaderStage_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXShaderStage* cobj = JSB_ALLOC(cc::gfx::GFXShaderStage);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXShaderStage* cobj = JSB_ALLOC(cc::gfx::GFXShaderStage);
        cc::gfx::GFXShaderType arg0;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->type = arg0;
        }
        cc::gfx::String arg1;
        json->getProperty("source", &field);
        if(!field.isUndefined()) {
            arg1 = field.toStringForce().c_str();
            cobj->source = arg1;
        }
        std::vector<cc::gfx::GFXShaderMacro> arg2;
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
        cc::gfx::GFXShaderStage* cobj = JSB_ALLOC(cc::gfx::GFXShaderStage);
        cc::gfx::GFXShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->type = arg0;
        }
        cc::gfx::String arg1;
        if (!args[1].isUndefined()) {
            arg1 = args[1].toStringForce().c_str();
            cobj->source = arg1;
        }
        std::vector<cc::gfx::GFXShaderMacro> arg2;
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
SE_BIND_CTOR(js_gfx_GFXShaderStage_constructor, __jsb_cc_gfx_GFXShaderStage_class, js_cc_gfx_GFXShaderStage_finalize)




static bool js_cc_gfx_GFXShaderStage_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXShaderStage)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXShaderStage* cobj = (cc::gfx::GFXShaderStage*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXShaderStage_finalize)

bool js_register_gfx_GFXShaderStage(se::Object* obj)
{
    auto cls = se::Class::create("GFXShaderStage", obj, nullptr, _SE(js_gfx_GFXShaderStage_constructor));

    cls->defineProperty("type", _SE(js_gfx_GFXShaderStage_get_type), _SE(js_gfx_GFXShaderStage_set_type));
    cls->defineProperty("source", _SE(js_gfx_GFXShaderStage_get_source), _SE(js_gfx_GFXShaderStage_set_source));
    cls->defineProperty("macros", _SE(js_gfx_GFXShaderStage_get_macros), _SE(js_gfx_GFXShaderStage_set_macros));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXShaderStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXShaderStage>(cls);

    __jsb_cc_gfx_GFXShaderStage_proto = cls->getProto();
    __jsb_cc_gfx_GFXShaderStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXAttribute_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXAttribute_class = nullptr;

static bool js_gfx_GFXAttribute_get_name(se::State& s)
{
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
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
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_name)

static bool js_gfx_GFXAttribute_get_format(se::State& s)
{
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
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
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_format)

static bool js_gfx_GFXAttribute_get_isNormalized(se::State& s)
{
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
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
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
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
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
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
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
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
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
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
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_isInstanced : Error processing new value");
    cobj->isInstanced = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_isInstanced)

static bool js_gfx_GFXAttribute_get_location(se::State& s)
{
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_get_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->location, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXAttribute_get_location)

static bool js_gfx_GFXAttribute_set_location(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_location : Error processing new value");
    cobj->location = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_location)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXAttribute_finalize)

static bool js_gfx_GFXAttribute_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXAttribute* cobj = JSB_ALLOC(cc::gfx::GFXAttribute);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXAttribute* cobj = JSB_ALLOC(cc::gfx::GFXAttribute);
        cc::gfx::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::GFXFormat arg1;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXFormat)tmp; } while(false);
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
        unsigned int arg5 = 0;
        json->getProperty("location", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg5);
            cobj->location = arg5;
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
        cc::gfx::GFXAttribute* cobj = JSB_ALLOC(cc::gfx::GFXAttribute);
        cc::gfx::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::GFXFormat arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXFormat)tmp; } while(false);
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
        unsigned int arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
            cobj->location = arg5;
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
SE_BIND_CTOR(js_gfx_GFXAttribute_constructor, __jsb_cc_gfx_GFXAttribute_class, js_cc_gfx_GFXAttribute_finalize)




static bool js_cc_gfx_GFXAttribute_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXAttribute)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXAttribute* cobj = (cc::gfx::GFXAttribute*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXAttribute_finalize)

bool js_register_gfx_GFXAttribute(se::Object* obj)
{
    auto cls = se::Class::create("GFXAttribute", obj, nullptr, _SE(js_gfx_GFXAttribute_constructor));

    cls->defineProperty("name", _SE(js_gfx_GFXAttribute_get_name), _SE(js_gfx_GFXAttribute_set_name));
    cls->defineProperty("format", _SE(js_gfx_GFXAttribute_get_format), _SE(js_gfx_GFXAttribute_set_format));
    cls->defineProperty("isNormalized", _SE(js_gfx_GFXAttribute_get_isNormalized), _SE(js_gfx_GFXAttribute_set_isNormalized));
    cls->defineProperty("stream", _SE(js_gfx_GFXAttribute_get_stream), _SE(js_gfx_GFXAttribute_set_stream));
    cls->defineProperty("isInstanced", _SE(js_gfx_GFXAttribute_get_isInstanced), _SE(js_gfx_GFXAttribute_set_isInstanced));
    cls->defineProperty("location", _SE(js_gfx_GFXAttribute_get_location), _SE(js_gfx_GFXAttribute_set_location));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXAttribute_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXAttribute>(cls);

    __jsb_cc_gfx_GFXAttribute_proto = cls->getProto();
    __jsb_cc_gfx_GFXAttribute_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXShaderInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXShaderInfo_class = nullptr;

static bool js_gfx_GFXShaderInfo_get_name(se::State& s)
{
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
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
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderInfo_set_name)

static bool js_gfx_GFXShaderInfo_get_stages(se::State& s)
{
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->stages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderInfo_get_stages)

static bool js_gfx_GFXShaderInfo_set_stages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXShaderStage> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderInfo_set_stages : Error processing new value");
    cobj->stages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderInfo_set_stages)

static bool js_gfx_GFXShaderInfo_get_attributes(se::State& s)
{
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->attributes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderInfo_get_attributes)

static bool js_gfx_GFXShaderInfo_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXAttribute> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderInfo_set_attributes : Error processing new value");
    cobj->attributes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderInfo_set_attributes)

static bool js_gfx_GFXShaderInfo_get_blocks(se::State& s)
{
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_get_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->blocks, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderInfo_get_blocks)

static bool js_gfx_GFXShaderInfo_set_blocks(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_set_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXUniformBlock> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderInfo_set_blocks : Error processing new value");
    cobj->blocks = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderInfo_set_blocks)

static bool js_gfx_GFXShaderInfo_get_samplers(se::State& s)
{
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_get_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->samplers, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXShaderInfo_get_samplers)

static bool js_gfx_GFXShaderInfo_set_samplers(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShaderInfo_set_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXUniformSampler> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShaderInfo_set_samplers : Error processing new value");
    cobj->samplers = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXShaderInfo_set_samplers)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXShaderInfo_finalize)

static bool js_gfx_GFXShaderInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXShaderInfo* cobj = JSB_ALLOC(cc::gfx::GFXShaderInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXShaderInfo* cobj = JSB_ALLOC(cc::gfx::GFXShaderInfo);
        cc::gfx::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        std::vector<cc::gfx::GFXShaderStage> arg1;
        json->getProperty("stages", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->stages = arg1;
        }
        std::vector<cc::gfx::GFXAttribute> arg2;
        json->getProperty("attributes", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg2);
            cobj->attributes = arg2;
        }
        std::vector<cc::gfx::GFXUniformBlock> arg3;
        json->getProperty("blocks", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg3);
            cobj->blocks = arg3;
        }
        std::vector<cc::gfx::GFXUniformSampler> arg4;
        json->getProperty("samplers", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg4);
            cobj->samplers = arg4;
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
        cc::gfx::GFXShaderInfo* cobj = JSB_ALLOC(cc::gfx::GFXShaderInfo);
        cc::gfx::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        std::vector<cc::gfx::GFXShaderStage> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->stages = arg1;
        }
        std::vector<cc::gfx::GFXAttribute> arg2;
        if (!args[2].isUndefined()) {
            ok &= seval_to_std_vector(args[2], &arg2);
            cobj->attributes = arg2;
        }
        std::vector<cc::gfx::GFXUniformBlock> arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_std_vector(args[3], &arg3);
            cobj->blocks = arg3;
        }
        std::vector<cc::gfx::GFXUniformSampler> arg4;
        if (!args[4].isUndefined()) {
            ok &= seval_to_std_vector(args[4], &arg4);
            cobj->samplers = arg4;
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
SE_BIND_CTOR(js_gfx_GFXShaderInfo_constructor, __jsb_cc_gfx_GFXShaderInfo_class, js_cc_gfx_GFXShaderInfo_finalize)




static bool js_cc_gfx_GFXShaderInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXShaderInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXShaderInfo* cobj = (cc::gfx::GFXShaderInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXShaderInfo_finalize)

bool js_register_gfx_GFXShaderInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXShaderInfo", obj, nullptr, _SE(js_gfx_GFXShaderInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_GFXShaderInfo_get_name), _SE(js_gfx_GFXShaderInfo_set_name));
    cls->defineProperty("stages", _SE(js_gfx_GFXShaderInfo_get_stages), _SE(js_gfx_GFXShaderInfo_set_stages));
    cls->defineProperty("attributes", _SE(js_gfx_GFXShaderInfo_get_attributes), _SE(js_gfx_GFXShaderInfo_set_attributes));
    cls->defineProperty("blocks", _SE(js_gfx_GFXShaderInfo_get_blocks), _SE(js_gfx_GFXShaderInfo_set_blocks));
    cls->defineProperty("samplers", _SE(js_gfx_GFXShaderInfo_get_samplers), _SE(js_gfx_GFXShaderInfo_set_samplers));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXShaderInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXShaderInfo>(cls);

    __jsb_cc_gfx_GFXShaderInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXShaderInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXInputAssemblerInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXInputAssemblerInfo_class = nullptr;

static bool js_gfx_GFXInputAssemblerInfo_get_attributes(se::State& s)
{
    cc::gfx::GFXInputAssemblerInfo* cobj = (cc::gfx::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->attributes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssemblerInfo_get_attributes)

static bool js_gfx_GFXInputAssemblerInfo_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXInputAssemblerInfo* cobj = (cc::gfx::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXAttribute> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_attributes : Error processing new value");
    cobj->attributes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_attributes)

static bool js_gfx_GFXInputAssemblerInfo_get_vertexBuffers(se::State& s)
{
    cc::gfx::GFXInputAssemblerInfo* cobj = (cc::gfx::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_get_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->vertexBuffers, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssemblerInfo_get_vertexBuffers)

static bool js_gfx_GFXInputAssemblerInfo_set_vertexBuffers(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXInputAssemblerInfo* cobj = (cc::gfx::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXBuffer *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_vertexBuffers : Error processing new value");
    cobj->vertexBuffers = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_vertexBuffers)

static bool js_gfx_GFXInputAssemblerInfo_get_indexBuffer(se::State& s)
{
    cc::gfx::GFXInputAssemblerInfo* cobj = (cc::gfx::GFXInputAssemblerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXInputAssemblerInfo* cobj = (cc::gfx::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_indexBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBuffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_indexBuffer : Error processing new value");
    cobj->indexBuffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_indexBuffer)

static bool js_gfx_GFXInputAssemblerInfo_get_indirectBuffer(se::State& s)
{
    cc::gfx::GFXInputAssemblerInfo* cobj = (cc::gfx::GFXInputAssemblerInfo*)s.nativeThisObject();
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
    cc::gfx::GFXInputAssemblerInfo* cobj = (cc::gfx::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBuffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_indirectBuffer : Error processing new value");
    cobj->indirectBuffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_indirectBuffer)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXInputAssemblerInfo_finalize)

static bool js_gfx_GFXInputAssemblerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXInputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::GFXInputAssemblerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXInputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::GFXInputAssemblerInfo);
        std::vector<cc::gfx::GFXAttribute> arg0;
        json->getProperty("attributes", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg0);
            cobj->attributes = arg0;
        }
        std::vector<cc::gfx::GFXBuffer *> arg1;
        json->getProperty("vertexBuffers", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->vertexBuffers = arg1;
        }
        cc::gfx::GFXBuffer* arg2 = nullptr;
        json->getProperty("indexBuffer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg2);
            cobj->indexBuffer = arg2;
        }
        cc::gfx::GFXBuffer* arg3 = nullptr;
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
        cc::gfx::GFXInputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::GFXInputAssemblerInfo);
        std::vector<cc::gfx::GFXAttribute> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->attributes = arg0;
        }
        std::vector<cc::gfx::GFXBuffer *> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->vertexBuffers = arg1;
        }
        cc::gfx::GFXBuffer* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_native_ptr(args[2], &arg2);
            cobj->indexBuffer = arg2;
        }
        cc::gfx::GFXBuffer* arg3 = nullptr;
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
SE_BIND_CTOR(js_gfx_GFXInputAssemblerInfo_constructor, __jsb_cc_gfx_GFXInputAssemblerInfo_class, js_cc_gfx_GFXInputAssemblerInfo_finalize)




static bool js_cc_gfx_GFXInputAssemblerInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXInputAssemblerInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXInputAssemblerInfo* cobj = (cc::gfx::GFXInputAssemblerInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXInputAssemblerInfo_finalize)

bool js_register_gfx_GFXInputAssemblerInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXInputAssemblerInfo", obj, nullptr, _SE(js_gfx_GFXInputAssemblerInfo_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_GFXInputAssemblerInfo_get_attributes), _SE(js_gfx_GFXInputAssemblerInfo_set_attributes));
    cls->defineProperty("vertexBuffers", _SE(js_gfx_GFXInputAssemblerInfo_get_vertexBuffers), _SE(js_gfx_GFXInputAssemblerInfo_set_vertexBuffers));
    cls->defineProperty("indexBuffer", _SE(js_gfx_GFXInputAssemblerInfo_get_indexBuffer), _SE(js_gfx_GFXInputAssemblerInfo_set_indexBuffer));
    cls->defineProperty("indirectBuffer", _SE(js_gfx_GFXInputAssemblerInfo_get_indirectBuffer), _SE(js_gfx_GFXInputAssemblerInfo_set_indirectBuffer));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXInputAssemblerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXInputAssemblerInfo>(cls);

    __jsb_cc_gfx_GFXInputAssemblerInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXInputAssemblerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXColorAttachment_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXColorAttachment_class = nullptr;

static bool js_gfx_GFXColorAttachment_get_format(se::State& s)
{
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_format)

static bool js_gfx_GFXColorAttachment_get_loadOp(se::State& s)
{
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_loadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXLoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXLoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_loadOp : Error processing new value");
    cobj->loadOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_loadOp)

static bool js_gfx_GFXColorAttachment_get_storeOp(se::State& s)
{
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_storeOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXStoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_storeOp : Error processing new value");
    cobj->storeOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_storeOp)

static bool js_gfx_GFXColorAttachment_get_sampleCount(se::State& s)
{
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_beginLayout : Error processing new value");
    cobj->beginLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_beginLayout)

static bool js_gfx_GFXColorAttachment_get_endLayout(se::State& s)
{
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_endLayout : Error processing new value");
    cobj->endLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_endLayout)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXColorAttachment_finalize)

static bool js_gfx_GFXColorAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXColorAttachment* cobj = JSB_ALLOC(cc::gfx::GFXColorAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXColorAttachment* cobj = JSB_ALLOC(cc::gfx::GFXColorAttachment);
        cc::gfx::GFXFormat arg0;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXFormat)tmp; } while(false);
            cobj->format = arg0;
        }
        cc::gfx::GFXLoadOp arg1;
        json->getProperty("loadOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXLoadOp)tmp; } while(false);
            cobj->loadOp = arg1;
        }
        cc::gfx::GFXStoreOp arg2;
        json->getProperty("storeOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXStoreOp)tmp; } while(false);
            cobj->storeOp = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("sampleCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->sampleCount = arg3;
        }
        cc::gfx::GFXTextureLayout arg4;
        json->getProperty("beginLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
            cobj->beginLayout = arg4;
        }
        cc::gfx::GFXTextureLayout arg5;
        json->getProperty("endLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
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
        cc::gfx::GFXColorAttachment* cobj = JSB_ALLOC(cc::gfx::GFXColorAttachment);
        cc::gfx::GFXFormat arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFormat)tmp; } while(false);
            cobj->format = arg0;
        }
        cc::gfx::GFXLoadOp arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXLoadOp)tmp; } while(false);
            cobj->loadOp = arg1;
        }
        cc::gfx::GFXStoreOp arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXStoreOp)tmp; } while(false);
            cobj->storeOp = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->sampleCount = arg3;
        }
        cc::gfx::GFXTextureLayout arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
            cobj->beginLayout = arg4;
        }
        cc::gfx::GFXTextureLayout arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXColorAttachment_constructor, __jsb_cc_gfx_GFXColorAttachment_class, js_cc_gfx_GFXColorAttachment_finalize)




static bool js_cc_gfx_GFXColorAttachment_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXColorAttachment)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXColorAttachment* cobj = (cc::gfx::GFXColorAttachment*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXColorAttachment_finalize)

bool js_register_gfx_GFXColorAttachment(se::Object* obj)
{
    auto cls = se::Class::create("GFXColorAttachment", obj, nullptr, _SE(js_gfx_GFXColorAttachment_constructor));

    cls->defineProperty("format", _SE(js_gfx_GFXColorAttachment_get_format), _SE(js_gfx_GFXColorAttachment_set_format));
    cls->defineProperty("loadOp", _SE(js_gfx_GFXColorAttachment_get_loadOp), _SE(js_gfx_GFXColorAttachment_set_loadOp));
    cls->defineProperty("storeOp", _SE(js_gfx_GFXColorAttachment_get_storeOp), _SE(js_gfx_GFXColorAttachment_set_storeOp));
    cls->defineProperty("sampleCount", _SE(js_gfx_GFXColorAttachment_get_sampleCount), _SE(js_gfx_GFXColorAttachment_set_sampleCount));
    cls->defineProperty("beginLayout", _SE(js_gfx_GFXColorAttachment_get_beginLayout), _SE(js_gfx_GFXColorAttachment_set_beginLayout));
    cls->defineProperty("endLayout", _SE(js_gfx_GFXColorAttachment_get_endLayout), _SE(js_gfx_GFXColorAttachment_set_endLayout));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXColorAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXColorAttachment>(cls);

    __jsb_cc_gfx_GFXColorAttachment_proto = cls->getProto();
    __jsb_cc_gfx_GFXColorAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXDepthStencilAttachment_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXDepthStencilAttachment_class = nullptr;

static bool js_gfx_GFXDepthStencilAttachment_get_format(se::State& s)
{
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_format)

static bool js_gfx_GFXDepthStencilAttachment_get_depthLoadOp(se::State& s)
{
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_depthLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXLoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXLoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_depthLoadOp : Error processing new value");
    cobj->depthLoadOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_depthLoadOp)

static bool js_gfx_GFXDepthStencilAttachment_get_depthStoreOp(se::State& s)
{
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_depthStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXStoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_depthStoreOp : Error processing new value");
    cobj->depthStoreOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_depthStoreOp)

static bool js_gfx_GFXDepthStencilAttachment_get_stencilLoadOp(se::State& s)
{
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_stencilLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXLoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXLoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_stencilLoadOp : Error processing new value");
    cobj->stencilLoadOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_stencilLoadOp)

static bool js_gfx_GFXDepthStencilAttachment_get_stencilStoreOp(se::State& s)
{
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_stencilStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXStoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_stencilStoreOp : Error processing new value");
    cobj->stencilStoreOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_stencilStoreOp)

static bool js_gfx_GFXDepthStencilAttachment_get_sampleCount(se::State& s)
{
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_beginLayout : Error processing new value");
    cobj->beginLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_beginLayout)

static bool js_gfx_GFXDepthStencilAttachment_get_endLayout(se::State& s)
{
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_endLayout : Error processing new value");
    cobj->endLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_endLayout)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXDepthStencilAttachment_finalize)

static bool js_gfx_GFXDepthStencilAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXDepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::GFXDepthStencilAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXDepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::GFXDepthStencilAttachment);
        cc::gfx::GFXFormat arg0;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXFormat)tmp; } while(false);
            cobj->format = arg0;
        }
        cc::gfx::GFXLoadOp arg1;
        json->getProperty("depthLoadOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXLoadOp)tmp; } while(false);
            cobj->depthLoadOp = arg1;
        }
        cc::gfx::GFXStoreOp arg2;
        json->getProperty("depthStoreOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXStoreOp)tmp; } while(false);
            cobj->depthStoreOp = arg2;
        }
        cc::gfx::GFXLoadOp arg3;
        json->getProperty("stencilLoadOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::GFXLoadOp)tmp; } while(false);
            cobj->stencilLoadOp = arg3;
        }
        cc::gfx::GFXStoreOp arg4;
        json->getProperty("stencilStoreOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::GFXStoreOp)tmp; } while(false);
            cobj->stencilStoreOp = arg4;
        }
        unsigned int arg5 = 0;
        json->getProperty("sampleCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg5);
            cobj->sampleCount = arg5;
        }
        cc::gfx::GFXTextureLayout arg6;
        json->getProperty("beginLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
            cobj->beginLayout = arg6;
        }
        cc::gfx::GFXTextureLayout arg7;
        json->getProperty("endLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
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
        cc::gfx::GFXDepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::GFXDepthStencilAttachment);
        cc::gfx::GFXFormat arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFormat)tmp; } while(false);
            cobj->format = arg0;
        }
        cc::gfx::GFXLoadOp arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXLoadOp)tmp; } while(false);
            cobj->depthLoadOp = arg1;
        }
        cc::gfx::GFXStoreOp arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXStoreOp)tmp; } while(false);
            cobj->depthStoreOp = arg2;
        }
        cc::gfx::GFXLoadOp arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::GFXLoadOp)tmp; } while(false);
            cobj->stencilLoadOp = arg3;
        }
        cc::gfx::GFXStoreOp arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::GFXStoreOp)tmp; } while(false);
            cobj->stencilStoreOp = arg4;
        }
        unsigned int arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
            cobj->sampleCount = arg5;
        }
        cc::gfx::GFXTextureLayout arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
            cobj->beginLayout = arg6;
        }
        cc::gfx::GFXTextureLayout arg7;
        if (!args[7].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXDepthStencilAttachment_constructor, __jsb_cc_gfx_GFXDepthStencilAttachment_class, js_cc_gfx_GFXDepthStencilAttachment_finalize)




static bool js_cc_gfx_GFXDepthStencilAttachment_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXDepthStencilAttachment)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXDepthStencilAttachment* cobj = (cc::gfx::GFXDepthStencilAttachment*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXDepthStencilAttachment_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXDepthStencilAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXDepthStencilAttachment>(cls);

    __jsb_cc_gfx_GFXDepthStencilAttachment_proto = cls->getProto();
    __jsb_cc_gfx_GFXDepthStencilAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXRenderPassInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXRenderPassInfo_class = nullptr;

static bool js_gfx_GFXRenderPassInfo_get_colorAttachments(se::State& s)
{
    cc::gfx::GFXRenderPassInfo* cobj = (cc::gfx::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_get_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->colorAttachments, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPassInfo_get_colorAttachments)

static bool js_gfx_GFXRenderPassInfo_set_colorAttachments(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXRenderPassInfo* cobj = (cc::gfx::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_set_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXColorAttachment> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPassInfo_set_colorAttachments : Error processing new value");
    cobj->colorAttachments = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRenderPassInfo_set_colorAttachments)

static bool js_gfx_GFXRenderPassInfo_get_depthStencilAttachment(se::State& s)
{
    cc::gfx::GFXRenderPassInfo* cobj = (cc::gfx::GFXRenderPassInfo*)s.nativeThisObject();
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
    cc::gfx::GFXRenderPassInfo* cobj = (cc::gfx::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_set_depthStencilAttachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXDepthStencilAttachment* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPassInfo_set_depthStencilAttachment : Error processing new value");
    cobj->depthStencilAttachment = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRenderPassInfo_set_depthStencilAttachment)

static bool js_gfx_GFXRenderPassInfo_get_subPasses(se::State& s)
{
    cc::gfx::GFXRenderPassInfo* cobj = (cc::gfx::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_get_subPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->subPasses, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPassInfo_get_subPasses)

static bool js_gfx_GFXRenderPassInfo_set_subPasses(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXRenderPassInfo* cobj = (cc::gfx::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_set_subPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXSubPass> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPassInfo_set_subPasses : Error processing new value");
    cobj->subPasses = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRenderPassInfo_set_subPasses)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXRenderPassInfo_finalize)

static bool js_gfx_GFXRenderPassInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXRenderPassInfo* cobj = JSB_ALLOC(cc::gfx::GFXRenderPassInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXRenderPassInfo* cobj = JSB_ALLOC(cc::gfx::GFXRenderPassInfo);
        std::vector<cc::gfx::GFXColorAttachment> arg0;
        json->getProperty("colorAttachments", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg0);
            cobj->colorAttachments = arg0;
        }
        cc::gfx::GFXDepthStencilAttachment* arg1 = nullptr;
        json->getProperty("depthStencilAttachment", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg1);
            cobj->depthStencilAttachment = *arg1;
        }
        std::vector<cc::gfx::GFXSubPass> arg2;
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
        cc::gfx::GFXRenderPassInfo* cobj = JSB_ALLOC(cc::gfx::GFXRenderPassInfo);
        std::vector<cc::gfx::GFXColorAttachment> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->colorAttachments = arg0;
        }
        cc::gfx::GFXDepthStencilAttachment* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_reference(args[1], &arg1);
            cobj->depthStencilAttachment = *arg1;
        }
        std::vector<cc::gfx::GFXSubPass> arg2;
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
SE_BIND_CTOR(js_gfx_GFXRenderPassInfo_constructor, __jsb_cc_gfx_GFXRenderPassInfo_class, js_cc_gfx_GFXRenderPassInfo_finalize)




static bool js_cc_gfx_GFXRenderPassInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXRenderPassInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXRenderPassInfo* cobj = (cc::gfx::GFXRenderPassInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXRenderPassInfo_finalize)

bool js_register_gfx_GFXRenderPassInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXRenderPassInfo", obj, nullptr, _SE(js_gfx_GFXRenderPassInfo_constructor));

    cls->defineProperty("colorAttachments", _SE(js_gfx_GFXRenderPassInfo_get_colorAttachments), _SE(js_gfx_GFXRenderPassInfo_set_colorAttachments));
    cls->defineProperty("depthStencilAttachment", _SE(js_gfx_GFXRenderPassInfo_get_depthStencilAttachment), _SE(js_gfx_GFXRenderPassInfo_set_depthStencilAttachment));
    cls->defineProperty("subPasses", _SE(js_gfx_GFXRenderPassInfo_get_subPasses), _SE(js_gfx_GFXRenderPassInfo_set_subPasses));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXRenderPassInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXRenderPassInfo>(cls);

    __jsb_cc_gfx_GFXRenderPassInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXRenderPassInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXFramebufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXFramebufferInfo_class = nullptr;

static bool js_gfx_GFXFramebufferInfo_get_renderPass(se::State& s)
{
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXRenderPass* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_renderPass : Error processing new value");
    cobj->renderPass = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_renderPass)

static bool js_gfx_GFXFramebufferInfo_get_colorTextures(se::State& s)
{
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_colorTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->colorTextures, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_colorTextures)

static bool js_gfx_GFXFramebufferInfo_set_colorTextures(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_colorTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXTexture *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_colorTextures : Error processing new value");
    cobj->colorTextures = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_colorTextures)

static bool js_gfx_GFXFramebufferInfo_get_colorMipmapLevels(se::State& s)
{
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_colorMipmapLevels : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_int_to_seval(cobj->colorMipmapLevels, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_colorMipmapLevels)

static bool js_gfx_GFXFramebufferInfo_set_colorMipmapLevels(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_colorMipmapLevels : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<int> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_colorMipmapLevels : Error processing new value");
    cobj->colorMipmapLevels = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_colorMipmapLevels)

static bool js_gfx_GFXFramebufferInfo_get_depthStencilTexture(se::State& s)
{
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_depthStencilTexture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->depthStencilTexture, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_depthStencilTexture)

static bool js_gfx_GFXFramebufferInfo_set_depthStencilTexture(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_depthStencilTexture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTexture* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_depthStencilTexture : Error processing new value");
    cobj->depthStencilTexture = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_depthStencilTexture)

static bool js_gfx_GFXFramebufferInfo_get_depthStencilMipmapLevel(se::State& s)
{
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_depthStencilMipmapLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depthStencilMipmapLevel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_depthStencilMipmapLevel)

static bool js_gfx_GFXFramebufferInfo_set_depthStencilMipmapLevel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_depthStencilMipmapLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_depthStencilMipmapLevel : Error processing new value");
    cobj->depthStencilMipmapLevel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_depthStencilMipmapLevel)

static bool js_gfx_GFXFramebufferInfo_get_isOffscreen(se::State& s)
{
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_isOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_isOffscreen : Error processing new value");
    cobj->isOffscreen = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_isOffscreen)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXFramebufferInfo_finalize)

static bool js_gfx_GFXFramebufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXFramebufferInfo* cobj = JSB_ALLOC(cc::gfx::GFXFramebufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXFramebufferInfo* cobj = JSB_ALLOC(cc::gfx::GFXFramebufferInfo);
        cc::gfx::GFXRenderPass* arg0 = nullptr;
        json->getProperty("renderPass", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->renderPass = arg0;
        }
        std::vector<cc::gfx::GFXTexture *> arg1;
        json->getProperty("colorTextures", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->colorTextures = arg1;
        }
        std::vector<int> arg2;
        json->getProperty("colorMipmapLevels", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg2);
            cobj->colorMipmapLevels = arg2;
        }
        cc::gfx::GFXTexture* arg3 = nullptr;
        json->getProperty("depthStencilTexture", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg3);
            cobj->depthStencilTexture = arg3;
        }
        int arg4 = 0;
        json->getProperty("depthStencilMipmapLevel", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (int)tmp; } while(false);
            cobj->depthStencilMipmapLevel = arg4;
        }
        bool arg5;
        json->getProperty("isOffscreen", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg5);
            cobj->isOffscreen = arg5;
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
        cc::gfx::GFXFramebufferInfo* cobj = JSB_ALLOC(cc::gfx::GFXFramebufferInfo);
        cc::gfx::GFXRenderPass* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->renderPass = arg0;
        }
        std::vector<cc::gfx::GFXTexture *> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->colorTextures = arg1;
        }
        std::vector<int> arg2;
        if (!args[2].isUndefined()) {
            ok &= seval_to_std_vector(args[2], &arg2);
            cobj->colorMipmapLevels = arg2;
        }
        cc::gfx::GFXTexture* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_native_ptr(args[3], &arg3);
            cobj->depthStencilTexture = arg3;
        }
        int arg4 = 0;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (int)tmp; } while(false);
            cobj->depthStencilMipmapLevel = arg4;
        }
        bool arg5;
        if (!args[5].isUndefined()) {
            ok &= seval_to_boolean(args[5], &arg5);
            cobj->isOffscreen = arg5;
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
SE_BIND_CTOR(js_gfx_GFXFramebufferInfo_constructor, __jsb_cc_gfx_GFXFramebufferInfo_class, js_cc_gfx_GFXFramebufferInfo_finalize)




static bool js_cc_gfx_GFXFramebufferInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXFramebufferInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXFramebufferInfo* cobj = (cc::gfx::GFXFramebufferInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXFramebufferInfo_finalize)

bool js_register_gfx_GFXFramebufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXFramebufferInfo", obj, nullptr, _SE(js_gfx_GFXFramebufferInfo_constructor));

    cls->defineProperty("renderPass", _SE(js_gfx_GFXFramebufferInfo_get_renderPass), _SE(js_gfx_GFXFramebufferInfo_set_renderPass));
    cls->defineProperty("colorTextures", _SE(js_gfx_GFXFramebufferInfo_get_colorTextures), _SE(js_gfx_GFXFramebufferInfo_set_colorTextures));
    cls->defineProperty("colorMipmapLevels", _SE(js_gfx_GFXFramebufferInfo_get_colorMipmapLevels), _SE(js_gfx_GFXFramebufferInfo_set_colorMipmapLevels));
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_GFXFramebufferInfo_get_depthStencilTexture), _SE(js_gfx_GFXFramebufferInfo_set_depthStencilTexture));
    cls->defineProperty("depthStencilMipmapLevel", _SE(js_gfx_GFXFramebufferInfo_get_depthStencilMipmapLevel), _SE(js_gfx_GFXFramebufferInfo_set_depthStencilMipmapLevel));
    cls->defineProperty("isOffscreen", _SE(js_gfx_GFXFramebufferInfo_get_isOffscreen), _SE(js_gfx_GFXFramebufferInfo_set_isOffscreen));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXFramebufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXFramebufferInfo>(cls);

    __jsb_cc_gfx_GFXFramebufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXFramebufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXBinding_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXBinding_class = nullptr;

static bool js_gfx_GFXBinding_get_shaderStages(se::State& s)
{
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_get_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shaderStages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBinding_get_shaderStages)

static bool js_gfx_GFXBinding_set_shaderStages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_set_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBinding_set_shaderStages : Error processing new value");
    cobj->shaderStages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBinding_set_shaderStages)

static bool js_gfx_GFXBinding_get_binding(se::State& s)
{
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
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
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
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
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
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
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBindingType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBindingType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBinding_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBinding_set_type)

static bool js_gfx_GFXBinding_get_name(se::State& s)
{
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
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
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBinding_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBinding_set_name)

static bool js_gfx_GFXBinding_get_count(se::State& s)
{
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBinding_get_count)

static bool js_gfx_GFXBinding_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBinding_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBinding_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBinding_set_count)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXBinding_finalize)

static bool js_gfx_GFXBinding_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXBinding* cobj = JSB_ALLOC(cc::gfx::GFXBinding);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXBinding* cobj = JSB_ALLOC(cc::gfx::GFXBinding);
        cc::gfx::GFXShaderType arg0;
        json->getProperty("shaderStages", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::GFXBindingType arg2;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXBindingType)tmp; } while(false);
            cobj->type = arg2;
        }
        cc::gfx::String arg3;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg3 = field.toStringForce().c_str();
            cobj->name = arg3;
        }
        unsigned int arg4 = 0;
        json->getProperty("count", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg4);
            cobj->count = arg4;
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
        cc::gfx::GFXBinding* cobj = JSB_ALLOC(cc::gfx::GFXBinding);
        cc::gfx::GFXShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::GFXBindingType arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXBindingType)tmp; } while(false);
            cobj->type = arg2;
        }
        cc::gfx::String arg3;
        if (!args[3].isUndefined()) {
            arg3 = args[3].toStringForce().c_str();
            cobj->name = arg3;
        }
        unsigned int arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->count = arg4;
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
SE_BIND_CTOR(js_gfx_GFXBinding_constructor, __jsb_cc_gfx_GFXBinding_class, js_cc_gfx_GFXBinding_finalize)




static bool js_cc_gfx_GFXBinding_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXBinding)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXBinding* cobj = (cc::gfx::GFXBinding*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXBinding_finalize)

bool js_register_gfx_GFXBinding(se::Object* obj)
{
    auto cls = se::Class::create("GFXBinding", obj, nullptr, _SE(js_gfx_GFXBinding_constructor));

    cls->defineProperty("shaderStages", _SE(js_gfx_GFXBinding_get_shaderStages), _SE(js_gfx_GFXBinding_set_shaderStages));
    cls->defineProperty("binding", _SE(js_gfx_GFXBinding_get_binding), _SE(js_gfx_GFXBinding_set_binding));
    cls->defineProperty("type", _SE(js_gfx_GFXBinding_get_type), _SE(js_gfx_GFXBinding_set_type));
    cls->defineProperty("name", _SE(js_gfx_GFXBinding_get_name), _SE(js_gfx_GFXBinding_set_name));
    cls->defineProperty("count", _SE(js_gfx_GFXBinding_get_count), _SE(js_gfx_GFXBinding_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXBinding_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXBinding>(cls);

    __jsb_cc_gfx_GFXBinding_proto = cls->getProto();
    __jsb_cc_gfx_GFXBinding_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXBindingLayoutInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXBindingLayoutInfo_class = nullptr;

static bool js_gfx_GFXBindingLayoutInfo_get_bindings(se::State& s)
{
    cc::gfx::GFXBindingLayoutInfo* cobj = (cc::gfx::GFXBindingLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayoutInfo_get_bindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->bindings, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingLayoutInfo_get_bindings)

static bool js_gfx_GFXBindingLayoutInfo_set_bindings(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXBindingLayoutInfo* cobj = (cc::gfx::GFXBindingLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayoutInfo_set_bindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXBinding> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayoutInfo_set_bindings : Error processing new value");
    cobj->bindings = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingLayoutInfo_set_bindings)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXBindingLayoutInfo_finalize)

static bool js_gfx_GFXBindingLayoutInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXBindingLayoutInfo* cobj = JSB_ALLOC(cc::gfx::GFXBindingLayoutInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cc::gfx::GFXBindingLayoutInfo* cobj = JSB_ALLOC(cc::gfx::GFXBindingLayoutInfo);
        std::vector<cc::gfx::GFXBinding> arg0;
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
SE_BIND_CTOR(js_gfx_GFXBindingLayoutInfo_constructor, __jsb_cc_gfx_GFXBindingLayoutInfo_class, js_cc_gfx_GFXBindingLayoutInfo_finalize)




static bool js_cc_gfx_GFXBindingLayoutInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXBindingLayoutInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXBindingLayoutInfo* cobj = (cc::gfx::GFXBindingLayoutInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXBindingLayoutInfo_finalize)

bool js_register_gfx_GFXBindingLayoutInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXBindingLayoutInfo", obj, nullptr, _SE(js_gfx_GFXBindingLayoutInfo_constructor));

    cls->defineProperty("bindings", _SE(js_gfx_GFXBindingLayoutInfo_get_bindings), _SE(js_gfx_GFXBindingLayoutInfo_set_bindings));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXBindingLayoutInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXBindingLayoutInfo>(cls);

    __jsb_cc_gfx_GFXBindingLayoutInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXBindingLayoutInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXBindingUnit_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXBindingUnit_class = nullptr;

static bool js_gfx_GFXBindingUnit_get_shaderStages(se::State& s)
{
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shaderStages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_shaderStages)

static bool js_gfx_GFXBindingUnit_set_shaderStages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_shaderStages : Error processing new value");
    cobj->shaderStages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_shaderStages)

static bool js_gfx_GFXBindingUnit_get_binding(se::State& s)
{
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
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
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
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
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
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
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBindingType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBindingType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_type)

static bool js_gfx_GFXBindingUnit_get_name(se::State& s)
{
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
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
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_name)

static bool js_gfx_GFXBindingUnit_get_count(se::State& s)
{
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_count)

static bool js_gfx_GFXBindingUnit_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_count)

static bool js_gfx_GFXBindingUnit_get_buffer(se::State& s)
{
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
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
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBuffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_buffer : Error processing new value");
    cobj->buffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_buffer)

static bool js_gfx_GFXBindingUnit_get_texture(se::State& s)
{
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texture, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_texture)

static bool js_gfx_GFXBindingUnit_set_texture(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXTexture* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_texture : Error processing new value");
    cobj->texture = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_texture)

static bool js_gfx_GFXBindingUnit_get_sampler(se::State& s)
{
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
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
    cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_sampler : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXSampler* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_sampler : Error processing new value");
    cobj->sampler = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_sampler)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXBindingUnit_finalize)

static bool js_gfx_GFXBindingUnit_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXBindingUnit* cobj = JSB_ALLOC(cc::gfx::GFXBindingUnit);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXBindingUnit* cobj = JSB_ALLOC(cc::gfx::GFXBindingUnit);
        cc::gfx::GFXShaderType arg0;
        json->getProperty("shaderStages", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::GFXBindingType arg2;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXBindingType)tmp; } while(false);
            cobj->type = arg2;
        }
        cc::gfx::String arg3;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg3 = field.toStringForce().c_str();
            cobj->name = arg3;
        }
        unsigned int arg4 = 0;
        json->getProperty("count", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg4);
            cobj->count = arg4;
        }
        cc::gfx::GFXBuffer* arg5 = nullptr;
        json->getProperty("buffer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg5);
            cobj->buffer = arg5;
        }
        cc::gfx::GFXTexture* arg6 = nullptr;
        json->getProperty("texture", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg6);
            cobj->texture = arg6;
        }
        cc::gfx::GFXSampler* arg7 = nullptr;
        json->getProperty("sampler", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg7);
            cobj->sampler = arg7;
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
        cc::gfx::GFXBindingUnit* cobj = JSB_ALLOC(cc::gfx::GFXBindingUnit);
        cc::gfx::GFXShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::GFXBindingType arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXBindingType)tmp; } while(false);
            cobj->type = arg2;
        }
        cc::gfx::String arg3;
        if (!args[3].isUndefined()) {
            arg3 = args[3].toStringForce().c_str();
            cobj->name = arg3;
        }
        unsigned int arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->count = arg4;
        }
        cc::gfx::GFXBuffer* arg5 = nullptr;
        if (!args[5].isUndefined()) {
            ok &= seval_to_native_ptr(args[5], &arg5);
            cobj->buffer = arg5;
        }
        cc::gfx::GFXTexture* arg6 = nullptr;
        if (!args[6].isUndefined()) {
            ok &= seval_to_native_ptr(args[6], &arg6);
            cobj->texture = arg6;
        }
        cc::gfx::GFXSampler* arg7 = nullptr;
        if (!args[7].isUndefined()) {
            ok &= seval_to_native_ptr(args[7], &arg7);
            cobj->sampler = arg7;
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
SE_BIND_CTOR(js_gfx_GFXBindingUnit_constructor, __jsb_cc_gfx_GFXBindingUnit_class, js_cc_gfx_GFXBindingUnit_finalize)




static bool js_cc_gfx_GFXBindingUnit_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXBindingUnit)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXBindingUnit* cobj = (cc::gfx::GFXBindingUnit*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXBindingUnit_finalize)

bool js_register_gfx_GFXBindingUnit(se::Object* obj)
{
    auto cls = se::Class::create("GFXBindingUnit", obj, nullptr, _SE(js_gfx_GFXBindingUnit_constructor));

    cls->defineProperty("shaderStages", _SE(js_gfx_GFXBindingUnit_get_shaderStages), _SE(js_gfx_GFXBindingUnit_set_shaderStages));
    cls->defineProperty("binding", _SE(js_gfx_GFXBindingUnit_get_binding), _SE(js_gfx_GFXBindingUnit_set_binding));
    cls->defineProperty("type", _SE(js_gfx_GFXBindingUnit_get_type), _SE(js_gfx_GFXBindingUnit_set_type));
    cls->defineProperty("name", _SE(js_gfx_GFXBindingUnit_get_name), _SE(js_gfx_GFXBindingUnit_set_name));
    cls->defineProperty("count", _SE(js_gfx_GFXBindingUnit_get_count), _SE(js_gfx_GFXBindingUnit_set_count));
    cls->defineProperty("buffer", _SE(js_gfx_GFXBindingUnit_get_buffer), _SE(js_gfx_GFXBindingUnit_set_buffer));
    cls->defineProperty("texture", _SE(js_gfx_GFXBindingUnit_get_texture), _SE(js_gfx_GFXBindingUnit_set_texture));
    cls->defineProperty("sampler", _SE(js_gfx_GFXBindingUnit_get_sampler), _SE(js_gfx_GFXBindingUnit_set_sampler));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXBindingUnit_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXBindingUnit>(cls);

    __jsb_cc_gfx_GFXBindingUnit_proto = cls->getProto();
    __jsb_cc_gfx_GFXBindingUnit_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXPushConstantRange_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXPushConstantRange_class = nullptr;

static bool js_gfx_GFXPushConstantRange_get_shaderType(se::State& s)
{
    cc::gfx::GFXPushConstantRange* cobj = (cc::gfx::GFXPushConstantRange*)s.nativeThisObject();
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
    cc::gfx::GFXPushConstantRange* cobj = (cc::gfx::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_set_shaderType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPushConstantRange_set_shaderType : Error processing new value");
    cobj->shaderType = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPushConstantRange_set_shaderType)

static bool js_gfx_GFXPushConstantRange_get_offset(se::State& s)
{
    cc::gfx::GFXPushConstantRange* cobj = (cc::gfx::GFXPushConstantRange*)s.nativeThisObject();
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
    cc::gfx::GFXPushConstantRange* cobj = (cc::gfx::GFXPushConstantRange*)s.nativeThisObject();
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
    cc::gfx::GFXPushConstantRange* cobj = (cc::gfx::GFXPushConstantRange*)s.nativeThisObject();
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
    cc::gfx::GFXPushConstantRange* cobj = (cc::gfx::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPushConstantRange_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPushConstantRange_set_count)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXPushConstantRange_finalize)

static bool js_gfx_GFXPushConstantRange_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXPushConstantRange* cobj = JSB_ALLOC(cc::gfx::GFXPushConstantRange);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXPushConstantRange* cobj = JSB_ALLOC(cc::gfx::GFXPushConstantRange);
        cc::gfx::GFXShaderType arg0;
        json->getProperty("shaderType", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
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
        cc::gfx::GFXPushConstantRange* cobj = JSB_ALLOC(cc::gfx::GFXPushConstantRange);
        cc::gfx::GFXShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShaderType)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXPushConstantRange_constructor, __jsb_cc_gfx_GFXPushConstantRange_class, js_cc_gfx_GFXPushConstantRange_finalize)




static bool js_cc_gfx_GFXPushConstantRange_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXPushConstantRange)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXPushConstantRange* cobj = (cc::gfx::GFXPushConstantRange*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXPushConstantRange_finalize)

bool js_register_gfx_GFXPushConstantRange(se::Object* obj)
{
    auto cls = se::Class::create("GFXPushConstantRange", obj, nullptr, _SE(js_gfx_GFXPushConstantRange_constructor));

    cls->defineProperty("shaderType", _SE(js_gfx_GFXPushConstantRange_get_shaderType), _SE(js_gfx_GFXPushConstantRange_set_shaderType));
    cls->defineProperty("offset", _SE(js_gfx_GFXPushConstantRange_get_offset), _SE(js_gfx_GFXPushConstantRange_set_offset));
    cls->defineProperty("count", _SE(js_gfx_GFXPushConstantRange_get_count), _SE(js_gfx_GFXPushConstantRange_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXPushConstantRange_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXPushConstantRange>(cls);

    __jsb_cc_gfx_GFXPushConstantRange_proto = cls->getProto();
    __jsb_cc_gfx_GFXPushConstantRange_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXPipelineLayoutInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXPipelineLayoutInfo_class = nullptr;

static bool js_gfx_GFXPipelineLayoutInfo_get_pushConstantsRanges(se::State& s)
{
    cc::gfx::GFXPipelineLayoutInfo* cobj = (cc::gfx::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_get_pushConstantsRanges : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->pushConstantsRanges, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineLayoutInfo_get_pushConstantsRanges)

static bool js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXPipelineLayoutInfo* cobj = (cc::gfx::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXPushConstantRange> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges : Error processing new value");
    cobj->pushConstantsRanges = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges)

static bool js_gfx_GFXPipelineLayoutInfo_get_layouts(se::State& s)
{
    cc::gfx::GFXPipelineLayoutInfo* cobj = (cc::gfx::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_get_layouts : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->layouts, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineLayoutInfo_get_layouts)

static bool js_gfx_GFXPipelineLayoutInfo_set_layouts(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXPipelineLayoutInfo* cobj = (cc::gfx::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_set_layouts : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXBindingLayout *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayoutInfo_set_layouts : Error processing new value");
    cobj->layouts = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineLayoutInfo_set_layouts)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXPipelineLayoutInfo_finalize)

static bool js_gfx_GFXPipelineLayoutInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXPipelineLayoutInfo* cobj = JSB_ALLOC(cc::gfx::GFXPipelineLayoutInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXPipelineLayoutInfo* cobj = JSB_ALLOC(cc::gfx::GFXPipelineLayoutInfo);
        std::vector<cc::gfx::GFXPushConstantRange> arg0;
        json->getProperty("pushConstantsRanges", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg0);
            cobj->pushConstantsRanges = arg0;
        }
        std::vector<cc::gfx::GFXBindingLayout *> arg1;
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
        cc::gfx::GFXPipelineLayoutInfo* cobj = JSB_ALLOC(cc::gfx::GFXPipelineLayoutInfo);
        std::vector<cc::gfx::GFXPushConstantRange> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->pushConstantsRanges = arg0;
        }
        std::vector<cc::gfx::GFXBindingLayout *> arg1;
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
SE_BIND_CTOR(js_gfx_GFXPipelineLayoutInfo_constructor, __jsb_cc_gfx_GFXPipelineLayoutInfo_class, js_cc_gfx_GFXPipelineLayoutInfo_finalize)




static bool js_cc_gfx_GFXPipelineLayoutInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXPipelineLayoutInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXPipelineLayoutInfo* cobj = (cc::gfx::GFXPipelineLayoutInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXPipelineLayoutInfo_finalize)

bool js_register_gfx_GFXPipelineLayoutInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineLayoutInfo", obj, nullptr, _SE(js_gfx_GFXPipelineLayoutInfo_constructor));

    cls->defineProperty("pushConstantsRanges", _SE(js_gfx_GFXPipelineLayoutInfo_get_pushConstantsRanges), _SE(js_gfx_GFXPipelineLayoutInfo_set_pushConstantsRanges));
    cls->defineProperty("layouts", _SE(js_gfx_GFXPipelineLayoutInfo_get_layouts), _SE(js_gfx_GFXPipelineLayoutInfo_set_layouts));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXPipelineLayoutInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXPipelineLayoutInfo>(cls);

    __jsb_cc_gfx_GFXPipelineLayoutInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXPipelineLayoutInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXInputState_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXInputState_class = nullptr;

static bool js_gfx_GFXInputState_get_attributes(se::State& s)
{
    cc::gfx::GFXInputState* cobj = (cc::gfx::GFXInputState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputState_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->attributes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputState_get_attributes)

static bool js_gfx_GFXInputState_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXInputState* cobj = (cc::gfx::GFXInputState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputState_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXAttribute> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputState_set_attributes : Error processing new value");
    cobj->attributes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputState_set_attributes)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXInputState_finalize)

static bool js_gfx_GFXInputState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXInputState* cobj = JSB_ALLOC(cc::gfx::GFXInputState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cc::gfx::GFXInputState* cobj = JSB_ALLOC(cc::gfx::GFXInputState);
        std::vector<cc::gfx::GFXAttribute> arg0;
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
SE_BIND_CTOR(js_gfx_GFXInputState_constructor, __jsb_cc_gfx_GFXInputState_class, js_cc_gfx_GFXInputState_finalize)




static bool js_cc_gfx_GFXInputState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXInputState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXInputState* cobj = (cc::gfx::GFXInputState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXInputState_finalize)

bool js_register_gfx_GFXInputState(se::Object* obj)
{
    auto cls = se::Class::create("GFXInputState", obj, nullptr, _SE(js_gfx_GFXInputState_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_GFXInputState_get_attributes), _SE(js_gfx_GFXInputState_set_attributes));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXInputState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXInputState>(cls);

    __jsb_cc_gfx_GFXInputState_proto = cls->getProto();
    __jsb_cc_gfx_GFXInputState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXRasterizerState_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXRasterizerState_class = nullptr;

static bool js_gfx_GFXRasterizerState_get_isDiscard(se::State& s)
{
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXPolygonMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXPolygonMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_polygonMode : Error processing new value");
    cobj->polygonMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_polygonMode)

static bool js_gfx_GFXRasterizerState_get_shadeModel(se::State& s)
{
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXShadeModel arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXShadeModel)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_shadeModel : Error processing new value");
    cobj->shadeModel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_shadeModel)

static bool js_gfx_GFXRasterizerState_get_cullMode(se::State& s)
{
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXCullMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXCullMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_cullMode : Error processing new value");
    cobj->cullMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_cullMode)

static bool js_gfx_GFXRasterizerState_get_isFrontFaceCCW(se::State& s)
{
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_isFrontFaceCCW : Error processing new value");
    cobj->isFrontFaceCCW = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_isFrontFaceCCW)

static bool js_gfx_GFXRasterizerState_get_depthBiasEnabled(se::State& s)
{
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->depthBiasEnabled, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_depthBiasEnabled)

static bool js_gfx_GFXRasterizerState_set_depthBiasEnabled(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_depthBiasEnabled : Error processing new value");
    cobj->depthBiasEnabled = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_depthBiasEnabled)

static bool js_gfx_GFXRasterizerState_get_depthBias(se::State& s)
{
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
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
    cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_lineWidth : Error processing new value");
    cobj->lineWidth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_lineWidth)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXRasterizerState_finalize)

static bool js_gfx_GFXRasterizerState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXRasterizerState* cobj = JSB_ALLOC(cc::gfx::GFXRasterizerState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXRasterizerState* cobj = JSB_ALLOC(cc::gfx::GFXRasterizerState);
        bool arg0;
        json->getProperty("isDiscard", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg0);
            cobj->isDiscard = arg0;
        }
        cc::gfx::GFXPolygonMode arg1;
        json->getProperty("polygonMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXPolygonMode)tmp; } while(false);
            cobj->polygonMode = arg1;
        }
        cc::gfx::GFXShadeModel arg2;
        json->getProperty("shadeModel", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXShadeModel)tmp; } while(false);
            cobj->shadeModel = arg2;
        }
        cc::gfx::GFXCullMode arg3;
        json->getProperty("cullMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::GFXCullMode)tmp; } while(false);
            cobj->cullMode = arg3;
        }
        bool arg4;
        json->getProperty("isFrontFaceCCW", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg4);
            cobj->isFrontFaceCCW = arg4;
        }
        bool arg5;
        json->getProperty("depthBiasEnabled", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg5);
            cobj->depthBiasEnabled = arg5;
        }
        float arg6 = 0;
        json->getProperty("depthBias", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg6);
            cobj->depthBias = arg6;
        }
        float arg7 = 0;
        json->getProperty("depthBiasClamp", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg7);
            cobj->depthBiasClamp = arg7;
        }
        float arg8 = 0;
        json->getProperty("depthBiasSlop", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg8);
            cobj->depthBiasSlop = arg8;
        }
        bool arg9;
        json->getProperty("isDepthClip", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg9);
            cobj->isDepthClip = arg9;
        }
        bool arg10;
        json->getProperty("isMultisample", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg10);
            cobj->isMultisample = arg10;
        }
        float arg11 = 0;
        json->getProperty("lineWidth", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_float(field, &arg11);
            cobj->lineWidth = arg11;
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
    else if(argc == 12)
    {
        cc::gfx::GFXRasterizerState* cobj = JSB_ALLOC(cc::gfx::GFXRasterizerState);
        bool arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->isDiscard = arg0;
        }
        cc::gfx::GFXPolygonMode arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXPolygonMode)tmp; } while(false);
            cobj->polygonMode = arg1;
        }
        cc::gfx::GFXShadeModel arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXShadeModel)tmp; } while(false);
            cobj->shadeModel = arg2;
        }
        cc::gfx::GFXCullMode arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::GFXCullMode)tmp; } while(false);
            cobj->cullMode = arg3;
        }
        bool arg4;
        if (!args[4].isUndefined()) {
            ok &= seval_to_boolean(args[4], &arg4);
            cobj->isFrontFaceCCW = arg4;
        }
        bool arg5;
        if (!args[5].isUndefined()) {
            ok &= seval_to_boolean(args[5], &arg5);
            cobj->depthBiasEnabled = arg5;
        }
        float arg6 = 0;
        if (!args[6].isUndefined()) {
            ok &= seval_to_float(args[6], &arg6);
            cobj->depthBias = arg6;
        }
        float arg7 = 0;
        if (!args[7].isUndefined()) {
            ok &= seval_to_float(args[7], &arg7);
            cobj->depthBiasClamp = arg7;
        }
        float arg8 = 0;
        if (!args[8].isUndefined()) {
            ok &= seval_to_float(args[8], &arg8);
            cobj->depthBiasSlop = arg8;
        }
        bool arg9;
        if (!args[9].isUndefined()) {
            ok &= seval_to_boolean(args[9], &arg9);
            cobj->isDepthClip = arg9;
        }
        bool arg10;
        if (!args[10].isUndefined()) {
            ok &= seval_to_boolean(args[10], &arg10);
            cobj->isMultisample = arg10;
        }
        float arg11 = 0;
        if (!args[11].isUndefined()) {
            ok &= seval_to_float(args[11], &arg11);
            cobj->lineWidth = arg11;
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
SE_BIND_CTOR(js_gfx_GFXRasterizerState_constructor, __jsb_cc_gfx_GFXRasterizerState_class, js_cc_gfx_GFXRasterizerState_finalize)




static bool js_cc_gfx_GFXRasterizerState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXRasterizerState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXRasterizerState* cobj = (cc::gfx::GFXRasterizerState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXRasterizerState_finalize)

bool js_register_gfx_GFXRasterizerState(se::Object* obj)
{
    auto cls = se::Class::create("GFXRasterizerState", obj, nullptr, _SE(js_gfx_GFXRasterizerState_constructor));

    cls->defineProperty("isDiscard", _SE(js_gfx_GFXRasterizerState_get_isDiscard), _SE(js_gfx_GFXRasterizerState_set_isDiscard));
    cls->defineProperty("polygonMode", _SE(js_gfx_GFXRasterizerState_get_polygonMode), _SE(js_gfx_GFXRasterizerState_set_polygonMode));
    cls->defineProperty("shadeModel", _SE(js_gfx_GFXRasterizerState_get_shadeModel), _SE(js_gfx_GFXRasterizerState_set_shadeModel));
    cls->defineProperty("cullMode", _SE(js_gfx_GFXRasterizerState_get_cullMode), _SE(js_gfx_GFXRasterizerState_set_cullMode));
    cls->defineProperty("isFrontFaceCCW", _SE(js_gfx_GFXRasterizerState_get_isFrontFaceCCW), _SE(js_gfx_GFXRasterizerState_set_isFrontFaceCCW));
    cls->defineProperty("depthBiasEnabled", _SE(js_gfx_GFXRasterizerState_get_depthBiasEnabled), _SE(js_gfx_GFXRasterizerState_set_depthBiasEnabled));
    cls->defineProperty("depthBias", _SE(js_gfx_GFXRasterizerState_get_depthBias), _SE(js_gfx_GFXRasterizerState_set_depthBias));
    cls->defineProperty("depthBiasClamp", _SE(js_gfx_GFXRasterizerState_get_depthBiasClamp), _SE(js_gfx_GFXRasterizerState_set_depthBiasClamp));
    cls->defineProperty("depthBiasSlop", _SE(js_gfx_GFXRasterizerState_get_depthBiasSlop), _SE(js_gfx_GFXRasterizerState_set_depthBiasSlop));
    cls->defineProperty("isDepthClip", _SE(js_gfx_GFXRasterizerState_get_isDepthClip), _SE(js_gfx_GFXRasterizerState_set_isDepthClip));
    cls->defineProperty("isMultisample", _SE(js_gfx_GFXRasterizerState_get_isMultisample), _SE(js_gfx_GFXRasterizerState_set_isMultisample));
    cls->defineProperty("lineWidth", _SE(js_gfx_GFXRasterizerState_get_lineWidth), _SE(js_gfx_GFXRasterizerState_set_lineWidth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXRasterizerState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXRasterizerState>(cls);

    __jsb_cc_gfx_GFXRasterizerState_proto = cls->getProto();
    __jsb_cc_gfx_GFXRasterizerState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXDepthStencilState_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXDepthStencilState_class = nullptr;

static bool js_gfx_GFXDepthStencilState_get_depthTest(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_depthFunc : Error processing new value");
    cobj->depthFunc = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_depthFunc)

static bool js_gfx_GFXDepthStencilState_get_stencilTestFront(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilFuncFront : Error processing new value");
    cobj->stencilFuncFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilFuncFront)

static bool js_gfx_GFXDepthStencilState_get_stencilReadMaskFront(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilFailOpFront : Error processing new value");
    cobj->stencilFailOpFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilFailOpFront)

static bool js_gfx_GFXDepthStencilState_get_stencilZFailOpFront(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilZFailOpFront : Error processing new value");
    cobj->stencilZFailOpFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilZFailOpFront)

static bool js_gfx_GFXDepthStencilState_get_stencilPassOpFront(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilPassOpFront : Error processing new value");
    cobj->stencilPassOpFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilPassOpFront)

static bool js_gfx_GFXDepthStencilState_get_stencilRefFront(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilFuncBack : Error processing new value");
    cobj->stencilFuncBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilFuncBack)

static bool js_gfx_GFXDepthStencilState_get_stencilReadMaskBack(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilFailOpBack : Error processing new value");
    cobj->stencilFailOpBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilFailOpBack)

static bool js_gfx_GFXDepthStencilState_get_stencilZFailOpBack(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilZFailOpBack : Error processing new value");
    cobj->stencilZFailOpBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilZFailOpBack)

static bool js_gfx_GFXDepthStencilState_get_stencilPassOpBack(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilPassOpBack : Error processing new value");
    cobj->stencilPassOpBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilPassOpBack)

static bool js_gfx_GFXDepthStencilState_get_stencilRefBack(se::State& s)
{
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
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
    cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencilRefBack : Error processing new value");
    cobj->stencilRefBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencilRefBack)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXDepthStencilState_finalize)

static bool js_gfx_GFXDepthStencilState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXDepthStencilState* cobj = JSB_ALLOC(cc::gfx::GFXDepthStencilState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXDepthStencilState* cobj = JSB_ALLOC(cc::gfx::GFXDepthStencilState);
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
        cc::gfx::GFXComparisonFunc arg2;
        json->getProperty("depthFunc", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
            cobj->depthFunc = arg2;
        }
        bool arg3;
        json->getProperty("stencilTestFront", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg3);
            cobj->stencilTestFront = arg3;
        }
        cc::gfx::GFXComparisonFunc arg4;
        json->getProperty("stencilFuncFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
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
        cc::gfx::GFXStencilOp arg7;
        json->getProperty("stencilFailOpFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cc::gfx::GFXStencilOp)tmp; } while(false);
            cobj->stencilFailOpFront = arg7;
        }
        cc::gfx::GFXStencilOp arg8;
        json->getProperty("stencilZFailOpFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cc::gfx::GFXStencilOp)tmp; } while(false);
            cobj->stencilZFailOpFront = arg8;
        }
        cc::gfx::GFXStencilOp arg9;
        json->getProperty("stencilPassOpFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cc::gfx::GFXStencilOp)tmp; } while(false);
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
        cc::gfx::GFXComparisonFunc arg12;
        json->getProperty("stencilFuncBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg12 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
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
        cc::gfx::GFXStencilOp arg15;
        json->getProperty("stencilFailOpBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg15 = (cc::gfx::GFXStencilOp)tmp; } while(false);
            cobj->stencilFailOpBack = arg15;
        }
        cc::gfx::GFXStencilOp arg16;
        json->getProperty("stencilZFailOpBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg16 = (cc::gfx::GFXStencilOp)tmp; } while(false);
            cobj->stencilZFailOpBack = arg16;
        }
        cc::gfx::GFXStencilOp arg17;
        json->getProperty("stencilPassOpBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg17 = (cc::gfx::GFXStencilOp)tmp; } while(false);
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
        cc::gfx::GFXDepthStencilState* cobj = JSB_ALLOC(cc::gfx::GFXDepthStencilState);
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
        cc::gfx::GFXComparisonFunc arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
            cobj->depthFunc = arg2;
        }
        bool arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_boolean(args[3], &arg3);
            cobj->stencilTestFront = arg3;
        }
        cc::gfx::GFXComparisonFunc arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
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
        cc::gfx::GFXStencilOp arg7;
        if (!args[7].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cc::gfx::GFXStencilOp)tmp; } while(false);
            cobj->stencilFailOpFront = arg7;
        }
        cc::gfx::GFXStencilOp arg8;
        if (!args[8].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cc::gfx::GFXStencilOp)tmp; } while(false);
            cobj->stencilZFailOpFront = arg8;
        }
        cc::gfx::GFXStencilOp arg9;
        if (!args[9].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cc::gfx::GFXStencilOp)tmp; } while(false);
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
        cc::gfx::GFXComparisonFunc arg12;
        if (!args[12].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[12], &tmp); arg12 = (cc::gfx::GFXComparisonFunc)tmp; } while(false);
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
        cc::gfx::GFXStencilOp arg15;
        if (!args[15].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[15], &tmp); arg15 = (cc::gfx::GFXStencilOp)tmp; } while(false);
            cobj->stencilFailOpBack = arg15;
        }
        cc::gfx::GFXStencilOp arg16;
        if (!args[16].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[16], &tmp); arg16 = (cc::gfx::GFXStencilOp)tmp; } while(false);
            cobj->stencilZFailOpBack = arg16;
        }
        cc::gfx::GFXStencilOp arg17;
        if (!args[17].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[17], &tmp); arg17 = (cc::gfx::GFXStencilOp)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXDepthStencilState_constructor, __jsb_cc_gfx_GFXDepthStencilState_class, js_cc_gfx_GFXDepthStencilState_finalize)




static bool js_cc_gfx_GFXDepthStencilState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXDepthStencilState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXDepthStencilState* cobj = (cc::gfx::GFXDepthStencilState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXDepthStencilState_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXDepthStencilState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXDepthStencilState>(cls);

    __jsb_cc_gfx_GFXDepthStencilState_proto = cls->getProto();
    __jsb_cc_gfx_GFXDepthStencilState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXBlendTarget_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXBlendTarget_class = nullptr;

static bool js_gfx_GFXBlendTarget_get_blend(se::State& s)
{
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
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
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
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
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
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
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendSrc : Error processing new value");
    cobj->blendSrc = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendSrc)

static bool js_gfx_GFXBlendTarget_get_blendDst(se::State& s)
{
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
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
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendDst : Error processing new value");
    cobj->blendDst = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendDst)

static bool js_gfx_GFXBlendTarget_get_blendEq(se::State& s)
{
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
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
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBlendOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBlendOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendEq : Error processing new value");
    cobj->blendEq = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendEq)

static bool js_gfx_GFXBlendTarget_get_blendSrcAlpha(se::State& s)
{
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
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
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendSrcAlpha : Error processing new value");
    cobj->blendSrcAlpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendSrcAlpha)

static bool js_gfx_GFXBlendTarget_get_blendDstAlpha(se::State& s)
{
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
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
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendDstAlpha : Error processing new value");
    cobj->blendDstAlpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendDstAlpha)

static bool js_gfx_GFXBlendTarget_get_blendAlphaEq(se::State& s)
{
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
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
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBlendOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXBlendOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendAlphaEq : Error processing new value");
    cobj->blendAlphaEq = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendAlphaEq)

static bool js_gfx_GFXBlendTarget_get_blendColorMask(se::State& s)
{
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
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
    cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXColorMask arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXColorMask)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blendColorMask : Error processing new value");
    cobj->blendColorMask = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blendColorMask)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXBlendTarget_finalize)

static bool js_gfx_GFXBlendTarget_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXBlendTarget* cobj = JSB_ALLOC(cc::gfx::GFXBlendTarget);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXBlendTarget* cobj = JSB_ALLOC(cc::gfx::GFXBlendTarget);
        bool arg0;
        json->getProperty("blend", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg0);
            cobj->blend = arg0;
        }
        cc::gfx::GFXBlendFactor arg1;
        json->getProperty("blendSrc", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
            cobj->blendSrc = arg1;
        }
        cc::gfx::GFXBlendFactor arg2;
        json->getProperty("blendDst", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
            cobj->blendDst = arg2;
        }
        cc::gfx::GFXBlendOp arg3;
        json->getProperty("blendEq", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::GFXBlendOp)tmp; } while(false);
            cobj->blendEq = arg3;
        }
        cc::gfx::GFXBlendFactor arg4;
        json->getProperty("blendSrcAlpha", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
            cobj->blendSrcAlpha = arg4;
        }
        cc::gfx::GFXBlendFactor arg5;
        json->getProperty("blendDstAlpha", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
            cobj->blendDstAlpha = arg5;
        }
        cc::gfx::GFXBlendOp arg6;
        json->getProperty("blendAlphaEq", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cc::gfx::GFXBlendOp)tmp; } while(false);
            cobj->blendAlphaEq = arg6;
        }
        cc::gfx::GFXColorMask arg7;
        json->getProperty("blendColorMask", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cc::gfx::GFXColorMask)tmp; } while(false);
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
        cc::gfx::GFXBlendTarget* cobj = JSB_ALLOC(cc::gfx::GFXBlendTarget);
        bool arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->blend = arg0;
        }
        cc::gfx::GFXBlendFactor arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
            cobj->blendSrc = arg1;
        }
        cc::gfx::GFXBlendFactor arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
            cobj->blendDst = arg2;
        }
        cc::gfx::GFXBlendOp arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::GFXBlendOp)tmp; } while(false);
            cobj->blendEq = arg3;
        }
        cc::gfx::GFXBlendFactor arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
            cobj->blendSrcAlpha = arg4;
        }
        cc::gfx::GFXBlendFactor arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cc::gfx::GFXBlendFactor)tmp; } while(false);
            cobj->blendDstAlpha = arg5;
        }
        cc::gfx::GFXBlendOp arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cc::gfx::GFXBlendOp)tmp; } while(false);
            cobj->blendAlphaEq = arg6;
        }
        cc::gfx::GFXColorMask arg7;
        if (!args[7].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cc::gfx::GFXColorMask)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXBlendTarget_constructor, __jsb_cc_gfx_GFXBlendTarget_class, js_cc_gfx_GFXBlendTarget_finalize)




static bool js_cc_gfx_GFXBlendTarget_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXBlendTarget)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXBlendTarget* cobj = (cc::gfx::GFXBlendTarget*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXBlendTarget_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXBlendTarget_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXBlendTarget>(cls);

    __jsb_cc_gfx_GFXBlendTarget_proto = cls->getProto();
    __jsb_cc_gfx_GFXBlendTarget_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXBlendState_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXBlendState_class = nullptr;

static bool js_gfx_GFXBlendState_get_isA2C(se::State& s)
{
    cc::gfx::GFXBlendState* cobj = (cc::gfx::GFXBlendState*)s.nativeThisObject();
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
    cc::gfx::GFXBlendState* cobj = (cc::gfx::GFXBlendState*)s.nativeThisObject();
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
    cc::gfx::GFXBlendState* cobj = (cc::gfx::GFXBlendState*)s.nativeThisObject();
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
    cc::gfx::GFXBlendState* cobj = (cc::gfx::GFXBlendState*)s.nativeThisObject();
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
    cc::gfx::GFXBlendState* cobj = (cc::gfx::GFXBlendState*)s.nativeThisObject();
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
    cc::gfx::GFXBlendState* cobj = (cc::gfx::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXColor* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_blendColor : Error processing new value");
    cobj->blendColor = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendState_set_blendColor)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXBlendState_finalize)

static bool js_gfx_GFXBlendState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXBlendState* cobj = JSB_ALLOC(cc::gfx::GFXBlendState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXBlendState* cobj = JSB_ALLOC(cc::gfx::GFXBlendState);
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
        cc::gfx::GFXColor* arg2 = nullptr;
        json->getProperty("blendColor", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->blendColor = *arg2;
        }
        std::vector<cc::gfx::GFXBlendTarget> arg3;
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
        cc::gfx::GFXBlendState* cobj = JSB_ALLOC(cc::gfx::GFXBlendState);
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
        cc::gfx::GFXColor* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->blendColor = *arg2;
        }
        std::vector<cc::gfx::GFXBlendTarget> arg3;
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
SE_BIND_CTOR(js_gfx_GFXBlendState_constructor, __jsb_cc_gfx_GFXBlendState_class, js_cc_gfx_GFXBlendState_finalize)




static bool js_cc_gfx_GFXBlendState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXBlendState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXBlendState* cobj = (cc::gfx::GFXBlendState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXBlendState_finalize)

bool js_register_gfx_GFXBlendState(se::Object* obj)
{
    auto cls = se::Class::create("GFXBlendState", obj, nullptr, _SE(js_gfx_GFXBlendState_constructor));

    cls->defineProperty("isA2C", _SE(js_gfx_GFXBlendState_get_isA2C), _SE(js_gfx_GFXBlendState_set_isA2C));
    cls->defineProperty("isIndepend", _SE(js_gfx_GFXBlendState_get_isIndepend), _SE(js_gfx_GFXBlendState_set_isIndepend));
    cls->defineProperty("blendColor", _SE(js_gfx_GFXBlendState_get_blendColor), _SE(js_gfx_GFXBlendState_set_blendColor));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXBlendState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXBlendState>(cls);

    __jsb_cc_gfx_GFXBlendState_proto = cls->getProto();
    __jsb_cc_gfx_GFXBlendState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXPipelineStateInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXPipelineStateInfo_class = nullptr;

static bool js_gfx_GFXPipelineStateInfo_get_primitive(se::State& s)
{
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
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
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXPrimitiveMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXPrimitiveMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_primitive : Error processing new value");
    cobj->primitive = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_primitive)

static bool js_gfx_GFXPipelineStateInfo_get_shader(se::State& s)
{
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
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
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXShader* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_shader : Error processing new value");
    cobj->shader = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_shader)

static bool js_gfx_GFXPipelineStateInfo_get_inputState(se::State& s)
{
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
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
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_inputState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXInputState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_inputState : Error processing new value");
    cobj->inputState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_inputState)

static bool js_gfx_GFXPipelineStateInfo_get_rasterizerState(se::State& s)
{
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
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
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXRasterizerState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_rasterizerState : Error processing new value");
    cobj->rasterizerState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_rasterizerState)

static bool js_gfx_GFXPipelineStateInfo_get_depthStencilState(se::State& s)
{
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
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
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXDepthStencilState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_depthStencilState : Error processing new value");
    cobj->depthStencilState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_depthStencilState)

static bool js_gfx_GFXPipelineStateInfo_get_blendState(se::State& s)
{
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
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
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXBlendState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_blendState : Error processing new value");
    cobj->blendState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_blendState)

static bool js_gfx_GFXPipelineStateInfo_get_dynamicStates(se::State& s)
{
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->dynamicStates, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_dynamicStates)

static bool js_gfx_GFXPipelineStateInfo_set_dynamicStates(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::GFXDynamicState> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_dynamicStates : Error processing new value");
    cobj->dynamicStates = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_dynamicStates)

static bool js_gfx_GFXPipelineStateInfo_get_layout(se::State& s)
{
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
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
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXPipelineLayout* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_layout : Error processing new value");
    cobj->layout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_layout)

static bool js_gfx_GFXPipelineStateInfo_get_renderPass(se::State& s)
{
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
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
    cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXRenderPass* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_renderPass : Error processing new value");
    cobj->renderPass = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_renderPass)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXPipelineStateInfo_finalize)

static bool js_gfx_GFXPipelineStateInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXPipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::GFXPipelineStateInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXPipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::GFXPipelineStateInfo);
        cc::gfx::GFXPrimitiveMode arg0;
        json->getProperty("primitive", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::GFXPrimitiveMode)tmp; } while(false);
            cobj->primitive = arg0;
        }
        cc::gfx::GFXShader* arg1 = nullptr;
        json->getProperty("shader", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg1);
            cobj->shader = arg1;
        }
        cc::gfx::GFXInputState* arg2 = nullptr;
        json->getProperty("inputState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->inputState = *arg2;
        }
        cc::gfx::GFXRasterizerState* arg3 = nullptr;
        json->getProperty("rasterizerState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->rasterizerState = *arg3;
        }
        cc::gfx::GFXDepthStencilState* arg4 = nullptr;
        json->getProperty("depthStencilState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg4);
            cobj->depthStencilState = *arg4;
        }
        cc::gfx::GFXBlendState* arg5 = nullptr;
        json->getProperty("blendState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg5);
            cobj->blendState = *arg5;
        }
        std::vector<cc::gfx::GFXDynamicState> arg6;
        json->getProperty("dynamicStates", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg6);
            cobj->dynamicStates = arg6;
        }
        cc::gfx::GFXPipelineLayout* arg7 = nullptr;
        json->getProperty("layout", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg7);
            cobj->layout = arg7;
        }
        cc::gfx::GFXRenderPass* arg8 = nullptr;
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
        cc::gfx::GFXPipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::GFXPipelineStateInfo);
        cc::gfx::GFXPrimitiveMode arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXPrimitiveMode)tmp; } while(false);
            cobj->primitive = arg0;
        }
        cc::gfx::GFXShader* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_native_ptr(args[1], &arg1);
            cobj->shader = arg1;
        }
        cc::gfx::GFXInputState* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->inputState = *arg2;
        }
        cc::gfx::GFXRasterizerState* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_reference(args[3], &arg3);
            cobj->rasterizerState = *arg3;
        }
        cc::gfx::GFXDepthStencilState* arg4 = nullptr;
        if (!args[4].isUndefined()) {
            ok &= seval_to_reference(args[4], &arg4);
            cobj->depthStencilState = *arg4;
        }
        cc::gfx::GFXBlendState* arg5 = nullptr;
        if (!args[5].isUndefined()) {
            ok &= seval_to_reference(args[5], &arg5);
            cobj->blendState = *arg5;
        }
        std::vector<cc::gfx::GFXDynamicState> arg6;
        if (!args[6].isUndefined()) {
            ok &= seval_to_std_vector(args[6], &arg6);
            cobj->dynamicStates = arg6;
        }
        cc::gfx::GFXPipelineLayout* arg7 = nullptr;
        if (!args[7].isUndefined()) {
            ok &= seval_to_native_ptr(args[7], &arg7);
            cobj->layout = arg7;
        }
        cc::gfx::GFXRenderPass* arg8 = nullptr;
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
SE_BIND_CTOR(js_gfx_GFXPipelineStateInfo_constructor, __jsb_cc_gfx_GFXPipelineStateInfo_class, js_cc_gfx_GFXPipelineStateInfo_finalize)




static bool js_cc_gfx_GFXPipelineStateInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXPipelineStateInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXPipelineStateInfo* cobj = (cc::gfx::GFXPipelineStateInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXPipelineStateInfo_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXPipelineStateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXPipelineStateInfo>(cls);

    __jsb_cc_gfx_GFXPipelineStateInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXPipelineStateInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXCommandBufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXCommandBufferInfo_class = nullptr;

static bool js_gfx_GFXCommandBufferInfo_get_allocator(se::State& s)
{
    cc::gfx::GFXCommandBufferInfo* cobj = (cc::gfx::GFXCommandBufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXCommandBufferInfo* cobj = (cc::gfx::GFXCommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBufferInfo_set_allocator : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXCommandAllocator* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBufferInfo_set_allocator : Error processing new value");
    cobj->allocator = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXCommandBufferInfo_set_allocator)

static bool js_gfx_GFXCommandBufferInfo_get_type(se::State& s)
{
    cc::gfx::GFXCommandBufferInfo* cobj = (cc::gfx::GFXCommandBufferInfo*)s.nativeThisObject();
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
    cc::gfx::GFXCommandBufferInfo* cobj = (cc::gfx::GFXCommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBufferInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXCommandBufferType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXCommandBufferType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBufferInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXCommandBufferInfo_set_type)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXCommandBufferInfo_finalize)

static bool js_gfx_GFXCommandBufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXCommandBufferInfo* cobj = JSB_ALLOC(cc::gfx::GFXCommandBufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXCommandBufferInfo* cobj = JSB_ALLOC(cc::gfx::GFXCommandBufferInfo);
        cc::gfx::GFXCommandAllocator* arg0 = nullptr;
        json->getProperty("allocator", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->allocator = arg0;
        }
        cc::gfx::GFXCommandBufferType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::GFXCommandBufferType)tmp; } while(false);
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
        cc::gfx::GFXCommandBufferInfo* cobj = JSB_ALLOC(cc::gfx::GFXCommandBufferInfo);
        cc::gfx::GFXCommandAllocator* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->allocator = arg0;
        }
        cc::gfx::GFXCommandBufferType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::GFXCommandBufferType)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXCommandBufferInfo_constructor, __jsb_cc_gfx_GFXCommandBufferInfo_class, js_cc_gfx_GFXCommandBufferInfo_finalize)




static bool js_cc_gfx_GFXCommandBufferInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXCommandBufferInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXCommandBufferInfo* cobj = (cc::gfx::GFXCommandBufferInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXCommandBufferInfo_finalize)

bool js_register_gfx_GFXCommandBufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXCommandBufferInfo", obj, nullptr, _SE(js_gfx_GFXCommandBufferInfo_constructor));

    cls->defineProperty("allocator", _SE(js_gfx_GFXCommandBufferInfo_get_allocator), _SE(js_gfx_GFXCommandBufferInfo_set_allocator));
    cls->defineProperty("type", _SE(js_gfx_GFXCommandBufferInfo_get_type), _SE(js_gfx_GFXCommandBufferInfo_set_type));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXCommandBufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXCommandBufferInfo>(cls);

    __jsb_cc_gfx_GFXCommandBufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXCommandBufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXQueueInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXQueueInfo_class = nullptr;

static bool js_gfx_GFXQueueInfo_get_type(se::State& s)
{
    cc::gfx::GFXQueueInfo* cobj = (cc::gfx::GFXQueueInfo*)s.nativeThisObject();
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
    cc::gfx::GFXQueueInfo* cobj = (cc::gfx::GFXQueueInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueueInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXQueueType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXQueueType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXQueueInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXQueueInfo_set_type)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXQueueInfo_finalize)

static bool js_gfx_GFXQueueInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXQueueInfo* cobj = JSB_ALLOC(cc::gfx::GFXQueueInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cc::gfx::GFXQueueInfo* cobj = JSB_ALLOC(cc::gfx::GFXQueueInfo);
        cc::gfx::GFXQueueType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXQueueType)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXQueueInfo_constructor, __jsb_cc_gfx_GFXQueueInfo_class, js_cc_gfx_GFXQueueInfo_finalize)




static bool js_cc_gfx_GFXQueueInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXQueueInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXQueueInfo* cobj = (cc::gfx::GFXQueueInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXQueueInfo_finalize)

bool js_register_gfx_GFXQueueInfo(se::Object* obj)
{
    auto cls = se::Class::create("GFXQueueInfo", obj, nullptr, _SE(js_gfx_GFXQueueInfo_constructor));

    cls->defineProperty("type", _SE(js_gfx_GFXQueueInfo_get_type), _SE(js_gfx_GFXQueueInfo_set_type));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXQueueInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXQueueInfo>(cls);

    __jsb_cc_gfx_GFXQueueInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXQueueInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXFormatInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXFormatInfo_class = nullptr;

static bool js_gfx_GFXFormatInfo_get_name(se::State& s)
{
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_name)

static bool js_gfx_GFXFormatInfo_get_size(se::State& s)
{
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::GFXFormatType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFormatType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_type)

static bool js_gfx_GFXFormatInfo_get_hasAlpha(se::State& s)
{
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
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
    cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_isCompressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_isCompressed : Error processing new value");
    cobj->isCompressed = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_isCompressed)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXFormatInfo_finalize)

static bool js_gfx_GFXFormatInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXFormatInfo* cobj = JSB_ALLOC(cc::gfx::GFXFormatInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXFormatInfo* cobj = JSB_ALLOC(cc::gfx::GFXFormatInfo);
        cc::gfx::String arg0;
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
        cc::gfx::GFXFormatType arg3;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::GFXFormatType)tmp; } while(false);
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
        cc::gfx::GFXFormatInfo* cobj = JSB_ALLOC(cc::gfx::GFXFormatInfo);
        cc::gfx::String arg0;
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
        cc::gfx::GFXFormatType arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::GFXFormatType)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_GFXFormatInfo_constructor, __jsb_cc_gfx_GFXFormatInfo_class, js_cc_gfx_GFXFormatInfo_finalize)




static bool js_cc_gfx_GFXFormatInfo_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXFormatInfo)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXFormatInfo* cobj = (cc::gfx::GFXFormatInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXFormatInfo_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXFormatInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXFormatInfo>(cls);

    __jsb_cc_gfx_GFXFormatInfo_proto = cls->getProto();
    __jsb_cc_gfx_GFXFormatInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXMemoryStatus_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXMemoryStatus_class = nullptr;

static bool js_gfx_GFXMemoryStatus_get_bufferSize(se::State& s)
{
    cc::gfx::GFXMemoryStatus* cobj = (cc::gfx::GFXMemoryStatus*)s.nativeThisObject();
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
    cc::gfx::GFXMemoryStatus* cobj = (cc::gfx::GFXMemoryStatus*)s.nativeThisObject();
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
    cc::gfx::GFXMemoryStatus* cobj = (cc::gfx::GFXMemoryStatus*)s.nativeThisObject();
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
    cc::gfx::GFXMemoryStatus* cobj = (cc::gfx::GFXMemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXMemoryStatus_set_textureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXMemoryStatus_set_textureSize : Error processing new value");
    cobj->textureSize = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXMemoryStatus_set_textureSize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXMemoryStatus_finalize)

static bool js_gfx_GFXMemoryStatus_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::GFXMemoryStatus* cobj = JSB_ALLOC(cc::gfx::GFXMemoryStatus);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GFXMemoryStatus* cobj = JSB_ALLOC(cc::gfx::GFXMemoryStatus);
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
        cc::gfx::GFXMemoryStatus* cobj = JSB_ALLOC(cc::gfx::GFXMemoryStatus);
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
SE_BIND_CTOR(js_gfx_GFXMemoryStatus_constructor, __jsb_cc_gfx_GFXMemoryStatus_class, js_cc_gfx_GFXMemoryStatus_finalize)




static bool js_cc_gfx_GFXMemoryStatus_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXMemoryStatus)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXMemoryStatus* cobj = (cc::gfx::GFXMemoryStatus*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXMemoryStatus_finalize)

bool js_register_gfx_GFXMemoryStatus(se::Object* obj)
{
    auto cls = se::Class::create("GFXMemoryStatus", obj, nullptr, _SE(js_gfx_GFXMemoryStatus_constructor));

    cls->defineProperty("bufferSize", _SE(js_gfx_GFXMemoryStatus_get_bufferSize), _SE(js_gfx_GFXMemoryStatus_set_bufferSize));
    cls->defineProperty("textureSize", _SE(js_gfx_GFXMemoryStatus_get_textureSize), _SE(js_gfx_GFXMemoryStatus_set_textureSize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXMemoryStatus_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXMemoryStatus>(cls);

    __jsb_cc_gfx_GFXMemoryStatus_proto = cls->getProto();
    __jsb_cc_gfx_GFXMemoryStatus_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXObject_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXObject_class = nullptr;

static bool js_gfx_GFXObject_getType(se::State& s)
{
    cc::gfx::GFXObject* cobj = (cc::gfx::GFXObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXObject_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXObject_getType)

static bool js_gfx_GFXObject_getStatus(se::State& s)
{
    cc::gfx::GFXObject* cobj = (cc::gfx::GFXObject*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXObject_getStatus : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getStatus();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_getStatus : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXObject_getStatus)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXObject_finalize)

static bool js_gfx_GFXObject_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::gfx::GFXObjectType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXObjectType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_constructor : Error processing arguments");
    cc::gfx::GFXObject* cobj = JSB_ALLOC(cc::gfx::GFXObject, arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXObject_constructor, __jsb_cc_gfx_GFXObject_class, js_cc_gfx_GFXObject_finalize)




static bool js_cc_gfx_GFXObject_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXObject)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXObject* cobj = (cc::gfx::GFXObject*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXObject_finalize)

bool js_register_gfx_GFXObject(se::Object* obj)
{
    auto cls = se::Class::create("GFXObject", obj, nullptr, _SE(js_gfx_GFXObject_constructor));

    cls->defineProperty("status", _SE(js_gfx_GFXObject_getStatus), nullptr);
    cls->defineProperty("gfxType", _SE(js_gfx_GFXObject_getType), nullptr);
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXObject_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXObject>(cls);

    __jsb_cc_gfx_GFXObject_proto = cls->getProto();
    __jsb_cc_gfx_GFXObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXDevice_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXDevice_class = nullptr;

static bool js_gfx_GFXDevice_getMaxUniformBlockSize(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMaxUniformBlockSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxUniformBlockSize();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMaxUniformBlockSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMaxUniformBlockSize)

static bool js_gfx_GFXDevice_getMaxVertexTextureUnits(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMaxVertexTextureUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxVertexTextureUnits();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMaxVertexTextureUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMaxVertexTextureUnits)

static bool js_gfx_GFXDevice_getProjectionSignY(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getProjectionSignY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getProjectionSignY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getProjectionSignY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getProjectionSignY)

static bool js_gfx_GFXDevice_getMaxVertexUniformVectors(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMaxVertexUniformVectors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxVertexUniformVectors();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMaxVertexUniformVectors : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMaxVertexUniformVectors)

static bool js_gfx_GFXDevice_getGfxAPI(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getGfxAPI : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getGfxAPI();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getGfxAPI : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getGfxAPI)

static bool js_gfx_GFXDevice_getVendor(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getVendor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::String& result = cobj->getVendor();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getVendor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getVendor)

static bool js_gfx_GFXDevice_hasFeature(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_hasFeature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXFeature arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXFeature)tmp; } while(false);
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

static bool js_gfx_GFXDevice_createFence(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createFence : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXFenceInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createFence : Error processing arguments");
        cc::gfx::GFXFence* result = cobj->createFence(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createFence : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createFence)

static bool js_gfx_GFXDevice_getContext(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getContext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXContext* result = cobj->getContext();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getContext : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getContext)

static bool js_gfx_GFXDevice_getWidth(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getWidth)

static bool js_gfx_GFXDevice_setReverseCW(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_setReverseCW : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_setReverseCW : Error processing arguments");
        cobj->setReverseCW(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_GFXDevice_setReverseCW)

static bool js_gfx_GFXDevice_createCommandAllocator(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createCommandAllocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXCommandAllocatorInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createCommandAllocator : Error processing arguments");
        cc::gfx::GFXCommandAllocator* result = cobj->createCommandAllocator(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createCommandAllocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createCommandAllocator)

static bool js_gfx_GFXDevice_getQueue(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXQueue* result = cobj->getQueue();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getQueue)

static bool js_gfx_GFXDevice_getMaxVertexAttributes(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMaxVertexAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxVertexAttributes();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMaxVertexAttributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMaxVertexAttributes)

static bool js_gfx_GFXDevice_getDepthStencilFormat(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getDepthStencilFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDepthStencilFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getDepthStencilFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getDepthStencilFormat)

static bool js_gfx_GFXDevice_getNumTris(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getNumTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumTris();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getNumTris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getNumTris)

static bool js_gfx_GFXDevice_getRenderer(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::String& result = cobj->getRenderer();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getRenderer)

static bool js_gfx_GFXDevice_getStencilBits(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getStencilBits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getStencilBits();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getStencilBits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getStencilBits)

static bool js_gfx_GFXDevice_getDeviceName(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getDeviceName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::String& result = cobj->getDeviceName();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getDeviceName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getDeviceName)

static bool js_gfx_GFXDevice_getNumInstances(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getNumInstances : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumInstances();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getNumInstances : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getNumInstances)

static bool js_gfx_GFXDevice_getHeight(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getHeight)

static bool js_gfx_GFXDevice_getMaxFragmentUniformVectors(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMaxFragmentUniformVectors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxFragmentUniformVectors();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMaxFragmentUniformVectors : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMaxFragmentUniformVectors)

static bool js_gfx_GFXDevice_createPipelineState(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXPipelineStateInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createPipelineState : Error processing arguments");
        cc::gfx::GFXPipelineState* result = cobj->createPipelineState(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createPipelineState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createPipelineState)

static bool js_gfx_GFXDevice_createCommandBuffer(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXCommandBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createCommandBuffer : Error processing arguments");
        cc::gfx::GFXCommandBuffer* result = cobj->createCommandBuffer(*arg0);
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
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
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

static bool js_gfx_GFXDevice_destroy(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
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

static bool js_gfx_GFXDevice_getColorFormat(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getColorFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getColorFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getColorFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getColorFormat)

static bool js_gfx_GFXDevice_createFramebuffer(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXFramebufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createFramebuffer : Error processing arguments");
        cc::gfx::GFXFramebuffer* result = cobj->createFramebuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createFramebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createFramebuffer)

static bool js_gfx_GFXDevice_getMaxTextureSize(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMaxTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxTextureSize();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMaxTextureSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMaxTextureSize)

static bool js_gfx_GFXDevice_createRenderPass(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXRenderPassInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createRenderPass : Error processing arguments");
        cc::gfx::GFXRenderPass* result = cobj->createRenderPass(*arg0);
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
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXPipelineLayoutInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createPipelineLayout : Error processing arguments");
        cc::gfx::GFXPipelineLayout* result = cobj->createPipelineLayout(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createPipelineLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createPipelineLayout)

static bool js_gfx_GFXDevice_acquire(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_acquire : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->acquire();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_acquire)

static bool js_gfx_GFXDevice_getMaxCubeMapTextureSize(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMaxCubeMapTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxCubeMapTextureSize();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMaxCubeMapTextureSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMaxCubeMapTextureSize)

static bool js_gfx_GFXDevice_getShaderIdGen(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getShaderIdGen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getShaderIdGen();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getShaderIdGen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getShaderIdGen)

static bool js_gfx_GFXDevice_getMaxUniformBufferBindings(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMaxUniformBufferBindings : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxUniformBufferBindings();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMaxUniformBufferBindings : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMaxUniformBufferBindings)

static bool js_gfx_GFXDevice_createShader(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXShaderInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createShader : Error processing arguments");
        cc::gfx::GFXShader* result = cobj->createShader(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createShader)

static bool js_gfx_GFXDevice_createInputAssembler(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXInputAssemblerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createInputAssembler : Error processing arguments");
        cc::gfx::GFXInputAssembler* result = cobj->createInputAssembler(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createInputAssembler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createInputAssembler)

static bool js_gfx_GFXDevice_defineMacro(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_defineMacro : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::gfx::String arg0;
        cc::gfx::String arg1;
        arg0 = args[0].toStringForce().c_str();
        arg1 = args[1].toStringForce().c_str();
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_defineMacro : Error processing arguments");
        cobj->defineMacro(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_defineMacro)

static bool js_gfx_GFXDevice_createSampler(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXSamplerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createSampler : Error processing arguments");
        cc::gfx::GFXSampler* result = cobj->createSampler(*arg0);
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
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createBuffer : Error processing arguments");
        cc::gfx::GFXBuffer* result = cobj->createBuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createBuffer)

static bool js_gfx_GFXDevice_getNativeHeight(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getNativeHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNativeHeight();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getNativeHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getNativeHeight)

static bool js_gfx_GFXDevice_initialize(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXDeviceInfo* arg0 = nullptr;
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
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
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

static bool js_gfx_GFXDevice_createQueue(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXQueueInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createQueue : Error processing arguments");
        cc::gfx::GFXQueue* result = cobj->createQueue(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createQueue)

static bool js_gfx_GFXDevice_getDepthBits(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getDepthBits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getDepthBits();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getDepthBits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getDepthBits)

static bool js_gfx_GFXDevice_getMinClipZ(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMinClipZ : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMinClipZ();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMinClipZ : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMinClipZ)

static bool js_gfx_GFXDevice_getMemoryStatus(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMemoryStatus : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXMemoryStatus& result = cobj->getMemoryStatus();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMemoryStatus : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMemoryStatus)

static bool js_gfx_GFXDevice_getMaxTextureUnits(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getMaxTextureUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxTextureUnits();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getMaxTextureUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getMaxTextureUnits)

static bool js_gfx_GFXDevice_getReverseCW(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getReverseCW : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getReverseCW();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getReverseCW : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getReverseCW)

static bool js_gfx_GFXDevice_getCommandAllocator(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getCommandAllocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXCommandAllocator* result = cobj->getCommandAllocator();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getCommandAllocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getCommandAllocator)

static bool js_gfx_GFXDevice_getNumDrawCalls(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getNumDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumDrawCalls();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getNumDrawCalls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getNumDrawCalls)

static bool js_gfx_GFXDevice_getNativeWidth(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_getNativeWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNativeWidth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_getNativeWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXDevice_getNativeWidth)

static bool js_gfx_GFXDevice_createBindingLayout(se::State& s)
{
    cc::gfx::GFXDevice* cobj = (cc::gfx::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_createBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXBindingLayoutInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createBindingLayout : Error processing arguments");
        cc::gfx::GFXBindingLayout* result = cobj->createBindingLayout(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_createBindingLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_createBindingLayout)




bool js_register_gfx_GFXDevice(se::Object* obj)
{
    auto cls = se::Class::create("GFXDevice", obj, nullptr, nullptr);

    cls->defineProperty("deviceName", _SE(js_gfx_GFXDevice_getDeviceName), nullptr);
    cls->defineProperty("numInstances", _SE(js_gfx_GFXDevice_getNumInstances), nullptr);
    cls->defineProperty("maxTextureUnits", _SE(js_gfx_GFXDevice_getMaxTextureUnits), nullptr);
    cls->defineProperty("projectionSignY", _SE(js_gfx_GFXDevice_getProjectionSignY), nullptr);
    cls->defineProperty("height", _SE(js_gfx_GFXDevice_getHeight), nullptr);
    cls->defineProperty("shaderIdGen", _SE(js_gfx_GFXDevice_getShaderIdGen), nullptr);
    cls->defineProperty("renderer", _SE(js_gfx_GFXDevice_getRenderer), nullptr);
    cls->defineProperty("maxUniformBufferBindings", _SE(js_gfx_GFXDevice_getMaxUniformBufferBindings), nullptr);
    cls->defineProperty("vendor", _SE(js_gfx_GFXDevice_getVendor), nullptr);
    cls->defineProperty("depthBits", _SE(js_gfx_GFXDevice_getDepthBits), nullptr);
    cls->defineProperty("reverseCW", _SE(js_gfx_GFXDevice_getReverseCW), _SE(js_gfx_GFXDevice_setReverseCW));
    cls->defineProperty("maxFragmentUniformVectors", _SE(js_gfx_GFXDevice_getMaxFragmentUniformVectors), nullptr);
    cls->defineProperty("maxVertexAttributes", _SE(js_gfx_GFXDevice_getMaxVertexAttributes), nullptr);
    cls->defineProperty("width", _SE(js_gfx_GFXDevice_getWidth), nullptr);
    cls->defineProperty("commandAllocator", _SE(js_gfx_GFXDevice_getCommandAllocator), nullptr);
    cls->defineProperty("maxVertexUniformVectors", _SE(js_gfx_GFXDevice_getMaxVertexUniformVectors), nullptr);
    cls->defineProperty("maxCubeMapTextureSize", _SE(js_gfx_GFXDevice_getMaxCubeMapTextureSize), nullptr);
    cls->defineProperty("maxVertexTextureUnits", _SE(js_gfx_GFXDevice_getMaxVertexTextureUnits), nullptr);
    cls->defineProperty("nativeWidth", _SE(js_gfx_GFXDevice_getNativeWidth), nullptr);
    cls->defineProperty("numDrawCalls", _SE(js_gfx_GFXDevice_getNumDrawCalls), nullptr);
    cls->defineProperty("memoryStatus", _SE(js_gfx_GFXDevice_getMemoryStatus), nullptr);
    cls->defineProperty("gfxAPI", _SE(js_gfx_GFXDevice_getGfxAPI), nullptr);
    cls->defineProperty("maxUniformBlockSize", _SE(js_gfx_GFXDevice_getMaxUniformBlockSize), nullptr);
    cls->defineProperty("minClipZ", _SE(js_gfx_GFXDevice_getMinClipZ), nullptr);
    cls->defineProperty("maxTextureSize", _SE(js_gfx_GFXDevice_getMaxTextureSize), nullptr);
    cls->defineProperty("nativeHeight", _SE(js_gfx_GFXDevice_getNativeHeight), nullptr);
    cls->defineProperty("depthStencilFormat", _SE(js_gfx_GFXDevice_getDepthStencilFormat), nullptr);
    cls->defineProperty("numTris", _SE(js_gfx_GFXDevice_getNumTris), nullptr);
    cls->defineProperty("stencilBits", _SE(js_gfx_GFXDevice_getStencilBits), nullptr);
    cls->defineProperty("queue", _SE(js_gfx_GFXDevice_getQueue), nullptr);
    cls->defineProperty("context", _SE(js_gfx_GFXDevice_getContext), nullptr);
    cls->defineProperty("colorFormat", _SE(js_gfx_GFXDevice_getColorFormat), nullptr);
    cls->defineFunction("hasFeature", _SE(js_gfx_GFXDevice_hasFeature));
    cls->defineFunction("createFence", _SE(js_gfx_GFXDevice_createFence));
    cls->defineFunction("createCommandAllocator", _SE(js_gfx_GFXDevice_createCommandAllocator));
    cls->defineFunction("createPipelineState", _SE(js_gfx_GFXDevice_createPipelineState));
    cls->defineFunction("createCommandBuffer", _SE(js_gfx_GFXDevice_createCommandBuffer));
    cls->defineFunction("present", _SE(js_gfx_GFXDevice_present));
    cls->defineFunction("destroy", _SE(js_gfx_GFXDevice_destroy));
    cls->defineFunction("createFramebuffer", _SE(js_gfx_GFXDevice_createFramebuffer));
    cls->defineFunction("createRenderPass", _SE(js_gfx_GFXDevice_createRenderPass));
    cls->defineFunction("createPipelineLayout", _SE(js_gfx_GFXDevice_createPipelineLayout));
    cls->defineFunction("acquire", _SE(js_gfx_GFXDevice_acquire));
    cls->defineFunction("createShader", _SE(js_gfx_GFXDevice_createShader));
    cls->defineFunction("createInputAssembler", _SE(js_gfx_GFXDevice_createInputAssembler));
    cls->defineFunction("defineMacro", _SE(js_gfx_GFXDevice_defineMacro));
    cls->defineFunction("createSampler", _SE(js_gfx_GFXDevice_createSampler));
    cls->defineFunction("createBuffer", _SE(js_gfx_GFXDevice_createBuffer));
    cls->defineFunction("initialize", _SE(js_gfx_GFXDevice_initialize));
    cls->defineFunction("resize", _SE(js_gfx_GFXDevice_resize));
    cls->defineFunction("createQueue", _SE(js_gfx_GFXDevice_createQueue));
    cls->defineFunction("createBindingLayout", _SE(js_gfx_GFXDevice_createBindingLayout));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXDevice>(cls);

    __jsb_cc_gfx_GFXDevice_proto = cls->getProto();
    __jsb_cc_gfx_GFXDevice_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXBuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXBuffer_class = nullptr;

static bool js_gfx_GFXBuffer_getBufferView(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_getBufferView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->getBufferView();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_getBufferView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_getBufferView)

static bool js_gfx_GFXBuffer_getUsage(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_getUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getUsage();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_getUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_getUsage)

static bool js_gfx_GFXBuffer_getMemUsage(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_getMemUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMemUsage();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_getMemUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_getMemUsage)

static bool js_gfx_GFXBuffer_getSize(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getSize();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_getSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_getSize)

static bool js_gfx_GFXBuffer_getCount(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_getCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_getCount)

static bool js_gfx_GFXBuffer_initialize(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXBufferInfo* arg0 = nullptr;
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
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
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

static bool js_gfx_GFXBuffer_getStride(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_getStride : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getStride();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_getStride : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_getStride)

static bool js_gfx_GFXBuffer_getDevice(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_getDevice)

static bool js_gfx_GFXBuffer_getFlags(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_getFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFlags();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_getFlags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBuffer_getFlags)

static bool js_gfx_GFXBuffer_resize(se::State& s)
{
    cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXBuffer_finalize)

static bool js_gfx_GFXBuffer_constructor(se::State& s)
{
    //#3 cc::gfx::GFXBuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXBuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBuffer_constructor, __jsb_cc_gfx_GFXBuffer_class, js_cc_gfx_GFXBuffer_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXBuffer* cobj = (cc::gfx::GFXBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXBuffer_finalize)

bool js_register_gfx_GFXBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXBuffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXBuffer_constructor));

    cls->defineProperty("count", _SE(js_gfx_GFXBuffer_getCount), nullptr);
    cls->defineProperty("memUsage", _SE(js_gfx_GFXBuffer_getMemUsage), nullptr);
    cls->defineProperty("stride", _SE(js_gfx_GFXBuffer_getStride), nullptr);
    cls->defineProperty("bufferView", _SE(js_gfx_GFXBuffer_getBufferView), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_GFXBuffer_getUsage), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_GFXBuffer_getFlags), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXBuffer_getDevice), nullptr);
    cls->defineProperty("size", _SE(js_gfx_GFXBuffer_getSize), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXBuffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXBuffer_destroy));
    cls->defineFunction("resize", _SE(js_gfx_GFXBuffer_resize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXBuffer>(cls);

    __jsb_cc_gfx_GFXBuffer_proto = cls->getProto();
    __jsb_cc_gfx_GFXBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXTexture_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXTexture_class = nullptr;

static bool js_gfx_GFXTexture_getSize(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getSize();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getSize)

static bool js_gfx_GFXTexture_getDepth(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getDepth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getDepth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getDepth)

static bool js_gfx_GFXTexture_getType(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getType)

static bool js_gfx_GFXTexture_getHeight(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getHeight)

static bool js_gfx_GFXTexture_getBuffer(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->getBuffer();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getBuffer)

static bool js_gfx_GFXTexture_getWidth(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getWidth)

static bool js_gfx_GFXTexture_getMipLevel(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getMipLevel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMipLevel();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getMipLevel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getMipLevel)

static bool js_gfx_GFXTexture_getArrayLayer(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getArrayLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getArrayLayer();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getArrayLayer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getArrayLayer)

static bool js_gfx_GFXTexture_getUsage(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getUsage();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getUsage)

static bool js_gfx_GFXTexture_destroy(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
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

static bool js_gfx_GFXTexture_getSamples(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getSamples : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getSamples();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getSamples : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getSamples)

static bool js_gfx_GFXTexture_getFormat(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getFormat)

static bool js_gfx_GFXTexture_getFlags(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_getFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFlags();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_getFlags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXTexture_getFlags)

static bool js_gfx_GFXTexture_resize(se::State& s)
{
    cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXTexture_finalize)

static bool js_gfx_GFXTexture_constructor(se::State& s)
{
    //#3 cc::gfx::GFXTexture: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXTexture constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXTexture_constructor, __jsb_cc_gfx_GFXTexture_class, js_cc_gfx_GFXTexture_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXTexture_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXTexture)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXTexture* cobj = (cc::gfx::GFXTexture*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXTexture_finalize)

bool js_register_gfx_GFXTexture(se::Object* obj)
{
    auto cls = se::Class::create("GFXTexture", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXTexture_constructor));

    cls->defineProperty("arrayLayer", _SE(js_gfx_GFXTexture_getArrayLayer), nullptr);
    cls->defineProperty("format", _SE(js_gfx_GFXTexture_getFormat), nullptr);
    cls->defineProperty("buffer", _SE(js_gfx_GFXTexture_getBuffer), nullptr);
    cls->defineProperty("mipLevel", _SE(js_gfx_GFXTexture_getMipLevel), nullptr);
    cls->defineProperty("height", _SE(js_gfx_GFXTexture_getHeight), nullptr);
    cls->defineProperty("width", _SE(js_gfx_GFXTexture_getWidth), nullptr);
    cls->defineProperty("depth", _SE(js_gfx_GFXTexture_getDepth), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_GFXTexture_getFlags), nullptr);
    cls->defineProperty("samples", _SE(js_gfx_GFXTexture_getSamples), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_GFXTexture_getUsage), nullptr);
    cls->defineProperty("type", _SE(js_gfx_GFXTexture_getType), nullptr);
    cls->defineProperty("size", _SE(js_gfx_GFXTexture_getSize), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_GFXTexture_destroy));
    cls->defineFunction("resize", _SE(js_gfx_GFXTexture_resize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXTexture>(cls);

    __jsb_cc_gfx_GFXTexture_proto = cls->getProto();
    __jsb_cc_gfx_GFXTexture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXSampler_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXSampler_class = nullptr;

static bool js_gfx_GFXSampler_getAddressW(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getAddressW : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAddressW();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getAddressW : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getAddressW)

static bool js_gfx_GFXSampler_getMaxAnisotropy(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getMaxAnisotropy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMaxAnisotropy();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getMaxAnisotropy : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getMaxAnisotropy)

static bool js_gfx_GFXSampler_getMipLODBias(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getMipLODBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMipLODBias();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getMipLODBias : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getMipLODBias)

static bool js_gfx_GFXSampler_getCmpFunc(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getCmpFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getCmpFunc();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getCmpFunc : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getCmpFunc)

static bool js_gfx_GFXSampler_getBorderColor(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getBorderColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::GFXColor& result = cobj->getBorderColor();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getBorderColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getBorderColor)

static bool js_gfx_GFXSampler_getName(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::String& result = cobj->getName();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getName)

static bool js_gfx_GFXSampler_getMipFilter(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getMipFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMipFilter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getMipFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getMipFilter)

static bool js_gfx_GFXSampler_getAddressV(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getAddressV : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAddressV();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getAddressV : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getAddressV)

static bool js_gfx_GFXSampler_getAddressU(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getAddressU : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAddressU();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getAddressU : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getAddressU)

static bool js_gfx_GFXSampler_getMagFilter(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getMagFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMagFilter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getMagFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getMagFilter)

static bool js_gfx_GFXSampler_initialize(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXSamplerInfo* arg0 = nullptr;
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
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
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

static bool js_gfx_GFXSampler_getDevice(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getDevice)

static bool js_gfx_GFXSampler_getMinLOD(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getMinLOD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMinLOD();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getMinLOD : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getMinLOD)

static bool js_gfx_GFXSampler_getMinFilter(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getMinFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMinFilter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getMinFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getMinFilter)

static bool js_gfx_GFXSampler_getMaxLOD(se::State& s)
{
    cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_getMaxLOD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMaxLOD();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_getMaxLOD : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXSampler_getMaxLOD)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXSampler_finalize)

static bool js_gfx_GFXSampler_constructor(se::State& s)
{
    //#3 cc::gfx::GFXSampler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXSampler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXSampler_constructor, __jsb_cc_gfx_GFXSampler_class, js_cc_gfx_GFXSampler_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXSampler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXSampler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXSampler* cobj = (cc::gfx::GFXSampler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXSampler_finalize)

bool js_register_gfx_GFXSampler(se::Object* obj)
{
    auto cls = se::Class::create("GFXSampler", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXSampler_constructor));

    cls->defineProperty("borderColor", _SE(js_gfx_GFXSampler_getBorderColor), nullptr);
    cls->defineProperty("mipFilter", _SE(js_gfx_GFXSampler_getMipFilter), nullptr);
    cls->defineProperty("minFilter", _SE(js_gfx_GFXSampler_getMinFilter), nullptr);
    cls->defineProperty("name", _SE(js_gfx_GFXSampler_getName), nullptr);
    cls->defineProperty("maxLOD", _SE(js_gfx_GFXSampler_getMaxLOD), nullptr);
    cls->defineProperty("magFilter", _SE(js_gfx_GFXSampler_getMagFilter), nullptr);
    cls->defineProperty("addressU", _SE(js_gfx_GFXSampler_getAddressU), nullptr);
    cls->defineProperty("addressV", _SE(js_gfx_GFXSampler_getAddressV), nullptr);
    cls->defineProperty("addressW", _SE(js_gfx_GFXSampler_getAddressW), nullptr);
    cls->defineProperty("cmpFunc", _SE(js_gfx_GFXSampler_getCmpFunc), nullptr);
    cls->defineProperty("maxAnisotropy", _SE(js_gfx_GFXSampler_getMaxAnisotropy), nullptr);
    cls->defineProperty("mipLODBias", _SE(js_gfx_GFXSampler_getMipLODBias), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXSampler_getDevice), nullptr);
    cls->defineProperty("minLOD", _SE(js_gfx_GFXSampler_getMinLOD), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXSampler_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXSampler_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXSampler>(cls);

    __jsb_cc_gfx_GFXSampler_proto = cls->getProto();
    __jsb_cc_gfx_GFXSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXShader_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXShader_class = nullptr;

static bool js_gfx_GFXShader_getStages(se::State& s)
{
    cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_getStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXShaderStage>& result = cobj->getStages();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_getStages : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_getStages)

static bool js_gfx_GFXShader_getName(se::State& s)
{
    cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::String& result = cobj->getName();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_getName)

static bool js_gfx_GFXShader_getAttributes(se::State& s)
{
    cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_getAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXAttribute>& result = cobj->getAttributes();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_getAttributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_getAttributes)

static bool js_gfx_GFXShader_getHash(se::State& s)
{
    cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHash();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_getHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_getHash)

static bool js_gfx_GFXShader_getSamplers(se::State& s)
{
    cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_getSamplers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXUniformSampler>& result = cobj->getSamplers();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_getSamplers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_getSamplers)

static bool js_gfx_GFXShader_initialize(se::State& s)
{
    cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXShaderInfo* arg0 = nullptr;
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
    cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
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

static bool js_gfx_GFXShader_getDevice(se::State& s)
{
    cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_getDevice)

static bool js_gfx_GFXShader_getBlocks(se::State& s)
{
    cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_getBlocks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXUniformBlock>& result = cobj->getBlocks();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_getBlocks : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXShader_getBlocks)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXShader_finalize)

static bool js_gfx_GFXShader_constructor(se::State& s)
{
    //#3 cc::gfx::GFXShader: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXShader constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXShader_constructor, __jsb_cc_gfx_GFXShader_class, js_cc_gfx_GFXShader_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXShader_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXShader)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXShader* cobj = (cc::gfx::GFXShader*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXShader_finalize)

bool js_register_gfx_GFXShader(se::Object* obj)
{
    auto cls = se::Class::create("GFXShader", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXShader_constructor));

    cls->defineProperty("blocks", _SE(js_gfx_GFXShader_getBlocks), nullptr);
    cls->defineProperty("name", _SE(js_gfx_GFXShader_getName), nullptr);
    cls->defineProperty("samplers", _SE(js_gfx_GFXShader_getSamplers), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXShader_getDevice), nullptr);
    cls->defineProperty("attributes", _SE(js_gfx_GFXShader_getAttributes), nullptr);
    cls->defineProperty("stages", _SE(js_gfx_GFXShader_getStages), nullptr);
    cls->defineProperty("hash", _SE(js_gfx_GFXShader_getHash), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXShader_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXShader_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXShader_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXShader>(cls);

    __jsb_cc_gfx_GFXShader_proto = cls->getProto();
    __jsb_cc_gfx_GFXShader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXInputAssembler_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXInputAssembler_class = nullptr;

static bool js_gfx_GFXInputAssembler_getFirstIndex(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getFirstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstIndex();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getFirstIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getFirstIndex)

static bool js_gfx_GFXInputAssembler_getVertexOffset(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexOffset();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getVertexOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getVertexOffset)

static bool js_gfx_GFXInputAssembler_getVertexCount(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getVertexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getVertexCount)

static bool js_gfx_GFXInputAssembler_setIndexCount(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
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
SE_BIND_PROP_SET(js_gfx_GFXInputAssembler_setIndexCount)

static bool js_gfx_GFXInputAssembler_getAttributesHash(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getAttributesHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getAttributesHash();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getAttributesHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getAttributesHash)

static bool js_gfx_GFXInputAssembler_setFirstInstance(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
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
SE_BIND_PROP_SET(js_gfx_GFXInputAssembler_setFirstInstance)

static bool js_gfx_GFXInputAssembler_destroy(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
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

static bool js_gfx_GFXInputAssembler_getDevice(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getDevice)

static bool js_gfx_GFXInputAssembler_setVertexOffset(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
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
SE_BIND_PROP_SET(js_gfx_GFXInputAssembler_setVertexOffset)

static bool js_gfx_GFXInputAssembler_getInstanceCount(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getInstanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getInstanceCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getInstanceCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getInstanceCount)

static bool js_gfx_GFXInputAssembler_getIndexCount(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getIndexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIndexCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getIndexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getIndexCount)

static bool js_gfx_GFXInputAssembler_getIndirectBuffer(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getIndirectBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXBuffer* result = cobj->getIndirectBuffer();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getIndirectBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getIndirectBuffer)

static bool js_gfx_GFXInputAssembler_getVertexBuffers(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getVertexBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXBuffer *>& result = cobj->getVertexBuffers();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getVertexBuffers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getVertexBuffers)

static bool js_gfx_GFXInputAssembler_initialize(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXInputAssemblerInfo* arg0 = nullptr;
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

static bool js_gfx_GFXInputAssembler_setFirstVertex(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
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
SE_BIND_PROP_SET(js_gfx_GFXInputAssembler_setFirstVertex)

static bool js_gfx_GFXInputAssembler_getFirstVertex(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getFirstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstVertex();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getFirstVertex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getFirstVertex)

static bool js_gfx_GFXInputAssembler_setVertexCount(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
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
SE_BIND_PROP_SET(js_gfx_GFXInputAssembler_setVertexCount)

static bool js_gfx_GFXInputAssembler_getAttributes(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXAttribute>& result = cobj->getAttributes();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getAttributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getAttributes)

static bool js_gfx_GFXInputAssembler_getIndexBuffer(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getIndexBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXBuffer* result = cobj->getIndexBuffer();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getIndexBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getIndexBuffer)

static bool js_gfx_GFXInputAssembler_setFirstIndex(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
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
SE_BIND_PROP_SET(js_gfx_GFXInputAssembler_setFirstIndex)

static bool js_gfx_GFXInputAssembler_setInstanceCount(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
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
SE_BIND_PROP_SET(js_gfx_GFXInputAssembler_setInstanceCount)

static bool js_gfx_GFXInputAssembler_getFirstInstance(se::State& s)
{
    cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_getFirstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstInstance();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_getFirstInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssembler_getFirstInstance)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXInputAssembler_finalize)

static bool js_gfx_GFXInputAssembler_constructor(se::State& s)
{
    //#3 cc::gfx::GFXInputAssembler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXInputAssembler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXInputAssembler_constructor, __jsb_cc_gfx_GFXInputAssembler_class, js_cc_gfx_GFXInputAssembler_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXInputAssembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXInputAssembler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXInputAssembler* cobj = (cc::gfx::GFXInputAssembler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXInputAssembler_finalize)

bool js_register_gfx_GFXInputAssembler(se::Object* obj)
{
    auto cls = se::Class::create("GFXInputAssembler", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXInputAssembler_constructor));

    cls->defineProperty("instanceCount", _SE(js_gfx_GFXInputAssembler_getInstanceCount), _SE(js_gfx_GFXInputAssembler_setInstanceCount));
    cls->defineProperty("vertexBuffers", _SE(js_gfx_GFXInputAssembler_getVertexBuffers), nullptr);
    cls->defineProperty("attributesHash", _SE(js_gfx_GFXInputAssembler_getAttributesHash), nullptr);
    cls->defineProperty("firstInstance", _SE(js_gfx_GFXInputAssembler_getFirstInstance), _SE(js_gfx_GFXInputAssembler_setFirstInstance));
    cls->defineProperty("vertexOffset", _SE(js_gfx_GFXInputAssembler_getVertexOffset), _SE(js_gfx_GFXInputAssembler_setVertexOffset));
    cls->defineProperty("vertexCount", _SE(js_gfx_GFXInputAssembler_getVertexCount), _SE(js_gfx_GFXInputAssembler_setVertexCount));
    cls->defineProperty("indexBuffer", _SE(js_gfx_GFXInputAssembler_getIndexBuffer), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXInputAssembler_getDevice), nullptr);
    cls->defineProperty("attributes", _SE(js_gfx_GFXInputAssembler_getAttributes), nullptr);
    cls->defineProperty("indexCount", _SE(js_gfx_GFXInputAssembler_getIndexCount), _SE(js_gfx_GFXInputAssembler_setIndexCount));
    cls->defineProperty("firstIndex", _SE(js_gfx_GFXInputAssembler_getFirstIndex), _SE(js_gfx_GFXInputAssembler_setFirstIndex));
    cls->defineProperty("indirectBuffer", _SE(js_gfx_GFXInputAssembler_getIndirectBuffer), nullptr);
    cls->defineProperty("firstVertex", _SE(js_gfx_GFXInputAssembler_getFirstVertex), _SE(js_gfx_GFXInputAssembler_setFirstVertex));
    cls->defineFunction("destroy", _SE(js_gfx_GFXInputAssembler_destroy));
    cls->defineFunction("initialize", _SE(js_gfx_GFXInputAssembler_initialize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXInputAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXInputAssembler>(cls);

    __jsb_cc_gfx_GFXInputAssembler_proto = cls->getProto();
    __jsb_cc_gfx_GFXInputAssembler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXRenderPass_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXRenderPass_class = nullptr;

static bool js_gfx_GFXRenderPass_getColorAttachments(se::State& s)
{
    cc::gfx::GFXRenderPass* cobj = (cc::gfx::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_getColorAttachments : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXColorAttachment>& result = cobj->getColorAttachments();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_getColorAttachments : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPass_getColorAttachments)

static bool js_gfx_GFXRenderPass_getSubPasses(se::State& s)
{
    cc::gfx::GFXRenderPass* cobj = (cc::gfx::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_getSubPasses : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXSubPass>& result = cobj->getSubPasses();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_getSubPasses : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPass_getSubPasses)

static bool js_gfx_GFXRenderPass_getHash(se::State& s)
{
    cc::gfx::GFXRenderPass* cobj = (cc::gfx::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHash();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_getHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPass_getHash)

static bool js_gfx_GFXRenderPass_initialize(se::State& s)
{
    cc::gfx::GFXRenderPass* cobj = (cc::gfx::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXRenderPassInfo* arg0 = nullptr;
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
    cc::gfx::GFXRenderPass* cobj = (cc::gfx::GFXRenderPass*)s.nativeThisObject();
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

static bool js_gfx_GFXRenderPass_getDevice(se::State& s)
{
    cc::gfx::GFXRenderPass* cobj = (cc::gfx::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPass_getDevice)

static bool js_gfx_GFXRenderPass_getDepthStencilAttachment(se::State& s)
{
    cc::gfx::GFXRenderPass* cobj = (cc::gfx::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_getDepthStencilAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::GFXDepthStencilAttachment& result = cobj->getDepthStencilAttachment();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_getDepthStencilAttachment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPass_getDepthStencilAttachment)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXRenderPass_finalize)

static bool js_gfx_GFXRenderPass_constructor(se::State& s)
{
    //#3 cc::gfx::GFXRenderPass: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXRenderPass constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXRenderPass_constructor, __jsb_cc_gfx_GFXRenderPass_class, js_cc_gfx_GFXRenderPass_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXRenderPass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXRenderPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXRenderPass* cobj = (cc::gfx::GFXRenderPass*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXRenderPass_finalize)

bool js_register_gfx_GFXRenderPass(se::Object* obj)
{
    auto cls = se::Class::create("GFXRenderPass", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXRenderPass_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXRenderPass_getDevice), nullptr);
    cls->defineProperty("colorAttachments", _SE(js_gfx_GFXRenderPass_getColorAttachments), nullptr);
    cls->defineProperty("depthStencilAttachment", _SE(js_gfx_GFXRenderPass_getDepthStencilAttachment), nullptr);
    cls->defineProperty("hash", _SE(js_gfx_GFXRenderPass_getHash), nullptr);
    cls->defineProperty("subPasses", _SE(js_gfx_GFXRenderPass_getSubPasses), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXRenderPass_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXRenderPass_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXRenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXRenderPass>(cls);

    __jsb_cc_gfx_GFXRenderPass_proto = cls->getProto();
    __jsb_cc_gfx_GFXRenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXFramebuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXFramebuffer_class = nullptr;

static bool js_gfx_GFXFramebuffer_getColorTextures(se::State& s)
{
    cc::gfx::GFXFramebuffer* cobj = (cc::gfx::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_getColorTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXTexture *>& result = cobj->getColorTextures();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_getColorTextures : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebuffer_getColorTextures)

static bool js_gfx_GFXFramebuffer_getDepthStencilTexture(se::State& s)
{
    cc::gfx::GFXFramebuffer* cobj = (cc::gfx::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_getDepthStencilTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXTexture* result = cobj->getDepthStencilTexture();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_getDepthStencilTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebuffer_getDepthStencilTexture)

static bool js_gfx_GFXFramebuffer_isOffscreen(se::State& s)
{
    cc::gfx::GFXFramebuffer* cobj = (cc::gfx::GFXFramebuffer*)s.nativeThisObject();
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
SE_BIND_PROP_GET(js_gfx_GFXFramebuffer_isOffscreen)

static bool js_gfx_GFXFramebuffer_initialize(se::State& s)
{
    cc::gfx::GFXFramebuffer* cobj = (cc::gfx::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXFramebufferInfo* arg0 = nullptr;
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
    cc::gfx::GFXFramebuffer* cobj = (cc::gfx::GFXFramebuffer*)s.nativeThisObject();
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

static bool js_gfx_GFXFramebuffer_getRenderPass(se::State& s)
{
    cc::gfx::GFXFramebuffer* cobj = (cc::gfx::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_getRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXRenderPass* result = cobj->getRenderPass();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_getRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebuffer_getRenderPass)

static bool js_gfx_GFXFramebuffer_getDevice(se::State& s)
{
    cc::gfx::GFXFramebuffer* cobj = (cc::gfx::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebuffer_getDevice)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXFramebuffer_finalize)

static bool js_gfx_GFXFramebuffer_constructor(se::State& s)
{
    //#3 cc::gfx::GFXFramebuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXFramebuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXFramebuffer_constructor, __jsb_cc_gfx_GFXFramebuffer_class, js_cc_gfx_GFXFramebuffer_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXFramebuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXFramebuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXFramebuffer* cobj = (cc::gfx::GFXFramebuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXFramebuffer_finalize)

bool js_register_gfx_GFXFramebuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXFramebuffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXFramebuffer_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXFramebuffer_getDevice), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_GFXFramebuffer_getRenderPass), nullptr);
    cls->defineProperty("colorTextures", _SE(js_gfx_GFXFramebuffer_getColorTextures), nullptr);
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_GFXFramebuffer_getDepthStencilTexture), nullptr);
    cls->defineProperty("isOffscreen", _SE(js_gfx_GFXFramebuffer_isOffscreen), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXFramebuffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXFramebuffer_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXFramebuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXFramebuffer>(cls);

    __jsb_cc_gfx_GFXFramebuffer_proto = cls->getProto();
    __jsb_cc_gfx_GFXFramebuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXBindingLayout_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXBindingLayout_class = nullptr;

static bool js_gfx_GFXBindingLayout_getBindingUnits(se::State& s)
{
    cc::gfx::GFXBindingLayout* cobj = (cc::gfx::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_getBindingUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXBindingUnit>& result = cobj->getBindingUnits();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_getBindingUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingLayout_getBindingUnits)

static bool js_gfx_GFXBindingLayout_bindBuffer(se::State& s)
{
    cc::gfx::GFXBindingLayout* cobj = (cc::gfx::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cc::gfx::GFXBuffer* arg1 = nullptr;
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
    cc::gfx::GFXBindingLayout* cobj = (cc::gfx::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cc::gfx::GFXSampler* arg1 = nullptr;
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
    cc::gfx::GFXBindingLayout* cobj = (cc::gfx::GFXBindingLayout*)s.nativeThisObject();
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

static bool js_gfx_GFXBindingLayout_bindTexture(se::State& s)
{
    cc::gfx::GFXBindingLayout* cobj = (cc::gfx::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cc::gfx::GFXTexture* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_bindTexture : Error processing arguments");
        cobj->bindTexture(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_bindTexture)

static bool js_gfx_GFXBindingLayout_initialize(se::State& s)
{
    cc::gfx::GFXBindingLayout* cobj = (cc::gfx::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXBindingLayoutInfo* arg0 = nullptr;
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
    cc::gfx::GFXBindingLayout* cobj = (cc::gfx::GFXBindingLayout*)s.nativeThisObject();
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

static bool js_gfx_GFXBindingLayout_getDevice(se::State& s)
{
    cc::gfx::GFXBindingLayout* cobj = (cc::gfx::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingLayout_getDevice)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXBindingLayout_finalize)

static bool js_gfx_GFXBindingLayout_constructor(se::State& s)
{
    //#3 cc::gfx::GFXBindingLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXBindingLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBindingLayout_constructor, __jsb_cc_gfx_GFXBindingLayout_class, js_cc_gfx_GFXBindingLayout_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXBindingLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXBindingLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXBindingLayout* cobj = (cc::gfx::GFXBindingLayout*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXBindingLayout_finalize)

bool js_register_gfx_GFXBindingLayout(se::Object* obj)
{
    auto cls = se::Class::create("GFXBindingLayout", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXBindingLayout_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXBindingLayout_getDevice), nullptr);
    cls->defineProperty("bindingUnits", _SE(js_gfx_GFXBindingLayout_getBindingUnits), nullptr);
    cls->defineFunction("bindBuffer", _SE(js_gfx_GFXBindingLayout_bindBuffer));
    cls->defineFunction("bindSampler", _SE(js_gfx_GFXBindingLayout_bindSampler));
    cls->defineFunction("update", _SE(js_gfx_GFXBindingLayout_update));
    cls->defineFunction("bindTexture", _SE(js_gfx_GFXBindingLayout_bindTexture));
    cls->defineFunction("initialize", _SE(js_gfx_GFXBindingLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXBindingLayout_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXBindingLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXBindingLayout>(cls);

    __jsb_cc_gfx_GFXBindingLayout_proto = cls->getProto();
    __jsb_cc_gfx_GFXBindingLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXPipelineLayout_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXPipelineLayout_class = nullptr;

static bool js_gfx_GFXPipelineLayout_getLayouts(se::State& s)
{
    cc::gfx::GFXPipelineLayout* cobj = (cc::gfx::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_getLayouts : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXBindingLayout *>& result = cobj->getLayouts();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_getLayouts : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_getLayouts)

static bool js_gfx_GFXPipelineLayout_initialize(se::State& s)
{
    cc::gfx::GFXPipelineLayout* cobj = (cc::gfx::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXPipelineLayoutInfo* arg0 = nullptr;
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
    cc::gfx::GFXPipelineLayout* cobj = (cc::gfx::GFXPipelineLayout*)s.nativeThisObject();
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

static bool js_gfx_GFXPipelineLayout_getDevice(se::State& s)
{
    cc::gfx::GFXPipelineLayout* cobj = (cc::gfx::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineLayout_getDevice)

static bool js_gfx_GFXPipelineLayout_getPushConstantsRanges(se::State& s)
{
    cc::gfx::GFXPipelineLayout* cobj = (cc::gfx::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_getPushConstantsRanges : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXPushConstantRange>& result = cobj->getPushConstantsRanges();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_getPushConstantsRanges : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_getPushConstantsRanges)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXPipelineLayout_finalize)

static bool js_gfx_GFXPipelineLayout_constructor(se::State& s)
{
    //#3 cc::gfx::GFXPipelineLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXPipelineLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXPipelineLayout_constructor, __jsb_cc_gfx_GFXPipelineLayout_class, js_cc_gfx_GFXPipelineLayout_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXPipelineLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXPipelineLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXPipelineLayout* cobj = (cc::gfx::GFXPipelineLayout*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXPipelineLayout_finalize)

bool js_register_gfx_GFXPipelineLayout(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineLayout", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXPipelineLayout_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXPipelineLayout_getDevice), nullptr);
    cls->defineFunction("getLayouts", _SE(js_gfx_GFXPipelineLayout_getLayouts));
    cls->defineFunction("initialize", _SE(js_gfx_GFXPipelineLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXPipelineLayout_destroy));
    cls->defineFunction("getPushConstantsRanges", _SE(js_gfx_GFXPipelineLayout_getPushConstantsRanges));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXPipelineLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXPipelineLayout>(cls);

    __jsb_cc_gfx_GFXPipelineLayout_proto = cls->getProto();
    __jsb_cc_gfx_GFXPipelineLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXPipelineState_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXPipelineState_class = nullptr;

static bool js_gfx_GFXPipelineState_getRasterizerState(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getRasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::GFXRasterizerState& result = cobj->getRasterizerState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getRasterizerState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_getRasterizerState)

static bool js_gfx_GFXPipelineState_getShader(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXShader* result = cobj->getShader();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_getShader)

static bool js_gfx_GFXPipelineState_getInputState(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getInputState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::GFXInputState& result = cobj->getInputState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getInputState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_getInputState)

static bool js_gfx_GFXPipelineState_getPrimitive(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getPrimitive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getPrimitive();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getPrimitive : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_getPrimitive)

static bool js_gfx_GFXPipelineState_getDepthStencilState(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getDepthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::GFXDepthStencilState& result = cobj->getDepthStencilState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getDepthStencilState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_getDepthStencilState)

static bool js_gfx_GFXPipelineState_getBlendState(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getBlendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::GFXBlendState& result = cobj->getBlendState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getBlendState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_getBlendState)

static bool js_gfx_GFXPipelineState_getPipelineLayout(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::GFXPipelineLayout* result = cobj->getPipelineLayout();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getPipelineLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_getPipelineLayout)

static bool js_gfx_GFXPipelineState_initialize(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXPipelineStateInfo* arg0 = nullptr;
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
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
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

static bool js_gfx_GFXPipelineState_getRenderPass(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::GFXRenderPass* result = cobj->getRenderPass();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_getRenderPass)

static bool js_gfx_GFXPipelineState_getDevice(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineState_getDevice)

static bool js_gfx_GFXPipelineState_getDynamicStates(se::State& s)
{
    cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_getDynamicStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::GFXDynamicState>& result = cobj->getDynamicStates();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_getDynamicStates : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_getDynamicStates)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXPipelineState_finalize)

static bool js_gfx_GFXPipelineState_constructor(se::State& s)
{
    //#3 cc::gfx::GFXPipelineState: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXPipelineState constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXPipelineState_constructor, __jsb_cc_gfx_GFXPipelineState_class, js_cc_gfx_GFXPipelineState_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXPipelineState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXPipelineState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXPipelineState* cobj = (cc::gfx::GFXPipelineState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXPipelineState_finalize)

bool js_register_gfx_GFXPipelineState(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineState", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXPipelineState_constructor));

    cls->defineProperty("primitive", _SE(js_gfx_GFXPipelineState_getPrimitive), nullptr);
    cls->defineProperty("rasterizerState", _SE(js_gfx_GFXPipelineState_getRasterizerState), nullptr);
    cls->defineProperty("shader", _SE(js_gfx_GFXPipelineState_getShader), nullptr);
    cls->defineProperty("blendState", _SE(js_gfx_GFXPipelineState_getBlendState), nullptr);
    cls->defineProperty("pipelineLayout", _SE(js_gfx_GFXPipelineState_getPipelineLayout), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_GFXPipelineState_getRenderPass), nullptr);
    cls->defineProperty("device", _SE(js_gfx_GFXPipelineState_getDevice), nullptr);
    cls->defineProperty("inputState", _SE(js_gfx_GFXPipelineState_getInputState), nullptr);
    cls->defineProperty("depthStencilState", _SE(js_gfx_GFXPipelineState_getDepthStencilState), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_GFXPipelineState_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXPipelineState_destroy));
    cls->defineFunction("getDynamicStates", _SE(js_gfx_GFXPipelineState_getDynamicStates));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXPipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXPipelineState>(cls);

    __jsb_cc_gfx_GFXPipelineState_proto = cls->getProto();
    __jsb_cc_gfx_GFXPipelineState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXCommandAllocator_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXCommandAllocator_class = nullptr;

static bool js_gfx_GFXCommandAllocator_initialize(se::State& s)
{
    cc::gfx::GFXCommandAllocator* cobj = (cc::gfx::GFXCommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandAllocator_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXCommandAllocatorInfo* arg0 = nullptr;
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
    cc::gfx::GFXCommandAllocator* cobj = (cc::gfx::GFXCommandAllocator*)s.nativeThisObject();
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

static bool js_gfx_GFXCommandAllocator_getDevice(se::State& s)
{
    cc::gfx::GFXCommandAllocator* cobj = (cc::gfx::GFXCommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandAllocator_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandAllocator_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandAllocator_getDevice)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXCommandAllocator_finalize)

static bool js_gfx_GFXCommandAllocator_constructor(se::State& s)
{
    //#3 cc::gfx::GFXCommandAllocator: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXCommandAllocator constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXCommandAllocator_constructor, __jsb_cc_gfx_GFXCommandAllocator_class, js_cc_gfx_GFXCommandAllocator_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXCommandAllocator_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXCommandAllocator)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXCommandAllocator* cobj = (cc::gfx::GFXCommandAllocator*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXCommandAllocator_finalize)

bool js_register_gfx_GFXCommandAllocator(se::Object* obj)
{
    auto cls = se::Class::create("GFXCommandAllocator", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXCommandAllocator_constructor));

    cls->defineFunction("initialize", _SE(js_gfx_GFXCommandAllocator_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXCommandAllocator_destroy));
    cls->defineFunction("getDevice", _SE(js_gfx_GFXCommandAllocator_getDevice));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXCommandAllocator_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXCommandAllocator>(cls);

    __jsb_cc_gfx_GFXCommandAllocator_proto = cls->getProto();
    __jsb_cc_gfx_GFXCommandAllocator_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXCommandBuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXCommandBuffer_class = nullptr;

static bool js_gfx_GFXCommandBuffer_draw(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXInputAssembler* arg0 = nullptr;
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setBlendConstants : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXColor* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setBlendConstants : Error processing arguments");
        cobj->setBlendConstants(*arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setBlendConstants)

static bool js_gfx_GFXCommandBuffer_setDepthBound(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
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

static bool js_gfx_GFXCommandBuffer_getAllocator(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_getAllocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXCommandAllocator* result = cobj->getAllocator();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_getAllocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_getAllocator)

static bool js_gfx_GFXCommandBuffer_copyBufferToTexture(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_copyBufferToTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cc::gfx::GFXBuffer* arg0 = nullptr;
        cc::gfx::GFXTexture* arg1 = nullptr;
        cc::gfx::GFXTextureLayout arg2;
        std::vector<cc::gfx::GFXBufferTextureCopy> arg3;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXTextureLayout)tmp; } while(false);
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_updateBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::gfx::GFXBuffer* arg0 = nullptr;
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
        cc::gfx::GFXBuffer* arg0 = nullptr;
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setStencilWriteMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::gfx::GFXStencilFace arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStencilFace)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setStencilWriteMask : Error processing arguments");
        cobj->setStencilWriteMask(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setStencilWriteMask)

static bool js_gfx_GFXCommandBuffer_getNumInstances(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_getNumInstances : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumInstances();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_getNumInstances : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_getNumInstances)

static bool js_gfx_GFXCommandBuffer_setStencilCompareMask(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setStencilCompareMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::gfx::GFXStencilFace arg0;
        int arg1 = 0;
        unsigned int arg2 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::GFXStencilFace)tmp; } while(false);
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_bindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXInputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_bindInputAssembler : Error processing arguments");
        cobj->bindInputAssembler(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_bindInputAssembler)

static bool js_gfx_GFXCommandBuffer_bindPipelineState(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_bindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXPipelineState* arg0 = nullptr;
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
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

static bool js_gfx_GFXCommandBuffer_getDevice(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_getDevice)

static bool js_gfx_GFXCommandBuffer_getNumTris(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_getNumTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumTris();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_getNumTris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_getNumTris)

static bool js_gfx_GFXCommandBuffer_setViewport(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXViewport* arg0 = nullptr;
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_begin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->begin();
        return true;
    }
    if (argc == 1) {
        cc::gfx::GFXRenderPass* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_begin : Error processing arguments");
        cobj->begin(arg0);
        return true;
    }
    if (argc == 2) {
        cc::gfx::GFXRenderPass* arg0 = nullptr;
        unsigned int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_begin : Error processing arguments");
        cobj->begin(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cc::gfx::GFXRenderPass* arg0 = nullptr;
        unsigned int arg1 = 0;
        cc::gfx::GFXFramebuffer* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_begin : Error processing arguments");
        cobj->begin(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_begin)

static bool js_gfx_GFXCommandBuffer_getType(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_getType)

static bool js_gfx_GFXCommandBuffer_bindBindingLayout(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_bindBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXBindingLayout* arg0 = nullptr;
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXCommandBufferInfo* arg0 = nullptr;
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
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXRect* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setScissor : Error processing arguments");
        cobj->setScissor(*arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setScissor)

static bool js_gfx_GFXCommandBuffer_beginRenderPass(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_beginRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        cc::gfx::GFXFramebuffer* arg0 = nullptr;
        cc::gfx::GFXRect* arg1 = nullptr;
        cc::gfx::GFXClearFlagBit arg2;
        std::vector<cc::gfx::GFXColor> arg3;
        float arg4 = 0;
        int arg5 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_reference(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::GFXClearFlagBit)tmp; } while(false);
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

static bool js_gfx_GFXCommandBuffer_getNumDrawCalls(se::State& s)
{
    cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_getNumDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumDrawCalls();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_getNumDrawCalls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_getNumDrawCalls)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXCommandBuffer_finalize)

static bool js_gfx_GFXCommandBuffer_constructor(se::State& s)
{
    //#3 cc::gfx::GFXCommandBuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXCommandBuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXCommandBuffer_constructor, __jsb_cc_gfx_GFXCommandBuffer_class, js_cc_gfx_GFXCommandBuffer_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXCommandBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXCommandBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXCommandBuffer* cobj = (cc::gfx::GFXCommandBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXCommandBuffer_finalize)

bool js_register_gfx_GFXCommandBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXCommandBuffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXCommandBuffer_constructor));

    cls->defineFunction("draw", _SE(js_gfx_GFXCommandBuffer_draw));
    cls->defineFunction("setBlendConstants", _SE(js_gfx_GFXCommandBuffer_setBlendConstants));
    cls->defineFunction("setDepthBound", _SE(js_gfx_GFXCommandBuffer_setDepthBound));
    cls->defineFunction("getAllocator", _SE(js_gfx_GFXCommandBuffer_getAllocator));
    cls->defineFunction("copyBufferToTexture", _SE(js_gfx_GFXCommandBuffer_copyBufferToTexture));
    cls->defineFunction("setLineWidth", _SE(js_gfx_GFXCommandBuffer_setLineWidth));
    cls->defineFunction("updateBuffer", _SE(js_gfx_GFXCommandBuffer_updateBuffer));
    cls->defineFunction("end", _SE(js_gfx_GFXCommandBuffer_end));
    cls->defineFunction("setStencilWriteMask", _SE(js_gfx_GFXCommandBuffer_setStencilWriteMask));
    cls->defineFunction("getNumInstances", _SE(js_gfx_GFXCommandBuffer_getNumInstances));
    cls->defineFunction("setStencilCompareMask", _SE(js_gfx_GFXCommandBuffer_setStencilCompareMask));
    cls->defineFunction("bindInputAssembler", _SE(js_gfx_GFXCommandBuffer_bindInputAssembler));
    cls->defineFunction("bindPipelineState", _SE(js_gfx_GFXCommandBuffer_bindPipelineState));
    cls->defineFunction("destroy", _SE(js_gfx_GFXCommandBuffer_destroy));
    cls->defineFunction("getDevice", _SE(js_gfx_GFXCommandBuffer_getDevice));
    cls->defineFunction("getNumTris", _SE(js_gfx_GFXCommandBuffer_getNumTris));
    cls->defineFunction("setViewport", _SE(js_gfx_GFXCommandBuffer_setViewport));
    cls->defineFunction("setDepthBias", _SE(js_gfx_GFXCommandBuffer_setDepthBias));
    cls->defineFunction("begin", _SE(js_gfx_GFXCommandBuffer_begin));
    cls->defineFunction("getType", _SE(js_gfx_GFXCommandBuffer_getType));
    cls->defineFunction("bindBindingLayout", _SE(js_gfx_GFXCommandBuffer_bindBindingLayout));
    cls->defineFunction("endRenderPass", _SE(js_gfx_GFXCommandBuffer_endRenderPass));
    cls->defineFunction("initialize", _SE(js_gfx_GFXCommandBuffer_initialize));
    cls->defineFunction("setScissor", _SE(js_gfx_GFXCommandBuffer_setScissor));
    cls->defineFunction("beginRenderPass", _SE(js_gfx_GFXCommandBuffer_beginRenderPass));
    cls->defineFunction("getNumDrawCalls", _SE(js_gfx_GFXCommandBuffer_getNumDrawCalls));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXCommandBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXCommandBuffer>(cls);

    __jsb_cc_gfx_GFXCommandBuffer_proto = cls->getProto();
    __jsb_cc_gfx_GFXCommandBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXFence_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXFence_class = nullptr;

static bool js_gfx_GFXFence_initialize(se::State& s)
{
    cc::gfx::GFXFence* cobj = (cc::gfx::GFXFence*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFence_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXFenceInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFence_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFence_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFence_initialize)

static bool js_gfx_GFXFence_destroy(se::State& s)
{
    cc::gfx::GFXFence* cobj = (cc::gfx::GFXFence*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFence_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFence_destroy)

static bool js_gfx_GFXFence_wait(se::State& s)
{
    cc::gfx::GFXFence* cobj = (cc::gfx::GFXFence*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFence_wait : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->wait();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFence_wait)

static bool js_gfx_GFXFence_reset(se::State& s)
{
    cc::gfx::GFXFence* cobj = (cc::gfx::GFXFence*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFence_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFence_reset)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXFence_finalize)

static bool js_gfx_GFXFence_constructor(se::State& s)
{
    //#3 cc::gfx::GFXFence: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXFence constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXFence_constructor, __jsb_cc_gfx_GFXFence_class, js_cc_gfx_GFXFence_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXFence_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXFence)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXFence* cobj = (cc::gfx::GFXFence*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXFence_finalize)

bool js_register_gfx_GFXFence(se::Object* obj)
{
    auto cls = se::Class::create("GFXFence", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXFence_constructor));

    cls->defineFunction("initialize", _SE(js_gfx_GFXFence_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXFence_destroy));
    cls->defineFunction("wait", _SE(js_gfx_GFXFence_wait));
    cls->defineFunction("reset", _SE(js_gfx_GFXFence_reset));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXFence_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXFence>(cls);

    __jsb_cc_gfx_GFXFence_proto = cls->getProto();
    __jsb_cc_gfx_GFXFence_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXQueue_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXQueue_class = nullptr;

static bool js_gfx_GFXQueue_getType(se::State& s)
{
    cc::gfx::GFXQueue* cobj = (cc::gfx::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXQueue_getType)

static bool js_gfx_GFXQueue_submit(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::GFXQueue* cobj = (cc::gfx::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_GFXQueue_submit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::vector<cc::gfx::GFXCommandBuffer *> arg0;
            ok &= seval_to_std_vector(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->submit(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            std::vector<cc::gfx::GFXCommandBuffer *> arg0;
            ok &= seval_to_std_vector(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cc::gfx::GFXFence* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cobj->submit(arg0, arg1);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_submit)

static bool js_gfx_GFXQueue_initialize(se::State& s)
{
    cc::gfx::GFXQueue* cobj = (cc::gfx::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::GFXQueueInfo* arg0 = nullptr;
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
    cc::gfx::GFXQueue* cobj = (cc::gfx::GFXQueue*)s.nativeThisObject();
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

static bool js_gfx_GFXQueue_getDevice(se::State& s)
{
    cc::gfx::GFXQueue* cobj = (cc::gfx::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::GFXDevice* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXQueue_getDevice)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXQueue_finalize)

static bool js_gfx_GFXQueue_constructor(se::State& s)
{
    //#3 cc::gfx::GFXQueue: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GFXQueue constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXQueue_constructor, __jsb_cc_gfx_GFXQueue_class, js_cc_gfx_GFXQueue_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_GFXQueue_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GFXQueue)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXQueue* cobj = (cc::gfx::GFXQueue*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXQueue_finalize)

bool js_register_gfx_GFXQueue(se::Object* obj)
{
    auto cls = se::Class::create("GFXQueue", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GFXQueue_constructor));

    cls->defineProperty("device", _SE(js_gfx_GFXQueue_getDevice), nullptr);
    cls->defineProperty("type", _SE(js_gfx_GFXQueue_getType), nullptr);
    cls->defineFunction("submit", _SE(js_gfx_GFXQueue_submit));
    cls->defineFunction("initialize", _SE(js_gfx_GFXQueue_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXQueue_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXQueue_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXQueue>(cls);

    __jsb_cc_gfx_GFXQueue_proto = cls->getProto();
    __jsb_cc_gfx_GFXQueue_class = cls;

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
    js_register_gfx_GFXContextInfo(ns);
    js_register_gfx_GFXObject(ns);
    js_register_gfx_GFXBuffer(ns);
    js_register_gfx_GFXRenderPass(ns);
    js_register_gfx_GFXPipelineLayoutInfo(ns);
    js_register_gfx_GFXBindingUnit(ns);
    js_register_gfx_GFXDevice(ns);
    js_register_gfx_GFXPipelineStateInfo(ns);
    js_register_gfx_GFXSampler(ns);
    js_register_gfx_GFXColorAttachment(ns);
    js_register_gfx_GFXBindingLayoutInfo(ns);
    js_register_gfx_GFXUniformSampler(ns);
    js_register_gfx_GFXFormatInfo(ns);
    js_register_gfx_GFXInputAssembler(ns);
    js_register_gfx_GFXUniformBlock(ns);
    js_register_gfx_GFXShader(ns);
    js_register_gfx_GFXDeviceInfo(ns);
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
    js_register_gfx_GFXCommandBufferInfo(ns);
    js_register_gfx_GFXBindingLayout(ns);
    js_register_gfx_GFXTexture(ns);
    js_register_gfx_GFXQueue(ns);
    js_register_gfx_GFXViewport(ns);
    js_register_gfx_GFXDepthStencilState(ns);
    js_register_gfx_GFXDepthStencilAttachment(ns);
    js_register_gfx_GFXBufferInfo(ns);
    js_register_gfx_GFXInputState(ns);
    js_register_gfx_GFXShaderMacro(ns);
    js_register_gfx_GFXTextureSubres(ns);
    js_register_gfx_GFXTextureCopy(ns);
    js_register_gfx_GFXIndirectBuffer(ns);
    js_register_gfx_GFXSamplerInfo(ns);
    js_register_gfx_GFXRect(ns);
    js_register_gfx_GFXDrawInfo(ns);
    js_register_gfx_GFXFence(ns);
    js_register_gfx_GFXRenderPassInfo(ns);
    js_register_gfx_GFXFramebuffer(ns);
    js_register_gfx_GFXCommandAllocator(ns);
    js_register_gfx_GFXBlendTarget(ns);
    js_register_gfx_GFXInputAssemblerInfo(ns);
    js_register_gfx_GFXColor(ns);
    js_register_gfx_GFXAttribute(ns);
    return true;
}

