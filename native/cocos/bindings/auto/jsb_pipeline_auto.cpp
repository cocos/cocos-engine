#include "cocos/bindings/auto/jsb_pipeline_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
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
#include "renderer/pipeline/InstancedBuffer.h"
#include "cocos/renderer/core/Core.h"
#include "cocos/renderer/core/gfx/GFXDescriptorSet.h"

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
    cc::pipeline::RenderQueueDesc* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_get_isTransparent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isTransparent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderQueueDesc_get_isTransparent)

static bool js_pipeline_RenderQueueDesc_set_isTransparent(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderQueueDesc* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_set_isTransparent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isTransparent, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderQueueDesc_set_isTransparent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderQueueDesc_set_isTransparent)

static bool js_pipeline_RenderQueueDesc_get_sortMode(se::State& s)
{
    cc::pipeline::RenderQueueDesc* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_get_sortMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->sortMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderQueueDesc_get_sortMode)

static bool js_pipeline_RenderQueueDesc_set_sortMode(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderQueueDesc* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_set_sortMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->sortMode, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderQueueDesc_set_sortMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderQueueDesc_set_sortMode)

static bool js_pipeline_RenderQueueDesc_get_stages(se::State& s)
{
    cc::pipeline::RenderQueueDesc* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stages, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderQueueDesc_get_stages)

static bool js_pipeline_RenderQueueDesc_set_stages(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderQueueDesc* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stages, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderQueueDesc_set_stages : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderQueueDesc_set_stages)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderQueueDesc * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::pipeline::RenderQueueDesc*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("isTransparent", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isTransparent), ctx);
    }
    json->getProperty("sortMode", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sortMode), ctx);
    }
    json->getProperty("stages", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stages), ctx);
    }
    return ok;
}

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
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
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
        cc::pipeline::RenderQueueDesc* cobj = JSB_ALLOC(cc::pipeline::RenderQueueDesc);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->isTransparent), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->sortMode), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->stages), nullptr);;
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderQueueDesc* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
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
    cc::pipeline::RenderPipelineInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_get_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->tag, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipelineInfo_get_tag)

static bool js_pipeline_RenderPipelineInfo_set_tag(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderPipelineInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_set_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->tag, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipelineInfo_set_tag : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderPipelineInfo_set_tag)

static bool js_pipeline_RenderPipelineInfo_get_flows(se::State& s)
{
    cc::pipeline::RenderPipelineInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_get_flows : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->flows, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipelineInfo_get_flows)

static bool js_pipeline_RenderPipelineInfo_set_flows(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderPipelineInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_set_flows : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->flows, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipelineInfo_set_flows : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderPipelineInfo_set_flows)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderPipelineInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::pipeline::RenderPipelineInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("tag", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->tag), ctx);
    }
    json->getProperty("flows", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->flows), ctx);
    }
    return ok;
}

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
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
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
        cc::pipeline::RenderPipelineInfo* cobj = JSB_ALLOC(cc::pipeline::RenderPipelineInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->tag), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->flows), nullptr);;
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderPipelineInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
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
    cc::pipeline::RenderPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->activate();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_activate : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_activate)

static bool js_pipeline_RenderPipeline_render(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::pipeline::RenderView *>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_render : Error processing arguments");
        cobj->render(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_render)

static bool js_pipeline_RenderPipeline_getDescriptorSetLayout(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getDescriptorSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSetLayout* result = cobj->getDescriptorSetLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getDescriptorSetLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipeline_getDescriptorSetLayout)

static bool js_pipeline_RenderPipeline_setValue(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_setValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::String, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_setValue : Error processing arguments");
        cobj->setValue(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_setValue)

static bool js_pipeline_RenderPipeline_getDescriptorSet(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSet* result = cobj->getDescriptorSet();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getDescriptorSet : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipeline_getDescriptorSet)

static bool js_pipeline_RenderPipeline_initialize(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderPipelineInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_initialize)

static bool js_pipeline_RenderPipeline_destroy(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
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
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
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

    cls->defineProperty("descriptorSet", _SE(js_pipeline_RenderPipeline_getDescriptorSet), nullptr);
    cls->defineProperty("descriptorSetLayout", _SE(js_pipeline_RenderPipeline_getDescriptorSetLayout), nullptr);
    cls->defineFunction("activate", _SE(js_pipeline_RenderPipeline_activate));
    cls->defineFunction("render", _SE(js_pipeline_RenderPipeline_render));
    cls->defineFunction("setValue", _SE(js_pipeline_RenderPipeline_setValue));
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

se::Object* __jsb_cc_pipeline_Light_proto = nullptr;
se::Class* __jsb_cc_pipeline_Light_class = nullptr;

static bool js_pipeline_Light_getType(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_Light_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_Light_getType)

static bool js_pipeline_Light_getFrustum(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_getFrustum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::Frustum* result = cobj->getFrustum();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_Light_getFrustum : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_Light_getFrustum)

static bool js_pipeline_Light_getAABB(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::AABB* result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_Light_getAABB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_Light_getAABB)

static bool js_pipeline_Light_getNode(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_getNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::Node* result = cobj->getNode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_Light_getNode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_Light_getNode)

static bool js_pipeline_Light_get_useColorTemperature(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_useColorTemperature : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->useColorTemperature, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_useColorTemperature)

static bool js_pipeline_Light_set_useColorTemperature(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_useColorTemperature : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->useColorTemperature, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_useColorTemperature : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_useColorTemperature)

static bool js_pipeline_Light_get_luminance(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_luminance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->luminance, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_luminance)

static bool js_pipeline_Light_set_luminance(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_luminance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->luminance, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_luminance : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_luminance)

static bool js_pipeline_Light_get_nodeID(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_nodeID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->nodeID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_nodeID)

static bool js_pipeline_Light_set_nodeID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_nodeID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->nodeID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_nodeID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_nodeID)

static bool js_pipeline_Light_get_range(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->range, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_range)

static bool js_pipeline_Light_set_range(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->range, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_range : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_range)

static bool js_pipeline_Light_get_lightType(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_lightType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->lightType, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_lightType)

static bool js_pipeline_Light_set_lightType(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_lightType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->lightType, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_lightType : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_lightType)

static bool js_pipeline_Light_get_aabbID(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_aabbID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->aabbID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_aabbID)

static bool js_pipeline_Light_set_aabbID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_aabbID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->aabbID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_aabbID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_aabbID)

static bool js_pipeline_Light_get_frustumID(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_frustumID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->frustumID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_frustumID)

static bool js_pipeline_Light_set_frustumID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_frustumID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->frustumID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_frustumID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_frustumID)

