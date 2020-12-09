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
    if (argc == 4) {
        bool ok = true;
        uint32_t passHandle = 0;
        ok &= seval_to_uint32(args[0], &passHandle);
        SE_PRECONDITION2(ok, false, "JSB_getOrCreatePipelineState : Error getting pass handle.");
        auto shader = static_cast<cc::gfx::Shader *>(args[1].toObject()->getPrivateData());
        auto renderPass = static_cast<cc::gfx::RenderPass *>(args[2].toObject()->getPrivateData());
        auto inputAssembler = static_cast<cc::gfx::InputAssembler *>(args[3].toObject()->getPrivateData());
        auto pipelineState = cc::pipeline::PipelineStateManager::getOrCreatePipelineStateByJS(passHandle, shader, inputAssembler, renderPass);
        native_ptr_to_seval<cc::gfx::PipelineState>(pipelineState, &s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(JSB_getOrCreatePipelineState);

bool register_all_pipeline_manual(se::Object *obj) {
    // Get the ns
    se::Value nrVal;
    if (!obj->getProperty("nr", &nrVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nrVal.setObject(jsobj);
        obj->setProperty("nr", nrVal);
    }
    se::Object *nr = nrVal.toObject();

    se::Value psmVal;
    se::HandleObject jsobj(se::Object::createPlainObject());
    psmVal.setObject(jsobj);
    nr->setProperty("PipelineStateManager", psmVal);
    psmVal.toObject()->defineFunction("getOrCreatePipelineState", _SE(JSB_getOrCreatePipelineState));

    __jsb_cc_pipeline_RenderPipeline_proto->defineProperty("macros", _SE(js_pipeline_RenderPipeline_getMacros), nullptr);
    return true;
}
