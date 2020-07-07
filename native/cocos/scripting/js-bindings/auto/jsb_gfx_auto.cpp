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
se::Object* __jsb_cc_gfx_Offset_proto = nullptr;
se::Class* __jsb_cc_gfx_Offset_class = nullptr;

static bool js_gfx_Offset_get_x(se::State& s)
{
    cc::gfx::Offset* cobj = (cc::gfx::Offset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->x, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Offset_get_x)

static bool js_gfx_Offset_set_x(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Offset* cobj = (cc::gfx::Offset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_Offset_set_x : Error processing new value");
    cobj->x = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Offset_set_x)

static bool js_gfx_Offset_get_y(se::State& s)
{
    cc::gfx::Offset* cobj = (cc::gfx::Offset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->y, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Offset_get_y)

static bool js_gfx_Offset_set_y(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Offset* cobj = (cc::gfx::Offset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_Offset_set_y : Error processing new value");
    cobj->y = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Offset_set_y)

static bool js_gfx_Offset_get_z(se::State& s)
{
    cc::gfx::Offset* cobj = (cc::gfx::Offset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_get_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->z, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Offset_get_z)

static bool js_gfx_Offset_set_z(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Offset* cobj = (cc::gfx::Offset*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_set_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_Offset_set_z : Error processing new value");
    cobj->z = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Offset_set_z)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Offset_finalize)

static bool js_gfx_Offset_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Offset* cobj = JSB_ALLOC(cc::gfx::Offset);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Offset* cobj = JSB_ALLOC(cc::gfx::Offset);
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
        cc::gfx::Offset* cobj = JSB_ALLOC(cc::gfx::Offset);
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
SE_BIND_CTOR(js_gfx_Offset_constructor, __jsb_cc_gfx_Offset_class, js_cc_gfx_Offset_finalize)




static bool js_cc_gfx_Offset_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Offset* cobj = (cc::gfx::Offset*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Offset_finalize)

bool js_register_gfx_Offset(se::Object* obj)
{
    auto cls = se::Class::create("Offset", obj, nullptr, _SE(js_gfx_Offset_constructor));

    cls->defineProperty("x", _SE(js_gfx_Offset_get_x), _SE(js_gfx_Offset_set_x));
    cls->defineProperty("y", _SE(js_gfx_Offset_get_y), _SE(js_gfx_Offset_set_y));
    cls->defineProperty("z", _SE(js_gfx_Offset_get_z), _SE(js_gfx_Offset_set_z));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Offset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Offset>(cls);

    __jsb_cc_gfx_Offset_proto = cls->getProto();
    __jsb_cc_gfx_Offset_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Rect_proto = nullptr;
se::Class* __jsb_cc_gfx_Rect_class = nullptr;

static bool js_gfx_Rect_get_x(se::State& s)
{
    cc::gfx::Rect* cobj = (cc::gfx::Rect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->x, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_x)

static bool js_gfx_Rect_set_x(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Rect* cobj = (cc::gfx::Rect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_x : Error processing new value");
    cobj->x = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_x)

static bool js_gfx_Rect_get_y(se::State& s)
{
    cc::gfx::Rect* cobj = (cc::gfx::Rect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->y, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_y)

static bool js_gfx_Rect_set_y(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Rect* cobj = (cc::gfx::Rect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_y : Error processing new value");
    cobj->y = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_y)

static bool js_gfx_Rect_get_width(se::State& s)
{
    cc::gfx::Rect* cobj = (cc::gfx::Rect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_width)

static bool js_gfx_Rect_set_width(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Rect* cobj = (cc::gfx::Rect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_width)

static bool js_gfx_Rect_get_height(se::State& s)
{
    cc::gfx::Rect* cobj = (cc::gfx::Rect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_height)

static bool js_gfx_Rect_set_height(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Rect* cobj = (cc::gfx::Rect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_height)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Rect_finalize)

static bool js_gfx_Rect_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Rect* cobj = JSB_ALLOC(cc::gfx::Rect);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Rect* cobj = JSB_ALLOC(cc::gfx::Rect);
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
        cc::gfx::Rect* cobj = JSB_ALLOC(cc::gfx::Rect);
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
SE_BIND_CTOR(js_gfx_Rect_constructor, __jsb_cc_gfx_Rect_class, js_cc_gfx_Rect_finalize)




static bool js_cc_gfx_Rect_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Rect* cobj = (cc::gfx::Rect*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Rect_finalize)

bool js_register_gfx_Rect(se::Object* obj)
{
    auto cls = se::Class::create("Rect", obj, nullptr, _SE(js_gfx_Rect_constructor));

    cls->defineProperty("x", _SE(js_gfx_Rect_get_x), _SE(js_gfx_Rect_set_x));
    cls->defineProperty("y", _SE(js_gfx_Rect_get_y), _SE(js_gfx_Rect_set_y));
    cls->defineProperty("width", _SE(js_gfx_Rect_get_width), _SE(js_gfx_Rect_set_width));
    cls->defineProperty("height", _SE(js_gfx_Rect_get_height), _SE(js_gfx_Rect_set_height));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Rect_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Rect>(cls);

    __jsb_cc_gfx_Rect_proto = cls->getProto();
    __jsb_cc_gfx_Rect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Extent_proto = nullptr;
se::Class* __jsb_cc_gfx_Extent_class = nullptr;

static bool js_gfx_Extent_get_width(se::State& s)
{
    cc::gfx::Extent* cobj = (cc::gfx::Extent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Extent_get_width)

static bool js_gfx_Extent_set_width(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Extent* cobj = (cc::gfx::Extent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Extent_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Extent_set_width)

static bool js_gfx_Extent_get_height(se::State& s)
{
    cc::gfx::Extent* cobj = (cc::gfx::Extent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Extent_get_height)

static bool js_gfx_Extent_set_height(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Extent* cobj = (cc::gfx::Extent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Extent_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Extent_set_height)

static bool js_gfx_Extent_get_depth(se::State& s)
{
    cc::gfx::Extent* cobj = (cc::gfx::Extent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_get_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->depth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Extent_get_depth)

static bool js_gfx_Extent_set_depth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Extent* cobj = (cc::gfx::Extent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Extent_set_depth : Error processing new value");
    cobj->depth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Extent_set_depth)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Extent_finalize)

static bool js_gfx_Extent_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Extent* cobj = JSB_ALLOC(cc::gfx::Extent);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Extent* cobj = JSB_ALLOC(cc::gfx::Extent);
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
        cc::gfx::Extent* cobj = JSB_ALLOC(cc::gfx::Extent);
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
SE_BIND_CTOR(js_gfx_Extent_constructor, __jsb_cc_gfx_Extent_class, js_cc_gfx_Extent_finalize)




static bool js_cc_gfx_Extent_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Extent* cobj = (cc::gfx::Extent*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Extent_finalize)

bool js_register_gfx_Extent(se::Object* obj)
{
    auto cls = se::Class::create("Extent", obj, nullptr, _SE(js_gfx_Extent_constructor));

    cls->defineProperty("width", _SE(js_gfx_Extent_get_width), _SE(js_gfx_Extent_set_width));
    cls->defineProperty("height", _SE(js_gfx_Extent_get_height), _SE(js_gfx_Extent_set_height));
    cls->defineProperty("depth", _SE(js_gfx_Extent_get_depth), _SE(js_gfx_Extent_set_depth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Extent_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Extent>(cls);

    __jsb_cc_gfx_Extent_proto = cls->getProto();
    __jsb_cc_gfx_Extent_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_TextureSubres_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureSubres_class = nullptr;

static bool js_gfx_TextureSubres_get_mipLevel(se::State& s)
{
    cc::gfx::TextureSubres* cobj = (cc::gfx::TextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_get_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->mipLevel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubres_get_mipLevel)

static bool js_gfx_TextureSubres_set_mipLevel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureSubres* cobj = (cc::gfx::TextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_set_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubres_set_mipLevel : Error processing new value");
    cobj->mipLevel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubres_set_mipLevel)

static bool js_gfx_TextureSubres_get_baseArrayLayer(se::State& s)
{
    cc::gfx::TextureSubres* cobj = (cc::gfx::TextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_get_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->baseArrayLayer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubres_get_baseArrayLayer)

static bool js_gfx_TextureSubres_set_baseArrayLayer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureSubres* cobj = (cc::gfx::TextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_set_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubres_set_baseArrayLayer : Error processing new value");
    cobj->baseArrayLayer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubres_set_baseArrayLayer)

static bool js_gfx_TextureSubres_get_layerCount(se::State& s)
{
    cc::gfx::TextureSubres* cobj = (cc::gfx::TextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->layerCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubres_get_layerCount)

static bool js_gfx_TextureSubres_set_layerCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureSubres* cobj = (cc::gfx::TextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubres_set_layerCount : Error processing new value");
    cobj->layerCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubres_set_layerCount)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureSubres_finalize)

static bool js_gfx_TextureSubres_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::TextureSubres* cobj = JSB_ALLOC(cc::gfx::TextureSubres);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureSubres* cobj = JSB_ALLOC(cc::gfx::TextureSubres);
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
        cc::gfx::TextureSubres* cobj = JSB_ALLOC(cc::gfx::TextureSubres);
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
SE_BIND_CTOR(js_gfx_TextureSubres_constructor, __jsb_cc_gfx_TextureSubres_class, js_cc_gfx_TextureSubres_finalize)




static bool js_cc_gfx_TextureSubres_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::TextureSubres* cobj = (cc::gfx::TextureSubres*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureSubres_finalize)

bool js_register_gfx_TextureSubres(se::Object* obj)
{
    auto cls = se::Class::create("TextureSubres", obj, nullptr, _SE(js_gfx_TextureSubres_constructor));

    cls->defineProperty("mipLevel", _SE(js_gfx_TextureSubres_get_mipLevel), _SE(js_gfx_TextureSubres_set_mipLevel));
    cls->defineProperty("baseArrayLayer", _SE(js_gfx_TextureSubres_get_baseArrayLayer), _SE(js_gfx_TextureSubres_set_baseArrayLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_TextureSubres_get_layerCount), _SE(js_gfx_TextureSubres_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureSubres_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureSubres>(cls);

    __jsb_cc_gfx_TextureSubres_proto = cls->getProto();
    __jsb_cc_gfx_TextureSubres_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_TextureCopy_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureCopy_class = nullptr;

static bool js_gfx_TextureCopy_get_srcSubres(se::State& s)
{
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_srcSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->srcSubres, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_srcSubres)

static bool js_gfx_TextureCopy_set_srcSubres(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_srcSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_srcSubres : Error processing new value");
    cobj->srcSubres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_srcSubres)

static bool js_gfx_TextureCopy_get_srcOffset(se::State& s)
{
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_srcOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->srcOffset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_srcOffset)

static bool js_gfx_TextureCopy_set_srcOffset(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_srcOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Offset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_srcOffset : Error processing new value");
    cobj->srcOffset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_srcOffset)

static bool js_gfx_TextureCopy_get_dstSubres(se::State& s)
{
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_dstSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->dstSubres, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_dstSubres)

static bool js_gfx_TextureCopy_set_dstSubres(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_dstSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_dstSubres : Error processing new value");
    cobj->dstSubres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_dstSubres)

static bool js_gfx_TextureCopy_get_dstOffset(se::State& s)
{
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_dstOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->dstOffset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_dstOffset)

static bool js_gfx_TextureCopy_set_dstOffset(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_dstOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Offset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_dstOffset : Error processing new value");
    cobj->dstOffset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_dstOffset)

static bool js_gfx_TextureCopy_get_extent(se::State& s)
{
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_extent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->extent, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_extent)

static bool js_gfx_TextureCopy_set_extent(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_extent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Extent* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_extent : Error processing new value");
    cobj->extent = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_extent)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureCopy_finalize)

static bool js_gfx_TextureCopy_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::TextureCopy* cobj = JSB_ALLOC(cc::gfx::TextureCopy);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureCopy* cobj = JSB_ALLOC(cc::gfx::TextureCopy);
        cc::gfx::TextureSubres* arg0 = nullptr;
        json->getProperty("srcSubres", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg0);
            cobj->srcSubres = *arg0;
        }
        cc::gfx::Offset* arg1 = nullptr;
        json->getProperty("srcOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg1);
            cobj->srcOffset = *arg1;
        }
        cc::gfx::TextureSubres* arg2 = nullptr;
        json->getProperty("dstSubres", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->dstSubres = *arg2;
        }
        cc::gfx::Offset* arg3 = nullptr;
        json->getProperty("dstOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->dstOffset = *arg3;
        }
        cc::gfx::Extent* arg4 = nullptr;
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
        cc::gfx::TextureCopy* cobj = JSB_ALLOC(cc::gfx::TextureCopy);
        cc::gfx::TextureSubres* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_reference(args[0], &arg0);
            cobj->srcSubres = *arg0;
        }
        cc::gfx::Offset* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_reference(args[1], &arg1);
            cobj->srcOffset = *arg1;
        }
        cc::gfx::TextureSubres* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->dstSubres = *arg2;
        }
        cc::gfx::Offset* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_reference(args[3], &arg3);
            cobj->dstOffset = *arg3;
        }
        cc::gfx::Extent* arg4 = nullptr;
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
SE_BIND_CTOR(js_gfx_TextureCopy_constructor, __jsb_cc_gfx_TextureCopy_class, js_cc_gfx_TextureCopy_finalize)




static bool js_cc_gfx_TextureCopy_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::TextureCopy* cobj = (cc::gfx::TextureCopy*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureCopy_finalize)

bool js_register_gfx_TextureCopy(se::Object* obj)
{
    auto cls = se::Class::create("TextureCopy", obj, nullptr, _SE(js_gfx_TextureCopy_constructor));

    cls->defineProperty("srcSubres", _SE(js_gfx_TextureCopy_get_srcSubres), _SE(js_gfx_TextureCopy_set_srcSubres));
    cls->defineProperty("srcOffset", _SE(js_gfx_TextureCopy_get_srcOffset), _SE(js_gfx_TextureCopy_set_srcOffset));
    cls->defineProperty("dstSubres", _SE(js_gfx_TextureCopy_get_dstSubres), _SE(js_gfx_TextureCopy_set_dstSubres));
    cls->defineProperty("dstOffset", _SE(js_gfx_TextureCopy_get_dstOffset), _SE(js_gfx_TextureCopy_set_dstOffset));
    cls->defineProperty("extent", _SE(js_gfx_TextureCopy_get_extent), _SE(js_gfx_TextureCopy_set_extent));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureCopy_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureCopy>(cls);

    __jsb_cc_gfx_TextureCopy_proto = cls->getProto();
    __jsb_cc_gfx_TextureCopy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BufferTextureCopy_proto = nullptr;
se::Class* __jsb_cc_gfx_BufferTextureCopy_class = nullptr;

static bool js_gfx_BufferTextureCopy_get_buffStride(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_buffStride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->buffStride, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_buffStride)

static bool js_gfx_BufferTextureCopy_set_buffStride(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_buffStride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_buffStride : Error processing new value");
    cobj->buffStride = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_buffStride)

static bool js_gfx_BufferTextureCopy_get_buffTexHeight(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_buffTexHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->buffTexHeight, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_buffTexHeight)

static bool js_gfx_BufferTextureCopy_set_buffTexHeight(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_buffTexHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_buffTexHeight : Error processing new value");
    cobj->buffTexHeight = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_buffTexHeight)

static bool js_gfx_BufferTextureCopy_get_texOffset(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_texOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texOffset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_texOffset)

static bool js_gfx_BufferTextureCopy_set_texOffset(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_texOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Offset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_texOffset : Error processing new value");
    cobj->texOffset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_texOffset)

static bool js_gfx_BufferTextureCopy_get_texExtent(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_texExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texExtent, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_texExtent)

static bool js_gfx_BufferTextureCopy_set_texExtent(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_texExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Extent* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_texExtent : Error processing new value");
    cobj->texExtent = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_texExtent)

static bool js_gfx_BufferTextureCopy_get_texSubres(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_texSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texSubres, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_texSubres)

static bool js_gfx_BufferTextureCopy_set_texSubres(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_texSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_texSubres : Error processing new value");
    cobj->texSubres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_texSubres)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BufferTextureCopy_finalize)

static bool js_gfx_BufferTextureCopy_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::BufferTextureCopy);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::BufferTextureCopy);
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
        cc::gfx::Offset* arg2 = nullptr;
        json->getProperty("texOffset", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->texOffset = *arg2;
        }
        cc::gfx::Extent* arg3 = nullptr;
        json->getProperty("texExtent", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->texExtent = *arg3;
        }
        cc::gfx::TextureSubres* arg4 = nullptr;
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
        cc::gfx::BufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::BufferTextureCopy);
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
        cc::gfx::Offset* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->texOffset = *arg2;
        }
        cc::gfx::Extent* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_reference(args[3], &arg3);
            cobj->texExtent = *arg3;
        }
        cc::gfx::TextureSubres* arg4 = nullptr;
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
SE_BIND_CTOR(js_gfx_BufferTextureCopy_constructor, __jsb_cc_gfx_BufferTextureCopy_class, js_cc_gfx_BufferTextureCopy_finalize)




static bool js_cc_gfx_BufferTextureCopy_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BufferTextureCopy* cobj = (cc::gfx::BufferTextureCopy*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BufferTextureCopy_finalize)

bool js_register_gfx_BufferTextureCopy(se::Object* obj)
{
    auto cls = se::Class::create("BufferTextureCopy", obj, nullptr, _SE(js_gfx_BufferTextureCopy_constructor));

    cls->defineProperty("buffStride", _SE(js_gfx_BufferTextureCopy_get_buffStride), _SE(js_gfx_BufferTextureCopy_set_buffStride));
    cls->defineProperty("buffTexHeight", _SE(js_gfx_BufferTextureCopy_get_buffTexHeight), _SE(js_gfx_BufferTextureCopy_set_buffTexHeight));
    cls->defineProperty("texOffset", _SE(js_gfx_BufferTextureCopy_get_texOffset), _SE(js_gfx_BufferTextureCopy_set_texOffset));
    cls->defineProperty("texExtent", _SE(js_gfx_BufferTextureCopy_get_texExtent), _SE(js_gfx_BufferTextureCopy_set_texExtent));
    cls->defineProperty("texSubres", _SE(js_gfx_BufferTextureCopy_get_texSubres), _SE(js_gfx_BufferTextureCopy_set_texSubres));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BufferTextureCopy_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BufferTextureCopy>(cls);

    __jsb_cc_gfx_BufferTextureCopy_proto = cls->getProto();
    __jsb_cc_gfx_BufferTextureCopy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Viewport_proto = nullptr;
se::Class* __jsb_cc_gfx_Viewport_class = nullptr;

static bool js_gfx_Viewport_get_left(se::State& s)
{
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->left, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_left)

static bool js_gfx_Viewport_set_left(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_left : Error processing new value");
    cobj->left = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_left)

static bool js_gfx_Viewport_get_top(se::State& s)
{
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->top, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_top)

static bool js_gfx_Viewport_set_top(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_top : Error processing new value");
    cobj->top = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_top)

static bool js_gfx_Viewport_get_width(se::State& s)
{
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_width)

static bool js_gfx_Viewport_set_width(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_width)

static bool js_gfx_Viewport_get_height(se::State& s)
{
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_height)

static bool js_gfx_Viewport_set_height(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_height)

static bool js_gfx_Viewport_get_minDepth(se::State& s)
{
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_minDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->minDepth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_minDepth)

static bool js_gfx_Viewport_set_minDepth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_minDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_minDepth : Error processing new value");
    cobj->minDepth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_minDepth)

static bool js_gfx_Viewport_get_maxDepth(se::State& s)
{
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_maxDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->maxDepth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_maxDepth)

static bool js_gfx_Viewport_set_maxDepth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_maxDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_maxDepth : Error processing new value");
    cobj->maxDepth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_maxDepth)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Viewport_finalize)

static bool js_gfx_Viewport_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Viewport* cobj = JSB_ALLOC(cc::gfx::Viewport);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Viewport* cobj = JSB_ALLOC(cc::gfx::Viewport);
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
        cc::gfx::Viewport* cobj = JSB_ALLOC(cc::gfx::Viewport);
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
SE_BIND_CTOR(js_gfx_Viewport_constructor, __jsb_cc_gfx_Viewport_class, js_cc_gfx_Viewport_finalize)




static bool js_cc_gfx_Viewport_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Viewport* cobj = (cc::gfx::Viewport*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Viewport_finalize)

bool js_register_gfx_Viewport(se::Object* obj)
{
    auto cls = se::Class::create("Viewport", obj, nullptr, _SE(js_gfx_Viewport_constructor));

    cls->defineProperty("left", _SE(js_gfx_Viewport_get_left), _SE(js_gfx_Viewport_set_left));
    cls->defineProperty("top", _SE(js_gfx_Viewport_get_top), _SE(js_gfx_Viewport_set_top));
    cls->defineProperty("width", _SE(js_gfx_Viewport_get_width), _SE(js_gfx_Viewport_set_width));
    cls->defineProperty("height", _SE(js_gfx_Viewport_get_height), _SE(js_gfx_Viewport_set_height));
    cls->defineProperty("minDepth", _SE(js_gfx_Viewport_get_minDepth), _SE(js_gfx_Viewport_set_minDepth));
    cls->defineProperty("maxDepth", _SE(js_gfx_Viewport_get_maxDepth), _SE(js_gfx_Viewport_set_maxDepth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Viewport_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Viewport>(cls);

    __jsb_cc_gfx_Viewport_proto = cls->getProto();
    __jsb_cc_gfx_Viewport_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Color_proto = nullptr;
se::Class* __jsb_cc_gfx_Color_class = nullptr;

static bool js_gfx_Color_get_r(se::State& s)
{
    cc::gfx::Color* cobj = (cc::gfx::Color*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_r : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->r, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_r)

static bool js_gfx_Color_set_r(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Color* cobj = (cc::gfx::Color*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_r : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_r : Error processing new value");
    cobj->r = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_r)

static bool js_gfx_Color_get_g(se::State& s)
{
    cc::gfx::Color* cobj = (cc::gfx::Color*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_g : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->g, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_g)

static bool js_gfx_Color_set_g(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Color* cobj = (cc::gfx::Color*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_g : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_g : Error processing new value");
    cobj->g = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_g)

static bool js_gfx_Color_get_b(se::State& s)
{
    cc::gfx::Color* cobj = (cc::gfx::Color*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->b, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_b)

static bool js_gfx_Color_set_b(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Color* cobj = (cc::gfx::Color*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_b : Error processing new value");
    cobj->b = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_b)

static bool js_gfx_Color_get_a(se::State& s)
{
    cc::gfx::Color* cobj = (cc::gfx::Color*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->a, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_a)

static bool js_gfx_Color_set_a(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Color* cobj = (cc::gfx::Color*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_a : Error processing new value");
    cobj->a = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_a)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Color_finalize)

static bool js_gfx_Color_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Color* cobj = JSB_ALLOC(cc::gfx::Color);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Color* cobj = JSB_ALLOC(cc::gfx::Color);
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
        cc::gfx::Color* cobj = JSB_ALLOC(cc::gfx::Color);
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
SE_BIND_CTOR(js_gfx_Color_constructor, __jsb_cc_gfx_Color_class, js_cc_gfx_Color_finalize)




static bool js_cc_gfx_Color_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Color* cobj = (cc::gfx::Color*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Color_finalize)

bool js_register_gfx_Color(se::Object* obj)
{
    auto cls = se::Class::create("Color", obj, nullptr, _SE(js_gfx_Color_constructor));

    cls->defineProperty("r", _SE(js_gfx_Color_get_r), _SE(js_gfx_Color_set_r));
    cls->defineProperty("g", _SE(js_gfx_Color_get_g), _SE(js_gfx_Color_set_g));
    cls->defineProperty("b", _SE(js_gfx_Color_get_b), _SE(js_gfx_Color_set_b));
    cls->defineProperty("a", _SE(js_gfx_Color_get_a), _SE(js_gfx_Color_set_a));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Color_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Color>(cls);

    __jsb_cc_gfx_Color_proto = cls->getProto();
    __jsb_cc_gfx_Color_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DeviceInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DeviceInfo_class = nullptr;

static bool js_gfx_DeviceInfo_get_windowHandle(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    uintptr_t_to_seval(cobj->windowHandle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_windowHandle)

static bool js_gfx_DeviceInfo_set_windowHandle(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    uintptr_t arg0 = 0;
    ok &= seval_to_uintptr_t(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_windowHandle : Error processing new value");
    cobj->windowHandle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_windowHandle)

static bool js_gfx_DeviceInfo_get_width(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_width)

static bool js_gfx_DeviceInfo_set_width(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_width)

static bool js_gfx_DeviceInfo_get_height(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_height)

static bool js_gfx_DeviceInfo_set_height(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_height)

static bool js_gfx_DeviceInfo_get_nativeWidth(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_nativeWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->nativeWidth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_nativeWidth)

static bool js_gfx_DeviceInfo_set_nativeWidth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_nativeWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_nativeWidth : Error processing new value");
    cobj->nativeWidth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_nativeWidth)

static bool js_gfx_DeviceInfo_get_nativeHeight(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_nativeHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->nativeHeight, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_nativeHeight)

static bool js_gfx_DeviceInfo_set_nativeHeight(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_nativeHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_nativeHeight : Error processing new value");
    cobj->nativeHeight = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_nativeHeight)

static bool js_gfx_DeviceInfo_get_sharedCtx(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->sharedCtx, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_sharedCtx)

static bool js_gfx_DeviceInfo_set_sharedCtx(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Context* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_sharedCtx : Error processing new value");
    cobj->sharedCtx = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_sharedCtx)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DeviceInfo_finalize)

static bool js_gfx_DeviceInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DeviceInfo* cobj = JSB_ALLOC(cc::gfx::DeviceInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DeviceInfo* cobj = JSB_ALLOC(cc::gfx::DeviceInfo);
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
        cc::gfx::Context* arg5 = nullptr;
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
        cc::gfx::DeviceInfo* cobj = JSB_ALLOC(cc::gfx::DeviceInfo);
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
        cc::gfx::Context* arg5 = nullptr;
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
SE_BIND_CTOR(js_gfx_DeviceInfo_constructor, __jsb_cc_gfx_DeviceInfo_class, js_cc_gfx_DeviceInfo_finalize)




static bool js_cc_gfx_DeviceInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DeviceInfo_finalize)

bool js_register_gfx_DeviceInfo(se::Object* obj)
{
    auto cls = se::Class::create("DeviceInfo", obj, nullptr, _SE(js_gfx_DeviceInfo_constructor));

    cls->defineProperty("windowHandle", _SE(js_gfx_DeviceInfo_get_windowHandle), _SE(js_gfx_DeviceInfo_set_windowHandle));
    cls->defineProperty("width", _SE(js_gfx_DeviceInfo_get_width), _SE(js_gfx_DeviceInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_DeviceInfo_get_height), _SE(js_gfx_DeviceInfo_set_height));
    cls->defineProperty("nativeWidth", _SE(js_gfx_DeviceInfo_get_nativeWidth), _SE(js_gfx_DeviceInfo_set_nativeWidth));
    cls->defineProperty("nativeHeight", _SE(js_gfx_DeviceInfo_get_nativeHeight), _SE(js_gfx_DeviceInfo_set_nativeHeight));
    cls->defineProperty("sharedCtx", _SE(js_gfx_DeviceInfo_get_sharedCtx), _SE(js_gfx_DeviceInfo_set_sharedCtx));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DeviceInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DeviceInfo>(cls);

    __jsb_cc_gfx_DeviceInfo_proto = cls->getProto();
    __jsb_cc_gfx_DeviceInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ContextInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_ContextInfo_class = nullptr;

static bool js_gfx_ContextInfo_get_windowHandle(se::State& s)
{
    cc::gfx::ContextInfo* cobj = (cc::gfx::ContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    uintptr_t_to_seval(cobj->windowHandle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ContextInfo_get_windowHandle)

static bool js_gfx_ContextInfo_set_windowHandle(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ContextInfo* cobj = (cc::gfx::ContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    uintptr_t arg0 = 0;
    ok &= seval_to_uintptr_t(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_ContextInfo_set_windowHandle : Error processing new value");
    cobj->windowHandle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ContextInfo_set_windowHandle)

static bool js_gfx_ContextInfo_get_sharedCtx(se::State& s)
{
    cc::gfx::ContextInfo* cobj = (cc::gfx::ContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_get_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->sharedCtx, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ContextInfo_get_sharedCtx)

static bool js_gfx_ContextInfo_set_sharedCtx(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ContextInfo* cobj = (cc::gfx::ContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_set_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Context* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_ContextInfo_set_sharedCtx : Error processing new value");
    cobj->sharedCtx = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ContextInfo_set_sharedCtx)

static bool js_gfx_ContextInfo_get_vsyncMode(se::State& s)
{
    cc::gfx::ContextInfo* cobj = (cc::gfx::ContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_get_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->vsyncMode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ContextInfo_get_vsyncMode)

static bool js_gfx_ContextInfo_set_vsyncMode(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ContextInfo* cobj = (cc::gfx::ContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_set_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::VsyncMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::VsyncMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_ContextInfo_set_vsyncMode : Error processing new value");
    cobj->vsyncMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ContextInfo_set_vsyncMode)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ContextInfo_finalize)

static bool js_gfx_ContextInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ContextInfo* cobj = JSB_ALLOC(cc::gfx::ContextInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ContextInfo* cobj = JSB_ALLOC(cc::gfx::ContextInfo);
        uintptr_t arg0 = 0;
        json->getProperty("windowHandle", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uintptr_t(field, &arg0);
            cobj->windowHandle = arg0;
        }
        cc::gfx::Context* arg1 = nullptr;
        json->getProperty("sharedCtx", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg1);
            cobj->sharedCtx = arg1;
        }
        cc::gfx::VsyncMode arg2;
        json->getProperty("vsyncMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::VsyncMode)tmp; } while(false);
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
        cc::gfx::ContextInfo* cobj = JSB_ALLOC(cc::gfx::ContextInfo);
        uintptr_t arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uintptr_t(args[0], &arg0);
            cobj->windowHandle = arg0;
        }
        cc::gfx::Context* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_native_ptr(args[1], &arg1);
            cobj->sharedCtx = arg1;
        }
        cc::gfx::VsyncMode arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::VsyncMode)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_ContextInfo_constructor, __jsb_cc_gfx_ContextInfo_class, js_cc_gfx_ContextInfo_finalize)




static bool js_cc_gfx_ContextInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ContextInfo* cobj = (cc::gfx::ContextInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ContextInfo_finalize)

bool js_register_gfx_ContextInfo(se::Object* obj)
{
    auto cls = se::Class::create("ContextInfo", obj, nullptr, _SE(js_gfx_ContextInfo_constructor));

    cls->defineProperty("windowHandle", _SE(js_gfx_ContextInfo_get_windowHandle), _SE(js_gfx_ContextInfo_set_windowHandle));
    cls->defineProperty("sharedCtx", _SE(js_gfx_ContextInfo_get_sharedCtx), _SE(js_gfx_ContextInfo_set_sharedCtx));
    cls->defineProperty("vsyncMode", _SE(js_gfx_ContextInfo_get_vsyncMode), _SE(js_gfx_ContextInfo_set_vsyncMode));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ContextInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ContextInfo>(cls);

    __jsb_cc_gfx_ContextInfo_proto = cls->getProto();
    __jsb_cc_gfx_ContextInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_BufferInfo_class = nullptr;

static bool js_gfx_BufferInfo_get_usage(se::State& s)
{
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->usage, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_usage)

static bool js_gfx_BufferInfo_set_usage(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BufferUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BufferUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_usage : Error processing new value");
    cobj->usage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_usage)

static bool js_gfx_BufferInfo_get_memUsage(se::State& s)
{
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_memUsage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->memUsage, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_memUsage)

static bool js_gfx_BufferInfo_set_memUsage(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_memUsage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::MemoryUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::MemoryUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_memUsage : Error processing new value");
    cobj->memUsage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_memUsage)

static bool js_gfx_BufferInfo_get_stride(se::State& s)
{
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stride, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_stride)

static bool js_gfx_BufferInfo_set_stride(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_stride : Error processing new value");
    cobj->stride = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_stride)

static bool js_gfx_BufferInfo_get_size(se::State& s)
{
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->size, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_size)

static bool js_gfx_BufferInfo_set_size(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_size : Error processing new value");
    cobj->size = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_size)

static bool js_gfx_BufferInfo_get_flags(se::State& s)
{
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->flags, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_flags)

static bool js_gfx_BufferInfo_set_flags(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BufferFlagBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BufferFlagBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_flags : Error processing new value");
    cobj->flags = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_flags)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BufferInfo_finalize)

static bool js_gfx_BufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BufferInfo* cobj = JSB_ALLOC(cc::gfx::BufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BufferInfo* cobj = JSB_ALLOC(cc::gfx::BufferInfo);
        cc::gfx::BufferUsageBit arg0;
        json->getProperty("usage", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::BufferUsageBit)tmp; } while(false);
            cobj->usage = arg0;
        }
        cc::gfx::MemoryUsageBit arg1;
        json->getProperty("memUsage", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::MemoryUsageBit)tmp; } while(false);
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
        cc::gfx::BufferFlagBit arg4;
        json->getProperty("flags", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::BufferFlagBit)tmp; } while(false);
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
        cc::gfx::BufferInfo* cobj = JSB_ALLOC(cc::gfx::BufferInfo);
        cc::gfx::BufferUsageBit arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BufferUsageBit)tmp; } while(false);
            cobj->usage = arg0;
        }
        cc::gfx::MemoryUsageBit arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::MemoryUsageBit)tmp; } while(false);
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
        cc::gfx::BufferFlagBit arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::BufferFlagBit)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_BufferInfo_constructor, __jsb_cc_gfx_BufferInfo_class, js_cc_gfx_BufferInfo_finalize)




static bool js_cc_gfx_BufferInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BufferInfo* cobj = (cc::gfx::BufferInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BufferInfo_finalize)

bool js_register_gfx_BufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("BufferInfo", obj, nullptr, _SE(js_gfx_BufferInfo_constructor));

    cls->defineProperty("usage", _SE(js_gfx_BufferInfo_get_usage), _SE(js_gfx_BufferInfo_set_usage));
    cls->defineProperty("memUsage", _SE(js_gfx_BufferInfo_get_memUsage), _SE(js_gfx_BufferInfo_set_memUsage));
    cls->defineProperty("stride", _SE(js_gfx_BufferInfo_get_stride), _SE(js_gfx_BufferInfo_set_stride));
    cls->defineProperty("size", _SE(js_gfx_BufferInfo_get_size), _SE(js_gfx_BufferInfo_set_size));
    cls->defineProperty("flags", _SE(js_gfx_BufferInfo_get_flags), _SE(js_gfx_BufferInfo_set_flags));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BufferInfo>(cls);

    __jsb_cc_gfx_BufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_BufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DrawInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DrawInfo_class = nullptr;

static bool js_gfx_DrawInfo_get_vertexCount(se::State& s)
{
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_vertexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->vertexCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_vertexCount)

static bool js_gfx_DrawInfo_set_vertexCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_vertexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_vertexCount : Error processing new value");
    cobj->vertexCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_vertexCount)

static bool js_gfx_DrawInfo_get_firstVertex(se::State& s)
{
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_firstVertex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->firstVertex, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_firstVertex)

static bool js_gfx_DrawInfo_set_firstVertex(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_firstVertex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_firstVertex : Error processing new value");
    cobj->firstVertex = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_firstVertex)

static bool js_gfx_DrawInfo_get_indexCount(se::State& s)
{
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_indexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->indexCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_indexCount)

static bool js_gfx_DrawInfo_set_indexCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_indexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_indexCount : Error processing new value");
    cobj->indexCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_indexCount)

static bool js_gfx_DrawInfo_get_firstIndex(se::State& s)
{
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_firstIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->firstIndex, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_firstIndex)

static bool js_gfx_DrawInfo_set_firstIndex(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_firstIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_firstIndex : Error processing new value");
    cobj->firstIndex = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_firstIndex)

static bool js_gfx_DrawInfo_get_vertexOffset(se::State& s)
{
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_vertexOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->vertexOffset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_vertexOffset)

static bool js_gfx_DrawInfo_set_vertexOffset(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_vertexOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_vertexOffset : Error processing new value");
    cobj->vertexOffset = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_vertexOffset)

static bool js_gfx_DrawInfo_get_instanceCount(se::State& s)
{
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_instanceCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->instanceCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_instanceCount)

static bool js_gfx_DrawInfo_set_instanceCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_instanceCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_instanceCount : Error processing new value");
    cobj->instanceCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_instanceCount)

static bool js_gfx_DrawInfo_get_firstInstance(se::State& s)
{
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_firstInstance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->firstInstance, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_firstInstance)

static bool js_gfx_DrawInfo_set_firstInstance(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_firstInstance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_firstInstance : Error processing new value");
    cobj->firstInstance = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_firstInstance)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DrawInfo_finalize)

static bool js_gfx_DrawInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DrawInfo* cobj = JSB_ALLOC(cc::gfx::DrawInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DrawInfo* cobj = JSB_ALLOC(cc::gfx::DrawInfo);
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
        cc::gfx::DrawInfo* cobj = JSB_ALLOC(cc::gfx::DrawInfo);
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
SE_BIND_CTOR(js_gfx_DrawInfo_constructor, __jsb_cc_gfx_DrawInfo_class, js_cc_gfx_DrawInfo_finalize)




static bool js_cc_gfx_DrawInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DrawInfo* cobj = (cc::gfx::DrawInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DrawInfo_finalize)

bool js_register_gfx_DrawInfo(se::Object* obj)
{
    auto cls = se::Class::create("DrawInfo", obj, nullptr, _SE(js_gfx_DrawInfo_constructor));

    cls->defineProperty("vertexCount", _SE(js_gfx_DrawInfo_get_vertexCount), _SE(js_gfx_DrawInfo_set_vertexCount));
    cls->defineProperty("firstVertex", _SE(js_gfx_DrawInfo_get_firstVertex), _SE(js_gfx_DrawInfo_set_firstVertex));
    cls->defineProperty("indexCount", _SE(js_gfx_DrawInfo_get_indexCount), _SE(js_gfx_DrawInfo_set_indexCount));
    cls->defineProperty("firstIndex", _SE(js_gfx_DrawInfo_get_firstIndex), _SE(js_gfx_DrawInfo_set_firstIndex));
    cls->defineProperty("vertexOffset", _SE(js_gfx_DrawInfo_get_vertexOffset), _SE(js_gfx_DrawInfo_set_vertexOffset));
    cls->defineProperty("instanceCount", _SE(js_gfx_DrawInfo_get_instanceCount), _SE(js_gfx_DrawInfo_set_instanceCount));
    cls->defineProperty("firstInstance", _SE(js_gfx_DrawInfo_get_firstInstance), _SE(js_gfx_DrawInfo_set_firstInstance));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DrawInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DrawInfo>(cls);

    __jsb_cc_gfx_DrawInfo_proto = cls->getProto();
    __jsb_cc_gfx_DrawInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_IndirectBuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_IndirectBuffer_class = nullptr;

static bool js_gfx_IndirectBuffer_get_drawInfos(se::State& s)
{
    cc::gfx::IndirectBuffer* cobj = (cc::gfx::IndirectBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndirectBuffer_get_drawInfos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->drawInfos, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_IndirectBuffer_get_drawInfos)

static bool js_gfx_IndirectBuffer_set_drawInfos(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::IndirectBuffer* cobj = (cc::gfx::IndirectBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndirectBuffer_set_drawInfos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::DrawInfo> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_IndirectBuffer_set_drawInfos : Error processing new value");
    cobj->drawInfos = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_IndirectBuffer_set_drawInfos)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_IndirectBuffer_finalize)

static bool js_gfx_IndirectBuffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::IndirectBuffer* cobj = JSB_ALLOC(cc::gfx::IndirectBuffer);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cc::gfx::IndirectBuffer* cobj = JSB_ALLOC(cc::gfx::IndirectBuffer);
        std::vector<cc::gfx::DrawInfo> arg0;
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
SE_BIND_CTOR(js_gfx_IndirectBuffer_constructor, __jsb_cc_gfx_IndirectBuffer_class, js_cc_gfx_IndirectBuffer_finalize)




static bool js_cc_gfx_IndirectBuffer_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::IndirectBuffer* cobj = (cc::gfx::IndirectBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_IndirectBuffer_finalize)

bool js_register_gfx_IndirectBuffer(se::Object* obj)
{
    auto cls = se::Class::create("IndirectBuffer", obj, nullptr, _SE(js_gfx_IndirectBuffer_constructor));

    cls->defineProperty("drawInfos", _SE(js_gfx_IndirectBuffer_get_drawInfos), _SE(js_gfx_IndirectBuffer_set_drawInfos));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_IndirectBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::IndirectBuffer>(cls);

    __jsb_cc_gfx_IndirectBuffer_proto = cls->getProto();
    __jsb_cc_gfx_IndirectBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_TextureInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureInfo_class = nullptr;

static bool js_gfx_TextureInfo_get_type(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_type)

static bool js_gfx_TextureInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::TextureType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_type)

static bool js_gfx_TextureInfo_get_usage(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->usage, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_usage)

static bool js_gfx_TextureInfo_set_usage(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::TextureUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_usage : Error processing new value");
    cobj->usage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_usage)

static bool js_gfx_TextureInfo_get_format(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_format)

static bool js_gfx_TextureInfo_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Format arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Format)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_format)

static bool js_gfx_TextureInfo_get_width(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_width)

static bool js_gfx_TextureInfo_set_width(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_width : Error processing new value");
    cobj->width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_width)

static bool js_gfx_TextureInfo_get_height(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_height)

static bool js_gfx_TextureInfo_set_height(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_height : Error processing new value");
    cobj->height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_height)

static bool js_gfx_TextureInfo_get_depth(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->depth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_depth)

static bool js_gfx_TextureInfo_set_depth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_depth : Error processing new value");
    cobj->depth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_depth)

static bool js_gfx_TextureInfo_get_arrayLayer(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_arrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->arrayLayer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_arrayLayer)

static bool js_gfx_TextureInfo_set_arrayLayer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_arrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_arrayLayer : Error processing new value");
    cobj->arrayLayer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_arrayLayer)

static bool js_gfx_TextureInfo_get_mipLevel(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->mipLevel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_mipLevel)

static bool js_gfx_TextureInfo_set_mipLevel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_mipLevel : Error processing new value");
    cobj->mipLevel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_mipLevel)

static bool js_gfx_TextureInfo_get_samples(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_samples : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->samples, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_samples)

static bool js_gfx_TextureInfo_set_samples(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_samples : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::SampleCount arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::SampleCount)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_samples : Error processing new value");
    cobj->samples = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_samples)

static bool js_gfx_TextureInfo_get_flags(se::State& s)
{
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->flags, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_flags)

static bool js_gfx_TextureInfo_set_flags(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureFlagBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::TextureFlagBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_flags : Error processing new value");
    cobj->flags = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_flags)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureInfo_finalize)

static bool js_gfx_TextureInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::TextureInfo* cobj = JSB_ALLOC(cc::gfx::TextureInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureInfo* cobj = JSB_ALLOC(cc::gfx::TextureInfo);
        cc::gfx::TextureType arg0;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::TextureType)tmp; } while(false);
            cobj->type = arg0;
        }
        cc::gfx::TextureUsageBit arg1;
        json->getProperty("usage", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::TextureUsageBit)tmp; } while(false);
            cobj->usage = arg1;
        }
        cc::gfx::Format arg2;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::Format)tmp; } while(false);
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
        cc::gfx::SampleCount arg8;
        json->getProperty("samples", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cc::gfx::SampleCount)tmp; } while(false);
            cobj->samples = arg8;
        }
        cc::gfx::TextureFlagBit arg9;
        json->getProperty("flags", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cc::gfx::TextureFlagBit)tmp; } while(false);
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
        cc::gfx::TextureInfo* cobj = JSB_ALLOC(cc::gfx::TextureInfo);
        cc::gfx::TextureType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::TextureType)tmp; } while(false);
            cobj->type = arg0;
        }
        cc::gfx::TextureUsageBit arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::TextureUsageBit)tmp; } while(false);
            cobj->usage = arg1;
        }
        cc::gfx::Format arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::Format)tmp; } while(false);
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
        cc::gfx::SampleCount arg8;
        if (!args[8].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cc::gfx::SampleCount)tmp; } while(false);
            cobj->samples = arg8;
        }
        cc::gfx::TextureFlagBit arg9;
        if (!args[9].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cc::gfx::TextureFlagBit)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_TextureInfo_constructor, __jsb_cc_gfx_TextureInfo_class, js_cc_gfx_TextureInfo_finalize)




