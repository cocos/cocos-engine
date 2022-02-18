// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"

bool register_all_render(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::render::Setter);
JSB_REGISTER_OBJECT_TYPE(cc::render::RasterQueueBuilder);
JSB_REGISTER_OBJECT_TYPE(cc::render::RasterPassBuilder);
JSB_REGISTER_OBJECT_TYPE(cc::render::ComputeQueueBuilder);
JSB_REGISTER_OBJECT_TYPE(cc::render::ComputePassBuilder);
JSB_REGISTER_OBJECT_TYPE(cc::render::MovePassBuilder);
JSB_REGISTER_OBJECT_TYPE(cc::render::CopyPassBuilder);
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

extern se::Object *__jsb_cc_render_RasterQueueBuilder_proto; // NOLINT
extern se::Class * __jsb_cc_render_RasterQueueBuilder_class; // NOLINT

bool js_register_cc_render_RasterQueueBuilder(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_RasterQueueBuilder_addFullscreenQuad);
SE_DECLARE_FUNC(js_render_RasterQueueBuilder_addScene);
SE_DECLARE_FUNC(js_render_RasterQueueBuilder_addSceneOfCamera);

extern se::Object *__jsb_cc_render_RasterPassBuilder_proto; // NOLINT
extern se::Class * __jsb_cc_render_RasterPassBuilder_class; // NOLINT

bool js_register_cc_render_RasterPassBuilder(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_RasterPassBuilder_addComputeView);
SE_DECLARE_FUNC(js_render_RasterPassBuilder_addFullscreenQuad);
SE_DECLARE_FUNC(js_render_RasterPassBuilder_addQueue);
SE_DECLARE_FUNC(js_render_RasterPassBuilder_addRasterView);

extern se::Object *__jsb_cc_render_ComputeQueueBuilder_proto; // NOLINT
extern se::Class * __jsb_cc_render_ComputeQueueBuilder_class; // NOLINT

bool js_register_cc_render_ComputeQueueBuilder(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_ComputeQueueBuilder_addDispatch);

extern se::Object *__jsb_cc_render_ComputePassBuilder_proto; // NOLINT
extern se::Class * __jsb_cc_render_ComputePassBuilder_class; // NOLINT

bool js_register_cc_render_ComputePassBuilder(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_ComputePassBuilder_addComputeView);
SE_DECLARE_FUNC(js_render_ComputePassBuilder_addDispatch);
SE_DECLARE_FUNC(js_render_ComputePassBuilder_addQueue);

extern se::Object *__jsb_cc_render_MovePassBuilder_proto; // NOLINT
extern se::Class * __jsb_cc_render_MovePassBuilder_class; // NOLINT

bool js_register_cc_render_MovePassBuilder(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_MovePassBuilder_addPair);

extern se::Object *__jsb_cc_render_CopyPassBuilder_proto; // NOLINT
extern se::Class * __jsb_cc_render_CopyPassBuilder_class; // NOLINT

bool js_register_cc_render_CopyPassBuilder(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_CopyPassBuilder_addPair);

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