#pragma once
#include "base/ccConfig.h"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cc_gfx_CCVKDevice_proto;
extern se::Class* __jsb_cc_gfx_CCVKDevice_class;

bool js_register_cc_gfx_CCVKDevice(se::Object* obj);
bool register_all_vk(se::Object* obj);
SE_DECLARE_FUNC(js_vk_CCVKDevice_checkExtension);
SE_DECLARE_FUNC(js_vk_CCVKDevice_CCVKDevice);