static bool js_cc_gfx_TextureInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::TextureInfo* cobj = (cc::gfx::TextureInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureInfo_finalize)

bool js_register_gfx_TextureInfo(se::Object* obj)
{
    auto cls = se::Class::create("TextureInfo", obj, nullptr, _SE(js_gfx_TextureInfo_constructor));

    cls->defineProperty("type", _SE(js_gfx_TextureInfo_get_type), _SE(js_gfx_TextureInfo_set_type));
    cls->defineProperty("usage", _SE(js_gfx_TextureInfo_get_usage), _SE(js_gfx_TextureInfo_set_usage));
    cls->defineProperty("format", _SE(js_gfx_TextureInfo_get_format), _SE(js_gfx_TextureInfo_set_format));
    cls->defineProperty("width", _SE(js_gfx_TextureInfo_get_width), _SE(js_gfx_TextureInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_TextureInfo_get_height), _SE(js_gfx_TextureInfo_set_height));
    cls->defineProperty("depth", _SE(js_gfx_TextureInfo_get_depth), _SE(js_gfx_TextureInfo_set_depth));
    cls->defineProperty("arrayLayer", _SE(js_gfx_TextureInfo_get_arrayLayer), _SE(js_gfx_TextureInfo_set_arrayLayer));
    cls->defineProperty("mipLevel", _SE(js_gfx_TextureInfo_get_mipLevel), _SE(js_gfx_TextureInfo_set_mipLevel));
    cls->defineProperty("samples", _SE(js_gfx_TextureInfo_get_samples), _SE(js_gfx_TextureInfo_set_samples));
    cls->defineProperty("flags", _SE(js_gfx_TextureInfo_get_flags), _SE(js_gfx_TextureInfo_set_flags));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureInfo>(cls);

    __jsb_cc_gfx_TextureInfo_proto = cls->getProto();
    __jsb_cc_gfx_TextureInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_TextureViewInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureViewInfo_class = nullptr;

static bool js_gfx_TextureViewInfo_get_texture(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texture, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_texture)

static bool js_gfx_TextureViewInfo_set_texture(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Texture* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_texture : Error processing new value");
    cobj->texture = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_texture)

static bool js_gfx_TextureViewInfo_get_type(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_type)

static bool js_gfx_TextureViewInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::TextureType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_type)

static bool js_gfx_TextureViewInfo_get_format(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_format)

static bool js_gfx_TextureViewInfo_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Format arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Format)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_format)

static bool js_gfx_TextureViewInfo_get_baseLevel(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_baseLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->baseLevel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_baseLevel)

static bool js_gfx_TextureViewInfo_set_baseLevel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_baseLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_baseLevel : Error processing new value");
    cobj->baseLevel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_baseLevel)

static bool js_gfx_TextureViewInfo_get_levelCount(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->levelCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_levelCount)

static bool js_gfx_TextureViewInfo_set_levelCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_levelCount : Error processing new value");
    cobj->levelCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_levelCount)

static bool js_gfx_TextureViewInfo_get_baseLayer(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_baseLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->baseLayer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_baseLayer)

static bool js_gfx_TextureViewInfo_set_baseLayer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_baseLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_baseLayer : Error processing new value");
    cobj->baseLayer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_baseLayer)

static bool js_gfx_TextureViewInfo_get_layerCount(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->layerCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_layerCount)

static bool js_gfx_TextureViewInfo_set_layerCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_layerCount : Error processing new value");
    cobj->layerCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_layerCount)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureViewInfo_finalize)

static bool js_gfx_TextureViewInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
        cc::gfx::Texture* arg0 = nullptr;
        json->getProperty("texture", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->texture = arg0;
        }
        cc::gfx::TextureType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::TextureType)tmp; } while(false);
            cobj->type = arg1;
        }
        cc::gfx::Format arg2;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::Format)tmp; } while(false);
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
        cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
        cc::gfx::Texture* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->texture = arg0;
        }
        cc::gfx::TextureType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::TextureType)tmp; } while(false);
            cobj->type = arg1;
        }
        cc::gfx::Format arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::Format)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_TextureViewInfo_constructor, __jsb_cc_gfx_TextureViewInfo_class, js_cc_gfx_TextureViewInfo_finalize)




static bool js_cc_gfx_TextureViewInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::TextureViewInfo* cobj = (cc::gfx::TextureViewInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureViewInfo_finalize)

bool js_register_gfx_TextureViewInfo(se::Object* obj)
{
    auto cls = se::Class::create("TextureViewInfo", obj, nullptr, _SE(js_gfx_TextureViewInfo_constructor));

    cls->defineProperty("texture", _SE(js_gfx_TextureViewInfo_get_texture), _SE(js_gfx_TextureViewInfo_set_texture));
    cls->defineProperty("type", _SE(js_gfx_TextureViewInfo_get_type), _SE(js_gfx_TextureViewInfo_set_type));
    cls->defineProperty("format", _SE(js_gfx_TextureViewInfo_get_format), _SE(js_gfx_TextureViewInfo_set_format));
    cls->defineProperty("baseLevel", _SE(js_gfx_TextureViewInfo_get_baseLevel), _SE(js_gfx_TextureViewInfo_set_baseLevel));
    cls->defineProperty("levelCount", _SE(js_gfx_TextureViewInfo_get_levelCount), _SE(js_gfx_TextureViewInfo_set_levelCount));
    cls->defineProperty("baseLayer", _SE(js_gfx_TextureViewInfo_get_baseLayer), _SE(js_gfx_TextureViewInfo_set_baseLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_TextureViewInfo_get_layerCount), _SE(js_gfx_TextureViewInfo_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureViewInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureViewInfo>(cls);

    __jsb_cc_gfx_TextureViewInfo_proto = cls->getProto();
    __jsb_cc_gfx_TextureViewInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_SamplerInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_SamplerInfo_class = nullptr;

static bool js_gfx_SamplerInfo_get_name(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_name)

static bool js_gfx_SamplerInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_name)

static bool js_gfx_SamplerInfo_get_minFilter(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->minFilter, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_minFilter)

static bool js_gfx_SamplerInfo_set_minFilter(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Filter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Filter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_minFilter : Error processing new value");
    cobj->minFilter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_minFilter)

static bool js_gfx_SamplerInfo_get_magFilter(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->magFilter, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_magFilter)

static bool js_gfx_SamplerInfo_set_magFilter(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Filter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Filter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_magFilter : Error processing new value");
    cobj->magFilter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_magFilter)

static bool js_gfx_SamplerInfo_get_mipFilter(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->mipFilter, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_mipFilter)

static bool js_gfx_SamplerInfo_set_mipFilter(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Filter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Filter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_mipFilter : Error processing new value");
    cobj->mipFilter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_mipFilter)

static bool js_gfx_SamplerInfo_get_addressU(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_addressU : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->addressU, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_addressU)

static bool js_gfx_SamplerInfo_set_addressU(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_addressU : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Address arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Address)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_addressU : Error processing new value");
    cobj->addressU = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_addressU)

static bool js_gfx_SamplerInfo_get_addressV(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_addressV : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->addressV, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_addressV)

static bool js_gfx_SamplerInfo_set_addressV(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_addressV : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Address arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Address)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_addressV : Error processing new value");
    cobj->addressV = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_addressV)

static bool js_gfx_SamplerInfo_get_addressW(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_addressW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->addressW, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_addressW)

static bool js_gfx_SamplerInfo_set_addressW(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_addressW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Address arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Address)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_addressW : Error processing new value");
    cobj->addressW = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_addressW)

static bool js_gfx_SamplerInfo_get_maxAnisotropy(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_maxAnisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->maxAnisotropy, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_maxAnisotropy)

static bool js_gfx_SamplerInfo_set_maxAnisotropy(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_maxAnisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_maxAnisotropy : Error processing new value");
    cobj->maxAnisotropy = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_maxAnisotropy)

static bool js_gfx_SamplerInfo_get_cmpFunc(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_cmpFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->cmpFunc, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_cmpFunc)

static bool js_gfx_SamplerInfo_set_cmpFunc(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_cmpFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_cmpFunc : Error processing new value");
    cobj->cmpFunc = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_cmpFunc)

static bool js_gfx_SamplerInfo_get_borderColor(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_borderColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_rooted_seval<cc::gfx::Color>((cc::gfx::Color*)&cobj->borderColor, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_borderColor)

static bool js_gfx_SamplerInfo_set_borderColor(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_borderColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Color* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_borderColor : Error processing new value");
    cobj->borderColor = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_borderColor)

static bool js_gfx_SamplerInfo_get_minLOD(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_minLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->minLOD, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_minLOD)

static bool js_gfx_SamplerInfo_set_minLOD(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_minLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_minLOD : Error processing new value");
    cobj->minLOD = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_minLOD)

static bool js_gfx_SamplerInfo_get_maxLOD(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_maxLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->maxLOD, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_maxLOD)

static bool js_gfx_SamplerInfo_set_maxLOD(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_maxLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_maxLOD : Error processing new value");
    cobj->maxLOD = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_maxLOD)

static bool js_gfx_SamplerInfo_get_mipLODBias(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_mipLODBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->mipLODBias, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_mipLODBias)

static bool js_gfx_SamplerInfo_set_mipLODBias(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_mipLODBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_mipLODBias : Error processing new value");
    cobj->mipLODBias = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_mipLODBias)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_SamplerInfo_finalize)

static bool js_gfx_SamplerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::SamplerInfo* cobj = JSB_ALLOC(cc::gfx::SamplerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::SamplerInfo* cobj = JSB_ALLOC(cc::gfx::SamplerInfo);
        cc::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::Filter arg1;
        json->getProperty("minFilter", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::Filter)tmp; } while(false);
            cobj->minFilter = arg1;
        }
        cc::gfx::Filter arg2;
        json->getProperty("magFilter", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::Filter)tmp; } while(false);
            cobj->magFilter = arg2;
        }
        cc::gfx::Filter arg3;
        json->getProperty("mipFilter", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::Filter)tmp; } while(false);
            cobj->mipFilter = arg3;
        }
        cc::gfx::Address arg4;
        json->getProperty("addressU", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::Address)tmp; } while(false);
            cobj->addressU = arg4;
        }
        cc::gfx::Address arg5;
        json->getProperty("addressV", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cc::gfx::Address)tmp; } while(false);
            cobj->addressV = arg5;
        }
        cc::gfx::Address arg6;
        json->getProperty("addressW", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cc::gfx::Address)tmp; } while(false);
            cobj->addressW = arg6;
        }
        unsigned int arg7 = 0;
        json->getProperty("maxAnisotropy", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg7);
            cobj->maxAnisotropy = arg7;
        }
        cc::gfx::ComparisonFunc arg8;
        json->getProperty("cmpFunc", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cc::gfx::ComparisonFunc)tmp; } while(false);
            cobj->cmpFunc = arg8;
        }
        cc::gfx::Color* arg9 = nullptr;
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
        cc::gfx::SamplerInfo* cobj = JSB_ALLOC(cc::gfx::SamplerInfo);
        cc::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::Filter arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::Filter)tmp; } while(false);
            cobj->minFilter = arg1;
        }
        cc::gfx::Filter arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::Filter)tmp; } while(false);
            cobj->magFilter = arg2;
        }
        cc::gfx::Filter arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::Filter)tmp; } while(false);
            cobj->mipFilter = arg3;
        }
        cc::gfx::Address arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::Address)tmp; } while(false);
            cobj->addressU = arg4;
        }
        cc::gfx::Address arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cc::gfx::Address)tmp; } while(false);
            cobj->addressV = arg5;
        }
        cc::gfx::Address arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cc::gfx::Address)tmp; } while(false);
            cobj->addressW = arg6;
        }
        unsigned int arg7 = 0;
        if (!args[7].isUndefined()) {
            ok &= seval_to_uint32(args[7], (uint32_t*)&arg7);
            cobj->maxAnisotropy = arg7;
        }
        cc::gfx::ComparisonFunc arg8;
        if (!args[8].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cc::gfx::ComparisonFunc)tmp; } while(false);
            cobj->cmpFunc = arg8;
        }
        cc::gfx::Color* arg9 = nullptr;
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
SE_BIND_CTOR(js_gfx_SamplerInfo_constructor, __jsb_cc_gfx_SamplerInfo_class, js_cc_gfx_SamplerInfo_finalize)




