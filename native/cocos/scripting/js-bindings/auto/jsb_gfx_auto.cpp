#include "scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
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
        cocos2d::GFXOffset* cobj = new (std::nothrow) cocos2d::GFXOffset();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        int arg0 = 0;
        json->getProperty("x", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".x\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (int)tmp; } while(false);
        int arg1 = 0;
        json->getProperty("y", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".y\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (int)tmp; } while(false);
        int arg2 = 0;
        json->getProperty("z", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".z\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (int)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXOffset* cobj = new (std::nothrow) cocos2d::GFXOffset();
        cobj->x = arg0;
        cobj->y = arg1;
        cobj->z = arg2;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        int arg2 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXOffset* cobj = new (std::nothrow) cocos2d::GFXOffset();
        cobj->x = arg0;
        cobj->y = arg1;
        cobj->z = arg2;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXOffset_constructor, __jsb_cocos2d_GFXOffset_class, js_cocos2d_GFXOffset_finalize)




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
        cocos2d::GFXRect* cobj = new (std::nothrow) cocos2d::GFXRect();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        int arg0 = 0;
        json->getProperty("x", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".x\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (int)tmp; } while(false);
        int arg1 = 0;
        json->getProperty("y", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".y\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (int)tmp; } while(false);
        unsigned int arg2 = 0;
        json->getProperty("width", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".width\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        json->getProperty("height", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".height\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXRect* cobj = new (std::nothrow) cocos2d::GFXRect();
        cobj->x = arg0;
        cobj->y = arg1;
        cobj->width = arg2;
        cobj->height = arg3;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXRect* cobj = new (std::nothrow) cocos2d::GFXRect();
        cobj->x = arg0;
        cobj->y = arg1;
        cobj->width = arg2;
        cobj->height = arg3;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXRect_constructor, __jsb_cocos2d_GFXRect_class, js_cocos2d_GFXRect_finalize)




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
        cocos2d::GFXExtent* cobj = new (std::nothrow) cocos2d::GFXExtent();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        unsigned int arg0 = 0;
        json->getProperty("width", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".width\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        json->getProperty("height", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".height\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        json->getProperty("depth", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXExtent* cobj = new (std::nothrow) cocos2d::GFXExtent();
        cobj->width = arg0;
        cobj->height = arg1;
        cobj->depth = arg2;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXExtent* cobj = new (std::nothrow) cocos2d::GFXExtent();
        cobj->width = arg0;
        cobj->height = arg1;
        cobj->depth = arg2;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXExtent_constructor, __jsb_cocos2d_GFXExtent_class, js_cocos2d_GFXExtent_finalize)




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

static bool js_gfx_GFXTextureSubres_get_base_mip_level(se::State& s)
{
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_get_base_mip_level : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->base_mip_level, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureSubres_get_base_mip_level)

static bool js_gfx_GFXTextureSubres_set_base_mip_level(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_base_mip_level : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_base_mip_level : Error processing new value");
    cobj->base_mip_level = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_base_mip_level)

static bool js_gfx_GFXTextureSubres_get_level_count(se::State& s)
{
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_get_level_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->level_count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureSubres_get_level_count)

static bool js_gfx_GFXTextureSubres_set_level_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_level_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_level_count : Error processing new value");
    cobj->level_count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_level_count)

static bool js_gfx_GFXTextureSubres_get_base_array_layer(se::State& s)
{
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_get_base_array_layer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->base_array_layer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureSubres_get_base_array_layer)

static bool js_gfx_GFXTextureSubres_set_base_array_layer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_base_array_layer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_base_array_layer : Error processing new value");
    cobj->base_array_layer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_base_array_layer)

static bool js_gfx_GFXTextureSubres_get_layer_count(se::State& s)
{
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_get_layer_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->layer_count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureSubres_get_layer_count)

static bool js_gfx_GFXTextureSubres_set_layer_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureSubres* cobj = (cocos2d::GFXTextureSubres*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureSubres_set_layer_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureSubres_set_layer_count : Error processing new value");
    cobj->layer_count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureSubres_set_layer_count)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTextureSubres_finalize)

static bool js_gfx_GFXTextureSubres_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXTextureSubres* cobj = new (std::nothrow) cocos2d::GFXTextureSubres();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        unsigned int arg0 = 0;
        json->getProperty("base_mip_level", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".base_mip_level\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        json->getProperty("level_count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".level_count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        json->getProperty("base_array_layer", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".base_array_layer\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        json->getProperty("layer_count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".layer_count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXTextureSubres* cobj = new (std::nothrow) cocos2d::GFXTextureSubres();
        cobj->base_mip_level = arg0;
        cobj->level_count = arg1;
        cobj->base_array_layer = arg2;
        cobj->layer_count = arg3;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXTextureSubres* cobj = new (std::nothrow) cocos2d::GFXTextureSubres();
        cobj->base_mip_level = arg0;
        cobj->level_count = arg1;
        cobj->base_array_layer = arg2;
        cobj->layer_count = arg3;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXTextureSubres_constructor, __jsb_cocos2d_GFXTextureSubres_class, js_cocos2d_GFXTextureSubres_finalize)




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

    cls->defineProperty("base_mip_level", _SE(js_gfx_GFXTextureSubres_get_base_mip_level), _SE(js_gfx_GFXTextureSubres_set_base_mip_level));
    cls->defineProperty("level_count", _SE(js_gfx_GFXTextureSubres_get_level_count), _SE(js_gfx_GFXTextureSubres_set_level_count));
    cls->defineProperty("base_array_layer", _SE(js_gfx_GFXTextureSubres_get_base_array_layer), _SE(js_gfx_GFXTextureSubres_set_base_array_layer));
    cls->defineProperty("layer_count", _SE(js_gfx_GFXTextureSubres_get_layer_count), _SE(js_gfx_GFXTextureSubres_set_layer_count));
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

static bool js_gfx_GFXTextureCopy_get_src_subres(se::State& s)
{
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_get_src_subres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->src_subres, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureCopy_get_src_subres)

static bool js_gfx_GFXTextureCopy_set_src_subres(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_src_subres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_src_subres : Error processing new value");
    cobj->src_subres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_src_subres)

static bool js_gfx_GFXTextureCopy_get_src_offset(se::State& s)
{
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_get_src_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->src_offset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureCopy_get_src_offset)

static bool js_gfx_GFXTextureCopy_set_src_offset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_src_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXOffset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_src_offset : Error processing new value");
    cobj->src_offset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_src_offset)

static bool js_gfx_GFXTextureCopy_get_dst_subres(se::State& s)
{
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_get_dst_subres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->dst_subres, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureCopy_get_dst_subres)

static bool js_gfx_GFXTextureCopy_set_dst_subres(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_dst_subres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_dst_subres : Error processing new value");
    cobj->dst_subres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_dst_subres)

static bool js_gfx_GFXTextureCopy_get_dst_offset(se::State& s)
{
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_get_dst_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->dst_offset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureCopy_get_dst_offset)

static bool js_gfx_GFXTextureCopy_set_dst_offset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureCopy* cobj = (cocos2d::GFXTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureCopy_set_dst_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXOffset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureCopy_set_dst_offset : Error processing new value");
    cobj->dst_offset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureCopy_set_dst_offset)

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
        cocos2d::GFXTextureCopy* cobj = new (std::nothrow) cocos2d::GFXTextureCopy();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXTextureSubres* arg0 = 0;
        json->getProperty("src_subres", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".src_subres\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg0);
        cocos2d::GFXOffset* arg1 = 0;
        json->getProperty("src_offset", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".src_offset\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg1);
        cocos2d::GFXTextureSubres* arg2 = 0;
        json->getProperty("dst_subres", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".dst_subres\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg2);
        cocos2d::GFXOffset* arg3 = 0;
        json->getProperty("dst_offset", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".dst_offset\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg3);
        cocos2d::GFXExtent* arg4 = 0;
        json->getProperty("extent", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".extent\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg4);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXTextureCopy* cobj = new (std::nothrow) cocos2d::GFXTextureCopy();
        cobj->src_subres = *arg0;
        cobj->src_offset = *arg1;
        cobj->dst_subres = *arg2;
        cobj->dst_offset = *arg3;
        cobj->extent = *arg4;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 5)
    {
        cocos2d::GFXTextureSubres arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureSubres
            ok = false;
        cocos2d::GFXOffset arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXOffset
            ok = false;
        cocos2d::GFXTextureSubres arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureSubres
            ok = false;
        cocos2d::GFXOffset arg3;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXOffset
            ok = false;
        cocos2d::GFXExtent arg4;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXExtent
            ok = false;

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXTextureCopy* cobj = new (std::nothrow) cocos2d::GFXTextureCopy();
        cobj->src_subres = arg0;
        cobj->src_offset = arg1;
        cobj->dst_subres = arg2;
        cobj->dst_offset = arg3;
        cobj->extent = arg4;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXTextureCopy_constructor, __jsb_cocos2d_GFXTextureCopy_class, js_cocos2d_GFXTextureCopy_finalize)




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

    cls->defineProperty("src_subres", _SE(js_gfx_GFXTextureCopy_get_src_subres), _SE(js_gfx_GFXTextureCopy_set_src_subres));
    cls->defineProperty("src_offset", _SE(js_gfx_GFXTextureCopy_get_src_offset), _SE(js_gfx_GFXTextureCopy_set_src_offset));
    cls->defineProperty("dst_subres", _SE(js_gfx_GFXTextureCopy_get_dst_subres), _SE(js_gfx_GFXTextureCopy_set_dst_subres));
    cls->defineProperty("dst_offset", _SE(js_gfx_GFXTextureCopy_get_dst_offset), _SE(js_gfx_GFXTextureCopy_set_dst_offset));
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

static bool js_gfx_GFXBufferTextureCopy_get_buff_offset(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_buff_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->buff_offset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_buff_offset)

static bool js_gfx_GFXBufferTextureCopy_set_buff_offset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_buff_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_buff_offset : Error processing new value");
    cobj->buff_offset = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_buff_offset)

static bool js_gfx_GFXBufferTextureCopy_get_buff_stride(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_buff_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->buff_stride, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_buff_stride)

static bool js_gfx_GFXBufferTextureCopy_set_buff_stride(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_buff_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_buff_stride : Error processing new value");
    cobj->buff_stride = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_buff_stride)

static bool js_gfx_GFXBufferTextureCopy_get_buff_tex_height(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_buff_tex_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->buff_tex_height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_buff_tex_height)

static bool js_gfx_GFXBufferTextureCopy_set_buff_tex_height(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_buff_tex_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_buff_tex_height : Error processing new value");
    cobj->buff_tex_height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_buff_tex_height)

static bool js_gfx_GFXBufferTextureCopy_get_tex_offset(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_tex_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->tex_offset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_tex_offset)

static bool js_gfx_GFXBufferTextureCopy_set_tex_offset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_tex_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXOffset* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_tex_offset : Error processing new value");
    cobj->tex_offset = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_tex_offset)

static bool js_gfx_GFXBufferTextureCopy_get_tex_extent(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_tex_extent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->tex_extent, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_tex_extent)

static bool js_gfx_GFXBufferTextureCopy_set_tex_extent(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_tex_extent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXExtent* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_tex_extent : Error processing new value");
    cobj->tex_extent = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_tex_extent)

static bool js_gfx_GFXBufferTextureCopy_get_tex_subres(se::State& s)
{
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_get_tex_subres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->tex_subres, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferTextureCopy_get_tex_subres)

static bool js_gfx_GFXBufferTextureCopy_set_tex_subres(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferTextureCopy* cobj = (cocos2d::GFXBufferTextureCopy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferTextureCopy_set_tex_subres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureSubres* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferTextureCopy_set_tex_subres : Error processing new value");
    cobj->tex_subres = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferTextureCopy_set_tex_subres)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBufferTextureCopy_finalize)

static bool js_gfx_GFXBufferTextureCopy_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXBufferTextureCopy* cobj = new (std::nothrow) cocos2d::GFXBufferTextureCopy();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        unsigned int arg0 = 0;
        json->getProperty("buff_offset", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".buff_offset\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        json->getProperty("buff_stride", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".buff_stride\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        json->getProperty("buff_tex_height", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".buff_tex_height\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);
        cocos2d::GFXOffset* arg3 = 0;
        json->getProperty("tex_offset", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".tex_offset\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg3);
        cocos2d::GFXExtent* arg4 = 0;
        json->getProperty("tex_extent", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".tex_extent\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg4);
        cocos2d::GFXTextureSubres* arg5 = 0;
        json->getProperty("tex_subres", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".tex_subres\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg5);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXBufferTextureCopy* cobj = new (std::nothrow) cocos2d::GFXBufferTextureCopy();
        cobj->buff_offset = arg0;
        cobj->buff_stride = arg1;
        cobj->buff_tex_height = arg2;
        cobj->tex_offset = *arg3;
        cobj->tex_extent = *arg4;
        cobj->tex_subres = *arg5;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        cocos2d::GFXOffset arg3;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXOffset
            ok = false;
        cocos2d::GFXExtent arg4;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXExtent
            ok = false;
        cocos2d::GFXTextureSubres arg5;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureSubres
            ok = false;

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXBufferTextureCopy* cobj = new (std::nothrow) cocos2d::GFXBufferTextureCopy();
        cobj->buff_offset = arg0;
        cobj->buff_stride = arg1;
        cobj->buff_tex_height = arg2;
        cobj->tex_offset = arg3;
        cobj->tex_extent = arg4;
        cobj->tex_subres = arg5;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXBufferTextureCopy_constructor, __jsb_cocos2d_GFXBufferTextureCopy_class, js_cocos2d_GFXBufferTextureCopy_finalize)




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

    cls->defineProperty("buff_offset", _SE(js_gfx_GFXBufferTextureCopy_get_buff_offset), _SE(js_gfx_GFXBufferTextureCopy_set_buff_offset));
    cls->defineProperty("buff_stride", _SE(js_gfx_GFXBufferTextureCopy_get_buff_stride), _SE(js_gfx_GFXBufferTextureCopy_set_buff_stride));
    cls->defineProperty("buff_tex_height", _SE(js_gfx_GFXBufferTextureCopy_get_buff_tex_height), _SE(js_gfx_GFXBufferTextureCopy_set_buff_tex_height));
    cls->defineProperty("tex_offset", _SE(js_gfx_GFXBufferTextureCopy_get_tex_offset), _SE(js_gfx_GFXBufferTextureCopy_set_tex_offset));
    cls->defineProperty("tex_extent", _SE(js_gfx_GFXBufferTextureCopy_get_tex_extent), _SE(js_gfx_GFXBufferTextureCopy_set_tex_extent));
    cls->defineProperty("tex_subres", _SE(js_gfx_GFXBufferTextureCopy_get_tex_subres), _SE(js_gfx_GFXBufferTextureCopy_set_tex_subres));
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
        cocos2d::GFXViewport* cobj = new (std::nothrow) cocos2d::GFXViewport();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        int arg0 = 0;
        json->getProperty("left", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".left\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (int)tmp; } while(false);
        int arg1 = 0;
        json->getProperty("top", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".top\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (int)tmp; } while(false);
        unsigned int arg2 = 0;
        json->getProperty("width", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".width\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        json->getProperty("height", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".height\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);
        float arg4 = 0;
        json->getProperty("minDepth", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".minDepth\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg4);
        float arg5 = 0;
        json->getProperty("maxDepth", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".maxDepth\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg5);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXViewport* cobj = new (std::nothrow) cocos2d::GFXViewport();
        cobj->left = arg0;
        cobj->top = arg1;
        cobj->width = arg2;
        cobj->height = arg3;
        cobj->minDepth = arg4;
        cobj->maxDepth = arg5;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        float arg4 = 0;
        ok &= seval_to_float(args[4], &arg4);
        float arg5 = 0;
        ok &= seval_to_float(args[5], &arg5);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXViewport* cobj = new (std::nothrow) cocos2d::GFXViewport();
        cobj->left = arg0;
        cobj->top = arg1;
        cobj->width = arg2;
        cobj->height = arg3;
        cobj->minDepth = arg4;
        cobj->maxDepth = arg5;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXViewport_constructor, __jsb_cocos2d_GFXViewport_class, js_cocos2d_GFXViewport_finalize)




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
        cocos2d::GFXColor* cobj = new (std::nothrow) cocos2d::GFXColor();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        float arg0 = 0;
        json->getProperty("r", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".r\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg0);
        float arg1 = 0;
        json->getProperty("g", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".g\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg1);
        float arg2 = 0;
        json->getProperty("b", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".b\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg2);
        float arg3 = 0;
        json->getProperty("a", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".a\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg3);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXColor* cobj = new (std::nothrow) cocos2d::GFXColor();
        cobj->r = arg0;
        cobj->g = arg1;
        cobj->b = arg2;
        cobj->a = arg3;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        float arg1 = 0;
        ok &= seval_to_float(args[1], &arg1);
        float arg2 = 0;
        ok &= seval_to_float(args[2], &arg2);
        float arg3 = 0;
        ok &= seval_to_float(args[3], &arg3);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXColor* cobj = new (std::nothrow) cocos2d::GFXColor();
        cobj->r = arg0;
        cobj->g = arg1;
        cobj->b = arg2;
        cobj->a = arg3;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXColor_constructor, __jsb_cocos2d_GFXColor_class, js_cocos2d_GFXColor_finalize)




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

static bool js_gfx_GFXDeviceInfo_get_window_handle(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_window_handle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->window_handle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_window_handle)

static bool js_gfx_GFXDeviceInfo_set_window_handle(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_window_handle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_window_handle : Error processing new value");
    cobj->window_handle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_window_handle)

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

static bool js_gfx_GFXDeviceInfo_get_native_width(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_native_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->native_width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_native_width)

static bool js_gfx_GFXDeviceInfo_set_native_width(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_native_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_native_width : Error processing new value");
    cobj->native_width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_native_width)

static bool js_gfx_GFXDeviceInfo_get_native_height(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_native_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->native_height, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_native_height)

static bool js_gfx_GFXDeviceInfo_set_native_height(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_native_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_native_height : Error processing new value");
    cobj->native_height = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_native_height)

static bool js_gfx_GFXDeviceInfo_get_shared_ctx(se::State& s)
{
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_get_shared_ctx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->shared_ctx, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDeviceInfo_get_shared_ctx)

static bool js_gfx_GFXDeviceInfo_set_shared_ctx(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDeviceInfo* cobj = (cocos2d::GFXDeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDeviceInfo_set_shared_ctx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXContext* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDeviceInfo_set_shared_ctx : Error processing new value");
    cobj->shared_ctx = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDeviceInfo_set_shared_ctx)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXDeviceInfo_finalize)

static bool js_gfx_GFXDeviceInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXDeviceInfo* cobj = new (std::nothrow) cocos2d::GFXDeviceInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        int arg0 = 0;
        json->getProperty("window_handle", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".window_handle\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (int)tmp; } while(false);
        unsigned int arg1 = 0;
        json->getProperty("width", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".width\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        json->getProperty("height", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".height\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        json->getProperty("native_width", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".native_width\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        json->getProperty("native_height", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".native_height\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg4);
        cocos2d::GFXContext* arg5 = nullptr;
        json->getProperty("shared_ctx", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".shared_ctx\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg5);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXDeviceInfo* cobj = new (std::nothrow) cocos2d::GFXDeviceInfo();
        cobj->window_handle = arg0;
        cobj->width = arg1;
        cobj->height = arg2;
        cobj->native_width = arg3;
        cobj->native_height = arg4;
        cobj->shared_ctx = arg5;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (intptr_t)tmp; } while(false);
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
        cocos2d::GFXContext* arg5 = nullptr;
        ok &= seval_to_native_ptr(args[5], &arg5);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXDeviceInfo* cobj = new (std::nothrow) cocos2d::GFXDeviceInfo();
        cobj->window_handle = arg0;
        cobj->width = arg1;
        cobj->height = arg2;
        cobj->native_width = arg3;
        cobj->native_height = arg4;
        cobj->shared_ctx = arg5;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXDeviceInfo_constructor, __jsb_cocos2d_GFXDeviceInfo_class, js_cocos2d_GFXDeviceInfo_finalize)




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

    cls->defineProperty("window_handle", _SE(js_gfx_GFXDeviceInfo_get_window_handle), _SE(js_gfx_GFXDeviceInfo_set_window_handle));
    cls->defineProperty("width", _SE(js_gfx_GFXDeviceInfo_get_width), _SE(js_gfx_GFXDeviceInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_GFXDeviceInfo_get_height), _SE(js_gfx_GFXDeviceInfo_set_height));
    cls->defineProperty("native_width", _SE(js_gfx_GFXDeviceInfo_get_native_width), _SE(js_gfx_GFXDeviceInfo_set_native_width));
    cls->defineProperty("native_height", _SE(js_gfx_GFXDeviceInfo_get_native_height), _SE(js_gfx_GFXDeviceInfo_set_native_height));
    cls->defineProperty("shared_ctx", _SE(js_gfx_GFXDeviceInfo_get_shared_ctx), _SE(js_gfx_GFXDeviceInfo_set_shared_ctx));
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
    jsret.setString(cobj->title.buffer());
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

static bool js_gfx_GFXWindowInfo_get_color_fmt(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_color_fmt : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->color_fmt, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_color_fmt)

static bool js_gfx_GFXWindowInfo_set_color_fmt(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_color_fmt : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_color_fmt : Error processing new value");
    cobj->color_fmt = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_color_fmt)

static bool js_gfx_GFXWindowInfo_get_depth_stencil_fmt(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_depth_stencil_fmt : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depth_stencil_fmt, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_depth_stencil_fmt)

static bool js_gfx_GFXWindowInfo_set_depth_stencil_fmt(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_depth_stencil_fmt : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFormat arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_depth_stencil_fmt : Error processing new value");
    cobj->depth_stencil_fmt = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_depth_stencil_fmt)

static bool js_gfx_GFXWindowInfo_get_is_offscreen(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_is_offscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_offscreen, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_is_offscreen)

static bool js_gfx_GFXWindowInfo_set_is_offscreen(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_is_offscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_is_offscreen : Error processing new value");
    cobj->is_offscreen = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_is_offscreen)

static bool js_gfx_GFXWindowInfo_get_is_fullscreen(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_is_fullscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_fullscreen, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_is_fullscreen)

static bool js_gfx_GFXWindowInfo_set_is_fullscreen(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_is_fullscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_is_fullscreen : Error processing new value");
    cobj->is_fullscreen = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_is_fullscreen)

static bool js_gfx_GFXWindowInfo_get_vsync_mode(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_vsync_mode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->vsync_mode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_vsync_mode)

static bool js_gfx_GFXWindowInfo_set_vsync_mode(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_vsync_mode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXVsyncMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXVsyncMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_vsync_mode : Error processing new value");
    cobj->vsync_mode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_vsync_mode)

static bool js_gfx_GFXWindowInfo_get_window_handle(se::State& s)
{
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_get_window_handle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->window_handle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXWindowInfo_get_window_handle)

static bool js_gfx_GFXWindowInfo_set_window_handle(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXWindowInfo* cobj = (cocos2d::GFXWindowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindowInfo_set_window_handle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindowInfo_set_window_handle : Error processing new value");
    cobj->window_handle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXWindowInfo_set_window_handle)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXWindowInfo_finalize)

static bool js_gfx_GFXWindowInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXWindowInfo* cobj = new (std::nothrow) cocos2d::GFXWindowInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::String arg0;
        json->getProperty("title", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".title\" is undefined!");
            return false;
        }
        arg0 = field.toStringForce().c_str();
        int arg1 = 0;
        json->getProperty("left", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".left\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (int)tmp; } while(false);
        int arg2 = 0;
        json->getProperty("top", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".top\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (int)tmp; } while(false);
        unsigned int arg3 = 0;
        json->getProperty("width", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".width\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        json->getProperty("height", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".height\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg4);
        cocos2d::GFXFormat arg5;
        json->getProperty("color_fmt", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".color_fmt\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cocos2d::GFXFormat)tmp; } while(false);
        cocos2d::GFXFormat arg6;
        json->getProperty("depth_stencil_fmt", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_stencil_fmt\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cocos2d::GFXFormat)tmp; } while(false);
        bool arg7;
        json->getProperty("is_offscreen", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_offscreen\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg7);
        bool arg8;
        json->getProperty("is_fullscreen", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_fullscreen\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg8);
        cocos2d::GFXVsyncMode arg9;
        json->getProperty("vsync_mode", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".vsync_mode\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cocos2d::GFXVsyncMode)tmp; } while(false);
        int arg10 = 0;
        json->getProperty("window_handle", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".window_handle\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg10 = (int)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXWindowInfo* cobj = new (std::nothrow) cocos2d::GFXWindowInfo();
        cobj->title = arg0;
        cobj->left = arg1;
        cobj->top = arg2;
        cobj->width = arg3;
        cobj->height = arg4;
        cobj->color_fmt = arg5;
        cobj->depth_stencil_fmt = arg6;
        cobj->is_offscreen = arg7;
        cobj->is_fullscreen = arg8;
        cobj->vsync_mode = arg9;
        cobj->window_handle = arg10;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 11)
    {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        int arg2 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
        cocos2d::GFXFormat arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::GFXFormat)tmp; } while(false);
        cocos2d::GFXFormat arg6;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cocos2d::GFXFormat)tmp; } while(false);
        bool arg7;
        ok &= seval_to_boolean(args[7], &arg7);
        bool arg8;
        ok &= seval_to_boolean(args[8], &arg8);
        cocos2d::GFXVsyncMode arg9;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cocos2d::GFXVsyncMode)tmp; } while(false);
        int arg10 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[10], &tmp); arg10 = (intptr_t)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXWindowInfo* cobj = new (std::nothrow) cocos2d::GFXWindowInfo();
        cobj->title = arg0;
        cobj->left = arg1;
        cobj->top = arg2;
        cobj->width = arg3;
        cobj->height = arg4;
        cobj->color_fmt = arg5;
        cobj->depth_stencil_fmt = arg6;
        cobj->is_offscreen = arg7;
        cobj->is_fullscreen = arg8;
        cobj->vsync_mode = arg9;
        cobj->window_handle = arg10;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXWindowInfo_constructor, __jsb_cocos2d_GFXWindowInfo_class, js_cocos2d_GFXWindowInfo_finalize)




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
    cls->defineProperty("color_fmt", _SE(js_gfx_GFXWindowInfo_get_color_fmt), _SE(js_gfx_GFXWindowInfo_set_color_fmt));
    cls->defineProperty("depth_stencil_fmt", _SE(js_gfx_GFXWindowInfo_get_depth_stencil_fmt), _SE(js_gfx_GFXWindowInfo_set_depth_stencil_fmt));
    cls->defineProperty("is_offscreen", _SE(js_gfx_GFXWindowInfo_get_is_offscreen), _SE(js_gfx_GFXWindowInfo_set_is_offscreen));
    cls->defineProperty("is_fullscreen", _SE(js_gfx_GFXWindowInfo_get_is_fullscreen), _SE(js_gfx_GFXWindowInfo_set_is_fullscreen));
    cls->defineProperty("vsync_mode", _SE(js_gfx_GFXWindowInfo_get_vsync_mode), _SE(js_gfx_GFXWindowInfo_set_vsync_mode));
    cls->defineProperty("window_handle", _SE(js_gfx_GFXWindowInfo_get_window_handle), _SE(js_gfx_GFXWindowInfo_set_window_handle));
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

static bool js_gfx_GFXContextInfo_get_window_handle(se::State& s)
{
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_get_window_handle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->window_handle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXContextInfo_get_window_handle)

static bool js_gfx_GFXContextInfo_set_window_handle(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_set_window_handle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContextInfo_set_window_handle : Error processing new value");
    cobj->window_handle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXContextInfo_set_window_handle)

static bool js_gfx_GFXContextInfo_get_shared_ctx(se::State& s)
{
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_get_shared_ctx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->shared_ctx, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXContextInfo_get_shared_ctx)

static bool js_gfx_GFXContextInfo_set_shared_ctx(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_set_shared_ctx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXContext* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContextInfo_set_shared_ctx : Error processing new value");
    cobj->shared_ctx = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXContextInfo_set_shared_ctx)

static bool js_gfx_GFXContextInfo_get_vsync_mode(se::State& s)
{
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_get_vsync_mode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->vsync_mode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXContextInfo_get_vsync_mode)

static bool js_gfx_GFXContextInfo_set_vsync_mode(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXContextInfo* cobj = (cocos2d::GFXContextInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContextInfo_set_vsync_mode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXVsyncMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXVsyncMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContextInfo_set_vsync_mode : Error processing new value");
    cobj->vsync_mode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXContextInfo_set_vsync_mode)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXContextInfo_finalize)

static bool js_gfx_GFXContextInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXContextInfo* cobj = new (std::nothrow) cocos2d::GFXContextInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        int arg0 = 0;
        json->getProperty("window_handle", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".window_handle\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (int)tmp; } while(false);
        cocos2d::GFXContext* arg1 = nullptr;
        json->getProperty("shared_ctx", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".shared_ctx\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg1);
        cocos2d::GFXVsyncMode arg2;
        json->getProperty("vsync_mode", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".vsync_mode\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXVsyncMode)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXContextInfo* cobj = new (std::nothrow) cocos2d::GFXContextInfo();
        cobj->window_handle = arg0;
        cobj->shared_ctx = arg1;
        cobj->vsync_mode = arg2;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (intptr_t)tmp; } while(false);
        cocos2d::GFXContext* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[1], &arg1);
        cocos2d::GFXVsyncMode arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXVsyncMode)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXContextInfo* cobj = new (std::nothrow) cocos2d::GFXContextInfo();
        cobj->window_handle = arg0;
        cobj->shared_ctx = arg1;
        cobj->vsync_mode = arg2;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXContextInfo_constructor, __jsb_cocos2d_GFXContextInfo_class, js_cocos2d_GFXContextInfo_finalize)




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

    cls->defineProperty("window_handle", _SE(js_gfx_GFXContextInfo_get_window_handle), _SE(js_gfx_GFXContextInfo_set_window_handle));
    cls->defineProperty("shared_ctx", _SE(js_gfx_GFXContextInfo_get_shared_ctx), _SE(js_gfx_GFXContextInfo_set_shared_ctx));
    cls->defineProperty("vsync_mode", _SE(js_gfx_GFXContextInfo_get_vsync_mode), _SE(js_gfx_GFXContextInfo_set_vsync_mode));
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

static bool js_gfx_GFXBufferInfo_get_mem_usage(se::State& s)
{
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_get_mem_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->mem_usage, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBufferInfo_get_mem_usage)

static bool js_gfx_GFXBufferInfo_set_mem_usage(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBufferInfo* cobj = (cocos2d::GFXBufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBufferInfo_set_mem_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXMemoryUsageBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXMemoryUsageBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBufferInfo_set_mem_usage : Error processing new value");
    cobj->mem_usage = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBufferInfo_set_mem_usage)

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
        cocos2d::GFXBufferInfo* cobj = new (std::nothrow) cocos2d::GFXBufferInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXBufferUsageBit arg0;
        json->getProperty("usage", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".usage\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXBufferUsageBit)tmp; } while(false);
        cocos2d::GFXMemoryUsageBit arg1;
        json->getProperty("mem_usage", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".mem_usage\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXMemoryUsageBit)tmp; } while(false);
        unsigned int arg2 = 0;
        json->getProperty("stride", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stride\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        json->getProperty("size", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".size\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);
        cocos2d::GFXBufferFlagBit arg4;
        json->getProperty("flags", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".flags\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXBufferFlagBit)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXBufferInfo* cobj = new (std::nothrow) cocos2d::GFXBufferInfo();
        cobj->usage = arg0;
        cobj->mem_usage = arg1;
        cobj->stride = arg2;
        cobj->size = arg3;
        cobj->flags = arg4;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 5)
    {
        cocos2d::GFXBufferUsageBit arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBufferUsage)tmp; } while(false);
        cocos2d::GFXMemoryUsageBit arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXMemoryUsage)tmp; } while(false);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        cocos2d::GFXBufferFlagBit arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXBufferFlags)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXBufferInfo* cobj = new (std::nothrow) cocos2d::GFXBufferInfo();
        cobj->usage = arg0;
        cobj->mem_usage = arg1;
        cobj->stride = arg2;
        cobj->size = arg3;
        cobj->flags = arg4;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXBufferInfo_constructor, __jsb_cocos2d_GFXBufferInfo_class, js_cocos2d_GFXBufferInfo_finalize)




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
    cls->defineProperty("mem_usage", _SE(js_gfx_GFXBufferInfo_get_mem_usage), _SE(js_gfx_GFXBufferInfo_set_mem_usage));
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

static bool js_gfx_GFXDrawInfo_get_vertex_count(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_vertex_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->vertex_count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_vertex_count)

static bool js_gfx_GFXDrawInfo_set_vertex_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_vertex_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_vertex_count : Error processing new value");
    cobj->vertex_count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_vertex_count)

static bool js_gfx_GFXDrawInfo_get_first_vertex(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_first_vertex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->first_vertex, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_first_vertex)

static bool js_gfx_GFXDrawInfo_set_first_vertex(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_first_vertex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_first_vertex : Error processing new value");
    cobj->first_vertex = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_first_vertex)

static bool js_gfx_GFXDrawInfo_get_index_count(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_index_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->index_count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_index_count)

static bool js_gfx_GFXDrawInfo_set_index_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_index_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_index_count : Error processing new value");
    cobj->index_count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_index_count)

static bool js_gfx_GFXDrawInfo_get_first_index(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_first_index : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->first_index, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_first_index)

static bool js_gfx_GFXDrawInfo_set_first_index(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_first_index : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_first_index : Error processing new value");
    cobj->first_index = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_first_index)

static bool js_gfx_GFXDrawInfo_get_vertex_offset(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_vertex_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->vertex_offset, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_vertex_offset)

static bool js_gfx_GFXDrawInfo_set_vertex_offset(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_vertex_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_vertex_offset : Error processing new value");
    cobj->vertex_offset = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_vertex_offset)

static bool js_gfx_GFXDrawInfo_get_instance_count(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_instance_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->instance_count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_instance_count)

static bool js_gfx_GFXDrawInfo_set_instance_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_instance_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_instance_count : Error processing new value");
    cobj->instance_count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_instance_count)

static bool js_gfx_GFXDrawInfo_get_first_instance(se::State& s)
{
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_get_first_instance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->first_instance, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDrawInfo_get_first_instance)

static bool js_gfx_GFXDrawInfo_set_first_instance(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDrawInfo* cobj = (cocos2d::GFXDrawInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDrawInfo_set_first_instance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDrawInfo_set_first_instance : Error processing new value");
    cobj->first_instance = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDrawInfo_set_first_instance)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXDrawInfo_finalize)

static bool js_gfx_GFXDrawInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXDrawInfo* cobj = new (std::nothrow) cocos2d::GFXDrawInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        unsigned int arg0 = 0;
        json->getProperty("vertex_count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".vertex_count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        json->getProperty("first_vertex", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".first_vertex\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        json->getProperty("index_count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".index_count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        json->getProperty("first_index", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".first_index\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        json->getProperty("vertex_offset", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".vertex_offset\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg4);
        unsigned int arg5 = 0;
        json->getProperty("instance_count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".instance_count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg5);
        unsigned int arg6 = 0;
        json->getProperty("first_instance", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".first_instance\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg6);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXDrawInfo* cobj = new (std::nothrow) cocos2d::GFXDrawInfo();
        cobj->vertex_count = arg0;
        cobj->first_vertex = arg1;
        cobj->index_count = arg2;
        cobj->first_index = arg3;
        cobj->vertex_offset = arg4;
        cobj->instance_count = arg5;
        cobj->first_instance = arg6;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 7)
    {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
        unsigned int arg5 = 0;
        ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
        unsigned int arg6 = 0;
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXDrawInfo* cobj = new (std::nothrow) cocos2d::GFXDrawInfo();
        cobj->vertex_count = arg0;
        cobj->first_vertex = arg1;
        cobj->index_count = arg2;
        cobj->first_index = arg3;
        cobj->vertex_offset = arg4;
        cobj->instance_count = arg5;
        cobj->first_instance = arg6;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXDrawInfo_constructor, __jsb_cocos2d_GFXDrawInfo_class, js_cocos2d_GFXDrawInfo_finalize)




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

    cls->defineProperty("vertex_count", _SE(js_gfx_GFXDrawInfo_get_vertex_count), _SE(js_gfx_GFXDrawInfo_set_vertex_count));
    cls->defineProperty("first_vertex", _SE(js_gfx_GFXDrawInfo_get_first_vertex), _SE(js_gfx_GFXDrawInfo_set_first_vertex));
    cls->defineProperty("index_count", _SE(js_gfx_GFXDrawInfo_get_index_count), _SE(js_gfx_GFXDrawInfo_set_index_count));
    cls->defineProperty("first_index", _SE(js_gfx_GFXDrawInfo_get_first_index), _SE(js_gfx_GFXDrawInfo_set_first_index));
    cls->defineProperty("vertex_offset", _SE(js_gfx_GFXDrawInfo_get_vertex_offset), _SE(js_gfx_GFXDrawInfo_set_vertex_offset));
    cls->defineProperty("instance_count", _SE(js_gfx_GFXDrawInfo_get_instance_count), _SE(js_gfx_GFXDrawInfo_set_instance_count));
    cls->defineProperty("first_instance", _SE(js_gfx_GFXDrawInfo_get_first_instance), _SE(js_gfx_GFXDrawInfo_set_first_instance));
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
        cocos2d::GFXIndirectBuffer* cobj = new (std::nothrow) cocos2d::GFXIndirectBuffer();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        std::vector<cocos2d::GFXDrawInfo> arg0;
        json->getProperty("draws", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".draws\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg0);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXIndirectBuffer* cobj = new (std::nothrow) cocos2d::GFXIndirectBuffer();
        cobj->draws = arg0;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        std::vector<cocos2d::GFXDrawInfo> arg0;
        ok &= seval_to_std_vector(args[0], &arg0);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXIndirectBuffer* cobj = new (std::nothrow) cocos2d::GFXIndirectBuffer();
        cobj->draws = arg0;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXIndirectBuffer_constructor, __jsb_cocos2d_GFXIndirectBuffer_class, js_cocos2d_GFXIndirectBuffer_finalize)




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

static bool js_gfx_GFXTextureInfo_get_array_layer(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_array_layer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->array_layer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_array_layer)

static bool js_gfx_GFXTextureInfo_set_array_layer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_array_layer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_array_layer : Error processing new value");
    cobj->array_layer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_array_layer)

static bool js_gfx_GFXTextureInfo_get_mip_level(se::State& s)
{
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_get_mip_level : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->mip_level, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureInfo_get_mip_level)

static bool js_gfx_GFXTextureInfo_set_mip_level(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureInfo* cobj = (cocos2d::GFXTextureInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureInfo_set_mip_level : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureInfo_set_mip_level : Error processing new value");
    cobj->mip_level = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureInfo_set_mip_level)

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
        cocos2d::GFXTextureInfo* cobj = new (std::nothrow) cocos2d::GFXTextureInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXTextureType arg0;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXTextureType)tmp; } while(false);
        cocos2d::GFXTextureUsageBit arg1;
        json->getProperty("usage", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".usage\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXTextureUsageBit)tmp; } while(false);
        cocos2d::GFXFormat arg2;
        json->getProperty("format", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".format\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXFormat)tmp; } while(false);
        unsigned int arg3 = 0;
        json->getProperty("width", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".width\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        json->getProperty("height", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".height\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg4);
        unsigned int arg5 = 0;
        json->getProperty("depth", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg5);
        unsigned int arg6 = 0;
        json->getProperty("array_layer", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".array_layer\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg6);
        unsigned int arg7 = 0;
        json->getProperty("mip_level", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".mip_level\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg7);
        cocos2d::GFXSampleCount arg8;
        json->getProperty("samples", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".samples\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cocos2d::GFXSampleCount)tmp; } while(false);
        cocos2d::GFXTextureFlagBit arg9;
        json->getProperty("flags", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".flags\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cocos2d::GFXTextureFlagBit)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXTextureInfo* cobj = new (std::nothrow) cocos2d::GFXTextureInfo();
        cobj->type = arg0;
        cobj->usage = arg1;
        cobj->format = arg2;
        cobj->width = arg3;
        cobj->height = arg4;
        cobj->depth = arg5;
        cobj->array_layer = arg6;
        cobj->mip_level = arg7;
        cobj->samples = arg8;
        cobj->flags = arg9;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 10)
    {
        cocos2d::GFXTextureType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureType)tmp; } while(false);
        cocos2d::GFXTextureUsageBit arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXTextureUsage)tmp; } while(false);
        cocos2d::GFXFormat arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXFormat)tmp; } while(false);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
        unsigned int arg5 = 0;
        ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
        unsigned int arg6 = 0;
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        unsigned int arg7 = 0;
        ok &= seval_to_uint32(args[7], (uint32_t*)&arg7);
        cocos2d::GFXSampleCount arg8;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cocos2d::GFXSampleCount)tmp; } while(false);
        cocos2d::GFXTextureFlagBit arg9;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cocos2d::GFXTextureFlags)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXTextureInfo* cobj = new (std::nothrow) cocos2d::GFXTextureInfo();
        cobj->type = arg0;
        cobj->usage = arg1;
        cobj->format = arg2;
        cobj->width = arg3;
        cobj->height = arg4;
        cobj->depth = arg5;
        cobj->array_layer = arg6;
        cobj->mip_level = arg7;
        cobj->samples = arg8;
        cobj->flags = arg9;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXTextureInfo_constructor, __jsb_cocos2d_GFXTextureInfo_class, js_cocos2d_GFXTextureInfo_finalize)




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
    cls->defineProperty("array_layer", _SE(js_gfx_GFXTextureInfo_get_array_layer), _SE(js_gfx_GFXTextureInfo_set_array_layer));
    cls->defineProperty("mip_level", _SE(js_gfx_GFXTextureInfo_get_mip_level), _SE(js_gfx_GFXTextureInfo_set_mip_level));
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

static bool js_gfx_GFXTextureViewInfo_get_base_level(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_base_level : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->base_level, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_base_level)

static bool js_gfx_GFXTextureViewInfo_set_base_level(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_base_level : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_base_level : Error processing new value");
    cobj->base_level = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_base_level)

static bool js_gfx_GFXTextureViewInfo_get_level_count(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_level_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->level_count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_level_count)

static bool js_gfx_GFXTextureViewInfo_set_level_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_level_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_level_count : Error processing new value");
    cobj->level_count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_level_count)

static bool js_gfx_GFXTextureViewInfo_get_base_layer(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_base_layer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->base_layer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_base_layer)

static bool js_gfx_GFXTextureViewInfo_set_base_layer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_base_layer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_base_layer : Error processing new value");
    cobj->base_layer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_base_layer)

static bool js_gfx_GFXTextureViewInfo_get_layer_count(se::State& s)
{
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_get_layer_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->layer_count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXTextureViewInfo_get_layer_count)

static bool js_gfx_GFXTextureViewInfo_set_layer_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXTextureViewInfo* cobj = (cocos2d::GFXTextureViewInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureViewInfo_set_layer_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureViewInfo_set_layer_count : Error processing new value");
    cobj->layer_count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXTextureViewInfo_set_layer_count)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTextureViewInfo_finalize)

