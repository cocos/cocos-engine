#include "cocos/bindings/auto/jsb_mtl_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/gfx-metal/GFXMTL.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_gfx_CCMTLDevice_proto = nullptr;
se::Class* __jsb_cc_gfx_CCMTLDevice_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_CCMTLDevice_finalize)

static bool js_mtl_CCMTLDevice_constructor(se::State& s) // constructor.c
{
    cc::gfx::CCMTLDevice* cobj = JSB_ALLOC(cc::gfx::CCMTLDevice);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_mtl_CCMTLDevice_constructor, __jsb_cc_gfx_CCMTLDevice_class, js_cc_gfx_CCMTLDevice_finalize)



extern se::Object* __jsb_cc_gfx_Device_proto;

static bool js_cc_gfx_CCMTLDevice_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::CCMTLDevice>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::CCMTLDevice* cobj = SE_THIS_OBJECT<cc::gfx::CCMTLDevice>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_CCMTLDevice_finalize)

bool js_register_mtl_CCMTLDevice(se::Object* obj)
{
    auto cls = se::Class::create("CCMTLDevice", obj, __jsb_cc_gfx_Device_proto, _SE(js_mtl_CCMTLDevice_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_gfx_CCMTLDevice_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::CCMTLDevice>(cls);

    __jsb_cc_gfx_CCMTLDevice_proto = cls->getProto();
    __jsb_cc_gfx_CCMTLDevice_class = cls;

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

