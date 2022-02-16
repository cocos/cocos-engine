// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"

bool register_all_render(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::render::Setter);
JSB_REGISTER_OBJECT_TYPE(cc::render::RasterPass);
JSB_REGISTER_OBJECT_TYPE(cc::render::Pipeline);


extern se::Object *__jsb_cc_render_Setter_proto; // NOLINT
extern se::Class * __jsb_cc_render_Setter_class; // NOLINT

bool js_register_cc_render_Setter(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_Setter_setCBuffer);
SE_DECLARE_FUNC(js_render_Setter_setMat4);

extern se::Object *__jsb_cc_render_RasterPass_proto; // NOLINT
extern se::Class * __jsb_cc_render_RasterPass_class; // NOLINT

bool js_register_cc_render_RasterPass(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_RasterPass_addRasterView);

extern se::Object *__jsb_cc_render_Pipeline_proto; // NOLINT
extern se::Class * __jsb_cc_render_Pipeline_class; // NOLINT

bool js_register_cc_render_Pipeline(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_render_Pipeline_addRenderTexture);
    // clang-format on