static bool js_gfx_GFXTextureViewInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXTextureViewInfo* cobj = new (std::nothrow) cocos2d::GFXTextureViewInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXTexture* arg0 = nullptr;
        json->getProperty("texture", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".texture\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg0);
        cocos2d::GFXTextureViewType arg1;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXTextureViewType)tmp; } while(false);
        cocos2d::GFXFormat arg2;
        json->getProperty("format", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".format\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXFormat)tmp; } while(false);
        unsigned int arg3 = 0;
        json->getProperty("base_level", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".base_level\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        json->getProperty("level_count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".level_count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg4);
        unsigned int arg5 = 0;
        json->getProperty("base_layer", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".base_layer\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg5);
        unsigned int arg6 = 0;
        json->getProperty("layer_count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".layer_count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg6);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXTextureViewInfo* cobj = new (std::nothrow) cocos2d::GFXTextureViewInfo();
        cobj->texture = arg0;
        cobj->type = arg1;
        cobj->format = arg2;
        cobj->base_level = arg3;
        cobj->level_count = arg4;
        cobj->base_layer = arg5;
        cobj->layer_count = arg6;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 7)
    {
        cocos2d::GFXTexture* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        cocos2d::GFXTextureViewType arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXTextureViewType)tmp; } while(false);
        cocos2d::GFXFormat arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXFormat)tmp; } while(false);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        unsigned int arg4 = 0;
        ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
        unsigned int arg5 = 0;
        ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
        unsigned int arg6 = 0;
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXTextureViewInfo* cobj = new (std::nothrow) cocos2d::GFXTextureViewInfo();
        cobj->texture = arg0;
        cobj->type = arg1;
        cobj->format = arg2;
        cobj->base_level = arg3;
        cobj->level_count = arg4;
        cobj->base_layer = arg5;
        cobj->layer_count = arg6;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXTextureViewInfo_constructor, __jsb_cocos2d_GFXTextureViewInfo_class, js_cocos2d_GFXTextureViewInfo_finalize)




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
    cls->defineProperty("base_level", _SE(js_gfx_GFXTextureViewInfo_get_base_level), _SE(js_gfx_GFXTextureViewInfo_set_base_level));
    cls->defineProperty("level_count", _SE(js_gfx_GFXTextureViewInfo_get_level_count), _SE(js_gfx_GFXTextureViewInfo_set_level_count));
    cls->defineProperty("base_layer", _SE(js_gfx_GFXTextureViewInfo_get_base_layer), _SE(js_gfx_GFXTextureViewInfo_set_base_layer));
    cls->defineProperty("layer_count", _SE(js_gfx_GFXTextureViewInfo_get_layer_count), _SE(js_gfx_GFXTextureViewInfo_set_layer_count));
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
    jsret.setString(cobj->name.buffer());
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

