#include "cocos/bindings/auto/jsb_vk_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/gfx-vulkan/GFXVulkan.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_gfx_CCVKDevice_proto = nullptr;
se::Class* __jsb_cc_gfx_CCVKDevice_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_CCVKDevice_finalize)

static bool js_vk_CCVKDevice_constructor(se::State& s) // constructor.c
{
    cc::gfx::CCVKDevice* cobj = JSB_ALLOC(cc::gfx::CCVKDevice);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_vk_CCVKDevice_constructor, __jsb_cc_gfx_CCVKDevice_class, js_cc_gfx_CCVKDevice_finalize)



extern se::Object* __jsb_cc_gfx_Device_proto;

static bool js_cc_gfx_CCVKDevice_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::CCVKDevice>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::CCVKDevice* cobj = SE_THIS_OBJECT<cc::gfx::CCVKDevice>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_CCVKDevice_finalize)

bool js_register_vk_CCVKDevice(se::Object* obj)
{
    auto cls = se::Class::create("CCVKDevice", obj, __jsb_cc_gfx_Device_proto, _SE(js_vk_CCVKDevice_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_gfx_CCVKDevice_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::CCVKDevice>(cls);

    __jsb_cc_gfx_CCVKDevice_proto = cls->getProto();
    __jsb_cc_gfx_CCVKDevice_class = cls;

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

