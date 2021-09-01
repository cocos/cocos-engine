#include "cocos/bindings/auto/jsb_pipeline_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/pipeline/forward/ForwardPipeline.h"
#include "renderer/pipeline/forward/ForwardFlow.h"
#include "renderer/pipeline/forward/ForwardStage.h"
#include "renderer/pipeline/shadow/ShadowFlow.h"
#include "renderer/pipeline/shadow/ShadowStage.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "renderer/pipeline/RenderFlow.h"
#include "renderer/pipeline/RenderStage.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/GlobalDescriptorSetManager.h"
#include "renderer/pipeline/InstancedBuffer.h"
#include "renderer/pipeline/deferred/DeferredPipeline.h"
#include "renderer/pipeline/deferred/MainFlow.h"
#include "renderer/pipeline/deferred/GbufferStage.h"
#include "renderer/pipeline/deferred/LightingStage.h"
#include "renderer/pipeline/deferred/PostprocessStage.h"
#include "cocos/renderer/gfx-base/GFXBase.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_pipeline_RenderQueueDesc_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderQueueDesc_class = nullptr;

static bool js_pipeline_RenderQueueDesc_get_isTransparent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_get_isTransparent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isTransparent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isTransparent, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderQueueDesc_get_isTransparent)

static bool js_pipeline_RenderQueueDesc_set_isTransparent(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_set_isTransparent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isTransparent, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderQueueDesc_set_isTransparent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderQueueDesc_set_isTransparent)

static bool js_pipeline_RenderQueueDesc_get_sortMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_get_sortMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->sortMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->sortMode, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderQueueDesc_get_sortMode)

static bool js_pipeline_RenderQueueDesc_set_sortMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_set_sortMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->sortMode, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderQueueDesc_set_sortMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderQueueDesc_set_sortMode)

static bool js_pipeline_RenderQueueDesc_get_stages(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stages, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stages, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderQueueDesc_get_stages)

static bool js_pipeline_RenderQueueDesc_set_stages(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderQueueDesc_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stages, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderQueueDesc_set_stages : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderQueueDesc_set_stages)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderQueueDesc * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::pipeline::RenderQueueDesc*>(json->getPrivateData());
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

static bool js_pipeline_RenderQueueDesc_constructor(se::State& s) // NOLINT(readability-identifier-naming)
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

    if(argc == 1 && args[0].isObject())
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

    cc::pipeline::RenderQueueDesc* cobj = JSB_ALLOC(cc::pipeline::RenderQueueDesc);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->isTransparent), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->sortMode), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->stages), nullptr);
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
SE_BIND_CTOR(js_pipeline_RenderQueueDesc_constructor, __jsb_cc_pipeline_RenderQueueDesc_class, js_cc_pipeline_RenderQueueDesc_finalize)



static bool js_cc_pipeline_RenderQueueDesc_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderQueueDesc>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderQueueDesc_finalize)

bool js_register_pipeline_RenderQueueDesc(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderQueueDesc", obj, nullptr, _SE(js_pipeline_RenderQueueDesc_constructor));

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
se::Object* __jsb_cc_pipeline_GlobalDSManager_proto = nullptr;
se::Class* __jsb_cc_pipeline_GlobalDSManager_class = nullptr;

static bool js_pipeline_GlobalDSManager_bindBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_bindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Buffer*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_bindBuffer : Error processing arguments");
        cobj->bindBuffer(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_bindBuffer)

static bool js_pipeline_GlobalDSManager_bindSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_bindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Sampler*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_bindSampler : Error processing arguments");
        cobj->bindSampler(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_bindSampler)

static bool js_pipeline_GlobalDSManager_bindTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_bindTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Texture*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_bindTexture : Error processing arguments");
        cobj->bindTexture(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_bindTexture)

static bool js_pipeline_GlobalDSManager_getDescriptorSetLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_getDescriptorSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSetLayout* result = cobj->getDescriptorSetLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_getDescriptorSetLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_getDescriptorSetLayout)

static bool js_pipeline_GlobalDSManager_getDescriptorSetMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_getDescriptorSetMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::unordered_map<unsigned int, cc::gfx::DescriptorSet *> result = cobj->getDescriptorSetMap();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_getDescriptorSetMap : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_getDescriptorSetMap)

static bool js_pipeline_GlobalDSManager_getGlobalDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_getGlobalDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSet* result = cobj->getGlobalDescriptorSet();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_getGlobalDescriptorSet : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_getGlobalDescriptorSet)

static bool js_pipeline_GlobalDSManager_getLinearSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_getLinearSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Sampler* result = cobj->getLinearSampler();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_getLinearSampler : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_getLinearSampler)