static bool js_gfx_GFXSamplerInfo_get_min_filter(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_min_filter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->min_filter, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_min_filter)

static bool js_gfx_GFXSamplerInfo_set_min_filter(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_min_filter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFilter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFilter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_min_filter : Error processing new value");
    cobj->min_filter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_min_filter)

static bool js_gfx_GFXSamplerInfo_get_mag_filter(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_mag_filter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->mag_filter, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_mag_filter)

static bool js_gfx_GFXSamplerInfo_set_mag_filter(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_mag_filter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFilter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFilter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_mag_filter : Error processing new value");
    cobj->mag_filter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_mag_filter)

static bool js_gfx_GFXSamplerInfo_get_mip_filter(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_mip_filter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->mip_filter, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_mip_filter)

static bool js_gfx_GFXSamplerInfo_set_mip_filter(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_mip_filter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXFilter arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFilter)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_mip_filter : Error processing new value");
    cobj->mip_filter = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_mip_filter)

static bool js_gfx_GFXSamplerInfo_get_address_u(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_address_u : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->address_u, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_address_u)

static bool js_gfx_GFXSamplerInfo_set_address_u(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_address_u : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXAddress arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXAddress)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_address_u : Error processing new value");
    cobj->address_u = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_address_u)

static bool js_gfx_GFXSamplerInfo_get_address_v(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_address_v : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->address_v, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_address_v)

static bool js_gfx_GFXSamplerInfo_set_address_v(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_address_v : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXAddress arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXAddress)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_address_v : Error processing new value");
    cobj->address_v = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_address_v)

static bool js_gfx_GFXSamplerInfo_get_address_w(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_address_w : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->address_w, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_address_w)

static bool js_gfx_GFXSamplerInfo_set_address_w(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_address_w : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXAddress arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXAddress)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_address_w : Error processing new value");
    cobj->address_w = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_address_w)

static bool js_gfx_GFXSamplerInfo_get_max_anisotropy(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_max_anisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->max_anisotropy, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_max_anisotropy)

static bool js_gfx_GFXSamplerInfo_set_max_anisotropy(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_max_anisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_max_anisotropy : Error processing new value");
    cobj->max_anisotropy = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_max_anisotropy)

static bool js_gfx_GFXSamplerInfo_get_cmp_func(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_cmp_func : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->cmp_func, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_cmp_func)

static bool js_gfx_GFXSamplerInfo_set_cmp_func(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_cmp_func : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_cmp_func : Error processing new value");
    cobj->cmp_func = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_cmp_func)

static bool js_gfx_GFXSamplerInfo_get_border_color(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_border_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->border_color, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_border_color)

static bool js_gfx_GFXSamplerInfo_set_border_color(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_border_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXColor* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_border_color : Error processing new value");
    cobj->border_color = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_border_color)

static bool js_gfx_GFXSamplerInfo_get_min_lod(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_min_lod : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->min_lod, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_min_lod)

static bool js_gfx_GFXSamplerInfo_set_min_lod(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_min_lod : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_min_lod : Error processing new value");
    cobj->min_lod = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_min_lod)

static bool js_gfx_GFXSamplerInfo_get_max_lod(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_max_lod : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->max_lod, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_max_lod)

static bool js_gfx_GFXSamplerInfo_set_max_lod(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_max_lod : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_max_lod : Error processing new value");
    cobj->max_lod = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_max_lod)

static bool js_gfx_GFXSamplerInfo_get_mip_lod_bias(se::State& s)
{
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_get_mip_lod_bias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->mip_lod_bias, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSamplerInfo_get_mip_lod_bias)

static bool js_gfx_GFXSamplerInfo_set_mip_lod_bias(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSamplerInfo* cobj = (cocos2d::GFXSamplerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSamplerInfo_set_mip_lod_bias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSamplerInfo_set_mip_lod_bias : Error processing new value");
    cobj->mip_lod_bias = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSamplerInfo_set_mip_lod_bias)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXSamplerInfo_finalize)

static bool js_gfx_GFXSamplerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXSamplerInfo* cobj = new (std::nothrow) cocos2d::GFXSamplerInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::String arg0;
        json->getProperty("name", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".name\" is undefined!");
            return false;
        }
        arg0 = field.toStringForce().c_str();
        cocos2d::GFXFilter arg1;
        json->getProperty("min_filter", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".min_filter\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXFilter)tmp; } while(false);
        cocos2d::GFXFilter arg2;
        json->getProperty("mag_filter", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".mag_filter\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXFilter)tmp; } while(false);
        cocos2d::GFXFilter arg3;
        json->getProperty("mip_filter", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".mip_filter\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXFilter)tmp; } while(false);
        cocos2d::GFXAddress arg4;
        json->getProperty("address_u", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".address_u\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXAddress)tmp; } while(false);
        cocos2d::GFXAddress arg5;
        json->getProperty("address_v", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".address_v\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cocos2d::GFXAddress)tmp; } while(false);
        cocos2d::GFXAddress arg6;
        json->getProperty("address_w", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".address_w\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cocos2d::GFXAddress)tmp; } while(false);
        unsigned int arg7 = 0;
        json->getProperty("max_anisotropy", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".max_anisotropy\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg7);
        cocos2d::GFXComparisonFunc arg8;
        json->getProperty("cmp_func", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".cmp_func\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
        cocos2d::GFXColor* arg9 = 0;
        json->getProperty("border_color", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".border_color\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg9);
        unsigned int arg10 = 0;
        json->getProperty("min_lod", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".min_lod\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg10);
        unsigned int arg11 = 0;
        json->getProperty("max_lod", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".max_lod\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg11);
        float arg12 = 0;
        json->getProperty("mip_lod_bias", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".mip_lod_bias\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg12);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXSamplerInfo* cobj = new (std::nothrow) cocos2d::GFXSamplerInfo();
        cobj->name = arg0;
        cobj->min_filter = arg1;
        cobj->mag_filter = arg2;
        cobj->mip_filter = arg3;
        cobj->address_u = arg4;
        cobj->address_v = arg5;
        cobj->address_w = arg6;
        cobj->max_anisotropy = arg7;
        cobj->cmp_func = arg8;
        cobj->border_color = *arg9;
        cobj->min_lod = arg10;
        cobj->max_lod = arg11;
        cobj->mip_lod_bias = arg12;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 13)
    {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        cocos2d::GFXFilter arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXFilter)tmp; } while(false);
        cocos2d::GFXFilter arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXFilter)tmp; } while(false);
        cocos2d::GFXFilter arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXFilter)tmp; } while(false);
        cocos2d::GFXAddress arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXAddress)tmp; } while(false);
        cocos2d::GFXAddress arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::GFXAddress)tmp; } while(false);
        cocos2d::GFXAddress arg6;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cocos2d::GFXAddress)tmp; } while(false);
        unsigned int arg7 = 0;
        ok &= seval_to_uint32(args[7], (uint32_t*)&arg7);
        cocos2d::GFXComparisonFunc arg8;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
        cocos2d::GFXColor arg9;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXColor
            ok = false;
        unsigned int arg10 = 0;
        ok &= seval_to_uint32(args[10], (uint32_t*)&arg10);
        unsigned int arg11 = 0;
        ok &= seval_to_uint32(args[11], (uint32_t*)&arg11);
        float arg12 = 0;
        ok &= seval_to_float(args[12], &arg12);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXSamplerInfo* cobj = new (std::nothrow) cocos2d::GFXSamplerInfo();
        cobj->name = arg0;
        cobj->min_filter = arg1;
        cobj->mag_filter = arg2;
        cobj->mip_filter = arg3;
        cobj->address_u = arg4;
        cobj->address_v = arg5;
        cobj->address_w = arg6;
        cobj->max_anisotropy = arg7;
        cobj->cmp_func = arg8;
        cobj->border_color = arg9;
        cobj->min_lod = arg10;
        cobj->max_lod = arg11;
        cobj->mip_lod_bias = arg12;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXSamplerInfo_constructor, __jsb_cocos2d_GFXSamplerInfo_class, js_cocos2d_GFXSamplerInfo_finalize)




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
    cls->defineProperty("min_filter", _SE(js_gfx_GFXSamplerInfo_get_min_filter), _SE(js_gfx_GFXSamplerInfo_set_min_filter));
    cls->defineProperty("mag_filter", _SE(js_gfx_GFXSamplerInfo_get_mag_filter), _SE(js_gfx_GFXSamplerInfo_set_mag_filter));
    cls->defineProperty("mip_filter", _SE(js_gfx_GFXSamplerInfo_get_mip_filter), _SE(js_gfx_GFXSamplerInfo_set_mip_filter));
    cls->defineProperty("address_u", _SE(js_gfx_GFXSamplerInfo_get_address_u), _SE(js_gfx_GFXSamplerInfo_set_address_u));
    cls->defineProperty("address_v", _SE(js_gfx_GFXSamplerInfo_get_address_v), _SE(js_gfx_GFXSamplerInfo_set_address_v));
    cls->defineProperty("address_w", _SE(js_gfx_GFXSamplerInfo_get_address_w), _SE(js_gfx_GFXSamplerInfo_set_address_w));
    cls->defineProperty("max_anisotropy", _SE(js_gfx_GFXSamplerInfo_get_max_anisotropy), _SE(js_gfx_GFXSamplerInfo_set_max_anisotropy));
    cls->defineProperty("cmp_func", _SE(js_gfx_GFXSamplerInfo_get_cmp_func), _SE(js_gfx_GFXSamplerInfo_set_cmp_func));
    cls->defineProperty("border_color", _SE(js_gfx_GFXSamplerInfo_get_border_color), _SE(js_gfx_GFXSamplerInfo_set_border_color));
    cls->defineProperty("min_lod", _SE(js_gfx_GFXSamplerInfo_get_min_lod), _SE(js_gfx_GFXSamplerInfo_set_min_lod));
    cls->defineProperty("max_lod", _SE(js_gfx_GFXSamplerInfo_get_max_lod), _SE(js_gfx_GFXSamplerInfo_set_max_lod));
    cls->defineProperty("mip_lod_bias", _SE(js_gfx_GFXSamplerInfo_get_mip_lod_bias), _SE(js_gfx_GFXSamplerInfo_set_mip_lod_bias));
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
    jsret.setString(cobj->macro.buffer());
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
    jsret.setString(cobj->value.buffer());
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
        cocos2d::GFXShaderMacro* cobj = new (std::nothrow) cocos2d::GFXShaderMacro();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::String arg0;
        json->getProperty("macro", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".macro\" is undefined!");
            return false;
        }
        arg0 = field.toStringForce().c_str();
        cocos2d::String arg1;
        json->getProperty("value", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".value\" is undefined!");
            return false;
        }
        arg1 = field.toStringForce().c_str();

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXShaderMacro* cobj = new (std::nothrow) cocos2d::GFXShaderMacro();
        cobj->macro = arg0;
        cobj->value = arg1;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 2)
    {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        cocos2d::String arg1;
        arg1 = args[1].toStringForce().c_str();

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXShaderMacro* cobj = new (std::nothrow) cocos2d::GFXShaderMacro();
        cobj->macro = arg0;
        cobj->value = arg1;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXShaderMacro_constructor, __jsb_cocos2d_GFXShaderMacro_class, js_cocos2d_GFXShaderMacro_finalize)




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
    jsret.setString(cobj->name.buffer());
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
        cocos2d::GFXUniform* cobj = new (std::nothrow) cocos2d::GFXUniform();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::String arg0;
        json->getProperty("name", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".name\" is undefined!");
            return false;
        }
        arg0 = field.toStringForce().c_str();
        cocos2d::GFXType arg1;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXType)tmp; } while(false);
        unsigned int arg2 = 0;
        json->getProperty("count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXUniform* cobj = new (std::nothrow) cocos2d::GFXUniform();
        cobj->name = arg0;
        cobj->type = arg1;
        cobj->count = arg2;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        cocos2d::GFXType arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXType)tmp; } while(false);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXUniform* cobj = new (std::nothrow) cocos2d::GFXUniform();
        cobj->name = arg0;
        cobj->type = arg1;
        cobj->count = arg2;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXUniform_constructor, __jsb_cocos2d_GFXUniform_class, js_cocos2d_GFXUniform_finalize)




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
    jsret.setString(cobj->name.buffer());
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
        cocos2d::GFXUniformBlock* cobj = new (std::nothrow) cocos2d::GFXUniformBlock();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        unsigned int arg0 = 0;
        json->getProperty("binding", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".binding\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg0);
        cocos2d::String arg1;
        json->getProperty("name", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".name\" is undefined!");
            return false;
        }
        arg1 = field.toStringForce().c_str();
        std::vector<cocos2d::GFXUniform> arg2;
        json->getProperty("uniforms", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".uniforms\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg2);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXUniformBlock* cobj = new (std::nothrow) cocos2d::GFXUniformBlock();
        cobj->binding = arg0;
        cobj->name = arg1;
        cobj->uniforms = arg2;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        cocos2d::String arg1;
        arg1 = args[1].toStringForce().c_str();
        std::vector<cocos2d::GFXUniform> arg2;
        ok &= seval_to_std_vector(args[2], &arg2);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXUniformBlock* cobj = new (std::nothrow) cocos2d::GFXUniformBlock();
        cobj->binding = arg0;
        cobj->name = arg1;
        cobj->uniforms = arg2;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXUniformBlock_constructor, __jsb_cocos2d_GFXUniformBlock_class, js_cocos2d_GFXUniformBlock_finalize)




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
    jsret.setString(cobj->name.buffer());
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
        cocos2d::GFXUniformSampler* cobj = new (std::nothrow) cocos2d::GFXUniformSampler();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        unsigned int arg0 = 0;
        json->getProperty("binding", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".binding\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg0);
        cocos2d::String arg1;
        json->getProperty("name", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".name\" is undefined!");
            return false;
        }
        arg1 = field.toStringForce().c_str();
        cocos2d::GFXType arg2;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXType)tmp; } while(false);
        unsigned int arg3 = 0;
        json->getProperty("count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXUniformSampler* cobj = new (std::nothrow) cocos2d::GFXUniformSampler();
        cobj->binding = arg0;
        cobj->name = arg1;
        cobj->type = arg2;
        cobj->count = arg3;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        cocos2d::String arg1;
        arg1 = args[1].toStringForce().c_str();
        cocos2d::GFXType arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXType)tmp; } while(false);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXUniformSampler* cobj = new (std::nothrow) cocos2d::GFXUniformSampler();
        cobj->binding = arg0;
        cobj->name = arg1;
        cobj->type = arg2;
        cobj->count = arg3;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXUniformSampler_constructor, __jsb_cocos2d_GFXUniformSampler_class, js_cocos2d_GFXUniformSampler_finalize)




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
    jsret.setString(cobj->source.buffer());
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
        cocos2d::GFXShaderStage* cobj = new (std::nothrow) cocos2d::GFXShaderStage();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXShaderType arg0;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
        cocos2d::String arg1;
        json->getProperty("source", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".source\" is undefined!");
            return false;
        }
        arg1 = field.toStringForce().c_str();
        std::vector<cocos2d::GFXShaderMacro> arg2;
        json->getProperty("macros", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".macros\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg2);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXShaderStage* cobj = new (std::nothrow) cocos2d::GFXShaderStage();
        cobj->type = arg0;
        cobj->source = arg1;
        cobj->macros = arg2;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXShaderType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
        cocos2d::String arg1;
        arg1 = args[1].toStringForce().c_str();
        std::vector<cocos2d::GFXShaderMacro> arg2;
        ok &= seval_to_std_vector(args[2], &arg2);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXShaderStage* cobj = new (std::nothrow) cocos2d::GFXShaderStage();
        cobj->type = arg0;
        cobj->source = arg1;
        cobj->macros = arg2;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXShaderStage_constructor, __jsb_cocos2d_GFXShaderStage_class, js_cocos2d_GFXShaderStage_finalize)




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
    jsret.setString(cobj->name.buffer());
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
        cocos2d::GFXShaderInfo* cobj = new (std::nothrow) cocos2d::GFXShaderInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::String arg0;
        json->getProperty("name", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".name\" is undefined!");
            return false;
        }
        arg0 = field.toStringForce().c_str();
        std::vector<cocos2d::GFXShaderStage> arg1;
        json->getProperty("stages", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stages\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg1);
        std::vector<cocos2d::GFXUniformBlock> arg2;
        json->getProperty("blocks", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".blocks\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg2);
        std::vector<cocos2d::GFXUniformSampler> arg3;
        json->getProperty("samplers", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".samplers\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg3);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXShaderInfo* cobj = new (std::nothrow) cocos2d::GFXShaderInfo();
        cobj->name = arg0;
        cobj->stages = arg1;
        cobj->blocks = arg2;
        cobj->samplers = arg3;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        std::vector<cocos2d::GFXShaderStage> arg1;
        ok &= seval_to_std_vector(args[1], &arg1);
        std::vector<cocos2d::GFXUniformBlock> arg2;
        ok &= seval_to_std_vector(args[2], &arg2);
        std::vector<cocos2d::GFXUniformSampler> arg3;
        ok &= seval_to_std_vector(args[3], &arg3);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXShaderInfo* cobj = new (std::nothrow) cocos2d::GFXShaderInfo();
        cobj->name = arg0;
        cobj->stages = arg1;
        cobj->blocks = arg2;
        cobj->samplers = arg3;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXShaderInfo_constructor, __jsb_cocos2d_GFXShaderInfo_class, js_cocos2d_GFXShaderInfo_finalize)




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
    jsret.setString(cobj->name.buffer());
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

static bool js_gfx_GFXAttribute_get_is_normalized(se::State& s)
{
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_get_is_normalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_normalized, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXAttribute_get_is_normalized)

static bool js_gfx_GFXAttribute_set_is_normalized(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_is_normalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_is_normalized : Error processing new value");
    cobj->is_normalized = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_is_normalized)

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

static bool js_gfx_GFXAttribute_get_is_instanced(se::State& s)
{
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_get_is_instanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_instanced, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXAttribute_get_is_instanced)

static bool js_gfx_GFXAttribute_set_is_instanced(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXAttribute* cobj = (cocos2d::GFXAttribute*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXAttribute_set_is_instanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXAttribute_set_is_instanced : Error processing new value");
    cobj->is_instanced = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXAttribute_set_is_instanced)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXAttribute_finalize)

static bool js_gfx_GFXAttribute_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXAttribute* cobj = new (std::nothrow) cocos2d::GFXAttribute();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::String arg0;
        json->getProperty("name", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".name\" is undefined!");
            return false;
        }
        arg0 = field.toStringForce().c_str();
        cocos2d::GFXFormat arg1;
        json->getProperty("format", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".format\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXFormat)tmp; } while(false);
        bool arg2;
        json->getProperty("is_normalized", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_normalized\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg2);
        unsigned int arg3 = 0;
        json->getProperty("stream", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stream\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);
        bool arg4;
        json->getProperty("is_instanced", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_instanced\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg4);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXAttribute* cobj = new (std::nothrow) cocos2d::GFXAttribute();
        cobj->name = arg0;
        cobj->format = arg1;
        cobj->is_normalized = arg2;
        cobj->stream = arg3;
        cobj->is_instanced = arg4;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 5)
    {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        cocos2d::GFXFormat arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXFormat)tmp; } while(false);
        bool arg2;
        ok &= seval_to_boolean(args[2], &arg2);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        bool arg4;
        ok &= seval_to_boolean(args[4], &arg4);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXAttribute* cobj = new (std::nothrow) cocos2d::GFXAttribute();
        cobj->name = arg0;
        cobj->format = arg1;
        cobj->is_normalized = arg2;
        cobj->stream = arg3;
        cobj->is_instanced = arg4;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXAttribute_constructor, __jsb_cocos2d_GFXAttribute_class, js_cocos2d_GFXAttribute_finalize)




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
    cls->defineProperty("is_normalized", _SE(js_gfx_GFXAttribute_get_is_normalized), _SE(js_gfx_GFXAttribute_set_is_normalized));
    cls->defineProperty("stream", _SE(js_gfx_GFXAttribute_get_stream), _SE(js_gfx_GFXAttribute_set_stream));
    cls->defineProperty("is_instanced", _SE(js_gfx_GFXAttribute_get_is_instanced), _SE(js_gfx_GFXAttribute_set_is_instanced));
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

static bool js_gfx_GFXInputAssemblerInfo_get_vertex_buffers(se::State& s)
{
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_get_vertex_buffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->vertex_buffers, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssemblerInfo_get_vertex_buffers)

static bool js_gfx_GFXInputAssemblerInfo_set_vertex_buffers(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_vertex_buffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXBuffer *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_vertex_buffers : Error processing new value");
    cobj->vertex_buffers = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_vertex_buffers)

static bool js_gfx_GFXInputAssemblerInfo_get_index_buffer(se::State& s)
{
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_get_index_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->index_buffer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssemblerInfo_get_index_buffer)

static bool js_gfx_GFXInputAssemblerInfo_set_index_buffer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_index_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBuffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_index_buffer : Error processing new value");
    cobj->index_buffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_index_buffer)

static bool js_gfx_GFXInputAssemblerInfo_get_indirect_buffer(se::State& s)
{
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_get_indirect_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->indirect_buffer, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXInputAssemblerInfo_get_indirect_buffer)