static bool js_cc_gfx_SamplerInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::SamplerInfo* cobj = (cc::gfx::SamplerInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_SamplerInfo_finalize)

bool js_register_gfx_SamplerInfo(se::Object* obj)
{
    auto cls = se::Class::create("SamplerInfo", obj, nullptr, _SE(js_gfx_SamplerInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_SamplerInfo_get_name), _SE(js_gfx_SamplerInfo_set_name));
    cls->defineProperty("minFilter", _SE(js_gfx_SamplerInfo_get_minFilter), _SE(js_gfx_SamplerInfo_set_minFilter));
    cls->defineProperty("magFilter", _SE(js_gfx_SamplerInfo_get_magFilter), _SE(js_gfx_SamplerInfo_set_magFilter));
    cls->defineProperty("mipFilter", _SE(js_gfx_SamplerInfo_get_mipFilter), _SE(js_gfx_SamplerInfo_set_mipFilter));
    cls->defineProperty("addressU", _SE(js_gfx_SamplerInfo_get_addressU), _SE(js_gfx_SamplerInfo_set_addressU));
    cls->defineProperty("addressV", _SE(js_gfx_SamplerInfo_get_addressV), _SE(js_gfx_SamplerInfo_set_addressV));
    cls->defineProperty("addressW", _SE(js_gfx_SamplerInfo_get_addressW), _SE(js_gfx_SamplerInfo_set_addressW));
    cls->defineProperty("maxAnisotropy", _SE(js_gfx_SamplerInfo_get_maxAnisotropy), _SE(js_gfx_SamplerInfo_set_maxAnisotropy));
    cls->defineProperty("cmpFunc", _SE(js_gfx_SamplerInfo_get_cmpFunc), _SE(js_gfx_SamplerInfo_set_cmpFunc));
    cls->defineProperty("borderColor", _SE(js_gfx_SamplerInfo_get_borderColor), _SE(js_gfx_SamplerInfo_set_borderColor));
    cls->defineProperty("minLOD", _SE(js_gfx_SamplerInfo_get_minLOD), _SE(js_gfx_SamplerInfo_set_minLOD));
    cls->defineProperty("maxLOD", _SE(js_gfx_SamplerInfo_get_maxLOD), _SE(js_gfx_SamplerInfo_set_maxLOD));
    cls->defineProperty("mipLODBias", _SE(js_gfx_SamplerInfo_get_mipLODBias), _SE(js_gfx_SamplerInfo_set_mipLODBias));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_SamplerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::SamplerInfo>(cls);

    __jsb_cc_gfx_SamplerInfo_proto = cls->getProto();
    __jsb_cc_gfx_SamplerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ShaderMacro_proto = nullptr;
se::Class* __jsb_cc_gfx_ShaderMacro_class = nullptr;

static bool js_gfx_ShaderMacro_get_macro(se::State& s)
{
    cc::gfx::ShaderMacro* cobj = (cc::gfx::ShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderMacro_get_macro : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->macro);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderMacro_get_macro)

static bool js_gfx_ShaderMacro_set_macro(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderMacro* cobj = (cc::gfx::ShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderMacro_set_macro : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderMacro_set_macro : Error processing new value");
    cobj->macro = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderMacro_set_macro)

static bool js_gfx_ShaderMacro_get_value(se::State& s)
{
    cc::gfx::ShaderMacro* cobj = (cc::gfx::ShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderMacro_get_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->value);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderMacro_get_value)

static bool js_gfx_ShaderMacro_set_value(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderMacro* cobj = (cc::gfx::ShaderMacro*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderMacro_set_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderMacro_set_value : Error processing new value");
    cobj->value = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderMacro_set_value)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ShaderMacro_finalize)

static bool js_gfx_ShaderMacro_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ShaderMacro* cobj = JSB_ALLOC(cc::gfx::ShaderMacro);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ShaderMacro* cobj = JSB_ALLOC(cc::gfx::ShaderMacro);
        cc::String arg0;
        json->getProperty("macro", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->macro = arg0;
        }
        cc::String arg1;
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
        cc::gfx::ShaderMacro* cobj = JSB_ALLOC(cc::gfx::ShaderMacro);
        cc::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->macro = arg0;
        }
        cc::String arg1;
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
SE_BIND_CTOR(js_gfx_ShaderMacro_constructor, __jsb_cc_gfx_ShaderMacro_class, js_cc_gfx_ShaderMacro_finalize)




static bool js_cc_gfx_ShaderMacro_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ShaderMacro* cobj = (cc::gfx::ShaderMacro*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ShaderMacro_finalize)

bool js_register_gfx_ShaderMacro(se::Object* obj)
{
    auto cls = se::Class::create("ShaderMacro", obj, nullptr, _SE(js_gfx_ShaderMacro_constructor));

    cls->defineProperty("macro", _SE(js_gfx_ShaderMacro_get_macro), _SE(js_gfx_ShaderMacro_set_macro));
    cls->defineProperty("value", _SE(js_gfx_ShaderMacro_get_value), _SE(js_gfx_ShaderMacro_set_value));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ShaderMacro_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ShaderMacro>(cls);

    __jsb_cc_gfx_ShaderMacro_proto = cls->getProto();
    __jsb_cc_gfx_ShaderMacro_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Uniform_proto = nullptr;
se::Class* __jsb_cc_gfx_Uniform_class = nullptr;

static bool js_gfx_Uniform_get_name(se::State& s)
{
    cc::gfx::Uniform* cobj = (cc::gfx::Uniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Uniform_get_name)

static bool js_gfx_Uniform_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Uniform* cobj = (cc::gfx::Uniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_Uniform_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Uniform_set_name)

static bool js_gfx_Uniform_get_type(se::State& s)
{
    cc::gfx::Uniform* cobj = (cc::gfx::Uniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Uniform_get_type)

static bool js_gfx_Uniform_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Uniform* cobj = (cc::gfx::Uniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Type arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Type)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_Uniform_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Uniform_set_type)

static bool js_gfx_Uniform_get_count(se::State& s)
{
    cc::gfx::Uniform* cobj = (cc::gfx::Uniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Uniform_get_count)

static bool js_gfx_Uniform_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Uniform* cobj = (cc::gfx::Uniform*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Uniform_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Uniform_set_count)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Uniform_finalize)

static bool js_gfx_Uniform_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Uniform* cobj = JSB_ALLOC(cc::gfx::Uniform);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Uniform* cobj = JSB_ALLOC(cc::gfx::Uniform);
        cc::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::Type arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::Type)tmp; } while(false);
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
        cc::gfx::Uniform* cobj = JSB_ALLOC(cc::gfx::Uniform);
        cc::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::Type arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::Type)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_Uniform_constructor, __jsb_cc_gfx_Uniform_class, js_cc_gfx_Uniform_finalize)




static bool js_cc_gfx_Uniform_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Uniform* cobj = (cc::gfx::Uniform*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Uniform_finalize)

bool js_register_gfx_Uniform(se::Object* obj)
{
    auto cls = se::Class::create("Uniform", obj, nullptr, _SE(js_gfx_Uniform_constructor));

    cls->defineProperty("name", _SE(js_gfx_Uniform_get_name), _SE(js_gfx_Uniform_set_name));
    cls->defineProperty("type", _SE(js_gfx_Uniform_get_type), _SE(js_gfx_Uniform_set_type));
    cls->defineProperty("count", _SE(js_gfx_Uniform_get_count), _SE(js_gfx_Uniform_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Uniform_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Uniform>(cls);

    __jsb_cc_gfx_Uniform_proto = cls->getProto();
    __jsb_cc_gfx_Uniform_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_UniformBlock_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformBlock_class = nullptr;

static bool js_gfx_UniformBlock_get_shaderStages(se::State& s)
{
    cc::gfx::UniformBlock* cobj = (cc::gfx::UniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shaderStages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_shaderStages)

static bool js_gfx_UniformBlock_set_shaderStages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformBlock* cobj = (cc::gfx::UniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_shaderStages : Error processing new value");
    cobj->shaderStages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_shaderStages)

static bool js_gfx_UniformBlock_get_binding(se::State& s)
{
    cc::gfx::UniformBlock* cobj = (cc::gfx::UniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->binding, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_binding)

static bool js_gfx_UniformBlock_set_binding(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformBlock* cobj = (cc::gfx::UniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_binding : Error processing new value");
    cobj->binding = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_binding)

static bool js_gfx_UniformBlock_get_name(se::State& s)
{
    cc::gfx::UniformBlock* cobj = (cc::gfx::UniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_name)

static bool js_gfx_UniformBlock_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformBlock* cobj = (cc::gfx::UniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_name)

static bool js_gfx_UniformBlock_get_uniforms(se::State& s)
{
    cc::gfx::UniformBlock* cobj = (cc::gfx::UniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_uniforms : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->uniforms, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_uniforms)

static bool js_gfx_UniformBlock_set_uniforms(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformBlock* cobj = (cc::gfx::UniformBlock*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_uniforms : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::Uniform> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_uniforms : Error processing new value");
    cobj->uniforms = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_uniforms)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformBlock_finalize)

static bool js_gfx_UniformBlock_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::UniformBlock* cobj = JSB_ALLOC(cc::gfx::UniformBlock);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformBlock* cobj = JSB_ALLOC(cc::gfx::UniformBlock);
        cc::gfx::ShaderType arg0;
        json->getProperty("shaderStages", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::String arg2;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg2 = field.toStringForce().c_str();
            cobj->name = arg2;
        }
        std::vector<cc::gfx::Uniform> arg3;
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
        cc::gfx::UniformBlock* cobj = JSB_ALLOC(cc::gfx::UniformBlock);
        cc::gfx::ShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::String arg2;
        if (!args[2].isUndefined()) {
            arg2 = args[2].toStringForce().c_str();
            cobj->name = arg2;
        }
        std::vector<cc::gfx::Uniform> arg3;
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
SE_BIND_CTOR(js_gfx_UniformBlock_constructor, __jsb_cc_gfx_UniformBlock_class, js_cc_gfx_UniformBlock_finalize)




static bool js_cc_gfx_UniformBlock_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::UniformBlock* cobj = (cc::gfx::UniformBlock*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformBlock_finalize)

bool js_register_gfx_UniformBlock(se::Object* obj)
{
    auto cls = se::Class::create("UniformBlock", obj, nullptr, _SE(js_gfx_UniformBlock_constructor));

    cls->defineProperty("shaderStages", _SE(js_gfx_UniformBlock_get_shaderStages), _SE(js_gfx_UniformBlock_set_shaderStages));
    cls->defineProperty("binding", _SE(js_gfx_UniformBlock_get_binding), _SE(js_gfx_UniformBlock_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformBlock_get_name), _SE(js_gfx_UniformBlock_set_name));
    cls->defineProperty("uniforms", _SE(js_gfx_UniformBlock_get_uniforms), _SE(js_gfx_UniformBlock_set_uniforms));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformBlock_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformBlock>(cls);

    __jsb_cc_gfx_UniformBlock_proto = cls->getProto();
    __jsb_cc_gfx_UniformBlock_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_UniformSampler_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformSampler_class = nullptr;

static bool js_gfx_UniformSampler_get_shaderStages(se::State& s)
{
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shaderStages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_shaderStages)

static bool js_gfx_UniformSampler_set_shaderStages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_shaderStages : Error processing new value");
    cobj->shaderStages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_shaderStages)

static bool js_gfx_UniformSampler_get_binding(se::State& s)
{
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->binding, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_binding)

static bool js_gfx_UniformSampler_set_binding(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_binding : Error processing new value");
    cobj->binding = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_binding)

static bool js_gfx_UniformSampler_get_name(se::State& s)
{
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_name)

static bool js_gfx_UniformSampler_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_name)

static bool js_gfx_UniformSampler_get_type(se::State& s)
{
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_type)

static bool js_gfx_UniformSampler_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Type arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Type)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_type)

static bool js_gfx_UniformSampler_get_count(se::State& s)
{
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_count)

static bool js_gfx_UniformSampler_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_count)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformSampler_finalize)

static bool js_gfx_UniformSampler_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::UniformSampler* cobj = JSB_ALLOC(cc::gfx::UniformSampler);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformSampler* cobj = JSB_ALLOC(cc::gfx::UniformSampler);
        cc::gfx::ShaderType arg0;
        json->getProperty("shaderStages", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::String arg2;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg2 = field.toStringForce().c_str();
            cobj->name = arg2;
        }
        cc::gfx::Type arg3;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::Type)tmp; } while(false);
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
        cc::gfx::UniformSampler* cobj = JSB_ALLOC(cc::gfx::UniformSampler);
        cc::gfx::ShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::String arg2;
        if (!args[2].isUndefined()) {
            arg2 = args[2].toStringForce().c_str();
            cobj->name = arg2;
        }
        cc::gfx::Type arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::Type)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_UniformSampler_constructor, __jsb_cc_gfx_UniformSampler_class, js_cc_gfx_UniformSampler_finalize)




static bool js_cc_gfx_UniformSampler_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::UniformSampler* cobj = (cc::gfx::UniformSampler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformSampler_finalize)

bool js_register_gfx_UniformSampler(se::Object* obj)
{
    auto cls = se::Class::create("UniformSampler", obj, nullptr, _SE(js_gfx_UniformSampler_constructor));

    cls->defineProperty("shaderStages", _SE(js_gfx_UniformSampler_get_shaderStages), _SE(js_gfx_UniformSampler_set_shaderStages));
    cls->defineProperty("binding", _SE(js_gfx_UniformSampler_get_binding), _SE(js_gfx_UniformSampler_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformSampler_get_name), _SE(js_gfx_UniformSampler_set_name));
    cls->defineProperty("type", _SE(js_gfx_UniformSampler_get_type), _SE(js_gfx_UniformSampler_set_type));
    cls->defineProperty("count", _SE(js_gfx_UniformSampler_get_count), _SE(js_gfx_UniformSampler_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformSampler>(cls);

    __jsb_cc_gfx_UniformSampler_proto = cls->getProto();
    __jsb_cc_gfx_UniformSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ShaderStage_proto = nullptr;
se::Class* __jsb_cc_gfx_ShaderStage_class = nullptr;

static bool js_gfx_ShaderStage_get_type(se::State& s)
{
    cc::gfx::ShaderStage* cobj = (cc::gfx::ShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderStage_get_type)

static bool js_gfx_ShaderStage_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderStage* cobj = (cc::gfx::ShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderStage_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderStage_set_type)

static bool js_gfx_ShaderStage_get_source(se::State& s)
{
    cc::gfx::ShaderStage* cobj = (cc::gfx::ShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_get_source : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->source);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderStage_get_source)

static bool js_gfx_ShaderStage_set_source(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderStage* cobj = (cc::gfx::ShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_set_source : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderStage_set_source : Error processing new value");
    cobj->source = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderStage_set_source)

static bool js_gfx_ShaderStage_get_macros(se::State& s)
{
    cc::gfx::ShaderStage* cobj = (cc::gfx::ShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_get_macros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->macros, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderStage_get_macros)

static bool js_gfx_ShaderStage_set_macros(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderStage* cobj = (cc::gfx::ShaderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_set_macros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::ShaderMacro> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderStage_set_macros : Error processing new value");
    cobj->macros = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderStage_set_macros)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ShaderStage_finalize)

static bool js_gfx_ShaderStage_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ShaderStage* cobj = JSB_ALLOC(cc::gfx::ShaderStage);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ShaderStage* cobj = JSB_ALLOC(cc::gfx::ShaderStage);
        cc::gfx::ShaderType arg0;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
            cobj->type = arg0;
        }
        cc::String arg1;
        json->getProperty("source", &field);
        if(!field.isUndefined()) {
            arg1 = field.toStringForce().c_str();
            cobj->source = arg1;
        }
        std::vector<cc::gfx::ShaderMacro> arg2;
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
        cc::gfx::ShaderStage* cobj = JSB_ALLOC(cc::gfx::ShaderStage);
        cc::gfx::ShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
            cobj->type = arg0;
        }
        cc::String arg1;
        if (!args[1].isUndefined()) {
            arg1 = args[1].toStringForce().c_str();
            cobj->source = arg1;
        }
        std::vector<cc::gfx::ShaderMacro> arg2;
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
SE_BIND_CTOR(js_gfx_ShaderStage_constructor, __jsb_cc_gfx_ShaderStage_class, js_cc_gfx_ShaderStage_finalize)




static bool js_cc_gfx_ShaderStage_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ShaderStage* cobj = (cc::gfx::ShaderStage*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ShaderStage_finalize)

bool js_register_gfx_ShaderStage(se::Object* obj)
{
    auto cls = se::Class::create("ShaderStage", obj, nullptr, _SE(js_gfx_ShaderStage_constructor));

    cls->defineProperty("type", _SE(js_gfx_ShaderStage_get_type), _SE(js_gfx_ShaderStage_set_type));
    cls->defineProperty("source", _SE(js_gfx_ShaderStage_get_source), _SE(js_gfx_ShaderStage_set_source));
    cls->defineProperty("macros", _SE(js_gfx_ShaderStage_get_macros), _SE(js_gfx_ShaderStage_set_macros));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ShaderStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ShaderStage>(cls);

    __jsb_cc_gfx_ShaderStage_proto = cls->getProto();
    __jsb_cc_gfx_ShaderStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Attribute_proto = nullptr;
se::Class* __jsb_cc_gfx_Attribute_class = nullptr;

static bool js_gfx_Attribute_get_name(se::State& s)
{
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_name)

static bool js_gfx_Attribute_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_name)

static bool js_gfx_Attribute_get_format(se::State& s)
{
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_format)

static bool js_gfx_Attribute_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Format arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Format)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_format)

static bool js_gfx_Attribute_get_isNormalized(se::State& s)
{
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isNormalized, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_isNormalized)

static bool js_gfx_Attribute_set_isNormalized(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_isNormalized : Error processing new value");
    cobj->isNormalized = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_isNormalized)

static bool js_gfx_Attribute_get_stream(se::State& s)
{
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stream, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_stream)

static bool js_gfx_Attribute_set_stream(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_stream : Error processing new value");
    cobj->stream = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_stream)

static bool js_gfx_Attribute_get_isInstanced(se::State& s)
{
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isInstanced, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_isInstanced)

static bool js_gfx_Attribute_set_isInstanced(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_isInstanced : Error processing new value");
    cobj->isInstanced = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_isInstanced)

static bool js_gfx_Attribute_get_location(se::State& s)
{
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->location, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_location)

static bool js_gfx_Attribute_set_location(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_location : Error processing new value");
    cobj->location = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_location)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Attribute_finalize)

static bool js_gfx_Attribute_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
        cc::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::Format arg1;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::Format)tmp; } while(false);
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
        cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
        cc::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        cc::gfx::Format arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::Format)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_Attribute_constructor, __jsb_cc_gfx_Attribute_class, js_cc_gfx_Attribute_finalize)




static bool js_cc_gfx_Attribute_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Attribute* cobj = (cc::gfx::Attribute*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Attribute_finalize)

bool js_register_gfx_Attribute(se::Object* obj)
{
    auto cls = se::Class::create("Attribute", obj, nullptr, _SE(js_gfx_Attribute_constructor));

    cls->defineProperty("name", _SE(js_gfx_Attribute_get_name), _SE(js_gfx_Attribute_set_name));
    cls->defineProperty("format", _SE(js_gfx_Attribute_get_format), _SE(js_gfx_Attribute_set_format));
    cls->defineProperty("isNormalized", _SE(js_gfx_Attribute_get_isNormalized), _SE(js_gfx_Attribute_set_isNormalized));
    cls->defineProperty("stream", _SE(js_gfx_Attribute_get_stream), _SE(js_gfx_Attribute_set_stream));
    cls->defineProperty("isInstanced", _SE(js_gfx_Attribute_get_isInstanced), _SE(js_gfx_Attribute_set_isInstanced));
    cls->defineProperty("location", _SE(js_gfx_Attribute_get_location), _SE(js_gfx_Attribute_set_location));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Attribute_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Attribute>(cls);

    __jsb_cc_gfx_Attribute_proto = cls->getProto();
    __jsb_cc_gfx_Attribute_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ShaderInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_ShaderInfo_class = nullptr;

static bool js_gfx_ShaderInfo_get_name(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_name)

static bool js_gfx_ShaderInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_name)

static bool js_gfx_ShaderInfo_get_stages(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->stages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_stages)

static bool js_gfx_ShaderInfo_set_stages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::ShaderStage> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_stages : Error processing new value");
    cobj->stages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_stages)

static bool js_gfx_ShaderInfo_get_attributes(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->attributes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_attributes)

static bool js_gfx_ShaderInfo_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::Attribute> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_attributes : Error processing new value");
    cobj->attributes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_attributes)

static bool js_gfx_ShaderInfo_get_blocks(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->blocks, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_blocks)

static bool js_gfx_ShaderInfo_set_blocks(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::UniformBlock> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_blocks : Error processing new value");
    cobj->blocks = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_blocks)

static bool js_gfx_ShaderInfo_get_samplers(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->samplers, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_samplers)

static bool js_gfx_ShaderInfo_set_samplers(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::UniformSampler> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_samplers : Error processing new value");
    cobj->samplers = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_samplers)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ShaderInfo_finalize)

static bool js_gfx_ShaderInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ShaderInfo* cobj = JSB_ALLOC(cc::gfx::ShaderInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ShaderInfo* cobj = JSB_ALLOC(cc::gfx::ShaderInfo);
        cc::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        std::vector<cc::gfx::ShaderStage> arg1;
        json->getProperty("stages", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->stages = arg1;
        }
        std::vector<cc::gfx::Attribute> arg2;
        json->getProperty("attributes", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg2);
            cobj->attributes = arg2;
        }
        std::vector<cc::gfx::UniformBlock> arg3;
        json->getProperty("blocks", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg3);
            cobj->blocks = arg3;
        }
        std::vector<cc::gfx::UniformSampler> arg4;
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
        cc::gfx::ShaderInfo* cobj = JSB_ALLOC(cc::gfx::ShaderInfo);
        cc::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        std::vector<cc::gfx::ShaderStage> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->stages = arg1;
        }
        std::vector<cc::gfx::Attribute> arg2;
        if (!args[2].isUndefined()) {
            ok &= seval_to_std_vector(args[2], &arg2);
            cobj->attributes = arg2;
        }
        std::vector<cc::gfx::UniformBlock> arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_std_vector(args[3], &arg3);
            cobj->blocks = arg3;
        }
        std::vector<cc::gfx::UniformSampler> arg4;
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
SE_BIND_CTOR(js_gfx_ShaderInfo_constructor, __jsb_cc_gfx_ShaderInfo_class, js_cc_gfx_ShaderInfo_finalize)




static bool js_cc_gfx_ShaderInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ShaderInfo* cobj = (cc::gfx::ShaderInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ShaderInfo_finalize)

bool js_register_gfx_ShaderInfo(se::Object* obj)
{
    auto cls = se::Class::create("ShaderInfo", obj, nullptr, _SE(js_gfx_ShaderInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_ShaderInfo_get_name), _SE(js_gfx_ShaderInfo_set_name));
    cls->defineProperty("stages", _SE(js_gfx_ShaderInfo_get_stages), _SE(js_gfx_ShaderInfo_set_stages));
    cls->defineProperty("attributes", _SE(js_gfx_ShaderInfo_get_attributes), _SE(js_gfx_ShaderInfo_set_attributes));
    cls->defineProperty("blocks", _SE(js_gfx_ShaderInfo_get_blocks), _SE(js_gfx_ShaderInfo_set_blocks));
    cls->defineProperty("samplers", _SE(js_gfx_ShaderInfo_get_samplers), _SE(js_gfx_ShaderInfo_set_samplers));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ShaderInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ShaderInfo>(cls);

    __jsb_cc_gfx_ShaderInfo_proto = cls->getProto();
    __jsb_cc_gfx_ShaderInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_InputAssemblerInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_InputAssemblerInfo_class = nullptr;

static bool js_gfx_InputAssemblerInfo_get_attributes(se::State& s)
{
    cc::gfx::InputAssemblerInfo* cobj = (cc::gfx::InputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->attributes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_attributes)

static bool js_gfx_InputAssemblerInfo_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputAssemblerInfo* cobj = (cc::gfx::InputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::Attribute> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_attributes : Error processing new value");
    cobj->attributes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_attributes)

static bool js_gfx_InputAssemblerInfo_get_vertexBuffers(se::State& s)
{
    cc::gfx::InputAssemblerInfo* cobj = (cc::gfx::InputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->vertexBuffers, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_vertexBuffers)

static bool js_gfx_InputAssemblerInfo_set_vertexBuffers(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputAssemblerInfo* cobj = (cc::gfx::InputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::Buffer *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_vertexBuffers : Error processing new value");
    cobj->vertexBuffers = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_vertexBuffers)

static bool js_gfx_InputAssemblerInfo_get_indexBuffer(se::State& s)
{
    cc::gfx::InputAssemblerInfo* cobj = (cc::gfx::InputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_indexBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->indexBuffer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_indexBuffer)

static bool js_gfx_InputAssemblerInfo_set_indexBuffer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputAssemblerInfo* cobj = (cc::gfx::InputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_indexBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Buffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_indexBuffer : Error processing new value");
    cobj->indexBuffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_indexBuffer)

static bool js_gfx_InputAssemblerInfo_get_indirectBuffer(se::State& s)
{
    cc::gfx::InputAssemblerInfo* cobj = (cc::gfx::InputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->indirectBuffer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_indirectBuffer)

static bool js_gfx_InputAssemblerInfo_set_indirectBuffer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputAssemblerInfo* cobj = (cc::gfx::InputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Buffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_indirectBuffer : Error processing new value");
    cobj->indirectBuffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_indirectBuffer)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_InputAssemblerInfo_finalize)

static bool js_gfx_InputAssemblerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::InputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::InputAssemblerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::InputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::InputAssemblerInfo);
        std::vector<cc::gfx::Attribute> arg0;
        json->getProperty("attributes", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg0);
            cobj->attributes = arg0;
        }
        std::vector<cc::gfx::Buffer *> arg1;
        json->getProperty("vertexBuffers", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->vertexBuffers = arg1;
        }
        cc::gfx::Buffer* arg2 = nullptr;
        json->getProperty("indexBuffer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg2);
            cobj->indexBuffer = arg2;
        }
        cc::gfx::Buffer* arg3 = nullptr;
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
        cc::gfx::InputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::InputAssemblerInfo);
        std::vector<cc::gfx::Attribute> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->attributes = arg0;
        }
        std::vector<cc::gfx::Buffer *> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->vertexBuffers = arg1;
        }
        cc::gfx::Buffer* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_native_ptr(args[2], &arg2);
            cobj->indexBuffer = arg2;
        }
        cc::gfx::Buffer* arg3 = nullptr;
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
SE_BIND_CTOR(js_gfx_InputAssemblerInfo_constructor, __jsb_cc_gfx_InputAssemblerInfo_class, js_cc_gfx_InputAssemblerInfo_finalize)




