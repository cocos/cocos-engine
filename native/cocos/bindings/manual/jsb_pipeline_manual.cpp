#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_pipeline_auto.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/core/gfx/GFXPipelineState.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/PipelineStateManager.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "renderer/pipeline/RenderView.h"

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

static bool js_pipeline_RenderPipeline_getMacros(se::State &s) {
    cc::pipeline::RenderPipeline *cobj = (cc::pipeline::RenderPipeline *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getMacros : Invalid Native Object.");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        s.rval().setObject(cobj->getMacros().getObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getMacros : Error processing arguments.");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipeline_getMacros)

static bool JSB_getOrCreatePipelineState(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 5) {
        bool ok = true;
        uint32_t passHandle = 0;
        ok &= seval_to_uint32(args[1], &passHandle);
        SE_PRECONDITION2(ok, false, "JSB_getOrCreatePipelineState : Error getting pass handle.");
        auto shader = static_cast<cc::gfx::Shader *>(args[2].toObject()->getPrivateData());
        auto renderPass = static_cast<cc::gfx::RenderPass *>(args[3].toObject()->getPrivateData());
        auto inputAssembler = static_cast<cc::gfx::InputAssembler *>(args[4].toObject()->getPrivateData());
        auto pipelineState = cc::pipeline::PipelineStateManager::getOrCreatePipelineStateByJS(passHandle, shader, inputAssembler, renderPass);
        native_ptr_to_seval<cc::gfx::PipelineState>(pipelineState, &s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(JSB_getOrCreatePipelineState);

static bool JSB_getPhaseID(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 1) {
        bool ok = true;
        if (args[0].isNumber()) {
            uint phase = 0;
            ok &= seval_to_uint(args[0], &phase);
            SE_PRECONDITION2(ok, false, "JSB_getPhaseID : Error getting pass phase.");
            uint32_to_seval(phase, &s.rval());
        }
        if (args[0].isString()) {
            std::string phase;
            ok &= seval_to_std_string(args[0], &phase);
            SE_PRECONDITION2(ok, false, "JSB_getPhaseID : Error getting pass phase.");
            auto phaseID = cc::pipeline::PassPhase::getPhaseID(phase);
            uint32_to_seval(phaseID, &s.rval());
        }
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(JSB_getPhaseID);

bool register_all_pipeline_manual(se::Object *obj) {
    // Get the ns
    se::Value nrVal;
    if (!obj->getProperty("nr", &nrVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nrVal.setObject(jsobj);
        obj->setProperty("nr", nrVal);
    }
    se::Object *nr = nrVal.toObject();

    nr->defineFunction("getPhaseID", _SE(JSB_getPhaseID));

    se::Value psmVal;
    se::HandleObject jsobj(se::Object::createPlainObject());
    psmVal.setObject(jsobj);
    nr->setProperty("PipelineStateManager", psmVal);
    psmVal.toObject()->defineFunction("getOrCreatePipelineState", _SE(JSB_getOrCreatePipelineState));

    js_register_pipeline_RenderViewInfo(nr);

    __jsb_cc_pipeline_RenderPipeline_proto->defineProperty("macros", _SE(js_pipeline_RenderPipeline_getMacros), nullptr);
    return true;
}