static bool js_gfx_GFXInputAssemblerInfo_set_indirect_buffer(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXInputAssemblerInfo* cobj = (cocos2d::GFXInputAssemblerInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssemblerInfo_set_indirect_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBuffer* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssemblerInfo_set_indirect_buffer : Error processing new value");
    cobj->indirect_buffer = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXInputAssemblerInfo_set_indirect_buffer)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXInputAssemblerInfo_finalize)

static bool js_gfx_GFXInputAssemblerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXInputAssemblerInfo* cobj = new (std::nothrow) cocos2d::GFXInputAssemblerInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        std::vector<cocos2d::GFXAttribute> arg0;
        json->getProperty("attributes", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".attributes\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg0);
        std::vector<cocos2d::GFXBuffer *> arg1;
        json->getProperty("vertex_buffers", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".vertex_buffers\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg1);
        cocos2d::GFXBuffer* arg2 = nullptr;
        json->getProperty("index_buffer", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".index_buffer\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg2);
        cocos2d::GFXBuffer* arg3 = nullptr;
        json->getProperty("indirect_buffer", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".indirect_buffer\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg3);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXInputAssemblerInfo* cobj = new (std::nothrow) cocos2d::GFXInputAssemblerInfo();
        cobj->attributes = arg0;
        cobj->vertex_buffers = arg1;
        cobj->index_buffer = arg2;
        cobj->indirect_buffer = arg3;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        std::vector<cocos2d::GFXAttribute> arg0;
        ok &= seval_to_std_vector(args[0], &arg0);
        std::vector<cocos2d::GFXBuffer *> arg1;
        ok &= seval_to_std_vector(args[1], &arg1);
        cocos2d::GFXBuffer* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[2], &arg2);
        cocos2d::GFXBuffer* arg3 = nullptr;
        ok &= seval_to_native_ptr(args[3], &arg3);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXInputAssemblerInfo* cobj = new (std::nothrow) cocos2d::GFXInputAssemblerInfo();
        cobj->attributes = arg0;
        cobj->vertex_buffers = arg1;
        cobj->index_buffer = arg2;
        cobj->indirect_buffer = arg3;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXInputAssemblerInfo_constructor, __jsb_cocos2d_GFXInputAssemblerInfo_class, js_cocos2d_GFXInputAssemblerInfo_finalize)




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
    cls->defineProperty("vertex_buffers", _SE(js_gfx_GFXInputAssemblerInfo_get_vertex_buffers), _SE(js_gfx_GFXInputAssemblerInfo_set_vertex_buffers));
    cls->defineProperty("index_buffer", _SE(js_gfx_GFXInputAssemblerInfo_get_index_buffer), _SE(js_gfx_GFXInputAssemblerInfo_set_index_buffer));
    cls->defineProperty("indirect_buffer", _SE(js_gfx_GFXInputAssemblerInfo_get_indirect_buffer), _SE(js_gfx_GFXInputAssemblerInfo_set_indirect_buffer));
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

static bool js_gfx_GFXColorAttachment_get_load_op(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_load_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->load_op, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_load_op)

static bool js_gfx_GFXColorAttachment_set_load_op(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_load_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXLoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXLoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_load_op : Error processing new value");
    cobj->load_op = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_load_op)

static bool js_gfx_GFXColorAttachment_get_store_op(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_store_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->store_op, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_store_op)

static bool js_gfx_GFXColorAttachment_set_store_op(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_store_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_store_op : Error processing new value");
    cobj->store_op = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_store_op)

static bool js_gfx_GFXColorAttachment_get_sample_count(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_sample_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->sample_count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_sample_count)

static bool js_gfx_GFXColorAttachment_set_sample_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_sample_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_sample_count : Error processing new value");
    cobj->sample_count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_sample_count)

static bool js_gfx_GFXColorAttachment_get_begin_layout(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_begin_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->begin_layout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_begin_layout)

static bool js_gfx_GFXColorAttachment_set_begin_layout(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_begin_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_begin_layout : Error processing new value");
    cobj->begin_layout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_begin_layout)

static bool js_gfx_GFXColorAttachment_get_end_layout(se::State& s)
{
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_get_end_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->end_layout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXColorAttachment_get_end_layout)

static bool js_gfx_GFXColorAttachment_set_end_layout(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXColorAttachment* cobj = (cocos2d::GFXColorAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXColorAttachment_set_end_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXColorAttachment_set_end_layout : Error processing new value");
    cobj->end_layout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXColorAttachment_set_end_layout)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXColorAttachment_finalize)

static bool js_gfx_GFXColorAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXColorAttachment* cobj = new (std::nothrow) cocos2d::GFXColorAttachment();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXFormat arg0;
        json->getProperty("format", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".format\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
        cocos2d::GFXLoadOp arg1;
        json->getProperty("load_op", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".load_op\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXLoadOp)tmp; } while(false);
        cocos2d::GFXStoreOp arg2;
        json->getProperty("store_op", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".store_op\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXStoreOp)tmp; } while(false);
        unsigned int arg3 = 0;
        json->getProperty("sample_count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".sample_count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg3);
        cocos2d::GFXTextureLayout arg4;
        json->getProperty("begin_layout", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".begin_layout\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXTextureLayout)tmp; } while(false);
        cocos2d::GFXTextureLayout arg5;
        json->getProperty("end_layout", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".end_layout\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cocos2d::GFXTextureLayout)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXColorAttachment* cobj = new (std::nothrow) cocos2d::GFXColorAttachment();
        cobj->format = arg0;
        cobj->load_op = arg1;
        cobj->store_op = arg2;
        cobj->sample_count = arg3;
        cobj->begin_layout = arg4;
        cobj->end_layout = arg5;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        cocos2d::GFXFormat arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
        cocos2d::GFXLoadOp arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXLoadOp)tmp; } while(false);
        cocos2d::GFXStoreOp arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXStoreOp)tmp; } while(false);
        unsigned int arg3 = 0;
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        cocos2d::GFXTextureLayout arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXTextureLayout)tmp; } while(false);
        cocos2d::GFXTextureLayout arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::GFXTextureLayout)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXColorAttachment* cobj = new (std::nothrow) cocos2d::GFXColorAttachment();
        cobj->format = arg0;
        cobj->load_op = arg1;
        cobj->store_op = arg2;
        cobj->sample_count = arg3;
        cobj->begin_layout = arg4;
        cobj->end_layout = arg5;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXColorAttachment_constructor, __jsb_cocos2d_GFXColorAttachment_class, js_cocos2d_GFXColorAttachment_finalize)




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
    cls->defineProperty("load_op", _SE(js_gfx_GFXColorAttachment_get_load_op), _SE(js_gfx_GFXColorAttachment_set_load_op));
    cls->defineProperty("store_op", _SE(js_gfx_GFXColorAttachment_get_store_op), _SE(js_gfx_GFXColorAttachment_set_store_op));
    cls->defineProperty("sample_count", _SE(js_gfx_GFXColorAttachment_get_sample_count), _SE(js_gfx_GFXColorAttachment_set_sample_count));
    cls->defineProperty("begin_layout", _SE(js_gfx_GFXColorAttachment_get_begin_layout), _SE(js_gfx_GFXColorAttachment_set_begin_layout));
    cls->defineProperty("end_layout", _SE(js_gfx_GFXColorAttachment_get_end_layout), _SE(js_gfx_GFXColorAttachment_set_end_layout));
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

static bool js_gfx_GFXDepthStencilAttachment_get_depth_load_op(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_depth_load_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depth_load_op, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_depth_load_op)

static bool js_gfx_GFXDepthStencilAttachment_set_depth_load_op(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_depth_load_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXLoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXLoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_depth_load_op : Error processing new value");
    cobj->depth_load_op = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_depth_load_op)

static bool js_gfx_GFXDepthStencilAttachment_get_depth_store_op(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_depth_store_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depth_store_op, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_depth_store_op)

static bool js_gfx_GFXDepthStencilAttachment_set_depth_store_op(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_depth_store_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_depth_store_op : Error processing new value");
    cobj->depth_store_op = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_depth_store_op)

static bool js_gfx_GFXDepthStencilAttachment_get_stencil_load_op(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_stencil_load_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_load_op, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_stencil_load_op)

static bool js_gfx_GFXDepthStencilAttachment_set_stencil_load_op(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_stencil_load_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXLoadOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXLoadOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_stencil_load_op : Error processing new value");
    cobj->stencil_load_op = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_stencil_load_op)

static bool js_gfx_GFXDepthStencilAttachment_get_stencil_store_op(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_stencil_store_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_store_op, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_stencil_store_op)

static bool js_gfx_GFXDepthStencilAttachment_set_stencil_store_op(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_stencil_store_op : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStoreOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStoreOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_stencil_store_op : Error processing new value");
    cobj->stencil_store_op = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_stencil_store_op)

static bool js_gfx_GFXDepthStencilAttachment_get_sample_count(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_sample_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->sample_count, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_sample_count)

static bool js_gfx_GFXDepthStencilAttachment_set_sample_count(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_sample_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_sample_count : Error processing new value");
    cobj->sample_count = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_sample_count)

static bool js_gfx_GFXDepthStencilAttachment_get_begin_layout(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_begin_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->begin_layout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_begin_layout)

static bool js_gfx_GFXDepthStencilAttachment_set_begin_layout(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_begin_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_begin_layout : Error processing new value");
    cobj->begin_layout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_begin_layout)

static bool js_gfx_GFXDepthStencilAttachment_get_end_layout(se::State& s)
{
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_get_end_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->end_layout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilAttachment_get_end_layout)

static bool js_gfx_GFXDepthStencilAttachment_set_end_layout(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilAttachment* cobj = (cocos2d::GFXDepthStencilAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilAttachment_set_end_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureLayout arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXTextureLayout)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilAttachment_set_end_layout : Error processing new value");
    cobj->end_layout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilAttachment_set_end_layout)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXDepthStencilAttachment_finalize)

static bool js_gfx_GFXDepthStencilAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXDepthStencilAttachment* cobj = new (std::nothrow) cocos2d::GFXDepthStencilAttachment();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXFormat arg0;
        json->getProperty("format", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".format\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
        cocos2d::GFXLoadOp arg1;
        json->getProperty("depth_load_op", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_load_op\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXLoadOp)tmp; } while(false);
        cocos2d::GFXStoreOp arg2;
        json->getProperty("depth_store_op", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_store_op\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXStoreOp)tmp; } while(false);
        cocos2d::GFXLoadOp arg3;
        json->getProperty("stencil_load_op", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_load_op\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXLoadOp)tmp; } while(false);
        cocos2d::GFXStoreOp arg4;
        json->getProperty("stencil_store_op", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_store_op\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXStoreOp)tmp; } while(false);
        unsigned int arg5 = 0;
        json->getProperty("sample_count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".sample_count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg5);
        cocos2d::GFXTextureLayout arg6;
        json->getProperty("begin_layout", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".begin_layout\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cocos2d::GFXTextureLayout)tmp; } while(false);
        cocos2d::GFXTextureLayout arg7;
        json->getProperty("end_layout", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".end_layout\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cocos2d::GFXTextureLayout)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXDepthStencilAttachment* cobj = new (std::nothrow) cocos2d::GFXDepthStencilAttachment();
        cobj->format = arg0;
        cobj->depth_load_op = arg1;
        cobj->depth_store_op = arg2;
        cobj->stencil_load_op = arg3;
        cobj->stencil_store_op = arg4;
        cobj->sample_count = arg5;
        cobj->begin_layout = arg6;
        cobj->end_layout = arg7;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 8)
    {
        cocos2d::GFXFormat arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXFormat)tmp; } while(false);
        cocos2d::GFXLoadOp arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXLoadOp)tmp; } while(false);
        cocos2d::GFXStoreOp arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXStoreOp)tmp; } while(false);
        cocos2d::GFXLoadOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXLoadOp)tmp; } while(false);
        cocos2d::GFXStoreOp arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXStoreOp)tmp; } while(false);
        unsigned int arg5 = 0;
        ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
        cocos2d::GFXTextureLayout arg6;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cocos2d::GFXTextureLayout)tmp; } while(false);
        cocos2d::GFXTextureLayout arg7;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cocos2d::GFXTextureLayout)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXDepthStencilAttachment* cobj = new (std::nothrow) cocos2d::GFXDepthStencilAttachment();
        cobj->format = arg0;
        cobj->depth_load_op = arg1;
        cobj->depth_store_op = arg2;
        cobj->stencil_load_op = arg3;
        cobj->stencil_store_op = arg4;
        cobj->sample_count = arg5;
        cobj->begin_layout = arg6;
        cobj->end_layout = arg7;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXDepthStencilAttachment_constructor, __jsb_cocos2d_GFXDepthStencilAttachment_class, js_cocos2d_GFXDepthStencilAttachment_finalize)




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
    cls->defineProperty("depth_load_op", _SE(js_gfx_GFXDepthStencilAttachment_get_depth_load_op), _SE(js_gfx_GFXDepthStencilAttachment_set_depth_load_op));
    cls->defineProperty("depth_store_op", _SE(js_gfx_GFXDepthStencilAttachment_get_depth_store_op), _SE(js_gfx_GFXDepthStencilAttachment_set_depth_store_op));
    cls->defineProperty("stencil_load_op", _SE(js_gfx_GFXDepthStencilAttachment_get_stencil_load_op), _SE(js_gfx_GFXDepthStencilAttachment_set_stencil_load_op));
    cls->defineProperty("stencil_store_op", _SE(js_gfx_GFXDepthStencilAttachment_get_stencil_store_op), _SE(js_gfx_GFXDepthStencilAttachment_set_stencil_store_op));
    cls->defineProperty("sample_count", _SE(js_gfx_GFXDepthStencilAttachment_get_sample_count), _SE(js_gfx_GFXDepthStencilAttachment_set_sample_count));
    cls->defineProperty("begin_layout", _SE(js_gfx_GFXDepthStencilAttachment_get_begin_layout), _SE(js_gfx_GFXDepthStencilAttachment_set_begin_layout));
    cls->defineProperty("end_layout", _SE(js_gfx_GFXDepthStencilAttachment_get_end_layout), _SE(js_gfx_GFXDepthStencilAttachment_set_end_layout));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXDepthStencilAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXDepthStencilAttachment>(cls);

    __jsb_cocos2d_GFXDepthStencilAttachment_proto = cls->getProto();
    __jsb_cocos2d_GFXDepthStencilAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXSubPass_proto = nullptr;
se::Class* __jsb_cocos2d_GFXSubPass_class = nullptr;

static bool js_gfx_GFXSubPass_get_bind_point(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_bind_point : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->bind_point, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_bind_point)

static bool js_gfx_GFXSubPass_set_bind_point(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_bind_point : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXPipelineBindPoint arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXPipelineBindPoint)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_bind_point : Error processing new value");
    cobj->bind_point = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_bind_point)

static bool js_gfx_GFXSubPass_get_inputs(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_inputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    #pragma warning NO CONVERSION FROM NATIVE FOR ??;
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_inputs)

static bool js_gfx_GFXSubPass_set_inputs(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_inputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ??* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_inputs : Error processing new value");
    cobj->inputs = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_inputs)

static bool js_gfx_GFXSubPass_get_colors(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_colors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    #pragma warning NO CONVERSION FROM NATIVE FOR ??;
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_colors)

static bool js_gfx_GFXSubPass_set_colors(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_colors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ??* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_colors : Error processing new value");
    cobj->colors = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_colors)

static bool js_gfx_GFXSubPass_get_resolves(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_resolves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    #pragma warning NO CONVERSION FROM NATIVE FOR ??;
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_resolves)

static bool js_gfx_GFXSubPass_set_resolves(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_resolves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ??* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_resolves : Error processing new value");
    cobj->resolves = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_resolves)

static bool js_gfx_GFXSubPass_get_depth_stencil(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_depth_stencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint8_to_seval((unsigned char)cobj->depth_stencil, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_depth_stencil)

static bool js_gfx_GFXSubPass_set_depth_stencil(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_depth_stencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    uint8_t arg0;
    ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_depth_stencil : Error processing new value");
    cobj->depth_stencil = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_depth_stencil)

static bool js_gfx_GFXSubPass_get_preserves(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_preserves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    #pragma warning NO CONVERSION FROM NATIVE FOR ??;
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_preserves)

static bool js_gfx_GFXSubPass_set_preserves(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_preserves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ??* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_preserves : Error processing new value");
    cobj->preserves = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_preserves)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXSubPass_finalize)

static bool js_gfx_GFXSubPass_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXSubPass* cobj = new (std::nothrow) cocos2d::GFXSubPass();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXPipelineBindPoint arg0 = 0;
        json->getProperty("bind_point", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".bind_point\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXPipelineBindPoint)tmp; } while(false);
        ??* arg1 = 0;
        json->getProperty("inputs", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".inputs\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg1);
        ??* arg2 = 0;
        json->getProperty("colors", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".colors\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg2);
        ??* arg3 = 0;
        json->getProperty("resolves", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".resolves\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg3);
        uint8_t arg4;
        json->getProperty("depth_stencil", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_stencil\" is undefined!");
            return false;
        }
        ok &= seval_to_uint8(field, (uint8_t*)&arg4);
        ??* arg5 = 0;
        json->getProperty("preserves", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".preserves\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg5);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXSubPass* cobj = new (std::nothrow) cocos2d::GFXSubPass();
        cobj->bind_point = arg0;
        cobj->inputs = *arg1;
        cobj->colors = *arg2;
        cobj->resolves = *arg3;
        cobj->depth_stencil = arg4;
        cobj->preserves = *arg5;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        cocos2d::GFXPipelineBindPoint arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXPipelineBindPoint)tmp; } while(false);
        ?? arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR ??
            ok = false;
        ?? arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR ??
            ok = false;
        ?? arg3;
        #pragma warning NO CONVERSION TO NATIVE FOR ??
            ok = false;
        uint8_t arg4;
        ok &= seval_to_uint8(args[4], (uint8_t*)&arg4);
        ?? arg5;
        #pragma warning NO CONVERSION TO NATIVE FOR ??
            ok = false;

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXSubPass* cobj = new (std::nothrow) cocos2d::GFXSubPass();
        cobj->bind_point = arg0;
        cobj->inputs = arg1;
        cobj->colors = arg2;
        cobj->resolves = arg3;
        cobj->depth_stencil = arg4;
        cobj->preserves = arg5;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXSubPass_constructor, __jsb_cocos2d_GFXSubPass_class, js_cocos2d_GFXSubPass_finalize)




static bool js_cocos2d_GFXSubPass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXSubPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXSubPass_finalize)