static bool js_pipeline_Light_get_size(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->size, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_size)

static bool js_pipeline_Light_set_size(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->size, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_size : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_size)

static bool js_pipeline_Light_get_spotAngle(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_spotAngle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->spotAngle, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_spotAngle)

static bool js_pipeline_Light_set_spotAngle(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_spotAngle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->spotAngle, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_spotAngle : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_spotAngle)

static bool js_pipeline_Light_get_aspect(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_aspect : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->aspect, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_aspect)

static bool js_pipeline_Light_set_aspect(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_aspect : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->aspect, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_aspect : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_aspect)

static bool js_pipeline_Light_get_direction(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_direction : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->direction, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_direction)

static bool js_pipeline_Light_set_direction(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_direction : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->direction, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_direction : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_direction)

static bool js_pipeline_Light_get_color(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->color, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_color)

static bool js_pipeline_Light_set_color(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->color, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_color : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_color)

static bool js_pipeline_Light_get_colorTemperatureRGB(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_colorTemperatureRGB : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->colorTemperatureRGB, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_colorTemperatureRGB)

static bool js_pipeline_Light_set_colorTemperatureRGB(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_colorTemperatureRGB : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->colorTemperatureRGB, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_colorTemperatureRGB : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_colorTemperatureRGB)

static bool js_pipeline_Light_get_position(se::State& s)
{
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_get_position : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->position, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_Light_get_position)

static bool js_pipeline_Light_set_position(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_Light_set_position : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->position, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_Light_set_position : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_Light_set_position)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::Light * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::pipeline::Light*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("useColorTemperature", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->useColorTemperature), ctx);
    }
    json->getProperty("luminance", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->luminance), ctx);
    }
    json->getProperty("nodeID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->nodeID), ctx);
    }
    json->getProperty("range", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->range), ctx);
    }
    json->getProperty("lightType", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->lightType), ctx);
    }
    json->getProperty("aabbID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->aabbID), ctx);
    }
    json->getProperty("frustumID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->frustumID), ctx);
    }
    json->getProperty("size", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->size), ctx);
    }
    json->getProperty("spotAngle", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->spotAngle), ctx);
    }
    json->getProperty("aspect", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->aspect), ctx);
    }
    json->getProperty("direction", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->direction), ctx);
    }
    json->getProperty("color", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->color), ctx);
    }
    json->getProperty("colorTemperatureRGB", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->colorTemperatureRGB), ctx);
    }
    json->getProperty("position", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->position), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_Light_finalize)

static bool js_pipeline_Light_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::pipeline::Light* cobj = JSB_ALLOC(cc::pipeline::Light);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::pipeline::Light* cobj = JSB_ALLOC(cc::pipeline::Light);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
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
        cc::pipeline::Light* cobj = JSB_ALLOC(cc::pipeline::Light);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->useColorTemperature), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->luminance), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->nodeID), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->range), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->lightType), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->aabbID), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->frustumID), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->size), nullptr);;
        }
        if (argc > 8 && !args[8].isUndefined()) {
            ok &= sevalue_to_native(args[8], &(cobj->spotAngle), nullptr);;
        }
        if (argc > 9 && !args[9].isUndefined()) {
            ok &= sevalue_to_native(args[9], &(cobj->aspect), nullptr);;
        }
        if (argc > 10 && !args[10].isUndefined()) {
            ok &= sevalue_to_native(args[10], &(cobj->direction), nullptr);;
        }
        if (argc > 11 && !args[11].isUndefined()) {
            ok &= sevalue_to_native(args[11], &(cobj->color), nullptr);;
        }
        if (argc > 12 && !args[12].isUndefined()) {
            ok &= sevalue_to_native(args[12], &(cobj->colorTemperatureRGB), nullptr);;
        }
        if (argc > 13 && !args[13].isUndefined()) {
            ok &= sevalue_to_native(args[13], &(cobj->position), nullptr);;
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
SE_BIND_CTOR(js_pipeline_Light_constructor, __jsb_cc_pipeline_Light_class, js_cc_pipeline_Light_finalize)




static bool js_cc_pipeline_Light_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::Light>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::Light* cobj = SE_THIS_OBJECT<cc::pipeline::Light>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_Light_finalize)

