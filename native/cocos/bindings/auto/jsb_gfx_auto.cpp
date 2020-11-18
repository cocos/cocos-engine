#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/core/Core.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
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

static bool js_gfx_DeviceInfo_get_bindingMappingInfo(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_bindingMappingInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->bindingMappingInfo, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_bindingMappingInfo)

static bool js_gfx_DeviceInfo_set_bindingMappingInfo(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = (cc::gfx::DeviceInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_bindingMappingInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BindingMappingInfo arg0;
    ok &= seval_to_gfx_binding_mapping_info(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_bindingMappingInfo : Error processing new value");
    cobj->bindingMappingInfo = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_bindingMappingInfo)

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
        cc::gfx::BindingMappingInfo arg6;
        json->getProperty("bindingMappingInfo", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_gfx_binding_mapping_info(field, &arg6);
            cobj->bindingMappingInfo = arg6;
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
    else
    {
        cc::gfx::DeviceInfo* cobj = JSB_ALLOC(cc::gfx::DeviceInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            uintptr_t arg0 = 0;
            ok &= seval_to_uintptr_t(args[0], &arg0);
            cobj->windowHandle = arg0;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            unsigned int arg1 = 0;
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->width = arg1;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            unsigned int arg2 = 0;
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->height = arg2;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            unsigned int arg3 = 0;
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->nativeWidth = arg3;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            unsigned int arg4 = 0;
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->nativeHeight = arg4;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            cc::gfx::Context* arg5 = nullptr;
            ok &= seval_to_native_ptr(args[5], &arg5);
            cobj->sharedCtx = arg5;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            cc::gfx::BindingMappingInfo arg6;
            ok &= seval_to_gfx_binding_mapping_info(args[6], &arg6);
            cobj->bindingMappingInfo = arg6;
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
    cls->defineProperty("bindingMappingInfo", _SE(js_gfx_DeviceInfo_get_bindingMappingInfo), _SE(js_gfx_DeviceInfo_set_bindingMappingInfo));
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
    else
    {
        cc::gfx::ContextInfo* cobj = JSB_ALLOC(cc::gfx::ContextInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            uintptr_t arg0 = 0;
            ok &= seval_to_uintptr_t(args[0], &arg0);
            cobj->windowHandle = arg0;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            cc::gfx::Context* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            cobj->sharedCtx = arg1;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            cc::gfx::VsyncMode arg2;
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
    else
    {
        cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            cc::gfx::Texture* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->texture = arg0;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            cc::gfx::TextureType arg1;
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::TextureType)tmp; } while(false);
            cobj->type = arg1;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            cc::gfx::Format arg2;
            do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::gfx::Format)tmp; } while(false);
            cobj->format = arg2;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            unsigned int arg3 = 0;
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->baseLevel = arg3;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            unsigned int arg4 = 0;
            ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
            cobj->levelCount = arg4;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            unsigned int arg5 = 0;
            ok &= seval_to_uint32(args[5], (uint32_t*)&arg5);
            cobj->baseLayer = arg5;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            unsigned int arg6 = 0;
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
    else
    {
        cc::gfx::ShaderMacro* cobj = JSB_ALLOC(cc::gfx::ShaderMacro);
        if (argc > 0 && !args[0].isUndefined()) {
            cc::String arg0;
            arg0 = args[0].toStringForce().c_str();
            cobj->macro = arg0;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            cc::String arg1;
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
    else
    {
        cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
        if (argc > 0 && !args[0].isUndefined()) {
            cc::String arg0;
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            cc::gfx::Format arg1;
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::gfx::Format)tmp; } while(false);
            cobj->format = arg1;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            bool arg2;
            ok &= seval_to_boolean(args[2], &arg2);
            cobj->isNormalized = arg2;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            unsigned int arg3 = 0;
            ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
            cobj->stream = arg3;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            bool arg4;
            ok &= seval_to_boolean(args[4], &arg4);
            cobj->isInstanced = arg4;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            unsigned int arg5 = 0;
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
    else
    {
        cc::gfx::InputState* cobj = JSB_ALLOC(cc::gfx::InputState);
        if (argc > 0 && !args[0].isUndefined()) {
            std::vector<cc::gfx::Attribute> arg0;
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

se::Object* __jsb_cc_gfx_PipelineStateInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineStateInfo_class = nullptr;

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

static bool js_gfx_PipelineStateInfo_get_pipelineLayout(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_pipelineLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->pipelineLayout, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_pipelineLayout)

static bool js_gfx_PipelineStateInfo_set_pipelineLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_pipelineLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::PipelineLayout* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_pipelineLayout : Error processing new value");
    cobj->pipelineLayout = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_pipelineLayout)

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

static bool js_gfx_PipelineStateInfo_get_dynamicStates(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = (cc::gfx::PipelineStateInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->dynamicStates, &jsret);
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
    cc::gfx::DynamicStateFlagBit arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::gfx::DynamicStateFlagBit)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_dynamicStates : Error processing new value");
    cobj->dynamicStates = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_dynamicStates)

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
        cc::gfx::Shader* arg0 = nullptr;
        json->getProperty("shader", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg0);
            cobj->shader = arg0;
        }
        cc::gfx::PipelineLayout* arg1 = nullptr;
        json->getProperty("pipelineLayout", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg1);
            cobj->pipelineLayout = arg1;
        }
        cc::gfx::RenderPass* arg2 = nullptr;
        json->getProperty("renderPass", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_native_ptr(field, &arg2);
            cobj->renderPass = arg2;
        }
        cc::gfx::InputState* arg3 = nullptr;
        json->getProperty("inputState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg3);
            cobj->inputState = *arg3;
        }
        cc::gfx::RasterizerState* arg4 = nullptr;
        json->getProperty("rasterizerState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg4);
            cobj->rasterizerState = *arg4;
        }
        cc::gfx::DepthStencilState* arg5 = nullptr;
        json->getProperty("depthStencilState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg5);
            cobj->depthStencilState = *arg5;
        }
        cc::gfx::BlendState* arg6 = nullptr;
        json->getProperty("blendState", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_reference(field, &arg6);
            cobj->blendState = *arg6;
        }
        cc::gfx::PrimitiveMode arg7;
        json->getProperty("primitive", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg7 = (cc::gfx::PrimitiveMode)tmp; } while(false);
            cobj->primitive = arg7;
        }
        cc::gfx::DynamicStateFlagBit arg8;
        json->getProperty("dynamicStates", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg8 = (cc::gfx::DynamicStateFlagBit)tmp; } while(false);
            cobj->dynamicStates = arg8;
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
    else
    {
        cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            cc::gfx::Shader* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            cobj->shader = arg0;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            cc::gfx::PipelineLayout* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            cobj->pipelineLayout = arg1;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            cc::gfx::RenderPass* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            cobj->renderPass = arg2;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            cc::gfx::InputState* arg3 = nullptr;
            ok &= seval_to_reference(args[3], &arg3);
            cobj->inputState = *arg3;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            cc::gfx::RasterizerState* arg4 = nullptr;
            ok &= seval_to_reference(args[4], &arg4);
            cobj->rasterizerState = *arg4;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            cc::gfx::DepthStencilState* arg5 = nullptr;
            ok &= seval_to_reference(args[5], &arg5);
            cobj->depthStencilState = *arg5;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            cc::gfx::BlendState* arg6 = nullptr;
            ok &= seval_to_reference(args[6], &arg6);
            cobj->blendState = *arg6;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            cc::gfx::PrimitiveMode arg7;
            do { int32_t tmp = 0; ok &= seval_to_int32(args[7], &tmp); arg7 = (cc::gfx::PrimitiveMode)tmp; } while(false);
            cobj->primitive = arg7;
        }
        if (argc > 8 && !args[8].isUndefined()) {
            cc::gfx::DynamicStateFlagBit arg8;
            do { int32_t tmp = 0; ok &= seval_to_int32(args[8], &tmp); arg8 = (cc::gfx::DynamicStateFlagBit)tmp; } while(false);
            cobj->dynamicStates = arg8;
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

    cls->defineProperty("shader", _SE(js_gfx_PipelineStateInfo_get_shader), _SE(js_gfx_PipelineStateInfo_set_shader));
    cls->defineProperty("pipelineLayout", _SE(js_gfx_PipelineStateInfo_get_pipelineLayout), _SE(js_gfx_PipelineStateInfo_set_pipelineLayout));
    cls->defineProperty("renderPass", _SE(js_gfx_PipelineStateInfo_get_renderPass), _SE(js_gfx_PipelineStateInfo_set_renderPass));
    cls->defineProperty("inputState", _SE(js_gfx_PipelineStateInfo_get_inputState), _SE(js_gfx_PipelineStateInfo_set_inputState));
    cls->defineProperty("rasterizerState", _SE(js_gfx_PipelineStateInfo_get_rasterizerState), _SE(js_gfx_PipelineStateInfo_set_rasterizerState));
    cls->defineProperty("depthStencilState", _SE(js_gfx_PipelineStateInfo_get_depthStencilState), _SE(js_gfx_PipelineStateInfo_set_depthStencilState));
    cls->defineProperty("blendState", _SE(js_gfx_PipelineStateInfo_get_blendState), _SE(js_gfx_PipelineStateInfo_set_blendState));
    cls->defineProperty("primitive", _SE(js_gfx_PipelineStateInfo_get_primitive), _SE(js_gfx_PipelineStateInfo_set_primitive));
    cls->defineProperty("dynamicStates", _SE(js_gfx_PipelineStateInfo_get_dynamicStates), _SE(js_gfx_PipelineStateInfo_set_dynamicStates));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineStateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineStateInfo>(cls);

    __jsb_cc_gfx_PipelineStateInfo_proto = cls->getProto();
    __jsb_cc_gfx_PipelineStateInfo_class = cls;

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
    else
    {
        cc::gfx::FormatInfo* cobj = JSB_ALLOC(cc::gfx::FormatInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            cc::String arg0;
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            unsigned int arg1 = 0;
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->size = arg1;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            unsigned int arg2 = 0;
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->count = arg2;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            cc::gfx::FormatType arg3;
            do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cc::gfx::FormatType)tmp; } while(false);
            cobj->type = arg3;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            bool arg4;
            ok &= seval_to_boolean(args[4], &arg4);
            cobj->hasAlpha = arg4;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            bool arg5;
            ok &= seval_to_boolean(args[5], &arg5);
            cobj->hasDepth = arg5;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            bool arg6;
            ok &= seval_to_boolean(args[6], &arg6);
            cobj->hasStencil = arg6;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            bool arg7;
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
    else
    {
        cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
        if (argc > 0 && !args[0].isUndefined()) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->bufferSize = arg0;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            unsigned int arg1 = 0;
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
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
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

static bool js_gfx_Device_getScreenSpaceSignY(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getScreenSpaceSignY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScreenSpaceSignY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getScreenSpaceSignY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getScreenSpaceSignY)

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

static bool js_gfx_Device_createDescriptorSetLayout(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createDescriptorSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::DescriptorSetLayoutInfo arg0;
        ok &= seval_to_gfx_descriptor_set_layout_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSetLayout : Error processing arguments");
        cc::gfx::DescriptorSetLayout* result = cobj->createDescriptorSetLayout(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSetLayout : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createDescriptorSetLayout)

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

static bool js_gfx_Device_createCommandBuffer(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::CommandBufferInfo arg0;
        ok &= seval_to_gfx_command_buffer_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createCommandBuffer : Error processing arguments");
        cc::gfx::CommandBuffer* result = cobj->createCommandBuffer(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createCommandBuffer : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createCommandBuffer)

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
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createPipelineState)

static bool js_gfx_Device_createDescriptorSet(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::DescriptorSetInfo arg0;
        ok &= seval_to_gfx_descriptor_set_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSet : Error processing arguments");
        cc::gfx::DescriptorSet* result = cobj->createDescriptorSet(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSet : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createDescriptorSet)

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
        cc::gfx::FramebufferInfo arg0;
        ok &= seval_to_gfx_frame_buffer_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFramebuffer : Error processing arguments");
        cc::gfx::Framebuffer* result = cobj->createFramebuffer(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFramebuffer : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
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
        cc::gfx::RenderPassInfo arg0;
        ok &= seval_to_gfx_render_pass_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createRenderPass : Error processing arguments");
        cc::gfx::RenderPass* result = cobj->createRenderPass(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createRenderPass : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createRenderPass)

static bool js_gfx_Device_createPipelineLayout(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::PipelineLayoutInfo arg0;
        ok &= seval_to_gfx_pipeline_layout_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineLayout : Error processing arguments");
        cc::gfx::PipelineLayout* result = cobj->createPipelineLayout(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineLayout : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createPipelineLayout)

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
        cc::gfx::ShaderInfo arg0;
        ok &= seval_to_gfx_shader_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createShader : Error processing arguments");
        cc::gfx::Shader* result = cobj->createShader(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createShader : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
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
        cc::gfx::InputAssemblerInfo arg0;
        ok &= seval_to_gfx_input_assembler_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createInputAssembler : Error processing arguments");
        cc::gfx::InputAssembler* result = cobj->createInputAssembler(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createInputAssembler : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
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
        cc::gfx::SamplerInfo arg0;
        ok &= seval_to_gfx_sampler_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createSampler : Error processing arguments");
        cc::gfx::Sampler* result = cobj->createSampler(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createSampler : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createSampler)

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

static bool js_gfx_Device_getSurfaceTransform(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getSurfaceTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getSurfaceTransform();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getSurfaceTransform : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getSurfaceTransform)

static bool js_gfx_Device_genShaderId(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_genShaderId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->genShaderId();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_genShaderId : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_genShaderId)

static bool js_gfx_Device_createQueue(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::QueueInfo arg0;
        ok &= seval_to_gfx_queue_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createQueue : Error processing arguments");
        cc::gfx::Queue* result = cobj->createQueue(arg0);
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createQueue : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
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

static bool js_gfx_Device_bindingMappingInfo(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_bindingMappingInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::BindingMappingInfo& result = cobj->bindingMappingInfo();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_bindingMappingInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_bindingMappingInfo)

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

static bool js_gfx_Device_getClipSpaceMinZ(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getClipSpaceMinZ : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getClipSpaceMinZ();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getClipSpaceMinZ : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getClipSpaceMinZ)

static bool js_gfx_Device_getUboOffsetAlignment(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getUboOffsetAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getUboOffsetAlignment();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getUboOffsetAlignment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_getUboOffsetAlignment)

static bool js_gfx_Device_getUVSpaceSignY(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getUVSpaceSignY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getUVSpaceSignY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getUVSpaceSignY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getUVSpaceSignY)

static bool js_gfx_Device_getCommandBuffer(se::State& s)
{
    cc::gfx::Device* cobj = (cc::gfx::Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::CommandBuffer* result = cobj->getCommandBuffer();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getCommandBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getCommandBuffer)

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




bool js_register_gfx_Device(se::Object* obj)
{
    auto cls = se::Class::create("GFXDevice", obj, nullptr, nullptr);

    cls->defineProperty("deviceName", _SE(js_gfx_Device_getDeviceName), nullptr);
    cls->defineProperty("clipSpaceMinZ", _SE(js_gfx_Device_getClipSpaceMinZ), nullptr);
    cls->defineProperty("numInstances", _SE(js_gfx_Device_getNumInstances), nullptr);
    cls->defineProperty("maxTextureUnits", _SE(js_gfx_Device_getMaxTextureUnits), nullptr);
    cls->defineProperty("height", _SE(js_gfx_Device_getHeight), nullptr);
    cls->defineProperty("shaderIdGen", _SE(js_gfx_Device_getShaderIdGen), nullptr);
    cls->defineProperty("renderer", _SE(js_gfx_Device_getRenderer), nullptr);
    cls->defineProperty("maxUniformBufferBindings", _SE(js_gfx_Device_getMaxUniformBufferBindings), nullptr);
    cls->defineProperty("UVSpaceSignY", _SE(js_gfx_Device_getUVSpaceSignY), nullptr);
    cls->defineProperty("commandBuffer", _SE(js_gfx_Device_getCommandBuffer), nullptr);
    cls->defineProperty("vendor", _SE(js_gfx_Device_getVendor), nullptr);
    cls->defineProperty("depthBits", _SE(js_gfx_Device_getDepthBits), nullptr);
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
    cls->defineProperty("surfaceTransform", _SE(js_gfx_Device_getSurfaceTransform), nullptr);
    cls->defineProperty("maxTextureSize", _SE(js_gfx_Device_getMaxTextureSize), nullptr);
    cls->defineProperty("nativeHeight", _SE(js_gfx_Device_getNativeHeight), nullptr);
    cls->defineProperty("depthStencilFormat", _SE(js_gfx_Device_getDepthStencilFormat), nullptr);
    cls->defineProperty("numTris", _SE(js_gfx_Device_getNumTris), nullptr);
    cls->defineProperty("screenSpaceSignY", _SE(js_gfx_Device_getScreenSpaceSignY), nullptr);
    cls->defineProperty("stencilBits", _SE(js_gfx_Device_getStencilBits), nullptr);
    cls->defineProperty("queue", _SE(js_gfx_Device_getQueue), nullptr);
    cls->defineProperty("context", _SE(js_gfx_Device_getContext), nullptr);
    cls->defineProperty("colorFormat", _SE(js_gfx_Device_getColorFormat), nullptr);
    cls->defineFunction("hasFeature", _SE(js_gfx_Device_hasFeature));
    cls->defineFunction("createFence", _SE(js_gfx_Device_createFence));
    cls->defineFunction("createDescriptorSetLayout", _SE(js_gfx_Device_createDescriptorSetLayout));
    cls->defineFunction("createCommandBuffer", _SE(js_gfx_Device_createCommandBuffer));
    cls->defineFunction("createPipelineState", _SE(js_gfx_Device_createPipelineState));
    cls->defineFunction("createDescriptorSet", _SE(js_gfx_Device_createDescriptorSet));
    cls->defineFunction("present", _SE(js_gfx_Device_present));
    cls->defineFunction("destroy", _SE(js_gfx_Device_destroy));
    cls->defineFunction("createFramebuffer", _SE(js_gfx_Device_createFramebuffer));
    cls->defineFunction("createRenderPass", _SE(js_gfx_Device_createRenderPass));
    cls->defineFunction("createPipelineLayout", _SE(js_gfx_Device_createPipelineLayout));
    cls->defineFunction("acquire", _SE(js_gfx_Device_acquire));
    cls->defineFunction("createShader", _SE(js_gfx_Device_createShader));
    cls->defineFunction("createInputAssembler", _SE(js_gfx_Device_createInputAssembler));
    cls->defineFunction("defineMacro", _SE(js_gfx_Device_defineMacro));
    cls->defineFunction("createSampler", _SE(js_gfx_Device_createSampler));
    cls->defineFunction("initialize", _SE(js_gfx_Device_initialize));
    cls->defineFunction("resize", _SE(js_gfx_Device_resize));
    cls->defineFunction("genShaderId", _SE(js_gfx_Device_genShaderId));
    cls->defineFunction("createQueue", _SE(js_gfx_Device_createQueue));
    cls->defineFunction("bindingMappingInfo", _SE(js_gfx_Device_bindingMappingInfo));
    cls->defineFunction("getUboOffsetAlignment", _SE(js_gfx_Device_getUboOffsetAlignment));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Device>(cls);

    __jsb_cc_gfx_Device_proto = cls->getProto();
    __jsb_cc_gfx_Device_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Buffer_proto = nullptr;
se::Class* __jsb_cc_gfx_Buffer_class = nullptr;

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
    cls->defineProperty("flags", _SE(js_gfx_Buffer_getFlags), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_Buffer_getUsage), nullptr);
    cls->defineProperty("size", _SE(js_gfx_Buffer_getSize), nullptr);
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

static bool js_gfx_Texture_getLevelCount(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getLevelCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getLevelCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getLevelCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getLevelCount)

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

static bool js_gfx_Texture_getLayerCount(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getLayerCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getLayerCount();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getLayerCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getLayerCount)

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

static bool js_gfx_Texture_isTextureView(se::State& s)
{
    cc::gfx::Texture* cobj = (cc::gfx::Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_isTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isTextureView();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_isTextureView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_isTextureView)

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

    cls->defineProperty("samples", _SE(js_gfx_Texture_getSamples), nullptr);
    cls->defineProperty("format", _SE(js_gfx_Texture_getFormat), nullptr);
    cls->defineProperty("buffer", _SE(js_gfx_Texture_getBuffer), nullptr);
    cls->defineProperty("levelCount", _SE(js_gfx_Texture_getLevelCount), nullptr);
    cls->defineProperty("height", _SE(js_gfx_Texture_getHeight), nullptr);
    cls->defineProperty("width", _SE(js_gfx_Texture_getWidth), nullptr);
    cls->defineProperty("depth", _SE(js_gfx_Texture_getDepth), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_Texture_getFlags), nullptr);
    cls->defineProperty("layerCount", _SE(js_gfx_Texture_getLayerCount), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_Texture_getUsage), nullptr);
    cls->defineProperty("type", _SE(js_gfx_Texture_getType), nullptr);
    cls->defineProperty("size", _SE(js_gfx_Texture_getSize), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_Texture_destroy));
    cls->defineFunction("resize", _SE(js_gfx_Texture_resize));
    cls->defineFunction("isTextureView", _SE(js_gfx_Texture_isTextureView));
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
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getBorderColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getBorderColor)

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
        cc::gfx::SamplerInfo arg0;
        ok &= seval_to_gfx_sampler_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
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
    cls->defineProperty("maxLOD", _SE(js_gfx_Sampler_getMaxLOD), nullptr);
    cls->defineProperty("magFilter", _SE(js_gfx_Sampler_getMagFilter), nullptr);
    cls->defineProperty("addressU", _SE(js_gfx_Sampler_getAddressU), nullptr);
    cls->defineProperty("addressV", _SE(js_gfx_Sampler_getAddressV), nullptr);
    cls->defineProperty("addressW", _SE(js_gfx_Sampler_getAddressW), nullptr);
    cls->defineProperty("cmpFunc", _SE(js_gfx_Sampler_getCmpFunc), nullptr);
    cls->defineProperty("maxAnisotropy", _SE(js_gfx_Sampler_getMaxAnisotropy), nullptr);
    cls->defineProperty("mipLODBias", _SE(js_gfx_Sampler_getMipLODBias), nullptr);
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

static bool js_gfx_Shader_getID(se::State& s)
{
    cc::gfx::Shader* cobj = (cc::gfx::Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getID();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getID : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getID)

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
        cc::gfx::ShaderInfo arg0;
        ok &= seval_to_gfx_shader_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
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
    cls->defineProperty("shaderID", _SE(js_gfx_Shader_getID), nullptr);
    cls->defineProperty("attributes", _SE(js_gfx_Shader_getAttributes), nullptr);
    cls->defineProperty("stages", _SE(js_gfx_Shader_getStages), nullptr);
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
        cc::gfx::InputAssemblerInfo arg0;
        ok &= seval_to_gfx_input_assembler_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
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
    cls->defineProperty("vertexCount", _SE(js_gfx_InputAssembler_getVertexCount), _SE(js_gfx_InputAssembler_setVertexCount));
    cls->defineProperty("indexBuffer", _SE(js_gfx_InputAssembler_getIndexBuffer), nullptr);
    cls->defineProperty("vertexOffset", _SE(js_gfx_InputAssembler_getVertexOffset), _SE(js_gfx_InputAssembler_setVertexOffset));
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

static bool js_gfx_RenderPass_getSubPasses(se::State& s)
{
    cc::gfx::RenderPass* cobj = (cc::gfx::RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getSubPasses : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::SubPassInfo>& result = cobj->getSubPasses();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getSubPasses : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_getSubPasses)

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
        cc::gfx::RenderPassInfo arg0;
        ok &= seval_to_gfx_render_pass_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
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
SE_BIND_FUNC(js_gfx_RenderPass_getDepthStencilAttachment)

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

    cls->defineProperty("hash", _SE(js_gfx_RenderPass_getHash), nullptr);
    cls->defineFunction("getSubPasses", _SE(js_gfx_RenderPass_getSubPasses));
    cls->defineFunction("initialize", _SE(js_gfx_RenderPass_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_RenderPass_destroy));
    cls->defineFunction("getDepthStencilAttachment", _SE(js_gfx_RenderPass_getDepthStencilAttachment));
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
        cc::gfx::FramebufferInfo arg0;
        ok &= seval_to_gfx_frame_buffer_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
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

    cls->defineProperty("colorTextures", _SE(js_gfx_Framebuffer_getColorTextures), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_Framebuffer_getRenderPass), nullptr);
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

se::Object* __jsb_cc_gfx_DescriptorSetLayout_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSetLayout_class = nullptr;

static bool js_gfx_DescriptorSetLayout_getBindings(se::State& s)
{
    cc::gfx::DescriptorSetLayout* cobj = (cc::gfx::DescriptorSetLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_getBindings : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::DescriptorSetLayoutBinding>& result = cobj->getBindings();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_getBindings : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_getBindings)

static bool js_gfx_DescriptorSetLayout_initialize(se::State& s)
{
    cc::gfx::DescriptorSetLayout* cobj = (cc::gfx::DescriptorSetLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::DescriptorSetLayoutInfo arg0;
        ok &= seval_to_gfx_descriptor_set_layout_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_initialize)

static bool js_gfx_DescriptorSetLayout_destroy(se::State& s)
{
    cc::gfx::DescriptorSetLayout* cobj = (cc::gfx::DescriptorSetLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayout_finalize)

static bool js_gfx_DescriptorSetLayout_constructor(se::State& s)
{
    //#3 cc::gfx::DescriptorSetLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::DescriptorSetLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_DescriptorSetLayout_constructor, __jsb_cc_gfx_DescriptorSetLayout_class, js_cc_gfx_DescriptorSetLayout_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_DescriptorSetLayout_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DescriptorSetLayout* cobj = (cc::gfx::DescriptorSetLayout*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayout_finalize)

bool js_register_gfx_DescriptorSetLayout(se::Object* obj)
{
    auto cls = se::Class::create("DescriptorSetLayout", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_DescriptorSetLayout_constructor));

    cls->defineFunction("getBindings", _SE(js_gfx_DescriptorSetLayout_getBindings));
    cls->defineFunction("initialize", _SE(js_gfx_DescriptorSetLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_DescriptorSetLayout_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSetLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSetLayout>(cls);

    __jsb_cc_gfx_DescriptorSetLayout_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSetLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_PipelineLayout_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineLayout_class = nullptr;

static bool js_gfx_PipelineLayout_initialize(se::State& s)
{
    cc::gfx::PipelineLayout* cobj = (cc::gfx::PipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::PipelineLayoutInfo arg0;
        ok &= seval_to_gfx_pipeline_layout_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayout_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayout_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineLayout_initialize)

static bool js_gfx_PipelineLayout_destroy(se::State& s)
{
    cc::gfx::PipelineLayout* cobj = (cc::gfx::PipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineLayout_destroy)

static bool js_gfx_PipelineLayout_getSetLayouts(se::State& s)
{
    cc::gfx::PipelineLayout* cobj = (cc::gfx::PipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayout_getSetLayouts : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::DescriptorSetLayout *>& result = cobj->getSetLayouts();
        ok &= std_vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayout_getSetLayouts : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineLayout_getSetLayouts)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineLayout_finalize)

static bool js_gfx_PipelineLayout_constructor(se::State& s)
{
    //#3 cc::gfx::PipelineLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::PipelineLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_PipelineLayout_constructor, __jsb_cc_gfx_PipelineLayout_class, js_cc_gfx_PipelineLayout_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_PipelineLayout_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::PipelineLayout* cobj = (cc::gfx::PipelineLayout*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineLayout_finalize)

bool js_register_gfx_PipelineLayout(se::Object* obj)
{
    auto cls = se::Class::create("PipelineLayout", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_PipelineLayout_constructor));

    cls->defineFunction("initialize", _SE(js_gfx_PipelineLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_PipelineLayout_destroy));
    cls->defineFunction("getSetLayouts", _SE(js_gfx_PipelineLayout_getSetLayouts));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineLayout>(cls);

    __jsb_cc_gfx_PipelineLayout_proto = cls->getProto();
    __jsb_cc_gfx_PipelineLayout_class = cls;

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

static bool js_gfx_PipelineState_getPipelineLayout(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::PipelineLayout* result = cobj->getPipelineLayout();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getPipelineLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_getPipelineLayout)

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

static bool js_gfx_PipelineState_getDynamicStates(se::State& s)
{
    cc::gfx::PipelineState* cobj = (cc::gfx::PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getDynamicStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDynamicStates();
        ok &= int32_to_seval((int)result, &s.rval());
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
    cls->defineProperty("inputState", _SE(js_gfx_PipelineState_getInputState), nullptr);
    cls->defineProperty("depthStencilState", _SE(js_gfx_PipelineState_getDepthStencilState), nullptr);
    cls->defineFunction("getPipelineLayout", _SE(js_gfx_PipelineState_getPipelineLayout));
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

se::Object* __jsb_cc_gfx_DescriptorSet_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSet_class = nullptr;

static bool js_gfx_DescriptorSet_bindTextureJSB(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_bindTextureJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        unsigned int arg0 = 0;
        cc::gfx::Texture* arg1 = nullptr;
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindTextureJSB : Error processing arguments");
        bool result = cobj->bindTextureJSB(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindTextureJSB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindTextureJSB)

static bool js_gfx_DescriptorSet_bindBuffer(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_bindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Buffer* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            cobj->bindBuffer(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Buffer* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            unsigned int arg2 = 0;
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);            
            if (!ok) { ok = true; break; }
            cobj->bindBuffer(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindBuffer)

static bool js_gfx_DescriptorSet_bindSamplerJSB(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_bindSamplerJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        unsigned int arg0 = 0;
        cc::gfx::Sampler* arg1 = nullptr;
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindSamplerJSB : Error processing arguments");
        bool result = cobj->bindSamplerJSB(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindSamplerJSB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindSamplerJSB)

static bool js_gfx_DescriptorSet_getTexture(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_getTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Texture* result = cobj->getTexture(arg0);
            ok &= native_ptr_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getTexture : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            unsigned int arg1 = 0;
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);            
            if (!ok) { ok = true; break; }
            cc::gfx::Texture* result = cobj->getTexture(arg0, arg1);
            ok &= native_ptr_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getTexture : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getTexture)

static bool js_gfx_DescriptorSet_bindSampler(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_bindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Sampler* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            cobj->bindSampler(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Sampler* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            unsigned int arg2 = 0;
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);            
            if (!ok) { ok = true; break; }
            cobj->bindSampler(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindSampler)

static bool js_gfx_DescriptorSet_update(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_update)

static bool js_gfx_DescriptorSet_getSampler(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_getSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Sampler* result = cobj->getSampler(arg0);
            ok &= native_ptr_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getSampler : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            unsigned int arg1 = 0;
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);            
            if (!ok) { ok = true; break; }
            cc::gfx::Sampler* result = cobj->getSampler(arg0, arg1);
            ok &= native_ptr_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getSampler : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getSampler)

static bool js_gfx_DescriptorSet_bindTexture(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_bindTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Texture* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            cobj->bindTexture(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Texture* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            unsigned int arg2 = 0;
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);            
            if (!ok) { ok = true; break; }
            cobj->bindTexture(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindTexture)

static bool js_gfx_DescriptorSet_initialize(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::DescriptorSetInfo arg0;
        ok &= seval_to_gfx_descriptor_set_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_initialize)

static bool js_gfx_DescriptorSet_destroy(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_destroy)

static bool js_gfx_DescriptorSet_getBuffer(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_getBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Buffer* result = cobj->getBuffer(arg0);
            ok &= native_ptr_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getBuffer : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            unsigned int arg1 = 0;
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);            
            if (!ok) { ok = true; break; }
            cc::gfx::Buffer* result = cobj->getBuffer(arg0, arg1);
            ok &= native_ptr_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getBuffer : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getBuffer)

static bool js_gfx_DescriptorSet_bindBufferJSB(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_bindBufferJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        unsigned int arg0 = 0;
        cc::gfx::Buffer* arg1 = nullptr;
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindBufferJSB : Error processing arguments");
        bool result = cobj->bindBufferJSB(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindBufferJSB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindBufferJSB)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSet_finalize)

static bool js_gfx_DescriptorSet_constructor(se::State& s)
{
    //#3 cc::gfx::DescriptorSet: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::DescriptorSet constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_DescriptorSet_constructor, __jsb_cc_gfx_DescriptorSet_class, js_cc_gfx_DescriptorSet_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_DescriptorSet_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DescriptorSet* cobj = (cc::gfx::DescriptorSet*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSet_finalize)

bool js_register_gfx_DescriptorSet(se::Object* obj)
{
    auto cls = se::Class::create("DescriptorSet", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_DescriptorSet_constructor));

    cls->defineFunction("bindTextureJSB", _SE(js_gfx_DescriptorSet_bindTextureJSB));
    cls->defineFunction("bindBuffer", _SE(js_gfx_DescriptorSet_bindBuffer));
    cls->defineFunction("bindSamplerJSB", _SE(js_gfx_DescriptorSet_bindSamplerJSB));
    cls->defineFunction("getTexture", _SE(js_gfx_DescriptorSet_getTexture));
    cls->defineFunction("bindSampler", _SE(js_gfx_DescriptorSet_bindSampler));
    cls->defineFunction("update", _SE(js_gfx_DescriptorSet_update));
    cls->defineFunction("getSampler", _SE(js_gfx_DescriptorSet_getSampler));
    cls->defineFunction("bindTexture", _SE(js_gfx_DescriptorSet_bindTexture));
    cls->defineFunction("initialize", _SE(js_gfx_DescriptorSet_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_DescriptorSet_destroy));
    cls->defineFunction("getBuffer", _SE(js_gfx_DescriptorSet_getBuffer));
    cls->defineFunction("bindBufferJSB", _SE(js_gfx_DescriptorSet_bindBufferJSB));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSet_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSet>(cls);

    __jsb_cc_gfx_DescriptorSet_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSet_class = cls;

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
        cc::gfx::Color arg0;
        ok &= seval_to_gfx_color(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setBlendConstants : Error processing arguments");
        cobj->setBlendConstants(arg0);
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
        cc::gfx::Viewport arg0;
        ok &= seval_to_gfx_viewport(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setViewport : Error processing arguments");
        cobj->setViewport(arg0);
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
    CC_UNUSED bool ok = true;
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_begin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            cobj->begin();
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            cc::gfx::RenderPass* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);            
            if (!ok) { ok = true; break; }
            unsigned int arg1 = 0;
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);            
            if (!ok) { ok = true; break; }
            cc::gfx::Framebuffer* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);            
            if (!ok) { ok = true; break; }
            cobj->begin(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cc::gfx::RenderPass* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);            
            if (!ok) { ok = true; break; }
            cobj->begin(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            cc::gfx::RenderPass* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);            
            if (!ok) { ok = true; break; }
            unsigned int arg1 = 0;
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);            
            if (!ok) { ok = true; break; }
            cobj->begin(arg0, arg1);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
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

static bool js_gfx_CommandBuffer_bindDescriptorSet(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_bindDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::DescriptorSet* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            cobj->bindDescriptorSet(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::DescriptorSet* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            unsigned int arg2 = 0;
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);            
            if (!ok) { ok = true; break; }
            const unsigned int* arg3 = 0;
            #pragma warning NO CONVERSION TO NATIVE FOR unsigned int*
            ok = false;            
            if (!ok) { ok = true; break; }
            cobj->bindDescriptorSet(arg0, arg1, arg2, arg3);
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::DescriptorSet* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            std::vector<unsigned int> arg2;
            ok &= seval_to_std_vector(args[2], &arg2);            
            if (!ok) { ok = true; break; }
            cobj->bindDescriptorSet(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindDescriptorSet)

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
        cc::gfx::CommandBufferInfo arg0;
        ok &= seval_to_gfx_command_buffer_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
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
        cc::gfx::Rect arg0;
        ok &= seval_to_gfx_rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setScissor : Error processing arguments");
        cobj->setScissor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setScissor)

static bool js_gfx_CommandBuffer_beginRenderPass(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::CommandBuffer* cobj = (cc::gfx::CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_beginRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 6) {
            cc::gfx::RenderPass* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Framebuffer* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            cc::gfx::Rect arg2;
            ok &= seval_to_gfx_rect(args[2], &arg2);            
            if (!ok) { ok = true; break; }
            cc::gfx::ColorList arg3;
            ok &= seval_to_gfx_color_list(args[3], &arg3);            
            if (!ok) { ok = true; break; }
            float arg4 = 0;
            ok &= seval_to_float(args[4], &arg4);            
            if (!ok) { ok = true; break; }
            int arg5 = 0;
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (int)tmp; } while(false);            
            if (!ok) { ok = true; break; }
            cobj->beginRenderPass(arg0, arg1, arg2, arg3, arg4, arg5);
            return true;
        }
    } while(false);

    do {
        if (argc == 6) {
            cc::gfx::RenderPass* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);            
            if (!ok) { ok = true; break; }
            cc::gfx::Framebuffer* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);            
            if (!ok) { ok = true; break; }
            cc::gfx::Rect arg2;
            ok &= seval_to_gfx_rect(args[2], &arg2);            
            if (!ok) { ok = true; break; }
            const cc::gfx::Color* arg3 = nullptr;
            ok &= seval_to_native_ptr(args[3], &arg3);            
            if (!ok) { ok = true; break; }
            float arg4 = 0;
            ok &= seval_to_float(args[4], &arg4);            
            if (!ok) { ok = true; break; }
            int arg5 = 0;
            do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (int)tmp; } while(false);            
            if (!ok) { ok = true; break; }
            cobj->beginRenderPass(arg0, arg1, arg2, arg3, arg4, arg5);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
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
    cls->defineFunction("getQueue", _SE(js_gfx_CommandBuffer_getQueue));
    cls->defineFunction("setLineWidth", _SE(js_gfx_CommandBuffer_setLineWidth));
    cls->defineFunction("end", _SE(js_gfx_CommandBuffer_end));
    cls->defineFunction("setStencilWriteMask", _SE(js_gfx_CommandBuffer_setStencilWriteMask));
    cls->defineFunction("getNumInstances", _SE(js_gfx_CommandBuffer_getNumInstances));
    cls->defineFunction("setStencilCompareMask", _SE(js_gfx_CommandBuffer_setStencilCompareMask));
    cls->defineFunction("bindInputAssembler", _SE(js_gfx_CommandBuffer_bindInputAssembler));
    cls->defineFunction("bindPipelineState", _SE(js_gfx_CommandBuffer_bindPipelineState));
    cls->defineFunction("destroy", _SE(js_gfx_CommandBuffer_destroy));
    cls->defineFunction("getNumTris", _SE(js_gfx_CommandBuffer_getNumTris));
    cls->defineFunction("setViewport", _SE(js_gfx_CommandBuffer_setViewport));
    cls->defineFunction("setDepthBias", _SE(js_gfx_CommandBuffer_setDepthBias));
    cls->defineFunction("begin", _SE(js_gfx_CommandBuffer_begin));
    cls->defineFunction("getType", _SE(js_gfx_CommandBuffer_getType));
    cls->defineFunction("bindDescriptorSet", _SE(js_gfx_CommandBuffer_bindDescriptorSet));
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
        if (argc == 3) {
            const cc::gfx::CommandBuffer** arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);            
            if (!ok) { ok = true; break; }
            unsigned int arg1 = 0;
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);            
            if (!ok) { ok = true; break; }
            cc::gfx::Fence* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);            
            if (!ok) { ok = true; break; }
            cobj->submit(arg0, arg1, arg2);
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
        cc::gfx::QueueInfo arg0;
        ok &= seval_to_gfx_queue_info(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
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
    js_register_gfx_Texture(ns);
    js_register_gfx_DescriptorSet(ns);
    js_register_gfx_PipelineLayout(ns);
    js_register_gfx_Sampler(ns);
    js_register_gfx_InputAssembler(ns);
    js_register_gfx_RenderPass(ns);
    js_register_gfx_TextureViewInfo(ns);
    js_register_gfx_ShaderMacro(ns);
    js_register_gfx_FormatInfo(ns);
    js_register_gfx_Buffer(ns);
    js_register_gfx_Device(ns);
    js_register_gfx_Framebuffer(ns);
    js_register_gfx_PipelineStateInfo(ns);
    js_register_gfx_Shader(ns);
    js_register_gfx_Queue(ns);
    js_register_gfx_ContextInfo(ns);
    js_register_gfx_PipelineState(ns);
    js_register_gfx_Fence(ns);
    js_register_gfx_Attribute(ns);
    js_register_gfx_MemoryStatus(ns);
    js_register_gfx_DeviceInfo(ns);
    js_register_gfx_InputState(ns);
    js_register_gfx_DescriptorSetLayout(ns);
    return true;
}