bool js_register_gfx_GFXSubPass(se::Object* obj)
{
    auto cls = se::Class::create("GFXSubPass", obj, nullptr, _SE(js_gfx_GFXSubPass_constructor));

    cls->defineProperty("bind_point", _SE(js_gfx_GFXSubPass_get_bind_point), _SE(js_gfx_GFXSubPass_set_bind_point));
    cls->defineProperty("inputs", _SE(js_gfx_GFXSubPass_get_inputs), _SE(js_gfx_GFXSubPass_set_inputs));
    cls->defineProperty("colors", _SE(js_gfx_GFXSubPass_get_colors), _SE(js_gfx_GFXSubPass_set_colors));
    cls->defineProperty("resolves", _SE(js_gfx_GFXSubPass_get_resolves), _SE(js_gfx_GFXSubPass_set_resolves));
    cls->defineProperty("depth_stencil", _SE(js_gfx_GFXSubPass_get_depth_stencil), _SE(js_gfx_GFXSubPass_set_depth_stencil));
    cls->defineProperty("preserves", _SE(js_gfx_GFXSubPass_get_preserves), _SE(js_gfx_GFXSubPass_set_preserves));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXSubPass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXSubPass>(cls);

    __jsb_cocos2d_GFXSubPass_proto = cls->getProto();
    __jsb_cocos2d_GFXSubPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXRenderPassInfo_proto = nullptr;
se::Class* __jsb_cocos2d_GFXRenderPassInfo_class = nullptr;

static bool js_gfx_GFXRenderPassInfo_get_color_attachments(se::State& s)
{
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_get_color_attachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->color_attachments, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPassInfo_get_color_attachments)

static bool js_gfx_GFXRenderPassInfo_set_color_attachments(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_set_color_attachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXColorAttachment> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPassInfo_set_color_attachments : Error processing new value");
    cobj->color_attachments = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRenderPassInfo_set_color_attachments)

static bool js_gfx_GFXRenderPassInfo_get_depth_stencil_attachment(se::State& s)
{
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_get_depth_stencil_attachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->depth_stencil_attachment, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPassInfo_get_depth_stencil_attachment)

static bool js_gfx_GFXRenderPassInfo_set_depth_stencil_attachment(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_set_depth_stencil_attachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXDepthStencilAttachment* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPassInfo_set_depth_stencil_attachment : Error processing new value");
    cobj->depth_stencil_attachment = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRenderPassInfo_set_depth_stencil_attachment)

static bool js_gfx_GFXRenderPassInfo_get_sub_passes(se::State& s)
{
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_get_sub_passes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->sub_passes, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRenderPassInfo_get_sub_passes)

static bool js_gfx_GFXRenderPassInfo_set_sub_passes(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRenderPassInfo* cobj = (cocos2d::GFXRenderPassInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPassInfo_set_sub_passes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXSubPass> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPassInfo_set_sub_passes : Error processing new value");
    cobj->sub_passes = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRenderPassInfo_set_sub_passes)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXRenderPassInfo_finalize)

static bool js_gfx_GFXRenderPassInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXRenderPassInfo* cobj = new (std::nothrow) cocos2d::GFXRenderPassInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        std::vector<cocos2d::GFXColorAttachment> arg0;
        json->getProperty("color_attachments", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".color_attachments\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg0);
        cocos2d::GFXDepthStencilAttachment* arg1 = 0;
        json->getProperty("depth_stencil_attachment", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_stencil_attachment\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg1);
        std::vector<cocos2d::GFXSubPass> arg2;
        json->getProperty("sub_passes", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".sub_passes\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg2);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXRenderPassInfo* cobj = new (std::nothrow) cocos2d::GFXRenderPassInfo();
        cobj->color_attachments = arg0;
        cobj->depth_stencil_attachment = *arg1;
        cobj->sub_passes = arg2;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        std::vector<cocos2d::GFXColorAttachment> arg0;
        ok &= seval_to_std_vector(args[0], &arg0);
        cocos2d::GFXDepthStencilAttachment arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXDepthStencilAttachment
            ok = false;
        std::vector<cocos2d::GFXSubPass> arg2;
        ok &= seval_to_std_vector(args[2], &arg2);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXRenderPassInfo* cobj = new (std::nothrow) cocos2d::GFXRenderPassInfo();
        cobj->color_attachments = arg0;
        cobj->depth_stencil_attachment = arg1;
        cobj->sub_passes = arg2;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXRenderPassInfo_constructor, __jsb_cocos2d_GFXRenderPassInfo_class, js_cocos2d_GFXRenderPassInfo_finalize)




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

    cls->defineProperty("color_attachments", _SE(js_gfx_GFXRenderPassInfo_get_color_attachments), _SE(js_gfx_GFXRenderPassInfo_set_color_attachments));
    cls->defineProperty("depth_stencil_attachment", _SE(js_gfx_GFXRenderPassInfo_get_depth_stencil_attachment), _SE(js_gfx_GFXRenderPassInfo_set_depth_stencil_attachment));
    cls->defineProperty("sub_passes", _SE(js_gfx_GFXRenderPassInfo_get_sub_passes), _SE(js_gfx_GFXRenderPassInfo_set_sub_passes));
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

static bool js_gfx_GFXFramebufferInfo_get_render_pass(se::State& s)
{
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_render_pass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->render_pass, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_render_pass)

static bool js_gfx_GFXFramebufferInfo_set_render_pass(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_render_pass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXRenderPass* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_render_pass : Error processing new value");
    cobj->render_pass = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_render_pass)

static bool js_gfx_GFXFramebufferInfo_get_color_views(se::State& s)
{
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_color_views : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->color_views, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_color_views)

static bool js_gfx_GFXFramebufferInfo_set_color_views(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_color_views : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXTextureView *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_color_views : Error processing new value");
    cobj->color_views = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_color_views)

static bool js_gfx_GFXFramebufferInfo_get_depth_stencil_view(se::State& s)
{
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_depth_stencil_view : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->depth_stencil_view, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_depth_stencil_view)

static bool js_gfx_GFXFramebufferInfo_set_depth_stencil_view(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_depth_stencil_view : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureView* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_depth_stencil_view : Error processing new value");
    cobj->depth_stencil_view = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_depth_stencil_view)

static bool js_gfx_GFXFramebufferInfo_get_is_offscreen(se::State& s)
{
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_get_is_offscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_offscreen, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFramebufferInfo_get_is_offscreen)

static bool js_gfx_GFXFramebufferInfo_set_is_offscreen(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFramebufferInfo* cobj = (cocos2d::GFXFramebufferInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebufferInfo_set_is_offscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebufferInfo_set_is_offscreen : Error processing new value");
    cobj->is_offscreen = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFramebufferInfo_set_is_offscreen)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXFramebufferInfo_finalize)

static bool js_gfx_GFXFramebufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXFramebufferInfo* cobj = new (std::nothrow) cocos2d::GFXFramebufferInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXRenderPass* arg0 = nullptr;
        json->getProperty("render_pass", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".render_pass\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg0);
        std::vector<cocos2d::GFXTextureView *> arg1;
        json->getProperty("color_views", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".color_views\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg1);
        cocos2d::GFXTextureView* arg2 = nullptr;
        json->getProperty("depth_stencil_view", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_stencil_view\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg2);
        bool arg3;
        json->getProperty("is_offscreen", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_offscreen\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg3);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXFramebufferInfo* cobj = new (std::nothrow) cocos2d::GFXFramebufferInfo();
        cobj->render_pass = arg0;
        cobj->color_views = arg1;
        cobj->depth_stencil_view = arg2;
        cobj->is_offscreen = arg3;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        cocos2d::GFXRenderPass* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        std::vector<cocos2d::GFXTextureView *> arg1;
        ok &= seval_to_std_vector(args[1], &arg1);
        cocos2d::GFXTextureView* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[2], &arg2);
        bool arg3;
        ok &= seval_to_boolean(args[3], &arg3);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXFramebufferInfo* cobj = new (std::nothrow) cocos2d::GFXFramebufferInfo();
        cobj->render_pass = arg0;
        cobj->color_views = arg1;
        cobj->depth_stencil_view = arg2;
        cobj->is_offscreen = arg3;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXFramebufferInfo_constructor, __jsb_cocos2d_GFXFramebufferInfo_class, js_cocos2d_GFXFramebufferInfo_finalize)




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

    cls->defineProperty("render_pass", _SE(js_gfx_GFXFramebufferInfo_get_render_pass), _SE(js_gfx_GFXFramebufferInfo_set_render_pass));
    cls->defineProperty("color_views", _SE(js_gfx_GFXFramebufferInfo_get_color_views), _SE(js_gfx_GFXFramebufferInfo_set_color_views));
    cls->defineProperty("depth_stencil_view", _SE(js_gfx_GFXFramebufferInfo_get_depth_stencil_view), _SE(js_gfx_GFXFramebufferInfo_set_depth_stencil_view));
    cls->defineProperty("is_offscreen", _SE(js_gfx_GFXFramebufferInfo_get_is_offscreen), _SE(js_gfx_GFXFramebufferInfo_set_is_offscreen));
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
    jsret.setString(cobj->name.buffer());
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
        cocos2d::GFXBinding* cobj = new (std::nothrow) cocos2d::GFXBinding();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        unsigned int arg0 = 0;
        json->getProperty("binding", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".binding\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg0);
        cocos2d::GFXBindingType arg1;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXBindingType)tmp; } while(false);
        cocos2d::String arg2;
        json->getProperty("name", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".name\" is undefined!");
            return false;
        }
        arg2 = field.toStringForce().c_str();

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXBinding* cobj = new (std::nothrow) cocos2d::GFXBinding();
        cobj->binding = arg0;
        cobj->type = arg1;
        cobj->name = arg2;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        cocos2d::GFXBindingType arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXBindingType)tmp; } while(false);
        cocos2d::String arg2;
        arg2 = args[2].toStringForce().c_str();

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXBinding* cobj = new (std::nothrow) cocos2d::GFXBinding();
        cobj->binding = arg0;
        cobj->type = arg1;
        cobj->name = arg2;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXBinding_constructor, __jsb_cocos2d_GFXBinding_class, js_cocos2d_GFXBinding_finalize)




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
        cocos2d::GFXBindingLayoutInfo* cobj = new (std::nothrow) cocos2d::GFXBindingLayoutInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        std::vector<cocos2d::GFXBinding> arg0;
        json->getProperty("bindings", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".bindings\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg0);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXBindingLayoutInfo* cobj = new (std::nothrow) cocos2d::GFXBindingLayoutInfo();
        cobj->bindings = arg0;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        std::vector<cocos2d::GFXBinding> arg0;
        ok &= seval_to_std_vector(args[0], &arg0);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXBindingLayoutInfo* cobj = new (std::nothrow) cocos2d::GFXBindingLayoutInfo();
        cobj->bindings = arg0;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXBindingLayoutInfo_constructor, __jsb_cocos2d_GFXBindingLayoutInfo_class, js_cocos2d_GFXBindingLayoutInfo_finalize)




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
    jsret.setString(cobj->name.buffer());
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

static bool js_gfx_GFXBindingUnit_get_tex_view(se::State& s)
{
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_get_tex_view : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->tex_view, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBindingUnit_get_tex_view)

static bool js_gfx_GFXBindingUnit_set_tex_view(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBindingUnit* cobj = (cocos2d::GFXBindingUnit*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingUnit_set_tex_view : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXTextureView* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingUnit_set_tex_view : Error processing new value");
    cobj->tex_view = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBindingUnit_set_tex_view)

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
        cocos2d::GFXBindingUnit* cobj = new (std::nothrow) cocos2d::GFXBindingUnit();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        unsigned int arg0 = 0;
        json->getProperty("binding", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".binding\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg0);
        cocos2d::GFXBindingType arg1;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXBindingType)tmp; } while(false);
        cocos2d::String arg2;
        json->getProperty("name", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".name\" is undefined!");
            return false;
        }
        arg2 = field.toStringForce().c_str();
        cocos2d::GFXBuffer* arg3 = nullptr;
        json->getProperty("buffer", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".buffer\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg3);
        cocos2d::GFXTextureView* arg4 = nullptr;
        json->getProperty("tex_view", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".tex_view\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg4);
        cocos2d::GFXSampler* arg5 = nullptr;
        json->getProperty("sampler", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".sampler\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg5);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXBindingUnit* cobj = new (std::nothrow) cocos2d::GFXBindingUnit();
        cobj->binding = arg0;
        cobj->type = arg1;
        cobj->name = arg2;
        cobj->buffer = arg3;
        cobj->tex_view = arg4;
        cobj->sampler = arg5;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 6)
    {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        cocos2d::GFXBindingType arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXBindingType)tmp; } while(false);
        cocos2d::String arg2;
        arg2 = args[2].toStringForce().c_str();
        cocos2d::GFXBuffer* arg3 = nullptr;
        ok &= seval_to_native_ptr(args[3], &arg3);
        cocos2d::GFXTextureView* arg4 = nullptr;
        ok &= seval_to_native_ptr(args[4], &arg4);
        cocos2d::GFXSampler* arg5 = nullptr;
        ok &= seval_to_native_ptr(args[5], &arg5);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXBindingUnit* cobj = new (std::nothrow) cocos2d::GFXBindingUnit();
        cobj->binding = arg0;
        cobj->type = arg1;
        cobj->name = arg2;
        cobj->buffer = arg3;
        cobj->tex_view = arg4;
        cobj->sampler = arg5;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXBindingUnit_constructor, __jsb_cocos2d_GFXBindingUnit_class, js_cocos2d_GFXBindingUnit_finalize)




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
    cls->defineProperty("tex_view", _SE(js_gfx_GFXBindingUnit_get_tex_view), _SE(js_gfx_GFXBindingUnit_set_tex_view));
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

static bool js_gfx_GFXPushConstantRange_get_shader_type(se::State& s)
{
    cocos2d::GFXPushConstantRange* cobj = (cocos2d::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_get_shader_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shader_type, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPushConstantRange_get_shader_type)

static bool js_gfx_GFXPushConstantRange_set_shader_type(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPushConstantRange* cobj = (cocos2d::GFXPushConstantRange*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPushConstantRange_set_shader_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXShaderType arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPushConstantRange_set_shader_type : Error processing new value");
    cobj->shader_type = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPushConstantRange_set_shader_type)

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
        cocos2d::GFXPushConstantRange* cobj = new (std::nothrow) cocos2d::GFXPushConstantRange();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXShaderType arg0;
        json->getProperty("shader_type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".shader_type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
        unsigned int arg1 = 0;
        json->getProperty("offset", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".offset\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        json->getProperty("count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXPushConstantRange* cobj = new (std::nothrow) cocos2d::GFXPushConstantRange();
        cobj->shader_type = arg0;
        cobj->offset = arg1;
        cobj->count = arg2;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 3)
    {
        cocos2d::GFXShaderType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXShaderType)tmp; } while(false);
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXPushConstantRange* cobj = new (std::nothrow) cocos2d::GFXPushConstantRange();
        cobj->shader_type = arg0;
        cobj->offset = arg1;
        cobj->count = arg2;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXPushConstantRange_constructor, __jsb_cocos2d_GFXPushConstantRange_class, js_cocos2d_GFXPushConstantRange_finalize)




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

    cls->defineProperty("shader_type", _SE(js_gfx_GFXPushConstantRange_get_shader_type), _SE(js_gfx_GFXPushConstantRange_set_shader_type));
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

static bool js_gfx_GFXPipelineLayoutInfo_get_push_constant_ranges(se::State& s)
{
    cocos2d::GFXPipelineLayoutInfo* cobj = (cocos2d::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_get_push_constant_ranges : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->push_constant_ranges, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineLayoutInfo_get_push_constant_ranges)

static bool js_gfx_GFXPipelineLayoutInfo_set_push_constant_ranges(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineLayoutInfo* cobj = (cocos2d::GFXPipelineLayoutInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayoutInfo_set_push_constant_ranges : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXPushConstantRange> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayoutInfo_set_push_constant_ranges : Error processing new value");
    cobj->push_constant_ranges = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineLayoutInfo_set_push_constant_ranges)

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
        cocos2d::GFXPipelineLayoutInfo* cobj = new (std::nothrow) cocos2d::GFXPipelineLayoutInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        std::vector<cocos2d::GFXPushConstantRange> arg0;
        json->getProperty("push_constant_ranges", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".push_constant_ranges\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg0);
        std::vector<cocos2d::GFXBindingLayout *> arg1;
        json->getProperty("layouts", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".layouts\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg1);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXPipelineLayoutInfo* cobj = new (std::nothrow) cocos2d::GFXPipelineLayoutInfo();
        cobj->push_constant_ranges = arg0;
        cobj->layouts = arg1;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 2)
    {
        std::vector<cocos2d::GFXPushConstantRange> arg0;
        ok &= seval_to_std_vector(args[0], &arg0);
        std::vector<cocos2d::GFXBindingLayout *> arg1;
        ok &= seval_to_std_vector(args[1], &arg1);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXPipelineLayoutInfo* cobj = new (std::nothrow) cocos2d::GFXPipelineLayoutInfo();
        cobj->push_constant_ranges = arg0;
        cobj->layouts = arg1;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXPipelineLayoutInfo_constructor, __jsb_cocos2d_GFXPipelineLayoutInfo_class, js_cocos2d_GFXPipelineLayoutInfo_finalize)




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

    cls->defineProperty("push_constant_ranges", _SE(js_gfx_GFXPipelineLayoutInfo_get_push_constant_ranges), _SE(js_gfx_GFXPipelineLayoutInfo_set_push_constant_ranges));
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
        cocos2d::GFXInputState* cobj = new (std::nothrow) cocos2d::GFXInputState();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        std::vector<cocos2d::GFXAttribute> arg0;
        json->getProperty("attributes", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".attributes\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg0);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXInputState* cobj = new (std::nothrow) cocos2d::GFXInputState();
        cobj->attributes = arg0;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        std::vector<cocos2d::GFXAttribute> arg0;
        ok &= seval_to_std_vector(args[0], &arg0);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXInputState* cobj = new (std::nothrow) cocos2d::GFXInputState();
        cobj->attributes = arg0;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXInputState_constructor, __jsb_cocos2d_GFXInputState_class, js_cocos2d_GFXInputState_finalize)




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

static bool js_gfx_GFXRasterizerState_get_is_discard(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_is_discard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_discard, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_is_discard)

static bool js_gfx_GFXRasterizerState_set_is_discard(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_is_discard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_is_discard : Error processing new value");
    cobj->is_discard = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_is_discard)

static bool js_gfx_GFXRasterizerState_get_polygon_mode(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_polygon_mode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->polygon_mode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_polygon_mode)

static bool js_gfx_GFXRasterizerState_set_polygon_mode(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_polygon_mode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXPolygonMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXPolygonMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_polygon_mode : Error processing new value");
    cobj->polygon_mode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_polygon_mode)

static bool js_gfx_GFXRasterizerState_get_shade_model(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_shade_model : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->shade_model, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_shade_model)

static bool js_gfx_GFXRasterizerState_set_shade_model(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_shade_model : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXShadeModel arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXShadeModel)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_shade_model : Error processing new value");
    cobj->shade_model = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_shade_model)

static bool js_gfx_GFXRasterizerState_get_cull_mode(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_cull_mode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->cull_mode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_cull_mode)

static bool js_gfx_GFXRasterizerState_set_cull_mode(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_cull_mode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXCullMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXCullMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_cull_mode : Error processing new value");
    cobj->cull_mode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_cull_mode)

static bool js_gfx_GFXRasterizerState_get_is_front_face_ccw(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_is_front_face_ccw : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_front_face_ccw, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_is_front_face_ccw)

static bool js_gfx_GFXRasterizerState_set_is_front_face_ccw(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_is_front_face_ccw : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_is_front_face_ccw : Error processing new value");
    cobj->is_front_face_ccw = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_is_front_face_ccw)

static bool js_gfx_GFXRasterizerState_get_depth_bias(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_depth_bias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->depth_bias, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_depth_bias)

static bool js_gfx_GFXRasterizerState_set_depth_bias(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_depth_bias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_depth_bias : Error processing new value");
    cobj->depth_bias = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_depth_bias)

static bool js_gfx_GFXRasterizerState_get_depth_bias_clamp(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_depth_bias_clamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->depth_bias_clamp, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_depth_bias_clamp)

static bool js_gfx_GFXRasterizerState_set_depth_bias_clamp(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_depth_bias_clamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_depth_bias_clamp : Error processing new value");
    cobj->depth_bias_clamp = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_depth_bias_clamp)

static bool js_gfx_GFXRasterizerState_get_depth_bias_slope(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_depth_bias_slope : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->depth_bias_slope, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_depth_bias_slope)

static bool js_gfx_GFXRasterizerState_set_depth_bias_slope(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_depth_bias_slope : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_depth_bias_slope : Error processing new value");
    cobj->depth_bias_slope = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_depth_bias_slope)

static bool js_gfx_GFXRasterizerState_get_is_depth_clip(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_is_depth_clip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_depth_clip, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_is_depth_clip)

static bool js_gfx_GFXRasterizerState_set_is_depth_clip(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_is_depth_clip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_is_depth_clip : Error processing new value");
    cobj->is_depth_clip = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_is_depth_clip)

static bool js_gfx_GFXRasterizerState_get_is_multisample(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_is_multisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_multisample, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_is_multisample)

static bool js_gfx_GFXRasterizerState_set_is_multisample(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_is_multisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_is_multisample : Error processing new value");
    cobj->is_multisample = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_is_multisample)

static bool js_gfx_GFXRasterizerState_get_line_width(se::State& s)
{
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_get_line_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->line_width, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXRasterizerState_get_line_width)

static bool js_gfx_GFXRasterizerState_set_line_width(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXRasterizerState* cobj = (cocos2d::GFXRasterizerState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRasterizerState_set_line_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRasterizerState_set_line_width : Error processing new value");
    cobj->line_width = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXRasterizerState_set_line_width)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXRasterizerState_finalize)

static bool js_gfx_GFXRasterizerState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXRasterizerState* cobj = new (std::nothrow) cocos2d::GFXRasterizerState();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        bool arg0;
        json->getProperty("is_discard", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_discard\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg0);
        cocos2d::GFXPolygonMode arg1;
        json->getProperty("polygon_mode", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".polygon_mode\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXPolygonMode)tmp; } while(false);
        cocos2d::GFXShadeModel arg2;
        json->getProperty("shade_model", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".shade_model\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXShadeModel)tmp; } while(false);
        cocos2d::GFXCullMode arg3;
        json->getProperty("cull_mode", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".cull_mode\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXCullMode)tmp; } while(false);
        bool arg4;
        json->getProperty("is_front_face_ccw", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_front_face_ccw\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg4);
        float arg5 = 0;
        json->getProperty("depth_bias", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_bias\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg5);
        float arg6 = 0;
        json->getProperty("depth_bias_clamp", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_bias_clamp\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg6);
        float arg7 = 0;
        json->getProperty("depth_bias_slope", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_bias_slope\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg7);
        bool arg8;
        json->getProperty("is_depth_clip", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_depth_clip\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg8);
        bool arg9;
        json->getProperty("is_multisample", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_multisample\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg9);
        float arg10 = 0;
        json->getProperty("line_width", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".line_width\" is undefined!");
            return false;
        }
        ok &= seval_to_float(field, &arg10);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXRasterizerState* cobj = new (std::nothrow) cocos2d::GFXRasterizerState();
        cobj->is_discard = arg0;
        cobj->polygon_mode = arg1;
        cobj->shade_model = arg2;
        cobj->cull_mode = arg3;
        cobj->is_front_face_ccw = arg4;
        cobj->depth_bias = arg5;
        cobj->depth_bias_clamp = arg6;
        cobj->depth_bias_slope = arg7;
        cobj->is_depth_clip = arg8;
        cobj->is_multisample = arg9;
        cobj->line_width = arg10;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 11)
    {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        cocos2d::GFXPolygonMode arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXPolygonMode)tmp; } while(false);
        cocos2d::GFXShadeModel arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXShadeModel)tmp; } while(false);
        cocos2d::GFXCullMode arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXCullMode)tmp; } while(false);
        bool arg4;
        ok &= seval_to_boolean(args[4], &arg4);
        float arg5 = 0;
        ok &= seval_to_float(args[5], &arg5);
        float arg6 = 0;
        ok &= seval_to_float(args[6], &arg6);
        float arg7 = 0;
        ok &= seval_to_float(args[7], &arg7);
        bool arg8;
        ok &= seval_to_boolean(args[8], &arg8);
        bool arg9;
        ok &= seval_to_boolean(args[9], &arg9);
        float arg10 = 0;
        ok &= seval_to_float(args[10], &arg10);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXRasterizerState* cobj = new (std::nothrow) cocos2d::GFXRasterizerState();
        cobj->is_discard = arg0;
        cobj->polygon_mode = arg1;
        cobj->shade_model = arg2;
        cobj->cull_mode = arg3;
        cobj->is_front_face_ccw = arg4;
        cobj->depth_bias = arg5;
        cobj->depth_bias_clamp = arg6;
        cobj->depth_bias_slope = arg7;
        cobj->is_depth_clip = arg8;
        cobj->is_multisample = arg9;
        cobj->line_width = arg10;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXRasterizerState_constructor, __jsb_cocos2d_GFXRasterizerState_class, js_cocos2d_GFXRasterizerState_finalize)




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

    cls->defineProperty("is_discard", _SE(js_gfx_GFXRasterizerState_get_is_discard), _SE(js_gfx_GFXRasterizerState_set_is_discard));
    cls->defineProperty("polygon_mode", _SE(js_gfx_GFXRasterizerState_get_polygon_mode), _SE(js_gfx_GFXRasterizerState_set_polygon_mode));
    cls->defineProperty("shade_model", _SE(js_gfx_GFXRasterizerState_get_shade_model), _SE(js_gfx_GFXRasterizerState_set_shade_model));
    cls->defineProperty("cull_mode", _SE(js_gfx_GFXRasterizerState_get_cull_mode), _SE(js_gfx_GFXRasterizerState_set_cull_mode));
    cls->defineProperty("is_front_face_ccw", _SE(js_gfx_GFXRasterizerState_get_is_front_face_ccw), _SE(js_gfx_GFXRasterizerState_set_is_front_face_ccw));
    cls->defineProperty("depth_bias", _SE(js_gfx_GFXRasterizerState_get_depth_bias), _SE(js_gfx_GFXRasterizerState_set_depth_bias));
    cls->defineProperty("depth_bias_clamp", _SE(js_gfx_GFXRasterizerState_get_depth_bias_clamp), _SE(js_gfx_GFXRasterizerState_set_depth_bias_clamp));
    cls->defineProperty("depth_bias_slope", _SE(js_gfx_GFXRasterizerState_get_depth_bias_slope), _SE(js_gfx_GFXRasterizerState_set_depth_bias_slope));
    cls->defineProperty("is_depth_clip", _SE(js_gfx_GFXRasterizerState_get_is_depth_clip), _SE(js_gfx_GFXRasterizerState_set_is_depth_clip));
    cls->defineProperty("is_multisample", _SE(js_gfx_GFXRasterizerState_get_is_multisample), _SE(js_gfx_GFXRasterizerState_set_is_multisample));
    cls->defineProperty("line_width", _SE(js_gfx_GFXRasterizerState_get_line_width), _SE(js_gfx_GFXRasterizerState_set_line_width));
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

