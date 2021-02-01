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

static bool js_mtl_CCMTLDevice_disposeCurrentDrawable(se::State& s)
{
    cc::gfx::CCMTLDevice* cobj = SE_THIS_OBJECT<cc::gfx::CCMTLDevice>(s);
    SE_PRECONDITION2(cobj, false, "js_mtl_CCMTLDevice_disposeCurrentDrawable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->disposeCurrentDrawable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_mtl_CCMTLDevice_disposeCurrentDrawable)

static bool js_mtl_CCMTLDevice_getCurrentDrawable(se::State& s)
{
    cc::gfx::CCMTLDevice* cobj = SE_THIS_OBJECT<cc::gfx::CCMTLDevice>(s);
    SE_PRECONDITION2(cobj, false, "js_mtl_CCMTLDevice_getCurrentDrawable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->getCurrentDrawable();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_mtl_CCMTLDevice_getCurrentDrawable : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_mtl_CCMTLDevice_getCurrentDrawable)

static bool js_mtl_CCMTLDevice_getDSSTexture(se::State& s)
{
    cc::gfx::CCMTLDevice* cobj = SE_THIS_OBJECT<cc::gfx::CCMTLDevice>(s);
    SE_PRECONDITION2(cobj, false, "js_mtl_CCMTLDevice_getDSSTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->getDSSTexture();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_mtl_CCMTLDevice_getDSSTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_mtl_CCMTLDevice_getDSSTexture)

static bool js_mtl_CCMTLDevice_getMTLLayer(se::State& s)
{
    cc::gfx::CCMTLDevice* cobj = SE_THIS_OBJECT<cc::gfx::CCMTLDevice>(s);
    SE_PRECONDITION2(cobj, false, "js_mtl_CCMTLDevice_getMTLLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->getMTLLayer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_mtl_CCMTLDevice_getMTLLayer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_mtl_CCMTLDevice_getMTLLayer)

static bool js_mtl_CCMTLDevice_presentCompleted(se::State& s)
{
    cc::gfx::CCMTLDevice* cobj = SE_THIS_OBJECT<cc::gfx::CCMTLDevice>(s);
    SE_PRECONDITION2(cobj, false, "js_mtl_CCMTLDevice_presentCompleted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->presentCompleted();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_mtl_CCMTLDevice_presentCompleted)

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

    cls->defineFunction("disposeCurrentDrawable", _SE(js_mtl_CCMTLDevice_disposeCurrentDrawable));
    cls->defineFunction("getCurrentDrawable", _SE(js_mtl_CCMTLDevice_getCurrentDrawable));
    cls->defineFunction("getDSSTexture", _SE(js_mtl_CCMTLDevice_getDSSTexture));
    cls->defineFunction("getMTLLayer", _SE(js_mtl_CCMTLDevice_getMTLLayer));
    cls->defineFunction("presentCompleted", _SE(js_mtl_CCMTLDevice_presentCompleted));
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