static bool js_cc_gfx_InputAssemblerInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::InputAssemblerInfo* cobj = (cc::gfx::InputAssemblerInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_InputAssemblerInfo_finalize)

bool js_register_gfx_InputAssemblerInfo(se::Object* obj)
{
    auto cls = se::Class::create("InputAssemblerInfo", obj, nullptr, _SE(js_gfx_InputAssemblerInfo_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_InputAssemblerInfo_get_attributes), _SE(js_gfx_InputAssemblerInfo_set_attributes));
    cls->defineProperty("vertexBuffers", _SE(js_gfx_InputAssemblerInfo_get_vertexBuffers), _SE(js_gfx_InputAssemblerInfo_set_vertexBuffers));
    cls->defineProperty("indexBuffer", _SE(js_gfx_InputAssemblerInfo_get_indexBuffer), _SE(js_gfx_InputAssemblerInfo_set_indexBuffer));
    cls->defineProperty("indirectBuffer", _SE(js_gfx_InputAssemblerInfo_get_indirectBuffer), _SE(js_gfx_InputAssemblerInfo_set_indirectBuffer));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_InputAssemblerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::InputAssemblerInfo>(cls);

    __jsb_cc_gfx_InputAssemblerInfo_proto = cls->getProto();
    __jsb_cc_gfx_InputAssemblerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ColorAttachment_proto = nullptr;
se::Class* __jsb_cc_gfx_ColorAttachment_class = nullptr;

static bool js_gfx_ColorAttachment_get_format(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_format)

static bool js_gfx_ColorAttachment_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Format arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Format)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_format)

static bool js_gfx_ColorAttachment_get_loadOp(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_loadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->loadOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_loadOp)

static bool js_gfx_ColorAttachment_set_loadOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_loadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::LoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::LoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_loadOp : Error processing new value");
    cobj->loadOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_loadOp)

static bool js_gfx_ColorAttachment_get_storeOp(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_storeOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->storeOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_storeOp)

static bool js_gfx_ColorAttachment_set_storeOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_storeOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::StoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_storeOp : Error processing new value");
    cobj->storeOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_storeOp)

static bool js_gfx_ColorAttachment_get_sampleCount(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->sampleCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_sampleCount)

static bool js_gfx_ColorAttachment_set_sampleCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_sampleCount : Error processing new value");
    cobj->sampleCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_sampleCount)

static bool js_gfx_ColorAttachment_get_beginLayout(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->beginLayout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_beginLayout)

static bool js_gfx_ColorAttachment_set_beginLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::TextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_beginLayout : Error processing new value");
    cobj->beginLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_beginLayout)

static bool js_gfx_ColorAttachment_get_endLayout(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->endLayout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_endLayout)

static bool js_gfx_ColorAttachment_set_endLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::TextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_endLayout : Error processing new value");
    cobj->endLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_endLayout)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ColorAttachment_finalize)

static bool js_gfx_ColorAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ColorAttachment* cobj = JSB_ALLOC(cc::gfx::ColorAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ColorAttachment* cobj = JSB_ALLOC(cc::gfx::ColorAttachment);
        cc::gfx::Format arg0;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::Format)tmp; } while(false);
            cobj->format = arg0;
        }
        cc::gfx::LoadOp arg1;
        json->getProperty("loadOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::LoadOp)tmp; } while(false);
            cobj->loadOp = arg1;
        }
        cc::gfx::StoreOp arg2;
        json->getProperty("storeOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::StoreOp)tmp; } while(false);
            cobj->storeOp = arg2;
        }
        unsigned int arg3 = 0;
        json->getProperty("sampleCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg3);
            cobj->sampleCount = arg3;
        }
        cc::gfx::TextureLayout arg4;
        json->getProperty("beginLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::TextureLayout)tmp; } while(false);
            cobj->beginLayout = arg4;
        }
        cc::gfx::TextureLayout arg5;
        json->getProperty("endLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cc::gfx::TextureLayout)tmp; } while(false);
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
        cc::gfx::ColorAttachment* cobj = JSB_ALLOC(cc::gfx::ColorAttachment);
        cc::gfx::Format arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Format)tmp; } while(false);
            cobj->format = arg0;
        }
        cc::gfx::LoadOp arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::LoadOp)tmp; } while(false);
            cobj->loadOp = arg1;
        }
        cc::gfx::StoreOp arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::StoreOp)tmp; } while(false);
            cobj->storeOp = arg2;
        }
        unsigned int arg3 = 0;
        if (!args[3].isUndefined()) {
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->sampleCount = arg3;
        }
        cc::gfx::TextureLayout arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::TextureLayout)tmp; } while(false);
            cobj->beginLayout = arg4;
        }
        cc::gfx::TextureLayout arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cc::gfx::TextureLayout)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_ColorAttachment_constructor, __jsb_cc_gfx_ColorAttachment_class, js_cc_gfx_ColorAttachment_finalize)




static bool js_cc_gfx_ColorAttachment_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ColorAttachment* cobj = (cc::gfx::ColorAttachment*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ColorAttachment_finalize)

bool js_register_gfx_ColorAttachment(se::Object* obj)
{
    auto cls = se::Class::create("ColorAttachment", obj, nullptr, _SE(js_gfx_ColorAttachment_constructor));

    cls->defineProperty("format", _SE(js_gfx_ColorAttachment_get_format), _SE(js_gfx_ColorAttachment_set_format));
    cls->defineProperty("loadOp", _SE(js_gfx_ColorAttachment_get_loadOp), _SE(js_gfx_ColorAttachment_set_loadOp));
    cls->defineProperty("storeOp", _SE(js_gfx_ColorAttachment_get_storeOp), _SE(js_gfx_ColorAttachment_set_storeOp));
    cls->defineProperty("sampleCount", _SE(js_gfx_ColorAttachment_get_sampleCount), _SE(js_gfx_ColorAttachment_set_sampleCount));
    cls->defineProperty("beginLayout", _SE(js_gfx_ColorAttachment_get_beginLayout), _SE(js_gfx_ColorAttachment_set_beginLayout));
    cls->defineProperty("endLayout", _SE(js_gfx_ColorAttachment_get_endLayout), _SE(js_gfx_ColorAttachment_set_endLayout));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ColorAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ColorAttachment>(cls);

    __jsb_cc_gfx_ColorAttachment_proto = cls->getProto();
    __jsb_cc_gfx_ColorAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DepthStencilAttachment_proto = nullptr;
se::Class* __jsb_cc_gfx_DepthStencilAttachment_class = nullptr;

static bool js_gfx_DepthStencilAttachment_get_format(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->format, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_format)

static bool js_gfx_DepthStencilAttachment_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Format arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Format)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_format : Error processing new value");
    cobj->format = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_format)

static bool js_gfx_DepthStencilAttachment_get_depthLoadOp(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_depthLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depthLoadOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_depthLoadOp)

static bool js_gfx_DepthStencilAttachment_set_depthLoadOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_depthLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::LoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::LoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_depthLoadOp : Error processing new value");
    cobj->depthLoadOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_depthLoadOp)

static bool js_gfx_DepthStencilAttachment_get_depthStoreOp(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_depthStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depthStoreOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_depthStoreOp)

static bool js_gfx_DepthStencilAttachment_set_depthStoreOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_depthStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::StoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_depthStoreOp : Error processing new value");
    cobj->depthStoreOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_depthStoreOp)

static bool js_gfx_DepthStencilAttachment_get_stencilLoadOp(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_stencilLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilLoadOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_stencilLoadOp)

static bool js_gfx_DepthStencilAttachment_set_stencilLoadOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_stencilLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::LoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::LoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_stencilLoadOp : Error processing new value");
    cobj->stencilLoadOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_stencilLoadOp)

static bool js_gfx_DepthStencilAttachment_get_stencilStoreOp(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_stencilStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilStoreOp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_stencilStoreOp)

static bool js_gfx_DepthStencilAttachment_set_stencilStoreOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_stencilStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::StoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_stencilStoreOp : Error processing new value");
    cobj->stencilStoreOp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_stencilStoreOp)

static bool js_gfx_DepthStencilAttachment_get_sampleCount(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->sampleCount, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_sampleCount)

static bool js_gfx_DepthStencilAttachment_set_sampleCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_sampleCount : Error processing new value");
    cobj->sampleCount = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_sampleCount)

static bool js_gfx_DepthStencilAttachment_get_beginLayout(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->beginLayout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_beginLayout)

static bool js_gfx_DepthStencilAttachment_set_beginLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::TextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_beginLayout : Error processing new value");
    cobj->beginLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_beginLayout)

static bool js_gfx_DepthStencilAttachment_get_endLayout(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->endLayout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_endLayout)

static bool js_gfx_DepthStencilAttachment_set_endLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::TextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::TextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_endLayout : Error processing new value");
    cobj->endLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_endLayout)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DepthStencilAttachment_finalize)

static bool js_gfx_DepthStencilAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::DepthStencilAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::DepthStencilAttachment);
        cc::gfx::Format arg0;
        json->getProperty("format", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::Format)tmp; } while(false);
            cobj->format = arg0;
        }
        cc::gfx::LoadOp arg1;
        json->getProperty("depthLoadOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::LoadOp)tmp; } while(false);
            cobj->depthLoadOp = arg1;
        }
        cc::gfx::StoreOp arg2;
        json->getProperty("depthStoreOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::StoreOp)tmp; } while(false);
            cobj->depthStoreOp = arg2;
        }
        cc::gfx::LoadOp arg3;
        json->getProperty("stencilLoadOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::LoadOp)tmp; } while(false);
            cobj->stencilLoadOp = arg3;
        }
        cc::gfx::StoreOp arg4;
        json->getProperty("stencilStoreOp", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::StoreOp)tmp; } while(false);
            cobj->stencilStoreOp = arg4;
        }
        unsigned int arg5 = 0;
        json->getProperty("sampleCount", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg5);
            cobj->sampleCount = arg5;
        }
        cc::gfx::TextureLayout arg6;
        json->getProperty("beginLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cc::gfx::TextureLayout)tmp; } while(false);
            cobj->beginLayout = arg6;
        }
        cc::gfx::TextureLayout arg7;
        json->getProperty("endLayout", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cc::gfx::TextureLayout)tmp; } while(false);
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
        cc::gfx::DepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::DepthStencilAttachment);
        cc::gfx::Format arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Format)tmp; } while(false);
            cobj->format = arg0;
        }
        cc::gfx::LoadOp arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::LoadOp)tmp; } while(false);
            cobj->depthLoadOp = arg1;
        }
        cc::gfx::StoreOp arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::StoreOp)tmp; } while(false);
            cobj->depthStoreOp = arg2;
        }
        cc::gfx::LoadOp arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::LoadOp)tmp; } while(false);
            cobj->stencilLoadOp = arg3;
        }
        cc::gfx::StoreOp arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::StoreOp)tmp; } while(false);
            cobj->stencilStoreOp = arg4;
        }
        unsigned int arg5 = 0;
        if (!args[5].isUndefined()) {
            ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
            cobj->sampleCount = arg5;
        }
        cc::gfx::TextureLayout arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cc::gfx::TextureLayout)tmp; } while(false);
            cobj->beginLayout = arg6;
        }
        cc::gfx::TextureLayout arg7;
        if (!args[7].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cc::gfx::TextureLayout)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_DepthStencilAttachment_constructor, __jsb_cc_gfx_DepthStencilAttachment_class, js_cc_gfx_DepthStencilAttachment_finalize)




static bool js_cc_gfx_DepthStencilAttachment_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DepthStencilAttachment* cobj = (cc::gfx::DepthStencilAttachment*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DepthStencilAttachment_finalize)

bool js_register_gfx_DepthStencilAttachment(se::Object* obj)
{
    auto cls = se::Class::create("DepthStencilAttachment", obj, nullptr, _SE(js_gfx_DepthStencilAttachment_constructor));

    cls->defineProperty("format", _SE(js_gfx_DepthStencilAttachment_get_format), _SE(js_gfx_DepthStencilAttachment_set_format));
    cls->defineProperty("depthLoadOp", _SE(js_gfx_DepthStencilAttachment_get_depthLoadOp), _SE(js_gfx_DepthStencilAttachment_set_depthLoadOp));
    cls->defineProperty("depthStoreOp", _SE(js_gfx_DepthStencilAttachment_get_depthStoreOp), _SE(js_gfx_DepthStencilAttachment_set_depthStoreOp));
    cls->defineProperty("stencilLoadOp", _SE(js_gfx_DepthStencilAttachment_get_stencilLoadOp), _SE(js_gfx_DepthStencilAttachment_set_stencilLoadOp));
    cls->defineProperty("stencilStoreOp", _SE(js_gfx_DepthStencilAttachment_get_stencilStoreOp), _SE(js_gfx_DepthStencilAttachment_set_stencilStoreOp));
    cls->defineProperty("sampleCount", _SE(js_gfx_DepthStencilAttachment_get_sampleCount), _SE(js_gfx_DepthStencilAttachment_set_sampleCount));
    cls->defineProperty("beginLayout", _SE(js_gfx_DepthStencilAttachment_get_beginLayout), _SE(js_gfx_DepthStencilAttachment_set_beginLayout));
    cls->defineProperty("endLayout", _SE(js_gfx_DepthStencilAttachment_get_endLayout), _SE(js_gfx_DepthStencilAttachment_set_endLayout));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DepthStencilAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DepthStencilAttachment>(cls);

    __jsb_cc_gfx_DepthStencilAttachment_proto = cls->getProto();
    __jsb_cc_gfx_DepthStencilAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_RenderPassInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_RenderPassInfo_class = nullptr;

static bool js_gfx_RenderPassInfo_get_colorAttachments(se::State& s)
{
    cc::gfx::RenderPassInfo* cobj = (cc::gfx::RenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->colorAttachments, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_colorAttachments)

static bool js_gfx_RenderPassInfo_set_colorAttachments(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RenderPassInfo* cobj = (cc::gfx::RenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::ColorAttachment> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_colorAttachments : Error processing new value");
    cobj->colorAttachments = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_colorAttachments)

static bool js_gfx_RenderPassInfo_get_depthStencilAttachment(se::State& s)
{
    cc::gfx::RenderPassInfo* cobj = (cc::gfx::RenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_depthStencilAttachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->depthStencilAttachment, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_depthStencilAttachment)

static bool js_gfx_RenderPassInfo_set_depthStencilAttachment(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RenderPassInfo* cobj = (cc::gfx::RenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_depthStencilAttachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::DepthStencilAttachment* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_depthStencilAttachment : Error processing new value");
    cobj->depthStencilAttachment = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_depthStencilAttachment)

static bool js_gfx_RenderPassInfo_get_subPasses(se::State& s)
{
    cc::gfx::RenderPassInfo* cobj = (cc::gfx::RenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_subPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->subPasses, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_subPasses)

static bool js_gfx_RenderPassInfo_set_subPasses(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RenderPassInfo* cobj = (cc::gfx::RenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_subPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::SubPass> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_subPasses : Error processing new value");
    cobj->subPasses = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_subPasses)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_RenderPassInfo_finalize)

static bool js_gfx_RenderPassInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::RenderPassInfo* cobj = JSB_ALLOC(cc::gfx::RenderPassInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::RenderPassInfo* cobj = JSB_ALLOC(cc::gfx::RenderPassInfo);
        std::vector<cc::gfx::ColorAttachment> arg0;
        json->getProperty("colorAttachments", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg0);
            cobj->colorAttachments = arg0;
        }
        cc::gfx::DepthStencilAttachment* arg1 = nullptr;
        json->getProperty("depthStencilAttachment", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg1);
            cobj->depthStencilAttachment = *arg1;
        }
        std::vector<cc::gfx::SubPass> arg2;
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
        cc::gfx::RenderPassInfo* cobj = JSB_ALLOC(cc::gfx::RenderPassInfo);
        std::vector<cc::gfx::ColorAttachment> arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_std_vector(args[0], &arg0);
            cobj->colorAttachments = arg0;
        }
        cc::gfx::DepthStencilAttachment* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_reference(args[1], &arg1);
            cobj->depthStencilAttachment = *arg1;
        }
        std::vector<cc::gfx::SubPass> arg2;
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
SE_BIND_CTOR(js_gfx_RenderPassInfo_constructor, __jsb_cc_gfx_RenderPassInfo_class, js_cc_gfx_RenderPassInfo_finalize)




static bool js_cc_gfx_RenderPassInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::RenderPassInfo* cobj = (cc::gfx::RenderPassInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_RenderPassInfo_finalize)

bool js_register_gfx_RenderPassInfo(se::Object* obj)
{
    auto cls = se::Class::create("RenderPassInfo", obj, nullptr, _SE(js_gfx_RenderPassInfo_constructor));

    cls->defineProperty("colorAttachments", _SE(js_gfx_RenderPassInfo_get_colorAttachments), _SE(js_gfx_RenderPassInfo_set_colorAttachments));
    cls->defineProperty("depthStencilAttachment", _SE(js_gfx_RenderPassInfo_get_depthStencilAttachment), _SE(js_gfx_RenderPassInfo_set_depthStencilAttachment));
    cls->defineProperty("subPasses", _SE(js_gfx_RenderPassInfo_get_subPasses), _SE(js_gfx_RenderPassInfo_set_subPasses));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_RenderPassInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::RenderPassInfo>(cls);

    __jsb_cc_gfx_RenderPassInfo_proto = cls->getProto();
    __jsb_cc_gfx_RenderPassInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_FramebufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_FramebufferInfo_class = nullptr;

static bool js_gfx_FramebufferInfo_get_renderPass(se::State& s)
{
    cc::gfx::FramebufferInfo* cobj = (cc::gfx::FramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->renderPass, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_renderPass)

static bool js_gfx_FramebufferInfo_set_renderPass(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FramebufferInfo* cobj = (cc::gfx::FramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::RenderPass* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_renderPass : Error processing new value");
    cobj->renderPass = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_renderPass)

static bool js_gfx_FramebufferInfo_get_colorTextures(se::State& s)
{
    cc::gfx::FramebufferInfo* cobj = (cc::gfx::FramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_colorTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->colorTextures, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_colorTextures)

static bool js_gfx_FramebufferInfo_set_colorTextures(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FramebufferInfo* cobj = (cc::gfx::FramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_colorTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::Texture *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_colorTextures : Error processing new value");
    cobj->colorTextures = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_colorTextures)

static bool js_gfx_FramebufferInfo_get_depthStencilTexture(se::State& s)
{
    cc::gfx::FramebufferInfo* cobj = (cc::gfx::FramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_depthStencilTexture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->depthStencilTexture, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_depthStencilTexture)

static bool js_gfx_FramebufferInfo_set_depthStencilTexture(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FramebufferInfo* cobj = (cc::gfx::FramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_depthStencilTexture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Texture* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_depthStencilTexture : Error processing new value");
    cobj->depthStencilTexture = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_depthStencilTexture)

static bool js_gfx_FramebufferInfo_get_depthStencilMipmapLevel(se::State& s)
{
    cc::gfx::FramebufferInfo* cobj = (cc::gfx::FramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_depthStencilMipmapLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depthStencilMipmapLevel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_depthStencilMipmapLevel)

static bool js_gfx_FramebufferInfo_set_depthStencilMipmapLevel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FramebufferInfo* cobj = (cc::gfx::FramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_depthStencilMipmapLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_depthStencilMipmapLevel : Error processing new value");
    cobj->depthStencilMipmapLevel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_depthStencilMipmapLevel)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_FramebufferInfo_finalize)

static bool js_gfx_FramebufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::FramebufferInfo* cobj = JSB_ALLOC(cc::gfx::FramebufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::FramebufferInfo* cobj = JSB_ALLOC(cc::gfx::FramebufferInfo);
        cc::gfx::RenderPass* arg0 = nullptr;
        json->getProperty("renderPass", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->renderPass = arg0;
        }
        std::vector<cc::gfx::Texture *> arg1;
        json->getProperty("colorTextures", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->colorTextures = arg1;
        }
        cc::gfx::Texture* arg2 = nullptr;
        json->getProperty("depthStencilTexture", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg2);
            cobj->depthStencilTexture = arg2;
        }
        int arg3 = 0;
        json->getProperty("depthStencilMipmapLevel", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (int)tmp; } while(false);
            cobj->depthStencilMipmapLevel = arg3;
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
        cc::gfx::FramebufferInfo* cobj = JSB_ALLOC(cc::gfx::FramebufferInfo);
        cc::gfx::RenderPass* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->renderPass = arg0;
        }
        std::vector<cc::gfx::Texture *> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->colorTextures = arg1;
        }
        cc::gfx::Texture* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_native_ptr(args[2], &arg2);
            cobj->depthStencilTexture = arg2;
        }
        int arg3 = 0;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (int)tmp; } while(false);
            cobj->depthStencilMipmapLevel = arg3;
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
SE_BIND_CTOR(js_gfx_FramebufferInfo_constructor, __jsb_cc_gfx_FramebufferInfo_class, js_cc_gfx_FramebufferInfo_finalize)




static bool js_cc_gfx_FramebufferInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::FramebufferInfo* cobj = (cc::gfx::FramebufferInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_FramebufferInfo_finalize)

bool js_register_gfx_FramebufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("FramebufferInfo", obj, nullptr, _SE(js_gfx_FramebufferInfo_constructor));

    cls->defineProperty("renderPass", _SE(js_gfx_FramebufferInfo_get_renderPass), _SE(js_gfx_FramebufferInfo_set_renderPass));
    cls->defineProperty("colorTextures", _SE(js_gfx_FramebufferInfo_get_colorTextures), _SE(js_gfx_FramebufferInfo_set_colorTextures));
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_FramebufferInfo_get_depthStencilTexture), _SE(js_gfx_FramebufferInfo_set_depthStencilTexture));
    cls->defineProperty("depthStencilMipmapLevel", _SE(js_gfx_FramebufferInfo_get_depthStencilMipmapLevel), _SE(js_gfx_FramebufferInfo_set_depthStencilMipmapLevel));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_FramebufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::FramebufferInfo>(cls);

    __jsb_cc_gfx_FramebufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_FramebufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BindingLayoutInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_BindingLayoutInfo_class = nullptr;

static bool js_gfx_BindingLayoutInfo_get_shader(se::State& s)
{
    cc::gfx::BindingLayoutInfo* cobj = (cc::gfx::BindingLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayoutInfo_get_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->shader, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingLayoutInfo_get_shader)

static bool js_gfx_BindingLayoutInfo_set_shader(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingLayoutInfo* cobj = (cc::gfx::BindingLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayoutInfo_set_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Shader* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BindingLayoutInfo_set_shader : Error processing new value");
    cobj->shader = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingLayoutInfo_set_shader)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BindingLayoutInfo_finalize)

static bool js_gfx_BindingLayoutInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BindingLayoutInfo* cobj = JSB_ALLOC(cc::gfx::BindingLayoutInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cc::gfx::BindingLayoutInfo* cobj = JSB_ALLOC(cc::gfx::BindingLayoutInfo);
        cc::gfx::Shader* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->shader = arg0;
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
SE_BIND_CTOR(js_gfx_BindingLayoutInfo_constructor, __jsb_cc_gfx_BindingLayoutInfo_class, js_cc_gfx_BindingLayoutInfo_finalize)




static bool js_cc_gfx_BindingLayoutInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BindingLayoutInfo* cobj = (cc::gfx::BindingLayoutInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BindingLayoutInfo_finalize)

bool js_register_gfx_BindingLayoutInfo(se::Object* obj)
{
    auto cls = se::Class::create("BindingLayoutInfo", obj, nullptr, _SE(js_gfx_BindingLayoutInfo_constructor));

    cls->defineProperty("shader", _SE(js_gfx_BindingLayoutInfo_get_shader), _SE(js_gfx_BindingLayoutInfo_set_shader));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BindingLayoutInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BindingLayoutInfo>(cls);

    __jsb_cc_gfx_BindingLayoutInfo_proto = cls->getProto();
    __jsb_cc_gfx_BindingLayoutInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BindingUnit_proto = nullptr;
se::Class* __jsb_cc_gfx_BindingUnit_class = nullptr;

static bool js_gfx_BindingUnit_get_shaderStages(se::State& s)
{
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_get_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shaderStages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingUnit_get_shaderStages)

static bool js_gfx_BindingUnit_set_shaderStages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_set_shaderStages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BindingUnit_set_shaderStages : Error processing new value");
    cobj->shaderStages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingUnit_set_shaderStages)

static bool js_gfx_BindingUnit_get_binding(se::State& s)
{
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->binding, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingUnit_get_binding)

static bool js_gfx_BindingUnit_set_binding(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BindingUnit_set_binding : Error processing new value");
    cobj->binding = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingUnit_set_binding)

static bool js_gfx_BindingUnit_get_type(se::State& s)
{
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingUnit_get_type)

static bool js_gfx_BindingUnit_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BindingType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BindingType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BindingUnit_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingUnit_set_type)

static bool js_gfx_BindingUnit_get_name(se::State& s)
{
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingUnit_get_name)

static bool js_gfx_BindingUnit_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_BindingUnit_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingUnit_set_name)

static bool js_gfx_BindingUnit_get_count(se::State& s)
{
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingUnit_get_count)

static bool js_gfx_BindingUnit_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BindingUnit_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingUnit_set_count)

static bool js_gfx_BindingUnit_get_buffer(se::State& s)
{
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_get_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->buffer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingUnit_get_buffer)

static bool js_gfx_BindingUnit_set_buffer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_set_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Buffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BindingUnit_set_buffer : Error processing new value");
    cobj->buffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingUnit_set_buffer)

static bool js_gfx_BindingUnit_get_texture(se::State& s)
{
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_get_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->texture, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingUnit_get_texture)

static bool js_gfx_BindingUnit_set_texture(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_set_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Texture* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BindingUnit_set_texture : Error processing new value");
    cobj->texture = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingUnit_set_texture)

static bool js_gfx_BindingUnit_get_sampler(se::State& s)
{
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_get_sampler : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->sampler, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingUnit_get_sampler)

static bool js_gfx_BindingUnit_set_sampler(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingUnit_set_sampler : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Sampler* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BindingUnit_set_sampler : Error processing new value");
    cobj->sampler = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingUnit_set_sampler)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BindingUnit_finalize)

static bool js_gfx_BindingUnit_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BindingUnit* cobj = JSB_ALLOC(cc::gfx::BindingUnit);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BindingUnit* cobj = JSB_ALLOC(cc::gfx::BindingUnit);
        cc::gfx::ShaderType arg0;
        json->getProperty("shaderStages", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("binding", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::BindingType arg2;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::BindingType)tmp; } while(false);
            cobj->type = arg2;
        }
        cc::String arg3;
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
        cc::gfx::Buffer* arg5 = nullptr;
        json->getProperty("buffer", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg5);
            cobj->buffer = arg5;
        }
        cc::gfx::Texture* arg6 = nullptr;
        json->getProperty("texture", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg6);
            cobj->texture = arg6;
        }
        cc::gfx::Sampler* arg7 = nullptr;
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
        cc::gfx::BindingUnit* cobj = JSB_ALLOC(cc::gfx::BindingUnit);
        cc::gfx::ShaderType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ShaderType)tmp; } while(false);
            cobj->shaderStages = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->binding = arg1;
        }
        cc::gfx::BindingType arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::BindingType)tmp; } while(false);
            cobj->type = arg2;
        }
        cc::String arg3;
        if (!args[3].isUndefined()) {
            arg3 = args[3].toStringForce().c_str();
            cobj->name = arg3;
        }
        unsigned int arg4 = 0;
        if (!args[4].isUndefined()) {
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->count = arg4;
        }
        cc::gfx::Buffer* arg5 = nullptr;
        if (!args[5].isUndefined()) {
            ok &= seval_to_native_ptr(args[5], &arg5);
            cobj->buffer = arg5;
        }
        cc::gfx::Texture* arg6 = nullptr;
        if (!args[6].isUndefined()) {
            ok &= seval_to_native_ptr(args[6], &arg6);
            cobj->texture = arg6;
        }
        cc::gfx::Sampler* arg7 = nullptr;
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
SE_BIND_CTOR(js_gfx_BindingUnit_constructor, __jsb_cc_gfx_BindingUnit_class, js_cc_gfx_BindingUnit_finalize)




