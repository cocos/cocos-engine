#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/gfx-vulkan/GFXVulkan.h"

extern se::Object* __jsb_cc_gfx_CCVKDevice_proto;
extern se::Class* __jsb_cc_gfx_CCVKDevice_class;

bool js_register_cc_gfx_CCVKDevice(se::Object* obj);
bool register_all_vk(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::CCVKDevice);
SE_DECLARE_FUNC(js_vk_CCVKDevice_checkExtension);
SE_DECLARE_FUNC(js_vk_CCVKDevice_CCVKDevice);