bool js_register_pipeline_Light(se::Object* obj)
{
    auto cls = se::Class::create("Light", obj, nullptr, _SE(js_pipeline_Light_constructor));

    cls->defineProperty("useColorTemperature", _SE(js_pipeline_Light_get_useColorTemperature), _SE(js_pipeline_Light_set_useColorTemperature));
    cls->defineProperty("luminance", _SE(js_pipeline_Light_get_luminance), _SE(js_pipeline_Light_set_luminance));
    cls->defineProperty("nodeID", _SE(js_pipeline_Light_get_nodeID), _SE(js_pipeline_Light_set_nodeID));
    cls->defineProperty("range", _SE(js_pipeline_Light_get_range), _SE(js_pipeline_Light_set_range));
    cls->defineProperty("lightType", _SE(js_pipeline_Light_get_lightType), _SE(js_pipeline_Light_set_lightType));
    cls->defineProperty("aabbID", _SE(js_pipeline_Light_get_aabbID), _SE(js_pipeline_Light_set_aabbID));
    cls->defineProperty("frustumID", _SE(js_pipeline_Light_get_frustumID), _SE(js_pipeline_Light_set_frustumID));
    cls->defineProperty("size", _SE(js_pipeline_Light_get_size), _SE(js_pipeline_Light_set_size));
    cls->defineProperty("spotAngle", _SE(js_pipeline_Light_get_spotAngle), _SE(js_pipeline_Light_set_spotAngle));
    cls->defineProperty("aspect", _SE(js_pipeline_Light_get_aspect), _SE(js_pipeline_Light_set_aspect));
    cls->defineProperty("direction", _SE(js_pipeline_Light_get_direction), _SE(js_pipeline_Light_set_direction));
    cls->defineProperty("color", _SE(js_pipeline_Light_get_color), _SE(js_pipeline_Light_set_color));
    cls->defineProperty("colorTemperatureRGB", _SE(js_pipeline_Light_get_colorTemperatureRGB), _SE(js_pipeline_Light_set_colorTemperatureRGB));
    cls->defineProperty("position", _SE(js_pipeline_Light_get_position), _SE(js_pipeline_Light_set_position));
    cls->defineFunction("getType", _SE(js_pipeline_Light_getType));
    cls->defineFunction("getFrustum", _SE(js_pipeline_Light_getFrustum));
    cls->defineFunction("getAABB", _SE(js_pipeline_Light_getAABB));
    cls->defineFunction("getNode", _SE(js_pipeline_Light_getNode));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_Light_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::Light>(cls);

    __jsb_cc_pipeline_Light_proto = cls->getProto();
    __jsb_cc_pipeline_Light_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_PassView_proto = nullptr;
se::Class* __jsb_cc_pipeline_PassView_class = nullptr;

static bool js_pipeline_PassView_getRasterizerState(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_getRasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::RasterizerState* result = cobj->getRasterizerState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_PassView_getRasterizerState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_PassView_getRasterizerState)

static bool js_pipeline_PassView_getDynamicState(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_getDynamicState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDynamicState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_PassView_getDynamicState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_PassView_getDynamicState)

static bool js_pipeline_PassView_getPrimitive(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_getPrimitive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getPrimitive();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_PassView_getPrimitive : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_PassView_getPrimitive)

static bool js_pipeline_PassView_getDepthStencilState(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_getDepthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DepthStencilState* result = cobj->getDepthStencilState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_PassView_getDepthStencilState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_PassView_getDepthStencilState)

static bool js_pipeline_PassView_getBlendState(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_getBlendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::BlendState* result = cobj->getBlendState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_PassView_getBlendState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_PassView_getBlendState)

static bool js_pipeline_PassView_getPipelineLayout(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_getPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::PipelineLayout* result = cobj->getPipelineLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_PassView_getPipelineLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_PassView_getPipelineLayout)

static bool js_pipeline_PassView_getBatchingScheme(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_getBatchingScheme : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getBatchingScheme();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_PassView_getBatchingScheme : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_PassView_getBatchingScheme)

static bool js_pipeline_PassView_getDescriptorSet(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_getDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSet* result = cobj->getDescriptorSet();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_PassView_getDescriptorSet : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_PassView_getDescriptorSet)

static bool js_pipeline_PassView_get_priority(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->priority, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_priority)

static bool js_pipeline_PassView_set_priority(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->priority, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_priority : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_priority)

static bool js_pipeline_PassView_get_stage(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_stage)

static bool js_pipeline_PassView_set_stage(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stage, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_stage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_stage)

static bool js_pipeline_PassView_get_phase(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_phase : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->phase, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_phase)

static bool js_pipeline_PassView_set_phase(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_phase : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->phase, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_phase : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_phase)

static bool js_pipeline_PassView_get_batchingScheme(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_batchingScheme : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->batchingScheme, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_batchingScheme)

static bool js_pipeline_PassView_set_batchingScheme(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_batchingScheme : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->batchingScheme, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_batchingScheme : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_batchingScheme)

static bool js_pipeline_PassView_get_primitive(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->primitive, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_primitive)

static bool js_pipeline_PassView_set_primitive(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->primitive, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_primitive : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_primitive)

static bool js_pipeline_PassView_get_dynamicState(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_dynamicState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dynamicState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_dynamicState)

static bool js_pipeline_PassView_set_dynamicState(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_dynamicState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dynamicState, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_dynamicState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_dynamicState)

static bool js_pipeline_PassView_get_hash(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_hash : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->hash, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_hash)

static bool js_pipeline_PassView_set_hash(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_hash : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->hash, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_hash : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_hash)

static bool js_pipeline_PassView_get_rasterizerStateID(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_rasterizerStateID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->rasterizerStateID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_rasterizerStateID)

static bool js_pipeline_PassView_set_rasterizerStateID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_rasterizerStateID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->rasterizerStateID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_rasterizerStateID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_rasterizerStateID)

static bool js_pipeline_PassView_get_depthStencilStateID(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_depthStencilStateID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilStateID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_depthStencilStateID)

static bool js_pipeline_PassView_set_depthStencilStateID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_depthStencilStateID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilStateID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_depthStencilStateID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_depthStencilStateID)

static bool js_pipeline_PassView_get_blendStateID(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_blendStateID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendStateID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_blendStateID)

static bool js_pipeline_PassView_set_blendStateID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_blendStateID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendStateID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_blendStateID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_blendStateID)

static bool js_pipeline_PassView_get_descriptorSetID(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_descriptorSetID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->descriptorSetID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_descriptorSetID)

static bool js_pipeline_PassView_set_descriptorSetID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_descriptorSetID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->descriptorSetID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_descriptorSetID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_descriptorSetID)

