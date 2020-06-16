#include "scripting/js-bindings/auto/jsb_gles3_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/gfx-gles3/GFXGLES3.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_gfx_GLES3Device_proto = nullptr;
se::Class* __jsb_cc_gfx_GLES3Device_class = nullptr;

static bool js_gles3_GLES3Device_checkExtension(se::State& s)
{
    cc::gfx::GLES3Device* cobj = (cc::gfx::GLES3Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gles3_GLES3Device_checkExtension : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::String arg0;
        arg0 = args[0].toStringForce().c_str();
        SE_PRECONDITION2(ok, false, "js_gles3_GLES3Device_checkExtension : Error processing arguments");
        bool result = cobj->checkExtension(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gles3_GLES3Device_checkExtension : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gles3_GLES3Device_checkExtension)

static bool js_gles3_GLES3Device_useVAO(se::State& s)
{
    cc::gfx::GLES3Device* cobj = (cc::gfx::GLES3Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gles3_GLES3Device_useVAO : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->useVAO();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gles3_GLES3Device_useVAO : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gles3_GLES3Device_useVAO)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GLES3Device_finalize)

static bool js_gles3_GLES3Device_constructor(se::State& s)
{
    cc::gfx::GLES3Device* cobj = JSB_ALLOC(cc::gfx::GLES3Device);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gles3_GLES3Device_constructor, __jsb_cc_gfx_GLES3Device_class, js_cc_gfx_GLES3Device_finalize)



extern se::Object* __jsb_cc_gfx_GFXDevice_proto;

static bool js_cc_gfx_GLES3Device_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::gfx::GLES3Device)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GLES3Device* cobj = (cc::gfx::GLES3Device*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GLES3Device_finalize)

bool js_register_gles3_GLES3Device(se::Object* obj)
{
    auto cls = se::Class::create("GLES3Device", obj, __jsb_cc_gfx_GFXDevice_proto, _SE(js_gles3_GLES3Device_constructor));

    cls->defineFunction("checkExtension", _SE(js_gles3_GLES3Device_checkExtension));
    cls->defineFunction("useVAO", _SE(js_gles3_GLES3Device_useVAO));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GLES3Device_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GLES3Device>(cls);

    __jsb_cc_gfx_GLES3Device_proto = cls->getProto();
    __jsb_cc_gfx_GLES3Device_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_gles3(se::Object* obj)
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

    js_register_gles3_GLES3Device(ns);
    return true;
}