static bool js_pipeline_GlobalDSManager_getOrCreateDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_getOrCreateDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_getOrCreateDescriptorSet : Error processing arguments");
        cc::gfx::DescriptorSet* result = cobj->getOrCreateDescriptorSet(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_getOrCreateDescriptorSet : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_getOrCreateDescriptorSet)

static bool js_pipeline_GlobalDSManager_getPointSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_getPointSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Sampler* result = cobj->getPointSampler();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_GlobalDSManager_getPointSampler : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_getPointSampler)

static bool js_pipeline_GlobalDSManager_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GlobalDSManager_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_GlobalDSManager_update)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_GlobalDSManager_finalize)

static bool js_pipeline_GlobalDSManager_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::GlobalDSManager* cobj = JSB_ALLOC(cc::pipeline::GlobalDSManager);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_GlobalDSManager_constructor, __jsb_cc_pipeline_GlobalDSManager_class, js_cc_pipeline_GlobalDSManager_finalize)



static bool js_cc_pipeline_GlobalDSManager_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::GlobalDSManager>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_GlobalDSManager_finalize)

bool js_register_pipeline_GlobalDSManager(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("GlobalDSManager", obj, nullptr, _SE(js_pipeline_GlobalDSManager_constructor));

    cls->defineFunction("bindBuffer", _SE(js_pipeline_GlobalDSManager_bindBuffer));
    cls->defineFunction("bindSampler", _SE(js_pipeline_GlobalDSManager_bindSampler));
    cls->defineFunction("bindTexture", _SE(js_pipeline_GlobalDSManager_bindTexture));
    cls->defineFunction("getDescriptorSetLayout", _SE(js_pipeline_GlobalDSManager_getDescriptorSetLayout));
    cls->defineFunction("getDescriptorSetMap", _SE(js_pipeline_GlobalDSManager_getDescriptorSetMap));
    cls->defineFunction("getGlobalDescriptorSet", _SE(js_pipeline_GlobalDSManager_getGlobalDescriptorSet));
    cls->defineFunction("getLinearSampler", _SE(js_pipeline_GlobalDSManager_getLinearSampler));
    cls->defineFunction("getOrCreateDescriptorSet", _SE(js_pipeline_GlobalDSManager_getOrCreateDescriptorSet));
    cls->defineFunction("getPointSampler", _SE(js_pipeline_GlobalDSManager_getPointSampler));
    cls->defineFunction("update", _SE(js_pipeline_GlobalDSManager_update));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_GlobalDSManager_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::GlobalDSManager>(cls);

    __jsb_cc_pipeline_GlobalDSManager_proto = cls->getProto();
    __jsb_cc_pipeline_GlobalDSManager_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_pipeline_RenderPipelineInfo_proto = nullptr;
se::Class* __jsb_cc_pipeline_RenderPipelineInfo_class = nullptr;

static bool js_pipeline_RenderPipelineInfo_get_tag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_get_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->tag, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->tag, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipelineInfo_get_tag)

static bool js_pipeline_RenderPipelineInfo_set_tag(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_set_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->tag, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipelineInfo_set_tag : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderPipelineInfo_set_tag)

static bool js_pipeline_RenderPipelineInfo_get_flows(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_get_flows : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->flows, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->flows, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipelineInfo_get_flows)

static bool js_pipeline_RenderPipelineInfo_set_flows(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipelineInfo_set_flows : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->flows, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipelineInfo_set_flows : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderPipelineInfo_set_flows)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderPipelineInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::pipeline::RenderPipelineInfo*>(json->getPrivateData());
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

static bool js_pipeline_RenderPipelineInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
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

    if(argc == 1 && args[0].isObject())
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

    cc::pipeline::RenderPipelineInfo* cobj = JSB_ALLOC(cc::pipeline::RenderPipelineInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->tag), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->flows), nullptr);
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
SE_BIND_CTOR(js_pipeline_RenderPipelineInfo_constructor, __jsb_cc_pipeline_RenderPipelineInfo_class, js_cc_pipeline_RenderPipelineInfo_finalize)



static bool js_cc_pipeline_RenderPipelineInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipelineInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderPipelineInfo_finalize)

bool js_register_pipeline_RenderPipelineInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderPipelineInfo", obj, nullptr, _SE(js_pipeline_RenderPipelineInfo_constructor));

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

static bool js_pipeline_RenderPipeline_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Swapchain*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_activate : Error processing arguments");
        bool result = cobj->activate(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_activate : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_activate)

static bool js_pipeline_RenderPipeline_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
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