static bool js_pipeline_PassView_get_pipelineLayoutID(se::State& s)
{
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_get_pipelineLayoutID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->pipelineLayoutID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_PassView_get_pipelineLayoutID)

static bool js_pipeline_PassView_set_pipelineLayoutID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_PassView_set_pipelineLayoutID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->pipelineLayoutID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_PassView_set_pipelineLayoutID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_PassView_set_pipelineLayoutID)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::PassView * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::pipeline::PassView*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("priority", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->priority), ctx);
    }
    json->getProperty("stage", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stage), ctx);
    }
    json->getProperty("phase", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->phase), ctx);
    }
    json->getProperty("batchingScheme", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->batchingScheme), ctx);
    }
    json->getProperty("primitive", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->primitive), ctx);
    }
    json->getProperty("dynamicState", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dynamicState), ctx);
    }
    json->getProperty("hash", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->hash), ctx);
    }
    json->getProperty("rasterizerStateID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->rasterizerStateID), ctx);
    }
    json->getProperty("depthStencilStateID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilStateID), ctx);
    }
    json->getProperty("blendStateID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendStateID), ctx);
    }
    json->getProperty("descriptorSetID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->descriptorSetID), ctx);
    }
    json->getProperty("pipelineLayoutID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->pipelineLayoutID), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_PassView_finalize)

static bool js_pipeline_PassView_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::pipeline::PassView* cobj = JSB_ALLOC(cc::pipeline::PassView);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::pipeline::PassView* cobj = JSB_ALLOC(cc::pipeline::PassView);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
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
        cc::pipeline::PassView* cobj = JSB_ALLOC(cc::pipeline::PassView);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->priority), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->stage), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->phase), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->batchingScheme), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->primitive), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->dynamicState), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->hash), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->rasterizerStateID), nullptr);;
        }
        if (argc > 8 && !args[8].isUndefined()) {
            ok &= sevalue_to_native(args[8], &(cobj->depthStencilStateID), nullptr);;
        }
        if (argc > 9 && !args[9].isUndefined()) {
            ok &= sevalue_to_native(args[9], &(cobj->blendStateID), nullptr);;
        }
        if (argc > 10 && !args[10].isUndefined()) {
            ok &= sevalue_to_native(args[10], &(cobj->descriptorSetID), nullptr);;
        }
        if (argc > 11 && !args[11].isUndefined()) {
            ok &= sevalue_to_native(args[11], &(cobj->pipelineLayoutID), nullptr);;
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
SE_BIND_CTOR(js_pipeline_PassView_constructor, __jsb_cc_pipeline_PassView_class, js_cc_pipeline_PassView_finalize)




static bool js_cc_pipeline_PassView_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::PassView>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::PassView* cobj = SE_THIS_OBJECT<cc::pipeline::PassView>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_PassView_finalize)

bool js_register_pipeline_PassView(se::Object* obj)
{
    auto cls = se::Class::create("PassView", obj, nullptr, _SE(js_pipeline_PassView_constructor));

    cls->defineProperty("priority", _SE(js_pipeline_PassView_get_priority), _SE(js_pipeline_PassView_set_priority));
    cls->defineProperty("stage", _SE(js_pipeline_PassView_get_stage), _SE(js_pipeline_PassView_set_stage));
    cls->defineProperty("phase", _SE(js_pipeline_PassView_get_phase), _SE(js_pipeline_PassView_set_phase));
    cls->defineProperty("batchingScheme", _SE(js_pipeline_PassView_get_batchingScheme), _SE(js_pipeline_PassView_set_batchingScheme));
    cls->defineProperty("primitive", _SE(js_pipeline_PassView_get_primitive), _SE(js_pipeline_PassView_set_primitive));
    cls->defineProperty("dynamicState", _SE(js_pipeline_PassView_get_dynamicState), _SE(js_pipeline_PassView_set_dynamicState));
    cls->defineProperty("hash", _SE(js_pipeline_PassView_get_hash), _SE(js_pipeline_PassView_set_hash));
    cls->defineProperty("rasterizerStateID", _SE(js_pipeline_PassView_get_rasterizerStateID), _SE(js_pipeline_PassView_set_rasterizerStateID));
    cls->defineProperty("depthStencilStateID", _SE(js_pipeline_PassView_get_depthStencilStateID), _SE(js_pipeline_PassView_set_depthStencilStateID));
    cls->defineProperty("blendStateID", _SE(js_pipeline_PassView_get_blendStateID), _SE(js_pipeline_PassView_set_blendStateID));
    cls->defineProperty("descriptorSetID", _SE(js_pipeline_PassView_get_descriptorSetID), _SE(js_pipeline_PassView_set_descriptorSetID));
    cls->defineProperty("pipelineLayoutID", _SE(js_pipeline_PassView_get_pipelineLayoutID), _SE(js_pipeline_PassView_set_pipelineLayoutID));
    cls->defineFunction("getRasterizerState", _SE(js_pipeline_PassView_getRasterizerState));
    cls->defineFunction("getDynamicState", _SE(js_pipeline_PassView_getDynamicState));
    cls->defineFunction("getPrimitive", _SE(js_pipeline_PassView_getPrimitive));
    cls->defineFunction("getDepthStencilState", _SE(js_pipeline_PassView_getDepthStencilState));
    cls->defineFunction("getBlendState", _SE(js_pipeline_PassView_getBlendState));
    cls->defineFunction("getPipelineLayout", _SE(js_pipeline_PassView_getPipelineLayout));
    cls->defineFunction("getBatchingScheme", _SE(js_pipeline_PassView_getBatchingScheme));
    cls->defineFunction("getDescriptorSet", _SE(js_pipeline_PassView_getDescriptorSet));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_PassView_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::PassView>(cls);

    __jsb_cc_pipeline_PassView_proto = cls->getProto();
    __jsb_cc_pipeline_PassView_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_RenderWindow_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderWindow_class = nullptr;

static bool js_pipeline_RenderWindow_getFramebuffer(se::State& s)
{
    cc::pipeline::RenderWindow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_getFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Framebuffer* result = cobj->getFramebuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderWindow_getFramebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderWindow_getFramebuffer)

static bool js_pipeline_RenderWindow_get_hasOnScreenAttachments(se::State& s)
{
    cc::pipeline::RenderWindow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_get_hasOnScreenAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->hasOnScreenAttachments, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderWindow_get_hasOnScreenAttachments)

static bool js_pipeline_RenderWindow_set_hasOnScreenAttachments(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderWindow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_set_hasOnScreenAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->hasOnScreenAttachments, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderWindow_set_hasOnScreenAttachments : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderWindow_set_hasOnScreenAttachments)

static bool js_pipeline_RenderWindow_get_hasOffScreenAttachments(se::State& s)
{
    cc::pipeline::RenderWindow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_get_hasOffScreenAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->hasOffScreenAttachments, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderWindow_get_hasOffScreenAttachments)

static bool js_pipeline_RenderWindow_set_hasOffScreenAttachments(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderWindow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_set_hasOffScreenAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->hasOffScreenAttachments, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderWindow_set_hasOffScreenAttachments : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderWindow_set_hasOffScreenAttachments)

static bool js_pipeline_RenderWindow_get_framebufferID(se::State& s)
{
    cc::pipeline::RenderWindow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_get_framebufferID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->framebufferID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderWindow_get_framebufferID)

static bool js_pipeline_RenderWindow_set_framebufferID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderWindow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderWindow_set_framebufferID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->framebufferID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderWindow_set_framebufferID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderWindow_set_framebufferID)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderWindow * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::pipeline::RenderWindow*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("hasOnScreenAttachments", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->hasOnScreenAttachments), ctx);
    }
    json->getProperty("hasOffScreenAttachments", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->hasOffScreenAttachments), ctx);
    }
    json->getProperty("framebufferID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->framebufferID), ctx);
    }
    return ok;
}

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
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
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
        cc::pipeline::RenderWindow* cobj = JSB_ALLOC(cc::pipeline::RenderWindow);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->hasOnScreenAttachments), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->hasOffScreenAttachments), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->framebufferID), nullptr);;
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderWindow>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderWindow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderWindow>(s);
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
    cls->defineFunction("getFramebuffer", _SE(js_pipeline_RenderWindow_getFramebuffer));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderWindow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderWindow>(cls);

    __jsb_cc_pipeline_RenderWindow_proto = cls->getProto();
    __jsb_cc_pipeline_RenderWindow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_ForwardPipeline_proto = nullptr;
