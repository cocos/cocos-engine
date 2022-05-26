// clang-format off
#pragma once

#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/2d/renderer/RenderEntity.h"
#include "cocos/2d/renderer/Batcher2d.h"
#include "cocos/2d/renderer/AdvanceRenderData.h"

bool register_all_2d(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::AdvanceRenderData);
JSB_REGISTER_OBJECT_TYPE(cc::RenderEntity);
JSB_REGISTER_OBJECT_TYPE(cc::Batcher2d);


extern se::Object *__jsb_cc_AdvanceRenderData_proto; // NOLINT
extern se::Class * __jsb_cc_AdvanceRenderData_class; // NOLINT

bool js_register_cc_AdvanceRenderData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_AdvanceRenderData_ParseRender2dData);
SE_DECLARE_FUNC(js_2d_AdvanceRenderData_AdvanceRenderData);

extern se::Object *__jsb_cc_RenderEntity_proto; // NOLINT
extern se::Class * __jsb_cc_RenderEntity_class; // NOLINT

bool js_register_cc_RenderEntity(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_RenderEntity_ItIsDebugFuncInRenderEntity);
SE_DECLARE_FUNC(js_2d_RenderEntity_getDataArr);
SE_DECLARE_FUNC(js_2d_RenderEntity_setAdvanceRenderDataArr);
SE_DECLARE_FUNC(js_2d_RenderEntity_RenderEntity);

extern se::Object *__jsb_cc_Batcher2d_proto; // NOLINT
extern se::Class * __jsb_cc_Batcher2d_class; // NOLINT

bool js_register_cc_Batcher2d(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_Batcher2d_ItIsDebugFuncInBatcher2d);
SE_DECLARE_FUNC(js_2d_Batcher2d_updateRenderEntities);
SE_DECLARE_FUNC(js_2d_Batcher2d_Batcher2d);
// clang-format on