static bool js_cc_gfx_BindingUnit_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BindingUnit* cobj = (cc::gfx::BindingUnit*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BindingUnit_finalize)

bool js_register_gfx_BindingUnit(se::Object* obj)
{
    auto cls = se::Class::create("BindingUnit", obj, nullptr, _SE(js_gfx_BindingUnit_constructor));

    cls->defineProperty("shaderStages", _SE(js_gfx_BindingUnit_get_shaderStages), _SE(js_gfx_BindingUnit_set_shaderStages));
    cls->defineProperty("binding", _SE(js_gfx_BindingUnit_get_binding), _SE(js_gfx_BindingUnit_set_binding));
    cls->defineProperty("type", _SE(js_gfx_BindingUnit_get_type), _SE(js_gfx_BindingUnit_set_type));
    cls->defineProperty("name", _SE(js_gfx_BindingUnit_get_name), _SE(js_gfx_BindingUnit_set_name));
    cls->defineProperty("count", _SE(js_gfx_BindingUnit_get_count), _SE(js_gfx_BindingUnit_set_count));
    cls->defineProperty("buffer", _SE(js_gfx_BindingUnit_get_buffer), _SE(js_gfx_BindingUnit_set_buffer));
    cls->defineProperty("texture", _SE(js_gfx_BindingUnit_get_texture), _SE(js_gfx_BindingUnit_set_texture));
    cls->defineProperty("sampler", _SE(js_gfx_BindingUnit_get_sampler), _SE(js_gfx_BindingUnit_set_sampler));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BindingUnit_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BindingUnit>(cls);

    __jsb_cc_gfx_BindingUnit_proto = cls->getProto();
    __jsb_cc_gfx_BindingUnit_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_InputState_proto = nullptr;
se::Class* __jsb_cc_gfx_InputState_class = nullptr;

static bool js_gfx_InputState_get_attributes(se::State& s)
{
    cc::gfx::InputState* cobj = (cc::gfx::InputState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputState_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->attributes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputState_get_attributes)

static bool js_gfx_InputState_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputState* cobj = (cc::gfx::InputState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputState_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::Attribute> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_InputState_set_attributes : Error processing new value");
    cobj->attributes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputState_set_attributes)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_InputState_finalize)

static bool js_gfx_InputState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::InputState* cobj = JSB_ALLOC(cc::gfx::InputState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cc::gfx::InputState* cobj = JSB_ALLOC(cc::gfx::InputState);
        std::vector<cc::gfx::Attribute> arg0;
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
SE_BIND_CTOR(js_gfx_InputState_constructor, __jsb_cc_gfx_InputState_class, js_cc_gfx_InputState_finalize)




static bool js_cc_gfx_InputState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::InputState* cobj = (cc::gfx::InputState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_InputState_finalize)

bool js_register_gfx_InputState(se::Object* obj)
{
    auto cls = se::Class::create("InputState", obj, nullptr, _SE(js_gfx_InputState_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_InputState_get_attributes), _SE(js_gfx_InputState_set_attributes));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_InputState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::InputState>(cls);

    __jsb_cc_gfx_InputState_proto = cls->getProto();
    __jsb_cc_gfx_InputState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_RasterizerState_proto = nullptr;
se::Class* __jsb_cc_gfx_RasterizerState_class = nullptr;

static bool js_gfx_RasterizerState_get_isDiscard(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isDiscard, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isDiscard)

static bool js_gfx_RasterizerState_set_isDiscard(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isDiscard : Error processing new value");
    cobj->isDiscard = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isDiscard)

static bool js_gfx_RasterizerState_get_polygonMode(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->polygonMode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_polygonMode)

static bool js_gfx_RasterizerState_set_polygonMode(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::PolygonMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::PolygonMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_polygonMode : Error processing new value");
    cobj->polygonMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_polygonMode)

static bool js_gfx_RasterizerState_get_shadeModel(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shadeModel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_shadeModel)

static bool js_gfx_RasterizerState_set_shadeModel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ShadeModel arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ShadeModel)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_shadeModel : Error processing new value");
    cobj->shadeModel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_shadeModel)

static bool js_gfx_RasterizerState_get_cullMode(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->cullMode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_cullMode)

static bool js_gfx_RasterizerState_set_cullMode(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::CullMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::CullMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_cullMode : Error processing new value");
    cobj->cullMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_cullMode)

static bool js_gfx_RasterizerState_get_isFrontFaceCCW(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isFrontFaceCCW, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isFrontFaceCCW)

static bool js_gfx_RasterizerState_set_isFrontFaceCCW(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isFrontFaceCCW : Error processing new value");
    cobj->isFrontFaceCCW = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isFrontFaceCCW)

static bool js_gfx_RasterizerState_get_depthBiasEnabled(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->depthBiasEnabled, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBiasEnabled)

static bool js_gfx_RasterizerState_set_depthBiasEnabled(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBiasEnabled : Error processing new value");
    cobj->depthBiasEnabled = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBiasEnabled)

static bool js_gfx_RasterizerState_get_depthBias(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->depthBias, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBias)

static bool js_gfx_RasterizerState_set_depthBias(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBias : Error processing new value");
    cobj->depthBias = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBias)

static bool js_gfx_RasterizerState_get_depthBiasClamp(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->depthBiasClamp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBiasClamp)

static bool js_gfx_RasterizerState_set_depthBiasClamp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBiasClamp : Error processing new value");
    cobj->depthBiasClamp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBiasClamp)

static bool js_gfx_RasterizerState_get_depthBiasSlop(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->depthBiasSlop, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBiasSlop)

static bool js_gfx_RasterizerState_set_depthBiasSlop(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBiasSlop : Error processing new value");
    cobj->depthBiasSlop = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBiasSlop)

static bool js_gfx_RasterizerState_get_isDepthClip(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isDepthClip, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isDepthClip)

static bool js_gfx_RasterizerState_set_isDepthClip(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isDepthClip : Error processing new value");
    cobj->isDepthClip = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isDepthClip)

static bool js_gfx_RasterizerState_get_isMultisample(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isMultisample, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isMultisample)

static bool js_gfx_RasterizerState_set_isMultisample(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isMultisample : Error processing new value");
    cobj->isMultisample = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isMultisample)

static bool js_gfx_RasterizerState_get_lineWidth(se::State& s)
{
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->lineWidth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_lineWidth)

static bool js_gfx_RasterizerState_set_lineWidth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_lineWidth : Error processing new value");
    cobj->lineWidth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_lineWidth)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_RasterizerState_finalize)

static bool js_gfx_RasterizerState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::RasterizerState* cobj = JSB_ALLOC(cc::gfx::RasterizerState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::RasterizerState* cobj = JSB_ALLOC(cc::gfx::RasterizerState);
        bool arg0;
        json->getProperty("isDiscard", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg0);
            cobj->isDiscard = arg0;
        }
        cc::gfx::PolygonMode arg1;
        json->getProperty("polygonMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::PolygonMode)tmp; } while(false);
            cobj->polygonMode = arg1;
        }
        cc::gfx::ShadeModel arg2;
        json->getProperty("shadeModel", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::ShadeModel)tmp; } while(false);
            cobj->shadeModel = arg2;
        }
        cc::gfx::CullMode arg3;
        json->getProperty("cullMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::CullMode)tmp; } while(false);
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
        cc::gfx::RasterizerState* cobj = JSB_ALLOC(cc::gfx::RasterizerState);
        bool arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->isDiscard = arg0;
        }
        cc::gfx::PolygonMode arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::PolygonMode)tmp; } while(false);
            cobj->polygonMode = arg1;
        }
        cc::gfx::ShadeModel arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::ShadeModel)tmp; } while(false);
            cobj->shadeModel = arg2;
        }
        cc::gfx::CullMode arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::CullMode)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_RasterizerState_constructor, __jsb_cc_gfx_RasterizerState_class, js_cc_gfx_RasterizerState_finalize)




static bool js_cc_gfx_RasterizerState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::RasterizerState* cobj = (cc::gfx::RasterizerState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_RasterizerState_finalize)

bool js_register_gfx_RasterizerState(se::Object* obj)
{
    auto cls = se::Class::create("RasterizerState", obj, nullptr, _SE(js_gfx_RasterizerState_constructor));

    cls->defineProperty("isDiscard", _SE(js_gfx_RasterizerState_get_isDiscard), _SE(js_gfx_RasterizerState_set_isDiscard));
    cls->defineProperty("polygonMode", _SE(js_gfx_RasterizerState_get_polygonMode), _SE(js_gfx_RasterizerState_set_polygonMode));
    cls->defineProperty("shadeModel", _SE(js_gfx_RasterizerState_get_shadeModel), _SE(js_gfx_RasterizerState_set_shadeModel));
    cls->defineProperty("cullMode", _SE(js_gfx_RasterizerState_get_cullMode), _SE(js_gfx_RasterizerState_set_cullMode));
    cls->defineProperty("isFrontFaceCCW", _SE(js_gfx_RasterizerState_get_isFrontFaceCCW), _SE(js_gfx_RasterizerState_set_isFrontFaceCCW));
    cls->defineProperty("depthBiasEnabled", _SE(js_gfx_RasterizerState_get_depthBiasEnabled), _SE(js_gfx_RasterizerState_set_depthBiasEnabled));
    cls->defineProperty("depthBias", _SE(js_gfx_RasterizerState_get_depthBias), _SE(js_gfx_RasterizerState_set_depthBias));
    cls->defineProperty("depthBiasClamp", _SE(js_gfx_RasterizerState_get_depthBiasClamp), _SE(js_gfx_RasterizerState_set_depthBiasClamp));
    cls->defineProperty("depthBiasSlop", _SE(js_gfx_RasterizerState_get_depthBiasSlop), _SE(js_gfx_RasterizerState_set_depthBiasSlop));
    cls->defineProperty("isDepthClip", _SE(js_gfx_RasterizerState_get_isDepthClip), _SE(js_gfx_RasterizerState_set_isDepthClip));
    cls->defineProperty("isMultisample", _SE(js_gfx_RasterizerState_get_isMultisample), _SE(js_gfx_RasterizerState_set_isMultisample));
    cls->defineProperty("lineWidth", _SE(js_gfx_RasterizerState_get_lineWidth), _SE(js_gfx_RasterizerState_set_lineWidth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_RasterizerState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::RasterizerState>(cls);

    __jsb_cc_gfx_RasterizerState_proto = cls->getProto();
    __jsb_cc_gfx_RasterizerState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DepthStencilState_proto = nullptr;
se::Class* __jsb_cc_gfx_DepthStencilState_class = nullptr;

static bool js_gfx_DepthStencilState_get_depthTest(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->depthTest, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_depthTest)

static bool js_gfx_DepthStencilState_set_depthTest(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_depthTest : Error processing new value");
    cobj->depthTest = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_depthTest)

static bool js_gfx_DepthStencilState_get_depthWrite(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->depthWrite, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_depthWrite)

static bool js_gfx_DepthStencilState_set_depthWrite(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_depthWrite : Error processing new value");
    cobj->depthWrite = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_depthWrite)

static bool js_gfx_DepthStencilState_get_depthFunc(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depthFunc, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_depthFunc)

static bool js_gfx_DepthStencilState_set_depthFunc(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_depthFunc : Error processing new value");
    cobj->depthFunc = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_depthFunc)

static bool js_gfx_DepthStencilState_get_stencilTestFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->stencilTestFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilTestFront)

static bool js_gfx_DepthStencilState_set_stencilTestFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilTestFront : Error processing new value");
    cobj->stencilTestFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilTestFront)

static bool js_gfx_DepthStencilState_get_stencilFuncFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilFuncFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFuncFront)

static bool js_gfx_DepthStencilState_set_stencilFuncFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFuncFront : Error processing new value");
    cobj->stencilFuncFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFuncFront)

static bool js_gfx_DepthStencilState_get_stencilReadMaskFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilReadMaskFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilReadMaskFront)

static bool js_gfx_DepthStencilState_set_stencilReadMaskFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilReadMaskFront : Error processing new value");
    cobj->stencilReadMaskFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilReadMaskFront)

static bool js_gfx_DepthStencilState_get_stencilWriteMaskFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilWriteMaskFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilWriteMaskFront)

static bool js_gfx_DepthStencilState_set_stencilWriteMaskFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilWriteMaskFront : Error processing new value");
    cobj->stencilWriteMaskFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilWriteMaskFront)

static bool js_gfx_DepthStencilState_get_stencilFailOpFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilFailOpFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFailOpFront)

static bool js_gfx_DepthStencilState_set_stencilFailOpFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::StencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFailOpFront : Error processing new value");
    cobj->stencilFailOpFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFailOpFront)

static bool js_gfx_DepthStencilState_get_stencilZFailOpFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilZFailOpFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilZFailOpFront)

static bool js_gfx_DepthStencilState_set_stencilZFailOpFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::StencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilZFailOpFront : Error processing new value");
    cobj->stencilZFailOpFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilZFailOpFront)

static bool js_gfx_DepthStencilState_get_stencilPassOpFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilPassOpFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilPassOpFront)

static bool js_gfx_DepthStencilState_set_stencilPassOpFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::StencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilPassOpFront : Error processing new value");
    cobj->stencilPassOpFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilPassOpFront)

static bool js_gfx_DepthStencilState_get_stencilRefFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilRefFront, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilRefFront)

static bool js_gfx_DepthStencilState_set_stencilRefFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilRefFront : Error processing new value");
    cobj->stencilRefFront = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilRefFront)

static bool js_gfx_DepthStencilState_get_stencilTestBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->stencilTestBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilTestBack)

static bool js_gfx_DepthStencilState_set_stencilTestBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilTestBack : Error processing new value");
    cobj->stencilTestBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilTestBack)

static bool js_gfx_DepthStencilState_get_stencilFuncBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilFuncBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFuncBack)

static bool js_gfx_DepthStencilState_set_stencilFuncBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFuncBack : Error processing new value");
    cobj->stencilFuncBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFuncBack)

static bool js_gfx_DepthStencilState_get_stencilReadMaskBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilReadMaskBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilReadMaskBack)

static bool js_gfx_DepthStencilState_set_stencilReadMaskBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilReadMaskBack : Error processing new value");
    cobj->stencilReadMaskBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilReadMaskBack)

static bool js_gfx_DepthStencilState_get_stencilWriteMaskBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilWriteMaskBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilWriteMaskBack)

static bool js_gfx_DepthStencilState_set_stencilWriteMaskBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilWriteMaskBack : Error processing new value");
    cobj->stencilWriteMaskBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilWriteMaskBack)

static bool js_gfx_DepthStencilState_get_stencilFailOpBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilFailOpBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFailOpBack)

static bool js_gfx_DepthStencilState_set_stencilFailOpBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::StencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFailOpBack : Error processing new value");
    cobj->stencilFailOpBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFailOpBack)

static bool js_gfx_DepthStencilState_get_stencilZFailOpBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilZFailOpBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilZFailOpBack)

static bool js_gfx_DepthStencilState_set_stencilZFailOpBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::StencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilZFailOpBack : Error processing new value");
    cobj->stencilZFailOpBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilZFailOpBack)

static bool js_gfx_DepthStencilState_get_stencilPassOpBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencilPassOpBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilPassOpBack)

static bool js_gfx_DepthStencilState_set_stencilPassOpBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::StencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilPassOpBack : Error processing new value");
    cobj->stencilPassOpBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilPassOpBack)

static bool js_gfx_DepthStencilState_get_stencilRefBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencilRefBack, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilRefBack)

static bool js_gfx_DepthStencilState_set_stencilRefBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilRefBack : Error processing new value");
    cobj->stencilRefBack = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilRefBack)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DepthStencilState_finalize)

static bool js_gfx_DepthStencilState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DepthStencilState* cobj = JSB_ALLOC(cc::gfx::DepthStencilState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DepthStencilState* cobj = JSB_ALLOC(cc::gfx::DepthStencilState);
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
        cc::gfx::ComparisonFunc arg2;
        json->getProperty("depthFunc", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::ComparisonFunc)tmp; } while(false);
            cobj->depthFunc = arg2;
        }
        bool arg3;
        json->getProperty("stencilTestFront", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg3);
            cobj->stencilTestFront = arg3;
        }
        cc::gfx::ComparisonFunc arg4;
        json->getProperty("stencilFuncFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::ComparisonFunc)tmp; } while(false);
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
        cc::gfx::StencilOp arg7;
        json->getProperty("stencilFailOpFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cc::gfx::StencilOp)tmp; } while(false);
            cobj->stencilFailOpFront = arg7;
        }
        cc::gfx::StencilOp arg8;
        json->getProperty("stencilZFailOpFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cc::gfx::StencilOp)tmp; } while(false);
            cobj->stencilZFailOpFront = arg8;
        }
        cc::gfx::StencilOp arg9;
        json->getProperty("stencilPassOpFront", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cc::gfx::StencilOp)tmp; } while(false);
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
        cc::gfx::ComparisonFunc arg12;
        json->getProperty("stencilFuncBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg12 = (cc::gfx::ComparisonFunc)tmp; } while(false);
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
        cc::gfx::StencilOp arg15;
        json->getProperty("stencilFailOpBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg15 = (cc::gfx::StencilOp)tmp; } while(false);
            cobj->stencilFailOpBack = arg15;
        }
        cc::gfx::StencilOp arg16;
        json->getProperty("stencilZFailOpBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg16 = (cc::gfx::StencilOp)tmp; } while(false);
            cobj->stencilZFailOpBack = arg16;
        }
        cc::gfx::StencilOp arg17;
        json->getProperty("stencilPassOpBack", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg17 = (cc::gfx::StencilOp)tmp; } while(false);
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
        cc::gfx::DepthStencilState* cobj = JSB_ALLOC(cc::gfx::DepthStencilState);
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
        cc::gfx::ComparisonFunc arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::ComparisonFunc)tmp; } while(false);
            cobj->depthFunc = arg2;
        }
        bool arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_boolean(args[3], &arg3);
            cobj->stencilTestFront = arg3;
        }
        cc::gfx::ComparisonFunc arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::ComparisonFunc)tmp; } while(false);
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
        cc::gfx::StencilOp arg7;
        if (!args[7].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cc::gfx::StencilOp)tmp; } while(false);
            cobj->stencilFailOpFront = arg7;
        }
        cc::gfx::StencilOp arg8;
        if (!args[8].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cc::gfx::StencilOp)tmp; } while(false);
            cobj->stencilZFailOpFront = arg8;
        }
        cc::gfx::StencilOp arg9;
        if (!args[9].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cc::gfx::StencilOp)tmp; } while(false);
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
        cc::gfx::ComparisonFunc arg12;
        if (!args[12].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[12], &tmp); arg12 = (cc::gfx::ComparisonFunc)tmp; } while(false);
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
        cc::gfx::StencilOp arg15;
        if (!args[15].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[15], &tmp); arg15 = (cc::gfx::StencilOp)tmp; } while(false);
            cobj->stencilFailOpBack = arg15;
        }
        cc::gfx::StencilOp arg16;
        if (!args[16].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[16], &tmp); arg16 = (cc::gfx::StencilOp)tmp; } while(false);
            cobj->stencilZFailOpBack = arg16;
        }
        cc::gfx::StencilOp arg17;
        if (!args[17].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[17], &tmp); arg17 = (cc::gfx::StencilOp)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_DepthStencilState_constructor, __jsb_cc_gfx_DepthStencilState_class, js_cc_gfx_DepthStencilState_finalize)




static bool js_cc_gfx_DepthStencilState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DepthStencilState* cobj = (cc::gfx::DepthStencilState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DepthStencilState_finalize)

bool js_register_gfx_DepthStencilState(se::Object* obj)
{
    auto cls = se::Class::create("DepthStencilState", obj, nullptr, _SE(js_gfx_DepthStencilState_constructor));

    cls->defineProperty("depthTest", _SE(js_gfx_DepthStencilState_get_depthTest), _SE(js_gfx_DepthStencilState_set_depthTest));
    cls->defineProperty("depthWrite", _SE(js_gfx_DepthStencilState_get_depthWrite), _SE(js_gfx_DepthStencilState_set_depthWrite));
    cls->defineProperty("depthFunc", _SE(js_gfx_DepthStencilState_get_depthFunc), _SE(js_gfx_DepthStencilState_set_depthFunc));
    cls->defineProperty("stencilTestFront", _SE(js_gfx_DepthStencilState_get_stencilTestFront), _SE(js_gfx_DepthStencilState_set_stencilTestFront));
    cls->defineProperty("stencilFuncFront", _SE(js_gfx_DepthStencilState_get_stencilFuncFront), _SE(js_gfx_DepthStencilState_set_stencilFuncFront));
    cls->defineProperty("stencilReadMaskFront", _SE(js_gfx_DepthStencilState_get_stencilReadMaskFront), _SE(js_gfx_DepthStencilState_set_stencilReadMaskFront));
    cls->defineProperty("stencilWriteMaskFront", _SE(js_gfx_DepthStencilState_get_stencilWriteMaskFront), _SE(js_gfx_DepthStencilState_set_stencilWriteMaskFront));
    cls->defineProperty("stencilFailOpFront", _SE(js_gfx_DepthStencilState_get_stencilFailOpFront), _SE(js_gfx_DepthStencilState_set_stencilFailOpFront));
    cls->defineProperty("stencilZFailOpFront", _SE(js_gfx_DepthStencilState_get_stencilZFailOpFront), _SE(js_gfx_DepthStencilState_set_stencilZFailOpFront));
    cls->defineProperty("stencilPassOpFront", _SE(js_gfx_DepthStencilState_get_stencilPassOpFront), _SE(js_gfx_DepthStencilState_set_stencilPassOpFront));
    cls->defineProperty("stencilRefFront", _SE(js_gfx_DepthStencilState_get_stencilRefFront), _SE(js_gfx_DepthStencilState_set_stencilRefFront));
    cls->defineProperty("stencilTestBack", _SE(js_gfx_DepthStencilState_get_stencilTestBack), _SE(js_gfx_DepthStencilState_set_stencilTestBack));
    cls->defineProperty("stencilFuncBack", _SE(js_gfx_DepthStencilState_get_stencilFuncBack), _SE(js_gfx_DepthStencilState_set_stencilFuncBack));
    cls->defineProperty("stencilReadMaskBack", _SE(js_gfx_DepthStencilState_get_stencilReadMaskBack), _SE(js_gfx_DepthStencilState_set_stencilReadMaskBack));
    cls->defineProperty("stencilWriteMaskBack", _SE(js_gfx_DepthStencilState_get_stencilWriteMaskBack), _SE(js_gfx_DepthStencilState_set_stencilWriteMaskBack));
    cls->defineProperty("stencilFailOpBack", _SE(js_gfx_DepthStencilState_get_stencilFailOpBack), _SE(js_gfx_DepthStencilState_set_stencilFailOpBack));
    cls->defineProperty("stencilZFailOpBack", _SE(js_gfx_DepthStencilState_get_stencilZFailOpBack), _SE(js_gfx_DepthStencilState_set_stencilZFailOpBack));
    cls->defineProperty("stencilPassOpBack", _SE(js_gfx_DepthStencilState_get_stencilPassOpBack), _SE(js_gfx_DepthStencilState_set_stencilPassOpBack));
    cls->defineProperty("stencilRefBack", _SE(js_gfx_DepthStencilState_get_stencilRefBack), _SE(js_gfx_DepthStencilState_set_stencilRefBack));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DepthStencilState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DepthStencilState>(cls);

    __jsb_cc_gfx_DepthStencilState_proto = cls->getProto();
    __jsb_cc_gfx_DepthStencilState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BlendTarget_proto = nullptr;
se::Class* __jsb_cc_gfx_BlendTarget_class = nullptr;

static bool js_gfx_BlendTarget_get_blend(se::State& s)
{
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->blend, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blend)

static bool js_gfx_BlendTarget_set_blend(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blend : Error processing new value");
    cobj->blend = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blend)

static bool js_gfx_BlendTarget_get_blendSrc(se::State& s)
{
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendSrc, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendSrc)

static bool js_gfx_BlendTarget_set_blendSrc(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendSrc : Error processing new value");
    cobj->blendSrc = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendSrc)

static bool js_gfx_BlendTarget_get_blendDst(se::State& s)
{
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendDst, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendDst)

static bool js_gfx_BlendTarget_set_blendDst(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendDst : Error processing new value");
    cobj->blendDst = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendDst)

static bool js_gfx_BlendTarget_get_blendEq(se::State& s)
{
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendEq, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendEq)

static bool js_gfx_BlendTarget_set_blendEq(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BlendOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BlendOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendEq : Error processing new value");
    cobj->blendEq = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendEq)

static bool js_gfx_BlendTarget_get_blendSrcAlpha(se::State& s)
{
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendSrcAlpha, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendSrcAlpha)

static bool js_gfx_BlendTarget_set_blendSrcAlpha(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendSrcAlpha : Error processing new value");
    cobj->blendSrcAlpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendSrcAlpha)

static bool js_gfx_BlendTarget_get_blendDstAlpha(se::State& s)
{
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendDstAlpha, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendDstAlpha)

static bool js_gfx_BlendTarget_set_blendDstAlpha(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendDstAlpha : Error processing new value");
    cobj->blendDstAlpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendDstAlpha)

static bool js_gfx_BlendTarget_get_blendAlphaEq(se::State& s)
{
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendAlphaEq, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendAlphaEq)

static bool js_gfx_BlendTarget_set_blendAlphaEq(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BlendOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::BlendOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendAlphaEq : Error processing new value");
    cobj->blendAlphaEq = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendAlphaEq)

static bool js_gfx_BlendTarget_get_blendColorMask(se::State& s)
{
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blendColorMask, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendColorMask)

static bool js_gfx_BlendTarget_set_blendColorMask(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::ColorMask arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ColorMask)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendColorMask : Error processing new value");
    cobj->blendColorMask = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendColorMask)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BlendTarget_finalize)