se::Class* __jsb_cc_pipeline_ForwardPipeline_class = nullptr;

static bool js_pipeline_ForwardPipeline_setFog(se::State& s)
{
    cc::pipeline::ForwardPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ForwardPipeline_setFog : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardPipeline_setFog : Error processing arguments");
        cobj->setFog(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardPipeline_setFog)

static bool js_pipeline_ForwardPipeline_getSphere(se::State& s)
{
    cc::pipeline::ForwardPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ForwardPipeline_getSphere : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::Sphere* result = cobj->getSphere();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardPipeline_getSphere : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardPipeline_getSphere)

static bool js_pipeline_ForwardPipeline_setRenderObjects(se::State& s)
{
    cc::pipeline::ForwardPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ForwardPipeline_setRenderObjects : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::pipeline::RenderObject>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardPipeline_setRenderObjects : Error processing arguments");
        cobj->setRenderObjects(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardPipeline_setRenderObjects)

static bool js_pipeline_ForwardPipeline_setShadows(se::State& s)
{
    cc::pipeline::ForwardPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ForwardPipeline_setShadows : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardPipeline_setShadows : Error processing arguments");
        cobj->setShadows(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardPipeline_setShadows)

static bool js_pipeline_ForwardPipeline_setSkybox(se::State& s)
{
    cc::pipeline::ForwardPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ForwardPipeline_setSkybox : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardPipeline_setSkybox : Error processing arguments");
        cobj->setSkybox(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardPipeline_setSkybox)

static bool js_pipeline_ForwardPipeline_setAmbient(se::State& s)
{
    cc::pipeline::ForwardPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ForwardPipeline_setAmbient : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardPipeline_setAmbient : Error processing arguments");
        cobj->setAmbient(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardPipeline_setAmbient)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ForwardPipeline_finalize)

static bool js_pipeline_ForwardPipeline_constructor(se::State& s) // constructor.c
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ForwardPipeline* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ForwardPipeline_finalize)

bool js_register_pipeline_ForwardPipeline(se::Object* obj)
{
    auto cls = se::Class::create("ForwardPipeline", obj, __jsb_cc_pipeline_RenderPipeline_proto, _SE(js_pipeline_ForwardPipeline_constructor));

    cls->defineFunction("setFog", _SE(js_pipeline_ForwardPipeline_setFog));
    cls->defineFunction("getSphere", _SE(js_pipeline_ForwardPipeline_getSphere));
    cls->defineFunction("setRenderObjects", _SE(js_pipeline_ForwardPipeline_setRenderObjects));
    cls->defineFunction("setShadows", _SE(js_pipeline_ForwardPipeline_setShadows));
    cls->defineFunction("setSkybox", _SE(js_pipeline_ForwardPipeline_setSkybox));
    cls->defineFunction("setAmbient", _SE(js_pipeline_ForwardPipeline_setAmbient));
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
    cc::pipeline::RenderFlowInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_name)

static bool js_pipeline_RenderFlowInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderFlowInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_name)

static bool js_pipeline_RenderFlowInfo_get_priority(se::State& s)
{
    cc::pipeline::RenderFlowInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->priority, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_priority)

static bool js_pipeline_RenderFlowInfo_set_priority(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderFlowInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->priority, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_priority : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_priority)

static bool js_pipeline_RenderFlowInfo_get_tag(se::State& s)
{
    cc::pipeline::RenderFlowInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->tag, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_tag)

static bool js_pipeline_RenderFlowInfo_set_tag(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderFlowInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->tag, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_tag : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_tag)

static bool js_pipeline_RenderFlowInfo_get_stages(se::State& s)
{
    cc::pipeline::RenderFlowInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stages, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_stages)

static bool js_pipeline_RenderFlowInfo_set_stages(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderFlowInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stages, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_stages : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_stages)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderFlowInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::pipeline::RenderFlowInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("priority", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->priority), ctx);
    }
    json->getProperty("tag", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->tag), ctx);
    }
    json->getProperty("stages", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stages), ctx);
    }
    return ok;
}

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
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
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
        cc::pipeline::RenderFlowInfo* cobj = JSB_ALLOC(cc::pipeline::RenderFlowInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->priority), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->tag), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->stages), nullptr);;
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderFlowInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
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
    cc::pipeline::RenderFlow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderPipeline*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_activate : Error processing arguments");
        cobj->activate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderFlow_activate)

