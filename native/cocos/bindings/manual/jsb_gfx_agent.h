#pragma once
#include "base/Config.h"
#include <type_traits>
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "renderer/core/Core.h"
#include "bindings/auto/jsb_gfx_auto.h"
#include "renderer/core/gfx-agent/GFXDeviceAgent.h"

extern se::Object* __jsb_cc_gfx_DeviceAgent_proto;
extern se::Class* __jsb_cc_gfx_DeviceAgent_class;

bool js_register_cc_gfx_DeviceAgent(se::Object* obj);
bool register_all_gfx_agent(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::DeviceAgent);
SE_DECLARE_FUNC(js_gfx_agent_DeviceAgent_DeviceAgent);