static bool js_pipeline_RenderPipeline_getConstantMacros(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getConstantMacros : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getConstantMacros();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getConstantMacros : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipeline_getConstantMacros)

static bool js_pipeline_RenderPipeline_getDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSet* result = cobj->getDescriptorSet();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getDescriptorSet : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipeline_getDescriptorSet)

static bool js_pipeline_RenderPipeline_getDescriptorSetLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getDescriptorSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSetLayout* result = cobj->getDescriptorSetLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getDescriptorSetLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipeline_getDescriptorSetLayout)

static bool js_pipeline_RenderPipeline_getDevice(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getDevice : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_getDevice)

static bool js_pipeline_RenderPipeline_getGlobalDSManager(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getGlobalDSManager : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::GlobalDSManager* result = cobj->getGlobalDSManager();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getGlobalDSManager : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipeline_getGlobalDSManager)

static bool js_pipeline_RenderPipeline_getProfiler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getProfiler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Model* result = cobj->getProfiler();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getProfiler : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_getProfiler)

static bool js_pipeline_RenderPipeline_getRenderstageByName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getRenderstageByName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getRenderstageByName : Error processing arguments");
        cc::pipeline::RenderStage* result = cobj->getRenderstageByName(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getRenderstageByName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_getRenderstageByName)

static bool js_pipeline_RenderPipeline_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderPipelineInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_initialize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_initialize)

static bool js_pipeline_RenderPipeline_render(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::scene::Camera *>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_render : Error processing arguments");
        cobj->render(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_render)

static bool js_pipeline_RenderPipeline_resize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_resize)

static bool js_pipeline_RenderPipeline_setPipelineSharedSceneData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_setPipelineSharedSceneData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::PipelineSharedSceneData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_setPipelineSharedSceneData : Error processing arguments");
        cobj->setPipelineSharedSceneData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_setPipelineSharedSceneData)

static bool js_pipeline_RenderPipeline_setProfiler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_setProfiler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_setProfiler : Error processing arguments");
        cobj->setProfiler(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_setProfiler)

static bool js_pipeline_RenderPipeline_setValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_setValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::String, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_setValue : Error processing arguments");
        cobj->setValue(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_setValue)

static bool js_pipeline_RenderPipeline_getInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::RenderPipeline* result = cc::pipeline::RenderPipeline::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getInstance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderPipeline_getInstance)



bool js_register_pipeline_RenderPipeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderPipeline", obj, nullptr, nullptr);

    cls->defineProperty("globalDSManager", _SE(js_pipeline_RenderPipeline_getGlobalDSManager), nullptr);
    cls->defineProperty("descriptorSet", _SE(js_pipeline_RenderPipeline_getDescriptorSet), nullptr);
    cls->defineProperty("descriptorSetLayout", _SE(js_pipeline_RenderPipeline_getDescriptorSetLayout), nullptr);
    cls->defineProperty("constantMacros", _SE(js_pipeline_RenderPipeline_getConstantMacros), nullptr);
    cls->defineFunction("activate", _SE(js_pipeline_RenderPipeline_activate));
    cls->defineFunction("destroy", _SE(js_pipeline_RenderPipeline_destroy));
    cls->defineFunction("getDevice", _SE(js_pipeline_RenderPipeline_getDevice));
    cls->defineFunction("getProfiler", _SE(js_pipeline_RenderPipeline_getProfiler));
    cls->defineFunction("getRenderstageByName", _SE(js_pipeline_RenderPipeline_getRenderstageByName));
    cls->defineFunction("initialize", _SE(js_pipeline_RenderPipeline_initialize));
    cls->defineFunction("render", _SE(js_pipeline_RenderPipeline_render));
    cls->defineFunction("resize", _SE(js_pipeline_RenderPipeline_resize));
    cls->defineFunction("setPipelineSharedSceneData", _SE(js_pipeline_RenderPipeline_setPipelineSharedSceneData));
    cls->defineFunction("setProfiler", _SE(js_pipeline_RenderPipeline_setProfiler));
    cls->defineFunction("setValue", _SE(js_pipeline_RenderPipeline_setValue));
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

static bool js_pipeline_ForwardPipeline_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::ForwardPipeline* cobj = JSB_ALLOC(cc::pipeline::ForwardPipeline);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ForwardPipeline_constructor, __jsb_cc_pipeline_ForwardPipeline_class, js_cc_pipeline_ForwardPipeline_finalize)



static bool js_cc_pipeline_ForwardPipeline_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardPipeline>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ForwardPipeline_finalize)

bool js_register_pipeline_ForwardPipeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ForwardPipeline", obj, __jsb_cc_pipeline_RenderPipeline_proto, _SE(js_pipeline_ForwardPipeline_constructor));

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