static bool js_gfx_BlendTarget_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BlendTarget* cobj = JSB_ALLOC(cc::gfx::BlendTarget);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BlendTarget* cobj = JSB_ALLOC(cc::gfx::BlendTarget);
        bool arg0;
        json->getProperty("blend", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg0);
            cobj->blend = arg0;
        }
        cc::gfx::BlendFactor arg1;
        json->getProperty("blendSrc", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::BlendFactor)tmp; } while(false);
            cobj->blendSrc = arg1;
        }
        cc::gfx::BlendFactor arg2;
        json->getProperty("blendDst", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cc::gfx::BlendFactor)tmp; } while(false);
            cobj->blendDst = arg2;
        }
        cc::gfx::BlendOp arg3;
        json->getProperty("blendEq", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::BlendOp)tmp; } while(false);
            cobj->blendEq = arg3;
        }
        cc::gfx::BlendFactor arg4;
        json->getProperty("blendSrcAlpha", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cc::gfx::BlendFactor)tmp; } while(false);
            cobj->blendSrcAlpha = arg4;
        }
        cc::gfx::BlendFactor arg5;
        json->getProperty("blendDstAlpha", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cc::gfx::BlendFactor)tmp; } while(false);
            cobj->blendDstAlpha = arg5;
        }
        cc::gfx::BlendOp arg6;
        json->getProperty("blendAlphaEq", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cc::gfx::BlendOp)tmp; } while(false);
            cobj->blendAlphaEq = arg6;
        }
        cc::gfx::ColorMask arg7;
        json->getProperty("blendColorMask", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cc::gfx::ColorMask)tmp; } while(false);
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
        cc::gfx::BlendTarget* cobj = JSB_ALLOC(cc::gfx::BlendTarget);
        bool arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->blend = arg0;
        }
        cc::gfx::BlendFactor arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::BlendFactor)tmp; } while(false);
            cobj->blendSrc = arg1;
        }
        cc::gfx::BlendFactor arg2;
        if (!args[2].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::BlendFactor)tmp; } while(false);
            cobj->blendDst = arg2;
        }
        cc::gfx::BlendOp arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::BlendOp)tmp; } while(false);
            cobj->blendEq = arg3;
        }
        cc::gfx::BlendFactor arg4;
        if (!args[4].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cc::gfx::BlendFactor)tmp; } while(false);
            cobj->blendSrcAlpha = arg4;
        }
        cc::gfx::BlendFactor arg5;
        if (!args[5].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cc::gfx::BlendFactor)tmp; } while(false);
            cobj->blendDstAlpha = arg5;
        }
        cc::gfx::BlendOp arg6;
        if (!args[6].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cc::gfx::BlendOp)tmp; } while(false);
            cobj->blendAlphaEq = arg6;
        }
        cc::gfx::ColorMask arg7;
        if (!args[7].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cc::gfx::ColorMask)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_BlendTarget_constructor, __jsb_cc_gfx_BlendTarget_class, js_cc_gfx_BlendTarget_finalize)




static bool js_cc_gfx_BlendTarget_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BlendTarget* cobj = (cc::gfx::BlendTarget*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BlendTarget_finalize)

bool js_register_gfx_BlendTarget(se::Object* obj)
{
    auto cls = se::Class::create("BlendTarget", obj, nullptr, _SE(js_gfx_BlendTarget_constructor));

    cls->defineProperty("blend", _SE(js_gfx_BlendTarget_get_blend), _SE(js_gfx_BlendTarget_set_blend));
    cls->defineProperty("blendSrc", _SE(js_gfx_BlendTarget_get_blendSrc), _SE(js_gfx_BlendTarget_set_blendSrc));
    cls->defineProperty("blendDst", _SE(js_gfx_BlendTarget_get_blendDst), _SE(js_gfx_BlendTarget_set_blendDst));
    cls->defineProperty("blendEq", _SE(js_gfx_BlendTarget_get_blendEq), _SE(js_gfx_BlendTarget_set_blendEq));
    cls->defineProperty("blendSrcAlpha", _SE(js_gfx_BlendTarget_get_blendSrcAlpha), _SE(js_gfx_BlendTarget_set_blendSrcAlpha));
    cls->defineProperty("blendDstAlpha", _SE(js_gfx_BlendTarget_get_blendDstAlpha), _SE(js_gfx_BlendTarget_set_blendDstAlpha));
    cls->defineProperty("blendAlphaEq", _SE(js_gfx_BlendTarget_get_blendAlphaEq), _SE(js_gfx_BlendTarget_set_blendAlphaEq));
    cls->defineProperty("blendColorMask", _SE(js_gfx_BlendTarget_get_blendColorMask), _SE(js_gfx_BlendTarget_set_blendColorMask));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BlendTarget_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BlendTarget>(cls);

    __jsb_cc_gfx_BlendTarget_proto = cls->getProto();
    __jsb_cc_gfx_BlendTarget_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BlendState_proto = nullptr;
se::Class* __jsb_cc_gfx_BlendState_class = nullptr;

static bool js_gfx_BlendState_get_isA2C(se::State& s)
{
    cc::gfx::BlendState* cobj = (cc::gfx::BlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isA2C, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_isA2C)

static bool js_gfx_BlendState_set_isA2C(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendState* cobj = (cc::gfx::BlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_isA2C : Error processing new value");
    cobj->isA2C = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_isA2C)

static bool js_gfx_BlendState_get_isIndepend(se::State& s)
{
    cc::gfx::BlendState* cobj = (cc::gfx::BlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isIndepend, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_isIndepend)

static bool js_gfx_BlendState_set_isIndepend(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendState* cobj = (cc::gfx::BlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_isIndepend : Error processing new value");
    cobj->isIndepend = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_isIndepend)

static bool js_gfx_BlendState_get_blendColor(se::State& s)
{
    cc::gfx::BlendState* cobj = (cc::gfx::BlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_rooted_seval<cc::gfx::Color>((cc::gfx::Color*)&cobj->blendColor, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_blendColor)

static bool js_gfx_BlendState_set_blendColor(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendState* cobj = (cc::gfx::BlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Color* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_blendColor : Error processing new value");
    cobj->blendColor = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_blendColor)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BlendState_finalize)

static bool js_gfx_BlendState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BlendState* cobj = JSB_ALLOC(cc::gfx::BlendState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BlendState* cobj = JSB_ALLOC(cc::gfx::BlendState);
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
        cc::gfx::Color* arg2 = nullptr;
        json->getProperty("blendColor", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->blendColor = *arg2;
        }
        std::vector<cc::gfx::BlendTarget> arg3;
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
        cc::gfx::BlendState* cobj = JSB_ALLOC(cc::gfx::BlendState);
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
        cc::gfx::Color* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->blendColor = *arg2;
        }
        std::vector<cc::gfx::BlendTarget> arg3;
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
SE_BIND_CTOR(js_gfx_BlendState_constructor, __jsb_cc_gfx_BlendState_class, js_cc_gfx_BlendState_finalize)




static bool js_cc_gfx_BlendState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BlendState* cobj = (cc::gfx::BlendState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BlendState_finalize)

bool js_register_gfx_BlendState(se::Object* obj)
{
    auto cls = se::Class::create("BlendState", obj, nullptr, _SE(js_gfx_BlendState_constructor));

    cls->defineProperty("isA2C", _SE(js_gfx_BlendState_get_isA2C), _SE(js_gfx_BlendState_set_isA2C));
    cls->defineProperty("isIndepend", _SE(js_gfx_BlendState_get_isIndepend), _SE(js_gfx_BlendState_set_isIndepend));
    cls->defineProperty("blendColor", _SE(js_gfx_BlendState_get_blendColor), _SE(js_gfx_BlendState_set_blendColor));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BlendState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BlendState>(cls);

    __jsb_cc_gfx_BlendState_proto = cls->getProto();
    __jsb_cc_gfx_BlendState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_PipelineStateInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineStateInfo_class = nullptr;

static bool js_gfx_PipelineStateInfo_get_primitive(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->primitive, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_primitive)

static bool js_gfx_PipelineStateInfo_set_primitive(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::PrimitiveMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::PrimitiveMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_primitive : Error processing new value");
    cobj->primitive = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_primitive)

static bool js_gfx_PipelineStateInfo_get_shader(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->shader, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_shader)

static bool js_gfx_PipelineStateInfo_set_shader(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Shader* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_shader : Error processing new value");
    cobj->shader = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_shader)

static bool js_gfx_PipelineStateInfo_get_inputState(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_inputState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->inputState, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_inputState)

static bool js_gfx_PipelineStateInfo_set_inputState(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_inputState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::InputState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_inputState : Error processing new value");
    cobj->inputState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_inputState)

static bool js_gfx_PipelineStateInfo_get_rasterizerState(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->rasterizerState, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_rasterizerState)

static bool js_gfx_PipelineStateInfo_set_rasterizerState(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::RasterizerState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_rasterizerState : Error processing new value");
    cobj->rasterizerState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_rasterizerState)

static bool js_gfx_PipelineStateInfo_get_depthStencilState(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->depthStencilState, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_depthStencilState)

static bool js_gfx_PipelineStateInfo_set_depthStencilState(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::DepthStencilState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_depthStencilState : Error processing new value");
    cobj->depthStencilState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_depthStencilState)

static bool js_gfx_PipelineStateInfo_get_blendState(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->blendState, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_blendState)

static bool js_gfx_PipelineStateInfo_set_blendState(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BlendState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_blendState : Error processing new value");
    cobj->blendState = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_blendState)

static bool js_gfx_PipelineStateInfo_get_dynamicStates(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_to_seval(cobj->dynamicStates, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_dynamicStates)

static bool js_gfx_PipelineStateInfo_set_dynamicStates(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::gfx::DynamicState> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_dynamicStates : Error processing new value");
    cobj->dynamicStates = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_dynamicStates)

static bool js_gfx_PipelineStateInfo_get_renderPass(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->renderPass, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_renderPass)

static bool js_gfx_PipelineStateInfo_set_renderPass(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::RenderPass* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_renderPass : Error processing new value");
    cobj->renderPass = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_renderPass)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineStateInfo_finalize)

static bool js_gfx_PipelineStateInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
        cc::gfx::PrimitiveMode arg0;
        json->getProperty("primitive", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::PrimitiveMode)tmp; } while(false);
            cobj->primitive = arg0;
        }
        cc::gfx::Shader* arg1 = nullptr;
        json->getProperty("shader", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg1);
            cobj->shader = arg1;
        }
        cc::gfx::InputState* arg2 = nullptr;
        json->getProperty("inputState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg2);
            cobj->inputState = *arg2;
        }
        cc::gfx::RasterizerState* arg3 = nullptr;
        json->getProperty("rasterizerState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->rasterizerState = *arg3;
        }
        cc::gfx::DepthStencilState* arg4 = nullptr;
        json->getProperty("depthStencilState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg4);
            cobj->depthStencilState = *arg4;
        }
        cc::gfx::BlendState* arg5 = nullptr;
        json->getProperty("blendState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg5);
            cobj->blendState = *arg5;
        }
        std::vector<cc::gfx::DynamicState> arg6;
        json->getProperty("dynamicStates", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg6);
            cobj->dynamicStates = arg6;
        }
        cc::gfx::RenderPass* arg7 = nullptr;
        json->getProperty("renderPass", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg7);
            cobj->renderPass = arg7;
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
        cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
        cc::gfx::PrimitiveMode arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::PrimitiveMode)tmp; } while(false);
            cobj->primitive = arg0;
        }
        cc::gfx::Shader* arg1 = nullptr;
        if (!args[1].isUndefined()) {
            ok &= seval_to_native_ptr(args[1], &arg1);
            cobj->shader = arg1;
        }
        cc::gfx::InputState* arg2 = nullptr;
        if (!args[2].isUndefined()) {
            ok &= seval_to_reference(args[2], &arg2);
            cobj->inputState = *arg2;
        }
        cc::gfx::RasterizerState* arg3 = nullptr;
        if (!args[3].isUndefined()) {
            ok &= seval_to_reference(args[3], &arg3);
            cobj->rasterizerState = *arg3;
        }
        cc::gfx::DepthStencilState* arg4 = nullptr;
        if (!args[4].isUndefined()) {
            ok &= seval_to_reference(args[4], &arg4);
            cobj->depthStencilState = *arg4;
        }
        cc::gfx::BlendState* arg5 = nullptr;
        if (!args[5].isUndefined()) {
            ok &= seval_to_reference(args[5], &arg5);
            cobj->blendState = *arg5;
        }
        std::vector<cc::gfx::DynamicState> arg6;
        if (!args[6].isUndefined()) {
            ok &= seval_to_std_vector(args[6], &arg6);
            cobj->dynamicStates = arg6;
        }
        cc::gfx::RenderPass* arg7 = nullptr;
        if (!args[7].isUndefined()) {
            ok &= seval_to_native_ptr(args[7], &arg7);
            cobj->renderPass = arg7;
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
SE_BIND_CTOR(js_gfx_PipelineStateInfo_constructor, __jsb_cc_gfx_PipelineStateInfo_class, js_cc_gfx_PipelineStateInfo_finalize)




static bool js_cc_gfx_PipelineStateInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineStateInfo_finalize)

bool js_register_gfx_PipelineStateInfo(se::Object* obj)
{
    auto cls = se::Class::create("PipelineStateInfo", obj, nullptr, _SE(js_gfx_PipelineStateInfo_constructor));

    cls->defineProperty("primitive", _SE(js_gfx_PipelineStateInfo_get_primitive), _SE(js_gfx_PipelineStateInfo_set_primitive));
    cls->defineProperty("shader", _SE(js_gfx_PipelineStateInfo_get_shader), _SE(js_gfx_PipelineStateInfo_set_shader));
    cls->defineProperty("inputState", _SE(js_gfx_PipelineStateInfo_get_inputState), _SE(js_gfx_PipelineStateInfo_set_inputState));
    cls->defineProperty("rasterizerState", _SE(js_gfx_PipelineStateInfo_get_rasterizerState), _SE(js_gfx_PipelineStateInfo_set_rasterizerState));
    cls->defineProperty("depthStencilState", _SE(js_gfx_PipelineStateInfo_get_depthStencilState), _SE(js_gfx_PipelineStateInfo_set_depthStencilState));
    cls->defineProperty("blendState", _SE(js_gfx_PipelineStateInfo_get_blendState), _SE(js_gfx_PipelineStateInfo_set_blendState));
    cls->defineProperty("dynamicStates", _SE(js_gfx_PipelineStateInfo_get_dynamicStates), _SE(js_gfx_PipelineStateInfo_set_dynamicStates));
    cls->defineProperty("renderPass", _SE(js_gfx_PipelineStateInfo_get_renderPass), _SE(js_gfx_PipelineStateInfo_set_renderPass));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineStateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineStateInfo>(cls);

    __jsb_cc_gfx_PipelineStateInfo_proto = cls->getProto();
    __jsb_cc_gfx_PipelineStateInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_CommandBufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_CommandBufferInfo_class = nullptr;

static bool js_gfx_CommandBufferInfo_get_queue(se::State& s)
{
    cc::gfx::CommandBufferInfo* cobj = (cc::gfx::CommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBufferInfo_get_queue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->queue, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_CommandBufferInfo_get_queue)

static bool js_gfx_CommandBufferInfo_set_queue(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::CommandBufferInfo* cobj = (cc::gfx::CommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBufferInfo_set_queue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::Queue* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_CommandBufferInfo_set_queue : Error processing new value");
    cobj->queue = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_CommandBufferInfo_set_queue)

static bool js_gfx_CommandBufferInfo_get_type(se::State& s)
{
    cc::gfx::CommandBufferInfo* cobj = (cc::gfx::CommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBufferInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_CommandBufferInfo_get_type)

static bool js_gfx_CommandBufferInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::CommandBufferInfo* cobj = (cc::gfx::CommandBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBufferInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::CommandBufferType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::CommandBufferType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_CommandBufferInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_CommandBufferInfo_set_type)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_CommandBufferInfo_finalize)

static bool js_gfx_CommandBufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::CommandBufferInfo* cobj = JSB_ALLOC(cc::gfx::CommandBufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::CommandBufferInfo* cobj = JSB_ALLOC(cc::gfx::CommandBufferInfo);
        cc::gfx::Queue* arg0 = nullptr;
        json->getProperty("queue", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->queue = arg0;
        }
        cc::gfx::CommandBufferType arg1;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::gfx::CommandBufferType)tmp; } while(false);
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
        cc::gfx::CommandBufferInfo* cobj = JSB_ALLOC(cc::gfx::CommandBufferInfo);
        cc::gfx::Queue* arg0 = nullptr;
        if (!args[0].isUndefined()) {
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->queue = arg0;
        }
        cc::gfx::CommandBufferType arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::CommandBufferType)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_CommandBufferInfo_constructor, __jsb_cc_gfx_CommandBufferInfo_class, js_cc_gfx_CommandBufferInfo_finalize)




static bool js_cc_gfx_CommandBufferInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::CommandBufferInfo* cobj = (cc::gfx::CommandBufferInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_CommandBufferInfo_finalize)

bool js_register_gfx_CommandBufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("CommandBufferInfo", obj, nullptr, _SE(js_gfx_CommandBufferInfo_constructor));

    cls->defineProperty("queue", _SE(js_gfx_CommandBufferInfo_get_queue), _SE(js_gfx_CommandBufferInfo_set_queue));
    cls->defineProperty("type", _SE(js_gfx_CommandBufferInfo_get_type), _SE(js_gfx_CommandBufferInfo_set_type));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_CommandBufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::CommandBufferInfo>(cls);

    __jsb_cc_gfx_CommandBufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_CommandBufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_QueueInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_QueueInfo_class = nullptr;

static bool js_gfx_QueueInfo_get_type(se::State& s)
{
    cc::gfx::QueueInfo* cobj = (cc::gfx::QueueInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_QueueInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_QueueInfo_get_type)

static bool js_gfx_QueueInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::QueueInfo* cobj = (cc::gfx::QueueInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_QueueInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::QueueType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::QueueType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_QueueInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_QueueInfo_set_type)

static bool js_gfx_QueueInfo_get_forceSync(se::State& s)
{
    cc::gfx::QueueInfo* cobj = (cc::gfx::QueueInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_QueueInfo_get_forceSync : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->forceSync, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_QueueInfo_get_forceSync)

static bool js_gfx_QueueInfo_set_forceSync(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::QueueInfo* cobj = (cc::gfx::QueueInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_QueueInfo_set_forceSync : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_QueueInfo_set_forceSync : Error processing new value");
    cobj->forceSync = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_QueueInfo_set_forceSync)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_QueueInfo_finalize)

static bool js_gfx_QueueInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::QueueInfo* cobj = JSB_ALLOC(cc::gfx::QueueInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::QueueInfo* cobj = JSB_ALLOC(cc::gfx::QueueInfo);
        cc::gfx::QueueType arg0;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cc::gfx::QueueType)tmp; } while(false);
            cobj->type = arg0;
        }
        bool arg1;
        json->getProperty("forceSync", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg1);
            cobj->forceSync = arg1;
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
        cc::gfx::QueueInfo* cobj = JSB_ALLOC(cc::gfx::QueueInfo);
        cc::gfx::QueueType arg0;
        if (!args[0].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::QueueType)tmp; } while(false);
            cobj->type = arg0;
        }
        bool arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_boolean(args[1], &arg1);
            cobj->forceSync = arg1;
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
SE_BIND_CTOR(js_gfx_QueueInfo_constructor, __jsb_cc_gfx_QueueInfo_class, js_cc_gfx_QueueInfo_finalize)




static bool js_cc_gfx_QueueInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::QueueInfo* cobj = (cc::gfx::QueueInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_QueueInfo_finalize)

bool js_register_gfx_QueueInfo(se::Object* obj)
{
    auto cls = se::Class::create("QueueInfo", obj, nullptr, _SE(js_gfx_QueueInfo_constructor));

    cls->defineProperty("type", _SE(js_gfx_QueueInfo_get_type), _SE(js_gfx_QueueInfo_set_type));
    cls->defineProperty("forceSync", _SE(js_gfx_QueueInfo_get_forceSync), _SE(js_gfx_QueueInfo_set_forceSync));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_QueueInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::QueueInfo>(cls);

    __jsb_cc_gfx_QueueInfo_proto = cls->getProto();
    __jsb_cc_gfx_QueueInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_FormatInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_FormatInfo_class = nullptr;

static bool js_gfx_FormatInfo_get_name(se::State& s)
{
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_name)

static bool js_gfx_FormatInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_name)

static bool js_gfx_FormatInfo_get_size(se::State& s)
{
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->size, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_size)

static bool js_gfx_FormatInfo_set_size(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_size : Error processing new value");
    cobj->size = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_size)

static bool js_gfx_FormatInfo_get_count(se::State& s)
{
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_count)

static bool js_gfx_FormatInfo_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_count : Error processing new value");
    cobj->count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_count)

static bool js_gfx_FormatInfo_get_type(se::State& s)
{
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_type)

static bool js_gfx_FormatInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::FormatType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::FormatType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_type)

static bool js_gfx_FormatInfo_get_hasAlpha(se::State& s)
{
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_hasAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->hasAlpha, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_hasAlpha)

static bool js_gfx_FormatInfo_set_hasAlpha(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_hasAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_hasAlpha : Error processing new value");
    cobj->hasAlpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_hasAlpha)

static bool js_gfx_FormatInfo_get_hasDepth(se::State& s)
{
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_hasDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->hasDepth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_hasDepth)

static bool js_gfx_FormatInfo_set_hasDepth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_hasDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_hasDepth : Error processing new value");
    cobj->hasDepth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_hasDepth)

static bool js_gfx_FormatInfo_get_hasStencil(se::State& s)
{
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_hasStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->hasStencil, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_hasStencil)

static bool js_gfx_FormatInfo_set_hasStencil(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_hasStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_hasStencil : Error processing new value");
    cobj->hasStencil = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_hasStencil)

static bool js_gfx_FormatInfo_get_isCompressed(se::State& s)
{
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_isCompressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isCompressed, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_isCompressed)

static bool js_gfx_FormatInfo_set_isCompressed(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_isCompressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_isCompressed : Error processing new value");
    cobj->isCompressed = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_isCompressed)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_FormatInfo_finalize)

static bool js_gfx_FormatInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::FormatInfo* cobj = JSB_ALLOC(cc::gfx::FormatInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::FormatInfo* cobj = JSB_ALLOC(cc::gfx::FormatInfo);
        cc::String arg0;
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
        cc::gfx::FormatType arg3;
        json->getProperty("type", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cc::gfx::FormatType)tmp; } while(false);
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
        cc::gfx::FormatInfo* cobj = JSB_ALLOC(cc::gfx::FormatInfo);
        cc::String arg0;
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
        cc::gfx::FormatType arg3;
        if (!args[3].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::FormatType)tmp; } while(false);
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
SE_BIND_CTOR(js_gfx_FormatInfo_constructor, __jsb_cc_gfx_FormatInfo_class, js_cc_gfx_FormatInfo_finalize)




static bool js_cc_gfx_FormatInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::FormatInfo* cobj = (cc::gfx::FormatInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_FormatInfo_finalize)

