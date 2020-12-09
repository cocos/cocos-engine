#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/gfx-gles2/GFXGLES2.h"

extern se::Object* __jsb_cc_gfx_GLES2Device_proto;
extern se::Class* __jsb_cc_gfx_GLES2Device_class;

bool js_register_cc_gfx_GLES2Device(se::Object* obj);
bool register_all_gles2(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::GLES2Device);
SE_DECLARE_FUNC(js_gles2_GLES2Device_checkExtension);
SE_DECLARE_FUNC(js_gles2_GLES2Device_checkForETC2);
SE_DECLARE_FUNC(js_gles2_GLES2Device_GLES2Device);