static bool js_pipeline_RenderFlowInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_name)

static bool js_pipeline_RenderFlowInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_name)

static bool js_pipeline_RenderFlowInfo_get_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->priority, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->priority, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_priority)

static bool js_pipeline_RenderFlowInfo_set_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->priority, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_priority : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_priority)

static bool js_pipeline_RenderFlowInfo_get_tag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->tag, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->tag, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_tag)

static bool js_pipeline_RenderFlowInfo_set_tag(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->tag, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_tag : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_tag)

static bool js_pipeline_RenderFlowInfo_get_stages(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stages, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stages, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderFlowInfo_get_stages)

static bool js_pipeline_RenderFlowInfo_set_stages(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlowInfo_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stages, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlowInfo_set_stages : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderFlowInfo_set_stages)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderFlowInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::pipeline::RenderFlowInfo*>(json->getPrivateData());
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

static bool js_pipeline_RenderFlowInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
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

    if(argc == 1 && args[0].isObject())
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

    cc::pipeline::RenderFlowInfo* cobj = JSB_ALLOC(cc::pipeline::RenderFlowInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->priority), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->tag), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stages), nullptr);
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
SE_BIND_CTOR(js_pipeline_RenderFlowInfo_constructor, __jsb_cc_pipeline_RenderFlowInfo_class, js_cc_pipeline_RenderFlowInfo_finalize)



static bool js_cc_pipeline_RenderFlowInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlowInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderFlowInfo_finalize)

bool js_register_pipeline_RenderFlowInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderFlowInfo", obj, nullptr, _SE(js_pipeline_RenderFlowInfo_constructor));

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

static bool js_pipeline_RenderFlow_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderPipeline*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_activate : Error processing arguments");
        cobj->activate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderFlow_activate)

static bool js_pipeline_RenderFlow_getRenderstageByName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_getRenderstageByName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_getRenderstageByName : Error processing arguments");
        cc::pipeline::RenderStage* result = cobj->getRenderstageByName(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_getRenderstageByName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderFlow_getRenderstageByName)

static bool js_pipeline_RenderFlow_getTag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_getTag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getTag();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_getTag : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderFlow_getTag)

static bool js_pipeline_RenderFlow_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderFlow>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderFlow_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderFlowInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderFlow_initialize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderFlow_initialize)



bool js_register_pipeline_RenderFlow(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderFlow", obj, nullptr, nullptr);

    cls->defineFunction("activate", _SE(js_pipeline_RenderFlow_activate));
    cls->defineFunction("getRenderstageByName", _SE(js_pipeline_RenderFlow_getRenderstageByName));
    cls->defineFunction("getTag", _SE(js_pipeline_RenderFlow_getTag));
    cls->defineFunction("initialize", _SE(js_pipeline_RenderFlow_initialize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderFlow>(cls);

    __jsb_cc_pipeline_RenderFlow_proto = cls->getProto();
    __jsb_cc_pipeline_RenderFlow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_pipeline_ForwardFlow_proto = nullptr;
se::Class* __jsb_cc_pipeline_ForwardFlow_class = nullptr;

static bool js_pipeline_ForwardFlow_getInitializeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderFlowInfo& result = cc::pipeline::ForwardFlow::getInitializeInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardFlow_getInitializeInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardFlow_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ForwardFlow_finalize)

static bool js_pipeline_ForwardFlow_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::ForwardFlow* cobj = JSB_ALLOC(cc::pipeline::ForwardFlow);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ForwardFlow_constructor, __jsb_cc_pipeline_ForwardFlow_class, js_cc_pipeline_ForwardFlow_finalize)



static bool js_cc_pipeline_ForwardFlow_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ForwardFlow>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardFlow>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ForwardFlow_finalize)

bool js_register_pipeline_ForwardFlow(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ForwardFlow", obj, __jsb_cc_pipeline_RenderFlow_proto, _SE(js_pipeline_ForwardFlow_constructor));

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

static bool js_pipeline_RenderStageInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_name)

static bool js_pipeline_RenderStageInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_name)

static bool js_pipeline_RenderStageInfo_get_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->priority, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->priority, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_priority)

static bool js_pipeline_RenderStageInfo_set_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->priority, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_priority : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_priority)

static bool js_pipeline_RenderStageInfo_get_tag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->tag, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->tag, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_tag)

static bool js_pipeline_RenderStageInfo_set_tag(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_tag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->tag, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_tag : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_tag)