static bool js_gfx_GFXDepthStencilState_get_depth_test(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_depth_test : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->depth_test, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_depth_test)

static bool js_gfx_GFXDepthStencilState_set_depth_test(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_depth_test : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_depth_test : Error processing new value");
    cobj->depth_test = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_depth_test)

static bool js_gfx_GFXDepthStencilState_get_depth_write(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_depth_write : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->depth_write, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_depth_write)

static bool js_gfx_GFXDepthStencilState_set_depth_write(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_depth_write : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_depth_write : Error processing new value");
    cobj->depth_write = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_depth_write)

static bool js_gfx_GFXDepthStencilState_get_depth_func(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_depth_func : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->depth_func, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_depth_func)

static bool js_gfx_GFXDepthStencilState_set_depth_func(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_depth_func : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_depth_func : Error processing new value");
    cobj->depth_func = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_depth_func)

static bool js_gfx_GFXDepthStencilState_get_stencil_test_front(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_test_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->stencil_test_front, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_test_front)

static bool js_gfx_GFXDepthStencilState_set_stencil_test_front(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_test_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_test_front : Error processing new value");
    cobj->stencil_test_front = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_test_front)

static bool js_gfx_GFXDepthStencilState_get_stencil_func_front(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_func_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_func_front, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_func_front)

static bool js_gfx_GFXDepthStencilState_set_stencil_func_front(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_func_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_func_front : Error processing new value");
    cobj->stencil_func_front = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_func_front)

static bool js_gfx_GFXDepthStencilState_get_stencil_read_mask_front(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_read_mask_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencil_read_mask_front, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_read_mask_front)

static bool js_gfx_GFXDepthStencilState_set_stencil_read_mask_front(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_read_mask_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_read_mask_front : Error processing new value");
    cobj->stencil_read_mask_front = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_read_mask_front)

static bool js_gfx_GFXDepthStencilState_get_stencil_write_mask_front(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_write_mask_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencil_write_mask_front, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_write_mask_front)

static bool js_gfx_GFXDepthStencilState_set_stencil_write_mask_front(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_write_mask_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_write_mask_front : Error processing new value");
    cobj->stencil_write_mask_front = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_write_mask_front)

static bool js_gfx_GFXDepthStencilState_get_stencil_fail_op_front(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_fail_op_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_fail_op_front, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_fail_op_front)

static bool js_gfx_GFXDepthStencilState_set_stencil_fail_op_front(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_fail_op_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_fail_op_front : Error processing new value");
    cobj->stencil_fail_op_front = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_fail_op_front)

static bool js_gfx_GFXDepthStencilState_get_stencil_z_fail_op_front(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_z_fail_op_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_z_fail_op_front, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_z_fail_op_front)

static bool js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_front(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_front : Error processing new value");
    cobj->stencil_z_fail_op_front = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_front)

static bool js_gfx_GFXDepthStencilState_get_stencil_pass_op_front(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_pass_op_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_pass_op_front, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_pass_op_front)

static bool js_gfx_GFXDepthStencilState_set_stencil_pass_op_front(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_pass_op_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_pass_op_front : Error processing new value");
    cobj->stencil_pass_op_front = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_pass_op_front)

static bool js_gfx_GFXDepthStencilState_get_stencil_ref_front(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_ref_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencil_ref_front, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_ref_front)

static bool js_gfx_GFXDepthStencilState_set_stencil_ref_front(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_ref_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_ref_front : Error processing new value");
    cobj->stencil_ref_front = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_ref_front)

static bool js_gfx_GFXDepthStencilState_get_stencil_test_back(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_test_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->stencil_test_back, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_test_back)

static bool js_gfx_GFXDepthStencilState_set_stencil_test_back(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_test_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_test_back : Error processing new value");
    cobj->stencil_test_back = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_test_back)

static bool js_gfx_GFXDepthStencilState_get_stencil_func_back(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_func_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_func_back, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_func_back)

static bool js_gfx_GFXDepthStencilState_set_stencil_func_back(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_func_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXComparisonFunc arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_func_back : Error processing new value");
    cobj->stencil_func_back = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_func_back)

static bool js_gfx_GFXDepthStencilState_get_stencil_read_mask_back(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_read_mask_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencil_read_mask_back, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_read_mask_back)

static bool js_gfx_GFXDepthStencilState_set_stencil_read_mask_back(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_read_mask_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_read_mask_back : Error processing new value");
    cobj->stencil_read_mask_back = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_read_mask_back)

static bool js_gfx_GFXDepthStencilState_get_stencil_write_mask_back(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_write_mask_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencil_write_mask_back, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_write_mask_back)

static bool js_gfx_GFXDepthStencilState_set_stencil_write_mask_back(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_write_mask_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_write_mask_back : Error processing new value");
    cobj->stencil_write_mask_back = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_write_mask_back)

static bool js_gfx_GFXDepthStencilState_get_stencil_fail_op_back(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_fail_op_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_fail_op_back, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_fail_op_back)

static bool js_gfx_GFXDepthStencilState_set_stencil_fail_op_back(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_fail_op_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_fail_op_back : Error processing new value");
    cobj->stencil_fail_op_back = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_fail_op_back)

static bool js_gfx_GFXDepthStencilState_get_stencil_z_fail_op_back(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_z_fail_op_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_z_fail_op_back, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_z_fail_op_back)

static bool js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_back(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_back : Error processing new value");
    cobj->stencil_z_fail_op_back = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_back)

static bool js_gfx_GFXDepthStencilState_get_stencil_pass_op_back(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_pass_op_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->stencil_pass_op_back, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_pass_op_back)

static bool js_gfx_GFXDepthStencilState_set_stencil_pass_op_back(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_pass_op_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXStencilOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_pass_op_back : Error processing new value");
    cobj->stencil_pass_op_back = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_pass_op_back)

static bool js_gfx_GFXDepthStencilState_get_stencil_ref_back(se::State& s)
{
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_get_stencil_ref_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->stencil_ref_back, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXDepthStencilState_get_stencil_ref_back)

static bool js_gfx_GFXDepthStencilState_set_stencil_ref_back(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXDepthStencilState* cobj = (cocos2d::GFXDepthStencilState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDepthStencilState_set_stencil_ref_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXDepthStencilState_set_stencil_ref_back : Error processing new value");
    cobj->stencil_ref_back = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXDepthStencilState_set_stencil_ref_back)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXDepthStencilState_finalize)

static bool js_gfx_GFXDepthStencilState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXDepthStencilState* cobj = new (std::nothrow) cocos2d::GFXDepthStencilState();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        bool arg0;
        json->getProperty("depth_test", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_test\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg0);
        bool arg1;
        json->getProperty("depth_write", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_write\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg1);
        cocos2d::GFXComparisonFunc arg2;
        json->getProperty("depth_func", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_func\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
        bool arg3;
        json->getProperty("stencil_test_front", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_test_front\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg3);
        cocos2d::GFXComparisonFunc arg4;
        json->getProperty("stencil_func_front", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_func_front\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
        unsigned int arg5 = 0;
        json->getProperty("stencil_read_mask_front", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_read_mask_front\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg5);
        unsigned int arg6 = 0;
        json->getProperty("stencil_write_mask_front", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_write_mask_front\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg6);
        cocos2d::GFXStencilOp arg7;
        json->getProperty("stencil_fail_op_front", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_fail_op_front\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cocos2d::GFXStencilOp)tmp; } while(false);
        cocos2d::GFXStencilOp arg8;
        json->getProperty("stencil_z_fail_op_front", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_z_fail_op_front\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cocos2d::GFXStencilOp)tmp; } while(false);
        cocos2d::GFXStencilOp arg9;
        json->getProperty("stencil_pass_op_front", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_pass_op_front\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg9 = (cocos2d::GFXStencilOp)tmp; } while(false);
        unsigned int arg10 = 0;
        json->getProperty("stencil_ref_front", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_ref_front\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg10);
        bool arg11;
        json->getProperty("stencil_test_back", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_test_back\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg11);
        cocos2d::GFXComparisonFunc arg12;
        json->getProperty("stencil_func_back", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_func_back\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg12 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
        unsigned int arg13 = 0;
        json->getProperty("stencil_read_mask_back", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_read_mask_back\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg13);
        unsigned int arg14 = 0;
        json->getProperty("stencil_write_mask_back", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_write_mask_back\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg14);
        cocos2d::GFXStencilOp arg15;
        json->getProperty("stencil_fail_op_back", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_fail_op_back\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg15 = (cocos2d::GFXStencilOp)tmp; } while(false);
        cocos2d::GFXStencilOp arg16;
        json->getProperty("stencil_z_fail_op_back", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_z_fail_op_back\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg16 = (cocos2d::GFXStencilOp)tmp; } while(false);
        cocos2d::GFXStencilOp arg17;
        json->getProperty("stencil_pass_op_back", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_pass_op_back\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg17 = (cocos2d::GFXStencilOp)tmp; } while(false);
        unsigned int arg18 = 0;
        json->getProperty("stencil_ref_back", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".stencil_ref_back\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg18);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXDepthStencilState* cobj = new (std::nothrow) cocos2d::GFXDepthStencilState();
        cobj->depth_test = arg0;
        cobj->depth_write = arg1;
        cobj->depth_func = arg2;
        cobj->stencil_test_front = arg3;
        cobj->stencil_func_front = arg4;
        cobj->stencil_read_mask_front = arg5;
        cobj->stencil_write_mask_front = arg6;
        cobj->stencil_fail_op_front = arg7;
        cobj->stencil_z_fail_op_front = arg8;
        cobj->stencil_pass_op_front = arg9;
        cobj->stencil_ref_front = arg10;
        cobj->stencil_test_back = arg11;
        cobj->stencil_func_back = arg12;
        cobj->stencil_read_mask_back = arg13;
        cobj->stencil_write_mask_back = arg14;
        cobj->stencil_fail_op_back = arg15;
        cobj->stencil_z_fail_op_back = arg16;
        cobj->stencil_pass_op_back = arg17;
        cobj->stencil_ref_back = arg18;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 19)
    {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        bool arg1;
        ok &= seval_to_boolean(args[1], &arg1);
        cocos2d::GFXComparisonFunc arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
        bool arg3;
        ok &= seval_to_boolean(args[3], &arg3);
        cocos2d::GFXComparisonFunc arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
        unsigned int arg5 = 0;
        ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
        unsigned int arg6 = 0;
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        cocos2d::GFXStencilOp arg7;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cocos2d::GFXStencilOp)tmp; } while(false);
        cocos2d::GFXStencilOp arg8;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cocos2d::GFXStencilOp)tmp; } while(false);
        cocos2d::GFXStencilOp arg9;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[9], &tmp); arg9 = (cocos2d::GFXStencilOp)tmp; } while(false);
        unsigned int arg10 = 0;
        ok &= seval_to_uint32(args[10], (uint32_t*)&arg10);
        bool arg11;
        ok &= seval_to_boolean(args[11], &arg11);
        cocos2d::GFXComparisonFunc arg12;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[12], &tmp); arg12 = (cocos2d::GFXComparisonFunc)tmp; } while(false);
        unsigned int arg13 = 0;
        ok &= seval_to_uint32(args[13], (uint32_t*)&arg13);
        unsigned int arg14 = 0;
        ok &= seval_to_uint32(args[14], (uint32_t*)&arg14);
        cocos2d::GFXStencilOp arg15;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[15], &tmp); arg15 = (cocos2d::GFXStencilOp)tmp; } while(false);
        cocos2d::GFXStencilOp arg16;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[16], &tmp); arg16 = (cocos2d::GFXStencilOp)tmp; } while(false);
        cocos2d::GFXStencilOp arg17;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[17], &tmp); arg17 = (cocos2d::GFXStencilOp)tmp; } while(false);
        unsigned int arg18 = 0;
        ok &= seval_to_uint32(args[18], (uint32_t*)&arg18);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXDepthStencilState* cobj = new (std::nothrow) cocos2d::GFXDepthStencilState();
        cobj->depth_test = arg0;
        cobj->depth_write = arg1;
        cobj->depth_func = arg2;
        cobj->stencil_test_front = arg3;
        cobj->stencil_func_front = arg4;
        cobj->stencil_read_mask_front = arg5;
        cobj->stencil_write_mask_front = arg6;
        cobj->stencil_fail_op_front = arg7;
        cobj->stencil_z_fail_op_front = arg8;
        cobj->stencil_pass_op_front = arg9;
        cobj->stencil_ref_front = arg10;
        cobj->stencil_test_back = arg11;
        cobj->stencil_func_back = arg12;
        cobj->stencil_read_mask_back = arg13;
        cobj->stencil_write_mask_back = arg14;
        cobj->stencil_fail_op_back = arg15;
        cobj->stencil_z_fail_op_back = arg16;
        cobj->stencil_pass_op_back = arg17;
        cobj->stencil_ref_back = arg18;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXDepthStencilState_constructor, __jsb_cocos2d_GFXDepthStencilState_class, js_cocos2d_GFXDepthStencilState_finalize)




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

    cls->defineProperty("depth_test", _SE(js_gfx_GFXDepthStencilState_get_depth_test), _SE(js_gfx_GFXDepthStencilState_set_depth_test));
    cls->defineProperty("depth_write", _SE(js_gfx_GFXDepthStencilState_get_depth_write), _SE(js_gfx_GFXDepthStencilState_set_depth_write));
    cls->defineProperty("depth_func", _SE(js_gfx_GFXDepthStencilState_get_depth_func), _SE(js_gfx_GFXDepthStencilState_set_depth_func));
    cls->defineProperty("stencil_test_front", _SE(js_gfx_GFXDepthStencilState_get_stencil_test_front), _SE(js_gfx_GFXDepthStencilState_set_stencil_test_front));
    cls->defineProperty("stencil_func_front", _SE(js_gfx_GFXDepthStencilState_get_stencil_func_front), _SE(js_gfx_GFXDepthStencilState_set_stencil_func_front));
    cls->defineProperty("stencil_read_mask_front", _SE(js_gfx_GFXDepthStencilState_get_stencil_read_mask_front), _SE(js_gfx_GFXDepthStencilState_set_stencil_read_mask_front));
    cls->defineProperty("stencil_write_mask_front", _SE(js_gfx_GFXDepthStencilState_get_stencil_write_mask_front), _SE(js_gfx_GFXDepthStencilState_set_stencil_write_mask_front));
    cls->defineProperty("stencil_fail_op_front", _SE(js_gfx_GFXDepthStencilState_get_stencil_fail_op_front), _SE(js_gfx_GFXDepthStencilState_set_stencil_fail_op_front));
    cls->defineProperty("stencil_z_fail_op_front", _SE(js_gfx_GFXDepthStencilState_get_stencil_z_fail_op_front), _SE(js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_front));
    cls->defineProperty("stencil_pass_op_front", _SE(js_gfx_GFXDepthStencilState_get_stencil_pass_op_front), _SE(js_gfx_GFXDepthStencilState_set_stencil_pass_op_front));
    cls->defineProperty("stencil_ref_front", _SE(js_gfx_GFXDepthStencilState_get_stencil_ref_front), _SE(js_gfx_GFXDepthStencilState_set_stencil_ref_front));
    cls->defineProperty("stencil_test_back", _SE(js_gfx_GFXDepthStencilState_get_stencil_test_back), _SE(js_gfx_GFXDepthStencilState_set_stencil_test_back));
    cls->defineProperty("stencil_func_back", _SE(js_gfx_GFXDepthStencilState_get_stencil_func_back), _SE(js_gfx_GFXDepthStencilState_set_stencil_func_back));
    cls->defineProperty("stencil_read_mask_back", _SE(js_gfx_GFXDepthStencilState_get_stencil_read_mask_back), _SE(js_gfx_GFXDepthStencilState_set_stencil_read_mask_back));
    cls->defineProperty("stencil_write_mask_back", _SE(js_gfx_GFXDepthStencilState_get_stencil_write_mask_back), _SE(js_gfx_GFXDepthStencilState_set_stencil_write_mask_back));
    cls->defineProperty("stencil_fail_op_back", _SE(js_gfx_GFXDepthStencilState_get_stencil_fail_op_back), _SE(js_gfx_GFXDepthStencilState_set_stencil_fail_op_back));
    cls->defineProperty("stencil_z_fail_op_back", _SE(js_gfx_GFXDepthStencilState_get_stencil_z_fail_op_back), _SE(js_gfx_GFXDepthStencilState_set_stencil_z_fail_op_back));
    cls->defineProperty("stencil_pass_op_back", _SE(js_gfx_GFXDepthStencilState_get_stencil_pass_op_back), _SE(js_gfx_GFXDepthStencilState_set_stencil_pass_op_back));
    cls->defineProperty("stencil_ref_back", _SE(js_gfx_GFXDepthStencilState_get_stencil_ref_back), _SE(js_gfx_GFXDepthStencilState_set_stencil_ref_back));
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

static bool js_gfx_GFXBlendTarget_get_is_blend(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_is_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_blend, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_is_blend)

static bool js_gfx_GFXBlendTarget_set_is_blend(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_is_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_is_blend : Error processing new value");
    cobj->is_blend = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_is_blend)

static bool js_gfx_GFXBlendTarget_get_blend_src(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blend_src : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blend_src, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blend_src)

static bool js_gfx_GFXBlendTarget_set_blend_src(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blend_src : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blend_src : Error processing new value");
    cobj->blend_src = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blend_src)

static bool js_gfx_GFXBlendTarget_get_blend_dst(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blend_dst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blend_dst, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blend_dst)

static bool js_gfx_GFXBlendTarget_set_blend_dst(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blend_dst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blend_dst : Error processing new value");
    cobj->blend_dst = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blend_dst)

static bool js_gfx_GFXBlendTarget_get_blend_eq(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blend_eq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blend_eq, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blend_eq)

static bool js_gfx_GFXBlendTarget_set_blend_eq(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blend_eq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blend_eq : Error processing new value");
    cobj->blend_eq = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blend_eq)

static bool js_gfx_GFXBlendTarget_get_blend_src_alpha(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blend_src_alpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blend_src_alpha, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blend_src_alpha)

static bool js_gfx_GFXBlendTarget_set_blend_src_alpha(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blend_src_alpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blend_src_alpha : Error processing new value");
    cobj->blend_src_alpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blend_src_alpha)

static bool js_gfx_GFXBlendTarget_get_blend_dst_alpha(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blend_dst_alpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blend_dst_alpha, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blend_dst_alpha)

static bool js_gfx_GFXBlendTarget_set_blend_dst_alpha(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blend_dst_alpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendFactor arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendFactor)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blend_dst_alpha : Error processing new value");
    cobj->blend_dst_alpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blend_dst_alpha)

static bool js_gfx_GFXBlendTarget_get_blend_alpha_eq(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blend_alpha_eq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blend_alpha_eq, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blend_alpha_eq)

static bool js_gfx_GFXBlendTarget_set_blend_alpha_eq(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blend_alpha_eq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendOp arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXBlendOp)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blend_alpha_eq : Error processing new value");
    cobj->blend_alpha_eq = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blend_alpha_eq)

static bool js_gfx_GFXBlendTarget_get_blend_color_mask(se::State& s)
{
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_get_blend_color_mask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->blend_color_mask, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendTarget_get_blend_color_mask)

static bool js_gfx_GFXBlendTarget_set_blend_color_mask(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendTarget* cobj = (cocos2d::GFXBlendTarget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendTarget_set_blend_color_mask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXColorMask arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXColorMask)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendTarget_set_blend_color_mask : Error processing new value");
    cobj->blend_color_mask = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendTarget_set_blend_color_mask)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBlendTarget_finalize)

