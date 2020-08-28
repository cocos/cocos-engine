#include "scripting/js-bindings/auto/jsb_pipeline_auto.h"
#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
#include "scripting/js-bindings/manual/jsb_conversions.h"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/pipeline/forward/ForwardPipeline.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_pipeline_RenderPipeline_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderPipeline_class = nullptr;

static bool js_pipeline_RenderPipeline_activate(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = (cc::pipeline::RenderPipeline*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->activate();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_activate : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_activate)

static bool js_pipeline_RenderPipeline_render(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = (cc::pipeline::RenderPipeline*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<cc::pipeline::RenderView *> arg0;
        ok &= seval_to_std_vector(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_render : Error processing arguments");
        cobj->render(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_render)

static bool js_pipeline_RenderPipeline_initialize(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = (cc::pipeline::RenderPipeline*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::pipeline::RenderPipelineInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_initialize)

static bool js_pipeline_RenderPipeline_destroy(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = (cc::pipeline::RenderPipeline*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_destroy)

static bool js_pipeline_RenderPipeline_getInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::RenderPipeline* result = cc::pipeline::RenderPipeline::getInstance();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_getInstance)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderPipeline_finalize)

static bool js_pipeline_RenderPipeline_constructor(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = JSB_ALLOC(cc::pipeline::RenderPipeline);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_RenderPipeline_constructor, __jsb_cc_pipeline_RenderPipeline_class, js_cc_pipeline_RenderPipeline_finalize)




static bool js_cc_pipeline_RenderPipeline_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderPipeline* cobj = (cc::pipeline::RenderPipeline*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderPipeline_finalize)

bool js_register_pipeline_RenderPipeline(se::Object* obj)
{
    auto cls = se::Class::create("RenderPipeline", obj, nullptr, _SE(js_pipeline_RenderPipeline_constructor));

    cls->defineFunction("activate", _SE(js_pipeline_RenderPipeline_activate));
    cls->defineFunction("render", _SE(js_pipeline_RenderPipeline_render));
    cls->defineFunction("initialize", _SE(js_pipeline_RenderPipeline_initialize));
    cls->defineFunction("destroy", _SE(js_pipeline_RenderPipeline_destroy));
    cls->defineStaticFunction("getInstance", _SE(js_pipeline_RenderPipeline_getInstance));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderPipeline_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderPipeline>(cls);

    __jsb_cc_pipeline_RenderPipeline_proto = cls->getProto();
    __jsb_cc_pipeline_RenderPipeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_ForwardPipeline_proto = nullptr;
se::Class* __jsb_cc_pipeline_ForwardPipeline_class = nullptr;

static bool js_pipeline_ForwardPipeline_init(se::State& s)
{
    cc::pipeline::ForwardPipeline* cobj = (cc::pipeline::ForwardPipeline*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_ForwardPipeline_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->init();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardPipeline_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardPipeline_init)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ForwardPipeline_finalize)

static bool js_pipeline_ForwardPipeline_constructor(se::State& s)
{
    cc::pipeline::ForwardPipeline* cobj = JSB_ALLOC(cc::pipeline::ForwardPipeline);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ForwardPipeline_constructor, __jsb_cc_pipeline_ForwardPipeline_class, js_cc_pipeline_ForwardPipeline_finalize)



extern se::Object* __jsb_cc_pipeline_RenderPipeline_proto;

static bool js_cc_pipeline_ForwardPipeline_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ForwardPipeline* cobj = (cc::pipeline::ForwardPipeline*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ForwardPipeline_finalize)

bool js_register_pipeline_ForwardPipeline(se::Object* obj)
{
    auto cls = se::Class::create("ForwardPipeline", obj, __jsb_cc_pipeline_RenderPipeline_proto, _SE(js_pipeline_ForwardPipeline_constructor));

    cls->defineFunction("init", _SE(js_pipeline_ForwardPipeline_init));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_ForwardPipeline_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::ForwardPipeline>(cls);

    __jsb_cc_pipeline_ForwardPipeline_proto = cls->getProto();
    __jsb_cc_pipeline_ForwardPipeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_pipeline(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("nr", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("nr", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_pipeline_RenderPipeline(ns);
    js_register_pipeline_ForwardPipeline(ns);
    return true;
}

#endif //#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