static bool js_pipeline_RenderStageInfo_get_renderQueues(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_get_renderQueues : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->renderQueues, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->renderQueues, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_pipeline_RenderStageInfo_get_renderQueues)

static bool js_pipeline_RenderStageInfo_set_renderQueues(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStageInfo_set_renderQueues : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->renderQueues, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_RenderStageInfo_set_renderQueues : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_pipeline_RenderStageInfo_set_renderQueues)


template<>
bool sevalue_to_native(const se::Value &from, cc::pipeline::RenderStageInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::pipeline::RenderStageInfo*>(json->getPrivateData());
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

static bool js_pipeline_RenderStageInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
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

    if(argc == 1 && args[0].isObject())
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

    cc::pipeline::RenderStageInfo* cobj = JSB_ALLOC(cc::pipeline::RenderStageInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->priority), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->tag), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->renderQueues), nullptr);
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
SE_BIND_CTOR(js_pipeline_RenderStageInfo_constructor, __jsb_cc_pipeline_RenderStageInfo_class, js_cc_pipeline_RenderStageInfo_finalize)



static bool js_cc_pipeline_RenderStageInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStageInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderStageInfo_finalize)

bool js_register_pipeline_RenderStageInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderStageInfo", obj, nullptr, _SE(js_pipeline_RenderStageInfo_constructor));

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

static bool js_pipeline_RenderStage_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::pipeline::RenderPipeline*, false> arg0 = {};
        HolderType<cc::pipeline::RenderFlow*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_activate : Error processing arguments");
        cobj->activate(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderStage_activate)

static bool js_pipeline_RenderStage_getFlow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_getFlow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::RenderFlow* result = cobj->getFlow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_getFlow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderStage_getFlow)

static bool js_pipeline_RenderStage_getTag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_getTag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getTag();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_getTag : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderStage_getTag)

static bool js_pipeline_RenderStage_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::RenderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderStage_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderStageInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderStage_initialize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderStage_initialize)



bool js_register_pipeline_RenderStage(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderStage", obj, nullptr, nullptr);

    cls->defineFunction("activate", _SE(js_pipeline_RenderStage_activate));
    cls->defineFunction("getFlow", _SE(js_pipeline_RenderStage_getFlow));
    cls->defineFunction("getTag", _SE(js_pipeline_RenderStage_getTag));
    cls->defineFunction("initialize", _SE(js_pipeline_RenderStage_initialize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderStage>(cls);

    __jsb_cc_pipeline_RenderStage_proto = cls->getProto();
    __jsb_cc_pipeline_RenderStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_pipeline_ForwardStage_proto = nullptr;
se::Class* __jsb_cc_pipeline_ForwardStage_class = nullptr;

static bool js_pipeline_ForwardStage_getInitializeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderStageInfo& result = cc::pipeline::ForwardStage::getInitializeInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_ForwardStage_getInitializeInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ForwardStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ForwardStage_finalize)

static bool js_pipeline_ForwardStage_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::ForwardStage* cobj = JSB_ALLOC(cc::pipeline::ForwardStage);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ForwardStage_constructor, __jsb_cc_pipeline_ForwardStage_class, js_cc_pipeline_ForwardStage_finalize)



static bool js_cc_pipeline_ForwardStage_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ForwardStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::ForwardStage>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ForwardStage_finalize)

bool js_register_pipeline_ForwardStage(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ForwardStage", obj, __jsb_cc_pipeline_RenderStage_proto, _SE(js_pipeline_ForwardStage_constructor));

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

static bool js_pipeline_ShadowFlow_getInitializeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderFlowInfo& result = cc::pipeline::ShadowFlow::getInitializeInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowFlow_getInitializeInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowFlow_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ShadowFlow_finalize)

static bool js_pipeline_ShadowFlow_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::ShadowFlow* cobj = JSB_ALLOC(cc::pipeline::ShadowFlow);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ShadowFlow_constructor, __jsb_cc_pipeline_ShadowFlow_class, js_cc_pipeline_ShadowFlow_finalize)



static bool js_cc_pipeline_ShadowFlow_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ShadowFlow>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::ShadowFlow>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ShadowFlow_finalize)

bool js_register_pipeline_ShadowFlow(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ShadowFlow", obj, __jsb_cc_pipeline_RenderFlow_proto, _SE(js_pipeline_ShadowFlow_constructor));

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

static bool js_pipeline_ShadowStage_setFramebuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::ShadowStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ShadowStage_setFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Framebuffer*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowStage_setFramebuffer : Error processing arguments");
        cobj->setFramebuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowStage_setFramebuffer)

