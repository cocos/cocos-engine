#pragma once
#include "base/Config.h"
#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cc_pipeline_RenderPipeline_proto;
extern se::Class* __jsb_cc_pipeline_RenderPipeline_class;

bool js_register_cc_pipeline_RenderPipeline(se::Object* obj);
bool register_all_pipeline(se::Object* obj);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_activate);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_render);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_initialize);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_destroy);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getInstance);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_RenderPipeline);

extern se::Object* __jsb_cc_pipeline_ForwardPipeline_proto;
extern se::Class* __jsb_cc_pipeline_ForwardPipeline_class;

bool js_register_cc_pipeline_ForwardPipeline(se::Object* obj);
bool register_all_pipeline(se::Object* obj);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_init);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_ForwardPipeline);

#endif //#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
