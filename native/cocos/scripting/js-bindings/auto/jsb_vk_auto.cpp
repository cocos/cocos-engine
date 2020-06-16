#include "scripting/js-bindings/auto/jsb_vk_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/gfx-vulkan/GFXVulkan.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_CCVKDevice_proto = nullptr;
se::Class* __jsb_cc_CCVKDevice_class = nullptr;

static bool js_vk_CCVKDevice_checkExtension(se::State& s)
{
    cc::CCVKDevice* cobj = (cc::CCVKDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_vk_CCVKDevice_checkExtension : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::String arg0;
        arg0 = args[0].toStringForce().c_str();
        SE_PRECONDITION2(ok, false, "js_vk_CCVKDevice_checkExtension : Error processing arguments");
        bool result = cobj->checkExtension(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_vk_CCVKDevice_checkExtension : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_vk_CCVKDevice_checkExtension)

SE_DECLARE_FINALIZE_FUNC(js_cc_CCVKDevice_finalize)

static bool js_vk_CCVKDevice_constructor(se::State& s)
{
    cc::CCVKDevice* cobj = JSB_ALLOC(cc::CCVKDevice);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_vk_CCVKDevice_constructor, __jsb_cc_CCVKDevice_class, js_cc_CCVKDevice_finalize)



extern se::Object* __jsb_cc_GFXDevice_proto;

static bool js_cc_CCVKDevice_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::CCVKDevice)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::CCVKDevice* cobj = (cc::CCVKDevice*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_CCVKDevice_finalize)

bool js_register_vk_CCVKDevice(se::Object* obj)
{
    auto cls = se::Class::create("CCVKDevice", obj, __jsb_cc_GFXDevice_proto, _SE(js_vk_CCVKDevice_constructor));

    cls->defineFunction("checkExtension", _SE(js_vk_CCVKDevice_checkExtension));
    cls->defineFinalizeFunction(_SE(js_cc_CCVKDevice_finalize));
    cls->install();
    JSBClassType::registerClass<cc::CCVKDevice>(cls);

    __jsb_cc_CCVKDevice_proto = cls->getProto();
    __jsb_cc_CCVKDevice_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_vk(se::Object* obj)
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

    js_register_vk_CCVKDevice(ns);
    return true;
}

