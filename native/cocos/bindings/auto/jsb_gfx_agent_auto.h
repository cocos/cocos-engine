#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "D:\workspace\editor-3d-2\resources\3d\cocos2d-x-lite/cocos/renderer/core/Core.h"
#include "D:\workspace\editor-3d-2\resources\3d\cocos2d-x-lite/cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/renderer/core/gfx-agent/GFXDeviceAgent.h"

extern se::Object* __jsb_cc_gfx_DeviceAgent_proto;
extern se::Class* __jsb_cc_gfx_DeviceAgent_class;

bool js_register_cc_gfx_DeviceAgent(se::Object* obj);
bool register_all_gfx_agent(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::DeviceAgent);
SE_DECLARE_FUNC(js_gfx_agent_DeviceAgent_DeviceAgent);

