/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_pipeline_auto.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "gfx-base/GFXPipelineState.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/PipelineStateManager.h"
#include "renderer/pipeline/RenderPipeline.h"

static bool JSB_getOrCreatePipelineState(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc == 4) {
        auto *pass           = static_cast<cc::scene::Pass *>(args[0].toObject()->getPrivateData());
        auto *shader         = static_cast<cc::gfx::Shader *>(args[1].toObject()->getPrivateData());
        auto *renderPass     = static_cast<cc::gfx::RenderPass *>(args[2].toObject()->getPrivateData());
        auto *inputAssembler = static_cast<cc::gfx::InputAssembler *>(args[3].toObject()->getPrivateData());
        auto *pipelineState  = cc::pipeline::PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass);
        native_ptr_to_seval<cc::gfx::PipelineState>(pipelineState, &s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(JSB_getOrCreatePipelineState);

static bool js_pipeline_GeometryRenderer_flushFromJSB(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::pipeline::GeometryRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_pipeline_GeometryRenderer_flushFromJSB : Invalid Native Object");
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc == 4) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<unsigned int, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        uint8_t *        arg2       = nullptr;
        CC_UNUSED size_t dataLength = 0;
        se::Object *     obj        = args[2].toObject();
        if (obj->isArrayBuffer()) {
            ok &= obj->getArrayBufferData(&arg2, &dataLength);
            SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
        } else if (obj->isTypedArray()) {
            ok &= obj->getTypedArrayData(&arg2, &dataLength);
            SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
        } else {
            ok = false;
        }

        SE_PRECONDITION2(ok, false, "js_pipeline_GeometryRenderer_flushFromJSB : Error processing arguments");
        cobj->flushFromJSB(arg0.value(), arg1.value(), arg2, arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_pipeline_GeometryRenderer_flushFromJSB)

bool register_all_pipeline_manual(se::Object *obj) { // NOLINT(readability-identifier-naming)
    // Get the ns
    se::Value nrVal;
    if (!obj->getProperty("nr", &nrVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nrVal.setObject(jsobj);
        obj->setProperty("nr", nrVal);
    }
    se::Object *nr = nrVal.toObject();

    se::Value        psmVal;
    se::HandleObject jsobj(se::Object::createPlainObject());
    psmVal.setObject(jsobj);
    nr->setProperty("PipelineStateManager", psmVal);
    psmVal.toObject()->defineFunction("getOrCreatePipelineState", _SE(JSB_getOrCreatePipelineState));

    __jsb_cc_pipeline_GeometryRenderer_proto->defineFunction("flushFromJSB", _SE(js_pipeline_GeometryRenderer_flushFromJSB));

    return true;
}