static bool js_pipeline_RenderFlow_initialize(se::State& s)
{
    cc::pipeline::RenderFlow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderFlowInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderFlow_initialize)

static bool js_pipeline_RenderFlow_getTag(se::State& s)
{
    cc::pipeline::RenderFlow* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_getTag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getTag();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
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
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardFlow_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardFlow_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ForwardFlow_finalize)

static bool js_pipeline_ForwardFlow_constructor(se::State& s) // constructor.c
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ForwardFlow>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ForwardFlow* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardFlow>(s);
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
    cc::pipeline::RenderStageInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_name)

static bool js_pipeline_RenderStageInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderStageInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_name)

static bool js_pipeline_RenderStageInfo_get_priority(se::State& s)
{
    cc::pipeline::RenderStageInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->priority, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_priority)

static bool js_pipeline_RenderStageInfo_set_priority(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderStageInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->priority, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_priority : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_priority)

static bool js_pipeline_RenderStageInfo_get_tag(se::State& s)
{
    cc::pipeline::RenderStageInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->tag, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_tag)

static bool js_pipeline_RenderStageInfo_set_tag(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderStageInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->tag, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_tag : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_tag)

static bool js_pipeline_RenderStageInfo_get_renderQueues(se::State& s)
{
    cc::pipeline::RenderStageInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_renderQueues : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->renderQueues, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_renderQueues)

static bool js_pipeline_RenderStageInfo_set_renderQueues(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderStageInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_renderQueues : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->renderQueues, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_renderQueues : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_renderQueues)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderStageInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::pipeline::RenderStageInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("priority", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->priority), ctx);
    }
    json->getProperty("tag", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->tag), ctx);
    }
    json->getProperty("renderQueues", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->renderQueues), ctx);
    }
    return ok;
}

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
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
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
        cc::pipeline::RenderStageInfo* cobj = JSB_ALLOC(cc::pipeline::RenderStageInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->priority), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->tag), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->renderQueues), nullptr);;
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderStageInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
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
    cc::pipeline::RenderStage* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::pipeline::RenderPipeline*, false> arg0 = {};
        HolderType<cc::pipeline::RenderFlow*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_activate : Error processing arguments");
        cobj->activate(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderStage_activate)

static bool js_pipeline_RenderStage_initialize(se::State& s)
{
    cc::pipeline::RenderStage* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderStageInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderStage_initialize)

static bool js_pipeline_RenderStage_getTag(se::State& s)
{
    cc::pipeline::RenderStage* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_getTag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getTag();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
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
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardStage_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ForwardStage_finalize)

static bool js_pipeline_ForwardStage_constructor(se::State& s) // constructor.c
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ForwardStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ForwardStage* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardStage>(s);
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
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowFlow_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowFlow_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ShadowFlow_finalize)

static bool js_pipeline_ShadowFlow_constructor(se::State& s) // constructor.c
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ShadowFlow>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ShadowFlow* cobj = SE_THIS_OBJECT<cc::pipeline::ShadowFlow>(s);
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

static bool js_pipeline_ShadowStage_setUseData(se::State& s)
{
    cc::pipeline::ShadowStage* cobj = SE_THIS_OBJECT<cc::pipeline::ShadowStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ShadowStage_setUseData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<const cc::pipeline::Light*, false> arg0 = {};
        HolderType<cc::gfx::Framebuffer*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowStage_setUseData : Error processing arguments");
        cobj->setUseData(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowStage_setUseData)

static bool js_pipeline_ShadowStage_setFramebuffer(se::State& s)
{
    cc::pipeline::ShadowStage* cobj = SE_THIS_OBJECT<cc::pipeline::ShadowStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ShadowStage_setFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Framebuffer*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowStage_setFramebuffer : Error processing arguments");
        cobj->setFramebuffer(arg0.value());
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
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowStage_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ShadowStage_finalize)

static bool js_pipeline_ShadowStage_constructor(se::State& s) // constructor.c
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ShadowStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::ShadowStage* cobj = SE_THIS_OBJECT<cc::pipeline::ShadowStage>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ShadowStage_finalize)

bool js_register_pipeline_ShadowStage(se::Object* obj)
{
    auto cls = se::Class::create("ShadowStage", obj, __jsb_cc_pipeline_RenderStage_proto, _SE(js_pipeline_ShadowStage_constructor));

    cls->defineFunction("setUseData", _SE(js_pipeline_ShadowStage_setUseData));
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
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_UIFlow_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_UIFlow_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_UIFlow_finalize)

