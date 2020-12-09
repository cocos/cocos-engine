#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/gfx-gles3/GFXGLES3.h"

extern se::Object* __jsb_cc_gfx_GLES3Device_proto;
extern se::Class* __jsb_cc_gfx_GLES3Device_class;

bool js_register_cc_gfx_GLES3Device(se::Object* obj);
bool register_all_gles3(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::GLES3Device);
SE_DECLARE_FUNC(js_gles3_GLES3Device_checkExtension);
SE_DECLARE_FUNC(js_gles3_GLES3Device_GLES3Device);