static bool js_pipeline_ShadowStage_setUseData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::ShadowStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_ShadowStage_setUseData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<const cc::scene::Light*, false> arg0 = {};
        HolderType<cc::gfx::Framebuffer*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowStage_setUseData : Error processing arguments");
        cobj->setUseData(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowStage_setUseData)

static bool js_pipeline_ShadowStage_getInitializeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderStageInfo& result = cc::pipeline::ShadowStage::getInitializeInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_ShadowStage_getInitializeInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_ShadowStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_ShadowStage_finalize)

static bool js_pipeline_ShadowStage_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::ShadowStage* cobj = JSB_ALLOC(cc::pipeline::ShadowStage);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_ShadowStage_constructor, __jsb_cc_pipeline_ShadowStage_class, js_cc_pipeline_ShadowStage_finalize)



static bool js_cc_pipeline_ShadowStage_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::ShadowStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::ShadowStage>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_ShadowStage_finalize)

bool js_register_pipeline_ShadowStage(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ShadowStage", obj, __jsb_cc_pipeline_RenderStage_proto, _SE(js_pipeline_ShadowStage_constructor));

    cls->defineFunction("setFramebuffer", _SE(js_pipeline_ShadowStage_setFramebuffer));
    cls->defineFunction("setUseData", _SE(js_pipeline_ShadowStage_setUseData));
    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_ShadowStage_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_ShadowStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::ShadowStage>(cls);

    __jsb_cc_pipeline_ShadowStage_proto = cls->getProto();
    __jsb_cc_pipeline_ShadowStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_pipeline_InstancedBuffer_proto = nullptr;
se::Class* __jsb_cc_pipeline_InstancedBuffer_class = nullptr;

static bool js_pipeline_InstancedBuffer_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::InstancedBuffer>(s);
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

static bool js_pipeline_InstancedBuffer_setDynamicOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::InstancedBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_InstancedBuffer_setDynamicOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_InstancedBuffer_setDynamicOffset : Error processing arguments");
        cobj->setDynamicOffset(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_InstancedBuffer_setDynamicOffset)

static bool js_pipeline_InstancedBuffer_destroyInstancedBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::pipeline::InstancedBuffer::destroyInstancedBuffer();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_InstancedBuffer_destroyInstancedBuffer)

static bool js_pipeline_InstancedBuffer_get(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<cc::scene::Pass*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<unsigned int, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::pipeline::InstancedBuffer* result = cc::pipeline::InstancedBuffer::get(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_pipeline_InstancedBuffer_get : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while (false);
    do {
        if (argc == 1) {
            HolderType<cc::scene::Pass*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::pipeline::InstancedBuffer* result = cc::pipeline::InstancedBuffer::get(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_pipeline_InstancedBuffer_get : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_pipeline_InstancedBuffer_get)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_InstancedBuffer_finalize)

static bool js_pipeline_InstancedBuffer_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    const cc::scene::Pass* arg0 = nullptr;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_pipeline_InstancedBuffer_constructor : Error processing arguments");
    cc::pipeline::InstancedBuffer* cobj = JSB_ALLOC(cc::pipeline::InstancedBuffer, arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_InstancedBuffer_constructor, __jsb_cc_pipeline_InstancedBuffer_class, js_cc_pipeline_InstancedBuffer_finalize)



static bool js_cc_pipeline_InstancedBuffer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::InstancedBuffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::InstancedBuffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_InstancedBuffer_finalize)

bool js_register_pipeline_InstancedBuffer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("InstancedBuffer", obj, nullptr, _SE(js_pipeline_InstancedBuffer_constructor));

    cls->defineFunction("destroy", _SE(js_pipeline_InstancedBuffer_destroy));
    cls->defineFunction("setDynamicOffset", _SE(js_pipeline_InstancedBuffer_setDynamicOffset));
    cls->defineStaticFunction("destroyInstancedBuffer", _SE(js_pipeline_InstancedBuffer_destroyInstancedBuffer));
    cls->defineStaticFunction("get", _SE(js_pipeline_InstancedBuffer_get));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_InstancedBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::InstancedBuffer>(cls);

    __jsb_cc_pipeline_InstancedBuffer_proto = cls->getProto();
    __jsb_cc_pipeline_InstancedBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_pipeline_DeferredPipeline_proto = nullptr;
se::Class* __jsb_cc_pipeline_DeferredPipeline_class = nullptr;

static bool js_pipeline_DeferredPipeline_getClearcolor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::DeferredPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_DeferredPipeline_getClearcolor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Camera*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_DeferredPipeline_getClearcolor : Error processing arguments");
        cc::gfx::Color result = cobj->getClearcolor(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_DeferredPipeline_getClearcolor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_DeferredPipeline_getClearcolor)

static bool js_pipeline_DeferredPipeline_getFrameGraph(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::DeferredPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_DeferredPipeline_getFrameGraph : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::framegraph::FrameGraph& result = cobj->getFrameGraph();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_DeferredPipeline_getFrameGraph : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_DeferredPipeline_getFrameGraph)

static bool js_pipeline_DeferredPipeline_getFrameGraphCamera(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::DeferredPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_DeferredPipeline_getFrameGraphCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Camera* result = cobj->getFrameGraphCamera();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_DeferredPipeline_getFrameGraphCamera : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_DeferredPipeline_getFrameGraphCamera)

static bool js_pipeline_DeferredPipeline_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::DeferredPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_DeferredPipeline_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_DeferredPipeline_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_DeferredPipeline_getHeight)

static bool js_pipeline_DeferredPipeline_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::DeferredPipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_DeferredPipeline_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_DeferredPipeline_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_DeferredPipeline_getWidth)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_DeferredPipeline_finalize)