static bool js_pipeline_UIFlow_constructor(se::State& s) // constructor.c
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::UIFlow>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::UIFlow* cobj = SE_THIS_OBJECT<cc::pipeline::UIFlow>(s);
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
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_UIStage_getInitializeInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_UIStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_UIStage_finalize)

static bool js_pipeline_UIStage_constructor(se::State& s) // constructor.c
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
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::UIStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::UIStage* cobj = SE_THIS_OBJECT<cc::pipeline::UIStage>(s);
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

se::Object* __jsb_cc_pipeline_RenderViewInfo_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderViewInfo_class = nullptr;

static bool js_pipeline_RenderViewInfo_get_cameraID(se::State& s)
{
    cc::pipeline::RenderViewInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderViewInfo_get_cameraID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->cameraID, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderViewInfo_get_cameraID)

static bool js_pipeline_RenderViewInfo_set_cameraID(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderViewInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderViewInfo_set_cameraID : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->cameraID, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderViewInfo_set_cameraID : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderViewInfo_set_cameraID)

static bool js_pipeline_RenderViewInfo_get_name(se::State& s)
{
    cc::pipeline::RenderViewInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderViewInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderViewInfo_get_name)

static bool js_pipeline_RenderViewInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderViewInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderViewInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderViewInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderViewInfo_set_name)

static bool js_pipeline_RenderViewInfo_get_priority(se::State& s)
{
    cc::pipeline::RenderViewInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderViewInfo_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->priority, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderViewInfo_get_priority)

static bool js_pipeline_RenderViewInfo_set_priority(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderViewInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderViewInfo_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->priority, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderViewInfo_set_priority : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderViewInfo_set_priority)

static bool js_pipeline_RenderViewInfo_get_flows(se::State& s)
{
    cc::pipeline::RenderViewInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderViewInfo_get_flows : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->flows, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderViewInfo_get_flows)

static bool js_pipeline_RenderViewInfo_set_flows(se::State& s)
{
    const auto& args = s.args();
    cc::pipeline::RenderViewInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderViewInfo_set_flows : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->flows, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderViewInfo_set_flows : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderViewInfo_set_flows)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderViewInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::pipeline::RenderViewInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("cameraID", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->cameraID), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("priority", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->priority), ctx);
    }
    json->getProperty("flows", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->flows), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderViewInfo_finalize)

static bool js_pipeline_RenderViewInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::pipeline::RenderViewInfo* cobj = JSB_ALLOC(cc::pipeline::RenderViewInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::pipeline::RenderViewInfo* cobj = JSB_ALLOC(cc::pipeline::RenderViewInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
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
        cc::pipeline::RenderViewInfo* cobj = JSB_ALLOC(cc::pipeline::RenderViewInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->cameraID), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->name), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->priority), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->flows), nullptr);;
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
SE_BIND_CTOR(js_pipeline_RenderViewInfo_constructor, __jsb_cc_pipeline_RenderViewInfo_class, js_cc_pipeline_RenderViewInfo_finalize)




static bool js_cc_pipeline_RenderViewInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderViewInfo* cobj = SE_THIS_OBJECT<cc::pipeline::RenderViewInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderViewInfo_finalize)

