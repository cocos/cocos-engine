#pragma once
#include "base/Config.h"

#include "cocos/bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cc_gfx_GLES3Device_proto;
extern se::Class* __jsb_cc_gfx_GLES3Device_class;

bool js_register_cc_gfx_GLES3Device(se::Object* obj);
bool register_all_gles3(se::Object* obj);
SE_DECLARE_FUNC(js_gles3_GLES3Device_checkExtension);
SE_DECLARE_FUNC(js_gles3_GLES3Device_GLES3Device);