static bool js_gfx_GFXBlendTarget_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXBlendTarget* cobj = new (std::nothrow) cocos2d::GFXBlendTarget();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        bool arg0;
        json->getProperty("is_blend", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_blend\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg0);
        cocos2d::GFXBlendFactor arg1;
        json->getProperty("blend_src", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".blend_src\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXBlendFactor)tmp; } while(false);
        cocos2d::GFXBlendFactor arg2;
        json->getProperty("blend_dst", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".blend_dst\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg2 = (cocos2d::GFXBlendFactor)tmp; } while(false);
        cocos2d::GFXBlendOp arg3;
        json->getProperty("blend_eq", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".blend_eq\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXBlendOp)tmp; } while(false);
        cocos2d::GFXBlendFactor arg4;
        json->getProperty("blend_src_alpha", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".blend_src_alpha\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg4 = (cocos2d::GFXBlendFactor)tmp; } while(false);
        cocos2d::GFXBlendFactor arg5;
        json->getProperty("blend_dst_alpha", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".blend_dst_alpha\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg5 = (cocos2d::GFXBlendFactor)tmp; } while(false);
        cocos2d::GFXBlendOp arg6;
        json->getProperty("blend_alpha_eq", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".blend_alpha_eq\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg6 = (cocos2d::GFXBlendOp)tmp; } while(false);
        cocos2d::GFXColorMask arg7;
        json->getProperty("blend_color_mask", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".blend_color_mask\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cocos2d::GFXColorMask)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXBlendTarget* cobj = new (std::nothrow) cocos2d::GFXBlendTarget();
        cobj->is_blend = arg0;
        cobj->blend_src = arg1;
        cobj->blend_dst = arg2;
        cobj->blend_eq = arg3;
        cobj->blend_src_alpha = arg4;
        cobj->blend_dst_alpha = arg5;
        cobj->blend_alpha_eq = arg6;
        cobj->blend_color_mask = arg7;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 8)
    {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        cocos2d::GFXBlendFactor arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXBlendFactor)tmp; } while(false);
        cocos2d::GFXBlendFactor arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXBlendFactor)tmp; } while(false);
        cocos2d::GFXBlendOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXBlendOp)tmp; } while(false);
        cocos2d::GFXBlendFactor arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::GFXBlendFactor)tmp; } while(false);
        cocos2d::GFXBlendFactor arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::GFXBlendFactor)tmp; } while(false);
        cocos2d::GFXBlendOp arg6;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (cocos2d::GFXBlendOp)tmp; } while(false);
        cocos2d::GFXColorMask arg7;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cocos2d::GFXColorMask)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXBlendTarget* cobj = new (std::nothrow) cocos2d::GFXBlendTarget();
        cobj->is_blend = arg0;
        cobj->blend_src = arg1;
        cobj->blend_dst = arg2;
        cobj->blend_eq = arg3;
        cobj->blend_src_alpha = arg4;
        cobj->blend_dst_alpha = arg5;
        cobj->blend_alpha_eq = arg6;
        cobj->blend_color_mask = arg7;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXBlendTarget_constructor, __jsb_cocos2d_GFXBlendTarget_class, js_cocos2d_GFXBlendTarget_finalize)




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

    cls->defineProperty("is_blend", _SE(js_gfx_GFXBlendTarget_get_is_blend), _SE(js_gfx_GFXBlendTarget_set_is_blend));
    cls->defineProperty("blend_src", _SE(js_gfx_GFXBlendTarget_get_blend_src), _SE(js_gfx_GFXBlendTarget_set_blend_src));
    cls->defineProperty("blend_dst", _SE(js_gfx_GFXBlendTarget_get_blend_dst), _SE(js_gfx_GFXBlendTarget_set_blend_dst));
    cls->defineProperty("blend_eq", _SE(js_gfx_GFXBlendTarget_get_blend_eq), _SE(js_gfx_GFXBlendTarget_set_blend_eq));
    cls->defineProperty("blend_src_alpha", _SE(js_gfx_GFXBlendTarget_get_blend_src_alpha), _SE(js_gfx_GFXBlendTarget_set_blend_src_alpha));
    cls->defineProperty("blend_dst_alpha", _SE(js_gfx_GFXBlendTarget_get_blend_dst_alpha), _SE(js_gfx_GFXBlendTarget_set_blend_dst_alpha));
    cls->defineProperty("blend_alpha_eq", _SE(js_gfx_GFXBlendTarget_get_blend_alpha_eq), _SE(js_gfx_GFXBlendTarget_set_blend_alpha_eq));
    cls->defineProperty("blend_color_mask", _SE(js_gfx_GFXBlendTarget_get_blend_color_mask), _SE(js_gfx_GFXBlendTarget_set_blend_color_mask));
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

static bool js_gfx_GFXBlendState_get_is_a2c(se::State& s)
{
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_get_is_a2c : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_a2c, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendState_get_is_a2c)

static bool js_gfx_GFXBlendState_set_is_a2c(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_is_a2c : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_is_a2c : Error processing new value");
    cobj->is_a2c = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendState_set_is_a2c)

static bool js_gfx_GFXBlendState_get_is_independ(se::State& s)
{
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_get_is_independ : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_independ, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendState_get_is_independ)

static bool js_gfx_GFXBlendState_set_is_independ(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_is_independ : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_is_independ : Error processing new value");
    cobj->is_independ = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendState_set_is_independ)

static bool js_gfx_GFXBlendState_get_blend_color(se::State& s)
{
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_get_blend_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->blend_color, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendState_get_blend_color)

static bool js_gfx_GFXBlendState_set_blend_color(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_blend_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXColor* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_blend_color : Error processing new value");
    cobj->blend_color = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendState_set_blend_color)

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
        cocos2d::GFXBlendState* cobj = new (std::nothrow) cocos2d::GFXBlendState();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        bool arg0;
        json->getProperty("is_a2c", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_a2c\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg0);
        bool arg1;
        json->getProperty("is_independ", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_independ\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg1);
        cocos2d::GFXColor* arg2 = 0;
        json->getProperty("blend_color", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".blend_color\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg2);
        std::vector<cocos2d::GFXBlendTarget> arg3;
        json->getProperty("targets", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".targets\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg3);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXBlendState* cobj = new (std::nothrow) cocos2d::GFXBlendState();
        cobj->is_a2c = arg0;
        cobj->is_independ = arg1;
        cobj->blend_color = *arg2;
        cobj->targets = arg3;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 4)
    {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        bool arg1;
        ok &= seval_to_boolean(args[1], &arg1);
        cocos2d::GFXColor arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXColor
            ok = false;
        std::vector<cocos2d::GFXBlendTarget> arg3;
        ok &= seval_to_std_vector(args[3], &arg3);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXBlendState* cobj = new (std::nothrow) cocos2d::GFXBlendState();
        cobj->is_a2c = arg0;
        cobj->is_independ = arg1;
        cobj->blend_color = arg2;
        cobj->targets = arg3;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXBlendState_constructor, __jsb_cocos2d_GFXBlendState_class, js_cocos2d_GFXBlendState_finalize)




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

    cls->defineProperty("is_a2c", _SE(js_gfx_GFXBlendState_get_is_a2c), _SE(js_gfx_GFXBlendState_set_is_a2c));
    cls->defineProperty("is_independ", _SE(js_gfx_GFXBlendState_get_is_independ), _SE(js_gfx_GFXBlendState_set_is_independ));
    cls->defineProperty("blend_color", _SE(js_gfx_GFXBlendState_get_blend_color), _SE(js_gfx_GFXBlendState_set_blend_color));
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

static bool js_gfx_GFXPipelineStateInfo_get_is(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_is : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->is, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_is)

static bool js_gfx_GFXPipelineStateInfo_set_is(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_is : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXInputState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_is : Error processing new value");
    cobj->is = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_is)

static bool js_gfx_GFXPipelineStateInfo_get_rs(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_rs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->rs, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_rs)

static bool js_gfx_GFXPipelineStateInfo_set_rs(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_rs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXRasterizerState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_rs : Error processing new value");
    cobj->rs = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_rs)

static bool js_gfx_GFXPipelineStateInfo_get_dss(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_dss : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->dss, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_dss)

static bool js_gfx_GFXPipelineStateInfo_set_dss(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_dss : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXDepthStencilState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_dss : Error processing new value");
    cobj->dss = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_dss)

static bool js_gfx_GFXPipelineStateInfo_get_bs(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_bs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->bs, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_bs)

static bool js_gfx_GFXPipelineStateInfo_set_bs(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_bs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXBlendState* arg0 = nullptr;
    ok &= seval_to_reference(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_bs : Error processing new value");
    cobj->bs = *arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_bs)

static bool js_gfx_GFXPipelineStateInfo_get_dynamic_states(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_dynamic_states : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->dynamic_states, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_dynamic_states)

static bool js_gfx_GFXPipelineStateInfo_set_dynamic_states(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_dynamic_states : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXDynamicState> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_dynamic_states : Error processing new value");
    cobj->dynamic_states = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_dynamic_states)

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

static bool js_gfx_GFXPipelineStateInfo_get_render_pass(se::State& s)
{
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_get_render_pass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->render_pass, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineStateInfo_get_render_pass)

static bool js_gfx_GFXPipelineStateInfo_set_render_pass(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXPipelineStateInfo* cobj = (cocos2d::GFXPipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineStateInfo_set_render_pass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXRenderPass* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineStateInfo_set_render_pass : Error processing new value");
    cobj->render_pass = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXPipelineStateInfo_set_render_pass)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXPipelineStateInfo_finalize)

static bool js_gfx_GFXPipelineStateInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXPipelineStateInfo* cobj = new (std::nothrow) cocos2d::GFXPipelineStateInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXPrimitiveMode arg0;
        json->getProperty("primitive", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".primitive\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXPrimitiveMode)tmp; } while(false);
        cocos2d::GFXShader* arg1 = nullptr;
        json->getProperty("shader", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".shader\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg1);
        cocos2d::GFXInputState* arg2 = 0;
        json->getProperty("is", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg2);
        cocos2d::GFXRasterizerState* arg3 = 0;
        json->getProperty("rs", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".rs\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg3);
        cocos2d::GFXDepthStencilState* arg4 = 0;
        json->getProperty("dss", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".dss\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg4);
        cocos2d::GFXBlendState* arg5 = 0;
        json->getProperty("bs", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".bs\" is undefined!");
            return false;
        }
        ok &= seval_to_reference(field, &arg5);
        std::vector<cocos2d::GFXDynamicState> arg6;
        json->getProperty("dynamic_states", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".dynamic_states\" is undefined!");
            return false;
        }
        ok &= seval_to_std_vector(field, &arg6);
        cocos2d::GFXPipelineLayout* arg7 = nullptr;
        json->getProperty("layout", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".layout\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg7);
        cocos2d::GFXRenderPass* arg8 = nullptr;
        json->getProperty("render_pass", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".render_pass\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg8);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXPipelineStateInfo* cobj = new (std::nothrow) cocos2d::GFXPipelineStateInfo();
        cobj->primitive = arg0;
        cobj->shader = arg1;
        cobj->is = *arg2;
        cobj->rs = *arg3;
        cobj->dss = *arg4;
        cobj->bs = *arg5;
        cobj->dynamic_states = arg6;
        cobj->layout = arg7;
        cobj->render_pass = arg8;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 9)
    {
        cocos2d::GFXPrimitiveMode arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXPrimitiveMode)tmp; } while(false);
        cocos2d::GFXShader* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[1], &arg1);
        cocos2d::GFXInputState arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXInputState
            ok = false;
        cocos2d::GFXRasterizerState arg3;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRasterizerState
            ok = false;
        cocos2d::GFXDepthStencilState arg4;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXDepthStencilState
            ok = false;
        cocos2d::GFXBlendState arg5;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBlendState
            ok = false;
        std::vector<cocos2d::GFXDynamicState> arg6;
        ok &= seval_to_std_vector(args[6], &arg6);
        cocos2d::GFXPipelineLayout* arg7 = nullptr;
        ok &= seval_to_native_ptr(args[7], &arg7);
        cocos2d::GFXRenderPass* arg8 = nullptr;
        ok &= seval_to_native_ptr(args[8], &arg8);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXPipelineStateInfo* cobj = new (std::nothrow) cocos2d::GFXPipelineStateInfo();
        cobj->primitive = arg0;
        cobj->shader = arg1;
        cobj->is = arg2;
        cobj->rs = arg3;
        cobj->dss = arg4;
        cobj->bs = arg5;
        cobj->dynamic_states = arg6;
        cobj->layout = arg7;
        cobj->render_pass = arg8;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXPipelineStateInfo_constructor, __jsb_cocos2d_GFXPipelineStateInfo_class, js_cocos2d_GFXPipelineStateInfo_finalize)




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
    cls->defineProperty("is", _SE(js_gfx_GFXPipelineStateInfo_get_is), _SE(js_gfx_GFXPipelineStateInfo_set_is));
    cls->defineProperty("rs", _SE(js_gfx_GFXPipelineStateInfo_get_rs), _SE(js_gfx_GFXPipelineStateInfo_set_rs));
    cls->defineProperty("dss", _SE(js_gfx_GFXPipelineStateInfo_get_dss), _SE(js_gfx_GFXPipelineStateInfo_set_dss));
    cls->defineProperty("bs", _SE(js_gfx_GFXPipelineStateInfo_get_bs), _SE(js_gfx_GFXPipelineStateInfo_set_bs));
    cls->defineProperty("dynamic_states", _SE(js_gfx_GFXPipelineStateInfo_get_dynamic_states), _SE(js_gfx_GFXPipelineStateInfo_set_dynamic_states));
    cls->defineProperty("layout", _SE(js_gfx_GFXPipelineStateInfo_get_layout), _SE(js_gfx_GFXPipelineStateInfo_set_layout));
    cls->defineProperty("render_pass", _SE(js_gfx_GFXPipelineStateInfo_get_render_pass), _SE(js_gfx_GFXPipelineStateInfo_set_render_pass));
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
        cocos2d::GFXCommandBufferInfo* cobj = new (std::nothrow) cocos2d::GFXCommandBufferInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXCommandAllocator* arg0 = nullptr;
        json->getProperty("allocator", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".allocator\" is undefined!");
            return false;
        }
        ok &= seval_to_native_ptr(field, &arg0);
        cocos2d::GFXCommandBufferType arg1;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cocos2d::GFXCommandBufferType)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXCommandBufferInfo* cobj = new (std::nothrow) cocos2d::GFXCommandBufferInfo();
        cobj->allocator = arg0;
        cobj->type = arg1;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 2)
    {
        cocos2d::GFXCommandAllocator* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        cocos2d::GFXCommandBufferType arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::GFXCommandBufferType)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXCommandBufferInfo* cobj = new (std::nothrow) cocos2d::GFXCommandBufferInfo();
        cobj->allocator = arg0;
        cobj->type = arg1;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXCommandBufferInfo_constructor, __jsb_cocos2d_GFXCommandBufferInfo_class, js_cocos2d_GFXCommandBufferInfo_finalize)




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
        cocos2d::GFXQueueInfo* cobj = new (std::nothrow) cocos2d::GFXQueueInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXQueueType arg0;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXQueueType)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXQueueInfo* cobj = new (std::nothrow) cocos2d::GFXQueueInfo();
        cobj->type = arg0;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1)
    {
        cocos2d::GFXQueueType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXQueueType)tmp; } while(false);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXQueueInfo* cobj = new (std::nothrow) cocos2d::GFXQueueInfo();
        cobj->type = arg0;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXQueueInfo_constructor, __jsb_cocos2d_GFXQueueInfo_class, js_cocos2d_GFXQueueInfo_finalize)




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
    jsret.setString(cobj->name.buffer());
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

static bool js_gfx_GFXFormatInfo_get_has_alpha(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_has_alpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->has_alpha, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_has_alpha)

static bool js_gfx_GFXFormatInfo_set_has_alpha(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_has_alpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_has_alpha : Error processing new value");
    cobj->has_alpha = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_has_alpha)

static bool js_gfx_GFXFormatInfo_get_has_depth(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_has_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->has_depth, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_has_depth)

static bool js_gfx_GFXFormatInfo_set_has_depth(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_has_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_has_depth : Error processing new value");
    cobj->has_depth = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_has_depth)

static bool js_gfx_GFXFormatInfo_get_has_stencil(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_has_stencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->has_stencil, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_has_stencil)

static bool js_gfx_GFXFormatInfo_set_has_stencil(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_has_stencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_has_stencil : Error processing new value");
    cobj->has_stencil = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_has_stencil)

static bool js_gfx_GFXFormatInfo_get_is_compressed(se::State& s)
{
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_get_is_compressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->is_compressed, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXFormatInfo_get_is_compressed)

static bool js_gfx_GFXFormatInfo_set_is_compressed(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXFormatInfo* cobj = (cocos2d::GFXFormatInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFormatInfo_set_is_compressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFormatInfo_set_is_compressed : Error processing new value");
    cobj->is_compressed = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXFormatInfo_set_is_compressed)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXFormatInfo_finalize)

static bool js_gfx_GFXFormatInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXFormatInfo* cobj = new (std::nothrow) cocos2d::GFXFormatInfo();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::String arg0;
        json->getProperty("name", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".name\" is undefined!");
            return false;
        }
        arg0 = field.toStringForce().c_str();
        unsigned int arg1 = 0;
        json->getProperty("size", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".size\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        json->getProperty("count", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".count\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg2);
        cocos2d::GFXFormatType arg3;
        json->getProperty("type", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".type\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg3 = (cocos2d::GFXFormatType)tmp; } while(false);
        bool arg4;
        json->getProperty("has_alpha", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".has_alpha\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg4);
        bool arg5;
        json->getProperty("has_depth", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".has_depth\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg5);
        bool arg6;
        json->getProperty("has_stencil", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".has_stencil\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg6);
        bool arg7;
        json->getProperty("is_compressed", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".is_compressed\" is undefined!");
            return false;
        }
        ok &= seval_to_boolean(field, &arg7);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXFormatInfo* cobj = new (std::nothrow) cocos2d::GFXFormatInfo();
        cobj->name = arg0;
        cobj->size = arg1;
        cobj->count = arg2;
        cobj->type = arg3;
        cobj->has_alpha = arg4;
        cobj->has_depth = arg5;
        cobj->has_stencil = arg6;
        cobj->is_compressed = arg7;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 8)
    {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        cocos2d::GFXFormatType arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::GFXFormatType)tmp; } while(false);
        bool arg4;
        ok &= seval_to_boolean(args[4], &arg4);
        bool arg5;
        ok &= seval_to_boolean(args[5], &arg5);
        bool arg6;
        ok &= seval_to_boolean(args[6], &arg6);
        bool arg7;
        ok &= seval_to_boolean(args[7], &arg7);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXFormatInfo* cobj = new (std::nothrow) cocos2d::GFXFormatInfo();
        cobj->name = arg0;
        cobj->size = arg1;
        cobj->count = arg2;
        cobj->type = arg3;
        cobj->has_alpha = arg4;
        cobj->has_depth = arg5;
        cobj->has_stencil = arg6;
        cobj->is_compressed = arg7;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXFormatInfo_constructor, __jsb_cocos2d_GFXFormatInfo_class, js_cocos2d_GFXFormatInfo_finalize)




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
    cls->defineProperty("has_alpha", _SE(js_gfx_GFXFormatInfo_get_has_alpha), _SE(js_gfx_GFXFormatInfo_set_has_alpha));
    cls->defineProperty("has_depth", _SE(js_gfx_GFXFormatInfo_get_has_depth), _SE(js_gfx_GFXFormatInfo_set_has_depth));
    cls->defineProperty("has_stencil", _SE(js_gfx_GFXFormatInfo_get_has_stencil), _SE(js_gfx_GFXFormatInfo_set_has_stencil));
    cls->defineProperty("is_compressed", _SE(js_gfx_GFXFormatInfo_get_is_compressed), _SE(js_gfx_GFXFormatInfo_set_is_compressed));
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

static bool js_gfx_GFXMemoryStatus_get_buffer_size(se::State& s)
{
    cocos2d::GFXMemoryStatus* cobj = (cocos2d::GFXMemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXMemoryStatus_get_buffer_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->buffer_size, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXMemoryStatus_get_buffer_size)

static bool js_gfx_GFXMemoryStatus_set_buffer_size(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXMemoryStatus* cobj = (cocos2d::GFXMemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXMemoryStatus_set_buffer_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXMemoryStatus_set_buffer_size : Error processing new value");
    cobj->buffer_size = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXMemoryStatus_set_buffer_size)

static bool js_gfx_GFXMemoryStatus_get_texture_size(se::State& s)
{
    cocos2d::GFXMemoryStatus* cobj = (cocos2d::GFXMemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXMemoryStatus_get_texture_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->texture_size, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXMemoryStatus_get_texture_size)

static bool js_gfx_GFXMemoryStatus_set_texture_size(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXMemoryStatus* cobj = (cocos2d::GFXMemoryStatus*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXMemoryStatus_set_texture_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXMemoryStatus_set_texture_size : Error processing new value");
    cobj->texture_size = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXMemoryStatus_set_texture_size)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXMemoryStatus_finalize)

static bool js_gfx_GFXMemoryStatus_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXMemoryStatus* cobj = new (std::nothrow) cocos2d::GFXMemoryStatus();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        unsigned int arg0 = 0;
        json->getProperty("buffer_size", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".buffer_size\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        json->getProperty("texture_size", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".texture_size\" is undefined!");
            return false;
        }
        ok &= seval_to_uint32(field, (uint32_t*)&arg1);

        if(!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        cocos2d::GFXMemoryStatus* cobj = new (std::nothrow) cocos2d::GFXMemoryStatus();
        cobj->buffer_size = arg0;
        cobj->texture_size = arg1;
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 2)
    {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);

        if(!ok) {
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        cocos2d::GFXMemoryStatus* cobj = new (std::nothrow) cocos2d::GFXMemoryStatus();
        cobj->buffer_size = arg0;
        cobj->texture_size = arg1;

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXMemoryStatus_constructor, __jsb_cocos2d_GFXMemoryStatus_class, js_cocos2d_GFXMemoryStatus_finalize)




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

    cls->defineProperty("buffer_size", _SE(js_gfx_GFXMemoryStatus_get_buffer_size), _SE(js_gfx_GFXMemoryStatus_set_buffer_size));
    cls->defineProperty("texture_size", _SE(js_gfx_GFXMemoryStatus_get_texture_size), _SE(js_gfx_GFXMemoryStatus_set_texture_size));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXMemoryStatus_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXMemoryStatus>(cls);

    __jsb_cocos2d_GFXMemoryStatus_proto = cls->getProto();
    __jsb_cocos2d_GFXMemoryStatus_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXContext_proto = nullptr;
se::Class* __jsb_cocos2d_GFXContext_class = nullptr;

static bool js_gfx_GFXContext_sharedContext(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_sharedContext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXContext* result = cobj->sharedContext();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_sharedContext : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_sharedContext)

static bool js_gfx_GFXContext_colorFormat(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_colorFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->colorFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_colorFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_colorFormat)

static bool js_gfx_GFXContext_detphStencilFormat(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_detphStencilFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->detphStencilFormat();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_detphStencilFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_detphStencilFormat)

static bool js_gfx_GFXContext_device(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_device)

static bool js_gfx_GFXContext_initialize(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXContextInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_initialize)

static bool js_gfx_GFXContext_destroy(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_destroy)

static bool js_gfx_GFXContext_vsyncMode(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_vsyncMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->vsyncMode();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_vsyncMode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_vsyncMode)

static bool js_gfx_GFXContext_present(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_present)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXContext_finalize)

static bool js_gfx_GFXContext_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_constructor : Error processing arguments");
    cocos2d::GFXContext* cobj = JSB_ALLOC(cocos2d::GFXContext, arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXContext_constructor, __jsb_cocos2d_GFXContext_class, js_cocos2d_GFXContext_finalize)




static bool js_cocos2d_GFXContext_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXContext)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXContext_finalize)

