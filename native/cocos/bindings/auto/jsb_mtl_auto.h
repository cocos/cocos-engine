#pragma once
#include "base/Config.h"

#include "cocos/bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cc_gfx_CCMTLDevice_proto;
extern se::Class* __jsb_cc_gfx_CCMTLDevice_class;

bool js_register_cc_gfx_CCMTLDevice(se::Object* obj);
bool register_all_mtl(se::Object* obj);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_CCMTLDevice);

