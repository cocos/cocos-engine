// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"

bool register_all_render(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::render::Setter);
JSB_REGISTER_OBJECT_TYPE(cc::render::RasterQueue);
JSB_REGISTER_OBJECT_TYPE(cc::render::RasterPass);
JSB_REGISTER_OBJECT_TYPE(cc::render::ComputeQueue);
JSB_REGISTER_OBJECT_TYPE(cc::render::ComputePass);
JSB_REGISTER_OBJECT_TYPE(cc::render::MovePass);
JSB_REGISTER_OBJECT_TYPE(cc::render::CopyPass);
JSB_REGISTER_OBJECT_TYPE(cc::render::Pipeline);


extern se::Object *__jsb_cc_render_Setter_proto; // NOLINT
extern se::Class * __jsb_cc_render_Setter_class; // NOLINT

bool js_register_cc_render_Setter(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_Setter_setBuffer);
SE_DECLARE_FUNC(js_render_Setter_setColor);
SE_DECLARE_FUNC(js_render_Setter_setFloat);
SE_DECLARE_FUNC(js_render_Setter_setMat4);
SE_DECLARE_FUNC(js_render_Setter_setQuaternion);
SE_DECLARE_FUNC(js_render_Setter_setReadWriteBuffer);
SE_DECLARE_FUNC(js_render_Setter_setReadWriteTexture);
SE_DECLARE_FUNC(js_render_Setter_setSampler);
SE_DECLARE_FUNC(js_render_Setter_setTexture);
SE_DECLARE_FUNC(js_render_Setter_setVec2);
SE_DECLARE_FUNC(js_render_Setter_setVec4);

extern se::Object *__jsb_cc_render_RasterQueue_proto; // NOLINT
extern se::Class * __jsb_cc_render_RasterQueue_class; // NOLINT

bool js_register_cc_render_RasterQueue(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_RasterQueue_addFullscreenQuad);
SE_DECLARE_FUNC(js_render_RasterQueue_addScene);
SE_DECLARE_FUNC(js_render_RasterQueue_addSceneOfCamera);

extern se::Object *__jsb_cc_render_RasterPass_proto; // NOLINT
extern se::Class * __jsb_cc_render_RasterPass_class; // NOLINT

bool js_register_cc_render_RasterPass(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_RasterPass_addComputeView);
SE_DECLARE_FUNC(js_render_RasterPass_addFullscreenQuad);
SE_DECLARE_FUNC(js_render_RasterPass_addQueue);
SE_DECLARE_FUNC(js_render_RasterPass_addRasterView);

extern se::Object *__jsb_cc_render_ComputeQueue_proto; // NOLINT
extern se::Class * __jsb_cc_render_ComputeQueue_class; // NOLINT

bool js_register_cc_render_ComputeQueue(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_ComputeQueue_addDispatch);

extern se::Object *__jsb_cc_render_ComputePass_proto; // NOLINT
extern se::Class * __jsb_cc_render_ComputePass_class; // NOLINT

bool js_register_cc_render_ComputePass(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_ComputePass_addComputeView);
SE_DECLARE_FUNC(js_render_ComputePass_addDispatch);
SE_DECLARE_FUNC(js_render_ComputePass_addQueue);

extern se::Object *__jsb_cc_render_MovePass_proto; // NOLINT
extern se::Class * __jsb_cc_render_MovePass_class; // NOLINT

bool js_register_cc_render_MovePass(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_MovePass_addPair);

extern se::Object *__jsb_cc_render_CopyPass_proto; // NOLINT
extern se::Class * __jsb_cc_render_CopyPass_class; // NOLINT

bool js_register_cc_render_CopyPass(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_CopyPass_addPair);

extern se::Object *__jsb_cc_render_Pipeline_proto; // NOLINT
extern se::Class * __jsb_cc_render_Pipeline_class; // NOLINT

bool js_register_cc_render_Pipeline(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_Pipeline_addComputePass);
SE_DECLARE_FUNC(js_render_Pipeline_addCopyPass);
SE_DECLARE_FUNC(js_render_Pipeline_addDepthStencil);
SE_DECLARE_FUNC(js_render_Pipeline_addMovePass);
SE_DECLARE_FUNC(js_render_Pipeline_addRasterPass);
SE_DECLARE_FUNC(js_render_Pipeline_addRenderTarget);
SE_DECLARE_FUNC(js_render_Pipeline_addRenderTexture);
SE_DECLARE_FUNC(js_render_Pipeline_beginFrame);
SE_DECLARE_FUNC(js_render_Pipeline_endFrame);
    // clang-format on