static bool js_pipeline_DeferredPipeline_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::DeferredPipeline* cobj = JSB_ALLOC(cc::pipeline::DeferredPipeline);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_DeferredPipeline_constructor, __jsb_cc_pipeline_DeferredPipeline_class, js_cc_pipeline_DeferredPipeline_finalize)



static bool js_cc_pipeline_DeferredPipeline_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::DeferredPipeline>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::DeferredPipeline>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_DeferredPipeline_finalize)

bool js_register_pipeline_DeferredPipeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DeferredPipeline", obj, __jsb_cc_pipeline_RenderPipeline_proto, _SE(js_pipeline_DeferredPipeline_constructor));

    cls->defineFunction("getClearcolor", _SE(js_pipeline_DeferredPipeline_getClearcolor));
    cls->defineFunction("getFrameGraph", _SE(js_pipeline_DeferredPipeline_getFrameGraph));
    cls->defineFunction("getFrameGraphCamera", _SE(js_pipeline_DeferredPipeline_getFrameGraphCamera));
    cls->defineFunction("getHeight", _SE(js_pipeline_DeferredPipeline_getHeight));
    cls->defineFunction("getWidth", _SE(js_pipeline_DeferredPipeline_getWidth));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_DeferredPipeline_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::DeferredPipeline>(cls);

    __jsb_cc_pipeline_DeferredPipeline_proto = cls->getProto();
    __jsb_cc_pipeline_DeferredPipeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_pipeline_MainFlow_proto = nullptr;
se::Class* __jsb_cc_pipeline_MainFlow_class = nullptr;

static bool js_pipeline_MainFlow_getInitializeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderFlowInfo& result = cc::pipeline::MainFlow::getInitializeInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_MainFlow_getInitializeInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_MainFlow_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_MainFlow_finalize)

static bool js_pipeline_MainFlow_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::MainFlow* cobj = JSB_ALLOC(cc::pipeline::MainFlow);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_MainFlow_constructor, __jsb_cc_pipeline_MainFlow_class, js_cc_pipeline_MainFlow_finalize)



static bool js_cc_pipeline_MainFlow_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::MainFlow>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::MainFlow>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_MainFlow_finalize)

bool js_register_pipeline_MainFlow(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("MainFlow", obj, __jsb_cc_pipeline_RenderFlow_proto, _SE(js_pipeline_MainFlow_constructor));

    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_MainFlow_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_MainFlow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::MainFlow>(cls);

    __jsb_cc_pipeline_MainFlow_proto = cls->getProto();
    __jsb_cc_pipeline_MainFlow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_pipeline_GbufferStage_proto = nullptr;
se::Class* __jsb_cc_pipeline_GbufferStage_class = nullptr;

static bool js_pipeline_GbufferStage_dispenseRenderObject2Queues(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GbufferStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GbufferStage_dispenseRenderObject2Queues : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dispenseRenderObject2Queues();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_GbufferStage_dispenseRenderObject2Queues)

static bool js_pipeline_GbufferStage_recordCommands(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::pipeline::GbufferStage>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GbufferStage_recordCommands : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::pipeline::DeferredPipeline*, false> arg0 = {};
        HolderType<cc::gfx::RenderPass*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_GbufferStage_recordCommands : Error processing arguments");
        cobj->recordCommands(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_pipeline_GbufferStage_recordCommands)

static bool js_pipeline_GbufferStage_getInitializeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderStageInfo& result = cc::pipeline::GbufferStage::getInitializeInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_GbufferStage_getInitializeInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_GbufferStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_GbufferStage_finalize)

static bool js_pipeline_GbufferStage_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::GbufferStage* cobj = JSB_ALLOC(cc::pipeline::GbufferStage);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_GbufferStage_constructor, __jsb_cc_pipeline_GbufferStage_class, js_cc_pipeline_GbufferStage_finalize)