bool js_register_pipeline_RenderViewInfo(se::Object* obj)
{
    auto cls = se::Class::create("RenderViewInfo", obj, nullptr, _SE(js_pipeline_RenderViewInfo_constructor));

    cls->defineProperty("cameraID", _SE(js_pipeline_RenderViewInfo_get_cameraID), _SE(js_pipeline_RenderViewInfo_set_cameraID));
    cls->defineProperty("name", _SE(js_pipeline_RenderViewInfo_get_name), _SE(js_pipeline_RenderViewInfo_set_name));
    cls->defineProperty("priority", _SE(js_pipeline_RenderViewInfo_get_priority), _SE(js_pipeline_RenderViewInfo_set_priority));
    cls->defineProperty("flows", _SE(js_pipeline_RenderViewInfo_get_flows), _SE(js_pipeline_RenderViewInfo_set_flows));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderViewInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderViewInfo>(cls);

    __jsb_cc_pipeline_RenderViewInfo_proto = cls->getProto();
    __jsb_cc_pipeline_RenderViewInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_RenderView_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderView_class = nullptr;

static bool js_pipeline_RenderView_setEnable(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setEnable : Error processing arguments");
        cobj->setEnable(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_setEnable)

static bool js_pipeline_RenderView_setExecuteFlows(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setExecuteFlows : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<std::string>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setExecuteFlows : Error processing arguments");
        cobj->setExecuteFlows(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_setExecuteFlows)

static bool js_pipeline_RenderView_onGlobalPipelineStateChanged(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
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
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderView_getName)

static bool js_pipeline_RenderView_getPriority(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getPriority();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getPriority : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderView_getPriority)

static bool js_pipeline_RenderView_getVisibility(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getVisibility : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVisibility();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getVisibility : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_getVisibility)

static bool js_pipeline_RenderView_setPriority(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setPriority : Error processing arguments");
        cobj->setPriority(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_pipeline_RenderView_setPriority)

static bool js_pipeline_RenderView_setVisibility(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setVisibility : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setVisibility : Error processing arguments");
        cobj->setVisibility(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_setVisibility)

static bool js_pipeline_RenderView_getWindow(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::RenderWindow* result = cobj->getWindow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getWindow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_getWindow)

static bool js_pipeline_RenderView_initialize(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderViewInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_initialize)

static bool js_pipeline_RenderView_destroy(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
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
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getFlows : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::pipeline::RenderFlow *>& result = cobj->getFlows();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getFlows : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_getFlows)

static bool js_pipeline_RenderView_setWindow(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setWindow : Error processing arguments");
        cobj->setWindow(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_setWindow)

static bool js_pipeline_RenderView_isEnabled(se::State& s)
{
    cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_isEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderView_isEnabled)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderView_finalize)

static bool js_pipeline_RenderView_constructor(se::State& s) // constructor.c
{
    cc::pipeline::RenderView* cobj = JSB_ALLOC(cc::pipeline::RenderView);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_RenderView_constructor, __jsb_cc_pipeline_RenderView_class, js_cc_pipeline_RenderView_finalize)




static bool js_cc_pipeline_RenderView_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderView>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderView* cobj = SE_THIS_OBJECT<cc::pipeline::RenderView>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderView_finalize)

bool js_register_pipeline_RenderView(se::Object* obj)
{
    auto cls = se::Class::create("RenderView", obj, nullptr, _SE(js_pipeline_RenderView_constructor));

    cls->defineProperty("priority", _SE(js_pipeline_RenderView_getPriority), _SE(js_pipeline_RenderView_setPriority));
    cls->defineProperty("name", _SE(js_pipeline_RenderView_getName), nullptr);
    cls->defineProperty("isEnable", _SE(js_pipeline_RenderView_isEnabled), nullptr);
    cls->defineFunction("enable", _SE(js_pipeline_RenderView_setEnable));
    cls->defineFunction("setExecuteFlows", _SE(js_pipeline_RenderView_setExecuteFlows));
    cls->defineFunction("onGlobalPipelineStateChanged", _SE(js_pipeline_RenderView_onGlobalPipelineStateChanged));
    cls->defineFunction("getVisibility", _SE(js_pipeline_RenderView_getVisibility));
    cls->defineFunction("setVisibility", _SE(js_pipeline_RenderView_setVisibility));
    cls->defineFunction("getWindow", _SE(js_pipeline_RenderView_getWindow));
    cls->defineFunction("initialize", _SE(js_pipeline_RenderView_initialize));
    cls->defineFunction("destroy", _SE(js_pipeline_RenderView_destroy));
    cls->defineFunction("getFlows", _SE(js_pipeline_RenderView_getFlows));
    cls->defineFunction("setWindow", _SE(js_pipeline_RenderView_setWindow));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderView_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderView>(cls);

    __jsb_cc_pipeline_RenderView_proto = cls->getProto();
    __jsb_cc_pipeline_RenderView_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_pipeline_InstancedBuffer_proto = nullptr;
se::Class* __jsb_cc_pipeline_InstancedBuffer_class = nullptr;

static bool js_pipeline_InstancedBuffer_destroy(se::State& s)
{
    cc::pipeline::InstancedBuffer* cobj = SE_THIS_OBJECT<cc::pipeline::InstancedBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_InstancedBuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_InstancedBuffer_destroy)

static bool js_pipeline_InstancedBuffer_setDynamicOffset(se::State& s)
{
    cc::pipeline::InstancedBuffer* cobj = SE_THIS_OBJECT<cc::pipeline::InstancedBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_InstancedBuffer_setDynamicOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_pipeline_InstancedBuffer_setDynamicOffset : Error processing arguments");
        cobj->setDynamicOffset(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_InstancedBuffer_setDynamicOffset)

static bool js_pipeline_InstancedBuffer_get(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            HolderType<unsigned int, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cc::pipeline::InstancedBuffer* result = cc::pipeline::InstancedBuffer::get(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_pipeline_InstancedBuffer_get : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 1) {
            HolderType<unsigned int, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            cc::pipeline::InstancedBuffer* result = cc::pipeline::InstancedBuffer::get(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_pipeline_InstancedBuffer_get : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_pipeline_InstancedBuffer_get)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_InstancedBuffer_finalize)

static bool js_pipeline_InstancedBuffer_constructor(se::State& s) // constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    const cc::pipeline::PassView* arg0 = nullptr;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_pipeline_InstancedBuffer_constructor : Error processing arguments");
    cc::pipeline::InstancedBuffer* cobj = JSB_ALLOC(cc::pipeline::InstancedBuffer, arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_InstancedBuffer_constructor, __jsb_cc_pipeline_InstancedBuffer_class, js_cc_pipeline_InstancedBuffer_finalize)




static bool js_cc_pipeline_InstancedBuffer_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::InstancedBuffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::InstancedBuffer* cobj = SE_THIS_OBJECT<cc::pipeline::InstancedBuffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_InstancedBuffer_finalize)

bool js_register_pipeline_InstancedBuffer(se::Object* obj)
{
    auto cls = se::Class::create("InstancedBuffer", obj, nullptr, _SE(js_pipeline_InstancedBuffer_constructor));

    cls->defineFunction("destroy", _SE(js_pipeline_InstancedBuffer_destroy));
    cls->defineFunction("setDynamicOffset", _SE(js_pipeline_InstancedBuffer_setDynamicOffset));
    cls->defineStaticFunction("get", _SE(js_pipeline_InstancedBuffer_get));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_InstancedBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::InstancedBuffer>(cls);

    __jsb_cc_pipeline_InstancedBuffer_proto = cls->getProto();
    __jsb_cc_pipeline_InstancedBuffer_class = cls;

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
    js_register_pipeline_Light(ns);
    js_register_pipeline_RenderStage(ns);
    js_register_pipeline_ForwardStage(ns);
    js_register_pipeline_ShadowStage(ns);
    js_register_pipeline_RenderFlowInfo(ns);
    js_register_pipeline_UIStage(ns);
    js_register_pipeline_ForwardFlow(ns);
    js_register_pipeline_InstancedBuffer(ns);
    js_register_pipeline_RenderWindow(ns);
    js_register_pipeline_PassView(ns);
    js_register_pipeline_UIFlow(ns);
    js_register_pipeline_RenderViewInfo(ns);
    js_register_pipeline_ShadowFlow(ns);
    return true;
}

