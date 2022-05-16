// clang-format off
#pragma once

#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/2d/renderer/RenderEntity.h"

bool register_all_2d(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::RenderEntity);


extern se::Object *__jsb_cc_RenderEntity_proto; // NOLINT
extern se::Class * __jsb_cc_RenderEntity_class; // NOLINT

bool js_register_cc_RenderEntity(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_RenderEntity_RenderEntity);
// clang-format on
