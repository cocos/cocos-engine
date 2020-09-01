#include "jsb_gfx_manual.h"
#include "scripting/js-bindings/auto/jsb_pipeline_auto.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "scripting/js-bindings/manual/jsb_conversions.h"
#include "scripting/js-bindings/manual/jsb_global.h"

#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/RenderFlow.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "renderer/pipeline/RenderStage.h"
#include "renderer/pipeline/RenderView.h"
#include "renderer/pipeline/forward/ForwardFlow.h"
#include "renderer/pipeline/forward/ForwardPipeline.h"
#include "renderer/pipeline/forward/ForwardStage.h"
#include "renderer/pipeline/shadow/ShadowFlow.h"
#include "renderer/pipeline/shadow/ShadowStage.h"
#include "renderer/pipeline/ui/UIFlow.h"
#include "renderer/pipeline/ui/UIStage.h"
#include "scripting/js-bindings/manual/jsb_conversions.h"
#include "scripting/js-bindings/manual/jsb_global.h"

se::Object *__jsb_cc_pipeline_RenderViewInfo_proto = nullptr;
se::Class *__jsb_cc_pipeline_RenderViewInfo_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cc_pipeline_RenderViewInfo_finalize)

static bool js_pipeline_RenderViewInfo_constructor(se::State &s) {
    CC_UNUSED bool ok = true;
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 0) {
        cc::pipeline::RenderViewInfo *cobj = JSB_ALLOC(cc::pipeline::RenderViewInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    } else if (argc == 1 && args[0].isObject()) {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::pipeline::RenderViewInfo *cobj = JSB_ALLOC(cc::pipeline::RenderViewInfo);
        unsigned int arg0 = 0;
        json->getProperty("cameraID", &field);
        if (!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t *)&arg0);
            cobj->cameraID = arg0;
        }
        cc::String arg1;
        json->getProperty("name", &field);
        if (!field.isUndefined()) {
            arg1 = field.toStringForce().c_str();
            cobj->name = arg1;
        }
        unsigned int arg2 = 0;
        json->getProperty("priority", &field);
        if (!field.isUndefined()) {
            ok &= seval_to_uint32(field, (uint32_t *)&arg2);
            cobj->priority = arg2;
        }
        std::vector<std::string> arg3;
        json->getProperty("flows", &field);
        if (!field.isUndefined()) {
            ok &= seval_to_std_vector_string(field, &arg3);
            cobj->flows = arg3;
        }

        if (!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    } else if (argc == 4) {
        cc::pipeline::RenderViewInfo *cobj = JSB_ALLOC(cc::pipeline::RenderViewInfo);
        unsigned int arg0 = 0;
        if (!args[0].isUndefined()) {
            ok &= seval_to_uint32(args[0], (uint32_t *)&arg0);
            cobj->cameraID = arg0;
        }
        cc::String arg1;
        if (!args[1].isUndefined()) {
            arg1 = args[1].toStringForce().c_str();
            cobj->name = arg1;
        }
        unsigned int arg2 = 0;
        if (!args[2].isUndefined()) {
            ok &= seval_to_uint32(args[2], (uint32_t *)&arg2);
            cobj->priority = arg2;
        }
        std::vector<std::string> arg3;
        if (!args[3].isUndefined()) {
            ok &= seval_to_std_vector_string(args[3], &arg3);
            cobj->flows = arg3;
        }

        if (!ok) {
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

static bool js_cc_pipeline_RenderViewInfo_finalize(se::State &s) {
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end()) {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::pipeline::RenderViewInfo *cobj = (cc::pipeline::RenderViewInfo *)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_pipeline_RenderViewInfo_finalize)

bool js_register_pipeline_RenderViewInfo(se::Object *obj) {
    auto cls = se::Class::create("RenderViewInfo", obj, nullptr, _SE(js_pipeline_RenderViewInfo_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_pipeline_RenderViewInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::pipeline::RenderViewInfo>(cls);

    __jsb_cc_pipeline_RenderViewInfo_proto = cls->getProto();
    __jsb_cc_pipeline_RenderViewInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

static bool js_pipeline_RenderPipeline_getMacros(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = (cc::pipeline::RenderPipeline*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getMacros : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::ValueMap& result = cobj->getMacros();
        ok &= ccvaluemap_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getMacros : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipeline_getMacros)

static bool js_pipeline_RenderPipeline_setMacros(se::State& s)
{
    cc::pipeline::RenderPipeline* cobj = (cc::pipeline::RenderPipeline*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_setMacros : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::ValueMap arg0;
        std::string arg1;
        ok &= seval_to_ccvaluemap(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_setMacros : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_PROP_SET(js_pipeline_RenderPipeline_setMacros)

static bool js_pipeline_RenderView_setEnabled(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_setEnabled : Error processing arguments");
        cobj->setEnable(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_pipeline_RenderView_setEnabled)

static bool js_pipeline_RenderView_IsEnabled(se::State& s)
{
    cc::pipeline::RenderView* cobj = (cc::pipeline::RenderView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderView_getIsEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderView_getIsEnable : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderView_IsEnabled)

bool register_all_pipeline_manual(se::Object *obj) {
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("nr", &nsVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("nr", nsVal);
    }
    se::Object *ns = nsVal.toObject();

    js_register_pipeline_RenderViewInfo(ns);

    __jsb_cc_pipeline_RenderPipeline_proto->defineProperty("macros", _SE(js_pipeline_RenderPipeline_getMacros), _SE(js_pipeline_RenderPipeline_setMacros));
    __jsb_cc_pipeline_RenderView_proto->defineFunction("enable", _SE(js_pipeline_RenderView_setEnabled));
    __jsb_cc_pipeline_RenderView_proto->defineProperty("isEnable", _SE(js_pipeline_RenderView_IsEnabled), nullptr);
    return true;
}
