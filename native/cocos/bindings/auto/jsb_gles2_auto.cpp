#include "cocos/bindings/auto/jsb_gles2_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/gfx-gles2/GFXGLES2.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_gfx_GLES2Device_proto = nullptr;
se::Class* __jsb_cc_gfx_GLES2Device_class = nullptr;

static bool js_gles2_GLES2Device_checkExtension(se::State& s)
{
    cc::gfx::GLES2Device* cobj = SE_THIS_OBJECT<cc::gfx::GLES2Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gles2_GLES2Device_checkExtension : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gles2_GLES2Device_checkExtension : Error processing arguments");
        bool result = cobj->checkExtension(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gles2_GLES2Device_checkExtension : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gles2_GLES2Device_checkExtension)

static bool js_gles2_GLES2Device_checkForETC2(se::State& s)
{
    cc::gfx::GLES2Device* cobj = SE_THIS_OBJECT<cc::gfx::GLES2Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gles2_GLES2Device_checkForETC2 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->checkForETC2();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gles2_GLES2Device_checkForETC2 : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gles2_GLES2Device_checkForETC2)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GLES2Device_finalize)

static bool js_gles2_GLES2Device_constructor(se::State& s) // constructor.c
{
    cc::gfx::GLES2Device* cobj = JSB_ALLOC(cc::gfx::GLES2Device);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gles2_GLES2Device_constructor, __jsb_cc_gfx_GLES2Device_class, js_cc_gfx_GLES2Device_finalize)



extern se::Object* __jsb_cc_gfx_Device_proto;

static bool js_cc_gfx_GLES2Device_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::GLES2Device>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GLES2Device* cobj = SE_THIS_OBJECT<cc::gfx::GLES2Device>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GLES2Device_finalize)

bool js_register_gles2_GLES2Device(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Device", obj, __jsb_cc_gfx_Device_proto, _SE(js_gles2_GLES2Device_constructor));

    cls->defineFunction("checkExtension", _SE(js_gles2_GLES2Device_checkExtension));
    cls->defineFunction("checkForETC2", _SE(js_gles2_GLES2Device_checkForETC2));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GLES2Device_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GLES2Device>(cls);

    __jsb_cc_gfx_GLES2Device_proto = cls->getProto();
    __jsb_cc_gfx_GLES2Device_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_gles2(se::Object* obj)
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

    js_register_gles2_GLES2Device(ns);
    return true;
}