bool js_register_gfx_GFXContext(se::Object* obj)
{
    auto cls = se::Class::create("GFXContext", obj, nullptr, _SE(js_gfx_GFXContext_constructor));

    cls->defineFunction("sharedContext", _SE(js_gfx_GFXContext_sharedContext));
    cls->defineFunction("colorFormat", _SE(js_gfx_GFXContext_colorFormat));
    cls->defineFunction("detphStencilFormat", _SE(js_gfx_GFXContext_detphStencilFormat));
    cls->defineFunction("device", _SE(js_gfx_GFXContext_device));
    cls->defineFunction("initialize", _SE(js_gfx_GFXContext_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXContext_destroy));
    cls->defineFunction("vsyncMode", _SE(js_gfx_GFXContext_vsyncMode));
    cls->defineFunction("present", _SE(js_gfx_GFXContext_present));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXContext_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXContext>(cls);

    __jsb_cocos2d_GFXContext_proto = cls->getProto();
    __jsb_cocos2d_GFXContext_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXWindow_proto = nullptr;
se::Class* __jsb_cocos2d_GFXWindow_class = nullptr;

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
SE_BIND_FUNC(js_gfx_GFXWindow_depthStencilTexView)

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
SE_BIND_FUNC(js_gfx_GFXWindow_renderPass)

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
SE_BIND_FUNC(js_gfx_GFXWindow_isOffscreen)

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
SE_BIND_FUNC(js_gfx_GFXWindow_height)

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
SE_BIND_FUNC(js_gfx_GFXWindow_colorTexView)

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
SE_BIND_FUNC(js_gfx_GFXWindow_framebuffer)

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
SE_BIND_FUNC(js_gfx_GFXWindow_colorFormat)

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
SE_BIND_FUNC(js_gfx_GFXWindow_width)

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

    cls->defineFunction("depthStencilTexView", _SE(js_gfx_GFXWindow_depthStencilTexView));
    cls->defineFunction("renderPass", _SE(js_gfx_GFXWindow_renderPass));
    cls->defineFunction("isOffscreen", _SE(js_gfx_GFXWindow_isOffscreen));
    cls->defineFunction("detphStencilFormat", _SE(js_gfx_GFXWindow_detphStencilFormat));
    cls->defineFunction("height", _SE(js_gfx_GFXWindow_height));
    cls->defineFunction("colorTexView", _SE(js_gfx_GFXWindow_colorTexView));
    cls->defineFunction("initialize", _SE(js_gfx_GFXWindow_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXWindow_destroy));
    cls->defineFunction("framebuffer", _SE(js_gfx_GFXWindow_framebuffer));
    cls->defineFunction("colorFormat", _SE(js_gfx_GFXWindow_colorFormat));
    cls->defineFunction("width", _SE(js_gfx_GFXWindow_width));
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
SE_BIND_FUNC(js_gfx_GFXBuffer_count)

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
SE_BIND_FUNC(js_gfx_GFXBuffer_memUsage)

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
SE_BIND_FUNC(js_gfx_GFXBuffer_usage)

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
SE_BIND_FUNC(js_gfx_GFXBuffer_bufferView)

static bool js_gfx_GFXBuffer_update(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        void* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    if (argc == 2) {
        void* arg0 = nullptr;
        unsigned int arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        void* arg0 = nullptr;
        unsigned int arg1 = 0;
        unsigned int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_update)

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
SE_BIND_FUNC(js_gfx_GFXBuffer_flags)

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
SE_BIND_FUNC(js_gfx_GFXBuffer_stride)

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
SE_BIND_FUNC(js_gfx_GFXBuffer_size)

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

    cls->defineFunction("count", _SE(js_gfx_GFXBuffer_count));
    cls->defineFunction("memUsage", _SE(js_gfx_GFXBuffer_memUsage));
    cls->defineFunction("usage", _SE(js_gfx_GFXBuffer_usage));
    cls->defineFunction("bufferView", _SE(js_gfx_GFXBuffer_bufferView));
    cls->defineFunction("update", _SE(js_gfx_GFXBuffer_update));
    cls->defineFunction("flags", _SE(js_gfx_GFXBuffer_flags));
    cls->defineFunction("initialize", _SE(js_gfx_GFXBuffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXBuffer_destroy));
    cls->defineFunction("stride", _SE(js_gfx_GFXBuffer_stride));
    cls->defineFunction("resize", _SE(js_gfx_GFXBuffer_resize));
    cls->defineFunction("size", _SE(js_gfx_GFXBuffer_size));
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
SE_BIND_FUNC(js_gfx_GFXTexture_arrayLayer)

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
SE_BIND_FUNC(js_gfx_GFXTexture_format)

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
SE_BIND_FUNC(js_gfx_GFXTexture_buffer)

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
SE_BIND_FUNC(js_gfx_GFXTexture_mipLevel)

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
SE_BIND_FUNC(js_gfx_GFXTexture_height)

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
SE_BIND_FUNC(js_gfx_GFXTexture_usage)

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
SE_BIND_FUNC(js_gfx_GFXTexture_depth)

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
SE_BIND_FUNC(js_gfx_GFXTexture_flags)

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
SE_BIND_FUNC(js_gfx_GFXTexture_samples)

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
SE_BIND_FUNC(js_gfx_GFXTexture_type)

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
SE_BIND_FUNC(js_gfx_GFXTexture_width)

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
SE_BIND_FUNC(js_gfx_GFXTexture_size)

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

    cls->defineFunction("arrayLayer", _SE(js_gfx_GFXTexture_arrayLayer));
    cls->defineFunction("format", _SE(js_gfx_GFXTexture_format));
    cls->defineFunction("buffer", _SE(js_gfx_GFXTexture_buffer));
    cls->defineFunction("mipLevel", _SE(js_gfx_GFXTexture_mipLevel));
    cls->defineFunction("height", _SE(js_gfx_GFXTexture_height));
    cls->defineFunction("usage", _SE(js_gfx_GFXTexture_usage));
    cls->defineFunction("depth", _SE(js_gfx_GFXTexture_depth));
    cls->defineFunction("flags", _SE(js_gfx_GFXTexture_flags));
    cls->defineFunction("samples", _SE(js_gfx_GFXTexture_samples));
    cls->defineFunction("initialize", _SE(js_gfx_GFXTexture_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXTexture_destroy));
    cls->defineFunction("type", _SE(js_gfx_GFXTexture_type));
    cls->defineFunction("width", _SE(js_gfx_GFXTexture_width));
    cls->defineFunction("resize", _SE(js_gfx_GFXTexture_resize));
    cls->defineFunction("size", _SE(js_gfx_GFXTexture_size));
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
SE_BIND_FUNC(js_gfx_GFXTextureView_baseLevel)

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
SE_BIND_FUNC(js_gfx_GFXTextureView_format)

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
SE_BIND_FUNC(js_gfx_GFXTextureView_levelCount)

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
SE_BIND_FUNC(js_gfx_GFXTextureView_texture)

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
SE_BIND_FUNC(js_gfx_GFXTextureView_layerCount)

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
SE_BIND_FUNC(js_gfx_GFXTextureView_baseLayer)

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
SE_BIND_FUNC(js_gfx_GFXTextureView_type)

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

    cls->defineFunction("baseLevel", _SE(js_gfx_GFXTextureView_baseLevel));
    cls->defineFunction("format", _SE(js_gfx_GFXTextureView_format));
    cls->defineFunction("levelCount", _SE(js_gfx_GFXTextureView_levelCount));
    cls->defineFunction("texture", _SE(js_gfx_GFXTextureView_texture));
    cls->defineFunction("layerCount", _SE(js_gfx_GFXTextureView_layerCount));
    cls->defineFunction("initialize", _SE(js_gfx_GFXTextureView_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXTextureView_destroy));
    cls->defineFunction("baseLayer", _SE(js_gfx_GFXTextureView_baseLayer));
    cls->defineFunction("type", _SE(js_gfx_GFXTextureView_type));
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

static bool js_gfx_GFXSampler_max_lod(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_max_lod : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->max_lod();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_max_lod : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_max_lod)

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

static bool js_gfx_GFXSampler_mip_filter(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_mip_filter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->mip_filter();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_mip_filter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_mip_filter)

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

    cls->defineFunction("max_lod", _SE(js_gfx_GFXSampler_max_lod));
    cls->defineFunction("initialize", _SE(js_gfx_GFXSampler_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXSampler_destroy));
    cls->defineFunction("mip_filter", _SE(js_gfx_GFXSampler_mip_filter));
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

static bool js_gfx_GFXShader_name(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_name : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::String& result = cobj->name();
        s.rval().setString(result.buffer());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_name : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_name)

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
SE_BIND_FUNC(js_gfx_GFXShader_hash)

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

    cls->defineFunction("name", _SE(js_gfx_GFXShader_name));
    cls->defineFunction("initialize", _SE(js_gfx_GFXShader_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXShader_destroy));
    cls->defineFunction("id", _SE(js_gfx_GFXShader_hash));
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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertexBuffers)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_firstInstance)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertexOffset)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_firstVertex)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_instanceCount)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertexCount)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_attributes)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_firstIndex)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_indirectBuffer)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_indexCount)

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
SE_BIND_FUNC(js_gfx_GFXInputAssembler_indexBuffer)

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

    cls->defineFunction("vertexBuffers", _SE(js_gfx_GFXInputAssembler_vertexBuffers));
    cls->defineFunction("firstInstance", _SE(js_gfx_GFXInputAssembler_firstInstance));
    cls->defineFunction("initialize", _SE(js_gfx_GFXInputAssembler_initialize));
    cls->defineFunction("setIndexCount", _SE(js_gfx_GFXInputAssembler_setIndexCount));
    cls->defineFunction("vertexOffset", _SE(js_gfx_GFXInputAssembler_vertexOffset));
    cls->defineFunction("setFirstInstance", _SE(js_gfx_GFXInputAssembler_setFirstInstance));
    cls->defineFunction("destroy", _SE(js_gfx_GFXInputAssembler_destroy));
    cls->defineFunction("setVertexOffset", _SE(js_gfx_GFXInputAssembler_setVertexOffset));
    cls->defineFunction("firstVertex", _SE(js_gfx_GFXInputAssembler_firstVertex));
    cls->defineFunction("instanceCount", _SE(js_gfx_GFXInputAssembler_instanceCount));
    cls->defineFunction("vertexCount", _SE(js_gfx_GFXInputAssembler_vertexCount));
    cls->defineFunction("attributes", _SE(js_gfx_GFXInputAssembler_attributes));
    cls->defineFunction("setFirstVertex", _SE(js_gfx_GFXInputAssembler_setFirstVertex));
    cls->defineFunction("firstIndex", _SE(js_gfx_GFXInputAssembler_firstIndex));
    cls->defineFunction("indirectBuffer", _SE(js_gfx_GFXInputAssembler_indirectBuffer));
    cls->defineFunction("indexCount", _SE(js_gfx_GFXInputAssembler_indexCount));
    cls->defineFunction("setVertexCount", _SE(js_gfx_GFXInputAssembler_setVertexCount));
    cls->defineFunction("indexBuffer", _SE(js_gfx_GFXInputAssembler_indexBuffer));
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

static bool js_gfx_GFXPipelineLayout_layouts(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_layouts : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXBindingLayout *>& result = cobj->layouts();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_layouts : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_layouts)

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

    cls->defineFunction("layouts", _SE(js_gfx_GFXPipelineLayout_layouts));
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
SE_BIND_FUNC(js_gfx_GFXPipelineState_primitive)

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
SE_BIND_FUNC(js_gfx_GFXPipelineState_renderPass)

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
SE_BIND_FUNC(js_gfx_GFXPipelineState_rasterizerState)

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
SE_BIND_FUNC(js_gfx_GFXPipelineState_shader)

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
SE_BIND_FUNC(js_gfx_GFXPipelineState_inputState)

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
SE_BIND_FUNC(js_gfx_GFXPipelineState_blendState)

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
SE_BIND_FUNC(js_gfx_GFXPipelineState_pipelineLayout)

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
SE_BIND_FUNC(js_gfx_GFXPipelineState_depthStencilState)

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

    cls->defineFunction("primitive", _SE(js_gfx_GFXPipelineState_primitive));
    cls->defineFunction("renderPass", _SE(js_gfx_GFXPipelineState_renderPass));
    cls->defineFunction("rasterizerState", _SE(js_gfx_GFXPipelineState_rasterizerState));
    cls->defineFunction("dynamicStates", _SE(js_gfx_GFXPipelineState_dynamicStates));
    cls->defineFunction("shader", _SE(js_gfx_GFXPipelineState_shader));
    cls->defineFunction("inputState", _SE(js_gfx_GFXPipelineState_inputState));
    cls->defineFunction("blendState", _SE(js_gfx_GFXPipelineState_blendState));
    cls->defineFunction("pipelineLayout", _SE(js_gfx_GFXPipelineState_pipelineLayout));
    cls->defineFunction("initialize", _SE(js_gfx_GFXPipelineState_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXPipelineState_destroy));
    cls->defineFunction("depthStencilState", _SE(js_gfx_GFXPipelineState_depthStencilState));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXPipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXPipelineState>(cls);

    __jsb_cocos2d_GFXPipelineState_proto = cls->getProto();
    __jsb_cocos2d_GFXPipelineState_class = cls;

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
    if (argc == 5) {
        cocos2d::GFXBuffer* arg0 = nullptr;
        cocos2d::GFXTexture* arg1 = nullptr;
        cocos2d::GFXTextureLayout arg2;
        cocos2d::GFXBufferTextureCopy* arg3 = nullptr;
        unsigned int arg4 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXTextureLayout)tmp; } while(false);
        ok &= seval_to_native_ptr(args[3], &arg3);
        ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_copyBufferToTexture : Error processing arguments");
        cobj->copyBufferToTexture(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
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
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
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
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
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
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_allocator)

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
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_type)

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
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_numDrawCalls)

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

static bool js_gfx_GFXCommandBuffer_execute(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_execute : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXCommandBuffer** arg0 = nullptr;
        unsigned int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_execute : Error processing arguments");
        cobj->execute(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_execute)

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
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_numTris)

static bool js_gfx_GFXCommandBuffer_beginRenderPass(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_beginRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 7) {
        cocos2d::GFXFramebuffer* arg0 = nullptr;
        cocos2d::GFXRect* arg1 = nullptr;
        cocos2d::GFXClearFlagBit arg2;
        cocos2d::GFXColor* arg3 = nullptr;
        unsigned int arg4 = 0;
        float arg5 = 0;
        int arg6 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_reference(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXClearFlagBit)tmp; } while(false);
        ok &= seval_to_native_ptr(args[3], &arg3);
        ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
        ok &= seval_to_float(args[5], &arg5);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_beginRenderPass : Error processing arguments");
        cobj->beginRenderPass(arg0, *arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
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
    cls->defineFunction("allocator", _SE(js_gfx_GFXCommandBuffer_allocator));
    cls->defineFunction("bindPipelineState", _SE(js_gfx_GFXCommandBuffer_bindPipelineState));
    cls->defineFunction("destroy", _SE(js_gfx_GFXCommandBuffer_destroy));
    cls->defineFunction("type", _SE(js_gfx_GFXCommandBuffer_type));
    cls->defineFunction("setViewport", _SE(js_gfx_GFXCommandBuffer_setViewport));
    cls->defineFunction("setDepthBias", _SE(js_gfx_GFXCommandBuffer_setDepthBias));
    cls->defineFunction("begin", _SE(js_gfx_GFXCommandBuffer_begin));
    cls->defineFunction("numDrawCalls", _SE(js_gfx_GFXCommandBuffer_numDrawCalls));
    cls->defineFunction("bindBindingLayout", _SE(js_gfx_GFXCommandBuffer_bindBindingLayout));
    cls->defineFunction("endRenderPass", _SE(js_gfx_GFXCommandBuffer_endRenderPass));
    cls->defineFunction("initialize", _SE(js_gfx_GFXCommandBuffer_initialize));
    cls->defineFunction("setScissor", _SE(js_gfx_GFXCommandBuffer_setScissor));
    cls->defineFunction("execute", _SE(js_gfx_GFXCommandBuffer_execute));
    cls->defineFunction("numTris", _SE(js_gfx_GFXCommandBuffer_numTris));
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
    if (argc == 2) {
        cocos2d::GFXCommandBuffer** arg0 = nullptr;
        unsigned int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_submit : Error processing arguments");
        cobj->submit(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_submit)

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
SE_BIND_FUNC(js_gfx_GFXQueue_type)

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

    cls->defineFunction("submit", _SE(js_gfx_GFXQueue_submit));
    cls->defineFunction("initialize", _SE(js_gfx_GFXQueue_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXQueue_destroy));
    cls->defineFunction("type", _SE(js_gfx_GFXQueue_type));
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

static bool js_gfx_GLES2Device_use_discard_framebuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_use_discard_framebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->use_discard_framebuffer();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_use_discard_framebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_use_discard_framebuffer)

static bool js_gfx_GLES2Device_use_instanced_arrays(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_use_instanced_arrays : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->use_instanced_arrays();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_use_instanced_arrays : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_use_instanced_arrays)

static bool js_gfx_GLES2Device_createCommandAllocator(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createCommandAllocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandAllocatorInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createCommandAllocator : Error processing arguments");
        cocos2d::GFXCommandAllocator* result = cobj->createCommandAllocator(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createCommandAllocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createCommandAllocator)

static bool js_gfx_GLES2Device_use_vao(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_use_vao : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->use_vao();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_use_vao : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_use_vao)

static bool js_gfx_GLES2Device_use_draw_instanced(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_use_draw_instanced : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->use_draw_instanced();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_use_draw_instanced : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_use_draw_instanced)

static bool js_gfx_GLES2Device_createCommandBuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createCommandBuffer : Error processing arguments");
        cocos2d::GFXCommandBuffer* result = cobj->createCommandBuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createCommandBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createCommandBuffer)

static bool js_gfx_GLES2Device_present(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_present)

static bool js_gfx_GLES2Device_createTexture(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createTexture : Error processing arguments");
        cocos2d::GFXTexture* result = cobj->createTexture(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createTexture)

static bool js_gfx_GLES2Device_destroy(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_destroy)

static bool js_gfx_GLES2Device_createFramebuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXFramebufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createFramebuffer : Error processing arguments");
        cocos2d::GFXFramebuffer* result = cobj->createFramebuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createFramebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createFramebuffer)

static bool js_gfx_GLES2Device_createRenderPass(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRenderPassInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createRenderPass : Error processing arguments");
        cocos2d::GFXRenderPass* result = cobj->createRenderPass(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createRenderPass)

static bool js_gfx_GLES2Device_createWindow(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXWindowInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createWindow : Error processing arguments");
        cocos2d::GFXWindow* result = cobj->createWindow(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createWindow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createWindow)

static bool js_gfx_GLES2Device_createShader(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXShaderInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createShader : Error processing arguments");
        cocos2d::GFXShader* result = cobj->createShader(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createShader)

static bool js_gfx_GLES2Device_createInputAssembler(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssemblerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createInputAssembler : Error processing arguments");
        cocos2d::GFXInputAssembler* result = cobj->createInputAssembler(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createInputAssembler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createInputAssembler)

static bool js_gfx_GLES2Device_createSampler(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXSamplerInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createSampler : Error processing arguments");
        cocos2d::GFXSampler* result = cobj->createSampler(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createSampler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createSampler)

static bool js_gfx_GLES2Device_createBuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBufferInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createBuffer : Error processing arguments");
        cocos2d::GFXBuffer* result = cobj->createBuffer(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createBuffer)

static bool js_gfx_GLES2Device_initialize(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXDeviceInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_initialize)

static bool js_gfx_GLES2Device_resize(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_resize : Error processing arguments");
        cobj->resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_resize)

static bool js_gfx_GLES2Device_createQueue(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXQueueInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createQueue : Error processing arguments");
        cocos2d::GFXQueue* result = cobj->createQueue(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createQueue)

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

static bool js_gfx_GLES2Device_createBindingLayout(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayoutInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createBindingLayout : Error processing arguments");
        cocos2d::GFXBindingLayout* result = cobj->createBindingLayout(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createBindingLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createBindingLayout)

static bool js_gfx_GLES2Device_createTextureView(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureViewInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createTextureView : Error processing arguments");
        cocos2d::GFXTextureView* result = cobj->createTextureView(*arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createTextureView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createTextureView)

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

    cls->defineFunction("use_discard_framebuffer", _SE(js_gfx_GLES2Device_use_discard_framebuffer));
    cls->defineFunction("use_instanced_arrays", _SE(js_gfx_GLES2Device_use_instanced_arrays));
    cls->defineFunction("createCommandAllocator", _SE(js_gfx_GLES2Device_createCommandAllocator));
    cls->defineFunction("use_vao", _SE(js_gfx_GLES2Device_use_vao));
    cls->defineFunction("use_draw_instanced", _SE(js_gfx_GLES2Device_use_draw_instanced));
    cls->defineFunction("createCommandBuffer", _SE(js_gfx_GLES2Device_createCommandBuffer));
    cls->defineFunction("present", _SE(js_gfx_GLES2Device_present));
    cls->defineFunction("createTexture", _SE(js_gfx_GLES2Device_createTexture));
    cls->defineFunction("destroy", _SE(js_gfx_GLES2Device_destroy));
    cls->defineFunction("createFramebuffer", _SE(js_gfx_GLES2Device_createFramebuffer));
    cls->defineFunction("createRenderPass", _SE(js_gfx_GLES2Device_createRenderPass));
    cls->defineFunction("createWindow", _SE(js_gfx_GLES2Device_createWindow));
    cls->defineFunction("createShader", _SE(js_gfx_GLES2Device_createShader));
    cls->defineFunction("createInputAssembler", _SE(js_gfx_GLES2Device_createInputAssembler));
    cls->defineFunction("createSampler", _SE(js_gfx_GLES2Device_createSampler));
    cls->defineFunction("createBuffer", _SE(js_gfx_GLES2Device_createBuffer));
    cls->defineFunction("initialize", _SE(js_gfx_GLES2Device_initialize));
    cls->defineFunction("resize", _SE(js_gfx_GLES2Device_resize));
    cls->defineFunction("createQueue", _SE(js_gfx_GLES2Device_createQueue));
    cls->defineFunction("checkExtension", _SE(js_gfx_GLES2Device_checkExtension));
    cls->defineFunction("createBindingLayout", _SE(js_gfx_GLES2Device_createBindingLayout));
    cls->defineFunction("createTextureView", _SE(js_gfx_GLES2Device_createTextureView));
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
    js_register_gfx_GFXSubPass(ns);
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
    js_register_gfx_GFXContext(ns);
    js_register_gfx_GFXBlendTarget(ns);
    js_register_gfx_GFXInputAssemblerInfo(ns);
    js_register_gfx_GFXColor(ns);
    js_register_gfx_GFXAttribute(ns);
    return true;
}

#endif //#if (USE_GFX_RENDERER > 0) && (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
