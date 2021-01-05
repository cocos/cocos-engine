#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/gfx-metal/GFXMTL.h"

extern se::Object* __jsb_cc_gfx_CCMTLDevice_proto;
extern se::Class* __jsb_cc_gfx_CCMTLDevice_class;

bool js_register_cc_gfx_CCMTLDevice(se::Object* obj);
bool register_all_mtl(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::CCMTLDevice);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_CCMTLDevice);