bool js_register_gfx_FormatInfo(se::Object* obj)
{
    auto cls = se::Class::create("FormatInfo", obj, nullptr, _SE(js_gfx_FormatInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_FormatInfo_get_name), _SE(js_gfx_FormatInfo_set_name));
    cls->defineProperty("size", _SE(js_gfx_FormatInfo_get_size), _SE(js_gfx_FormatInfo_set_size));
    cls->defineProperty("count", _SE(js_gfx_FormatInfo_get_count), _SE(js_gfx_FormatInfo_set_count));
    cls->defineProperty("type", _SE(js_gfx_FormatInfo_get_type), _SE(js_gfx_FormatInfo_set_type));
    cls->defineProperty("hasAlpha", _SE(js_gfx_FormatInfo_get_hasAlpha), _SE(js_gfx_FormatInfo_set_hasAlpha));
    cls->defineProperty("hasDepth", _SE(js_gfx_FormatInfo_get_hasDepth), _SE(js_gfx_FormatInfo_set_hasDepth));
    cls->defineProperty("hasStencil", _SE(js_gfx_FormatInfo_get_hasStencil), _SE(js_gfx_FormatInfo_set_hasStencil));
    cls->defineProperty("isCompressed", _SE(js_gfx_FormatInfo_get_isCompressed), _SE(js_gfx_FormatInfo_set_isCompressed));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_FormatInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::FormatInfo>(cls);

    __jsb_cc_gfx_FormatInfo_proto = cls->getProto();
    __jsb_cc_gfx_FormatInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_MemoryStatus_proto = nullptr;
se::Class* __jsb_cc_gfx_MemoryStatus_class = nullptr;

static bool js_gfx_MemoryStatus_get_bufferSize(se::State& s)
{
    cc::gfx::MemoryStatus* cobj = (cc::gfx::MemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_get_bufferSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->bufferSize, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_MemoryStatus_get_bufferSize)

static bool js_gfx_MemoryStatus_set_bufferSize(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::MemoryStatus* cobj = (cc::gfx::MemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_set_bufferSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_MemoryStatus_set_bufferSize : Error processing new value");
    cobj->bufferSize = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_MemoryStatus_set_bufferSize)

static bool js_gfx_MemoryStatus_get_textureSize(se::State& s)
{
    cc::gfx::MemoryStatus* cobj = (cc::gfx::MemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_get_textureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->textureSize, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_MemoryStatus_get_textureSize)

static bool js_gfx_MemoryStatus_set_textureSize(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::MemoryStatus* cobj = (cc::gfx::MemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_set_textureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_MemoryStatus_set_textureSize : Error processing new value");
    cobj->textureSize = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_MemoryStatus_set_textureSize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_MemoryStatus_finalize)

static bool js_gfx_MemoryStatus_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
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
        cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
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
SE_BIND_CTOR(js_gfx_MemoryStatus_constructor, __jsb_cc_gfx_MemoryStatus_class, js_cc_gfx_MemoryStatus_finalize)




static bool js_cc_gfx_MemoryStatus_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::MemoryStatus* cobj = (cc::gfx::MemoryStatus*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_MemoryStatus_finalize)

bool js_register_gfx_MemoryStatus(se::Object* obj)
{
    auto cls = se::Class::create("MemoryStatus", obj, nullptr, _SE(js_gfx_MemoryStatus_constructor));

    cls->defineProperty("bufferSize", _SE(js_gfx_MemoryStatus_get_bufferSize), _SE(js_gfx_MemoryStatus_set_bufferSize));
    cls->defineProperty("textureSize", _SE(js_gfx_MemoryStatus_get_textureSize), _SE(js_gfx_MemoryStatus_set_textureSize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_MemoryStatus_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::MemoryStatus>(cls);

    __jsb_cc_gfx_MemoryStatus_proto = cls->getProto();
    __jsb_cc_gfx_MemoryStatus_class = cls;

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
    cc::gfx::ObjectType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::ObjectType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_constructor : Error processing arguments");
    cc::gfx::GFXObject* cobj = JSB_ALLOC(cc::gfx::GFXObject, arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXObject_constructor, __jsb_cc_gfx_GFXObject_class, js_cc_gfx_GFXObject_finalize)




static bool js_cc_gfx_GFXObject_finalize(se::State& s)
{
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

se::Object* __jsb_cc_gfx_Device_proto = nullptr;
se::Class* __jsb_cc_gfx_Device_class = nullptr;

static bool js_gfx_Device_getMaxVertexTextureUnits(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxVertexTextureUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxVertexTextureUnits();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxVertexTextureUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxVertexTextureUnits)

static bool js_gfx_Device_getProjectionSignY(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getProjectionSignY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getProjectionSignY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getProjectionSignY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getProjectionSignY)

static bool js_gfx_Device_getMaxVertexUniformVectors(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxVertexUniformVectors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxVertexUniformVectors();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxVertexUniformVectors : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxVertexUniformVectors)

static bool js_gfx_Device_getGfxAPI(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getGfxAPI : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getGfxAPI();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getGfxAPI : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getGfxAPI)

static bool js_gfx_Device_getVendor(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getVendor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getVendor();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getVendor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getVendor)

static bool js_gfx_Device_hasFeature(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_hasFeature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::Feature arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::Feature)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_hasFeature : Error processing arguments");
        bool result = cobj->hasFeature(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_hasFeature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_hasFeature)

static bool js_gfx_Device_createFence(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createFence : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::FenceInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFence : Error processing arguments");
        cc::gfx::Fence* result = cobj->createFence(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFence : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createFence)

static bool js_gfx_Device_getContext(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getContext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Context* result = cobj->getContext();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getContext : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getContext)

static bool js_gfx_Device_getWidth(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getWidth)

static bool js_gfx_Device_setReverseCW(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_setReverseCW : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_setReverseCW : Error processing arguments");
        cobj->setReverseCW(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_Device_setReverseCW)

static bool js_gfx_Device_getQueue(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Queue* result = cobj->getQueue();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getQueue)

static bool js_gfx_Device_getMaxVertexAttributes(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxVertexAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxVertexAttributes();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxVertexAttributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxVertexAttributes)

static bool js_gfx_Device_getDepthStencilFormat(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getDepthStencilFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDepthStencilFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getDepthStencilFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getDepthStencilFormat)

static bool js_gfx_Device_getNumTris(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNumTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumTris();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNumTris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNumTris)

static bool js_gfx_Device_getRenderer(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getRenderer();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getRenderer)

static bool js_gfx_Device_getStencilBits(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getStencilBits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getStencilBits();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getStencilBits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getStencilBits)

static bool js_gfx_Device_getDeviceName(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getDeviceName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getDeviceName();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getDeviceName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getDeviceName)

static bool js_gfx_Device_getNumInstances(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNumInstances : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumInstances();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNumInstances : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNumInstances)

static bool js_gfx_Device_getHeight(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getHeight)

static bool js_gfx_Device_getMaxFragmentUniformVectors(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxFragmentUniformVectors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxFragmentUniformVectors();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxFragmentUniformVectors : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxFragmentUniformVectors)

static bool js_gfx_Device_createPipelineState(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::PipelineStateInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineState : Error processing arguments");
        cc::gfx::PipelineState* result = cobj->createPipelineState(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createPipelineState)

static bool js_gfx_Device_createCommandBuffer(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::CommandBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createCommandBuffer : Error processing arguments");
        cc::gfx::CommandBuffer* result = cobj->createCommandBuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createCommandBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createCommandBuffer)

static bool js_gfx_Device_present(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_present)

static bool js_gfx_Device_destroy(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_destroy)

static bool js_gfx_Device_getColorFormat(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getColorFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getColorFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getColorFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getColorFormat)

static bool js_gfx_Device_createFramebuffer(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::FramebufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFramebuffer : Error processing arguments");
        cc::gfx::Framebuffer* result = cobj->createFramebuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFramebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createFramebuffer)

static bool js_gfx_Device_getMaxTextureSize(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxTextureSize();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxTextureSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxTextureSize)

static bool js_gfx_Device_createRenderPass(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::RenderPassInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createRenderPass : Error processing arguments");
        cc::gfx::RenderPass* result = cobj->createRenderPass(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createRenderPass)

static bool js_gfx_Device_getMaxUniformBlockSize(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxUniformBlockSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxUniformBlockSize();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxUniformBlockSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxUniformBlockSize)

static bool js_gfx_Device_acquire(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_acquire : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->acquire();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_acquire)

static bool js_gfx_Device_getMaxCubeMapTextureSize(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxCubeMapTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxCubeMapTextureSize();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxCubeMapTextureSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxCubeMapTextureSize)

static bool js_gfx_Device_getShaderIdGen(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getShaderIdGen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getShaderIdGen();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getShaderIdGen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getShaderIdGen)

static bool js_gfx_Device_getMaxUniformBufferBindings(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxUniformBufferBindings : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxUniformBufferBindings();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxUniformBufferBindings : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxUniformBufferBindings)

static bool js_gfx_Device_createShader(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::ShaderInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createShader : Error processing arguments");
        cc::gfx::Shader* result = cobj->createShader(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createShader)

static bool js_gfx_Device_createInputAssembler(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::InputAssemblerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createInputAssembler : Error processing arguments");
        cc::gfx::InputAssembler* result = cobj->createInputAssembler(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createInputAssembler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createInputAssembler)

static bool js_gfx_Device_defineMacro(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_defineMacro : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::String arg0;
        cc::String arg1;
        arg0 = args[0].toStringForce().c_str();
        arg1 = args[1].toStringForce().c_str();
        SE_PRECONDITION2(ok, false, "js_gfx_Device_defineMacro : Error processing arguments");
        cobj->defineMacro(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_defineMacro)

static bool js_gfx_Device_createSampler(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::SamplerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createSampler : Error processing arguments");
        cc::gfx::Sampler* result = cobj->createSampler(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createSampler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createSampler)

static bool js_gfx_Device_createBuffer(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::BufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createBuffer : Error processing arguments");
        cc::gfx::Buffer* result = cobj->createBuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createBuffer)

static bool js_gfx_Device_getNativeHeight(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNativeHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNativeHeight();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNativeHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNativeHeight)

static bool js_gfx_Device_initialize(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::DeviceInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_initialize)

static bool js_gfx_Device_resize(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_resize : Error processing arguments");
        cobj->resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_resize)

static bool js_gfx_Device_createQueue(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::QueueInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createQueue : Error processing arguments");
        cc::gfx::Queue* result = cobj->createQueue(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createQueue)

static bool js_gfx_Device_getDepthBits(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getDepthBits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getDepthBits();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getDepthBits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getDepthBits)

static bool js_gfx_Device_getMinClipZ(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMinClipZ : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMinClipZ();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMinClipZ : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMinClipZ)

static bool js_gfx_Device_getMemoryStatus(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMemoryStatus : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::MemoryStatus& result = cobj->getMemoryStatus();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMemoryStatus : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMemoryStatus)

static bool js_gfx_Device_getMaxTextureUnits(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxTextureUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxTextureUnits();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxTextureUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxTextureUnits)

static bool js_gfx_Device_getReverseCW(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getReverseCW : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getReverseCW();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getReverseCW : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getReverseCW)

static bool js_gfx_Device_getNumDrawCalls(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNumDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumDrawCalls();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNumDrawCalls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNumDrawCalls)

static bool js_gfx_Device_getNativeWidth(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNativeWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNativeWidth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNativeWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNativeWidth)

static bool js_gfx_Device_createBindingLayout(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::BindingLayoutInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createBindingLayout : Error processing arguments");
        cc::gfx::BindingLayout* result = cobj->createBindingLayout(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createBindingLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createBindingLayout)




bool js_register_gfx_Device(se::Object* obj)
{
    auto cls = se::Class::create("GFXDevice", obj, nullptr, nullptr);

    cls->defineProperty("deviceName", _SE(js_gfx_Device_getDeviceName), nullptr);
    cls->defineProperty("numInstances", _SE(js_gfx_Device_getNumInstances), nullptr);
    cls->defineProperty("maxTextureUnits", _SE(js_gfx_Device_getMaxTextureUnits), nullptr);
    cls->defineProperty("projectionSignY", _SE(js_gfx_Device_getProjectionSignY), nullptr);
    cls->defineProperty("height", _SE(js_gfx_Device_getHeight), nullptr);
    cls->defineProperty("shaderIdGen", _SE(js_gfx_Device_getShaderIdGen), nullptr);
    cls->defineProperty("renderer", _SE(js_gfx_Device_getRenderer), nullptr);
    cls->defineProperty("maxUniformBufferBindings", _SE(js_gfx_Device_getMaxUniformBufferBindings), nullptr);
    cls->defineProperty("vendor", _SE(js_gfx_Device_getVendor), nullptr);
    cls->defineProperty("depthBits", _SE(js_gfx_Device_getDepthBits), nullptr);
    cls->defineProperty("reverseCW", _SE(js_gfx_Device_getReverseCW), _SE(js_gfx_Device_setReverseCW));
    cls->defineProperty("maxFragmentUniformVectors", _SE(js_gfx_Device_getMaxFragmentUniformVectors), nullptr);
    cls->defineProperty("maxVertexAttributes", _SE(js_gfx_Device_getMaxVertexAttributes), nullptr);
    cls->defineProperty("width", _SE(js_gfx_Device_getWidth), nullptr);
    cls->defineProperty("maxVertexUniformVectors", _SE(js_gfx_Device_getMaxVertexUniformVectors), nullptr);
    cls->defineProperty("maxCubeMapTextureSize", _SE(js_gfx_Device_getMaxCubeMapTextureSize), nullptr);
    cls->defineProperty("maxVertexTextureUnits", _SE(js_gfx_Device_getMaxVertexTextureUnits), nullptr);
    cls->defineProperty("nativeWidth", _SE(js_gfx_Device_getNativeWidth), nullptr);
    cls->defineProperty("numDrawCalls", _SE(js_gfx_Device_getNumDrawCalls), nullptr);
    cls->defineProperty("memoryStatus", _SE(js_gfx_Device_getMemoryStatus), nullptr);
    cls->defineProperty("gfxAPI", _SE(js_gfx_Device_getGfxAPI), nullptr);
    cls->defineProperty("maxUniformBlockSize", _SE(js_gfx_Device_getMaxUniformBlockSize), nullptr);
    cls->defineProperty("minClipZ", _SE(js_gfx_Device_getMinClipZ), nullptr);
    cls->defineProperty("maxTextureSize", _SE(js_gfx_Device_getMaxTextureSize), nullptr);
    cls->defineProperty("nativeHeight", _SE(js_gfx_Device_getNativeHeight), nullptr);
    cls->defineProperty("depthStencilFormat", _SE(js_gfx_Device_getDepthStencilFormat), nullptr);
    cls->defineProperty("numTris", _SE(js_gfx_Device_getNumTris), nullptr);
    cls->defineProperty("stencilBits", _SE(js_gfx_Device_getStencilBits), nullptr);
    cls->defineProperty("queue", _SE(js_gfx_Device_getQueue), nullptr);
    cls->defineProperty("context", _SE(js_gfx_Device_getContext), nullptr);
    cls->defineProperty("colorFormat", _SE(js_gfx_Device_getColorFormat), nullptr);
    cls->defineFunction("hasFeature", _SE(js_gfx_Device_hasFeature));
    cls->defineFunction("createFence", _SE(js_gfx_Device_createFence));
    cls->defineFunction("createPipelineState", _SE(js_gfx_Device_createPipelineState));
    cls->defineFunction("createCommandBuffer", _SE(js_gfx_Device_createCommandBuffer));
    cls->defineFunction("present", _SE(js_gfx_Device_present));
    cls->defineFunction("destroy", _SE(js_gfx_Device_destroy));
    cls->defineFunction("createFramebuffer", _SE(js_gfx_Device_createFramebuffer));
    cls->defineFunction("createRenderPass", _SE(js_gfx_Device_createRenderPass));
    cls->defineFunction("acquire", _SE(js_gfx_Device_acquire));
    cls->defineFunction("createShader", _SE(js_gfx_Device_createShader));
    cls->defineFunction("createInputAssembler", _SE(js_gfx_Device_createInputAssembler));
    cls->defineFunction("defineMacro", _SE(js_gfx_Device_defineMacro));
    cls->defineFunction("createSampler", _SE(js_gfx_Device_createSampler));
    cls->defineFunction("createBuffer", _SE(js_gfx_Device_createBuffer));
    cls->defineFunction("initialize", _SE(js_gfx_Device_initialize));
    cls->defineFunction("resize", _SE(js_gfx_Device_resize));
    cls->defineFunction("createQueue", _SE(js_gfx_Device_createQueue));
    cls->defineFunction("createBindingLayout", _SE(js_gfx_Device_createBindingLayout));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Device>(cls);

    __jsb_cc_gfx_Device_proto = cls->getProto();
    __jsb_cc_gfx_Device_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Buffer_proto = nullptr;
se::Class* __jsb_cc_gfx_Buffer_class = nullptr;

static bool js_gfx_Buffer_getBufferView(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getBufferView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->getBufferView();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getBufferView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getBufferView)

static bool js_gfx_Buffer_getUsage(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getUsage();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getUsage)

static bool js_gfx_Buffer_getMemUsage(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getMemUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMemUsage();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getMemUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getMemUsage)

static bool js_gfx_Buffer_getSize(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getSize();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getSize)

static bool js_gfx_Buffer_getCount(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getCount)

static bool js_gfx_Buffer_initialize(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::BufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_initialize)

static bool js_gfx_Buffer_destroy(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_destroy)

static bool js_gfx_Buffer_getStride(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getStride : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getStride();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getStride : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getStride)

static bool js_gfx_Buffer_getDevice(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getDevice)

static bool js_gfx_Buffer_getFlags(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFlags();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getFlags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getFlags)

static bool js_gfx_Buffer_resize(se::State& s)
{
    cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_resize : Error processing arguments");
        cobj->resize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_resize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Buffer_finalize)

static bool js_gfx_Buffer_constructor(se::State& s)
{
    //#3 cc::gfx::Buffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Buffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Buffer_constructor, __jsb_cc_gfx_Buffer_class, js_cc_gfx_Buffer_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Buffer_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Buffer* cobj = (cc::gfx::Buffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Buffer_finalize)

bool js_register_gfx_Buffer(se::Object* obj)
{
    auto cls = se::Class::create("Buffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Buffer_constructor));

    cls->defineProperty("count", _SE(js_gfx_Buffer_getCount), nullptr);
    cls->defineProperty("memUsage", _SE(js_gfx_Buffer_getMemUsage), nullptr);
    cls->defineProperty("stride", _SE(js_gfx_Buffer_getStride), nullptr);
    cls->defineProperty("bufferView", _SE(js_gfx_Buffer_getBufferView), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_Buffer_getUsage), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_Buffer_getFlags), nullptr);
    cls->defineProperty("device", _SE(js_gfx_Buffer_getDevice), nullptr);
    cls->defineProperty("size", _SE(js_gfx_Buffer_getSize), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_Buffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Buffer_destroy));
    cls->defineFunction("resize", _SE(js_gfx_Buffer_resize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Buffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Buffer>(cls);

    __jsb_cc_gfx_Buffer_proto = cls->getProto();
    __jsb_cc_gfx_Buffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Texture_proto = nullptr;
se::Class* __jsb_cc_gfx_Texture_class = nullptr;

static bool js_gfx_Texture_getSize(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getSize();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getSize)

static bool js_gfx_Texture_getDepth(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getDepth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getDepth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getDepth)

static bool js_gfx_Texture_getType(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getType)

static bool js_gfx_Texture_getHeight(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getHeight)

static bool js_gfx_Texture_getBuffer(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->getBuffer();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getBuffer)

static bool js_gfx_Texture_getWidth(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getWidth)

static bool js_gfx_Texture_getMipLevel(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getMipLevel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMipLevel();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getMipLevel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getMipLevel)

static bool js_gfx_Texture_getArrayLayer(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getArrayLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getArrayLayer();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getArrayLayer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getArrayLayer)

static bool js_gfx_Texture_getUsage(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getUsage();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getUsage)

static bool js_gfx_Texture_destroy(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_destroy)

static bool js_gfx_Texture_getSamples(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getSamples : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getSamples();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getSamples : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getSamples)

static bool js_gfx_Texture_getFormat(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getFormat)

static bool js_gfx_Texture_getFlags(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFlags();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getFlags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getFlags)

static bool js_gfx_Texture_resize(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_resize : Error processing arguments");
        cobj->resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_resize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Texture_finalize)

static bool js_gfx_Texture_constructor(se::State& s)
{
    //#3 cc::gfx::Texture: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Texture constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Texture_constructor, __jsb_cc_gfx_Texture_class, js_cc_gfx_Texture_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Texture_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Texture_finalize)

bool js_register_gfx_Texture(se::Object* obj)
{
    auto cls = se::Class::create("Texture", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Texture_constructor));

    cls->defineProperty("arrayLayer", _SE(js_gfx_Texture_getArrayLayer), nullptr);
    cls->defineProperty("format", _SE(js_gfx_Texture_getFormat), nullptr);
    cls->defineProperty("buffer", _SE(js_gfx_Texture_getBuffer), nullptr);
    cls->defineProperty("mipLevel", _SE(js_gfx_Texture_getMipLevel), nullptr);
    cls->defineProperty("height", _SE(js_gfx_Texture_getHeight), nullptr);
    cls->defineProperty("width", _SE(js_gfx_Texture_getWidth), nullptr);
    cls->defineProperty("depth", _SE(js_gfx_Texture_getDepth), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_Texture_getFlags), nullptr);
    cls->defineProperty("samples", _SE(js_gfx_Texture_getSamples), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_Texture_getUsage), nullptr);
    cls->defineProperty("type", _SE(js_gfx_Texture_getType), nullptr);
    cls->defineProperty("size", _SE(js_gfx_Texture_getSize), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_Texture_destroy));
    cls->defineFunction("resize", _SE(js_gfx_Texture_resize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Texture_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Texture>(cls);

    __jsb_cc_gfx_Texture_proto = cls->getProto();
    __jsb_cc_gfx_Texture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Sampler_proto = nullptr;
se::Class* __jsb_cc_gfx_Sampler_class = nullptr;

static bool js_gfx_Sampler_getAddressW(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getAddressW : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAddressW();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getAddressW : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getAddressW)

static bool js_gfx_Sampler_getMaxAnisotropy(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMaxAnisotropy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMaxAnisotropy();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMaxAnisotropy : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMaxAnisotropy)

static bool js_gfx_Sampler_getMipLODBias(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMipLODBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMipLODBias();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMipLODBias : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMipLODBias)

static bool js_gfx_Sampler_getCmpFunc(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getCmpFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getCmpFunc();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getCmpFunc : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getCmpFunc)

static bool js_gfx_Sampler_getBorderColor(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getBorderColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::Color& result = cobj->getBorderColor();
        ok &= native_ptr_to_rooted_seval<cc::gfx::Color>((cc::gfx::Color*)&result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getBorderColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getBorderColor)

static bool js_gfx_Sampler_getName(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getName();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getName)

static bool js_gfx_Sampler_getMipFilter(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMipFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMipFilter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMipFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMipFilter)

static bool js_gfx_Sampler_getAddressV(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getAddressV : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAddressV();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getAddressV : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getAddressV)

static bool js_gfx_Sampler_getAddressU(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getAddressU : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAddressU();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getAddressU : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getAddressU)

static bool js_gfx_Sampler_getMagFilter(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMagFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMagFilter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMagFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMagFilter)

static bool js_gfx_Sampler_initialize(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::SamplerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Sampler_initialize)

static bool js_gfx_Sampler_destroy(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Sampler_destroy)

static bool js_gfx_Sampler_getDevice(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getDevice)

static bool js_gfx_Sampler_getMinLOD(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMinLOD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMinLOD();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMinLOD : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMinLOD)

static bool js_gfx_Sampler_getMinFilter(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMinFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMinFilter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMinFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMinFilter)

static bool js_gfx_Sampler_getMaxLOD(se::State& s)
{
    cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMaxLOD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMaxLOD();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMaxLOD : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMaxLOD)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Sampler_finalize)

static bool js_gfx_Sampler_constructor(se::State& s)
{
    //#3 cc::gfx::Sampler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Sampler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Sampler_constructor, __jsb_cc_gfx_Sampler_class, js_cc_gfx_Sampler_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Sampler_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Sampler* cobj = (cc::gfx::Sampler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Sampler_finalize)

bool js_register_gfx_Sampler(se::Object* obj)
{
    auto cls = se::Class::create("Sampler", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Sampler_constructor));

    cls->defineProperty("borderColor", _SE(js_gfx_Sampler_getBorderColor), nullptr);
    cls->defineProperty("mipFilter", _SE(js_gfx_Sampler_getMipFilter), nullptr);
    cls->defineProperty("minFilter", _SE(js_gfx_Sampler_getMinFilter), nullptr);
    cls->defineProperty("name", _SE(js_gfx_Sampler_getName), nullptr);
    cls->defineProperty("maxLOD", _SE(js_gfx_Sampler_getMaxLOD), nullptr);
    cls->defineProperty("magFilter", _SE(js_gfx_Sampler_getMagFilter), nullptr);
    cls->defineProperty("addressU", _SE(js_gfx_Sampler_getAddressU), nullptr);
    cls->defineProperty("addressV", _SE(js_gfx_Sampler_getAddressV), nullptr);
    cls->defineProperty("addressW", _SE(js_gfx_Sampler_getAddressW), nullptr);
    cls->defineProperty("cmpFunc", _SE(js_gfx_Sampler_getCmpFunc), nullptr);
    cls->defineProperty("maxAnisotropy", _SE(js_gfx_Sampler_getMaxAnisotropy), nullptr);
    cls->defineProperty("mipLODBias", _SE(js_gfx_Sampler_getMipLODBias), nullptr);
    cls->defineProperty("device", _SE(js_gfx_Sampler_getDevice), nullptr);
    cls->defineProperty("minLOD", _SE(js_gfx_Sampler_getMinLOD), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_Sampler_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Sampler_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Sampler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Sampler>(cls);

    __jsb_cc_gfx_Sampler_proto = cls->getProto();
    __jsb_cc_gfx_Sampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Shader_proto = nullptr;
se::Class* __jsb_cc_gfx_Shader_class = nullptr;

static bool js_gfx_Shader_getStages(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::ShaderStage>& result = cobj->getStages();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getStages : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getStages)

static bool js_gfx_Shader_getName(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getName();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getName)

static bool js_gfx_Shader_getAttributes(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Attribute>& result = cobj->getAttributes();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getAttributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getAttributes)

static bool js_gfx_Shader_getHash(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHash();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getHash)

static bool js_gfx_Shader_getSamplers(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getSamplers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformSampler>& result = cobj->getSamplers();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getSamplers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getSamplers)

static bool js_gfx_Shader_initialize(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::ShaderInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_initialize)

static bool js_gfx_Shader_destroy(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_destroy)

static bool js_gfx_Shader_getDevice(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getDevice)

static bool js_gfx_Shader_getBlocks(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getBlocks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformBlock>& result = cobj->getBlocks();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getBlocks : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getBlocks)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Shader_finalize)

static bool js_gfx_Shader_constructor(se::State& s)
{
    //#3 cc::gfx::Shader: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Shader constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Shader_constructor, __jsb_cc_gfx_Shader_class, js_cc_gfx_Shader_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Shader_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Shader_finalize)

bool js_register_gfx_Shader(se::Object* obj)
{
    auto cls = se::Class::create("Shader", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Shader_constructor));

    cls->defineProperty("blocks", _SE(js_gfx_Shader_getBlocks), nullptr);
    cls->defineProperty("name", _SE(js_gfx_Shader_getName), nullptr);
    cls->defineProperty("samplers", _SE(js_gfx_Shader_getSamplers), nullptr);
    cls->defineProperty("device", _SE(js_gfx_Shader_getDevice), nullptr);
    cls->defineProperty("attributes", _SE(js_gfx_Shader_getAttributes), nullptr);
    cls->defineProperty("stages", _SE(js_gfx_Shader_getStages), nullptr);
    cls->defineProperty("hash", _SE(js_gfx_Shader_getHash), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_Shader_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Shader_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Shader_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Shader>(cls);

    __jsb_cc_gfx_Shader_proto = cls->getProto();
    __jsb_cc_gfx_Shader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_InputAssembler_proto = nullptr;
se::Class* __jsb_cc_gfx_InputAssembler_class = nullptr;

static bool js_gfx_InputAssembler_getFirstIndex(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getFirstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstIndex();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getFirstIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getFirstIndex)

static bool js_gfx_InputAssembler_getVertexOffset(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexOffset();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getVertexOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getVertexOffset)

static bool js_gfx_InputAssembler_getVertexCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getVertexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getVertexCount)

static bool js_gfx_InputAssembler_setIndexCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setIndexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setIndexCount : Error processing arguments");
        cobj->setIndexCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setIndexCount)

static bool js_gfx_InputAssembler_getAttributesHash(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getAttributesHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getAttributesHash();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getAttributesHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getAttributesHash)

static bool js_gfx_InputAssembler_setFirstInstance(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setFirstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setFirstInstance : Error processing arguments");
        cobj->setFirstInstance(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setFirstInstance)

static bool js_gfx_InputAssembler_destroy(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_InputAssembler_destroy)

static bool js_gfx_InputAssembler_getDevice(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getDevice)

static bool js_gfx_InputAssembler_setVertexOffset(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setVertexOffset : Error processing arguments");
        cobj->setVertexOffset(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setVertexOffset)

static bool js_gfx_InputAssembler_getInstanceCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getInstanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getInstanceCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getInstanceCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getInstanceCount)

static bool js_gfx_InputAssembler_getIndexCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getIndexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIndexCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getIndexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getIndexCount)

static bool js_gfx_InputAssembler_getIndirectBuffer(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getIndirectBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->getIndirectBuffer();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getIndirectBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getIndirectBuffer)

static bool js_gfx_InputAssembler_getVertexBuffers(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getVertexBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Buffer *>& result = cobj->getVertexBuffers();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getVertexBuffers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getVertexBuffers)

static bool js_gfx_InputAssembler_initialize(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::InputAssemblerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_InputAssembler_initialize)

static bool js_gfx_InputAssembler_setFirstVertex(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setFirstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setFirstVertex : Error processing arguments");
        cobj->setFirstVertex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setFirstVertex)

static bool js_gfx_InputAssembler_getFirstVertex(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getFirstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstVertex();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getFirstVertex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getFirstVertex)

static bool js_gfx_InputAssembler_setVertexCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setVertexCount : Error processing arguments");
        cobj->setVertexCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setVertexCount)

static bool js_gfx_InputAssembler_getAttributes(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Attribute>& result = cobj->getAttributes();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getAttributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getAttributes)

static bool js_gfx_InputAssembler_getIndexBuffer(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getIndexBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->getIndexBuffer();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getIndexBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getIndexBuffer)

static bool js_gfx_InputAssembler_setFirstIndex(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setFirstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setFirstIndex : Error processing arguments");
        cobj->setFirstIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setFirstIndex)

static bool js_gfx_InputAssembler_setInstanceCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setInstanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setInstanceCount : Error processing arguments");
        cobj->setInstanceCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setInstanceCount)

static bool js_gfx_InputAssembler_getFirstInstance(se::State& s)
{
    cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getFirstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstInstance();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getFirstInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getFirstInstance)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_InputAssembler_finalize)

static bool js_gfx_InputAssembler_constructor(se::State& s)
{
    //#3 cc::gfx::InputAssembler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::InputAssembler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_InputAssembler_constructor, __jsb_cc_gfx_InputAssembler_class, js_cc_gfx_InputAssembler_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_InputAssembler_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::InputAssembler* cobj = (cc::gfx::InputAssembler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_InputAssembler_finalize)

bool js_register_gfx_InputAssembler(se::Object* obj)
{
    auto cls = se::Class::create("InputAssembler", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_InputAssembler_constructor));

    cls->defineProperty("instanceCount", _SE(js_gfx_InputAssembler_getInstanceCount), _SE(js_gfx_InputAssembler_setInstanceCount));
    cls->defineProperty("vertexBuffers", _SE(js_gfx_InputAssembler_getVertexBuffers), nullptr);
    cls->defineProperty("attributesHash", _SE(js_gfx_InputAssembler_getAttributesHash), nullptr);
    cls->defineProperty("firstInstance", _SE(js_gfx_InputAssembler_getFirstInstance), _SE(js_gfx_InputAssembler_setFirstInstance));
    cls->defineProperty("vertexOffset", _SE(js_gfx_InputAssembler_getVertexOffset), _SE(js_gfx_InputAssembler_setVertexOffset));
    cls->defineProperty("vertexCount", _SE(js_gfx_InputAssembler_getVertexCount), _SE(js_gfx_InputAssembler_setVertexCount));
    cls->defineProperty("indexBuffer", _SE(js_gfx_InputAssembler_getIndexBuffer), nullptr);
    cls->defineProperty("device", _SE(js_gfx_InputAssembler_getDevice), nullptr);
    cls->defineProperty("attributes", _SE(js_gfx_InputAssembler_getAttributes), nullptr);
    cls->defineProperty("indexCount", _SE(js_gfx_InputAssembler_getIndexCount), _SE(js_gfx_InputAssembler_setIndexCount));
    cls->defineProperty("firstIndex", _SE(js_gfx_InputAssembler_getFirstIndex), _SE(js_gfx_InputAssembler_setFirstIndex));
    cls->defineProperty("indirectBuffer", _SE(js_gfx_InputAssembler_getIndirectBuffer), nullptr);
    cls->defineProperty("firstVertex", _SE(js_gfx_InputAssembler_getFirstVertex), _SE(js_gfx_InputAssembler_setFirstVertex));
    cls->defineFunction("destroy", _SE(js_gfx_InputAssembler_destroy));
    cls->defineFunction("initialize", _SE(js_gfx_InputAssembler_initialize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_InputAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::InputAssembler>(cls);

    __jsb_cc_gfx_InputAssembler_proto = cls->getProto();
    __jsb_cc_gfx_InputAssembler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_RenderPass_proto = nullptr;
se::Class* __jsb_cc_gfx_RenderPass_class = nullptr;

static bool js_gfx_RenderPass_getColorAttachments(se::State& s)
{
    cc::gfx::RenderPass* cobj = (cc::gfx::RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getColorAttachments : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::ColorAttachment>& result = cobj->getColorAttachments();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getColorAttachments : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_RenderPass_getColorAttachments)

static bool js_gfx_RenderPass_getSubPasses(se::State& s)
{
    cc::gfx::RenderPass* cobj = (cc::gfx::RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getSubPasses : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::SubPass>& result = cobj->getSubPasses();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getSubPasses : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_RenderPass_getSubPasses)

static bool js_gfx_RenderPass_getHash(se::State& s)
{
    cc::gfx::RenderPass* cobj = (cc::gfx::RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHash();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_RenderPass_getHash)

static bool js_gfx_RenderPass_initialize(se::State& s)
{
    cc::gfx::RenderPass* cobj = (cc::gfx::RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::RenderPassInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_initialize)

static bool js_gfx_RenderPass_destroy(se::State& s)
{
    cc::gfx::RenderPass* cobj = (cc::gfx::RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_destroy)

static bool js_gfx_RenderPass_getDevice(se::State& s)
{
    cc::gfx::RenderPass* cobj = (cc::gfx::RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_RenderPass_getDevice)

static bool js_gfx_RenderPass_getDepthStencilAttachment(se::State& s)
{
    cc::gfx::RenderPass* cobj = (cc::gfx::RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getDepthStencilAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::DepthStencilAttachment& result = cobj->getDepthStencilAttachment();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getDepthStencilAttachment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_RenderPass_getDepthStencilAttachment)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_RenderPass_finalize)

static bool js_gfx_RenderPass_constructor(se::State& s)
{
    //#3 cc::gfx::RenderPass: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::RenderPass constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_RenderPass_constructor, __jsb_cc_gfx_RenderPass_class, js_cc_gfx_RenderPass_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_RenderPass_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::RenderPass* cobj = (cc::gfx::RenderPass*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_RenderPass_finalize)

bool js_register_gfx_RenderPass(se::Object* obj)
{
    auto cls = se::Class::create("RenderPass", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_RenderPass_constructor));

    cls->defineProperty("device", _SE(js_gfx_RenderPass_getDevice), nullptr);
    cls->defineProperty("colorAttachments", _SE(js_gfx_RenderPass_getColorAttachments), nullptr);
    cls->defineProperty("depthStencilAttachment", _SE(js_gfx_RenderPass_getDepthStencilAttachment), nullptr);
    cls->defineProperty("hash", _SE(js_gfx_RenderPass_getHash), nullptr);
    cls->defineProperty("subPasses", _SE(js_gfx_RenderPass_getSubPasses), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_RenderPass_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_RenderPass_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_RenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::RenderPass>(cls);

    __jsb_cc_gfx_RenderPass_proto = cls->getProto();
    __jsb_cc_gfx_RenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Framebuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_Framebuffer_class = nullptr;

static bool js_gfx_Framebuffer_getColorTextures(se::State& s)
{
    cc::gfx::Framebuffer* cobj = (cc::gfx::Framebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getColorTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Texture *>& result = cobj->getColorTextures();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getColorTextures : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getColorTextures)

static bool js_gfx_Framebuffer_getDepthStencilTexture(se::State& s)
{
    cc::gfx::Framebuffer* cobj = (cc::gfx::Framebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getDepthStencilTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Texture* result = cobj->getDepthStencilTexture();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getDepthStencilTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getDepthStencilTexture)

static bool js_gfx_Framebuffer_initialize(se::State& s)
{
    cc::gfx::Framebuffer* cobj = (cc::gfx::Framebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::FramebufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Framebuffer_initialize)

static bool js_gfx_Framebuffer_destroy(se::State& s)
{
    cc::gfx::Framebuffer* cobj = (cc::gfx::Framebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Framebuffer_destroy)

static bool js_gfx_Framebuffer_getRenderPass(se::State& s)
{
    cc::gfx::Framebuffer* cobj = (cc::gfx::Framebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::RenderPass* result = cobj->getRenderPass();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getRenderPass)

static bool js_gfx_Framebuffer_getDevice(se::State& s)
{
    cc::gfx::Framebuffer* cobj = (cc::gfx::Framebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getDevice)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Framebuffer_finalize)

static bool js_gfx_Framebuffer_constructor(se::State& s)
{
    //#3 cc::gfx::Framebuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Framebuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Framebuffer_constructor, __jsb_cc_gfx_Framebuffer_class, js_cc_gfx_Framebuffer_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Framebuffer_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Framebuffer* cobj = (cc::gfx::Framebuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Framebuffer_finalize)

bool js_register_gfx_Framebuffer(se::Object* obj)
{
    auto cls = se::Class::create("Framebuffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Framebuffer_constructor));

    cls->defineProperty("device", _SE(js_gfx_Framebuffer_getDevice), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_Framebuffer_getRenderPass), nullptr);
    cls->defineProperty("colorTextures", _SE(js_gfx_Framebuffer_getColorTextures), nullptr);
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_Framebuffer_getDepthStencilTexture), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_Framebuffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Framebuffer_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Framebuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Framebuffer>(cls);

    __jsb_cc_gfx_Framebuffer_proto = cls->getProto();
    __jsb_cc_gfx_Framebuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BindingLayout_proto = nullptr;
se::Class* __jsb_cc_gfx_BindingLayout_class = nullptr;

static bool js_gfx_BindingLayout_getBindingUnits(se::State& s)
{
    cc::gfx::BindingLayout* cobj = (cc::gfx::BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayout_getBindingUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::BindingUnit>& result = cobj->getBindingUnits();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_BindingLayout_getBindingUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_BindingLayout_getBindingUnits)

static bool js_gfx_BindingLayout_bindBuffer(se::State& s)
{
    cc::gfx::BindingLayout* cobj = (cc::gfx::BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayout_bindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cc::gfx::Buffer* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_BindingLayout_bindBuffer : Error processing arguments");
        cobj->bindBuffer(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_BindingLayout_bindBuffer)

static bool js_gfx_BindingLayout_bindSampler(se::State& s)
{
    cc::gfx::BindingLayout* cobj = (cc::gfx::BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayout_bindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cc::gfx::Sampler* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_BindingLayout_bindSampler : Error processing arguments");
        cobj->bindSampler(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_BindingLayout_bindSampler)

static bool js_gfx_BindingLayout_update(se::State& s)
{
    cc::gfx::BindingLayout* cobj = (cc::gfx::BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayout_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_BindingLayout_update)

static bool js_gfx_BindingLayout_bindTexture(se::State& s)
{
    cc::gfx::BindingLayout* cobj = (cc::gfx::BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayout_bindTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cc::gfx::Texture* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_BindingLayout_bindTexture : Error processing arguments");
        cobj->bindTexture(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_BindingLayout_bindTexture)

static bool js_gfx_BindingLayout_initialize(se::State& s)
{
    cc::gfx::BindingLayout* cobj = (cc::gfx::BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::BindingLayoutInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_BindingLayout_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_BindingLayout_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_BindingLayout_initialize)

static bool js_gfx_BindingLayout_destroy(se::State& s)
{
    cc::gfx::BindingLayout* cobj = (cc::gfx::BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_BindingLayout_destroy)

static bool js_gfx_BindingLayout_getDevice(se::State& s)
{
    cc::gfx::BindingLayout* cobj = (cc::gfx::BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingLayout_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_BindingLayout_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_BindingLayout_getDevice)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BindingLayout_finalize)

static bool js_gfx_BindingLayout_constructor(se::State& s)
{
    //#3 cc::gfx::BindingLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::BindingLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_BindingLayout_constructor, __jsb_cc_gfx_BindingLayout_class, js_cc_gfx_BindingLayout_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_BindingLayout_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BindingLayout* cobj = (cc::gfx::BindingLayout*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BindingLayout_finalize)

bool js_register_gfx_BindingLayout(se::Object* obj)
{
    auto cls = se::Class::create("BindingLayout", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_BindingLayout_constructor));

    cls->defineProperty("device", _SE(js_gfx_BindingLayout_getDevice), nullptr);
    cls->defineProperty("bindingUnits", _SE(js_gfx_BindingLayout_getBindingUnits), nullptr);
    cls->defineFunction("bindBuffer", _SE(js_gfx_BindingLayout_bindBuffer));
    cls->defineFunction("bindSampler", _SE(js_gfx_BindingLayout_bindSampler));
    cls->defineFunction("update", _SE(js_gfx_BindingLayout_update));
    cls->defineFunction("bindTexture", _SE(js_gfx_BindingLayout_bindTexture));
    cls->defineFunction("initialize", _SE(js_gfx_BindingLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_BindingLayout_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BindingLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BindingLayout>(cls);

    __jsb_cc_gfx_BindingLayout_proto = cls->getProto();
    __jsb_cc_gfx_BindingLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_PipelineState_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineState_class = nullptr;

static bool js_gfx_PipelineState_getRasterizerState(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getRasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::RasterizerState& result = cobj->getRasterizerState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getRasterizerState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getRasterizerState)

static bool js_gfx_PipelineState_getShader(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Shader* result = cobj->getShader();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getShader)

static bool js_gfx_PipelineState_getInputState(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getInputState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::InputState& result = cobj->getInputState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getInputState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getInputState)

static bool js_gfx_PipelineState_getPrimitive(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getPrimitive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getPrimitive();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getPrimitive : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getPrimitive)

static bool js_gfx_PipelineState_getDepthStencilState(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getDepthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::DepthStencilState& result = cobj->getDepthStencilState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getDepthStencilState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getDepthStencilState)

static bool js_gfx_PipelineState_getBlendState(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getBlendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::BlendState& result = cobj->getBlendState();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getBlendState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getBlendState)

static bool js_gfx_PipelineState_initialize(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::PipelineStateInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_initialize)

static bool js_gfx_PipelineState_destroy(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_destroy)

static bool js_gfx_PipelineState_getRenderPass(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::RenderPass* result = cobj->getRenderPass();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getRenderPass)

static bool js_gfx_PipelineState_getDevice(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getDevice)

static bool js_gfx_PipelineState_getDynamicStates(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getDynamicStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::DynamicState>& result = cobj->getDynamicStates();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getDynamicStates : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_getDynamicStates)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineState_finalize)

static bool js_gfx_PipelineState_constructor(se::State& s)
{
    //#3 cc::gfx::PipelineState: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::PipelineState constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_PipelineState_constructor, __jsb_cc_gfx_PipelineState_class, js_cc_gfx_PipelineState_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_PipelineState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineState_finalize)

bool js_register_gfx_PipelineState(se::Object* obj)
{
    auto cls = se::Class::create("PipelineState", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_PipelineState_constructor));

    cls->defineProperty("primitive", _SE(js_gfx_PipelineState_getPrimitive), nullptr);
    cls->defineProperty("rasterizerState", _SE(js_gfx_PipelineState_getRasterizerState), nullptr);
    cls->defineProperty("shader", _SE(js_gfx_PipelineState_getShader), nullptr);
    cls->defineProperty("blendState", _SE(js_gfx_PipelineState_getBlendState), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_PipelineState_getRenderPass), nullptr);
    cls->defineProperty("device", _SE(js_gfx_PipelineState_getDevice), nullptr);
    cls->defineProperty("inputState", _SE(js_gfx_PipelineState_getInputState), nullptr);
    cls->defineProperty("depthStencilState", _SE(js_gfx_PipelineState_getDepthStencilState), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_PipelineState_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_PipelineState_destroy));
    cls->defineFunction("getDynamicStates", _SE(js_gfx_PipelineState_getDynamicStates));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineState>(cls);

    __jsb_cc_gfx_PipelineState_proto = cls->getProto();
    __jsb_cc_gfx_PipelineState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_CommandBuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_CommandBuffer_class = nullptr;

static bool js_gfx_CommandBuffer_draw(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::InputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_draw : Error processing arguments");
        cobj->draw(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_draw)

static bool js_gfx_CommandBuffer_setBlendConstants(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setBlendConstants : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::Color* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setBlendConstants : Error processing arguments");
        cobj->setBlendConstants(*arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setBlendConstants)

static bool js_gfx_CommandBuffer_setDepthBound(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setDepthBound : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setDepthBound : Error processing arguments");
        cobj->setDepthBound(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setDepthBound)

static bool js_gfx_CommandBuffer_copyBufferToTexture(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_copyBufferToTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cc::gfx::Buffer* arg0 = nullptr;
        cc::gfx::Texture* arg1 = nullptr;
        cc::gfx::TextureLayout arg2;
        std::vector<cc::gfx::BufferTextureCopy> arg3;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::TextureLayout)tmp; } while(false);
        ok &= seval_to_std_vector(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_copyBufferToTexture : Error processing arguments");
        cobj->copyBufferToTexture(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_copyBufferToTexture)

static bool js_gfx_CommandBuffer_getQueue(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Queue* result = cobj->getQueue();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getQueue)

static bool js_gfx_CommandBuffer_setLineWidth(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setLineWidth)

static bool js_gfx_CommandBuffer_updateBuffer(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_updateBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::gfx::Buffer* arg0 = nullptr;
        void* arg1 = nullptr;
        unsigned int arg2 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_updateBuffer : Error processing arguments");
        cobj->updateBuffer(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cc::gfx::Buffer* arg0 = nullptr;
        void* arg1 = nullptr;
        unsigned int arg2 = 0;
        unsigned int arg3 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_updateBuffer : Error processing arguments");
        cobj->updateBuffer(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_updateBuffer)

static bool js_gfx_CommandBuffer_end(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_end : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->end();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_end)

static bool js_gfx_CommandBuffer_setStencilWriteMask(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setStencilWriteMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::gfx::StencilFace arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StencilFace)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setStencilWriteMask : Error processing arguments");
        cobj->setStencilWriteMask(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setStencilWriteMask)

static bool js_gfx_CommandBuffer_getNumInstances(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getNumInstances : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumInstances();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getNumInstances : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getNumInstances)

static bool js_gfx_CommandBuffer_setStencilCompareMask(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setStencilCompareMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::gfx::StencilFace arg0;
        int arg1 = 0;
        unsigned int arg2 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::StencilFace)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setStencilCompareMask : Error processing arguments");
        cobj->setStencilCompareMask(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setStencilCompareMask)

static bool js_gfx_CommandBuffer_bindInputAssembler(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_bindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::InputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_bindInputAssembler : Error processing arguments");
        cobj->bindInputAssembler(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindInputAssembler)

static bool js_gfx_CommandBuffer_bindPipelineState(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_bindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::PipelineState* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_bindPipelineState : Error processing arguments");
        cobj->bindPipelineState(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindPipelineState)

static bool js_gfx_CommandBuffer_destroy(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_destroy)

static bool js_gfx_CommandBuffer_getDevice(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getDevice)

static bool js_gfx_CommandBuffer_getNumTris(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getNumTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumTris();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getNumTris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getNumTris)

static bool js_gfx_CommandBuffer_setViewport(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::Viewport* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setViewport : Error processing arguments");
        cobj->setViewport(*arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setViewport)

static bool js_gfx_CommandBuffer_setDepthBias(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setDepthBias : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setDepthBias : Error processing arguments");
        cobj->setDepthBias(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setDepthBias)

static bool js_gfx_CommandBuffer_begin(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_begin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->begin();
        return true;
    }
    if (argc == 1) {
        cc::gfx::RenderPass* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_begin : Error processing arguments");
        cobj->begin(arg0);
        return true;
    }
    if (argc == 2) {
        cc::gfx::RenderPass* arg0 = nullptr;
        unsigned int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_begin : Error processing arguments");
        cobj->begin(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cc::gfx::RenderPass* arg0 = nullptr;
        unsigned int arg1 = 0;
        cc::gfx::Framebuffer* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_begin : Error processing arguments");
        cobj->begin(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_begin)

static bool js_gfx_CommandBuffer_getType(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getType)

static bool js_gfx_CommandBuffer_bindBindingLayout(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_bindBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::BindingLayout* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_bindBindingLayout : Error processing arguments");
        cobj->bindBindingLayout(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindBindingLayout)

static bool js_gfx_CommandBuffer_endRenderPass(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_endRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->endRenderPass();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_endRenderPass)

static bool js_gfx_CommandBuffer_initialize(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::CommandBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_initialize)

static bool js_gfx_CommandBuffer_setScissor(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::Rect* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setScissor : Error processing arguments");
        cobj->setScissor(*arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setScissor)

static bool js_gfx_CommandBuffer_beginRenderPass(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_beginRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        cc::gfx::RenderPass* arg0 = nullptr;
        cc::gfx::Framebuffer* arg1 = nullptr;
        cc::gfx::Rect* arg2 = nullptr;
        std::vector<cc::gfx::Color> arg3;
        float arg4 = 0;
        int arg5 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_reference(args[2], &arg2);
        ok &= seval_to_std_vector(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_beginRenderPass : Error processing arguments");
        cobj->beginRenderPass(arg0, arg1, *arg2, arg3, arg4, arg5);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_beginRenderPass)

static bool js_gfx_CommandBuffer_getNumDrawCalls(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getNumDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumDrawCalls();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getNumDrawCalls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getNumDrawCalls)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_CommandBuffer_finalize)

static bool js_gfx_CommandBuffer_constructor(se::State& s)
{
    //#3 cc::gfx::CommandBuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::CommandBuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_CommandBuffer_constructor, __jsb_cc_gfx_CommandBuffer_class, js_cc_gfx_CommandBuffer_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_CommandBuffer_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_CommandBuffer_finalize)

bool js_register_gfx_CommandBuffer(se::Object* obj)
{
    auto cls = se::Class::create("CommandBuffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_CommandBuffer_constructor));

    cls->defineFunction("draw", _SE(js_gfx_CommandBuffer_draw));
    cls->defineFunction("setBlendConstants", _SE(js_gfx_CommandBuffer_setBlendConstants));
    cls->defineFunction("setDepthBound", _SE(js_gfx_CommandBuffer_setDepthBound));
    cls->defineFunction("copyBufferToTexture", _SE(js_gfx_CommandBuffer_copyBufferToTexture));
    cls->defineFunction("getQueue", _SE(js_gfx_CommandBuffer_getQueue));
    cls->defineFunction("setLineWidth", _SE(js_gfx_CommandBuffer_setLineWidth));
    cls->defineFunction("updateBuffer", _SE(js_gfx_CommandBuffer_updateBuffer));
    cls->defineFunction("end", _SE(js_gfx_CommandBuffer_end));
    cls->defineFunction("setStencilWriteMask", _SE(js_gfx_CommandBuffer_setStencilWriteMask));
    cls->defineFunction("getNumInstances", _SE(js_gfx_CommandBuffer_getNumInstances));
    cls->defineFunction("setStencilCompareMask", _SE(js_gfx_CommandBuffer_setStencilCompareMask));
    cls->defineFunction("bindInputAssembler", _SE(js_gfx_CommandBuffer_bindInputAssembler));
    cls->defineFunction("bindPipelineState", _SE(js_gfx_CommandBuffer_bindPipelineState));
    cls->defineFunction("destroy", _SE(js_gfx_CommandBuffer_destroy));
    cls->defineFunction("getDevice", _SE(js_gfx_CommandBuffer_getDevice));
    cls->defineFunction("getNumTris", _SE(js_gfx_CommandBuffer_getNumTris));
    cls->defineFunction("setViewport", _SE(js_gfx_CommandBuffer_setViewport));
    cls->defineFunction("setDepthBias", _SE(js_gfx_CommandBuffer_setDepthBias));
    cls->defineFunction("begin", _SE(js_gfx_CommandBuffer_begin));
    cls->defineFunction("getType", _SE(js_gfx_CommandBuffer_getType));
    cls->defineFunction("bindBindingLayout", _SE(js_gfx_CommandBuffer_bindBindingLayout));
    cls->defineFunction("endRenderPass", _SE(js_gfx_CommandBuffer_endRenderPass));
    cls->defineFunction("initialize", _SE(js_gfx_CommandBuffer_initialize));
    cls->defineFunction("setScissor", _SE(js_gfx_CommandBuffer_setScissor));
    cls->defineFunction("beginRenderPass", _SE(js_gfx_CommandBuffer_beginRenderPass));
    cls->defineFunction("getNumDrawCalls", _SE(js_gfx_CommandBuffer_getNumDrawCalls));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_CommandBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::CommandBuffer>(cls);

    __jsb_cc_gfx_CommandBuffer_proto = cls->getProto();
    __jsb_cc_gfx_CommandBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Fence_proto = nullptr;
se::Class* __jsb_cc_gfx_Fence_class = nullptr;

static bool js_gfx_Fence_initialize(se::State& s)
{
    cc::gfx::Fence* cobj = (cc::gfx::Fence*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Fence_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::FenceInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Fence_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Fence_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Fence_initialize)

static bool js_gfx_Fence_destroy(se::State& s)
{
    cc::gfx::Fence* cobj = (cc::gfx::Fence*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Fence_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Fence_destroy)

static bool js_gfx_Fence_wait(se::State& s)
{
    cc::gfx::Fence* cobj = (cc::gfx::Fence*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Fence_wait : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->wait();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Fence_wait)

static bool js_gfx_Fence_reset(se::State& s)
{
    cc::gfx::Fence* cobj = (cc::gfx::Fence*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Fence_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Fence_reset)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Fence_finalize)

static bool js_gfx_Fence_constructor(se::State& s)
{
    //#3 cc::gfx::Fence: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Fence constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Fence_constructor, __jsb_cc_gfx_Fence_class, js_cc_gfx_Fence_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Fence_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Fence* cobj = (cc::gfx::Fence*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Fence_finalize)

bool js_register_gfx_Fence(se::Object* obj)
{
    auto cls = se::Class::create("Fence", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Fence_constructor));

    cls->defineFunction("initialize", _SE(js_gfx_Fence_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Fence_destroy));
    cls->defineFunction("wait", _SE(js_gfx_Fence_wait));
    cls->defineFunction("reset", _SE(js_gfx_Fence_reset));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Fence_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Fence>(cls);

    __jsb_cc_gfx_Fence_proto = cls->getProto();
    __jsb_cc_gfx_Fence_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Queue_proto = nullptr;
se::Class* __jsb_cc_gfx_Queue_class = nullptr;

static bool js_gfx_Queue_getType(se::State& s)
{
    cc::gfx::Queue* cobj = (cc::gfx::Queue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Queue_getType)

static bool js_gfx_Queue_submit(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::Queue* cobj = (cc::gfx::Queue*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_Queue_submit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::vector<cc::gfx::CommandBuffer *> arg0;
            ok &= seval_to_std_vector(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->submit(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            std::vector<cc::gfx::CommandBuffer *> arg0;
            ok &= seval_to_std_vector(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cc::gfx::Fence* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cobj->submit(arg0, arg1);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_submit)

static bool js_gfx_Queue_isAsync(se::State& s)
{
    cc::gfx::Queue* cobj = (cc::gfx::Queue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_isAsync : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAsync();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_isAsync : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_isAsync)

static bool js_gfx_Queue_initialize(se::State& s)
{
    cc::gfx::Queue* cobj = (cc::gfx::Queue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::QueueInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_initialize)

static bool js_gfx_Queue_destroy(se::State& s)
{
    cc::gfx::Queue* cobj = (cc::gfx::Queue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_destroy)

static bool js_gfx_Queue_getDevice(se::State& s)
{
    cc::gfx::Queue* cobj = (cc::gfx::Queue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Queue_getDevice)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Queue_finalize)

static bool js_gfx_Queue_constructor(se::State& s)
{
    //#3 cc::gfx::Queue: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Queue constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Queue_constructor, __jsb_cc_gfx_Queue_class, js_cc_gfx_Queue_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Queue_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Queue* cobj = (cc::gfx::Queue*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Queue_finalize)

bool js_register_gfx_Queue(se::Object* obj)
{
    auto cls = se::Class::create("Queue", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Queue_constructor));

    cls->defineProperty("device", _SE(js_gfx_Queue_getDevice), nullptr);
    cls->defineProperty("type", _SE(js_gfx_Queue_getType), nullptr);
    cls->defineFunction("submit", _SE(js_gfx_Queue_submit));
    cls->defineFunction("isAsync", _SE(js_gfx_Queue_isAsync));
    cls->defineFunction("initialize", _SE(js_gfx_Queue_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Queue_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Queue_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Queue>(cls);

    __jsb_cc_gfx_Queue_proto = cls->getProto();
    __jsb_cc_gfx_Queue_class = cls;

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

    js_register_gfx_GFXObject(ns);
    js_register_gfx_CommandBuffer(ns);
    js_register_gfx_ContextInfo(ns);
    js_register_gfx_Texture(ns);
    js_register_gfx_Uniform(ns);
    js_register_gfx_BlendTarget(ns);
    js_register_gfx_Sampler(ns);
    js_register_gfx_InputAssembler(ns);
    js_register_gfx_RenderPass(ns);
    js_register_gfx_BufferInfo(ns);
    js_register_gfx_SamplerInfo(ns);
    js_register_gfx_QueueInfo(ns);
    js_register_gfx_BindingUnit(ns);
    js_register_gfx_BufferTextureCopy(ns);
    js_register_gfx_ShaderMacro(ns);
    js_register_gfx_FormatInfo(ns);
    js_register_gfx_TextureSubres(ns);
    js_register_gfx_InputAssemblerInfo(ns);
    js_register_gfx_TextureInfo(ns);
    js_register_gfx_PipelineState(ns);
    js_register_gfx_RenderPassInfo(ns);
    js_register_gfx_Extent(ns);
    js_register_gfx_Offset(ns);
    js_register_gfx_Device(ns);
    js_register_gfx_Framebuffer(ns);
    js_register_gfx_Viewport(ns);
    js_register_gfx_BindingLayout(ns);
    js_register_gfx_UniformSampler(ns);
    js_register_gfx_ShaderInfo(ns);
    js_register_gfx_PipelineStateInfo(ns);
    js_register_gfx_Shader(ns);
    js_register_gfx_BlendState(ns);
    js_register_gfx_Queue(ns);
    js_register_gfx_DrawInfo(ns);
    js_register_gfx_CommandBufferInfo(ns);
    js_register_gfx_UniformBlock(ns);
    js_register_gfx_DepthStencilAttachment(ns);
    js_register_gfx_TextureViewInfo(ns);
    js_register_gfx_ColorAttachment(ns);
    js_register_gfx_RasterizerState(ns);
    js_register_gfx_Fence(ns);
    js_register_gfx_Color(ns);
    js_register_gfx_Attribute(ns);
    js_register_gfx_MemoryStatus(ns);
    js_register_gfx_DeviceInfo(ns);
    js_register_gfx_DepthStencilState(ns);
    js_register_gfx_Buffer(ns);
    js_register_gfx_FramebufferInfo(ns);
    js_register_gfx_BindingLayoutInfo(ns);
    js_register_gfx_Rect(ns);
    js_register_gfx_ShaderStage(ns);
    js_register_gfx_InputState(ns);
    js_register_gfx_TextureCopy(ns);
    js_register_gfx_IndirectBuffer(ns);
    return true;
}