static bool js_cc_pipeline_GbufferStage_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::GbufferStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::GbufferStage>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_GbufferStage_finalize)

bool js_register_pipeline_GbufferStage(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("GbufferStage", obj, __jsb_cc_pipeline_RenderStage_proto, _SE(js_pipeline_GbufferStage_constructor));

    cls->defineFunction("dispenseRenderObject2Queues", _SE(js_pipeline_GbufferStage_dispenseRenderObject2Queues));
    cls->defineFunction("recordCommands", _SE(js_pipeline_GbufferStage_recordCommands));
    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_GbufferStage_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_GbufferStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::GbufferStage>(cls);

    __jsb_cc_pipeline_GbufferStage_proto = cls->getProto();
    __jsb_cc_pipeline_GbufferStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_pipeline_LightingStage_proto = nullptr;
se::Class* __jsb_cc_pipeline_LightingStage_class = nullptr;

static bool js_pipeline_LightingStage_getInitializeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderStageInfo& result = cc::pipeline::LightingStage::getInitializeInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_LightingStage_getInitializeInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_LightingStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_LightingStage_finalize)

static bool js_pipeline_LightingStage_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::LightingStage* cobj = JSB_ALLOC(cc::pipeline::LightingStage);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_LightingStage_constructor, __jsb_cc_pipeline_LightingStage_class, js_cc_pipeline_LightingStage_finalize)



static bool js_cc_pipeline_LightingStage_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::LightingStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::LightingStage>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_LightingStage_finalize)

bool js_register_pipeline_LightingStage(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("LightingStage", obj, __jsb_cc_pipeline_RenderStage_proto, _SE(js_pipeline_LightingStage_constructor));

    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_LightingStage_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_LightingStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::LightingStage>(cls);

    __jsb_cc_pipeline_LightingStage_proto = cls->getProto();
    __jsb_cc_pipeline_LightingStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_pipeline_PostprocessStage_proto = nullptr;
se::Class* __jsb_cc_pipeline_PostprocessStage_class = nullptr;

static bool js_pipeline_PostprocessStage_getInitializeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::RenderStageInfo& result = cc::pipeline::PostprocessStage::getInitializeInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_pipeline_PostprocessStage_getInitializeInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_pipeline_PostprocessStage_getInitializeInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_PostprocessStage_finalize)

static bool js_pipeline_PostprocessStage_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::pipeline::PostprocessStage* cobj = JSB_ALLOC(cc::pipeline::PostprocessStage);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_pipeline_PostprocessStage_constructor, __jsb_cc_pipeline_PostprocessStage_class, js_cc_pipeline_PostprocessStage_finalize)



static bool js_cc_pipeline_PostprocessStage_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::pipeline::PostprocessStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::pipeline::PostprocessStage>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_PostprocessStage_finalize)

bool js_register_pipeline_PostprocessStage(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PostprocessStage", obj, __jsb_cc_pipeline_RenderStage_proto, _SE(js_pipeline_PostprocessStage_constructor));

    cls->defineStaticFunction("getInitializeInfo", _SE(js_pipeline_PostprocessStage_getInitializeInfo));
    cls->defineFinalizeFunction(_SE(js_cc_pipeline_PostprocessStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::PostprocessStage>(cls);

    __jsb_cc_pipeline_PostprocessStage_proto = cls->getProto();
    __jsb_cc_pipeline_PostprocessStage_class = cls;

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
    js_register_pipeline_RenderStage(ns);
    js_register_pipeline_LightingStage(ns);
    js_register_pipeline_RenderPipeline(ns);
    js_register_pipeline_RenderStageInfo(ns);
    js_register_pipeline_ForwardPipeline(ns);
    js_register_pipeline_GbufferStage(ns);
    js_register_pipeline_RenderPipelineInfo(ns);
    js_register_pipeline_ForwardStage(ns);
    js_register_pipeline_ShadowStage(ns);
    js_register_pipeline_GlobalDSManager(ns);
    js_register_pipeline_RenderFlowInfo(ns);
    js_register_pipeline_PostprocessStage(ns);
    js_register_pipeline_ForwardFlow(ns);
    js_register_pipeline_InstancedBuffer(ns);
    js_register_pipeline_DeferredPipeline(ns);
    js_register_pipeline_MainFlow(ns);
    js_register_pipeline_ShadowFlow(ns);
    return true;
}

