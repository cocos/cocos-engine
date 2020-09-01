#include "scripting/js-bindings/auto/jsb_pipeline_auto.h"
#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
#include "scripting/js-bindings/manual/jsb_conversions.h"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/pipeline/forward/ForwardPipeline.h"
#include "renderer/pipeline/forward/ForwardFlow.h"
#include "renderer/pipeline/forward/ForwardStage.h"
#include "renderer/pipeline/shadow/ShadowFlow.h"
#include "renderer/pipeline/shadow/ShadowStage.h"
#include "renderer/pipeline/ui/UIFlow.h"
#include "renderer/pipeline/ui/UIStage.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "renderer/pipeline/RenderFlow.h"
#include "renderer/pipeline/RenderStage.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/RenderView.h"
#include "renderer/pipeline/helper/SharedMemory.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_pipeline_RenderQueueDesc_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderQueueDesc_class = nullptr;

static bool js_pipeline_RenderQueueDesc_get_isTransparent(se::State& s)
{
    cc::pipeline::RenderQueueDesc* cobj = (cc::pipeline::RenderQueueDesc*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_get_isTransparent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->isTransparent, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderQueueDesc_get_isTransparent)

static bool js_pipeline_RenderQueueDesc_set_isTransparent(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderQueueDesc* cobj = (cc::pipeline::RenderQueueDesc*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_set_isTransparent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderQueueDesc_set_isTransparent : Error processing new value");
    cobj->isTransparent = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderQueueDesc_set_isTransparent)

static bool js_pipeline_RenderQueueDesc_get_sortMode(se::State& s)
{
    cc::pipeline::RenderQueueDesc* cobj = (cc::pipeline::RenderQueueDesc*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_get_sortMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->sortMode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderQueueDesc_get_sortMode)

static bool js_pipeline_RenderQueueDesc_set_sortMode(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderQueueDesc* cobj = (cc::pipeline::RenderQueueDesc*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_set_sortMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::pipeline::RenderQueueSortMode arg0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::pipeline::RenderQueueSortMode)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderQueueDesc_set_sortMode : Error processing new value");
    cobj->sortMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderQueueDesc_set_sortMode)

static bool js_pipeline_RenderQueueDesc_get_stages(se::State& s)
{
    cc::pipeline::RenderQueueDesc* cobj = (cc::pipeline::RenderQueueDesc*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= std_vector_string_to_seval(cobj->stages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderQueueDesc_get_stages)

static bool js_pipeline_RenderQueueDesc_set_stages(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderQueueDesc* cobj = (cc::pipeline::RenderQueueDesc*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<std::string> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderQueueDesc_set_stages : Error processing new value");
    cobj->stages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderQueueDesc_set_stages)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderQueueDesc_finalize)

static bool js_pipeline_RenderQueueDesc_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::pipeline::RenderQueueDesc* cobj = JSB_ALLOC(cc::pipeline::RenderQueueDesc);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::pipeline::RenderQueueDesc* cobj = JSB_ALLOC(cc::pipeline::RenderQueueDesc);
        bool arg0;
        json->getProperty("isTransparent", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_boolean(field, &arg0);
            cobj->isTransparent = arg0;
        }
        cc::pipeline::RenderQueueSortMode arg1;
        json->getProperty("sortMode", &field);
        if(!field.isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg1 = (cc::pipeline::RenderQueueSortMode)tmp; } while(false);
            cobj->sortMode = arg1;
        }
        std::vector<std::string> arg2;
        json->getProperty("stages", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg2);
            cobj->stages = arg2;
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
    else if(argc == 3)
    {
        cc::pipeline::RenderQueueDesc* cobj = JSB_ALLOC(cc::pipeline::RenderQueueDesc);
        bool arg0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->isTransparent = arg0;
        }
        cc::pipeline::RenderQueueSortMode arg1;
        if (!args[1].isUndefined()) {
            do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cc::pipeline::RenderQueueSortMode)tmp; } while(false);
            cobj->sortMode = arg1;
        }
        std::vector<std::string> arg2;
        if (!args[2].isUndefined()) {
            ok &= seval_to_std_vector(args[2], &arg2);
            cobj->stages = arg2;
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
SE_BIND_CTOR(js_pipeline_RenderQueueDesc_constructor, __jsb_cc_pipeline_RenderQueueDesc_class, js_cc_pipeline_RenderQueueDesc_finalize)




static bool js_cc_pipeline_RenderQueueDesc_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderQueueDesc* cobj = (cc::pipeline::RenderQueueDesc*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderQueueDesc_finalize)

bool js_register_pipeline_RenderQueueDesc(se::Object* obj)
{
    auto cls = se::Class::create("RenderQueueDesc", obj, nullptr, _SE(js_pipeline_RenderQueueDesc_constructor));

    cls->defineProperty("isTransparent", _SE(js_pipeline_RenderQueueDesc_get_isTransparent), _SE(js_pipeline_RenderQueueDesc_set_isTransparent));
    cls->defineProperty("sortMode", _SE(js_pipeline_RenderQueueDesc_get_sortMode), _SE(js_pipeline_RenderQueueDesc_set_sortMode));
    cls->defineProperty("stages", _SE(js_pipeline_RenderQueueDesc_get_stages), _SE(js_pipeline_RenderQueueDesc_set_stages));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderQueueDesc_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderQueueDesc>(cls);

    __jsb_cc_pipeline_RenderQueueDesc_proto = cls->getProto();
    __jsb_cc_pipeline_RenderQueueDesc_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_RenderPipelineInfo_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderPipelineInfo_class = nullptr;

static bool js_pipeline_RenderPipelineInfo_get_tag(se::State& s)
{
    cc::pipeline::RenderPipelineInfo* cobj = (cc::pipeline::RenderPipelineInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_get_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->tag, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipelineInfo_get_tag)

static bool js_pipeline_RenderPipelineInfo_set_tag(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderPipelineInfo* cobj = (cc::pipeline::RenderPipelineInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_set_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipelineInfo_set_tag : Error processing new value");
    cobj->tag = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderPipelineInfo_set_tag)

static bool js_pipeline_RenderPipelineInfo_get_flows(se::State& s)
{
    cc::pipeline::RenderPipelineInfo* cobj = (cc::pipeline::RenderPipelineInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_get_flows : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->flows, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipelineInfo_get_flows)

static bool js_pipeline_RenderPipelineInfo_set_flows(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderPipelineInfo* cobj = (cc::pipeline::RenderPipelineInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_set_flows : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::pipeline::RenderFlow *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipelineInfo_set_flows : Error processing new value");
    cobj->flows = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderPipelineInfo_set_flows)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderPipelineInfo_finalize)

static bool js_pipeline_RenderPipelineInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::pipeline::RenderPipelineInfo* cobj = JSB_ALLOC(cc::pipeline::RenderPipelineInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::pipeline::RenderPipelineInfo* cobj = JSB_ALLOC(cc::pipeline::RenderPipelineInfo);
        unsigned int arg0 = 0;
        json->getProperty("tag", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->tag = arg0;
        }
        std::vector<cc::pipeline::RenderFlow *> arg1;
        json->getProperty("flows", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg1);
            cobj->flows = arg1;
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
    else if(argc == 2)
    {
        cc::pipeline::RenderPipelineInfo* cobj = JSB_ALLOC(cc::pipeline::RenderPipelineInfo);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->tag = arg0;
        }
        std::vector<cc::pipeline::RenderFlow *> arg1;
        if (!args[1].isUndefined()) {
            ok &= seval_to_std_vector(args[1], &arg1);
            cobj->flows = arg1;
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
SE_BIND_CTOR(js_pipeline_RenderPipelineInfo_constructor, __jsb_cc_pipeline_RenderPipelineInfo_class, js_cc_pipeline_RenderPipelineInfo_finalize)




static bool js_cc_pipeline_RenderPipelineInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderPipelineInfo* cobj = (cc::pipeline::RenderPipelineInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderPipelineInfo_finalize)

bool js_register_pipeline_RenderPipelineInfo(se::Object* obj)
{
    auto cls = se::Class::create("RenderPipelineInfo", obj, nullptr, _SE(js_pipeline_RenderPipelineInfo_constructor));

    cls->defineProperty("tag", _SE(js_pipeline_RenderPipelineInfo_get_tag), _SE(js_pipeline_RenderPipelineInfo_set_tag));
    cls->defineProperty("flows", _SE(js_pipeline_RenderPipelineInfo_get_flows), _SE(js_pipeline_RenderPipelineInfo_set_flows));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderPipelineInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderPipelineInfo>(cls);

    __jsb_cc_pipeline_RenderPipelineInfo_proto = cls->getProto();
    __jsb_cc_pipeline_RenderPipelineInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

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




bool js_register_pipeline_RenderPipeline(se::Object* obj)
{
    auto cls = se::Class::create("RenderPipeline", obj, nullptr, nullptr);

    cls->defineFunction("activate", _SE(js_pipeline_RenderPipeline_activate));
    cls->defineFunction("render", _SE(js_pipeline_RenderPipeline_render));
    cls->defineFunction("initialize", _SE(js_pipeline_RenderPipeline_initialize));
    cls->defineFunction("destroy", _SE(js_pipeline_RenderPipeline_destroy));
    cls->defineStaticFunction("getInstance", _SE(js_pipeline_RenderPipeline_getInstance));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderPipeline>(cls);

    __jsb_cc_pipeline_RenderPipeline_proto = cls->getProto();
    __jsb_cc_pipeline_RenderPipeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_ForwardPipeline_proto = nullptr;
se::Class* __jsb_cc_pipeline_ForwardPipeline_class = nullptr;

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

    cls->defineFinalizeFunction(_SE(js_cc_pipeline_ForwardPipeline_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::ForwardPipeline>(cls);

    __jsb_cc_pipeline_ForwardPipeline_proto = cls->getProto();
    __jsb_cc_pipeline_ForwardPipeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_RenderFlowInfo_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderFlowInfo_class = nullptr;

static bool js_pipeline_RenderFlowInfo_get_name(se::State& s)
{
    cc::pipeline::RenderFlowInfo* cobj = (cc::pipeline::RenderFlowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_name)

static bool js_pipeline_RenderFlowInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderFlowInfo* cobj = (cc::pipeline::RenderFlowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_name)

static bool js_pipeline_RenderFlowInfo_get_priority(se::State& s)
{
    cc::pipeline::RenderFlowInfo* cobj = (cc::pipeline::RenderFlowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->priority, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_priority)

static bool js_pipeline_RenderFlowInfo_set_priority(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderFlowInfo* cobj = (cc::pipeline::RenderFlowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_priority : Error processing new value");
    cobj->priority = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_priority)

static bool js_pipeline_RenderFlowInfo_get_tag(se::State& s)
{
    cc::pipeline::RenderFlowInfo* cobj = (cc::pipeline::RenderFlowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->tag, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_tag)

static bool js_pipeline_RenderFlowInfo_set_tag(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderFlowInfo* cobj = (cc::pipeline::RenderFlowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_tag : Error processing new value");
    cobj->tag = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_tag)

static bool js_pipeline_RenderFlowInfo_get_stages(se::State& s)
{
    cc::pipeline::RenderFlowInfo* cobj = (cc::pipeline::RenderFlowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->stages, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_stages)

static bool js_pipeline_RenderFlowInfo_set_stages(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderFlowInfo* cobj = (cc::pipeline::RenderFlowInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::pipeline::RenderStage *> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_stages : Error processing new value");
    cobj->stages = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_stages)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderFlowInfo_finalize)

static bool js_pipeline_RenderFlowInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::pipeline::RenderFlowInfo* cobj = JSB_ALLOC(cc::pipeline::RenderFlowInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::pipeline::RenderFlowInfo* cobj = JSB_ALLOC(cc::pipeline::RenderFlowInfo);
        cc::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("priority", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->priority = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("tag", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->tag = arg2;
        }
        std::vector<cc::pipeline::RenderStage *> arg3;
        json->getProperty("stages", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg3);
            cobj->stages = arg3;
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
    else if(argc == 4)
    {
        cc::pipeline::RenderFlowInfo* cobj = JSB_ALLOC(cc::pipeline::RenderFlowInfo);
        cc::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->priority = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->tag = arg2;
        }
        std::vector<cc::pipeline::RenderStage *> arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_std_vector(args[3], &arg3);
            cobj->stages = arg3;
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
SE_BIND_CTOR(js_pipeline_RenderFlowInfo_constructor, __jsb_cc_pipeline_RenderFlowInfo_class, js_cc_pipeline_RenderFlowInfo_finalize)




static bool js_cc_pipeline_RenderFlowInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderFlowInfo* cobj = (cc::pipeline::RenderFlowInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderFlowInfo_finalize)

bool js_register_pipeline_RenderFlowInfo(se::Object* obj)
{
    auto cls = se::Class::create("RenderFlowInfo", obj, nullptr, _SE(js_pipeline_RenderFlowInfo_constructor));

    cls->defineProperty("name", _SE(js_pipeline_RenderFlowInfo_get_name), _SE(js_pipeline_RenderFlowInfo_set_name));
    cls->defineProperty("priority", _SE(js_pipeline_RenderFlowInfo_get_priority), _SE(js_pipeline_RenderFlowInfo_set_priority));
    cls->defineProperty("tag", _SE(js_pipeline_RenderFlowInfo_get_tag), _SE(js_pipeline_RenderFlowInfo_set_tag));
    cls->defineProperty("stages", _SE(js_pipeline_RenderFlowInfo_get_stages), _SE(js_pipeline_RenderFlowInfo_set_stages));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderFlowInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderFlowInfo>(cls);

    __jsb_cc_pipeline_RenderFlowInfo_proto = cls->getProto();
    __jsb_cc_pipeline_RenderFlowInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_RenderFlow_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderFlow_class = nullptr;

static bool js_pipeline_RenderFlow_activate(se::State& s)
{
    cc::pipeline::RenderFlow* cobj = (cc::pipeline::RenderFlow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::pipeline::RenderPipeline* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_activate : Error processing arguments");
        cobj->activate(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderFlow_activate)

static bool js_pipeline_RenderFlow_initialize(se::State& s)
{
    cc::pipeline::RenderFlow* cobj = (cc::pipeline::RenderFlow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::pipeline::RenderFlowInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderFlow_initialize)

static bool js_pipeline_RenderFlow_getTag(se::State& s)
{
    cc::pipeline::RenderFlow* cobj = (cc::pipeline::RenderFlow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_getTag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getTag();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_getTag : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderFlow_getTag)




bool js_register_pipeline_RenderFlow(se::Object* obj)
{
    auto cls = se::Class::create("RenderFlow", obj, nullptr, nullptr);

    cls->defineFunction("activate", _SE(js_pipeline_RenderFlow_activate));
    cls->defineFunction("initialize", _SE(js_pipeline_RenderFlow_initialize));
    cls->defineFunction("getTag", _SE(js_pipeline_RenderFlow_getTag));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderFlow>(cls);

    __jsb_cc_pipeline_RenderFlow_proto = cls->getProto();
    __jsb_cc_pipeline_RenderFlow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_ForwardFlow_proto = nullptr;
se::Class* __jsb_cc_pipeline_ForwardFlow_class = nullptr;

static bool js_pipeline_ForwardFlow_getInitializeInfo(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderFlowInfo& result = cc::pipeline::ForwardFlow::getInitializeInfo();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardFlow_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardFlow_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ForwardFlow_finalize)

static bool js_pipeline_ForwardFlow_constructor(se::State& s)
{
    cc::pipeline::ForwardFlow* cobj = JSB_ALLOC(cc::pipeline::ForwardFlow);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ForwardFlow_constructor, __jsb_cc_pipeline_ForwardFlow_class, js_cc_pipeline_ForwardFlow_finalize)



extern se::Object* __jsb_cc_pipeline_RenderFlow_proto;

static bool js_cc_pipeline_ForwardFlow_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ForwardFlow* cobj = (cc::pipeline::ForwardFlow*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ForwardFlow_finalize)

bool js_register_pipeline_ForwardFlow(se::Object* obj)
{
    auto cls = se::Class::create("ForwardFlow", obj, __jsb_cc_pipeline_RenderFlow_proto, _SE(js_pipeline_ForwardFlow_constructor));

    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_ForwardFlow_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_ForwardFlow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::ForwardFlow>(cls);

    __jsb_cc_pipeline_ForwardFlow_proto = cls->getProto();
    __jsb_cc_pipeline_ForwardFlow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_RenderStageInfo_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderStageInfo_class = nullptr;

static bool js_pipeline_RenderStageInfo_get_name(se::State& s)
{
    cc::pipeline::RenderStageInfo* cobj = (cc::pipeline::RenderStageInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    jsret.setString(cobj->name);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_name)

static bool js_pipeline_RenderStageInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderStageInfo* cobj = (cc::pipeline::RenderStageInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::String arg0;
    arg0 = args[0].toStringForce().c_str();
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_name)

static bool js_pipeline_RenderStageInfo_get_priority(se::State& s)
{
    cc::pipeline::RenderStageInfo* cobj = (cc::pipeline::RenderStageInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->priority, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_priority)

static bool js_pipeline_RenderStageInfo_set_priority(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderStageInfo* cobj = (cc::pipeline::RenderStageInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_priority : Error processing new value");
    cobj->priority = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_priority)

static bool js_pipeline_RenderStageInfo_get_tag(se::State& s)
{
    cc::pipeline::RenderStageInfo* cobj = (cc::pipeline::RenderStageInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->tag, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_tag)

static bool js_pipeline_RenderStageInfo_set_tag(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderStageInfo* cobj = (cc::pipeline::RenderStageInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_tag : Error processing new value");
    cobj->tag = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_tag)

static bool js_pipeline_RenderStageInfo_get_renderQueues(se::State& s)
{
    cc::pipeline::RenderStageInfo* cobj = (cc::pipeline::RenderStageInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_renderQueues : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= native_ptr_to_seval(cobj->renderQueues, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_renderQueues)

static bool js_pipeline_RenderStageInfo_set_renderQueues(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderStageInfo* cobj = (cc::pipeline::RenderStageInfo*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_renderQueues : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cc::pipeline::RenderQueueDesc> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_renderQueues : Error processing new value");
    cobj->renderQueues = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_renderQueues)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderStageInfo_finalize)

static bool js_pipeline_RenderStageInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::pipeline::RenderStageInfo* cobj = JSB_ALLOC(cc::pipeline::RenderStageInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::pipeline::RenderStageInfo* cobj = JSB_ALLOC(cc::pipeline::RenderStageInfo);
        cc::String arg0;
        json->getProperty("name", &field);
        if(!field.isUndefined()) {
            arg0 = field.toStringForce().c_str();
            cobj->name = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("priority", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->priority = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("tag", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->tag = arg2;
        }
        std::vector<cc::pipeline::RenderQueueDesc> arg3;
        json->getProperty("renderQueues", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &arg3);
            cobj->renderQueues = arg3;
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
    else if(argc == 4)
    {
        cc::pipeline::RenderStageInfo* cobj = JSB_ALLOC(cc::pipeline::RenderStageInfo);
        cc::String arg0;
        if (!args[0].isUndefined()) {
            arg0 = args[0].toStringForce().c_str();
            cobj->name = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->priority = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->tag = arg2;
        }
        std::vector<cc::pipeline::RenderQueueDesc> arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_std_vector(args[3], &arg3);
            cobj->renderQueues = arg3;
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
SE_BIND_CTOR(js_pipeline_RenderStageInfo_constructor, __jsb_cc_pipeline_RenderStageInfo_class, js_cc_pipeline_RenderStageInfo_finalize)




static bool js_cc_pipeline_RenderStageInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderStageInfo* cobj = (cc::pipeline::RenderStageInfo*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderStageInfo_finalize)

bool js_register_pipeline_RenderStageInfo(se::Object* obj)
{
    auto cls = se::Class::create("RenderStageInfo", obj, nullptr, _SE(js_pipeline_RenderStageInfo_constructor));

    cls->defineProperty("name", _SE(js_pipeline_RenderStageInfo_get_name), _SE(js_pipeline_RenderStageInfo_set_name));
    cls->defineProperty("priority", _SE(js_pipeline_RenderStageInfo_get_priority), _SE(js_pipeline_RenderStageInfo_set_priority));
    cls->defineProperty("tag", _SE(js_pipeline_RenderStageInfo_get_tag), _SE(js_pipeline_RenderStageInfo_set_tag));
    cls->defineProperty("renderQueues", _SE(js_pipeline_RenderStageInfo_get_renderQueues), _SE(js_pipeline_RenderStageInfo_set_renderQueues));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderStageInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderStageInfo>(cls);

    __jsb_cc_pipeline_RenderStageInfo_proto = cls->getProto();
    __jsb_cc_pipeline_RenderStageInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_RenderStage_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderStage_class = nullptr;

static bool js_pipeline_RenderStage_activate(se::State& s)
{
    cc::pipeline::RenderStage* cobj = (cc::pipeline::RenderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::pipeline::RenderPipeline* arg0 = nullptr;
        cc::pipeline::RenderFlow* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_activate : Error processing arguments");
        cobj->activate(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderStage_activate)

static bool js_pipeline_RenderStage_initialize(se::State& s)
{
    cc::pipeline::RenderStage* cobj = (cc::pipeline::RenderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::pipeline::RenderStageInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderStage_initialize)

static bool js_pipeline_RenderStage_getTag(se::State& s)
{
    cc::pipeline::RenderStage* cobj = (cc::pipeline::RenderStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_getTag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getTag();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_getTag : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderStage_getTag)




bool js_register_pipeline_RenderStage(se::Object* obj)
{
    auto cls = se::Class::create("RenderStage", obj, nullptr, nullptr);

    cls->defineFunction("activate", _SE(js_pipeline_RenderStage_activate));
    cls->defineFunction("initialize", _SE(js_pipeline_RenderStage_initialize));
    cls->defineFunction("getTag", _SE(js_pipeline_RenderStage_getTag));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderStage>(cls);

    __jsb_cc_pipeline_RenderStage_proto = cls->getProto();
    __jsb_cc_pipeline_RenderStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_ForwardStage_proto = nullptr;
se::Class* __jsb_cc_pipeline_ForwardStage_class = nullptr;

static bool js_pipeline_ForwardStage_getInitializeInfo(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderStageInfo& result = cc::pipeline::ForwardStage::getInitializeInfo();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardStage_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ForwardStage_finalize)

static bool js_pipeline_ForwardStage_constructor(se::State& s)
{
    cc::pipeline::ForwardStage* cobj = JSB_ALLOC(cc::pipeline::ForwardStage);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ForwardStage_constructor, __jsb_cc_pipeline_ForwardStage_class, js_cc_pipeline_ForwardStage_finalize)



extern se::Object* __jsb_cc_pipeline_RenderStage_proto;

static bool js_cc_pipeline_ForwardStage_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ForwardStage* cobj = (cc::pipeline::ForwardStage*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ForwardStage_finalize)

bool js_register_pipeline_ForwardStage(se::Object* obj)
{
    auto cls = se::Class::create("ForwardStage", obj, __jsb_cc_pipeline_RenderStage_proto, _SE(js_pipeline_ForwardStage_constructor));

    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_ForwardStage_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_ForwardStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::ForwardStage>(cls);

    __jsb_cc_pipeline_ForwardStage_proto = cls->getProto();
    __jsb_cc_pipeline_ForwardStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_ShadowFlow_proto = nullptr;
se::Class* __jsb_cc_pipeline_ShadowFlow_class = nullptr;

static bool js_pipeline_ShadowFlow_getInitializeInfo(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderFlowInfo& result = cc::pipeline::ShadowFlow::getInitializeInfo();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowFlow_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowFlow_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ShadowFlow_finalize)

static bool js_pipeline_ShadowFlow_constructor(se::State& s)
{
    cc::pipeline::ShadowFlow* cobj = JSB_ALLOC(cc::pipeline::ShadowFlow);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ShadowFlow_constructor, __jsb_cc_pipeline_ShadowFlow_class, js_cc_pipeline_ShadowFlow_finalize)



extern se::Object* __jsb_cc_pipeline_RenderFlow_proto;

static bool js_cc_pipeline_ShadowFlow_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ShadowFlow* cobj = (cc::pipeline::ShadowFlow*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ShadowFlow_finalize)

bool js_register_pipeline_ShadowFlow(se::Object* obj)
{
    auto cls = se::Class::create("ShadowFlow", obj, __jsb_cc_pipeline_RenderFlow_proto, _SE(js_pipeline_ShadowFlow_constructor));

    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_ShadowFlow_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_ShadowFlow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::ShadowFlow>(cls);

    __jsb_cc_pipeline_ShadowFlow_proto = cls->getProto();
    __jsb_cc_pipeline_ShadowFlow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_ShadowStage_proto = nullptr;
se::Class* __jsb_cc_pipeline_ShadowStage_class = nullptr;

static bool js_pipeline_ShadowStage_setFramebuffer(se::State& s)
{
    cc::pipeline::ShadowStage* cobj = (cc::pipeline::ShadowStage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_ShadowStage_setFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::gfx::Framebuffer* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowStage_setFramebuffer : Error processing arguments");
        cobj->setFramebuffer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowStage_setFramebuffer)

static bool js_pipeline_ShadowStage_getInitializeInfo(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderStageInfo& result = cc::pipeline::ShadowStage::getInitializeInfo();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowStage_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ShadowStage_finalize)

static bool js_pipeline_ShadowStage_constructor(se::State& s)
{
    cc::pipeline::ShadowStage* cobj = JSB_ALLOC(cc::pipeline::ShadowStage);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ShadowStage_constructor, __jsb_cc_pipeline_ShadowStage_class, js_cc_pipeline_ShadowStage_finalize)



extern se::Object* __jsb_cc_pipeline_RenderStage_proto;

static bool js_cc_pipeline_ShadowStage_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ShadowStage* cobj = (cc::pipeline::ShadowStage*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ShadowStage_finalize)

bool js_register_pipeline_ShadowStage(se::Object* obj)
{
    auto cls = se::Class::create("ShadowStage", obj, __jsb_cc_pipeline_RenderStage_proto, _SE(js_pipeline_ShadowStage_constructor));

    cls->defineFunction("setFramebuffer", _SE(js_pipeline_ShadowStage_setFramebuffer));
    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_ShadowStage_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_ShadowStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::ShadowStage>(cls);

    __jsb_cc_pipeline_ShadowStage_proto = cls->getProto();
    __jsb_cc_pipeline_ShadowStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_UIFlow_proto = nullptr;
se::Class* __jsb_cc_pipeline_UIFlow_class = nullptr;

static bool js_pipeline_UIFlow_getInitializeInfo(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderFlowInfo& result = cc::pipeline::UIFlow::getInitializeInfo();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_UIFlow_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_UIFlow_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_UIFlow_finalize)

static bool js_pipeline_UIFlow_constructor(se::State& s)
{
    cc::pipeline::UIFlow* cobj = JSB_ALLOC(cc::pipeline::UIFlow);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_UIFlow_constructor, __jsb_cc_pipeline_UIFlow_class, js_cc_pipeline_UIFlow_finalize)



extern se::Object* __jsb_cc_pipeline_RenderFlow_proto;

static bool js_cc_pipeline_UIFlow_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::UIFlow* cobj = (cc::pipeline::UIFlow*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_UIFlow_finalize)

bool js_register_pipeline_UIFlow(se::Object* obj)
{
    auto cls = se::Class::create("UIFlow", obj, __jsb_cc_pipeline_RenderFlow_proto, _SE(js_pipeline_UIFlow_constructor));

    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_UIFlow_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_UIFlow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::UIFlow>(cls);

    __jsb_cc_pipeline_UIFlow_proto = cls->getProto();
    __jsb_cc_pipeline_UIFlow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_UIStage_proto = nullptr;
se::Class* __jsb_cc_pipeline_UIStage_class = nullptr;

static bool js_pipeline_UIStage_getInitializeInfo(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderStageInfo& result = cc::pipeline::UIStage::getInitializeInfo();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_UIStage_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_UIStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_UIStage_finalize)

static bool js_pipeline_UIStage_constructor(se::State& s)
{
    cc::pipeline::UIStage* cobj = JSB_ALLOC(cc::pipeline::UIStage);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_UIStage_constructor, __jsb_cc_pipeline_UIStage_class, js_cc_pipeline_UIStage_finalize)



extern se::Object* __jsb_cc_pipeline_RenderStage_proto;

static bool js_cc_pipeline_UIStage_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::UIStage* cobj = (cc::pipeline::UIStage*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_UIStage_finalize)

bool js_register_pipeline_UIStage(se::Object* obj)
{
    auto cls = se::Class::create("UIStage", obj, __jsb_cc_pipeline_RenderStage_proto, _SE(js_pipeline_UIStage_constructor));

    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_UIStage_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_UIStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::UIStage>(cls);

    __jsb_cc_pipeline_UIStage_proto = cls->getProto();
    __jsb_cc_pipeline_UIStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_RenderView_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderView_class = nullptr;

static bool js_pipeline_RenderView_setExecuteFlows(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setExecuteFlows : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<std::string> arg0;
        ok &= seval_to_std_vector(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setExecuteFlows : Error processing arguments");
        cobj->setExecuteFlows(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_setExecuteFlows)

static bool js_pipeline_RenderView_onGlobalPipelineStateChanged(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_onGlobalPipelineStateChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onGlobalPipelineStateChanged();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_onGlobalPipelineStateChanged)

static bool js_pipeline_RenderView_getName(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getName();
        s.rval().setString(result);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderView_getName)

static bool js_pipeline_RenderView_getPriority(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getPriority();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getPriority : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_getPriority)

static bool js_pipeline_RenderView_getVisibility(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getVisibility : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVisibility();
        ok &= uint32_to_seval((unsigned int)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getVisibility : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_getVisibility)

static bool js_pipeline_RenderView_setPriority(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setPriority : Error processing arguments");
        cobj->setPriority(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_setPriority)

static bool js_pipeline_RenderView_setVisibility(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setVisibility : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setVisibility : Error processing arguments");
        cobj->setVisibility(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_setVisibility)

static bool js_pipeline_RenderView_getWindow(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::RenderWindow* result = cobj->getWindow();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getWindow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderView_getWindow)

static bool js_pipeline_RenderView_initialize(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::pipeline::RenderViewInfo* arg0 = nullptr;
        ok &= seval_to_reference(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_initialize : Error processing arguments");
        bool result = cobj->initialize(*arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_initialize)

static bool js_pipeline_RenderView_destroy(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_destroy)

static bool js_pipeline_RenderView_getFlows(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getFlows : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::pipeline::RenderFlow *>& result = cobj->getFlows();
        ok &= native_ptr_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getFlows : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_getFlows)

static bool js_pipeline_RenderView_setWindow(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setWindow : Error processing arguments");
        cobj->setWindow(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_pipeline_RenderView_setWindow)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderView_finalize)

static bool js_pipeline_RenderView_constructor(se::State& s)
{
    cc::pipeline::RenderView* cobj = JSB_ALLOC(cc::pipeline::RenderView);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_RenderView_constructor, __jsb_cc_pipeline_RenderView_class, js_cc_pipeline_RenderView_finalize)




static bool js_cc_pipeline_RenderView_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderView_finalize)

bool js_register_pipeline_RenderView(se::Object* obj)
{
    auto cls = se::Class::create("RenderView", obj, nullptr, _SE(js_pipeline_RenderView_constructor));

    cls->defineProperty("window", _SE(js_pipeline_RenderView_getWindow), _SE(js_pipeline_RenderView_setWindow));
    cls->defineProperty("name", _SE(js_pipeline_RenderView_getName), nullptr);
    cls->defineFunction("setExecuteFlows", _SE(js_pipeline_RenderView_setExecuteFlows));
    cls->defineFunction("onGlobalPipelineStateChanged", _SE(js_pipeline_RenderView_onGlobalPipelineStateChanged));
    cls->defineFunction("getPriority", _SE(js_pipeline_RenderView_getPriority));
    cls->defineFunction("getVisibility", _SE(js_pipeline_RenderView_getVisibility));
    cls->defineFunction("setPriority", _SE(js_pipeline_RenderView_setPriority));
    cls->defineFunction("setVisibility", _SE(js_pipeline_RenderView_setVisibility));
    cls->defineFunction("initialize", _SE(js_pipeline_RenderView_initialize));
    cls->defineFunction("destroy", _SE(js_pipeline_RenderView_destroy));
    cls->defineFunction("getFlows", _SE(js_pipeline_RenderView_getFlows));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderView_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderView>(cls);

    __jsb_cc_pipeline_RenderView_proto = cls->getProto();
    __jsb_cc_pipeline_RenderView_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_RenderWindow_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderWindow_class = nullptr;

static bool js_pipeline_RenderWindow_get_hasOnScreenAttachments(se::State& s)
{
    cc::pipeline::RenderWindow* cobj = (cc::pipeline::RenderWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_get_hasOnScreenAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->hasOnScreenAttachments, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderWindow_get_hasOnScreenAttachments)

static bool js_pipeline_RenderWindow_set_hasOnScreenAttachments(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderWindow* cobj = (cc::pipeline::RenderWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_set_hasOnScreenAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderWindow_set_hasOnScreenAttachments : Error processing new value");
    cobj->hasOnScreenAttachments = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderWindow_set_hasOnScreenAttachments)

static bool js_pipeline_RenderWindow_get_hasOffScreenAttachments(se::State& s)
{
    cc::pipeline::RenderWindow* cobj = (cc::pipeline::RenderWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_get_hasOffScreenAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->hasOffScreenAttachments, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderWindow_get_hasOffScreenAttachments)

static bool js_pipeline_RenderWindow_set_hasOffScreenAttachments(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderWindow* cobj = (cc::pipeline::RenderWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_set_hasOffScreenAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderWindow_set_hasOffScreenAttachments : Error processing new value");
    cobj->hasOffScreenAttachments = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderWindow_set_hasOffScreenAttachments)

static bool js_pipeline_RenderWindow_get_framebufferID(se::State& s)
{
    cc::pipeline::RenderWindow* cobj = (cc::pipeline::RenderWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_get_framebufferID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval((unsigned int)cobj->framebufferID, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderWindow_get_framebufferID)

static bool js_pipeline_RenderWindow_set_framebufferID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderWindow* cobj = (cc::pipeline::RenderWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_set_framebufferID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    unsigned int arg0 = 0;
    ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderWindow_set_framebufferID : Error processing new value");
    cobj->framebufferID = arg0;
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderWindow_set_framebufferID)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderWindow_finalize)

static bool js_pipeline_RenderWindow_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::pipeline::RenderWindow* cobj = JSB_ALLOC(cc::pipeline::RenderWindow);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::pipeline::RenderWindow* cobj = JSB_ALLOC(cc::pipeline::RenderWindow);
        unsigned int arg0 = 0;
        json->getProperty("hasOnScreenAttachments", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg0);
            cobj->hasOnScreenAttachments = arg0;
        }
        unsigned int arg1 = 0;
        json->getProperty("hasOffScreenAttachments", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg1);
            cobj->hasOffScreenAttachments = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("framebufferID", &field);
        if(!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t*)&arg2);
            cobj->framebufferID = arg2;
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
    else if(argc == 3)
    {
        cc::pipeline::RenderWindow* cobj = JSB_ALLOC(cc::pipeline::RenderWindow);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            cobj->hasOnScreenAttachments = arg0;
        }
        unsigned int arg1 = 0;
        if (!args[1].isUndefined()) {
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            cobj->hasOffScreenAttachments = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
            cobj->framebufferID = arg2;
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
SE_BIND_CTOR(js_pipeline_RenderWindow_constructor, __jsb_cc_pipeline_RenderWindow_class, js_cc_pipeline_RenderWindow_finalize)




static bool js_cc_pipeline_RenderWindow_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderWindow* cobj = (cc::pipeline::RenderWindow*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderWindow_finalize)

bool js_register_pipeline_RenderWindow(se::Object* obj)
{
    auto cls = se::Class::create("RenderWindow", obj, nullptr, _SE(js_pipeline_RenderWindow_constructor));

    cls->defineProperty("hasOnScreenAttachments", _SE(js_pipeline_RenderWindow_get_hasOnScreenAttachments), _SE(js_pipeline_RenderWindow_set_hasOnScreenAttachments));
    cls->defineProperty("hasOffScreenAttachments", _SE(js_pipeline_RenderWindow_get_hasOffScreenAttachments), _SE(js_pipeline_RenderWindow_set_hasOffScreenAttachments));
    cls->defineProperty("framebufferID", _SE(js_pipeline_RenderWindow_get_framebufferID), _SE(js_pipeline_RenderWindow_set_framebufferID));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderWindow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderWindow>(cls);

    __jsb_cc_pipeline_RenderWindow_proto = cls->getProto();
    __jsb_cc_pipeline_RenderWindow_class = cls;

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

    js_register_pipeline_RenderQueueDesc(ns);
    js_register_pipeline_RenderFlow(ns);
    js_register_pipeline_RenderPipeline(ns);
    js_register_pipeline_RenderStageInfo(ns);
    js_register_pipeline_ForwardPipeline(ns);
    js_register_pipeline_RenderView(ns);
    js_register_pipeline_RenderPipelineInfo(ns);
    js_register_pipeline_RenderStage(ns);
    js_register_pipeline_ForwardStage(ns);
    js_register_pipeline_ShadowStage(ns);
    js_register_pipeline_RenderFlowInfo(ns);
    js_register_pipeline_UIStage(ns);
    js_register_pipeline_ForwardFlow(ns);
    js_register_pipeline_RenderWindow(ns);
    js_register_pipeline_UIFlow(ns);
    js_register_pipeline_ShadowFlow(ns);
    return true;
}

#endif //#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
