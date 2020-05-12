#include "scripting/js-bindings/auto/jsb_mtl_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/gfx-metal/GFXMTL.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cocos2d_CCMTLDevice_proto = nullptr;
se::Class* __jsb_cocos2d_CCMTLDevice_class = nullptr;

static bool js_mtl_CCMTLDevice_getMTKView(se::State& s)
{
    cocos2d::CCMTLDevice* cobj = (cocos2d::CCMTLDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_mtl_CCMTLDevice_getMTKView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->getMTKView();
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        SE_PRECONDITION2(ok, false, "js_mtl_CCMTLDevice_getMTKView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_mtl_CCMTLDevice_getMTKView)

static bool js_mtl_CCMTLDevice_getMTLDevice(se::State& s)
{
    cocos2d::CCMTLDevice* cobj = (cocos2d::CCMTLDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_mtl_CCMTLDevice_getMTLDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->getMTLDevice();
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        SE_PRECONDITION2(ok, false, "js_mtl_CCMTLDevice_getMTLDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_mtl_CCMTLDevice_getMTLDevice)

static bool js_mtl_CCMTLDevice_getMaximumSamplerUnits(se::State& s)
{
    cocos2d::CCMTLDevice* cobj = (cocos2d::CCMTLDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_mtl_CCMTLDevice_getMaximumSamplerUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaximumSamplerUnits();
        ok &= int32_to_seval((int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_mtl_CCMTLDevice_getMaximumSamplerUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_mtl_CCMTLDevice_getMaximumSamplerUnits)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_CCMTLDevice_finalize)

static bool js_mtl_CCMTLDevice_constructor(se::State& s)
{
    cocos2d::CCMTLDevice* cobj = JSB_ALLOC(cocos2d::CCMTLDevice);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_mtl_CCMTLDevice_constructor, __jsb_cocos2d_CCMTLDevice_class, js_cocos2d_CCMTLDevice_finalize)



extern se::Object* __jsb_cocos2d_GFXDevice_proto;

static bool js_cocos2d_CCMTLDevice_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::CCMTLDevice)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::CCMTLDevice* cobj = (cocos2d::CCMTLDevice*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_CCMTLDevice_finalize)

bool js_register_mtl_CCMTLDevice(se::Object* obj)
{
    auto cls = se::Class::create("CCMTLDevice", obj, __jsb_cocos2d_GFXDevice_proto, _SE(js_mtl_CCMTLDevice_constructor));

    cls->defineFunction("getMTKView", _SE(js_mtl_CCMTLDevice_getMTKView));
    cls->defineFunction("getMTLDevice", _SE(js_mtl_CCMTLDevice_getMTLDevice));
    cls->defineFunction("getMaximumSamplerUnits", _SE(js_mtl_CCMTLDevice_getMaximumSamplerUnits));
    cls->defineFinalizeFunction(_SE(js_cocos2d_CCMTLDevice_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::CCMTLDevice>(cls);

    __jsb_cocos2d_CCMTLDevice_proto = cls->getProto();
    __jsb_cocos2d_CCMTLDevice_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_mtl(se::Object* obj)
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

    js_register_mtl_CCMTLDevice(ns);
    return true;
}

