#pragma once
#include "base/ccConfig.h"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cc_gfx_CCMTLDevice_proto;
extern se::Class* __jsb_cc_gfx_CCMTLDevice_class;

bool js_register_cc_gfx_CCMTLDevice(se::Object* obj);
bool register_all_mtl(se::Object* obj);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_getMaximumBufferBindingIndex);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_getMTLDevice);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_getMTKView);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_getMaximumSamplerUnits);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_getMaximumColorRenderTargets);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_isIndirectCommandBufferSupported);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_blitBuffer);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_CCMTLDevice);

